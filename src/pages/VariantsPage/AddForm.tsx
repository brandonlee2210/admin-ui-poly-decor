import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Form } from 'antd';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseSlider } from '@app/components/common/BaseSlider/BaseSlider';
import { BaseUpload } from '@app/components/common/BaseUpload/BaseUpload';
import { BaseRate } from '@app/components/common/BaseRate/BaseRate';
import { notificationController } from '@app/controllers/notificationController';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ConfirmItemPassword } from '../../components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/ConfirmPasswordItem/ConfirmPasswordItem';

import { addNewVariant } from '@app/api/categories.api';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const normFile = (e = { fileList: [] }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const ValidationForm: React.FC = ({ onSaveSuccess }) => {
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = async (values = {}) => {
    try {
      setLoading(true);
      // call axios add new category
      console.log(values);
      let res = await addNewVariant(values);

      if (!res) {
        notificationController.error({ message: t('common.error'), description: 'Add new category failed' });
        return;
      }
      console.log(res);

      // if success, show notification success and log values to console.logo
      notificationController.success({ message: t('common.success') });
      // clear form values
      form.resetFields();
      setLoading(false);
      setFieldsChanged(false);
      onSaveSuccess();

      // else, show notification error and log error to console.error
    } catch (error) {
      notificationController.error({ message: t('common.error'), description: error.message });

      setLoading(false);
      setFieldsChanged(false);
    }
  };

  return (
    <BaseButtonsForm
      {...formItemLayout}
      form={form}
      isFieldsChanged={isFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      name="validateForm"
      initialValues={{
        'input-number': 3,
        'checkbox-group': ['A', 'B'],
        rate: 3.5,
      }}
      footer={
        <BaseButtonsForm.Item>
          <BaseButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.submit')}
          </BaseButton>
        </BaseButtonsForm.Item>
      }
      onFinish={onFinish}
    >
      {/* Tên danh mục */}
      <BaseButtonsForm.Item
        name="variantProductType"
        label="Select variant type"
        hasFeedback
        rules={[{ required: true, message: 'Please select a variant type' }]}
      >
        <BaseSelect placeholder={'Please select a variant type'}>
          {[
            {
              id: 1,
              name: 'Color',
              value: 'color',
            },
            {
              id: 2,
              name: 'Material',
              value: 'material',
            },
          ].map((category) => (
            <Option key={category.id} value={category.value}>
              {category.name}
            </Option>
          ))}
        </BaseSelect>
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item
        name="variantProductName"
        label={'Variant Name'}
        rules={[{ required: true, message: 'Variant name is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>
    </BaseButtonsForm>
  );
};
