<template>
  <div v-show="visible" class="article-preview">
    <!-- <com-editor v-model="content" /> -->
    <div id="articlePreview"></div>
    <i class="el-icon-circle-close" @click="onClose" />
  </div>
</template>

<script>
// import Quill from "Quill";

export default {
  props: {
    visible: Boolean,
    content: String
  },
  watch: {
    visible(val) {
      val && this.renderHtml();
    }
  },
  mounted() {
    this.renderHtml();
  },
  methods: {
    onClose() {
      this.$emit("update:visible", false);
    },
    renderHtml() {
      document.querySelector("#articlePreview").innerHTML = this.content;
    }
  }
};
</script>

<style lang="scss" scoped>
.article-preview {
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  width: 100vw;
  height: 100vh;
  background-color: #fff;

  .com-editor {
    width: 1200px;
    margin: 30px auto;
  }

  .el-icon-circle-close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
  }
}
</style>
