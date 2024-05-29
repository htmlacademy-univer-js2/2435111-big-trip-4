const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElementsArray = (arr, length) => {
  const values = [];
  while (values.length < length) {
    const currentElement = getRandomArrayElement(arr);
    values.push(currentElement);
  }
  return values;
};

const ucFirst = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};

export { getRandomArrayElement, getRandomInteger, getRandomElementsArray, ucFirst };
