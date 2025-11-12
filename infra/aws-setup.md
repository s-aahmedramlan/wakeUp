# AWS Setup Instructions

## Prerequisites

1. Create an AWS account at https://aws.amazon.com/
2. Install AWS CLI: https://aws.amazon.com/cli/

## Configure AWS Credentials

1. Create an IAM user with programmatic access:
   - Go to IAM Console → Users → Add user
   - Select "Programmatic access"
   - Attach policies: `AmazonDynamoDBFullAccess`, `AmazonS3FullAccess`, `AWSLambda_FullAccess`, `AmazonAPIGatewayAdministrator`
   - Save Access Key ID and Secret Access Key

2. Configure AWS CLI:
   ```bash
   aws configure
   ```
   - Enter Access Key ID
   - Enter Secret Access Key
   - Default region: `us-east-1` (or your preferred region)
   - Default output format: `json`

3. Verify configuration:
   ```bash
   aws sts get-caller-identity
   ```

## Manual Setup for MVP (Alternative to CDK)

### DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name WakeSessions \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=date,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=date,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### S3 Bucket

```bash
aws s3 mb s3://riserite-audio-assets --region us-east-1
```

### Lambda Function (Basic)

Create a simple Lambda function for session logging (see `api/fastapi/` for implementation).

