document.addEventListener("DOMContentLoaded", fetchNewReleaseImage);

function fetchNewReleaseImage() {
    fetch("http://127.0.0.1:5000/newreleases")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayAlbumImages(data);
            }
        })
        .catch(error => console.error("Couldn't get new releases", error));
}

function displayAlbumImages(albums) {
    const container = document.getElementById('new-releases');
    container.innerHTML = "";
    albums.forEach(album => {
        const img = document.createElement('img');
        img.src = album.images;
        img.alt = `${album.album} by ${album.artists}`;
        container.appendChild(img);
    });
}
