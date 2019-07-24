<template>
  <div class="route article-add">
    <el-form
      ref="articleForm"
      :model="articleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="主标题" prop="article_title">
        <el-input v-model="articleForm.article_title" />
      </el-form-item>
      <el-form-item label="副标题" prop="article_subtitle">
        <el-input v-model="articleForm.article_subtitle" />
      </el-form-item>
      <el-form-item label="作者" prop="article_author">
        <el-input v-model="articleForm.article_author" />
      </el-form-item>
      <el-form-item label="来源" prop="article_source">
        <el-input v-model="articleForm.article_source" />
      </el-form-item>
      <el-form-item label="正文" prop="article_content">
        <com-editor v-model="articleForm.article_content" />
      </el-form-item>
      <el-form-item label="选择栏目" prop="article_type_id">
        <el-select v-model="articleForm.article_type_id">
          <el-option
            v-for="(type, i) in articleTypes"
            :key="i"
            :label="type.article_type_name"
            :value="type.article_type_id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否置顶" prop="article_istop">
        <el-select v-model="articleForm.article_istop">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否置顶" prop="article_istop">
        <el-radio-group v-model="articleForm.article_istop">
          <el-radio :label="0">不置顶</el-radio>
          <el-radio :label="1">置顶</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="articleForm.article_istop"
        label="序数"
        prop="article_rank"
      >
        <el-input-number
          v-model="articleForm.article_rank"
          controls-position="right"
          :min="1"
          :max="5"
        />
      </el-form-item>
      <el-form-item
        v-if="articleForm.article_istop"
        label="封面图"
        prop="article_cover"
      >
        <el-upload
          ref="upload"
          action="/api/v1/files"
          accept="image/*"
          list-type="picture-card"
          :limit="1"
          :headers="headers"
          :on-success="onUploadSuccess"
          :on-remove="onUploadRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布时间" prop="article_publish_time">
        <el-date-picker
          v-model="articleForm.article_publish_time"
          type="date"
          value-format="timestamp"
          placeholder="请选择日期"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item class="operate">
        <el-button type="primary" :loading="loading" @click="onSubmit(1)">
          保存草稿
        </el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit(2)">
          发布上线
        </el-button>
        <el-button type="primary" @click="onPreview">预览</el-button>
        <el-button type="primary">关闭</el-button>
      </el-form-item>
    </el-form>
    <article-preview
      :content="articleForm.article_content"
      :visible.sync="articlePreviewVisible"
    />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import comEditor from "@/components";
import articlePreview from "./article-preview";
import { createArticle } from "@/services/api/articles";
import { deleteFile } from "@/services/api/files";

// TODO: 缓存、更细致的表单校验
export default {
  components: { comEditor, articlePreview },
  data() {
    return {
      loading: false,
      articlePreviewVisible: false,
      articleForm: {
        article_title: "",
        article_subtitle: "",
        article_author: "",
        article_source: "",
        article_content: "",
        article_status: 1,
        article_type_id: 1,
        article_istop: 0,
        article_rank: null,
        article_cover: "",
        article_publish_time: Date.now()
      },
      rules: {
        article_title: [
          { required: true, message: "请输入标题", trigger: "change" },
          {
            min: 2,
            max: 60,
            message: "标题长度为2到32个字符",
            trigger: "change"
          }
        ],
        article_content: {
          required: true,
          message: "请输入正文",
          trigger: "change"
        },
        article_type_id: { required: true, message: "请选择栏目" },
        article_istop: { required: true, message: "请选择是否置顶" },
        article_rank: { required: true, message: "请输入文章序数" },
        article_cover: {
          required: true,
          message: "请上传封面图",
          trigger: "change"
        },
        article_publish_time: {
          type: "date",
          required: true,
          message: "请选择日期"
        }
      },
      articleTypes: [{ article_type_name: "企业文化", article_type_id: 1 }],
      headers: {
        // egg.js 需要设置 "x-csrf-token" 请求头进行身份验证
        "x-csrf-token": Cookies.get("csrfToken")
      }
    };
  },
  // watch: {
  //   "articleForm.cover"(val) {
  //     const display = val ? "none" : "inline-block";
  //     this.$refs.upload.$el.querySelector(".el-upload").style.display = display;
  //   }
  // },
  methods: {
    onPreview() {
      this.articlePreviewVisible = true;
    },
    async onSubmit(article_status) {
      this.articleForm.article_status = article_status;
      console.log("this.articleForm", this.articleForm);
      const res = await createArticle(this.articleForm);
      console.log("onSubmit", res);
      // this.$refs.articleForm.validate(async valid => {
      //   if (valid) {
      //     this.articleForm.article_status = article_status;
      //     console.log("this.articleForm", this.articleForm);
      //     const res = await createArticle(this.articleForm);
      //     console.log("onSubmit", res);
      //   }
      // });
    },
    onResetForm() {
      this.$refs.articleForm.resetFields();
    },
    onUploadSuccess(response, file) {
      console.log("onUploadSuccess", response, file);
      this.articleForm.article_cover = response.filepath;
      this.$refs.articleForm.validateField("article_cover", () => {});
    },
    async onUploadRemove(file) {
      console.log("onUploadRemove", file);
      try {
        await deleteFile([file.response]);
        this.articleForm.article_cover = "";
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.article-add {
  padding-top: 20px;

  .el-form {
    width: 900px;
    margin: 0 auto;
  }

  .operate {
    // margin: 40px 0 60px;
    margin-bottom: 60px;
    margin-top: 30px;

    .el-button {
      + .el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
