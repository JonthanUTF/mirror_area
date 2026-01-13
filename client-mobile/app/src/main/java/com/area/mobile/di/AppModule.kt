package com.area.mobile.di

import android.content.Context
import com.area.mobile.data.local.TokenManager
import com.area.mobile.data.remote.*
import com.area.mobile.data.repository.AreaRepository
import com.area.mobile.data.repository.AuthRepository
import com.area.mobile.data.repository.ServiceRepository
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    private const val DEFAULT_IP = "10.15.192.62.nip.io" // nip.io = nom de domaine valide
    
    @Provides
    @Singleton
    fun provideGson(): Gson = GsonBuilder()
        .setLenient()
        .create()
    
    @Provides
    @Singleton
    fun provideTokenManager(@ApplicationContext context: Context): TokenManager {
        return TokenManager(context)
    }
    
    @Provides
    @Singleton
    fun provideAuthInterceptor(tokenManager: TokenManager): AuthInterceptor {
        return AuthInterceptor {
            runBlocking {
                tokenManager.getToken().first()
            }
        }
    }
    
    @Provides
    @Singleton
    fun provideOkHttpClient(authInterceptor: AuthInterceptor): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, gson: Gson, tokenManager: TokenManager): Retrofit {
        val serverIp = runBlocking {
            tokenManager.getServerIp().first() ?: DEFAULT_IP
        }
        val baseUrl = "http://$serverIp:8080/"
        
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }
    
    @Provides
    @Singleton
    fun provideAuthApiService(retrofit: Retrofit): AuthApiService {
        return retrofit.create(AuthApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideAreasApiService(retrofit: Retrofit): AreasApiService {
        return retrofit.create(AreasApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideServicesApiService(retrofit: Retrofit): ServicesApiService {
        return retrofit.create(ServicesApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideAuthRepository(
        authApiService: AuthApiService,
        tokenManager: TokenManager
    ): AuthRepository {
        return AuthRepository(authApiService, tokenManager)
    }
    
    @Provides
    @Singleton
    fun provideAreaRepository(areasApiService: AreasApiService): AreaRepository {
        return AreaRepository(areasApiService)
    }
    
    @Provides
    @Singleton
    fun provideServiceRepository(servicesApiService: ServicesApiService): ServiceRepository {
        return ServiceRepository(servicesApiService)
    }
}
