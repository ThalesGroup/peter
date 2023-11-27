import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultSectorId,
} from '../../domain/entity/PlatformModel';
import {
  selectCurrentProduct,
  selectEmbeddedPlatformModelSectors,
} from '../../domain/product.selector';
import Subtitle from '../../../../../ui/components/Subtitle';
import {
  embeddedEquipmentMobilityPlatformModelSelected,
  embeddedEquipmentMobilitySectorSelected,
  embeddedEquipmentMobilityUsageOverridden,
} from '../../domain/product.slice';
import NumberField from '../../../../../ui/components/NumberField';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function EmbeddedEquipmentMobility() {
  const sectors = useSelector(selectEmbeddedPlatformModelSectors);
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  return (
    <div>
      <Subtitle label="Platform-embedded movement" />
      <div
        className="flex"
        key={`${product.inUseMobility.embedded.usage.sectorId}-${product.inUseMobility.embedded.usage.platformModelId}`}
      >
        <FormControl className="w-fit">
          <FormLabel>Sector</FormLabel>
          <Select
            id="select_sector"
            className="w-18xl"
            defaultValue={DefaultSectorId}
            value={product.inUseMobility.embedded.usage.sectorId}
            onChange={(event) => {
              dispatch(
                embeddedEquipmentMobilitySectorSelected(event.target.value)
              );
            }}
          >
            <MenuItem value={DefaultSectorId} classes="w-18xl">
              No sector selected
            </MenuItem>
            {sectors.map((sector) => (
              <MenuItem value={sector} key={sector} classes="w-18xl">
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="ml-2">
          <FormLabel>Platform model</FormLabel>
          <Select
            id="select_platform_model"
            className="w-18xl"
            defaultValue={DefaultSectorId}
            value={product.inUseMobility.embedded.usage.platformModelId}
            onChange={(event) => {
              dispatch(
                embeddedEquipmentMobilityPlatformModelSelected(
                  event.target.value
                )
              );
            }}
          >
            <MenuItem value={DefaultSectorId}>
              No sector platform model
            </MenuItem>
            {product.inUseMobility.embedded.usage.filteredPlatformModels.map(
              (platform) => (
                <MenuItem value={platform.id} key={platform.id}>
                  {platform.name}
                </MenuItem>
              )
            )}
          </Select>
          {product.inUseMobility.embedded.usage.platformModelId !==
            DefaultEmbeddedPlatformModelId && (
            // TODO: need to test
            <FormLabel>
              {`Type: ${
                product.inUseMobility.embedded.usage.filteredPlatformModels.filter(
                  ({ id }) =>
                    id === product.inUseMobility.embedded.usage.platformModelId
                )[0].description
              }`}
            </FormLabel>
          )}
        </FormControl>
        {product.inUseMobility.embedded.usage.platformModelId !==
          DefaultEmbeddedPlatformModelId && (
          <NumberField
            id="usage"
            fieldValue={product.inUseMobility.embedded.usage.usage}
            label="Adjusted use"
            classes="ml-2 w-18xl"
            onChange={(value: number) => {
              dispatch(embeddedEquipmentMobilityUsageOverridden(value));
            }}
            key={product.inUseMobility.embedded.usage.platformModelId}
            caption={`Standard use: ${
              product.inUseMobility.embedded.usage.filteredPlatformModels.filter(
                ({ id }) =>
                  id === product.inUseMobility.embedded.usage.platformModelId
              )[0].defaultValue.description
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default EmbeddedEquipmentMobility;
