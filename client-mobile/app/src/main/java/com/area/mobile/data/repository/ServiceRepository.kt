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
            // Fetch basic service info
            val availableResponse = servicesApiService.getAvailableServices()
            // Fetch detailed definitions (about.json)
            val aboutResponse = servicesApiService.getAboutJson()
            
            if (availableResponse.isSuccessful && availableResponse.body() != null && 
                aboutResponse.isSuccessful && aboutResponse.body() != null) {
                
                val availableServices = availableResponse.body()!!.services
                val aboutServices = aboutResponse.body()!!.server.services
                
                val services = availableServices.map { serviceDb ->
                    // Find matching service definition in about.json
                    val definition = aboutServices.find { it.name.equals(serviceDb.name, ignoreCase = true) }
                    
                    val actions = definition?.actions?.map { action ->
                        ServiceAction(
                            id = action.name,
                            name = action.name.replace("_", " ").replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() },
                            description = action.description,
                            parameters = action.options?.map { (key, value) ->
                                com.area.mobile.data.model.ActionParameter(
                                    name = key,
                                    type = value.toString(),
                                    description = "",
                                    required = true
                                )
                            } ?: emptyList()
                        )
                    } ?: emptyList()
                    
                    val reactions = definition?.reactions?.map { reaction ->
                        ServiceReaction(
                            id = reaction.name,
                            name = reaction.name.replace("_", " ").replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() },
                            description = reaction.description,
                            parameters = reaction.options?.map { (key, value) ->
                                com.area.mobile.data.model.ReactionParameter(
                                    name = key,
                                    type = value.toString(),
                                    description = "",
                                    required = true
                                )
                            } ?: emptyList()
                        )
                    } ?: emptyList()
                    
                    Service(
                        id = serviceDb.id,
                        name = serviceDb.name, // Use the system name (e.g. "google", "timer") as identifier
                        description = "Connect your ${serviceDb.label} account",
                        iconName = serviceDb.icon ?: getServiceIcon(serviceDb.name),
                        color = getServiceColor(serviceDb.name),
                        isConnected = false,
                        actions = actions,
                        reactions = reactions
                    )
                }
                Result.success(services)
            } else {
                Result.failure(Exception("Failed to fetch services"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    private fun String.capitalize(): String {
        return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
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
