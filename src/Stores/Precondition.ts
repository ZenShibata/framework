/* eslint-disable class-methods-use-this */

import { BaseContextMenuInteraction, CommandInteraction, Message, PermissionsBitField } from "@nezuchan/core";
import { Piece, PieceContext, PieceOptions } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";
import { CommandContext } from "../Lib/CommandContext";
import { Command } from "./Command";
import { Result } from "@sapphire/result";
import { UserError } from "../Utilities/Errors/UserError";
import { PreconditionError } from "../Utilities/Errors/PreconditionError";

export class Precondition extends Piece {
    public readonly position: number | null;

    public constructor(context: PieceContext, options: PreconditionOptions) {
        super(context, options);
        this.position = options.position ?? null;
    }

    public chatInputRun?(interaction: CommandInteraction, command: Command, context?: PreconditionContext): Awaitable<Result<unknown, UserError>>;
    public contextMenuRun?(interaction: BaseContextMenuInteraction, command: Command, context?: PreconditionContext): Awaitable<Result<unknown, UserError>>;
    public messageRun?(message: Message, command: Command, context?: PreconditionContext): Awaitable<Result<unknown, UserError>>;

    public contextRun?(ctx: CommandContext, command: Command, context?: PreconditionContext): Awaitable<Result<unknown, UserError>>;

    public error(options: Omit<PreconditionError.Options, "precondition"> = {}): Awaitable<Result<unknown, UserError>> {
        return Result.err(new PreconditionError({ precondition: this, ...options }));
    }

    public ok(): Awaitable<Result<unknown, UserError>> {
        return Result.ok();
    }
}

export interface PreconditionOptions extends PieceOptions {
    position?: number;
}

export interface Preconditions {
    Enabled: never;
    ClientPermissions: {
        permissions: PermissionsBitField;
    };
    UserPermissions: {
        permissions: PermissionsBitField;
    };
}

export interface PreconditionContext extends Record<PropertyKey, unknown> {
    external?: boolean;
}

export type PreconditionKeys = keyof Preconditions;
export type SimplePreconditionKeys = {
    [K in PreconditionKeys]: Preconditions[K] extends never ? K : never;
}[PreconditionKeys];
