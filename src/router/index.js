const Home = () => import( /* webpackChunkName: "home" */ '../components/Home.vue')
const Welecome = () => import( /* webpackChunkName: "welecome" */ '../components/Welecome.vue')
const BlogList = () => import( /* webpackChunkName: "bloglist" */ '../components/BlogList.vue')
const SortList = () => import( /* webpackChunkName: "sortlist" */ '../components/SortList.vue')
const LabelList = () => import( /* webpackChunkName: "labellist" */ '../components/LabelList.vue')
const CommentList = () => import( /* webpackChunkName: "commentlist" */ '../components/CommentList.vue')
const UserList = () => import( /* webpackChunkName: "userlist" */ '../components/UserList.vue')
const HomeList = () => import( /* webpackChunkName: "homelist" */ '../components/HomeList.vue')
const NavList = () => import( /* webpackChunkName: "navlist" */ '../components/NavList.vue')
const AddBlog = () => import( /* webpackChunkName: "addblog" */ '../components/AddBlog.vue')
const Log = () => import( /* webpackChunkName: "log" */ '../components/Log.vue')
const NotFound = () => import(/* webpackChunkName: "notfound" */'../components/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path: '/', redirect: '/home' },
  {
    path: '/home', component: Home, redirect: '/welecome',
    children: [
      {path : '/welecome',component: Welecome},
      {path : '/blogList',component:BlogList},
      {path : '/sortlist',component:SortList},
      {path : '/labellist',component:LabelList},
      {path : '/commentlist',component:CommentList},
      {path : '/userlist',component:UserList},
      {path : '/homelist',component:HomeList},
      {path : '/navlist',component:NavList},
      {path : '/log',component:Log},
      {path : '/addblog',component:AddBlog}
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router