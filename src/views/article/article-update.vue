<template>
  <div class="route article-form">
    <article-form
      v-if="isArticleLoaded"
      ref="articleForm"
      v-model="articleForm"
    />
    <div class="operate">
      <el-button
        v-if="articleForm.article_status !== 2"
        type="primary"
        :loading="loading"
        @click="onSubmit(articleForm.article_status)"
      >
        保存
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
import { getArticle, updateArticle } from "@/services/api/articles";

export default {
  mixins: [articleMixin],
  data() {
    return {
      isArticleLoaded: false
    };
  },
  async beforeRouteEnter(to, from, next) {
    const article_id = to.params.article_id;
    const res = await getArticle(article_id);
    const article = res.data;

    delete article.article_id;
    next(vm => {
      vm.articleForm = article;
      vm.isArticleLoaded = true;
    });
  },
  methods: {
    onSubmit(article_status = 1) {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          this.articleForm.article_status = article_status;
          await updateArticle(this.$route.params.article_id, this.articleForm);
          this.$store.dispatch("article/deleteFilesUnused");
          this.toArticles();
        }
      });
    },
    saveArticle() {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          await updateArticle(this.$route.params.article_id, this.articleForm);
          this.$store.dispatch("article/deleteFilesUnused");
          this.$message({ type: "success", message: "自动保存成功" });
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
