import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';

import { getListData } from '@app/api/orders.api';

const Statistics = () => {
  // Dữ liệu mẫu: Thay thế bằng dữ liệu thực tế của bạn
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    // Fetch dữ liệu từ API nếu cần
    getListData().then((data) => {
      setStatistics(data);
    });
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={5}>
          <Card title="Total Users" bordered={false} style={{ backgroundColor: '#1890ff', color: '#fff' }}>
            {statistics.users}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Total Products" bordered={false} style={{ backgroundColor: '#52c41a', color: '#fff' }}>
            {statistics.variants}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Total Orders" bordered={false} style={{ backgroundColor: '#faad14', color: '#fff' }}>
            {statistics.orders}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Total Revenue" bordered={false} style={{ backgroundColor: 'red', color: '#fff' }}>
            {statistics.totalRevenue}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
