import configurationReducer, {
  loadConfiguration,
} from '../../../../../src/module/products/core/domain/configuration.slice';
import { Configuration } from '../../../../../src/module/products/core/domain/entity/Configuration';
import { getPartialStoreWithState } from '../utils/StoreInitializer';
import { storeBuilder } from '../../../../builders/store.builder';

describe('Mechanical parts configuration tests', () => {
  const store = storeBuilder().build();

  test('should return the initial state', () => {
    expect(store.getState().configuration).toEqual<Configuration>({
      loading: 'idle',
      items: {
        materials: [],
        electronicComponents: [],
        testLocations: [],
        powerSources: [],
        recyclingTypes: [],
      },
    });
  });

  test('should load configuration', async () => {
    const initialState: Configuration = {
      loading: 'idle',
      items: {
        materials: [],
        electronicComponents: [],
        testLocations: [],
        powerSources: [],
        recyclingTypes: [],
      },
    };

    const configurationSlice = getPartialStoreWithState(
      configurationReducer,
      initialState
    );

    await configurationSlice.dispatch(loadConfiguration());

    expect(configurationSlice.getState().loading).toEqual('idle');
    expect(configurationSlice.getState().items.materials.length).toEqual(6);
    expect(
      configurationSlice.getState().items.electronicComponents.length
    ).toEqual(3);
    expect(configurationSlice.getState().items.testLocations.length).toEqual(2);
    expect(configurationSlice.getState().items.powerSources.length).toEqual(3);
    expect(configurationSlice.getState().items.recyclingTypes.length).toEqual(
      3
    );
  });

  test('should be in loading state when loading configuration', async () => {
    const initialState: Configuration = {
      loading: 'idle',
      items: {
        materials: [],
        electronicComponents: [],
        testLocations: [],
        powerSources: [],
        recyclingTypes: [],
      },
    };

    const configurationSlice = getPartialStoreWithState(
      configurationReducer,
      initialState
    );

    configurationSlice.dispatch(loadConfiguration());

    expect(configurationSlice.getState()).toMatchObject<Configuration>({
      loading: 'pending',
      items: {
        materials: [],
        electronicComponents: [],
        testLocations: [],
        powerSources: [],
        recyclingTypes: [],
      },
    });
  });
});
