
const hostToken = "http://financeiro.ermonaites.com.br:3001";
const view = location.pathname.split("/")[1];


tokenIsValid = (myCallback) => {
    try {

        if (!localStorage.user && view != "login")
            location.pathname = "/login";

        const user = JSON.parse(localStorage.user);

        const endpoint = hostToken + "/token/verify/" + user.token;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const isValid = JSON.parse(this.responseText).isValid;
                myCallback(isValid);
            }
        }
        xhttp.open("POST", endpoint, true);
        xhttp.send();

    } catch (e) {
        myCallback(false);
    }
}

tokenIsValid(function (isValid) {

    if (!isValid && view == "login")
        return;

    if (!isValid && view != "login")
        location.pathname = "/login";

    if (isValid && view == "login")
        location.pathname = "/dashboard";

});


