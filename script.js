const KEY = "0adbb34bf81e230a73e19aaaeee72637";
const moviesContainer = document.getElementById("movies");
const searchBar = document.getElementById("search");
const loading = document.getElementById("loading");

function showMovies(container, movies){
    if(movies.length == 0) {
        container.innerHTML =  "No results found";
        return;
    }

    let toShow = ``;
        movies.forEach(function(movie){
            toShow += `
                <li>
                    <figure>
                        <figcaption><h3>${movie.title}</h3></figcaption>
                        <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${movie.poster_path}" alt=""/>  
                    </figure>
                    <div class="overview">
                        <h3>Overview</h3>
                        <p>${movie.overview}</p>
                    </div>
                </li>
            ` 
        })
    container.innerHTML =  toShow;
};

function getPopularMovis(){

    let popularMovies =  JSON.parse(localStorage.getItem('popularMovies'));

    if(!popularMovies) {
        loading.style.display = "block";
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`)
        .then(res => res.json())
        .then(data => {
            showMovies(moviesContainer, data.results)
            localStorage.setItem('popularMovies', JSON.stringify(data.results))
            loading.style.display = "none";
        })
        .catch((err) => console.log(err))
    } else {
        showMovies(moviesContainer, popularMovies)
    }
}; 

function searchMovies(movie){ 

    let movies = JSON.parse(localStorage.getItem('searchMovies'));

    if(movies && movies.length > 0){
        const filteredMovies = movies.filter (mov => {
        return mov.title.toLowerCase().includes(movie.toLowerCase())
        })

        if (filteredMovies.length > 0) { 
            showMovies(moviesContainer, filteredMovies)
        } else {
            loading.style.display = "block";
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${movie}&include_adult=false`)
            .then(res => res.json())
            .then(data => {
                let stored = JSON.parse(localStorage.getItem('searchMovies'));
                localStorage.setItem('searchMovies', JSON.stringify([...stored, ...data.results]));
                showMovies(moviesContainer, data.results);
                loading.style.display = "none";
            })
        }
    } else {
        loading.style.display = "block";
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${movie}&include_adult=false`)
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('searchMovies', JSON.stringify( data.results));
            showMovies(moviesContainer, data.results);
            loading.style.display = "none";
        })
    }
}

function onChange(e) {

    if (e.target.value.length == 0) {
        let movies = JSON.parse(localStorage.getItem('popularMovies'))
        showMovies(moviesContainer, movies)
    }

    if ( 0 != e.target.value.length <= 3) { return } 

    searchMovies(e.target.value);
}

const debounce = (func, ms) => {
    let timeout;
    return function() {
        const funcCall = () => { func.apply(this, arguments) };
        clearTimeout(timeout);
        timeout = setTimeout(funcCall, ms);
    };
};

onChange = debounce(onChange, 500);

getPopularMovis();
searchBar.addEventListener('keyup', onChange);

