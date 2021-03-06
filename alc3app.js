'use strict';

$(document).ready(function () {

 fetCurrency();

});

if (navigator.serviceWorker) {
    // register the services worker
    registerMySW();

    // listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    });

} else {
    alert("Kindly change your browser, your current browser doesnot support Service Worker");
}

function registerMySW() {
                    // register the service worker
                    navigator.serviceWorker.register('https://rotexii001.github.io/currency-converter/sworker.js').then(function (sw) {
                        // check service worker controller
                        if (!navigator.serviceWorker.controller) return;

                        // on waiting state
                        if (sw.waiting) {
                        updateIsReady(sw.waiting);
                        return;
                        }

                        // on installing state
                        if (sw.installing) {
                        trackInstalling(sw.installing);
                        }

                        // on updated found
                        sw.addEventListener('updatefound', function () {
                        trackInstalling(sw.installing);
                    console.log("Service Worker Registration Successful");
                                        });
                    }).catch(function(params) {

                    console.log("Service Worker Registration Failed");
                    });
}

// track sw state
function trackInstalling(worker) {
    worker.addEventListener('statechange', function () {
    if (worker.state == 'installed') {
    updateIsReady(worker);
}
    });
}

// update app 
function updateIsReady(sw) {
 pushUpdateFound();
}

// push updates
function pushUpdateFound() {
console.log('Service Worker found some updates.. !');
}

if (!window.indexedDB) {
 console.log("Your Browser Doesn't Support a Stable Version Of IndexedDB");
}

function objectToArray(objectData) {
    const resultData = Object.keys(objectData).map(i => objectData[i]);
    return resultData;
}

function connectToDatabase() {

    const DB_DATA = 'currency_converter';
    const dbNow = indexedDB.open(DB_DATA, 1);

    dbNow.onerror = (event) => {
        console.log('Error Opening Web Database');
        return false;
    };

    dbNow.onupgradeneeded = function (event) {

    var upgradeDB = event.target.result;

    var objectStore = upgradeDB.createObjectStore("currencies");
    };

    return dbNow;
}


function saveToDatabase(data) 
{

    const dbs = connectToDatabase();

    dbs.onsuccess = (event) => {

            const query = event.target.result;

            const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

            currency.onsuccess = (event) => {

            const dbData = event.target.result;

            const store = query.transaction("currencies", "readwrite").objectStore("currencies");

            if (!dbData) {


            store.add(data, data.symbol);

            } else {
            store.put(data, data.symbol);
            };
        }
    }
}

// fetch from database
function fetchFromDatabase(symbol, amount) {
                    // initialise database
                    const dbs = connectToDatabase();

                    // on success add user
                    dbs.onsuccess = (event) => {

                    //add event listener on Convet Button
                    document.getElementById('btn_converter').addEventListener('click', () => {

                    $("#result").html("");

                    });

                    // console.log('database has been openned !');
                    const query = event.target.result;

                    // check if already exist symbol
                    const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

                    // wait for users to arrive
                    currency.onsuccess = (event) => {

                    const data = event.target.result;
                    // console.log(data);

                    if (data == null) {
                        $(".error").append(`<div class="result_output">Not Connected at the moment</div>`);
                     setTimeout((e) => { 

                     $(".error").html("");

                    }, 1000 * 1);

                    return;
                    }

                    let _pairs_split = symbol.split('_');

                    let toCurrency = document.getElementById('currency_to');
                    let resultNow = toCurrency.options[toCurrency.selectedIndex].innerHTML;

                    $("#result").append(`<div id="result_output" style="font-size:20px; color:#000">${(amount * val.val).toFixed(2)} ${resultNow}</b></div>`);
                    }
                    }
}

const fetCurrency = (e) => {
    
    $.get('https://free.currencyconverterapi.com/api/v5/currencies', (ret) => {

        if (!ret) console.log("Unable to fetch currency");

            const result = objectToArray(ret.results);
    
        for (let retData of result) 
        {
            $("#currency_from").append(`<option value="${retData.id}">(${retData.currencyName})</option>`);
            $("#currency_to").append(`<option value="${retData.id}">(${retData.currencyName})</option>`);
        }
    });
}

// convert currencies 
function CurrencyConverter() {
        let currency_from = $("#currency_from").val();
        let currency_to = $("#currency_to").val();
        let amount = $("#convert_amount").val();

        //add event listener on Convet Button
        document.getElementById('btn_converter').addEventListener('click', () => {
            $("#result_output").hide();
        });

        // restrict user for converting same currency
        if (currency_from == currency_to) {
            $(".error").html(`<div id="result_output"><p style="color:#000;">hey!, Cannot convert same currency</span></div>`);
        return false;
        }

        // build query 
        let body = `${currency_from}_${currency_to}`;
        let query = { q: body};

        // convert currencies
        $.get('https://free.currencyconverterapi.com/api/v5/convert', query, (data) => {
        
        // convert to object array
        const pairs = objectToArray(data.results);

        
            // iterate pairs
        $.each(pairs, function (index, val) {
            let toCurrency = document.getElementById('currency_to');
            let resultNow = toCurrency.options[toCurrency.selectedIndex].innerHTML;
        
        $("#result").append(`<div id="result_output" style="font-size:20px; color:#000">${(amount * val.val).toFixed(2)} ${resultNow}</b></div>`);

        let object = { symbol: body,value: val.val};

    saveToDatabase(object);
});
    }).fail((err) => {

    fetchFromDatabase(body, amount);
    });
    
    return false;
}
