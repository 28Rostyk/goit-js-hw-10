const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchQueary: document.querySelector('#search-box'),
  countryListUI: document.querySelector('.country-list'),
  countryInfoUI: document.querySelector('.country-info'),
};

let formValue = '';
refs.searchQueary.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  formValue = refs.searchQueary.value.trim();
  if (formValue === '') {
    clearRender();
    return;
  }
  fetchCountries(formValue)
    .then(countries => {
      if (countries.length === 1) {
        clearRender();
        renderCountryTitle(countries);
        renderCountryInfo(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
        clearRender();
        renderCountryTitle(countries);
      } else if (countries.length > 10) {
        clearRender();
        Notify.info(
          'Too many mathces found. Please enter a more spesific name',
          { timeout: 100, cssAnimationDuration: 1000 }
        );
      }
    })
    .catch(erorr => {
      clearRender();
      Notify.failure('Oops, there is no country with that name', {
        timeout: 100,
        cssAnimationDuration: 1000,
      });
    });
}

function renderCountryTitle(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
      <img class='country-img' src="${country.flags.svg}" alt="flag">
      <p class="country-name">${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryListUI.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(countries) {
  const langs = countries.map(({ languages }) =>
    Object.values(languages).join(', ')
  );
  const markup = countries
    .map(country => {
      return `<p class="info-text">Capital: <span class="value">${country.capital}</span></p>
      <p class="info-text">Population: <span class="value">${country.population}</span></p>
      <p class="info-text">languages: <span class="value">${langs}</span></p>`;
    })
    .join('');
  refs.countryInfoUI.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryListUI.innerHTML = '';
  refs.countryInfoUI.innerHTML = '';
}

// function catchError() {
//   clearRender();
//   Notify.failure('Oops, there is no country with that name', {
//     timeout: 100,
//     cssAnimationDuration: 1000,
//   });
// }
