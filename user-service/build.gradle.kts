plugins {
	java
	id("org.springframework.boot") version "3.5.6"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
description = "Demo project for Spring Boot"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-amqp")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.mysql:mysql-connector-j")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.amqp:spring-rabbit-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// Redis
    implementation(org.springframework.boot:spring-boot-starter-data-redis)
    
    // JWT
    implementation(io.jsonwebtoken:jjwt-api:0.12.3)
    runtimeOnly(io.jsonwebtoken:jjwt-impl:0.12.3)
    runtimeOnly(io.jsonwebtoken:jjwt-jackson:0.12.3)
    
    // Swagger/OpenAPI
    implementation(org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0)
}

tasks.withType<Test> {
	useJUnitPlatform()
}
