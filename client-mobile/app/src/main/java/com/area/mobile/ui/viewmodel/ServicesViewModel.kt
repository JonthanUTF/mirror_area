package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.local.TokenManager
import com.area.mobile.data.model.Service
import com.area.mobile.data.repository.ServiceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ServicesViewModel @Inject constructor(
    private val serviceRepository: ServiceRepository,
    private val tokenManager: TokenManager
) : ViewModel() {
    
    private val _rawServices = MutableStateFlow<List<Service>>(emptyList())
    private val _connectedServices = MutableStateFlow<List<String>>(emptyList())
    
    // Combine raw services with connected status
    val services: StateFlow<List<Service>> = combine(_rawServices, _connectedServices) { services, connected ->
        services.map { service ->
            service.copy(isConnected = connected.any { it.equals(service.name, ignoreCase = true) })
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()
    
    private val _oauthState = MutableStateFlow<OAuthState?>(null)
    val oauthState: StateFlow<OAuthState?> = _oauthState.asStateFlow()
    
    init {
        loadServices()
        loadUserServices()
    }
    
    fun loadServices() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val result = serviceRepository.getAllServices()
                result.onSuccess { serviceList ->
                    _rawServices.value = serviceList
                }.onFailure { exception ->
                    // Silent fail if we have data, otherwise show error
                    if (_rawServices.value.isEmpty()) {
                        _error.value = exception.message ?: "Failed to load services"
                    }
                }
            } catch (e: Exception) {
                 if (_rawServices.value.isEmpty()) {
                    _error.value = e.message ?: "Failed to load services"
                }
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun loadUserServices() {
        viewModelScope.launch {
            try {
                val result = serviceRepository.getUserServices()
                result.onSuccess { ids ->
                    _connectedServices.value = ids
                }
            } catch (e: Exception) {
                // Silent fail
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
                
                val result = serviceRepository.connectService(serviceName)
                result.onSuccess { url ->
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
                val redirectUri = "http://localhost:8081/services/callback"
                
                val result = serviceRepository.finalizeServiceConnection(
                    serviceName = currentOAuthState.serviceName,
                    code = code,
                    redirectUri = redirectUri
                )
                result.onSuccess {
                    _oauthState.value = null
                    _message.value = "Successfully connected to ${currentOAuthState.serviceName}"
                    loadUserServices()
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
    
    fun disconnectService(serviceName: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // Ideally this should use an endpoint that takes service name
                // If the repository needs ID or Name, we should check ServiceRepository
                val result = serviceRepository.disconnectService(serviceName)
                result.onSuccess {
                    _message.value = "Disconnected from $serviceName"
                    loadUserServices()
                }.onFailure { error ->
                    _error.value = "Failed to disconnect: ${error.message}"
                }
            } catch (e: Exception) {
                _error.value = "Failed to disconnect: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun cancelOAuth() {
        _oauthState.value = null
    }

    fun clearError() {
        _error.value = null
    }
    
    fun clearMessage() {
        _message.value = null
    }

    // Helper to manually refresh on screen enter
    fun refresh() {
        loadServices()
        loadUserServices()
    }
}
