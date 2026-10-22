import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import destinationApi from './destinationApi';

export const fetchDestinations = createAsyncThunk(
  'destination/fetchDestinations',
  async (params, { rejectWithValue }) => {
    try {
      const data = await destinationApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDestinationDetail = createAsyncThunk(
  'destination/fetchDestinationDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const data = await destinationApi.getByIdOrSlug(idOrSlug);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDestination = createAsyncThunk(
  'destination/createDestination',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await destinationApi.create(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDestination = createAsyncThunk(
  'destination/updateDestination',
  async ({ id, data: formData }, { rejectWithValue }) => {
    try {
      const data = await destinationApi.update(id, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDestination = createAsyncThunk(
  'destination/deleteDestination',
  async (id, { rejectWithValue }) => {
    try {
      const data = await destinationApi.delete(id);
      return { id, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const destinationSlice = createSlice({
  name: 'destination',
  initialState: {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    currentDestination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentDestination: (state) => {
      state.currentDestination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchDestinations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.isLoading = false;
        // Backend returns items or { items, totalItems, ... }
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
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Detail
      .addCase(fetchDestinationDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDestinationDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDestination = action.payload;
      })
      .addCase(fetchDestinationDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDestination } = destinationSlice.actions;
export default destinationSlice.reducer;
