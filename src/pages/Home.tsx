import React from "react";
import { InputBox } from "../components/InputBox";
import { Logo } from "../components/Logo";

const Home: React.FC = () => {
  return (
    <>
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
      </div>
      <InputBox />
    </>
  );
};
export default Home;
