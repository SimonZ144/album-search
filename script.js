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

        const overlayElement = document.createElement('div'); 
        overlayElement.classList.add('overlay'); 

        const overlayActions = document.createElement('div') 
        overlayActions.classList.add('overlay-actions')

        const overlayText = document.createElement('span');  

        overlayText.addEventListener('click', () => {
            console.log('Calculated clicked: ', album.name); 

        }); 

        overlayText.classList.add('overlay-text') 
        overlayText.textContent = "Calculate" 

        const lastfmText = document.createElement('a'); 
        lastfmText.classList.add('overlay-text'); 
        lastfmText.textContent = "Last.fm"; 

        const artistName = album.artist; 
        const albumName = album.name;

        lastfmText.href = `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`;
        lastfmText.target = '_blank'; 

        const spotifyText = document.createElement('a'); 
        spotifyText.classList.add('overlay-text'); 
        spotifyText.textContent = "Spotify"; 

        spotifyText.href = `https://open.spotify.com/search/${encodeURIComponent(artistName + ' ' + albumName)}`;
        spotifyText.target = '_blank';

        
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;


        const titleElement = document.createElement('span');
        titleElement.textContent = albumTitle;


        albumElement.appendChild(imageElement);
        albumElement.appendChild(overlayElement); 
        albumElement.appendChild(titleElement); 
       
        overlayActions.appendChild(overlayText);
        overlayActions.appendChild(lastfmText);
        overlayActions.appendChild(spotifyText);
        overlayElement.appendChild(overlayActions); 


        searchResults.appendChild(albumElement);
    });
}
