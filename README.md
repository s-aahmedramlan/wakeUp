# RiseRite

Make discipline unavoidable. RiseRite enforces healthy morning and productivity habits by verifying real-world actions using on-device computer vision.

## Project Structure

```
riserite/
├── mobile/          # React Native/Expo mobile app
├── api/             # Backend API (FastAPI)
│   └── fastapi/
├── infra/           # AWS infrastructure setup
├── ml/              # ML/CV models and experiments
└── docs/            # Documentation
```

## MVP Features

- **Wake Module**: CV-verified alarm that requires push-ups before silencing
- **Alarm Scheduling**: Set your wake-up time
- **Push-up Detection**: On-device computer vision to count and verify push-ups
- **Motivational Audio**: Audio transitions from alarm to motivational track
- **Session Logging**: Sessions are logged to DynamoDB and local SQLite

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- AWS Account (for backend)
- Expo CLI: `npm install -g expo-cli`

### Mobile App Setup

1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Expo:
   ```bash
   npm start
   ```

4. Build development client (required for native modules):
   ```bash
   npx expo prebuild
   npx expo run:android  # or run:ios
   ```

### Backend Setup

1. Configure AWS credentials (see `infra/aws-setup.md`)

2. Create DynamoDB table:
   ```bash
   aws dynamodb create-table \
     --table-name WakeSessions \
     --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=date,AttributeType=S \
     --key-schema AttributeName=userId,KeyType=HASH AttributeName=date,KeyType=RANGE \
     --billing-mode PAY_PER_REQUEST
   ```

3. Navigate to API directory:
   ```bash
   cd api/fastapi
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   export AWS_REGION=us-east-1
   ```

6. Run server:
   ```bash
   python main.py
   ```

## Development

- Run linting: `npm run lint`
- Format code: `npm run format`

## Architecture

- **Mobile**: Expo with React Native, TypeScript, Zustand for state
- **CV**: TensorFlow Lite (via react-native-vision-camera frame processors)
- **Backend**: FastAPI with AWS DynamoDB
- **Storage**: Local SQLite + DynamoDB sync

## Next Steps (Phase 2+)

- Brushing verification
- Move module (workouts)
- Focus module (deep work tracking)
- Web dashboard
- Advanced analytics

## License

MIT
