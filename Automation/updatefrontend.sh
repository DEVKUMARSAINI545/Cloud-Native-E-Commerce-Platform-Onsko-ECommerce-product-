 #!/bin/bash
# Script to update BACKEND_URL in .env.docker with the public IP of an EC2 instance

set -euo pipefail  # Exit on errors, undefined vars, and pipe failures

# ====== CONFIGURATION ======
INSTANCE_ID="i-030da7d31a1dbbffc"
ENV_FILE="../frontend/.env.docker"
PORT=5000  # backend port

# ====== FUNCTIONS ======
get_ec2_public_ip() {
    aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text
}

update_backend_url() {
    local ip="$1"
    if grep -q "^VITE_BACKEND_URI==" "$ENV_FILE"; then
        sed -i -e "s|^VITE_BACKEND_URI==.*|VITE_BACKEND_URI==\"http://${ip}:${PORT}\"|g" "$ENV_FILE"
        echo "Updated VITE_BACKEND_URI= to http://${ip}:${PORT} in $ENV_FILE"
    else
        echo "VITE_BACKEND_URI= not found in $ENV_FILE. Adding it."
        echo "VITE_BACKEND_URI==\"http://${ip}:${PORT}\"" >> "$ENV_FILE"
    fi
}

# ====== MAIN SCRIPT ======
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Environment file not found at $ENV_FILE"
    exit 1
fi

# Get current EC2 public IP
PUBLIC_IP=$(get_ec2_public_ip)

# Get current BACKEND_URL in the file
CURRENT_URL=$(grep "^VITE_BACKEND_URI==" "$ENV_FILE" || echo "")

# Update only if different
if [[ "$CURRENT_URL" != "VITE_BACKEND_URI==\"http://${PUBLIC_IP}:${PORT}\"" ]]; then
    update_backend_url "$PUBLIC_IP"
else
    echo "VITE_BACKEND_URI= is already up to date: $CURRENT_URL"
fi
