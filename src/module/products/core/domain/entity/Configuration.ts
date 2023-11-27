import { Material } from './Material';
import { ElectronicComponent } from './ElectronicalComponent';
import { PowerSource } from './PowerSource';
import { TestLocation } from './TestLocation';

export interface Configuration {
  loading: 'idle' | 'pending' | 'failed';
  items: ConfigurationItems;
}

export interface RecyclingTypeItem {
  value: string;
  label: string;
}

export interface ConfigurationItems {
  materials: Material[];
  electronicComponents: ElectronicComponent[];
  testLocations: TestLocation[];
  powerSources: PowerSource[];
  recyclingTypes: RecyclingTypeItem[];
}
