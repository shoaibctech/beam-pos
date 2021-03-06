import axios from 'axios';

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
    localStorage.removeItem('token');
}
export const setToken = (res) => {
    let milliseconds = new Date().getTime();
    // let expSec = sec + (res.expiresIn * 1000);
    //TODO: change expires time on auth0 side
    let expSec = milliseconds + 3600000; // Expire token after 60 minutes of login 60 * 60 * 1000 = 600000 milliseconds
    localStorage.setItem('auth_token', res.id_token)
    localStorage.setItem('expiresOn', expSec);
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('tokenType', res.token_type);
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
export const getAuthToken = () => {
    if(checkToken()){
        return localStorage.getItem('auth_token');
    }
}
export const makeSecureRequest = (url, data = {}, method) => {
    const userData = getUserData();
    data.iat = userData.iat;
    data.expireOn = userData.exp;
    data.authId = userData.sub;
    return axios({
        method,
        url,
        data,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('auth_token'), 'content-type': 'application/json'}
    });
}
export const makeRequest = async (url, data = {}, method) => {
    return  axios({
        method,
        url,
        data,
        headers: { 'content-type': 'application/json'}
    });
}
export const validateEmail = (email) => {
    let error = '';
    if(!email) {
        error = 'Enter your email!'
    }
    if(typeof email !== "undefined") {
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            error = 'Please enter valid email!';
        }
    }
    return error;
}