# LearnLocal

A modern learning app built with Expo that integrates with FastAPI and a local GPT-OSS model for AI-powered education.

## Features

- **Interactive Learning Modules**: Structured courses with progress tracking
- **AI Chat Assistant**: Local GPT-OSS model integration for personalized learning support  
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Offline Support**: Continue learning even when disconnected
- **Modern UI**: Clean, intuitive interface optimized for mobile and web

## Architecture

- **Frontend**: React Native with Expo Router
- **Backend**: FastAPI (expected at localhost:8000)
- **AI Model**: Local GPT-OSS integration
- **Navigation**: Tab-based layout with Stack navigation

## Required Backend API Endpoints

Your FastAPI server should implement these endpoints:

### Chat Endpoint
```python
POST /api/chat
{
  "message": "string",
  "model": "gpt-oss"
}
```

### Learning Modules
```python
GET /api/modules
```

### Health Check
```python
GET /api/health
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start your FastAPI server** on localhost:8000 with GPT-OSS model loaded

3. **Run the Expo app**:
   ```bash
   npm run dev
   ```

4. The app will automatically try to connect to your FastAPI server

## Configuration

- Update the API base URL in `services/api.ts` if your server runs on a different port
- Modify chat and learning module interfaces as needed for your specific GPT-OSS implementation

## Development Notes

- The app includes fallback responses when the API server is not available
- Connection status is displayed in the Settings tab
- All API calls include proper error handling and user feedback

Ready to enhance with your specific learning content and GPT-OSS model capabilities!