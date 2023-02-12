import { Piece, Store, container } from "@sapphire/pieces";
import { ListenerStore } from "../Stores/ListenerStore";
import { join } from "node:path";
import { Client, ClientOptions as OClientOptions } from "@nezuchan/core";

export class FrameworkClient extends Client {
    public stores = container.stores;

    public constructor(
        public options: ClientOptions
    ) {
        super(options);

        this.stores
            .register(new ListenerStore()
                .registerPath(join(__dirname, "..", "Listeners")));

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
}

export interface ClientOptions extends OClientOptions {
    baseUserDirectory?: string;
}
