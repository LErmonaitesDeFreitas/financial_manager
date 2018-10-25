
tokenIsValid = (myCallback) => {
    try {

        var teste = "";
        var host = "http://financeiro.ermonaites.com.br";
        var user = JSON.parse(localStorage.user);
        var endpoint = host + "/token/verify/" + user.token;

        const host = "http://localhost:3001";
        if (!localStorage.user)
            location.pathname = "/login";

        const user = JSON.parse(localStorage.user);

        const endpoint = host + "/token/verify/" + user.token;


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
    const view = location.pathname.split("/")[1];

    if (!isValid && view == "login")
        return;

    if (!isValid && view != "login")
        location.pathname = "/login";

    if (isValid && view == "login")
        location.pathname = "/dashboard";

});
