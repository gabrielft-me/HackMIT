import { useState } from "react"
import { Button, FormControl } from "react-bootstrap";
import { getUserProfile } from "../api/claude";

export const InputBox = () => {
  const [inputText, setInputText] = useState<string>('')

  const handleSubmit = () => {
    console.log(getUserProfile('test'));
  }
  
  return (<div className="container">
      <div className="input-container">
        <FormControl onChange={(input) => setInputText(input.target.value)} 
            type="user-input" placeholder="Tell us about your business AI use cases"/>
        <Button onClick={handleSubmit}>Enter</Button>
      </div>
    </div>)
}