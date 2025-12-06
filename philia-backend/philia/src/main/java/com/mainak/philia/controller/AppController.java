package com.mainak.philia.controller;

import com.mainak.philia.dto.app.SearchResultDto;
import com.mainak.philia.service.AppService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AppController {
    private final AppService service;

    @GetMapping("/search/{keyword}")
    public SearchResultDto searchByKeyword(@PathVariable String keyword) {
        return service.searchByKeyword(keyword);
    }
}
