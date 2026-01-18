package com.area.mobile.data.model.dto

// Request/Response DTOs for Admin operations

data class AdminUserDto(
    val id: String,
    val email: String,
    val name: String?,
    val role: String?,
    val googleId: String?,
    val createdAt: String?,
    val updatedAt: String?
)

data class UsersListResponse(
    val users: List<AdminUserDto>
)

data class CreateUserRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String = "user"
)

data class UpdateUserRequest(
    val name: String? = null,
    val email: String? = null,
    val password: String? = null,
    val role: String? = null
)

data class UserResponse(
    val user: AdminUserDto?,
    val message: String?
)

data class DeleteUserResponse(
    val message: String
)
