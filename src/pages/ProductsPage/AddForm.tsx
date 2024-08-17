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
import { getCategories, update, deleteCategory, getAllVariantsProduct } from '@app/api/categories.api';
import { addNewProduct } from '@app/api/products.api';
import { PlusOutlined } from '@ant-design/icons';
import * as S from './DynamicForm.styles';
import { Upload } from 'antd';
import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { Spin } from 'antd';
const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const url = 'https://api.cloudinary.com/v1_1/deunymbky/image/upload';

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
  const [uploading, setUploading] = useState(false);
  const [imageLink, setImageLink] = useState('');
  const [variants, setVariants] = useState([]);
  const [colorsEnum, setColorsEnum] = useState([]);
  const [materialsEnum, setMaterialsEnum] = useState([]);
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  // const variantsEnum = [
  //   { label: 'Màu sắc', value: 'color' },
  //   { label: 'Chất liệu', value: 'material' },
  // ];

  // var colorsEnum = [
  //   { label: 'Nâu', value: 'Nâu' },
  //   { label: 'Trắng', value: 'Trắng' },
  //   { label: 'Vàng', value: 'Vàng' },
  // ];

  // var materialsEnum = [
  //   {
  //     label: 'Gỗ sồi',
  //     value: 'Gỗ sồi',
  //   },
  //   {
  //     label: 'Gỗ thông',
  //     value: 'Gỗ thông',
  //   },
  // ];

  console.log(colorsEnum, materialsEnum, 'variants');

  const [colors, setColors] = useState(colorsEnum);
  const [materials, setMaterials] = useState(materialsEnum);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data);
    });
  }, []);

  useEffect(() => {
    getAllVariantsProduct().then((data) => {
      let res = data.data;
      setVariants(data.data);
      console.log('res', res);

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

      console.log('materials', materials);

      setColors(colors);
      setMaterials(materials);
    });
  }, []);

  const handleChange = () => {
    form.setFieldsValue({ sights: [] });
  };

  const handleVariantSelect = (value, type) => {
    // if (type === 'color') {
    //   setColors((prevColors) => prevColors.filter((color) => color.value !== value));
    // } else if (type === 'material') {
    //   setMaterials((prevMaterials) => prevMaterials.filter((material) => material.value !== value));
    // }
    // console.log(value, type);
  };

  const onUploadImage = async (data) => {
    console.log('file', data);
    setUploading(true);
    // TODO: Upload image to cloudinary and get secure_url
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('cloud_name', 'deunymbky');
    formData.append('upload_preset', 'qtwq9io5');

    setFileList([data.file]);
    const options = {
      method: 'POST',
      body: formData,
    };

    try {
      let res = await fetch(url, options);
      let data = await res.json();

      console.log(data);

      if (data.secure_url) {
        setImageLink(data.secure_url);
        setUploading(false);
        return data.secure_url;
        data.onSuccess();
      }

      notificationController.error({ message: t('common.error'), description: 'Upload image failed' });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      notificationController.error({ message: t('common.error'), description: 'Upload image failed' });
    }
  };

  const onFinish = async (values = {}) => {
    let dataAdd = {
      ...values,
      image: imageLink,
    };

    // upload image to folder asset client

    try {
      let res = await addNewProduct(dataAdd);

      if (!res._id) {
        notificationController.error({ message: t('common.error'), description: 'Add new product failed' });
        setLoading(false);
        return;
      }

      console.log(res);
      setLoading(false);
      setFieldsChanged(false);
      onSaveSuccess();
      form.resetFields();

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

      {/* Mo ta */}
      <BaseButtonsForm.Item
        name="description"
        label={'Description'}
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <BaseInput />
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item
        name="image"
        label={t('forms.validationFormLabels.upload')}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="picture"
          beforeUpload={(file) => {
            return onUploadImage({ file }).then((secureUrl) => {
              form.setFieldsValue({
                [field.name]: [...(field.value || []), { name: file.name, url: secureUrl }],
              });
              return false;
            });
          }}
        >
          <BaseButton type="default" icon={<UploadOutlined />}>
            {t('forms.validationFormLabels.clickToUpload')}
          </BaseButton>
        </Upload>

        {uploading && (
          <div style={{ marginTop: '12px' }}>
            <Spin size="large" />
          </div>
        )}
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item label={'Variants'}>
        <BaseButtonsForm.List name="variants">
          {(fields, { add, remove }) => (
            <>
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
