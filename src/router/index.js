import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import ('../view/home/home')
const Equipment = () => import('../view/equipment/equipment')
const Login = () => import('../view/login/login')

Vue.use(Router)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/index',
    component:Home
  },
  {
    path:'/equipment',
    component:Equipment
  },
  {
    path:'/login',
    component:Login
  }
]

export default new Router({
  routes:routes
})
