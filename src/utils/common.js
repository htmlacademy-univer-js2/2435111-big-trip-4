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

export { getRandomArrayElement, getRandomInteger, getRandomElementsArray };
