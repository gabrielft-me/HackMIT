export const fetchListOfLLMs = async () => {
  // use wrapper app for now
  const url = 'https://cors-anywhere.herokuapp.com/https://4915fd061e98.ngrok-free.app/api/models';

  try {
    const response = await fetch(url, { 
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Raw API response:', text);

    // Validate that we have valid JSON before returning
    try {
      JSON.parse(text); // Test parse
      return text; // Return the original text if parse succeeds
    } catch (e) {
      console.error('Invalid JSON received from API:', text);
      throw new Error('Invalid JSON received from API');
    }
  } catch (e) {
    console.log(e);
  }
}