"use client"
import React, { useState } from 'react';
import axios from 'axios';

const LocationInfo = () => {
  const [postcode, setPostcode] = useState('');
  const [locationInfo, setLocationInfo] = useState(null);

  const handleInputChange = (event) => {
    setPostcode(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://api.geonames.org/postalCodeSearchJSON?postalcode=${postcode}&username=fenil`
      );

      if (response.data && response.data.postalCodes.length > 0) {
        const data = response.data.postalCodes[0];
        const country = data.countryCode;
        const state = data.adminCode1;
        const city = data.placeName;

        // Fetch additional information based on country and state codes
        const countryResponse = await axios.get(`http://api.geonames.org/countryInfoJSON?country=${country}&username=YOUR_GEONAMES_USERNAME`);
        const stateResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${state}&username=YOUR_GEONAMES_USERNAME`);

        const countryName = countryResponse.data.geonames[0].countryName;
        const stateName = stateResponse.data.geonames[0].adminName1;

        setLocationInfo({
          country: countryName,
          state: stateName,
          city: city,
        });
      } else {
        setLocationInfo(null);
      }
    } catch (error) {
      console.error('Error fetching location information', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Enter postcode" onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>

      {locationInfo && (
        <div>
          <p>Country: {locationInfo.country}</p>
          <p>State: {locationInfo.state}</p>
          <p>City: {locationInfo.city}</p>
        </div>
      )}
    </div>
  );
};

export default LocationInfo;
