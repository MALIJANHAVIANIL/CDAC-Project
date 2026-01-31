package com.elevateconnect.repository;

import com.elevateconnect.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
            Long senderId1, Long receiverId1, Long receiverId2, Long senderId2);

    // For finding recent contacts, usually requires custom query
}
