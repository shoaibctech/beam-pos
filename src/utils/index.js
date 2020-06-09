
export const setUserData = (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
}
export const getUserData = () => {
    return JSON.parse(localStorage.getItem('user_data'));
}