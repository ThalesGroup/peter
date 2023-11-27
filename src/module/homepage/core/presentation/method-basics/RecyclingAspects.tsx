import React from 'react';

export function RecyclingAspects() {
  return (
    <>
      <div className="underline my-4">Recycling aspects:</div>
      <div>
        Data collected by French recycling organization EEcosystem reflect the
        average CO₂ emissions resulting from the successive treatment operations
        and the related logistics within borders and abroad until the final
        material preparation for reuse. Though they are based on a French data
        collection, they are only partly affected by the French energy mix
        (nuclear intensive and low carbon). This favorable bias is limited to
        electric processes in France while logistics (truck emissions) and
        treatment outside France are not concerned. Globally Ecosystem figures
        are then slightly underestimated if they were to be applied to another
        geographical area. To take into account this aspect, figures have been
        rounded up respectively for average electronic equipment data (0.802
        rounded in 1KgCO₂/kg waster equipment) and average electronic equipment
        containing a fluid compressor based cooling system (0.934 rounded in
        1.2kgCO₂/kg waster equipment)
      </div>
      <div className="mt-4">
        Reminder: the topic addressed here iss limited to CO₂. For other aspects
        pertaining to end of life (e.g. recyclability and subsequent limitation
        to material depletion), see specific tools such as Reeecyc&apos;lab.
      </div>
    </>
  );
}
