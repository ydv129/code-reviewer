# 🔐 GuardianAI - AI-Powered Cybersecurity Web Assistant

![GuardianAI Logo](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=GuardianAI+-+Cybersecurity+Assistant)

## 🌟 Overview

GuardianAI is a comprehensive, AI-powered cybersecurity web assistant designed for modern web users who prioritize security and privacy. Built with Next.js 15, TypeScript, and powered by advanced AI models, it provides enterprise-grade security tools accessible to everyone.

### ✨ Key Features

- 🤖 **AI-Powered Assistant** - Gemini-powered chatbot with natural language processing
- 🔊 **Voice Synthesis** - Text-to-speech capabilities with customizable voices
- 🛠️ **12+ Security Tools** - Comprehensive cybersecurity toolkit
- 🎨 **Modern UI/UX** - Responsive design with dark/light mode support
- 🔒 **Privacy-First** - Local processing, no data collection
- ⚡ **Real-Time Analysis** - Live security monitoring and alerts
- 🎯 **Auto-Discovery** - Automatic tool integration system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/guardian-ai.git
   cd guardian-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your API keys to `.env.local`:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
guardian-ai/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── chat/                 # AI chat endpoint
│   ├── chat/                     # AI chat interface
│   ├── settings/                 # Settings page
│   ├── tools/                    # Security tools
│   │   ├── password-generator/   # Password generation tool
│   │   ├── password-strength/    # Password analysis tool
│   │   └── [other-tools]/        # Additional security tools
│   ├── about/                    # About page
│   ├── features/                 # Features overview
│   ├── developers/               # Developer contact
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard (home page)
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── app-sidebar.tsx           # Navigation sidebar
│   ├── settings-provider.tsx     # Settings context
│   └── theme-provider.tsx        # Theme management
├── lib/                          # Utility functions
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── README.md                     # This documentation
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.mjs               # Next.js configuration
\`\`\`

## 🛠️ Security Tools

### 🔐 Authentication & Passwords
- **Password Generator** - Cryptographically secure password generation
- **Password Strength Analyzer** - Entropy-based strength analysis with crack time estimation

### 🕵️ Privacy & Breach Protection
- **Breach Checker** - Email breach database lookup (HaveIBeenPwned integration)
- **Privacy Audit** - Browser fingerprinting and privacy assessment
- **Email Mask Generator** - Create disposable email addresses

### 🌐 Network Security
- **Network Scanner** - Port scanning and vulnerability detection
- **DNS Leak Test** - VPN/proxy effectiveness verification

### 📱 Mobile & System
- **App Tracker** - Android APK permission analysis
- **System Monitor** - Real-time resource monitoring

### 🔧 Development Tools
- **JSON Beautifier** - Format and validate JSON data
- **QR Code Scanner** - QR code content analysis
- **Fake Data Generator** - Test data generation

## 🤖 AI Assistant Features

### Natural Language Processing
- **Intent Recognition** - Automatically understands security queries
- **Tool Selection** - Chooses appropriate tools based on context
- **Multi-step Workflows** - Handles complex security analysis tasks

### Voice Capabilities
- **Text-to-Speech** - Configurable voice synthesis
- **Voice Settings** - Male/female voice options with speed control
- **Auto-speak** - Automatic response narration

### Tool Integration
- **Real-time Execution** - Tools run automatically based on conversation
- **Result Interpretation** - AI explains tool outputs in plain language
- **Contextual Recommendations** - Personalized security advice

## ⚙️ Settings & Configuration

### API Configuration
- **OpenAI Integration** - Configure API keys for enhanced AI capabilities
- **Local Storage** - Secure local storage of preferences
- **Privacy Protection** - API keys never leave your device

### Voice & Speech
- **Voice Enable/Disable** - Toggle text-to-speech functionality
- **Gender Selection** - Choose between male and female voices
- **Speed Control** - Adjust speech rate (0.5x to 2x)
- **Auto-speak** - Automatically narrate AI responses

### Appearance
- **Theme Selection** - Light, dark, or system theme
- **Responsive Design** - Optimized for all screen sizes
- **Accessibility** - WCAG compliant interface

### Text Enhancement
- **Advanced Processing** - Enhanced text analysis and formatting
- **Syntax Highlighting** - Code and log formatting
- **Smart Summarization** - Automatic content summarization

## 🔧 Development

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: AI SDK, OpenAI GPT-4, Gemini integration
- **State Management**: React Context, Local Storage
- **Voice**: Web Speech API, Speech Synthesis

### Key Dependencies
\`\`\`json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "ai": "^3.0.0",
  "@ai-sdk/openai": "^0.0.0",
  "lucide-react": "^0.400.0"
}
\`\`\`

### Environment Variables
\`\`\`env
# Required for AI chat functionality
OPENAI_API_KEY=your_openai_api_key_here

# Optional - for enhanced features
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BREACH_API=https://api.xposedornot.com/v1/check-email
\`\`\`

### Development Commands
\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test
\`\`\`

## 🔒 Security & Privacy

### Data Protection
- **Local Processing** - Most analysis happens in your browser
- **No Data Collection** - We don't store or transmit personal data
- **Secure Storage** - Settings stored locally with encryption
- **API Key Protection** - Keys never leave your device

### Security Features
- **HTTPS Only** - All communications encrypted
- **CSP Headers** - Content Security Policy protection
- **Input Validation** - All inputs sanitized and validated
- **Rate Limiting** - Protection against abuse

### Privacy Compliance
- **GDPR Compliant** - No personal data collection
- **CCPA Compliant** - California privacy law adherence
- **Transparent** - Open source for full transparency

## 📊 Usage Examples

### Password Security Check
\`\`\`
User: "Check if my password 'MyPassword123!' is secure"
AI: "I'll analyze your password strength..."
[Runs password strength tool]
AI: "Your password scores 65/100. Here are recommendations..."
\`\`\`

### Breach Checking
\`\`\`
User: "Has my email been in any data breaches?"
AI: "I'll check your email against known breach databases..."
[Runs breach checker tool]
AI: "Found 2 breaches. Here's what you should do..."
\`\`\`

### Network Security Scan
\`\`\`
User: "Scan my network for vulnerabilities"
AI: "Running network security scan..."
[Executes network scanner]
AI: "Found 3 open ports. Here's the security assessment..."
\`\`\`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
1. **Report Bugs** - Submit detailed bug reports
2. **Feature Requests** - Suggest new security tools or features
3. **Code Contributions** - Submit pull requests
4. **Documentation** - Improve docs and guides
5. **Testing** - Help test new features

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting with security rules
- **Prettier** - Consistent code formatting
- **Testing** - Unit tests for critical functions

## 🐛 Troubleshooting

### Common Issues

**Voice not working?**
- Check browser compatibility (Chrome, Firefox, Safari supported)
- Ensure microphone permissions granted
- Verify voice settings in Settings page

**AI chat not responding?**
- Verify OpenAI API key in Settings
- Check internet connection
- Ensure API key has sufficient credits

**Tools not loading?**
- Clear browser cache and cookies
- Disable browser extensions temporarily
- Check console for JavaScript errors

**Performance issues?**
- Close unnecessary browser tabs
- Disable hardware acceleration if needed
- Update to latest browser version

### Browser Compatibility
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

## 📞 Support & Contact

### Get Help
- **GitHub Issues** - Report bugs and request features
- **Documentation** - Comprehensive guides and tutorials
- **Community** - Join our Discord server
- **Email** - hello@guardianai.dev

### Professional Support
- **Enterprise** - Custom deployments and integrations
- **Training** - Security awareness training programs
- **Consulting** - Cybersecurity consulting services

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For providing advanced AI capabilities
- **Vercel** - For hosting and deployment platform
- **shadcn/ui** - For beautiful UI components
- **Community** - For feedback and contributions

## 🔮 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile app for iOS and Android
- [ ] Advanced threat intelligence integration
- [ ] Team collaboration features
- [ ] Custom security policies

### Version 2.1 (Q3 2024)
- [ ] IoT device security scanning
- [ ] Automated security monitoring
- [ ] Integration with popular security tools
- [ ] Advanced analytics dashboard

### Version 3.0 (Q4 2024)
- [ ] Enterprise-grade features
- [ ] Multi-language support
- [ ] Advanced AI models
- [ ] Compliance reporting tools

---

**Made with ❤️ by the GuardianAI Team**

*Protecting the digital world, one user at a time.*
