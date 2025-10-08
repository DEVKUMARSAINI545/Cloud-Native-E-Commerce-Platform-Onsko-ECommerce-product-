


#!/bin/bash
# Script to update FRONTEND_URL in .env.docker with the public IP of an EC2 instance

set -euo pipefail  # Exit on errors, undefined vars, and pipe failures

# ====== CONFIGURATION ======
INSTANCE_ID="i-0e7be9c55eafcc7cf"
ENV_FILE="../Backend/.env"
PORT=31000

# ====== FUNCTIONS ======
get_ec2_public_ip() {
    aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text
}

update_frontend_url() {
    local ip="$1"
    if grep -q "^FRONTEND_URI=" "$ENV_FILE"; then
        sed -i -e "s|^FRONTEND_URI=.*|FRONTEND_URI=\"http://${ip}:${PORT}\"|g" "$ENV_FILE"
        echo "Updated FRONTEND_URI to http://${ip}:${PORT} in $ENV_FILE"
    else
        echo "FRONTEND_URI not found in $ENV_FILE. Adding it."
        echo "FRONTEND_URI=\"http://${ip}:${PORT}\"" >> "$ENV_FILE"
    fi
}

# ====== MAIN SCRIPT ======
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Environment file not found at $ENV_FILE"
    exit 1
fi

# Get current EC2 public IP
PUBLIC_IP=$(get_ec2_public_ip)

# Get current FRONTEND_URL in the file
CURRENT_URL=$(grep "^FRONTEND_URI=" "$ENV_FILE" || echo "")

# Update only if different
if [[ "$CURRENT_URL" != "FRONTEND_URI=\"http://${PUBLIC_IP}:${PORT}\"" ]]; then
    update_frontend_url "$PUBLIC_IP"
else
    echo "FRONTEND_URI is already up to date: $CURRENT_URL"
fi
