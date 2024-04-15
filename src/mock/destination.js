import { getRandomArrayElement, getRandomElementsArray, getRandomInteger } from '../utils.js';

const CITY_NAMES = ['Chamonix', 'Amsterdam', 'Geneva', 'Paris', 'Berlin', 'Tokyo'];

const DESTINATION_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.In rutrum ac purus sit amet tempus.'
];

const MIN_DESCRIPTIONS = 1;
const MAX_DESCRIPTIONS = 5;

const MIN_PICTURES = 2;
const MAX_PICTURES = 6;

const createPicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
  description: getRandomArrayElement(DESTINATION_DESCRIPTIONS)
});

const createDestination = (index) => ({
  id: index + 1,
  description: getRandomElementsArray(DESTINATION_DESCRIPTIONS, getRandomInteger(MIN_DESCRIPTIONS, MAX_DESCRIPTIONS)),
  name: getRandomArrayElement(CITY_NAMES),
  pictures: Array.from({ length: getRandomInteger(MIN_PICTURES, MAX_PICTURES) }, createPicture)
});

export { createDestination };
