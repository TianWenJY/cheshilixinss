<template>
  <div class="fillcontain">
    <el-row class="containt">
      <div class="articleContainer">
        <el-form label-width="120px" :model="articleData" ref="articleData" :rules="rules">
          <div class="form-content">
            <el-row>
              <el-col :span="24">
                <div class="publish-container">
                  <el-button
                    type="primary"
                    size="medium"
                    class="publish"
                    @click="publishArticle('articleData','publish')"
                  >发布</el-button>
                  <el-button
                    type="warning"
                    size="medium"
                    class="saveNote"
                    @click="publishArticle('articleData','draft')"
                  >编辑中</el-button>
                </div>
                <el-form-item label="所属社区" v-if="this.getUserInfo().bin_id == 1">
                  <el-select
                    style="width:90%"
                    placeholder="选择所属社区"
                    filterable
                    v-model="articleData.p_id"
                  >
                    <el-option
                      v-for="(commun,index) in Community"
                      :label="commun.sqmc"
                      :value="commun.u_id"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item" label="消息类型:" prop="type">
                  <el-select v-model="articleData.type" placeholder="消息类型" style="width:90%">
                    <el-option
                      v-for="item in noticeSelect"
                      :key="item.id"
                      :label="item.content"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题:" prop="content">
                  <el-input placeholder="请输入标题" v-model="articleData.content" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item class="item" label="文章详情:">
                  <Tinymce ref="editor" v-model="articleData.info" style="width:90%"></Tinymce>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="form-tinymce-container">
              <!--组件-->
            </div>
          </div>
        </el-form>
      </div>
    </el-row>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
import {
  NoticeType,
  NoticeList,
  NoticeAdd,
  NoticeDetail,
  NoticeUpdate
} from "@/api/smart";
// import dtime from 'time-formater'
// import * as mutils from 'utils/mUtils'\
// import {axios} from 'utils/'
export default {
  name: "smartCommunity_news",
  components: { Tinymce },
  data() {
    return {
      content: "Tinymce",
      noticeSelect: [],
      Community: "",
      articleData: {
        p_id:
          this.getUserInfo().bin_id == 1
            ? ""
            : this.getUserInfo().p_id == 0
            ? this.getUserInfo().mer_id
            : this.getUserInfo().p_id,
        id: "",
        info: "",
        type: "",
        status: "",
        content: ""
      },
      rules: {
        content: [
          { required: true, message: "文章标题为必填项~", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择消息类型", trigger: "change" }]
      },
      //详情弹框信息
      dialog: {
        width: "400px",
        show: false,
        title: "修改资金信息",
        formLabelWidth: "120px"
      }
    };
  },
  mounted() {
    console.log(Object.keys(this.$route.params).length);
    if (Object.keys(this.$route.params).length > 0) {
      NoticeDetail({ id: this.$route.params.id }).then(res => {
        if (res.Status == 0) {
          Object.assign(this.articleData, res.Data);
        } else {
          this.tableList = { Count: "0", Rows: [] };
        }
      });
    }
    this.getNoticeType();
    if (this.getUserInfo().bin_id == 1) {
      this.getPark();
    }
  },
  methods: {
    //发布文章
    publishArticle(articleData, type) {
      this.$refs[articleData].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let content = this[articleData].content;
          if (content === "") {
            this.$message({
              message: "输入内容为必填项",
              type: "error"
            });
            return;
          }
          let formData = this[articleData];
          let data = this.articleData;
          if (type == "publish") {
            data.status = "1"; // 发布
          } else {
            data.status = "0"; // 草稿
          }
          this.addFundArtices(data);
        }
      });
    },
    getNoticeType() {
      NoticeType({ b_id: 4 }).then(res => {
        if (res.Status == 0) {
          this.noticeSelect = res.Data;
        } else {
          this.tableList = { Count: "0", Rows: [] };
        }
      });
    },
    getPark: function() {
      this.api("NoSense/CommunityPark/QueryCommunitySelect", {}, res => {
        this.Community = res.Data;
      });
    },
    addFundArtices(data) {
      let api 
      if (Object.keys(this.$route.params).length > 0) {
        api = NoticeUpdate
      }else {
        api = NoticeAdd
      }
      api(data).then(res => {
        if (res.Status == 0) {
          this.$message({
            message: "提交成功,您可以去编辑文章页面查看哦~",
            type: "success"
          });
          //实现菜单跳转，重定向
          this.$router.push({ path: "/smartCommunity/newsList" });
        } else {
          this.$message.error("提交失败请重试");
        }
      });
    }
  }
};
</script>



<style lang="less" scoped>
.publish-container {
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: right;
  padding: 0 10px;
  margin-bottom: 10px;
}
.title-container {
  margin-bottom: 20px;
  .article-textarea {
    min-width: 800px;
  }
}
.condition-container {
  .item {
    float: left;
  }
}
.form-tinymce-container {
  margin-bottom: 100px;
}
.containt {
  padding: 20px;
  padding-top: 0;
}
.saveNote {
  margin-right: 8%;
}
</style>
