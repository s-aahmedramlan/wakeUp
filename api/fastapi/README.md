# RiseRite FastAPI Backend

REST API for logging wake sessions and retrieving user analytics.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=us-east-1
   export DYNAMODB_TABLE_NAME=WakeSessions
   ```

3. Run the server:
   ```bash
   python main.py
   # Or
   uvicorn main:app --reload
   ```

## API Endpoints

- `POST /session/wake` - Log a wake session
- `GET /user/{user_id}/streak` - Get user's current streak
- `GET /health` - Health check

## Development

For local development without AWS, you can use a local DynamoDB instance or mock the responses.


