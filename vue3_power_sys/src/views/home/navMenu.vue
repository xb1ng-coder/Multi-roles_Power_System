<template>
	<div class="common-layout" style="height: 100%">
		<el-menu default-active="/home" class="el-menu-vertical-demo" router style="height: 100%">
			<el-menu-item :index="item.path" v-for="item in items" :key="item.path">
				<el-icon><icon-menu /></el-icon>
				<template #title>{{ item.title }}</template>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";

// import { getNavData } from "../../api/index";
import { useMainStore } from "../../store/useMainStore/index";
const current = ref("");
const router = useRouter();
router.afterEach((to, from, next) => {
	current.value = to.path;
});
let items = ref(useMainStore().getNav());

// 在'/'到'/login'重定向时或者从'/login'到'/home'时,已经触发路由守卫,将后端侧边栏数据存入了缓存pinia,所以不需要在这里挂载组件时再次请求了
// onMounted(async () => {
// 	const res = await getNavData();
// 	console.log("navMenu挂载-发送getNavData请求", res);
// 	items.value = res.data;
// });
</script>

<style scoped></style>
