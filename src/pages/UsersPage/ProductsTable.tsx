import React, { useEffect, useState, useCallback } from 'react';
import { BasicTableRow, Pagination, Tag } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Table } from 'antd';
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
import { getUsersPaginate, update, deleteProduct } from '@app/api/products.api';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
// import * as S from '../components/tables/Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { ValidationForm } from './AddForm.tsx';
import { EditForm } from './EditForm.tsx';
import { SearchInput } from '@app/components/common/inputs/SearchInput/SearchInput';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 4,
};

export const ProductsTable: React.FC = () => {
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
      getUsersPaginate(pagination)
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

  const handleDeleteRow = async (rowId: number) => {
    let res = await deleteProduct(rowId);

    if (res._id) {
      notificationController.success({ message: 'Delete product successfully' });
      fetch(initialPagination);
      return;
    }

    notificationController.error({ message: 'Delete product failed' });
  };

  // Hàm xử lí filter theo tên sản phẩm
  const handleFilterByName = (value, record) => {};

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Username',
      dataIndex: 'username',
      render: (text: string) => <span>{text}</span>,

      onFilter: (value: string | number | boolean, record: BasicTableRow) => handleFilterByName(value, record),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      showSorterTooltip: false,
    },

    {
      title: 'Image',
      dataIndex: 'image',
      render: (text: string) => <img src={text} alt="product" style={{ width: '100px', height: '100px' }} />,
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
                setEditingProductId(record._id);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </BaseButton>
            <BaseButton type="default" danger onClick={() => handleDeleteRow(record._id)}>
              {t('tables.delete')}
            </BaseButton>
          </BaseSpace>
        );
      },
    },
  ];

  return (
    <>
      {/* <BaseButton type="primary" className="mb-3" onClick={() => setIsBasicModalOpen(true)}>
        Add new product
      </BaseButton> */}
      <BaseModal
        title={'Add new category'}
        open={isBasicModalOpen}
        onOk={() => setIsBasicModalOpen(false)}
        onCancel={() => setIsBasicModalOpen(false)}
        width={'70%'}
        footer={null}
      >
        <ValidationForm
          onSaveSuccess={() => {
            setIsBasicModalOpen(false);
            fetch(tableData.pagination);
          }}
        />
      </BaseModal>
      <BaseModal
        title={'Edit product'}
        open={isEditModalOpen}
        onOk={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
        width={'70%'}
        footer={null}
      >
        <EditForm
          productId={editingProductId}
          onSaveSuccess={() => {
            setIsEditModalOpen(false);
            fetch(tableData.pagination);
          }}
        />
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
