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

    @GetMapping("/conversation/{partnerId}")
    public List<Chat> getConversation(@PathVariable long partnerId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        return chatRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
                userId, partnerId, userId, partnerId);
    }

    @GetMapping("/alumni")
    public List<ChatPartnerDTO> getAlumni() {
        return userRepository.findByRole(Role.ALUMNI).stream()
                .map(u -> new ChatPartnerDTO(u.getId(), u.getName(), u.getEmail(), "ALUMNI", ""))
                .collect(Collectors.toList());
    }

    @GetMapping("/recent")
    public List<ChatPartnerDTO> getRecentChats() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = currentUser.getId();

        // Simplified Logic: Fetch all users but for now just fallback to returning all
        // Alumni/Students
        // In a real app, query "active chats" from ChatRepository
        // For now, let's just return all users except self to allow starting chats
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .map(u -> new ChatPartnerDTO(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), "")) // Use
                                                                                                            // .name()
                .collect(Collectors.toList());
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

        chatRepository.save(chat);
        return ResponseEntity.ok(chat);
    }
}
