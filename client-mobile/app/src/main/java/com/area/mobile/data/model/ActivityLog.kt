package com.area.mobile.data.model

data class ActivityLog(
    val id: String,
    val areaId: String,
    val areaName: String,
    val status: ExecutionStatus,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)

enum class ExecutionStatus {
    SUCCESS,
    FAILED,
    PENDING
}
