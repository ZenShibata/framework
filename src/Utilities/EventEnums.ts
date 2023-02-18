export enum ListenerEvents {
    ListenerError = "listenerError"
}

export enum Events {
    InteractionCreate = "interactionCreate",
    MessageCreate = "messageCreate",

    PreMessageParsed = "preMessageParsed",

    PossibleChatInputCommand = "possibleChatInputCommand",
    PossibleContextMenuCommand = "possibleContextMenuCommand",
    PossibleAutocompleteInteraction = "possibleAutoCompleteInteraction",

    PreChatInputCommandRun = "preChatInputCommandRun",
    ChatInputCommandAccepted = "chatInputCommandAccepted",
    ChatInputCommandError = "chatInputCommandError",
    ChatInputCommandDenied = "chatInputCommandDenied",
    ChatInputCommandDisabled = "chatInputCommandDisabled",

    PreContextMenuCommandRun = "preContextMenuCommandRun",
    ContextMenuCommandAccepted = "contextMenuCommandAccepted",
    ContextMenuCommandError = "contextMenuCommandError",
    ContextMenuCommandDenied = "contextMenuCommandDenied",
    ContextMenuCommandDisabled = "contextMenuCommandDisabled",

    PreContextCommandRun = "preContextCommandRun",
    ContextCommandAccepted = "contextCommandAccepted",
    ContextCommandError = "contextCommandError",
    ContextCommandDenied = "contextCommandDenied"
}
