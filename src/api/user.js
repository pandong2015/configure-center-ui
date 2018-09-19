import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/data/user/page',
    method: 'post',
    data: params
  })
}

export function create(body) {
  return request({
    url: '/data/user',
    method: 'post',
    data: body
  })
}

export function edit(body) {
  return request({
    url: '/data/user',
    method: 'put',
    data: body
  })
}

export function del(id) {
  return request({
    url: '/data/user/' + id,
    method: 'delete'
  })
}
