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

 
resource "aws_lb_target_group" "backend_tags" {
  name        = "backend-tg"
  port        = 3000
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

resource "aws_lb_listener_rule" "backend_rule" {
  listener_arn = aws_lb_listener.ecs_listener.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tags.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]  # Backend ke liye custom path
    }
  }
}