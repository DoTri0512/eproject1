import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionApi from './collectionApi';

export const fetchCollections = createAsyncThunk(
  'collection/fetchCollections',
  async (params, { rejectWithValue }) => {
    try {
      const data = await collectionApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCollectionDetail = createAsyncThunk(
  'collection/fetchCollectionDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const data = await collectionApi.getByIdOrSlug(idOrSlug);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    items: [],
    currentCollection: null,
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
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
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
      .addCase(fetchCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCollectionDetail.fulfilled, (state, action) => {
        state.currentCollection = action.payload;
      });
  },
});

export const { clearCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
