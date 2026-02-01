package com.elevateconnect.controller;

import com.elevateconnect.model.Chat;
import com.elevateconnect.model.Role;
import com.elevateconnect.model.User;
import com.elevateconnect.dto.ChatRequest;
import com.elevateconnect.dto.ChatPartnerDTO;

import com.elevateconnect.repository.ChatRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/messages/{userId}/{otherUserId}")
    public List<Chat> getMessages(@PathVariable long userId, @PathVariable long otherUserId) {
        return chatRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
                userId, otherUserId, userId, otherUserId);
    }

    @Transactional
    @GetMapping("/conversation/{partnerId}")
    public List<Chat> getConversation(@PathVariable long partnerId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        // Mark messages from partner as read
        chatRepository.markMessagesAsRead(partnerId, userId);

        return chatRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
                userId, partnerId, userId, partnerId);
    }

    @GetMapping("/alumni")
    public List<ChatPartnerDTO> getAlumni() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        // Get all chats involved
        List<Chat> myChats = chatRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);

        // Map partnerId to lastMessageTime
        Map<Long, java.time.LocalDateTime> lastActive = new HashMap<>();
        for (Chat c : myChats) {
            Long partnerId = c.getSender().getId().equals(userId) ? c.getReceiver().getId() : c.getSender().getId();
            lastActive.putIfAbsent(partnerId, c.getCreatedAt());
        }

        List<ChatPartnerDTO> alumni = userRepository.findByRole(Role.ALUMNI).stream()
                .map(u -> new ChatPartnerDTO(u.getId(), u.getName(), u.getEmail(), "ALUMNI", ""))
                .collect(Collectors.toList());

        // Sort: Recent first, then others
        alumni.sort((a, b) -> {
            boolean aActive = lastActive.containsKey(a.getId());
            boolean bActive = lastActive.containsKey(b.getId());
            if (aActive && bActive)
                return lastActive.get(b.getId()).compareTo(lastActive.get(a.getId()));
            if (aActive)
                return -1;
            if (bActive)
                return 1;
            return a.getName().compareTo(b.getName());
        });

        return alumni;
    }

    @GetMapping("/recent")
    public List<ChatPartnerDTO> getRecentChats() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        List<Chat> myChats = chatRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);

        Map<Long, java.time.LocalDateTime> lastActive = new HashMap<>();
        // Also capture last message snippet if needed, but for sorting time is enough
        for (Chat c : myChats) {
            Long partnerId = c.getSender().getId().equals(userId) ? c.getReceiver().getId() : c.getSender().getId();
            lastActive.putIfAbsent(partnerId, c.getCreatedAt());
        }

        // Return users we have chatted with, OR all users if we want a directory
        // For "Recent", strictly return history partners.

        // For "Recent", strictly return history partners.

        List<ChatPartnerDTO> recentPartners = lastActive.keySet().stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(u -> u != null)
                .map(u -> new ChatPartnerDTO(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), ""))
                .collect(Collectors.toList());

        // Sort by recency
        recentPartners.sort((a, b) -> lastActive.get(b.getId()).compareTo(lastActive.get(a.getId())));

        return recentPartners;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatRequest chatRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User sender = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        User receiver = userRepository.findById(chatRequest.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Chat chat = new Chat();
        chat.setSender(sender);
        chat.setReceiver(receiver);
        chat.setMessage(chatRequest.getMessage());
        chat.setMediaUrl(chatRequest.getMediaUrl());
        chat.setMediaType(chatRequest.getMediaType());

        chatRepository.save(chat);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads");
            if (!Files.exists(path))
                Files.createDirectories(path);
            Files.copy(file.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok(Map.of("url", "http://localhost:8089/uploads/" + fileName));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Upload failed");
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<Map<Long, Integer>> getUnreadCounts() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        List<Object[]> results = chatRepository.countUnreadMessages(userId);
        Map<Long, Integer> counts = new HashMap<>();
        for (Object[] result : results) {
            counts.put((Long) result[0], ((Number) result[1]).intValue());
        }
        return ResponseEntity.ok(counts);
    }
}
