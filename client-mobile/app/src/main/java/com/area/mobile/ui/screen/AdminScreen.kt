package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import com.area.mobile.data.model.dto.AdminUserDto
import com.area.mobile.ui.theme.*
import com.area.mobile.ui.viewmodel.AdminDialogState
import com.area.mobile.ui.viewmodel.AdminViewModel

@Composable
fun AdminScreen(
    paddingValues: PaddingValues,
    viewModel: AdminViewModel = hiltViewModel()
) {
    val users by viewModel.users.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    val dialogState by viewModel.dialogState.collectAsState()
    
    // Snackbar state
    val snackbarHostState = remember { SnackbarHostState() }
    
    // Show error snackbar
    LaunchedEffect(errorMessage) {
        errorMessage?.let { message ->
            snackbarHostState.showSnackbar(
                message = message,
                duration = SnackbarDuration.Short
            )
            viewModel.clearError()
        }
    }
    
    // Show success snackbar
    LaunchedEffect(successMessage) {
        successMessage?.let { message ->
            snackbarHostState.showSnackbar(
                message = message,
                duration = SnackbarDuration.Short
            )
            viewModel.clearSuccess()
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues)
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Header
            AdminHeader(
                onCreateClick = { viewModel.showCreateDialog() },
                onRefreshClick = { viewModel.loadUsers() },
                isLoading = isLoading
            )
            
            // Content
            if (isLoading && users.isEmpty()) {
                // Loading state
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = PurplePrimary)
                }
            } else if (users.isEmpty()) {
                // Empty state
                EmptyUsersState(onRefresh = { viewModel.loadUsers() })
            } else {
                // Users list
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(users, key = { it.id }) { user ->
                        UserCard(
                            user = user,
                            onEditClick = { viewModel.showEditDialog(user) },
                            onDeleteClick = { viewModel.showDeleteConfirmation(user) }
                        )
                    }
                    
                    // Bottom spacing
                    item {
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
        
        // Snackbar host
        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
        
        // Dialogs
        when (val state = dialogState) {
            is AdminDialogState.Create -> {
                UserFormDialog(
                    title = "Create User",
                    user = null,
                    onDismiss = { viewModel.hideDialog() },
                    onSubmit = { name, email, password, role ->
                        viewModel.createUser(name, email, password, role)
                    },
                    isLoading = isLoading
                )
            }
            is AdminDialogState.Edit -> {
                UserFormDialog(
                    title = "Edit User",
                    user = state.user,
                    onDismiss = { viewModel.hideDialog() },
                    onSubmit = { name, email, password, role ->
                        viewModel.updateUser(state.user.id, name, email, password, role)
                    },
                    isLoading = isLoading
                )
            }
            is AdminDialogState.DeleteConfirm -> {
                DeleteConfirmDialog(
                    user = state.user,
                    onDismiss = { viewModel.hideDialog() },
                    onConfirm = { viewModel.deleteUser(state.user.id) },
                    isLoading = isLoading
                )
            }
            AdminDialogState.Hidden -> { /* No dialog */ }
        }
    }
}

@Composable
private fun AdminHeader(
    onCreateClick: () -> Unit,
    onRefreshClick: () -> Unit,
    isLoading: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "User Management",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "Manage all users",
                fontSize = 14.sp,
                color = Slate400
            )
        }
        
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            // Refresh button
            IconButton(
                onClick = onRefreshClick,
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = PurplePrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Refresh",
                        tint = Slate400
                    )
                }
            }
            
            // Create button
            Button(
                onClick = onCreateClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = PurplePrimary
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text("Create")
            }
        }
    }
}

@Composable
private fun EmptyUsersState(onRefresh: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = Slate400
            )
            Text(
                text = "No users found",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                color = Slate400
            )
            Button(
                onClick = onRefresh,
                colors = ButtonDefaults.buttonColors(
                    containerColor = PurplePrimary
                )
            ) {
                Text("Refresh")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun UserCard(
    user: AdminUserDto,
    onEditClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.05f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // User info
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Avatar
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .background(
                            color = if (user.role == "admin") PurplePrimary else Slate700,
                            shape = RoundedCornerShape(24.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (user.role == "admin") Icons.Default.Star else Icons.Default.Person,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
                
                // Name and email
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = user.name ?: "No name",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = user.email,
                        fontSize = 14.sp,
                        color = Slate400,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    
                    // Role badge
                    Surface(
                        modifier = Modifier.padding(top = 4.dp),
                        shape = RoundedCornerShape(4.dp),
                        color = if (user.role == "admin") PurplePrimary.copy(alpha = 0.2f) else Slate700.copy(alpha = 0.5f)
                    ) {
                        Text(
                            text = user.role ?: "user",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            fontSize = 12.sp,
                            color = if (user.role == "admin") PurplePrimary else Slate400
                        )
                    }
                }
            }
            
            // Action buttons
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                IconButton(onClick = onEditClick) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit",
                        tint = PurplePrimary
                    )
                }
                IconButton(onClick = onDeleteClick) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete",
                        tint = RedError
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun UserFormDialog(
    title: String,
    user: AdminUserDto?,
    onDismiss: () -> Unit,
    onSubmit: (name: String, email: String, password: String, role: String) -> Unit,
    isLoading: Boolean
) {
    var name by remember { mutableStateOf(user?.name ?: "") }
    var email by remember { mutableStateOf(user?.email ?: "") }
    var password by remember { mutableStateOf("") }
    var role by remember { mutableStateOf(user?.role ?: "user") }
    var passwordVisible by remember { mutableStateOf(false) }
    var roleExpanded by remember { mutableStateOf(false) }
    
    // Validation
    val isEditMode = user != null
    val nameError = name.isBlank()
    val emailError = email.isBlank() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    val passwordError = !isEditMode && password.isBlank()
    val isFormValid = !nameError && !emailError && !passwordError
    
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Slate900)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Title
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                
                // Name field
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name") },
                    leadingIcon = {
                        Icon(Icons.Default.Person, contentDescription = null)
                    },
                    isError = name.isNotEmpty() && nameError,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PurplePrimary,
                        unfocusedBorderColor = Slate700,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = PurplePrimary,
                        focusedLabelColor = PurplePrimary,
                        unfocusedLabelColor = Slate400,
                        focusedLeadingIconColor = PurplePrimary,
                        unfocusedLeadingIconColor = Slate400
                    )
                )
                
                // Email field
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    leadingIcon = {
                        Icon(Icons.Default.Email, contentDescription = null)
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    isError = email.isNotEmpty() && emailError,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PurplePrimary,
                        unfocusedBorderColor = Slate700,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = PurplePrimary,
                        focusedLabelColor = PurplePrimary,
                        unfocusedLabelColor = Slate400,
                        focusedLeadingIconColor = PurplePrimary,
                        unfocusedLeadingIconColor = Slate400
                    )
                )
                
                // Password field
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text(if (isEditMode) "New Password (optional)" else "Password") },
                    leadingIcon = {
                        Icon(Icons.Default.Lock, contentDescription = null)
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                contentDescription = if (passwordVisible) "Hide password" else "Show password"
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    isError = password.isNotEmpty() && passwordError,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PurplePrimary,
                        unfocusedBorderColor = Slate700,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = PurplePrimary,
                        focusedLabelColor = PurplePrimary,
                        unfocusedLabelColor = Slate400,
                        focusedLeadingIconColor = PurplePrimary,
                        unfocusedLeadingIconColor = Slate400,
                        focusedTrailingIconColor = Slate400,
                        unfocusedTrailingIconColor = Slate400
                    )
                )
                
                // Role dropdown
                ExposedDropdownMenuBox(
                    expanded = roleExpanded,
                    onExpandedChange = { roleExpanded = it }
                ) {
                    OutlinedTextField(
                        value = role,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Role") },
                        leadingIcon = {
                            Icon(
                                imageVector = if (role == "admin") Icons.Default.Star else Icons.Default.Person,
                                contentDescription = null
                            )
                        },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = roleExpanded)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PurplePrimary,
                            unfocusedBorderColor = Slate700,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            cursorColor = PurplePrimary,
                            focusedLabelColor = PurplePrimary,
                            unfocusedLabelColor = Slate400,
                            focusedLeadingIconColor = PurplePrimary,
                            unfocusedLeadingIconColor = Slate400,
                            focusedTrailingIconColor = Slate400,
                            unfocusedTrailingIconColor = Slate400
                        )
                    )
                    
                    ExposedDropdownMenu(
                        expanded = roleExpanded,
                        onDismissRequest = { roleExpanded = false },
                        modifier = Modifier.background(Slate800)
                    ) {
                        DropdownMenuItem(
                            text = { Text("user", color = Color.White) },
                            onClick = {
                                role = "user"
                                roleExpanded = false
                            },
                            leadingIcon = {
                                Icon(Icons.Default.Person, contentDescription = null, tint = Slate400)
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("admin", color = Color.White) },
                            onClick = {
                                role = "admin"
                                roleExpanded = false
                            },
                            leadingIcon = {
                                Icon(Icons.Default.Star, contentDescription = null, tint = PurplePrimary)
                            }
                        )
                    }
                }
                
                // Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp, Alignment.End)
                ) {
                    TextButton(
                        onClick = onDismiss,
                        enabled = !isLoading
                    ) {
                        Text("Cancel", color = Slate400)
                    }
                    
                    Button(
                        onClick = {
                            onSubmit(name, email, password, role)
                        },
                        enabled = isFormValid && !isLoading,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PurplePrimary,
                            disabledContainerColor = PurplePrimary.copy(alpha = 0.5f)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text("Save")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DeleteConfirmDialog(
    user: AdminUserDto,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    isLoading: Boolean
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Slate900,
        title = {
            Text(
                text = "Delete User",
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Are you sure you want to delete this user?",
                    color = Color.White
                )
                Text(
                    text = "${user.name ?: "Unknown"} (${user.email})",
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "This action cannot be undone.",
                    color = RedError,
                    fontSize = 12.sp
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onConfirm,
                enabled = !isLoading,
                colors = ButtonDefaults.buttonColors(containerColor = RedError)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Delete")
                }
            }
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                enabled = !isLoading
            ) {
                Text("Cancel", color = Slate400)
            }
        }
    )
}
