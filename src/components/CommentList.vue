<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入用户名" v-model="input" @keyup.enter.native="search"
                        clearable @clear="getComments">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格中的数据 -->
            <el-table :data="commentList" border stripe>
                 <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="5" v-for="(item,index) in scope.row.children" :key="index">
                                <el-tag>{{item.username}}：{{item.reply_content}}</el-tag>
                            </el-col>
                        </el-row>     
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="被评论博客" prop="title"></el-table-column>
                <el-table-column label="评论的用户" prop="username"></el-table-column>
                <el-table-column label="评论内容" prop="content"></el-table-column>
                <el-table-column label="评论时间" prop="date"></el-table-column>
                <el-table-column label="评论点赞数" prop="agree_count"></el-table-column>
                <el-table-column label="点赞评论用户" prop="agree_user_id"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <!-- 删除按钮 -->
                        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteComment(scope.row)"></el-button>
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
        return{
            queryList:{//分页数据
                key:'',
                pagenum:1,
                pagesize:8
            },
            commentList:[],
            input:'',
            total:''
        }
    },
    created() {
        this.getComments()
    },
    methods: {
        //处理时间
        dealDate(time){
            const t = new Date(time)
            const y = t.getFullYear()
            const m = (t.getMonth() + 1 + '').padStart(2, '0')
            const d = (t.getDate() + '').padStart(2, '0')
            const hh = (t.getHours() + '').padStart(2, '0')
            const mm = (t.getMinutes() + '').padStart(2, '0')
            const ss = (t.getSeconds() + '').padStart(2, '0')
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        },
        //获取所有的评论
        async getComments(){
            const {data:res} = await this.axios.get("comments",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.commentList = res.data
            this.commentList.forEach(item => {item.date = this.dealDate(item.date)})
            this.total = res.total
            this.queryList.key = ''
            this.dealReplyComment(res.data2)
        },
        dealReplyComment(data){
            this.commentList.forEach((item,index) => {
                let arr = []
                data.forEach(i => {
                    if(i.blog_id == item.blog_id && i.respondent_id == item.user_id){
                        arr.push(i)
                    }
                })
                item.children = arr
            })
        },
        search(){
            this.queryList.key = this.input
            this.getComments()
            this.saveOperateLog(`您搜索了有关${this.input}的所有评论`)
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
        handleSizeChange(newSize) {
            this.queryList.pagesize = newSize
            this.getComments()
        },
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getComments()
        },
        async deleteComment(data){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该数据, 是否继续?','提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
                const {data:res} = await this.axios.delete('comments',{
                    params:{
                        id:data.id,
                        blog_id:data.blog_id,
                        user_id:data.user_id
                    }
            }) 
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getComments()
        }
    }
}
</script>

<style lang="less" scoped>
.el-card{
    height: 80vh;
    margin-top: 20px;
    .el-table{
        margin: 20px 0;text-align: center;
        .el-row:nth-child(2n+1){margin: 20px 0;}
        .el-tag{cursor: pointer;}
    }
}
</style>