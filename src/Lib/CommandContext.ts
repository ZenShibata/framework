import { BaseInteraction, Message } from "@nezuchan/core";
import { ArgumentStream } from "@sapphire/lexure";
import { APIInteractionResponseCallbackData, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";

export class CommandContext {
    public constructor(private readonly context: BaseInteraction | Message, public messageArgs: ArgumentStream) { }

    public get message(): Message {
        return this.context as Message;
    }

    public get interaction(): BaseInteraction {
        return this.context as BaseInteraction;
    }

    public isInteraction(): boolean {
        return this.context instanceof BaseInteraction;
    }

    public isMessage(): boolean {
        return this.context instanceof Message;
    }

    public send(options: APIInteractionResponseCallbackData | RESTPostAPIChannelMessageJSONBody): Promise<BaseInteraction> | Promise<Message> {
        if (this.isInteraction()) {
            if (this.interaction.isCommandInteraction() && (this.interaction.isContextMenuInteraction() || this.interaction.isCommandInteraction())) {
                if (this.interaction.deferred && !this.interaction.replied) {
                    return this.interaction.editReply(options);
                }

                if (this.interaction.replied) {
                    return this.interaction.followUp(options);
                }
            }

            return this.interaction.reply(options);
        }
        return this.message.client.sendMessage(options, this.message.channelId!);
    }
}
