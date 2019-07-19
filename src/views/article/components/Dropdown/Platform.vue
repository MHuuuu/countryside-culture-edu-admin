<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      选择平台({{ platforms?1:0 }})
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-radio-group v-model="platforms" style="padding: 5px 15px;">
        <el-radio v-for="item in platformsOptions" :key="item.key" :label="item.key">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      platformsOptions: [
        // { key: 'a-platform', name: 'a-platform' },
        // { key: 'b-platform', name: 'b-platform' },
        // { key: 'c-platform', name: 'c-platform' },
        { key: 11, name: '网站公告' },
        { key: 12, name: '新闻快讯' },
        { key: 13, name: '专题访谈' },
        { key: 14, name: '原创资讯' }
      ]
    }
  },
  computed: {
    platforms: {
      get() {
        console.log('z:this.value=' + this.value)
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
