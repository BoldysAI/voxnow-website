# VoxNow - AI-Powered Voicemail Management for Law Firms

VoxNow is an intelligent voicemail transcription and management platform specifically designed for Belgian law firms. It automatically transcribes voicemails, provides AI-powered summaries, and offers comprehensive analytics for legal practice management.

## 🎯 Project Overview

VoxNow transforms how law firms handle voicemail messages by:
- **Instant Transcription**: Converting voicemails to text using AI
- **Smart Summaries**: Extracting key information and action items
- **AI Analysis**: Sentiment, urgency, legal domain, and case stage analysis
- **Analytics Dashboard**: Providing insights on message patterns and legal domains
- **Demo Mode**: Public demonstration with sample data
- **Profile Management**: User account and settings management

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 6.22
- **Icons**: Lucide React
- **Forms**: React Hook Form 7.51

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI Processing**: Supabase Edge Functions + OpenAI API
- **Email Service**: EmailJS
- **Real-time**: Supabase Realtime subscriptions

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
│   │   ├── Auth.tsx          # Authentication component (with demo access)
│   │   ├── Dashboard.tsx     # Main dashboard interface (with demo mode)
│   │   ├── Profile.tsx       # User profile management
│   │   ├── VoiceRecorder.tsx # Voice recording functionality
│   │   ├── Chatbot.tsx       # Customer support chatbot
│   │   ├── BlogSection.tsx   # Blog content management
│   │   └── ...               # Other UI components
│   ├── hooks/
│   │   └── useSupabase.ts    # Supabase integration hooks
│   ├── utils/
│   │   └── fbPixel.ts        # Facebook Pixel tracking utilities
│   ├── App.tsx               # Main application component
│   ├── supabase.ts           # Supabase client configuration
│   └── main.tsx              # Application entry point
├── supabase/
│   └── functions/            # Supabase Edge Functions
│       ├── analyze-voicemail/
│       ├── chat-completion/
│       └── analyze-voicemail-webhook/
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── COMPONENTS.md         # Component documentation
│   └── DATABASE_SCHEMA.md    # Database schema
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase project with PostgreSQL, Auth, and Storage enabled
- OpenAI API key
- EmailJS account (for email notifications)

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
   - Set up Supabase environment variables:
     ```bash
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Configure Supabase Edge Functions secrets:
     ```bash
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     OPENAI_API_KEY=your_openai_api_key
     ```

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

### Supabase Setup
The project uses Supabase for:
- **Authentication**: User login/logout with Row Level Security
- **Database**: PostgreSQL for storing voicemail data and user information
- **Storage**: Audio file storage and retrieval
- **Edge Functions**: AI processing and analysis

Configure your Supabase project credentials in environment variables.

### Supabase Edge Functions
Deploy the Edge Functions for AI processing:
```bash
supabase functions deploy analyze-voicemail
supabase functions deploy chat-completion
supabase functions deploy analyze-voicemail-webhook
```

### External Services
- **EmailJS**: For sending email notifications
- **Calendly**: For appointment scheduling
- **Facebook Pixel**: For analytics and conversion tracking

## 📱 Key Features

### 1. Voicemail Processing
- Real-time audio recording and upload
- AI-powered transcription using OpenAI
- Intelligent summarization and analysis
- Multi-category analysis: sentiment, urgency, legal domain, case stage

### 2. Dashboard Analytics
- Message filtering by date, urgency, content, and legal domain
- Statistical insights on legal domains and case stages
- Real-time data updates with Supabase
- Export functionality (CSV)
- Demo mode for public demonstration

### 3. User Management
- Secure authentication with Supabase Auth
- User profile management (name, phone, password)
- Row Level Security for data protection
- Demo user access for public trials

### 4. AI-Powered Analysis
- Sentiment analysis (Positive, Negative, Neutral)
- Urgency assessment (Urgent, Moderate, Not Urgent)
- Legal domain classification
- Case stage identification
- Request category analysis

### 5. Multi-language Support
- French-language interface
- Specialized legal terminology handling
- Belgian law firm specific features

## 🔐 Security

- Supabase Row Level Security (RLS) for data protection
- JWT tokens for API authentication
- CORS configuration for secure API access
- Client-side data sanitization
- Environment variable protection for sensitive data

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