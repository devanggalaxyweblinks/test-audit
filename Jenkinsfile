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

        stage('Install Dependencies') {
            steps {
                script {
                    try {
                        sh 'npm install'
                    } catch (Exception e) {
                        error "Failed to install dependencies: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    try {
                        sh 'npm run lint'
                    } catch (Exception e) {
                        error "Linting failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        sh 'npm run test'
                    } catch (Exception e) {
                        error "Tests failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm run build'
                    } catch (Exception e) {
                        error "Build failed: ${e.getMessage()}"
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
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
} 
