import React, { createContext, useContext, useReducer, useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, MapPin, Camera, Heart, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

// Context for state management
const PhotographerContext = createContext();

// Reducer for photographer state
const photographerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PHOTOGRAPHERS':
      return { ...state, photographers: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_PHOTOGRAPHER':
      return { ...state, selectedPhotographer: action.payload };
    default:
      return state;
  }
};

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Mock data
const mockData = {
  photographers: [
    {
      id: 1,
      name: "Ravi Studio",
      location: "Bengaluru",
      price: 10000,
      rating: 4.6,
      styles: ["Outdoor", "Studio"],
      tags: ["Candid", "Maternity"],
      bio: "Award-winning studio specializing in maternity and newborn shoots.",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      portfolio: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
      ],
      reviews: [
        {
          name: "Ananya",
          rating: 5,
          comment: "Truly amazing photos and experience!",
          date: "2024-12-15"
        }
      ]
    },
    {
      id: 2,
      name: "Lens Queen Photography",
      location: "Delhi",
      price: 15000,
      rating: 4.2,
      styles: ["Candid", "Indoor"],
      tags: ["Newborn", "Birthday"],
      bio: "Delhi-based candid specialist for kids and birthday parties.",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      portfolio: [
        "https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
      ],
      reviews: [
        {
          name: "Priya",
          rating: 4,
          comment: "Very professional and punctual!",
          date: "2024-10-01"
        }
      ]
    },
    {
      id: 3,
      name: "Click Factory",
      location: "Mumbai",
      price: 8000,
      rating: 4.8,
      styles: ["Studio", "Outdoor", "Traditional"],
      tags: ["Wedding", "Pre-wedding"],
      bio: "Capturing timeless wedding stories across India.",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      portfolio: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop"
      ],
      reviews: [
        {
          name: "Rahul",
          rating: 5,
          comment: "We loved every single moment they captured.",
          date: "2025-01-22"
        }
      ]
    },
    {
      id: 4,
      name: "Moments by Neha",
      location: "Bengaluru",
      price: 12000,
      rating: 4.3,
      styles: ["Outdoor", "Candid"],
      tags: ["Maternity", "Couple"],
      bio: "Natural light specialist focusing on emotional storytelling.",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      portfolio: [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597586124394-fbd6ef244026?w=400&h=300&fit=crop"
      ],
      reviews: [
        {
          name: "Sneha",
          rating: 4.5,
          comment: "Captured our maternity journey so beautifully.",
          date: "2024-11-05"
        }
      ]
    },
    {
      id: 5,
      name: "Snapshot Studio",
      location: "Hyderabad",
      price: 7000,
      rating: 3.9,
      styles: ["Studio"],
      tags: ["Birthday", "Family"],
      bio: "Affordable indoor shoots with creative themes.",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      portfolio: [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
      ],
      reviews: [
        {
          name: "Vikram",
          rating: 3.5,
          comment: "Decent service, could improve on punctuality.",
          date: "2024-09-10"
        }
      ]
    }
  ]
};

// Search Bar Component
const SearchBar = () => {
  const { state, dispatch } = useContext(PhotographerContext);
  const [localSearch, setLocalSearch] = useState(state.searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH', payload: debouncedSearch });
  }, [debouncedSearch, dispatch]);

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search photographers by name, location, or tags..."
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
};

// Filters Component
const Filters = () => {
  const { state, dispatch } = useContext(PhotographerContext);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key, value) => {
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });
  };

  const cities = [...new Set(state.photographers.map(p => p.location))];
  const styles = [...new Set(state.photographers.flatMap(p => p.styles))];

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-lg shadow-md space-y-6`}>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (₹{state.filters.priceRange[0].toLocaleString()} - ₹{state.filters.priceRange[1].toLocaleString()})
          </label>
          <input
            type="range"
            min="5000"
            max="20000"
            step="1000"
            value={state.filters.priceRange[1]}
            onChange={(e) => updateFilter('priceRange', [5000, parseInt(e.target.value)])}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
          <select
            value={state.filters.minRating}
            onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={state.filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Styles Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photography Styles</label>
          <div className="space-y-2">
            {styles.map(style => (
              <label key={style} className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.filters.styles.includes(style)}
                  onChange={(e) => {
                    const newStyles = e.target.checked
                      ? [...state.filters.styles, style]
                      : state.filters.styles.filter(s => s !== style);
                    updateFilter('styles', newStyles);
                  }}
                  className="mr-2"
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={state.filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="priceLow">Price (Low to High)</option>
            <option value="priceHigh">Price (High to Low)</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Photographer Card Component
const PhotographerCard = ({ photographer }) => {
  const { dispatch } = useContext(PhotographerContext);

  const handleViewProfile = () => {
    dispatch({ type: 'SET_SELECTED_PHOTOGRAPHER', payload: photographer });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={photographer.profilePic}
          alt={photographer.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{photographer.name}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{photographer.location}</span>
        </div>

        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{photographer.rating}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {photographer.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ₹{photographer.price.toLocaleString()}
          </span>
          <button
            onClick={handleViewProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// Photographer Profile Component
const PhotographerProfile = () => {
  const { state, dispatch } = useContext(PhotographerContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  if (!state.selectedPhotographer) return null;

  const photographer = state.selectedPhotographer;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === photographer.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? photographer.portfolio.length - 1 : prev - 1
    );
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SELECTED_PHOTOGRAPHER', payload: null });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Photographer Profile</h1>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={photographer.profilePic}
              alt={photographer.name}
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{photographer.name}</h2>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{photographer.location}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span>{photographer.rating} Rating</span>
              </div>
              <p className="text-gray-600 mb-4">{photographer.bio}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {photographer.styles.map(style => (
                  <span key={style} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-2xl font-bold text-green-600">
                  ₹{photographer.price.toLocaleString()}
                </span>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
          <div className="relative">
            <img
              src={photographer.portfolio[currentImageIndex]}
              alt={`Portfolio ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {photographer.portfolio.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          {photographer.reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.name}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-1">{review.comment}</p>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Inquiry</h3>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your photography needs..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Category Listing Component
const CategoryListing = () => {
  const { state } = useContext(PhotographerContext);

  const filteredPhotographers = useMemo(() => {
    let filtered = state.photographers.filter(photographer => {
      // Search filter
      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase();
        const matchesSearch =
          photographer.name.toLowerCase().includes(searchLower) ||
          photographer.location.toLowerCase().includes(searchLower) ||
          photographer.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Price filter
      if (photographer.price < state.filters.priceRange[0] ||
        photographer.price > state.filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (photographer.rating < state.filters.minRating) {
        return false;
      }

      // City filter
      if (state.filters.city && photographer.location !== state.filters.city) {
        return false;
      }

      // Styles filter
      if (state.filters.styles.length > 0) {
        const hasMatchingStyle = photographer.styles.some(style =>
          state.filters.styles.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      return true;
    });

    // Sorting
    switch (state.filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'recent':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [state.photographers, state.searchTerm, state.filters]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading photographers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Maternity Photographers in Bengaluru
          </h1>
          <p className="text-gray-600">
            Find the perfect photographer for your special moments
          </p>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Smart Suggestion Strip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">AI Suggestion:</span>
            <span className="text-blue-700">
              Top-rated outdoor maternity photographers in Bengaluru starting from ₹8,000
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Filters />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredPhotographers.length} photographer{filteredPhotographers.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredPhotographers.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No photographers found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPhotographers.map(photographer => (
                  <PhotographerCard key={photographer.id} photographer={photographer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const initialState = {
    photographers: [],
    loading: true,
    searchTerm: '',
    selectedPhotographer: null,
    filters: {
      priceRange: [5000, 20000],
      minRating: 0,
      city: '',
      styles: [],
      sortBy: 'rating'
    }
  };

  const [state, dispatch] = useReducer(photographerReducer, initialState);

  // Simulate API call
  useEffect(() => {
    const loadPhotographers = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'SET_PHOTOGRAPHERS', payload: mockData.photographers });
    };

    loadPhotographers();
  }, []);

  return (
    <PhotographerContext.Provider value={{ state, dispatch }}>
      <div className="App">
        {state.selectedPhotographer ? (
          <PhotographerProfile />
        ) : (
          <CategoryListing />
        )}
      </div>
    </PhotographerContext.Provider>
  );
};

export default App;