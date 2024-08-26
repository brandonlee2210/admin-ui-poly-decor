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

export const getVariantsProductt = async (pagination) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/variantProducts?page=${pagination.current}&limit=${pagination.pageSize}`,
    );
    console.log('response', response);
    return response.data;
    // You may want to handle the error differently depending on your application's requirements
  } catch (error) {
    console.log(error);
  }
};

export const getAllVariantsProduct = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/variantProducts');
    console.log('response', response);
    return response.data;
    // You may want to handle the error differently depending on your application's requirements
  } catch (error) {
    console.log(error);

    // You may want to handle the error differently depending on your application's requirements
  }
  return null;
};

export const updateVariantsProduct = async (id, data) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/v1/variantproducts/${id}`, data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
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

export const addNewVariant = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/variantProducts', data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;

  // You may want to handle the error differently depending on your application's requirements
};

export const deleteVariantsProduct = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/variantProducts/${id}`);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
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
