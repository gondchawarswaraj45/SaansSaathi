# ==============================================================================
# SaansSaathi Backend Multi-Stage Dockerfile
# Java 17 + Spring Boot 3 + SQLite Embedded Database Engine
# ==============================================================================

# Stage 1: Build JAR using Maven & Eclipse Temurin 17
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN apk add --no-cache maven
RUN mvn dependency:go-offline -B || true

# Copy source and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for container health checks & create persistent volume for SQLite
RUN apk add --no-cache curl && \
    mkdir -p /data && \
    chmod 777 /data

# Copy built JAR from builder
COPY --from=build /app/target/*.jar app.jar

# Persistent SQLite database mount point
VOLUME /data
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

ENV SPRING_PROFILES_ACTIVE=prod \
    DB_URL="jdbc:sqlite:/data/saanssaathi.db"

ENTRYPOINT ["java", \
  "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", \
  "-XX:MaxRAMPercentage=75", \
  "-XX:+UseContainerSupport", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
