package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.model.Area
import com.area.mobile.data.repository.MockRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: MockRepository
) : ViewModel() {
    
    private val _areas = MutableStateFlow<List<Area>>(emptyList())
    val areas: StateFlow<List<Area>> = _areas.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        loadAreas()
    }
    
    fun loadAreas() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                repository.getAreas().collect { areaList ->
                    _areas.value = areaList
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Failed to load areas"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun toggleArea(areaId: String) {
        viewModelScope.launch {
            try {
                val result = repository.toggleArea(areaId)
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
                val result = repository.deleteArea(areaId)
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
    
    fun getStats(): DashboardStats {
        val totalAreas = _areas.value.size
        val activeAreas = _areas.value.count { it.isActive }
        val totalExecutions = _areas.value.sumOf { it.executionCount }
        val successRate = 99.8
        
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
