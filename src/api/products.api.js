import axios from 'axios';

export const getProducts = async (pagination) => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/variants');

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductsPaginate = async (pagination) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/variants?page=${pagination.current}&limit=${pagination.pageSize}`,
    );

    console.log('response', response);
    for (let i = 0; i < response.data.length; i++)
      response.data[i].category = await getCategoryById(response.data[i].categoryId);

    // revert data the last go first

    return response.data;
  } catch (error) {
    console.log(error);
  }

  // You may want to handle the error differently depending on your application's requirements
};

export const addNewProduct = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/variants', data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;

  // You may want to handle the error differently depending on your application's requirements
};

export const getCategories = async (pagination) => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/categories');

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/variants/${id}`);

    return response.data;

    // You can modify the return statement based on your application's requirements,
    // such as returning a specific piece of data or transforming the response data
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/variants/${id}`);

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
    const response = await axios.put(`http://localhost:8000/api/v1/variants/${id}`, data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};
