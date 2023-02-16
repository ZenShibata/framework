import { CommandInteraction } from "@nezuchan/core";
import { Listener } from "../../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../../Utilities/EventEnums";

export class PossibleChatInputCommand extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            event: Events.PossibleChatInputCommand
        });
    }

    public run(interaction: CommandInteraction): void {
        const commandStore = this.container.stores.get("commands");
        if (!interaction.commandName) return;

        const command = commandStore.get(interaction.commandName);

        if (command?.chatInputRun) {
            this.container.client.emit(
                Events.PreChatInputCommandRun, {
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
