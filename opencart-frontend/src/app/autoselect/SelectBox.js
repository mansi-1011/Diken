// SelectBox.js
import React from 'react';

const SelectBox = ({ options, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.state_id} value={option.state_id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
