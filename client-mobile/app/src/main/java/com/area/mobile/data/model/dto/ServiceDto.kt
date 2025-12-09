package com.area.mobile.data.model.dto

data class ServiceDto(
    val id: String,
    val name: String,
    val description: String?,
    val icon: String?,
    val color: String?,
    val available: Boolean
)

data class UserServiceDto(
    val id: String,
    val userId: String,
    val serviceId: String,
    val serviceName: String?,
    val connected: Boolean,
    val connectedAt: String?
)

data class ServiceConnectionResponse(
    val url: String
)

data class AvailableServicesResponse(
    val services: List<ServiceDbDto>
)

data class ServiceDbDto(
    val id: String,
    val name: String,
    val label: String,
    val icon: String?
)

data class AboutJsonResponse(
    val client: ClientInfo,
    val server: ServerInfo
)

data class ClientInfo(
    val host: String
)

data class ServerInfo(
    val current_time: Long,
    val services: List<ServiceInfo>
)

data class ServiceInfo(
    val name: String,
    val actions: List<ActionInfo>,
    val reactions: List<ReactionInfo>
)

data class ActionInfo(
    val name: String,
    val description: String
)

data class ReactionInfo(
    val name: String,
    val description: String
)
