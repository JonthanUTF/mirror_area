package com.area.mobile.data.model

data class Service(
    val id: String,
    val name: String,
    val description: String,
    val iconName: String,
    val color: String,
    val isConnected: Boolean = false,
    val actions: List<ServiceAction> = emptyList(),
    val reactions: List<ServiceReaction> = emptyList()
)

data class ServiceAction(
    val id: String,
    val name: String,
    val description: String,
    val parameters: List<ActionParameter> = emptyList()
)

data class ServiceReaction(
    val id: String,
    val name: String,
    val description: String,
    val parameters: List<ReactionParameter> = emptyList()
)

data class ActionParameter(
    val name: String,
    val type: String,
    val description: String = "",
    val required: Boolean = true
)

data class ReactionParameter(
    val name: String,
    val type: String,
    val description: String = "",
    val required: Boolean = true
)
