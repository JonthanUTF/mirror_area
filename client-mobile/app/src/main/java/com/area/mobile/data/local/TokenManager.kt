package com.area.mobile.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "area_preferences")

class TokenManager(private val context: Context) {
    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
        private val USER_EMAIL_KEY = stringPreferencesKey("user_email")
        private val USER_NAME_KEY = stringPreferencesKey("user_name")
        private val SERVER_IP_KEY = stringPreferencesKey("server_ip")
    }
    
    suspend fun saveToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
        }
    }
    
    fun getToken(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[TOKEN_KEY]
        }
    }
    
    suspend fun saveServerIp(ip: String) {
        context.dataStore.edit { preferences ->
            preferences[SERVER_IP_KEY] = ip
        }
    }
    
    fun getServerIp(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[SERVER_IP_KEY]
        }
    }
    
    suspend fun saveUserInfo(id: String, email: String, name: String?) {
        context.dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = id
            preferences[USER_EMAIL_KEY] = email
            if (name != null) {
                preferences[USER_NAME_KEY] = name
            }
        }
    }
    
    fun getUserId(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[USER_ID_KEY]
        }
    }
    
    fun getUserEmail(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[USER_EMAIL_KEY]
        }
    }
    
    fun getUserName(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[USER_NAME_KEY]
        }
    }
    
    suspend fun clearAll() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
