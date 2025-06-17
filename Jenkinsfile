pipeline {
    agent any

    stages {
        stage('Debug Branch Info') {
            steps {
                script {
                    echo "Current branch: ${env.BRANCH_NAME}"
                    sh '''
                        echo "Git branch from command:"
                        git branch --show-current
                        echo "Git status:"
                        git status
                        echo "Git remote info:"
                        git remote -v
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    try {
                        deleteDir()
                        checkout scm
                    } catch (Exception e) {
                        error "Failed to checkout repository: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    try {
                        echo 'Build stage - Add your build commands here'
                        sh 'echo "Build completed successfully"'
                    } catch (Exception e) {
                        error "Build failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        echo 'Test stage - Add your test commands here'
                        sh 'echo "Tests completed successfully"'
                    } catch (Exception e) {
                        error "Tests failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Merge to Develop') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    echo "Running on develop branch"
                }
            }
        }

        stage('Merge to QA') {
            when {
                branch 'release'
            }
            steps {
                script {
                    echo "Running on release branch"
                }
            }
        }

        stage('Merge to UAT') {
            when {
                branch 'UAT'
            }
            steps {
                script {
                    echo "Running on UAT branch"
                }
            }
        }

        stage('Merge to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Do you want to proceed with the production deployment?',
                          ok: 'Yes, proceed'
                    echo "Approved - proceeding with production deployment"
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
} 
