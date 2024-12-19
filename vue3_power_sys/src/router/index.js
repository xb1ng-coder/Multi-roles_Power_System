// import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import {createRouter,createWebHashHistory,createWebHistory  } from "vue-router";
import { getNavData } from "../api/index";
import { useMainStore } from "../store/useMainStore/index";



const routes = [
    {
        path: "/",
        redirect:'/login'
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login/index.vue")
    },
    {
        path: "/home",
        name: "home",
        component: () => import("../views/home/index.vue"),
        // 此处为与后端交互的动态路由
        // children:[
        //     {
        //         path: "/home",
        //         redirect:'/index'
        //     },
        //     {
        //         path:"/index",
        //         name:"index",
        //         component:() => import("../views/home/content/index/index.vue")
        //     },
        //     {
        //         path:'/user-management',
        //         name:"user-management",
        //         component:() => import('../views/home/content/user-management/index.vue')
        //     },
        //     {
        //         path:'/settings',
        //         name:"settings",
        //         component:() => import('../views/home/content/settings/index.vue')
        //     }
        // ]
    }
]
const router = new createRouter({
    history:createWebHashHistory(),
    routes    
})

// 由于pinia比较怪怪的,在这里使用useMainStore可能pinia还没注册完成
// 意思是什么呢,具体来讲就是pinia的注册依赖于Vue应用实例化,这里的本项目Vue组件的实例化依赖于路由初始化实例完成,而路由的初始化实例里需要访问pinia,这时候vue还没有实例化成功就访问未注册的pinia
// Vue 实例还没有完全初始化，导致在初始化过程中访问了 Pinia。
// 把他移到路由守卫里,保证路由实例化后vue实例化再调用
// const mainStore = useMainStore();

// 路由拦截
// router.beforeEach(async (to, from, next) => {
//     console.log('触发路由守卫');
//     const mainStore = useMainStore();
//     // 判断
//     if (to.path == '/login') {
//         next();
//     }else{
//         if (mainStore&&mainStore.nav.length == 0) {// 意味着没有缓存
//             console.log('路由守卫-发送getNavData请求');
//             // 发送请求获取导航路由数据
//             const res = await getNavData();
//             // 存入pinia
//             mainStore.setNav(res.data);
//             // 数据格式转换:将后端获取到的导航数据进行预处理,即处理得到与路由配置相关的数据,并且符合路由配置规则
//             const navDataRoute = reformData(res.data);
//             // 动态路由数据添加
//             router.addRoute(navDataRoute);
//             // 会发生循环调用：next(path:to.path)
//             next();
//         }else{
//             // 有缓存
//             next();
//         }
//     }
// });
// 路由守卫
router.beforeEach(async (to, from, next) => {
    console.log("触发路由守卫");
    const mainStore = useMainStore();
  
    if (to.path === "/login") {
      // 登录页直接放行
      next();
    } else {
      if (!mainStore.nav || mainStore.nav.length === 0) {
        console.log("路由守卫 - 发送 getNavData 请求");
  
        try {
          // 获取导航数据
          const res = await getNavData();
  
          // 保存到 Pinia
          mainStore.setNav(res.data);
  
          // 数据转换为路由配置
          const navDataRoute = reformData(res.data);
  
          // 动态添加路由
          navDataRoute.children.forEach((childRoute) => {
            router.addRoute("home", childRoute);
          });
  
          // 跳转到目标路由
          next({ ...to, replace: true });
        } catch (error) {
          console.error("加载动态路由失败：", error);
          next("/login"); // 出错时跳转到登录页
        }
      } else {
        // 已有导航缓存，直接放行
        next();
      }
    }
  });

function reformData(data) {
    // 过滤得到第一个'/home'路径的路由
    const homeRoutes = routes.filter(item => item.path=='/home')[0]
    // 为'/home'路径的路由添加数组类型的属性children
    homeRoutes.children = [];
    // 遍历后端的来的导航数据,将与路由配置有关的数据遍历写入子路由配置
    data.forEach(item => {
        homeRoutes.children.push({
            path:item.path,
            name:item.name,
            component:() => import(`../views/home/content/${item.component}/index.vue`),
        })
    });
    return homeRoutes;
}




export default router;