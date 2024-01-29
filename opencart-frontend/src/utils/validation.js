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
    state: '',
    default_address: 1,
  },
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
});