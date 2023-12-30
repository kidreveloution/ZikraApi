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

// function buildContent(memory) {
//     const content = document.createElement("div");
//     content.style.borderColor = "#00000"; // Set the border color
//     content.style.borderWidth = "2px"; // Set the border width
//     content.style.borderStyle = "solid"; // Set the border style

//     content.classList.add("memory");
//     //memory = memory[0]
//         content.innerHTML = `
//         <div class="icon">
//             <i aria-hidden="true" class="fa-solid ${memory['icon']}" title="${memory['title']}"></i>
//         </div>
//         <div class="details" style="position: relative;">
//             <div class="link">
//                 <a href="${memory['link']}" target="_blank">
//                     <div class="title">${memory['title']}</div>
//                 </a>
//             </div>
//             <div class="id" style="font-size: smaller;">
//                 ${memory['id']}
//             </div>
//             <div class="close" style="position: flex; top: 0; right: 0; cursor: pointer;">
//                 <i class="fa-solid fa-xmark"></i>
//             </div>
//         </div>
//         `;

//         content.innerHTML = `
//         <div class="icon">
//             <i aria-hidden="true" class="fa-solid ${memory['icon']}" title="${memory['title']}"></i>
//             <span class="fa-sr-only">$</span>
//         </div>
//         <div class="details">
//             <div class="price">$</div>
//             <div class="address">$</div>
//             <div class="features">
//             <div>
//                 <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
//                 <span class="fa-sr-only">bedroom</span>
//                 <span>$</span>
//             </div>
//             <div>
//                 <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
//                 <span class="fa-sr-only">bathroom</span>
//                 <span>$</span>
//             </div>
//             <div>
//                 <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
//                 <span class="fa-sr-only">size</span>
//                 <span>$ ft<sup>2</sup></span>
//             </div>
//             </div>
//         </div>
//         `;
//     return content;
// }

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
          <div class="address">${memory.id}</div>
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
