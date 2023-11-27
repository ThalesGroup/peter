import { NEW_PRODUCT } from '../../../../../../src/module/products/core/domain/product.slice';
import { RecyclingType } from '../../../../../../src/module/products/core/domain/entity/RecyclingType';

const initialState = NEW_PRODUCT;
export const productBuilder = ({
  id = 'default-product-id',
  recycling = {
    enabled: false,
    type: RecyclingType.NONE,
  },
}: {
  id?: string;
  recycling?: {
    enabled: boolean;
    type: RecyclingType;
  };
} = {}) => {
  const props = { id, recycling };

  return {
    withRecyclingType(type: RecyclingType) {
      return productBuilder({
        ...props,
        recycling: {
          enabled: true,
          type,
        },
      });
    },

    build() {
      return { ...initialState, ...props, name: 'Product under test' };
    },
  };
};
