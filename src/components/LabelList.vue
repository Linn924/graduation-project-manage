<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>标签列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-input v-model="technologyForm.technology_name" width="200px" clearable></el-input>
            <el-button type="primary" @click="addtechnology">添加标签</el-button>

            <el-table :data="technologyList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="分类名称" prop="technology_name"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" 
                        @click="editTechnology(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteTechnology(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!-- 编辑分类 -->
        <el-dialog title="编辑标签" :visible.sync="editTDialog" width="30%">
            <el-form :model="updateTData">
                 <el-form-item label="分类名称">
                    <el-input v-model="updateTData.technology_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editTDialog = false">取消</el-button>
                <el-button type="primary" @click="updateT">更新</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            technologyForm:{//标签表单
                technology_name:'',
            },
            technologyList:[],//标签数据
            updateTData:{},
            editTDialog:false
        }
    },
    created() {
        this.getSTData()//调用获取分类与标签数据函数
    },
    methods: {
        //获取分类与标签数据函数
        async getSTData(){
            const {data:res} = await this.axios.get("sortsAndlabels")
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.technologyList = res.data.data2
        },
        //添加标签
        async addtechnology(){
            if(this.technologyForm.technology_name.trim() === '') return this.$message({message: '请输入数据',type: 'error',duration:1000})
            const {data:res} = await this.axios.post("labels",this.technologyForm)
            this.technologyForm.technology_name = ''
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
        },
        //根据id删除标签
        async deleteTechnology(value){
            const confirmResult = await this.$confirm(
            '此操作将永久删除该数据, 是否继续?','提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
            const {data:res} = await this.axios.delete('labels',{params:{id:value.id}})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
        },
        editTechnology(value){
            this.updateTData = value
            this.editTDialog = true
        },
        async updateT(){
            const {data:res} = await this.axios.put('labels',this.updateTData)
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getSTData()
            this.editTDialog = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-card{
    height: 85vh;
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