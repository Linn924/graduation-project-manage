<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>导航列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名" v-model="input" @keyup.enter.native="search"
                        clearable @clear="getNavs">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="postDialog = true">自定义网站</el-button>
                </el-col>
            </el-row>

            <!-- 表格中的数据 -->
            <el-table :data="navList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="简介" prop="introduce"></el-table-column>
                <el-table-column label="网址" prop="url"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" 
                        @click="putNavShow(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteNav(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页区域-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryList.pagenum" :page-sizes="[3, 5, 8]" 
                :page-size="queryList.pagesize"
                layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
        </el-card>

        <!-- 自定义网站对话框 -->
        <el-dialog title="添加网站" :visible.sync="postDialog" width="40%" center>
            <el-form :model="postNavForm" label-width="40px">
                <el-form-item label="名称">
                    <el-input v-model="postNavForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="postNavForm.introduce" clearable></el-input>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model="postNavForm.url" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="postDialog = false">取 消</el-button>
                <el-button type="primary" @click="postNav">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 自定义网站对话框 -->
        <el-dialog title="修改网站" :visible.sync="putDialog" width="40%" center>
            <el-form :model="putNavForm" label-width="40px">
                <el-form-item label="名称">
                    <el-input v-model="putNavForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model="putNavForm.url" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="putDialog = false">取 消</el-button>
                <el-button type="primary" @click="putNav">确 定</el-button>
            </span>
        </el-dialog>

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
            navList:[],
            input:'',
            total:'',
            postDialog:false,//添加自定义网站对话框
            postNavForm:{
                name:'',
                introduce:'',
                url:''
            },
            putDialog:false,//修改自定义网站对话框
            putNavForm:{
                id:Number,
                introduce:'',
                name:'',
                url:''
            },
            obj:{}
        }
    },
    created(){
        this.getNavs()
    },
    methods:{
        //获取所有的评论
        async getNavs(){
            const {data:res} = await this.axios.get("navs",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.navList = res.data
            this.total = res.total
            this.queryList.key = ''
        },
        handleSizeChange(newSize) {
            this.queryList.pagesize = newSize
            this.getNavs()
        },
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getNavs()
        },
        search(){
            this.queryList.key = this.input
            this.getNavs()
            this.saveOperateLog(`您搜索了${this.input}网站`)
        },
        //操作日志
        saveOperateLog(content){
            let str = window.sessionStorage.getItem('operationlogArr')
            let operationlogArr = str == null ? [] : JSON.parse(str)
            let operationlogForm = {
                title:`${content}`,
                time:new Date()
            }
            operationlogArr.push(operationlogForm)
            window.sessionStorage.setItem('operationlogArr',JSON.stringify(operationlogArr))
        },
        async postNav(){
            if(this.postNavForm.name.trim() && this.postNavForm.url.trim() && this.postNavForm.introduce.trim()){
                const {data:res} = await this.axios.post('navs',this.postNavForm)
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
                this.$message({message: `${res.tips}`,type: 'success',duration:1000})
                this.postDialog = false
                this.postNavForm = {
                    name:'',
                    introduce:'',
                    url:''
                }
                this.getNavs()
            }else return this.$message({message: '请输入内容',type: 'error',duration:1000})
        },
        putNavShow(data){
            this.putDialog = true
            this.putNavForm = {
                id:data.id,
                introduce:data.introduce,
                name:data.name,
                url:data.url
            }
            this.obj = Object.assign({},this.putNavForm)
        },
        async putNav(){
            if(JSON.stringify(this.obj) != JSON.stringify(this.putNavForm)){
                const {data:res} = await this.axios.put('navs',this.putNavForm)
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
                this.$message({message: `${res.tips}`,type: 'success',duration:1000})
                this.putDialog = false
                this.putNavForm = {
                    id:Number,
                    introduce:'',
                    name:'',
                    url:''
                }
                this.getNavs()
            }else return this.$message({message: '未作出修改',type: 'error',duration:1000})
        },
        async deleteNav(data){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该数据, 是否继续?','提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
            const {data:res} = await this.axios.delete('navs',{params:{id:data.id}}) 
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getNavs()
        }
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