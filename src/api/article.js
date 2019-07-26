import request from '@/utils/request'

export function fetchList(query) {
  // console.log('z:fetchList(query),query=' + query)
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchAuditList(query) {
  console.log('z:fetchAuditList(query),query=' + query)
  return request({
    url: '/article/auditList',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function submitArticle(data) {
  return request({
    url: '/article/submit',
    method: 'post',
    data
  })
}

export function draftArticle(data) {
  return request({
    url: '/article/draft',
    method: 'post',
    data
  })
}

export function auditArticle(data) {
  const { id, remark } = data
  // console.log('z:auditArticle, id=' + id + 'remark =' + remark)
  return request({
    url: '/article/audit',
    method: 'post',
    params: {
      id,
      remark
    }
  })
}
