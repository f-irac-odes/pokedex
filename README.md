# Memedex - Media Trading Platform

**Memedex** is a modern social media platform that allows users to upload, share, and trade media content (images and videos) using a credit-based system. The platform supports both authenticated users and guest browsing, making it accessible to everyone while providing monetization features for content creators.

## 🚀 Features

### 🎯 Core Features
- **Guest Access**: Browse the marketplace and content without registration
- **User Authentication**: Secure login/logout system with session management
- **Media Trading**: Buy and sell images/videos using platform credits
- **Credit System**: Virtual currency for transactions within the platform
- **Media Upload**: Upload images and videos with optional pricing
- **Real-time Updates**: Live feed updates using Server-Sent Events
- **Responsive Design**: Mobile-first approach with beautiful UI

### 📊 Trading Features
- **Marketplace**: Browse all media available for trading
- **Price Setting**: Creators can set prices for their content
- **Free Content**: Offer content for free to build audience
- **Purchase System**: Secure credit-based purchasing
- **Download Tracking**: Monitor content downloads and engagement
- **Creator Earnings**: Track total earnings and completed trades

### 🎨 Content Features
- **Image Upload**: Support for high-quality images
- **Video Upload**: Share videos with the community
- **Content Management**: Edit and manage your uploaded content
- **Engagement**: Like, comment, and share content
- **Views & Downloads**: Track content performance
- **Media Filtering**: Filter by content type (all, images, videos)

### 👥 Social Features
- **User Profiles**: Complete user profiles with stats
- **Following System**: Follow/unfollow other users
- **Real-time Feed**: Live updates from followed users
- **User Verification**: Verified account badges
- **Community Interaction**: Comments and engagement

## 🛠️ Tech Stack

### Frontend
- **Svelte 5**: Modern reactive framework
- **TypeScript**: Type-safe development
- **SvelteKit**: Full-stack framework
- **Vite**: Fast build tool and dev server

### Backend
- **SvelteKit API Routes**: Server-side API endpoints
- **TypeScript**: Full type safety
- **Mock Database**: In-memory data storage (ready for real DB integration)

### Real-time Features
- **Server-Sent Events (SSE)**: Live updates without WebSockets
- **Event Broadcasting**: Real-time notifications and updates

### State Management
- **Svelte Stores**: Reactive state management
- **HTTP-only Cookies**: Secure session management

## 📁 Project Structure

```
src/
├── lib/
│   ├── database.ts          # Mock database and data models
│   ├── stores.ts            # Svelte stores and API functions
│   └── index.ts             # Library exports
├── routes/
│   ├── +layout.svelte       # Main app layout with navigation
│   ├── +page.svelte         # Landing page
│   ├── feed/                # User feed (authenticated/guest)
│   ├── marketplace/         # Media trading marketplace
│   ├── login/               # User authentication
│   ├── profile/             # User profiles
│   ├── register/            # User registration
│   └── api/                 # API endpoints
│       ├── auth/            # Authentication APIs
│       ├── posts/           # Posts CRUD operations
│       ├── users/           # User management APIs
│       ├── trading/         # Media trading APIs
│       ├── upload/          # Media upload APIs
│       ├── media/           # Media serving APIs
│       └── realtime/        # Real-time events API
├── app.html                 # HTML template
└── app.d.ts                 # TypeScript declarations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memedex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 💳 How It Works

### Guest Mode
1. **Browse Freely**: Access the marketplace and feed without signing up
2. **View Content**: See all available media and user profiles
3. **Limited Actions**: Can't purchase or upload without authentication

### User Registration
1. **Create Account**: Sign up with email and password
2. **Get Starting Credits**: New users receive welcome credits
3. **Complete Profile**: Add bio, avatar, and social links

### Media Trading
1. **Upload Content**: Share images/videos with descriptions
2. **Set Pricing**: Choose between free or paid content
3. **Earn Credits**: Receive payments when others purchase your content
4. **Purchase Media**: Buy content using your credit balance

### Credit System
- **Starting Balance**: New users get 1000 credits
- **Earning**: Receive credits when others purchase your content
- **Spending**: Use credits to buy media from other creators
- **Tracking**: View total earnings and completed trades

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `DELETE /api/auth/login` - User logout
- `GET /api/auth/current` - Get current user info

### Posts & Media
- `GET /api/posts` - Fetch posts (with pagination)
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get specific post
- `PATCH /api/posts/[id]` - Update post (likes, etc.)
- `POST /api/upload` - Upload media content

### Trading
- `GET /api/trading` - Get media for trade
- `POST /api/trading` - Purchase media
- `GET /api/media/download/[postId]` - Download media

### Users
- `GET /api/users` - Get users (with filtering)
- `POST /api/users` - User actions (follow, etc.)

### Real-time
- `GET /api/realtime` - Server-Sent Events for live updates

## 🎨 Design System

### Colors
- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple gradient)
- **Success**: `#28a745` (Green)
- **Danger**: `#dc3545` (Red)
- **Neutral**: `#f5f5f5` (Light gray)

### Typography
- **Headings**: 700 weight, gradient text effects
- **Body**: 400-600 weight, high contrast
- **Captions**: Smaller, muted text

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, ghost)
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with user state awareness

## 🗄️ Data Models

### User Model
```typescript
interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    avatar: string;
    coverImage: string;
    followers: number;
    following: number;
    posts: number;
    credits: number;
    totalEarnings: number;
    tradesCompleted: number;
    joinedDate: string;
    website?: string;
    location?: string;
    isVerified: boolean;
}
```

### Post Model
```typescript
interface Post {
    id: string;
    userId: string;
    user: User;
    content: string;
    image?: string;
    video?: string;
    mediaType: 'none' | 'image' | 'video';
    price?: number;
    isForTrade: boolean;
    timestamp: string;
    likes: number;
    comments: number;
    views?: number;
    downloads?: number;
    isLiked: boolean;
}
```

## 🔒 Security Features

- **HTTP-only Cookies**: Secure session storage
- **Password Validation**: Basic input validation
- **Session Management**: Proper login/logout handling
- **CORS Configuration**: Cross-origin resource sharing
- **Input Sanitization**: Basic XSS protection

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Enhanced layout for tablets
- **Desktop**: Full-featured desktop experience
- **Adaptive Navigation**: Smart navigation based on screen size

## 🔄 Real-time Features

- **Live Feed Updates**: New posts appear instantly
- **Connection Status**: Visual connection indicator
- **Event Broadcasting**: System-wide notifications
- **Auto-reconnection**: Automatic reconnection on connection loss

## 🎯 Future Enhancements

### Planned Features
- **File Upload**: Direct file uploads instead of URLs
- **Payment Integration**: Real payment processing (Stripe, PayPal)
- **Database Migration**: PostgreSQL or MongoDB integration
- **Image Processing**: Thumbnails, optimization, compression
- **Advanced Search**: Filter by price, type, creator, etc.
- **Content Moderation**: Automated content review system
- **Mobile App**: React Native or Flutter mobile application

### Technical Improvements
- **Caching**: Redis integration for performance
- **CDN**: Content delivery network for media files
- **WebSockets**: For more real-time features
- **Authentication**: OAuth integration (Google, GitHub, etc.)
- **Analytics**: User behavior and platform analytics
- **Testing**: Comprehensive test suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Svelte Team**: For the amazing Svelte framework
- **SvelteKit**: For the full-stack capabilities
- **Unsplash**: For beautiful placeholder images
- **Sample Videos**: For video content samples

## 📞 Support

For support, email support@memedex.com or join our community Discord.

---

**Memedex** - Where creativity meets commerce. 🎨💰