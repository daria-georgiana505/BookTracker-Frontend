import React, { useState, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, token } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
      message.success('Logged in successfully!');
      login(data.token);
      navigate('/all');
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <h1>Login</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <p>Don't have an account? <Link to="/register" className="link-visited">Register</Link></p>
    </div>
  );
};

export default Login;
