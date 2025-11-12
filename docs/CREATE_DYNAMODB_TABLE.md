# Create DynamoDB Table - Step by Step (No Mistakes!)

## Method: AWS Console (Recommended - Visual & Safe)

### Step 1: Go to DynamoDB Console
1. Go to: https://console.aws.amazon.com/dynamodb/
2. Make sure you're in the right region (top right corner - should be `us-east-1` or your region)

### Step 2: Create Table
1. Click the big orange **"Create table"** button

### Step 3: Fill in Table Details

**Table name:**
- Type exactly: `WakeSessions`
- (Case-sensitive! Must match exactly)

**Partition key (primary key):**
- Attribute name: `userId`
- Type: **String**

**Sort key (optional):**
- Click "Add sort key" checkbox
- Attribute name: `date`
- Type: **String**

### Step 4: Table Settings
- **Table class**: Standard (default)
- **Use default settings**: ✅ **Leave this checked** (easier!)
- Or if you want to customize:
  - **Read/Write capacity settings**: Select "On-demand" (pay per request)

### Step 5: Create
1. Scroll down
2. Click **"Create table"** button (orange)
3. Wait for "Table ready" status (takes ~30 seconds)

### Step 6: Verify
- You should see your table `WakeSessions` in the list
- Status should be "Active"
- Partition key: `userId` (String)
- Sort key: `date` (String)

## That's it! ✅

Your table is ready. The backend will automatically use it.

## Why This Method is Better:
✅ **Visual** - You see exactly what you're creating
✅ **No typos** - GUI prevents syntax errors
✅ **Forgiving** - Easy to correct mistakes
✅ **Clear feedback** - Shows errors immediately
✅ **No CLI needed** - Works right away

## Common Mistakes to Avoid:
❌ Wrong table name (must be `WakeSessions` exactly)
❌ Wrong key types (both must be String)
❌ Wrong region (should match your backend region)
❌ Forgetting to add sort key `date`

## Next Steps:
1. ✅ Table created
2. Create `api/fastapi/.env` file with your credentials
3. Test backend: `cd api/fastapi && python main.py`


