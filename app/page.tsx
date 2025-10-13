"use client"

import React, { useState, useMemo } from "react"
import { Search, MapPin, Phone, Clock, Star, Heart, User, LogIn, LogOut, MessageSquare, Share2, Brain, Sparkles } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// AI Search Types and Logic (Built-in)
interface SearchIntent {
  cuisine?: string
  nationality?: string
  category?: string
  atmosphere?: string[]
  occasion?: string
  timeContext?: string
  priceRange?: string
  location?: string
  dietary?: string[]
}

interface AISearchResult {
  confidence: number
  reasoning: string
  intent: SearchIntent
  suggestions: string[]
}

interface Business {
  id: number
  name: string
  nationality: string
  category: string
  cuisine?: string
  services?: string
  address: string
  phone: string
  rating: number
  hours: string
  description: string
  image: string
  priceRange: 1 | 2 | 3 | 4
}

interface AIMatchResult {
  business: Business
  relevanceScore: number
  matchReasons: string[]
}

// AI Search Processor Class
class AISearchProcessor {
  private atmosphereKeywords = {
    cozy: ["intimate", "warm", "comfortable", "small", "family-run"],
    vibrant: ["lively", "energetic", "bustling", "popular", "busy"],
    authentic: ["traditional", "genuine", "original", "family-recipe", "cultural"],
    upscale: ["fine-dining", "elegant", "sophisticated", "premium", "luxury"],
    casual: ["relaxed", "informal", "laid-back", "friendly", "neighborhood"],
  }

  private occasionKeywords = {
    "date night": ["romantic", "intimate", "quiet", "special"],
    "family meal": ["family-friendly", "spacious", "kids", "large portions"],
    "business lunch": ["quick", "professional", "central", "reliable"],
    celebration: ["special occasion", "festive", "group dining", "memorable"],
    brunch: ["weekend", "morning", "breakfast", "coffee"],
  }

  processQuery(query: string): AISearchResult {
    const lowerQuery = query.toLowerCase()
    const intent: SearchIntent = {}
    const reasoning: string[] = []
    let confidence = 0.7

    // Extract nationality/cuisine
    const nationalities = [
      "turkish", "african", "caribbean", "polish", "irish", "asian", "latino", 
      "middle eastern", "chinese", "japanese", "lebanese", "persian", "brazilian", 
      "mexican", "ghanaian", "ethiopian", "romanian",
    ]
    
    for (const nationality of nationalities) {
      if (lowerQuery.includes(nationality)) {
        intent.nationality = nationality.charAt(0).toUpperCase() + nationality.slice(1)
        reasoning.push(`Detected ${nationality} cuisine preference`)
        confidence += 0.1
        break
      }
    }

    // Extract category
    if (lowerQuery.includes("restaurant") || lowerQuery.includes("place") || lowerQuery.includes("food")) {
      intent.category = "Restaurant"
    } else if (lowerQuery.includes("grocery") || lowerQuery.includes("store") || lowerQuery.includes("shop")) {
      intent.category = "Grocery Store"
    } else if (lowerQuery.includes("barber") || lowerQuery.includes("salon") || lowerQuery.includes("hair")) {
      intent.category = "Salon & Barber"
    }

    // Extract atmosphere
    intent.atmosphere = []
    for (const [atmosphere, keywords] of Object.entries(this.atmosphereKeywords)) {
      if (lowerQuery.includes(atmosphere) || keywords.some((keyword) => lowerQuery.includes(keyword))) {
        intent.atmosphere.push(atmosphere)
        reasoning.push(`Looking for ${atmosphere} atmosphere`)
        confidence += 0.1
      }
    }

    // Extract occasion
    for (const [occasion, keywords] of Object.entries(this.occasionKeywords)) {
      if (lowerQuery.includes(occasion) || keywords.some((keyword) => lowerQuery.includes(keyword))) {
        intent.occasion = occasion
        reasoning.push(`Occasion identified as ${occasion}`)
        confidence += 0.1
      }
    }

    // Extract dietary requirements
    intent.dietary = []
    const dietaryTerms = ["halal", "kosher", "vegan", "vegetarian", "gluten-free"]
    for (const term of dietaryTerms) {
      if (lowerQuery.includes(term)) {
        intent.dietary.push(term)
        reasoning.push(`Dietary requirement: ${term}`)
        confidence += 0.05
      }
    }

    // Generate suggestions
    const suggestions = this.generateSuggestions(intent)

    return {
      confidence: Math.min(confidence, 1.0),
      reasoning: reasoning.join(" • "),
      intent,
      suggestions,
    }
  }

  private generateSuggestions(intent: SearchIntent): string[] {
    const suggestions: string[] = []

    if (intent.nationality) {
      suggestions.push(`Show all ${intent.nationality} restaurants`)
      suggestions.push(`${intent.nationality} grocery stores near me`)
    }

    if (intent.atmosphere?.includes("cozy")) {
      suggestions.push("Small family-run restaurants")
      suggestions.push("Intimate dining spots")
    }

    if (intent.occasion?.includes("brunch")) {
      suggestions.push("Weekend brunch specials")
      suggestions.push("Places open for breakfast")
    }

    return suggestions.slice(0, 3)
  }

  // AI Matching Logic
  matchBusinesses(businesses: Business[], query: string, intent: SearchIntent): AIMatchResult[] {
    if (!query && !Object.keys(intent).length) {
      return businesses.map((business) => ({
        business,
        relevanceScore: 0.5,
        matchReasons: [],
      }))
    }

    const results: AIMatchResult[] = businesses.map((business) => {
      let score = 0
      const reasons: string[] = []

      // Nationality/Cuisine matching (high weight)
      if (intent.nationality) {
        if (business.nationality.toLowerCase() === intent.nationality.toLowerCase()) {
          score += 0.4
          reasons.push(`Matches ${intent.nationality} cuisine`)
        }
      }

      // Category matching
      if (intent.category) {
        if (business.category === intent.category) {
          score += 0.3
          reasons.push(`${intent.category} as requested`)
        }
      }

      // Atmosphere matching (semantic analysis)
      if (intent.atmosphere?.length) {
        for (const atmosphere of intent.atmosphere) {
          if (atmosphere === "cozy") {
            const cozyIndicators = ["family", "intimate", "small", "traditional", "home", "warm"]
            const hasCozyIndicators = cozyIndicators.some(
              (indicator) =>
                business.description.toLowerCase().includes(indicator) ||
                business.name.toLowerCase().includes(indicator),
            )
            if (hasCozyIndicators || business.priceRange <= 2) {
              score += 0.2
              reasons.push("Cozy, intimate atmosphere")
            }
          }

          if (atmosphere === "authentic") {
            const authenticIndicators = ["authentic", "traditional", "genuine", "family recipe"]
            const hasAuthenticIndicators = authenticIndicators.some((indicator) =>
              business.description.toLowerCase().includes(indicator),
            )
            if (hasAuthenticIndicators) {
              score += 0.2
              reasons.push("Authentic cultural experience")
            }
          }

          if (atmosphere === "upscale") {
            if (business.priceRange >= 3) {
              score += 0.2
              reasons.push("Upscale dining experience")
            }
          }
        }
      }

      // Price range matching
      if (intent.priceRange) {
        if (intent.priceRange === "budget" && business.priceRange <= 2) {
          score += 0.1
          reasons.push("Budget-friendly pricing")
        } else if (intent.priceRange === "upscale" && business.priceRange >= 3) {
          score += 0.1
          reasons.push("Premium pricing tier")
        }
      }

      // Text search in name and description
      const searchTerms = query.toLowerCase().split(" ")
      for (const term of searchTerms) {
        if (term.length > 2) {
          if (
            business.name.toLowerCase().includes(term) ||
            business.description.toLowerCase().includes(term) ||
            business.address.toLowerCase().includes(term)
          ) {
            score += 0.05
          }
        }
      }

      // Rating boost for high-quality matches
      if (score > 0.3 && business.rating >= 4.5) {
        score += 0.1
        reasons.push("Highly rated by community")
      }

      return {
        business,
        relevanceScore: Math.min(score, 1.0),
        matchReasons: reasons,
      }
    })

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
}

// AI Search Component (Built-in)
interface AISearchProps {
  onSearch: (query: string, intent: SearchIntent) => void
  isLoading?: boolean
}

function AISearch({ onSearch, isLoading }: AISearchProps) {
  const [query, setQuery] = useState("")
  const [searchResult, setSearchResult] = useState<AISearchResult | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const processor = new AISearchProcessor()

  const handleSearch = () => {
    if (!query.trim()) return

    const result = processor.processQuery(query)
    setSearchResult(result)
    setShowAIInsights(true)
    onSearch(query, result.intent)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    const result = processor.processQuery(suggestion)
    setSearchResult(result)
    setShowAIInsights(true)
    onSearch(suggestion, result.intent)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      {/* AI-Powered Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Brain className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-5 w-5" />
            <Input
              placeholder="Try: 'Find me a cozy Turkish place for Sunday brunch' or 'Authentic Lebanese restaurant for date night'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-10 h-12 text-lg border-2 border-purple-200 focus:border-purple-400"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Search Insights */}
      {showAIInsights && searchResult && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-purple-900">AI Understanding</h3>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {Math.round(searchResult.confidence * 100)}% confidence
                  </Badge>
                </div>

                {searchResult.reasoning && (
                  <p className="text-sm text-purple-700 mb-3">{searchResult.reasoning}</p>
                )}

                {/* Extracted Intent Display */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {searchResult.intent.nationality && (
                    <Badge className="bg-blue-100 text-blue-800">🌍 {searchResult.intent.nationality}</Badge>
                  )}
                  {searchResult.intent.category && (
                    <Badge className="bg-green-100 text-green-800">🏪 {searchResult.intent.category}</Badge>
                  )}
                  {searchResult.intent.atmosphere?.map((mood) => (
                    <Badge key={mood} className="bg-orange-100 text-orange-800">
                      ✨ {mood}
                    </Badge>
                  ))}
                  {searchResult.intent.occasion && (
                    <Badge className="bg-pink-100 text-pink-800">🎉 {searchResult.intent.occasion}</Badge>
                  )}
                </div>

                {/* AI Suggestions */}
                {searchResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-purple-700 mb-2">Related searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-2 py-1 bg-white border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Search Examples */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Try these AI-powered searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Cozy Turkish place for Sunday brunch",
            "Authentic Lebanese restaurant for date night",
            "Family-friendly Polish restaurant",
            "Upscale Brazilian steakhouse",
            "Traditional Middle Eastern food",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample business data
const businesses: Business[] = [
  {
    id: 1,
    name: "Zoe's Ghana Kitchen",
    nationality: "African",
    category: "Restaurant",
    cuisine: "Ghanaian",
    address: "Hackney, London E8",
    phone: "+44 20 7254 1234",
    rating: 4.8,
    hours: "12:00 - 22:00",
    description: "Authentic Ghanaian cuisine in the heart of Hackney with traditional family recipes",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
  },
  {
    id: 2,
    name: "Turkish Barber Deluxe",
    nationality: "Turkish",
    category: "Salon & Barber",
    services: "Hot towel shaves, beard styling, hair cuts",
    address: "Green Lanes, London N4",
    phone: "+44 20 8802 3456",
    rating: 4.8,
    hours: "08:00 - 20:00",
    description: "Traditional Turkish barbering with authentic hot towel shaves and cozy family atmosphere",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 1,
  },
  {
    id: 3,
    name: "Pierogi Palace",
    nationality: "Polish",
    category: "Restaurant",
    cuisine: "Polish",
    address: "Ealing, London W5",
    phone: "+44 20 8567 1234",
    rating: 4.6,
    hours: "12:00 - 21:00",
    description: "Traditional Polish pierogi and hearty comfort food in a cozy family-run atmosphere",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
  },
  {
    id: 4,
    name: "Casa Madeira",
    nationality: "Latino",
    category: "Restaurant",
    cuisine: "Brazilian",
    address: "Stockwell, London SW9",
    phone: "+44 20 7737 1234",
    rating: 4.6,
    hours: "12:00 - 23:00",
    description: "Authentic Brazilian steakhouse with traditional churrasco and upscale dining experience",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 3,
  },
  {
    id: 5,
    name: "Maroush",
    nationality: "Middle Eastern",
    category: "Restaurant",
    cuisine: "Lebanese",
    address: "Edgware Road, London W2",
    phone: "+44 20 7723 0773",
    rating: 4.5,
    hours: "12:00 - 02:00",
    description: "Legendary Lebanese restaurant with authentic mezze, perfect for date nights and celebrations",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 3,
  },
]

const nationalities = ["All", "African", "Caribbean", "Eastern European", "Turkish", "Irish", "Asian", "Latino", "Middle Eastern"]
const categories = ["All", "Restaurant", "Grocery Store", "Salon & Barber"]

const nationalityColors = {
  African: "bg-orange-100 text-orange-800 border-orange-200",
  Caribbean: "bg-green-100 text-green-800 border-green-200",
  "Eastern European": "bg-red-100 text-red-800 border-red-200",
  Turkish: "bg-blue-100 text-blue-800 border-blue-200",
  Irish: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Asian: "bg-purple-100 text-purple-800 border-purple-200",
  Latino: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Middle Eastern": "bg-pink-100 text-pink-800 border-pink-200",
  Polish: "bg-red-100 text-red-800 border-red-200",
}

const getPriceRangeDisplay = (priceRange: number) => {
  return "£".repeat(priceRange)
}

export default function WeDoNotKeepSecrets() {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState<number[]>([])
  
  // Traditional search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNationality, setSelectedNationality] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // AI Search state
  const [aiQuery, setAiQuery] = useState("")
  const [aiIntent, setAiIntent] = useState<SearchIntent>({})
  const [showAIResults, setShowAIResults] = useState(false)
  
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" })

  const processor = new AISearchProcessor()

  const handleLogin = () => {
    const newUser = {
      id: "user_" + Date.now(),
      name: authForm.name || "User",
      email: authForm.email,
      joinDate: new Date().toISOString().split("T")[0],
    }
    setUser(newUser)
    setShowAuth(false)
    setAuthForm({ name: "", email: "", password: "" })
  }

  const handleLogout = () => {
    setUser(null)
    setFavorites([])
  }

  const toggleFavorite = (businessId: number) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setFavorites((prev) => 
      prev.includes(businessId) 
        ? prev.filter((id) => id !== businessId) 
        : [...prev, businessId]
    )
  }

  // Traditional filtered businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesNationality = selectedNationality === "All" || business.nationality === selectedNationality
      const matchesCategory = selectedCategory === "All" || business.category === selectedCategory

      return matchesSearch && matchesNationality && matchesCategory
    })
  }, [searchTerm, selectedNationality, selectedCategory])

  // AI-powered search results
  const aiSearchResults = useMemo(() => {
    return processor.matchBusinesses(businesses, aiQuery, aiIntent)
  }, [aiQuery, aiIntent])

  const handleAISearch = (query: string, intent: SearchIntent) => {
    setAiQuery(query)
    setAiIntent(intent)
    setShowAIResults(true)
    // Reset traditional filters when using AI search
    setSearchTerm("")
    setSelectedNationality("All")
    setSelectedCategory("All")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">We Don't Keep Secrets</h1>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              London's most trusted cultural community. Share experiences, discover hidden gems, and connect with diverse communities across London
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI-Powered Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <AISearch onSearch={handleAISearch} />

          {/* Traditional Search Toggle */}
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAIResults(false)} className="text-sm">
              Switch to Traditional Search
            </Button>
          </div>
        </div>

        {/* Traditional Search (when not using AI) */}
        {!showAIResults && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for restaurants, grocery stores, salons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {nationalities.map((nationality) => (
                <Button
                  key={nationality}
                  variant={selectedNationality === nationality ? "default" : "outline"}
                  onClick={() => setSelectedNationality(nationality)}
                  size="sm"
                >
                  {nationality}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAIResults
            ? aiSearchResults
            : filteredBusinesses.map((business) => ({
                business,
                relevanceScore: 0.5,
                matchReasons: [],
              }))
          ).map((result) => {
            const business = result.business
            const isFavorited = favorites.includes(business.id)
            
            return (
              <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* AI Match Indicator */}
                {showAIResults && result.relevanceScore > 0.3 && (
                  <div className="bg-purple-50 border-b border-purple-100 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
                        AI Match: {Math.round(result.relevanceScore * 100)}%
                      </span>
                    </div>
                    {result.matchReasons.length > 0 && (
                      <p className="text-xs text-purple-700">{result.matchReasons.join(" • ")}</p>
                    )}
                  </div>
                )}

                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={business.image || "/placeholder.svg"}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={nationalityColors[business.nationality as keyof typeof nationalityColors]}>
                      {business.nationality}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button
                      size="sm"
                      variant={isFavorited ? "default" : "outline"}
                      onClick={() => toggleFavorite(business.id)}
                      className="p-2"
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      {business.cuisine && <p className="text-sm text-gray-600">{business.cuisine} Cuisine</p>}
                      {business.services && <p className="text-sm text-gray-600">{business.services}</p>}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {getPriceRangeDisplay(business.priceRange)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-gray-700 text-sm">{business.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{business.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{business.hours}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{business.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full mt-4">View Details</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === "login" ? "Login" : "Sign Up"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {authMode === "signup" && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              {authMode === "login" ? "Login" : "Sign Up"}
            </Button>
            <Button
              variant="link"
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="w-full"
            >
              {authMode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 We Don't Keep Secrets. Building London's most vibrant cultural community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}