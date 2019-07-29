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
      <el-form-item label="文章扼要" prop="article_description">
        <el-input
          v-model="articleForm.article_description"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </el-form-item>
      <el-form-item label="正文" prop="article_content">
        <com-editor ref="editor" v-model="articleForm.article_content" />
      </el-form-item>
      <el-form-item label="选择栏目" prop="article_type_id">
        <el-select v-model="articleForm.article_type_id">
          <el-option
            v-for="(type, i) in $store.state.article.articleTypes"
            :key="i"
            :label="type.article_type_name"
            :value="type.article_type_id"
          />
        </el-select>
      </el-form-item>
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
          :file-list="articleCover"
          :on-exceed="onExceed"
          :http-request="onUpload"
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
        <el-button
          v-if="operate === 'UPDATE' && articleForm.article_status !== 2"
          type="primary"
          :loading="loading"
          @click="onSubmit(articleForm.article_status)"
        >
          保存
        </el-button>
        <el-button
          v-if="operate === 'CREATE'"
          type="primary"
          :loading="loading"
          @click="onSubmit(1)"
        >
          保存草稿
        </el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit(2)">
          发布上线
        </el-button>
        <el-button type="primary" @click="onPreview">预览</el-button>
        <el-button type="primary" @click="toArticles">关闭</el-button>
      </el-form-item>
    </el-form>
    <article-preview
      :article="articleForm"
      :visible.sync="articlePreviewVisible"
    />
  </div>
</template>

<script>
import { comEditor } from "@/components";
import articlePreview from "./article-preview";
import {
  getArticle,
  createArticle,
  updateArticle
} from "@/services/api/articles";
import { uploadFile, deleteFile } from "@/services/api/files";

// TODO: 缓存、更细致的表单校验
export default {
  components: { comEditor, articlePreview },
  props: {
    operate: String
  },
  data() {
    return {
      loading: false,
      articlePreviewVisible: false,
      hasAutoCreated: false, // 文章已被自动创建
      autoCreatedArticleId: "", // 自动创建的文章id
      intervalID: null,
      articleForm: {
        article_title: "",
        article_subtitle: "",
        article_author: "",
        article_source: "",
        article_description: "",
        article_content: "",
        article_status: 1, // 默认为草稿状态
        article_type_id: 1,
        article_istop: 0,
        article_rank: null,
        article_cover: "",
        article_publish_time: Date.now()
      },
      rules: {
        article_title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 2,
            max: 60,
            message: "标题长度为2到32个字符",
            trigger: "blur"
          }
        ],
        article_description: [
          { required: true, message: "请输入文章扼要", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "文章扼要长度为2到255个字符",
            trigger: "blur"
          }
        ],
        article_content: {
          required: true,
          message: "请输入正文",
          trigger: "blur"
        },
        article_type_id: { required: true, message: "请选择栏目" },
        article_istop: { required: true, message: "请选择是否置顶" },
        article_rank: { required: true, message: "请输入文章序数" },
        article_cover: {
          required: true,
          message: "请上传封面图",
          trigger: "blur"
        },
        article_publish_time: {
          type: "date",
          required: true,
          message: "请选择日期"
        }
      }
    };
  },
  computed: {
    articleCover() {
      const cover = this.articleForm.article_cover;
      return cover ? [{ url: this.articleForm.article_cover }] : [];
    }
  },
  // watch: {
  //   "articleForm.cover"(val) {
  //     const display = val ? "none" : "inline-block";
  //     this.$refs.upload.$el.querySelector(".el-upload").style.display = display;
  //   }
  // },
  async beforeRouteEnter(to, from, next) {
    const article_id = to.params.article_id;

    if (article_id) {
      const res = await getArticle(article_id);
      const article = res.data;

      delete article.article_id;
      next(vm => (vm.articleForm = article));
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    this.clearData();
    next();
  },
  created() {
    this.initAutoSave();
  },
  methods: {
    initAutoSave() {
      this.intervalID = setInterval(() => {
        this.saveArticle();
      }, 3 * 60 * 1000);
    },
    onPreview() {
      this.articlePreviewVisible = true;
    },
    onResetForm() {
      this.$refs.articleForm.resetFields();
    },
    onSubmit(article_status = 1) {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          this.articleForm.article_status = article_status;

          // if (this.operate === "UPDATE") {
          //   await updateArticle(
          //     this.$route.params.article_id,
          //     this.articleForm
          //   );
          // } else {
          //   await createArticle(this.articleForm);
          // }
          if (this.operate === "CREATE" && this.hasAutoCreated) {
            await updateArticle(this.autoCreatedArticleId, this.articleForm);
          }

          if (this.operate === "CREATE" && !this.hasAutoCreated) {
            await createArticle(this.articleForm);
          }

          if (this.operate === "UPDATE") {
            await updateArticle(
              this.$route.params.article_id,
              this.articleForm
            );
          }

          this.toArticles();
        }
      });
    },
    async onUpload(form) {
      const res = await uploadFile(form.file);

      setTimeout(() => {
        const file = this.$refs.upload.getFile(form.file);
        file.percentage = 100;
        file.response = res.data;
        this.articleForm.article_cover = res.data.file_path;
        this.$refs.articleForm.validateField("article_cover", () => {});
      }, 0);
    },
    async onUploadRemove(file) {
      console.log("onUploadRemove", file);
      try {
        await deleteFile(file.response.file_path);
        this.articleForm.article_cover = "";
      } catch (err) {
        console.log(err);
      }
    },
    onExceed() {
      this.$message({ type: "warning", message: "只能上传一张封面图" });
    },
    toArticles() {
      this.$router.push({
        name: this.$store.state.global.routesNameMap.ARTICLE_ALL
      });
    },
    saveArticle() {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          if (this.operate === "CREATE" && this.hasAutoCreated) {
            await updateArticle(this.autoCreatedArticleId, this.articleForm);
            this.$message({ type: "success", message: "文章已自动保存为草稿" });
          }

          if (this.operate === "CREATE" && !this.hasAutoCreated) {
            const res = await createArticle(this.articleForm);
            this.hasAutoCreated = true;
            this.autoCreatedArticleId = res.data.article_id;
            this.$message({ type: "success", message: "文章已自动保存为草稿" });
          }

          if (this.operate === "UPDATE") {
            await updateArticle(
              this.$route.params.article_id,
              this.articleForm
            );
            this.$message({ type: "success", message: "自动保存成功" });
          }
        } else {
          this.$message({ type: "error", message: "自动保存失败" });
        }
      });
    },
    clearData() {
      this.loading = false;
      this.articlePreviewVisible = false;
      this.hasAutoCreated = false;
      this.autoCreatedArticleId = "";
      this.articleForm = {
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
      };
      this.$refs.editor.clearData();
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.article-add {
  // padding-top: 10px;

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

  ::v-deep .ql-container {
    height: 500px;
  }
}
</style>
