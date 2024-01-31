// // App.js
// "use client"
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SelectBox from './SelectBox';
// import state from "./state.json"

// const App = () => {
//   const [selectedId, setSelectedId] = useState('');
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   // Fetch data using Axios
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = state;
//         console.log(response)
//         setData(response.state); // Assuming the data is an array of objects
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array ensures the effect runs only once on mount
// // console.log(object)
//   const handleSelect = (id) => {
//     // Update the selected ID
//     setSelectedId(id);

//     // Filter data based on the selected ID
//     const filtered = data.filter((item) => item.id === id);
//     setFilteredData(filtered);
//   };

//   return (
//     <div>
//       <h1>Select Box Example</h1>
//       {data?.length > 0 && (
//         <SelectBox options={data} onSelect={handleSelect} />
//       )}
//       {selectedId && (
//         <div>
//           <h2>Filtered Data</h2>
//           <ul>
//             {filteredData.map((item) => (
//               <li key={item.id}>{item.label}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

"use client"
import React, { useState } from 'react';

const CountrySelector = ({ countries, states }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const handleCountryChange = (event) => {
    const selectedCountryId = parseInt(event.target.value, 10);
    setSelectedCountry(selectedCountryId);
    // Reset selected state when country changes
    setSelectedState(null);
  };

  const handleStateChange = (event) => {
    const selectedStateId = parseInt(event.target.value, 10);
    setSelectedState(selectedStateId);
  };

  return (
    <div>
      <label>Select Country:</label>
      <select onChange={handleCountryChange}>
        <option value="">Select a Country</option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.name}
          </option>
        ))}
      </select>

      {selectedCountry !== null && (
        <div>
          <label>Select State:</label>
          <select onChange={handleStateChange}>
            <option value="">Select a State</option>
            {states
              .filter((state) => state.country_id === selectedCountry)
              .map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedState !== null && (
        <p>Selected State: {states.find((s) => s.state_id === selectedState).name}</p>
      )}
    </div>
  );
};

// Example usage
const App = () => {
  const countriesData = [
    {
      "country_id": 1,
      "name": "country_1",
      "code": "BR"
  },
  {
      "country_id": 2,
      "name": "country_2",
      "code": "BU"
  },
  {
      "country_id": 3,
      "name": "country_3",
      "code": "DL"
  },
  {
      "country_id": 4,
      "name": "country_4",
      "code": "DV"
  }
    // ... (other countries)
  ];

  const statesData = [
    {
      "state_id": 33,
      "country_id": 2,
      "name": "Berat",
      "code": "BR"
  },
  {
      "state_id": 34,
      "country_id": 1,
      "name": "Bulqize",
      "code": "BU"
  },
  {
      "state_id": 35,
      "country_id": 3,
      "name": "Delvine",
      "code": "DL"
  },
  {
      "state_id": 36,
      "country_id": 2,
      "name": "Devoll",
      "code": "DV"
  },
  {
      "state_id": 37,
      "country_id": 1,
      "name": "Diber",
      "code": "DI"
  },
  {
      "state_id": 38,
      "country_id": 2,
      "name": "Durres",
      "code": "DR"
  },
  {
      "state_id": 39,
      "country_id": 2,
      "name": "Elbasan",
      "code": "EL"
  },
  {
      "state_id": 40,
      "country_id": 2,
      "name": "Kolonje",
      "code": "ER"
  }
  ];

  return <CountrySelector countries={countriesData} states={statesData} />;
};

export default App;
