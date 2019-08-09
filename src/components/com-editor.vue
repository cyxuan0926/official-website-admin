<template>
  <div class="com-editor">
    <div ref="editor"></div>
    <el-upload
      ref="upload"
      action="/api/v1/files"
      accept="image/*"
      multiple
      :show-file-list="false"
      :http-request="onUpload"
    />
  </div>
</template>

<script>
import Quill from "Quill";
import ImageResize from "quill-image-resize-module";
import { uploadFile } from "@/services/api/files";

Quill.register("modules/imageResize", ImageResize);

// Quill 编辑器默认配置
const defaultOptions = {
  modules: {
    toolbar: [
      [
        { size: ["small", false, "large", "huge"] },
        { header: [1, 2, 3, 4, 5, 6, false] }
      ],
      [
        "bold",
        "italic",
        "underline",
        { color: [] },
        { background: [] },
        "clean"
      ],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }, { direction: "rtl" }],
      ["link", "image"]
    ],
    imageResize: {
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white"
      },
      modules: ["Resize", "DisplaySize", "Toolbar"]
    }
  },
  placeholder: "请输入正文...",
  theme: "snow"
};

export default {
  props: {
    // 富文本内容（delta）
    value: String,
    options: {
      type: Object,
      default: () => defaultOptions
    }
  },
  data() {
    return {
      quill: {}, // Quill 实例
      content: "",
      contentObj: {}
      // filesUploaded: [] // 上传成功的文件列表
    };
  },
  watch: {
    value(val) {
      if (val !== this.content) {
        this.content = val;
        this.$refs.editor.children[0].innerHTML = val;
      }
    }
  },
  mounted() {
    this.initQuill();
  },
  beforeDestroy() {
    this.quill = null;
  },
  methods: {
    initQuill() {
      this.quill = new Quill(this.$refs.editor, this.options);
      this.$refs.editor.children[0].innerHTML = this.value;
      this.contentObj = this.quill.getContents();
      this.bindEvent();
      this.rewriteHandler();
    },
    bindEvent() {
      this.quill.on("text-change", this.storeContent);
      this.$refs.editor.addEventListener("click", this.storeContent);
    },
    // 自定义 handler
    rewriteHandler() {
      const toolbar = this.quill.getModule("toolbar");

      // 图片上传
      toolbar.addHandler("image", () => {
        document.querySelector(".el-upload__input").click();
      });
    },
    async onUpload(form) {
      const res = await uploadFile(form.file);
      setTimeout(() => {
        const file = this.$refs.upload.getFile(form.file);
        file.percentage = 100;
        file.response = res.data;

        const position = this.quill.getSelection()
          ? this.quill.getSelection().index
          : 0;
        this.quill.insertEmbed(position, "image", res.data.file_path);
      }, 0);
    },
    async deleteUnusedImages(content, oldContent) {
      const images = this.resolveImages(content.ops);
      const oldImages = this.resolveImages(oldContent.ops);

      oldImages.forEach(async imagePath => {
        if (!images.includes(imagePath)) {
          this.$store.dispatch("article/addFileToDelete", {
            file_path: imagePath
          });
        }
      });
    },
    clearData() {
      this.content = "";
      this.contentObj = {};
      this.quill.setText("");
    },
    resolveImages(ops) {
      if (!(ops instanceof Array)) return [];

      const images = [];

      ops.forEach(item => {
        item.insert.image && images.push(item.insert.image);
      });

      return images;
    },
    storeContent() {
      const html = this.$refs.editor.children[0].innerHTML;
      this.content = this.quill.getLength() === 1 ? "" : html;
      this.deleteUnusedImages(this.quill.getContents(), this.contentObj);
      this.contentObj = this.quill.getContents();
      this.$emit("input", this.content);
    }
  }
};
</script>
