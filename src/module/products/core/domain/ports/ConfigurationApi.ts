import { ConfigurationItems } from '../entity/Configuration';

export interface ConfigurationApi {
  load: () => Promise<ConfigurationItems>;
}
