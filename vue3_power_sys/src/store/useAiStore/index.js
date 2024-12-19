import { defineStore } from "pinia";
import myQwen from "../../api/qwen";

export const useAiStore = defineStore("Ai", {
  state() {
    return {
      messages: [], // 初始化为空数组
    };
  },
  actions: {
    // 添加消息框
    addMessage(from, type, content) {
      this.messages.push({ from: from, type: type, content: content });
      // 如果是增加用户消息，则直接添加到历史记录
      if (from === "user") {
        myQwen.addChatHistory(from, content);
      }
      console.log(this.messages); // 确保日志中能正确显示状态
    },
    // AI流式响应输出
    async streamResponse() {
      try {
        let llmFullMessage = "";
        // 预先添加空的 LLM 消息框
        this.addMessage("llm", "text", llmFullMessage);
        // 调用 API 获取 AI 流式回复数据
        const completion = await myQwen.getResponse();
        console.log(completion);
        // 遍历流式数据，实现流式输出
        for await (const chunk of completion) {
          llmFullMessage += chunk.choices[0].delta.content;
          // 使用完整替换方式，更新响应式数据
          this.messages[this.messages.length - 1] = {
            ...this.messages[this.messages.length - 1],
            content: llmFullMessage,
          };
        }
        // 添加 AI 输出到历史记录
        myQwen.addChatHistory("assistant", llmFullMessage);
      } catch (error) {
        console.error("Streaming error:", error);
        // 确保在出错时，正确更新最后一条消息的内容
        this.messages[this.messages.length - 1] = {
          ...this.messages[this.messages.length - 1],
          content: "Streaming failed.",
        };
      }
    },
    // 清除消息框缓存
    removeMessages(){
        this.messages = [];
    }
  },
});
