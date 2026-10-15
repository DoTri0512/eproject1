import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import guideApi from './guideApi';

export const fetchGuides = createAsyncThunk(
  'guide/fetchGuides',
  async (params, { rejectWithValue }) => {
    try {
      const data = await guideApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGuideDetail = createAsyncThunk(
  'guide/fetchGuideDetail',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const data = await guideApi.getByIdOrSlug(idOrSlug);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const guideSlice = createSlice({
  name: 'guide',
  initialState: {
    items: [],
    currentGuide: null,
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
    clearCurrentGuide: (state) => {
      state.currentGuide = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
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
      .addCase(fetchGuides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGuideDetail.fulfilled, (state, action) => {
        state.currentGuide = action.payload;
      });
  },
});

export const { clearCurrentGuide } = guideSlice.actions;
export default guideSlice.reducer;
