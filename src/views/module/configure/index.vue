<template>
  <div class="app-container">
    <el-row class="tac">
      <el-row type="flex" class="tac" justify="end">
        <el-button type="primary" @click="searchBefore()">查询</el-button>
        <el-button type="primary" @click="createNewBefore()">新建</el-button>
        <el-button type="primary" @click="copyBefore()">Copy</el-button>
      </el-row>
      <el-row class="tac">
        <el-dialog
          :visible.sync="deleteVisible"
          title="提示"
          width="30%">
          <span>删除记录吗?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取 消</el-button>
            <el-button type="primary" @click="remove()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="editVisible" title="编辑">
          <el-form ref="form" :model="createForm" label-width="80px">
            <el-form-item label="Name">
              <el-input v-model="createForm.name"/>
            </el-form-item>
            <el-form-item label="Value">
              <el-input v-model="createForm.value"/>
            </el-form-item>
            <el-form-item label="Service">
              <el-select v-model="createForm.serviceId" filterable placeholder="请选择">
                <el-option v-for="service in services" :key="service.id" :label="service.name" :value="service.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Profile">
              <el-select v-model="createForm.profileId" filterable placeholder="请选择">
                <el-option v-for="profile in profiles" :key="profile.id" :label="profile.name" :value="profile.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :visible.sync="searchVisible" title="查询">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Name">
              <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="Status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="s in status" :key="s" :label="s" :value="s"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Service">
              <el-checkbox-group v-model="form.serviceIds" size="small">
                <el-checkbox-button v-for="service in services" :label="service.id" :key="service.id">{{ service.name }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Profile">
              <el-checkbox-group v-model="form.profileIds" size="small">
                <el-checkbox-button v-for="profile in profiles" :label="profile.id" :key="profile.id">{{ profile.name }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :visible.sync="copyVisible" title="Copy">
          <el-form ref="form" :model="copyForm" label-width="80px">
            <el-form-item label="Source Service">
              <el-select v-model="copyForm.sourceServiceId" placeholder="请选择">
                <el-option v-for="service in services" :label="service.name" :key="service.id" :value="service.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Source Profile">
              <el-select v-model="copyForm.sourceProfileId" placeholder="请选择">
                <el-option v-for="profile in profiles" :label="profile.name" :key="profile.id" :value="profile.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Target Service">
              <el-select v-model="copyForm.targetServiceId" placeholder="请选择">
                <el-option v-for="service in services" :label="service.name" :key="service.id" :value="service.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="Target Profile">
              <el-select v-model="copyForm.targetProfileId" placeholder="请选择">
                <el-option v-for="profile in profiles" :label="profile.name" :key="profile.id" :value="profile.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="copy">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-col>
          <el-table v-loading="listLoading" ref="multipleTable" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"/>
            <el-table-column prop="serviceName" label="Service"/>
            <el-table-column prop="profileName" label="Profile"/>
            <el-table-column prop="name" label="Name"/>
            <el-table-column prop="value" label="Value"/>
            <el-table-column prop="createTime" label="Create Time"/>
            <el-table-column prop="updateTime" label="Update Time"/>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editBefore(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeBefore(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" class="tac" justify="end">
        <el-col>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 50, 100]"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { getList, create, edit, del, copyConfigure } from '@/api/configure'
import { getAllProfile } from '@/api/profile'
import { getAllService } from '@/api/service'

export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: [],
      listLoading: true,
      services: [],
      profiles: [],
      status: ['ACTIVE', 'DEL'],
      form: {
        name: '',
        status: '',
        serviceIds: [],
        profileIds: []
      },
      createForm: {
        name: '',
        value: '',
        serviceId: 0,
        profileId: 0
      },
      copyForm: {
        sourceServiceId: null,
        sourceProfileId: null,
        targetServiceId: null,
        targetProfileId: null
      },
      editVisible: false,
      searchVisible: false,
      deleteVisible: false,
      copyVisible: false,
      selectRow: null,
      scope: null
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      var parameters = this.form
      var body = {
        page: {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        },
        parameters: parameters
      }
      this.listLoading = true
      getList(body).then((result) => {
        this.tableData = result.data.list
        this.totalCount = result.data.totalSize
        this.pageSize = result.data.pageSize
        this.currentPage = result.data.currentPage
        this.listLoading = false
        this.searchVisible = false
      }).catch((err) => {
        console.log(err)
      })
      getAllService().then((result) => {
        this.services = result.data
      }).catch((err) => {
        console.log(err)
      })
      getAllProfile().then((result) => {
        this.profiles = result.data
      }).catch((err) => {
        console.log(err)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    copyBefore() {
      this.copyVisible = true
    },
    copy() {
      if (this.copyForm.sourceServiceId === 0 || this.copyForm.targetServiceId === 0) {
        alert('select service')
      }
      if (this.copyForm.sourceServiceId === this.copyForm.targetServiceId) {
        alert('service is same')
      }
      copyConfigure(this.copyForm).then((result) => {
        alert('copy success')
      }).catch((err) => {
        console.log(err)
      })
      this.copyVisible = false
    },
    createNewBefore() {
      this.editVisible = true
      this.createForm = {
        name: '',
        value: '',
        serviceId: 0,
        profileId: 0
      }
      this.scope = 'insert'
    },
    save() {
      var body = this.createForm
      var method = null
      if (this.scope === 'insert') {
        method = create
      }
      if (this.scope === 'edit') {
        method = edit
      }
      method(body).then((result) => {
        this.reload(result)
      }).cache((err) => {
        console.log(err)
      })
    },
    reload(result) {
      this.editVisible = false
      this.getTableData()
    },
    editBefore(row) {
      this.editVisible = true
      this.createForm = row
      this.scope = 'edit'
    },
    removeBefore(row) {
      this.deleteVisible = true
      this.selectRow = row
    },
    remove() {
      this.deleteVisible = false
      var body = this.selectRow
      del(body).then((result) => {
        this.getTableData()
      }).catch((err) => {
        console.log(err)
      })
    },
    searchBefore() {
      this.searchVisible = true
    },
    search() {
      this.currentPage = 1
      this.getTableData()
    }
  }
}
</script>

<style>

</style>
