import { EquipmentMobilityConfigurationApi } from '../domain/ports/EquipmentMobilityConfigurationApi';
import { EquipmentMobilityConfiguration } from '../domain/entity/PlatformModel';

class InMemoryEquipmentMobilityConfigurationProvider
  implements EquipmentMobilityConfigurationApi
{
  async load(): Promise<EquipmentMobilityConfiguration> {
    return {
      embeddedPlatformModels: [
        {
          id: '1',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 100000,
          },
        },
        {
          id: '2',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 160000,
          },
        },
        {
          id: '3',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 60000,
          },
        },
        {
          id: '4',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 20000,
          },
        },
        {
          id: '5',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 7500,
          },
        },
        {
          id: '6',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 20000,
          },
        },
        {
          id: '7',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 5500,
          },
        },
        {
          id: '8',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 10000,
          },
        },
        {
          id: '9',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 1,
          },
        },
        {
          id: '10',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 150000,
          },
        },
        {
          id: '11',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 100000,
          },
        },
        {
          id: '12',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 1000000,
          },
        },
        {
          id: '13',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 1000000,
          },
        },
        {
          id: '14',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 2000000,
          },
        },
        {
          id: '15',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 4000000,
          },
        },
        {
          id: '16',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 7500000,
          },
        },
        {
          id: '17',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 12500000,
          },
        },
        {
          id: '18',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 30,
          },
        },
        {
          id: '19',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 30,
          },
        },
        {
          id: '20',
          sectorId: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 35,
          },
        },
      ],
      transportedPlatformModels: [
        {
          id: 'tpm-1',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-2',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-3',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-4',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-5',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-6',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-7',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-8',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultFlight(),
        },
        {
          id: 'tpm-9',
          sector: '',
          name: '',
          description: '',
          defaultValue: {
            description: '',
            value: 1,
          },
        },
        {
          id: 'tpm-10',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-11',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-12',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-13',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-14',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-15',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-16',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-17',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-18',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-19',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-20',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultBoating(),
        },
        {
          id: 'tpm-21',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultBoating(),
        },
        {
          id: 'tpm-22',
          sector: '',
          name: '',
          description: '',
          defaultValue: this.getDefaultBoating(),
        },
      ],
    };
  }

  private getDefaultFlight() {
    return {
      description: '1 hour flight',
      value: 1,
    };
  }

  private getDefaultHauling() {
    return {
      description: '100km hauling',
      value: 100,
    };
  }

  private getDefaultRollling() {
    return {
      description: '100km rolling',
      value: 100,
    };
  }

  private getDefaultBoating() {
    return {
      description: '24h boating',
      value: 24,
    };
  }
}

export default new InMemoryEquipmentMobilityConfigurationProvider();
