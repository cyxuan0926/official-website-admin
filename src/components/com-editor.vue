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
import { uploadFile, deleteFile } from "@/services/api/files";

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
    resolveImages(ops) {
      if (!(ops instanceof Array)) return [];

      const images = [];

      ops.forEach(item => {
        item.insert.image && images.push(item.insert.image);
      });

      return images;
    },
    initQuill() {
      this.quill = new Quill(this.$refs.editor, this.options);
      this.contentObj = this.quill.getContents();
      this.bindEvent();
      this.rewriteHandler();
    },
    bindEvent() {
      this.quill.on("text-change", () => {
        const html = this.$refs.editor.children[0].innerHTML;
        this.content = this.quill.getLength() === 1 ? "" : html;
        this.deleteUnusedImages(this.quill.getContents(), this.contentObj);
        this.contentObj = this.quill.getContents();
        this.$emit("input", this.content);
      });
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

        this.quill.insertEmbed(
          this.quill.getLength(),
          "image",
          res.data.file_path
        );

        // this.filesUploaded.push(file);
      }, 0);
    },
    async deleteUnusedImages(content, oldContent) {
      const images = this.resolveImages(content.ops);
      const oldImages = this.resolveImages(oldContent.ops);
      console.log("deleteUnuse change", content, oldContent, images, oldImages);
      oldImages.forEach(async imagePath => {
        if (!images.includes(imagePath)) {
          console.log(imagePath);
          await deleteFile(imagePath);
        }
      });
    },
    clearData() {
      this.content = "";
      this.contentObj = {};
      this.quill.setText("");
    }
    // 删除富文本中未使用到的图片
    // async deleteUnusedImages() {
    //   const imagesUsed = this.resolveFileUrls("image");
    //   const imagesUnused = [];
    //   const filesUploaded = this.filesUploaded;

    //   // 找出未使用的文件
    //   filesUploaded.forEach(file => {
    //     if (!imagesUsed.includes(file.response.file_path)) {
    //       imagesUnused.push(file.response);
    //     }
    //   });

    //   // 删除未使用文件
    //   if (imagesUnused.length > 0) {
    //     try {
    //       await deleteFile(imagesUnused);

    //       // 去掉已删除的文件
    //       imagesUnused.forEach(el => {
    //         const index = filesUploaded.findIndex(
    //           file => file.response.file_path === el.file_path
    //         );

    //         index > -1 && filesUploaded.splice(index, 1);
    //       });
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // },
    /**
     * 从 delta 中解析特定类型文件的所有 URL
     * @param {String} 文件类型
     * @return {Array} URL列表
     * @example
     *
     * resolveFileUrls("image")
     * // =>
     * [
     *  "/public/banner1-7fc60192347beadbcdea988426ef65a8.png",
     *  "/public/bangonglou-c333a1c2957dac5558c4a8cd0c3d04b9.jpg"
     * ]
     */
    // resolveFileUrls(type) {
    //   const fileUrls = [];

    //   this.quill.getContents().ops.forEach(item => {
    //     item.insert[type] && fileUrls.push(item.insert[type]);
    //   });

    //   return fileUrls;
    // }
  }
};
</script>
