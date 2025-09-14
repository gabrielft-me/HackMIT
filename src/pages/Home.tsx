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
            <Nav.Link href="#usecases">Use Cases</Nav.Link>
            <Nav.Link as={Link} to="/About">
              About
            </Nav.Link>
            <Button variant="dark" className="ms-3">
              Request a Quote
            </Button>
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
        <Button as={Link} to="/" variant="dark">
          Get Started
        </Button>
      </Container>

      {/* Use Cases */}
      <Container id="usecases" className="py-5">
        <h2 className="mb-4">Use Cases</h2>
        <Row>
          {["SEO", "PPC Ads", "Social Media", "Email Marketing"].map(
            (title, i) => (
              <Col md={3} key={i} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                      Learn more about {title.toLowerCase()}.
                    </Card.Text>
                    <Button variant="outline-dark" size="sm">
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
      </Container>

      {/* Working Process */}
      <Container className="py-5">
        <h2>Our Working Process</h2>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>01 Consultation</Accordion.Header>
            <Accordion.Body>
              We define your goals and strategy together.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>02 Research & Strategy</Accordion.Header>
            <Accordion.Body>
              Market research and actionable planning.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>03 Implementation</Accordion.Header>
            <Accordion.Body>Execution of campaigns and tactics.</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Team */}
      <Container className="py-5 bg-light">
        <h2>Team</h2>
        <Row>
          {[
            {
              name: "Gabriel Fagundest",
              bio: "Back-end and integration",
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

      {/* Contact Form */}
      <Container className="py-5 bg-light" id="contact">
        <h2>Contact Us</h2>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <Button variant="dark" type="submit">
            Send Message
          </Button>
        </Form>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-4">
        <p>© 2025 AIPlug. EDIT LATER</p>
      </footer>
    </>
  );
};

export default Home;
