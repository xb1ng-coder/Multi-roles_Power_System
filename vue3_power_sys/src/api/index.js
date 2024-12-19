import axios from "../utils/request";

export function login(data) {
    return axios({
        method:'post',
        url:'/login',
        data
    })
    // .then(response => {
    //     // 注释可删
    //     // console.log(1,response);
    //     // console.log(2,response.data);
    //     // console.log(3,response.data.token);
    //     if (response && response.data && response.data.token) {
    //       localStorage.setItem("token", response.data.token); // 将Token存入localStorage
    //       return response.data;
    //     } else {
    //       throw new Error("Token 未返回，可能登录失败");
    //     }
    //   });
}

export function getNavData() {
    return axios({
        method:'GET',
        url:'/getResource'
    })
}