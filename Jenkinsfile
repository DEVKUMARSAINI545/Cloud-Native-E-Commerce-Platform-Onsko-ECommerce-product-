pipeline {
    agent {label "vinod"}

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage("Project cloning"){
            steps{
                git url: "https://github.com/DEVKUMARSAINI545/3TierApplicationDeploy.git", branch: "main"
            }
        }
        stage("Build Frontend Image"){
            steps{
                dir("Frontend"){
                    sh "docker build -t frontend:latest ."
                }
            }
        }
           stage("Build Backend Image"){
            steps{
                dir("Backend"){
                    sh "docker build -t backend:latest ."
                }
            }
        }
            stage("Create ECR by Terraform"){
                steps{
                    dir("terraform"){
                        sh "terraform init"
                        sh "terraform plan"
                        sh "terraform apply -auto-approve -target=module.frontend_repo -target=module.backend_repo"
                    }
                }
            }
            stage("Push the Image on ECR"){
                steps{
                    sh "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 952346071341.dkr.ecr.ap-south-1.amazonaws.com"
                    sh "docker tag frontend:latest 952346071341.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:latest"
                    sh "docker push 952346071341.dkr.ecr.ap-south-1.amazonaws.com/frontend-repo:latest"
                }
            }
            stage("push Backend Image on ECR"){
                steps{
                    sh "docker tag backend:latest 952346071341.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:latest"
                    sh "docker push 952346071341.dkr.ecr.ap-south-1.amazonaws.com/backend-repo:latest"
                }
            }
            stage("Create Task defination and cluster "){
                steps{
                    dir("terraform"){

                        sh "terraform apply -auto-approve -target=module.frontend-task -target=module.backend-task  -target=aws_ecs_cluster.main -target=module.frontend_service -target=module.backend_service"
                    }
                }
            }
    }
}
