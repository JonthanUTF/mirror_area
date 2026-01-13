package com.area.mobile.ui.screen

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.area.mobile.data.model.ActionParameter
import com.area.mobile.data.model.ReactionParameter
import com.area.mobile.data.model.Service
import com.area.mobile.ui.theme.*
import com.area.mobile.ui.viewmodel.DashboardViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AREABuilderScreen(
    areaId: String?,
    onBack: () -> Unit,
    onSave: () -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    var areaName by remember { mutableStateOf("") }
    
    // Action State
    var selectedActionService by remember { mutableStateOf<Service?>(null) }
    var selectedActionType by remember { mutableStateOf<String?>(null) }
    var actionParams by remember { mutableStateOf(mutableMapOf<String, String>()) }
    
    // Reaction State
    var selectedReactionService by remember { mutableStateOf<Service?>(null) }
    var selectedReactionType by remember { mutableStateOf<String?>(null) }
    var reactionParams by remember { mutableStateOf(mutableMapOf<String, String>()) }
    
    val services by viewModel.services.collectAsState()
    val connectedServices by viewModel.connectedServices.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    val context = LocalContext.current

    // Helper to clear params when selection changes
    LaunchedEffect(selectedActionType) {
        actionParams = mutableMapOf()
    }
    LaunchedEffect(selectedReactionType) {
        reactionParams = mutableMapOf()
    }
    
    // Filter services that have actions/reactions
    val actionServices = services.filter { it.actions.isNotEmpty() }
    val reactionServices = services.filter { it.reactions.isNotEmpty() }
    
    val canSave = areaName.isNotBlank() && 
                 selectedActionService != null && 
                 selectedActionType != null &&
                 selectedReactionService != null &&
                 selectedReactionType != null
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (areaId == null) "Create Workflow" else "Edit Workflow") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.Close, "Close", tint = Color.White)
                    }
                },
                actions = {
                    TextButton(
                        onClick = {
                            if (canSave) {
                                viewModel.createArea(
                                    name = areaName,
                                    actionService = selectedActionService!!.name,
                                    actionType = selectedActionType!!,
                                    actionParams = actionParams,
                                    reactionService = selectedReactionService!!.name,
                                    reactionType = selectedReactionType!!,
                                    reactionParams = reactionParams,
                                    onSuccess = {
                                        onSave()
                                        onBack()
                                    }
                                )
                            }
                        },
                        enabled = canSave && !isLoading
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = PurplePrimary,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text("Save", color = if (canSave) PurplePrimary else Slate400)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Slate900,
                    titleContentColor = Color.White
                )
            )
        },
        containerColor = Slate950
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Slate950, Slate900, Slate950)
                    )
                )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Name Section
                BuilderSection(title = "1. Name your workflow") {
                    OutlinedTextField(
                        value = areaName,
                        onValueChange = { areaName = it },
                        placeholder = { Text("e.g., GitHub PR to Discord") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PurplePrimary,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            cursorColor = PurplePrimary
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
                
                // Action Section
                BuilderSection(title = "2. IF This (Trigger)") {
                    Text("Select Service:", color = Slate400, fontSize = 14.sp)
                    ServiceSelector(
                        services = actionServices,
                        selectedService = selectedActionService,
                        onSelect = { selectedActionService = it; selectedActionType = null }
                    )
                    
                    if (selectedActionService != null) {
                        val isConnected = connectedServices.contains(selectedActionService!!.name) || 
                                          connectedServices.contains(selectedActionService!!.id) ||
                                          !listOf("google", "github", "discord", "dropbox", "twitter", "twitch").contains(selectedActionService!!.name.lowercase())
                        
                        // Show connect button if needed
                        if (!isConnected) {
                             Button(
                                onClick = { 
                                    viewModel.connectService(selectedActionService!!.name, context)
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                            ) {
                                Icon(Icons.Default.Link, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Connect ${selectedActionService!!.name}")
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("Select Trigger:", color = Slate400, fontSize = 14.sp)
                        
                        // Action/Trigger Dropdown
                        selectedActionService!!.actions.forEach { action ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedActionType = action.id }
                                    .padding(vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = selectedActionType == action.id,
                                    onClick = { selectedActionType = action.id },
                                    colors = RadioButtonDefaults.colors(selectedColor = PurplePrimary)
                                )
                                Column {
                                    Text(action.name, color = Color.White)
                                    if (action.description.isNotBlank()) {
                                        Text(action.description, color = Slate400, fontSize = 12.sp)
                                    }
                                }
                            }
                            
                            // Parameters for this action
                            if (selectedActionType == action.id && action.parameters.isNotEmpty()) {
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color.Black.copy(alpha = 0.3f)),
                                    modifier = Modifier.padding(start = 16.dp, bottom = 8.dp)
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        action.parameters.forEach { param ->
                                            ParameterInput(
                                                param = param,
                                                value = actionParams[param.name] ?: "",
                                                onValueChange = { newValue ->
                                                    actionParams = actionParams.toMutableMap().apply {
                                                        put(param.name, newValue)
                                                    }
                                                }
                                            )
                                            Spacer(modifier = Modifier.height(8.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Reaction Section
                BuilderSection(title = "3. THEN That (Reaction)") {
                    Text("Select Service:", color = Slate400, fontSize = 14.sp)
                    ServiceSelector(
                        services = reactionServices,
                        selectedService = selectedReactionService,
                        onSelect = { selectedReactionService = it; selectedReactionType = null }
                    )
                    
                    if (selectedReactionService != null) {
                         val isConnected = connectedServices.contains(selectedReactionService!!.name) || 
                                          connectedServices.contains(selectedReactionService!!.id) ||
                                          !listOf("google", "github", "discord", "dropbox", "twitter", "twitch").contains(selectedReactionService!!.name.lowercase())
                        
                        if (!isConnected) {
                             Button(
                                onClick = { 
                                    viewModel.connectService(selectedReactionService!!.name, context)
                                },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                            ) {
                                Icon(Icons.Default.Link, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Connect ${selectedReactionService!!.name}")
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("Select Reaction:", color = Slate400, fontSize = 14.sp)
                        
                        selectedReactionService!!.reactions.forEach { reaction ->
                             Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedReactionType = reaction.id }
                                    .padding(vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = selectedReactionType == reaction.id,
                                    onClick = { selectedReactionType = reaction.id },
                                    colors = RadioButtonDefaults.colors(selectedColor = PurplePrimary)
                                )
                                Column {
                                    Text(reaction.name, color = Color.White)
                                    if (reaction.description.isNotBlank()) {
                                        Text(reaction.description, color = Slate400, fontSize = 12.sp)
                                    }
                                }
                            }
                            
                            // Parameters for this reaction
                            if (selectedReactionType == reaction.id && reaction.parameters.isNotEmpty()) {
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color.Black.copy(alpha = 0.3f)),
                                    modifier = Modifier.padding(start = 16.dp, bottom = 8.dp)
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        reaction.parameters.forEach { param ->
                                            ParameterInput(
                                                param = param,
                                                value = reactionParams[param.name] ?: "",
                                                onValueChange = { newValue ->
                                                    reactionParams = reactionParams.toMutableMap().apply {
                                                        put(param.name, newValue)
                                                    }
                                                }
                                            )
                                            Spacer(modifier = Modifier.height(8.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                 if (error != null) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = RedError.copy(alpha = 0.1f)
                        ),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = "Error",
                                tint = RedError,
                                modifier = Modifier.size(20.dp)
                            )
                            Text(
                                text = error ?: "An error occurred",
                                fontSize = 12.sp,
                                color = RedError
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
fun BuilderSection(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.05f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Divider(
                modifier = Modifier.padding(vertical = 12.dp),
                color = Color.White.copy(alpha = 0.1f)
            )
            content()
        }
    }
}

@Composable
fun ServiceSelector(
    services: List<Service>,
    selectedService: Service?,
    onSelect: (Service) -> Unit
) {
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(vertical = 12.dp)
    ) {
        items(services) { service ->
            ServiceItem(
                service = service,
                isSelected = selectedService?.id == service.id,
                onClick = { onSelect(service) }
            )
        }
    }
}

@Composable
fun ServiceItem(
    service: Service,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(80.dp)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .background(
                    if (isSelected) PurplePrimary else Color(android.graphics.Color.parseColor(service.color)),
                    RoundedCornerShape(16.dp)
                )
                .border(
                    width = if (isSelected) 2.dp else 0.dp,
                    color = if (isSelected) Color.White else Color.Transparent,
                    shape = RoundedCornerShape(16.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(service.iconName, fontSize = 24.sp)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = service.name,
            fontSize = 12.sp,
            color = if (isSelected) Color.White else Slate400,
            maxLines = 1,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParameterInput(
    param: Any,
    value: String,
    onValueChange: (String) -> Unit
) {
    // Handling generic param type since ActionParameter and ReactionParameter are different classes but similar structure
    val name = if (param is ActionParameter) param.name else (param as ReactionParameter).name
    val description = if (param is ActionParameter) param.description else (param as ReactionParameter).description
    val type = if (param is ActionParameter) param.type else (param as ReactionParameter).type
    
    val displayLabel = name.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    
    Column {
        Text(
            text = "$displayLabel ${if(type == "number") "(Number)" else ""}",
            color = Color.White,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
        if (description.isNotEmpty()) {
            Text(description, color = Slate400, fontSize = 12.sp)
        }
        Spacer(modifier = Modifier.height(4.dp))
        
        if (type.startsWith("select:")) {
            var expanded by remember { mutableStateOf(false) }
            val options = type.removePrefix("select:").split(",")
            
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                OutlinedTextField(
                    value = value.ifEmpty { "Select an option" },
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    modifier = Modifier.fillMaxWidth().menuAnchor(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PurplePrimary,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                    )
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    options.forEach { option ->
                        DropdownMenuItem(
                            text = { Text(option.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }) },
                            onClick = {
                                onValueChange(option)
                                expanded = false
                            }
                        )
                    }
                }
            }
        } else {
            OutlinedTextField(
                value = value,
                onValueChange = { 
                    if (type == "number") {
                        if (it.all { char -> char.isDigit() }) onValueChange(it)
                    } else {
                        onValueChange(it)
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PurplePrimary,
                    unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = PurplePrimary
                ),
                keyboardOptions = if (type == "number") KeyboardOptions(keyboardType = KeyboardType.Number) else KeyboardOptions.Default,
                singleLine = true
            )
        }
    }
}
