package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionResponse {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    private Integer messageCount;
}
