package com.area.mobile.data.remote

import com.area.mobile.data.model.dto.*
import retrofit2.Response
import retrofit2.http.*

interface ServicesApiService {
    @GET("services")
    suspend fun getAllServices(): Response<List<ServiceDto>>
    
    @GET("services/available")
    suspend fun getAvailableServices(): Response<AvailableServicesResponse>
    
    @GET("services")
    suspend fun getUserServices(): Response<List<UserServiceDto>>
    
    @GET("services/{serviceName}/connect")
    suspend fun connectService(@Path("serviceName") serviceName: String): Response<ServiceConnectionResponse>
    
    @POST("services/{serviceName}/callback")
    suspend fun serviceCallback(
        @Path("serviceName") serviceName: String,
        @Body body: Map<String, String>
    ): Response<Unit>
    
    @DELETE("services/{serviceId}")
    suspend fun disconnectService(@Path("serviceId") serviceId: String): Response<Unit>
    
    @GET("about.json")
    suspend fun getAboutJson(): Response<AboutJsonResponse>
}
