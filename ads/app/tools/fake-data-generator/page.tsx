"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Database, Download, Copy, RefreshCw, User, CreditCard, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GeneratedData {
  type: string
  count: number
  format: string
  timestamp: string
  data: any[]
}

export default function FakeDataGeneratorPage() {
  const { toast } = useToast()
  const [dataType, setDataType] = useState("person")
  const [count, setCount] = useState(10)
  const [format, setFormat] = useState("json")
  const [result, setResult] = useState<GeneratedData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        // Header animation
        gsap.fromTo(
          ".generator-header",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
        )

        // Configuration panel animation
        gsap.fromTo(
          ".config-panel",
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.2,
          },
        )

        // Results animation (when results appear)
        if (result) {
          gsap.fromTo(
            ".results-panel",
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".results-panel",
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          )

          gsap.fromTo(
            ".data-item",
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".data-list",
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            },
          )
        }
      })
    }
  }, [result])

  // Real data generation functions
  const generatePersonData = () => {
    const firstNames = [
      "James",
      "Mary",
      "John",
      "Patricia",
      "Robert",
      "Jennifer",
      "Michael",
      "Linda",
      "William",
      "Elizabeth",
      "David",
      "Barbara",
      "Richard",
      "Susan",
      "Joseph",
      "Jessica",
      "Thomas",
      "Sarah",
      "Christopher",
      "Karen",
      "Charles",
      "Nancy",
      "Daniel",
      "Lisa",
      "Matthew",
      "Betty",
      "Anthony",
      "Helen",
      "Mark",
      "Sandra",
    ]

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
    ]

    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "company.com", "email.com"]
    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
    ]
    const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA", "TX", "CA"]
    const companies = [
      "TechCorp",
      "DataSys",
      "InnovateLab",
      "GlobalTech",
      "FutureSoft",
      "NextGen",
      "SmartSolutions",
      "DigitalWorks",
    ]

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const domain = domains[Math.floor(Math.random() * domains.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      const state = states[Math.floor(Math.random() * states.length)]
      const company = companies[Math.floor(Math.random() * companies.length)]

      return {
        id: i + 1,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        address: {
          street: `${Math.floor(Math.random() * 9999 + 1)} ${["Main", "Oak", "Pine", "Maple", "Cedar", "Elm"][Math.floor(Math.random() * 6)]} St`,
          city,
          state,
          zipCode: Math.floor(Math.random() * 90000 + 10000).toString(),
          country: "United States",
        },
        dateOfBirth: new Date(
          1950 + Math.floor(Math.random() * 50),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
        age: Math.floor(Math.random() * 50) + 18,
        company,
        jobTitle: ["Developer", "Manager", "Analyst", "Designer", "Engineer", "Consultant"][
          Math.floor(Math.random() * 6)
        ],
        salary: Math.floor(Math.random() * 100000) + 40000,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      }
    })
  }

  const generateCompanyData = () => {
    const companyNames = [
      "TechCorp Solutions",
      "DataFlow Systems",
      "InnovateLab Inc",
      "GlobalTech Enterprises",
      "FutureSoft LLC",
      "NextGen Technologies",
      "SmartSolutions Group",
      "DigitalWorks Co",
      "CloudFirst Systems",
      "AI Dynamics",
    ]

    const industries = [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Retail",
      "Consulting",
      "Media",
    ]
    const cities = ["San Francisco", "New York", "Austin", "Seattle", "Boston", "Chicago", "Los Angeles", "Denver"]

    return Array.from({ length: count }, (_, i) => {
      const name = companyNames[Math.floor(Math.random() * companyNames.length)]
      const industry = industries[Math.floor(Math.random() * industries.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]

      return {
        id: i + 1,
        name: `${name} ${i + 1}`,
        industry,
        founded: Math.floor(Math.random() * 30) + 1990,
        employees: Math.floor(Math.random() * 10000) + 10,
        revenue: Math.floor(Math.random() * 1000000000) + 1000000,
        headquarters: {
          city,
          country: "United States",
        },
        website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
        email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        description: `Leading ${industry.toLowerCase()} company providing innovative solutions since ${Math.floor(Math.random() * 30) + 1990}.`,
      }
    })
  }

  const generateProductData = () => {
    const productNames = [
      "SmartPhone Pro",
      "Wireless Headphones",
      "Gaming Laptop",
      "Fitness Tracker",
      "Smart Watch",
      "Bluetooth Speaker",
      "Tablet Device",
      "Digital Camera",
      "Smart TV",
      "Home Assistant",
    ]

    const categories = ["Electronics", "Computers", "Audio", "Wearables", "Home & Garden", "Sports", "Gaming"]
    const brands = ["TechBrand", "InnovateCorp", "SmartDevices", "FutureTech", "DigitalPro"]

    return Array.from({ length: count }, (_, i) => {
      const name = productNames[Math.floor(Math.random() * productNames.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const brand = brands[Math.floor(Math.random() * brands.length)]

      return {
        id: i + 1,
        name: `${name} ${i + 1}`,
        brand,
        category,
        price: Math.floor(Math.random() * 2000) + 50,
        currency: "USD",
        inStock: Math.random() > 0.2,
        stockQuantity: Math.floor(Math.random() * 1000),
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        reviews: Math.floor(Math.random() * 5000),
        description: `High-quality ${category.toLowerCase()} product from ${brand} with advanced features and excellent performance.`,
        features: [
          "Advanced Technology",
          "High Performance",
          "User Friendly",
          "Durable Design",
          "Energy Efficient",
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        releaseDate: new Date(
          2020 + Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
      }
    })
  }

  const generateFinancialData = () => {
    const accountTypes = ["Checking", "Savings", "Credit", "Investment", "Business"]
    const banks = ["First National", "City Bank", "Trust Financial", "Global Bank", "Community Credit Union"]
    const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"]

    return Array.from({ length: count }, (_, i) => {
      const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)]
      const bank = banks[Math.floor(Math.random() * banks.length)]
      const currency = currencies[Math.floor(Math.random() * currencies.length)]

      return {
        id: i + 1,
        accountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
        routingNumber: Math.floor(Math.random() * 900000000) + 100000000,
        accountType,
        bank,
        balance: Math.floor(Math.random() * 100000) + 1000,
        currency,
        openDate: new Date(
          2015 + Math.floor(Math.random() * 8),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
        interestRate: (Math.random() * 5).toFixed(2),
        creditLimit: accountType === "Credit" ? Math.floor(Math.random() * 50000) + 5000 : null,
        lastTransaction: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: Math.random() > 0.1 ? "Active" : "Inactive",
      }
    })
  }

  const generateData = async () => {
    setIsGenerating(true)

    try {
      // Simulate generation time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let generatedData = []

      switch (dataType) {
        case "person":
          generatedData = generatePersonData()
          break
        case "company":
          generatedData = generateCompanyData()
          break
        case "product":
          generatedData = generateProductData()
          break
        case "financial":
          generatedData = generateFinancialData()
          break
        default:
          generatedData = generatePersonData()
      }

      setResult({
        type: dataType,
        count: generatedData.length,
        format,
        timestamp: new Date().toISOString(),
        data: generatedData,
      })

      // Update usage statistics
      const currentCount = Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0")
      localStorage.setItem("guardianai-tools-used", (currentCount + 1).toString())

      toast({
        title: "Data Generated Successfully",
        description: `Generated ${generatedData.length} ${dataType} records`,
      })
    } catch (error) {
      console.error("Data generation error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const formatData = (data: any[]) => {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2)
      case "csv":
        if (data.length === 0) return ""
        const headers = Object.keys(data[0]).filter((key) => typeof data[0][key] !== "object")
        const csvHeaders = headers.join(",")
        const csvRows = data
          .map((item) =>
            headers
              .map((header) => {
                const value = item[header]
                return typeof value === "string" ? `"${value}"` : value
              })
              .join(","),
          )
          .join("\n")
        return `${csvHeaders}\n${csvRows}`
      case "xml":
        const xmlData = data
          .map((item) => {
            const xmlItem = Object.entries(item)
              .filter(([key, value]) => typeof value !== "object")
              .map(([key, value]) => `    <${key}>${value}</${key}>`)
              .join("\n")
            return `  <item>\n${xmlItem}\n  </item>`
          })
          .join("\n")
        return `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlData}\n</data>`
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  const copyToClipboard = () => {
    if (!result) return

    const formattedData = formatData(result.data)
    navigator.clipboard.writeText(formattedData)

    toast({
      title: "Copied to Clipboard",
      description: "Data has been copied to your clipboard",
    })
  }

  const downloadData = () => {
    if (!result) return

    const formattedData = formatData(result.data)
    const blob = new Blob([formattedData], { type: `text/${format}` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fake-${result.type}-data.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: `Downloading ${result.type} data as ${format.toUpperCase()}`,
    })
  }

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case "person":
        return User
      case "company":
        return Building
      case "product":
        return Database
      case "financial":
        return CreditCard
      default:
        return Database
    }
  }

  return (
    <div ref={pageRef} className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="generator-header flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Database className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Enhanced Fake Data Generator</h1>
          <p className="text-muted-foreground">Generate realistic test data for development and testing purposes</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="config-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5" />
                Data Configuration
              </CardTitle>
              <CardDescription>Configure your data generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        Person Data
                      </div>
                    </SelectItem>
                    <SelectItem value="company">
                      <div className="flex items-center gap-2">
                        <Building className="size-4" />
                        Company Data
                      </div>
                    </SelectItem>
                    <SelectItem value="product">
                      <div className="flex items-center gap-2">
                        <Database className="size-4" />
                        Product Data
                      </div>
                    </SelectItem>
                    <SelectItem value="financial">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4" />
                        Financial Data
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Records</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(Number.parseInt(e.target.value) || 10)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateData} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    Generate Data
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Realistic data patterns</p>
                <p>• Multiple output formats</p>
                <p>• Privacy-safe test data</p>
                <p>• Development ready</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <div className="results-panel">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="formatted">Formatted Data</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = getDataTypeIcon(result.type)
                            return <IconComponent className="size-5" />
                          })()}
                          Generated {result.type} Data
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.count} records</Badge>
                          <Badge variant="outline">{result.format.toUpperCase()}</Badge>
                          <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="size-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadData}>
                            <Download className="size-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <CardDescription>Generated on {new Date(result.timestamp).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="data-list space-y-3 max-h-96 overflow-y-auto">
                        {result.data.slice(0, 10).map((item, index) => (
                          <div key={index} className="data-item p-3 border rounded-lg">
                            <div className="grid gap-2 text-sm">
                              {Object.entries(item)
                                .slice(0, 6)
                                .map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}:
                                    </span>
                                    <span className="text-muted-foreground font-mono">
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                        {result.data.length > 10 && (
                          <div className="text-center text-sm text-muted-foreground">
                            ... and {result.data.length - 10} more records
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="formatted" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Formatted Output</CardTitle>
                      <CardDescription>Ready to copy or download</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea value={formatData(result.data)} readOnly className="min-h-96 font-mono text-xs" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generation Statistics</CardTitle>
                      <CardDescription>Data generation summary and insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="font-semibold">Generation Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Data Type:</span>
                              <span className="font-mono capitalize">{result.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Records Generated:</span>
                              <span className="font-mono">{result.count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Output Format:</span>
                              <span className="font-mono uppercase">{result.format}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Generation Time:</span>
                              <span className="font-mono">{new Date(result.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Data Insights</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Fields per Record:</span>
                              <span className="font-mono">{Object.keys(result.data[0] || {}).length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estimated Size:</span>
                              <span className="font-mono">
                                {(JSON.stringify(result.data).length / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Data Quality:</span>
                              <Badge variant="default">Realistic</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Privacy Safe:</span>
                              <Badge variant="default">Yes</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Generator Ready</h3>
                <p className="text-muted-foreground text-center">
                  Configure your settings and click "Generate Data" to create realistic test data
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
