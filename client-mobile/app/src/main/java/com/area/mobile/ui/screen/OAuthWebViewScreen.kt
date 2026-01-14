package com.area.mobile.ui.screen

import android.util.Log
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.area.mobile.ui.theme.Slate900
import com.area.mobile.ui.theme.Slate950

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceOAuthScreen(
    serviceName: String,
    authUrl: String,
    onCodeReceived: (String) -> Unit,
    onCancel: () -> Unit
) {
    var isLoading by remember { mutableStateOf(true) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Connect $serviceName") },
                navigationIcon = {
                    IconButton(onClick = onCancel) {
                        Icon(Icons.Default.Close, "Cancel", tint = Color.White)
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
                .padding(padding)
        ) {
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.databaseEnabled = true
                        settings.userAgentString = settings.userAgentString
                            .replace("wv", "")
                            .replace("; Mobile", "; Mobile Chrome")
                        
                        webViewClient = object : WebViewClient() {
                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val url = request?.url?.toString() ?: return false
                                Log.d("ServiceOAuth", "URL Loading: $url")
                                
                                // Intercept localhost callback (web frontend redirect)
                                if (url.contains("/services/callback") && url.contains("code=")) {
                                    val code = android.net.Uri.parse(url).getQueryParameter("code")
                                    Log.d("ServiceOAuth", "Code received: ${code?.take(20)}...")
                                    if (code != null) {
                                        onCodeReceived(code)
                                        return true
                                    }
                                }
                                
                                // Also handle deep link scheme
                                if (url.startsWith("area://services/callback")) {
                                    val code = android.net.Uri.parse(url).getQueryParameter("code")
                                    if (code != null) {
                                        onCodeReceived(code)
                                        return true
                                    }
                                }
                                
                                return false
                            }
                            
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false
                            }
                        }
                        
                        loadUrl(authUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
            
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Slate950.copy(alpha = 0.8f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Color.White)
                }
            }
        }
    }
}

@Composable
fun OAuthWebViewScreen(
    url: String,
    onTokenReceived: (String) -> Unit,
    onError: () -> Unit
) {
    AndroidView(
        factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                
                // Modifier le User-Agent pour passer les vérifications de Google
                settings.userAgentString = settings.userAgentString.replace("wv", "")
                    .replace("; Mobile", "; Mobile Chrome")
                
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        url?.let {
                            // Intercepter le callback avec le token
                            if (it.startsWith("area://auth/callback")) {
                                val token = android.net.Uri.parse(it).getQueryParameter("token")
                                if (token != null) {
                                    onTokenReceived(token)
                                    return true
                                } else {
                                    onError()
                                    return true
                                }
                            }
                            // Continuer la navigation normale
                            return false
                        }
                        return false
                    }
                }
                
                loadUrl(url)
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}
