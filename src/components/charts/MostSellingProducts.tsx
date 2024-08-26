import React from 'react';
import { Column } from '@ant-design/charts';
import { useState, useEffect } from 'react';

import { getProductsByMonth } from '@app/api/orders.api';

const MostSellingProductsChart = () => {
  // Sample Data: You should replace this with your actual data
  const data = [
    { month: 'May', product: 'Bộ Sofa Băng Hiện Đại Cho Chung Cư Prestige ', sales: 40 },
    { month: 'May', product: 'Bộ Bàn Ăn 4 Ghế 1m6 ', sales: 23 },
    { month: 'June', product: 'Bộ Bàn Ăn 4 Ghế 1m6 Cao Cấp BA934 ', sales: 30 },
    { month: 'July', product: 'Bộ Sofa Băng Hiện Đại Cho Chung Cư Prestige Pavilion E006 ', sales: 50 },
    { month: 'August', product: 'Bộ Bàn Ăn 4 Ghế 1m6  ', sales: 10 },
  ];

  const [dataReal, setDataReal] = useState(data);

  // useEffect(() => {
  //   getProductsByMonth().then((res) => {
  //     // let data = res?.map((product) => {
  //     //   return {
  //     //     product: product.topItem || 'Ghế sofa',
  //     //     sales: product.itemCount || 1,
  //     //     month: 'September',
  //     //   };
  //     // });
  //     // setDataReal(data);
  //   });
  // }, []);

  // console.log('real, data', dataReal);

  const config = {
    data,
    xField: 'month',
    yField: 'sales',
    seriesField: 'product',
    colorField: 'product',
    columnWidthRatio: 0.8,
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return <Column {...config} />;
};

export default MostSellingProductsChart;
