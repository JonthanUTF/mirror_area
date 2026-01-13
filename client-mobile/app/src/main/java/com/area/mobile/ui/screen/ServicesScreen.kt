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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.area.mobile.data.model.Service
import com.area.mobile.ui.theme.*
import com.area.mobile.ui.viewmodel.ServicesViewModel

@Composable
fun ServicesScreen(
    paddingValues: PaddingValues,
    viewModel: ServicesViewModel = hiltViewModel()
) {
    val services by viewModel.services.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    
    if (isLoading) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator(color = PurplePrimary)
        }
    } else if (error != null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = error ?: "Unknown error",
                    color = RedError,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                Button(
                    onClick = { viewModel.loadServices() },
                    colors = ButtonDefaults.buttonColors(containerColor = PurplePrimary)
                ) {
                    Text("Retry")
                }
            }
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
                ServiceCard(service = service)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceCard(service: Service) {
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
                        Color(android.graphics.Color.parseColor(service.color)),
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
                    text = service.name,
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
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Connected",
                    tint = GreenSuccess,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Button(
                    onClick = { },
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
