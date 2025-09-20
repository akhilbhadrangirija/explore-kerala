# Explore My Kerala - Travel Agency Website

A modern, responsive travel agency website for "Explore My Kerala" built with Next.js 15, featuring a beautiful Kerala-themed design, admin panel, and WhatsApp integration.

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Hero Carousel**: Showcasing beautiful Kerala destinations
- **Package Listings**: Dynamic travel package cards with filtering
- **Detailed Itinerary Pages**: Comprehensive package details with galleries
- **Contact & About Pages**: Professional company information
- **WhatsApp Integration**: Direct booking through WhatsApp

### Admin Panel
- **Secure Login**: Protected admin authentication
- **Package Management**: Full CRUD operations for travel packages
- **Dashboard**: Overview of packages, bookings, and statistics
- **Rich Forms**: Dynamic forms for creating/editing packages
- **Image Management**: Support for package images

### Technical Features
- **Next.js 15**: Latest App Router with React Server Components
- **Firebase Integration**: Ready for Firestore and Storage
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Optimized images and lazy loading
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd explore-my-kerala
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Storage
   - Enable Authentication

2. **Configure Firestore**
   Create the following collections:
   ```javascript
   // packages collection
   {
     id: "package-id",
     title: "Package Title",
     description: "Short description",
     fullDescription: "Detailed description",
     duration: "3 Days / 2 Nights",
     location: "Alleppey, Kerala",
     price: "15999",
     category: "backwaters",
     difficulty: "Easy",
     status: "active",
     highlights: ["Highlight 1", "Highlight 2"],
     itinerary: [
       {
         day: 1,
         title: "Day 1 Title",
         activities: ["Activity 1", "Activity 2"]
       }
     ],
     includes: ["Item 1", "Item 2"],
     excludes: ["Item 1", "Item 2"],
     images: ["image1.jpg", "image2.jpg"],
     createdAt: "2024-01-01T00:00:00Z",
     updatedAt: "2024-01-01T00:00:00Z"
   }
   ```

3. **Set up Storage**
   - Create a storage bucket
   - Set up rules for image uploads
   - Configure CORS for web uploads

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with hero carousel and featured packages
- `/packages` - All travel packages with filtering
- `/packages/[id]` - Detailed package view
- `/about` - About us page
- `/contact` - Contact page with form

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/packages/new` - Create new package
- `/admin/packages/[id]/edit` - Edit package

## 🎨 Customization

### Colors
The website uses a Kerala-inspired green theme:
- Primary: `#10b981` (green-600)
- Secondary: `#059669` (green-700)
- Accent: `#34d399` (green-400)

### Images
Replace placeholder images in `/public/images/` with actual Kerala photos:
- `backwaters.jpg` - Kerala backwaters
- `munnar-tea.jpg` - Munnar tea plantations
- `alleppey-houseboat.jpg` - Houseboat experience
- `kovalam-beach.jpg` - Beach destinations
- `athirappilly-falls.jpg` - Waterfalls

## 🔐 Admin Access

**Demo Credentials:**
- Email: `admin@exploremykerala.com`
- Password: `admin123`

## 📞 WhatsApp Integration

The website includes WhatsApp integration for bookings:
- Contact number: `+91 98765 43210`
- Pre-filled messages for package inquiries
- Direct booking through WhatsApp

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## 📝 Development

### Project Structure
```
app/
├── components/          # Reusable components
├── admin/              # Admin panel pages
├── packages/           # Package pages
├── lib/               # Utilities and Firebase config
├── globals.css        # Global styles
└── layout.js          # Root layout

public/
├── images/            # Static images
└── ...               # Other static assets
```

### Key Technologies
- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Firebase** - Backend services
- **Lucide React** - Icons
- **Next/Image** - Optimized images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Email: info@exploremykerala.com
- WhatsApp: +91 98765 43210

---

**Explore My Kerala** - Discover God's Own Country! 🌴