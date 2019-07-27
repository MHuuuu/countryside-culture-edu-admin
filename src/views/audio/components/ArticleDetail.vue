<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" /> -->
        <PlatformDropdown v-model="postForm.kind" />
        <SourceUrlDropdown v-model="postForm.source" />
        <!-- 文章锁定 -->
        <el-button
          v-if="postForm.examStatus == 1 && !isCheak"
          type="info"
        >文章锁定-等待审核中</el-button>

        <el-button
          v-if="isCheak"
          type="info"
        >文章锁定-查看中</el-button>

        <el-button
          v-if="!isCheak && (postForm.examStatus == 0 || postForm.examStatus == 3)"
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布提交</el-button>
        <el-button
          v-loading="loading"
          :disabled="postForm.examStatus !== 0"
          type="warning"
          @click="draftForm"
        >保存草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>(*)Title</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="(*)是否原创文章:">
                    <el-switch v-model="getIsOriginal" />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="原文作者:" label-width="120px" class="postInfo-container-item" prop="author">
                    <el-input
                      v-model="postForm.author"
                      :disabled="getIsOriginal"
                      placeholder="请输入内容"
                      clearable
                      maxlength="20"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="(*)编辑:" class="postInfo-container-item" prop="editor">
                    <el-input
                      v-model="postForm.editor"
                      clearable
                      maxlength="20"
                    />
                    <!-- <el-select
                      v-model="postForm.author"
                      :remote-method="getRemoteUserList"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search user"
                    >
                      <el-option
                        v-for="(item,index) in userListOptions"
                        :key="item+index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>-->
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="(*)推送时间:" class="postInfo-container-item" prop="publish_time">
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="6">
                  <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col>-->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="摘要:">
          <el-input
            v-model="postForm.remark"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
            maxlength="255"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="image_uri" label="(*)文章封面:" style="margin-bottom: 30px;">
          <Upload v-model="postForm.picture" />
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
      title="退稿提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>您的这条稿件遭到了退稿<br></span>
      <span><b>退稿理由:</b><br>{{ postForm.remark }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, submitArticle, draftArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
import { PlatformDropdown, SourceUrlDropdown } from './Dropdown'
// import { mapGetters } from 'vuex'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  remark: '', // 文章摘要
  source: '', // 文章外链
  // image_uri: '', // 文章图片
  picture: '', // 文章图片
  publishTime: undefined, // 前台展示时间
  id: undefined,
  kind: 0,
  // comment_disabled: false,
  // importance: 0,
  examStatus: 0,
  isOriginal: 0,
  author: '',
  editor: ''
}

export default {
  name: 'ArticleDetail',
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isCheak: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        publish_time: [{ validator: validateRequire }],
        editor: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        source: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    /* ...mapGetters([
      'nickname'
    ]), */
    editorName() {
      return this.postForm.editor
    },
    getIsOriginal: {
      get() {
        return this.postForm.isOriginal === 1
      },
      set(val) {
        if (val) {
          this.postForm.author = this.postForm.editor
        } else {
          this.postForm.author = ''
        }
        this.postForm.isOriginal = val ? 1 : 0
      }
    },
    contentShortLength() {
      return this.postForm.remark.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.publishTime)
      },
      set(val) {
        this.postForm.publishTime = new Date(val)
        // console.log('z:this.postForm.publishTime=' + this.postForm.publishTime)
      }
    }
  },
  watch: {
    editorName(val) {
      if (this.getIsOriginal) this.postForm.author = val
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data

          // 提示框
          if (this.postForm.examStatus === 3 && !this.isCheak) {
            this.dialogVisible = true
          }
          // just for test
          // this.postForm.title += `Article Id:${this.postForm.id}`

          // set tagsview title
          // 暂时不用
          // this.setTagsViewTitle()

          // set page title
          this.setPageTitle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }

      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          submitArticle(this.postForm)
            .then(response => {
              this.postForm.examStatus = 1
              // console.log(response.data)
              this.$notify({
                title: '成功',
                message: '发布文章成功,等待审核中',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
            }).catch(err => {
              console.log(err)
              this.$notify({
                title: '失败',
                message: '发布文章失败',
                type: 'success',
                duration: 2000
              })
            })

          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }

      draftArticle(this.postForm).then(response => {
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      }).catch(err => {
        console.log(err)
        return
      })
    }
    // getRemoteUserList(query) {
    //   searchUser(query).then(response => {
    //     if (!response.data.items) return
    //     this.userListOptions = response.data.items.map(v => v.name)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
