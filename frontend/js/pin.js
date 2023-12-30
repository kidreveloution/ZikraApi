// Function to drop a pin on the map
function dropPin(latLng) {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP
            // Optional: specify a custom icon
            // icon: 'path/to/your/custom/pin/image.png'
        });
    }
}

function setMapOnAll(map) {
    for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(map);
    }
}

function hideMarkers(){
    setMapOnAll(null);
}
  
function buildContent(memory) {
    const content = document.createElement("div");
    content.style.borderColor = "#00000"; // Set the border color
    content.style.borderWidth = "2px"; // Set the border width
    content.style.borderStyle = "solid"; // Set the border style
  
    content.classList.add("memory");
    //memory = memory[0]

    


    if (memory['link'].includes("instagram")) {
        imgEmbed= getInstagramEmbedCode(memory['link'])
        console.log(memory)
        content.innerHTML = `
        <div class="icon">
            <i aria-hidden="true" class="fa-solid ${memory['icon']}" title="${memory['title']}"></i>
        </div>
        <div class="details">
            <div class="link">
                <a href="${memory['link']}" target="_blank"> 
                    <div class="title">${memory['title']}</div>
                </a>
            </div>
            <div class="id">
                ${memory['id']}
            </div>
        `;
    
    }else{

    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa-solid ${memory['icon']}" title="${memory['title']}"></i>
      </div>
      <div class="details">
          <div class="title">${memory['title']}</div>
          <div class="link">${memory['link']}</div>
          </div>
      </div>
      `;
    }
    return content;
}
function getInstagramEmbedCode(instagramLink) {
    // Check if the provided link is an Instagram image link.
    if (instagramLink.match(/instagram\.com\/p\/[^/]+\/(\?.*)?/)) {
        // Extract the image URL.
        const mediaURL = `${instagramLink.split('/').slice(0, -1).join('/')}/media/?size=l`;

        // Create HTML code to embed the image.
        const embedCode = `<img src="${mediaURL}" alt="Instagram Media">`;
        
        return embedCode;
    } else if (instagramLink.match(/instagram\.com\/reel\/[^/]+\/?/)) {
        // Extract the thumbnail URL for the Instagram Reel.
        const thumbnailURL = `${instagramLink.split('/').slice(0, -1).join('/')}/media/?size=l`;

        // Create HTML code to display the thumbnail image.
        const embedCode = `<img src="${thumbnailURL}" alt="Instagram Reel Thumbnail">`;
        
        return embedCode;
    } else {
        return 'Invalid Instagram link. Please provide a direct image or video link.';
    }
}


