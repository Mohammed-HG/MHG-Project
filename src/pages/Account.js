import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Ensure this import is added
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Ensure this import is added

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #81d4fa, #29b6f6);
  font-family: 'Roboto', sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  color: #666;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const Loader = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BackButton = styled.button`
  background: #333;
  border: none;
  color: #ecf0f1;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: #8e44ad;
  }

  &:focus {
    outline: none;
  }
`;

const Account = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('http://127.0.0.1:3000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Full API response:', response.data);  // Log the full response
      setUser(response.data.UserName);
      setUserId(response.data.UserId);
      console.log('User:', response.data.UserName);  // Log the UserName
      console.log('UserId:', response.data.UserId);  // Corrected case for UserId
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to fetch user:', error);
      }
    }
  };

  return (
    <>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </BackButton>
      <Container>
        <Card>
          <Title>Account Details</Title>
          {user && userId ? (
            <div>
              <Paragraph>Username: {user}</Paragraph>
              <Paragraph>User ID: {userId}</Paragraph>
            </div>
          ) : (
            <Loader />
          )}
        </Card>
      </Container>
    </>
  );
};

export default Account;
