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
    // List of services that require OAuth connection
    private val oauthServices = listOf("google", "github", "twitch", "microsoft", "discord", "dropbox", "twitter")
    
    fun requiresOAuth(serviceName: String): Boolean {
        return oauthServices.contains(serviceName.lowercase())
    }
    
    suspend fun getAllServices(): Result<List<Service>> {
        return try {
            // Fetch services directly from about.json (like web frontend)
            val aboutResponse = servicesApiService.getAboutJson()
            
            if (aboutResponse.isSuccessful && aboutResponse.body() != null) {
                val aboutServices = aboutResponse.body()!!.server.services
                
                // Map directly from about.json services (like web frontend does)
                val services = aboutServices.map { serviceInfo ->
                    val actions = serviceInfo.actions?.map { action ->
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
                    
                    val reactions = serviceInfo.reactions?.map { reaction ->
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
                        id = serviceInfo.name, // Use name as ID
                        name = serviceInfo.name,
                        description = "Connect your ${serviceInfo.name.replaceFirstChar { it.titlecase() }} account",
                        iconName = getServiceIcon(serviceInfo.name),
                        color = getServiceColor(serviceInfo.name),
                        isConnected = false,
                        actions = actions,
                        reactions = reactions
                    )
                }
                Result.success(services)
            } else {
                Result.failure(Exception("Failed to fetch services from about.json"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun getUserServices(): Result<List<String>> {
        return try {
            val response = servicesApiService.getUserServices()
            
            if (response.isSuccessful && response.body() != null) {
                // Server returns: [{service: {name: "google"}, connectedAt: ...}, ...]
                // We extract service names from connected services
                val connectedServiceNames = response.body()!!
                    .mapNotNull { it.service?.name }
                    .map { it.lowercase() }
                
                android.util.Log.d("ServiceRepository", "Connected services from API: $connectedServiceNames")
                Result.success(connectedServiceNames)
            } else {
                android.util.Log.e("ServiceRepository", "Failed to fetch user services: ${response.code()} - ${response.message()}")
                Result.failure(Exception("Failed to fetch user services: ${response.message()}"))
            }
        } catch (e: Exception) {
            android.util.Log.e("ServiceRepository", "Network error fetching user services: ${e.message}", e)
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
    
    suspend fun finalizeServiceConnection(serviceName: String, code: String, redirectUri: String): Result<Unit> {
        return try {
            val body = mapOf(
                "code" to code,
                "redirectUri" to redirectUri
            )
            val response = servicesApiService.serviceCallback(serviceName, body)
            
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to finalize connection: ${response.message()}"))
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
            "gmail", "google" -> "📧"
            "discord" -> "💬"
            "twitter" -> "🐦"
            "dropbox" -> "📦"
            "weather" -> "🌤️"
            "timer" -> "⏰"
            "twitch" -> "📺"
            "microsoft" -> "🪟"
            "console" -> "💻"
            else -> "🔌"
        }
    }
    
    private fun getServiceColor(serviceName: String): String {
        return when (serviceName.lowercase()) {
            "github" -> "#181717"
            "gmail", "google" -> "#EA4335"
            "discord" -> "#5865F2"
            "twitter" -> "#1DA1F2"
            "dropbox" -> "#0061FF"
            "weather" -> "#4A90E2"
            "timer" -> "#FF6B6B"
            "twitch" -> "#9146FF"
            "microsoft" -> "#00A4EF"
            "console" -> "#22C55E"
            else -> "#6B7280"
        }
    }
}
