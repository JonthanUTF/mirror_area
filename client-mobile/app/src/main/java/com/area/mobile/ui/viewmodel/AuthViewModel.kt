package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.model.User
import com.area.mobile.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()
    
    init {
        // Load current user if logged in
        viewModelScope.launch {
            val user = authRepository.getCurrentUser()
            _currentUser.value = user
        }
    }
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            try {
                val result = authRepository.login(email, password)
                result.onSuccess { user ->
                    _currentUser.value = user
                    _uiState.value = AuthUiState.Success(user)
                }.onFailure { error ->
                    _uiState.value = AuthUiState.Error(error.message ?: "Login failed")
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(e.message ?: "An error occurred")
            }
        }
    }
    
    fun register(name: String, email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            try {
                val result = authRepository.register(email, password, name)
                result.onSuccess { user ->
                    _currentUser.value = user
                    _uiState.value = AuthUiState.Success(user)
                }.onFailure { error ->
                    _uiState.value = AuthUiState.Error(error.message ?: "Registration failed")
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(e.message ?: "An error occurred")
            }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _currentUser.value = null
            _uiState.value = AuthUiState.Idle
        }
    }
    
    fun refreshCurrentUser() {
        viewModelScope.launch {
            val result = authRepository.fetchCurrentUser()
            result.onSuccess { user ->
                _currentUser.value = user
            }.onFailure {
                // Si l'appel API échoue, essayer de charger depuis le cache local
                val user = authRepository.getCurrentUser()
                _currentUser.value = user
            }
        }
    }
    
    fun resetState() {
        _uiState.value = AuthUiState.Idle
    }
}

sealed class AuthUiState {
    object Idle : AuthUiState()
    object Loading : AuthUiState()
    data class Success(val user: User) : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}
