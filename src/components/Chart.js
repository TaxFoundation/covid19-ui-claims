import React from 'react';
import PropTypes from 'prop-types';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';

const Chart = ({ data }) => {
  const height = 600;
  const width = 800;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: ['GR Median', 'GR Max', 'COVID-19'],
    rangeRound: [0, xMax],
    padding: 0.4,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [
      0,
      Math.max(data['2008median'], data['2008max'], data['week20200326']),
    ],
  });

  return <div>{JSON.stringify(data)}</div>;
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
