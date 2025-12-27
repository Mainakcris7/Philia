package com.mainak.philia.controller;

import com.mainak.philia.dto.app.SearchResultDto;
import com.mainak.philia.service.AppService;
import com.mainak.philia.service.ai.AiService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AppController {
    private final AppService service;
    private final AiService aiService;

    @GetMapping("/search/{keyword}")
    public SearchResultDto searchByKeyword(@PathVariable String keyword) {
        return service.searchByKeyword(keyword);
    }

    @GetMapping("/ai/enhance-content")
    public ResponseEntity<String> enhancePrompt(
            @RequestParam("content") String content,
            @RequestParam("tone") String tone,
            @RequestParam("type") String type
    ){
        return aiService.enhanceContent(content, tone, type);
    }

}
