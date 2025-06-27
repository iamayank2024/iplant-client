# 🌱 iPlant - Environmental Social Media Platform

A beautiful, modern social media platform for environmental enthusiasts to share their planting journey and track community impact.

## 🚀 Features

### Core Features Implemented:

1. **🔐 Authentication Pages**

   - Beautiful login/signup pages with floating labels
   - Form validation using React Hook Form
   - Nature-themed hero images
   - Mock authentication flow

2. **📱 Home Feed**

   - Responsive masonry grid layout
   - Infinite scroll with React Query
   - Post cards with like, save, and share functionality
   - Animated interactions using Framer Motion

3. **🪴 Add New Post Modal**

   - Drag & drop image upload with react-dropzone
   - Geolocation support using browser API
   - Plant type selection
   - Beautiful modal design

4. **🗺️ Community Map**

   - Interactive map using Google Maps
   - Custom markers showing user avatars
   - Filter by plant type and time period
   - Community impact statistics

5. **👤 User Profile**

   - Editable bio and profile image
   - User statistics (plants, likes, saved)
   - Achievement badges
   - Toggle between user posts and saved posts

6. **🏆 Leaderboard**
   - Global rankings with animations
   - Time period filtering
   - CO₂ impact calculations
   - Beautiful rank indicators

### 🎨 Design Features:

- **Nature-inspired color palette** (greens, neutrals, white)
- **Dark mode support** with seamless toggle
- **Mobile-first responsive design**
- **Smooth animations** using Framer Motion
- **Beautiful UI components** with Tailwind CSS
- **Custom design system** from Design.json

## 🛠️ Tech Stack

- **React** (TypeScript)
- **Redux Toolkit** for state management
- **React Query** for server state
- **React Router** for navigation
- **React Hook Form** for forms
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Google Maps** with @react-google-maps/api
- **Lucide React** for icons
- **Vite** for build tooling

## 📦 Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up Google Maps API:

   - Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
   - Create a `.env` file in the root directory
   - Add your API key: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`

4. Start the development server:
   ```bash
   yarn dev
   ```

## 🚀 Usage

1. **Start by creating an account** on the signup page
2. **Browse the feed** to see what others are planting
3. **Share your plant** using the "Plant" button in the navbar
4. **Explore the map** to see global planting activity
5. **Check the leaderboard** to see top contributors
6. **Customize your profile** with a bio and track your impact

## 📱 Features in Detail

### Authentication Flow

- Email/password validation
- Mock authentication (stores user in Redux)
- Protected routes for authenticated users

### Post Management

- Create posts with images and captions
- Like and save posts
- Share posts (Web Share API or clipboard)
- Infinite scroll pagination

### Community Features

- Interactive map with plant locations
- Global leaderboard with rankings
- Community impact statistics
- Achievement badges system

### User Experience

- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback
- Responsive design for all screen sizes

## 🎯 Future Enhancements

- Backend API integration
- Real user authentication
- Image upload to cloud storage
- Social features (comments, follows)
- Push notifications
- PWA support
- More detailed analytics

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

---

Made with �� for our planet 🌍
