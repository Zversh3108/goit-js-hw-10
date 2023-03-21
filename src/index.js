import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './js/api-servise';
const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};
let countryInfoMarkup = '';
let countriesListMArkup = '';
let inputData;
refs.searchInput.addEventListener(
  'input',
  debounce(searchHandler, DEBOUNCE_DELAY)
);

function searchHandler() {
  inputData = refs.searchInput.value;
  API.fetchCountries(inputData).then(renderCountriesCard).catch(onFetchError);
}

function renderCountriesCard(countries) {
  if (countries.length > 1 && countries.length <= 10) {
    renderingMarkupOfCountries(countries);
  } else if (countries.length === 1) {
    renderingMarkupOfOneCountry(countries);
  } else {
    toManyCountriesError();
  }
}

function renderingMarkupOfOneCountry(countries) {
  countryInfoMarkup = `
  <h3 class = "country-name"><img class = "country-icon" src = "${
    countries[0].flags.svg
  }"/>${countries[0].name.official}</h3> 
    <ul style="list-style: none ;" class = "country_info-list">
    <li>Capital: <span>${countries[0].capital[0]}</span></li>
    <li>population: <span>${countries[0].population}</span></li>
    <li>languages: <span>${Object.values(countries[0].languages).join(
      ', '
    )}</span></li>  </ul>`;

  refs.countryInfoContainer.innerHTML = countryInfoMarkup;
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function renderingMarkupOfCountries(countries) {
  countriesListMArkup = countries => {
    return countries
      .flatMap(
        country =>
          `<li class = "gallery__item"> <img class = "country-icon" src = "${country.flags.svg}"/>${country.name.official}</li>`
      )
      .join(' ');
  };
  refs.countryList.insertAdjacentHTML(
    'afterbegin',
    countriesListMArkup(countries)
  );
}

function toManyCountriesError(error) {
  Notiflix.Notify.failure(
    'Too many matches found. Please enter a more specific name.'
  );
}
