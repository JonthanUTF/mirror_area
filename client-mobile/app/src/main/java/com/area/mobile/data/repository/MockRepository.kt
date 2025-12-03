package com.area.mobile.data.repository

import com.area.mobile.data.model.User
import kotlinx.coroutines.delay
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MockRepository @Inject constructor() {
    
    suspend fun login(email: String, password: String): Result<User> {
        // Simulate network delay
        delay(1000)
        
        return if (email.isNotEmpty() && password.isNotEmpty()) {
            Result.success(
                User(
                    id = "mock-user-${System.currentTimeMillis()}",
                    name = "Test User",
                    email = email
                )
            )
        } else {
            Result.failure(Exception("Invalid credentials"))
        }
    }
    
    suspend fun register(name: String, email: String, password: String): Result<User> {
        // Simulate network delay
        delay(1000)
        
        return if (name.isNotEmpty() && email.isNotEmpty() && password.isNotEmpty()) {
            Result.success(
                User(
                    id = "mock-user-${System.currentTimeMillis()}",
                    name = name,
                    email = email
                )
            )
        } else {
            Result.failure(Exception("Invalid registration data"))
        }
    }
}
