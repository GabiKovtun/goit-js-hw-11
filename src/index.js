import './css/styles.css';
import { debounce } from 'lodash';
import { fetchCountries } from './fetch';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
let name;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const inputValue = event.target.value.trim();
  console.log(inputValue);
  if (inputValue !== '') {
    fetchCountries(inputValue).then(foundData => {
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        renderCountryList(foundData);
      } else if (foundData.length === 1) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        renderCountryInfo(foundData);
      }
    });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}"  width="30" hight="20">
         <div>${country.name.official}</div>
        </li>`;
    })
    .join('');
    countryList.insertAdjacentHTML('beforeend', markup);
}
countryList.style.listStyle = 'none';

function renderCountryInfo(countries) {
    const markup = countries
      .map(country => {
        return `<div>
            <img src= ${country.flags.svg} width="120" hight="80" > 
            <p><b>Official name</b>: ${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>
            </div>`
      })
    countryInfo.insertAdjacentHTML('beforeend', markup);
  };
  