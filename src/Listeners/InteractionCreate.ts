import { PieceContext } from "@sapphire/pieces";
import { Listener } from "../Stores/Listener";
import { Events } from "../Utilities/EventEnums";
import { BaseInteraction } from "@nezuchan/core";

export class InteractionCreate extends Listener {
    public constructor(context: PieceContext) {
        super(context, {
            event: Events.InteractionCreate
        });
    }

    public run(interaction: BaseInteraction): void {
        if (interaction.isCommandInteraction()) {
            this.container.client.emit(Events.PossibleChatInputCommand, interaction);
        } else if (interaction.isContextMenuInteraction()) {
            this.container.client.emit(Events.PossibleContextMenuCommand, interaction);
        } else if (interaction.isAutoCompleteInteraction()) {
            this.container.client.emit(Events.PossibleAutocompleteInteraction, interaction);
        }
    }
}
