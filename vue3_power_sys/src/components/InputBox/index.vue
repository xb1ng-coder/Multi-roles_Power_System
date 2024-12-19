<template>
	<div class="input-box">
		<textarea v-model="input" placeholder="Type a message..."></textarea>
		<button @click="send">Send</button>
		<input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
		<button @click="triggerFileUpload">📎</button>
	</div>
</template>

<script>
export default {
	emits: ["sendMessage", "uploadFile"],
	data() {
		return { input: "" };
	},
	methods: {
		send() {
			if (this.input.trim()) {
				this.$emit("sendMessage", this.input.trim());
				this.input = "";
			}
		},
		triggerFileUpload() {
			this.$refs.fileInput.click();
		},
		handleFileUpload(event) {
			const file = event.target.files[0];
			if (file) {
				this.$emit("uploadFile", file);
			}
		},
	},
};
</script>

<style scoped>
.input-box {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
}
textarea {
	flex: 1;
	resize: none;
}
button {
	padding: 0.5rem 1rem;
	cursor: pointer;
}
</style>
