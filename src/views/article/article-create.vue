<template>
  <div class="route article-form">
    <article-form ref="articleForm" v-model="articleForm" />
    <div class="operate">
      <el-button type="primary" :loading="loading" @click="onSubmit(1)">
        保存草稿
      </el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(2)">
        发布上线
      </el-button>
      <el-button type="primary" @click="onPreview">预览</el-button>
      <el-button type="primary" @click="toArticles">关闭</el-button>
    </div>
    <article-preview
      :article="articleForm"
      :visible.sync="articlePreviewVisible"
    />
  </div>
</template>

<script>
import articleMixin from "./mixins/article-mixin";
import { createArticle, updateArticle } from "@/services/api/articles";

export default {
  mixins: [articleMixin],
  data() {
    return {
      hasAutoCreated: false, // 文章已被自动创建
      autoCreatedArticleId: "" // 自动创建的文章id
    };
  },
  methods: {
    onSubmit(article_status = 1) {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          this.articleForm.article_status = article_status;

          if (this.hasAutoCreated) {
            await updateArticle(this.autoCreatedArticleId, this.articleForm);
          } else {
            await createArticle(this.articleForm);
          }

          this.$store.dispatch("article/deleteFilesUnused");
          this.toArticles();
        }
      });
    },
    saveArticle() {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          if (this.hasAutoCreated) {
            await updateArticle(this.autoCreatedArticleId, this.articleForm);
            this.$message({ type: "success", message: "文章已自动保存为草稿" });
          } else {
            const res = await createArticle(this.articleForm);
            this.hasAutoCreated = true;
            this.autoCreatedArticleId = res.data.article_id;
            this.$message({ type: "success", message: "文章已自动保存为草稿" });
          }

          this.$store.dispatch("article/deleteFilesUnused");
        } else {
          this.$refs.articleForm.clearValidate();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-form {
  width: 900px;
  margin: 0 auto;

  .operate {
    padding-left: 100px;
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
