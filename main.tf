terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket = "yaadav-tf-state"
    key    = "terraform/state"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" { default = "us-east-1" }
variable "vpc_cidr" { default = "10.0.0.0/16" }
variable "subnet_cidr_a" { default = "10.0.3.0/24" }
variable "subnet_cidr_b" { default = "10.0.4.0/24" }

resource "aws_vpc" "main_vpc" {
  cidr_block = var.vpc_cidr
  tags = { Name = "safeentry-vpc" }
}

resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.subnet_cidr_a
  availability_zone       = "${var.region}a"
  map_public_ip_on_launch = true
  tags = { Name = "safeentry-subnet-a" }
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.subnet_cidr_b
  availability_zone       = "${var.region}b"
  map_public_ip_on_launch = true
  tags = { Name = "safeentry-subnet-b" }
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id
  tags = { Name = "safeentry-igw" }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }
  tags = { Name = "safeentry-route-table" }
}

resource "aws_route_table_association" "public_subnet_a_association" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_b_association" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.main_vpc.id
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
  tags = { Name = "safeentry-ecs-sg" }
}

resource "aws_ecr_repository" "safeentry" {
  name = "safeentry"
  tags = { Name = "safeentry-ecr" }
}

resource "aws_ecs_cluster" "safeentry_cluster" {
  name = "safeentry-cluster"
  tags = { Name = "safeentry-cluster" }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "safeentry-ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
  tags = { Name = "safeentry-ecs-task-execution-role" }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "safeentry_task" {
  family                   = "safeentry-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = jsonencode([{
    name      = "safeentry"
    image     = "${aws_ecr_repository.safeentry.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 80
      hostPort      = 80
      protocol      = "tcp"
    }]
  }])
  tags = { Name = "safeentry-task" }
}

resource "aws_ecs_service" "safeentry_service" {
  name            = "safeentry-service"
  cluster         = aws_ecs_cluster.safeentry_cluster.id
  task_definition = aws_ecs_task_definition.safeentry_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.safeentry_tg.arn
    container_name   = "safeentry"
    container_port   = 80
  }
  depends_on = [aws_lb_listener.http]
  tags = { Name = "safeentry-service" }
}

resource "aws_lb" "safeentry_alb" {
  name               = "safeentry-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_sg.id]
  subnets            = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
  tags = { Name = "safeentry-alb" }
}

resource "aws_lb_target_group" "safeentry_tg" {
  name        = "safeentry-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main_vpc.id
  target_type = "ip"
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = { Name = "safeentry-tg" }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.safeentry_alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.safeentry_tg.arn
  }
  tags = { Name = "safeentry-listener" }
}

output "alb_dns_name" {
  value = aws_lb.safeentry_alb.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.safeentry.repository_url
}