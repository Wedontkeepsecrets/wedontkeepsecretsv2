"use client"

import type React from "react"

import { useState } from "react"
import { Search, Brain, Clock, Sparkles } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

// AI Search Query Processor
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

  private timeContexts = {
    "sunday brunch": { day: "sunday", meal: "brunch", time: "morning" },
    "weekday lunch": { day: "weekday", meal: "lunch", time: "afternoon" },
    "friday night": { day: "friday", meal: "dinner", time: "evening" },
    "weekend dinner": { day: "weekend", meal: "dinner", time: "evening" },
  }

  processQuery(query: string): AISearchResult {
    const lowerQuery = query.toLowerCase()
    const intent: SearchIntent = {}
    const reasoning: string[] = []
    let confidence = 0.7

    // Extract nationality/cuisine
    const nationalities = [
      "turkish",
      "african",
      "caribbean",
      "polish",
      "irish",
      "asian",
      "latino",
      "middle eastern",
      "chinese",
      "japanese",
      "lebanese",
      "persian",
      "brazilian",
      "mexican",
      "ghanaian",
      "ethiopian",
      "romanian",
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

    // Extract time context
    for (const [timePhrase, context] of Object.entries(this.timeContexts)) {
      if (lowerQuery.includes(timePhrase)) {
        intent.timeContext = timePhrase
        reasoning.push(`Time context: ${timePhrase}`)
        confidence += 0.1
      }
    }

    // Extract price indicators
    if (lowerQuery.includes("cheap") || lowerQuery.includes("budget") || lowerQuery.includes("affordable")) {
      intent.priceRange = "budget"
      reasoning.push("Budget-friendly options preferred")
    } else if (
      lowerQuery.includes("expensive") ||
      lowerQuery.includes("upscale") ||
      lowerQuery.includes("fine dining")
    ) {
      intent.priceRange = "upscale"
      reasoning.push("Premium dining experience sought")
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

    if (intent.timeContext?.includes("brunch")) {
      suggestions.push("Weekend brunch specials")
      suggestions.push("Places open for breakfast")
    }

    return suggestions.slice(0, 3)
  }
}

interface AISearchProps {
  onSearch: (query: string, intent: SearchIntent) => void
  isLoading?: boolean
}

export function AISearch({ onSearch, isLoading }: AISearchProps) {
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
    handleSearch()
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
              placeholder="Try: 'Find me a cozy Turkish place for Sunday brunch' or 'Authentic Caribbean grocery store'"
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

                {searchResult.reasoning && <p className="text-sm text-purple-700 mb-3">{searchResult.reasoning}</p>}

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
                  {searchResult.intent.timeContext && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {searchResult.intent.timeContext}
                    </Badge>
                  )}
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
            "Authentic Caribbean grocery store",
            "Upscale Lebanese restaurant for date night",
            "Family-friendly Polish restaurant",
            "Halal Middle Eastern food near me",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              &quot;{example}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
