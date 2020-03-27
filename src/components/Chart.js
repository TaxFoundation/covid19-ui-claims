import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';
import { Point } from '@vx/point';

const Chart = ({ data }) => {
  const height = 600;
  const width = 800;
  const margin = { top: 20, right: 20, bottom: 70, left: 70 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const barData = [
    data['greatrecessionavg'],
    data['greatrecessionmax'],
    data['week20200326'],
  ];
  const xLabels = [
    `Great Recession, ${data.name}'s Avgerage Claims per Week`,
    `Great Recession, ${data.name}'s Maximum Claims per Week`,
    `${data.name}'s Total Claims for the Week Ending March 21, 2020`,
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
        >
          {props => {
            const tickLabelSize = 14;
            const tickColor = '#333333';
            const axisCenter =
              (props.axisToPoint.x - props.axisFromPoint.x) / 2;
            return (
              <g className='my-custom-bottom-axis'>
                {props.ticks.map((tick, i) => {
                  const tickX = tick.to.x;
                  const tickY = tick.to.y + tickLabelSize + props.tickLength;
                  return (
                    <Group
                      key={`vx-tick-${tick.value}-${i}`}
                      className={'vx-axis-tick'}
                    >
                      <Line
                        from={tick.from}
                        to={tick.to}
                        stroke={tickColor}
                        strokeWidth='1px'
                      />
                      <text
                        transform={`translate(${tickX}, ${tickY})`}
                        fontSize={tickLabelSize}
                        textAnchor='middle'
                        fill={tickColor}
                      >
                        {tick.formattedValue}
                      </text>
                    </Group>
                  );
                })}
                <Line
                  from={
                    new Point({
                      x: props.axisFromPoint.x,
                      y: 0,
                    })
                  }
                  to={new Point({ x: props.axisToPoint.x, y: 0 })}
                  stroke={tickColor}
                  strokeWidth='1'
                />
                <text {...labelProps} x={axisCenter} y={60}>
                  {props.label}
                </text>
              </g>
            );
          }}
        </AxisBottom>
      </Group>
    </svg>
  );
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
