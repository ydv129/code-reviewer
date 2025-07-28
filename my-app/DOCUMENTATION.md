# GuardianAI - Technical Documentation

## 🏗️ Architecture Overview

GuardianAI is built using a modern, scalable architecture with the following key principles:

- **Component-Based Design** - Modular, reusable React components
- **Type Safety** - Full TypeScript implementation
- **Responsive First** - Mobile-first responsive design
- **Dynamic Tool System** - Easy integration of new security tools
- **API-First** - Clean separation between frontend and AI services

## 📁 Detailed File Structure

### Core Application Files

#### `app/layout.tsx`
Root layout component that wraps the entire application with providers:
- **ThemeProvider** - Dark/light mode support
- **AuthProvider** - Firebase authentication context
- **SettingsProvider** - User preferences management
- **Toaster** - Global notification system

#### `app/page.tsx`
Main application page featuring:
- **SidebarProvider** - Navigation state management
- **Tool state management** - Active tool tracking
- **Responsive layout** - Sidebar + main content area
- **Error boundary** - Firebase error handling

#### `lib/tool-registry.ts`
Central configuration for all security tools:
- **Tool definitions** - ID, title, description, icon, colors
- **Authentication requirements** - Per-tool auth settings
- **Component mapping** - Links tool IDs to React components
- **Helper functions** - Tool lookup and filtering utilities

### Component Architecture

#### Navigation Components

**`components/app-sidebar.tsx`**
- Responsive sidebar navigation
- Tool list generation from registry
- Active tool highlighting
- Profile link integration

**`components/tool-renderer.tsx`**
- Dynamic component rendering based on active tool
- Authentication wrapper integration
- Fallback handling for unknown tools

#### Security Tool Components

Each tool follows a consistent pattern:

**Structure:**
\`\`\`typescript
export function ToolName() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  // Form handling with react-hook-form + zod
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { /* ... */ }
  })
  
  // API integration
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await apiAction(data)
      setResult(result)
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Responsive card layout */}
    </div>
  )
}
\`\`\`

**Responsive Design Patterns:**
- \`space-y-4 sm:space-y-6\` - Responsive spacing
- \`max-w-4xl mx-auto\` - Centered content with max width
- \`text-sm sm:text-base\` - Responsive text sizing
- \`h-5 w-5 sm:h-6 sm:w-6\` - Responsive icon sizing

#### Authentication Components

**`components/protected.tsx`**
Higher-order component that:
- Checks authentication status
- Shows loading states during auth check
- Redirects to login for unauthenticated users
- Renders children for authenticated users

**`hooks/use-auth.tsx`**
Firebase authentication hook providing:
- User state management
- Login/logout functions
- Profile update capabilities
- Avatar upload functionality
- Loading state handling

### API Integration

#### Server Actions (`lib/actions.ts`)

All API calls go through server actions that:
- Make HTTP requests to API routes
- Handle errors gracefully
- Provide fallback demo responses
- Maintain consistent error handling

**Pattern:**
\`\`\`typescript
export async function toolAction(input: InputType) {
  try {
    const response = await fetch(\`\${API_BASE_URL}/api/tool-endpoint\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    
    if (!response.ok) {
      throw new Error("API not configured")
    }
    
    return await response.json()
  } catch (error) {
    console.log("Using demo mode for tool")
    return getDemoResponse("tool")
  }
}
\`\`\`

#### API Routes (`app/api/*/route.ts`)

Each API route follows this pattern:
- **Environment check** - Verify API keys are configured
- **Input validation** - Validate request body
- **AI integration** - Call Google Generative AI
- **Response formatting** - Structure consistent responses
- **Error handling** - Return appropriate error messages

### Styling System

#### Theme Configuration (`app/globals.css`)

Custom CSS properties for GuardianAI theme:
\`\`\`css
:root {
  --guardian-primary: 231 48% 48%; /* Deep blue #3F51B5 */
  --guardian-background: 240 5% 96%; /* Light gray #EEEEEE */
  --guardian-accent: 122 39% 49%; /* Soft teal #4CAF50 */
}
\`\`\`

#### Responsive Utilities

**Breakpoints:**
- \`sm:\` - 640px and up (tablet)
- \`md:\` - 768px and up (desktop)
- \`lg:\` - 1024px and up (large desktop)

**Common Patterns:**
- \`px-3 sm:px-4\` - Responsive padding
- \`text-base sm:text-lg\` - Responsive typography
- \`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3\` - Responsive grids

## 🔧 Adding New Tools - Detailed Guide

### 1. Tool Registry Configuration

Add your tool to \`SECURITY_TOOLS\` array in \`lib/tool-registry.ts\`:

\`\`\`typescript
{
  id: "password-analyzer", // Unique identifier
  title: "Password Analyzer", // Display name
  description: "Analyze password strength and security", // Tool description
  icon: Key, // Lucide React icon
  color: "text-indigo-500", // Tailwind color class
  requiresAuth: true, // Authentication requirement
  component: "password-analyzer", // Component file name (without .tsx)
}
\`\`\`

### 2. Component Implementation

Create \`components/password-analyzer.tsx\`:

\`\`\`typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { analyzePassword } from "@/lib/actions"
import { Key, Loader2 } from 'lucide-react'

// Define input schema
const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

type PasswordForm = z.infer<typeof passwordSchema>

// Define result interface
interface PasswordAnalysis {
  strength: "weak" | "medium" | "strong"
  score: number
  suggestions: string[]
}

export function PasswordAnalyzer() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PasswordAnalysis | null>(null)

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async (data: PasswordForm) => {
    setIsLoading(true)
    setResult(null)
    try {
      const analysis = await analyzePassword({ password: data.password })
      setResult(analysis)
    } catch (error) {
      console.error("Password analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Password Analyzer</CardTitle>
              <CardDescription className="text-sm">
                Analyze password strength and get security recommendations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password to Analyze</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password to analyze" 
                        {...field} 
                        className="text-sm sm:text-base" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Password...
                  </>
                ) : (
                  "Analyze Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display results */}
            <div>
              <h4 className="font-medium mb-2">Password Strength: {result.strength}</h4>
              <p className="text-sm text-muted-foreground">Score: {result.score}/100</p>
            </div>
            {result.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <ul className="text-sm space-y-1">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
\`\`\`

### 3. Tool Renderer Integration

Update \`components/tool-renderer.tsx\`:

\`\`\`typescript
import { PasswordAnalyzer } from "@/components/password-analyzer"

// Add to the switch statement in renderToolComponent():
case "password-analyzer":
  return <PasswordAnalyzer />
\`\`\`

### 4. API Route (Optional)

If your tool needs AI integration, create \`app/api/analyze-password/route.ts\`:

\`\`\`typescript
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 })
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = \`Analyze the following password for strength and security:

Password: \${password}

Provide analysis in JSON format:
{
  "strength": "weak|medium|strong",
  "score": 0-100,
  "suggestions": ["suggestion1", "suggestion2"]
}

Consider:
- Length and complexity
- Character variety (uppercase, lowercase, numbers, symbols)
- Common patterns and dictionary words
- Predictability and entropy\`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          strength: parsed.strength || "medium",
          score: Math.min(Math.max(Number(parsed.score) || 50, 0), 100),
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        })
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
    }

    // Fallback response
    return NextResponse.json({
      strength: "medium",
      score: 50,
      suggestions: ["Use a longer password", "Include special characters", "Avoid common words"],
    })
  } catch (error) {
    console.error("Password analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze password" }, { status: 500 })
  }
}
\`\`\`

### 5. Server Action

Add to \`lib/actions.ts\`:

\`\`\`typescript
export async function analyzePassword(input: { password: string }) {
  try {
    const response = await fetch(\`\${API_BASE_URL}/api/analyze-password\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error("API not configured")
    }

    return await response.json()
  } catch (error) {
    console.log("Using demo mode for password analysis")
    return {
      strength: "medium" as const,
      score: 65,
      suggestions: [
        "This is a demo response. Configure Google AI API key for real analysis.",
        "Use at least 12 characters",
        "Include uppercase, lowercase, numbers, and symbols",
        "Avoid common words and patterns"
      ],
    }
  }
}
\`\`\`

## 🎨 Styling Guidelines

### Component Styling Patterns

**Card Layout:**
\`\`\`typescript
<div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
        <div className="min-w-0">
          <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
          <CardDescription className="text-sm">Description</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {/* Content */}
    </CardContent>
  </Card>
</div>
\`\`\`

**Form Styling:**
\`\`\`typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Label</FormLabel>
          <FormControl>
            <Input 
              placeholder="Placeholder text" 
              {...field} 
              className="text-sm sm:text-base" 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  </form>
</Form>
\`\`\`

### Responsive Design Checklist

- [ ] Use responsive spacing (\`space-y-4 sm:space-y-6\`)
- [ ] Implement responsive typography (\`text-sm sm:text-base\`)
- [ ] Add responsive padding/margins (\`px-3 sm:px-4\`)
- [ ] Use responsive icons (\`h-5 w-5 sm:h-6 sm:w-6\`)
- [ ] Implement responsive grids (\`grid-cols-1 sm:grid-cols-2\`)
- [ ] Add \`flex-shrink-0\` to icons
- [ ] Use \`min-w-0\` for text containers
- [ ] Add \`truncate\` for long text
- [ ] Test on mobile, tablet, and desktop

## 🔐 Security Considerations

### Input Validation
- All forms use Zod schema validation
- Server-side validation in API routes
- Sanitize user inputs before AI processing

### Authentication
- Firebase Authentication integration
- Protected routes for sensitive tools
- Secure token handling

### API Security
- Environment variable validation
- Rate limiting (implement as needed)
- Error message sanitization
- HTTPS enforcement in production

## 🚀 Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading of tool components
- API route optimization

### Caching
- Static asset caching
- API response caching (implement as needed)
- Firebase auth state persistence

### Bundle Optimization
- Tree shaking enabled
- Minimal dependencies
- Optimized build configuration

## 🧪 Testing Strategy

### Component Testing
\`\`\`typescript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordAnalyzer } from '@/components/password-analyzer'

describe('PasswordAnalyzer', () => {
  it('renders correctly', () => {
    render(<PasswordAnalyzer />)
    expect(screen.getByText('Password Analyzer')).toBeInTheDocument()
  })

  it('validates form input', async () => {
    render(<PasswordAnalyzer />)
    const submitButton = screen.getByText('Analyze Password')
    fireEvent.click(submitButton)
    // Test validation messages
  })
})
\`\`\`

### API Testing
- Test API routes with various inputs
- Validate error handling
- Test authentication requirements

### Integration Testing
- End-to-end user flows
- Authentication workflows
- Tool functionality testing

This documentation provides a comprehensive guide for understanding, maintaining, and extending the GuardianAI application. Follow these patterns and guidelines to ensure consistency and maintainability as the application grows.
