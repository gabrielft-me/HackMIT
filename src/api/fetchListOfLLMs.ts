export const fetchListOfLLMs = async () => {
  // use wrapper app for now
  const url = 'https://cors-anywhere.herokuapp.com/https://4915fd061e98.ngrok-free.app/api/models';

  try {
    const response = await fetch(url, { headers: {'ngrok-skip-browser-warning': '69420'} });
    if (!response) throw new Error('API is invalid!');

    const result = await response.json();
    
    return result;
  } catch (e) {
    console.log(e);
  }
}