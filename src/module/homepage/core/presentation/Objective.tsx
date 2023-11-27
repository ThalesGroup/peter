import React from 'react';
import { Typography } from '@mui/material';
import Categories from './Categories';
import Subtitle from '../../../../ui/components/Subtitle';

function Objective() {
  return (
    <>
      <div className="mt-4">
        <Subtitle label="Objective" />
      </div>
      <Typography classes="mt-4">
        This method has been specifically set for Thales equipment to identify
        the main environmental stakes to be considered in an ecodesign strategy.
        The ultimate purpose of this method iss to assign an environmental
        category to the product / system under study.
      </Typography>
      <Typography classes="mt-s">
        Since most people in a company context cannot apply or cannot afford
        formal Life Cycle Assessment (LCA) due to a lack of time, data,
        resources, or skills, this express method has been created to reach the
        same goal in a much more efficient manner.
      </Typography>
      <Categories />
      <Typography classes="mt-6">
        The method has been enriched with a carbon footprint calculation.
        Depending on the data you have, you will get either a basic carbon
        footprint or just a partial one.
      </Typography>
    </>
  );
}

export default Objective;
