export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(status)
    .then(r => {
      return r.json();
    });
}

function status(res) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
}

// import axios from 'axios';

// export function fetchCountries(name) {
//   return axios
//     .get(
//       `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
//     )
//     .then(({ data }) => data);
// }
