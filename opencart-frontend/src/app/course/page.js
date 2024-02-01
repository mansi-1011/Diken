"use client" 
import Navbar from '@/src/component/navbar/Navbar'
import Pages from '@/src/component/pages/Pages'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseData from './CourseData'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;  

const page = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [costomersData, setCostomersData] = useState({});
  
    const getAllReworkData = async () => {
      setLoading(true);
  
      try {
        const token = localStorage.getItem('authToken');
        const  data  = await axios.get(BASE_URL + '/api/course', {
          headers: {
            'x-access-token': token,
          },
          withCredentials: true,
        });
        // console.log(data)
  
          setCostomersData(data?.data);
          if (data.data.message === "User Token Not Valid") {
            localStorage.clear()
            router.replace("/login")
          }
        
      } catch (err) {
        console.log(err)
        console.log("first")
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getAllReworkData();
    }, []);
  return (
    <div>
      <Navbar logout="logout" />
      <Pages />
      <div className="page-title">
      Course{' '}
        <button className="pointer" onClick={() => router.push('/course/add')}>
          + Add New
        </button>
      </div>
      <div className="table_component">
        <div className="pending_table">
          <CourseData data={costomersData}  getAllReworkData={getAllReworkData} />{' '}
          {loading ? <div className="loader_table"> <div className="loader table_loader_change"></div></div> : null}
        </div>
      </div>

</div>
  )
}

export default page