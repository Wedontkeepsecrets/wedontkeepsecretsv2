"use client"

import { useMemo } from "react"

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
  business: Business
  relevanceScore: number
  matchReasons: string[]
}

export function useAISearch(businesses: Business[], query: string, intent: SearchIntent) {
  return useMemo(() => {
    if (!query && !Object.keys(intent).length) {
      return businesses.map((business) => ({
        business,
        relevanceScore: 0.5,
        matchReasons: [],
      }))
    }

    const results: AISearchResult[] = businesses.map((business) => {
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
  }, [businesses, query, intent])
}