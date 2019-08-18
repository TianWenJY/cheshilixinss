import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/generalPart",
      name: "generalPart",
      component: resolve =>
        require(["@/page/generalPart/index/index"], resolve),
      redirect: "/generalPart/statics",
      children: [
        {
          path: "/generalPart/statics",
          name: "generalPart_statics",
          component: resolve =>
            require(["@/page/generalPart/statics/statics"], resolve),
          meta: {
            tagName: "总括",
            partName: "平台总板块",
            fatherTag: "监控"
          }
        },
        {
          path: "/generalPart/generalCallPart",
          name: "generalPart_generalCallPart",
          component: resolve =>
            require(["@/page/generalPart/callPart/callPart"], resolve),
          meta: {
            tagName: "移车码监控",
            partName: "平台总板块",
            fatherTag: "监控"
          }
        },
        {
          path: "/generalPart/callStatics",
          name: "generalPart_callStatics",
          component: resolve =>
            require(["@/page/generalPart/callStatics/callStatics"], resolve),
          meta: {
            tagName: "移车码总括详情",
            partName: "平台总板块",
            fatherTag: "移车码监控"
          }
        },
        {
          path: "/generalPart/generalParkPart",
          name: "generalPart_generalParkPart",
          component: resolve =>
            require(["@/page/generalPart/parkPart/parkPart"], resolve),
          meta: {
            tagName: "停车场监控",
            partName: "平台总板块",
            fatherTag: "监控"
          }
        },
        {
          path: "/generalPart/generalStorePart",
          name: "generalPart_generalStorePart",
          component: resolve =>
            require(["@/page/generalPart/storePart/storePart"], resolve),
          meta: {
            tagName: "汽车服务监控",
            partName: "平台总板块",
            fatherTag: "监控"
          }
        },
        {
          path: "/generalPart/staff",
          name: "generalPart_staff",
          component: resolve => require(["@/page/generalPart/staff"], resolve),
          meta: {
            tagName: "用户管理",
            partName: "平台总板块",
            fatherTag: "员工管理"
          }
        },
        {
          path: "/generalPart/menu",
          name: "generalPart_menu",
          component: resolve => require(["@/page/generalPart/Menu"], resolve),
          meta: {
            tagName: "菜单管理",
            partName: "平台总板块",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/generalPart/rolePersimion",
          name: "generalPart_rolePersimion",
          component: resolve =>
            require(["@/page/generalPart/rolePersimion"], resolve),
          meta: {
            tagName: "角色管理",
            partName: "平台总板块",
            fatherTag: "系统管理"
          }
        }
      ]
    },
    {
      path: "/piccPart",
      name: "piccPart",
      component: resolve => require(["@/page/piccPart/index/index"], resolve),
      redirect: "/piccPart",
      children: [
        {
          path: "/piccPart",
          name: "piccPart_statics",
          component: resolve =>
            require(["@/page/piccPart/statics/statics"], resolve),
          meta: {
            tagName: "监控",
            partName: "挪车码板块",
            fatherTag: "监控"
          }
        },
        {
          path: "/piccPart/menu",
          name: "piccPart_menu",
          component: resolve => require(["@/page/piccPart/Menu"], resolve),
          meta: {
            tagName: "菜单管理",
            partName: "挪车码板块",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/piccPart/menuPersimion",
          name: "piccPart_menuPersimion",
          component: resolve =>
            require(["@/page/piccPart/menuPersimion"], resolve),
          meta: {
            tagName: "菜单权限",
            partName: "挪车码板块",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/piccPart/rolepersimion",
          name: "piccPart_rolepersimion",
          component: resolve =>
            require(["@/page/piccPart/rolePersimion"], resolve),
          meta: {
            tagName: "角色权限",
            partName: "挪车码板块",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/piccPart/allScanned",
          name: "piccPart_allScanned",
          component: resolve =>
            require(["@/page/piccPart/allScanned"], resolve),
          meta: {
            tagName: "移车码列表",
            partName: "挪车码板块",
            fatherTag: "移车码管理"
          }
        },
        {
          path: "/piccPart/comsumeDetail",
          name: "piccPart_comsumeDetail",
          component: resolve =>
            require(["@/page/piccPart/comsumeDetail"], resolve),
          meta: {
            tagName: "费用明细",
            partName: "挪车码板块",
            fatherTag: "财务管理"
          }
        }
      ]
    },
    {
      path: "/carServer",
      name: "carServer",
      component: resolve => require(["@/page/carServer/index"], resolve),
      redirect: "/carServer",
      children: [
        {
          path: "/carServer",
          name: "carServer_statics",
          component: resolve =>
            require(["@/page/carServer/statics/statics"], resolve),
          meta: {
            tagName: "监控",
            partName: "汽车服务",
            fatherTag: "监控"
          }
        },
        {
          path: "/carServer/menu",
          name: "carServer_menu",
          component: resolve => require(["@/page/carServer/Menu"], resolve),
          meta: {
            tagName: "菜单管理",
            partName: "汽车服务",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/carServer/menuPersimion",
          name: "carServer_menuPersimion",
          component: resolve =>
            require(["@/page/carServer/menuPersimion"], resolve),
          meta: {
            tagName: "菜单权限",
            partName: "汽车服务",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/carServer/rolepersimion",
          name: "carServer_rolepersimion",
          component: resolve =>
            require(["@/page/carServer/rolePersimion"], resolve),
          meta: {
            tagName: "角色权限",
            partName: "汽车服务",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/carServer/addPersimion",
          name: "carServer_addPersimion",
          component: resolve =>
            require(["@/page/carServer/addPersimion"], resolve),
          meta: {
            tagName: "权限列表",
            partName: "汽车服务",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/carServer/staff",
          name: "carServer_staff",
          component: resolve => require(["@/page/carServer/staff"], resolve),
          meta: {
            tagName: "员工一览",
            partName: "汽车服务",
            fatherTag: "门店管理"
          }
        },
        {
          path: "/carServer/applystore",
          name: "carServer_applystore",
          component: resolve =>
            require(["@/page/carServer/applyStore"], resolve),
          meta: {
            tagName: "申请门店",
            partName: "汽车服务",
            fatherTag: "门店管理"
          }
        },
        {
          path: "/carServer/shopList",
          name: "carServer_shopList",
          component: resolve => require(["@/page/carServer/shopList"], resolve),
          meta: {
            tagName: "门店一览",
            partName: "汽车服务",
            fatherTag: "门店管理"
          }
        },
        {
          path: "/carServer/memberList",
          name: "carServer_memberList",
          component: resolve =>
            require(["@/page/carServer/member/bathMember"], resolve),
          meta: {
            tagName: "会员一览",
            partName: "汽车服务",
            fatherTag: "会员管理"
          }
        },
        {
          path: "/carServer/memberType",
          name: "carServer_memberType",
          component: resolve =>
            require(["@/page/carServer/member/memberType"], resolve),
          meta: {
            tagName: "会员卡类型",
            partName: "汽车服务",
            fatherTag: "会员管理"
          }
        },
        {
          path: "/carServer/serverList",
          name: "carServer_serverList",
          component: resolve =>
            require(["@/page/carServer/member/serverList"], resolve),
          meta: {
            tagName: "服务一览",
            partName: "汽车服务",
            fatherTag: "会员管理"
          }
        },
        {
          path: "/carServer/serverType",
          name: "carServer_serverType",
          component: resolve =>
            require(["@/page/carServer/member/serverType"], resolve),
          meta: {
            tagName: "服务大类",
            partName: "汽车服务",
            fatherTag: "会员管理"
          }
        },
        {
          path: "/carServer/teamList",
          name: "carServer_teamList",
          component: resolve => require(["@/page/carServer/teamList"], resolve),
          meta: {
            tagName: "班组一览",
            partName: "汽车服务",
            fatherTag: "施工管理"
          }
        },
        {
          path: "/carServer/builders",
          name: "carServer_builders",
          component: resolve => require(["@/page/carServer/builders"], resolve),
          meta: {
            tagName: "施工人员",
            partName: "汽车服务",
            fatherTag: "施工管理"
          }
        },
        {
          path: "/carServer/customerList",
          name: "carServer_customerList",
          component: resolve =>
            require(["@/page/carServer/customerMange/customerList"], resolve),
          meta: {
            tagName: "客户一览",
            partName: "汽车服务",
            fatherTag: "客户管理"
          }
        },
        {
          path: "/carServer/customerOrder",
          name: "carServer_customerOrder",
          component: resolve =>
            require(["@/page/carServer/customerMange/customerOrder"], resolve),
          meta: {
            tagName: "客户接单",
            partName: "汽车服务",
            fatherTag: "客户管理"
          }
        },
        {
          path: "/carServer/customerFlow",
          name: "carServer_customerFlow",
          component: resolve =>
            require(["@/page/carServer/customerMange/customerFlow"], resolve),
          meta: {
            tagName: "客户流水",
            partName: "汽车服务",
            fatherTag: "客户管理"
          }
        },
        {
          path: "/carServer/bathMember",
          name: "carServer_bathMember",
          component: resolve =>
            require(["@/page/carServer/member/bathMember"], resolve),
          meta: {
            tagName: "生成会员卡",
            partName: "汽车服务",
            fatherTag: "会员管理"
          }
        }
      ]
    },
    {
      path: "/smartCommunity",
      name: "smartCommunity",
      component: resolve => require(["@/page/smartCommunity/index"], resolve),
      redirect: "/smartCommunity",
      children: [
        {
          path: "/smartCommunity",
          name: "smartCommunity_statics",
          component: resolve =>
            require(["@/page/smartCommunity/statics/statics"], resolve),
          meta: {
            tagName: "监控",
            partName: "智慧社区",
            fatherTag: "监控"
          }
        },
        {
          path: "/smartCommunity/menu",
          name: "smartCommunity_menu",
          component: resolve =>
            require(["@/page/smartCommunity/Menu"], resolve),
          meta: {
            tagName: "菜单管理",
            partName: "智慧社区",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/smartCommunity/rolepersimion",
          name: "smartCommunity_rolepersimion",
          component: resolve =>
            require(["@/page/smartCommunity/rolePersimion"], resolve),
          meta: {
            tagName: "角色权限",
            partName: "智慧社区",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/smartCommunity/OPRecord",
          name: "smartCommunity_OPRecord",
          component: resolve =>
            require(["@/page/smartCommunity/OPRecord"], resolve),
          meta: {
            tagName: "车辆停车记录",
            partName: "智慧社区",
            fatherTag: "统计"
          }
        },
        {
          path: "/carServer/rolepersimion",
          name: "carServer_rolepersimion",
          component: resolve =>
            require(["@/page/carServer/rolePersimion"], resolve),
          meta: {
            tagName: "角色权限",
            partName: "汽车服务",
            fatherTag: "系统管理"
          }
        },
        {
          path: "/smartCommunity/enterRecord",
          name: "smartCommunity_enterRecord",
          component: resolve =>
            require(["@/page/smartCommunity/enterRecord"], resolve),
          meta: {
            tagName: "车辆进出记录",
            partName: "智慧社区",
            fatherTag: "主页"
          }
        },
        {
          path: "/smartCommunity/parkRecord",
          name: "smartCommunity_parkRecord",
          component: resolve =>
            require(["@/page/smartCommunity/parkRecord"], resolve),
          meta: {
            tagName: "停车交易记录",
            partName: "智慧社区",
            fatherTag: "统计"
          }
        },
        {
          path: "/smartCommunity/device",
          name: "smartCommunity_device",
          component: resolve =>
            require(["@/page/smartCommunity/device"], resolve),
          meta: {
            tagName: "设备管理",
            partName: "智慧社区群",
            fatherTag: "设备"
          }
        },
        {
          path: "/smartCommunity/myFeeList",
          name: "smartCommunity_myFeeList",
          component: resolve =>
            require(["@/page/smartCommunity/myFee"], resolve),
          meta: {
            tagName: "个人停车记录",
            partName: "智慧社区",
            fatherTag: "个人中心"
          }
        },
        {
          path: "/smartCommunity/blackList",
          name: "smartCommunity_blackList",
          component: resolve =>
            require(["@/page/smartCommunity/blackList"], resolve),
          meta: {
            tagName: "黑名单管理",
            partName: "智慧社区",
            fatherTag: "用户管理"
          }
        },
        {
          path: "/smartCommunity/whiteList",
          name: "smartCommunity_whiteList",
          component: resolve =>
            require(["@/page/smartCommunity/whiteList"], resolve),
          meta: {
            tagName: "白名单管理",
            partName: "智慧社区",
            fatherTag: "用户管理"
          }
        },
        {
          path: "/smartCommunity/chargeWay",
          name: "smartCommunity_chargeWay",
          component: resolve =>
            require(["@/page/smartCommunity/chargeWay"], resolve),
          meta: {
            tagName: "收费方式",
            partName: "智慧社区",
            fatherTag: "设置"
          }
        },
        {
          path: "/smartCommunity/monthly",
          name: "smartCommunity_monthly",
          component: resolve =>
            require(["@/page/smartCommunity/monthly"], resolve),
          meta: {
            tagName: "月租车用户管理",
            partName: "智慧社区",
            fatherTag: "用户管理"
          }
        },
        {
          path: "/smartCommunity/homes",
          name: "smartCommunity_homes",
          component: resolve =>
            require(["@/page/smartCommunity/homes"], resolve),
          meta: {
            tagName: "房屋一览",
            partName: "智慧社区",
            fatherTag: "房屋管理"
          }
        },
        {
          path: "/smartCommunity/park",
          name: "smartCommunity_park",
          component: resolve =>
            require(["@/page/smartCommunity/park"], resolve),
          meta: {
            tagName: "停车场管理",
            partName: "汽车服务",
            fatherTag: "停车场管理"
          }
        },
        {
          path: "/smartCommunity/communityList",
          name: "smartCommunity_communityList",
          component: resolve =>
            require(["@/page/smartCommunity/communityList"], resolve),
          meta: {
            tagName: "社区一览",
            partName: "汽车服务",
            fatherTag: "社区管理"
          }
        },
        {
          path: "/smartCommunity/complaint",
          name: "smartCommunity_complaint",
          component: resolve =>
            require(["@/page/smartCommunity/complaint"], resolve),
          meta: {
            tagName: "投诉一览",
            partName: "智慧社区",
            fatherTag: "投诉管理"
          }
        },
        {
          path: "/smartCommunity/user",
          name: "smartCommunity_user",
          component: resolve =>
            require(["@/page/smartCommunity/user"], resolve),
          meta: {
            tagName: "用户一览",
            partName: "智慧社区",
            fatherTag: "用户管理"
          }
        },
        {
          path: "/smartCommunity/propertyFee",
          name: "smartCommunity_propertyFee",
          component: resolve =>
            require(["@/page/smartCommunity/propertyFee"], resolve),
          meta: {
            tagName: "物业缴费",
            partName: "智慧社区",
            fatherTag: "物业管理"
          }
        },
        {
          path: "/smartCommunity/communityList",
          name: "communityList",
          component: resolve =>
            require([
              "@/page/smartCommunity/communityList/communityList"
            ], resolve),
          meta: {
            tagName: "客户接单",
            partName: "智慧社区",
            fatherTag: "客户管理"
          }
        },
        {
          path: "/smartCommunity/faceRecognition",
          name: "smartCommunity_faceRecognition",
          component: resolve =>
            require([
              "@/page/smartCommunity/faceRecognition/faceRecognition"
            ], resolve),
          meta: {
            tagName: "人脸识别",
            partName: "智慧社区",
            fatherTag: "社区管理"
          }
        },
        {
          path: "/smartCommunity/faceList",
          name: "smartCommunity_faceRecognition",
          component: resolve =>
            require([
              "@/page/smartCommunity/faceRecognition/faceRecognition"
            ], resolve),
          meta: {
            tagName: "考勤记录",
            partName: "智慧社区",
            fatherTag: "社区管理"
          }
        },
        {
          path: "/smartCommunity/login",
          name: "smartCommunity_login",
          component: resolve => require(["@/page/carServer/login"], resolve),
          meta: {
            tagName: "考勤记录",
            partName: "智慧社区",
            fatherTag: "社区管理"
          }
        },
        {
          path: "/smartCommunity/news",
          name: "smartCommunity_news",
          component: resolve =>
            require(["@/page/smartCommunity/news/news"], resolve),
          meta: {
            tagName: "添加消息",
            partName: "智慧社区",
            fatherTag: "消息公告"
          }
        },
        {
          path: "/smartCommunity/newsList",
          name: "smartCommunity_newsList",
          component: resolve =>
            require(["@/page/smartCommunity/staticsInfo"], resolve),
          meta: {
            tagName: "新消息一览",
            partName: "智慧社区",
            fatherTag: "消息公告"
          }
        },
        {
          path: "/smartCommunity/staticsInfo",
          name: "smartCommunity_staticsInfo",
          component: resolve =>
            require(["@/page/smartCommunity/staticsInfo"], resolve),
          meta: {
            tagName: "统计图表",
            partName: "智慧社区",
            fatherTag: "数据监控"
          }
        }
      ]
    },
    {
      path: "/404",
      name: "notFound",
      component: resolve => require(["@/page/Error/404"], resolve)
    },
    {
      path: "/login",
      name: "Login",
      component: resolve => require(["@/page/login/login"], resolve)
    },
    {
      path: "/bllogin",
      name: "BLLogin",
      component: resolve => require(["@/page/bllogin/bllogin"], resolve)
    }
    // {
    //   redirect: "/login",
    //   path: "*"
    // }
  ]
});
