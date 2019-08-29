<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" /> -->
        <!-- <PlatformDropdown v-model="postForm.kind" /> -->
        <!-- <SourceUrlDropdown v-model="postForm.source" /> -->

        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布提交</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>(*)活动名：</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label="(*)举办机构:"
                    label-width="120px"
                    class="postInfo-container-item"
                    prop="author"
                  >
                    <el-input
                      v-model="postForm.eorganizer"
                      placeholder="请输入内容"
                      clearable
                      maxlength="20"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="(*)推送时间:"
                    class="postInfo-container-item"
                    prop="start_time"
                  >
                    <el-date-picker
                      v-model="displayStartTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="(*)结束时间:"
                    class="postInfo-container-item"
                    prop="end_time"
                  >
                    <el-date-picker
                      v-model="displayEndTime"
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

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="60px" label="摘要:">
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
        </el-form-item> -->

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="image_uri" label="(*)文章封面:" style="margin-bottom: 30px;">
          <Upload v-model="postForm.picture" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
import { fetchActivity, createActivity } from '@/api/activity'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
// import { SourceUrlDropdown } from './Dropdown'
// import { mapGetters } from 'vuex'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  remark: '', // 文章摘要
  source: '', // 文章外链
  // image_uri: '', // 文章图片
  picture: '', // 文章图片
  startTime: undefined,
  endTime: undefined,
  id: undefined,
  kind: 0,
  // comment_disabled: false,
  // importance: 0,
  examStatus: 0,
  eorganizer: '',
  author: ''
}

export default {
  name: 'ArticleDetail',
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky
  // SourceUrlDropdown
  },
  props: {
    isEdit: {
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
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validURL(value)) {
    //       callback()
    //     } else {
    //       this.$message({
    //         message: '外链url填写不正确',
    //         type: 'error'
    //       })
    //       callback(new Error('外链url填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        end_time: [{ validator: validateRequire }],
        start_time: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        source: [{ validator: validateRequire }]
        // source: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    /* ...mapGetters([
      'nickname'
    ]), */
    contentShortLength() {
      return this.postForm.remark ? this.postForm.remark.length : 0
    },
    displayStartTime: {
      get() {
        return +new Date(this.postForm.starttime)
      },
      set(val) {
        this.postForm.startTime = new Date(val)
      }
    },
    displayEndTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.endtime)
      },
      set(val) {
        this.postForm.endTime = new Date(val)
        // console.log('z:this.postForm.publishTime=' + this.postForm.publishTime)
      }
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
      fetchActivity(id)
        .then(response => {
          this.postForm = response.data

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
          createActivity(this.postForm)
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
            })
            .catch(err => {
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
