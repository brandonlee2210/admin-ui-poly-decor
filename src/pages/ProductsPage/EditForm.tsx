import { useTranslation } from 'react-i18next';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRate } from '@app/components/common/BaseRate/BaseRate';
import { BaseUpload } from '@app/components/common/BaseUpload/BaseUpload';
import { notificationController } from '@app/controllers/notificationController';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { getProductById, update } from '@app/api/products.api';
import * as S from './DynamicForm.styles';
import { useState, useEffect } from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { getCategories, getVariantsProductt } from '@app/api/categories.api';
import { Form } from 'antd';

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

export const EditForm: React.FC<{ productId: string; onSaveSuccess: () => void }> = ({
  productId,
  onSaveSuccess,
  isEditModalOpen,
}) => {
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [colorsEnum, setColorsEnum] = useState([]);
  const [materialsEnum, setMaterialsEnum] = useState([]);
  const [variants, setVariants] = useState([]);

  const [colors, setColors] = useState(colorsEnum);
  const [materials, setMaterials] = useState(materialsEnum);

  const { t } = useTranslation();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data);
    });

    getProductById(productId).then((data) => {
      setProduct(data);
      form.setFieldsValue({
        name: data.name,
        categoryName: data.categoryName,
        stock: data.stock,
        description: data.description,
        price: data.price || 0,
        image: data.image,
        variants: data.variants || [],
      });
    });
  }, [productId]);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [form]);

  useEffect(() => {
    getVariantsProductt({
      current: 1,
      pageSize: 100,
      sortBy: 'id',
      sortOrder: 'asc',
    }).then((data) => {
      let res = data.data;
      setVariants(data.data);

      const colors = res
        ?.filter((v) => v.variantProductType === 'color')
        .map((x) => {
          return { label: x.variantProductName, value: x.variantProductName };
        });

      const materials = res
        ?.filter((v) => v.variantProductType === 'material')
        .map((x) => {
          return { label: x.variantProductName, value: x.variantProductName };
        });

      setColors(colors);
      setMaterials(materials);
    });
  }, []);

  const handleVariantSelect = (value, type) => {
    // Handle variant selection if needed
  };

  const onFinish = async (values = {}) => {
    setLoading(true);

    try {
      let res = await update(productId, values);

      if (!res) {
        notificationController.error({ message: t('common.error'), description: 'Update product failed' });
        setLoading(false);
        return;
      }

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
      form={form}
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
        variants: product.variants || [],
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

      <BaseButtonsForm.Item
        name="description"
        label={'Description'}
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item label={'Variants'}>
        <BaseButtonsForm.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {console.log(JSON.stringify(form.getFieldValue()))}
              {fields.map((field) => (
                <BaseRow key={field.key} wrap={false} gutter={[10, 10]} align="middle" justify="space-between">
                  <BaseCol span={6}>
                    <BaseButtonsForm.Item
                      noStyle
                      shouldUpdate={(prevValues: any, curValues: any) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <BaseButtonsForm.Item
                          {...field}
                          label={'Select color'}
                          name={[field.name, 'color']}
                          fieldKey={[field.key, 'color']}
                          rules={[{ required: true, message: t('forms.dynamicFormLabels.sightError') }]}
                        >
                          <BaseSelect onChange={(value) => handleVariantSelect(value, 'color')}>
                            {colors.map((item) => (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                          </BaseSelect>
                        </BaseButtonsForm.Item>
                      )}
                    </BaseButtonsForm.Item>
                  </BaseCol>
                  <BaseCol span={6}>
                    <BaseButtonsForm.Item
                      noStyle
                      shouldUpdate={(prevValues: any, curValues: any) =>
                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                      }
                    >
                      {() => (
                        <BaseButtonsForm.Item
                          {...field}
                          label={'Select material'}
                          name={[field.name, 'material']}
                          fieldKey={[field.key, 'material']}
                          rules={[{ required: true, message: t('forms.dynamicFormLabels.sightError') }]}
                        >
                          <BaseSelect onChange={(value) => handleVariantSelect(value, 'material')}>
                            {materials.map((item) => (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                          </BaseSelect>
                        </BaseButtonsForm.Item>
                      )}
                    </BaseButtonsForm.Item>
                  </BaseCol>
                  <BaseCol span={6}>
                    <BaseButtonsForm.Item
                      {...field}
                      label={'Price'}
                      name={[field.name, 'price']}
                      fieldKey={[field.key, 'price']}
                      rules={[{ required: true, message: 'Price must not be empty' }]}
                    >
                      <S.Wrapper>
                        <BaseInput addonAfter="VND" />
                      </S.Wrapper>
                    </BaseButtonsForm.Item>
                  </BaseCol>
                  <BaseCol span={6}>
                    <BaseButtonsForm.Item
                      {...field}
                      label={'Quantity'}
                      name={[field.name, 'quantity']}
                      fieldKey={[field.key, 'quantity']}
                      rules={[{ required: true, message: 'Quantity is required' }]}
                    >
                      <S.Wrapper>
                        <BaseInput />
                        <S.RemoveBtn onClick={() => remove(field.name)} />
                      </S.Wrapper>
                    </BaseButtonsForm.Item>
                  </BaseCol>
                </BaseRow>
              ))}

              {(colors.length > 0 || materials.length > 0) && (
                <BaseButtonsForm.Item>
                  <BaseButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add variant
                  </BaseButton>
                </BaseButtonsForm.Item>
              )}
            </>
          )}
        </BaseButtonsForm.List>
      </BaseButtonsForm.Item>
    </BaseButtonsForm>
  );
};
