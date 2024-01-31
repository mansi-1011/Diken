import * as Yup from "yup";

export const initialLogin = { username: "", password: "" };

export const loginScheme = Yup.object({
  username: Yup.string().required("Please enter your username"),
  password: Yup.string().required("Please enter your password"),
});

export const costomerInitialValue = {
  general: {
    name: '',
    email: '',
    password: '',
    telephone: '',
    status: 0,
  },
  address: {
    first_name: '',
    last_name: '',
    company: '',
    company_id: '',
    tax_id: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    country: '',
    state: ''
  },
  payment: {
    payment_method: '',
    transaction_id: ''
  },
  course_order: [
   
  ]
};

export const costomerValidationSchema = Yup.object().shape({
  general: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    telephone: Yup.string().required('Telephone is required'),
    status: Yup.number().required('Status is required'),
  }),
  address: Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    company: Yup.string().required('Company is required'),
    company_id: Yup.string().required('Company ID is required'),
    tax_id: Yup.string().required('Tax ID is required'),
    address_1: Yup.string().required('Address 1 is required'),
    address_2: Yup.string(),
    city: Yup.string().required('City is required'),
    postcode: Yup.string().required('Postcode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
  }),
  payment: Yup.object().shape({
    payment_method: Yup.string().required('Payment Method is required'),
    transaction_id: Yup.string().required('Transaction id is required')
  }),
  course_order: Yup.array().of(
    Yup.object().shape({
      course_id: Yup.number().required('Course ID is required'),
      // expier_date: Yup.string(), // You might want to add a validation for the expiration date if needed
    })
  )
});



export const courceinitalData = {
    course: {
      course_name: "",
      course_description: "",
      course_expired_days: '',
      course_length: '',
      course_number_of_videos: '',
      course_price: '',
      course_status: '',
    },
    course_data: [
      {
        course_data_type: "",
        course_data_title: "",
        course_data_url: "",
        course_data_length: "",
        course_count_of_view: "",
        course_sort_order: "",
      }
    ],
  };


  export const courceValideter = Yup.object({
    course: Yup.object({
      course_name: Yup.string().required('Course name is required'),
      course_description: Yup.string().required('Course discripetion is required'),
      course_expired_days: Yup.string().required('Course exp days is required'),
      course_length: Yup.string().required('Course length is required'),
      course_number_of_videos: Yup.string().required('Course no of video is required'),
      course_price: Yup.string().required('Course price is required'),
      course_status: Yup.string().required('Course status is required'),
      // Add validation rules for other course properties
    }),
    course_data: Yup.array().of(
      Yup.object({
        course_data_type: Yup.string().required('Course data type is required'),
        course_data_title: Yup.string().required('Course data title is required'),
        course_data_url: Yup.string().required('Course data URL is required'),
        course_data_length: Yup.string().required('Course data Length is required'),
        course_sort_order: Yup.string().required('Course data short order is required')
      })
    ),
  });