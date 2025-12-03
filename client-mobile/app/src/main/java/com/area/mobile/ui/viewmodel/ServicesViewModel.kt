package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.model.Service
import com.area.mobile.data.repository.MockRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ServicesViewModel @Inject constructor(
    private val repository: MockRepository
) : ViewModel() {
    
    private val _services = MutableStateFlow<List<Service>>(emptyList())
    val services: StateFlow<List<Service>> = _services.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        loadServices()
    }
    
    fun loadServices() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                repository.getServices().collect { serviceList ->
                    _services.value = serviceList
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Failed to load services"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
