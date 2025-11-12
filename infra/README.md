# Infrastructure

AWS infrastructure for RiseRite MVP.

## Setup

1. Configure AWS credentials:
   ```bash
   aws configure
   ```

2. Deploy infrastructure:
   ```bash
   cd infra
   # Using CDK (recommended)
   npm install
   cdk deploy
   
   # Or using AWS CLI/Terraform
   ```

## Services

- **Cognito**: User authentication (can be added later for MVP)
- **DynamoDB**: WakeSessions table for session logging
- **S3**: Audio assets storage
- **Lambda**: API endpoints for session logging
- **API Gateway**: REST API for mobile app


