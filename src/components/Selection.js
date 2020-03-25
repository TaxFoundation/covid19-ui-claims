import React from 'react';
import PropTypes from 'prop-types';

const Selection = ({ options, selected, setSelected }) => {
  console.log(options);
  return (
    <select value={selected} onChange={e => setSelected(+e.target.value)}>
      {options.map(opt => (
        <option key={`selection-${opt.id}`} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
};

Selection.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.number,
  setSelected: PropTypes.func,
};

export default Selection;
