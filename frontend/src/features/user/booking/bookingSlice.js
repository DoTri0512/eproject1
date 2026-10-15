import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from './bookingApi';

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (params, { rejectWithValue }) => {
    try {
      const data = await bookingApi.getMyBookings(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const data = await bookingApi.create(bookingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const data = await bookingApi.cancel(id, reason);
      return { id, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    myBookings: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    currentBooking: null,
    isSubmitting: false,
    isLoading: false,
    error: null,
    successBooking: null,
  },
  reducers: {
    clearSuccessBooking: (state) => {
      state.successBooking = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyBookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.myBookings = action.payload;
        } else if (action.payload?.items) {
          state.myBookings = action.payload.items;
          state.pagination = {
            page: action.payload.page || 1,
            limit: action.payload.limit || 10,
            total: action.payload.totalItems || action.payload.total || action.payload.items.length,
            totalPages: action.payload.totalPages || 1,
          };
        } else {
          state.myBookings = [];
        }
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successBooking = action.payload;
        state.myBookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // cancelBooking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.myBookings.findIndex((b) => b._id === action.payload.id);
        if (index !== -1) {
          state.myBookings[index].bookingStatus = 'cancelled';
        }
      });
  },
});

export const { clearSuccessBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
