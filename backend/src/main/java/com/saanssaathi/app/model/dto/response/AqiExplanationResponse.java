package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AqiExplanationResponse {

    private String term;
    private String fullName;
    private String meaning;
    private String primarySources;
    private String healthImpact;
    private String safeThreshold;
    private List<String> protectionActions;
    private String scientificCitation;
}
