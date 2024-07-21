import axios from 'axios';

export const getCategories = async (pagination) => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/categories');

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
