/* eslint-disable class-methods-use-this */

import { BaseContextMenuInteraction, CommandInteraction, Message } from "@nezuchan/core";
import { AliasPiece, AliasPieceOptions, PieceContext } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { Lexer, IUnorderedStrategy } from "@sapphire/lexure";
import { FlagUnorderedStrategy, FlagStrategyOptions } from "../Lib/FlagUnorderedStrategy";
import { CommandContext } from "../Lib/CommandContext";

export class Command extends AliasPiece {
    public lexer: Lexer;
    public fullCategory = this.location.directories;
    public strategy: IUnorderedStrategy;

    public get category(): string | null {
        return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
    }

    public get subCategory(): string | null {
        return this.fullCategory.length > 1 ? this.fullCategory[1] : null;
    }

    public get parentCategory(): string | null {
        return this.fullCategory.length > 1 ? this.fullCategory[this.fullCategory.length - 1] : null;
    }

    public constructor(context: PieceContext, options: CommandOptions) {
        super(context, options);

        this.lexer = new Lexer({
            quotes: options.quotes ?? [
                ['"', '"'], // Double quotes
                ["“", "”"], // Fancy quotes (on iOS)
                ["「", "」"], // Corner brackets (CJK)
                ["«", "»"] // French quotes (guillemets)
            ]
        });

        this.strategy = new FlagUnorderedStrategy(options);
    }

    public chatInputRun?(interaction: CommandInteraction): Awaitable<unknown>;
    public contextMenuRun?(interaction: BaseContextMenuInteraction): Awaitable<unknown>;
    public messageRun?(message: Message): Awaitable<unknown>;

    public contextRun?(ctx: CommandContext): Awaitable<unknown>;
}

export interface CommandOptions extends AliasPieceOptions, FlagStrategyOptions {
    quotes?: [string, string][];
}
