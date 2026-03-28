pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.58.2-noble'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        CI = 'true'
        NODE_ENV = 'production'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running Playwright tests...'
                sh 'npm run ci'
            }
        }

        stage('Generate Reports') {
            steps {
                echo 'Generating test reports...'
                script {
                    if (fileExists('test-results/results.xml')) {
                        junit 'test-results/results.xml'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Archiving test results...'
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results/html',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }

        failure {
            echo 'Tests failed!'
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }

        success {
            echo 'Tests passed!'
        }
    }
}
