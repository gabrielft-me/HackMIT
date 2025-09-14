import React from "react";
import {Logo} from '../components/Logo';
import { Container, Row, Col, Card } from "react-bootstrap";

const About: React.FC = () => {
  return (
    <Container className="py-5">
      {/* Heading */}
      <Row className="mb-5 text-center">
        <Col>
          <h2 className="fw-bold">About Us</h2>
          <p className="text-muted">
            AIPlug is a tool for business owners to find the most optimal AI model for their use. We integrate both Claude to analyze customer input and our own RAG model to find the most optimal AI model for our users.
          </p>
        </Col>
      </Row>

      {/* Values Section */}
      <Row className="text-center g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-semibold">Sustainability</h5>
              <p className="text-muted">
                We cut down heavily on electricity usage by connecting businesses to AI models with better efficiency. When businesses models use agents with less nodes but higher specificity, they can cut down on carbon emissions while still maintaining results.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-semibold">Maintaining Performance</h5>
              <p className="text-muted">
                Studies show that LORA models can be just as effective as larger models when used in the right context. We help businesses find the right model for their use case, ensuring that they don't have to sacrifice performance.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-semibold">Cost Efficiency</h5>
              <p className="text-muted">
                Businesses are incentivized to use our platform because they can save money by switching to more optimal AI models. We provide estimates of potential savings, making it easier for businesses to make informed decisions.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
