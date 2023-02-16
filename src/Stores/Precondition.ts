/* eslint-disable class-methods-use-this */

import { BaseContextMenuInteraction, CommandInteraction, Message } from "@nezuchan/core";
import { Piece } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { CommandContext } from "../Lib/CommandContext";

export class Precondition extends Piece {
    public chatInputRun?(interaction: CommandInteraction): Awaitable<unknown>;
    public contextMenuRun?(interaction: BaseContextMenuInteraction): Awaitable<unknown>;
    public messageRun?(message: Message): Awaitable<unknown>;

    public contextRun?(ctx: CommandContext): Awaitable<unknown>;
}

