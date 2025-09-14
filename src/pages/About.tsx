import React from "react";
import { Logo } from "../components/Logo";

const About: React.FC = () => {
    return (
        <div>
            <Logo />
            <h1>About Page</h1>
            <p>This is the about page of the application.</p>
        </div>
    );
};
export default About;