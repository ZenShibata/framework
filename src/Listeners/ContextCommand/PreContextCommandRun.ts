import { BaseInteraction, Message } from "@nezuchan/core";
import { Listener } from "../../Stores/Listener";
import { Piece } from "@sapphire/pieces";
import { Events } from "../../Utilities/EventEnums";
import { Command } from "../../Stores/Command";
import { CommandContext } from "../../Lib/CommandContext";
import { Parser, ArgumentStream } from "@sapphire/lexure";

export class PreContextCommandRun extends Listener {
    public constructor(context: Piece.Context) {
        super(context, {
            event: Events.PreContextCommandRun
        });
    }

    public run(payload: { command: Command; context: BaseInteraction | Message }): void {
        // TODO: Preconditions.
        const parser = new Parser(payload.command.strategy);
        const stream = new ArgumentStream(parser.run(payload.command.lexer.run("content" in payload.context ? payload.context.content : "")));

        this.container.client.emit(Events.ContextCommandAccepted, {
            ...payload,
            context: new CommandContext(payload.context, stream)
        });
    }
}
