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
    console.log(memory["icon"])
    console.log(memory)
    


    if (memory['link'].includes("instagram")) {
        imgEmbed= getInstagramEmbedCode(memory['link'])
        content.innerHTML = `
        <div class="icon">
            <i aria-hidden="true" class="fa-solid ${memory['icon']}" title="${memory['title']}"></i>
        </div>
        <div class="details">
            <div class="title">${memory['title']}</div>
            <div class="link">
            <a href="${memory['link']}" target="_blank"> <!-- Use target="_blank" to open link in a new tab -->
                <div class="image">${imgEmbed}</div>
            </a>
        </div>
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

function getInstagramImageEmbedCode(instagramLink) {
    // Check if the provided link is an Instagram image link (direct image link).
    if (instagramLink.match(/instagram\.com\/p\/[^/]+\/?/)) {
        // Extract the image URL.
        const imageURL = instagramLink.split('/').slice(0, -1).join('/') + '/media/?size=l';
        
        // Create HTML code to embed the image.
        const embedCode = `<img src="${imageURL}" alt="Instagram Image">`;
        
        return embedCode;
    } else {
        return 'Invalid Instagram image link. Please provide a direct image link.';
    }
}

function getInstagramEmbedCode(instagramLink) {
    // Check if the provided link is an Instagram image or video link.
    if (instagramLink.match(/instagram\.com\/p\/[^/]+\/?/)) {
        // Extract the image or video URL.
        const mediaURL = `${instagramLink.split('/').slice(0, -1).join('/')}/media/?size=l`;

        // Create HTML code to embed the media (image or video).
        const embedCode = `<img src="${mediaURL}" alt="Instagram Media">`;
        
        return embedCode;
    } else if (instagramLink.match(/instagram\.com\/reel\/[^/]+\/?/)) {
        // Extract the video URL from the Instagram Reel link.
        const videoURL = `${instagramLink}/embed`;

        // Create HTML code to embed the video.
        const embedCode = `<iframe src="${videoURL}" frameborder="0" allowfullscreen></iframe>`;
        
        return embedCode;
    } else {
        return 'Invalid Instagram link. Please provide a direct image or video link.';
    }
}


