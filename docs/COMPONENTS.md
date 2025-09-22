# VoxNow Components Documentation

## Overview

This document provides detailed information about the main React components in the VoxNow application, their purposes, props, and interactions.

## Core Application Components

### 1. App.tsx
**Purpose**: Main application component that handles routing and global layout.

**Key Features**:
- React Router setup with all application routes
- Global chatbot integration
- Route-based component rendering

**Routes**:
- `/` - Home page with marketing content
- `/auth` - Authentication page (with demo access)
- `/dashboard` - Main dashboard interface
- `/profile` - User profile management
- `/demo` - Demo dashboard (public access)
- `/messagerie` - Voice message recording
- `/bienvenue` - Welcome form for new users
- `/paiement` - Payment and subscription page
- `/blog` - Blog listing and individual posts

### 2. Dashboard.tsx
**Purpose**: Main dashboard interface for managing voicemail messages and analytics with demo mode support.

**Key Features**:
- Voicemail message listing with pagination
- Advanced filtering (date, urgency, duration, content, legal domain)
- Message status management (read/unread, archived)
- Audio playback functionality
- Data export capabilities (CSV)
- Real-time statistics display
- Demo mode for public access
- Profile button (hidden in demo mode)

**Props**:
- `demoMode?: boolean` - Enables demo mode with sample data

**State Management**:
- `voicemails`: Array of voicemail records from Supabase
- `filteredVoicemails`: Filtered results based on user criteria
- `expandedRows`: Set of expanded message IDs
- `demoUser`: Mock user data for demo mode

**External Integrations**:
- Supabase for voicemail data and authentication
- Audio playback for voicemail files
- Real-time updates via Supabase subscriptions

### 3. Auth.tsx
**Purpose**: User authentication component with login/logout functionality and demo access.

**Key Features**:
- Email/password authentication
- Supabase Auth integration
- Demo access button for public trials
- Password reset functionality
- Automatic redirect after successful login
- Error handling and user feedback

**Authentication Flow**:
1. User enters credentials or clicks demo access
2. Supabase Auth validates credentials
3. Successful login redirects to dashboard
4. Demo access redirects to demo dashboard
5. Failed login shows error message

### 4. Profile.tsx
**Purpose**: User profile management component for editing personal information and changing passwords.

**Key Features**:
- Profile information editing (name, phone)
- Password change functionality
- Email display (read-only)
- Tab-based interface (Profile/Password)
- Form validation and error handling
- Loading states during updates

**Props**:
- None (uses Supabase Auth context)

**State Management**:
- `formData`: Profile information (name, phone)
- `passwordData`: Password change form data
- `activeTab`: Current tab ('profile' | 'password')
- `isUpdating`: Loading state for profile updates
- `isChangingPassword`: Loading state for password changes

**External Integrations**:
- Supabase Auth for password changes
- Supabase database for profile updates
- Real-time state updates

### 5. VoiceRecorder.tsx
**Purpose**: Audio recording component for capturing voicemail messages.

**Key Features**:
- Real-time audio recording using MediaRecorder API
- Audio playback preview
- File upload to Supabase Storage
- Webhook integration for processing
- Recording duration tracking

**Recording Process**:
1. Request microphone permissions
2. Start MediaRecorder with audio stream
3. Capture audio data in chunks
4. Stop recording and create audio blob
5. Upload to Supabase Storage
6. Send webhook for AI processing

### 6. Chatbot.tsx
**Purpose**: Interactive customer support chatbot with AI-powered responses.

**Key Features**:
- Draggable chat interface
- OpenAI integration for intelligent responses
- Predefined quick responses
- Calendly integration for appointment booking
- Conversation history management

**Chat Flow**:
1. User opens chat interface
2. Types message or selects quick response
3. Message sent to OpenAI API
4. AI response displayed in chat
5. Option to book appointment via Calendly

## Form Components

### 7. FreeTrialForm.tsx
**Purpose**: Lead generation form for free trial signups.

**Key Features**:
- Multi-step form with validation
- Legal domain selection
- Contact information collection
- EmailJS integration for notifications
- Facebook Pixel tracking

**Form Fields**:
- Full name and contact information
- Legal practice domain
- Firm size and structure
- Communication preferences

### 8. WelcomeForm.tsx
**Purpose**: Comprehensive onboarding form for new users.

**Key Features**:
- Multi-section form with conditional fields
- Business needs assessment
- Technology preferences
- Referral tracking
- React Hook Form validation

**Form Sections**:
1. Basic information and legal domain
2. Communication patterns and volume
3. Current technology usage
4. Business goals and challenges
5. Referral information

### 9. PaymentPage.tsx
**Purpose**: Subscription and payment management interface.

**Key Features**:
- Pricing plan display
- Subscription management
- Payment processing integration
- Plan comparison features
- Customer support contact

## Content Components

### 10. BlogSection.tsx & BlogList.tsx
**Purpose**: Blog content management and display components.

**Key Features**:
- Blog post listing with pagination
- Category filtering
- SEO-optimized content display
- Social sharing integration
- Related posts suggestions

**Blog Structure**:
- Featured posts on homepage
- Full blog listing page
- Individual blog post pages
- Category-based organization

### 11. Statistics.tsx
**Purpose**: Analytics dashboard component for voicemail insights.

**Key Features**:
- Sentiment analysis visualization
- Urgency level distribution
- Legal domain statistics
- Request category breakdown
- Interactive charts and metrics

**Analytics Metrics**:
- Message volume trends
- Response time analysis
- Client satisfaction scores
- Legal domain distribution
- Urgency pattern analysis

## Specialized Components

### 12. HuezDashboard.tsx
**Purpose**: Specialized dashboard for specific client (Huez law firm).

**Key Features**:
- Custom branding and layout
- Secure API authentication
- Client-specific data filtering
- Tailored analytics display
- Custom export functionality

**Security Features**:
- Bearer token authentication
- Client-specific data isolation
- Secure API endpoints
- Access logging and monitoring

### 13. VoiceMessage.tsx
**Purpose**: Voice message management and playback component.

**Key Features**:
- Audio file upload and management
- Message transcription display
- Playback controls
- Message status updates
- Integration with main dashboard

## Utility Components

### 14. TermsAndConditions.tsx
**Purpose**: Legal terms and conditions display.

**Key Features**:
- Comprehensive legal text
- PDF download functionality
- Acceptance tracking
- GDPR compliance information

### 15. SuccessPage.tsx
**Purpose**: Success confirmation page for completed actions.

**Key Features**:
- Action confirmation display
- Next steps guidance
- Calendly integration for follow-up
- Conversion tracking

## Component Architecture Patterns

### State Management
- **Local State**: React hooks (useState, useEffect) for component-specific state
- **Global State**: Context API for shared application state
- **External State**: Firebase real-time listeners for live data updates

### Data Flow
- **Props Down**: Parent components pass data to children via props
- **Events Up**: Child components communicate with parents via callback functions
- **Side Effects**: useEffect hooks for API calls and external integrations

### Error Handling
- **Try-Catch Blocks**: Async operations wrapped in error handling
- **User Feedback**: Loading states and error messages for user experience
- **Fallback UI**: Graceful degradation when components fail

### Performance Optimization
- **Lazy Loading**: Components loaded on-demand using React.lazy
- **Memoization**: React.memo for preventing unnecessary re-renders
- **Debouncing**: Input debouncing for search and filter operations

## Integration Points

### External Services
- **Supabase**: Authentication, database, and storage
- **OpenAI**: AI-powered chat responses
- **EmailJS**: Email notifications
- **Calendly**: Appointment scheduling
- **Facebook Pixel**: Analytics tracking

### API Communication
- **REST APIs**: Standard HTTP requests for external services
- **Real-time Updates**: Supabase subscriptions for live data
- **Webhook Integration**: Processing pipeline for voicemail analysis
- **Error Handling**: Retry logic and fallback mechanisms

## Testing Considerations

### Component Testing
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing
- **Accessibility Tests**: WCAG compliance verification

### Performance Testing
- **Load Testing**: Component performance under stress
- **Memory Leaks**: Cleanup verification for useEffect hooks
- **Bundle Size**: Component impact on application size
- **Render Performance**: Re-render optimization verification

## Future Enhancements

### Planned Components
- **Mobile Components**: Responsive mobile-first components
- **Advanced Analytics**: Enhanced reporting and visualization
- **Collaboration Tools**: Multi-user interaction components
- **API Management**: Developer tools and API documentation

### Architecture Improvements
- **Component Library**: Reusable design system components
- **State Management**: Redux or Zustand for complex state
- **Testing Framework**: Comprehensive testing infrastructure
- **Documentation**: Interactive component documentation