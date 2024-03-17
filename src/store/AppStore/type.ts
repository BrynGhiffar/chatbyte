import { ColorConfig, Theme, ThemeId } from "@/theme/type";
import { StoreApi } from "zustand";
import { WebsocketMiddlewareType } from "../WebsocketMiddleware/type";

export type AppStateType = "FETCHING_INITIAL_USER_DATA" 
    | "NORMAL" 
    | "ERROR_FETCHING_INITIAL_USER_DATA" 
    | "INVALID_TOKEN"
    | "MISSING_TOKEN";

interface MessageMap {
    [key: string]: Message[]
}

export type AppStateState = {
    editMessage: { message: Message, scrollIntoView: () => void } | null;
    uploadAttachments: Attachment[];


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
    showChatList: boolean,
    theme: Theme,
}

export type AppStateAction = {
    fetchInitialData: () => Promise<void>,
    selectContact: (type: ContactType, userOrGroupId: number) => Promise<void>,
    sendMessage: (message: string) => void;
    deleteMessage: (messageId: number) => void;
    createChatGroup: (name: string, members: number[], profilePicture: File | null) => Promise<void>;
    setEditMessage: (messageId: number, scrollIntoView: () => void) => void;
    cancelEditMessage: () => void;
    
    // snackbar methods
    pushSnackbarSuccess: (message: string) => void;
    pushSnackbarError: (message: string) => void;
    removeSnackbarMessage: (id: number) => void;

    // window methods
    pushWindow: (window: Window) => void;
    popWindow: () => void;
    top: () => Window;

    onChangeChatListSearch: (search: string) => void;

    toggleShowChatList: () => void,
    setTheme: (themeId: ThemeId) => void;

    addUploadAttachments: (files: File[]) => void,
    removeAttachmentById: (id: number) => void,
}

export type Attachment = {
    file: string,
    id: number,
}

export type AppState = AppStateState & AppStateAction;

export type ChatWindow = { type: "CHAT_WINDOW" }
export type SettingsWindow = { type: "SETTINGS_WINDOW" }
export type LogoutConfirmWindow = { type: "LOGOUT_CONFIRM" }
export type ChangePasswordWindow = { type: "CHANGE_PASSWORD" }
export type CreateGroupWindow = { type: "CREATE_GROUP_WINDOW" }
export type ConfirmPopupDeleteMessageWindow = { type: "CONFIRM_POPUP_DELETE_MESSAGE", messageId: number };
export type ImageCarouselWindow = { type: "IMAGE_CARROUSEL_WINDOW", imageSrcs: string[] };

export type Window = ChatWindow 
    | SettingsWindow 
    | LogoutConfirmWindow
    | ChangePasswordWindow
    | CreateGroupWindow
    | ConfirmPopupDeleteMessageWindow
    | ImageCarouselWindow
    ;

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
    deleted: boolean;
};

export type Conversation = {
    type: "DIRECT";
    id: number;
    name: string;
    lastMessageTime: string;
    lastMessageContent: string;
    unreadCount: number;
    deleted: boolean;
};

export type Message = {
    id: number;
    content: string;
    senderName: string;
    senderId: number;
    time: string;
    isUser: boolean;
    receiverRead: boolean;
    deleted: boolean;
    edited: boolean;
    attachmentIds: number[]
};

export type SnackbarType = "success" | "failure";

export type SnackbarMessage = {
    id: number;
    message: string;
    type: SnackbarType
};

export type Write<T extends object, U extends object> = Omit<T, keyof U> & U

export type AppStateSet = (partial: AppState | Partial<AppState> | ((state: AppState) => AppState | Partial<AppState>), replace?: boolean | undefined) => void;
export type AppStateGet = () => AppState;