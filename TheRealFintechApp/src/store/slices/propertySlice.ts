import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestore } from '../../services/firebase';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images: string[];
  userId: string;
  createdAt: any;
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  favorites: Property[];
  searchResults: Property[];
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    bedrooms?: number;
  };
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  favorites: [],
  searchResults: [],
  isLoading: false,
  error: null,
  filters: {},
};

export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (filters: any = {}) => {
    let q = query(collection(firestore, 'properties'), orderBy('createdAt', 'desc'), limit(20));
    
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.city) {
      q = query(q, where('city', '==', filters.city));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (propertyId: string) => {
    const docRef = doc(firestore, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    throw new Error('Property not found');
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<Property>) => {
      const exists = state.favorites.find(p => p.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.selectedProperty = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setSelectedProperty, addToFavorites, removeFromFavorites } = propertySlice.actions;
export default propertySlice.reducer;