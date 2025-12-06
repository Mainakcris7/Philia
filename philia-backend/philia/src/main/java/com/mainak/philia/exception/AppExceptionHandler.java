package com.mainak.philia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class AppExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, Object>> handleAppException(AppException ex) {

        Map<String, Object> errMap = Map.of(
                "error", "Philia Application Error",
                "message", ex.getMessage(),
                "errorCode", ex.getErrorCode().value()
        );
        return ResponseEntity.status(ex.getErrorCode()).body(errMap);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> err = new HashMap<>();

        err.put("error", "Field Validation Error");
        ex.getBindingResult().getFieldErrors().forEach(e -> {
            err.put(e.getField(), e.getDefaultMessage());
        });
        err.put("errorCode", 400);
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAuthorizationException(AuthorizationDeniedException ex) {

        Map<String, Object> errMap = Map.of(
                "error", "Authorization Error",
                "message", ex.getMessage(),
                "errorCode", 403
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errMap);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(RuntimeException ex) {

        Map<String, Object> errMap = Map.of(
                "error", "Philia Server Error",
                "message", ex.getMessage(),
                "errorCode", 500
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errMap);
    }
}
