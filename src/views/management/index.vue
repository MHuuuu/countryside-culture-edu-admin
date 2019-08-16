<template>
  <div class="app-container">

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User id" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User Name" width="150">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="User Nickname">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="最后登陆时间">
        <template slot-scope="scope">
          {{ scope.row.lastLoginTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="最后登陆IP">
        <template slot-scope="scope">
          {{ scope.row.lastLoginIp }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDetailInfo(scope)">
            {{ detailText }}
          </el-button>
          <el-button v-if="scope.row.status===1" type="danger" size="small" @click="handleLock(scope)">
            {{ lockText }}
          </el-button>
          <el-button v-if="scope.row.status===0" type="success" size="small" @click="handleUnlockText(scope)">
            {{ unlockText }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />
    <el-dialog
      title="详细"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="detailItem" :model="detailItem" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="detailItem.nickname" disabled />
        </el-form-item>
      </el-form>

      <el-form ref="detailItem" :model="detailItem" label-width="80px">
        <el-form-item label="联系方式">
          <el-input v-model="detailItem.phone" disabled />
        </el-form-item>
      </el-form>

      <el-form ref="detailItem" :model="detailItem" label-width="80px">
        <el-form-item label="邮票">
          <el-input v-model="detailItem.email" disabled />
        </el-form-item>
      </el-form>

      <el-form ref="detailItem" :model="detailItem" label-width="80px">
        <el-form-item label="实名">
          <el-input v-model="detailItem.userRealName" disabled />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import path from 'path'
// import { getRoles, deleteRole } from '@/api/role'
import { getUserList, lockUser, unlockUser } from '@/api/management'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      editPermissionText: '编辑权限',
      detailText: '查看详情',
      lockText: '封锁',
      unlockText: '解封',
      dialogVisible: false,

      list: null,
      detailItem: {
        password: null,
        username: null,
        phone: null,
        userRealName: null,
        nickname: null,
        lastLoginTime: null,
        lastLoginIp: null,
        email: null,
        picture: null,
        status: null
      },
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    // Mock: get all data list from server
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await getUserList(this.listQuery)
      this.list = res.data.items
      this.total = res.data.total
      this.listLoading = false
      // this.rolesList = res.data
    },
    handleDetailInfo({ $index, row }) {
      this.dialogVisible = true
      this.detailItem = row
      console.log(this.detailItem)
    },
    handleUnlockText({ $index, row }) {
      this.$confirm('确认解禁该用户吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await unlockUser(row.id)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.list[$index].status = 1
        }).catch(err => { console.error(err) })
    },
    handleLock({ $index, row }) {
      this.$confirm('确认封禁该用户吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await lockUser(row.id)
        // this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.list[$index].status = 0
      })
        .catch(err => { console.error(err) })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
