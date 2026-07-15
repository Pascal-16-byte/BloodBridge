package com.bloodbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BloodBridgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodBridgeApplication.class, args);
    }
}
