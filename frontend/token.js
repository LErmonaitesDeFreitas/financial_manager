tokenIsValid = () => {
    try {
        var user = JSON.parse(localStorage.user);
        if(!user || !user.token) 
        return false;
    return true;
    } catch(e) {

    }
}