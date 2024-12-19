// 实现多轮流式对话
import openai from "../utils/qwen.js";

// try {
//     const completion = await openai.chat.completions.create({
//         model: "qwen-plus",  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
//         messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: "你是谁？" }
//         ],
//     });
//     console.log(completion.choices[0].message.content);
// } catch (error) {
//     console.log(`错误信息：${error}`);
//     console.log("请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code");
// }

// 设置初始对话
const allMessages = [
    { role: "system", content: "You are a helpful assistant." },
    // 设置初始问题
    { role: "user", content: "介绍一下自己吧" },
]




const myQwen = {
    async getResponse(){
        const response =  await openai.chat.completions.create({
            model: "qwen-plus",  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
            messages: allMessages,
            stream : true
        });
        return response
    },
    addChatHistory(role,content){
        allMessages.push({ role: role, content: content });
    }
}

export default myQwen;