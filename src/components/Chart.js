import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';

const Chart = ({ data }) => {
  const height = 600;
  const width = 800;
  const margin = { top: 20, right: 20, bottom: 20, left: 70 };
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          scale={yScale}
          hideZero
          numTicks={10}
          label='Unemployment Insurance Claims'
        />
        <AxisBottom scale={xScale} top={yMax} label={'Week of Claims'} />
      </Group>
    </svg>
  );
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
