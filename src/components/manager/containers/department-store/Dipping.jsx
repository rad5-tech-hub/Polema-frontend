import React, { useState } from "react";
import { Heading, Flex, Button, Table } from "@radix-ui/themes";
import { Modal, Form, Input, DatePicker,Button as AntButton } from "antd";

const Dipping = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (!values.morningDip) {
          form.setFields([
            {
              name: "morningDip",
              errors: ["Morning Dip is required for saving"],
            },
          ]);
          return;
        }
        // Handle save logic here
        console.log("Saved values:", values);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleFinish = () => {
    form
      .validateFields()
      .then((values) => {
        if (!values.morningDip || !values.eveningDip) {
          form.setFields([
            {
              name: "morningDip",
              errors: !values.morningDip
                ? ["Morning Dip is required for finishing"]
                : [],
            },
            {
              name: "eveningDip",
              errors: !values.eveningDip
                ? ["Evening Dip is required for finishing"]
                : [],
            },
          ]);
          return;
        }
        // Handle finish logic here
        console.log("Finished values:", values);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Flex justify="between">
        <Heading>Dipping Records</Heading>
        <Button color="brown" className="cursor-pointer" onClick={showModal}>
          New Dip
        </Button>
      </Flex>

      <Table.Root className="mt-4" variant="surface">
        <Table.Row>
          <Table.ColumnHeaderCell>DATE</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>MORNING DIP (TONS)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>EVENING DIP (TONS)</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>DAILY SALES</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>DAILY PRODUCTION</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>STATUS</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Root>

      <Modal
        title="New Dip Record"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <AntButton
            key="finish"
            className="bg-brown-400"
            onClick={handleFinish}
          >
            Finish
          </AntButton>,
          <AntButton
            key="save"
            className="bg-brown-400"
            color="brown"
            onClick={handleSave}
          >
            Save
          </AntButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="morningDip"
            label="Morning Dip (Tons)"
            rules={[{ required: true, message: "Please input morning dip" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="eveningDip" label="Evening Dip (Tons)">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Dipping;
