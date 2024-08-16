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
import { getProductsPaginate, update, deleteProduct } from '@app/api/products.api';
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

  // create variant nested table from product
  const expandedRowRender = (parentRecord) => {
    const columns = [
      { title: 'STT', dataIndex: 'indexNumber', key: 'indexNumber' },
      { title: 'Variant color', dataIndex: 'variantColor', key: 'variantColor' },
      { title: 'Variant material', dataIndex: 'variantMaterial', key: 'variantMaterial' },
      { title: 'Variant price', dataIndex: 'variantPrice', key: 'variantPrice' },
      { title: 'Variant stock', dataIndex: 'variantQuantity', key: 'variantQuantity' },
    ];

    // transform parenst record array colors and materials to child columns
    const childData = [];

    if (parentRecord.variants.length > 0) {
      for (let i = 0; i < parentRecord.variants.length; ++i) {
        childData.push({
          key: `variant-${i}`,
          indexNumber: i + 1,
          variantName: parentRecord.variants[i].variantName,
          variantColor: parentRecord.variants[i].color,
          variantMaterial: parentRecord.variants[i].material,
          variantPrice: `${parentRecord.variants[i].price} vnd`,
          variantQuantity: parentRecord.variants[i].quantity,
        });
      }
    }

    return <Table columns={columns} dataSource={childData} pagination={false} />;
  };
  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getProductsPaginate(pagination)
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

    // setTableData({
    //   ...tableData,
    //   data: tableData.data.filter((item) => item._id !== rowId),
    //   pagination: {
    //     ...tableData.pagination,
    //     total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
    //   },
    // });
  };

  // Hàm xử lí filter theo tên sản phẩm
  const handleFilterByName = (value, record) => {
    console.log(value, record);
    // setTableData({
    //   ...tableData,
    //   data: tableData.data.filter((item) => item.name.includes(value)),
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
      onFilter: (value: string | number | boolean, record: BasicTableRow) => handleFilterByName(value, record),
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
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (text: string) => <img src={text} alt="product" style={{ width: '100px', height: '100px' }} />,
    },

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
      <SearchInput placeholder="Search product" style={{ width: 500, marginBottom: 10 }} loading={false} />
      <BaseButton type="primary" className="mb-3" onClick={() => setIsBasicModalOpen(true)}>
        Add new product
      </BaseButton>
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
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['1'],
          onExpandedRowsChange: (key) => console.log(key),
        }}
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
