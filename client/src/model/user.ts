import { GroupChat } from "./group-chat";

export interface User {
    id: string;
    userName: string;
    anonymous: boolean;
    profileImage: string;
    groupChat: GroupChat[];
}