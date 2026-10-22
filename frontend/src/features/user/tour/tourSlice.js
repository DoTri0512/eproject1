import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tourApi from './tourApi';

export const fetchTours = createAsyncThunk(
  'tour/fetchTours',
  async (params, { rejectWithValue }) => {
    try {
      const data = await tourApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTourDetail = createAsyncThunk(
  'tour/fetchTourDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const data = await tourApi.getByIdOrSlug(idOrSlug);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchToursByDestination = createAsyncThunk(
  'tour/fetchToursByDestination',
  async (destinationId, { rejectWithValue }) => {
    try {
      const data = await tourApi.getByDestination(destinationId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTour = createAsyncThunk(
  'tour/createTour',
  async (tourData, { rejectWithValue }) => {
    try {
      const data = await tourApi.create(tourData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTour = createAsyncThunk(
  'tour/updateTour',
  async ({ id, data: tourData }, { rejectWithValue }) => {
    try {
      const data = await tourApi.update(id, tourData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTour = createAsyncThunk(
  'tour/deleteTour',
  async (id, { rejectWithValue }) => {
    try {
      const data = await tourApi.delete(id);
      return { id, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tourSlice = createSlice({
  name: 'tour',
  initialState: {
    items: [],
    destinationTours: [],
    currentTour: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentTour: (state) => {
      state.currentTour = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTours
      .addCase(fetchTours.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload?.items) {
          state.items = action.payload.items;
          state.pagination = {
            page: action.payload.page || 1,
            limit: action.payload.limit || 10,
            total: action.payload.totalItems || action.payload.total || action.payload.items.length,
            totalPages: action.payload.totalPages || 1,
          };
        } else {
          state.items = [];
        }
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchTourDetail
      .addCase(fetchTourDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTourDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTour = action.payload;
      })
      .addCase(fetchTourDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchToursByDestination
      .addCase(fetchToursByDestination.fulfilled, (state, action) => {
        state.destinationTours = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || [];
      });
  },
});

export const { clearCurrentTour } = tourSlice.actions;
export default tourSlice.reducer;
