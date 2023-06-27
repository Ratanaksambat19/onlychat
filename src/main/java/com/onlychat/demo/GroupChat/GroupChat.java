package com.onlychat.demo.GroupChat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.onlychat.demo.Chat.Chat;
import com.onlychat.demo.User.User;
import jakarta.persistence.*;

import java.beans.ConstructorProperties;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "group_chats")
public class GroupChat {
    @Id
    private String id;
    private String name;

    private String hostId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_activity_time")
    private Date lastActivityTime;
    @Column(name = "allowed_origin")
    private String allowedOrigin;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "group_chat_users",
            joinColumns = @JoinColumn(name = "group_chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonProperty("groupChats")
    private Set<User> participants;

    @OneToMany(mappedBy = "groupChat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Chat> chats;

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAllowedOrigin() {
        return allowedOrigin;
    }

    public void setAllowedOrigin(String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    public Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }

    public Set<Chat> getChats() {
        return chats;
    }

    public void setChats(Set<Chat> chats) {
        this.chats = chats;
    }

    public GroupChat() {
        this.id = generateUniqueId();
        this.participants = new HashSet<>();
        this.chats = new HashSet<>();
        this.lastActivityTime = new Date();
    }

    public void addParticipant(User user) {
        participants.add(user);
    }

    public void removeParticipant(User user) {
        participants.remove(user);
    }

    public void addChat(Chat chat) {
        chat.setGroupChat(this);
        chats.add(chat);
    }

    public void removeChat(Chat chat) {
        chats.remove(chat);
    }

    private String generateUniqueId() {
        return UUID.randomUUID().toString();
    }

    public boolean containsUser(User user) {
        return participants.contains(user);
    }

    public int getUserCount() {
        return participants.size();
    }

    public void updateLastActivityTime() {
        this.lastActivityTime = new Date();
    }

    public Date getLastActivityTime() {
        return lastActivityTime;
    }

    public void setLastActivityTime(Date lastActivityTime) {
        this.lastActivityTime = lastActivityTime;
    }
}
