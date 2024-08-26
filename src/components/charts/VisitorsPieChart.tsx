import React, { useState, useEffect } from 'react';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useTranslation } from 'react-i18next';
import { PieChart } from '../common/charts/PieChart';
import { getCategories } from '@app/api/categories.api';

export const VisitorsPieChart: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const data = [
    { value: 1048, name: t('charts.search') },
    { value: 735, name: t('charts.direct') },
    { value: 580, name: t('common.email') },
    { value: 484, name: t('charts.union') },
    { value: 300, name: t('charts.video') },
  ];

  const fetch = () => {
    getCategories()
      .then((res) => {
        console.log(res);
        setCategories(res.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  const name = t('charts.visitorsFrom');

  return (
    <BaseCard padding="0 0 1.875rem" title={'Số lượng sản phẩm theo danh mục'}>
      <PieChart data={data} name={name} showLegend={true} />
    </BaseCard>
  );
};
