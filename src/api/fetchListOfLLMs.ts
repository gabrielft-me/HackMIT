export const fetchListOfLLMs = async () => {
  // use wrapper app for now
  const url = 'https://cors-anywhere.herokuapp.com/https://4915fd061e98.ngrok-free.app/api/models';

  try {
    const response = await fetch(url, { headers: {'ngrok-skip-browser-warning': '69420'} });
    if (!response) throw new Error('API is invalid!');

    const result = await response.json();
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}