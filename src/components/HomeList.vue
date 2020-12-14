<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>首页列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名" v-model="input" @keyup.enter.native="search"
                        clearable @clear="getWebsites">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="postDialog = true">自定义网站</el-button>
                </el-col>
            </el-row>

            <!-- 表格中的数据 -->
            <el-table :data="websiteList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="网站名称" prop="title"></el-table-column>
                <el-table-column label="网站图标" prop="className"></el-table-column>
                <el-table-column label="网站地址" prop="url"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" 
                        @click="putWebsiteShow(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteWebsite(scope.row)"></el-button>
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
            <el-form :model="postWebsiteForm" label-width="40px">
                <el-form-item label="名称">
                    <el-input v-model="postWebsiteForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model="postWebsiteForm.url" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="postDialog = false">取 消</el-button>
                <el-button type="primary" @click="postWebsite">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 自定义网站对话框 -->
        <el-dialog title="修改网站" :visible.sync="putDialog" width="40%" center>
            <el-form :model="putWebsiteForm" label-width="40px">
                <el-form-item label="名称">
                    <el-input v-model="putWebsiteForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model="putWebsiteForm.url" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="putDialog = false">取 消</el-button>
                <el-button type="primary" @click="putWebsite">确 定</el-button>
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
            websiteList:[],
            input:'',
            total:'',
            postDialog:false,//添加自定义网站对话框
            postWebsiteForm:{
                name:'',
                url:''
            },
            putDialog:false,//修改自定义网站对话框
            putWebsiteForm:{
                id:Number,
                className:'',
                name:'',
                url:''
            },
            obj:{}
        }
    },
    created(){
        this.getWebsites()
    },
    methods:{
        //获取所有的评论
        async getWebsites(){
            const {data:res} = await this.axios.get("websites",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.websiteList = res.data
            this.total = res.total
            this.queryList.key = ''
        },
        handleSizeChange(newSize) {
            this.queryList.pagesize = newSize
            this.getWebsites()
        },
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getWebsites()
        },
        search(){
            this.queryList.key = this.input
            this.getWebsites()
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
        async postWebsite(){
            if(this.postWebsiteForm.name.trim() && this.postWebsiteForm.url.trim()){
                const {data:res} = await this.axios.post('websites',this.postWebsiteForm)
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
                this.$message({message: `${res.tips}`,type: 'success',duration:1000})
                this.postDialog = false
                this.postWebsiteForm = {
                    name:'',
                    url:''
                }
                this.getWebsites()
            }
        },
        putWebsiteShow(data){
            this.putDialog = true
            this.putWebsiteForm = {
                id:data.id,
                className:data.className,
                name:data.title,
                url:data.url
            }
            this.obj = Object.assign({},this.putWebsiteForm)
        },
        async putWebsite(){
            if(JSON.stringify(this.obj) != JSON.stringify(this.putWebsiteForm)){
                const {data:res} = await this.axios.put('websites',this.putWebsiteForm)
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
                this.$message({message: `${res.tips}`,type: 'success',duration:1000})
                this.putDialog = false
                this.putWebsiteForm = {
                    id:Number,
                    className:'',
                    name:'',
                    url:''
                }
                this.getWebsites()
            }else return this.$message({message: '未作出修改',type: 'error',duration:1000})
        },
        async deleteWebsite(data){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该数据, 是否继续?','提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
            const {data:res} = await this.axios.delete('websites',{params:{id:data.id}}) 
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getWebsites()
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