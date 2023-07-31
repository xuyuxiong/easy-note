import { Form, Input, Modal } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { ExtendDataNode } from '../../types';

interface AddModalProps {
  isEdit: boolean;
  values: ExtendDataNode | null;
  isModalOpen: boolean;
  onModelOpen: (value: ExtendDataNode) => void;
  onModelClose: () => void;
}
const AddModal: React.FC<AddModalProps> = (props) => {
  const { isEdit, values, isModalOpen, onModelOpen, onModelClose } = props;
  const [form] = Form.useForm();

  const handleOk = () => {
    const values = form.getFieldsValue();
    onModelOpen(values);
  };

  const handleCancel = () => {
    onModelClose();
  };

  const noteType = useMemo(() => {
    return values?.type === 'folder'
    ? '笔记本名称'
    : '笔记名称';
  }, [isEdit, values]);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(values)
    } else {
      form.resetFields()
    }
  }, [isEdit, values]);

  return (
    <>
      <Modal
        title={isEdit ? '重命名': noteType}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          form={form}
        >
          <Form.Item
            label={noteType}
            name="title"
            rules={[{ required: true, message: `请输入${noteType}` }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddModal;
