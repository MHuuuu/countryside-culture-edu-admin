<template>
  <div>
    <!-- <uploader :options="options" class="uploader-example">
      <uploader-unsupport />
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>select files</uploader-btn>
        <uploader-btn :attrs="attrs">select images</uploader-btn>
        <uploader-btn :directory="true">select folder</uploader-btn>
      </uploader-drop>
      <uploader-list />
    </uploader> -->
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      @file-complete="fileComplete"
      @complete="complete"
    />
  </div>
</template>

<script>
import { uploadVideo } from '@/api/public'
// import axios from 'axios'
// import qs from 'qs'

export default {
  name: 'Test',
  data() {
    return {
      options: {
        target: '/public/chunk',
        testChunks: true,
        simultaneousUploads: 1,
        chunkSize: 10 * 1024 * 1024
      },
      attrs: {
        accept: 'image/*'
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  methods: {
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
      uploadVideo(data).then(function(response) {
        console.log(response)
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
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
