function getAboutJson(clientIp) {
  const currentTime = Math.floor(Date.now() / 1000);
  
  return {
    client: {
      host: clientIp
    },
    server: {
      current_time: currentTime,
      services: [
        {
          name: "weather",
          actions: [
            {
              name: "check_temp",
              description: "Triggers if temperature is below a specified threshold"
            },
            {
              name: "check_conditions",
              description: "Triggers based on weather conditions (rain, snow, clear, etc.)"
            }
          ],
          reactions: []
        },
        {
          name: "console",
          actions: [],
          reactions: [
            {
              name: "log_message",
              description: "Logs a message to the server console"
            }
          ]
        },
        {
          name: "timer",
          actions: [
            {
              name: "interval",
              description: "Triggers at specified time intervals"
            },
            {
              name: "schedule",
              description: "Triggers at a specific date and time"
            }
          ],
          reactions: []
        },
        {
          name: "email",
          actions: [],
          reactions: [
            {
              name: "send_email",
              description: "Sends an email notification"
            }
          ]
        }
      ]
    }
  };
}

module.exports = { getAboutJson };
