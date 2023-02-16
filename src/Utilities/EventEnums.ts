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

    PreContextCommandRun = "preContextCommandRun",
    ContextCommandAccepted = "contextCommandAccepted",
    ContextCommandError = "contextCommandError"
}
