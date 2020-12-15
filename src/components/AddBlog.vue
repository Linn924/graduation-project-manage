<template>
    <div class="release">

        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布博客</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡牌视图区域 -->
        <el-card>
            <el-button type="primary" @click="clickToBtn" v-show="showTo">下一步</el-button>
            <el-button type="primary" @click="clickBackBtn" v-show="showBack">上一步</el-button>
            <el-button type="primary" @click="addBlog" v-show="showBack">上传</el-button>
            <el-row :gutter="2" v-show="showTo">
                <el-col :span="12">
                    <el-input type="textarea" style="height:720px;" v-model="blogForm.content">
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <div v-html="html" v-highlight class="markdown-body md" 
                    style="height:720px;" v-show="showMd">
                    </div>
                </el-col>
            </el-row>
            <el-form :model="blogForm" ref="blogFormRef" v-show="showBack" label-width="60px"> 
                <el-form-item label="标题">
                    <el-input v-model="blogForm.title" clearable></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" v-model="blogForm.introduce"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker v-model="blogForm.date" type="datetime" placeholder="选择日期" 
                    style="width:100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="blogForm.sortname" filterable allow-create 
                    placeholder="请选择分类" style="width:100%;">
                        <el-option v-for="item in sortList" :key="item.id" 
                        :label="item.sort_name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item label="文件名">
                    <el-input v-model="blogForm.mdname" clearable></el-input>
                </el-form-item>
                <el-form-item label="技术">
                    <el-select v-model="blogForm.technologyname" filterable allow-create 
                    placeholder="请选择技术" style="width:100%;">
                        <el-option v-for="item in technologyList" :key="item.id" 
                        :label="item.technology_name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script>
import showdown from 'showdown'
export default {
    data(){
        return {
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
                sortname:'',
                mdname:'',
                technologyname:'',
                content:''
            },
        }
    },
    created() {
        this.getSTData()//调用获取分类与标签数据函数
    },
    watch:{
        'blogForm.content'(value){
            if(value == '') return this.showMd = false
            this.showMd = true
            let converter = new showdown.Converter()
            this.html = converter.makeHtml(value)
        }
    },
    methods: {
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
        //获取分类与标签数据
        async getSTData(){
            const {data:res} = await this.axios.get("sortsAndlabels")
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.sortList = res.data.data
            this.technologyList = res.data.data2
        },
        clickToBtn(){
            if(this.blogForm.content == '') return this.$message({message: '请填写内容',type: 'error',duration:1000})
            this.showTo = false
            this.showBack = true
        },
        clickBackBtn(){
            this.showTo = true
            this.showBack = false
        },
        async addBlog(){
            if(!this.blogForm.mdname.split('.').includes('md')){this.blogForm.mdname += '.md'}
            this.blogForm.date = this.date(this.blogForm.date)
            const {data:res} = await this.axios.post('blogs',this.blogForm)
            if(res.code != 200) this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.$message({message: `${res.tips}`,type: 'success',duration:1000})
            this.blogForm = {
                title:'',introduce:'',date:'',sortname:'',
                mdname:'',technologyname:'',content:''
            }
            this.showTo = true
            this.showBack = false
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/css/md.css";
.release{height: 100%;}
.el-card{
    height: 95%;
    margin-top: 20px;
    .el-row{
        height: 100%;
        margin-top: 20px;
        .el-col{
            height: 100%!important;
            .md{
                border-radius: 4px;
                padding: 0 5px;
                border: 1px solid #1E90FF;
                overflow-y: scroll;
            }
        }
    }
    .el-form{margin-top: 20px;width: 25vw;}
}
.md::-webkit-scrollbar{width: 4px;}
.md::-webkit-scrollbar-thumb{background-color: #5a76cd;}
</style>