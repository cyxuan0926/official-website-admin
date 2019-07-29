<template>
  <router-view />
</template>

<script>
export default {
  created() {
    this.$store.dispatch("article/getArticleTypes");
  }
};
</script>
