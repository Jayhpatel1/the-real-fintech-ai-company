import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../../services/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

interface Booking {
  id: string;
  serviceType: string;
  serviceProviderId: string;
  customerId: string;
  propertyId?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData: Partial<Booking>) => {
    const docRef = await addDoc(collection(firestore, 'bookings'), {
      ...bookingData,
      createdAt: new Date(),
      status: 'pending',
    });
    
    return { id: docRef.id, ...bookingData } as Booking;
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId: string) => {
    const q = query(
      collection(firestore, 'bookings'),
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;