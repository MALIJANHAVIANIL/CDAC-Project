package com.elevateconnect.repository;

import com.elevateconnect.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
        List<Chat> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
                        Long senderId1, Long receiverId1, Long receiverId2, Long senderId2);

        List<Chat> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);

        // For finding recent contacts, usually requires custom query
        // List<Chat>
        // findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc exists

        @org.springframework.data.jpa.repository.Query("SELECT c.sender.id, COUNT(c) FROM Chat c WHERE c.receiver.id = :userId AND c.isRead = false GROUP BY c.sender.id")
        List<Object[]> countUnreadMessages(@org.springframework.data.repository.query.Param("userId") Long userId);

        @org.springframework.data.jpa.repository.Modifying
        @org.springframework.data.jpa.repository.Query("UPDATE Chat c SET c.isRead = true WHERE c.sender.id = :senderId AND c.receiver.id = :receiverId")
        void markMessagesAsRead(@org.springframework.data.repository.query.Param("senderId") Long senderId,
                        @org.springframework.data.repository.query.Param("receiverId") Long receiverId);
}
