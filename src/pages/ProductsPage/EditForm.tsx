import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRate } from '@app/components/common/BaseRate/BaseRate';
import { BaseUpload } from '@app/components/common/BaseUpload/BaseUpload';
import { notificationController } from '@app/controllers/notificationController';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { getCategories, getProductById, update } from '@app/api/products.api';
import { useState, useEffect } from 'react';
import { Form } from 'antd'; // Import useForm from antd

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

export const EditForm: React.FC<{ productId: string; onSaveSuccess: () => void }> = ({ productId, onSaveSuccess }) => {
  const [form] = Form.useForm(); // Create form instance
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data);
    });

    getProductById(productId).then((data) => {
      setProduct(data);
    });
  }, [productId]);

  const onFinish = async (values = {}) => {
    setLoading(true);

    // let image = '';
    // if (values.image) {
    //   image = values.image[0]?.name;
    // } else {
    //   image = product.image || 'default.jpg';
    // }

    // let dataUpdate = {
    //   ...values,
    //   image,
    // };

    try {
      let res = await update(productId, values);

      if (!res) {
        notificationController.error({ message: t('common.error'), description: 'Update product failed' });
        setLoading(false);
        return;
      }

      console.log(res);
      setLoading(false);
      setFieldsChanged(false);
      onSaveSuccess();
      notificationController.success({ message: t('common.success') });
    } catch (err) {
      notificationController.error({ message: t('common.error'), description: 'Update product failed' });
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <BaseButtonsForm
      {...formItemLayout}
      form={form} // Pass form instance to BaseButtonsForm
      isFieldsChanged={isFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      name="editForm"
      initialValues={{
        name: product.name,
        categoryName: product.categoryName,
        stock: product.stock,
        description: product.description,
        price: product.price || 0,
        image: product.image,
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
      <BaseButtonsForm.Item
        label="Product name"
        name="name"
        rules={[{ required: true, message: 'Product name is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

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

      {/* <BaseButtonsForm.Item label="Stock">
        <label>
          <BaseButtonsForm.Item name="stock" noStyle>
            <InputNumber min={1} max={10} />
          </BaseButtonsForm.Item>
        </label>
        <span> products </span>
      </BaseButtonsForm.Item> */}

      <BaseButtonsForm.Item
        name="description"
        label={'Description'}
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

      {/* Price */}
      {/* <BaseButtonsForm.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
        <InputNumber addonAfter="VND" />
      </BaseButtonsForm.Item> */}

      {/* <BaseButtonsForm.Item
        name="image2"
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

      <BaseButtonsForm.Item label="Image" name="image" rules={[{ required: true, message: 'Image is required' }]}>
        <BaseInput />
      </BaseButtonsForm.Item> */}
    </BaseButtonsForm>
  );
};
