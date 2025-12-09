package com.area.mobile.data.repository

import com.area.mobile.data.model.Service
import com.area.mobile.data.model.ServiceAction
import com.area.mobile.data.model.ServiceReaction
import com.area.mobile.data.remote.ServicesApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ServiceRepository @Inject constructor(
    private val servicesApiService: ServicesApiService
) {
    suspend fun getAllServices(): Result<List<Service>> {
        return try {
            val response = servicesApiService.getAvailableServices()
            
            if (response.isSuccessful && response.body() != null) {
                val services = response.body()!!.services.map { serviceDb ->
                    Service(
                        id = serviceDb.id,
                        name = serviceDb.label,
                        description = "Connect your ${serviceDb.label} account",
                        iconName = serviceDb.icon ?: getServiceIcon(serviceDb.name),
                        color = getServiceColor(serviceDb.name),
                        isConnected = false, // Will be updated with user services
                        actions = emptyList(), // Actions from about.json if needed
                        reactions = emptyList() // Reactions from about.json if needed
                    )
                }
                Result.success(services)
            } else {
                Result.failure(Exception("Failed to fetch services: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun getUserServices(): Result<List<String>> {
        return try {
            val response = servicesApiService.getUserServices()
            
            if (response.isSuccessful && response.body() != null) {
                val connectedServiceIds = response.body()!!
                    .filter { it.connected }
                    .map { it.serviceName ?: it.serviceId }
                Result.success(connectedServiceIds)
            } else {
                Result.failure(Exception("Failed to fetch user services: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun connectService(serviceName: String): Result<String> {
        return try {
            val response = servicesApiService.connectService(serviceName)
            
            if (response.isSuccessful && response.body() != null) {
                val url = response.body()!!.url
                Result.success(url)
            } else {
                Result.failure(Exception("Failed to connect service: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun disconnectService(serviceId: String): Result<Unit> {
        return try {
            val response = servicesApiService.disconnectService(serviceId)
            
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to disconnect service: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    private fun getServiceIcon(serviceName: String): String {
        return when (serviceName.lowercase()) {
            "github" -> "🐙"
            "gmail" -> "📧"
            "google" -> "🔍"
            "discord" -> "💬"
            "twitter" -> "🐦"
            "dropbox" -> "📦"
            "weather" -> "🌤️"
            "timer" -> "⏰"
            else -> "🔌"
        }
    }
    
    private fun getServiceColor(serviceName: String): String {
        return when (serviceName.lowercase()) {
            "github" -> "#181717"
            "gmail" -> "#EA4335"
            "google" -> "#4285F4"
            "discord" -> "#5865F2"
            "twitter" -> "#1DA1F2"
            "dropbox" -> "#0061FF"
            "weather" -> "#4A90E2"
            "timer" -> "#FF6B6B"
            else -> "#6B7280"
        }
    }
}
