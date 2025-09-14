import React from "react";
import { Logo } from "../components/Logo";
import { InputBox } from "../components/InputBox";

const Home: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "48px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Logo width={350} height={300} />
      </div>
      <InputBox />
    </div>
  );
};
export default Home;
