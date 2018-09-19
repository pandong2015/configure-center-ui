import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/data/configure/page',
    method: 'post',
    data: params
  })
}

export function create(body) {
  return request({
    url: '/data/configure',
    method: 'post',
    data: body
  })
}

export function edit(body) {
  return request({
    url: '/data/configure',
    method: 'put',
    data: body
  })
}

export function del(body) {
  return request({
    url: '/data/configure',
    method: 'delete',
    data: body
  })
}

export function copyConfigure(body) {
  return request({
    url: '/data/configure/copy',
    method: 'post',
    data: body
  })
}
