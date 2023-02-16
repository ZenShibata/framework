import { CommandInteraction } from "@nezuchan/core";
import { Listener } from "../../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../../Utilities/EventEnums";
import { Command } from "../../../Stores/Command";

export class PreChatInputCommandRun extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            event: Events.PreChatInputCommandRun
        });
    }

    public run(payload: { command: Command; interaction: CommandInteraction }): void {
        // TODO: Preconditions.
        this.container.client.emit(Events.ChatInputCommandAccepted, payload);
    }
}
