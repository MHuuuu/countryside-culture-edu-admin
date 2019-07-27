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

export function uploadVideo(data) {
  return request({
    url: '/public/mergeFile',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
