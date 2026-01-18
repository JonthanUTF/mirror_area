package com.area.mobile.data.repository

import android.util.Log
import com.area.mobile.data.model.dto.*
import com.area.mobile.data.remote.AdminApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdminRepository @Inject constructor(
    private val adminApiService: AdminApiService
) {
    companion object {
        private const val TAG = "AdminRepository"
    }
    
    /**
     * Fetch all users from the API
     */
    suspend fun getAllUsers(): Result<List<AdminUserDto>> {
        return try {
            val response = adminApiService.getAllUsers()
            if (response.isSuccessful) {
                val users = response.body()?.users ?: emptyList()
                Log.d(TAG, "Fetched ${users.size} users")
                Result.success(users)
            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e(TAG, "Failed to fetch users: $errorBody")
                Result.failure(Exception(parseErrorMessage(errorBody, response.code())))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception fetching users", e)
            Result.failure(e)
        }
    }
    
    /**
     * Create a new user
     */
    suspend fun createUser(name: String, email: String, password: String, role: String): Result<AdminUserDto> {
        return try {
            val request = CreateUserRequest(
                name = name,
                email = email,
                password = password,
                role = role
            )
            val response = adminApiService.createUser(request)
            if (response.isSuccessful) {
                val user = response.body()?.user
                if (user != null) {
                    Log.d(TAG, "Created user: ${user.email}")
                    Result.success(user)
                } else {
                    Result.failure(Exception("User creation returned empty response"))
                }
            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e(TAG, "Failed to create user: $errorBody")
                Result.failure(Exception(parseErrorMessage(errorBody, response.code())))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception creating user", e)
            Result.failure(e)
        }
    }
    
    /**
     * Update an existing user
     */
    suspend fun updateUser(
        userId: String,
        name: String? = null,
        email: String? = null,
        password: String? = null,
        role: String? = null
    ): Result<AdminUserDto> {
        return try {
            val request = UpdateUserRequest(
                name = name,
                email = email,
                password = if (password.isNullOrBlank()) null else password,
                role = role
            )
            val response = adminApiService.updateUser(userId, request)
            if (response.isSuccessful) {
                val user = response.body()?.user
                if (user != null) {
                    Log.d(TAG, "Updated user: ${user.email}")
                    Result.success(user)
                } else {
                    Result.failure(Exception("User update returned empty response"))
                }
            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e(TAG, "Failed to update user: $errorBody")
                Result.failure(Exception(parseErrorMessage(errorBody, response.code())))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception updating user", e)
            Result.failure(e)
        }
    }
    
    /**
     * Delete a user
     */
    suspend fun deleteUser(userId: String): Result<Unit> {
        return try {
            val response = adminApiService.deleteUser(userId)
            if (response.isSuccessful) {
                Log.d(TAG, "Deleted user: $userId")
                Result.success(Unit)
            } else {
                val errorBody = response.errorBody()?.string() ?: "Unknown error"
                Log.e(TAG, "Failed to delete user: $errorBody")
                Result.failure(Exception(parseErrorMessage(errorBody, response.code())))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception deleting user", e)
            Result.failure(e)
        }
    }
    
    /**
     * Parse error message from API response
     */
    private fun parseErrorMessage(errorBody: String, code: Int): String {
        return try {
            // Try to parse JSON error
            if (errorBody.contains("error")) {
                val regex = """"error"\s*:\s*"([^"]+)"""".toRegex()
                val match = regex.find(errorBody)
                match?.groupValues?.get(1) ?: "Request failed ($code)"
            } else if (errorBody.contains("message")) {
                val regex = """"message"\s*:\s*"([^"]+)"""".toRegex()
                val match = regex.find(errorBody)
                match?.groupValues?.get(1) ?: "Request failed ($code)"
            } else {
                when (code) {
                    401 -> "Unauthorized - Please login again"
                    403 -> "Admin privileges required"
                    404 -> "User not found"
                    500 -> "Server error"
                    else -> "Request failed ($code)"
                }
            }
        } catch (e: Exception) {
            "Request failed ($code)"
        }
    }
}
