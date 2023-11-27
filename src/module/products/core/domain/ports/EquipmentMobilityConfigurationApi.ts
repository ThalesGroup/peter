import { EquipmentMobilityConfiguration } from '../entity/PlatformModel';

export interface EquipmentMobilityConfigurationApi {
  load: () => Promise<EquipmentMobilityConfiguration>;
}
