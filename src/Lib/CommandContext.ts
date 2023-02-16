import { BaseInteraction, Message } from "@nezuchan/core";
import { ArgumentStream } from "@sapphire/lexure";

export class CommandContext {
    public constructor(private readonly context: BaseInteraction | Message, public messageArgs: ArgumentStream) { }

    public get message(): Message {
        return this.context as Message;
    }

    public get interaction(): BaseInteraction {
        return this.context as BaseInteraction;
    }

    public get isInteraction(): boolean {
        return this.context instanceof BaseInteraction;
    }

    public get isMessage(): boolean {
        return this.context instanceof Message;
    }
}
