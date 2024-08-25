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
import { getOrderById, update, updateStock } from '@app/api/orders.api';
import { useState, useEffect } from 'react';
import { Form, Modal, Button } from 'antd'; // Import useForm from antd

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const statuses = [
  {
    id: 1,
    name: 'Chờ xác nhận',
  },
  {
    id: 2,
    name: 'Đang giao hàng',
  },
  {
    id: 3,
    name: 'Đã giao hàng',
  },
  {
    id: 5,
    name: 'Đã nhận được hàng',
  },
  {
    id: 4,
    name: 'Đã hủy',
  },
];

const normFile = (e = { fileList: [] }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const EditForm: React.FC<{ orderId: string; onSaveSuccess: () => void }> = ({ orderId, onSaveSuccess }) => {
  const [form] = Form.useForm(); // Create form instance
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({});

  const [order, setOrder] = useState(null);
  const { t } = useTranslation();

  // can not select status before
  const [filterStatuses, setFilterStatuses] = useState(statuses);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });

  useEffect(() => {
    const filteredStatuses = statuses.filter((status) => status.id >= order?.status);
    setFilterStatuses(filteredStatuses);
  }, [order?.status, orderId]);

  useEffect(() => {
    getOrderById(orderId).then((data) => {
      setOrder(data);
    });
  }, [orderId]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    setLoading(true);
    console.log(values);

    try {
      let res = await update(orderId, {
        ...order,
        status: statuses.find((status) => status.name === values.status)?.id,
      });

      // Nếu là đang giao hàng thì cập nhật lại stock
      if (values.status == 2) {
        await updateStock({ orderId, status: statuses.find((status) => status.name === values.status)?.id });
      }

      if (!res) {
        notificationController.error({ message: t('common.error'), description: 'Update order failed' });
        setLoading(false);
        return;
      }
      form.resetFields();
      setLoading(false);
      setFieldsChanged(false);

      onSaveSuccess();
      notificationController.success({ message: t('common.success') });
    } catch (err) {
      notificationController.error({ message: t('common.error'), description: 'Update order failed' });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values = {}) => {
    console.log(values);
    setValues(values);
    showModal();
  };

  if (!order) {
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
        status: statuses.find((status) => status.id === order.status)?.name,
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
        name="status"
        label="Select status"
        hasFeedback
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <BaseSelect placeholder={'Please select status'}>
          {filterStatuses.map((status) => (
            <Option key={status.id} value={status.name}>
              {status.name}
            </Option>
          ))}
        </BaseSelect>
      </BaseButtonsForm.Item>
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
        <p>Bạn có chắc chắn muốn đổi trạng thái không?</p>
      </Modal>
    </BaseButtonsForm>
  );
};
