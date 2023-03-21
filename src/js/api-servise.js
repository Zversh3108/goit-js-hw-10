const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/name/${name}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
    console.log(response);
  });
}
export default { fetchCountries };
