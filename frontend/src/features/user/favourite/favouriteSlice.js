import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favouriteApi from './favouriteApi';

const GUEST_FAV_KEY = 'traveltrail_guest_favourites';

const getGuestFavourites = () => {
  try {
    const raw = localStorage.getItem(GUEST_FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestFavourites = (favs) => {
  try {
    localStorage.setItem(GUEST_FAV_KEY, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save guest favourites:', err);
  }
};

export const fetchFavourites = createAsyncThunk(
  'favourite/fetchFavourites',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return getGuestFavourites();
    }
    try {
      const data = await favouriteApi.getMyFavourites();
      return Array.isArray(data) ? data : data?.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavourite = createAsyncThunk(
  'favourite/toggleFavourite',
  async (destination, { getState, rejectWithValue }) => {
    const { auth, favourite } = getState();
    const destinationId = destination._id || destination.id;
    const isCurrentlyFav = favourite.items.some(
      (item) => (item.destinationId?._id || item._id || item.id) === destinationId
    );

    if (!auth.isAuthenticated) {
      // Guest mode
      let guestList = getGuestFavourites();
      if (isCurrentlyFav) {
        guestList = guestList.filter(
          (item) => (item.destinationId?._id || item._id || item.id) !== destinationId
        );
      } else {
        guestList.unshift({
          _id: `guest_${destinationId}`,
          destinationId: destination,
          createdAt: new Date().toISOString(),
        });
      }
      saveGuestFavourites(guestList);
      return { isGuest: true, items: guestList };
    }

    try {
      if (isCurrentlyFav) {
        await favouriteApi.remove(destinationId);
        return { isGuest: false, action: 'removed', destinationId };
      } else {
        const added = await favouriteApi.add(destinationId);
        return { isGuest: false, action: 'added', item: added, destination };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncGuestFavourites = createAsyncThunk(
  'favourite/syncGuestFavourites',
  async (_, { rejectWithValue }) => {
    const guestList = getGuestFavourites();
    if (!guestList.length) return [];
    try {
      const destinationIds = guestList
        .map((item) => item.destinationId?._id || item._id || item.id)
        .filter(Boolean);
      await favouriteApi.sync(destinationIds);
      localStorage.removeItem(GUEST_FAV_KEY);
      const updated = await favouriteApi.getMyFavourites();
      return Array.isArray(updated) ? updated : updated?.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState: {
    items: getGuestFavourites(),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAllLocalFavourites: (state) => {
      state.items = [];
      saveGuestFavourites([]);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFavourites
      .addCase(fetchFavourites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // toggleFavourite
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          state.items = action.payload.items;
        } else if (action.payload.action === 'removed') {
          state.items = state.items.filter((item) => {
            const id = item.destinationId?._id || item.destinationId || item._id;
            return id !== action.payload.destinationId;
          });
        } else if (action.payload.action === 'added') {
          const newItem = {
            ...action.payload.item,
            destinationId: action.payload.destination,
          };
          state.items.unshift(newItem);
        }
      })
      // syncGuestFavourites
      .addCase(syncGuestFavourites.fulfilled, (state, action) => {
        if (action.payload?.length) {
          state.items = action.payload;
        }
      });
  },
});

export const { clearAllLocalFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
