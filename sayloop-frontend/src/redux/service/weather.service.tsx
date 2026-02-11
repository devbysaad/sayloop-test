// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL

// export const fetchWeather = createAsyncThunk(
//   "weather/fetch",
//   async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
//     const response = await axios.get(API_URL, {
//       params: { latitude, longitude },
//     });
//     return response.data.data;
//   }
// );

// const weatherSlice = createSlice({
//   name: "weather",
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWeather.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWeather.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchWeather.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch weather";
//       });
//   },
// });

// export default weatherSlice.reducer;