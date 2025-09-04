 data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# CloudWatch Log Group (optional but recommended)
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/frontend"
  retention_in_days = 7
}


resource "aws_ecs_task_definition" "service" {
  family = "frontend-task"
  network_mode = "awsvpc"
  requires_compatibilities =  ["FARGATE"]
    cpu                      = "256"
  memory                   = "512"
   execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn   # 👈 yeh add karna zaroori hai

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      cpu       = 10
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      # environment=[
      #   {
      #      name = "MONGODB_URI" 
      #      value="mongodb+srv://DevSaini:dev1256@cluster0.pugztbw.mongodb.net/onsko"

      #   },
      #   {
      #      name="PORT"
      #      value="3000" 
      #   },
      #   {
      #       name = "JWT_SECRET"
      #       value = "devsaini1256oiuoiuyfghvbnkloiuytfdghjkl"
      #   },
      #   {
      #       name = "IMAGEKIT_PUBLIC_KEY"
      #       value = "public_+kbNS5EXmIxczVGSE191mnneD+I="
      #   },
      #    {
      #       name = "IMAGEKIT_PRIVATE_KEY"
      #       value = "private_9Vpa0x1TcIWbJGSg07LtXRdV2e4="
      #   },
      #    {
      #       name = "IMAGEKIT_ID"
      #       value = "mkjyuczro"
      #   },
      #    {
      #       name = "IMAGEKIT_URL"
      #       value = "https://ik.imagekit.io/mkjyuczro"
      #   },
      # ]
         logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.frontend.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    },
   
  ]
  )

    

   
}



resource "aws_ecs_cluster" "frontendcluster" {
    name = "frontendcluster"
    setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
}


 
data "aws_vpc" "default" {
  default = true
}

# Get all default subnets inside that VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}


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




resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow HTTP from anywhere"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "ecs_alb" {
  name   = "ecs-alb"
  internal = false
  load_balancer_type = "application"
  security_groups = [aws_security_group.alb_sg.id]
  subnets = data.aws_subnets.default.ids
  
}


resource "aws_lb_target_group" "ecs_tg" {
  name        = "ecs-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"   # Fargate ke liye hamesha "ip"
    health_check {
    path                = "/"   # jo bhi tumhara app support karta ho
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}


resource "aws_lb_listener" "ecs_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}


resource "aws_ecs_service" "service" {
  name            = "frontend"
  cluster         = aws_ecs_cluster.frontendcluster.id
  task_definition = aws_ecs_task_definition.service.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  
   network_configuration {
  subnets          = data.aws_subnets.default.ids   # सारे default subnets
  security_groups  = [aws_security_group.SG-ecs.id]
  assign_public_ip = true   # क्योंकि default subnets public हैं
}
 
load_balancer {
  target_group_arn = aws_lb_target_group.ecs_tg.arn
  container_name   = "frontend"   # same as containerDefinition name in task def
    container_port   = 80

}
 depends_on = [
    aws_lb_listener.ecs_listener
  ]
   
 
}

 

 