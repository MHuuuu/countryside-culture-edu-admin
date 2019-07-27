import request from '@/utils/request'

export function fetchList(query) {
  // console.log('z:fetchList(query),query=' + query)
  return request({
    url: '/video/list',
    method: 'get',
    params: query
  })
}

export function fetchAuditList(query) {
  console.log('z:fetchAuditList(query),query=' + query)
  return request({
    url: '/video/auditList',
    method: 'get',
    params: query
  })
}

export function fetchVideo(id) {
  return request({
    url: '/video/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/video/pv',
    method: 'get',
    params: { pv }
  })
}

export function submitVideo(data) {
  return request({
    url: '/video/submit',
    method: 'post',
    data
  })
}

export function draftVideo(data) {
  return request({
    url: '/video/draft',
    method: 'post',
    data
  })
}

export function auditVideo(data) {
  const { id, remark } = data
  // console.log('z:auditVideo, id=' + id + 'remark =' + remark)
  return request({
    url: '/video/audit',
    method: 'post',
    params: {
      id,
      remark
    }
  })
}
