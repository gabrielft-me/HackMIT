import React from "react";

import { Logo } from "../components/Logo";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Accordion,
  Form,
  Navbar,
  Nav,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { InputBox } from "../components/InputBox";

const Home: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="px-4">
        <Navbar.Brand as={Link} to="/">
          <Logo width={36} height={30} />
          <span style={{ marginLeft: 5 }}>AIPlug</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#usecases">Our Goals</Nav.Link>
            <Nav.Link as={Link} to="/About">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <Container fluid className="text-center py-5 bg-light">
        <h1>Make huge savings finding efficient models</h1>
        <p className="lead">
          Our tool will help you find the most efficient AI models to help your
          business save money and the environment.
        </p>
        <div className="d-flex justify-content-center mt-4">
          <div style={{ width: "1000px", maxWidth: "100%" }}>
            <InputBox />
          </div>
        </div>
      </Container>

      {/* Our Goals */}
      <Container id="usecases" className="py-5">
        <h2 className="mb-4">Our Goals</h2>
        <Row>
          {[
            {
              title: "Sustainability",
              description:
                "We help you choose AI models that minimize energy usage and reduce your carbon footprint.",
            },
            {
              title: "Maintaining Performance",
              description:
                "Our recommendations ensure you get efficient models without sacrificing speed or accuracy.",
            },
            {
              title: "Cost Efficiency",
              description:
                "Save money by deploying models that are optimized for your business needs and budget.",
            },
          ].map((goal, i) => (
            <Col md={4} key={i} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{goal.title}</Card.Title>
                  <Card.Text>{goal.description}</Card.Text>
                  <Link to="/About" className="btn btn-outline-dark btn-sm">
                    Learn More
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Team */}
      <Container className="py-5 bg-light">
        <h2>Team</h2>
        <Row>
          {[
            {
              name: "Gabriel Fagundest",
              bio: "RAG Mode, Back-end, and integration",
            },
            {
              name: "Connor Lai",
              bio: "Front-end and integration",
            },
            {
              name: "Michael Fedorov",
              bio: "Front-end and UX",
            },
            {
              name: "Karmughilan Kamalakannan",
              bio: "Design, UX",
            },
          ].map((member, i) => (
            <Col md={3} key={i} className="mb-3">
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Text>{member.bio}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-4">
        <p>2025 AIPlug</p>
      </footer>
    </>
  );
};

export default Home;
