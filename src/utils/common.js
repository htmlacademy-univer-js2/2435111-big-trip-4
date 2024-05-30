const PRICE_FIELD_PATTERN = /\D+/;

const validatePriceField = (value) => {
  if (PRICE_FIELD_PATTERN.test(value)) {
    value = 0;
  }
  return +value;
};

const ucFirst = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};

export { ucFirst, validatePriceField };
