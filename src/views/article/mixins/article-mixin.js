import articleForm from "../components/article-form";
import articlePreview from "../components/article-preview";

export default {
  components: { articleForm, articlePreview },
  data() {
    return {
      loading: false,
      articlePreviewVisible: false,
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
      }
    };
  },
  watch: {
    "articleForm.article_istop"(val) {
      if (val === 0) {
        this.articleForm.article_rank = null;

        if (this.articleForm.article_cover) {
          this.$store.dispatch("article/addFileToDelete", {
            file_path: this.articleForm.article_cover
          });
          this.articleForm.article_cover = "";
        }
      }
    }
  },
  created() {
    this.initAutoSave();
  },
  beforeDestroy() {
    this.clearData();
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
    toArticles() {
      this.$router.push({
        name: this.$store.state.global.routesNameMap.ARTICLE_ALL
      });
    },
    saveArticle() {},
    clearData() {
      this.loading = false;
      this.articlePreviewVisible = false;
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
};
