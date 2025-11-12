# AWS Credentials Setup - Step by Step

## Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process (requires email, password, credit card)
4. Verify your email address

## Step 2: Install AWS CLI

### Windows (PowerShell)
```powershell
# Download and install from:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Or using Chocolatey (if installed):
choco install awscli

# Or using winget:
winget install Amazon.AWSCLI
```

### Verify Installation
```powershell
aws --version
# Should show: aws-cli/2.x.x
```

## Step 3: Create IAM User with Programmatic Access

1. **Sign in to AWS Console**: https://console.aws.amazon.com/

2. **Navigate to IAM**:
   - Search for "IAM" in the top search bar
   - Click "IAM" service

3. **Create User**:
   - Click "Users" in the left sidebar
   - Click "Create user" button
   - Enter username: `riserite-dev` (or any name you prefer)
   - Click "Next"

4. **Set Permissions**:
   - Select "Attach policies directly"
   - Search and select these policies:
     - `AmazonDynamoDBFullAccess`
     - `AmazonS3FullAccess`
     - `AWSLambda_FullAccess` (optional, for future Lambda functions)
   - Click "Next"

5. **Review and Create**:
   - Review the user details
   - Click "Create user"

6. **Save Credentials**:
   - Click on the newly created user
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Click "Next"
   - Add a description (optional): "RiseRite Development"
   - Click "Create access key"
   - **IMPORTANT**: Copy both:
     - **Access Key ID** (e.g., `AKIAIOSFODNN7EXAMPLE`)
     - **Secret Access Key** (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - **Save these securely** - you won't be able to see the secret key again!
   - Click "Done"

## Step 4: Configure AWS CLI

Open PowerShell or Command Prompt and run:

```powershell
aws configure
```

You'll be prompted for 4 things:

1. **AWS Access Key ID**: Paste your Access Key ID
2. **AWS Secret Access Key**: Paste your Secret Access Key
3. **Default region name**: Enter `us-east-1` (or your preferred region)
4. **Default output format**: Enter `json`

Example:
```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

## Step 5: Verify Configuration

Test that your credentials work:

```powershell
aws sts get-caller-identity
```

You should see output like:
```json
{
    "UserId": "AIDAIOSFODNN7EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/riserite-dev"
}
```

If you see an error, double-check your credentials.

## Step 6: Create DynamoDB Table

Create the WakeSessions table:

```powershell
aws dynamodb create-table `
  --table-name WakeSessions `
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=date,AttributeType=S `
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=date,KeyType=RANGE `
  --billing-mode PAY_PER_REQUEST
```

Wait for the table to be created (check status):
```powershell
aws dynamodb describe-table --table-name WakeSessions
```

## Step 7: Set Environment Variables for Backend

For the FastAPI backend, create a `.env` file in `api/fastapi/`:

```powershell
cd api/fastapi
```

Create `.env` file with:
```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=WakeSessions
```

**Important**: Replace `your_access_key_here` and `your_secret_key_here` with your actual credentials.

## Alternative: Use AWS Credentials File Directly

The backend can also read from the default AWS credentials file at:
- Windows: `C:\Users\YourUsername\.aws\credentials`

If you've configured AWS CLI, the backend will automatically use those credentials if you don't set environment variables.

## Troubleshooting

### "Unable to locate credentials"
- Make sure you ran `aws configure` correctly
- Check that credentials file exists: `cat ~/.aws/credentials` (Linux/Mac) or `type %USERPROFILE%\.aws\credentials` (Windows)

### "Access Denied" errors
- Verify IAM user has the correct policies attached
- Check that you're using the right region
- Ensure DynamoDB table name matches in your code

### "Table already exists"
- The table might already be created
- Check with: `aws dynamodb list-tables`
- Delete if needed: `aws dynamodb delete-table --table-name WakeSessions`

## Security Best Practices

1. **Never commit credentials to Git** - The `.env` file is in `.gitignore`
2. **Use IAM roles** in production (instead of access keys)
3. **Rotate access keys** regularly
4. **Use least privilege** - Only grant necessary permissions
5. **Enable MFA** on your AWS account root user

## Next Steps

Once credentials are configured:
1. Test backend: `cd api/fastapi && python main.py`
2. Test DynamoDB: The backend will automatically use your credentials
3. Start mobile app: `cd mobile && npx expo start`


