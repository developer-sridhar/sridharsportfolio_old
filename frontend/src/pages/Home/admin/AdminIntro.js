import React from 'react'
import { Form, message } from 'antd'
import './Admin.css'
import { useDispatch, useSelector } from 'react-redux'
import { HideLoading, ShowLoading } from '../../../redux/rootSlice'
import axios from 'axios'

const AdminIntro = () => {
  const dispatch = useDispatch();
  const{portfolioData} = useSelector((state) => state.root);
  const onFinish = async(values) => {
    try {
      dispatch(ShowLoading())
      const response = await axios.post("https://sridharsportfolio.onrender.com/api/portfolio/update-intro", {
        ...values,
        _id: portfolioData.intro._id,
      });
      dispatch(HideLoading())
      if(response.data.success){
        message.success(response.data.message)
      }else{
        message.error(response.data.message)
      }
    } catch (error) {
      dispatch(HideLoading())
      message.error(error.message)
    }
  };


  return (
    <div>
      <Form onFinish={onFinish} layout='vertical' initialValues={portfolioData.intro}>
        <Form.Item name='welcomeText' label='Welcome Text'>
          <input placeholder='welcomeText'/>
        </Form.Item>
        <Form.Item name='firstName' label='First Name'>
          <input placeholder='First Name'/>
        </Form.Item>
        <Form.Item name='lastName' label='Last Name'>
          <input placeholder='Last Name'/>
        </Form.Item>
        <Form.Item name='caption' label='Caption'>
          <input placeholder='Caption'/>
        </Form.Item>
        <Form.Item name='description' label='Description'>
          <textarea placeholder='Description'/>
        </Form.Item>
        <div className='flex justify-end' label='welcomeText'>
          <button className='px-5 py-2 bg-primary text-white rounded-md' type='submit'>SAVE</button>
        </div>
      </Form>
    </div>
  )
}

export default AdminIntro
