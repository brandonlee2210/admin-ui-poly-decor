import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableCell } from '../../components/tables/editableTable/EditableCell';
import { EditableTable } from '../../components/tables/editableTable/EditableTable';
import {
  getCategories,
  updateVariantsProduct,
  deleteVariantsProduct,
  getVariantsProductt,
} from '@app/api/categories.api';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { ValidationForm } from './AddForm.tsx';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BasicTableRow, Pagination } from 'api/table.api';
import { Modal, Button } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';

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
  const [deleteKey, setDeleteKey] = useState(null);
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

      getVariantsProductt(pagination)
        .then((res) => {
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

        let res = await updateVariantsProduct(dataUpdate._id, dataUpdate);

        if (res._id) {
          notificationController.success({ message: t('common.success'), description: 'Update variant successfully' });
        } else {
          notificationController.error({ message: t('common.error'), description: 'Update variant failed' });
        }
      } else {
        newData.push(row);
      }

      fetch(tableData.pagination);
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      notificationController.error({ message: t('common.error'), description: 'Update variant failed' });
    }
  };

  const handleDeleteRow = async () => {
    try {
      let res = await deleteVariantsProduct(deleteKey);
      if (res) {
        fetch(tableData.pagination);
        notificationController.success({ message: t('common.success'), description: 'Delete variant successfully' });
      } else {
        notificationController.error({ message: t('common.error'), description: ' Delete variant failed' });
        console.log('Error deleting row:', res);
      }
    } catch (errInfo) {
      notificationController.error({ message: t('common.error'), description: 'Delete variant failed' });
      console.log('Error:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Variant Name',
      dataIndex: 'variantProductName',
      width: '45%',
      editable: true,
    },
    {
      title: 'Variant type',
      dataIndex: 'variantProductType',
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
                    setIsModalOpen(true);
                    setDeleteKey(record._id);
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
        <p>Bạn có chắc chắn muốn xoá biến thể này không?</p>
      </Modal>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <BaseButton type="primary" className="mb-3" onClick={() => setIsBasicModalOpen(true)} icon={<PlusOutlined />}>
        Add new variant
      </BaseButton>
      <BaseModal
        title={'Add new variant'}
        open={isBasicModalOpen}
        onOk={() => {
          setIsBasicModalOpen(false);
          form.resetFields();
        }}
        onCancel={() => {
          console.log('hi');
          setIsBasicModalOpen(false);
          form.resetFields();
        }}
        width={'70%'}
        footer={null}
      >
        <ValidationForm
          onSaveSuccess={() => {
            setIsBasicModalOpen(false);
            form.resetFields();
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
