 #!/bin/bash

install_req() {
    echo "Installing requirements"
    sudo apt update -y
    sudo apt-get install -y docker.io
    wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
  sudo apt install terraform
}

restart_req() {
    echo "Restarting Docker"
    sudo chown $USER:docker /var/run/docker.sock
    sudo systemctl start docker
    sudo systemctl enable docker
}

pull_images() {
    docker pull devsaini255/ecommercefrontend:latest
    docker pull devsaini255/ecommercebackend:latest
}

# run_images() {
#     EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
   
#     sudo docker run -d -p 80:5173 \
#         -e VITE_SERVER_URL="http://$EC2_IP:3000/api/v1/onsko" \
#         devsaini255/ecommercefrontend:latest

#     sudo docker run -d -p 3000:3000 \
#         -e MONGODB_URI="mongodb+srv://DevSaini:dev1256@cluster0.pugztbw.mongodb.net/onsko" \
#         -e PORT=3000 \
#         -e JWT_SECRET="devsain1256000" \
#         devsaini255/ecommercebackend:latest
# }

echo "******* STARTING INSTALLATION *******"

install_req || { echo "Failed to install requirements"; exit 1; }
restart_req || { echo "Failed to restart Docker"; exit 1; }
pull_images || { echo "Failed to pull Docker images"; exit 1; }
# run_images   || { echo "Failed to run Docker containers"; exit 1; }

echo "************* INSTALLATION COMPLETE *************"
