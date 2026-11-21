package com.saanssaathi.app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 / Swagger UI Configuration for SaansSaathi REST APIs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI saansSaathiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SaansSaathi REST API")
                        .description("AI-Powered Urban Air Quality and Family Health Protection Platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SaansSaathi Dev Team")
                                .email("dev@saanssaathi.in"))
                        .license(new License().name("Educational / Apache 2.0")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components().addSecuritySchemes("Bearer Authentication", createSecurityScheme()));
    }

    private SecurityScheme createSecurityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer")
                .description("Enter your JWT token in the format: Bearer <token>");
    }
}
