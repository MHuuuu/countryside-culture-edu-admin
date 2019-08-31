<template>
  <div class="app-container">
    <el-row class="row-bg" :gutter="10">
      <el-col v-for="item in list" :key="item.id" :span="6" class="col-bg">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.picture" class="image">
          <div style="padding: 14px;">
            <router-link :to="'/activity/edit/'+item.id" class="link-type">
              <span class="activity-title">{{ item.title }}</span>
            </router-link>
            <span>{{ '('+item.status+')' }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.endtime +' 开始至 '+item.endtime +' 结束' }}</time>

              <!-- <el-button type="text" class="button">操作按钮</el-button> -->
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="[8,16,32]" @pagination="getActivityList" />
  </div>
</template>

<script>
// import path from 'path'
// import { getRoles, deleteRole } from '@/api/role'

import { fetchList } from '@/api/activity'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,

      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 8
      }
      // currentDate: new Date()

    }
  },

  created() {
    this.getActivityList()
  },
  methods: {
    getActivityList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
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

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    height: 350px;
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

.col-bg{
  margin: 10px 0px;
}

.activity-title{
  white-space: nowrap;  /*强制span不换行*/
  display: inline-block;  /*将span当做块级元素对待*/
  width: 200px;  /*限制宽度*/
  overflow: hidden;  /*超出宽度部分隐藏*/
  text-overflow: ellipsis;  /*超出部分以点号代替*/
  line-height: 0.9;  /*数字与之前的文字对齐*/
}
</style>
