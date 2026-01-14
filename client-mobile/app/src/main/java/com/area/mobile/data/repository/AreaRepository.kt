package com.area.mobile.data.repository

import com.area.mobile.data.model.Area
import com.area.mobile.data.model.dto.CreateAreaRequest
import com.area.mobile.data.model.dto.UpdateAreaRequest
import com.area.mobile.data.model.dto.AreaDto
import com.area.mobile.data.remote.AreasApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AreaRepository @Inject constructor(
    private val areasApiService: AreasApiService
) {
    
    private fun mapDtoToArea(dto: AreaDto): Area {
        return Area(
            id = dto.id,
            name = dto.name,
            actionServiceId = dto.actionService,
            actionServiceName = dto.actionService.capitalize(),
            actionId = dto.actionType,
            actionName = dto.actionType.replace("_", " ").capitalize(),
            actionIconName = getServiceIcon(dto.actionService),
            actionColor = getServiceColor(dto.actionService),
            reactionServiceId = dto.reactionService,
            reactionServiceName = dto.reactionService.capitalize(),
            reactionId = dto.reactionType,
            reactionName = dto.reactionType.replace("_", " ").capitalize(),
            reactionIconName = getServiceIcon(dto.reactionService),
            reactionColor = getServiceColor(dto.reactionService),
            isActive = dto.active,
            executionCount = 0, // Backend doesn't provide this yet
            lastExecution = "",
            createdAt = System.currentTimeMillis()
        )
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
    
    suspend fun getAreas(): Result<List<Area>> {
        return try {
            val response = areasApiService.getAreas()
            
            if (response.isSuccessful && response.body() != null) {
                val areas = response.body()!!.map { dto ->
                    mapDtoToArea(dto)
                }
                Result.success(areas)
            } else {
                Result.failure(Exception("Failed to fetch areas: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun getArea(id: String): Result<Area> {
        return try {
            val response = areasApiService.getArea(id)
            
            if (response.isSuccessful && response.body() != null) {
                val area = mapDtoToArea(response.body()!!)
                Result.success(area)
            } else {
                Result.failure(Exception("Failed to fetch area: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun createArea(
        name: String,
        actionService: String,
        actionType: String,
        reactionService: String,
        reactionType: String,
        parameters: Map<String, Any>,
        active: Boolean = true
    ): Result<Area> {
        return try {
            val request = CreateAreaRequest(
                name = name,
                actionService = actionService,
                actionType = actionType,
                reactionService = reactionService,
                reactionType = reactionType,
                parameters = parameters,
                active = active
            )
            
            val response = areasApiService.createArea(request)
            
            if (response.isSuccessful && response.body() != null) {
                val area = mapDtoToArea(response.body()!!)
                Result.success(area)
            } else {
                Result.failure(Exception("Failed to create area: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun toggleArea(id: String): Result<Area> {
        return try {
            val response = areasApiService.toggleArea(id)
            
            if (response.isSuccessful && response.body() != null) {
                val area = mapDtoToArea(response.body()!!)
                Result.success(area)
            } else {
                Result.failure(Exception("Failed to toggle area: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
    
    suspend fun deleteArea(id: String): Result<Unit> {
        return try {
            val response = areasApiService.deleteArea(id)
            
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete area: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.message}"))
        }
    }
}
