pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO_URL = '982081074169.dkr.ecr.us-east-1.amazonaws.com/safeentry'  // e.g., 123456789012.dkr.ecr.us-east-1.amazonaws.com/safeentry
        IMAGE_TAG = 'latest'
        ECS_CLUSTER = 'safeentry-cluster'
        ECS_SERVICE = 'safeentry-service'
        ALB_DNS = 'safeentry-alb-1228000383.us-east-1.elb.amazonaws.com'  // e.g., safeentry-alb-123456789.us-east-1.elb.amazonaws.com
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
                    dockerImage = docker.build("${ECR_REPO_URL}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to ECR') {
            when {
                branch 'dev'
            }
            steps {
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URL}
                    docker push ${ECR_REPO_URL}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to ECS') {
            when {
                branch 'dev'
            }
            steps {
                sh "aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --force-new-deployment --region ${AWS_REGION}"
            }
        }
    }

    post {
        success {
            echo "Deployment successful! Access the app at: http://${ALB_DNS}"
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}