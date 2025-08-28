# Modern Government Portal - Next.js Application

A comprehensive, modern government portal built with Next.js 13, featuring an admin dashboard, citizen services, and multilingual support.

## 🚀 Features

### Public Portal
- **Homepage** with hero section, featured news, and upcoming events
- **News Management** with detailed articles and categories
- **Events Calendar** with event details and registration
- **Museums Directory** showcasing local cultural institutions
- **Municipality Pages** for different city departments
- **Citizen Services** portal for government services
- **Contact Forms** with validation and submission handling
- **Multilingual Support** (English/Greek) with context-based translation

### Admin Dashboard
- **Content Management** for news, events, museums, and municipality pages
- **Category Management** with hierarchical organization
- **User Management** and role-based access control
- **Appearance Settings** with theme customization
- **Content Filters** and search functionality
- **Dashboard Statistics** and analytics
- **Rich Text Editor** for content creation

### Technical Features
- **Next.js 13** with App Router and Server Components
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** with custom design system
- **Shadcn UI** components for consistent UI/UX
- **Firebase Integration** for backend services
- **Responsive Design** with mobile-first approach
- **Performance Optimized** with lazy loading and code splitting
- **SEO Optimized** with meta tags and structured data

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: Zustand, React Context
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nextjs-modern-app.git
   cd nextjs-modern-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files

## 📁 Project Structure

```
├── app/                    # Next.js 13 App Router
│   ├── (public)/          # Public routes
│   ├── admin/             # Admin dashboard routes
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── ui/                # Base UI components
│   └── layout/            # Layout components
├── lib/                    # Utility functions and configurations
├── hooks/                  # Custom React hooks
├── context/                # React context providers
├── government/             # Government-specific logic
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🌐 Multilingual Support

The application supports multiple languages through a context-based translation system:

- **English** (default)
- **Greek** (Ελληνικά)

Translation files are located in the `lib/translate.js` file and can be easily extended for additional languages.

## 🎨 Customization

### Theme Configuration
- Modify `tailwind.config.ts` for design system changes
- Update `components.json` for Shadcn UI component customization
- Customize colors, fonts, and spacing in the design system

### Content Management
- Add new content types in the admin dashboard
- Create custom page templates
- Extend the category system for better organization

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:
- Responsive navigation with mobile menu
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
- Optimized images and media

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **AWS Amplify**: Use the Next.js build specification
- **Docker**: Build and deploy using containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` folder
- Review the component examples in the `components/` directory

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the utility-first CSS framework
- Shadcn UI for the beautiful component library
- Firebase for backend services

---

Built with ❤️ using Next.js and modern web technologies.
