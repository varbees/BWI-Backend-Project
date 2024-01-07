import asyncHandler from './asyncHandler.js';

const validatePhone = phone => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validationHandler = (res, { email, phoneNumber }) => {
  const errors = [];
  console.log(email, phoneNumber);
  if (email && !validateEmail(email)) {
    errors.push('Invalid email format');
  }
  if (phoneNumber && !validatePhone(phoneNumber)) {
    errors.push('Invalid phone number');
  }

  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors);
  }
};

export default validationHandler;
