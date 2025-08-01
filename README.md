Feature Voting App
A lean and clean React Native application for feature voting with Node.js backend and SQLite database. Users can create feature requests and vote on features created by others.

📱 Features
Core Functionality
Multi-user Support: Email-based user identification (no passwords required)
Feature Creation: Users can create feature requests
Voting System: Vote/unvote on features (one vote per user per feature)
Feature Management: View, create, and delete your own features
Real-time Updates: Pull-to-refresh functionality
Responsive UI: Optimized for mobile devices
User Experience
Simple Login: Enter email to login or create account automatically
Three Main Screens:
All Features: View and vote on all features
My Features: Manage your own feature requests
Create Feature: Add new feature requests
🛠 Technology Stack
Backend
Node.js with Express.js
SQLite3 database
RESTful API architecture
CORS enabled for cross-origin requests
Frontend
React Native (0.72.6)
React Navigation for tab and stack navigation
AsyncStorage for local data persistence
Native mobile UI components
📁 Project Structure
feature-voting-app/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js              # Express server setup
│   ├── database.js            # SQLite database configuration
│   ├── features.db            # SQLite database file (auto-created)
│   └── routes/
│       ├── users.js           # User management endpoints
│       ├── features.js        # Feature CRUD endpoints
│       └── votes.js           # Voting system endpoints
└── frontend/
    ├── package.json
    ├── App.js                 # Main app component
    ├── app.json              # React Native app configuration
    ├── babel.config.js       # Babel configuration
    ├── metro.config.js       # Metro bundler configuration
    └── src/
        ├── components/
        │   ├── LoginScreen.js    # Email login/registration
        │   ├── FeatureList.js    # All features display
        │   ├── MyFeatures.js     # User's features management
        │   └── CreateFeature.js  # Feature creation form
        ├── services/
        │   └── api.js            # API service layer
        └── utils/
            └── storage.js        # AsyncStorage utilities
🚀 Quick Start
Prerequisites
Node.js (v16 or higher)
npm or yarn
React Native development environment
Android Studio (for Android development)
Xcode (for iOS development, macOS only)
Backend Setup
Clone/Create the project directory:
bash
mkdir feature-voting-app
cd feature-voting-app
mkdir backend
cd backend
Install dependencies:
bash
npm init -y
npm install express sqlite3 cors body-parser
npm install --save-dev nodemon
Create the backend files (copy from the provided code)
Start the backend server:
bash
npm run dev
Server runs on http://localhost:3000
Frontend Setup
Create React Native app:
bash
cd ..
npx react-native init FeatureVotingApp
cd FeatureVotingApp
Install additional dependencies:
bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens react-native-gesture-handler
For iOS (if developing on macOS):
bash
cd ios && pod install && cd ..
Copy all frontend files from the provided code
Update API URL in src/services/api.js:
Android emulator: http://10.0.2.2:3000/api
iOS simulator: http://localhost:3000/api
Physical device: http://YOUR_IP_ADDRESS:3000/api
Run the app:
bash
# For Android
npx react-native run-android

# For iOS (macOS only)
npx react-native run-ios
🗄 Database Schema
Users Table
sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
Features Table
sql
CREATE TABLE features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
Votes Table
sql
CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feature_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, feature_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (feature_id) REFERENCES features (id)
);
🔌 API Endpoints
User Management
POST /api/users/login - Login or create user
GET /api/users/:id - Get user by ID
Feature Management
GET /api/features - Get all features with vote counts
GET /api/features/user/:userId - Get user's features
POST /api/features - Create new feature
DELETE /api/features/:id - Delete feature (owner only)
Voting System
POST /api/votes/toggle - Toggle vote for feature
GET /api/votes/user/:userId - Get user's votes
Example API Usage
Login/Register User:

javascript
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com"
}
Create Feature:

javascript
POST /api/features
Content-Type: application/json

{
  "name": "Dark mode support",
  "user_id": 1
}
Toggle Vote:

javascript
POST /api/votes/toggle
Content-Type: application/json

{
  "user_id": 1,
  "feature_id": 1
}
📱 App Screens
1. Login Screen
Email input field
Automatic user creation if email doesn't exist
Email validation
Clean, minimal design
2. All Features Tab
List of all features sorted by vote count
Vote/unvote functionality
Shows creator email and vote count
Pull-to-refresh capability
Visual indication for user's own features
3. My Features Tab
User's created features only
Delete functionality with confirmation
Shows creation date and vote count
Empty state message
4. Create Feature Tab
Feature name input (200 character limit)
Character counter
Form validation
Success feedback
🔧 Configuration
Backend Configuration
Port: Default 3000 (configurable via PORT environment variable)
Database: SQLite file created automatically at backend/features.db
CORS: Enabled for all origins (modify in production)
Frontend Configuration
API Base URL: Configure in src/services/api.js
App Name: Modify in app.json
Navigation: Tab-based navigation with stack navigation for login
🚨 Troubleshooting
Common Issues
1. Cannot connect to backend from Android emulator:

Use http://10.0.2.2:3000/api instead of localhost
Ensure backend server is running
Check firewall settings
2. Metro bundler issues:

Clear cache: npx react-native start --reset-cache
Clean build: cd android && ./gradlew clean && cd ..
3. Database connection errors:

Ensure SQLite3 is properly installed
Check file permissions in backend directory
4. Navigation issues:

Ensure all navigation dependencies are installed
For iOS, run pod install in ios directory
Physical Device Testing
Find your computer's IP address:
bash
# Windows
ipconfig

# macOS/Linux
ifconfig
Update API base URL with your IP:
javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
Ensure backend accepts connections from your IP
📄 License
This project is provided as-is for educational and development purposes.

🤝 Contributing
This is a lean, educational project. Feel free to fork and modify according to your needs.

📞 Support
For issues or questions:

Check the troubleshooting section above
Verify all dependencies are correctly installed
Ensure backend and frontend configurations match
Check console logs for detailed error messages
Happy coding! 🚀