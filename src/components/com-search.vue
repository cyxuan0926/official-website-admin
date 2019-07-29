<template>
  <div class="com-search">
    <el-form ref="searchForm" :model="searchForm" inline>
      <el-form-item
        v-for="(item, index) in searchItems"
        :key="index"
        :prop="item.name"
        :label="item.label"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="searchForm[item.name]"
          :placeholder="item.placeholder"
        />
        <el-select
          v-if="item.type === 'select'"
          v-model="searchForm[item.name]"
          :placeholder="item.placeholder"
          @change="handleSearch"
        >
          <el-option
            v-for="(option, i) in item.options"
            :key="i"
            :label="option[item.labelKey || 'label']"
            :value="option[item.valueKey || 'value']"
          />
        </el-select>
        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="searchForm[item.name]"
          type="daterange"
          value-format="timestamp"
          align="right"
          unlink-panels
          range-separator="至"
          :start-placeholder="item['start-placeholder']"
          :end-placeholder="item['end-placeholder']"
        />
      </el-form-item>
      <el-form-item class="operate">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" />
        <el-button type="warning" @click="onReset">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { hasValue, deepCopy } from "@/common/helper";

const defaultSearchItems = [
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
    options: []
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

export default {
  props: {
    value: Object,
    searchItems: {
      type: Array,
      default: () => defaultSearchItems
    },
    onSearch: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      searchForm: {}
    };
  },
  watch: {
    searchForm: {
      deep: true,
      handler(val) {
        this.emitFilter(val);
        // const query = deepCopy(val);
        // let start_time, end_time;

        // if (
        //   query.article_publish_time &&
        //   query.article_publish_time.length > 0
        // ) {
        //   start_time = query.article_publish_time[0];
        //   end_time = query.article_publish_time[1] + 24 * 3600 * 1000;
        // }

        // delete query.article_publish_time;

        // this.$emit("input", Object.assign({}, query, { start_time, end_time }));
      }
    }
  },
  created() {
    this.initSearchForm();
  },
  methods: {
    initSearchForm() {
      const searchForm = {};

      this.searchItems.forEach(item => {
        searchForm[item.name] = item.defaultValue;
      });

      this.searchForm = searchForm;
    },
    handleSearch() {
      const filter = {};

      Object.keys(this.searchForm).forEach(key => {
        if (hasValue(this.searchForm[key])) {
          filter[key] = this.searchForm[key];
        }
      });

      // watch searchForm 无法及时响应参数变化，故手动 emit
      this.emitFilter(this.searchForm);
      this.onSearch(filter);
    },
    emitFilter(searchForm) {
      const query = deepCopy(searchForm);
      let start_time, end_time;

      if (
        query.article_publish_time &&
        query.article_publish_time.length === 2
      ) {
        start_time = query.article_publish_time[0];
        end_time = query.article_publish_time[1] + 24 * 3600 * 1000;
      }

      delete query.article_publish_time;

      this.$emit("input", Object.assign({}, query, { start_time, end_time }));
    },
    onReset() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 20px;

  .el-select {
    width: 130px;
  }

  .el-range-editor {
    width: 260px;
  }

  ::v-deep .el-range-input {
    padding-top: 3px;
  }
}
</style>
