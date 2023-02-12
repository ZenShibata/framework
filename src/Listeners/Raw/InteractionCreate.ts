import { PieceContext } from "@sapphire/pieces";
import { Listener } from "../../Stores/Listener";
import { ApplicationCommandType, GatewayDispatchEvents, GatewayInteractionCreateDispatch, InteractionType } from "discord-api-types/v10";
import { CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction, AutoCompleteInteraction, MessageComponentInteraction, BaseInteraction } from "@nezuchan/core";
import { Events } from "../../Utilities/EventEnums";

export class InteractionCreate extends Listener {
    public constructor(context: PieceContext) {
        super(context, {
            event: GatewayDispatchEvents.InteractionCreate,
            emitter: "amqp"
        });
    }

    public run(payload: { data: { data: GatewayInteractionCreateDispatch } }): void {
        switch (payload.data.data.d.type) {
            case InteractionType.ApplicationCommand:
                switch (payload.data.data.d.data.type) {
                    case ApplicationCommandType.ChatInput: {
                        this.container.client.emit(Events.InteractionCreate, new CommandInteraction(payload.data.data.d, this.container.client));
                        break;
                    }
                    case ApplicationCommandType.Message: {
                        this.container.client.emit(Events.InteractionCreate, new MessageContextMenuInteraction(payload.data.data.d, this.container.client));
                        break;
                    }
                    case ApplicationCommandType.User: {
                        this.container.client.emit(Events.InteractionCreate, new UserContextMenuInteraction(payload.data.data.d, this.container.client));
                        break;
                    }
                }
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                this.container.client.emit(Events.InteractionCreate, new AutoCompleteInteraction(payload.data.data.d, this.container.client));
                break;
            case InteractionType.MessageComponent:
                this.container.client.emit(Events.InteractionCreate, new MessageComponentInteraction(payload.data.data.d, this.container.client));
                break;
            default:
                this.container.client.emit(Events.InteractionCreate, new BaseInteraction(payload.data.data.d, this.container.client));
                break;
        }
    }
}
