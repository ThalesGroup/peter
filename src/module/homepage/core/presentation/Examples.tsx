import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Typography } from '@mui/material';
import { ExpandableSection } from './ExpandableSection';

interface ExampleProps {
  title: string;
  description: string;
  formula: string;
}

function Example({ title, description, formula }: ExampleProps) {
  return (
    <div className="mt-4">
      <span>
        <span className="underline">{title}</span>: {description}
      </span>
      <div className="w-full flex justify-center p-2">
        <MathJax>{formula}</MathJax>
      </div>
    </div>
  );
}

function Examples() {
  return (
    <ExpandableSection title="Example">
      <MathJaxContext version={3}>
        <Example
          title="Mechanics"
          description="Mechanics: CO₂ emissions for material production and manufacturing
          operation of a 3kg steel cabinet will account for:"
          formula={
            '\\(m CO_{2 Mecha} = 3 \\times m_{Steel} = 3 \\times 3 = 9kg CO_2\\)'
          }
        />
        <Example
          title="Electronics"
          description="for its 1kg PCBs production CO₂ will account for:"
          formula={
            '\\(m CO_{2\\ PCB} = 250 \\times m_{PCB} = 250 \\times 1 = 250kg CO_2\\)'
          }
        />
        <Example
          title="Hardware"
          description="at product level, total mass and production CO₂ impact can be estimated as follow"
          formula={
            '\\(m HW = 3 + 1 = 4 kg \\quad and \\quad m CO_{2\\ HW} = 259kg CO_2\\)'
          }
        />
        <Example
          title="Movement"
          description="CO₂ emissions of an equipment regularly transported in a land vehicle along its 20 years of use will account for:"
          formula={
            '\\(m CO_{2\\ Move Ground Vehicles} = 80 \\times m HW = 80 \\times 4 = 320 kg CO_2\\)'
          }
        />
        <div className="mt-4">
          <Typography variant="subtitle1" fontWeight="bold">
            Conclusion
          </Typography>
          <ul className="list-disc pl-6">
            <li>
              In this case, if the real (or equivalent) power of the equipment
              is higher than this estimate, the energy consumption during the
              product use phase and the product mass should be addressed in
              priority.
              <span className="font-bold">
                The product is categorized as &quot;EM&quot;.
              </span>
            </li>
            <li className="mt-s">
              If the power is lower, movement impacts prevail. Mass reduction
              should be targeted at first.
              <span className="font-bold">
                The product is then categorized as &quot;M&quot;.
              </span>
            </li>
            <li className="mt-s">
              If the real (or equivalent) power of the equipment was higher than
              this estimate, the energy consumption during the product use phase
              should be addressed in priority.
              <span className="font-bold">
                The product would be categorized as &quot;E&quot;.
              </span>
            </li>
            <li className="mt-s">
              If the power was lower than this figure
              <span className="font-bold">
                {' '}
                the product would be categorized as &quot;X&quot;.
              </span>
            </li>
          </ul>
        </div>
      </MathJaxContext>
    </ExpandableSection>
  );
}

export default Examples;
