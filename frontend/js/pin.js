// Function to drop a pin on the map
function dropPin(latLng) {
  if (marker) {
    marker.setPosition(latLng);
  } else {
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP,
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

function hideMarkers() {
  setMapOnAll(null);
}

function buildContent(memory) {
  const content = document.createElement("div");

  content.style.borderColor = "#d32121"; // Set the border color
  content.style.borderWidth = "2px"; // Set the border width
  content.style.borderStyle = "solid"; // Set the border style
  content.classList.add("property");
  content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa-solid ${memory["icon"]}" title="${memory["title"]}"></i>
    </div>
      <div class="details">
          <div class="price">${memory.title}</div>
          <div class="address">${memory.descx}</div>
          <div class="features">
          <div>
            <a href="${memory.link}" target="_blank">
              <i aria-hidden="true" class="fa fa-link fa-lg link" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>View Memory</span>
              </a>
          </div>
        </div>
      `;
  return content;
}

function buildSharedContent(memories){
  const content = document.createElement("div");

  content.style.borderColor = "#d32121"; // Set the border color
  content.style.borderWidth = "2px"; // Set the border width
  content.style.borderStyle = "solid"; // Set the border style
  content.classList.add("property");
  linkContent = buildLinks(memories["links"])
  content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa-solid ${memories["icon"]}" title="${memories["title"]}"></i>
    </div>
      <div class="details" >
          <div class="price">${memories.title}</div>
          <div class="address">${memories.titles}</div>
          <div class="features">${linkContent}</div>
      </div>     
      `;
  return content;

}

function buildLinks(links){
  // Assuming memories.links is an array of URLs

  // Initialize an empty string to hold the HTML
  let htmlContent = '';

  // Iterate over each link and append the HTML string for each link
  links.forEach(link => {
      htmlContent += `
      <div style="display: inline-block; padding: 10px; margin-right: 10px;">
              <a href="${link}" target="_blank">
                  <i aria-hidden="true" class="fa fa-link fa-lg link" title="bedroom"></i>
                  <span class="fa-sr-only">bedroom</span>
                  <span>View Memory</span>
              </a>
          </div>
      `;
  });

  return htmlContent;
}
