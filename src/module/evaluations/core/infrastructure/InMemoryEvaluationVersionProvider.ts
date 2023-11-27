import { EvaluationVersionList } from '../domain/entity/EvaluationVersionList';

class InMemoryEvaluationVersionProvider {
  async load(): Promise<EvaluationVersionList> {
    return new EvaluationVersionList([
      {
        id: 'ae0a6d92-f91f-4f30-b073-258578598103',
        version: '1.0.0',
        types: [
          {
            name: 'Lifecycle CO₂ emissions',
            coefficients: {
              hardware: {
                materials: [
                  {
                    id: '4c37377f-9ab8-422b-a247-0d14ee82a3a8',
                    materialId: '1',
                    value: 3,
                  },
                  {
                    id: 'c0054dca-e9b9-42e2-9515-17c5c3bc3c16',
                    materialId: '2',
                    value: 4,
                  },
                  {
                    id: '5944c5ea-3504-4793-b387-05c0a4a7fd0f',
                    materialId: '3',
                    value: 5,
                  },
                  {
                    id: '7c2ccfd4-cc28-47a2-9975-e9ef06f85e74',
                    materialId: '4',
                    value: 8,
                  },
                  {
                    id: 'bae66545-68a0-4bd2-8dda-7e04629d8c03',
                    materialId: '5',
                    value: 12,
                  },
                  {
                    id: '0611f6d1-8273-43bd-8073-7cc8ccb1ed7d',
                    materialId: '6',
                    value: 45,
                  },
                ],
                electricalComponents: [
                  {
                    id: 'd1cf490d-0d6c-48b3-b87d-df00e917085e',
                    componentId: '1',
                    value: 30,
                  },
                  {
                    id: 'f0365bc6-335e-4f90-893e-aab0a681e162',
                    componentId: '2',
                    value: 250,
                  },
                  {
                    id: '0b8efda1-c424-425c-ac97-058fc39d7218',
                    componentId: '3',
                    value: 9,
                  },
                ],
                energyUsedAtTestLocations: [
                  {
                    testLocationId: 'bc763be3-e0f7-4152-938b-5a47b13c7342',
                    value: 0.06,
                  },
                  {
                    testLocationId: '668a37ef-f615-47da-9b49-2072d4c59cae',
                    value: 0.178,
                  },
                ],
              },
              mobility: {
                embedded: [
                  {
                    id: '1',
                    platformModelId: '1',
                    value: 21000,
                  },
                  {
                    id: '2',
                    platformModelId: '2',
                    value: 22000,
                  },
                  {
                    id: '3',
                    platformModelId: '3',
                    value: 13000,
                  },
                  {
                    id: '4',
                    platformModelId: '4',
                    value: 5000,
                  },
                  {
                    id: '5',
                    platformModelId: '5',
                    value: 12700,
                  },
                  {
                    id: '6',
                    platformModelId: '6',
                    value: 1400,
                  },
                  {
                    id: '7',
                    platformModelId: '7',
                    value: 900,
                  },
                  {
                    id: '8',
                    platformModelId: '8',
                    value: 3800,
                  },
                  {
                    id: '9',
                    platformModelId: '9',
                    value: 700,
                  },
                  {
                    id: '10',
                    platformModelId: '10',
                    value: 80,
                  },
                  {
                    id: '11',
                    platformModelId: '11',
                    value: 130,
                  },
                  {
                    id: '12',
                    platformModelId: '12',
                    value: 110,
                  },
                  {
                    id: '13',
                    platformModelId: '13',
                    value: 40,
                  },
                  {
                    id: '14',
                    platformModelId: '14',
                    value: 100,
                  },
                  {
                    id: '15',
                    platformModelId: '15',
                    value: 400,
                  },
                  {
                    id: '16',
                    platformModelId: '16',
                    value: 300,
                  },
                  {
                    id: '17',
                    platformModelId: '17',
                    value: 500,
                  },
                  {
                    id: '18',
                    platformModelId: '18',
                    value: 170,
                  },
                  {
                    id: '19',
                    platformModelId: '19',
                    value: 50,
                  },
                  {
                    id: '20',
                    platformModelId: '20',
                    value: 50,
                  },
                ],
                transported: [
                  {
                    id: '1',
                    platformModelId: 'tpm-1',
                    value: 0.76,
                  },
                  {
                    id: '2',
                    platformModelId: '2',
                    value: 0.53,
                  },
                  {
                    id: '3',
                    platformModelId: 'tpm-3',
                    value: 0.52,
                  },
                  {
                    id: '4',
                    platformModelId: 'tpm-4',
                    value: 7.05,
                  },
                  {
                    id: '5',
                    platformModelId: 'tpm-5',
                    value: 3.39,
                  },
                  {
                    id: '6',
                    platformModelId: 'tpm-6',
                    value: 0.37,
                  },
                  {
                    id: '7',
                    platformModelId: 'tpm-7',
                    value: 0.8,
                  },
                  {
                    id: '8',
                    platformModelId: 'tpm-8',
                    value: 0.71,
                  },
                  {
                    id: '9',
                    platformModelId: 'tpm-9',
                    value: 5100,
                  },
                  {
                    id: '10',
                    platformModelId: 'tpm-10',
                    value: 0.52,
                  },
                  {
                    id: '11',
                    platformModelId: 'tpm-11',
                    value: 0.63,
                  },
                  {
                    id: '12',
                    platformModelId: 'tpm-12',
                    value: 0.49,
                  },
                  {
                    id: '13',
                    platformModelId: 'tpm-13',
                    value: 0.13,
                  },
                  {
                    id: '14',
                    platformModelId: 'tpm-14',
                    value: 0.02,
                  },
                  {
                    id: '15',
                    platformModelId: 'tpm-15',
                    value: 0.01,
                  },
                  {
                    id: '16',
                    platformModelId: 'tpm-16',
                    value: 0.02,
                  },
                  {
                    id: '17',
                    platformModelId: 'tpm-17',
                    value: 0.04,
                  },
                  {
                    id: '18',
                    platformModelId: 'tpm-18',
                    value: 0.06,
                  },
                  {
                    id: '19',
                    platformModelId: 'tpm-19',
                    value: 0.05,
                  },
                  {
                    id: '20',
                    platformModelId: 'tpm-20',
                    value: 0.1,
                  },
                  {
                    id: '21',
                    platformModelId: 'tpm-21',
                    value: 0.11,
                  },
                  {
                    id: '22',
                    platformModelId: 'tpm-22',
                    value: 0.06,
                  },
                ],
              },
              powerSource: [
                {
                  id: 'e0e40dd9-f999-47e4-942f-9f9760ce7c89',
                  value: 0.437,
                },
                {
                  id: 'd6266704-102f-4db4-b4bf-03778583e441',
                  value: 0.9,
                },
                {
                  id: '9f4778df-5a74-4603-9da2-4da9e8ee881e',
                  value: 0.04,
                },
              ],
              recycling: [
                {
                  type: 'TYPE_1',
                  value: 1,
                },
                {
                  type: 'TYPE_2',
                  value: 1.2,
                },
              ],
            },
          },
        ],
      },
    ]);
  }
}
export default InMemoryEvaluationVersionProvider;
