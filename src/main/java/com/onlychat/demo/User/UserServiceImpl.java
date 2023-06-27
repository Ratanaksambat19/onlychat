package com.onlychat.demo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import static com.onlychat.demo.Utility.GenerateName.generateName;
import static com.onlychat.demo.Utility.AvatarUrlGenerator.generateAvatarUrl;
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRespository repo;

    @Override
    public User createUser() {
        User returnValue = new User();
        String randomName = generateName();
        returnValue.setUsername(randomName);
        boolean b = true;
        returnValue.setAnonymous(b);
        String userId = UUID.randomUUID().toString();
        String imageUrl = generateAvatarUrl(randomName);
        returnValue.setProfileImage(imageUrl);
        returnValue.setId(userId);
        returnValue.setTimestamp(LocalDateTime.now()); //add
        repo.save(returnValue);
        return returnValue;
    }

    @Override
    public User getUserById(String userId) {
        return repo.findById(userId).orElse(null);
    }

    @Override
    public User deleteUserById(String userId){
        User user = repo.findById(userId).orElse(null);
        if(user!=null){
            repo.deleteById(userId);
            return user;
        }
        return null;
    }
}