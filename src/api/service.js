import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/data/service/page',
    method: 'post',
    data: params
  })
}

export function getAllService() {
  return request({
    url: '/data/service/all',
    method: 'get'
  })
}

export function createService(body) {
  return request({
    url: '/data/service',
    method: 'post',
    data: body
  })
}

export function editService(body) {
  return request({
    url: '/data/service',
    method: 'put',
    data: body
  })
}

export function del(id) {
  return request({
    url: '/data/service/' + id,
    method: 'delete'
  })
}

export function refreshKeypair(body) {
  return request({
    url: '/data/service/key',
    method: 'post',
    data: body
  })
}
