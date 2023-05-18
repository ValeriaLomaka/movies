
const BASE_URL = 'https://api.themoviedb.org/3';
const END_POINT = '/trending/movie/week';
const API_KEY = '345007f9ab440e5b86cef51be6397df1';
const guard = document.querySelector('.js-guard');
const list = document.querySelector('.js-list');
let page = 1;

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

let observer = new IntersectionObserver(handlerPagination, options);
let counterObserver = 0;
observer.observe(guard);

function handlerPagination(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            page += 1;
            serviceMovie(page)
            .then(data =>
            list.insertAdjacentHTML('beforeend', createMarkup(data.results))
            );    
      }
  })
}

function serviceMovie(page = 1) {
    return fetch(`${BASE_URL}${END_POINT}?api_key=${API_KEY}&page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
}

serviceMovie()
  .then(data => {
      list.insertAdjacentHTML('beforeend', createMarkup(data.results))
      if (data.total_pages > data.page) {
          observer.observe(guard)
      }
  })
  .catch(error => console.log(error));

function createMarkup(arr) {
    return arr.map(({ original_title, poster_path, vote_average }) =>
    `<div class='card'>
    <li>
    <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}">
    <h2>${original_title}</h2>
    <p class = 'rating-box'>${vote_average}</p>
    </li></div>`).join('');
}


