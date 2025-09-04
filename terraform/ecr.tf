resource "aws_ecr_repository" "frontend" {
  name                 = var.aws_ecr_repository   # repository name
  image_tag_mutability = "MUTABLE"    # tags can be overwritten
  image_scanning_configuration {
    scan_on_push = true               # auto scan images
  }
 
}