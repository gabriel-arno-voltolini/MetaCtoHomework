# 📱 Feature Voting App

A lean React Native app (Android) where users can submit and vote on feature ideas. Built as part of an AI-powered coding challenge.

## ✨ Features
- Email-only login (auto-creates account)
- Create, view, and delete feature requests
- Upvote/unvote features (one vote per user)
- Separate views for all features and your own
- Pull-to-refresh support

## 🛠 Tech Stack
**Frontend**: React Native (Expo), AsyncStorage, React Navigation  
**Backend**: Node.js (Express), SQLite  
**Architecture**: REST API with local SQLite DB

## 📁 Project Structure
- `frontend/`: React Native app
- `backend/`: Express server with SQLite DB
- `prompts.txt`: Full AI prompt audit log used during development

## 🚀 Getting Started
```bash
# Backend
cd backend
npm install
npm run dev  # Runs at http://localhost:3000

# Frontend
cd frontend
npm install
expo start  # Scan QR to run on Android device