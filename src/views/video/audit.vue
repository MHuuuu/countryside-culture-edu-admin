<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastestTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <router-link :to="'/video/cheak/'+row.id">
            <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          </router-link>
          <el-tag>{{ row.kind | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.auditor }}</span>
        </template>
      </el-table-column>

      <!-- 星级插件
        <el-table-column label="Imp" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="点击量" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.clickNum" class="link-type">{{ row.clickNum }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusInfoFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/video/cheak/'+row.id">
            <el-button type="primary" size="mini">
              查看
            </el-button>
          </router-link>
          <el-button v-if="row.status==1" size="mini" type="success" @click="handleModifyStatus(row,2)">
            通过
          </el-button>
          <el-button v-if="row.status==1" size="mini" type="danger" @click="handleBack(row)">
            退稿
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 退稿提示框 -->
    <el-dialog :visible.sync="dialogBackVisible" title="退稿">
      <span>确定退回该稿件吗？</span>
      <el-form ref="backForm" :rules="rules" :model="temp">
        <el-form-item label="目标ID">
          <el-input v-model="temp.id" prop="id" :disabled="true" />
        </el-form-item>
        <el-form-item label="退稿理由" prop="statusReason">
          <el-input v-model="temp.statusReason" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogBackVisible = false">退出</el-button>
        <el-button type="primary" @click="backArticle">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAuditList, auditVideo } from '@/api/video'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '15', display_name: '经典剧目' },
  { key: '16', display_name: '纪录片' },
  { key: '17', display_name: '教学' },
  { key: '18', display_name: '活动' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Audit',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        // published: 'success',
        // draft: 'info',
        // deleted: 'danger',
        0: 'info',
        1: 'warning',
        2: 'success',
        3: 'warning'
      }
      return statusMap[status]
    },
    statusInfoFilter(status) {
      const statusMap = {
        0: '草稿',
        1: '待审核',
        2: '已发布',
        3: '退稿',
        4: '关闭'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (!value || value === '') {
        console.log('z:validateRequire错误,' + value)
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        console.log('z:validateRequire正常,' + value)
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      /* 临时对象储存 */
      temp: {
        id: 0,
        statusReason: ''
        // importance: 1,
        // timestamp: new Date(),
        // title: '',
        // type: '',
        // status: 'published'
      },
      dialogBackVisible: false,
      // dialogFormVisible: false,
      // dialogStatus: '',
      // textMap: {
      //   update: 'Edit',
      //   create: 'Create'
      // },
      // dialogPvVisible: false,
      // pvData: [],
      rules: {
        statusReason: [{ validator: validateRequire, trigger: 'blur' }]
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAuditList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.passArticle(row.id)
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleBack(row) {
      row.status = 4
      this.dialogBackVisible = true
      this.temp.id = row.id
      if (row.statusReason && row.statusReason.length > 0) this.temp.statusReason = row.statusReason
      else this.temp.statusReason = ''
      // this.$nextTick(() => {
      //   // this.$refs['backForm'].clearValidate()
      // })
    },
    passArticle(id) {
      this.temp.id = id
      auditVideo(this.temp).then(() => {
        this.dialogBackVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    backArticle() {
      this.$refs['backForm'].validate((valid) => {
        if (valid) {
          auditVideo(this.temp).then(() => {
            this.dialogBackVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
