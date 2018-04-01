(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Client-ID 94492559b8735932f3685dcedfdf913825fabb9481e7c416dda1636420d9fb41'
                }
            }
        ).then(response => response.json())
            .then(addImage).catch(e => requestError())



        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=bc4ffc4e31b14caa8c71c60b08058319`,
            {
                method: 'GET',

            }
        ).then(response => response.json())
            .then(addArticles).catch(e => requestError())
    });

    function addImage(data) {

        let htmlContent = '';

        const firstImage = data.results[0];
        if (firstImage) {
            htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`
        } else {
            htmlContent = 'Unfortunately, no image was returned for your search.'
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
    }

    function addArticles(data) {
        let htmlContent = '';

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li>
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snipper}</p>
                    </li>`).join('')+ '</ul>'
        } else {
            htmlContent = '<div class=error-no-article>No article available</div>'
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
    }


    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();
