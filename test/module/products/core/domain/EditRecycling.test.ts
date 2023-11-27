import { ProductState } from '../../../../../src/module/products/core/domain/entity/Product';
import productReducer, {
  recyclingToggled,
  recyclingTypeUpdated,
} from '../../../../../src/module/products/core/domain/product.slice';
import { RecyclingType } from '../../../../../src/module/products/core/domain/entity/RecyclingType';
import { getPartialStoreWithState } from '../utils/StoreInitializer';
import { productBuilder } from './builders/product.builder';

describe('Edit product Recycling', () => {
  test('Recycling should be disabled by default on new product', () => {
    const productState: ProductState = productBuilder().build();

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    expect(customProductSlice.getState().recycling.enabled).toBe(false);
  });
  test('Default recycling type is TYPE_1 when recycling is enabled', async () => {
    const productState: ProductState = productBuilder().build();
    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(recyclingToggled());

    expect(customProductSlice.getState().recycling.enabled).toBe(true);
    expect(customProductSlice.getState().recycling.type).toEqual(
      RecyclingType.TYPE_1
    );
  });

  test('Edit product recycling type', async () => {
    const productState: ProductState = productBuilder()
      .withRecyclingType(RecyclingType.TYPE_2)
      .build();

    const customProductSlice = getPartialStoreWithState(
      productReducer,
      productState
    );

    await customProductSlice.dispatch(
      recyclingTypeUpdated(RecyclingType.TYPE_1)
    );

    expect(customProductSlice.getState().recycling.enabled).toBe(true);
    expect(customProductSlice.getState().recycling.type).toEqual(
      RecyclingType.TYPE_1
    );
  });
});
