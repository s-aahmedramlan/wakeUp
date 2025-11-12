# How to Verify Your DynamoDB Table is Set Up Correctly

## Method 1: Check in AWS Console (Easiest)

1. **Go to DynamoDB Console**: https://console.aws.amazon.com/dynamodb/

2. **Check the table exists**:
   - You should see a table named `WakeSessions` in the list
   - Status should be **"Active"** (green)

3. **Check the table structure**:
   - Click on the table name `WakeSessions`
   - Go to the **"Overview"** tab
   - Look for **"Partition key"**: Should show `userId` (String)
   - Look for **"Sort key"**: Should show `date` (String)

4. **Verify it's in the right region**:
   - Check the top-right corner of the console
   - Should match your backend region (usually `us-east-1`)

## Method 2: Test with Backend (Best Verification)

Run this test to verify everything works:

1. Make sure your `.env` file has credentials
2. Install dependencies: `pip install -r requirements.txt`
3. Run the test script (see below)

## What Should Be Correct:

✅ **Table name**: `WakeSessions` (exact spelling, case-sensitive)
✅ **Partition key**: `userId` (type: String)
✅ **Sort key**: `date` (type: String)
✅ **Status**: Active
✅ **Region**: Matches your backend region (check in `.env` file)

## Common Mistakes:

❌ Wrong table name (typo like `WakeSession` without 's')
❌ Missing sort key `date`
❌ Wrong key types (must be String, not Number)
❌ Table in wrong region
❌ Table still "Creating" (wait for "Active")


