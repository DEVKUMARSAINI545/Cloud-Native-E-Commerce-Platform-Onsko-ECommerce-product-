#!/bin/bash


sudo apt update -y

sudo apt install docker.io
sudo sysmtectl start docker
sudo systemctl enable docker
# sudo usermod -aG docker 
sudo usermod -aG docker ubuntu
newgrp docker


# awscli install command 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install