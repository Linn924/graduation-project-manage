<template>
    <section>

        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>博客列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡牌视图区域 -->
        <el-card>

            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="input" @keyup.enter.native="search"
                        clearable @clear="getBlogData">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格中的数据 -->
            <el-table :data="blogList" border stripe>
                <!-- 索引列 固定格式 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="简介" prop="introduce"></el-table-column>
                <el-table-column label="日期" prop="date"></el-table-column>
                <el-table-column label="分类" prop="sort_name"></el-table-column>
                <el-table-column label="文件" prop="mdname"></el-table-column>
                <el-table-column label="标签" prop="technology_name"></el-table-column>
                <el-table-column label="浏览量" prop="pageviews"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" 
                        @click="editBlog(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="deleteBlog(scope.row)"></el-button>
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
        
        <!-- 编辑博客对话框 -->
        <el-dialog title="编辑博客" :visible.sync="editBlogDialog" width="50%">
            <el-button type="primary" @click="clickToBtn" v-show="showTo">下一步</el-button>
            <el-button type="primary" @click="clickBackBtn" v-show="showBack">上一步</el-button>
            <el-button type="primary" @click="updateBlog" v-show="showBack">更新</el-button>
            <el-row :gutter="2" v-show="showTo">
                <el-col :span="12">
                    <el-input type="textarea" v-model="blogForm.content" class="textarea">
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <div v-html="html" v-highlight class="markdown-body md" v-show="showMd">
                    </div>
                </el-col>
            </el-row>
            <div v-show="showBack">
                <el-form :model="blogForm" label-width="80px">
                    <el-form-item label="标题">
                        <el-input v-model="blogForm.title" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="简介">
                        <el-input type="textarea" v-model="blogForm.introduce"></el-input>
                    </el-form-item>
                    <el-form-item label="时间">
                        <el-date-picker v-model="blogForm.date" type="datetime" 
                        placeholder="选择日期时间" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="blogForm.sort_name" filterable allow-create placeholder="请选择分类">
                            <el-option v-for="item in sortList" :key="item.id" 
                            :label="item.sort_name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="文件名">
                        <el-input v-model="blogForm.mdname" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="技术">
                        <el-select v-model="blogForm.technology_name" filterable 
                            allow-create placeholder="请选择技术">
                            <el-option v-for="item in technologyList" :key="item.id" 
                            :label="item.technology_name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

    </section>
</template>

<script>
import showdown from 'showdown'
export default {
    data(){
        return {
            input:'',//搜索框的输入值
            blogList:[],//博客数据
            queryList:{//分页数据
                key:'',
                pagenum:1,
                pagesize:8
            },
            total:0,//博客总数
            html:'',
            showMd:false,
            showTo:true,
            showBack:false,
            sortList:[],//分类数据
            technologyList:[],//标签数据
            blogForm:{//添加博客表单数据
                title:'',
                introduce:'',
                date:'',
                sort_name:'',
                mdname:'',
                technology_name:'',
                content:''
            },
            editBlogDialog:false,//控制编辑博客对话框的显示与隐藏
            oldSname:'',
            oldTname:''
        }
    },
    created() {
        this.getBlogData()
    },
    watch: {
        'blogForm.content'(value){
            if(value == '') return this.showMd = false
            this.showMd = true
            let converter = new showdown.Converter()
            this.html = converter.makeHtml(value)
        }
    },
    methods: {
        //处理时间
        date(time){
            const t = new Date(time)
            const y = t.getFullYear()
            const m = (t.getMonth() + 1 + '').padStart(2, '0')
            const d = (t.getDate() + '').padStart(2, '0')
            const hh = (t.getHours() + '').padStart(2, '0')
            const mm = (t.getMinutes() + '').padStart(2, '0')
            const ss = (t.getSeconds() + '').padStart(2, '0')
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        },
        //获取博客数据
        async getBlogData(){
            const {data:res} = await this.axios.get("blogs",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.blogList = res.data
            this.blogList.forEach(item => {item.date = this.date(item.date)})
            this.total = res.total
            this.queryList.key = ''
        },
        //获取分类与标签数据
        async getSTData(){
            const {data:res} = await this.axios.get("sortsAndlabels")
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.sortList = res.data.data
            this.technologyList = res.data.data2
        },
        //根据id删除对应blog
        async deleteBlog(value){
            const confirmResult = await this.$confirm(
            '此操作将永久删除该数据, 是否继续?','提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') return this.$message({message: '已取消删除',type: 'info',duration:1000})
            const {data:res} = await this.axios.delete('blogs',{params:{id:value.id}})
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getBlogData()
        },
        //编辑博客
        editBlog(value){
            this.blogForm = value
            this.editBlogDialog = true
            this.oldSname = this.blogForm.sort_name
            this.oldTname = this.blogForm.technology_name
        },
        clickToBtn(){
            this.showTo = false
            this.showBack = true
            this.getSTData()
        },
        clickBackBtn(){
            this.showTo = true
            this.showBack = false
        },
        async updateBlog(){
            this.dealBlogForm()
            const {data:res} = await this.axios.put('blogs',this.blogForm)
            if( res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.getBlogData()
            this.showTo = true
            this.showBack = false
            this.editBlogDialog = false
        },
        //处理传入后端的值
        dealBlogForm(){
            if(this.blogForm.sort_name == this.oldSname) 
            this.blogForm.sort_name = this.blogForm.sortId
            if(this.blogForm.technology_name == this.oldTname)
            this.blogForm.technology_name = this.blogForm.technologyId
            if(!this.blogForm.mdname.split('.').includes('md')){this.blogForm.mdname += '.md'}
            this.blogForm.date = this.date(this.blogForm.date)
        },
        //监听每页展示blog数量的变化
        handleSizeChange(newSize) {
            this.queryList.pagesize = newSize
            this.getBlogData()
        },
        //监听去往第几页的变化
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getBlogData()
        },
        search(){
            this.queryList.key = this.input 
            this.getBlogData()
            this.saveOperateLog(`您搜索了${this.input}这篇博客`)
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
    }
}
</script>

<style lang="less" scoped>
@import "../assets/css/md.css";
.el-card{
   margin-top: 20px;
   border: none;
   .el-table{
       margin: 20px 0;
       text-align: center;
   }
}
.el-dialog .el-row{
   .textarea{
       height: 500px;
       margin-top: 20px;
   }
   .md{
       height: 500px;
       border-radius: 4px;
       padding: 0 5px;
       margin-top: 20px;
       border: 1px solid #DCDFE6;
       overflow-y: scroll;
       overflow-x: hidden;
   }
}
.el-form{
    margin-top: 20px;
}
/*壁纸盒子滚动条样式*/
.md::-webkit-scrollbar{
  width: 4px;
}
.md::-webkit-scrollbar-thumb{
  background-color: #5a76cd;
}
</style>