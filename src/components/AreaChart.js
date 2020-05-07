import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Bar, Line } from '@vx/shape';
import { format } from 'd3-format';

import Tooltip from './Tooltip';

const AreaChart = ({ data }) => {
  const height = 536;
  const width = 674;
  const margin = { top: 20, right: 20, bottom: 120, left: 80 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [week, setWeek] = useState('');
  const [newClaims, setNewClaims] = useState(0);
  const [contClaims, setContClaims] = useState(0);

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
    '18-Apr',
    '25-Apr',
    '2-May',
  ];

  const tooltipMouseover = (x, y, week) => {
    setShowTooltip(true);
    setTooltipPosition({ x, y });
    setWeek(dates[week]);
    setNewClaims(data.i[week]);
    setContClaims(data.c[week]);
  };

  const tooltipMouseout = () => {
    setShowTooltip(false);
    setTooltipPosition({ x: 0, y: 0 });
    setWeek('');
    setNewClaims(0);
    setContClaims(0);
  };

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
    fill: 'black',
  };

  const labelSize = 16;

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
    padding: 0,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, yMaxValue],
  });

  return (
    <div>
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
                onMouseMove={e => tooltipMouseover(e.clientX, e.clientY, i)}
                onMouseLeave={() => tooltipMouseout()}
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
                onMouseMove={e => tooltipMouseover(e.clientX, e.clientY, i)}
                onMouseLeave={() => tooltipMouseout()}
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
          >
            {axis => {
              const tickLabelSize = 10;
              const tickRotate = -45;
              const axisCenter =
                (axis.axisToPoint.x - axis.axisFromPoint.x) / 2;
              return (
                <g className='my-custom-bottom-axis'>
                  {axis.ticks.map((tick, i) => {
                    const tickX = tick.to.x;
                    const tickY = tick.to.y + tickLabelSize + axis.tickLength;
                    return (
                      <Group
                        key={`vx-tick-${tick.value}-${i}`}
                        className={'vx-axis-tick'}
                      >
                        <Line
                          from={tick.from}
                          to={tick.to}
                          stroke={labelProps.fill}
                        />
                        <text
                          transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                          {...labelProps}
                          fontSize={tickLabelSize}
                        >
                          {tick.formattedValue}
                        </text>
                      </Group>
                    );
                  })}
                  <text
                    transform={`translate(${axisCenter}, 60)`}
                    {...labelProps}
                    fontSize={labelSize}
                  >
                    {axis.label}
                  </text>
                </g>
              );
            }}
          </AxisBottom>
          <Group transform={`translate(0, 20)`}>
            <Group
              transform={`translate(${110}, ${height - margin.bottom + 55})`}
            >
              <rect height={'15'} width={'15'} fill={colors.initial}></rect>
              <text fontFamily="'Lato', sans-serif" x='20' y='13'>
                New Claims
              </text>
            </Group>
            <Group
              transform={`translate(${110}, ${height - margin.bottom + 75})`}
            >
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
        </Group>
      </svg>
      <Tooltip show={showTooltip} x={tooltipPosition.x} y={tooltipPosition.y}>
        <p>
          <strong>Week ending</strong>
          <br />
          {week}
        </p>
        <p>
          <strong>New Claims:</strong>
          <br />
          {format(',')(newClaims)}
        </p>
        <p>
          <strong>Continued Claims:</strong>
          <br />
          {format(',')(contClaims)}
        </p>
        <p>
          <strong>Total Claims:</strong>
          <br />
          {format(',')(newClaims + contClaims)}
        </p>
      </Tooltip>
    </div>
  );
};

AreaChart.propTypes = {
  data: PropTypes.object,
};

export default AreaChart;
