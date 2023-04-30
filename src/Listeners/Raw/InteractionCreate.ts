import { PieceContext } from "@sapphire/pieces";
import { Listener } from "../../Stores/Listener.js";
import { ApplicationCommandType, GatewayDispatchEvents, GatewayInteractionCreateDispatch, InteractionType } from "discord-api-types/v10";
import { CommandInteraction, MessageContextMenuInteraction, UserContextMenuInteraction, AutoCompleteInteraction, MessageComponentInteraction, BaseInteraction, ModalSubmitInteraction } from "@nezuchan/core";
import { Events } from "../../Utilities/EventEnums.js";

export class InteractionCreate extends Listener {
    public constructor(context: PieceContext) {
        super(context, {
            name: GatewayDispatchEvents.InteractionCreate
        });
    }

    public run(payload: GatewayInteractionCreateDispatch): void {
        switch (payload.d.type) {
            case InteractionType.ApplicationCommand:
                switch (payload.d.data.type) {
                    case ApplicationCommandType.ChatInput: {
                        this.container.client.emit(Events.InteractionCreate, new CommandInteraction(payload.d, this.container.client));
                        break;
                    }
                    case ApplicationCommandType.Message: {
                        this.container.client.emit(Events.InteractionCreate, new MessageContextMenuInteraction(payload.d, this.container.client));
                        break;
                    }
                    case ApplicationCommandType.User: {
                        this.container.client.emit(Events.InteractionCreate, new UserContextMenuInteraction(payload.d, this.container.client));
                        break;
                    }
                }
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                this.container.client.emit(Events.InteractionCreate, new AutoCompleteInteraction(payload.d, this.container.client));
                break;
            case InteractionType.MessageComponent:
                this.container.client.emit(Events.InteractionCreate, new MessageComponentInteraction(payload.d, this.container.client));
                break;
            case InteractionType.ModalSubmit:
                this.container.client.emit(Events.InteractionCreate, new ModalSubmitInteraction(payload.d, this.container.client));
                break;
            default:
                this.container.client.emit(Events.InteractionCreate, new BaseInteraction(payload.d, this.container.client));
                break;
        }
    }
}
