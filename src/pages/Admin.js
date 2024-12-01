import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import '../styles/Admin.css';
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
`;


const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        fetchUsers();
    },[]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data); 
            setLoading(false); 

        } catch (error) { 
            setError('Failed to fetch users'); 
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, isActive) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = isActive ? 'deactivate' : 'activate';
            await axios.put(`http://127.0.0.1:3000/api/user/${userId}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            setError('Faild to update user status');
        }
    };

    if (loading) return <p>Loding...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
      <NavBar />
      <Container>
        <Title>User Management</Title>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Username</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {users.map(user => (
              <TableRow key={user.UserId}>
                <TableCell>{user.UserName}</TableCell>
                <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <FaToggleOn onClick={() => toggleUserStatus(user.UserId, user.isActive)} />
                  ) : (
                    <FaToggleOff onClick={() => toggleUserStatus(user.UserId, user.isActive)} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Container>
    </>

    )
};

export default Admin;
