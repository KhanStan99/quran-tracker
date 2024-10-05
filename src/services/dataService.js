import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const config = require('../config');

// Define a service using a base URL and expected endpoints
export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.base_url }),
  endpoints: (builder) => ({
    getUserDataById: builder.query({
      query: (userId) => `data?userId=${userId}`,
    }),
    getUserHistoryDataById: builder.query({
      query: (userId) => `data/history?userId=${userId}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserDataByIdQuery, useGetUserHistoryDataByIdQuery } =
  userDataApi;
