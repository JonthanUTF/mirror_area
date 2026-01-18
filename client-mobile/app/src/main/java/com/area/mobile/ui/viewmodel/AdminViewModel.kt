package com.area.mobile.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.area.mobile.data.model.dto.AdminUserDto
import com.area.mobile.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AdminViewModel @Inject constructor(
    private val adminRepository: AdminRepository
) : ViewModel() {
    
    // UI State
    private val _uiState = MutableStateFlow<AdminUiState>(AdminUiState.Idle)
    val uiState: StateFlow<AdminUiState> = _uiState.asStateFlow()
    
    // Users list
    private val _users = MutableStateFlow<List<AdminUserDto>>(emptyList())
    val users: StateFlow<List<AdminUserDto>> = _users.asStateFlow()
    
    // Loading state
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    // Error message
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    // Success message
    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()
    
    // Dialog state
    private val _dialogState = MutableStateFlow<AdminDialogState>(AdminDialogState.Hidden)
    val dialogState: StateFlow<AdminDialogState> = _dialogState.asStateFlow()
    
    init {
        loadUsers()
    }
    
    /**
     * Load all users from API
     */
    fun loadUsers() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            val result = adminRepository.getAllUsers()
            result.onSuccess { userList ->
                _users.value = userList.map { user ->
                    // Ensure role has a default value
                    user.copy(role = user.role ?: "user")
                }
                _uiState.value = AdminUiState.Success
            }.onFailure { error ->
                _errorMessage.value = error.message ?: "Failed to load users"
                _uiState.value = AdminUiState.Error(error.message ?: "Failed to load users")
            }
            
            _isLoading.value = false
        }
    }
    
    /**
     * Show dialog to create a new user
     */
    fun showCreateDialog() {
        _dialogState.value = AdminDialogState.Create
    }
    
    /**
     * Show dialog to edit an existing user
     */
    fun showEditDialog(user: AdminUserDto) {
        _dialogState.value = AdminDialogState.Edit(user)
    }
    
    /**
     * Show confirmation dialog to delete a user
     */
    fun showDeleteConfirmation(user: AdminUserDto) {
        _dialogState.value = AdminDialogState.DeleteConfirm(user)
    }
    
    /**
     * Hide any open dialog
     */
    fun hideDialog() {
        _dialogState.value = AdminDialogState.Hidden
    }
    
    /**
     * Create a new user
     */
    fun createUser(name: String, email: String, password: String, role: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            val result = adminRepository.createUser(name, email, password, role)
            result.onSuccess { newUser ->
                _successMessage.value = "User created successfully"
                hideDialog()
                loadUsers() // Refresh the list
            }.onFailure { error ->
                _errorMessage.value = error.message ?: "Failed to create user"
            }
            
            _isLoading.value = false
        }
    }
    
    /**
     * Update an existing user
     */
    fun updateUser(
        userId: String,
        name: String?,
        email: String?,
        password: String?,
        role: String?
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            val result = adminRepository.updateUser(userId, name, email, password, role)
            result.onSuccess { updatedUser ->
                _successMessage.value = "User updated successfully"
                hideDialog()
                loadUsers() // Refresh the list
            }.onFailure { error ->
                _errorMessage.value = error.message ?: "Failed to update user"
            }
            
            _isLoading.value = false
        }
    }
    
    /**
     * Delete a user
     */
    fun deleteUser(userId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            val result = adminRepository.deleteUser(userId)
            result.onSuccess {
                _successMessage.value = "User deleted successfully"
                hideDialog()
                loadUsers() // Refresh the list
            }.onFailure { error ->
                _errorMessage.value = error.message ?: "Failed to delete user"
            }
            
            _isLoading.value = false
        }
    }
    
    /**
     * Clear error message
     */
    fun clearError() {
        _errorMessage.value = null
    }
    
    /**
     * Clear success message
     */
    fun clearSuccess() {
        _successMessage.value = null
    }
    
    /**
     * Reset UI state
     */
    fun resetState() {
        _uiState.value = AdminUiState.Idle
    }
}

/**
 * UI State for Admin screen
 */
sealed class AdminUiState {
    object Idle : AdminUiState()
    object Loading : AdminUiState()
    object Success : AdminUiState()
    data class Error(val message: String) : AdminUiState()
}

/**
 * Dialog state for Admin screen
 */
sealed class AdminDialogState {
    object Hidden : AdminDialogState()
    object Create : AdminDialogState()
    data class Edit(val user: AdminUserDto) : AdminDialogState()
    data class DeleteConfirm(val user: AdminUserDto) : AdminDialogState()
}
