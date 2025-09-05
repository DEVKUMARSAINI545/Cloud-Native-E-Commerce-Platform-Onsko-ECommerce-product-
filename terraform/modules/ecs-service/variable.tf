variable "name" {
  description = "Name of the ECS service"
  type        = string
}

variable "cluster_id" {
  description = "ECS cluster ID"
  type        = string
}

variable "task_definition" {
  description = "ECS task definition ARN"
  type        = string
}

variable "desired_count" {
  description = "Number of tasks to run"
  type        = number
  default     = 1
}

variable "subnets" {
  description = "Subnets for ECS tasks"
  type        = list(string)
}

variable "security_groups" {
  description = "Security groups for ECS tasks"
  type        = list(string)
}

variable "assign_public_ip" {
  description = "Whether to assign public IP"
  type        = bool
  default     = true
}

variable "target_group_arn" {
  description = "Target group ARN for load balancer"
  type        = string
}

variable "container_name" {
  description = "Name of container inside the task definition"
  type        = string
}

variable "container_port" {
  description = "Port exposed by container"
  type        = number
}

variable "alb_listener" {
  description = "ALB listener resource for dependency"
  type        = any
}
