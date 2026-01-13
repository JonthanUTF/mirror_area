package com.area.mobile

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.area.mobile.data.local.TokenManager
import com.area.mobile.ui.navigation.MainScaffold
import com.area.mobile.ui.screen.*
import com.area.mobile.ui.theme.AREATheme
import com.area.mobile.ui.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    private val oauthTokenState = mutableStateOf<String?>(null)
    private val isOAuthCallback = mutableStateOf(false)
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Handle OAuth callback from deep link - SAVE TOKEN IMMEDIATELY
        handleIntent(intent)
        
        setContent {
            AREATheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AREAApp(
                        oauthToken = oauthTokenState.value,
                        isOAuthCallback = isOAuthCallback.value
                    )
                }
            }
        }
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(intent)
    }
    
    private fun handleIntent(intent: Intent?) {
        val data: Uri? = intent?.data
        
        // Check if this is an OAuth callback
        if (data != null && data.scheme == "area" && data.host == "auth" && data.path == "/callback") {
            val token = data.getQueryParameter("token")
            Log.d("MainActivity", "OAuth callback received with token: ${token?.take(20)}...")
            
            if (token != null) {
                // SAVE TOKEN IMMEDIATELY using runBlocking (before Compose starts)
                val tokenManager = TokenManager(applicationContext)
                runBlocking {
                    tokenManager.saveServerIp("localhost")
                    tokenManager.saveToken(token)
                    Log.d("MainActivity", "Token saved to DataStore")
                }
                oauthTokenState.value = token
                isOAuthCallback.value = true
            }
        }
    }
}

@Composable
fun AREAApp(oauthToken: String? = null, isOAuthCallback: Boolean = false) {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()
    val currentUser by authViewModel.currentUser.collectAsState()
    var isLoading by remember { mutableStateOf(true) }
    var hasCheckedAuth by remember { mutableStateOf(false) }
    
    // Au démarrage ou après OAuth callback, vérifier/rafraîchir l'utilisateur
    LaunchedEffect(Unit) {
        if (isOAuthCallback || oauthToken != null) {
            // C'est un callback OAuth, rafraîchir l'utilisateur depuis l'API
            Log.d("AREAApp", "OAuth callback detected, refreshing user...")
            authViewModel.refreshCurrentUser()
        }
        hasCheckedAuth = true
        isLoading = false
    }
    
    // Observer le changement de l'utilisateur pour naviguer automatiquement
    LaunchedEffect(currentUser, hasCheckedAuth) {
        if (hasCheckedAuth && currentUser != null) {
            Log.d("AREAApp", "User logged in: ${currentUser?.email}")
            val currentRoute = navController.currentBackStackEntry?.destination?.route
            if (currentRoute == "login" || currentRoute == null) {
                navController.navigate("dashboard") {
                    popUpTo(0) { inclusive = true }
                }
            }
        }
    }
    
    val onLogout: () -> Unit = {
        authViewModel.logout()
        navController.navigate("login") {
            popUpTo(0) { inclusive = true }
        }
    }
    
    // Afficher un loading pendant la vérification initiale si c'est un callback OAuth
    if (isLoading && isOAuthCallback) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        return
    }
    
    // Déterminer la destination de démarrage
    val startDestination = if (currentUser != null) "dashboard" else "login"
    
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable("login") {
            LoginScreen(
                oauthToken = oauthToken,
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        
        composable("dashboard") {
            MainScaffold(
                navController = navController,
                currentRoute = "dashboard",
                onLogout = onLogout,
                floatingActionButton = {
                    androidx.compose.material3.FloatingActionButton(
                        onClick = { navController.navigate("builder/new") },
                        containerColor = com.area.mobile.ui.theme.PurplePrimary,
                        contentColor = androidx.compose.ui.graphics.Color.White
                    ) {
                        androidx.compose.material3.Icon(
                            Icons.Default.Add,
                            contentDescription = "Create AREA"
                        )
                    }
                }
            ) { padding ->
                DashboardScreen(
                    paddingValues = padding,
                    onNavigateToBuilder = { areaId ->
                        if (areaId != null) {
                            navController.navigate("builder/$areaId")
                        } else {
                            navController.navigate("builder/new")
                        }
                    }
                )
            }
        }
        
        composable("services") {
            MainScaffold(
                navController = navController,
                currentRoute = "services",
                onLogout = onLogout
            ) { padding ->
                ServicesScreen(paddingValues = padding)
            }
        }
        
        composable("activity") {
            MainScaffold(
                navController = navController,
                currentRoute = "activity",
                onLogout = onLogout
            ) { padding ->
                ActivityScreen(paddingValues = padding)
            }
        }
        
        composable("settings") {
            MainScaffold(
                navController = navController,
                currentRoute = "settings",
                onLogout = onLogout
            ) { padding ->
                SettingsScreen(
                    paddingValues = padding,
                    onLogout = onLogout
                )
            }
        }
        
        composable(
            route = "builder/{areaId}",
            arguments = listOf(navArgument("areaId") { type = NavType.StringType })
        ) { backStackEntry ->
            val areaId = backStackEntry.arguments?.getString("areaId")
            AREABuilderScreen(
                areaId = if (areaId == "new") null else areaId,
                onBack = { navController.popBackStack() },
                onSave = { /* Save logic handled in builder */ }
            )
        }
    }
}
