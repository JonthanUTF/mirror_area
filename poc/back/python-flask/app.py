from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.route('/about.json', methods=['GET'])
def about():
    response = {
        "client": {
            "host": request.remote_addr
        },
        "server": {
            "current_time": int(time.time()),
            "services": [
                {
                    "name": "Weather",
                    "actions": [
                        {"name": "temperature_change", "description": "Triggers when temperature changes"},
                        {"name": "humidity_change", "description": "Triggers when humidity changes"}
                    ],
                    "reactions": [
                        {"name": "send_email", "description": "Sends an email notification"},
                        {"name": "log_data", "description": "Logs the weather data"}
                    ]
                },
                {
                    "name": "GitHub",
                    "actions": [
                        {"name": "new_commit", "description": "Triggers on new commit"},
                        {"name": "new_issue", "description": "Triggers on new issue"}
                    ],
                    "reactions": [
                        {"name": "create_issue", "description": "Creates a new issue"},
                        {"name": "post_comment", "description": "Posts a comment on an issue"}
                    ]
                },
                {
                    "name": "Timer",
                    "actions": [
                        {"name": "every_hour", "description": "Triggers every hour"},
                        {"name": "every_day", "description": "Triggers every day"}
                    ],
                    "reactions": [
                        {"name": "print_log", "description": "Prints a log message"}
                    ]
                }
            ]
        }
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
