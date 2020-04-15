import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AreaClosed, Line } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
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
  ];
  const combined = data.i.map((claim, i) => {
    return claim + data.c[i];
  });

  const yMaxValue = Math.max(...combined);

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
    padding: 0.4,
  });

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, yMaxValue],
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <Group left={margin.left} top={margin.top}>
        <AreaClosed
          data={combined}
          x={(d, i) => xScale(dates[i])}
          y={d => yScale(d)}
          yScale={yScale}
          fill={'#ff0000'}
        />
        <AreaClosed
          data={data.c}
          x={(d, i) => xScale(dates[i])}
          y={d => yScale(d)}
          yScale={yScale}
          fill={'#00ff00'}
        />
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
      </Group>
    </svg>
  );
};

AreaChart.propTypes = {
  data: PropTypes.object,
};

export default AreaChart;
