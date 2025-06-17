
# PR Analysis Workflow

This document provides instructions on how to run the `pr-analysis` workflow for the o2c-audit-service project.

## Overview

The `pr-analysis` workflow is designed to run SonarQube analysis on pull requests. It is triggered automatically upon different pull request actions or manually via the GitHub Actions interface.

## Triggering the Workflow

### Automatically

The workflow is set to trigger automatically on the following pull request actions:
- Opened
- Synchronized
- Reopened

### Manually

You can also trigger the workflow manually using the "workflow_dispatch" event. To do this:
1. Navigate to the **Actions** tab in your GitHub repository.
2. Select the **PR Analysis** workflow from the list.
3. Click on the **Run workflow** button on the right side to start the workflow manually.

If you want to run only for PR generated from feature/** branch, then you can mark prAnalysisFeatureBranch as true.

## Secrets Configuration

The workflow requires several secrets to be configured in your repository:
- `SONAR_TOKEN`: This token is necessary for SonarQube authentication.
- `AWS_ACCOUNT_ID`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`: These AWS credentials are required for accessing resources used during the analysis.

Ensure these secrets are configured in the repository settings under **Secrets and Variables** > **Actions**.

## File Usage

This Markdown file should be used as a guide for running and managing the `pr-analysis` workflow for pull requests within the o2c-audit-service project. It helps ensure consistent SonarQube analysis across all new and modified pull requests.

--- 

<br> <br>
# AWS OIDC Authentication Setup

This document provides a guide to configuring GitHub Actions to authenticate with AWS using OpenID Connect (OIDC), eliminating the need for long-lived credentials stored as secrets.

## Steps for OIDC Setup

### 1. Grant IAM Trust to GitHub

1. **Create an IAM Role in AWS**:
   - Go to the IAM console and create a new role with EC2 as the trusted entity.
   - Copy the Role ARN for use in your GitHub Actions.

2. **Add Trust Relation**:
   - Update the trust policy of the IAM role to allow GitHub as a federated entity:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Principal": {
             "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
           },
           "Action": "sts:AssumeRoleWithWebIdentity",
           "Condition": {
             "StringEquals": {
               "token.actions.githubusercontent.com:sub": "repo:<OWNER>/<REPO>:ref:refs/heads/<BRANCH>"
             }
           }
         }
       ]
     }
     ```

### 2. Modify GitHub Actions Workflow

1. **Update your GitHub Actions workflow YAML**:
   - Remove AWS access and secret keys from secrets.
   - Use the following template to configure OIDC in your workflow:
     ```yaml
     jobs:
       deploy:
         runs-on: ubuntu-latest
         permissions:
           id-token: write
           contents: read
         steps:
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v1
           with:
             role-to-assume: arn:aws:iam::<AWS_ACCOUNT_ID>:role/<ROLE_NAME>
             aws-region: us-east-1
     
         - name: Deploy to AWS
           run: |
             aws s3 ls
     ```

### 3. Test Your Setup

1. Trigger a workflow run to test that the AWS deployment steps execute without requiring the access and secret keys.

### Important Considerations

- **Security**: Ensure that your IAM role has the least privilege necessary.
- **Branch Protection**: Set conditions in the trust policy to limit which branches can assume the role.

This setup provides a more secure method for granting GitHub Actions access to AWS resources by avoiding the need to store sensitive credentials.

