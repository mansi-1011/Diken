"use client"
// import React, { useState } from 'react';
// import axios from 'axios';

// const LocationInfo = () => {
//   const [postcode, setPostcode] = useState('');
//   const [locationInfo, setLocationInfo] = useState(null);

//   const handleInputChange = (event) => {
//     setPostcode(event.target.value);
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://api.geonames.org/postalCodeSearchJSON?postalcode=${postcode}&username=fenil`
//       );

//       if (response.data && response.data.postalCodes.length > 0) {
//         const data = response.data.postalCodes[0];
//         const country = data.countryCode;
//         const state = data.adminCode1;
//         const city = data.placeName;

//         // Fetch additional information based on country and state codes
//         const countryResponse = await axios.get(`http://api.geonames.org/countryInfoJSON?country=${country}&username=YOUR_GEONAMES_USERNAME`);
//         const stateResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${state}&username=YOUR_GEONAMES_USERNAME`);

//         const countryName = countryResponse.data.geonames[0].countryName;
//         const stateName = stateResponse.data.geonames[0].adminName1;

//         setLocationInfo({
//           country: countryName,
//           state: stateName,
//           city: city,
//         });
//       } else {
//         setLocationInfo(null);
//       }
//     } catch (error) {
//       console.error('Error fetching location information', error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" placeholder="Enter postcode" onChange={handleInputChange} />
//       <button onClick={handleSearch}>Search</button>

//       {locationInfo && (
//         <div>
//           <p>Country: {locationInfo.country}</p>
//           <p>State: {locationInfo.state}</p>
//           <p>City: {locationInfo.city}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationInfo;




import React from "react";
import axios from "axios";
const FileUpload = () => {
  const handleFileUpload = (event) => {
    // get the selected file from the input
    const course_image = event.target.files[0];
    // create a new FormData object and append the file to it
    const formData = new FormData();
    // formData.append("course_image", course_image);
    // make a POST request to the File Upload API with the FormData object and Rapid API headers

    // const data = {
    //   course: {
    //     course_id: 1,
    //     course_name: "Early Pregnancy(Ectopic, level-1 Included)",
    //     course_description: "hello mansi",
    //     course_expired_days: 30,
    //     course_length: 1.5,
    //     course_number_of_videos: 4,
    //     course_price: 15000,
    //     course_status: 1,
    //   },
    //   course_data: [
    //     {
    //       course_data_id: 1,
    //       course_id: 1,
    //       course_data_type: "1",
    //       course_data_title: "01 GB  practical testing",
    //       course_data_url:
    //         "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB++practical.mp4",
    //       course_data_length: "55:34",
    //       course_count_of_view: 1,
    //       course_sort_order: 1,
    //     },
    //     {
    //       course_data_id: 2,
    //       course_id: 1,
    //       course_data_type: "2",
    //       course_data_title: "01 GB Ultrasound Class - I testinggggggggggg",
    //       course_data_url:
    //         "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB+Ultrasound+Class+-+I.mp4",
    //       course_data_length: "55:34",
    //       course_count_of_view: 1,
    //       course_sort_order: 0,
    //     },
    //   ],
    // };

    const data = {
      course: {
        course_name: "Abdominal Ultra Sonography",
        course_description: "hello",
        course_expired_days: 30,
        course_length: 1.5,
        course_number_of_videos: 4,
        course_price: 15000,
        course_status: 1,
      },
      course_data: [
        {
          course_data_type: "2",
          course_data_title: "01 GB  practical",
          course_data_url:
            "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB++practical.mp4",
          course_data_length: "55:34",
          course_count_of_view: 1,
          course_sort_order: 0,
        },
        {
          course_data_type: "2",
          course_data_title: "01 GB Ultrasound Class - I",
          course_data_url:
            "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB+Ultrasound+Class+-+I.mp4",
          course_data_length: "55:34",
          course_count_of_view: 1,
          course_sort_order: 1,
        },
      ],
    };

    formData.append("course_data", JSON.stringify(data));
    axios
      .put("http://127.0.0.1:5000/api/course/upd", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImlhdCI6MTcwNjY0MDY5MCwiZXhwIjoxNzA2NjQ3ODkwfQ.-zKK5DDcXLjzjWtHwQuQO2QZA9k3wLHIM79eL_Kgp_s",
        },
      })
      .then((response) => {
        // handle the response
        console.log(response);
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  };
  // render a simple input element with an onChange event listener that calls the handleFileUpload function
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      </div>
  );
};
export default FileUpload;
