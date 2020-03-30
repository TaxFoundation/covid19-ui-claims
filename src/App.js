import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { csvParse } from 'd3-dsv';

import Selection from './components/Selection';
import Chart from './components/Chart';

const StyledApp = styled.div`
  margin: 0 auto;
  max-width: 674px;
`;

const App = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/data/data.csv');
      setData(csvParse(result.data));
    };
    fetchData();
  }, []);

  return (
    <StyledApp>
      {data.length ? (
        <>
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
        </>
      ) : null}
    </StyledApp>
  );
};

export default App;
