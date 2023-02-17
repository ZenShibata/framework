/* eslint-disable class-methods-use-this */

import { BaseContextMenuInteraction, CommandInteraction, Message, PermissionsBitField } from "@nezuchan/core";
import { AliasPiece, AliasPieceOptions, PieceContext } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { Lexer, IUnorderedStrategy } from "@sapphire/lexure";
import { FlagUnorderedStrategy, FlagStrategyOptions } from "../Lib/FlagUnorderedStrategy";
import { CommandContext } from "../Lib/CommandContext";
import { PreconditionContainerArray, PreconditionEntryResolvable } from "../Lib/Preconditions/PreconditionContainerArray";
import { PermissionFlagsBits } from "discord-api-types/v10";

export class Command extends AliasPiece {
    public lexer: Lexer;
    public fullCategory = this.location.directories;
    public strategy: IUnorderedStrategy;
    public preconditions: PreconditionContainerArray;

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
        this.preconditions = new PreconditionContainerArray(options.preconditions);

        const clientPermissions = new PermissionsBitField(PermissionFlagsBits, options.clientPermissions);

        if (clientPermissions.bits !== 0n) {
            this.preconditions.append({
                name: "ClientPermissions",
                context: {
                    permissions: clientPermissions
                }
            });
        }

        const userPermissions = new PermissionsBitField(PermissionFlagsBits, options.userPermissions);

        if (userPermissions.bits !== 0n) {
            this.preconditions.append({
                name: "UserPermissions",
                context: {
                    permissions: userPermissions
                }
            });
        }
    }

    public chatInputRun?(interaction: CommandInteraction): Awaitable<unknown>;
    public contextMenuRun?(interaction: BaseContextMenuInteraction): Awaitable<unknown>;
    public messageRun?(message: Message): Awaitable<unknown>;

    public contextRun?(ctx: CommandContext): Awaitable<unknown>;
}

export interface CommandOptions extends AliasPieceOptions, FlagStrategyOptions {
    quotes?: [string, string][];
    preconditions: readonly PreconditionEntryResolvable[];
    clientPermissions: bigint[];
    userPermissions: bigint[];
}
