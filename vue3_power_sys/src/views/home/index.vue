<template>
	<div class="common-layout">
		<el-container style="height: 800px">
			<!-- 左侧导航 -->
			<NavMenu />
			<!-- 右侧主体 -->
			<el-container>
				<!-- 头部 -->
				<el-header style="padding: 0%">
					<el-button type="danger" plain @click="goBack">退出</el-button>
				</el-header>
				<!-- 主体 -->
				<el-main><router-view /></el-main>
				<!-- 尾部 -->
				<el-footer>b1ng版权</el-footer>
			</el-container>
		</el-container>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import NavMenu from "./navMenu.vue";
import { removeToken } from "../../utils/auth";
import { useMainStore } from "../../store/useMainStore/index";
import { useAiStore } from "../../store/useAiStore/index";

const router = useRouter();

function goBack() {
	// 退出登录：返回login界面、删除存储到token、pinia等...
	// 删除已存储token
	removeToken();
	// 删除已存储pinia
	useMainStore().removeNav();
	useAiStore().removeMessages();
	router.push("/login");
}
</script>

<style scoped></style>
