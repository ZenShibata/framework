/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Awaitable } from "@sapphire/utilities";
import { ClientOptions, FrameworkClient } from "../Lib/FrameworkClient.js";
import { PluginHook } from "./Hook.js";
import { preGenericsInitialization, preInitialization, postInitialization, preLogin, postLogin } from "./Symbols.js";
import { Plugin } from "./Plugin.js";

export type AsyncPluginHooks = PluginHook.PostLogin | PluginHook.PreLogin;
export type SapphirePluginAsyncHook = (this: FrameworkClient, options: ClientOptions) => Awaitable<unknown>;

export type SyncPluginHooks = Exclude<PluginHook, AsyncPluginHooks>;
export type SapphirePluginHook = (this: FrameworkClient, options: ClientOptions) => unknown;

export interface SapphirePluginHookEntry<T = SapphirePluginAsyncHook | SapphirePluginHook> {
    hook: T;
    type: PluginHook;
    name?: string;
}

export class PluginManager {
    public readonly registry = new Set<SapphirePluginHookEntry>();

    public registerHook(hook: SapphirePluginHook, type: SyncPluginHooks, name?: string): this;
    public registerHook(hook: SapphirePluginAsyncHook, type: AsyncPluginHooks, name?: string): this;
    public registerHook(hook: SapphirePluginAsyncHook | SapphirePluginHook, type: PluginHook, name?: string): this {
        if (typeof hook !== "function") throw new TypeError(`The provided hook ${name ? `(${name}) ` : ""}is not a function`);
        this.registry.add({ hook, type, name });
        return this;
    }

    public registerPreGenericsInitializationHook(hook: SapphirePluginHook, name?: string): this {
        return this.registerHook(hook, PluginHook.PreGenericsInitialization, name);
    }

    public registerPreInitializationHook(hook: SapphirePluginHook, name?: string): this {
        return this.registerHook(hook, PluginHook.PreInitialization, name);
    }

    public registerPostInitializationHook(hook: SapphirePluginHook, name?: string): this {
        return this.registerHook(hook, PluginHook.PostInitialization, name);
    }

    public registerPreLoginHook(hook: SapphirePluginAsyncHook, name?: string): this {
        return this.registerHook(hook, PluginHook.PreLogin, name);
    }

    public registerPostLoginHook(hook: SapphirePluginAsyncHook, name?: string): this {
        return this.registerHook(hook, PluginHook.PostLogin, name);
    }

    public use(plugin: typeof Plugin): this {
        const possibleSymbolHooks: [symbol, PluginHook][] = [
            [preGenericsInitialization, PluginHook.PreGenericsInitialization],
            [preInitialization, PluginHook.PreInitialization],
            [postInitialization, PluginHook.PostInitialization],
            [preLogin, PluginHook.PreLogin],
            [postLogin, PluginHook.PostLogin]
        ];
        for (const [hookSymbol, hookType] of possibleSymbolHooks) {
            const hook = Reflect.get(plugin, hookSymbol) as SapphirePluginAsyncHook | SapphirePluginHook;
            if (typeof hook !== "function") continue;
            this.registerHook(hook, hookType as any);
        }
        return this;
    }

    public values(): Generator<SapphirePluginHookEntry, void>;
    public values(hook: SyncPluginHooks): Generator<SapphirePluginHookEntry<SapphirePluginHook>, void>;
    public values(hook: AsyncPluginHooks): Generator<SapphirePluginHookEntry<SapphirePluginAsyncHook>, void>;
    public * values(hook?: PluginHook): Generator<SapphirePluginHookEntry, void> {
        for (const plugin of this.registry) {
            if (hook && plugin.type !== hook) continue;
            yield plugin;
        }
    }
}
