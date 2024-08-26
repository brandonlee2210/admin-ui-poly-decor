import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { DatePicker, Select, Space, Card } from 'antd';
import moment from 'moment';

const { Option } = Select;

const generateFakeData = (startDate, endDate) => {
  const months = [];
  const data = [];
  let current = moment(startDate).startOf('month');

  while (current <= moment(endDate).endOf('month')) {
    months.push(current.format('YYYY-MM'));
    data.push({
      month: current.format('YYYY-MM'),
      totalRevenue: Math.floor(Math.random() * 10000000) + 1000, // Random revenue between 1000 and 11000
    });
    current = current.add(1, 'month');
  }

  return data;
};

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(moment().startOf('year'));
  const [endDate, setEndDate] = useState(moment().endOf('year'));

  useEffect(() => {
    // Generate fake data
    const fakeData = generateFakeData(startDate, endDate);
    setData(fakeData);
  }, [startDate, endDate]);

  const config = {
    data,
    xField: 'month',
    yField: 'totalRevenue',
    xAxis: { type: 'month', tickCount: 12 },
    yAxis: { title: 'Doanh thu (VND)' },
    smooth: true,
    height: 400,
  };

  return (
    <Card title="Doanh thu theo tháng">
      <Space style={{ marginBottom: 16 }}>
        <DatePicker value={startDate} onChange={(date) => setStartDate(date)} picker="month" format="YYYY-MM" />
        <DatePicker value={endDate} onChange={(date) => setEndDate(date)} picker="month" format="YYYY-MM" />
      </Space>
      <Line {...config} />
    </Card>
  );
};

export default RevenueChart;
