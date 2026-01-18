package com.area.mobile.ui.screen

import android.util.Log
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
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
    
    // Debug log for starting auth
    LaunchedEffect(authUrl) {
        Log.d("ServiceOAuth", "Starting OAuth for $serviceName with URL: $authUrl")
    }
    
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
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            databaseEnabled = true
                            javaScriptCanOpenWindowsAutomatically = true
                            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                            
                            // Use the default user agent but remove the "wv" field to look like a regular browser
                            // This helps avoid some restrictions sites place on WebViews
                            userAgentString = userAgentString.replace("; wv", "")
                        }

                        // Enable Third-Party Cookies (Important for Twitch OAuth)
                        val cookieManager = CookieManager.getInstance()
                        cookieManager.setAcceptCookie(true)
                        cookieManager.setAcceptThirdPartyCookies(this, true)
                        
                        webChromeClient = object : WebChromeClient() {
                            override fun onConsoleMessage(message: android.webkit.ConsoleMessage?): Boolean {
                                Log.d("ServiceOAuthWeb", "${message?.message()} -- From line ${message?.lineNumber()} of ${message?.sourceId()}")
                                return true
                            }
                            
                            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                Log.d("ServiceOAuth", "Loading progress: $newProgress%")
                                if (newProgress == 100) isLoading = false
                            }

                            override fun onPermissionRequest(request: android.webkit.PermissionRequest?) {
                                Log.d("ServiceOAuth", "Permission Request: ${request?.resources?.joinToString()}")
                                request?.grant(request.resources)
                            }
                        }
                        
                        webViewClient = object : WebViewClient() {
                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val url = request?.url?.toString() ?: return false
                                Log.d("ServiceOAuth", "URL Override: $url")
                                
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
                            
                            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                Log.d("ServiceOAuth", "Page Started: $url")
                                isLoading = true
                            }
                            
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                Log.d("ServiceOAuth", "Page Finished: $url")
                                // Keep loading for a bit to ensure content renders? 
                                // isLoading = false // Handled by onProgressChanged
                            }
                            
                            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                super.onReceivedError(view, request, error)
                                Log.e("ServiceOAuth", "WebView Error: ${error?.description} (Code: ${error?.errorCode}) for ${request?.url}")
                            }

                            override fun onReceivedHttpError(view: WebView?, request: WebResourceRequest?, errorResponse: WebResourceResponse?) {
                                super.onReceivedHttpError(view, request, errorResponse)
                                Log.e("ServiceOAuth", "WebView HTTP Error: ${errorResponse?.statusCode} ${errorResponse?.reasonPhrase} for ${request?.url}")
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
                    @Deprecated("Deprecated WebViewClient method, required for legacy support")
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
