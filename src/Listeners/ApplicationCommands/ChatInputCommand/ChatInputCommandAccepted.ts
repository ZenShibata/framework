import { CommandInteraction } from "@nezuchan/core";
import { Listener } from "../../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../../Utilities/EventEnums";
import { Command } from "../../../Stores/Command";
import { Result } from "@sapphire/result";

export class ChatInputCommandAccepted extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            name: Events.ChatInputCommandAccepted
        });
    }

    public async run(payload: { command: Command; interaction: CommandInteraction }): Promise<void> {
        const result = await Result.fromAsync(() => payload.command.chatInputRun!(payload.interaction));
        result.inspectErr(error => this.container.client.emit(Events.ChatInputCommandError, error, { ...payload }));
    }
}
