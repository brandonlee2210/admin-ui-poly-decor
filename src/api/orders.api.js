import axios from 'axios';

export const getProducts = async (pagination) => {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/orders');

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrdersPaginate = async (pagination) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/orders?page=${pagination.current}&limit=${pagination.pageSize}`,
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }

  // You may want to handle the error differently depending on your application's requirements
};

export const addOrder = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/orders', data);

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

export const getOrderDetailsByOrderID = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/orders/details/${id}`);
    return response.data;
    // You can modify the return statement based on your application's requirements,
    // such as returning a specific piece of data or transforming the response data
    // For example, you might want to return a specific piece of data or transform the response data
  } catch (error) {
    console.log(error);
  }
  return null;

  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/orders/${id}`);

    return response.data;

    // You can modify the return statement based on your application's requirements,
    // such as returning a specific piece of data or transforming the response data
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
};

export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/orders/${id}`);

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
    const response = await axios.put(`http://localhost:8000/api/v1/orders/${id}`, data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};

export const getProductsByMonth = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/statistic/products-by-month`);
    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};
export const getStatistics = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/statistic/list-data`);
    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const getProductsByEveryMonth = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1//statistic/revenue-each`);
    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const getListData = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/statistic/list-data`);
    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const updateStock = async (data) => {
  try {
    const response = await axios.post(`http://localhost:8000/api/v1/orders/update-stock`, data);

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
  // You may want to handle the error differently depending on your application's requirements
  // For example, you might want to display an error message to the user
};
