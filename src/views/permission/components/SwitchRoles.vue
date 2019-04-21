<template>
  <div>
    <div style="margin-bottom:15px;">
      {{ rolesText }}: {{ roles }}
    </div>
    {{ switchRolesText }}:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesText: '你的权限',
      switchRolesText: '切换权限'
    }
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
