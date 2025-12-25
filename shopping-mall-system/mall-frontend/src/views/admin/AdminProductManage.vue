<template>
  <div class="admin-product-manage">
    <el-card shadow="hover" class="manage-card">
      <div class="manage-header">
        <h2>商品管理</h2>
        <el-button type="primary" size="large" @click="openAddDialog">
          <i class="el-icon-plus"></i>添加商品
        </el-button>
      </div>
      
      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入商品名称搜索"
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-select
              v-model="selectedCategory"
              placeholder="请选择商品分类"
              filterable
              clearable>
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 商品列表 -->
      <div class="product-list">
        <el-table :data="filteredProducts" stripe border style="width: 100%">
          <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
          <el-table-column label="商品图片" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.image" :alt="scope.row.name" class="product-image">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="categoryName" label="分类" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template slot-scope="scope">¥{{ scope.row.price }}</template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 'ON_SALE' ? 'success' : 'danger'">
                {{ scope.row.status === 'ON_SALE' ? '在售' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="openEditDialog(scope.row)">
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button type="success" size="small" @click="toggleStatus(scope.row)" :icon="scope.row.status === 'ON_SALE' ? 'el-icon-close' : 'el-icon-check'">
                {{ scope.row.status === 'ON_SALE' ? '下架' : '上架' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteProduct(scope.row.id)">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProducts">
        </el-pagination>
      </div>
      
      <!-- 添加商品对话框 -->
      <el-dialog
        title="添加商品"
        :visible.sync="addDialogVisible"
        width="60%"
        center>
        <div class="product-form">
          <el-form :model="productForm" :rules="rules" ref="productForm" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品分类" prop="categoryId">
                  <el-select v-model="productForm.categoryId" placeholder="请选择商品分类">
                    <el-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品价格" prop="price">
                  <el-input-number v-model="productForm.price" :min="0" :step="0.01" :precision="2" placeholder="请输入商品价格"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品库存" prop="stock">
                  <el-input-number v-model="productForm.stock" :min="0" :step="1" placeholder="请输入商品库存"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="商品描述" prop="description">
              <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请输入商品描述"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="image">
              <el-upload
                class="avatar-uploader"
                :action="'https://jsonplaceholder.typicode.com/posts/'"
                :show-file-list="false"
                :on-success="handleImageUploadSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="productForm.image" :src="productForm.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProductForm('add')">确定</el-button>
        </span>
      </el-dialog>
      
      <!-- 编辑商品对话框 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="editDialogVisible"
        width="60%"
        center>
        <div class="product-form">
          <el-form :model="productForm" :rules="rules" ref="productForm" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品分类" prop="categoryId">
                  <el-select v-model="productForm.categoryId" placeholder="请选择商品分类">
                    <el-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品价格" prop="price">
                  <el-input-number v-model="productForm.price" :min="0" :step="0.01" :precision="2" placeholder="请输入商品价格"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品库存" prop="stock">
                  <el-input-number v-model="productForm.stock" :min="0" :step="1" placeholder="请输入商品库存"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="商品描述" prop="description">
              <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请输入商品描述"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="image">
              <el-upload
                class="avatar-uploader"
                :action="'https://jsonplaceholder.typicode.com/posts/'"
                :show-file-list="false"
                :on-success="handleImageUploadSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="productForm.image" :src="productForm.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProductForm('edit')">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AdminProductManage',
  data() {
    return {
      // 商品列表
      products: [
        {
          id: 1,
          name: '智能手机',
          categoryId: 1,
          categoryName: '手机数码',
          price: 2999,
          stock: 100,
          status: 'ON_SALE',
          image: 'https://via.placeholder.com/80x80?text=Product1',
          description: '高性能智能手机，配备6.5英寸全面屏，128GB存储容量',
          createTime: '2023-06-01 10:00:00'
        },
        {
          id: 2,
          name: '笔记本电脑',
          categoryId: 1,
          categoryName: '电脑办公',
          price: 5999,
          stock: 50,
          status: 'ON_SALE',
          image: 'https://via.placeholder.com/80x80?text=Product2',
          description: '轻薄本，16GB内存，512GB SSD，适合日常办公和学习',
          createTime: '2023-06-02 14:30:00'
        },
        {
          id: 3,
          name: '无线耳机',
          categoryId: 1,
          categoryName: '手机数码',
          price: 1299,
          stock: 200,
          status: 'ON_SALE',
          image: 'https://via.placeholder.com/80x80?text=Product3',
          description: '真无线降噪耳机，续航可达30小时',
          createTime: '2023-06-03 09:15:00'
        }
      ],
      // 分类列表
      categories: [
        { id: 1, name: '手机数码' },
        { id: 2, name: '电脑办公' },
        { id: 3, name: '家用电器' },
        { id: 4, name: '服装鞋包' },
        { id: 5, name: '食品生鲜' }
      ],
      // 搜索和筛选条件
      searchKeyword: '',
      selectedCategory: '',
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      totalProducts: 3,
      // 对话框
      addDialogVisible: false,
      editDialogVisible: false,
      // 商品表单
      productForm: {
        id: '',
        name: '',
        categoryId: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        status: 'ON_SALE'
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 筛选后的商品列表
    filteredProducts() {
      let result = this.products
      
      // 按名称搜索
      if (this.searchKeyword) {
        result = result.filter(product => 
          product.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      }
      
      // 按分类筛选
      if (this.selectedCategory) {
        result = result.filter(product => 
          product.categoryId === this.selectedCategory
        )
      }
      
      return result
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.currentPage = 1
    },
    // 重置筛选条件
    resetFilter() {
      this.searchKeyword = ''
      this.selectedCategory = ''
      this.currentPage = 1
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
    },
    // 当前页变化
    handleCurrentChange(current) {
      this.currentPage = current
    },
    // 打开添加对话框
    openAddDialog() {
      this.productForm = {
        id: '',
        name: '',
        categoryId: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        status: 'ON_SALE'
      }
      this.addDialogVisible = true
    },
    // 打开编辑对话框
    openEditDialog(product) {
      this.productForm = JSON.parse(JSON.stringify(product))
      this.editDialogVisible = true
    },
    // 提交商品表单
    submitProductForm(type) {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          if (type === 'add') {
            // 添加商品
            const newProduct = JSON.parse(JSON.stringify(this.productForm))
            newProduct.id = Date.now()
            newProduct.categoryName = this.categories.find(c => c.id === newProduct.categoryId).name
            newProduct.createTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
            this.products.unshift(newProduct)
            this.totalProducts++
            this.$message.success('商品添加成功')
            this.addDialogVisible = false
          } else {
            // 编辑商品
            const index = this.products.findIndex(p => p.id === this.productForm.id)
            if (index !== -1) {
              this.products[index] = JSON.parse(JSON.stringify(this.productForm))
              this.products[index].categoryName = this.categories.find(c => c.id === this.productForm.categoryId).name
              this.$message.success('商品编辑成功')
              this.editDialogVisible = false
            }
          }
        } else {
          return false
        }
      })
    },
    // 切换商品状态
    toggleStatus(product) {
      const newStatus = product.status === 'ON_SALE' ? 'OFF_SALE' : 'ON_SALE'
      this.$confirm(`确定要${newStatus === 'ON_SALE' ? '上架' : '下架'}该商品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        product.status = newStatus
        this.$message.success(`商品已${newStatus === 'ON_SALE' ? '上架' : '下架'}`)
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 删除商品
    deleteProduct(productId) {
      this.$confirm('确定要删除该商品吗？删除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        const index = this.products.findIndex(p => p.id === productId)
        if (index !== -1) {
          this.products.splice(index, 1)
          this.totalProducts--
          this.$message.success('商品删除成功')
        }
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 图片上传前校验
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 图片上传成功处理
    handleImageUploadSuccess(response, file, fileList) {
      // 模拟图片上传成功
      this.productForm.image = URL.createObjectURL(file.raw)
    }
  },
  mounted() {
    // 实际应用中需要从API获取商品数据
    // this.getProducts()
  }
}
</script>

<style scoped>
.admin-product-manage {
  max-width: 1400px;
  margin: 0 auto;
}

.manage-card {
  padding: 20px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.filter-section {
  margin-bottom: 20px;
}

.product-list {
  margin-bottom: 20px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.product-form {
  max-height: 500px;
  overflow-y: auto;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>