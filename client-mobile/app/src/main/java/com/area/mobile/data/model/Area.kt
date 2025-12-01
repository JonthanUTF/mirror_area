package com.area.mobile.data.model

data class Area(
    val id: String,
    val name: String,
    val actionServiceId: String,
    val actionServiceName: String,
    val actionId: String,
    val actionName: String,
    val actionIconName: String,
    val actionColor: String,
    val reactionServiceId: String,
    val reactionServiceName: String,
    val reactionId: String,
    val reactionName: String,
    val reactionIconName: String,
    val reactionColor: String,
    val isActive: Boolean = true,
    val executionCount: Int = 0,
    val lastExecution: String = "",
    val createdAt: Long = System.currentTimeMillis()
)
