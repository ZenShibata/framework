/* eslint-disable @typescript-eslint/no-extraneous-class */
import { ClientOptions } from "@nezuchan/core";
import { Awaitable } from "@sapphire/utilities";
import { FrameworkClient } from "../Lib/FrameworkClient.js";
import { preGenericsInitialization, preInitialization, postInitialization, preLogin, postLogin } from "./Symbols.js";

export abstract class Plugin {
    public static [preGenericsInitialization]?: (this: FrameworkClient, options: ClientOptions) => void;
    public static [preInitialization]?: (this: FrameworkClient, options: ClientOptions) => void;
    public static [postInitialization]?: (this: FrameworkClient, options: ClientOptions) => void;
    public static [preLogin]?: (this: FrameworkClient, options: ClientOptions) => Awaitable<void>;
    public static [postLogin]?: (this: FrameworkClient, options: ClientOptions) => Awaitable<void>;
}
