"use client"

import { useState, useMemo } from "react"
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Scissors,
  Heart,
  User,
  LogIn,
  LogOut,
  MessageSquare,
  Filter,
  ChevronDown,
  KeyRound as Pound,
  Map,
  List,
  Camera,
  ThumbsUp,
  Share2,
  BookOpen,
  Users,
  Reply,
  Settings,
  Brain,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AISearch } from "@/components/ai-search"
import { useAISearch } from "@/hooks/useAISearch"

// Types
interface UserType {
  id: string
  name: string
  email: string
  joinDate: string
  avatar?: string
}

interface Review {
  id: string
  userId: string
  businessId: number
  userName: string
  rating: number
  comment: string
  date: string
  photos?: string[]
  likes: number
  likedBy: string[]
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
  openTime: string
  closeTime: string
  latitude: number
  longitude: number
  reviews?: Review[]
  photos?: string[]
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  likes: number
  comments: number
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  date: string
  category: string
  replies: ForumReply[]
  likes: number
  likedBy: string[]
}

interface ForumReply {
  id: string
  content: string
  author: string
  authorId: string
  date: string
  likes: number
  likedBy: string[]
}

interface Recommendation {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  businessId: number
  businessName: string
  message: string
  date: string
}

// Sample data
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
    description: "Authentic Ghanaian cuisine in the heart of Hackney",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "12:00",
    closeTime: "22:00",
    latitude: 51.5454,
    longitude: -0.0556,
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 2,
    name: "Afro Caribbean Food Store",
    nationality: "Caribbean",
    category: "Grocery Store",
    address: "Brixton, London SW9",
    phone: "+44 20 7733 5678",
    rating: 4.5,
    hours: "08:00 - 20:00",
    description: "Wide selection of Caribbean ingredients and spices",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "08:00",
    closeTime: "20:00",
    latitude: 51.4613,
    longitude: -0.1157,
  },
  {
    id: 3,
    name: "Pierogi Palace",
    nationality: "Eastern European",
    category: "Restaurant",
    cuisine: "Polish",
    address: "Ealing, London W5",
    phone: "+44 20 8567 1234",
    rating: 4.6,
    hours: "12:00 - 21:00",
    description: "Traditional Polish pierogi and hearty comfort food",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "12:00",
    closeTime: "21:00",
    latitude: 51.513,
    longitude: -0.3089,
  },
  {
    id: 4,
    name: "Turkish Barber Deluxe",
    nationality: "Turkish",
    category: "Salon & Barber",
    services: "Hot towel shaves, beard styling, hair cuts",
    address: "Green Lanes, London N4",
    phone: "+44 20 8802 3456",
    rating: 4.8,
    hours: "08:00 - 20:00",
    description: "Traditional Turkish barbering with hot towel shaves and beard styling",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 1,
    openTime: "08:00",
    closeTime: "20:00",
    latitude: 51.5738,
    longitude: -0.1028,
  },
  {
    id: 5,
    name: "The Dubliner",
    nationality: "Irish",
    category: "Restaurant",
    cuisine: "Irish",
    address: "Temple Bar, London WC2",
    phone: "+44 20 7405 8765",
    rating: 4.5,
    hours: "11:00 - 23:00",
    description: "Traditional Irish pub with authentic fish & chips, shepherd's pie, and Guinness",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "11:00",
    closeTime: "23:00",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: 6,
    name: "Golden Dragon",
    nationality: "Asian",
    category: "Restaurant",
    cuisine: "Chinese",
    address: "Chinatown, London W1",
    phone: "+44 20 7437 5678",
    rating: 4.7,
    hours: "11:30 - 23:00",
    description: "Authentic Cantonese cuisine with dim sum and Peking duck",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 3,
    openTime: "11:30",
    closeTime: "23:00",
    latitude: 51.5118,
    longitude: -0.1319,
  },
  {
    id: 33,
    name: "Casa Madeira",
    nationality: "Latino",
    category: "Restaurant",
    cuisine: "Brazilian",
    address: "Stockwell, London SW9",
    phone: "+44 20 737 1234",
    rating: 4.6,
    hours: "12:00 - 23:00",
    description: "Authentic Brazilian steakhouse with traditional churrasco and caipirinhas",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 3,
    openTime: "12:00",
    closeTime: "23:00",
    latitude: 51.4722,
    longitude: -0.1225,
  },
  {
    id: 34,
    name: "El Corazón",
    nationality: "Latino",
    category: "Restaurant",
    cuisine: "Mexican",
    address: "Camden, London NW1",
    phone: "+44 20 7267 8901",
    rating: 4.4,
    hours: "17:00 - 24:00",
    description: "Vibrant Mexican cantina with authentic tacos, mezcal, and live mariachi",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "17:00",
    closeTime: "24:00",
    latitude: 51.5392,
    longitude: -0.1426,
  },
  {
    id: 40,
    name: "Maroush",
    nationality: "Middle Eastern",
    category: "Restaurant",
    cuisine: "Lebanese",
    address: "Edgware Road, London W2",
    phone: "+44 20 7723 0773",
    rating: 4.5,
    hours: "12:00 - 02:00",
    description: "Legendary Lebanese restaurant with authentic mezze, grills, and late-night dining",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 3,
    openTime: "12:00",
    closeTime: "02:00",
    latitude: 51.5159,
    longitude: -0.1625,
  },
  {
    id: 41,
    name: "Persepolis",
    nationality: "Middle Eastern",
    category: "Restaurant",
    cuisine: "Persian",
    address: "Peckham, London SE15",
    phone: "+44 20 7639 8007",
    rating: 4.7,
    hours: "17:30 - 23:00",
    description: "Intimate Persian restaurant with traditional stews, saffron rice, and pomegranate dishes",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "17:30",
    closeTime: "23:00",
    latitude: 51.4741,
    longitude: -0.0693,
  },
  {
    id: 42,
    name: "Sakura Sushi",
    nationality: "Asian",
    category: "Restaurant",
    cuisine: "Japanese",
    address: "Fitzrovia, London W1",
    phone: "+44 20 7636 9876",
    rating: 4.8,
    hours: "17:00 - 22:30",
    description: "Fresh sushi and traditional Japanese dishes in elegant setting",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 4,
    openTime: "17:00",
    closeTime: "22:30",
    latitude: 51.5205,
    longitude: -0.137,
  },
  {
    id: 43,
    name: "Afro Roots Hair Studio",
    nationality: "African",
    category: "Salon & Barber",
    services: "Natural hair care, braids, locs",
    address: "Tottenham, London N17",
    phone: "+44 20 8808 1234",
    rating: 4.9,
    hours: "09:00 - 19:00",
    description: "Specialist in natural African hair care, braiding, and protective styles",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "09:00",
    closeTime: "19:00",
    latitude: 51.5918,
    longitude: -0.0648,
  },
  {
    id: 44,
    name: "Reggae Reggae Grocery",
    nationality: "Caribbean",
    category: "Grocery Store",
    address: "Brixton, London SW9",
    phone: "+44 20 7274 5678",
    rating: 4.3,
    hours: "08:00 - 21:00",
    description: "Caribbean spices, plantains, scotch bonnet peppers, and island favorites",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "08:00",
    closeTime: "21:00",
    latitude: 51.4613,
    longitude: -0.1157,
  },
  {
    id: 45,
    name: "Eastern European Deli & Bakery",
    nationality: "Eastern European",
    category: "Grocery Store",
    address: "Hammersmith, London W6",
    phone: "+44 20 8741 2345",
    rating: 4.4,
    hours: "07:00 - 19:00",
    description: "Fresh Eastern European bread, kielbasa, Romanian pastries, and imported goods from across the region",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "07:00",
    closeTime: "19:00",
    latitude: 51.4927,
    longitude: -0.2339,
  },
  {
    id: 46,
    name: "Bucharest Bistro",
    nationality: "Eastern European",
    category: "Restaurant",
    cuisine: "Romanian",
    address: "North London, N1",
    phone: "+44 20 7359 8888",
    rating: 4.5,
    hours: "17:00 - 23:00",
    description: "Authentic Romanian cuisine with mici, sarmale, and traditional wines",
    image: "/placeholder.svg?height=200&width=300",
    priceRange: 2,
    openTime: "17:00",
    closeTime: "23:00",
    latitude: 51.5454,
    longitude: -0.1057,
  },
]

const sampleReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    businessId: 1,
    userName: "Sarah M.",
    rating: 5,
    comment:
      "Amazing jollof rice and plantain! The atmosphere is so welcoming and the staff are incredibly friendly. This place feels like home.",
    date: "2024-01-15",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    likes: 12,
    likedBy: ["user2", "user3"],
  },
  {
    id: "2",
    userId: "user2",
    businessId: 33,
    userName: "Carlos R.",
    rating: 4,
    comment:
      "The picanha was perfectly cooked and the caipirinhas were authentic. Great Brazilian experience in London!",
    date: "2024-01-10",
    photos: ["/placeholder.svg?height=200&width=300"],
    likes: 8,
    likedBy: ["user1"],
  },
]

const blogPosts: BlogPost[] = [
  {
    id: "blog1",
    title: "The Hidden Gems of Little Brazil in Stockwell",
    excerpt:
      "Discover the vibrant Brazilian community in South London and the authentic restaurants that make it special.",
    content: "Stockwell has become the heart of London's Brazilian community...",
    author: "Maria Santos",
    date: "2024-01-20",
    category: "Latino",
    image: "/placeholder.svg?height=200&width=400",
    likes: 45,
    comments: 12,
  },
  {
    id: "blog2",
    title: "A Guide to Middle Eastern Spices: From Sumac to Za'atar",
    excerpt:
      "Learn about the essential spices that make Middle Eastern cuisine so flavorful and where to find them in London.",
    content: "Middle Eastern cuisine is renowned for its complex flavors...",
    author: "Ahmed Hassan",
    date: "2024-01-18",
    category: "Middle Eastern",
    image: "/placeholder.svg?height=200&width=400",
    likes: 38,
    comments: 8,
  },
  {
    id: "blog3",
    title: "The Art of African Hair Braiding: Tradition Meets Modern Style",
    excerpt:
      "Explore the rich cultural heritage behind African hair braiding and the talented stylists preserving these traditions.",
    content: "African hair braiding is more than just a hairstyle...",
    author: "Kemi Adebayo",
    date: "2024-01-16",
    category: "African",
    image: "/placeholder.svg?height=200&width=400",
    likes: 52,
    comments: 15,
  },
]

const forumPosts: ForumPost[] = [
  {
    id: "forum1",
    title: "Best places for authentic Caribbean curry goat?",
    content:
      "I'm looking for recommendations for the best Caribbean curry goat in London. My grandmother used to make it, and I'm trying to find something that reminds me of home.",
    author: "Jamaica_Lover",
    authorId: "user1",
    date: "2024-01-22",
    category: "Caribbean",
    likes: 5,
    likedBy: ["user2"],
    replies: [
      {
        id: "reply1",
        content: "Try Negril in Brixton! Their curry goat is incredible and the rice and peas are perfect.",
        author: "BrixtonLocal",
        authorId: "user2",
        date: "2024-01-22",
        likes: 3,
        likedBy: ["user1"],
      },
    ],
  },
  {
    id: "forum2",
    title: "Turkish barber recommendations in North London?",
    content:
      "Moving to North London and looking for a good Turkish barber. Need someone who's great with beard styling and hot towel shaves.",
    author: "BeardGuy",
    authorId: "user3",
    date: "2024-01-21",
    category: "Turkish",
    likes: 8,
    likedBy: ["user1", "user2"],
    replies: [
      {
        id: "reply2",
        content: "Turkish Barber Deluxe on Green Lanes is fantastic! Been going there for years.",
        author: "LocalResident",
        authorId: "user4",
        date: "2024-01-21",
        likes: 6,
        likedBy: ["user3"],
      },
    ],
  },
]

const nationalities = [
  "All",
  "African",
  "Caribbean",
  "Eastern European",
  "Turkish",
  "Irish",
  "Asian",
  "Latino",
  "Middle Eastern",
]
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
}

const categoryIcons = {
  Restaurant: "🍽️",
  "Grocery Store": "🛒",
  "Salon & Barber": "✂️",
}

// Helper functions
const getPriceRangeDisplay = (priceRange: number) => {
  return "£".repeat(priceRange)
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const isOpenAtTime = (business: Business, time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  const timeInMinutes = hours * 60 + minutes

  const [openHours, openMinutes] = business.openTime.split(":").map(Number)
  const openInMinutes = openHours * 60 + openMinutes

  const [closeHours, closeMinutes] = business.closeTime.split(":").map(Number)
  const closeInMinutes = closeHours * 60 + closeMinutes

  return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes
}

export default function WeDoNotKeepSecrets() {
  // User state
  const [user, setUser] = useState<UserType | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  // Main navigation state
  const [currentPage, setCurrentPage] = useState<"directory" | "blog" | "forum">("directory")

  // View state
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedMapBusiness, setSelectedMapBusiness] = useState<Business | null>(null)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNationality, setSelectedNationality] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // AI Search state
  const [aiQuery, setAiQuery] = useState("")
  const [aiIntent, setAiIntent] = useState<any>({})
  const [showAIResults, setShowAIResults] = useState(false)

  // Advanced filters
  const [priceRange, setPriceRange] = useState<number[]>([1, 4])
  const [openNow, setOpenNow] = useState(false)
  const [customTime, setCustomTime] = useState("")
  const [maxDistance, setMaxDistance] = useState<number[]>([10])
  const [userLocation] = useState({ lat: 51.5074, lng: -0.1278 })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Dialog states
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showRecommendDialog, setShowRecommendDialog] = useState(false)
  const [showForumPostDialog, setShowForumPostDialog] = useState(false)
  const [selectedBusinessForReview, setSelectedBusinessForReview] = useState<number | null>(null)
  const [selectedBusinessForRecommend, setSelectedBusinessForRecommend] = useState<Business | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  // Form states
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" })
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", photos: [] as string[] })
  const [recommendForm, setRecommendForm] = useState({ toUser: "", message: "" })
  const [forumPostForm, setForumPostForm] = useState({ title: "", content: "", category: "General" })

  // Community state
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)
  const [selectedForumPost, setSelectedForumPost] = useState<ForumPost | null>(null)
  const [forumReplyForm, setForumReplyForm] = useState({ content: "" })

  // Auth functions
  const handleLogin = () => {
    const newUser: UserType = {
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
    setShowProfile(false)
  }

  // Favorites functions
  const toggleFavorite = (businessId: number) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setFavorites((prev) => (prev.includes(businessId) ? prev.filter((id) => id !== businessId) : [...prev, businessId]))
  }

  // Review functions
  const handleSubmitReview = () => {
    if (!user || !selectedBusinessForReview) return

    const newReview: Review = {
      id: "review_" + Date.now(),
      userId: user.id,
      businessId: selectedBusinessForReview,
      userName: user.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split("T")[0],
      photos: reviewForm.photos,
      likes: 0,
      likedBy: [],
    }

    setReviews((prev) => [...prev, newReview])
    setShowReviewDialog(false)
    setSelectedBusinessForReview(null)
    setReviewForm({ rating: 5, comment: "", photos: [] })
  }

  const openReviewDialog = (businessId: number) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setSelectedBusinessForReview(businessId)
    setShowReviewDialog(true)
  }

  // Photo upload simulation
  const handlePhotoUpload = () => {
    const newPhoto = `/placeholder.svg?height=200&width=300&text=User Photo ${reviewForm.photos.length + 1}`
    setReviewForm((prev) => ({ ...prev, photos: [...prev.photos, newPhoto] }))
  }

  // Like functions
  const toggleReviewLike = (reviewId: string) => {
    if (!user) return

    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          const isLiked = review.likedBy.includes(user.id)
          return {
            ...review,
            likes: isLiked ? review.likes - 1 : review.likes + 1,
            likedBy: isLiked ? review.likedBy.filter((id) => id !== user.id) : [...review.likedBy, user.id],
          }
        }
        return review
      }),
    )
  }

  // Recommendation functions
  const handleSubmitRecommendation = () => {
    if (!user || !selectedBusinessForRecommend) return

    const newRecommendation: Recommendation = {
      id: "rec_" + Date.now(),
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: "friend_user", // In real app, this would be selected
      businessId: selectedBusinessForRecommend.id,
      businessName: selectedBusinessForRecommend.name,
      message: recommendForm.message,
      date: new Date().toISOString().split("T")[0],
    }

    setRecommendations((prev) => [...prev, newRecommendation])
    setShowRecommendDialog(false)
    setSelectedBusinessForRecommend(null)
    setRecommendForm({ toUser: "", message: "" })
  }

  // Forum functions
  const handleSubmitForumPost = () => {
    if (!user) return

    const newPost: ForumPost = {
      id: "forum_" + Date.now(),
      title: forumPostForm.title,
      content: forumPostForm.content,
      author: user.name,
      authorId: user.id,
      date: new Date().toISOString().split("T")[0],
      category: forumPostForm.category,
      replies: [],
      likes: 0,
      likedBy: [],
    }

    // In real app, this would update the forum posts
    setShowForumPostDialog(false)
    setForumPostForm({ title: "", content: "", category: "General" })
  }

  // Get reviews for a business
  const getBusinessReviews = (businessId: number) => {
    return reviews.filter((review) => review.businessId === businessId)
  }

  // Calculate average rating including user reviews
  const getBusinessRating = (business: Business) => {
    const businessReviews = getBusinessReviews(business.id)
    if (businessReviews.length === 0) return business.rating

    const totalRating = businessReviews.reduce((sum, review) => sum + review.rating, 0)
    const avgUserRating = totalRating / businessReviews.length

    return (business.rating * 10 + avgUserRating * businessReviews.length) / (10 + businessReviews.length)
  }

  // Get current time for "open now" filter
  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      // Text search
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (business.services && business.services.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (business.cuisine && business.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))

      // Basic filters
      const matchesNationality = selectedNationality === "All" || business.nationality === selectedNationality
      const matchesCategory = selectedCategory === "All" || business.category === selectedCategory

      // Price range filter
      const matchesPriceRange = business.priceRange >= priceRange[0] && business.priceRange <= priceRange[1]

      // Opening hours filter
      let matchesOpeningHours = true
      if (openNow) {
        matchesOpeningHours = isOpenAtTime(business, getCurrentTime())
      } else if (customTime) {
        matchesOpeningHours = isOpenAtTime(business, customTime)
      }

      // Distance filter
      const distance = calculateDistance(userLocation.lat, userLocation.lng, business.latitude, business.longitude)
      const matchesDistance = distance <= maxDistance[0]

      return (
        matchesSearch &&
        matchesNationality &&
        matchesCategory &&
        matchesPriceRange &&
        matchesOpeningHours &&
        matchesDistance
      )
    })
  }, [searchTerm, selectedNationality, selectedCategory, priceRange, openNow, customTime, maxDistance, userLocation])

  // AI-powered search results
  const aiSearchResults = useAISearch(businesses, aiQuery, aiIntent)

  const handleAISearch = (query: string, intent: any) => {
    setAiQuery(query)
    setAiIntent(intent)
    setShowAIResults(true)
    // Reset traditional filters when using AI search
    setSearchTerm("")
    setSelectedNationality("All")
    setSelectedCategory("All")
  }

  const favoriteBusinesses = businesses.filter((business) => favorites.includes(business.id))
  const userReviews = reviews.filter((review) => review.userId === user?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">We Don&apos;t Keep Secrets</h1>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => setShowProfile(true)}>
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                  {/* Demo Admin Access */}
                  <Button variant="outline" asChild>
                    <a href="/admin" target="_blank" rel="noreferrer">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setShowAuth(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login / Sign Up
                  </Button>
                  {/* Demo Admin Access (even when not logged in for demo purposes) */}
                  <Button variant="outline" asChild>
                    <a href="/admin" target="_blank" rel="noreferrer">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={currentPage === "directory" ? "default" : "outline"}
                onClick={() => setCurrentPage("directory")}
              >
                <Search className="h-4 w-4 mr-2" />
                Directory
              </Button>
              <Button variant={currentPage === "blog" ? "default" : "outline"} onClick={() => setCurrentPage("blog")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Cultural Blog
              </Button>
              <Button variant={currentPage === "forum" ? "default" : "outline"} onClick={() => setCurrentPage("forum")}>
                <Users className="h-4 w-4 mr-2" />
                Community Forum
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              London&apos;s most trusted cultural community. Share experiences, discover hidden gems, and connect with
              diverse communities across London
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Directory Page */}
        {currentPage === "directory" && (
          <>
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
                {/* Main Search and Basic Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search for restaurants, grocery stores, salons, cuisines, or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="h-12"
                      >
                        {categoryIcons[category as keyof typeof categoryIcons]} {category}
                      </Button>
                    ))}
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      onClick={() => setViewMode("list")}
                      className="h-12"
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      onClick={() => setViewMode("map")}
                      className="h-12"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Map
                    </Button>
                  </div>
                </div>

                {/* Nationality Filter - NOW SHOWS ALL */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {nationalities.map((nationality) => (
                    <Button
                      key={nationality}
                      variant={selectedNationality === nationality ? "default" : "outline"}
                      onClick={() => setSelectedNationality(nationality)}
                      className="h-12"
                    >
                      {nationality}
                    </Button>
                  ))}
                </div>

                {/* Advanced Filters Toggle */}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent mt-4">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Price Range Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Pound className="h-4 w-4" />
                          Price Range
                        </Label>
                        <div className="px-3">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={4}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{getPriceRangeDisplay(priceRange[0])}</span>
                            <span>{getPriceRangeDisplay(priceRange[1])}</span>
                          </div>
                        </div>
                      </div>

                      {/* Opening Hours Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Opening Hours
                        </Label>
                        <div className="space-y-2">
                          <Button
                            variant={openNow ? "default" : "outline"}
                            onClick={() => {
                              setOpenNow(!openNow)
                              if (!openNow) setCustomTime("")
                            }}
                            className="w-full"
                          >
                            Open Now
                          </Button>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">or open at:</span>
                            <Input
                              type="time"
                              value={customTime}
                              onChange={(e) => {
                                setCustomTime(e.target.value)
                                if (e.target.value) setOpenNow(false)
                              }}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Distance Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Distance from Central London
                        </Label>
                        <div className="px-3">
                          <Slider
                            value={maxDistance}
                            onValueChange={setMaxDistance}
                            max={20}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>1 km</span>
                            <span className="font-medium">{maxDistance[0]} km</span>
                            <span>20 km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* Business Cards Grid */}
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
                const businessReviews = getBusinessReviews(business.id)
                const avgRating = getBusinessRating(business)
                const isFavorited = favorites.includes(business.id)
                const distance = calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  business.latitude,
                  business.longitude,
                )
                const isCurrentlyOpen = isOpenAtTime(business, getCurrentTime())

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
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={nationalityColors[business.nationality as keyof typeof nationalityColors]}>
                          {business.nationality}
                        </Badge>
                        <Badge variant={isCurrentlyOpen ? "default" : "secondary"}>
                          {isCurrentlyOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge variant="secondary">
                          {business.category === "Salon & Barber" && <Scissors className="h-3 w-3 mr-1" />}
                          {business.category}
                        </Badge>
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
                          <div className="text-xs text-gray-500">{distance.toFixed(1)}km away</div>
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
                          <span className="font-medium">{avgRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">
                            ({businessReviews.length} review{businessReviews.length !== 1 ? "s" : ""})
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openReviewDialog(business.id)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBusinessForRecommend(business)
                              setShowRecommendDialog(true)
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>

                      {/* User Photos */}
                      {business.photos && business.photos.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Community Photos:</p>
                          <div className="flex gap-2 overflow-x-auto">
                            {business.photos.slice(0, 3).map((photo, index) => (
                              <img
                                key={index}
                                src={photo || "/placeholder.svg"}
                                alt={`${business.name} photo ${index + 1}`}
                                className="w-16 h-16 rounded object-cover flex-shrink-0"
                              />
                            ))}
                            {business.photos.length > 3 && (
                              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                +{business.photos.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Recent Reviews with Photos */}
                      {businessReviews.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Recent Review:</p>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {businessReviews[0].userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{businessReviews[0].userName}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < businessReviews[0].rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{businessReviews[0].comment}</p>
                            {businessReviews[0].photos && businessReviews[0].photos.length > 0 && (
                              <div className="flex gap-2">
                                {businessReviews[0].photos.slice(0, 2).map((photo, index) => (
                                  <img
                                    key={index}
                                    src={photo || "/placeholder.svg"}
                                    alt={`Review photo ${index + 1}`}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleReviewLike(businessReviews[0].id)}
                                className="h-6 px-2"
                              >
                                <ThumbsUp
                                  className={`h-3 w-3 mr-1 ${
                                    user && businessReviews[0].likedBy.includes(user.id)
                                      ? "fill-blue-500 text-blue-500"
                                      : "text-gray-500"
                                  }`}
                                />
                                {businessReviews[0].likes}
                              </Button>
                              <span className="text-xs text-gray-500">{businessReviews[0].date}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button className="w-full mt-4">View Details</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {/* Blog Page */}
        {currentPage === "blog" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cultural Stories & Insights</h2>
              <p className="text-lg text-gray-600">
                Discover the rich stories behind London&apos;s diverse communities and their cultural traditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={nationalityColors[post.category as keyof typeof nationalityColors]}>
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setSelectedBlogPost(post)}>
                        Read More
                      </Button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">By {post.author}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Forum Page */}
        {currentPage === "forum" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Forum</h2>
                <p className="text-lg text-gray-600">
                  Connect with fellow food lovers and cultural enthusiasts across London
                </p>
              </div>
              <Button onClick={() => setShowForumPostDialog(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={nationalityColors[post.category as keyof typeof nationalityColors]}>
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{post.date}</span>
                        </div>
                        <CardTitle className="text-xl cursor-pointer" onClick={() => setSelectedForumPost(post)}>
                          {post.title}
                        </CardTitle>
                        <p className="text-gray-600 mt-2">{post.content}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Reply className="h-4 w-4" />
                          <span className="text-sm">{post.replies.length} replies</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">By {post.author}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Dialog with Photo Upload */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>
            <div>
              <Label>Photos</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={handlePhotoUpload}>
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                {reviewForm.photos.length > 0 && (
                  <div className="flex gap-2">
                    {reviewForm.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleSubmitReview} className="w-full">
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recommendation Dialog */}
      <Dialog open={showRecommendDialog} onOpenChange={setShowRecommendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recommend to a Friend</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="toUser">Friend&apos;s Email</Label>
              <Input
                id="toUser"
                value={recommendForm.toUser}
                onChange={(e) => setRecommendForm((prev) => ({ ...prev, toUser: e.target.value }))}
                placeholder="friend@example.com"
              />
            </div>
            <div>
              <Label htmlFor="message">Personal Message</Label>
              <Textarea
                id="message"
                value={recommendForm.message}
                onChange={(e) => setRecommendForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Tell them why you recommend this place..."
                rows={3}
              />
            </div>
            <Button onClick={handleSubmitRecommendation} className="w-full">
              Send Recommendation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forum Post Dialog */}
      <Dialog open={showForumPostDialog} onOpenChange={setShowForumPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Forum Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={forumPostForm.title}
                onChange={(e) => setForumPostForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="What&apos;s your question or topic?"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={forumPostForm.category}
                onChange={(e) => setForumPostForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="General">General</option>
                {nationalities.slice(1).map((nationality) => (
                  <option key={nationality} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={forumPostForm.content}
                onChange={(e) => setForumPostForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={5}
              />
            </div>
            <Button onClick={handleSubmitForumPost} className="w-full">
              Create Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* User Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
          </DialogHeader>
          {user && (
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews ({userReviews.length})</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="favorites" className="space-y-4">
                <div className="text-center py-4">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">Member since {user.joinDate}</p>
                </div>

                {favoriteBusinesses.length > 0 ? (
                  <div className="space-y-3">
                    {favoriteBusinesses.map((business) => (
                      <div key={business.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img
                          src={business.image || "/placeholder.svg"}
                          alt={business.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{business.name}</h4>
                          <p className="text-sm text-gray-600">{business.address}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={nationalityColors[business.nationality as keyof typeof nationalityColors]}>
                            {business.nationality}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{getPriceRangeDisplay(business.priceRange)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No favorites yet. Start exploring!</p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.map((review) => {
                      const business = businesses.find((b) => b.id === review.businessId)
                      return (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{business?.name}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-2 mb-2">
                              {review.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo || "/placeholder.svg"}
                                  alt={`Review photo ${index + 1}`}
                                  className="w-16 h-16 rounded object-cover"
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{review.likes}</span>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Share your experiences!</p>
                )}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Recommended {rec.businessName}</h4>
                          <span className="text-sm text-gray-500">{rec.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{rec.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No recommendations sent yet.</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 We Don&apos;t Keep Secrets. Building London&apos;s most vibrant cultural community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
