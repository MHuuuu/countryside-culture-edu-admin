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
        { key: 15, name: '经典剧目' },
        { key: 16, name: '纪录片' },
        { key: 17, name: '教学' },
        { key: 18, name: '活动' }
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
