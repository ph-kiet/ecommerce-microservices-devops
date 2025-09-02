pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-southeast-2'
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')
        AWS_ECR_REGISTRY = '${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com'
        
        CLIENT_REPO_NAME = 'ecommerce-cicd-project/client'
        CLIENT_REPO_URL = '${AWS_ECR_REGISTRY}/${CLIENT_REPO_NAME}' 
    }

    stages {
        stage ("Build Docker Image") {
            steps {
                sh 'docker build -t ${CLIENT_REPO_URL}:latest ./client'
            }
        }

        stage ("Push Image To ECR") {
            steps {
                sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_REGISTRY}'
                sh 'docker push ${CLIENT_REPO_URL}:latest'
            }
        }
    }

    post {
        always {
            sh 'docker logout ${AWS_ECR_REGISTRY}'
        }
    }
}