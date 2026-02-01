package com.elevateconnect.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private Long receiverId;
    private String message;
    private String mediaUrl;
    private String mediaType;
}
