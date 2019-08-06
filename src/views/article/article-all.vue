<template>
  <div class="route article-all">
    <com-search
      v-model="query"
      :search-items="searchItems"
      :on-search="onArticleSearch"
    />
    <div class="operate">
      <el-button
        :disabled="articlesSelectedCanOnline.length === 0"
        type="primary"
        @click="onUpdateArticleStatusBatch(2)"
      >
        批量上线
      </el-button>
      <el-button
        :disabled="articlesSelectedCanOffline.length === 0"
        type="primary"
        @click="onUpdateArticleStatusBatch(3)"
      >
        批量下线
      </el-button>
      <el-button
        :disabled="articlesSelectedCanDelete.length === 0"
        type="danger"
        icon="el-icon-delete"
        @click="onUpdateArticleStatusBatch(4)"
      />
    </div>
    <el-table
      tooltip-effect="dark"
      align="center"
      border
      :data="$store.state.article.articles"
      @selection-change="onArticlesSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="标题" width="300px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span @click="onUpdateArticle(scope.row.article_id)" class="title">
            {{ scope.row.article_title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.article_status | translate("ARTICLE_STATUS") }}
        </template>
      </el-table-column>
      <el-table-column prop="article_rank" label="置顶序数" />
      <el-table-column prop="article_type_name" label="栏目" />
      <el-table-column
        prop="article_source"
        label="来源"
        width="130px"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="发布时间" min-width="116px">
        <template slot-scope="scope">
          {{ scope.row.article_publish_time | formatTime("yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="192px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="onUpdateArticle(scope.row.article_id)"
          />
          <el-button
            v-if="[1, 3].includes(scope.row.article_status)"
            type="primary"
            size="small"
            @click="onUpdateArticleStatus(scope.row.article_id, 2)"
          >
            上线
          </el-button>
          <el-button
            v-if="[2].includes(scope.row.article_status)"
            type="warning"
            size="small"
            @click="onUpdateArticleStatus(scope.row.article_id, 3)"
          >
            下线
          </el-button>
          <el-button
            v-if="[1, 3].includes(scope.row.article_status)"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="onUpdateArticleStatus(scope.row.article_id, 4)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="onPageSizeChange"
      @current-change="onPageCurrentChange"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pagination.page_size"
      :total="pagination.total_rows"
    />
  </div>
</template>

<script>
import { comSearch } from "@/components";
import { updateArticle, updateArticleBatch } from "@/services/api/articles";

export default {
  components: { comSearch },
  data() {
    return {
      articlesSelected: [],
      query: {},
      pagination: {
        has_next: false,
        has_previous: false,
        page_num: 1,
        page_size: 10,
        total_pages: 0,
        total_rows: 0
      }
    };
  },
  computed: {
    // 选中的文章中可以进行上线操作的文章
    articlesSelectedCanOnline() {
      return this.articlesSelected.filter(article => {
        // 草稿、下线状态的文章可以进行上线操作
        return [1, 3].includes(article.article_status);
      });
    },
    // 选中的文章中可以进行下线操作的文章
    articlesSelectedCanOffline() {
      return this.articlesSelected.filter(article => {
        // 上线状态的文章可以进行下线操作
        return [2].includes(article.article_status);
      });
    },
    // 选中的文章中可以进行删除操作的文章
    articlesSelectedCanDelete() {
      return this.articlesSelected.filter(article => {
        // 草稿、下线状态的文章可以进行上线操作
        return [1, 3].includes(article.article_status);
      });
    },
    searchItems() {
      return [
        {
          type: "input",
          label: "标题",
          placeholder: "请输入关键字",
          name: "article_title"
        },
        {
          type: "select",
          label: "栏目",
          placeholder: "全部",
          name: "article_type_id",
          options: this.$store.state.article.articleTypes,
          labelKey: "article_type_name",
          valueKey: "article_type_id"
        },
        {
          type: "select",
          label: "状态",
          placeholder: "全部",
          name: "article_status",
          options: [
            { value: 1, label: "草稿" },
            { value: 2, label: "上线" },
            { value: 3, label: "下线" },
            { value: 4, label: "已删除" }
          ]
        },
        {
          type: "daterange",
          label: "发布时间",
          "start-placeholder": "开始日期",
          "end-placeholder": "结束日期",
          name: "article_publish_time"
        }
      ];
    }
  },
  created() {
    this.getArticles();
  },
  methods: {
    onArticleSearch() {
      this.getArticles();
    },
    onArticlesSelectionChange(selection) {
      this.articlesSelected = selection;
    },
    onPageSizeChange(page_size) {
      this.getArticles({ page_num: 1, page_size });
    },
    onPageCurrentChange(page_num) {
      this.getArticles({ page_num, page_size: this.pagination.page_size });
    },
    onUpdateArticle(article_id) {
      this.$router.push({
        name: this.$store.state.global.routesNameMap.ARTICLE_UPDATE,
        params: { article_id }
      });
    },
    async onUpdateArticleStatus(article_id, article_status) {
      let tip = "";

      switch (article_status) {
        case 2: // 上线操作
          tip = "确定上线所选文章吗？";
          break;

        case 3: // 下线操作
          tip = "确定下线所选文章吗？";
          break;

        case 4: // 删除操作
          tip = "确定删除所选文章吗？";
          break;
      }

      try {
        await this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // this.$store.dispatch("article/updateArticle", {
        //   article_id,
        //   data: { article_status }
        // });
        await updateArticle(article_id, { article_status });
        const { page_num, page_size } = this.pagination;
        this.getArticles({ page_num, page_size });
      } catch (err) {
        console.log(err);
      }
    },
    async onUpdateArticleStatusBatch(article_status) {
      let tip = "";
      let articles = [];

      // 1：草稿，2：上线，3：下线，4：已删除
      switch (article_status) {
        case 2: // 上线操作
          articles = this.articlesSelectedCanOnline;
          tip = "确定上线所选文章吗？";
          break;

        case 3: // 下线操作
          articles = this.articlesSelectedCanOffline;
          tip = "确定下线所选文章吗？";
          break;

        case 4: // 删除操作
          articles = this.articlesSelectedCanDelete;
          tip = "确定删除所选文章吗？";
          break;
      }

      articles = articles.map(article => {
        return { article_id: article.article_id, article_status };
      });

      try {
        await this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        await updateArticleBatch(articles);
        const { page_num, page_size } = this.pagination;
        this.getArticles({ page_num, page_size });
      } catch (err) {
        console.log(err);
      }
    },
    async getArticles(query) {
      query = Object.assign({}, this.query, query);
      const res = await this.$store.dispatch("article/getArticles", query);
      this.pagination = res.meta.pagination;
    }
  }
};
</script>

<style lang="scss" scoped>
.operate {
  margin-top: 10px;
}

// ::v-deep table {
//   table-layout: fixed;
// }

::v-deep tbody {
  tr td {
    &:nth-child(2) .cell {
      max-width: 300px;
    }

    &:nth-child(6) .cell {
      max-width: 130px;
    }
  }
}

.el-table {
  margin-top: 20px;

  .title {
    cursor: pointer;
  }
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
