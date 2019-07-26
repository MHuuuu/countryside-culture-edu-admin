<template>
  <article-detail :is-edit="true" :is-cheak="true" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'CheakForm',
  components: { ArticleDetail }
}
</script>

