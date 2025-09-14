import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { getUserProfile } from "../api/claude";

export const InputBox = () => {
  const [inputText, setInputText] = useState<string>("");

  const handleSubmit = () => {
    console.log(
      getUserProfile(
        "I am a pharmacy owner currently using ChatGPT 5. I run basic user service queries daily, with around 8000 customer queries per week. What is the most optimal model that balances efficiency without sacrificing accuracy/performance."
      )
    );
  };

  return (
    <div className="container">
      <div className="input-container">
        <FormControl
          onChange={(input) => setInputText(input.target.value)}
          type="user-input"
          placeholder="Tell us about your business AI use cases"
        />
        <Button
          variant="success"
          style={{
            backgroundColor: "#14532d", // deeper green
            borderColor: "#14532d",
            color: "#fff",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            padding: 0,
            marginLeft: "8px",
          }}
          onClick={handleSubmit}
          aria-label="Submit"
        >
          <span style={{ fontSize: "1.3em" }}>✈️</span>
        </Button>
      </div>
    </div>
  );
};
