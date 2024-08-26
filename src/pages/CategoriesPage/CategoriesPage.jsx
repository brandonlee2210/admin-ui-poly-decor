import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableCell } from '../../components/tables/editableTable/EditableCell';
import { EditableTable } from '../../components/tables/editableTable/EditableTable';
import { getCategories, update, deleteCategory } from '@app/api/categories.api';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { Modal, Button } from 'antd';
// import * as S from '../components/tables/Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { ValidationForm } from './AddForm.tsx';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BasicTableRow, Pagination } from 'api/table.api';

const initialPagination = {
  current: 1,
  pageSize: 5,
};

const CategoriesPage = () => {
  const { t } = useTranslation();

  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [form] = BaseForm.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState(0);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    await handleDeleteRow();
    setIsModalOpen(false);
  };

  const [tableData, setTableData] = useState({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));

      getCategories(pagination)
        .then((res) => {
          console.log(res);
          if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false });
          }
        })
        .catch((error) => {
          setTableData((tableData) => ({ ...tableData, loading: false }));
        });
    },
    [isMounted, getCategories],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination) => {
    fetch(pagination);
    cancel();
  };

  // Gọi method từ th con
  // const childRef = useRef(null);

  // const callChildFunction = () => {
  //   console.log(childRef);
  //   if (childRef.current) {
  //     console.log('childRef.current', childRef.current);
  //     childRef.current.syncData();
  //   }
  // };

  const isEditing = (record) => {
    return record._id === editingKey;
  };

  const edit = (record) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];

        let dataUpdate = {
          _id: item._id,
          ...row,
        };

        let res = await update(dataUpdate._id, dataUpdate);

        if (res._id) {
          notificationController.success({ message: t('common.success'), description: 'Update category successfully' });
        } else {
          notificationController.error({ message: t('common.error'), description: 'Update category failed' });
        }
      } else {
        newData.push(row);
      }

      fetch(tableData.pagination);
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      notificationController.error({ message: t('common.error'), description: 'Update category failed' });
    }
  };

  const handleDeleteRow = async () => {
    try {
      let res = await deleteCategory(deleteKey);
      console.log(res);
      if (res) {
        fetch(tableData.pagination);
        notificationController.success({ message: t('common.success'), description: 'Delete category successfully' });
      } else {
        notificationController.error({ message: t('common.error'), description: ' Delete category failed' });
        console.log('Error deleting row:', res);
      }
    } catch (errInfo) {
      notificationController.error({ message: t('common.error'), description: 'Delete category failed' });
      console.log('Error:', errInfo);
    }
    // setTableData({ ...tableData, data: tableData.data.filter((item) => item.key !== rowId) });
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      width: '45%',
      editable: true,
    },
    {
      title: 'Category ID',
      dataIndex: 'categoryID',
      width: '40%',
      editable: false,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: '15%',
      render: (text, record) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ? (
              <>
                <BaseButton type="primary" onClick={() => save(record._id)}>
                  {t('common.save')}
                </BaseButton>
                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <BaseButton type="ghost">{t('common.cancel')}</BaseButton>
                </BasePopconfirm>
              </>
            ) : (
              <>
                <BaseButton type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  {t('common.edit')}
                </BaseButton>
                <BaseButton
                  type="default"
                  danger
                  onClick={() => {
                    setDeleteKey(record._id);
                    setIsModalOpen(true);
                  }}
                >
                  {t('tables.delete')}
                </BaseButton>
              </>
            )}
          </BaseSpace>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // remounted EditableTable

  return (
    <>
      <Modal
        title="Xác nhận"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Không
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Có
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xoá danh mục này không?</p>
      </Modal>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <BaseButton type="primary" className="mb-3" onClick={() => setIsBasicModalOpen(true)} icon={<PlusOutlined />}>
        Add new category
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
      <BaseForm form={form} component={false}>
        <BaseTable
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={tableData.data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            ...tableData.pagination,
            onChange: cancel,
          }}
          onChange={handleTableChange}
          loading={tableData.loading}
          scroll={{ x: 800 }}
        />
      </BaseForm>
    </>
  );
};

export default CategoriesPage;
