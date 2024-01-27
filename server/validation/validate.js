import lodash from "lodash";
const { isEmpty } = lodash;

const Validate = (data) => {};

Validate.register = (data) => {
  var errors = {};

  if (!data.name) {
    errors.name = "Name is required";
  } else if (data.name.length < 3) {
    errors.name = "Name should be bigger than 3 chars";
  }

  let Etest =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!Etest.test(data.email)) {
    errors.email = "Enter Valid Email";
  }

  let Ptest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!Ptest.test(data.password)) {
    errors.password = "Enter Valid Password";
  }

  if (!data.password_confirm) {
    errors.password_confirm = "Password Confirmation is required";
  } else if (data.password !== data.password_confirm) {
    errors.password_confirm = "Password and Confirm Password don't match";
  }

  if (isEmpty(errors)) {
    var status = true;
  } else {
    var status = false;
  }
  return {
    status: status,
    errors: errors,
    message: "Please Correct Data",
  };
};

Validate.login = (data) => {
  var errors = {};

  let Etest =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!Etest.test(data.email)) {
    errors.email = "Enter Valid Email";
  }

  let Ptest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!Ptest.test(data.password)) {
    errors.password = "Enter Valid Password";
  }

  if (isEmpty(errors)) {
    var status = true;
  } else {
    var status = false;
  }
  return {
    status: status,
    errors: errors,
    message: "Please Correct Data",
  };
};

Validate.AddModel = (data) => {
  var errors = {};

  // console.log(data);
  if (!data.privacy) {
    errors.privacy = "Privacy is required";
  }
  if (!data.nickname) {
    errors.nickname = "Nickname is required";
  }
  //
  // * Used for occupation validation
  // if (!data.occupation) {
  //     errors.occupation = 'Occupation is required'
  // }
  if (!data.dob) {
    errors.dob = "DOB is required";
  }
  if (!data.vaccinated) {
    errors.vaccinated = "Vaccination info is required";
  }

  if (isEmpty(errors)) {
    var status = true;
  } else {
    var status = false;
  }
  return {
    status: status,
    errors: errors,
    message: "Please Correct Data",
  };
};
Validate.AddFAQ = (data) => {
  var errors = {};

  if (!data.question) {
    errors.question = "Question is required";
  }
  if (!data.answere) {
    errors.answere = "Answere is required";
  }

  if (isEmpty(errors)) {
    var status = true;
  } else {
    var status = false;
  }
  return {
    status: status,
    errors: errors,
    message: "Please Correct Data",
  };
};

Validate.Contact = (data) => {
  var errors = {};

//   if (!data.question) {
//     errors.question = "Question is required";
//   }
  if (!data.mobile) {
    errors.mobile = "Mobile Number is required";
  }

  if (isEmpty(errors)) {
    var status = true;
  } else {
    var status = false;
  }
  return {
    status: status,
    errors: errors,
    message: "Please Correct Data",
  };
};

export default Validate;
