import React from 'react';
import styled from 'styled-components';

const StyledTooltip = styled.div`
  background-color: white;
  border: 1px solid #efefef;
  border-radius: 4px;
  color: #333;
  display: ${props => (props.show ? 'block' : 'none')};
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  padding: 0.5rem;
  position: fixed;
  width: 100px;
`;

const Tooltip = ({ show, children, x, y }) => {
  return (
    <StyledTooltip
      show={show}
      style={{
        top: show ? `${y - 200}px` : 0,
        left: show ? `${x - 50}px` : 0,
      }}
    >
      {children}
    </StyledTooltip>
  );
};

export default Tooltip;
