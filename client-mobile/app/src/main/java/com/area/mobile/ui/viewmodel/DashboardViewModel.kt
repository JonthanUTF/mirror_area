package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.local.TokenManager
import com.area.mobile.data.model.Area
import com.area.mobile.data.model.Service
import com.area.mobile.data.repository.AreaRepository
import com.area.mobile.data.repository.ServiceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val areaRepository: AreaRepository,
    private val serviceRepository: ServiceRepository,
    private val tokenManager: TokenManager
) : ViewModel() {
    
    private val _areas = MutableStateFlow<List<Area>>(emptyList())
    val areas: StateFlow<List<Area>> = _areas.asStateFlow()
    
    private val _services = MutableStateFlow<List<Service>>(emptyList())
    val services: StateFlow<List<Service>> = _services.asStateFlow()
    
    private val _connectedServices = MutableStateFlow<List<String>>(emptyList())
    val connectedServices: StateFlow<List<String>> = _connectedServices.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()
    
    init {
        loadAreas()
        loadServices()
        loadUserServices()
    }
    
    fun loadAreas() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val result = areaRepository.getAreas()
                result.onSuccess { areaList ->
                    _areas.value = areaList
                }.onFailure { error ->
                    _error.value = error.message ?: "Failed to load areas"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Failed to load areas"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun loadServices() {
        viewModelScope.launch {
            try {
                val result = serviceRepository.getAllServices()
                result.onSuccess { serviceList ->
                    _services.value = serviceList
                }.onFailure { error ->
                    // Silent fail for services, not critical
                }
            } catch (e: Exception) {
                // Silent fail
            }
        }
    }
    
    private val _oauthState = MutableStateFlow<OAuthState?>(null)
    val oauthState: StateFlow<OAuthState?> = _oauthState.asStateFlow()
    
    fun loadUserServices() {
        viewModelScope.launch {
            try {
                android.util.Log.d("DashboardViewModel", "Loading user services...")
                val result = serviceRepository.getUserServices()
                result.onSuccess { ids ->
                    android.util.Log.d("DashboardViewModel", "✓ Connected services loaded: $ids")
                    _connectedServices.value = ids
                }.onFailure { e ->
                    // Only show error if we're not just starting up, or maybe log it
                    android.util.Log.e("DashboardViewModel", "❌ Failed to load services: ${e.message}")
                }
            } catch (e: Exception) {
                android.util.Log.e("DashboardViewModel", "❌ Exception loading services: ${e.message}", e)
            }
        }
    }
    
    fun connectService(serviceName: String) {
        viewModelScope.launch {
            try {
                // For Twitch, use the same route as web frontend (/auth/twitch)
                if (serviceName.lowercase() == "twitch") {
                    val token = tokenManager.getToken().first()
                    if (token != null) {
                        // Use the same URL pattern as web: /auth/twitch?state=TOKEN
                        // Add "mobile:" prefix to state so backend knows to redirect to app
                        val authUrl = "http://localhost:8080/auth/twitch?state=mobile:$token"
                        _oauthState.value = OAuthState(
                            serviceName = serviceName,
                            authUrl = authUrl
                        )
                    } else {
                        _error.value = "Please login first"
                    }
                    return@launch
                }
                
                // For other services, use the /services/{name}/connect endpoint
                val result = serviceRepository.connectService(serviceName)
                result.onSuccess { url ->
                    // Set OAuth state so UI can show WebView
                    _oauthState.value = OAuthState(
                        serviceName = serviceName,
                        authUrl = url
                    )
                }.onFailure { error ->
                    _error.value = "Failed to get auth URL: ${error.message}"
                }
            } catch (e: Exception) {
                _error.value = "Failed to initiate connection: ${e.message}"
            }
        }
    }
    
    fun finalizeOAuthConnection(code: String) {
        val currentOAuthState = _oauthState.value ?: return
        
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // All services now use the same redirect URI pattern
                val redirectUri = "http://localhost:8081/services/callback"
                
                val result = serviceRepository.finalizeServiceConnection(
                    serviceName = currentOAuthState.serviceName,
                    code = code,
                    redirectUri = redirectUri
                )
                result.onSuccess {
                    _oauthState.value = null
                    _message.value = "Successfully connected to ${currentOAuthState.serviceName}"
                    loadUserServices() // Refresh connected services
                    _error.value = null
                }.onFailure { error ->
                    _error.value = "Failed to connect: ${error.message}"
                    _oauthState.value = null
                }
            } catch (e: Exception) {
                _error.value = "Connection failed: ${e.message}"
                _oauthState.value = null
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun cancelOAuth() {
        _oauthState.value = null
    }
    
    fun toggleArea(areaId: String) {
        viewModelScope.launch {
            try {
                android.util.Log.d("DashboardViewModel", "🔄 Toggling area: $areaId")
                
                // Optimistic UI update - update local state immediately
                val currentAreas = _areas.value.toMutableList()
                val areaIndex = currentAreas.indexOfFirst { it.id == areaId }
                if (areaIndex != -1) {
                    val area = currentAreas[areaIndex]
                    currentAreas[areaIndex] = area.copy(isActive = !area.isActive)
                    _areas.value = currentAreas
                    android.util.Log.d("DashboardViewModel", "✓ Optimistic update: ${area.name} -> ${!area.isActive}")
                }
                
                val result = areaRepository.toggleArea(areaId)
                result.onSuccess { updatedArea ->
                    android.util.Log.d("DashboardViewModel", "✓ Server confirmed toggle: ${updatedArea.name} -> ${updatedArea.isActive}")
                    loadAreas() // Refresh to get server state
                }.onFailure { error ->
                    android.util.Log.e("DashboardViewModel", "❌ Failed to toggle area: ${error.message}")
                    // Revert optimistic update on failure
                    loadAreas()
                    _error.value = error.message ?: "Failed to toggle area"
                }
            } catch (e: Exception) {
                android.util.Log.e("DashboardViewModel", "❌ Exception toggling area: ${e.message}", e)
                loadAreas() // Revert on exception
                _error.value = e.message ?: "An error occurred"
            }
        }
    }
    
    fun deleteArea(areaId: String) {
        viewModelScope.launch {
            try {
                val result = areaRepository.deleteArea(areaId)
                result.onSuccess {
                    loadAreas()
                }.onFailure { error ->
                    _error.value = error.message ?: "Failed to delete area"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "An error occurred"
            }
        }
    }
    
    fun createArea(
        name: String,
        actionService: String,
        actionType: String,
        actionParams: Map<String, Any>,
        reactionService: String,
        reactionType: String,
        reactionParams: Map<String, Any>,
        active: Boolean = true,
        onSuccess: () -> Unit = {}
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                // Merge parameters
                val parameters = actionParams + reactionParams
                
                val result = areaRepository.createArea(
                    name = name,
                    actionService = actionService,
                    actionType = actionType,
                    reactionService = reactionService,
                    reactionType = reactionType,
                    parameters = parameters,
                    active = active
                )
                result.onSuccess {
                    loadAreas()
                    onSuccess()
                }.onFailure { error ->
                    _error.value = error.message ?: "Failed to create area"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "An error occurred"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun getStats(): DashboardStats {
        val totalAreas = _areas.value.size
        val activeAreas = _areas.value.count { it.isActive }
        val totalExecutions = _areas.value.sumOf { it.executionCount }
        val successRate = if (totalExecutions > 0) 99.8 else 0.0
        
        return DashboardStats(
            totalAreas = totalAreas,
            activeAreas = activeAreas,
            totalExecutions = totalExecutions,
            successRate = successRate
        )
    }
    fun clearError() {
        _error.value = null
    }

    fun clearMessage() {
        _message.value = null
    }
}

data class DashboardStats(
    val totalAreas: Int,
    val activeAreas: Int,
    val totalExecutions: Int,
    val successRate: Double
)

data class OAuthState(
    val serviceName: String,
    val authUrl: String
)
