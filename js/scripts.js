
//narrowed url to exclude sensative information added 
//background color to body
const api = "https://randomuser.me/api/1.3/?results=12&nat=us&exc=id,login,registered&noinfo";
const body = document.querySelector("body");
body.style.background = "lightblue";
const gallery = document.getElementById("gallery");
let employeeDataArray = [];

/**-----------------------------------
 *          FETCH FUNCTIONS
 -------------------------------------*/

//User can still interact with page while programing loads
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const res = await checkStatus(response);
        const result = await res.json();
        return result.results
    } catch (error) {
        const errorDiv = `
            <div class="error">
                <h2>Oh no....something went wrong! Please contact support
                </h2>
            </div>`;
        //insertAdjacentHTML used over innerHTML because of directions
        gallery.insertAdjacentHTML("beforeEnd", errorDiv);
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


fetchData(api)
    .then(generateCard)
    .then(genModCon)

/**-----------------------------------
 *          HELPER FUNCTIONS
 -------------------------------------*/

const displaySearchBar = () => {
    const htmlSearch = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    document.querySelector(".search-container").insertAdjacentHTML("afterEnd", htmlSearch);
}
//Called function in order to push to the DOM. Placed function
//call outside of fetchData call because element wouldn't exist
//yet
displaySearchBar();

//search for employee by name
const search = (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input").value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {
        //data-employee = ${name} was added to each card in generateCard()
        //to make search easier
        let employee = card.getAttribute("data-employee").toLowerCase();
        //grabbed employee index in order to display search relative cards
        employee.indexOf(searchInput) >= 0 ? card.style.display = "" : card.style.display = "none";
    })
}

//chose function declaration instead of function expression because
//of scope for fetchData call
function generateCard(data) {
    //setting employeeDataArray = data allows access to data from 
    //fetchData call
    employeeDataArray = data;
    //looped over employeeDataArray to creat each individual card
    employeeDataArray.forEach((result, index)  => {
        //object literals allow each cards specific data to populate
        const picture = result.picture.large;
        const name = `${result.name.first} ${result.name.last}`;
        const email = result.email;
        const cityState = `${result.location.city}, ${result.location.state}`;
    
        const htmlCard = `
            <div class="card" data-index="${index}" data-employee="${name}">
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

//Chose to create anchor div in order to pin modal window to when
//fetchData is called above.  Also used function declaration because
//of scope
function genModCon() {
    const genModalDiv = `<div class=modal-container></div>`;
    gallery.insertAdjacentHTML("afterEnd", genModalDiv);
    const modalDiv = document.querySelector(".modal-container");
    modalDiv.style.display = "none";
}

//used index as param to allow easy functionallity and scalability
const displayModal = (index) => {
    //chose to use object deconstruct because of object literals lengths
    let { picture, name, email, location: { city, street, state, postcode
    }, dob, cell} = employeeDataArray[index];
    
    const fullName = `${name.first} ${name.last}`;
    const address = `${street.number} ${street.name}, ${city}, ${state} ${postcode}`;
    //formatting callback fuctions stored as variables in order to
    //clean up code
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
    //chose innerHTML vs. insertAdjacentHTML because it made life 
    //easier....lol
    modCon.innerHTML = htmlModal;
    modCon.style.display = "";
    //custom styling added
    modCon.style.background = "orange";
}

//allows scrolling of cards through the modal window
const selectDataIndex = (button) => {
    const cards = document.querySelectorAll(".card");
    const modInfoCon = document.querySelector(".modal-info-container");
    const modalIndex = +modInfoCon.getAttribute("data-index");
    //findIndex used to access employee index
    const cardIndex = [...cards]
        .findIndex(card => +(card.attributes[1].value) === modalIndex);
    //ternary used to determine location index so that event listener
    //logic below will work
    const prevModInfo = cardIndex - 1 >= 0 ? cardIndex - 1 : cards.length - 1;
    //data-index that was inserted in both generateCard() and
    //displayModal() is used to access prev/next in employeeDataArray
    const prevIndex = +(cards[prevModInfo].getAttribute("data-index"));
    const nextModInfo = cardIndex + 1 <= cards.length - 1 ? cardIndex + 1 : 0;
    const nextIndex = +(cards[nextModInfo].getAttribute("data-index"));
    //conditional returns direction for lower portion of body
    //eventListener
    if (button === "previous") {
        return prevIndex;
    } else if (button === "next") {
        return nextIndex;
    }
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

document.querySelector("#search-submit").addEventListener("click", search);

//allows modal to display for clicked card
gallery.addEventListener("click", (e) => {
    if (gallery !== e.target) {
        const clicked = e.target.closest(".card");
        const idx = clicked.getAttribute("data-index");
        displayModal(idx);
    }
});

//handles interactions with modal window by closeing or scrolling
//based on callbacks functionallity
body.addEventListener("click", (e) => {
    if (e.target.textContent === "X") {
        const modalCon = document.querySelector(".modal-container");
        modalCon.style.display = "none";
    } else if (e.target.textContent === "Prev") {
        displayModal(selectDataIndex("previous"));
    } else if (e.target.textContent === "Next") {
        displayModal(selectDataIndex("next"));
    }
});