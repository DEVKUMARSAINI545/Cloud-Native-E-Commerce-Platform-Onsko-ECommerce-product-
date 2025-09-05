module "frontend_service" {
    source = "./modules/ecs-service"
    name = "frontend-service"
    cluster_id = aws_ecs_cluster.main.id
    task_definition = module.frontend-task.task_definition_arn
   desired_count    = 2
     subnets          = data.aws_subnets.default.ids
  security_groups  = [aws_security_group.SG-ecs.id]
  assign_public_ip = true
  target_group_arn = aws_lb_target_group.ecs_tg.arn
  container_name   = "frontend"
  container_port   = 80
  alb_listener     = aws_lb_listener.ecs_listener
}