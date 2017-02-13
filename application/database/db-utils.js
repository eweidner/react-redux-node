
exports.encodeYearMonth = function(year, month) {
    monthYear = "" + month;
    while (monthYear.length < 2) {
        monthYear = "0" + monthYear;
    }
    monthYear = "" + year + "-" + monthYear;
    return monthYear;
}

exports.encodeYearMonthPlusMonths = function(year, month, months) {
    var newMonth = month + (months - 1);
    var newYear = year;
    while (newMonth > 12) {
        newYear += 1;
        newMonth -= 12;
    }
    return exports.encodeYearMonth(newYear, newMonth);
}



// Found this at https://gist.github.com/mshafrir/2646763
const STATES = {
   // "AE": "Armed Forces Europe/Canada/Mid East", "AP": "Armed Forces Pacific", "AA": "Armed Forces Americas",
    "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona",
    "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky",
    "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts",
    "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska",
    "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin",
    "WY": "Wyoming"
}

exports.stateCodeToName = function(stateCode) {
    return STATES[stateCode.toUpperCase()];
}

/*
 *  Convert state names to codes.  Don't want to reference states by long names in api - to much escaping.
 */
exports.stateNameToCode = function(stateName) {
    for (var code in STATES) {
        var name = STATES[code];
        if (name.toLowerCase() == stateName.toLowerCase()) {
            return code;
        }
    }
    throw new Error("Could not find code for: " + stateName);
}

/*
 *  For convenience to API user, add state_names to documents that just have state codes.
 */
exports.addStateNamesToData = function(dataArray) {
    dataArray.forEach(function(data) {
        if (data.state) {
            var stateCode = data.state.toUpperCase();
            data['state_name'] = STATES[stateCode];
        }
    });

}

exports.stateList = function() {
    var states = [];
    for (var stateCode in dataHash) {
        var stateName = dataHash[stateKey];
        states.push({code: stateCode.toLowerCase(), name: stateName});
    }
}
