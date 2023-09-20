export type AppStateType = "FETCHING_INITIAL_USER_DATA" 
    | "NORMAL" 
    | "ERROR_FETCHING_INITIAL_USER_DATA" 
    | "INVALID_TOKEN"
    | "MISSING_TOKEN";

interface MessageMap {
    [key: string]: Message[]
}

export type AppState = {
    type: AppStateType;
    snackbarMessage: SnackbarMessage[];
    loggedInUserId: number;
    loggedInUsername: string;
    chatlistSearch: string;
    contacts: Contact[],
    groupContacts: GroupContact[],
    conversations: Conversation[],
    groupConversations: GroupConversation[],
    windowStack: Window[],
    message: MessageMap,
    selectedContact: GroupContact | Contact | null,
    fetchInitialData: () => Promise<void>,
    selectContact: (type: ContactType, userOrGroupId: number) => Promise<void>,
    sendMessage: (message: string) => void;
    
    // snackbar methods
    pushSnackbarSuccess: (message: string) => void;
    pushSnackbarError: (message: string) => void;
    removeSnackbarMessage: (id: number) => void;

    // window methods
    pushWindow: (window: Window) => void;
    popWindow: () => void;
    top: () => Window;

    onChangeChatListSearch: (search: string) => void;

};

export type Window = "CHAT_WINDOW" 
    | "SETTINGS_WINDOW" 
    | "LOGOUT_CONFIRM"
    | "CHANGE_PASSWORD"
    | "CREATE_GROUP_WINDOW";

export type ContactType = "DIRECT" | "GROUP";

export type Contact = {
    type: "DIRECT";
    id: number;
    name: string;
    urlProfile: string;
};

export type GroupContact = {
    type: "GROUP";
    id: number;
    name: string;
    urlProfile: string;
};

export type GroupConversation = {
    type: "GROUP";
    id: number;
    name: string;
    lastMessageTime: string;
    lastMessageContent: string;
    unreadCount: number;
};

export type Conversation = {
    type: "DIRECT";
    id: number;
    name: string;
    lastMessageTime: string;
    lastMessageContent: string;
    unreadCount: number;
};

export type Message = {
    id: number;
    content: string;
    senderName: string;
    time: string;
    isUser: boolean;
    receiverRead: boolean;
};

export type SnackbarType = "success" | "failure";

export type SnackbarMessage = {
    id: number;
    message: string;
    type: SnackbarType
};

export type AppStateSet = (partial: AppState | Partial<AppState> | ((state: AppState) => AppState | Partial<AppState>), replace?: boolean | undefined) => void;
