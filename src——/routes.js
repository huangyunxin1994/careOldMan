import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Newenrll from '@/views/new-enroll/index.vue'
import Editenrll from '@/views/edit-enroll/index.vue'
import Enrollmanage from '@/views/enroll-manage/index.vue'
import Enrollcheck from '@/views/enroll-manage/enroll-check/index.vue'
import Enrolldetails from '@/views/enroll-details/index.vue'
import UserLogin from './views/userLogin.vue'
import UserAdmin from '@/views/enroll-admin/index.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
	{
		path: '/userLogin',
		component: UserLogin,
		name: '',
		hidden: true
	},
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        redirect:'/main',
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/newenroll', component: Newenrll, name: '新建报名'},
            { path: '/editenroll', component: Editenrll, name: '修改报名'},
            { path: '/enrollmanage', component: Enrollmanage, name: '报名管理与审核'},
            { path: '/enrollcheck', component: Enrollcheck, name: '报名审核'},
            { path: '/enrolldetails', component: Enrolldetails, name: '报名详情'},
			{ path: '/userAdmin',component:UserAdmin,name:'用户管理',hidden:true},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;