const express = require('express');
const app = express();
const port = 8080;

// Trust proxy to get the correct IP address if behind a proxy (like Docker/Nginx)
app.set('trust proxy', true);

app.get('/about.json', (req, res) => {
  const response = {
    client: {
      host: req.ip
    },
    server: {
      current_time: Math.floor(Date.now() / 1000),
      services: [
        {
          name: "Weather",
          actions: [
            { name: "temperature_change", description: "Triggers when temperature changes" },
            { name: "humidity_change", description: "Triggers when humidity changes" }
          ],
          reactions: [
            { name: "send_email", description: "Sends an email notification" },
            { name: "log_data", description: "Logs the weather data" }
          ]
        },
        {
          name: "GitHub",
          actions: [
            { name: "new_commit", description: "Triggers on new commit" },
            { name: "new_issue", description: "Triggers on new issue" }
          ],
          reactions: [
            { name: "create_issue", description: "Creates a new issue" },
            { name: "post_comment", description: "Posts a comment on an issue" }
          ]
        },
        {
          name: "Timer",
          actions: [
            { name: "every_hour", description: "Triggers every hour" },
            { name: "every_day", description: "Triggers every day" }
          ],
          reactions: [
            { name: "print_log", description: "Prints a log message" }
          ]
        }
      ]
    }
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Node.js Express server listening on port ${port}`);
});
