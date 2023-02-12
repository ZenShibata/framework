import { AliasStore } from "@sapphire/pieces";
import { Command } from "./Command";

export class CommandStore extends AliasStore<Command> {
    public constructor() {
        super(Command, { name: "commands" });
    }
}
