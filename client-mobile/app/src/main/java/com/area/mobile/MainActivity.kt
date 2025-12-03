package com.area.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.area.mobile.ui.navigation.MainScaffold
import com.area.mobile.ui.screen.*
import com.area.mobile.ui.theme.AREATheme
import com.area.mobile.ui.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AREATheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AREAApp()
                }
            }
        }
    }
}

@Composable
fun AREAApp() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()
    val currentUser by authViewModel.currentUser.collectAsState()
    
    val onLogout = {
        authViewModel.logout()
        navController.navigate("login") {
            popUpTo(0) { inclusive = true }
        }
    }
    
    NavHost(
        navController = navController,
        startDestination = "splash"
    ) {
        // Auth Flow
        composable("splash") {
            SplashScreen(
                onNavigateToOnboarding = {
                    navController.navigate("onboarding") {
                        popUpTo("splash") { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.navigate("login") {
                        popUpTo("splash") { inclusive = true }
                    }
                }
            )
        }
        
        composable("onboarding") {
            OnboardingScreen(
                onFinish = {
                    navController.navigate("login") {
                        popUpTo("onboarding") { inclusive = true }
                    }
                }
            )
        }
        
        composable("login") {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate("register")
                }
            )
        }
        
        composable("register") {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate("emailVerification") {
                        popUpTo("register") { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.popBackStack()
                }
            )
        }
        
        composable("emailVerification") {
            val email = authViewModel.currentUser.collectAsState().value?.email ?: "user@example.com"
            EmailVerificationScreen(
                email = email,
                onVerificationComplete = {
                    navController.navigate("login") {
                        popUpTo("emailVerification") { inclusive = true }
                    }
                },
                onResendEmail = {
                    // TODO: Implement resend email logic
                }
            )
        }
        
        // Dashboard Flow
        composable("dashboard") {
            MainScaffold(
                navController = navController,
                currentRoute = "dashboard",
                onLogout = onLogout
            ) { padding ->
                DashboardScreen(
                    paddingValues = padding,
                    onNavigateToBuilder = { /* TODO: Next issue */ }
                )
            }
        }
        
        composable("profile") {
            MainScaffold(
                navController = navController,
                currentRoute = "profile",
                onLogout = onLogout
            ) { padding ->
                ProfileScreen(
                    paddingValues = padding,
                    onLogout = onLogout
                )
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
    }
}
