package com.onlychat.demo.User;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.onlychat.demo.GroupChat.GroupChat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name="users")
public class User {
    @Id
    private String id;
    private String username;
    private boolean anonymous;
    private LocalDateTime timestamp;//add
    @Column(name = "profile_image")
    private String profileImage;

    @ManyToMany(mappedBy = "participants", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<GroupChat> groupChats;
    // Constructors, getters, and setters

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
    //add
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    //add
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
