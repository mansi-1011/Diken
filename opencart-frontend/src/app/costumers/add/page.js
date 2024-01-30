"use client"
import Navbar from '@/src/component/navbar/Navbar';
import Pages from '@/src/component/pages/Pages';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { costomerInitialValue, costomerValidationSchema } from '@/src/utils/validation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const page = () => {
  const router = useRouter()
  const formik = useFormik({
    initialValues: costomerInitialValue,
    validationSchema: costomerValidationSchema,
    onSubmit: async values => {
      try {
      const token = localStorage.getItem('authToken');
        const response = await axios.post(BASE_URL + '/api/customer/insert', values, {
          headers: {
            'Content-Type': 'application/json',
              'x-access-token': token
          },
        });
        if (response.data.status == false) {
          localStorage.clear()
          router.replace("/login")
        } else if (response.data.status == true) {
          toast.success("Customer add successfully.")
        }
      } catch (error) {

        localStorage.clear()
          router.replace("/login")
        // Handle errors
      } finally {
        // Regardless of success or failure, setSubmitting to false

      }
    },
  });



  return (
    <div>
      <Navbar logout="logout" />
      <Pages />
      <div className="page-title"> Add Costomers   </div>

      <form onSubmit={formik.handleSubmit}>
        General Information
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="general.name" onChange={formik.handleChange} value={formik.values.general.name} />
          {formik.touched.general?.name && formik.errors.general?.name && <div>{formik.errors.general.name}</div>}
        </div>
        <div>
          <label htmlFor="email">E-mail</label>
          <input type="text" id="email" name="general.email" onChange={formik.handleChange} value={formik.values.general.email} />
          {formik.touched.general?.email && formik.errors.general?.email && <div>{formik.errors.general.email}</div>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="general.password" onChange={formik.handleChange} value={formik.values.general.password} />
          {formik.touched.general?.password && formik.errors.general?.password && <div>{formik.errors.general.password}</div>}
        </div>
        <div>
          <label htmlFor="telephone">telephone</label>
          <input type="text" id="telephone" name="general.telephone" onChange={formik.handleChange} value={formik.values.general.telephone} />
          {formik.touched.general?.telephone && formik.errors.general?.telephone && <div>{formik.errors.general.telephone}</div>}
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="general.status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.general.status}
          >
            <option value="0">Disable</option>
            <option value="1">Enable</option>
          </select>



          {formik.touched.general?.status && formik.errors.general?.status && (
            <div>{formik.errors.general.status}</div>
          )}
        </div>
        {/* Repeat similar structure for other general fields */}

        Address Information
        <div>
          <label htmlFor="first_name">First Name</label>
          <input type="text" id="first_name" name="address.first_name" onChange={formik.handleChange} value={formik.values.address.first_name} />
          {formik.touched.address?.first_name && formik.errors.address?.first_name && <div>{formik.errors.address.first_name}</div>}
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input type="text" id="last_name" name="address.last_name" onChange={formik.handleChange} value={formik.values.address.last_name} />
          {formik.touched.address?.last_name && formik.errors.address?.last_name && <div>{formik.errors.address.last_name}</div>}
        </div>
        <div>
          <label htmlFor="company">Company</label>
          <input type="text" id="company" name="address.company" onChange={formik.handleChange} value={formik.values.address.company} />
          {formik.touched.address?.company && formik.errors.address?.company && <div>{formik.errors.address.company}</div>}
        </div>
        <div>
          <label htmlFor="company_id">Company ID </label>
          <input type="text" id="company_id" name="address.company_id" onChange={formik.handleChange} value={formik.values.address.company_id} />
          {formik.touched.address?.company_id && formik.errors.address?.company_id && <div>{formik.errors.address.company_id}</div>}
        </div>
        <div>
          <label htmlFor="tax_id">text id</label>
          <input type="text" id="tax_id" name="address.tax_id" onChange={formik.handleChange} value={formik.values.address.tax_id} />
          {formik.touched.address?.tax_id && formik.errors.address?.tax_id && <div>{formik.errors.address.tax_id}</div>}
        </div>
        <div>
          <label htmlFor="address_1">Address 1</label>
          <input type="text" id="address_1" name="address.address_1" onChange={formik.handleChange} value={formik.values.address.address_1} />
          {formik.touched.address?.address_1 && formik.errors.address?.address_1 && <div>{formik.errors.address.address_1}</div>}
        </div>
        <div>
          <label htmlFor="address_2">Address 2</label>
          <input type="text" id="address_2" name="address.address_2" onChange={formik.handleChange} value={formik.values.address.address_2} />
          {formik.touched.address?.address_2 && formik.errors.address?.address_2 && <div>{formik.errors.address.address_2}</div>}
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="address.city" onChange={formik.handleChange} value={formik.values.address.city} />
          {formik.touched.address?.city && formik.errors.address?.city && <div>{formik.errors.address.city}</div>}
        </div>
        <div>
          <label htmlFor="postcode">Postcode</label>
          <input type="text" id="postcode" name="address.postcode" onChange={formik.handleChange} value={formik.values.address.postcode} />
          {formik.touched.address?.postcode && formik.errors.address?.postcode && <div>{formik.errors.address.postcode}</div>}
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="address.country" onChange={formik.handleChange} value={formik.values.address.country} />
          {formik.touched.address?.country && formik.errors.address?.country && <div>{formik.errors.address.country}</div>}
        </div>
        <div>
          <label htmlFor="state"> Region / State</label>
          <input type="text" id="state" name="address.state" onChange={formik.handleChange} value={formik.values.address.state} />
          {formik.touched.address?.state && formik.errors.address?.state && <div>{formik.errors.address.state}</div>}
        </div>
        {/* Repeat similar structure for other address fields */}

        <button type="submit">Submit</button>
        <button type="button" onClick={() => router.push("/costumers")} >cancel</button>
      </form>
      <div>


      </div>
    </div>
  )
}

export default page