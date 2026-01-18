package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.area.mobile.data.model.Area
import com.area.mobile.ui.theme.*
import com.area.mobile.ui.viewmodel.DashboardViewModel

@Composable
fun DashboardScreen(
    paddingValues: PaddingValues,
    onNavigateToBuilder: (String?) -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val areas by viewModel.areas.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val stats = viewModel.getStats()
    
    // State for delete confirmation dialog
    var areaToDelete by remember { mutableStateOf<Area?>(null) }
    var showDeleteDialog by remember { mutableStateOf(false) }
    
    // Recharger les areas quand on arrive sur l'écran
    LaunchedEffect(Unit) {
        viewModel.loadAreas()
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
                item {
                    Column {
                        Text(
                            text = "Dashboard",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Manage and monitor your automations",
                            fontSize = 14.sp,
                            color = Slate400
                        )
                    }
                }
                
                item {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.height(320.dp)
                    ) {
                        item {
                            StatCard(
                                title = "Total AREAs",
                                value = stats.totalAreas.toString(),
                                icon = Icons.Default.Build,
                                color = PurplePrimary,
                                trend = "+2 this week"
                            )
                        }
                        item {
                            StatCard(
                                title = "Active",
                                value = stats.activeAreas.toString(),
                                icon = Icons.Default.CheckCircle,
                                color = GreenSuccess,
                                trend = "${(stats.activeAreas.toFloat() / stats.totalAreas * 100).toInt()}% active"
                            )
                        }
                        item {
                            StatCard(
                                title = "Executions",
                                value = "${stats.totalExecutions}",
                                icon = Icons.Default.Star,
                                color = DriveColor,
                                trend = "+15% vs yesterday"
                            )
                        }
                        item {
                            StatCard(
                                title = "Success Rate",
                                value = "${stats.successRate}%",
                                icon = Icons.Default.Done,
                                color = OrangeWarning,
                                trend = "Last 30 days"
                            )
                        }
                    }
                }
                
                item {
                    Text(
                        text = "Your AREAs",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                
                if (isLoading) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(color = PurplePrimary)
                        }
                    }
                } else if (areas.isEmpty()) {
                    item {
                        EmptyState(onCreateArea = { onNavigateToBuilder(null) })
                    }
                } else {
                    items(areas) { area ->
                        AreaCard(
                            area = area,
                            onToggle = { viewModel.toggleArea(area.id) },
                            onClick = { onNavigateToBuilder(area.id) },
                            onDelete = {
                                areaToDelete = area
                                showDeleteDialog = true
                            }
                        )
                    }
                }
            }
        
        // Delete confirmation dialog
        if (showDeleteDialog && areaToDelete != null) {
            DeleteAreaDialog(
                area = areaToDelete!!,
                onDismiss = {
                    showDeleteDialog = false
                    areaToDelete = null
                },
                onConfirm = {
                    viewModel.deleteArea(areaToDelete!!.id)
                    showDeleteDialog = false
                    areaToDelete = null
                }
            )
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    trend: String
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(150.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.05f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(color, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            }
            
            Column {
                Text(
                    text = value,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = title,
                    fontSize = 12.sp,
                    color = Slate400
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = trend,
                    fontSize = 11.sp,
                    color = PurplePrimary
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AreaCard(
    area: Area,
    onToggle: () -> Unit,
    onClick: () -> Unit,
    onDelete: () -> Unit
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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onClick() }
                ) {
                    Text(
                        text = area.name,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White,
                        maxLines = 1
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${area.executionCount} executions • ${area.lastExecution}",
                        fontSize = 11.sp,
                        color = Slate400,
                        maxLines = 1
                    )
                }
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Switch(
                        checked = area.isActive,
                        onCheckedChange = { newValue ->
                            android.util.Log.d("AreaCard", "Switch clicked for ${area.name}: $newValue")
                            onToggle()
                        },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = GreenSuccess,
                            uncheckedThumbColor = Color.White,
                            uncheckedTrackColor = Slate700
                        )
                    )
                    
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = RedError,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                ServiceBadge(
                    serviceName = area.actionServiceName,
                    actionName = area.actionName,
                    color = Color(android.graphics.Color.parseColor(area.actionColor)),
                    label = "IF",
                    labelColor = GreenSuccess,
                    modifier = Modifier.weight(1f)
                )
                
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = "Then",
                    tint = PurplePrimary,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )
                
                ServiceBadge(
                    serviceName = area.reactionServiceName,
                    actionName = area.reactionName,
                    color = Color(android.graphics.Color.parseColor(area.reactionColor)),
                    label = "THEN",
                    labelColor = PurplePrimary,
                    modifier = Modifier.weight(1f)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Badge(
                containerColor = if (area.isActive) 
                    GreenSuccess.copy(alpha = 0.2f) 
                else 
                    Slate700.copy(alpha = 0.5f),
                contentColor = if (area.isActive) GreenSuccess else Slate400
            ) {
                Text(
                    text = if (area.isActive) "Active" else "Inactive",
                    fontSize = 11.sp,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                )
            }
        }
    }
}

@Composable
fun ServiceBadge(
    serviceName: String,
    actionName: String,
    color: Color,
    label: String,
    labelColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.05f)
        ),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.linearGradient(listOf(labelColor.copy(alpha = 0.5f), labelColor.copy(alpha = 0.5f)))
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(color, RoundedCornerShape(8.dp))
                )
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = label,
                        fontSize = 9.sp,
                        color = labelColor,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1
                    )
                    Text(
                        text = serviceName,
                        fontSize = 11.sp,
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = actionName,
                fontSize = 10.sp,
                color = Slate400,
                maxLines = 1
            )
        }
    }
}

@Composable
fun EmptyState(onCreateArea: () -> Unit) {
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
                .padding(48.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(Color.White.copy(alpha = 0.05f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Build,
                    contentDescription = "No areas",
                    tint = Slate400,
                    modifier = Modifier.size(32.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No AREAs Yet",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Create your first automation to get started",
                fontSize = 14.sp,
                color = Slate400
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = onCreateArea,
                colors = ButtonDefaults.buttonColors(
                    containerColor = PurplePrimary
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Your First AREA")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomNavigationBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    NavigationBar(
        containerColor = Slate900,
        contentColor = Color.White
    ) {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
            label = { Text("Dashboard") },
            selected = currentRoute == "dashboard",
            onClick = { onNavigate("dashboard") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = PurplePrimary,
                selectedTextColor = PurplePrimary,
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400,
                indicatorColor = PurplePrimary.copy(alpha = 0.2f)
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.List, contentDescription = "Services") },
            label = { Text("Services") },
            selected = currentRoute == "services",
            onClick = { onNavigate("services") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = PurplePrimary,
                selectedTextColor = PurplePrimary,
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400,
                indicatorColor = PurplePrimary.copy(alpha = 0.2f)
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Settings, contentDescription = "Activity") },
            label = { Text("Activity") },
            selected = currentRoute == "activity",
            onClick = { onNavigate("activity") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = PurplePrimary,
                selectedTextColor = PurplePrimary,
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400,
                indicatorColor = PurplePrimary.copy(alpha = 0.2f)
            )
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
            label = { Text("Settings") },
            selected = currentRoute == "settings",
            onClick = { onNavigate("settings") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = PurplePrimary,
                selectedTextColor = PurplePrimary,
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400,
                indicatorColor = PurplePrimary.copy(alpha = 0.2f)
            )
        )
    }
}

@Composable
private fun DeleteAreaDialog(
    area: Area,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Slate900,
        title = {
            Text(
                text = "Delete AREA",
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Are you sure you want to delete this automation?",
                    color = Color.White
                )
                Text(
                    text = area.name,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(4.dp))
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
                colors = ButtonDefaults.buttonColors(containerColor = RedError),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text("Delete")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = Slate400)
            }
        }
    )
}
