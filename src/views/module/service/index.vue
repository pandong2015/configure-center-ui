<template>
  <div class="app-container">
    <el-row class="tac">
      <el-row type="flex" class="tac" justify="end">
        <el-button type="primary" @click="searchBefore()">查询</el-button>
        <el-button type="primary" @click="createNewBefore()">新建</el-button>
      </el-row>
      <el-row class="tac">
        <el-dialog
          :visible.sync="deleteVisible"
          title="提示"
          width="30%">
          <span>{{ $t("message.delete") }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">{{ $t("message.no") }}</el-button>
            <el-button type="primary" @click="remove()">{{ $t("message.yes") }}</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="editVisible" title="编辑">
          <el-form ref="form" :model="createForm" label-width="80px">
            <el-form-item label="Name">
              <el-input v-model="createForm.name"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save(user.id)">提交</el-button>
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
            <el-form-item>
              <el-button type="primary" @click="search">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-col>
          <el-table v-loading="listLoading" ref="multipleTable" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"/>
            <el-table-column prop="name" label="Name"/>
            <el-table-column prop="userName" label="User Name"/>
            <el-table-column prop="status" label="Status"/>
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
import { getList, createService, editService, del } from '@/api/service'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: [],
      listLoading: true,
      status: ['ACTIVE', 'DELETEs'],
      form: {
        name: null,
        status: null
      },
      createForm: {
        name: null,
        userId: null
      },
      editVisible: false,
      searchVisible: false,
      deleteVisible: false,
      selectRow: null,
      scope: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
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
    createNewBefore() {
      this.editVisible = true
      this.createForm = {
        name: null
      }
      this.scope = 'insert'
    },
    save(id) {
      this.createForm.userId = id
      var body = this.createForm
      var method = null
      if (this.scope === 'insert') {
        method = createService
      }
      if (this.scope === 'edit') {
        method = editService
      }
      method(body).then((result) => {
        this.reload(result)
      }).catch((err) => {
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
      del(body.id).then((result) => {
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
