package com.onlychat.demo.GroupChat;
import java.util.Map;

import java.util.List;

public interface GroupChatService {
    GroupChat createGroup(String group_name);
    List<GroupChat> getGroups();
    GroupChat getGroupById(String groupId);
    Map<String, Object> addToGroupById(String groupId, String userId);
    GroupChat deleteGroupById(String groupId);

}
