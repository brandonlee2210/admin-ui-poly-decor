import React, { useEffect, useState, useCallback } from 'react';
import { BasicTableRow, Pagination, Tag } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { getProductsPaginate, getProductById, deleteProduct } from '@app/api/products.api';
import { getOrdersPaginate, update, deleteOrder } from '@app/api/orders.api';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import * as S from '../components/tables/Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { EditForm } from './EditForm.tsx';
import { OrderDetailsTable } from './OrderDetail/OrderDetailTable';

const orderStatus = {
  1: 'Chờ xác nhận',
  2: 'Đang giao hàng',
  4: 'Đã huỷ',
  5: 'Đã nhận hàng',
};

const colorOrderStatus = {
  1: '#FAAD14',
  2: '#1890FF',
  4: '#F5222D',
  5: '#87D068',
};

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export const OrdersTable: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState('');

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getOrdersPaginate(pagination)
        .then((res) => {
          console.log('res', res);
          if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false });
          }
        })
        .catch((error) => {
          notificationController.error({ message: 'Fetch product data failed' });
          setTableData((tableData) => ({ ...tableData, loading: false }));
        });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  // Hàm xử lí filter theo tên sản phẩm
  const handleFilterByName = (value, record) => {
    console.log(value, record);
    return record.status == value;

    // setTableData((tableData) => ({ ...tableData, loading: true }));
    // getOrdersPaginate(initialPagination)
    //   .then((res) => {
    //     console.log('res', res);
    //     if (isMounted.current) {
    //       setTableData({ data: res.data, pagination: res.pagination, loading: false });
    //     }
    //   })
    //   .catch((error) => {
    //     notificationController.error({ message: 'Fetch product data failed' });
    //     setTableData((tableData) => ({ ...tableData, loading: false }));
    //   });
  };

  const columns: ColumnsType<BasicTableRow> = [
    // {
    //   title: 'STT,
    //   dataIndex: 'orderID',
    // },
    // order date and conver to dd/mm/YYYY
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      render: (text: string) =>
        new Date(text).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      showSorterTooltip: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (text: number) => <span>{`${text.toLocaleString()} VND`}</span>,

      showSorterTooltip: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Full name',
      dataIndex: 'fullname',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: number) => <Status color={colorOrderStatus[text]} text={orderStatus[text]} />,
      filterMode: 'tree',
      filterSearch: true,
      filters: [
        {
          text: 'Status',
          value: 'status',
          children: [
            {
              text: 'Chờ xác nhận',
              value: 1,
            },
            {
              text: 'Đang giao hàng',
              value: 2,
            },
            {
              text: 'Đã giao hàng',
              value: 3,
            },
            {
              text: 'Đã huỷ',
              value: 4,
            },
          ],
        },
      ],
      onFilter: (value: string | number | boolean, record: BasicTableRow) => handleFilterByName(value, record),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { name: string; _id: number }) => {
        return (
          <BaseSpace>
            <BaseButton
              type="ghost"
              onClick={() => {
                setEditingOrderId(record._id);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </BaseButton>
            <BaseButton
              type="default"
              danger
              onClick={() => {
                setEditingOrderId(record._id);
                setIsViewModalOpen(true);
              }}
            >
              View Details
            </BaseButton>
          </BaseSpace>
        );
      },
    },
  ];

  return (
    <>
      <BaseModal
        title={'Update order status'}
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
        width={'70%'}
        footer={null}
      >
        <EditForm
          onSaveSuccess={() => {
            setIsEditModalOpen(false);
            fetch(tableData.pagination);
          }}
          orderId={editingOrderId}
        />
      </BaseModal>
      <BaseModal
        title={'Edit product'}
        open={isViewModalOpen}
        onOk={() => setIsViewModalOpen(false)}
        onCancel={() => setIsViewModalOpen(false)}
        width={'100%'}
        footer={null}
      >
        <OrderDetailsTable orderId={editingOrderId} />
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={tableData.data}
        pagination={tableData.pagination}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
        bordered
      />
    </>
  );
};
