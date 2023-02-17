/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import { Result } from "@sapphire/result";
import { CommandContext } from "../Lib/CommandContext";
import { Command } from "../Stores/Command";
import { Precondition } from "../Stores/Precondition";
import { UserError } from "../Utilities/Errors/UserError";
import { PermissionsBitField } from "@nezuchan/core";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { inlineCode } from "@discordjs/builders";

export class ClientPermissions extends Precondition {
    public async contextRun(ctx: CommandContext, command: Command, context: { permissions: PermissionsBitField }): Promise<Result<unknown, UserError>> {
        const guildId = ctx.isMessage() ? ctx.message.guildId : ctx.interaction.guildId;
        if (guildId) {
            const client = await this.container.client.users.fetchMe({ cache: true });
            const voiceState = await this.container.client.voiceStates.cache.get(`${guildId}:${client.id}`);
            const channelId = context.permissions.has(new PermissionsBitField(PermissionFlagsBits, [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.ViewChannel])) && voiceState?.channelId
                ? voiceState.channelId
                : ctx.isMessage() ? ctx.message.channelId : ctx.interaction.channelId;
            if (channelId && guildId) {
                const channel = await this.container.client.channels.cache.get(channelId);
                const member = await this.container.client.members.cache.get(`${guildId}:${client.id}`);
                if (channel && member) {
                    const permissions = await channel.permissionsForMember(member);
                    const missing = permissions.missing(context.permissions);
                    if (missing.length > 0) {
                        return this.error({ message: `I dont have permissions: ${missing.map(x => inlineCode(String(x))).join(", ")}` });
                    }
                }
            }
        }

        return this.error({ message: `I dont have permissions: ${context.permissions.toArray().map(x => inlineCode(String(x))).join(", ")}` });
    }
}
