package com.area.mobile.data.repository

import com.area.mobile.data.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MockRepository @Inject constructor() {
    
    private val mockServices = listOf(
        Service(
            id = "github",
            name = "GitHub",
            description = "Connect your GitHub account",
            iconName = "github",
            color = "#6e5494",
            isConnected = true,
            actions = listOf(
                ServiceAction("github_pr", "New Pull Request", "Triggers when a new PR is created"),
                ServiceAction("github_issue", "New Issue", "Triggers when a new issue is opened"),
                ServiceAction("github_push", "Push to Branch", "Triggers on git push")
            ),
            reactions = listOf(
                ServiceReaction("github_comment", "Add Comment", "Add a comment to an issue or PR"),
                ServiceReaction("github_label", "Add Label", "Add a label to an issue")
            )
        ),
        Service(
            id = "discord",
            name = "Discord",
            description = "Send messages to Discord",
            iconName = "discord",
            color = "#5865F2",
            isConnected = true,
            actions = listOf(
                ServiceAction("discord_message", "New Message", "Triggers on new message in channel")
            ),
            reactions = listOf(
                ServiceReaction("discord_send", "Send Message", "Send a message to a channel"),
                ServiceReaction("discord_embed", "Send Embed", "Send a rich embed message")
            )
        ),
        Service(
            id = "gmail",
            name = "Gmail",
            description = "Automate your emails",
            iconName = "gmail",
            color = "#EA4335",
            isConnected = false,
            actions = listOf(
                ServiceAction("gmail_new", "New Email", "Triggers when receiving a new email"),
                ServiceAction("gmail_attachment", "Email with Attachment", "Triggers when email has attachments")
            ),
            reactions = listOf(
                ServiceReaction("gmail_send", "Send Email", "Send an email"),
                ServiceReaction("gmail_reply", "Reply to Email", "Reply to an email")
            )
        ),
        Service(
            id = "drive",
            name = "Google Drive",
            description = "Manage your files",
            iconName = "drive",
            color = "#4285F4",
            isConnected = false,
            actions = listOf(
                ServiceAction("drive_new_file", "New File", "Triggers when a new file is added")
            ),
            reactions = listOf(
                ServiceReaction("drive_upload", "Upload File", "Upload a file to Drive"),
                ServiceReaction("drive_create_folder", "Create Folder", "Create a new folder")
            )
        ),
        Service(
            id = "weather",
            name = "Weather",
            description = "Get weather updates",
            iconName = "weather",
            color = "#00BCD4",
            isConnected = true,
            actions = listOf(
                ServiceAction("weather_rain", "Rain Forecast", "Triggers when rain is forecasted"),
                ServiceAction("weather_temp", "Temperature Change", "Triggers on temperature change")
            )
        ),
        Service(
            id = "timer",
            name = "Timer",
            description = "Schedule automations",
            iconName = "timer",
            color = "#9C27B0",
            isConnected = true,
            actions = listOf(
                ServiceAction("timer_daily", "Daily Timer", "Triggers at a specific time daily"),
                ServiceAction("timer_interval", "Interval Timer", "Triggers at regular intervals")
            )
        )
    )
    
    private val mockAreas = mutableListOf(
        Area(
            id = "1",
            name = "GitHub PR to Discord",
            actionServiceId = "github",
            actionServiceName = "GitHub",
            actionId = "github_pr",
            actionName = "New Pull Request",
            actionIconName = "github",
            actionColor = "#6e5494",
            reactionServiceId = "discord",
            reactionServiceName = "Discord",
            reactionId = "discord_send",
            reactionName = "Send Message",
            reactionIconName = "discord",
            reactionColor = "#5865F2",
            isActive = true,
            executionCount = 142,
            lastExecution = "5 minutes ago"
        ),
        Area(
            id = "2",
            name = "Gmail to Drive Backup",
            actionServiceId = "gmail",
            actionServiceName = "Gmail",
            actionId = "gmail_attachment",
            actionName = "Email with Attachment",
            actionIconName = "gmail",
            actionColor = "#EA4335",
            reactionServiceId = "drive",
            reactionServiceName = "Google Drive",
            reactionId = "drive_upload",
            reactionName = "Upload File",
            reactionIconName = "drive",
            reactionColor = "#4285F4",
            isActive = true,
            executionCount = 89,
            lastExecution = "1 hour ago"
        ),
        Area(
            id = "3",
            name = "Weather Alert",
            actionServiceId = "weather",
            actionServiceName = "Weather",
            actionId = "weather_rain",
            actionName = "Rain Forecast",
            actionIconName = "weather",
            actionColor = "#00BCD4",
            reactionServiceId = "discord",
            reactionServiceName = "Discord",
            reactionId = "discord_send",
            reactionName = "Send Alert",
            reactionIconName = "discord",
            reactionColor = "#5865F2",
            isActive = false,
            executionCount = 24,
            lastExecution = "3 hours ago"
        ),
        Area(
            id = "4",
            name = "Daily Standup",
            actionServiceId = "timer",
            actionServiceName = "Timer",
            actionId = "timer_daily",
            actionName = "Every Weekday 9 AM",
            actionIconName = "timer",
            actionColor = "#9C27B0",
            reactionServiceId = "discord",
            reactionServiceName = "Discord",
            reactionId = "discord_send",
            reactionName = "Send Message",
            reactionIconName = "discord",
            reactionColor = "#5865F2",
            isActive = true,
            executionCount = 156,
            lastExecution = "Today at 9:00 AM"
        )
    )
    
    private val mockActivities = listOf(
        ActivityLog(
            id = "1",
            areaId = "1",
            areaName = "GitHub PR to Discord",
            status = ExecutionStatus.SUCCESS,
            message = "Successfully sent notification to Discord",
            timestamp = System.currentTimeMillis() - 300000
        ),
        ActivityLog(
            id = "2",
            areaId = "2",
            areaName = "Gmail to Drive Backup",
            status = ExecutionStatus.SUCCESS,
            message = "File uploaded to Drive successfully",
            timestamp = System.currentTimeMillis() - 3600000
        ),
        ActivityLog(
            id = "3",
            areaId = "4",
            areaName = "Daily Standup",
            status = ExecutionStatus.SUCCESS,
            message = "Daily reminder sent",
            timestamp = System.currentTimeMillis() - 7200000
        )
    )
    
    fun getServices(): Flow<List<Service>> = flow {
        delay(500)
        emit(mockServices)
    }
    
    fun getAreas(): Flow<List<Area>> = flow {
        delay(500)
        emit(mockAreas)
    }
    
    fun getActivities(): Flow<List<ActivityLog>> = flow {
        delay(500)
        emit(mockActivities)
    }
    
    suspend fun login(email: String, password: String): Result<User> {
        delay(1000)
        return Result.success(
            User(
                id = "user_1",
                email = email,
                name = "John Doe"
            )
        )
    }
    
    suspend fun register(name: String, email: String, password: String): Result<User> {
        delay(1000)
        return Result.success(
            User(
                id = "user_${System.currentTimeMillis()}",
                email = email,
                name = name
            )
        )
    }
    
    suspend fun toggleArea(areaId: String): Result<Area> {
        delay(300)
        val area = mockAreas.find { it.id == areaId }
        return if (area != null) {
            val updatedArea = area.copy(isActive = !area.isActive)
            val index = mockAreas.indexOfFirst { it.id == areaId }
            mockAreas[index] = updatedArea
            Result.success(updatedArea)
        } else {
            Result.failure(Exception("Area not found"))
        }
    }
    
    suspend fun createArea(area: Area): Result<Area> {
        delay(500)
        mockAreas.add(area)
        return Result.success(area)
    }
    
    suspend fun deleteArea(areaId: String): Result<Unit> {
        delay(300)
        mockAreas.removeIf { it.id == areaId }
        return Result.success(Unit)
    }
}
