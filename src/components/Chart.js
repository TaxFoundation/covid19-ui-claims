import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';
import { Point } from '@vx/point';
import { format } from 'd3-format';

const Chart = ({ data }) => {
  const height = 506;
  const width = 674;
  const margin = { top: 20, right: 20, bottom: 100, left: 80 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const barData = [
    data['greatrecessionavg'],
    data['greatrecessionmax'],
    data['week20200326'],
    data['week20200402'],
  ];
  const xLabels = [
    `Great Recession, ${data.name}'s, Average Claims, Per Week`,
    `Great Recession, ${data.name}'s, Highest Claims, In a Week`,
    `${data.name}'s, Total Claims, For the Week Ending, March 21st 2020`,
    `${data.name}'s, Total Claims, For the Week Ending, March 28th 2020`,
  ];
  const colors = ['#623D6E', '#3394C3', '#78E3CF', '#78E3CF'];
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
    domain: xLabels,
    rangeRound: [0, xMax],
    padding: 0.4,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...barData)],
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group>
        {barData.map((bar, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(bar);
          const barX = margin.left + xScale(xLabels[i]);
          const barY = margin.top + yMax - barHeight;
          return (
            <g key={`bar-${bar}`}>
              <text
                x={barX + barWidth / 2}
                y={barY - 6}
                textAnchor='middle'
                fontFamily='"lato", sanas-serif'
                fontSize={12}
              >
                {format(',')(Math.round(bar))}
              </text>
              <Bar
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={colors[i]}
              />
            </g>
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
          numTicks={numTicksForY(barData[2])}
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
        >
          {props => {
            const tickLabelSize = 12;
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
                        x={tickX}
                        y={tickY - 5}
                        fontSize={tickLabelSize}
                        textAnchor='middle'
                        fill={tickColor}
                        fontFamily='"lato", sans-serif'
                      >
                        {tick.formattedValue.split(', ').map((line, i) => (
                          <tspan
                            key={`line-${i}-${line}`}
                            x={tickX}
                            dy={i === 0 ? 0 : tickLabelSize * 1.2}
                          >
                            {line}
                          </tspan>
                        ))}
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
                <text {...labelProps} x={axisCenter} y={90}>
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
