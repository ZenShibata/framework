import { Store } from "@sapphire/pieces";
import { Precondition } from "./Precondition";

export class PreconditionStore extends Store<Precondition> {
    public constructor() {
        super(Precondition, { name: "preconditions" });
    }
}
