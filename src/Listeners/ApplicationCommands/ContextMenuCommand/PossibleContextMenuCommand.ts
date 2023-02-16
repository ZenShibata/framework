import { BaseContextMenuInteraction } from "@nezuchan/core";
import { Listener } from "../../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../../Utilities/EventEnums";

export class PossibleContextMenuCommand extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            event: Events.PossibleContextMenuCommand
        });
    }

    public run(interaction: BaseContextMenuInteraction): void {
        const commandStore = this.container.stores.get("commands");
        if (!interaction.commandName) return;

        const command = commandStore.get(interaction.commandName);

        if (command?.contextMenuRun) {
            this.container.client.emit(
                Events.PreContextCommandRun, {
                    command,
                    interaction,
                    context: { commandId: interaction.id, commandName: interaction.commandName }
                }
            );
        }

        if (command?.contextRun) {
            this.container.client.emit(
                Events.PreContextCommandRun, {
                    command,
                    interaction,
                    context: { commandId: interaction.id, commandName: interaction.commandName }
                }
            );
        }
    }
}
