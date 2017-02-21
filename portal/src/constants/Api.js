
function getCookie(name) {
    var value = null;
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
    } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    if (begin >= 0) {
        value = decodeURI(dc.substring(begin + prefix.length, end));
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}


// Use cookie issued from server to determine the host of the API service.
// We could possible default to "window.location.hostname" if we assume that the API is running
// on the same host as the portal.
export const API_HOST = getCookie('apihost') || 'http://localhost:3001';
