<template>
  <div v-show="visible" class="article-preview">
    <div class="main center-box">
      <!-- <h2>{{ article.article_title }}</h2>
      <div class="article-info">
        <dl>
          <dt>发布时间：</dt>
          <dd>{{ article.article_publish_time | formatTime("yyyy-MM-dd") }}</dd>
        </dl>
        <dl v-if="article.article_author">
          <dt>作者：</dt>
          <dd>{{ article.article_author }}</dd>
        </dl>
        <div class="operate">
          【
          <span>字号：</span>
          <span class="big">大</span>
          <span class="middle active">中</span>
          <span class="small">小</span>】
        </div>
      </div>
      <div class="ql-snow">
        <div id="editor" class="article-content ql-editor"></div>
      </div>-->
      <h2 class="title">{{ article.article_title }}</h2>
      <div class="article-info">
        <dl>
          <dt>发布时间：</dt>
          <dd>{{ article.article_publish_time | formatTime("yyyy-MM-dd") }}</dd>
        </dl>
        <dl>
          <dt>作者：</dt>
          <dd>{{ article.article_author }}</dd>
        </dl>
        <!-- <div id="fontSizeAlter" class="operate">
          【<span>字号：</span><span class="big">大</span><span class="middle active">中</span><span class="small">小</span>】
        </div>-->
      </div>
      <div id="editor" class="article-content ql-container ql-snow">
        <div class="ql-editor" v-html="article.article_content"></div>
      </div>
      <div class="article-nav">
        <!-- <div class="prev nav-item">
          上一篇：
          <a href="javascript:void(0)" class="disabled">没有了</a>
        </div>
        <div class="next nav-item">
          下一篇：
          <a href>国科股份新三板挂牌敲钟仪式隆重举行</a>
        </div>-->
      </div>
    </div>
    <i class="el-icon-circle-close" @click="onClose" />
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    article: Object
  },
  // watch: {
  //   visible(val) {
  //     val && this.renderHtml();
  //   }
  // },
  // mounted() {
  //   this.renderHtml();
  // },
  methods: {
    onClose() {
      this.$emit("update:visible", false);
    }
    // renderHtml() {
    //   document.querySelector(
    //     "#editor"
    //   ).innerHTML = this.article.article_content;
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixins.scss";

.main {
  width: 1200px;
  padding-top: 78px;
  margin: 0 auto;

  .title {
    margin-bottom: 50px;
    text-align: center;
    font-size: 24px;
  }

  img {
    max-width: 100%;
  }

  ::v-deep .ql-container.ql-snow {
    height: auto;
    border: none;
    padding: 40px 0;
    font: 14px PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
      "Microsoft YaHei", sans-serif;

    p {
      line-height: 1.8;
    }
  }
}

.article-info {
  display: flex;
  align-items: center;
  height: 42px;
  margin-top: 30px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: #999;

  dl {
    display: flex;
    margin-right: 30px;
  }

  .operate {
    flex: 1;
    text-align: right;

    span {
      margin: 0 5px;
      cursor: pointer;

      &:first-child {
        cursor: default;
        margin-left: 8px;
      }

      &:last-child {
        margin-right: 8px;
      }

      &.active {
        font-weight: bold;
        // color: $text-color-default;
      }
    }
  }
}

.article-nav {
  display: flex;
  justify-content: space-between;
  padding-top: 26px;
  margin-bottom: 130px;
  border-top: 1px solid #ccc;
  font-size: 16px;

  .nav-item {
    max-width: 250px;
    @include text-ellipsis;

    a {
      &:hover {
        color: #005dac;
      }

      &.disabled {
        cursor: default;
        // color: $text-color-default;
      }
    }
  }
}

// .main {
//   width: 1200px;
//   padding-top: 78px;
//   margin: 0 auto;

//   h2 {
//     margin-bottom: 50px;
//     text-align: center;
//     font-size: 24px;
//   }

//   .ql-editor {
//     line-height: 1.8;
//   }

//   ::v-deep img {
//     max-width: 100%;
//   }
// }

// .article-info {
//   display: flex;
//   align-items: center;
//   height: 42px;
//   margin-top: 30px;
//   border-bottom: 1px solid #ccc;
//   font-size: 14px;
//   color: #999;

//   dl {
//     display: flex;
//     margin-right: 30px;
//   }

//   .operate {
//     flex: 1;
//     text-align: right;

//     span {
//       margin: 0 5px;
//       cursor: pointer;

//       &:first-child {
//         cursor: default;
//         margin-left: 8px;
//       }

//       &:last-child {
//         margin-right: 8px;
//       }

//       &.active {
//         font-weight: bold;
//         color: #333;
//       }
//     }
//   }
// }

// .article-content {
//   padding: 50px 0 60px;
// }

// .article-nav {
//   display: flex;
//   justify-content: space-between;
//   padding-top: 26px;
//   margin-bottom: 130px;
//   border-top: 1px solid #ccc;

//   .nav-item {
//     max-width: 250px;
//     @include text-ellipsis;

//     a {
//       &:hover {
//         color: #005dac;
//       }

//       &.disabled {
//         cursor: default;
//         color: #333;
//       }
//     }
//   }
// }

.article-preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
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
