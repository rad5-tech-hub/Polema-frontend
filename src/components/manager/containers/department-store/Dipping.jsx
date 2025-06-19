import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { refractor } from "../../../date";
import {
  Spinner,
  DropdownMenu,
  Heading,
  Flex,
  Button,
  Table,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import useToast from "../../../../hooks/useToast";
import { Modal, Form, Input, Button as AntButton } from "antd";

// Custom Date Input component to replace Ant Design DatePicker
const DateInput = ({ value = "", onChange, disabled }) => {
  const handleChange = (e) => {
    const dateValue = e.target.value; // YYYY-MM-DD format
    onChange(dateValue ? new Date(dateValue) : null);
  };

  return (
    <input
      type="date"
      value={value ? new Date(value).toISOString().split("T")[0] : ""}
      onChange={handleChange}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #d9d9d9",
      }}
    />
  );
};

const root = import.meta.env.VITE_ROOT;

const Dipping = () => {
  const showToast = useToast();
  const [dipingDetails, setDippingDetails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [selectedDip, setSelectedDip] = useState(null);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [finishButtonLoading, setFinishButtonLoading] = useState(false);
  const [completeButtonLoading, setCompleteButtonLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginationUrls, setPaginationUrls] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [form] = Form.useForm();
  const [completeForm] = Form.useForm();

  const fetchDipping = async (pageUrl = null) => {
    setIsFetching(true);
    setDippingDetails([]);
    setFailedSearch(false);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({
        type: "error",
        message: "An error occurred, try logging in again.",
      });
      setIsFetching(false);
      return;
    }
    try {
      const url = pageUrl ? `${root}${pageUrl}` : `${root}/batch/get-dips`;
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDippingDetails(data.data || []);
      setFailedSearch(data.data.length === 0);
      if (data.pagination?.nextPage) {
        setPaginationUrls((prev) => {
          const newUrl = data.pagination.nextPage;
          const newUrls = prev.slice(0, currentPageIndex + 1);
          if (!newUrls.includes(newUrl)) {
            return [...newUrls, newUrl];
          }
          return newUrls;
        });
      } else {
        setPaginationUrls((prev) => prev.slice(0, currentPageIndex + 1));
      }
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred, please try again.",
      });
      setFailedSearch(true);
    } finally {
      setIsFetching(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < paginationUrls.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      fetchDipping(paginationUrls[nextIndex]);
    } else if (paginationUrls[currentPageIndex]) {
      setCurrentPageIndex((prev) => prev + 1);
      fetchDipping(paginationUrls[currentPageIndex]);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevIndex);
      fetchDipping(prevIndex === 0 ? null : paginationUrls[prevIndex]);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCompleteCancel = () => {
    setIsCompleteModalVisible(false);
    setSelectedDip(null);
    completeForm.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!values.morningDip) {
        form.setFields([
          {
            name: "morningDip",
            errors: ["Morning Dip is required for saving"],
          },
        ]);
        return;
      }
      setSaveButtonLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "error",
          message: "An error occurred, try logging in again",
        });
        setSaveButtonLoading(false);
        return;
      }
      await axios.post(
        `${root}/batch/create-dip`,
        { morning: values.morningDip},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalVisible(false);
      form.resetFields();
      showToast({
        message: "Dip Record Saved Successfully",
        type: "success",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchDipping();
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred, please try again.",
      });
    } finally {
      setSaveButtonLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
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
      setFinishButtonLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "error",
          message: "An error occurred, try logging in again",
        });
        setFinishButtonLoading(false);
        return;
      }
      await axios.post(
        `${root}/batch/finish-dip`,
        {
          morning: values.morningDip,
          evening: values.eveningDip,
          date: values.date?.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalVisible(false);
      form.resetFields();
      showToast({
        message: "Dip Record Completed Successfully",
        type: "success",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchDipping();
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred, please try again.",
      });
    } finally {
      setFinishButtonLoading(false);
    }
  };

  const handleCompleteDip = async () => {
    try {
      const values = await completeForm.validateFields();
      if (!values.morningDip || !values.eveningDip) {
        completeForm.setFields([
          {
            name: "morningDip",
            errors: !values.morningDip
              ? ["Morning Dip is required for completing"]
              : [],
          },
          {
            name: "eveningDip",
            errors: !values.eveningDip
              ? ["Evening Dip is required for Finishing"]
              : [],
          },
        ]);
        return;
      }
      setCompleteButtonLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast({
          type: "error",
          message: "An error occurred, try logging in again",
        });
        setCompleteButtonLoading(false);
        return;
      }
      await axios.patch(
        `${root}/batch/edit-dip/${selectedDip.id}`,
        {
          ...(values.morningDip && {morning:values.morningDip }),
          ...(values.eveningDip  && {evening: values.eveningDip}),
          // date: values.date?.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsCompleteModalVisible(false);
      completeForm.resetFields();
      setSelectedDip(null);
      showToast({
        message: "Dip Record Completed Successfully",
        type: "success",
      });
      setCurrentPageIndex(0);
      setPaginationUrls([]);
      fetchDipping();
    } catch (err) {
      showToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "An error occurred, please try again.",
      });
    } finally {
      setCompleteButtonLoading(false);
    }
  };

  const showCompleteModal = (item) => {
    setSelectedDip(item);
    setIsCompleteModalVisible(true);
    completeForm.setFieldsValue({
      date: item.createdAt,
      morningDip: item.morning || "",
      eveningDip: item.evening || "",
    });
  };

  useEffect(() => {
    fetchDipping();
  }, []);

  return (
    <>
      <Flex justify="between" align="center" className="mb-4">
        <Heading>Dipping Records</Heading>
        <Button className="cursor-pointer bg-theme" onClick={showModal}>
          New Dip
        </Button>
      </Flex>

      <Table.Root
        className="mt-4 table-fixed w-full"
        variant="surface"
        size="2"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-left">
              DATE
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              MORNING DIP (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              EVENING DIP (TONS)
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              DAILY SALES
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              DAILY PRODUCTION
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left">
              STATUS
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-left"></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isFetching ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                <Spinner size="2" />
              </Table.Cell>
            </Table.Row>
          ) : dipingDetails.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center p-4">
                {failedSearch ? "No results found." : <Spinner size="2" />}
              </Table.Cell>
            </Table.Row>
          ) : (
            dipingDetails.map((item) => (
              <Table.Row key={item.id || `${item.createdAt}-${item.morning}`}>
                <Table.Cell>{refractor(item.createdAt)}</Table.Cell>
                <Table.Cell>{item.morning || "N/A"}</Table.Cell>
                <Table.Cell>{item.evening || "N/A"}</Table.Cell>
                <Table.Cell>{item.sales || "N/A"}</Table.Cell>
                <Table.Cell>{item.production || "N/A"}</Table.Cell>
                <Table.Cell>
                  <FontAwesomeIcon
                    className={`${
                      item.isActive ? "text-yellow-500" : "text-green-500"
                    } mr-2`}
                    icon={faSquare}
                  />
                  {item.isActive ? "Ongoing" : "Completed"}
                </Table.Cell>
                <Table.Cell>
                  {item.isActive && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" className="cursor-pointer">
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content variant="solid">
                        <DropdownMenu.Item
                          onClick={() => showCompleteModal(item)}
                        >
                          Complete Dip
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {paginationUrls.length > 0 && (
        <Flex justify="center" className="mt-4">
          <Flex gap="2" align="center">
            <Button
              variant="soft"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Text>Page {currentPageIndex + 1}</Text>
            <Button
              variant="soft"
              disabled={currentPageIndex >= paginationUrls.length}
              onClick={handleNextPage}
              className="!bg-blue-50 hover:!bg-blue-100 cursor-pointer"
              aria-label="Next page"
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}

      <Modal
        title="New Dip"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          // <AntButton
          //   key="finish"
          //   className="bg-brown-400 hover:!bg-brown-500"
          //   onClick={handleFinish}
          //   loading={finishButtonLoading}
          // >
          //   Finish
          // </AntButton>,
          <AntButton
            key="save"
            className="bg-brown-400 hover:!bg-brown-500"
            onClick={handleSave}
            loading={saveButtonLoading}
          >
            Save
          </AntButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          {/* <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DateInput />
          </Form.Item> */}
          <Form.Item
            name="morningDip"
            label="Morning Dip (Tons)"
            rules={[{ required: false, message: "Please input morning dip" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="eveningDip" label="Evening Dip (Tons)" >
            <Input type="number" disabled={true} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Complete Dip Record"
        open={isCompleteModalVisible}
        onCancel={handleCompleteCancel}
        footer={[
          <AntButton key="cancel" onClick={handleCompleteCancel}>
            Save
          </AntButton>,
          <AntButton
            key="complete"
            className="bg-brown-400 hover:!bg-brown-500"
            onClick={handleCompleteDip}
            loading={completeButtonLoading}
          >
            Finish
          </AntButton>,
        ]}
      >
        <Form form={completeForm} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: false, message: "Please select a date" }]}
          >
            <DateInput disabled />
          </Form.Item>
          <Form.Item
            name="morningDip"
            label="Morning Dip (Tons)"
            rules={[{ required: false, message: "Please input morning dip" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="eveningDip"
            label="Evening Dip (Tons)"
            rules={[{ required: false, message: "Please input evening dip" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Dipping;
