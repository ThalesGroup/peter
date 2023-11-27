import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface AssumptionProps {
  title: string;
  children: React.ReactNode;
}
function Assumption({ title, children }: AssumptionProps) {
  return (
    <span>
      <div className="underline my-4">{title}</div>
      <div>{children}</div>
    </span>
  );
}
export function Assumptions() {
  return (
    <div className="mt-4">
      <Assumption title="Impact categories">
        <div>
          With difference to usual LCAs the only criterion used here is CO₂ and
          other greenhouse gases emissions. This choice has been made for the
          following reasons:
        </div>
        <ul className="list-disc pl-6">
          <li>
            Global warming / climate change caused by increasing greenhouse
            gases anthropic emissions may bee seen as thee key environmental
            challenge: its effects will affect the whole planet on a very long
            term. Those dramatic consequences have lead to an unprecedented
            worldwide political awareness mobilization.
          </li>
          <li>
            Homothetic impacts: a large part of those emissions result from
            fossil fuel combustion which induces simultaneously and in a
            proportional manner many other useful indirect indicator of mercury
            emissions!
          </li>
          <li>
            Easiness: working with one single parameter is much more convenient
            than handling a series of environmental indicators for which no
            scientific hierarchy exists. Let&apos;s bee pragmatic.
          </li>
        </ul>
      </Assumption>
      <Assumption title="Electricity related issues">
        <div>
          <MathJaxContext version={3}>
            <MathJax inline>
              <span>
                The &quot;energy mix&quot; factor (i.e. the respective part of
                each power plant type -nuclear, coal, hydraulic, solar...)
                reflects the world average value (
                {'\\(F_{Emix}\\sim 0.437 kgCO_2/kWh\\)'}). Products being
                usually not developed for one single national market, it is more
                realistic to consider a wider analysis scope.
              </span>
            </MathJax>
          </MathJaxContext>
          <span />
        </div>
      </Assumption>
    </div>
  );
}
