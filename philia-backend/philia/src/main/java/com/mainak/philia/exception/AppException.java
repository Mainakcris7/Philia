package com.mainak.philia.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
public class AppException extends RuntimeException{
    private HttpStatus errorCode;
    public AppException(String message, HttpStatus errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
