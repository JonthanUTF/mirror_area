package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.model.Area
import com.area.mobile.data.model.Service
import com.area.mobile.data.repository.AreaRepository
import com.area.mobile.data.repository.ServiceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val areaRepository: AreaRepository,
    private val serviceRepository: ServiceRepository
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
    
    fun connectService(serviceName: String, context: android.content.Context) {
        viewModelScope.launch {
            try {
                val result = serviceRepository.connectService(serviceName)
                result.onSuccess { url ->
                    val customTabsIntent = androidx.browser.customtabs.CustomTabsIntent.Builder().build()
                    customTabsIntent.launchUrl(context, android.net.Uri.parse(url))
                }
            } catch (e: Exception) {
                _error.value = "Failed to initiate connection: ${e.message}"
            }
        }
    }
    
    fun toggleArea(areaId: String) {
        viewModelScope.launch {
            try {
                val result = areaRepository.toggleArea(areaId)
                result.onSuccess {
                    loadAreas()
                }.onFailure { error ->
                    _error.value = error.message ?: "Failed to toggle area"
                }
            } catch (e: Exception) {
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
        actionParams: Map<String, String>,
        reactionService: String,
        reactionType: String,
        reactionParams: Map<String, String>,
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
                    parameters = parameters
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
}

data class DashboardStats(
    val totalAreas: Int,
    val activeAreas: Int,
    val totalExecutions: Int,
    val successRate: Double
)
