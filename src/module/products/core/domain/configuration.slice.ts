/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Configuration, ConfigurationItems } from './entity/Configuration';
import InMemoryConfigurationProvider from '../infrastructure/InMemoryConfigurationProvider';

const initialState: Configuration = {
  items: {
    materials: [],
    electronicComponents: [],
    testLocations: [],
    powerSources: [],
    recyclingTypes: [],
  },
  loading: 'idle',
};

export const loadConfiguration = createAsyncThunk<ConfigurationItems>(
  `Configuration/load`,
  async () => {
    return InMemoryConfigurationProvider.load();
  }
);

export const configurationSlice = createSlice({
  name: 'Configuration',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadConfiguration.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(loadConfiguration.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.items.materials = action.payload.materials;
        state.items.electronicComponents = action.payload.electronicComponents;
        state.items.testLocations = action.payload.testLocations;
        state.items.powerSources = action.payload.powerSources;
        state.items.recyclingTypes = action.payload.recyclingTypes;
      })
      .addCase(loadConfiguration.rejected, (state) => {
        state.loading = 'failed';
      });
  },
});

export default configurationSlice.reducer;
