// 存
export function setToken(token) {
    return sessionStorage.setItem('token',token);
}
// 取
export function getToken() {
    return sessionStorage.getItem('token');
}
// 删
export function removeToken() {
    return sessionStorage.removeItem('token');
}