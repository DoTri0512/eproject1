import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from './dashboardApi';

export const fetchAdminDashboardStats = createAsyncThunk(
  'dashboard/fetchAdminDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      kpi: {
        totalUsers: 0,
        totalCustomers: 0,
        totalDestinations: 0,
        totalTours: 0,
        totalGuides: 0,
        totalBookings: 0,
        totalRevenue: 0,
      },
      bookingsBreakdown: {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      },
      recentBookings: [],
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
