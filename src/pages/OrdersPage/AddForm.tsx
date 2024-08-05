import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
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
import { getCategories, update, deleteCategory } from '@app/api/categories.api';
import { addNewProduct } from '@app/api/products.api';
import { useState, useEffect } from 'react';

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
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data);
    });
  }, []);

  const onFinish = async (values = {}) => {
    setLoading(true);

    console.log(values);

    let dataAdd = {
      ...values,
      image: values?.image ? values.image[0]?.name : 'default.jpg',
    };

    // upload image to folder asset client

    try {
      let res = await addNewProduct(dataAdd);

      console.log(res._id, 'sdfasd');

      if (!res._id) {
        notificationController.error({ message: t('common.error'), description: 'Add new product failed' });
        setLoading(false);
        return;
      }

      console.log(res);
      setLoading(false);
      setFieldsChanged(false);
      onSaveSuccess();
      notificationController.success({ message: t('common.success') });
    } catch (err) {
      console.log(err);
      notificationController.error({ message: t('common.error'), description: 'Add new product failed' });
      setLoading(false);
    }
  };

  return (
    <BaseButtonsForm
      {...formItemLayout}
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
      {/* Tên sản phẩm */}
      <BaseButtonsForm.Item
        name="name"
        label={'Product Name'}
        rules={[{ required: true, message: 'Product name is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

      {/* Tên danh mục */}
      <BaseButtonsForm.Item
        name="categoryName"
        label="Select category name"
        hasFeedback
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <BaseSelect placeholder={'Please select a category'}>
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </BaseSelect>
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item label="Stock">
        <label>
          <BaseButtonsForm.Item name="stock" noStyle>
            <InputNumber min={1} max={10} />
          </BaseButtonsForm.Item>
        </label>
        <span> products </span>
      </BaseButtonsForm.Item>

      {/* Mo ta */}
      <BaseButtonsForm.Item
        name="description"
        label={'Description'}
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

      {/* Price */}
      <BaseButtonsForm.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
        <InputNumber addonAfter="VND" />
      </BaseButtonsForm.Item>
      {/* 
      <BaseButtonsForm.Item name="rate" label={t('forms.validationFormLabels.rate')}>
        <BaseRate />
      </BaseButtonsForm.Item> */}

      <BaseButtonsForm.Item
        name="image"
        label={t('forms.validationFormLabels.upload')}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <BaseUpload name="logo" action="/upload.do" listType="picture">
          <BaseButton type="default" icon={<UploadOutlined />}>
            {t('forms.validationFormLabels.clickToUpload')}
          </BaseButton>
        </BaseUpload>
      </BaseButtonsForm.Item>
    </BaseButtonsForm>
  );
};
