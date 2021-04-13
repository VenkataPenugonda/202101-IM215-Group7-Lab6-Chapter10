rlinks = [{
        id: $('#filterBrowser'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/browsers.php',

    },
    {
        id: $('#filterOS'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/os.php',

    },
    {
        id: $('#filterCountry'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/countries.php?continent=EU',

    }
]

function populateFilters(rlink, id) {
    return $.get(rlink).done(response => {
        displaydata(response, id);
    });
}

function displaydata(data, id) {
    let temp_data = '';
    data.forEach(element => {
        temp_data += `<option value='${element.id || element.iso}'> ${element.name} </option>`;
    });
    id.append(temp_data);
}

rlinks.forEach((item,index)=>{
    populateFilters(item.rlink, item.id);
}) 



$.get('http://randyconnolly.com/funwebdev/services/visits/visits.php?continent=EU&month=1&limit=100').done(response => {
    displayTable(response);
    filterTable(response);
});

function displayTable(data) {
    var html = ``;
    data.forEach(el => {
        htmldata += `<tr><td>${el.id}</td><td>${el.visit_date}</td><td>${el.country}</td><td>${el.browser}</td><td>${el.operatingSystem}</td></tr>`;
    });
    $('#visitsBody').html(htmldata);

    $('#columnchart').html(displayBar(data));

}


const filterTable = (data) => {
    var filterList = {};
    const keys = { 'filterCountry': 'country_code', 'filterBrowser': 'browser_id', 'filterOS': 'os_id' };
    $('#filterCountry,#filterBrowser,#filterOS').on('change', (e) => {
        var key = keys[e.target.id];
        (e.target.value == 0) ? delete filterList[key]: filterList[key] = e.target.value;
        if (Object.keys(filterList).length == 0) displayTable(data);
        var current = $.grep(data, (el, i) => {
            var result = true;
            Object.keys(filterList).forEach(e => {
                if (el[e] !== filterList[e]) {
                    result = false;
                }
            });
            return result;
        });
        displayTable(current);

        $('#columnchart').html(displayBar(current));

    });
}

function displayBar(data) {
    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawStuff);

    var dict = { '': '' };

    data.forEach(element => {
        dict[element.operatingSystem] = (dict[element.operatingSystem] || 0) + 1;
    });

    function drawStuff() {
        var data = new google.visualization.arrayToDataTable(Object.entries(dict));

        var options = {
            width: 400,
            legend: { position: 'none' },
            bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('columnchart'));
        // Convert the Classic options to Material options.
        chart.draw(data, google.charts.Bar.convertOptions(options));
    };
}