import { Form, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading, ReloadData } from "../../../redux/rootSlice";

const AdminCourses = () => {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state) => state.root);
  const courses = portfolioData?.course || [];
  const [showAddEditModal, setShowAddEditModal] = React.useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
  const [form] = Form.useForm();

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
        response = await axios.post("https://sridharsportfolio.onrender.com//api/portfolio/update-course", {
          ...values,
          _id: selectedItemForEdit._id,
        });
      } else {
        response = await axios.post("https://sridharsportfolio.onrender.com/api/portfolio/add-course", values);
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
      const response = await axios.post("https://sridharsportfolio.onrender.com//api/portfolio/delete-course", {
        _id: item._id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        dispatch(ReloadData(true));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const openModal = (course = null) => {
    setSelectedItemForEdit(course);
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
          Add course
        </button>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {courses.map((course) => (
          <div
            key={course._id}
            className="shadow border p-5 border-gray-400 flex flex-col"
          >
            <h1 className="text-xl text-primary font-bold">
              {course.title}
            </h1>
            <img src={course.image} alt="" className="h-62 w-80"/>
            <h1>Description: {course.description}</h1>
            <h1>Link: {course.link}</h1>
            <div className="flex justify-end gap-5 mt-5">
              <button
                className="bg-primary text-white px-5 py-2 rounded-md"
                onClick={() => openModal(course)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-md"
                onClick={() => onDelete(course)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        visible={showAddEditModal}
        title={selectedItemForEdit ? "Edit course" : "Add course"}
        footer={null}
        onCancel={() => setShowAddEditModal(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title">
            <input placeholder="Title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <input placeholder="Description" />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <input placeholder="Image URL" />
          </Form.Item>
          <Form.Item name="link" label="link">
            <input placeholder="Paste URL Link"/>
          </Form.Item>
          <Form.Item name="technologies" label="Technologies">
            <input placeholder="Technologies"/>
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

export default AdminCourses;
