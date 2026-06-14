import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  addresses: [],
  selectedAddress: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    addAddress: (state, action) => {
      // Safety check for persisted old state
      if (!Array.isArray(state.addresses)) {
        state.addresses = [];
      }

      state.addresses.push(action.payload);
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    deleteAddress: (state, action) => {
      const deletedIndex = action.payload;

      if (!Array.isArray(state.addresses)) {
        state.addresses = [];
        return;
      }

      state.addresses.splice(deletedIndex, 1);

      if (state.selectedAddress === deletedIndex) {
        state.selectedAddress = null;
      } else if (
        state.selectedAddress !== null &&
        state.selectedAddress > deletedIndex
      ) {
        state.selectedAddress -= 1;
      }
    },

    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
    },

    logoutUser: (state) => {
      state.user = null;
      state.addresses = [];
      state.selectedAddress = null;
    },
  },
});

export const {
  setUser,
  addAddress,
  setSelectedAddress,
  deleteAddress,
  clearAddresses,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;