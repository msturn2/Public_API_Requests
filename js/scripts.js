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


Promise.all([
    fetchData('https://randomuser.me/api/1.3/?results=12&exc=gender,login,registered,id,nat')
])
.then(data => {
    const results = data[0].results;
    console.log(results);

    results.forEach(result => {
        const picture = result.picture.large;
        const name = `${result.name.first} ${result.name.last}`;
        const email = result.email;
        const location = `${result.location.city}, ${result.location.state}`;
        
        generateCard(picture, name, email, location);
    })
})

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


function generateCard(picture, name, email, location) {
    const htmlCard = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${picture}" alt="${name}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${location}</p>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('beforeend', htmlCard);
}