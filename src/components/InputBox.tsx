import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { getUserProfile } from "../api/claude";
import { useUserDataProvider } from "../providers/UserDataProvider";
import { useNavigate } from "react-router-dom";

export const InputBox = () => {
  const { inputText, setUserProfile, setInputText} = useUserDataProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await getUserProfile(inputText);

      if ('type' in response && response.type === 'text') {
        const profile = JSON.parse(response.text);
        setUserProfile(profile);
        setIsLoading(false);
        navigate('/SearchPage')
      }
    } catch (error) {
      console.error('Error processing user profile:', error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="input-container">
        <FormControl 
          onChange={(input) => setInputText(input.target.value)} 
          type="user-input" 
          placeholder="tell us more about your business artificial-intelligence use cases!"
          size='lg'
          style={{ width: '100%' }}
          value={inputText ?? ''}
        />
        <Button disabled={isLoading} onClick={handleSubmit}>{isLoading ? 'Searching...' : 'Enter'}</Button>
      </div>
    </div>
  )
}