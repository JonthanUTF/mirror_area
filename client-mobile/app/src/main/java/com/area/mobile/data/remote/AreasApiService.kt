package com.area.mobile.data.remote

import com.area.mobile.data.model.dto.*
import retrofit2.Response
import retrofit2.http.*

interface AreasApiService {
    @GET("areas")
    suspend fun getAreas(): Response<List<AreaDto>>
    
    @GET("areas/{id}")
    suspend fun getArea(@Path("id") id: String): Response<AreaDto>
    
    @POST("areas")
    suspend fun createArea(@Body request: CreateAreaRequest): Response<AreaDto>
    
    @PUT("areas/{id}")
    suspend fun updateArea(
        @Path("id") id: String,
        @Body request: UpdateAreaRequest
    ): Response<AreaDto>
    
    @DELETE("areas/{id}")
    suspend fun deleteArea(@Path("id") id: String): Response<Unit>
    
    @POST("areas/{id}/toggle")
    suspend fun toggleArea(@Path("id") id: String): Response<AreaDto>
}
