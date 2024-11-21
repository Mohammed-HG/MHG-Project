import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap'

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div class="container p-5 my-5 bg-dark text-white" >
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card className="text-center mt-4">
              <Card.Body>
                <Card.Title>Welcome to the Phone Book App</Card.Title>
                <Card.Text>Store and manage your contacts with ease!</Card.Text>
                <Button variant="primary" onClick={handleLogin} className="m-2"> Login </Button>
                <div className="d-grid gap-2"></div>
                <h6>-OR-</h6>
                <div className="d-grid gap-2"></div>
                <Button variant="secondary" onClick={handleRegister} className="m-2"> Register </Button>
             </Card.Body>
           </Card>
         </Col>
       </Row>
     </Container>
  </div>
  );
};

export default Index;