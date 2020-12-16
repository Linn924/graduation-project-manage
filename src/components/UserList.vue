<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名" v-model="input" @keyup.enter.native="search"
                        clearable @clear="getUsers">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格中的数据 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="得赞数" prop="praised"></el-table-column>
                <el-table-column label="冻结" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="putUsers(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页区域-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryList.pagenum" :page-sizes="[3, 5, 8]" 
                :page-size="queryList.pagesize"
                layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
            <!-- 分页区域 end-->
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryList:{//分页数据
                key:'',
                pagenum:1,
                pagesize:8
            },
            userList:[],
            input:'',
            total:''
        }
    },
    created(){
        this.getUsers()
    },
    methods:{
        //获取所有的评论
        async getUsers(){
            const {data:res} = await this.axios.get("usersByAdmin",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.userList = res.data
            this.userList.forEach(item => {
                if(item.status === 'true') item.status = true
                else item.status = false
            })
            this.total = res.total
            this.queryList.key = ''
        },
        handleSizeChange(newSize) {
            this.queryList.pagesize = newSize
            this.getUsers()
        },
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getUsers()
        },
        async putUsers(data){
            const {data:res} = await this.axios.put('usersByAdmin',data)
            if(res.code != 200) {
                data.status = !data.status
                return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            }
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getUsers()
        },
        search(){
            this.queryList.key = this.input
            this.getUsers()
            this.saveOperateLog(`您搜索了${this.input}用户`)
        },
        //操作日志
        saveOperateLog(content){
            console.log(content)
            let str = window.sessionStorage.getItem('operationlogArr')
            let operationlogArr = str == null ? [] : JSON.parse(str)
            let operationlogForm = {
                title:`${content}`,
                time:new Date()
            }
            operationlogArr.push(operationlogForm)
            window.sessionStorage.setItem('operationlogArr',JSON.stringify(operationlogArr))
        },
    }
}
</script>

<style lang="less" scoped>
.el-card{
    height: 80vh;
    margin-top: 20px;
    .el-table{
        margin: 20px 0;
        text-align: center;
    }
}
</style>