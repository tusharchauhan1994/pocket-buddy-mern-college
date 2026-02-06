// Registration validation
export const signUpValidation = {
  name: {
    required: "Name is required",
    minLength: { value: 3, message: "Name must be at least 3 characters" },
  },
  age: {
    required: "Age is required",
    min: {
      value: 12,
      message: "You must be at least 12 years old",
    },
    max: {
      value: 100,
      message: "Age cannot be more than 100",
    },
  },
  email: {
    required: "Email is required",
    pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email format" },
  },
  password: {
    required: "Password is required",
    minLength: { value: 6, message: "Password must be at least 6 characters" },
  },
};


// Login validation
export const signInValidation = {
  email: {
    required: "Email is required",
    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
  },

  password: {
    required: "Password is required",
  },
};

// Forgot Password validation
export const forgotPasswordValidation = {
  email: {
    required: "Email is required",
    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
  },
};



//********** Restaurant **********//

//  Restaurant Validation 
export const restaurantValidation = {
  title: {
    required: "Restaurant Name is required",
    minLength: { value: 3, message: "Restaurant Name must be at least 3 characters long" },
  },
  category: {
    required: "Category is required",
  },
  stateId: {
    required: "State is required",
  },
  cityId: {
    required: "City is required",
  },
  areaId: {
    required: "Area is required",
  },
  foodTypeId: {
    required: "Food Type is required",
  },
  contactNumber: {
    required: "Contact Number is required",
    pattern: { value: /^[0-9]{10}$/, message: "Invalid contact number (must be 10 digits)" },
  },
  address: {
    required: "Address is required",
    minLength: { value: 5, message: "Address must be at least 5 characters long" },
  },
  latitude: {
    required: "Latitude is required",
    pattern: { value: /^-?([1-8]?[0-9]|90)\\.\\d{1,6}$/, message: "Invalid latitude format" },
  },
  longitude: {
    required: "Longitude is required",
    pattern: { value: /^-?((1?[0-7]|[0-9])?[0-9]|180)\\.\\d{1,6}$/, message: "Invalid longitude format" },
  },
  image: {
    required: "Restaurant image is required",
  },
};



// Add-Offer validation
export const offerValidation = {
  title: {
    required: "Offer title is required",
    minLength: { value: 3, message: "Title must be at least 3 characters" },
  },
  description: {
    required: "Description is required",
    minLength: { value: 10, message: "Description must be at least 10 characters" },
  },
  offerType: {
    required: "Please select an offer type",
  },
  couponCode: {
    pattern: { value: /^[A-Za-z0-9]+$/, message: "Invalid coupon code format" },
  },
  startDate: {
    required: "Start date is required",
  },
  endDate: {
    required: "End date is required",
  },
  minOrderAmount: {
    required: "Minimum order amount is required",
    min: { value: 1, message: "Minimum amount must be at least 1" },
  },
  image: {
    required: "Offer image is required",
  },
};
