package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.area.mobile.data.model.Service
import com.area.mobile.ui.theme.*
import com.area.mobile.ui.viewmodel.ServicesViewModel
import com.area.mobile.util.ServiceOAuthManager

@Composable
fun ServicesScreen(
    paddingValues: PaddingValues,
    viewModel: ServicesViewModel = hiltViewModel()
) {
    val services by viewModel.services.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val message by viewModel.message.collectAsState()
    val oauthState by viewModel.oauthState.collectAsState()
    
    val context = LocalContext.current
    
    // OAuth and Deep Links handling
    val pendingOAuthCode by ServiceOAuthManager.pendingCode.collectAsState()
    val twitchConnected by ServiceOAuthManager.twitchConnected.collectAsState()
    
    // Effect to refresh data on entry
    LaunchedEffect(Unit) {
        viewModel.refresh()
    }
    
    LaunchedEffect(error) {
        if (error != null) {
            android.widget.Toast.makeText(context, error, android.widget.Toast.LENGTH_SHORT).show()
            viewModel.clearError()
        }
    }
    
    LaunchedEffect(message) {
        if (message != null) {
            android.widget.Toast.makeText(context, message, android.widget.Toast.LENGTH_SHORT).show()
            viewModel.clearMessage()
        }
    }
    
    // Deep Link Code Handler
    LaunchedEffect(pendingOAuthCode, oauthState) {
        if (pendingOAuthCode != null && oauthState != null) {
            val code = ServiceOAuthManager.consumeCode()
            if (code != null) {
                viewModel.finalizeOAuthConnection(code)
            }
        }
    }
    
    // Twitch Passport Handler
    LaunchedEffect(twitchConnected) {
        if (twitchConnected) {
            ServiceOAuthManager.consumeTwitchConnected()
            viewModel.cancelOAuth()
            viewModel.loadUserServices()
            android.widget.Toast.makeText(context, "Connected to Twitch!", android.widget.Toast.LENGTH_SHORT).show()
        }
    }
    
    if (oauthState != null) {
        // Show OAuth WebView
        ServiceOAuthScreen(
            serviceName = oauthState!!.serviceName,
            authUrl = oauthState!!.authUrl,
            onCodeReceived = { code -> 
                viewModel.finalizeOAuthConnection(code)
            },
            onCancel = {
                viewModel.cancelOAuth()
            }
        )
    } else {
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = PurplePrimary)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Text(
                        text = "Connect your favorite services to automate your workflows",
                        fontSize = 14.sp,
                        color = Slate400,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }
                
                items(services) { service ->
                    ServiceCard(
                        service = service,
                        onConnect = { viewModel.connectService(service.name) },
                        onDisconnect = { viewModel.disconnectService(service.name) }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceCard(
    service: Service,
    onConnect: () -> Unit = {},
    onDisconnect: () -> Unit = {}
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
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .background(
                        try { Color(android.graphics.Color.parseColor(service.color)) } catch (e: Exception) { Slate500 },
                        RoundedCornerShape(12.dp)
                    )
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 8.dp)
            ) {
                Text(
                    text = service.name.replaceFirstChar { it.titlecase() },
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = service.description,
                    fontSize = 11.sp,
                    color = Slate400,
                    maxLines = 2
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (service.actions.isNotEmpty()) {
                        Badge(
                            containerColor = GreenSuccess.copy(alpha = 0.2f),
                            contentColor = GreenSuccess
                        ) {
                            Text(
                                text = "${service.actions.size} Act.",
                                fontSize = 9.sp,
                                maxLines = 1,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                    if (service.reactions.isNotEmpty()) {
                        Badge(
                            containerColor = PurplePrimary.copy(alpha = 0.2f),
                            contentColor = PurplePrimary
                        ) {
                            Text(
                                text = "${service.reactions.size} Rea.",
                                fontSize = 9.sp,
                                maxLines = 1,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }
            
            if (service.isConnected) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = "Connected",
                        tint = GreenSuccess,
                        modifier = Modifier.size(24.dp)
                    )
                    TextButton(onClick = onDisconnect) {
                        Text("Disconnect", color = RedError, fontSize = 10.sp)
                    }
                }
            } else {
                Button(
                    onClick = onConnect,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PurplePrimary
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.defaultMinSize(minWidth = 1.dp, minHeight = 1.dp)
                ) {
                    Text(
                        text = "Connect",
                        fontSize = 11.sp,
                        maxLines = 1
                    )
                }
            }
        }
    }
}
