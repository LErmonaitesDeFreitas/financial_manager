 
tokenIsValid = () => {
    try {
        var user = JSON.parse(localStorage.user);
        if (!user || !user.token)
            return false;
        var endpoint = host + "/token/verify/";
        endpoint = localStorage.user.token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
            }
        };
        xhttp.open("POST", endpoint, true);
        xhttp.send();
        return true;
    } catch (e) {
        return false;
    }
}