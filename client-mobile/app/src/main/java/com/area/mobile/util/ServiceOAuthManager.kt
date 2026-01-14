package com.area.mobile.util

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Singleton to manage OAuth code returned from deep links for service connections.
 * This allows the code to be passed from MainActivity to any ViewModel that needs it.
 */
object ServiceOAuthManager {
    private val _pendingCode = MutableStateFlow<String?>(null)
    val pendingCode: StateFlow<String?> = _pendingCode.asStateFlow()
    
    private val _twitchConnected = MutableStateFlow(false)
    val twitchConnected: StateFlow<Boolean> = _twitchConnected.asStateFlow()
    
    fun setCode(code: String) {
        _pendingCode.value = code
    }
    
    fun consumeCode(): String? {
        val code = _pendingCode.value
        _pendingCode.value = null
        return code
    }
    
    fun clearCode() {
        _pendingCode.value = null
    }
    
    fun setTwitchConnected(connected: Boolean) {
        _twitchConnected.value = connected
    }
    
    fun consumeTwitchConnected(): Boolean {
        val connected = _twitchConnected.value
        _twitchConnected.value = false
        return connected
    }
}
