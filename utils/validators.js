module.exports.validateClientRegisterInput = (
  full_name,

  password
) => {
  const errors = {};
  if (full_name.trim() === "") {
    errors.full_name = "full name must not be empty";
  }

  if (city.trim() === "") {
    errors.city = "city must not be empty";
  }
  if (district.trim() === "") {
    errors.district = "district must not be empty";
  }
  if (street.trim() === "") {
    errors.email = "street must not be empty";
  }
  if (zip.trim() === "") {
    errors.zip = "zip must not be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateClientLoginInput = (phone, password) => {
  const errors = {};

  if (phone.trim() === "") {
    errors.email = "phone number must not be empty";
  }
  if (phone.length != 9 || !["5", "6", "7"].includes(phone[0])) {
    errors.phone = "phone number must be valid Algerian number  ";
  }

  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateBeautyProRegisterInput = (
  full_name,

  email,
  password,
  street,
  city,
  district,
  zip
) => {
  const errors = {};
  if (full_name.trim() === "") {
    errors.full_name = "full name must not be empty";
  }
  if (street.trim() === "") {
    errors.email = "street must not be empty";
  }
  if (city.trim() === "") {
    errors.city = "city must not be empty";
  }
  if (district.trim() === "") {
    errors.district = "district must not be empty";
  }
  if (street.trim() === "") {
    errors.email = "street must not be empty";
  }
  if (zip.trim() === "") {
    errors.zip = "zip must not be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateBeautyProLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
