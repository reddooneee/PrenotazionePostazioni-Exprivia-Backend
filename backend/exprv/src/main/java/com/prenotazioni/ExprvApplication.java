package com.prenotazioni;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.prenotazioni.exprivia.exprv")
public class ExprvApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExprvApplication.class, args);
	}
}