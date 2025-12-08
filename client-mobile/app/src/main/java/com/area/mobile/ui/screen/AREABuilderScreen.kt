package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.area.mobile.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AREABuilderScreen(
    areaId: String?,
    onBack: () -> Unit,
    onSave: () -> Unit
) {
    var areaName by remember { mutableStateOf("") }
    var selectedActionService by remember { mutableStateOf<String?>(null) }
    var selectedReactionService by remember { mutableStateOf<String?>(null) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (areaId == null) "Create AREA" else "Edit AREA") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.Close, "Close", tint = Color.White)
                    }
                },
                actions = {
                    TextButton(
                        onClick = {
                            onSave()
                            onBack()
                        },
                        enabled = areaName.isNotBlank() && 
                                 selectedActionService != null && 
                                 selectedReactionService != null
                    ) {
                        Text("Save", color = if (areaName.isNotBlank() && 
                                 selectedActionService != null && 
                                 selectedReactionService != null) PurplePrimary else Slate400)
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
                            text = "AREA Name",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(8.dp))
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
                }
                
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
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .background(GreenSuccess, RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("IF", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Text(
                                text = "When this happens...",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color.White
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Button(
                            onClick = { selectedActionService = "GitHub" },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (selectedActionService != null) 
                                    PurplePrimary 
                                else 
                                    Color.White.copy(alpha = 0.1f)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                if (selectedActionService != null) 
                                    "Action: $selectedActionService - New PR" 
                                else 
                                    "Choose Action Service"
                            )
                        }
                        
                        if (selectedActionService != null) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "✓ Trigger configured",
                                fontSize = 12.sp,
                                color = GreenSuccess
                            )
                        }
                    }
                }
                
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowDownward,
                        contentDescription = "Then",
                        tint = PurplePrimary,
                        modifier = Modifier.size(32.dp)
                    )
                }
                
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
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .background(PurplePrimary, RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("THEN", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                            Text(
                                text = "Do this...",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color.White
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Button(
                            onClick = { selectedReactionService = "Discord" },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (selectedReactionService != null) 
                                    PurplePrimary 
                                else 
                                    Color.White.copy(alpha = 0.1f)
                            ),
                            shape = RoundedCornerShape(12.dp),
                            enabled = selectedActionService != null
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                if (selectedReactionService != null) 
                                    "Reaction: $selectedReactionService - Send Message" 
                                else 
                                    "Choose Reaction Service"
                            )
                        }
                        
                        if (selectedReactionService != null) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "✓ Action configured",
                                fontSize = 12.sp,
                                color = PurplePrimary
                            )
                        }
                    }
                }
                
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = DriveColor.copy(alpha = 0.1f)
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
                            imageVector = Icons.Default.Info,
                            contentDescription = "Info",
                            tint = DriveColor,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "Your AREA will run automatically when the trigger condition is met.",
                            fontSize = 12.sp,
                            color = Slate300
                        )
                    }
                }
            }
        }
    }
}
