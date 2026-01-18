package com.area.mobile.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.area.mobile.data.model.ActivityLog
import com.area.mobile.data.model.ExecutionStatus
import com.area.mobile.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ActivityScreen(
    paddingValues: PaddingValues
) {
    val activities = listOf(
        ActivityLog(
            id = "1",
            areaId = "1",
            areaName = "GitHub PR to Discord",
            status = ExecutionStatus.SUCCESS,
            message = "Successfully sent notification to Discord",
            timestamp = System.currentTimeMillis() - 300000
        ),
        ActivityLog(
            id = "2",
            areaId = "2",
            areaName = "Gmail to Drive Backup",
            status = ExecutionStatus.SUCCESS,
            message = "File uploaded to Drive successfully",
            timestamp = System.currentTimeMillis() - 3600000
        ),
        ActivityLog(
            id = "3",
            areaId = "4",
            areaName = "Daily Standup",
            status = ExecutionStatus.SUCCESS,
            message = "Daily reminder sent",
            timestamp = System.currentTimeMillis() - 7200000
        ),
        ActivityLog(
            id = "4",
            areaId = "3",
            areaName = "Weather Alert",
            status = ExecutionStatus.FAILED,
            message = "Failed to connect to Discord API",
            timestamp = System.currentTimeMillis() - 10800000
        )
    )
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddingValues),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "Recent executions and events from your AREAs",
                fontSize = 14.sp,
                color = Slate400,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }
        
        items(activities.size) { index ->
            ActivityCard(activity = activities[index])
        }
    }
}

@Composable
fun ActivityCard(activity: ActivityLog) {
    val statusColor = when (activity.status) {
        ExecutionStatus.SUCCESS -> GreenSuccess
        ExecutionStatus.FAILED -> RedError
        ExecutionStatus.PENDING -> OrangeWarning
    }
    
    val statusIcon = when (activity.status) {
        ExecutionStatus.SUCCESS -> Icons.Default.CheckCircle
        ExecutionStatus.FAILED -> Icons.Default.Clear
        ExecutionStatus.PENDING -> Icons.Default.DateRange
    }
    
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
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(statusColor.copy(alpha = 0.2f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = statusIcon,
                    contentDescription = activity.status.name,
                    tint = statusColor,
                    modifier = Modifier.size(20.dp)
                )
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = activity.areaName,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = activity.message,
                    fontSize = 13.sp,
                    color = Slate400,
                    maxLines = 2
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = formatTimestamp(activity.timestamp),
                    fontSize = 11.sp,
                    color = Slate400,
                    maxLines = 1
                )
            }
        }
    }
}

fun formatTimestamp(timestamp: Long): String {
    val now = System.currentTimeMillis()
    val diff = now - timestamp
    
    return when {
        diff < 60000 -> "Just now"
        diff < 3600000 -> "${diff / 60000} minutes ago"
        diff < 86400000 -> "${diff / 3600000} hours ago"
        else -> SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault()).format(Date(timestamp))
    }
}
