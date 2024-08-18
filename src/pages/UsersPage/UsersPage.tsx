import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import * as S from './Tables.styles';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { ValidationForm } from './AddForm.tsx';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BasicTableRow, Pagination } from 'api/table.api';
import { ProductsTable } from './ProductsTable';

const initialPagination = {
  current: 1,
  pageSize: 5,
};

const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={'Users List'} padding="1.25rem 1.25rem 0">
          <ProductsTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default ProductsPage;
