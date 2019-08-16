<template>
  <div class="app-container">
    <el-row>
      <el-col v-for="(o, index) in 2" :key="o" :span="8" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-table :data="list" style="width: 100%;margin-top:30px;" border>
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
    </el-table> -->

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getActivityList" />
  </div>
</template>

<script>
// import path from 'path'
// import { getRoles, deleteRole } from '@/api/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
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
