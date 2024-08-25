import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BasicTableRow, Pagination, Tag } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Table, Modal, Button } from 'antd';
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
import * as XLSX from 'xlsx';

import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportToExcel = () => {
    const data = tableData.data;

    // get rid of _id, variantID createdDate, updatedDate, _v
    const filteredData = data.map((row) => ({
      ID: row._id,
      Name: row.name,
      'Category Name': row.categoryName,
      Description: row.description,
    }));

    // add all variants of each table to an array of objects
    const variants: any[] = [];
    data.forEach((row) => {
      row.variants.forEach((variant) => {
        variants.push({
          name: row.name,
          color: variant.color,
          material: variant.material,
          price: variant.price,
          quantity: variant.quantity,
          status: variant.status,
        });
      });
    });

    console.log(variants);

    // return;

    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Apply styles to the header row
    const header = Object.keys(filteredData[0]);
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
      fill: {
        fgColor: { rgb: 'FFFF00' }, // Yellow background color
      },
    };

    header.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: 's', v: key };
      worksheet[cellAddress].s = headerStyle;
    });

    // Apply styles to the data rows
    const dataStyle = {
      alignment: { horizontal: 'left' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    data.forEach((row, rowIndex) => {
      Object.values(row).forEach((value, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: 's', v: value };
        worksheet[cellAddress].s = dataStyle;
      });
    });

    // add variants in data to sheet 2

    const worksheet2 = XLSX.utils.json_to_sheet(variants);
    const header2 = ['Variants'];
    const header2Style = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
      fill: {
        fgColor: { rgb: 'FFFF00' }, // Yellow background color
      },
    };

    header2.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index + header.length });
      if (!worksheet2[cellAddress]) worksheet2[cellAddress] = { t: 's', v: key };
      worksheet2[cellAddress].s = header2Style;
    });

    variants.forEach((row, rowIndex) => {
      Object.values(row).forEach((value, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: header.length + colIndex });
        if (!worksheet2[cellAddress]) worksheet2[cellAddress] = { t: 's', v: value };
      });
    });

    const workbook = XLSX.utils.book_new();

    // append sheet
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Variants');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Products.xlsx');
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Read the first sheet (Products)
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log(jsonData);

      // Process the JSON data for products
      const headers = jsonData[0] as string[];

      // convert name to Name, Category Name to categoryName
      headers.forEach((header, index) => {
        if (header === 'Name') headers[index] = 'name';
        if (header === 'Category Name') headers[index] = 'categoryName';
        if (header === 'Description') headers[index] = 'description';
        if (header === 'ID') headers[index] = '_id';
      });

      // convert color, material, status to Color, Material, Status respectively
      // headers.forEach((header, index) => {
      //   if (header === 'color') headers[index] = 'Color';
      //   if (header ==='material') headers[index] = 'Material';
      //   if (header ==='status') headers[index] = 'Status';
      // });

      // convert price, quantity to Price, Quantity respectively
      const rows = jsonData.slice(1).map((row) => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      // Read the second sheet (Variants)
      const secondSheetName = workbook.SheetNames[1];
      const worksheet2 = workbook.Sheets[secondSheetName];
      const jsonVariantsData = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });

      // Process the JSON data for variants
      const variantHeaders = jsonVariantsData[0] as string[];
      const variants = jsonVariantsData.slice(1).map((row) => {
        const rowData: any = {};
        variantHeaders.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      // Add variants to the corresponding products
      rows.forEach((product) => {
        product.variants = variants.filter((variant) => variant.productId === product.id);
      });

      console.log(rows);

      setTableData((prevState) => ({
        ...prevState,
        data: [...prevState.data, ...rows],
      }));
    };
    reader.readAsArrayBuffer(file);
  };

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
  };

  const handleFilterByName = (value, record) => {
    console.log(value, record);
  };

  const handleExpand = (expanded, record) => {
    const keys = expanded ? [record.key] : [];
    setExpandedRowKeys(keys);
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
      title: 'Description',
      dataIndex: 'description',
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
      <SearchInput placeholder="Search product" style={{ width: 500, marginBottom: 10 }} loading={false} />
      <div className="flex gap-3">
        <BaseButton type="primary" className="mb-3" onClick={() => setIsBasicModalOpen(true)} icon={<PlusOutlined />}>
          Add new product
        </BaseButton>
        <Button onClick={exportToExcel} icon={<DownloadOutlined />}>
          Export to Excel
        </Button>
        <Button type="primary" onClick={() => fileInputRef.current?.click()} icon={<UploadOutlined />}>
          Import from Excel
        </Button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={importFromExcel}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
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
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        columns={columns}
        dataSource={tableData.data.map((item) => ({ ...item, key: item._id }))}
        pagination={tableData.pagination}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
        bordered
      />
    </>
  );
};
