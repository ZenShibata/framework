export enum ListenerEvents {
    ListenerError = "listenerError"
}

export enum Events {
    InteractionCreate = "interactionCreate",
    PossibleChatInputCommand = "possibleChatInputCommand",
    PossibleContextMenuCommand = "possibleContextMenuCommand",
    PossibleAutocompleteInteraction = "possibleAutoCompleteInteraction",

    PreChatInputCommandRun = "preChatInputCommandRun",
    ChatInputCommandAccepted = "chatInputCommandAccepted",
    ChatInputCommandError = "chatInputCommandError",
    ChatInputCommandDenied = "chatInputCommandDenied",

    PreContextMenuCommandRun = "preContextMenuCommandRun",
    ContextMenuCommandAccepted = "contextMenuCommandAccepted",
    ContextMenuCommandError = "contextMenuCommandError",
    ContextMenuCommandDenied = "contextMenuCommandDenied",

    PreContextCommandRun = "preContextCommandRun",
    ContextCommandAccepted = "contextCommandAccepted",
    ContextCommandError = "contextCommandError",
    ContextCommandDenied = "contextCommandDenied"
}
