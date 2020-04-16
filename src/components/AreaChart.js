import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar } from '@vx/shape';
import { format } from 'd3-format';

const AreaChart = ({ data }) => {
  const height = 506;
  const width = 674;
  const margin = { top: 20, right: 20, bottom: 100, left: 80 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const dates = [
    '4-Jan',
    '11-Jan',
    '18-Jan',
    '25-Jan',
    '1-Feb',
    '8-Feb',
    '15-Feb',
    '22-Feb',
    '29-Feb',
    '7-Mar',
    '14-Mar',
    '21-Mar',
    '28-Mar',
    '4-Apr',
    '11-Apr',
  ];
  const colors = {
    gr: '#ededed',
    continued: '#3394C3',
    initial: '#78E3CF',
  };
  const combined = data.i.map((claim, i) => {
    return claim + data.c[i];
  });

  const yMaxValue = Math.max(
    ...combined,
    data.grInitialAvg + data.grContinuedAvg
  );

  const labelProps = {
    textAnchor: 'middle',
    fontFamily: '"lato", sans-serif',
    fontSize: 18,
    fill: 'black',
  };

  const numTicksForY = maxValue => {
    if (maxValue >= 1000000) {
      return 10;
    } else if (maxValue < 1000000 && maxValue >= 100000) {
      return 8;
    } else {
      return 5;
    }
  };

  const xScale = scaleBand({
    domain: dates,
    rangeRound: [0, xMax],
    padding: -0.1,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, yMaxValue],
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group>
        <rect
          x={margin.left}
          width={xMax}
          y={margin.top + yScale(data.grInitialAvg + data.grContinuedAvg)}
          height={yMax - yScale(data.grInitialAvg + data.grContinuedAvg)}
          fill={colors.gr}
        ></rect>
        <line
          x1={margin.left}
          x2={margin.left + xMax}
          y1={margin.top + yScale(data.grInitialAvg + data.grContinuedAvg)}
          y2={margin.top + yScale(data.grInitialAvg + data.grContinuedAvg)}
          stroke={'#cdcdcd'}
          strokeDasharray={4}
        ></line>
        {combined.map((entry, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(entry);
          const barX = margin.left + xScale(dates[i]);
          const barY = margin.top + yMax - barHeight;
          return (
            <Bar
              key={`initial-${i}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={colors.initial}
            />
          );
        })}
        {data.c.map((entry, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(entry);
          const barX = margin.left + xScale(dates[i]);
          const barY = margin.top + yMax - barHeight;
          return (
            <Bar
              key={`continued-${i}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={colors.continued}
            />
          );
        })}
      </Group>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          labelOffset={margin.left - 25}
          scale={yScale}
          hideZero
          numTicks={numTicksForY(yMaxValue)}
          label='Unemployment Insurance Claims'
          labelProps={labelProps}
          tickFormat={format('~s')}
          tickLabelProps={() => {
            return {
              fontFamily: '"lato", sans-serif',
              fontSize: 14,
              textAnchor: 'end',
              transform: `translate(-5,4)`,
            };
          }}
        />
        <AxisBottom
          scale={xScale}
          top={margin.top + yMax}
          label='Week of Claims'
          labelProps={labelProps}
        ></AxisBottom>
        <Group transform={`translate(${110}, ${height - margin.bottom + 55})`}>
          <rect height={'15'} width={'15'} fill={colors.initial}></rect>
          <text fontFamily="'Lato', sans-serif" x='20' y='13'>
            New Claims
          </text>
        </Group>
        <Group transform={`translate(${110}, ${height - margin.bottom + 75})`}>
          <rect height={'15'} width={'15'} fill={colors.continued}></rect>
          <text fontFamily="'Lato', sans-serif" x='20' y='13'>
            Continued Claims
          </text>
        </Group>
        <Group
          transform={`translate(${margin.left + 225}, ${
            height - margin.bottom + 55
          })`}
        >
          <rect height={'15'} width={'15'} fill={colors.gr}></rect>
          <text fontFamily="'Lato', sans-serif" x='20' y='13'>
            Great Recession Average
          </text>
          <text fontFamily="'Lato', sans-serif" x='20' y='33'>
            Weekly Total Claims
          </text>
        </Group>
      </Group>
    </svg>
  );
};

AreaChart.propTypes = {
  data: PropTypes.object,
};

export default AreaChart;
