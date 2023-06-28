import { GroupChat } from "./group-chat";
import { User } from "./user";

export interface Chat {
    id: string;
    message: string;
    timeStamp: Date;
    sender: User;
    groupChat: GroupChat;

}