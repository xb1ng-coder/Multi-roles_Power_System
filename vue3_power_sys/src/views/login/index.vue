<template>
	<div class="login">
		<div class="login-content">
			<el-form
				ref="ruleFormRef"
				style="max-width: 600px"
				:model="temp"
				:rules="rules"
				label-width="120px"
				class="demo-ruleForm"
				status-icon
			>
				<el-form-item label="用户名" prop="account">
					<el-input v-model="temp.account" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="temp.password" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 登录 </el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { login } from "../../api/index";
import { setToken } from "../../utils/auth";

const router = useRouter(); // 实例化:vue2注意的是全局引入后在哪里使用就this.router即可,而vue3更在意的是按需加载,在哪里使用,在哪里实例化一下

const ruleFormRef = ref();
const rules = reactive({
	// 校验规则集
	account: [
		{ required: true, message: "Please input Activity name", trigger: "blur" },
		{ min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
	],
	password: [
		{ required: true, message: "Please input Activity password", trigger: "blur" },
		{ min: 3, max: 10, message: "Length should be 3 to 5", trigger: "blur" },
	],
});
const temp = reactive({
	account: "user",
	password: "user123",
});
async function submitForm(formEl) {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				let res = await login(temp);
				// 缓存token
				setToken(res.data.token);
				// 跳转页面
				router.push("/home");
			} catch (error) {
				console.error("Login failed:", error);
			}
		} else {
			console.log("error submit!");
		}
	});
}
</script>

<style scoped></style>
