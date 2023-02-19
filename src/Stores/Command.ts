/* eslint-disable class-methods-use-this */

import { AutoCompleteInteraction, BaseContextMenuInteraction, CommandInteraction, Message, PermissionsBitField } from "@nezuchan/core";
import { AliasPiece, AliasPieceOptions, PieceContext } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { Lexer, IUnorderedStrategy } from "@sapphire/lexure";
import { FlagUnorderedStrategy, FlagStrategyOptions } from "../Lib/FlagUnorderedStrategy";
import { CommandContext } from "../Lib/CommandContext";
import { PreconditionContainerArray, PreconditionEntryResolvable } from "../Lib/Preconditions/PreconditionContainerArray";
import { PermissionFlagsBits, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export class Command extends AliasPiece<CommandOptions> {
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
    public autoCompleteRun?(interaction: AutoCompleteInteraction): Awaitable<unknown>;

    public contextRun?(ctx: CommandContext): Awaitable<unknown>;
}

export interface CommandOptions extends AliasPieceOptions, FlagStrategyOptions {
    quotes?: [string, string][];
    preconditions: PreconditionEntryResolvable[];
    chatInput?: RESTPostAPIApplicationCommandsJSONBody;
    contextMenu?: RESTPostAPIApplicationCommandsJSONBody;
    clientPermissions: bigint[];
    userPermissions: bigint[];
    /**
    * @description If chat input command is enabled on command context.
    */
    enableChatInputCommand?: boolean;
    /**
    * @description If context menu command is enabled on command context.
    */
    enableContextMenuCommand?: boolean;
    /**
    * @description If message command is enabled on command context.
    */
    enableMessageCommand?: boolean;
}
