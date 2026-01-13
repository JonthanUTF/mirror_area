package com.area.mobile.ui.screen

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

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
