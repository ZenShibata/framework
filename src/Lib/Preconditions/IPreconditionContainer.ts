import { BaseContextMenuInteraction, CommandInteraction, Message } from "@nezuchan/core";
import { Result } from "@sapphire/result";
import { Awaitable } from "@sapphire/utilities";
import { Command } from "../../Stores/Command";
import { CommandContext } from "../CommandContext";
import { UserError } from "../../Utilities/Errors/UserError";
import { PreconditionContext } from "../../Stores/Precondition";

export type PreconditionContainerResult = Result<unknown, UserError>;

export type PreconditionContainerReturn = Awaitable<PreconditionContainerResult>;

export type AsyncPreconditionContainerReturn = Promise<PreconditionContainerResult>;

export interface IPreconditionContainer {
    messageRun: (message: Message, command: Command, context?: PreconditionContext) => PreconditionContainerReturn;
    chatInputRun: (interaction: CommandInteraction, command: Command, context?: PreconditionContext) => PreconditionContainerReturn;
    contextMenuRun: (interaction: BaseContextMenuInteraction, command: Command, context?: PreconditionContext) => PreconditionContainerReturn;
    contextRun: (ctx: CommandContext, command: Command, context?: PreconditionContext) => PreconditionContainerReturn;
}
