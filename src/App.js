import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { csvParse } from 'd3-dsv';

import Selection from './components/Selection';
import Chart from './components/Chart';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState(36);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/data/data.csv');
      setData(csvParse(result.data));
    };
    fetchData();
  }, []);

  return (
    <div>
      <Selection
        options={data.map(d => {
          return {
            id: +d.id,
            name: d.name,
            abbr: d.abbr,
          };
        })}
        selected={selectedState}
        setSelected={setSelectedState}
      ></Selection>
      <Chart data={data.find(d => +d.id === selectedState)}></Chart>
    </div>
  );
};

export default App;
