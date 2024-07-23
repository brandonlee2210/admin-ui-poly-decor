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

export const addNewCategory = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/categories', data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;

  // You may want to handle the error differently depending on your application's requirements
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/categories/${id}`);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/v1/categories/${id}`, data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};
