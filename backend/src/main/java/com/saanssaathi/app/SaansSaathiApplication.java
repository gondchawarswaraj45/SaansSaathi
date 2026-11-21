package com.saanssaathi.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SaansSaathi - AI-Powered Urban Air Quality & Family Health Protection Platform
 *
 * "Breathe Better. Live Smarter."
 *
 * Stack: Spring Boot 3 + Java 21 + MySQL 8 + Gemini AI + OpenAQ API
 */
@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableAsync
public class SaansSaathiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SaansSaathiApplication.class, args);
    }
}
