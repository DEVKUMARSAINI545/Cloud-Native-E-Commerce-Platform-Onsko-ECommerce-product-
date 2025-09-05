module "frontend-task" {
  source = "./modules/ecs-task"
  family="frontend-task"
  container_name = "frontend"
  container_port = 80
  host_port = 80
  image = "${module.frontend_repo.aws_ecr_repository_url}:latest"
  logs_name = "frontend"
}
module "backend-task" {
  source = "./modules/ecs-task"
  family="backend-task"
  container_name = "backend"
  container_port = 3000
  host_port = 3000
  image = "${module.backend_repo.aws_ecr_repository_url}:latest"
  logs_name = "backend"
}