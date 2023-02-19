/* eslint-disable class-methods-use-this */
import { BaseInteraction, PermissionsBitField } from "@nezuchan/core";
import { Piece } from "@sapphire/pieces";
import { Option } from "@sapphire/result";
import { Awaitable } from "@sapphire/utilities";
import { PreconditionContainerArray, PreconditionEntryResolvable } from "../Lib/Preconditions/PreconditionContainerArray";
import { PermissionFlagsBits } from "discord-api-types/v10";

export abstract class InteractionHandler<O extends InteractionHandlerOptions = InteractionHandlerOptions> extends Piece<O> {
    public preconditions: PreconditionContainerArray;
    public constructor(context: Piece.Context, options: InteractionHandlerOptions) {
        super(context, options);
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
    preconditions: PreconditionEntryResolvable[];
    clientPermissions: bigint[];
    userPermissions: bigint[];
    readonly interactionHandlerType: InteractionHandlerTypes;
}

export enum InteractionHandlerTypes {
    Button = 0,
    SelectMenu = 1,
    ModalSubmit = 2,
    MessageComponent = 3,
    Autocomplete = 4
}
