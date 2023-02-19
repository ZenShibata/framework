/* eslint-disable class-methods-use-this */
import { BaseInteraction } from "@nezuchan/core";
import { Piece } from "@sapphire/pieces";
import { Option } from "@sapphire/result";
import { Awaitable } from "@sapphire/utilities";

export abstract class InteractionHandler<O extends InteractionHandlerOptions = InteractionHandlerOptions> extends Piece<O> {
    public constructor(context: Piece.Context, options: Piece.Options) {
        super(context, options);
    }

    public parse(_interaction: BaseInteraction): Awaitable<Option<unknown>> {
        return this.some();
    }

    public some(): Option.Some<never>;
    public some<T>(data: T): Option.Some<T>;
    public some<T>(data?: T): Option.Some<T | undefined> {
        return Option.some(data);
    }

    public none(): Option.None {
        return Option.none;
    }

    public abstract run<T>(interaction: BaseInteraction, parsedData?: T): unknown;
}

export interface InteractionHandlerOptions extends Piece.Options {
    readonly interactionHandlerType: InteractionHandlerTypes;
}

export enum InteractionHandlerTypes {
    Button = 0,
    SelectMenu = 1,
    ModalSubmit = 2,
    MessageComponent = 3,
    Autocomplete = 4
}
