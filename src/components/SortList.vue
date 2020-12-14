<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>添加分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-input v-model="sortForm.sort_name" width="200px" clearable></el-input>
            <el-button type="primary" @click="addsort">添加分类</el-button>

            <!-- 表格中的数据 -->
            <el-table :data="sortList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="分类名称" prop="sort_name"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" 
                        @click="editSort(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteSort(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </el-card>

        <!-- 编辑分类 -->
        <el-dialog title="编辑分类" :visible.sync="editSortDialog" width="30%">
            <el-form :model="updateSortData">
                 <el-form-item label="分类名称">
                    <el-input v-model="updateSortData.sort_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSortDialog = false">取消</el-button>
                <el-button type="primary" @click="updateSort">更新</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            sortForm:{//分类表单数据
                sort_name:'',
            },
            sortList:[],//分类数据
            editSortDialog:false,
            updateSortData:{}
        }
    },
    created() {
        this.getSTData()//调用获取分类与标签数据函数
    },
    methods: {
        //获取分类与标签数据函数
        async getSTData(){
            const {data:res} = await this.axios.get("blogdatadetail")
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.sortList = res.data.data
        },
        //添加分类
        async addsort(){
            if(this.sortForm.sort_name.trim() === '') return this.$message({message: '请输入数据',type: 'error',duration:1000})
            const {data:res} = await this.axios.post("addsort",this.sortForm)
            this.sortForm.sort_name = ''
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
        },
        //根据id删除分类
        async deleteSort(value){
            const confirmResult = await this.$confirm(
            '此操作将永久删除该数据, 是否继续?','提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
            const {data:res} = await this.axios.delete('deletesort',{params:{id:value.id}})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
        },
        editSort(value){
            this.updateSortData = value
            this.editSortDialog = true
        },
        async updateSort(){
            const {data:res} = await this.axios.put('updatesort',this.updateSortData)
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
            this.editSortDialog = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-card{
    height: 80vh;
    margin-top: 20px;
    overflow-y: auto;
    &::-webkit-scrollbar {width: 6px;}
    &::-webkit-scrollbar-thumb {background-color: #ddd;border-radius: 3px;}
    &::-webkit-scrollbar-track{background-color: #fff;}
    .el-input{width: 200px!important;}
    .el-button{margin-left: 20px;}
    .el-table{margin: 20px 0;text-align: center;}
}
</style>