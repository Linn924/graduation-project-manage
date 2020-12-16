<template>
    <div class="log">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>日志记录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-timeline :reverse="true">
                <el-timeline-item v-for="(item,index) in operationlogArr" :key="index" :timestamp="item.time" placement="top">
                    <el-card>
                        <h4>{{item.title}}</h4>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            operationlogArr:[]
        }
    },
    created(){
        this.getOperateLog()
    },
    methods:{
        //处理时间格式
        dealDate(time){
            const t = new Date(time)
            const y = t.getFullYear()
            const m = (t.getMonth() + 1 + '').padStart(2, '0')
            const d = (t.getDate() + '').padStart(2, '0')
            const hh = (t.getHours() + '').padStart(2, '0')
            const mm = (t.getMinutes() + '').padStart(2, '0')
            const ss = (t.getSeconds() + '').padStart(2, '0')
            return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
        },
        //获取操作日志
        getOperateLog(){
            let str = sessionStorage.getItem('operationlogArr')
            if(str){
                this.operationlogArr = JSON.parse(str)
                this.operationlogArr.forEach(item => item.time = this.dealDate(item.time))
            } 
        }
    }
}
</script>

<style lang="less" scoped>
.log>.el-card{
    height: 85vh;
    margin-top: 20px;
    overflow-y: auto;
    &::-webkit-scrollbar {width: 6px;}
    &::-webkit-scrollbar-thumb {background-color: #ddd;border-radius: 3px;}
    &::-webkit-scrollbar-track{background-color: #fff;}
}
</style>