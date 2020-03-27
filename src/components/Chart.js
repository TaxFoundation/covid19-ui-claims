import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar } from '@vx/shape';

const Chart = ({ data }) => {
  const height = 600;
  const width = 800;
  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const barData = [
    data['greatrecessionavg'],
    data['greatrecessionmax'],
    data['week20200326'],
  ];
  const xLabels = [
    'Great Recession Avgerage Claims per Week',
    'Great Recession Maximum Claims per Week',
    'Week Ending March 21, 2020 Total Claims',
  ];
  const colors = ['#623D6E', '#3394C3', '#78E3CF'];
  const labelProps = {
    textAnchor: 'middle',
    fontFamily: '"lato", sans-serif',
    fontSize: 14,
    fill: 'black',
  };

  const numTicksForY = maxValue => {
    console.log(maxValue);
    if (maxValue >= 1000000) {
      return 10;
    } else if (maxValue < 1000000 && maxValue >= 100000) {
      return 8;
    } else {
      return 5;
    }
  };

  const xScale = scaleBand({
    domain: xLabels,
    rangeRound: [0, xMax],
    padding: 0.4,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...barData)],
  });

  console.log(data);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group>
        {barData.map((bar, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(bar);
          const barX = margin.left + xScale(xLabels[i]);
          const barY = margin.top + yMax - barHeight;
          return (
            <Bar
              key={`bar-${bar}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={colors[i]}
            />
          );
        })}
      </Group>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          labelOffset={margin.left - 20}
          scale={yScale}
          hideZero
          numTicks={numTicksForY(barData[2])}
          label='Unemployment Insurance Claims'
          labelProps={labelProps}
        />
        <AxisBottom
          scale={xScale}
          top={margin.top + yMax}
          label='Week of Claims'
          labelProps={labelProps}
        />
      </Group>
    </svg>
  );
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
