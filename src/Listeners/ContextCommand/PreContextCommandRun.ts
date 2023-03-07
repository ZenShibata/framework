/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
            name: Events.PreContextCommandRun
        });
    }

    public async run(payload: { command: Command; context: BaseInteraction | Message; parameters?: string }): Promise<void> {
        const parser = new Parser(payload.command.strategy);
        const stream = new ArgumentStream(parser.run(payload.command.lexer.run(payload.parameters ? payload.parameters : "")));
        const context = new CommandContext(payload.context, stream);

        const globalResult = await this.container.stores.get("preconditions").contextRun(context, payload.command, payload as any);
        if (globalResult.isErr()) {
            this.container.client.emit(Events.ContextCommandDenied, globalResult.unwrapErr(), payload);
            return;
        }

        const localResult = await payload.command.preconditions.contextRun(context, payload.command, payload as any);
        if (localResult.isErr()) {
            this.container.client.emit(Events.ContextCommandDenied, localResult.unwrapErr(), payload);
            return;
        }

        this.container.client.emit(Events.ContextCommandAccepted, {
            ...payload,
            context
        });
    }
}
