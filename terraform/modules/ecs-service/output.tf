output "service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.service.name


}

output "service_id" {
  description = "ID of the ECS service"
  value       = aws_ecs_service.service.id
}