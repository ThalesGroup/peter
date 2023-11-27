import React from 'react';
import { MethodologyAspects } from './MethodologyAspects';
import { Assumptions } from './Assumptions';
import { Sources } from './Sources';
import { RecyclingAspects } from './RecyclingAspects';
import { ExpandableSection } from '../ExpandableSection';

function MethodBasics() {
  return (
    <div className="mt-6">
      <ExpandableSection title="Method basics">
        <MethodologyAspects />
        <Assumptions />
        <RecyclingAspects />
        <Sources />
      </ExpandableSection>
    </div>
  );
}

export default MethodBasics;
