package com.mainak.philia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class PhiliaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhiliaApplication.class, args);
	}

}
