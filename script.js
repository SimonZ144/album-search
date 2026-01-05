const searchInput = document.getElementById('search-input'); // stores the user input
const searchResults = document.getElementById('search-results'); // gets pictures / title from last.fm api
const apiKey = 'a8d08ca83f8452289db0aa331422af44';

searchInput.addEventListener('keyup', handleSearch);

function handleSearch(event) {
    const searchTerm = event.target.value;

    if (searchTerm.length < 1) {
        searchResults.innerHTML = '';
        return;
    }

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchTerm}&api_key=${apiKey}&format=json`;


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateSearchResults(data);
        });
}

// CALCULATING SCORE 
function calculateScore() { 
    const scoreInputs = document.querySelectorAll('.track-score'); 

    let total = 0; 
    let count = 0; 

    scoreInputs.forEach(input => {
        const value = Number(input.value);

        if (!isNaN(value)) { 
            total += value; 
            count++; 
        }

    });

    const maxScore = count * 10; 
    const average = count > 0 ? (total / maxScore) * 10 : 0; 

    document.getElementById('modal-score').classList.remove('hidden'); 
    const score = document.getElementById('modal-score-value'); 
    score.textContent = average.toFixed(1); 
};  


const closeButton = document.querySelector('.modal-close') 
const modalBackdrop = document.getElementById('modal-backdrop')

closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    modalBackdrop.classList.add('hidden');
    document.body.classList.remove('modal-open');
});
     

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

        const title = album.name + " by " + album.artist; 

        // CLCULATE HANDLE 
    
        overlayText.addEventListener('click', () => {


            const modal = document.getElementById('modal-backdrop'); 
            modal.classList.remove('hidden'); 
            document.body.classList.add('modal-open'); 
            document.getElementById('modal-album-title').textContent = title; 
        


            // ALBUMS NAMES 
            const albumName = album.name; 
            const artist = album.artist; 
            const trackUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(albumName)}&format=json`;

            fetch(trackUrl)
                .then(res => res.json())
                .then(data => { 
                    const trackListEl = document.getElementById('modal-track-list');
                    trackListEl.innerHTML = ''; 

                    let tracks = data.album.tracks.track; 
                    
                    tracks = Array.isArray(tracks) ? tracks : [tracks]; 

                    tracks.forEach((track, index) => { 
                        const seconds = parseInt(track.duration, 10) || 0; 
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60; 
                        const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                        const row = document.createElement('div'); 
                        row.classList.add('track-row'); 
                        
                        const label = document.createElement('span'); 
                        label.textContent = `${index + 1}. ${track.name} (${formattedTime})`;
                        
                        // INPUT 
                        const input = document.createElement('input'); 
                        
                        input.addEventListener('input', () => {
                            let value = Number(input.value); 

                            if (value > 10) input.value = 10; 

                            if (value < 0) input.value = 0; 

                            calculateScore(); 
                        }); 

                        input.type = 'number'; 
                        input.min = '0'; 
                        input.max = '10'; 
                        input.placeholder = '0-10';

                        input.classList.add('track-score'); 

                        row.appendChild(label);
                        row.appendChild(input); 
                        trackListEl.append(row); 

                        
                    }); 



                }); 
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
