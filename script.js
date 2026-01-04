const searchInput = document.getElementById('search-input'); // stores the user input
const searchResults = document.getElementById('search-results'); // gets pictures / title from last.fm api

searchInput.addEventListener('keyup', handleSearch);

function handleSearch(event) {
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
        });
}

function updateSearchResults(data) {
    searchResults.innerHTML = '';
    const albums = data.results.albummatches.album;

    albums.forEach(album => {
        const albumTitle = album.name;
        const imageURL = album.image[3]['#text'];

        const albumElement = document.createElement('div');
        albumElement.classList.add('album');

        // Album image
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;

        // Overlay
        const overlayElement = document.createElement('div');
        overlayElement.classList.add('overlay');

        const overlayActions = document.createElement('div');
        overlayActions.classList.add('overlay-actions');

        // Calculate (click handler only for now)
        const overlayText = document.createElement('span');
        overlayText.classList.add('overlay-text');
        overlayText.textContent = 'Calculate';

        overlayText.addEventListener('click', () => {
            console.log('Calculate clicked:', album.name);
        });

        // Album + artist info
        const artistName = album.artist;
        const albumName = album.name;

        // Last.fm link
        const lastfmText = document.createElement('a');
        lastfmText.classList.add('overlay-text');
        lastfmText.textContent = 'Last.fm';
        lastfmText.href = `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`;
        lastfmText.target = '_blank';

        // Spotify link
        const spotifyText = document.createElement('a');
        spotifyText.classList.add('overlay-text');
        spotifyText.textContent = 'Spotify';
        spotifyText.href = `https://open.spotify.com/search/${encodeURIComponent(artistName + ' ' + albumName)}`;
        spotifyText.target = '_blank';

        // Build overlay
        overlayActions.appendChild(overlayText);
        overlayActions.appendChild(lastfmText);
        overlayActions.appendChild(spotifyText);
        overlayElement.appendChild(overlayActions);

        // Album title
        const titleElement = document.createElement('span');
        titleElement.textContent = albumTitle;

        // Assemble album card
        albumElement.appendChild(imageElement);
        albumElement.appendChild(overlayElement);
        albumElement.appendChild(titleElement);

        searchResults.appendChild(albumElement);
    });
}
