import { BaseContextMenuInteraction } from "@nezuchan/core";
import { Listener } from "../../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../../Utilities/EventEnums";
import { Command } from "../../../Stores/Command";

export class PreContextMenuCommandRun extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            event: Events.PreContextMenuCommandRun
        });
    }

    public run(payload: { command: Command; interaction: BaseContextMenuInteraction }): void {
        // TODO: Preconditions.
        this.container.client.emit(Events.ContextMenuCommandAccepted, payload);
    }
}
