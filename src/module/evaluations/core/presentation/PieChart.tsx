import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { EvaluationResult } from '../domain/entity/EvaluationVersions';

interface Props {
  result: EvaluationResult;
}

interface ColorDefinition {
  color: string;
  labelColor: string;
}

const colorMapping: Map<string, ColorDefinition> = new Map([
  [
    'Hardware mechanics',
    {
      color: '#4C5DFF',
      labelColor: '#F7F7F9',
    },
  ],
  [
    'Hardware electronics',
    {
      color: '#33BCA5',
      labelColor: '#131319',
    },
  ],
  [
    'Tests & Qualification',
    {
      color: '#FF4854',
      labelColor: '#F7F7F9',
    },
  ],
  [
    'In-use power consumption',
    {
      color: '#FDDA24',
      labelColor: '#131319',
    },
  ],
  [
    'In-use mobility',
    {
      color: '#AE2573',
      labelColor: '#F7F7F9',
    },
  ],
  [
    'Recycling',
    {
      color: '#FFAA48',
      labelColor: '#131319',
    },
  ],
]);

function PieChart({ result }: Props) {
  const series = result.impacts.map((impact) => impact.total);
  const options: ApexOptions = {
    colors: result.impacts.map(
      (impact) => colorMapping.get(impact.name)?.color
    ),
    chart: {
      width: 432,
      fontFamily: 'Roboto',
    },

    dataLabels: {
      style: {
        colors: result.impacts.map(
          (impact) => colorMapping.get(impact.name)?.labelColor
        ),
      },
      dropShadow: {
        enabled: false,
      },
    },
    labels: result.impacts.map((impact) => impact.name),
    legend: {
      position: 'left',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  return (
    <div id="chart" className="h-24xl">
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width={432}
      />
    </div>
  );
}

export default PieChart;
