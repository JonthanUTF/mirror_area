package com.area.mobile.ui.screen

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.area.mobile.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onNavigateToOnboarding: () -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var scale by remember { mutableStateOf(0f) }
    
    val scaleAnimation = animateFloatAsState(
        targetValue = scale,
        animationSpec = tween(
            durationMillis = 800,
            easing = FastOutSlowInEasing
        )
    )
    
    LaunchedEffect(Unit) {
        scale = 1f
        delay(2000)
        // TODO: Check if user has seen onboarding
        val hasSeenOnboarding = false // Get from DataStore
        if (hasSeenOnboarding) {
            onNavigateToLogin()
        } else {
            onNavigateToOnboarding()
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(PurplePrimary, PurpleDark)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Build,
                contentDescription = "AREA Logo",
                tint = Color.White,
                modifier = Modifier
                    .size(100.dp)
                    .scale(scaleAnimation.value)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "AREA",
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.scale(scaleAnimation.value)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Automate your digital life",
                fontSize = 14.sp,
                color = Color.White.copy(alpha = 0.8f),
                modifier = Modifier.scale(scaleAnimation.value)
            )
        }
    }
}
