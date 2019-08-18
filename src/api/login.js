import request from "@/utils/request";

// 登录
export const Login = data => {
  return request({
    url: "PubInterface/Login/LG",
    method: "post",
    data
  });
};

//路由菜单
export const LoginMenu = data => {
    return request({
        url: "PubInterface/UserMenu/QueryUserMenu",
        method: "post",
        data
    });
};
