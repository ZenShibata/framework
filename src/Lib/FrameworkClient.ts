import { Piece, Store, container } from "@sapphire/pieces";
import { join } from "node:path";
import { Client, ClientOptions as OClientOptions } from "@nezuchan/core";

import { ListenerStore } from "../Stores/ListenerStore";
import { CommandStore } from "../Stores/CommandStore";
import { PreconditionStore } from "../Stores/PreconditionStore";
import { InteractionHandlerStore } from "../Stores/InteractionHandlerStore";

export class FrameworkClient extends Client {
    public stores = container.stores;

    public constructor(
        public options: ClientOptions
    ) {
        super(options);

        container.client = this;

        this.stores
            .register(new ListenerStore()
                .registerPath(join(__dirname, "..", "Listeners")))
            .register(new CommandStore())
            .register(new PreconditionStore()
                .registerPath(join(__dirname, "..", "Preconditions")))
            .register(new InteractionHandlerStore());

        this.stores.registerPath(this.options.baseUserDirectory);
    }

    public async start(): Promise<void> {
        await Promise.all([...this.stores.values()].map((store: Store<Piece>) => store.loadAll()));
        await this.connect();
    }
}

declare module "@sapphire/pieces" {
    interface Container {
        client: FrameworkClient;
    }

    interface StoreRegistryEntries {
        commands: CommandStore;
        listeners: ListenerStore;
        preconditions: PreconditionStore;
        "interaction-handlers": InteractionHandlerStore;
    }
}

export interface ClientOptions extends OClientOptions {
    baseUserDirectory?: string;
    fetchPrefix?: (guildId?: string, authorId?: string, channelId?: string | null) => Promise<string[] | string>;
    disableMentionPrefix?: boolean;
    regexPrefix?: RegExp;
    caseInsensitivePrefixes?: boolean;
    caseInsensitiveCommands?: boolean;
}
