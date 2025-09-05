resource "aws_ecr_repository" "repo" {
  name                 = var.name   # repository name
  image_tag_mutability = "MUTABLE"    # tags can be overwritten
  image_scanning_configuration {
    scan_on_push = true               # auto scan images
  }
 
}