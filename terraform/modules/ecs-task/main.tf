 data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# CloudWatch Log Group (optional but recommended)
resource "aws_cloudwatch_log_group" "logs" {
  name              = "/ecs/${var.logs_name}"
  retention_in_days = 7
}



resource "aws_ecs_task_definition" "service" {
  family = var.family
  network_mode = "awsvpc"
  requires_compatibilities =  ["FARGATE"]
    cpu                      = 256
  memory                   = 512
   execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn   # 👈 yeh add karna zaroori hai

  container_definitions = jsonencode([
    {
      name      =   var.container_name 
      image     =  var.image  
      cpu       = 10
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = var.container_port 
          hostPort      = var.host_port 
          protocol      = "tcp"
        }
      ]
      environment=[
        {
           name = "MONGODB_URI" 
           value="mongodb+srv://DevSaini:dev1256@cluster0.pugztbw.mongodb.net/onsko"

        },
        {
           name="PORT"
           value="3000" 
        },
        {
            name = "JWT_SECRET"
            value = "devsaini1256oiuoiuyfghvbnkloiuytfdghjkl"
        },
        {
            name = "IMAGEKIT_PUBLIC_KEY"
            value = "public_+kbNS5EXmIxczVGSE191mnneD+I="
        },
         {
            name = "IMAGEKIT_PRIVATE_KEY"
            value = "private_9Vpa0x1TcIWbJGSg07LtXRdV2e4="
        },
         {
            name = "IMAGEKIT_ID"
            value = "mkjyuczro"
        },
         {
            name = "IMAGEKIT_URL"
            value = "https://ik.imagekit.io/mkjyuczro"
        },
         {
            name = "FRONTEND_URI"
            value = "http://ecs-alb-437145697.ap-south-1.elb.amazonaws.com"
        },

      ]
         logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.logs.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    },
   
  ]
  )

    

   
}
