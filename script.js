const searchInput = document.getElementById('search-input'); // stores the user input
const searchResults = document.getElementById('search-results'); // gets pictures / title from last.fm api


searchInput.addEventListener('keyup', handleSearch) 
function handleSearch(event) { // if lower than 1 returns nothing however if higher proceeds with code
    const searchTerm = event.target.value;
    if (searchTerm.length < 1) {
        searchResults.innerHTML = '';
        return;
    }


    const apiKey = 'a8d08ca83f8452289db0aa331422af44';
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchTerm}&api_key=${apiKey}&format=json`;


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateSearchResults(data);
        })
}


function updateSearchResults(data) {
    searchResults.innerHTML = '';  
    const albums = data.results.albummatches.album;


    albums.forEach(album => {
        const albumTitle = album.name;
        const imageURL = album.image[3]['#text']; // might have to fix this part as repeats in albums show


        const albumElement = document.createElement('div');
        albumElement.classList.add('album');


        const imageElement = document.createElement('img');
        imageElement.src = imageURL;


        const titleElement = document.createElement('span');
        titleElement.textContent = albumTitle;


        albumElement.appendChild(imageElement);
        albumElement.appendChild(titleElement);


        searchResults.appendChild(albumElement);
    });
}
