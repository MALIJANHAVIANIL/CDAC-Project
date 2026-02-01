package com.elevateconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ElevateConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElevateConnectApplication.class, args);
	}

}
