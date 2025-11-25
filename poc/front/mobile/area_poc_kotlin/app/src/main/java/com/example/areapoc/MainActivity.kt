package com.example.areapoc

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET

data class User(
    val id: Int,
    val name: String,
    val email: String
)

interface ApiService {
    @GET("users")
    suspend fun getUsers(): List<User>
}

class MainActivity : AppCompatActivity() {
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var metricsText: TextView
    private lateinit var recyclerView: RecyclerView
    
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://jsonplaceholder.typicode.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    private val apiService = retrofit.create(ApiService::class.java)
    private val startTime = System.currentTimeMillis()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        loginButton = findViewById(R.id.loginButton)
        progressBar = findViewById(R.id.progressBar)
        metricsText = findViewById(R.id.metricsText)
        recyclerView = findViewById(R.id.recyclerView)
        
        recyclerView.layoutManager = LinearLayoutManager(this)
        
        val renderTime = System.currentTimeMillis() - startTime
        metricsText.text = "Render time: ${renderTime}ms"
        
        loginButton.setOnClickListener {
            handleLogin()
        }
    }
    
    private fun handleLogin() {
        progressBar.visibility = ProgressBar.VISIBLE
        val apiStartTime = System.currentTimeMillis()
        
        lifecycleScope.launch {
            try {
                val users = withContext(Dispatchers.IO) {
                    apiService.getUsers()
                }
                
                val apiTime = System.currentTimeMillis() - apiStartTime
                println("API call took ${apiTime}ms")
                
                recyclerView.adapter = UserAdapter(users.take(5))
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                progressBar.visibility = ProgressBar.GONE
            }
        }
    }
}

class UserAdapter(private val users: List<User>) : 
    RecyclerView.Adapter<UserAdapter.ViewHolder>() {
    
    class ViewHolder(view: android.view.View) : RecyclerView.ViewHolder(view) {
        val nameText: TextView = view.findViewById(R.id.nameText)
        val emailText: TextView = view.findViewById(R.id.emailText)
    }
    
    override fun onCreateViewHolder(parent: android.view.ViewGroup, viewType: Int): ViewHolder {
        val view = android.view.LayoutInflater.from(parent.context)
            .inflate(R.layout.item_user, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.nameText.text = users[position].name
        holder.emailText.text = users[position].email
    }
    
    override fun getItemCount() = users.size
}
