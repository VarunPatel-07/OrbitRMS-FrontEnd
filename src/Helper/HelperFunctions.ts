import validator from "validator";

export const isValidEmail = (email: string) => {
  const isValid = validator.isEmail(email);
  return isValid;
};

export const UniqueMetaTagGeneratingFunction = (lengthOfString: number) => {
  const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characterLength = character.length;
  let uniqueString = "";
  for (let i = 0; i < lengthOfString; i++) {
    uniqueString += character.charAt(Math.floor(Math.random() * characterLength));
  }
  const timeStamp = Date.now().toString(36);
  return `${uniqueString}-${timeStamp}`;
};
