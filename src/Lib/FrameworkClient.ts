import { Piece, Store, container } from "@sapphire/pieces";
import { join } from "node:path";
import { Client, ClientOptions as OClientOptions } from "@nezuchan/core";

import { ListenerStore } from "../Stores/ListenerStore";
import { CommandStore } from "../Stores/CommandStore";
import { PreconditionStore } from "../Stores/PreconditionStore";

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
                .registerPath(join(__dirname, "..", "Preconditions")));

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
    }
}

export interface ClientOptions extends OClientOptions {
    baseUserDirectory?: string;
}
