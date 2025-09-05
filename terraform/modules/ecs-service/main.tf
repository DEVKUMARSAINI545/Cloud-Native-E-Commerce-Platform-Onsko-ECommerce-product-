
resource "aws_ecs_service" "service" {
  name            = var.name
  cluster         = var.cluster_id
  task_definition = var.task_definition
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  
   network_configuration {
  subnets          = var.subnets   # सारे default subnets
  security_groups  = var.security_groups
  assign_public_ip = var.assign_public_ip   # क्योंकि default subnets public हैं
}
 
load_balancer {
  target_group_arn = var.target_group_arn
  container_name   = var.container_name   # same as containerDefinition name in task def
    container_port   = var.container_port

}
 depends_on = [
    var.alb_listener
  ]
   
 
}
