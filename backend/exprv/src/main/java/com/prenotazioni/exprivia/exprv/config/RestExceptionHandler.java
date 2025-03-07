package com.prenotazioni.exprivia.exprv.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.prenotazioni.exprivia.exprv.dtos.ErrorDto;
import com.prenotazioni.exprivia.exprv.exceptions.AppException;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = { AppException.class })
    public ResponseEntity<ErrorDto> handleException(AppException ex) {
        return ResponseEntity.status(ex.getHttpStatus())
                .body(new ErrorDto(ex.getMessage()));
    }
}