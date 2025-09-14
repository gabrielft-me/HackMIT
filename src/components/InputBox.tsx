import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { getUserProfile } from "../api/claude";

interface UserProfile {
  size_of_company: number;
  current_model: string | null;
  business_model: 'B2B' | 'B2C';
  type_of_data: string;
  amount_of_latency: number | null;
  data_sensitivity: 'low' | 'medium' | 'high' | 'critical';
  savings: number;
}

export const InputBox = () => {
  const [inputText, setInputText] = useState<string>('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await getUserProfile('I am a pharmacy owner currently using ChatGPT 5. I run basic user service queries daily, with around 8000 customer queries per week. What is the most optimal model that balances efficiency without sacrificing accuracy/performance.');

      if ('type' in response && response.type === 'text') {
        const profile = JSON.parse(response.text);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error processing user profile:', error);
    } finally {
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
        />
        <Button disabled={isLoading} onClick={handleSubmit}>{isLoading ? 'Searching...' : 'Enter'}</Button>
      </div>
      {userProfile && (
        <div className="profile-display mt-3">
          <h3>User Profile:</h3>
          <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}