# GuardianAI - AI-Powered Security Assistant

A comprehensive Next.js application that provides AI-powered security analysis tools to help users detect and analyze online threats.

## 🛡️ Features

- **URL Security Checker** - Analyze URLs for phishing attempts and malicious content
- **Image Scanner** - Scan images for QR codes and potential security threats  
- **Email Scanner** - Detect email spoofing and analyze suspicious messages
- **AI Security Assistant** - Get expert AI-powered security advice via chat
- **Security Auditor** - Comprehensive security analysis and vulnerability assessment
- **User Authentication** - Clerk-powered user accounts and profiles
- **Dark/Light Mode** - Full theme support with system preference detection
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Clerk account (for authentication)
- Google AI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd guardian-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Clerk Configuration (Required for authentication)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

   # Google AI Configuration (Optional - for AI features)
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   # App URL (Optional - defaults to localhost:3000)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Clerk Setup (Required for Authentication)

1. Create a Clerk application at [Clerk Dashboard](https://dashboard.clerk.com)
2. Enable Email/Password and Social providers (Google, GitHub)
3. Copy your Publishable Key to environment variables
4. Configure OAuth apps for social login (optional)

### Google AI Setup (Optional for AI Features)

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your environment variables

**Note**: The application works without the Google AI API key, showing demo responses when the API is not configured.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+) - Full sidebar navigation
- **Tablet** (768px-1023px) - Collapsible sidebar
- **Mobile** (320px-767px) - Sheet-based navigation

## 🏗️ Architecture

### Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for AI integration
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── verify-email/
│   ├── forgot-password/
│   ├── profile/
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Welcome screen
│   ├── url-checker.tsx   # Security tools
│   ├── image-scanner.tsx
│   ├── email-scanner.tsx
│   ├── chatbot.tsx
│   ├── security-auditor.tsx
│   ├── app-sidebar.tsx   # Navigation
│   ├── tool-renderer.tsx # Dynamic tool rendering
│   └── protected.tsx     # Auth wrapper
├── hooks/                # Custom React hooks
│   ├── use-auth.tsx     # Clerk authentication
│   └── use-settings.tsx # User preferences
├── lib/                  # Utilities and configuration
│   ├── clerk.ts         # Clerk setup
│   ├── types.ts         # TypeScript types
│   ├── actions.ts       # Server actions
│   ├── tool-registry.ts # Tool configuration
│   └── utils.ts         # Utilities
└── styles/
    └── globals.css      # Global styles and themes
\`\`\`

## 🔐 Authentication Features

### Supported Methods
- ✅ **Email/Password** - Traditional authentication
- ✅ **Google OAuth** - Social login with Google
- ✅ **GitHub OAuth** - Social login with GitHub
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Email Verification** - Verify user email addresses

### User Management
- ✅ **Profile Updates** - Change name and personal information
- ✅ **Avatar Upload** - Upload and manage profile pictures
- ✅ **Password Changes** - Update passwords securely
- ✅ **Account Deletion** - Delete user accounts

## 🔌 Adding New Security Tools

The application is designed to be easily extensible. Follow these steps to add a new security tool:

### Step 1: Register the Tool

Add your tool to `lib/tool-registry.ts`:

\`\`\`typescript
export const SECURITY_TOOLS: SecurityTool[] = [
  // ... existing tools
  {
    id: "my-new-tool",
    title: "My New Tool",
    description: "Description of what the tool does",
    icon: MyIcon, // Import from lucide-react
    color: "text-orange-500",
    requiresAuth: true, // or false if no auth needed
    component: "my-new-tool", // component file name
  },
]
\`\`\`

### Step 2: Create the Component

Create `components/my-new-tool.tsx`:

\`\`\`typescript
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon as MyIcon } from 'lucide-react'

export function MyNewTool() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MyIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <CardTitle className="text-lg sm:text-xl">My New Tool</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Your tool implementation */}
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\`

### Step 3: Add to Tool Renderer

Update `components/tool-renderer.tsx`:

\`\`\`typescript
import { MyNewTool } from "@/components/my-new-tool"

// Add to the switch statement:
case "my-new-tool":
  return <MyNewTool />
\`\`\`

## 🎨 Theming

The application uses a custom color scheme:
- **Primary**: Deep purple (#9333ea) for key actions and highlights
- **Background**: Light gray (#f8fafc) in light mode, dark gray in dark mode  
- **Accent**: Various colors for different tools and states

Colors are defined in `app/globals.css` using CSS custom properties.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `GOOGLE_AI_API_KEY` (optional)
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Open an issue on GitHub

## 🔄 Updates

The application is designed to be easily maintainable and extensible. The modular architecture allows for:
- Easy addition of new security tools
- Simple API integration updates
- Straightforward UI/UX improvements
- Seamless dependency updates
