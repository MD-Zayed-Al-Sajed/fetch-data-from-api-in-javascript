document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'jSQxfUmjiXsreVUp25tbeaav8lZVKdyBRs50HaDK';

    // APOD Section
    const apodContainer = document.getElementById('apod-content');
    const apodDateInput = document.getElementById('apod-date');

    function fetchApod(date) {
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
        if (date) url += `&date=${date}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                apodContainer.innerHTML = `
                    <h3>${data.title}</h3>
                    <img src="${data.url}" alt="${data.title}" class="api-image">
                    <p>${data.explanation}</p>
                `;
            })
            .catch(error => console.error('Error fetching APOD:', error));
    }

    apodDateInput.addEventListener('change', (e) => {
        fetchApod(e.target.value);
    });

    fetchApod(); // Initial fetch for today’s APOD

    // NeoWs Section - Displaying recent Near-Earth Objects
    const neoContainer = document.getElementById('neo-content');

    fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const neos = data.near_earth_objects;
            const today = Object.keys(neos)[0]; // Get today's date

            neoContainer.innerHTML = `
                <h3>Near-Earth Objects on ${today}</h3>
                <ul>
                    ${neos[today].slice(0, 5).map(neo => `
                        <li>${neo.name} - Diameter: ${(neo.estimated_diameter.meters.estimated_diameter_max).toFixed(2)}m</li>
                    `).join('')}
                </ul>
            `;
        })
        .catch(error => console.error('Error fetching NEO data:', error));

    // DONKI Section - Displaying recent space weather events with improved readability
    const donkiContainer = document.getElementById('donki-tbody');

    fetch(`https://api.nasa.gov/DONKI/notifications?type=all&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Limit to the 3 most recent events for readability
            const recentEvents = data.slice(0, 3);

            recentEvents.forEach(event => {
                // Create a row for each event with structured cells
                const row = document.createElement('tr');

                // Fill each cell with the event data
                row.innerHTML = `
                <td>${event.messageType}</td>
                <td>${new Date(event.messageIssueTime).toLocaleDateString()}</td>
                <td>${event.messageBody.split('.')[0]}...</td> <!-- Shortened summary -->
                <td>${event.messageBody.length > 200 ? event.messageBody.substring(0, 200) + '...' : event.messageBody}</td>
                <td>${event.messageURL ? `<a href="${event.messageURL}" target="_blank">More Info</a>` : 'N/A'}</td>
            `;

                // Append the row to the table body
                donkiContainer.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching DONKI data:', error));
});
