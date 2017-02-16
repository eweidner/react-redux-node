// function ApiUtils() {
// }
//
// ApiUtils.prototype.checkStatus = function(response) {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     } else {
//         let error = new Error(response.statusText);
//         error.response = response;
//         throw error;
//     }
// }
//

_stateNames = new Object();

function getStatesFromApi(callback) {
    var result = fetch('/api/states')
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var states = responseJson.states;
        callback(states);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}

function storeStates(states) {
    _stateNames = new Object();
    states.forEach((state, index) => {
        _stateNames[state.code] = state.name;
    });

}

getStatesFromApi(storeStates);


function getTopStates(params, callback) {
    //http://localhost:3000/api/census/topstates?year=2016&month=5&field=births&limit=3
    var result = fetch(`/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${params.limit}`);
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var states = responseJson.states;
        callback(states);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}


function getStateProductComplaintData(params, callback) {
    // /api/complaints/products?year=2013&month=1&months=50&limit=10&state=ny
    var result = fetch(`/api/complaints/products?year=${params.year}&month=${params.month}&months=${params.months}&state=${params.state}&limit=${params.limit}`);
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var products = responseJson.products;
        callback(products);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}


function getStateCompanyComplaintData(params, callback) {
    // /api/complaints/products?year=2013&month=1&months=50&limit=10&state=ny
    var result = fetch(`/api/complaints/companies?year=${params.year}&month=${params.month}&months=${params.months}&state=${params.state}&limit=${params.limit}`);
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var companies = responseJson.companies;
        callback(companies);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}


