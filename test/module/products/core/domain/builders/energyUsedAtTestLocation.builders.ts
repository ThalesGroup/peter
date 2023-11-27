import { v4 as uuidV4 } from 'uuid';

export const energyUsedAtTestLocationBuilder = ({
  id = uuidV4(),
  testLocationId = 'default-test-location-id',
  energy = 0,
}: { id?: string; testLocationId?: string; energy?: number } = {}) => {
  const props = { id, testLocationId, energy };

  return {
    withId(energyUsedAtTestLocationId: string) {
      return energyUsedAtTestLocationBuilder({
        ...props,
        id: energyUsedAtTestLocationId,
      });
    },
    withTestLocationId(usedTestLocationId: string) {
      return energyUsedAtTestLocationBuilder({
        ...props,
        testLocationId: usedTestLocationId,
      });
    },
    withEnergyUsed(energyUsed: number) {
      return energyUsedAtTestLocationBuilder({
        ...props,
        energy: energyUsed,
      });
    },

    build() {
      return {
        id,
        testLocationId,
        energy,
      };
    },
  };
};
