import React from 'react';
import { useTranslation } from 'react-i18next';
import { GradientStackedAreaChart } from '@app/components/charts/GradientStackedAreaChart/GradientStackedAreaChart';
import { ScreeningsCard } from '@app/components/medical-dashboard/screeningsCard/ScreeningsCard/ScreeningsCard';
import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
import { ScatterChart } from '@app/components/charts/ScatterChart/ScatterChart';
import { LineRaceChart } from '@app/components/charts/LineRaceChart/LineRaceChart';
import { TreatmentCard } from '@app/components/medical-dashboard/treatmentCard/TreatmentCard';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import MostSellingProductsChart from '../components/charts/MostSellingProducts';
import Statistics from '../components/charts/Statistics';
import RevenueTable from '../components/charts/RevenueTable';

const ChartsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.charts')}</PageTitle>
      <h2>Sản phẩm bán nhiều nhất theo từng tháng</h2>
      <MostSellingProductsChart />
      <Statistics />
      <RevenueTable />
      {/* <BaseRow gutter={[30, 30]}>
        <BaseCol id="pie" xs={24} lg={12}>
          <VisitorsPieChart />
        </BaseCol>
      </BaseRow> */}
    </>
  );
};

export default ChartsPage;
