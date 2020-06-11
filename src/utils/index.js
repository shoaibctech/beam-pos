
export const setUserData = (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
}
export const getUserData = () => {
    return JSON.parse(localStorage.getItem('user_data'));
}
export const removeUserData = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expiresOn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('tokenType');
}
export const setToken = (res) => {
    let sec = new Date().getTime();
    let expSec = sec + (res.expiresIn * 1000);
    localStorage.setItem('auth_token', res.idToken)
    localStorage.setItem('expiresOn', expSec);
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('tokenType', res.tokenType);
}
export const checkToken = () => {
    if(localStorage.getItem('auth_token') && localStorage.getItem('auth_token').length > 5){
        let expireTime = localStorage.getItem('expiresOn');
        if(new Date(parseInt(expireTime)) > new Date()){
            return true;
        } else {
            removeUserData();
            window.location.replace('/');
            return false;
        }
    } else {
        return false;
    }

}