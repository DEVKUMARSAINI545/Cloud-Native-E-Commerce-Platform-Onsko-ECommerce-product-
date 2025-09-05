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
resource "aws_security_group" "backend_sg" {
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # ALB SG se hi allow karo
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
