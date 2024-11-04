const global ={
    currentPage: window.location.pathname,
    search:{
        term: '',
        type:'',
        page:1,
        totalPages:1,
        totalResults: 0
    },
    api: {
        API_Key : '9ed61c667feef27bd54618cc670573e4',
        API_URL : 'https://api.themoviedb.org/3/'
    }
}

// Fetch Data From Tmdb  Api
async function fetchApiData(endpoint) {
    const API_Key = global.api.API_Key ;
    const API_URL = global.api.API_URL
   
    displaySpinner() 
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_Key}&language=en-US`)
    const data = await response.json()  

    hideSpinner()
    
    return data
}

//make search request
async function searchApiData() {
    const API_Key = global.api.API_Key ;
    const API_URL = global.api.API_URL
    displaySpinner()
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_Key}&language=en-US&query=${global.search.term}&page=${global.search.page}`)
    const data = await response.json()  

    hideSpinner()
    
    return data
}



//Display popularmovies
async  function displayPopularMovies () {
    
    
    const {results} = await fetchApiData('movie/popular')
    const grid = document.getElementById('popular-movies')
    
    results.forEach( movie => {
        const movieCard = document.createElement('div')
        movieCard.classList.add('card')
        movieCard.innerHTML =
         `
         <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
         
      `
      grid.appendChild(movieCard)
     
    } ) 
    
}

async  function tvShows () {
     
    const {results} = await fetchApiData('trending/tv/day')
    const grid = document.getElementById('popular-shows')
   
    
    results.forEach( show => {
        const showCard = document.createElement('div')
        showCard.classList.add('card')
        showCard.innerHTML =
         `
         <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
          </p>
        </div>      
      `
      grid.appendChild(showCard)
     
    } ) 
    
}

//Disply Movie Details 
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1]

    const movie = await fetchApiData(`movie/${movieId}`)
    

     
    displayBackground('movie',movie.backdrop_path)
     
    const movieDetails = document.createElement('div')
        
     movieDetails.innerHTML =
        `
        <div class="details-top">
          <div>
             ${
            movie.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map( genre =>`<li>${genre.name}</li>`).join('')}
              
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            <a class="btn" href="/reviews.html">To Reviews</a>
          </div>
          
        </div>
         sssss
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addcommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span>$${addcommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime}minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map(company => `<span>${company.name}</span>`).join()}
          </div>
        </div>
        `
        document.getElementById('movie-details').appendChild(movieDetails)

        getReviews(movieId,global.currentPage)
    
}



// DISPLAY tV SHOWS DETAILS
async function displayShowDetails() {
    const TVId = window.location.search.split('=')[1]

   
  
    const show = await fetchApiData(`tv/${TVId}`)
    
     
   
    const showDetails = document.createElement('div')
        
     showDetails.innerHTML =
        `
        <div id="show-details">
        <div class="details-top">
          <div>
            ${
                show.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />` : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
                />`
            }

           
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map(show => `<li>${show.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
             <a class="btn" href="/reviews.html">To Reviews</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes} </li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> 
              ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">last Air Date:</span> ${show.last_episode_to_air.air_date}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(company => `<span>${company.name}</span>`).join('')}</div>
        </div>
      </div>
      `
      
      
      displayBackground('tv',show.backdrop_path)
     

      getReviews(TVId,global.currentPage)
}


async function getReviews(TVId, type) {
  let data;
  if (type === '/movie-details.html') {
    data = await fetchApiData(`movie/${TVId}/reviews`);
  } else {
    data = await fetchApiData(`tv/${TVId}/reviews`);
  }

  // Store reviews in localStorage
  localStorage.setItem('reviews', JSON.stringify(data));


}


function displayReviews(data) {
  const reviewsContainer = document.getElementById('reviews-container');
  
  if (data.results.length === 0) {
    reviewsContainer.innerHTML = '<p>No reviews found.</p>';
    return;
  }

  const reviewsHTML = data.results.map(review => `
    <div class="card">
      <div class="heading">
        <h3>${review.author}</h3>
      </div>
      <br>
      <div class="card-body">
        <p>${review.content}</p>
      </div>
    </div>
  `).join('');

  reviewsContainer.innerHTML = reviewsHTML;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });
  });
  
}

// Function to Search 
async function search() {
       // Get the query string from the URL
    const queryString = window.location.search;
     console.log(queryString)
    // Create a URLSearchParams object
    const urlparams = new URLSearchParams(queryString);

    // Get the 'type' and 'search-term' parameters
    global.search.type = urlparams.get('type');
    global.search.term = urlparams.get('search-term');

    if (global.search.term !== '' && global.search.term !== null) {
        
        const {results,total_pages,page,total_results}  = await searchApiData(); 
        global.search.page = page
        global.search.totalPages = total_pages
        global.search.totalResults = total_results

       
        
        if (results.length === 0) {
            showAlert('Not Found','error')
            return;
        }

        displaySearchResults(results)
        
    } else {
        showAlert('please enter a search term','error'); 
    }
    

}

function displaySearchResults(results){
    document.getElementById('search-results').innerHTML =''
    document.getElementById('search-results-heading').innerHTML = ''
    document.getElementById('pagination').innerHTML =''

    results.forEach( result => {
        const resultCard = document.createElement('div')
        resultCard.classList.add('card')
        resultCard.innerHTML =
         `
         <a href="${global.search.type}-details.html?id=${result.id}">
          ${
            result.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                class="card-img-top"
                alt="${(global.search.type === 'movie')?result.title: result.name}"
              />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${(global.search.type === 'movie')?result.title: result.name}"
            />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${(global.search.type === 'movie')?result.title: result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${(global.search.type === 'movie')?result.release_date: result.first_air_date}</small>
          </p>
        </div>
         
      `
        document.getElementById('search-results-heading').innerHTML = `
          <h2>${results.length} of ${global.search.totalResults} for ${global.search.term}</h2>
            `
        document.getElementById('search-results').appendChild(resultCard)

     
    } ) 
    displayPagination()
}

// DISPLAY TV MOVIES BACKGROUND
function displayBackground (type,path) {
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage =(`url(https://image.tmdb.org/t/p/original/${path})`)
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
      document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
      document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

function displayPagination () {
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML =`<button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of  ${global.search.totalPages}</div> `
    
    document.getElementById('pagination').appendChild(div)

    if(global.search.page === 1){
        document.getElementById('prev').disabled = true
    } 
    
    if (global.search.page === global.search.totalPages){
        document.getElementById('next').disabled = true
   
    }

 

    //NEXT PAGE 
    
    document.getElementById('next').addEventListener('click', async () => {
            global.search.page++
            const {results,total_page} = await searchApiData()
            displaySearchResults(results)
    })

    document.getElementById('prev').addEventListener('click', async () => {
            global.search.page--
            console.log(global.search.page)
            const {results,total_page} = await searchApiData()
            displaySearchResults(results)
    })
}
//Display Slider Movies 
async function moviedisplayslider() {
    const {results} = await fetchApiData('movie/now_playing')
    

    results.forEach( movie => {
        const slide = document.createElement('div')
        slide.classList.add('swiper-slide')

        slide.innerHTML = 
        `
          ${
            movie.poster_path ? `
            <a href="movie-details.html?id= ${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          </a>` :
               `<a href="movie-details.html?id= ${movie.id}">
               <img src="./images/no-image.jpg" alt="${movie.title}" />
             </a>`
          }
          
          <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
        
        `
        document.querySelector('.swiper-wrapper').appendChild(slide)
        initSwiper()
    })
}
async function showdisplayslider() {
    const {results} = await fetchApiData('tv/top_rated')
    

    results.forEach( show => {
        const slide = document.createElement('div')
        slide.classList.add('swiper-slide')

        slide.innerHTML = 
        `
          ${
            show.poster_path ? `
            <a href="tv-details.html?id= ${show.id}">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.original_name}" />
          </a>` :
               `<a href="show-details.html?id= ${show.id}">
               <img src="./images/no-image.jpg" alt="${show.original_name}" />
             </a>`
          }
          
          <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(1)} / 10
            </h4>
        
        `
        document.querySelector('.swiper-wrapper').appendChild(slide)
        initSwiper()
    })
}

//Initialize Swiper
function initSwiper() {
    const swiper = new Swiper ('.swiper',{
        slidesPerView:1,
        spaceBetween: 30,
        freeMode:true,
        loop: true,
        autoplay: {
            delay : 4000,
            disableOnInteraction:false
        },
        breakpoints: {
            500:{
                slidesPerView:2
            },
            700:{
                slidesPerView:3
            },
            1200:{
                slidesPerView:4
            }
        }
    })
}
// Display Spinner on load
function displaySpinner () {
    const spinner = document.querySelector('.spinner')

    spinner.classList.add('show')
}

// Hide Spinner on load
function hideSpinner () {
    const spinner = document.querySelector('.spinner')

    spinner.classList.remove('show')
}

//SHOW ELEMENT 
function showAlert (message,className) {
    const alertEL = document.createElement('div')
    alertEL.classList.add('alert',className)
    alertEL.appendChild(document.createTextNode(message))
    document.getElementById('alert').appendChild(alertEL)


    setTimeout(() => {
        alertEL.remove()
          
    },5000)

}

//Higlight Active Link
function highlightActiveLinks() {
    const links = document.querySelectorAll('.nav-link')

    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active')
        }
    })
}

function addcommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

//Initialization 
function init() {
    switch(global.currentPage){
        case '/':
        case '/index.html':
            moviedisplayslider()
            displayPopularMovies()
            break;
        case '/shows.html':
            showdisplayslider()
            tvShows()
            break;
        case '/movie-details.html':
            displayMovieDetails()          
            break;
        case '/tv-details.html':
            displayShowDetails()
            break;
        case '/search.html':
            search();
            break;
        case '/reviews.html':
          const reviews = JSON.parse(localStorage.getItem('reviews'));
          displayReviews(reviews)
            break;
}
highlightActiveLinks()
}


document.addEventListener('DOMContentLoaded',init)
