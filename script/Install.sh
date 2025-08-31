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

install_req || { echo "Failed to install requirements"; exit 1; }
restart_req || { echo "Failed to restart Docker"; exit 1; }