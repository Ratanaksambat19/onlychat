package com.onlychat.demo.User;

public interface UserService {
    User createUser();
    User getUserById(String userId);

    User deleteUserById(String userId);
}
