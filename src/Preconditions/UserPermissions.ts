/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { Result } from "@sapphire/result";
import { CommandContext } from "../Lib/CommandContext.js";
import { Command } from "../Stores/Command.js";
import { Precondition } from "../Stores/Precondition.js";
import { UserError } from "../Utilities/Errors/UserError.js";
import { BaseInteraction, Message, PermissionsBitField } from "@nezuchan/core";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { inlineCode } from "@discordjs/builders";
import { InteractionHandler } from "../Stores/InteractionHandler.js";

export class UserPermissions extends Precondition {
    public async contextRun(ctx: CommandContext, command: Command, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        const guildId = ctx.isMessage() ? ctx.message.guildId : ctx.interaction.guildId;
        const user = ctx.isMessage() ? ctx.message.author : await ctx.interaction.member?.resolveUser({ force: true });
        const channelId = ctx.isMessage() ? ctx.message.channelId : ctx.interaction.channelId;
        return this.parseConditions(guildId, channelId, user, context);
    }

    public async interactionHandlerRun(interaction: BaseInteraction, handler: InteractionHandler, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        return this.parseConditions(interaction.guildId, interaction.channelId, await interaction.member?.resolveUser({ force: true }), context);
    }

    public async interactionRun(interaction: BaseInteraction, command: Command, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        return this.parseConditions(interaction.guildId, interaction.channelId, await interaction.member?.resolveUser({ force: true }), context);
    }

    public messageRun(message: Message, command: Command, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        return this.parseConditions(message.guildId, message.channelId, message.author, context);
    }

    public async parseConditions(guildId: string | undefined, channelId: string | null, user: { id: string } | null | undefined, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        if (guildId) {
            if (user && context.permissions.any(new PermissionsBitField(PermissionFlagsBits, [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel]))) {
                const voiceState = await this.container.client.resolveVoiceState({ id: user.id, guildId });
                if (voiceState?.channelId) {
                    const channel = await this.container.client.resolveChannel({ id: voiceState.channelId, guildId });
                    const member = await this.container.client.resolveMember({ id: user.id, guildId });
                    if (channel && member) {
                        const permissions = (await channel.permissionsForMember(member)).remove(context.permissions.toArray().filter(x => !["Connect", "Speak", "ViewChannel"].includes(x)).map(x => PermissionFlagsBits[x as keyof typeof PermissionFlagsBits]));
                        const missing = permissions.missing(permissions);
                        if (missing.length > 0) {
                            return this.error({ message: `I dont have permissions: ${missing.map(x => inlineCode(String(x))).join(", ")}` });
                        }

                        return this.ok();
                    }
                }
            }

            if (user && channelId) {
                const channel = await this.container.client.resolveChannel({ id: channelId, guildId });
                const member = await this.container.client.resolveMember({ id: user.id, guildId });
                if (channel && member) {
                    const permissions = (await channel.permissionsForMember(member)).remove(context.permissions.toArray().filter(x => ["Connect", "Speak"].includes(x)).map(x => PermissionFlagsBits[x as keyof typeof PermissionFlagsBits]));
                    const missing = permissions.missing(context.permissions);
                    if (missing.length > 0) {
                        return this.error({ message: `I dont have permissions: ${missing.map(x => inlineCode(String(x))).join(", ")}` });
                    }

                    return this.ok();
                }
            }
        }

        return this.error({ message: `I dont have permissions: ${context.permissions.toArray().map(x => inlineCode(String(x))).join(", ")}` });
    }
}
