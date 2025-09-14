import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { getUserProfile } from "../api/claude";
import { fetchListOfLLMs } from "../api/fetchListOfLLMs";
import { useUserDataProvider } from "../providers/UserDataProvider";
import type { LLMProfile } from "../interfaces/LLMProfile";

export const InputBox = () => {
  const { userProfile, inputText, setUserProfile, setInputText} = useUserDataProvider();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log(await fetchListOfLLMs() as LLMProfile);

    setIsLoading(true);

    try {
      const response = await getUserProfile(inputText);

      if ('type' in response && response.type === 'text') {
        const profile = JSON.parse(response.text);
        setUserProfile(profile);
        setIsLoading(false);
        // add router step here
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
      {userProfile && (
        <div className="profile-display mt-3">
          <h3>User Profile:</h3>
          <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}