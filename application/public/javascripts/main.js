ReactDOM.render(
<h1>Hello, world!</h1>,
    document.getElementById('root')
);


function doSomething() {
    withCompanies(fillCompanyList());
}

function fillCompanyList(companies) {

}

function withCompanies(callback) {
    var data = {};
    fetch('/api/complaints/companies', {
        method: 'get'
    }).then(function(response) {
        var data = response.json();
        alert("Companies found");
        callback(data);
    }).catch(function(err) {
        console.error("Error occurred: " + err.message);
        alert("Error occurred: " + err.message);
    });

 }