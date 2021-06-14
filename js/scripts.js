const URL = "https://randomuser.me/api/1.3/?results=12&nat=us&exc=id,login,registered&noinfo";
const body = document.querySelector("body");
body.style.background = "lightblue";
const gallery = document.getElementById("gallery");
let employeeDataArray = [];

/**-----------------------------------
 *          FETCH FUNCTIONS
 -------------------------------------*/

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const res = await checkStatus(response);
        const result = await res.json();
        return result.results
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


fetchData(URL)
    .then(generateCard)
    .then(genModCon)

/**-----------------------------------
 *          HELPER FUNCTIONS
 -------------------------------------*/

function generateCard(data) {
    employeeDataArray = data;
    employeeDataArray.forEach((result, index)  => {
        const picture = result.picture.large;
        const name = `${result.name.first} ${result.name.last}`;
        const email = result.email;
        const cityState = `${result.location.city}, ${result.location.state}`;
    
        const htmlCard = `
            <div class="card active" data-index="${index}" data-employee="${name.first} ${name.last}">
                <div class="card-img-container">
                    <img class="card-img" src="${picture}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${name}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${cityState}</p>
                </div>
            </div>
        `;
        gallery.insertAdjacentHTML("beforeEnd", htmlCard);
    })
}


function genModCon() {
    const genModalDiv = `<div class=modal-container></div>`;
    gallery.insertAdjacentHTML("afterEnd", genModalDiv);
    const modalDiv = document.querySelector(".modal-container");
    modalDiv.style.display = "none";
}


const displayModal = (index) => {
    let { picture, name, email, location: { city, street, state, postcode
    }, dob, cell} = employeeDataArray[index];
    
    const fullName = `${name.first} ${name.last}`;
    const address = `${street.number} ${street.name}, ${city}, ${state} ${postcode}`;
    const bDay = formatBDay(dob.date);
    const cellNum = formatCell(cell);
    
    const htmlModal = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container" data-index="${index}">
                    <img class="modal-img" src="${picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${fullName}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${city}</p>
                    <hr>
                    <p class="modal-text">Mobile: ${cellNum}</p>
                    <p class="modal-text">${address}</p>
                    <p class="modal-text">Birthday: ${bDay}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
    `;
    const modCon = document.querySelector(".modal-container");
    modCon.innerHTML = htmlModal;
    modCon.style.display = "";
    modCon.style.background = "orange";
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

gallery.addEventListener("click", (e) => {
    if (gallery !== e.target) {
        const clicked = e.target.closest(".card");
        const idx = clicked.getAttribute("data-index");
        displayModal(idx);
    }
});


body.addEventListener("click", (e) => {
    if (e.target.textContent === "X") {
        const modalCon = document.querySelector(".modal-container");
        modalCon.style.display = "none";
    }
});