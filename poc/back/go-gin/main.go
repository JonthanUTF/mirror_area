package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Structures for the about.json response
type Action struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Reaction struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Service struct {
	Name      string     `json:"name"`
	Actions   []Action   `json:"actions"`
	Reactions []Reaction `json:"reactions"`
}

type ServerInfo struct {
	CurrentTime int64     `json:"current_time"`
	Services    []Service `json:"services"`
}

type ClientInfo struct {
	Host string `json:"host"`
}

type AboutResponse struct {
	Client ClientInfo `json:"client"`
	Server ServerInfo `json:"server"`
}

func main() {
	// Initialize Gin router
	r := gin.Default()

	// Define the /about.json route
	r.GET("/about.json", func(c *gin.Context) {
		response := AboutResponse{
			Client: ClientInfo{
				Host: c.ClientIP(),
			},
			Server: ServerInfo{
				CurrentTime: time.Now().Unix(),
				Services: []Service{
					{
						Name: "Weather",
						Actions: []Action{
							{Name: "temperature_change", Description: "Triggers when temperature changes"},
							{Name: "humidity_change", Description: "Triggers when humidity changes"},
						},
						Reactions: []Reaction{
							{Name: "send_email", Description: "Sends an email notification"},
							{Name: "log_data", Description: "Logs the weather data"},
						},
					},
					{
						Name: "GitHub",
						Actions: []Action{
							{Name: "new_commit", Description: "Triggers on new commit"},
							{Name: "new_issue", Description: "Triggers on new issue"},
						},
						Reactions: []Reaction{
							{Name: "create_issue", Description: "Creates a new issue"},
							{Name: "post_comment", Description: "Posts a comment on an issue"},
						},
					},
					{
						Name: "Timer",
						Actions: []Action{
							{Name: "every_hour", Description: "Triggers every hour"},
							{Name: "every_day", Description: "Triggers every day"},
						},
						Reactions: []Reaction{
							{Name: "print_log", Description: "Prints a log message"},
						},
					},
				},
			},
		}
		c.JSON(http.StatusOK, response)
	})

	// Start the server on port 8080
	r.Run(":8080")
}
