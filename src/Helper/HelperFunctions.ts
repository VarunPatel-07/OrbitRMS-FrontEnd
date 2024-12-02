import validator from "validator";

export const isValidEmail = (email: string) => {
  const isValid = validator.isEmail(email);
  return isValid;
};
