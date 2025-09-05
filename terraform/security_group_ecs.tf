resource "aws_security_group" "SG-ecs" {
   name        = "ecs-tasks-sg"
  description = "Allow ALB to reach ECS tasks"
  vpc_id      = data.aws_vpc.default.id

ingress {
    from_port       = 80     # container port
    to_port         = 80
    protocol        = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
}
