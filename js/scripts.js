const gallery = document.getElementById('gallery');

/**-----------------------------------
 *          FETCH FUNCTIONS
 -------------------------------------*/

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const res = await checkStatus(response);
        return res.json();
    } catch (error) {
        return console.log("Looks like there was a problem!", error);
    }
}


fetchData('https://randomuser.me/api/1.3/?results=12&nat=us&exc=id,login,registered')
.then(data => {
    console.log(data.results);
        
    generateCard(data.results)
    generateModalElement();
    displayCardModal(data.results);
    buttonToClose();
});

/**-----------------------------------
 *          HELPER FUNCTIONS
 -------------------------------------*/

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


function generateCard(data) {
    data.forEach(result => {
        const picture = result.picture.large;
        const name = `${result.name.first} ${result.name.last}`;
        const email = result.email;
        const cityState = `${result.location.city}, ${result.location.state}`;
    
        const htmlCard = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${picture}" alt="${name}">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${name}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${cityState}</p>
                </div>
            </div>
        `;
        gallery.insertAdjacentHTML('beforeEnd', htmlCard);
    })
}


function generateModalElement() {
    const htmlModalElement = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML("afterEnd", htmlModalElement);
    const modContainer = document.querySelector(".modal-container");
    modContainer.style.display = "none";
}


function generateModal(data) {
    const picture = data.picture.large;
    const name = `${data.name.first} ${data.name.last}`;
    const email = data.email;
    const cityState = `${data.location.city}, ${data.location.state}`;
    const city = data.location.city;
    const address = `${data.location.street.number} ${data.location.street.name}, ${cityState} ${data.location.postcode}`;
    const bDay = formatBDay(data.dob.date);
    const cell = formatCell(data.cell);

    const htmlModal = `
        <div class="modal-info-container">
            <img class="modal-img" src="${picture}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${name}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">Mobile: ${cell}</p>
            <p class="modal-text">${address}</p>
            <p class="modal-text">Birthday: ${bDay}</p>
        </div>
    `;
    const modDiv = document.querySelector(".modal");
    modDiv.insertAdjacentHTML("beforeEnd", htmlModal);
}

/**-----------------------------------
 *        FORMATTING FUNCTIONS
 -------------------------------------*/

function formatBDay(dob) {
    return dob.substring(0, 10).replace(/(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1");
}


function formatCell(cell) {
    return cell.replace(/^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/, "($1) $2-$3");
}

/**-----------------------------------
 *          EVENT LISTENERS
 -------------------------------------*/

function displayCardModal(data) {
    const cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", () => {
            generateModal(data[i]);

            gallery.nextElementSibling.style.display = "";
        });
    }
}


function buttonToClose() {
    const buttonClose = document.querySelector("#modal-close-btn");
    
    buttonClose.addEventListener("click", () => {
        buttonClose.parentNode.parentNode.style.display = "none";
        buttonClose.nextElementSibling.remove();
    });
}