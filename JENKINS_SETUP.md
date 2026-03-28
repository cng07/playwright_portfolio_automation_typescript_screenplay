# Jenkins Setup Guide

## Prerequisites

- Jenkins 2.387+ with Docker support
- Node.js 18+ (for local development)
- Docker & Docker Compose
- Git plugin

## Jenkins Configuration

### 1. Create New Pipeline Job

1. Go to Jenkins Dashboard
2. Click "New Item"
3. Enter job name: `playwright-screenplay-tests`
4. Select "Pipeline"
5. Click "OK"

### 2. Configure Pipeline

#### General Settings
- **Description**: Playwright Portfolio Automation - Screenplay Pattern
- **Discard old builds**: Save for 10 most recent
- **Timeout**: 30 minutes

#### Pipeline Definition
-**Definition**: Pipeline script from SCM
- **SCM**: Git
  - **Repository URL**: `https://github.com/your-repo/playwright_portfolio_automation_typescript_screenplay`
  - **Branch Specifier**: `*/main`
  - **Credentials**: (set your GitHub credentials)
- **Script Path**: `Jenkinsfile`

### 3. Build Triggers

#### Poll SCM (Optional)
- Schedule: `H H * * *` (Daily at midnight)

#### GitHub Hook Trigger
- Requires GitHub plugin
- Configure webhook in GitHub repo settings

#### Build periodically
- Schedule: `H 2 * * *` (2 AM daily)

### 4. Save Configuration

Click "Save"

## Running the Pipeline

### Trigger Manually
1. Click "Build Now"
2. Monitor progress in "Build History"
3. View console output

### View Reports
1. Click "Playwright HTML Report" in side panel
2. Or click build number -> "Playwright HTML Report"

## Docker Agent Configuration

The Jenkinsfile uses Docker to ensure consistency:

```groovy
agent {
    docker {
        image 'mcr.microsoft.com/playwright:v1.58.2-noble'
        args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
}
```

### Prerequisites for Docker Agent
1. Docker installed on Jenkins agent
2. Jenkins user has Docker permissions
3. Volume `/var/run/docker.sock` accessible

### Enable Docker Support

```bash
# On Jenkins host
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## Pipeline Stages

### 1. Install Dependencies
```
npm ci
```
- Clean install of dependencies
- Uses package-lock.json for reproducibility

### 2. Run Tests
```
npm run ci
```
- Runs Playwright tests in CI mode
- Generates HTML, JSON, and JUnit reports

### 3. Generate Reports
```
junit 'test-results/results.xml'
publishHTML(...)
```
- Publishes JUnit results
- Publishes Playwright HTML report
- Available in Jenkins UI

## Test Results

### JUnit Report
- **Location**: `test-results/results.xml`
- **View**: Jenkins UI -> Build -> Test Results
- **Integration**: Works with "Publish Test Results" plugin

### HTML Report
- **Location**: `test-results/` directory
- **View**: Jenkins UI -> Build -> Playwright HTML Report
- **Artifacts**: Automatically archived

### JSON Results
- **Location**: `test-results/results.json`
- **Use**: Custom reporting/analysis

## Troubleshooting

### Docker Not Found
```
Error: docker: not found
```
**Solution**: Install Docker or use shell agent
```groovy
agent any  // Instead of docker agent
```

### Permission Denied
```
Error: permission denied while trying to connect to Docker daemon
```
**Solution** on Jenkins container:
```bash
docker exec jenkins /bin/bash -c "usermod -aG docker jenkins"
```

### Tests Timeout
```
Error: Timeout waiting for test completion
```
**Solution**: Increase timeout in Jenkinsfile
```groovy
timeout(time: 60, unit: 'MINUTES')
```

### Out of Memory
```
Error: JavaScript heap out of memory
```
**Solution**: Increase Node.js memory
```bash
export NODE_OPTIONS=--max_old_space_size=4096
```

## Performance Optimization

### Parallel Execution
Tests run in parallel by default (4 workers in CI):
```typescript
// playwright.config.ts
workers: process.env.CI ? 4 : undefined
```

### Caching
Jenkins automatically caches:
- `node_modules` (should be in Docker image)
- `.npm` cache via npm ci

### Reduce Browser Installation
Pre-install browsers in Docker image:
```dockerfile
RUN npx playwright install chromium firefox webkit
```

## Environment Variables

Set in Jenkins pipeline or job configuration:

```groovy
environment {
    CI = 'true'
    NODE_ENV = 'production'
    PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'test-results/junit.xml'
}
```

## Email Notifications

Add to Jenkinsfile post section:
```groovy
post {
    failure {
        emailext(
            subject: "Test Pipeline Failed",
            body: "See ${env.BUILD_URL}",
            to: "team@example.com"
        )
    }
    success {
        emailext(
            subject: "Test Pipeline Passed",
            body: "See ${env.BUILD_URL}/Playwright_HTML_Report",
            to: "team@example.com"
        )
    }
}
```

## Slack Integration

```groovy
post {
    failure {
        script {
            sh 'curl -X POST -H "Content-type: application/json" --data "{\\"text\\":\\"Test pipeline failed\\"}" YOUR_WEBHOOK_URL'
        }
    }
}
```

## Best Practices

1. **Use Container Registry**
   - Cache Docker images for faster builds

2. **Artifact Retention**
   - Keep test results for 30 days
   - Archive failed screenshots/videos

3. **Test Categorization**
   - Run smoke tests immediately
   - Run full suite on schedule

4. **Monitoring**
   - Set up alerts for failed tests
   - Track pass/fail trends

5. **Documentation**
   - Keep README updated with Jenkins URL
   - Document custom environment variables

## Advanced Configuration

### Multi-Branch Pipeline
For testing feat/fix branches:
```groovy
pipeline {
    triggers {
        githubPush()
    }
}
```

### Matrix Builds (Different Browsers)
```groovy
strategy {
    matrix {
        include: [
            { BROWSER: 'chromium' },
            { BROWSER: 'firefox' },
            { BROWSER: 'webkit' }
        ]
    }
}
```

### Conditional Stages
```groovy
stage('Deploy Report') {
    when {
        branch 'main'
    }
    steps {
        // Deploy to reporting server
    }
}
```

## Resources

- Jenkins Official: https://www.jenkins.io/
- Docker Plugin: https://plugins.jenkins.io/docker-plugin/
- Playwright CI: https://playwright.dev/docs/ci
- Pipeline Syntax: https://www.jenkins.io/doc/book/pipeline/
