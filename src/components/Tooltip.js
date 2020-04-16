import React from 'react';
import styled from 'styled-components';

const StyledTooltip = styled.div`
  background-color: white;
  border: 1px solid #efefef;
  border-radius: 4px;
  top: ${props => (props.show ? `${props.y - 170}px` : 0)};
  color: #333;
  display: ${props => (props.show ? 'block' : 'none')};
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  left: ${props => (props.show ? `${props.x}px` : 0)};
  padding: 0.5rem;
  position: fixed;
  width: 100px;
`;

const Tooltip = ({ show, children, x, y }) => {
  return (
    <StyledTooltip show={show} x={x} y={y}>
      {children}
    </StyledTooltip>
  );
};

export default Tooltip;
