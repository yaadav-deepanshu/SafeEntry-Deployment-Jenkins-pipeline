pipeline {
    agent any
    tools {
        nodejs 'Node18'
    }
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO_URL = '982081074169.dkr.ecr.us-east-1.amazonaws.com/safeentry'
        IMAGE_TAG = "${env.BUILD_ID}"
        ECS_CLUSTER = 'safeentry-cluster'
        ECS_SERVICE = 'safeentry-service'
        ALB_DNS = 'safeentry-alb-1988418172.us-east-1.elb.amazonaws.com'
        DOCKER_IMAGE = ''
    }
    stages {
        stage('Checkout') {
            when {
                branch 'dev'
            }
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    DOCKER_IMAGE = docker.build("${ECR_REPO_URL}:${IMAGE_TAG}", "--no-cache .")
                }
            }
        }
        stage('Push to ECR') {
            when {
                branch 'dev'
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    script {
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URL}"
                        DOCKER_IMAGE.push()
                    }
                }
            }
        }
        stage('Deploy to ECS') {
            when {
                branch 'dev'
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                    aws ecs update-service \
                        --cluster ${ECS_CLUSTER} \
                        --service ${ECS_SERVICE} \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    """
                }
            }
        }
    }
    post {
        success {
            echo "Deployment successful! Access the app at: http://${ALB_DNS}"
        }
        failure {
            echo "Pipeline failed. Check AWS credentials, Node.js configuration, ECR, or ECS configuration."
        }
    }
}