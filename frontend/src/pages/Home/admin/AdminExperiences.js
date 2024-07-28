import { Form, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading, ReloadData } from "../../../redux/rootSlice";

const Experiences = () => {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state) => state.root);
  const experiences = portfolioData?.experience || [];
  const [showAddEditModal, setShowAddEditModal] = React.useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
  const [form] = Form.useForm(); // Initialize the form here

  useEffect(() => {
    if (showAddEditModal) {
      if (selectedItemForEdit) {
        form.setFieldsValue(selectedItemForEdit);
      } else {
        form.resetFields();
      }
    }
  }, [showAddEditModal, selectedItemForEdit, form]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (selectedItemForEdit) {
        response = await axios.post("/api/portfolio/update-experience", {
          ...values,
          _id: selectedItemForEdit._id,
        });
      } else {
        response = await axios.post("/api/portfolio/add-experience", values);
      }
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setShowAddEditModal(false);
        setSelectedItemForEdit(null);
        form.resetFields();
        dispatch(ReloadData(true)); 
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onDelete = async (item) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/portfolio/delete-experience", {
        _id: item._id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        dispatch(ReloadData(true)); // Reload data after deleting
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const openModal = (experience = null) => {
    setSelectedItemForEdit(experience);
    setShowAddEditModal(true);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="bg-primary px-5 py-2 text-white"
          onClick={() => {
            setSelectedItemForEdit(null);
            setShowAddEditModal(true);
          }}
        >
          Add Experience
        </button>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {experiences.map((experience) => (
          <div
            key={experience._id}
            className="shadow border p-5 border-gray-400 flex flex-col"
          >
            <h1 className="text-xl text-primary font-bold">
              {experience.period}
            </h1>
            <h1>Company: {experience.company}</h1>
            <h1>Role: {experience.title}</h1>
            <h1>Description: {experience.description}</h1>
            <div className="flex justify-end gap-5 mt-5">
              <button
                className="bg-primary text-white px-5 py-2 rounded-md"
                onClick={() => openModal(experience)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-md"
                onClick={() => onDelete(experience)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
     <Modal
        visible={showAddEditModal}
        title={selectedItemForEdit ? "Edit Experience" : "Add Experience"}
        footer={null}
        onCancel={() => setShowAddEditModal(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="period" label="Period">
            <input placeholder="Period" />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <input placeholder="Company" />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <input placeholder="Title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <input placeholder="Description" />
          </Form.Item>

          <div className="flex justify-end">
            <button
              className="border-primary text-primary px-5 py-2 rounded-md"
              onClick={() => {
                setShowAddEditModal(false);
              }}
            >
              Cancel
            </button>
            <button className="bg-primary text-white px-5 py-2 rounded-md" type="submit">
              {selectedItemForEdit ? "Update" : "Add"}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default Experiences;
