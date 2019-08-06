<template>
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
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="onUpload"
        :on-remove="onUploadRemove"
      >
        <img
          class="avatar"
          v-if="articleForm.article_cover"
          :src="articleForm.article_cover"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <!-- <el-upload
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
      </el-upload> -->
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
  </el-form>
</template>

<script>
import { comEditor } from "@/components";
import { uploadFile } from "@/services/api/files";
import { deepCopy } from "@/common/helper";

// TODO: 更细致的表单校验
export default {
  components: { comEditor },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
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
            message: "标题长度为 2 到 32 个字符",
            trigger: "blur"
          }
        ],
        article_description: [
          { required: true, message: "请输入文章扼要", trigger: "blur" },
          {
            min: 2,
            max: 80,
            message: "文章扼要长度为 2 到 80 个字符",
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
      },
      articleCover: []
    };
  },
  watch: {
    articleForm: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  },
  created() {
    this.articleForm = deepCopy(this.value);
  },
  mounted() {
    this.articleForm = deepCopy(this.value);
    const cover = this.articleForm.article_cover;
    this.articleCover = cover ? [{ url: cover }] : [];
  },
  methods: {
    async onUpload(form) {
      const res = await uploadFile(form.file);

      setTimeout(() => {
        const file = this.$refs.upload.getFile(form.file);
        file.percentage = 100;
        file.response = res.data;
        this.articleForm.article_cover = file.url = res.data.file_path;
        this.$refs.articleForm.validateField("article_cover", () => {});
      }, 0);
    },
    async onUploadRemove(file) {
      try {
        this.$store.dispatch("article/addFileToDelete", {
          file_path: file.url
        });
        this.articleForm.article_cover = "";
      } catch (err) {
        console.log(err);
      }
    },
    onExceed() {
      this.$message({ type: "warning", message: "只能上传一张封面图" });
    },
    validate(cb) {
      this.$refs.articleForm.validate(async (valid, info) => {
        cb(valid, info);
        const keys = Object.keys(info);

        if (keys.length > 0) {
          let message = info[keys[0]][0].message;
          this.$message({ type: "error", message });
        }
      });
    },
    clearValidate() {
      this.$refs.articleForm.clearValidate();
    }
    // clearData() {
    //   this.articleForm = {
    //     article_title: "",
    //     article_subtitle: "",
    //     article_author: "",
    //     article_source: "",
    //     article_content: "",
    //     article_status: 1,
    //     article_type_id: 1,
    //     article_istop: 0,
    //     article_rank: null,
    //     article_cover: "",
    //     article_publish_time: Date.now()
    //   };
    //   this.$refs.editor.clearData();
    // }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ql-container {
  height: 500px;
}

.avatar-uploader ::v-deep {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
