# VoxNow - AI-Powered Voicemail Management for Law Firms

VoxNow is an intelligent voicemail transcription and management platform specifically designed for Belgian law firms. It automatically transcribes voicemails, provides AI-powered summaries, and sends automated SMS responses to clients.

## 🎯 Project Overview

VoxNow transforms how law firms handle voicemail messages by:
- **Instant Transcription**: Converting voicemails to text using AI
- **Smart Summaries**: Extracting key information and action items
- **Automated Responses**: Sending personalized SMS replies to clients
- **Analytics Dashboard**: Providing insights on message patterns and urgency
- **Symplicy Integration**: Seamless integration with legal practice management software

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 6.22
- **Icons**: Lucide React
- **Forms**: React Hook Form 7.51

### Backend & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **External Data**: Airtable API integration
- **Email Service**: EmailJS
- **AI Processing**: OpenAI API 5.10

### Analytics & Tracking
- **Facebook Pixel**: Custom tracking implementation
- **Calendly**: Embedded scheduling widget
- **Custom Analytics**: User interaction tracking

### Development Tools
- **TypeScript**: 5.5 for type safety
- **ESLint**: Code linting with React-specific rules
- **PostCSS**: CSS processing with Autoprefixer
- **Deployment**: Netlify (inferred from `_redirects` file)

## 📁 Project Structure

```
voxnow-website/
├── public/                     # Static assets
│   └── _redirects             # Netlify redirect rules
├── src/
│   ├── components/            # React components
│   │   ├── Auth.tsx          # Authentication component
│   │   ├── Dashboard.tsx     # Main dashboard interface
│   │   ├── VoiceRecorder.tsx # Voice recording functionality
│   │   ├── Chatbot.tsx       # Customer support chatbot
│   │   ├── BlogSection.tsx   # Blog content management
│   │   └── ...               # Other UI components
│   ├── utils/
│   │   └── fbPixel.ts        # Facebook Pixel tracking utilities
│   ├── App.tsx               # Main application component
│   ├── firebase.ts           # Firebase configuration
│   └── main.tsx              # Application entry point
├── api/
│   └── huez-data.js          # Secure API endpoint for Airtable data
├── firestore.rules           # Firestore security rules
├── storage.rules             # Firebase Storage security rules
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore, Auth, and Storage enabled
- Airtable account and API key
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voxnow-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Configure Firebase credentials in [`src/firebase.ts`](src/firebase.ts)
   - Set up Airtable API key in [`api/huez-data.js`](api/huez-data.js)
   - Configure OpenAI API key for AI processing

4. **Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
The project uses Firebase for:
- **Authentication**: User login/logout
- **Firestore**: Storing voicemail data and user information
- **Storage**: Audio file storage

Configure your Firebase project credentials in [`src/firebase.ts`](src/firebase.ts).

### Airtable Integration
VoxNow integrates with Airtable to store and retrieve voicemail data. The secure API endpoint is located in [`api/huez-data.js`](api/huez-data.js).

### External Services
- **EmailJS**: For sending email notifications
- **Calendly**: For appointment scheduling
- **Facebook Pixel**: For analytics and conversion tracking

## 📱 Key Features

### 1. Voicemail Processing
- Real-time audio recording and upload
- AI-powered transcription
- Intelligent summarization
- Urgency and sentiment analysis

### 2. Dashboard Analytics
- Message filtering by date, urgency, and content
- Statistical insights on legal domains
- Client interaction tracking
- Export functionality

### 3. Automated Client Communication
- SMS responses based on message content
- Symplicy integration for case management
- Calendly integration for appointment booking

### 4. Multi-language Support
- French-language interface
- Specialized legal terminology handling
- Belgian law firm specific features

## 🔐 Security

- Firebase security rules for data protection
- API authentication tokens
- CORS configuration for secure API access
- Client-side data sanitization

## 📊 Analytics & Tracking

The application includes comprehensive tracking:
- User interaction events
- Conversion tracking
- Performance metrics
- Custom business intelligence

## 🚀 Deployment

The project is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects configured in [`public/_redirects`](public/_redirects)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📄 License

This project is proprietary software developed for VoxNow.

## 📞 Support

For technical support or questions:
- Email: sacha@voxnow.be
- Phone: +32 493 69 08 20
- Address: Chaussée de Saint Amand 20, 7500 Tournai

---

**VoxNow** - Transforming voicemail management for Belgian law firms through AI-powered automation.