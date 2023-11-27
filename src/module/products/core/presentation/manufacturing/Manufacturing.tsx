import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import Subtitle from '../../../../../ui/components/Subtitle';
import {
  addMassOfElectronicComponent,
  addMassOfMaterial,
  removeMassOfElectronicComponent,
  removeMassOfMaterial,
  updateMassOfElectronicComponent,
  updateMassOfMaterial,
} from '../../domain/product.slice';
import { DefaultMaterialId } from '../../domain/entity/Material';
import NumberField from '../../../../../ui/components/NumberField';
import DeleteIconButton from '../../../../../ui/components/DeleteIconButton';
import AddFormItemButton from '../../../../../ui/components/AddFormItemButton';
import { DefaultElectronicComponentId } from '../../domain/entity/ElectronicalComponent';
import Section from '../../../../../ui/components/Section';
import { selectConfiguration } from '../../domain/configuration.selector';
import { selectCurrentProduct } from '../../domain/product.selector';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function Manufacturing() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const configuration = useSelector(selectConfiguration);
  const product = useSelector(selectCurrentProduct);

  const canDeleteMaterials = (): boolean => {
    return product.materialMassesBreakdownOfMechanicalParts.value.length > 1;
  };

  const canDeleteElectronicsComponents = (): boolean => {
    return product.componentMassesBreakdownOfElectronics.value.length > 1;
  };

  return (
    <Section title="Manufacturing" canBeDisabled={false} enabled>
      <Subtitle label="Material breakdown of mechanical parts" />
      <Typography variant="body2">
        Please enter the rounded estimated masses (in kg) of parts composing
        your product by materials family.
      </Typography>

      {product.materialMassesBreakdownOfMechanicalParts.value.map(
        (massOfMaterial) => (
          <div className="mt-2 flex items-end" key={massOfMaterial.id}>
            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select
                id="select_material"
                className="w-18xl"
                value={massOfMaterial.materialId}
                onChange={(event) => {
                  dispatch(
                    updateMassOfMaterial({
                      id: massOfMaterial.id,
                      materialId: event.target.value,
                      mass: massOfMaterial.mass,
                    })
                  );
                }}
              >
                <MenuItem value={DefaultMaterialId}>
                  No selected material
                </MenuItem>
                {configuration.items.materials.map((material) => (
                  <MenuItem value={material.id} key={material.id}>
                    {material.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="ml-2">
              <NumberField
                id="materialMass"
                classes="w-18xl"
                fieldValue={massOfMaterial.mass}
                label="Mass (kg)"
                onChange={(value: number) => {
                  dispatch(
                    updateMassOfMaterial({
                      id: massOfMaterial.id,
                      materialId: massOfMaterial.materialId,
                      mass: value,
                    })
                  );
                }}
              />
            </div>
            {canDeleteMaterials() && (
              <DeleteIconButton
                onClick={() => {
                  dispatch(removeMassOfMaterial(massOfMaterial.id));
                }}
              />
            )}
          </div>
        )
      )}

      <AddFormItemButton
        label="Material"
        onClick={() => dispatch(addMassOfMaterial())}
      />
      <div className="mt-6">
        <Subtitle label="Component breakdown of Electronics" />
        <Typography variant="body2">
          Please enter the rounded estimated masses (in kg) of electronic
          components composing your product by component family.
        </Typography>

        {product.componentMassesBreakdownOfElectronics.value.map(
          (massOfComponent) => (
            <div className="mt-2 flex items-end" key={massOfComponent.id}>
              <FormControl>
                <FormLabel>Electronic component</FormLabel>
                <Select
                  id="select_component"
                  className="w-18xl"
                  value={massOfComponent.componentId}
                  onChange={(event) => {
                    dispatch(
                      updateMassOfElectronicComponent({
                        id: massOfComponent.id,
                        componentId: event.target.value,
                        mass: massOfComponent.mass,
                      })
                    );
                  }}
                >
                  <MenuItem value={DefaultElectronicComponentId}>
                    No selected component
                  </MenuItem>
                  {configuration.items.electronicComponents.map((component) => (
                    <MenuItem value={component.id} key={component.id}>
                      {component.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="ml-2">
                <NumberField
                  id="componentMass"
                  classes="w-18xl"
                  fieldValue={massOfComponent.mass}
                  label="Mass (kg)"
                  onChange={(value: number) => {
                    dispatch(
                      updateMassOfElectronicComponent({
                        id: massOfComponent.id,
                        componentId: massOfComponent.componentId,
                        mass: value,
                      })
                    );
                  }}
                />
              </div>
              {canDeleteElectronicsComponents() && (
                <DeleteIconButton
                  onClick={() => {
                    dispatch(
                      removeMassOfElectronicComponent(massOfComponent.id)
                    );
                  }}
                />
              )}
            </div>
          )
        )}
        <AddFormItemButton
          label="Electronic component"
          onClick={() => dispatch(addMassOfElectronicComponent())}
        />
      </div>
    </Section>
  );
}

export default Manufacturing;
