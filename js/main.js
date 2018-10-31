/*
* Exempel på att konsumera REST-webbtjänst
*
* Webbtjänst: http://sverigesradio.se/api/documentation/v2/index.html
*
* Specifik URI för att läsa ut kanallista i JSON-format: http://api.sr.se/api/v2/channels?format=json
* (Lägg till &indent=true i slutet av adressraden för att göra en läsbar från webbläsaren)
*
* URI för att läsa ut specifik kanal: http://api.sr.se/api/v2/channels/132?format=json
* (132 ersätts med det kanal-id som önskas)
*
* Kanallistan läses ut till ul-elementet i menyn med id: channel-list
* Huvudfönstret för utskrift har id: radio
*
* Tänkt format på utskrift:
*
<audio controls="" autoplay="">
    <source src="http://sverigesradio.se/topsy/direkt/213.mp3" type="audio/mpeg">
</audio>
<img src="" alt="">
*
*
* Av Mattias Dahlgren, 2017
*/

// Bugg: får två AJAX-anrop samtidigt (vilket ger mig två bilder och två spelare :/)

const elements = {
    container: document.querySelector('.container'),
    channelList: document.getElementById('channel-list'),
    source: document.querySelector('.soundSource'),
    img: document.querySelector('.channelImg'),
    radio: document.getElementById('radio')
}

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.status === 200) {
    let ajaxResponse = JSON.parse(this.responseText);

    let channels = ajaxResponse.channels;
    
    channels.forEach(channel => {
        const markup = `
        <li class="channel" data-id=${channel.id}>${channel.name}</li>
        `;

        elements.channelList.insertAdjacentHTML('beforeend', markup);
    })

    elements.channelList.addEventListener('click', loadChannel);

    function loadChannel(e) {
        if (e.target.matches('.channel')) {
            let setup;
            channels.forEach(channel => {
                //console.log(e.target.dataset.id);
                if (e.target.dataset.id == channel.id) {
                    setup = `
                    <audio controls autoplay="">
                    <source class="soundSource" src="http://sverigesradio.se/topsy/direkt/${channel.id}.mp3" type="audio/mpeg">
                    </audio>
                    <img class="channelImg" src="${channel.image}" alt="">
                    `;
                    document.body.style.backgroundColor = "#" + channel.color;
                    document.title = channel.name;
                }
            })
            elements.radio.innerHTML = setup;
        }
    }
    }
}
xhttp.open('GET', 'http://api.sr.se/api/v2/channels?format=json', true);
xhttp.send();