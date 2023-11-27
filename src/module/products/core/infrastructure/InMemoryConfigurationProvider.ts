import { ConfigurationApi } from '../domain/ports/ConfigurationApi';
import { ConfigurationItems } from '../domain/entity/Configuration';

class InMemoryConfigurationProvider implements ConfigurationApi {
  async load(): Promise<ConfigurationItems> {
    return {
      materials: [
        {
          id: '1',
          name: 'Steel and ferrous alloys',
        },
        {
          id: '2',
          name: 'Copper and its alloys',
        },
        {
          id: '3',
          name: 'Thermoplastics polymers such as PC, PA...',
        },
        {
          id: '4',
          name: 'Thermosetting polymers such as epoxy, SMC / BMC...',
        },
        {
          id: '5',
          name: 'Aluminium and its alloys',
        },
        {
          id: '6',
          name: 'Titanium or magnesium and their alloys',
        },
      ],
      electronicComponents: [
        {
          id: '1',
          name: 'Displays (not including internal PCB assemblies from displays)',
        },
        {
          id: '2',
          name: 'Printed circuit boards with electronic components',
        },
        {
          id: '3',
          name: 'Li-on batteries',
        },
      ],
      testLocations: [
        {
          id: 'bc763be3-e0f7-4152-938b-5a47b13c7342',
          name: 'France',
          description: '',
        },
        {
          id: '668a37ef-f615-47da-9b49-2072d4c59cae',
          name: 'Europe except France',
          description: 'Average for Belgium, Italy, Switzerland, Spain & UK',
        },
      ],
      powerSources: [
        {
          id: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
          name: 'Grid',
          description: 'Average world energy mix emission factor',
        },
        {
          id: 'd6266704-102f-4db4-b4bf-03778583e441',
          name: 'Embedded or local thermal generator',
          description: 'Default conventional emission factor',
        },
        {
          id: '9f4778df-5a74-4603-9da2-4da9e8ee881e',
          name: 'Renewable solar source',
          description: 'No direct emissions but still in manufacturing',
        },
      ],
      recyclingTypes: [
        {
          value: 'NONE',
          label: 'No Recycling possible',
        },
        {
          value: 'TYPE_1',
          label: 'Recycling treatment type 1: average electronic equipment',
        },
        {
          value: 'TYPE_2',
          label:
            'Recycling treatment type 2: average electronic equipment containing a cooling system',
        },
      ],
    };
  }
}
export default new InMemoryConfigurationProvider();
