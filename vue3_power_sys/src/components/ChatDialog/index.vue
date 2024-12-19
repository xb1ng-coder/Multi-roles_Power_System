<template>
	<div class="chat-dialog">
		<div class="messages">
			<MessageItem
				v-for="(message, index) in aiStore.messages"
				:key="index"
				:message="message"
			/>
		</div>
		<InputBox @sendMessage="handleSendMessage" @uploadFile="handleFileUpload" />
	</div>
</template>

<script>
import { onMounted } from "vue";

// import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from "@coze/api";
import myQwen from "../../api/qwen";
import MessageItem from "../MessageItem/index.vue";
import InputBox from "../InputBox/index.vue";
import { useAiStore } from "../../store/useAiStore/index.js";

export default {
	components: { MessageItem, InputBox },
	setup() {
		const aiStore = useAiStore();
		// 检查状态初始化
		console.log("AI Store 状态:", aiStore);
		onMounted(() => {
			aiStore.streamResponse();
		});
		// InputBox提交文本----每一次对话触发此方法 调用qwen的api进行对话
		const handleSendMessage = (input) => {
			aiStore.addMessage("user", "text", input);
			aiStore.streamResponse();
		};

		// 流式输出AI回复
		// const streamResponse = async () => {
		// 	try {
		// 		let llmFullMessage = "";
		// 		addMessage("llm", "text", llmFullMessage); // 预先添加空的 LLM 消息框
		// 		const completion = await myQwen.getResponse();
		// 		console.log(completion);
		// 		for await (const chunk of completion) {
		// 			llmFullMessage = llmFullMessage + chunk.choices[0].delta.content;
		// 			messages.value[messages.value.length - 1].content = llmFullMessage; // 动态更新界面
		// 		}
		// 		myQwen.addChatHistory("assistant", llmFullMessage); // 添加AI输出到历史记录
		// 	} catch (error) {
		// 		console.error("Streaming error:", error);
		// 		messages.value[messages.value.length - 1].content = "Streaming failed.";
		// 	}
		// };

		// InputBox提交文件----每一次对话触发此方法 调用coze的api进行对话
		const handleFileUpload = async (file) => {
			const fileType = file.type;
			const reader = new FileReader();
			reader.onload = async (event) => {
				const fileContent = event.target.result;
				addMessage("user", "file", `[File: ${file.name}]`);
				const response = await coze.sendMessage(fileContent, { fileType });
				addMessage("llm", "file", response);
			};
			reader.readAsDataURL(file);
		};

		// 废弃的coze
		// const myToken = "pat_9wKCdaS8Y57Y3kpBWY0jq5wgVIMB1jQPB6RvfQnwy1JJHnPiYCxOCvdAJvfZukau";
		// // 初始化Coze的客户端
		// const cozeClient = new CozeAPI({
		// 	token: myToken, // Get your PAT from https://www.coze.com/open/oauth/pats
		// 	baseURL: COZE_COM_BASE_URL,
		// 	allowPersonalAccessTokenInBrowser: true, // 强制允许在浏览器中使用
		// });

		// 添加消息到对话记录
		// function addMessage(from, type, content) {
		// 	messages.value.push({ from: from, type: type, content: content });
		// 	console.log(messages.value);
		// }

		return { handleSendMessage, handleFileUpload, aiStore };
	},
};
</script>
