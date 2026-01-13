package com.area.mobile.data.model.dto

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String
)

data class AuthResponse(
    val message: String,
    val token: String,
    val user: UserDto
)

data class MeResponse(
    val user: UserDto
)

data class UserDto(
    val id: String,
    val email: String,
    val name: String?
)
