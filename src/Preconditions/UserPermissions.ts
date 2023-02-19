/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { Result } from "@sapphire/result";
import { CommandContext } from "../Lib/CommandContext";
import { Command } from "../Stores/Command";
import { Precondition } from "../Stores/Precondition";
import { UserError } from "../Utilities/Errors/UserError";
import { BaseInteraction, PermissionsBitField } from "@nezuchan/core";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { inlineCode } from "@discordjs/builders";
import { ArgumentStream, Lexer, Parser } from "@sapphire/lexure";
import { FlagUnorderedStrategy } from "../Lib/FlagUnorderedStrategy";
import { InteractionHandler } from "../Stores/InteractionHandler";

export class UserPermissions extends Precondition {
    public async contextRun(ctx: CommandContext, command: Command, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        const guildId = ctx.isMessage() ? ctx.message.guildId : ctx.interaction.guildId;
        const user = ctx.isMessage() ? ctx.message.author : await ctx.interaction.member?.resolveUser();
        if (guildId) {
            if (user && context.permissions.any(new PermissionsBitField(PermissionFlagsBits, [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel]))) {
                const voiceState = await this.container.client.voiceStates.cache.get(`${guildId}:${user.id}`);
                if (voiceState?.channelId) {
                    const channel = await this.container.client.channels.cache.get(`${guildId}:${voiceState.channelId}`);
                    const member = await this.container.client.members.cache.get(`${guildId}:${user.id}`);
                    if (channel && member) {
                        const permissions = (await channel.permissionsForMember(member)).remove(context.permissions.toArray().filter(x => !["Connect", "Speak", "ViewChannel"].includes(x)).map(x => PermissionFlagsBits[x as keyof typeof PermissionFlagsBits]));
                        const missing = permissions.missing(permissions);
                        if (missing.length > 0) {
                            return this.error({ message: `I dont have permissions: ${missing.map(x => inlineCode(String(x))).join(", ")}` });
                        }
                    }
                }
            }

            const channelId = ctx.isMessage() ? ctx.message.channelId : ctx.interaction.channelId;
            if (user && channelId) {
                const channel = await this.container.client.channels.cache.get(`${guildId}:${channelId}`);
                const member = await this.container.client.members.cache.get(`${guildId}:${user.id}`);
                if (channel && member) {
                    const permissions = (await channel.permissionsForMember(member)).remove(context.permissions.toArray().filter(x => ["Connect", "Speak"].includes(x)).map(x => PermissionFlagsBits[x as keyof typeof PermissionFlagsBits]));
                    const missing = permissions.missing(context.permissions);
                    if (missing.length > 0) {
                        return this.error({ message: `I dont have permissions: ${missing.map(x => inlineCode(String(x))).join(", ")}` });
                    }
                }
            }
        }

        return this.error({ message: `I dont have permissions: ${context.permissions.toArray().map(x => inlineCode(String(x))).join(", ")}` });
    }

    public interactionHandlerRun(interaction: BaseInteraction, handler: InteractionHandler, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        const parser = new Parser(new FlagUnorderedStrategy());
        const stream = new ArgumentStream(parser.run(new Lexer().run("")));
        const ctx = new CommandContext(interaction, stream);

        return this.contextRun(ctx, handler as unknown as Command, context);
    }
}
