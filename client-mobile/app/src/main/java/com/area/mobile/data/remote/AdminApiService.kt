package com.area.mobile.data.remote

import com.area.mobile.data.model.dto.*
import retrofit2.Response
import retrofit2.http.*

interface AdminApiService {
    
    /**
     * Get all users (admin only)
     */
    @GET("users")
    suspend fun getAllUsers(): Response<UsersListResponse>
    
    /**
     * Create a new user (admin only)
     */
    @POST("users/create")
    suspend fun createUser(@Body request: CreateUserRequest): Response<UserResponse>
    
    /**
     * Update a user (admin only)
     */
    @PUT("users/{userId}")
    suspend fun updateUser(
        @Path("userId") userId: String,
        @Body request: UpdateUserRequest
    ): Response<UserResponse>
    
    /**
     * Delete a user (admin only)
     */
    @DELETE("users/{userId}")
    suspend fun deleteUser(@Path("userId") userId: String): Response<DeleteUserResponse>
    
    /**
     * Get a specific user
     */
    @GET("users/{userId}")
    suspend fun getUser(@Path("userId") userId: String): Response<UserResponse>
}
