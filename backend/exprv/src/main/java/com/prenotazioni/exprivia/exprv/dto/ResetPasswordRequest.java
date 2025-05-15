package com.prenotazioni.exprivia.exprv.dto;

public record ResetPasswordRequest(String token, String newPassword) {}