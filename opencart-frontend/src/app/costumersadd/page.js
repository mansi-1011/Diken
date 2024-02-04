"use client"
import Navbar from '@/src/component/navbar/Navbar';
import Pages from '@/src/component/pages/Pages';
import React, { useEffect, useRef, useState } from 'react';
import { FieldArray, useFormik } from 'formik';
import { costomerInitialValue, costomerValidationSchema } from '@/src/utils/validation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const page = () => {
  const router = useRouter()
  const dropdownRef = useRef(null);
  const formik = useFormik({
    initialValues: costomerInitialValue,
    validationSchema: costomerValidationSchema,
    onSubmit: async values => {
      try {
        console.log(values)
        const token = Cookies.get('authToken');
        const response = await axios.post(BASE_URL + '/api/customer/insert', values, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        });
        console.log(response)
        if (response.data.status == false) {
          Cookies.remove("authToken")
          router.replace("/login")
        } else if (response.data.status == true) {
          router.replace("/costumers")
          toast.success("Customer add successfully.")
        }
      } catch (error) {

        Cookies.remove("authToken")
        router.replace("/login")
        // Handle errors
      } finally {
        // Regardless of success or failure, setSubmitting to false

      }
    },
  });
  const [contries, setContries] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(BASE_URL + '/api/customer/country', {
          headers: {
            'x-access-token': token,
          },
          withCredentials: true,
        });
        setContries(response.data.country);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [allState, setAllState] = useState()

  useEffect(() => {
    const fetchData = async (e) => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(BASE_URL + `/api/customer/country/${e}`, {
          headers: {
            'x-access-token': token,
          },
          withCredentials: true,
        });
        // console.log(response)
        setAllState(response.data.states);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(formik.values.address.country);
  }, [formik.values.address.country]);



  const list = ["Information", "Address", "payment", "course order"];
  const [currentTab, setCurrentTab] = useState(0);



  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [findCource] = useState()

  const handlefindcource = async (e) => {
    // console.log(e.target.value)
    try {

      const token = Cookies.get('authToken');
      const response = await axios.get(BASE_URL + `/api/customer/autocomplete?filter=${e.target.value}`, {
        headers: {
          'x-access-token': token,
        },
        withCredentials: true,
      });
      setDropdownOptions(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const [arrayShow, setArrayShow] = useState([])
  console.log("arrayShow", arrayShow)
  const parsFilterData = (e) => {
    setArrayShow(prevArrayShow => [...prevArrayShow, e]);
    // setArrayShow([e])
    const isCourseIdExists = formik.values.course_order.some(item => item.course_id === e.course_id);

    if (!isCourseIdExists) {
      formik.setValues((prevValues) => ({
        ...prevValues,
        course_order: [...prevValues.course_order, { course_id: e.course_id }],
      }));
    }

    setDropdownOptions([])

  }

  console.log(formik.values)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOptions([]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOptions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRemove = (i) => {
    setArrayShow(arrayShow.filter(item => item.course_id !== i))
    const updatedCourseOrder = formik.values.course_order.filter(course => course.course_id !== i);
    formik.setValues({
      ...formik.values,
      course_order: updatedCourseOrder,
    });
  }


  return (
    <div >
      <Navbar logout="logout" />
      <Pages />
      <div className="page-title"> Add Costomers   </div>

      <div className="tab-container">
        {list.map((li, index) => {
          return (
            <div className={`tab ${index == currentTab ? "active" : null}`} key={li} onClick={() => setCurrentTab(index)} >
              {li}
            </div>
          )
        })}
      </div>

      {console.log(formik.errors)}

      <form className='form_data' onSubmit={formik.handleSubmit}>
        {currentTab == 0 && <>
          <div>
            <label htmlFor="name">Name : </label>
            <input type="text" id="name" name="general.name" onChange={formik.handleChange} value={formik.values.general.name} />
            {formik.touched.general?.name && formik.errors.general?.name && <div>{formik.errors.general.name}</div>}
          </div>
          <div>
            <label htmlFor="email">E-mail : </label>
            <input type="text" id="email" name="general.email" onChange={formik.handleChange} value={formik.values.general.email} />
            {formik.touched.general?.email && formik.errors.general?.email && <div>{formik.errors.general.email}</div>}
          </div>
          <div>
            <label htmlFor="password">Password : </label>
            <input type="password" id="password" name="general.password" onChange={formik.handleChange} value={formik.values.general.password} />
            {formik.touched.general?.password && formik.errors.general?.password && <div>{formik.errors.general.password}</div>}
          </div>
          <div>
            <label htmlFor="telephone">telephone : </label>
            <input type="text" id="telephone" name="general.telephone" onChange={formik.handleChange} value={formik.values.general.telephone} />
            {formik.touched.general?.telephone && formik.errors.general?.telephone && <div>{formik.errors.general.telephone}</div>}
          </div>

          <div>
            <label htmlFor="status">Status : </label>
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

          <div>
            <button className='btn' type="button" onClick={() => setCurrentTab(currentTab + 1)}>next</button>
          </div>

        </>}

        {currentTab == 1 && <>
          <div>
            <label htmlFor="first_name">First Name : </label>
            <input type="text" id="first_name" name="address.first_name" onChange={formik.handleChange} value={formik.values.address.first_name} />
            {formik.touched.address?.first_name && formik.errors.address?.first_name && <div>{formik.errors.address.first_name}</div>}
          </div>
          <div>
            <label htmlFor="last_name">Last Name : </label>
            <input type="text" id="last_name" name="address.last_name" onChange={formik.handleChange} value={formik.values.address.last_name} />
            {formik.touched.address?.last_name && formik.errors.address?.last_name && <div>{formik.errors.address.last_name}</div>}
          </div>
          <div>
            <label htmlFor="company">Company : </label>
            <input type="text" id="company" name="address.company" onChange={formik.handleChange} value={formik.values.address.company} />
            {formik.touched.address?.company && formik.errors.address?.company && <div>{formik.errors.address.company}</div>}
          </div>
          <div>
            <label htmlFor="company_id">Company ID  : </label>
            <input type="text" id="company_id" name="address.company_id" onChange={formik.handleChange} value={formik.values.address.company_id} />
            {formik.touched.address?.company_id && formik.errors.address?.company_id && <div>{formik.errors.address.company_id}</div>}
          </div>
          <div>
            <label htmlFor="tax_id">text id : </label>
            <input type="text" id="tax_id" name="address.tax_id" onChange={formik.handleChange} value={formik.values.address.tax_id} />
            {formik.touched.address?.tax_id && formik.errors.address?.tax_id && <div>{formik.errors.address.tax_id}</div>}
          </div>
          <div>
            <label htmlFor="address_1">Address 1 : </label>
            <input type="text" id="address_1" name="address.address_1" onChange={formik.handleChange} value={formik.values.address.address_1} />
            {formik.touched.address?.address_1 && formik.errors.address?.address_1 && <div>{formik.errors.address.address_1}</div>}
          </div>
          <div>
            <label htmlFor="address_2">Address 2 : </label>
            <input type="text" id="address_2" name="address.address_2" onChange={formik.handleChange} value={formik.values.address.address_2} />
            {formik.touched.address?.address_2 && formik.errors.address?.address_2 && <div>{formik.errors.address.address_2}</div>}
          </div>
          <div>
            <label htmlFor="city">City : </label>
            <input type="text" id="city" name="address.city" onChange={formik.handleChange} value={formik.values.address.city} />
            {formik.touched.address?.city && formik.errors.address?.city && <div>{formik.errors.address.city}</div>}
          </div>
          <div>
            <label htmlFor="postcode">Postcode : </label>
            <input type="text" id="postcode" name="address.postcode" onChange={formik.handleChange} value={formik.values.address.postcode} />
            {formik.touched.address?.postcode && formik.errors.address?.postcode && <div>{formik.errors.address.postcode}</div>}
          </div>
          <div>
            <label htmlFor="country">Country : </label>
            <select
              id="country"
              name="address.country"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address.country}
            >
              <option value="" label="Select a country" />
              {contries?.map((i, j) => <option key={j} value={i.country_id} label={i.name}  > </option>)}
            </select>
            {formik.touched.address?.country && formik.errors.address?.country && <div>{formik.errors.address.country}</div>}
          </div>
          <div>
            <label htmlFor="state">Region / State : </label>
            <select
              id="state"
              name="address.state"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address.state}
            >
              <option value="" label="Select a State" />
              {allState?.map((i, j) => <option key={j} value={i.state_id} label={i.name}  > </option>)}
            </select>
            {formik.touched.address?.state && formik.errors.address?.state && <div>{formik.errors.address.state}</div>}
          </div>
          <div>
            <button className='btn' type="button" onClick={() => setCurrentTab(currentTab + 1)}>next</button>
          </div>
        </>}
        {currentTab == 2 && <>
          <div>
            <label htmlFor="payment_method"> Payment Method : </label>
            <select
              id="payment_method"
              name="payment_details.payment_method"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.payment_details.payment_method}
            >
              <option value="" label="Select a State" />
              <option value="case on delivery" label="case on delivery" />
              <option value="online" label="online" />
            </select>
            {formik.touched.payment_details?.payment_method && formik.errors.payment_details?.payment_method && <div>{formik.errors.payment_details.payment_method}</div>}
          </div>
          <div>
            <label htmlFor="payment_transaction_id"> transaction_id : </label>
            <input type="text" id="payment_transaction_id" name="payment_details.payment_transaction_id" onChange={formik.handleChange} value={formik.values.payment_details.payment_transaction_id} />
            {formik.touched.payment_details?.payment_transaction_id && formik.errors.payment_details?.payment_transaction_id && <div>{formik.errors.payment_details.payment_transaction_id}</div>}
          </div>
          <div>
            <button className='btn' type="button" onClick={() => setCurrentTab(currentTab + 1)}>next</button>
          </div>
        </>}
        {currentTab == 3 && <>

          {arrayShow != [] && <div>
            {arrayShow.map((i) => <div className='course_add_line' key={i.course_id}><h5>{i.course_name}</h5>
              <button type='button' className='Cource_remove' onClick={() => handleRemove(i.course_id)}>remove</button>
            </div>)}
          </div>}

          <div className='find_field' ref={dropdownRef}>
            <label>find cource : </label>
            <div className=''>
              <input
                type="text"
                autoComplete="off"
                value={findCource}
                onChange={handlefindcource}
              />
              {dropdownOptions &&
                <ul className={dropdownOptions?.data?.courses && dropdownOptions?.data?.courses.length > 0 ? 'cource_find' : ''}>
                  {dropdownOptions?.data?.courses?.map((suggestion) => (
                    <li key={suggestion.course_id} onClick={() => parsFilterData(suggestion)} className='list_cource'>{suggestion.course_name}</li>
                  ))}
                </ul>}
            </div>
          </div>
          <div>  <button className='btn' type="submit">Submit</button></div>

        </>}
      </form>
      <div>


      </div>
    </div>
  )
}

export default page