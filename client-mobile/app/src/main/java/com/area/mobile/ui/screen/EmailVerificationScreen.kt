package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.area.mobile.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun EmailVerificationScreen(
    email: String,
    onVerificationComplete: () -> Unit,
    onResendEmail: () -> Unit
) {
    var canResend by remember { mutableStateOf(false) }
    var countdown by remember { mutableStateOf(60) }
    
    LaunchedEffect(Unit) {
        while (countdown > 0) {
            delay(1000)
            countdown--
        }
        canResend = true
    }
    
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
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(PurplePrimary.copy(alpha = 0.2f), RoundedCornerShape(50.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Email,
                    contentDescription = "Email",
                    tint = PurplePrimary,
                    modifier = Modifier.size(48.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                text = "Check your email",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "We've sent a verification link to",
                fontSize = 14.sp,
                color = Slate400,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = email,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = PurplePrimary,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                text = "Click the link in the email to verify your account. You may need to check your spam folder.",
                fontSize = 14.sp,
                color = Slate400,
                textAlign = TextAlign.Center,
                lineHeight = 20.sp
            )
            
            Spacer(modifier = Modifier.height(48.dp))
            
            Button(
                onClick = onVerificationComplete,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = PurplePrimary
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = "I've verified my email",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            TextButton(
                onClick = {
                    if (canResend) {
                        onResendEmail()
                        canResend = false
                        countdown = 60
                    }
                },
                enabled = canResend
            ) {
                Text(
                    text = if (canResend) "Resend verification email" else "Resend in ${countdown}s",
                    color = if (canResend) PurplePrimary else Slate400,
                    fontSize = 14.sp
                )
            }
        }
    }
}
