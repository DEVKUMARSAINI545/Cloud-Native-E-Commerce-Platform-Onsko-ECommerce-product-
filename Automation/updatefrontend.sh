#!/bin/bash
set -euo pipefail

# ====== CONFIGURATION ======
INSTANCE_ID="i-0e7be9c55eafcc7cf"   # EC2 instance id (if using EC2)
ENV_FILE="../Frontend/.env"
BACKEND_PORT=31100
BACKEND_PATH="/api/v1/onsko"

# ====== FUNCTIONS ======
get_backend_ip() {
    # For EC2 public IP
    aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text
}

update_backend_url() {
    local ip="$1"
    local url="http://${ip}:${BACKEND_PORT}${BACKEND_PATH}"

    if grep -q "^VITE_BACKEND_URI=" "$ENV_FILE"; then
        sed -i -e "s|^VITE_BACKEND_URI=.*|VITE_BACKEND_URI=\"${url}\"|g" "$ENV_FILE"
        echo "Updated VITE_BACKEND_URI to ${url} in $ENV_FILE"
    else
        echo "VITE_BACKEND_URI not found. Adding it."
        echo "VITE_BACKEND_URI=\"${url}\"" >> "$ENV_FILE"
    fi
}

# ====== MAIN SCRIPT ======
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Environment file not found at $ENV_FILE"
    exit 1
fi

# Fetch backend IP
BACKEND_IP=$(get_backend_ip)

CURRENT_URL=$(grep "^VITE_BACKEND_URI=" "$ENV_FILE" || echo "")

NEW_URL="VITE_BACKEND_URI=\"http://${BACKEND_IP}:${BACKEND_PORT}${BACKEND_PATH}\""

if [[ "$CURRENT_URL" != "$NEW_URL" ]]; then
    update_backend_url "$BACKEND_IP"
else
    echo "VITE_BACKEND_URI is already up to date: $CURRENT_URL"
fi


