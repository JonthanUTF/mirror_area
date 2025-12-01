package com.area.mobile.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.area.mobile.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScaffold(
    navController: NavHostController,
    currentRoute: String,
    onLogout: () -> Unit,
    showBottomBar: Boolean = true,
    showTopBar: Boolean = true,
    floatingActionButton: @Composable () -> Unit = {},
    content: @Composable (PaddingValues) -> Unit
) {
    Scaffold(
        topBar = {
            if (showTopBar) {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(PurplePrimary, RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Build,
                                    contentDescription = "AREA",
                                    tint = Color.White,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("AREA", fontWeight = FontWeight.Bold)
                        }
                    },
                    actions = {
                        IconButton(onClick = onLogout) {
                            Icon(
                                Icons.Default.ExitToApp,
                                contentDescription = "Logout",
                                tint = Color.White
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Slate900,
                        titleContentColor = Color.White
                    )
                )
            }
        },
        bottomBar = {
            if (showBottomBar) {
                BottomNavigationBar(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        },
        containerColor = Slate950,
        floatingActionButton = floatingActionButton
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
            content(padding)
        }
    }
}

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
            icon = { Icon(Icons.Default.Star, contentDescription = "Activity") },
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
