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
function cleanInput() {
  refs.countryList.innerHTML = '';
  refs.countryInfoContainer.innerHTML = '';
}
function searchHandler(evt) {
  cleanInput();
  inputData = evt.target.value.trim();
  if (inputData === '') {
    return;
  }
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
    <ul class = "country_info-list">
    <li><b>Capital:</b><span> ${countries[0].capital[0]}</span></li>
    <li><b>Population:</b><span> ${countries[0].population}</span></li>
    <li><b>Languages:</b><span> ${Object.values(countries[0].languages).join(
      ', '
    )}</span></li>  </ul>`;

  refs.countryInfoContainer.innerHTML = countryInfoMarkup;
  refs.countryList.innerHTML = '';
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name'),
    {
      timeout: 2000,
    };
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
  refs.countryInfoContainer.innerHTML = '';
}

function toManyCountriesError(error) {
  Notiflix.Notify.failure(
    'Too many matches found. Please enter a more specific name.',
    {
      timeout: 2000,
    }
  );
}
