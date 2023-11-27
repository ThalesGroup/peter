import { Typography } from '@mui/material';

export function MethodologyAspects() {
  return (
    <div className="mt-4 flex flex-col">
      <Typography variant="subtitle1" fontWeight="bold">
        Methodology aspects
      </Typography>
      <Typography>
        Impacts estimates are calculated by using the same basic principles as
        in LCAs: data aggregating all direct and indirect quantified consumption
        and emissions of a given activity (e.g. 1kWh electricity supplied in
        Germany) or material (e.g. 1kg Steel production) are introduced in
        environmental models (E.G. IPCC/GIECC model on Climate Change) to define
        the contribution to this type of environmental impact. Those data
        generally cover a range of different context and lead to average data.
        Such typical &quot;generic&quot; data have been also completed where
        necessary by materials processing representative data.
      </Typography>
      <Typography>
        Figures may greatly differ from one material to another. This is why
        formulas contain different factors for Steel, Aluminium, Polymers...This
        is also the case for the different vehicles type (Truck, Ship,
        Aircraft).
      </Typography>
      <Typography>
        While relying on a quantitative approach, figures obtained with this
        method should not be seen as accurate estimates to be directly used for
        instance in external communication. Consider the following figures as
        orders of magnitude.
      </Typography>
    </div>
  );
}
