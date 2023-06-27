package com.onlychat.demo.Utility;

import com.onlychat.demo.GroupChat.GroupChat;
import com.onlychat.demo.GroupChat.GroupChatRespository;
import com.onlychat.demo.GroupChat.GroupChatService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
@EnableScheduling
public class GroupChatCleanupTask {

    @Autowired
    private GroupChatRespository groupChatRepository;

    @Autowired
    private GroupChatService groupChatService;

    @Transactional
    @Scheduled(fixedRate = 100 * 60 * 1000) // Run every 5 minutes
    public void cleanupGroupChats() {
        System.out.println("called1");
        List<GroupChat> groupChats = groupChatRepository.findAll();
        System.out.println(groupChats);
        for (GroupChat groupChat : groupChats) {
            System.out.println("called2");
            Date lastActivityTime = groupChat.getLastActivityTime();
            if (lastActivityTime != null) {
                System.out.println("Last Activity Time: " + lastActivityTime);
                if (isInactive(lastActivityTime)) {
                    System.out.println("called3.1");
                    groupChatService.deleteGroupById(groupChat.getId());
                    System.out.println("called3.2");
                }
            }
        }
    }

    private boolean isInactive(Date lastActivityTime) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -100);
        Date thresholdTime = cal.getTime();

        System.out.println("Threshold Time: " + thresholdTime);

        return lastActivityTime.before(thresholdTime);
    }

}
