package com.area.mobile.data.model.dto

data class AreaDto(
    val id: String,
    val userId: String,
    val name: String,
    val actionService: String,
    val actionType: String,
    val reactionService: String,
    val reactionType: String,
    val parameters: Map<String, Any>?,
    val active: Boolean,
    val createdAt: String?,
    val updatedAt: String?
)

data class AreasResponse(
    val areas: List<AreaDto>
)

data class AreaResponse(
    val area: AreaDto
)

data class CreateAreaRequest(
    val name: String,
    val actionService: String,
    val actionType: String,
    val reactionService: String,
    val reactionType: String,
    val parameters: Map<String, Any>? = null,
    val actionParams: Map<String, Any>? = null,
    val reactionParams: Map<String, Any>? = null,
    val active: Boolean = true
)

data class UpdateAreaRequest(
    val name: String?,
    val actionService: String?,
    val actionType: String?,
    val reactionService: String?,
    val reactionType: String?,
    val parameters: Map<String, Any>?,
    val actionParams: Map<String, Any>?,
    val reactionParams: Map<String, Any>?,
    val active: Boolean?
)
