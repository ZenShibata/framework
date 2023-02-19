import { AliasStore } from "@sapphire/pieces";
import { Command } from "./Command";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { Events } from "../Utilities/EventEnums";

export class CommandStore extends AliasStore<Command> {
    public constructor() {
        super(Command, { name: "commands" });
    }

    public async postCommands(): Promise<void> {
        const commands = [...this.values()];
        const me = await this.container.client.users.fetchMe({ cache: true });
        const registerAbleCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

        for (const command of commands) {
            if (command.options.chatInput) {
                this.container.client.emit(Events.RegisteringCommand, command);
                registerAbleCommands.push(command.options.chatInput);
            }

            if (command.options.contextMenu) {
                this.container.client.emit(Events.RegisteringCommand, command);
                registerAbleCommands.push(command.options.contextMenu);
            }
        }

        if (registerAbleCommands.length > 0) {
            await this.container.client.rest.put(Routes.applicationCommands(me.id), {
                body: registerAbleCommands
            });
            this.container.client.emit(Events.CommandRegistered, registerAbleCommands);
        }
    }
}
