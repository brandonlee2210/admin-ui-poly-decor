import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableCell } from '../components/tables/editableTable/EditableCell';
import { EditableTable } from '../components/tables/editableTable/EditableTable';
import { getCategories } from '@app/api/categories.api';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
// import * as S from '../components/tables/Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';

const CategoriesPage = () => {
  const { t } = useTranslation();

  const [form] = BaseForm.useForm();

  const [editingKey, setEditingKey] = useState(0);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
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
                <BaseButton type="primary" onClick={() => save(record.key)}>
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
                <BaseButton type="default" danger onClick={() => handleDeleteRow(record.key)}>
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

  console.log('merger', mergedColumns);

  return (
    <>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <EditableTable getDataTable={getCategories} columns={mergedColumns} form={form} />
    </>
  );
};

export default CategoriesPage;
