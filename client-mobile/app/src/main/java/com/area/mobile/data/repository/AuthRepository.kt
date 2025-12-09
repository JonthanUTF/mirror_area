package com.area.mobile.data.repository

import com.area.mobile.data.local.TokenManager
import com.area.mobile.data.model.User
import com.area.mobile.data.model.dto.LoginRequest
import com.area.mobile.data.model.dto.RegisterRequest
import com.area.mobile.data.remote.AuthApiService
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApiService: AuthApiService,
    private val tokenManager: TokenManager
) {
    suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = authApiService.login(LoginRequest(email, password))
            
            val body = response.body()
            if (response.isSuccessful && body != null) {
                tokenManager.saveToken(body.token)
                tokenManager.saveUserInfo(
                    id = body.user.id,
                    email = body.user.email,
                    name = body.user.name
                )
                
                val user = User(
                    id = body.user.id,
                    email = body.user.email,
                    name = body.user.name ?: "User",
                    createdAt = System.currentTimeMillis()
                )
                
                Result.success(user)
            } else {
                Result.failure(Exception("Login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun register(email: String, password: String, name: String): Result<User> {
        return try {
            val response = authApiService.register(RegisterRequest(email, password, name))
            
            val body = response.body()
            if (response.isSuccessful && body != null) {
                tokenManager.saveToken(body.token)
                tokenManager.saveUserInfo(
                    id = body.user.id,
                    email = body.user.email,
                    name = body.user.name
                )
                
                val user = User(
                    id = body.user.id,
                    email = body.user.email,
                    name = body.user.name ?: name,
                    createdAt = System.currentTimeMillis()
                )
                
                Result.success(user)
            } else {
                Result.failure(Exception("Registration failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun getCurrentUser(): User? {
        val userId = tokenManager.getUserId().first() ?: return null
        val email = tokenManager.getUserEmail().first() ?: return null
        val name = tokenManager.getUserName().first()
        
        return User(
            id = userId,
            email = email,
            name = name ?: "User",
            createdAt = System.currentTimeMillis()
        )
    }
    
    suspend fun logout() {
        tokenManager.clearAll()
    }
    
    suspend fun isLoggedIn(): Boolean {
        return tokenManager.getToken().first() != null
    }
}
