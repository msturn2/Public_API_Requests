document.querySelector("body").style.background = "lightblue";
const gallery = document.getElementById('gallery');
const employees = [];

/**-----------------------------------
 *          FETCH FUNCTIONS
 -------------------------------------*/

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const res = await checkStatus(response);
        return res.json();
    } catch (error) {
        return console.error("There was a problem fetching the data", error);
    }
}


function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


fetchData('https://randomuser.me/api/1.3/?results=12&nat=us&exc=id,login,registered')
.then(data => {
    
    employees.push(...data.results);
    generateCard(employees)
    generateModalElement();
    displayCardModal(employees);
    buttonToClose();
});

/**-----------------------------------
 *          HELPER FUNCTIONS
 -------------------------------------*/

/**
    Search markup: You can use the commented out markup below as a template for your search feature, but you must use JS to create and 
    append it to `search-container` div.

    IMPORTANT: Altering the arrangement of the markup and the 
    attributes used may break the styles or functionality.

    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
*/


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
    modContainer.style.background = "orange";
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
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `;
    const modDiv = document.querySelector(".modal");
    modDiv.insertAdjacentHTML("beforeEnd", htmlModal);
}


// function nextPrevButtons() {
//     const htmlButtons = `
//         <div class="modal-btn-container">
//             <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
//             <button type="button" id="modal-next" class="modal-next btn">Next</button>
//         </div>
//     `;
//     const modInfo = document.querySelector(".modal-info.container");
//     modInfo.insertAdjacentHTML("afterEnd", htmlbuttons);
// }

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


function prevButton(data) {
    const prev = document.querySelector("#modal-prev");
    prev.addEventListener("click", (e)=> {
        const cards = document.querySelectorAll
    });
}


// function nextPrev(data) {
//     const ntPvButton = document.querySelectorAll("#modal");
// }


function buttonToClose() {
    const buttonClose = document.querySelector("#modal-close-btn");
        
    buttonClose.addEventListener("click", () => {
        const modInfoCon = document.querySelector(".modal-info-container")
        buttonClose.parentNode.parentNode.style.display = "none";
        modInfoCon.nextElementSibling.remove();
        modInfoCon.remove();
    });
}
console.log(employees);