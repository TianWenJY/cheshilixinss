import request from "@/utils/request";

export const staffList = data => {
    return request({
      url: "PubInterface/User/QueryUserList",
      method: "post",
      data
    });
};