module "frontend_repo" {
    source = "./modules/ecr"
    name = "frontend-repo"
  
}
module "backend_repo" {
    source = "./modules/ecr"
    name = "backend-repo"
  
}