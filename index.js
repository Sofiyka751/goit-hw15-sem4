import debounce from 'lodash.debounce';
import { alert, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

const searchCountries = debounce(async () => {
  const query = searchInput.value.trim();
  if (!query) {
    resultsDiv.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`https://restcountries.com/v2/name/${query}`);
    if (!response.ok) throw new Error('Not found');
    const countries = await response.json();

    resultsDiv.innerHTML = '';
    if (countries.length > 10) {
      info({ text: 'Забагато результатів. Уточніть запит.' });
    } else if (countries.length >= 2) {
      const list = document.createElement('ul');
      countries.forEach(c => {
        const item = document.createElement('li');
        item.textContent = c.name;
        list.appendChild(item);
      });
      resultsDiv.appendChild(list);
    } else if (countries.length === 1) {
      const c = countries[0];
      const html = `
        <div class="country">
          <h2>${c.name}</h2>
          <p><strong>Столиця:</strong> ${c.capital}</p>
          <p><strong>Населення:</strong> ${c.population.toLocaleString()}</p>
          <p><strong>Мови:</strong> ${c.languages.map(l => l.name).join(', ')}</p>
          <img class="flag" src="${c.flag}" alt="Прапор ${c.name}" style="width: 100px; margin-top: 10px;" />
        </div>`;
      resultsDiv.innerHTML = html;
    }
  } catch (err) {
    resultsDiv.innerHTML = '';
    alert({ text: 'Країну не знайдено.' });
  }
}, 500);

searchInput.addEventListener('input', searchCountries);

