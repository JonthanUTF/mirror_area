package com.area.mobile.data.remote

import android.util.Log
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

class BaseUrlInterceptor(private val ipProvider: () -> String?) : Interceptor {
    @Throws(IOException::class)
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        val ip = ipProvider()
        
        if (!ip.isNullOrBlank()) {
            val newUrl = request.url.newBuilder()
                .host(ip)
                .build()
                
            Log.d("BaseUrlInterceptor", "Changing host to: $ip -> ${newUrl}")
            
            request = request.newBuilder()
                .url(newUrl)
                .build()
        }
        
        return chain.proceed(request)
    }
}
