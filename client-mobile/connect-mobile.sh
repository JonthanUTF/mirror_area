#!/bin/bash

# Default ports to reverse
PORTS=(5000 8080 8081)

function reverse_ports() {
    echo "Reversing ports..."
    for PORT in "${PORTS[@]}"; do
        adb reverse tcp:$PORT tcp:$PORT
        if [ $? -eq 0 ]; then
            echo "✅ Reversed port $PORT"
        else
            echo "❌ Failed to reverse port $PORT"
        fi
    done
}

function try_connect() {
    local IP_PORT=$1
    echo "Connecting to device at $IP_PORT..."
    OUTPUT=$(adb connect "$IP_PORT" 2>&1)
    
    if [[ $OUTPUT == *"connected to"* ]]; then
        echo "✅ Connected successfully!"
        return 0
    elif [[ $OUTPUT == *"already connected"* ]]; then
        echo "✅ Already connected!"
        return 0
    else
        echo "❌ Connection failed: $OUTPUT"
        return 1
    fi
}

function prompt_pairing() {
    echo ""
    echo "⚠️  Device not paired or connection failed."
    echo "Would you like to pair the device now? (y/n)"
    read -r ANSWER
    if [[ "$ANSWER" =~ ^[Yy]$ ]]; then
        echo ""
        echo "1. On your phone, go to 'Wireless debugging' > 'Pair device with pairing code'."
        echo "2. Enter the IP address shown (usually same IP, different port)."
        read -p "Enter IP address (e.g., 10.15.192.56): " IP
        read -p "Enter Pairing Port (from the popup): " PAIR_PORT
        read -p "Enter Pairing Code (6 digits): " PAIR_CODE
        
        echo "Pairing..."
        adb pair "$IP:$PAIR_PORT" "$PAIR_CODE"
        
        return $?
    fi
    return 1
}

# Main Logic
DEVICE_ADDR="$1"

if [ -z "$DEVICE_ADDR" ]; then
    echo "Usage: ./connect-mobile.sh <device_ip:port>"
    echo "Example: ./connect-mobile.sh 10.15.192.56:40313"
    exit 1
fi

# Try to connect
if try_connect "$DEVICE_ADDR"; then
    reverse_ports
else
    # If connection fails, ask to pair
    if prompt_pairing; then
        echo ""
        echo "Retrying connection..."
        if try_connect "$DEVICE_ADDR"; then
            reverse_ports
        else
            echo "❌ Still unable to connect. Please check IP and Port."
            exit 1
        fi
    else
        echo "Exiting."
        exit 1
    fi
fi

echo ""
echo "📱 Mobile Connectivity Setup Complete!"
echo "You can now use 'http://localhost:5000' in your mobile app."
