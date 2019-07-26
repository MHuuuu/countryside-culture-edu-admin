import request from '@/utils/request'

// console.log('z:upload(formData),formData=' + formData)
export function upload(formData) {
  return request({
    url: '/public/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
