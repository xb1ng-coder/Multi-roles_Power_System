<!-- <template>
	<div :class="['message', message.type]">
		<div v-if="isMarkdown" v-html="renderMarkdown(message.content)"></div>
		<pre v-else-if="isCode" class="code-block">
        <code ref="code" v-html="highlightCode(message.content)"></code>
        <button class="copy-btn" @click="copyCode(message.content)">Copy</button>
      </pre>
		<img v-else-if="isImage" :src="message.content" alt="Image" />
		<pre v-else>{{ message.content }}</pre>
	</div>
</template>

<script>
import { marked } from "marked";
import hljs from "highlight.js";

export default {
	props: {
		message: { type: Object, required: true },
	},
	computed: {
		isMarkdown() {
			return this.message.type === "markdown";
		},
		isCode() {
			return this.message.type === "code";
		},
		isImage() {
			return this.message.type === "image";
		},
	},
	methods: {
		renderMarkdown(content) {
			return marked(content);
		},
		highlightCode(content) {
			return hljs.highlightAuto(content).value;
		},
		copyCode(content) {
			navigator.clipboard.writeText(content);
			alert("Code copied to clipboard!");
		},
	},
};
</script>

<style scoped>
.code-block {
	position: relative;
	background: #f5f5f5;
	padding: 1rem;
	border-radius: 5px;
}
.copy-btn {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: #007bff;
	color: #fff;
	padding: 0.3rem 0.6rem;
	border: none;
	cursor: pointer;
}
</style> -->

<template>
	<div class="messageBox">
		<el-icon v-if="message.from === 'user'"><User /></el-icon>
		<el-icon v-else><ScaleToOriginal /></el-icon>
		<pre>{{ message.content }}</pre>
	</div>
</template>

<script setup>
import { User, ScaleToOriginal } from "@element-plus/icons-vue";
defineProps(["message", "key"]);
</script>

<style scoped>
.messageBox {
	border-radius: 5px;
	color: black;

	margin: 5px;
	padding: 5px;
	background-color: aliceblue;

	/* 设置最大宽度限制，超出宽度自动换行 */
	max-width: 90%;
	overflow-wrap: break-word; /* 长单词换行 */
	word-wrap: break-word; /* 兼容旧版浏览器 */
	word-break: break-word; /* 保证单词也可被断开 */
}
pre {
	margin: 5px;
	font-family: "幼圆";
	white-space: pre-wrap; /* 保留空格和换行，但允许自动换行 */
}
</style>
