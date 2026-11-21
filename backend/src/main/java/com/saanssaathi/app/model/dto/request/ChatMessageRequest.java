package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {

    private Long sessionId;

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private Integer currentAqi;
    private String city;
}
