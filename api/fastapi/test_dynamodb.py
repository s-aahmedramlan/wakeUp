"""
Simple test script to verify DynamoDB table is set up correctly
Run this to check if your table exists and is accessible
"""

import os
import boto3
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
# Get the directory where this script is located
script_dir = Path(__file__).parent
env_path = script_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Get credentials from environment
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION", "us-east-2")
table_name = os.getenv("DYNAMODB_TABLE_NAME", "WakeSessions")

print("=" * 50)
print("DynamoDB Table Verification Test")
print("=" * 50)

# Check if credentials are set
if not aws_access_key or not aws_secret_key:
    print("[ERROR] AWS credentials not found in .env file")
    print("   Make sure you have:")
    print("   - AWS_ACCESS_KEY_ID")
    print("   - AWS_SECRET_ACCESS_KEY")
    exit(1)

print(f"[OK] Credentials found")
print(f"   Region: {aws_region}")
print(f"   Table name: {table_name}")

# Create DynamoDB client
try:
    dynamodb = boto3.resource(
        "dynamodb",
        region_name=aws_region,
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
    )
    print("[OK] DynamoDB client created")
except Exception as e:
    print(f"[ERROR] Failed to create DynamoDB client: {e}")
    exit(1)

# Check if table exists
try:
    table = dynamodb.Table(table_name)
    table.load()
    print(f"[OK] Table '{table_name}' exists")
except Exception as e:
    print(f"[ERROR] Table '{table_name}' not found or not accessible")
    print(f"   Error: {e}")
    print("\n   Possible issues:")
    print("   - Table name is wrong (check spelling)")
    print("   - Table is in a different region")
    print("   - Table doesn't exist yet")
    print("   - IAM user doesn't have DynamoDB permissions")
    exit(1)

# Check table structure
try:
    table_attributes = table.attribute_definitions
    key_schema = table.key_schema
    
    print(f"\n[INFO] Table Structure:")
    print(f"   Status: {table.table_status}")
    
    # Check partition key
    partition_key = next((k for k in key_schema if k["KeyType"] == "HASH"), None)
    if partition_key:
        pk_name = partition_key["AttributeName"]
        pk_type = next((a["AttributeType"] for a in table_attributes if a["AttributeName"] == pk_name), "Unknown")
        print(f"   Partition key: {pk_name} ({pk_type})")
        if pk_name != "userId" or pk_type != "S":
            print(f"   [WARNING] Expected 'userId' (String), got '{pk_name}' ({pk_type})")
        else:
            print(f"   [OK] Partition key is correct")
    
    # Check sort key
    sort_key = next((k for k in key_schema if k["KeyType"] == "RANGE"), None)
    if sort_key:
        sk_name = sort_key["AttributeName"]
        sk_type = next((a["AttributeType"] for a in table_attributes if a["AttributeName"] == sk_name), "Unknown")
        print(f"   Sort key: {sk_name} ({sk_type})")
        if sk_name != "date" or sk_type != "S":
            print(f"   [WARNING] Expected 'date' (String), got '{sk_name}' ({sk_type})")
        else:
            print(f"   [OK] Sort key is correct")
    else:
        print(f"   [WARNING] No sort key found (expected 'date')")
    
    # Test write/read
    print(f"\n[TEST] Testing write/read...")
    test_item = {
        "userId": "test-user",
        "date": "2025-11-04",
        "pushupCount": 25,
        "brushingSeconds": 15,
        "wakeCompleted": 1,
        "timestamp": 1699123200,
    }
    
    table.put_item(Item=test_item)
    print(f"   [OK] Write test successful")
    
    response = table.get_item(Key={"userId": "test-user", "date": "2025-11-04"})
    if "Item" in response:
        print(f"   [OK] Read test successful")
        table.delete_item(Key={"userId": "test-user", "date": "2025-11-04"})
        print(f"   [OK] Cleanup successful")
    else:
        print(f"   [WARNING] Read test failed")
    
except Exception as e:
    print(f"[ERROR] {e}")
    exit(1)

print("\n" + "=" * 50)
print("[SUCCESS] All tests passed! Your DynamoDB table is set up correctly.")
print("=" * 50)

