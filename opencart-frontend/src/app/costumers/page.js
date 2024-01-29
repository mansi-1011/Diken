"use client"
import Navbar from '@/src/component/navbar/Navbar';
import Pages from '@/src/component/pages/Pages';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import CostomersData from './CostomersData';  
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;  

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [costomersData, setCostomersData] = useState({});

  const getAllReworkData = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const  data  = await axios.get(BASE_URL + '/api/customer', {
        headers: {
          'x-access-token': token,
        },
        withCredentials: true,
      });
      if (data.status !== 200) {
        router.push('/login');
      } else if (data.status == 200) {
        setCostomersData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReworkData();
  }, []);
  const [selectedImage, setSelectedImage] = useState(null);


  return (
    <div>
      <Navbar logout="logout" />
      <Pages />

      <div className="page-title">
        Costomers{' '}
        <button className="pointer" onClick={() => router.push('/costumers/add')}>
          + Add New
        </button>
      </div>
      <div>

      {/* Display the selected image (optional) */}
      {selectedImage && (
        <div>
          <p>Selected Image:</p>
          <img src={URL.createObjectURL(selectedImage)} alt="Selected" width="200" />
        </div>
      )}
    </div>

      <div className="table_component">
        <div className="pending_table">
          <CostomersData data={costomersData} />{' '}
          {loading ? <div className="loader_table"> <div className="loader table_loader_change"></div></div> : null}
        </div>
      </div>
    </div>
  );
};

export default Page;
