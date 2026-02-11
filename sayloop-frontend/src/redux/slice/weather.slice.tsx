// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/weather";

// export const fetchWeather = createAsyncThunk(
//   "weather/fetch",
//   async ({ latitude, longitude }) => {
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
//       })
//       .addCase(fetchWeather.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchWeather.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default weatherSlice.reducer;