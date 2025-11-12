# Setting Up Your AWS Credentials - Next Steps

You have your Access Key ID and Secret Access Key. Now you need to configure them.

## Option 1: Install AWS CLI (Recommended)

### Step 1: Install AWS CLI

**Windows:**
1. Download the MSI installer: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Run the installer
3. Restart your terminal/PowerShell

**Or use winget:**
```powershell
winget install Amazon.AWSCLI
```

### Step 2: Configure AWS CLI

Open PowerShell and run:
```powershell
aws configure
```

Enter your credentials when prompted:
1. **AWS Access Key ID**: [Paste your Access Key ID]
2. **AWS Secret Access Key**: [Paste your Secret Access Key]
3. **Default region name**: `us-east-1`
4. **Default output format**: `json`

### Step 3: Verify It Works

```powershell
aws sts get-caller-identity
```

You should see your account info.

### Step 4: Create DynamoDB Table

```powershell
aws dynamodb create-table `
  --table-name WakeSessions `
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=date,AttributeType=S `
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=date,KeyType=RANGE `
  --billing-mode PAY_PER_REQUEST
```

Wait a moment, then verify:
```powershell
aws dynamodb describe-table --table-name WakeSessions
```

## Option 2: Skip AWS CLI (Just Set Environment Variables)

If you don't want to install AWS CLI right now, you can just set environment variables for the backend.

### Step 1: Create Backend Environment File

Create `api/fastapi/.env` file with your credentials:

```
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=WakeSessions
```

**Replace the placeholders with your actual credentials!**

### Step 2: Create DynamoDB Table Manually

1. Go to AWS Console: https://console.aws.amazon.com/dynamodb/
2. Click "Create table"
3. Table name: `WakeSessions`
4. Partition key: `userId` (String)
5. Sort key: `date` (String)
6. Settings: Use default settings
7. Click "Create table"

## Next Steps After Setup

1. **Test Backend**: 
   ```powershell
   cd api/fastapi
   python main.py
   ```

2. **Start Mobile App**:
   ```powershell
   cd mobile
   npm install
   npx expo start
   ```

## Security Reminder

⚠️ **Never commit your `.env` file to Git!** It's already in `.gitignore` but double-check.


