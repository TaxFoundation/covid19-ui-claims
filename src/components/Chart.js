import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';

const Chart = ({ data }) => {
  const height = 600;
  const width = 800;
  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const barData = [data['2008median'], data['2008max'], data['week20200326']];
  const xLabels = ['2008 Median Week', '2008 Maximum Week', 'Week Ending 3/26/2020']

  const xScale = scaleBand({
    domain: xLabels,
    rangeRound: [0, xMax],
    padding: 0.4,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [
      0,
      Math.max(...barData),
    ],
  });

  console.log(data);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          labelOffset={margin.left - 20}
          scale={yScale}
          hideZero
          numTicks={10}
          label='Unemployment Insurance Claims'
        />
        <AxisBottom scale={xScale} top={margin.top + yMax} label={'Week of Claims'} />
      </Group>
      <Group>
        {barData.map((bar, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(bar);
          const barX = margin.left + xScale(xLabels[i]);
          const barY = margin.top + yMax - barHeight;
          return (<Bar
            key={`bar-${bar}`}
            x={barX}
            y={barY}
            width={barWidth}
            height={barHeight}
            fill="#0094ff"
          />)
        })}
      </Group>
    </svg>
  );
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
