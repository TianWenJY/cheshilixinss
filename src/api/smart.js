import request from "@/utils/request";

/*云端通用*/
export const getList = (api, data) => {
  return request({ url: api, method: "post", data });
};
/*提交通用*/
export const submit = (api, data) => {
  return request({ url: api, method: "post", data });
};

//获取社区select
export const CommunitySelect = data => {
  return request({
    url: "NoSense/CommunityPark/QueryCommunitySelect",
    method: "post",
    data
  });
};

/*进出场列表*/
export const enterRecordList = data => {
  return request({
    url: "NoSense/CarManage/CarInOutList",
    method: "post",
    data
  });
};

/*设备列表*/
export const deviceList = (api, data) => {
  return request({ url: api, method: "post", data });
};

export const oprecordList = data => {
  return request({
    url: "NoSense/CarManage/QueryCarParkingDataList",
    method: "post",
    data
  });
};

/*用户列表*/
export const userList = data => {
  return request({
    url: "NoSense/CommunityPark/QueryParkList",
    method: "post",
    data
  });
};

/*设置*/
export const parkRecordList = data => {
  return request({ url: "NoSense/Trans/GetTransList", method: "post", data });
};

/*角色*/
export const roleList = data => {
  return request({
    url: "PubInterface/Role/QueryRoleList",
    method: "post",
    data
  });
};

/*投诉*/
export const complaintList = data => {
  return request({
    url: "NoSense/Complaint/ApplyComplaintLists",
    method: "post",
    data
  });
};
export const complaintImg = data => {
  return request({
    url: "NoSense/Complaint/QueryComplaintDetail",
    method: "post",
    data
  });
};
export const complaintStaff = data => {
  return request({
    url: "NoSense/Complaint/QueryUserSelect",
    method: "post",
    data
  });
};

/*房屋*/
export const homeList = data => {
  return request({
    url: "NoSense/Houses/QueryHousesList",
    method: "post",
    data
  });
};

//缴费弹框
export const feeData = data => {
  return request({
    url: "NoSense/CarManage/QueryFeeData",
    method: "post",
    data
  });
};
export const specialSelect = data => {
  return request({
    url: "NoSense/Setting/QuerySpecialSelect",
    method: "post",
    data
  });
};

export const GetMoneyButton = data => {
  return request({
    url: "NoSense/CarManage/GetMoneyButton",
    method: "post",
    data
  });
};

export const ScanCodePay = data => {
  return request({
    url: "NoSense/CarManage/ScanCodePay",
    method: "post",
    data
  });
};

// 人脸识别
export const PhotoList = data => {
  return request({
    url: "NoSense/FaceDiscern/UserPhotoList",
    method: "post",
    data
  });
};

//系统消息管理
// 消息类型
export const NoticeType = data => {
  return request({
    url: "NoSense/Notice/QueryNoticeTypeSelect",
    method: "post",
    data
  });
};
// 消息类型列表
export const NoticeList = data => {
  return request({
    url: "NoSense/Notice/QueryNoticeList",
    method: "post",
    data
  });
};
// 增加系统消息
export const NoticeAdd = data => {
  return request({
    url: "NoSense/Notice/AddNotice",
    method: "post",
    data
  });
};
// 删除文章消息
export const NoticeDetle = data => {
  return request({
    url: "NoSense/Notice/DelNotice",
    method: "post",
    data
  });
};
// 修改发布状态
export const NoticeStatus = data => {
  return request({
    url: "NoSense/Notice/UpdateNoticeStatus",
    method: "post",
    data
  });
};
// 获取消息详情
export const NoticeDetail = data => {
  return request({
    url: "NoSense/Notice/QueryNoticeDetail",
    method: "post",
    data
  });
};
// 编辑
export const NoticeUpdate = data => {
  return request({
    url: "NoSense/Notice/UpdateNotice",
    method: "post",
    data
  });
};