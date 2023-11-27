import React from 'react';
import { Button } from '@mui/material';
import SectionTitle from '../../../../ui/components/SectionTitle';
import Examples from './Examples';
import Objective from './Objective';
import MethodBasics from './method-basics/MethodBasics';

function Homepage() {
  return (
    <div className="flex flex-col">
      <SectionTitle
        label="Product Evaluation Tool for Ecodesign and
          Reporting (PETER)"
      />
      <Objective />
      <div className="my-12 w-full flex justify-center">
        <Button variant="contained" href="/evaluation">
          Start Categorizing your product
        </Button>
      </div>
      <Examples />
      <MethodBasics />
    </div>
  );
}

export default Homepage;
