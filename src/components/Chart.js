import React from 'react';
import PropTypes from 'prop-types';

const Chart = ({ data }) => {
  return <div>{JSON.stringify(data)}</div>;
};

Chart.propTypes = {
  data: PropTypes.object,
};

export default Chart;
