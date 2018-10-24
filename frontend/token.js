
tokenIsValid = (callback) => {
    try {
        var host = "http://localhost:3001";
        var user = JSON.parse(localStorage.user);
        var endpoint = host + "/token/verify/" + user.token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = callback
        xhttp.open("POST", endpoint, true);
        xhttp.send();
    } catch (e) {

    }
}