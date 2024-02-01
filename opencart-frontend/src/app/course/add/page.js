"use client"
import Navbar from '@/src/component/navbar/Navbar'
import Pages from '@/src/component/pages/Pages'
import { courceValideter, courceinitalData } from '@/src/utils/validation'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const page = () => {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null);
  const list = ["Information", "Sources"];
  const [currentTab, setCurrentTab] = useState(0);



console.log(selectedFile)
  const formik = useFormik({
    initialValues: courceinitalData,
    validationSchema: courceValideter,
    onSubmit: async (values) => { 
  
      const formData = new FormData();
      formData.append("course_image", selectedFile);
      formData.append("course_data", JSON.stringify(values));
    
  
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post(BASE_URL + '/api/course/insert', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', 
              'x-access-token': token,
            },
          });
  
          console.log(response);
  
          if (response.data.status === false) {
            localStorage.clear();
            router.replace("/login");
          } else if (response.data.status === true) {
            router.replace("/course");
            toast.success("Course added successfully.");
          }
        } catch (error) {
          console.log(error);
  
        } finally {
          setSubmitting(false);
        }
    }
  });
  



  const handleAddCourseData = () => {
    formik.setValues({
      ...formik.values,
      course_data: [
        ...formik.values.course_data,
        {
          course_data_type: "",
          course_data_title: "",
          course_data_url: "",
          course_data_length: "",
          course_count_of_view: "",
          course_sort_order: "",
          
        },
      ],
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("82", file)
    if (file && file.type === 'image/jpeg') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid JPG file.');
    }
  };


  return (
    <div>
      <Navbar logout="logout" />
      <Pages />

      <div className="page-title"> Add Course   </div>
      {console.log("fff", formik.values)}
      <div className="tab-container">
        {list.map((li, index) => {
          return (
            <div className={`tab ${index == currentTab ? "active" : null}`} key={li} onClick={() => setCurrentTab(index)} >
              {li}
            </div>
          )
        })}
      </div>

      <form className='form_data' onSubmit={formik.handleSubmit}>
        {currentTab == 0 && <>
          <div>
            <label htmlFor="course_name">Course Name : </label>
            <input type="text" id="course_name" name="course.course_name" onChange={formik.handleChange} value={formik.values.course.course_name} />
            {formik.touched.course?.course_name && formik.errors.course?.course_name && <div>{formik.errors.course.course_name}</div>}
          </div>
          <div>
            <label htmlFor="course_description">Course Description : </label>
            <input type="text" id="course_description" name="course.course_description" onChange={formik.handleChange} value={formik.values.course.course_description} />
            {formik.touched.course?.course_description && formik.errors.course?.course_description && <div>{formik.errors.course.course_description}</div>}
          </div>

          <div>
            <label>file :</label>
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <div>
                <p>Selected File: {selectedFile.name}</p>
              </div>
            )}
          </div>


          <div>
            <label htmlFor="course_expired_days">Course Expired days : </label>
            <input type="text" id="course_expired_days" name="course.course_expired_days" onChange={formik.handleChange} value={formik.values.course.course_expired_days} />
            {formik.touched.course?.course_expired_days && formik.errors.course?.course_expired_days && <div>{formik.errors.course.course_expired_days}</div>}
          </div>
          <div>
            <label htmlFor="course_length">Course length : </label>
            <input type="text" id="course_length" name="course.course_length" onChange={formik.handleChange} value={formik.values.course.course_length} />
            {formik.touched.course?.course_length && formik.errors.course?.course_length && <div>{formik.errors.course.course_length}</div>}
          </div>
          <div>
            <label htmlFor="course_number_of_videos">course number of videos : </label>
            <input type="text" id="course_number_of_videos" name="course.course_number_of_videos" onChange={formik.handleChange} value={formik.values.course.course_number_of_videos} />
            {formik.touched.course?.course_number_of_videos && formik.errors.course?.course_number_of_videos && <div>{formik.errors.course.course_number_of_videos}</div>}
          </div>
          <div>
            <label htmlFor="course_price">course price : </label>
            <input type="text" id="course_price" name="course.course_price" onChange={formik.handleChange} value={formik.values.course.course_price} />
            {formik.touched.course?.course_price && formik.errors.course?.course_price && <div>{formik.errors.course.course_price}</div>}
          </div>




          <div>
            <label htmlFor="status">Status : </label>
            <select
              id="status"
              name="course.course_status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.course.course_status}
            >
              <option value="0">Disable</option>
              <option value="1">Enable</option>
            </select>



            {formik.touched.course?.course_status && formik.errors.course?.course_status && <div>{formik.errors.course.course_status}</div>}
          </div>



          <div>
            <button className='btn' type="button" onClick={() => setCurrentTab(currentTab + 1)}>next</button>
          </div>
        </>}
        {currentTab == 1 && <>
          {formik.values.course_data.map((courseData, index) => (
            <div key={index}>
              <div >
                <label htmlFor='course_data_type'>course data type :</label>
                <input
                  type="text"
                  name={`course_data[${index}].course_data_type`}
                  onChange={formik.handleChange}
                  value={courseData.course_data_type}

                />
                {formik.touched.course_data && formik.errors.course_data && (
                  <div>{formik.errors.course_data[index]?.course_data_type}</div>
                )}
              </div>
              <div >
                <label htmlFor='course_data_title'>course data title :</label>
                <input
                  type="text"
                  name={`course_data[${index}].course_data_title`}
                  onChange={formik.handleChange}
                  value={courseData.course_data_title}

                />
                {formik.touched.course_data && formik.errors.course_data && (
                  <div>{formik.errors.course_data[index]?.course_data_title}</div>
                )}
              </div>
              <div>
                <label htmlFor='course_data_url'>course data url :</label>
                <input
                  type="text"
                  name={`course_data[${index}].course_data_url`}
                  onChange={formik.handleChange}
                  value={courseData.course_data_url}

                />
                {formik.touched.course_data && formik.errors.course_data && (
                  <div>{formik.errors.course_data[index]?.course_data_url}</div>
                )}
              </div>

              <div>
                <label htmlFor='course_data_length'>course data length :</label>
                <input
                  type="text"
                  name={`course_data[${index}].course_data_length`}
                  onChange={formik.handleChange}
                  value={courseData.course_data_length}

                />
                {formik.touched.course_data && formik.errors.course_data && (
                  <div>{formik.errors.course_data[index]?.course_data_length}</div>
                )}
              </div>
              <div>
                <label htmlFor='course_sort_order'>course sort order :</label>
                <input
                  type="text"
                  name={`course_data[${index}].course_sort_order`}
                  onChange={formik.handleChange}
                  value={courseData.course_sort_order}

                />
                {formik.touched.course_data && formik.errors.course_data && (
                  <div>{formik.errors.course_data[index]?.course_sort_order}</div>
                )}
              </div>
            </div>

          ))}


          {console.log(formik.errors)}

          <div> <button type="button" className='btn' onClick={handleAddCourseData}>
            Add Course Data
          </button>     <button className='btn' type="submit">Submit</button></div>


        </>}

      </form>
    </div>
  )
}

export default page