import { PieceContext } from "@sapphire/pieces";
import { Listener } from "../../Stores/Listener.js";
import { GatewayDispatchEvents, GatewayMessageCreateDispatch } from "discord-api-types/v10";
import { Message } from "@nezuchan/core";
import { Events } from "../../Utilities/EventEnums.js";

export class InteractionCreate extends Listener {
    public constructor(context: PieceContext) {
        super(context, {
            name: GatewayDispatchEvents.MessageCreate,
            emitter: "amqp"
        });
    }

    public run(payload: { data: { data: GatewayMessageCreateDispatch } }): void {
        const message = new Message(payload.data.data.d, this.container.client);
        this.container.client.emit(Events.MessageCreate, message);
    }
}
