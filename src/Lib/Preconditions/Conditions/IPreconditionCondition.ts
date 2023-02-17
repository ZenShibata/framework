import { BaseContextMenuInteraction, CommandInteraction, Message } from "@nezuchan/core";
import { Command } from "../../../Stores/Command";
import { CommandContext } from "../../CommandContext";
import { IPreconditionContainer, PreconditionContainerReturn } from "../IPreconditionContainer";
import { PreconditionContext } from "../../../Stores/Precondition";

export interface IPreconditionCondition {
    messageSequential: (
        message: Message,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    messageParallel: (
        message: Message,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    chatInputSequential: (
        interaction: CommandInteraction,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    chatInputParallel: (
        interaction: CommandInteraction,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    contextMenuSequential: (
        interaction: BaseContextMenuInteraction,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    contextMenuParallel: (
        interaction: BaseContextMenuInteraction,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    contextCommandSequential: (
        ctx: CommandContext,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;

    contextCommandParallel: (
        ctx: CommandContext,
        command: Command,
        entries: readonly IPreconditionContainer[],
        context?: PreconditionContext | undefined
    ) => PreconditionContainerReturn;
}
