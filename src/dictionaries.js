const dictionaries = {
  en: require('./messages/en.json'),
  ar: require('./messages/ar.json'),
};

export const getDictionary = locale => {
  return dictionaries[locale];
};
