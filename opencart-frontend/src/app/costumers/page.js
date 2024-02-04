"use client"
import Navbar from '@/src/component/navbar/Navbar';
import Pages from '@/src/component/pages/Pages';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;  
import dynamic from "next/dynamic";
import Cookies from 'js-cookie';

const CostomersData = dynamic(() => import("./costomersData"), {
  ssr: false,
});
const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [costomersData, setCostomersData] = useState({});

  const getAllReworkData = async () => {
    setLoading(true);

    try {
      const token = Cookies.get('authToken');
    
      const  data  = await axios.get(BASE_URL + '/api/customer', {
        headers: {
          'x-access-token': token,
        },
        withCredentials: true,
      });
      console.log(data)

        setCostomersData(data?.data);

        if (data.data.message === "User Token Not Valid") {
          Cookies.remove('authToken')
          router.replace("/login")
        }
      
    } catch (err) {
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
        Costomers
        <button className="pointer" onClick={() => router.push('/costumersadd')}>
          + Add New
        </button>
      </div>
      <div>

      
    </div>

      <div className="table_component">
        <div className="pending_table">
          <CostomersData data={costomersData}  getAllReworkData={getAllReworkData} />{' '}
          {loading ? <div className="loader_table"> <div className="loader table_loader_change"></div></div> : null}
        </div>
      </div>
    </div>
  );
};

export default Page;
