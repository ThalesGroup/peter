import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { evaluationForProductComputed } from '../domain/evaluationVersions.slice';
import { mapFromProduct } from '../domain/mappers/EvaluatedProductMapper';
import PieChart from './PieChart';
import {
  selectCurrentProduct,
  selectEmbeddedPlatformModels,
  selectTransportedPlatformModels,
} from '../../../products/core/domain/product.selector';
import { selectEvaluationImpactsResult } from '../domain/evaluation.selector';
import DisplayCategory from './DisplayCategory';
import { selectConfiguration } from '../../../products/core/domain/configuration.selector';
import { InUseMobilityType } from '../../../products/core/domain/entity/InUseMobilityType';
import Subtitle from '../../../../ui/components/Subtitle';
import { loadEvaluationVersionList } from '../usecases/evaluation-version-list.query';
import { AppDispatchWithDI } from '../../../shared/core/domain/store';

function Evaluation() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  const result = useSelector(selectEvaluationImpactsResult);
  const config = useSelector(selectConfiguration);
  const transportedPlatforms = useSelector(selectTransportedPlatformModels);
  const embeddedPlatforms = useSelector(selectEmbeddedPlatformModels);

  const displayLabel = (sectionName: string, labelId: string): string => {
    let name: string | undefined;

    switch (sectionName) {
      case 'Hardware mechanics':
        name = config.items.materials.find(
          (material) => material.id === labelId
        )?.name;
        break;
      case 'Hardware electronics':
        name = config.items.electronicComponents.find(
          (component) => component.id === labelId
        )?.name;
        break;
      case 'Tests & Qualification':
        name = config.items.testLocations.find(
          (testLocation) => testLocation.id === labelId
        )?.name;
        break;
      case 'Recycling':
        name = config.items.recyclingTypes.find(
          (type) => type.value === labelId
        )?.label;
        break;
      default:
        name = undefined;
    }

    if (sectionName === 'In-use mobility') {
      if (product.inUseMobility.type === InUseMobilityType.EMBEDDED) {
        const platformModel = embeddedPlatforms.find(
          (equipment) => equipment.id === labelId
        );
        name = platformModel
          ? `${platformModel.sectorId} - ${platformModel.name}`
          : 'Label not found';
      } else if (product.inUseMobility.type === InUseMobilityType.TRANSPORTED) {
        const platformModel = transportedPlatforms.find(
          (platform) => platform.id === labelId
        );
        name = platformModel
          ? `${platformModel.sector} - ${platformModel.name}`
          : 'Label not found';
      }
    }

    if (sectionName === 'In-use power consumption') {
      name = config.items.powerSources.find(
        (powerSource) => powerSource.id === labelId
      )?.name;
      name = name ? `Power source: ${name}` : name;
    }

    return name || labelId;
  };

  useEffect(() => {
    dispatch(loadEvaluationVersionList());
  }, [dispatch]);
  return (
    <div>
      <div className="flex justify-center my-12">
        <Button
          variant="contained"
          classes="w-16xl"
          onClick={() => {
            dispatch(
              evaluationForProductComputed({
                versionId: '1.0.0',
                product: mapFromProduct(product),
              })
            );
          }}
        >
          Compute
        </Button>
      </div>
      <div className="mt-8 flex justify-center">
        {result.values.map((evaluationResult) => (
          <div key={evaluationResult.name}>
            <Typography variant="h2" classes="text-primary-500">
              {evaluationResult.name}
            </Typography>
            <div className="ml-8 mt-6">
              <Subtitle label="CO₂ emissions data" />
              <table className="border-collapse w-full">
                <thead>
                  <tr className="bg-bluegrey-700">
                    <th className="w-1/6"> </th>
                    <th className="w-2/6"> </th>
                    <th className="w-1/6">
                      <Typography
                        color="white"
                        fontWeight="bold"
                        className="text-bluegrey-100"
                      >
                        Value
                      </Typography>
                    </th>
                    <th className="w-1/6">
                      <Typography
                        color="white"
                        fontWeight="bold"
                        className="text-bluegrey-100"
                      >
                        Emission factor
                      </Typography>
                    </th>
                    <th className="w-1/6">
                      <Typography
                        color="white"
                        fontWeight="bold"
                        className="uppercase text-bluegrey-100"
                      >
                        CO₂ emissions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                {evaluationResult.impacts.map((impact) => (
                  <tbody key={impact.name}>
                    {impact.details.map((detail, index) => (
                      <tr key={detail.labelId}>
                        <td className="text-center align-top p-none pt-3xs h-8">
                          {index === 0 && (
                            <div className="border border-dotted w-8xl h-8 flex items-center justify-center qtm-overline font-medium">
                              {impact.name}
                            </div>
                          )}
                        </td>
                        <td className="p-none pt-3xs">
                          <div className="qtm-caption-2">
                            {displayLabel(impact.name, detail.labelId)}
                          </div>
                        </td>
                        <td className="text-right p-none pt-3xs pr-2">
                          <div className="qtm-caption-2">
                            {detail.quantity.value} {detail.quantity.unit}
                          </div>
                        </td>
                        <td className="text-right p-none pt-3xs pr-2">
                          <div className="qtm-caption-2">{detail.factor}</div>
                        </td>
                        <td className="text-right p-none pt-3xs pr-2">
                          <div className="qtm-caption-2">
                            {detail.impact.value !== 0 &&
                              detail.impact.value.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-none pt-3xs h-8" />
                      <td className="p-none pt-3xs" />
                      <td className="text-right p-none pt-3xs">
                        <div className="qtm-caption-2 font-medium text-primary-500 uppercase pr-2">
                          Total
                        </div>
                      </td>
                      <td className="p-none pt-3xs" />
                      <td className="text-right p-none pt-3xs">
                        <div className="qtm-caption-2 font-medium text-primary-500 uppercase pr-2">
                          {impact.total.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <footer className="mt-4 flex w-full justify-end">
                <div className="bg-bluegrey-700 text-bluegrey-100 w-1/5 text-center">
                  <div className="qtm-caption-2 font-bold p-1">
                    {evaluationResult.total.toFixed(2)} kg
                  </div>
                </div>
              </footer>
            </div>
            <Grid container className="mt-8">
              <div className="flex flex-col">
                <Subtitle label="Graphical restitution" />
                <PieChart result={evaluationResult} />
              </div>
              <div>
                <Subtitle label="Categorization" />
                <DisplayCategory category={evaluationResult.category} />
              </div>
            </Grid>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Evaluation;
