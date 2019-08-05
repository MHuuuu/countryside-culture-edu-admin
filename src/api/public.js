import request from '@/utils/request'

// console.log('z:upload(formData),formData=' + formData)
export function upload(formData) {
  return request({
    url: '/public/uploadImg',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function uploadVideo(fileInfo) {
  return request({
    url: '/public/mergeFile',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    data: fileInfo
  })
}

export function uploadChunk(fileInfo) {
  return request({
    url: '/public/chunk',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    data: fileInfo
  })
}
