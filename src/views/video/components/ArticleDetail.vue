<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" /> -->
        <PlatformDropdown v-model="postForm.kind" />
        <!-- <SourceUrlDropdown v-model="postForm.source" /> -->
        <!-- 文章锁定 -->
        <el-button
          v-if="postForm.status == 1 && !isCheak"
          type="info"
        >文章锁定-等待审核中</el-button>

        <el-button
          v-if="isCheak"
          type="info"
        >文章锁定-查看中</el-button>

        <el-button
          v-if="!isCheak && (postForm.status == 0 || postForm.status == 3)"
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布提交</el-button>
        <!-- <el-button
          v-if="!isCheak "
          v-loading="loading"
          :disabled="postForm.status !== 0"
          type="warning"
          @click="draftForm"
        >保存草稿</el-button> -->

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
                <el-col>
                  <el-form-item label="作者:" label-width="120px" class="postInfo-container-item" prop="author">
                    <el-input
                      v-model="postForm.author"
                      placeholder="请输入内容"
                      clearable
                      maxlength="20"
                    />
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label-width="120px" label="推送时间:" class="postInfo-container-item" prop="publish_time">
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

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

        <el-form-item style="margin-bottom: 30px;">
          <video-player
            v-if="isEdit"
            ref="videoPlayer"
            class="video-player vjs-custom-skin"
            :playsinline="true"
            :options="playerOptions"
          />
          <uploader
            ref="uploader"
            :options="options"
            :file-status-text="statusText"
            class="uploader-example"
            @file-complete="fileComplete"
            @complete="complete"
          />
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
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchVideo, submitVideo } from '@/api/video'
import { PlatformDropdown } from './Dropdown'
import { uploadVideo } from '@/api/public'

import { parseTime } from '@/utils'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

const defaultForm = {
  theStatus: 'draft',
  title: '', // 文章题目
  // content: '', // 文章内容
  remark: '', // 文章摘要
  // source: '', // 文章外链
  // image_uri: '', // 文章图片
  picture: '', // 文章图片
  publishTime: undefined, // 前台展示时间
  id: undefined,
  kind: 0,
  status: 0,
  author: '',
  url: ''
}

export default {
  name: 'ArticleDetail',
  components: {
    MDinput,
    Upload,
    Sticky,
    PlatformDropdown,
    // SourceUrlDropdown,
    videoPlayer
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
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: undefined,
        // poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },

      options: {
        target: '/prod-api/public/chunk',
        testChunks: true,
        simultaneousUploads: 1,
        chunkSize: 10 * 1024 * 1024
      },
      // attrs: {
      //   accept: 'image/*'
      // },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },

      dialogVisible: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        // content: [{ validator: validateRequire }],
        publish_time: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }]
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
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  methods: {
    fetchData(id) {
      fetchVideo(id)
        .then(response => {
          this.postForm = response.data
          this.playerOptions.sources = [{
            // src: response.data.url, // 路径
            src: 'http://120.79.217.195:8080/' + this.postForm.url,
            type: 'video/mp4' // 类型
          }]

          // 提示框
          if (this.postForm.status === 3 && !this.isCheak) {
            this.dialogVisible = true
          }
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
        // this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }

      this.postForm.starttime = parseTime(this.postForm.publishTime, '{y}-{m}-{d} {h}:{i}:{s}')

      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          submitVideo(this.postForm)
            .then(response => {
              this.postForm.status = 1
              // console.log(response.data)
              this.$notify({
                title: '成功',
                message: '发布文章成功,等待审核中',
                type: 'success',
                duration: 2000
              })
              this.postForm.theStatus = 'published'
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

    // 上传完成
    complete() {
      console.log('complete', arguments)
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete() {
      console.log('file complete', arguments)
      const file = arguments[0].file
      const data = {
        filename: file.name,
        identifier: arguments[0].uniqueIdentifier,
        totalSize: file.size,
        type: file.type
      }

      uploadVideo(data).then(async(response) => {
        await console.log('上传成功')
        this.postForm.url = response.data
      }).catch(function(error) {
        console.log(error)
      })
    }
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

  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
