"use client"
import React from "react";
import axios from "axios";
const FileUpload = () => {
  const handleFileUpload = (event) => {
    const course_image = event.target.files[0];
    const formData = new FormData();
    formData.append("course_image", course_image);
    
  
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
      .post("http://127.0.0.1:5000/api/course/insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImlhdCI6MTcwNjc5ODI2MSwiZXhwIjoxNzA2ODA1NDYxfQ.9Su46NJ7rX3wFvkxMCAMrKqWxcDoZsCQfUmc4LPdnh0",
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
      <input type="file"  accept="image/jpeg" onChange={handleFileUpload} />
    </div>
  );
};
export default FileUpload;
