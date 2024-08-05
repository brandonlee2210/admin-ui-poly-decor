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
import { getProductsPaginate, update, deleteProduct } from '@app/api/products.api';
import { getOrderDetailsByOrderID } from '@app/api/orders.api';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import * as S from '../components/tables/Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { ValidationForm } from './AddForm.tsx';
import { EditForm } from './EditForm.tsx';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 4,
};

export const OrderDetailsTable: React.FC = ({ orderId }) => {
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState('');

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getOrderDetailsByOrderID(orderId)
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
  }, [fetch, orderId]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  const handleDeleteRow = async (rowId: number) => {
    let res = await deleteProduct(rowId);

    if (res._id) {
      notificationController.success({ message: 'Delete product successfully' });
      fetch(initialPagination);
      return;
    }

    notificationController.error({ message: 'Delete product failed' });

    // setTableData({
    //   ...tableData,
    //   data: tableData.data.filter((item) => item._id !== rowId),
    //   pagination: {
    //     ...tableData.pagination,
    //     total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
    //   },
    // });
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      render: (text: string) => <span>{text}</span>,
      filterMode: 'tree',
      filterSearch: true,
      filters: [
        {
          text: t('common.firstName'),
          value: 'firstName',
          children: [
            {
              text: 'Joe',
              value: 'Joe',
            },
            {
              text: 'Pavel',
              value: 'Pavel',
            },
            {
              text: 'Jim',
              value: 'Jim',
            },
            {
              text: 'Josh',
              value: 'Josh',
            },
          ],
        },
        {
          text: t('common.lastName'),
          value: 'lastName',
          children: [
            {
              text: 'Green',
              value: 'Green',
            },
            {
              text: 'Black',
              value: 'Black',
            },
            {
              text: 'Brown',
              value: 'Brown',
            },
          ],
        },
      ],
      onFilter: (value: string | number | boolean, record: BasicTableRow) => record.name.includes(value.toString()),
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.categoryName.localeCompare(b.categoryName),
      showSorterTooltip: false,
      filters: [
        {
          text: 'Electronics',
          value: 'Electronics',
        },
        {
          text: 'Clothing',
          value: 'Clothing',
        },
        {
          text: 'Books',
          value: 'Books',
        },
      ],
      onFilter: (value: string, record: BasicTableRow) => record.categoryName.includes(value),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      showSorterTooltip: false,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.stock - b.stock,
      showSorterTooltip: true,
    },
    {
      title: 'Material',
      dataIndex: 'material',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    // {
    //   title: 'Image',
    //   dataIndex: 'image',
    //   render: (text: string) => <img src={`./sofa-kem.jpg`} style={{ width: 50, height: 50 }} />,
    // },

    // {
    //   title: t('common.tags'),
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: (tags: Tag[]) => (
    //     <BaseRow gutter={[10, 10]}>
    //       {tags.map((tag: Tag) => {
    //         return (
    //           <BaseCol key={tag.value}>
    //             <Status color={defineColorByPriority(tag.priority)} text={tag.value.toUpperCase()} />
    //           </BaseCol>
    //         );
    //       })}
    //     </BaseRow>
    //   ),
    // },
  ];

  return (
    <>
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
