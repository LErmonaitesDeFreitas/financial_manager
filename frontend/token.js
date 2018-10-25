
tokenIsValid = (myCallback) => {
    try {
        var host = "http://localhost:3001";
        var user = JSON.parse(localStorage.user);
        var endpoint = host + "/token/verify/" + user.token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                myCallback(JSON.parse(this.responseText).isValid);
            }
        }
        xhttp.open("POST", endpoint, true);
        xhttp.send();
    } catch (e) {

    }
}
tokenIsValid(function (isValid) {
    var route = location.pathname;
    route = route.split("/")[1];    
                                        var redirect = "";
    switch (route) {
        case "login":
            if (isValid)
                redirect = "dashboard";
            break;
        case "dashboard":
            if (!isValid)
                redirect = "login";
            break;
    }
    if (redirect != route)
        location.pathname = "/" + redirect;
});
