import OpenAI from "openai";

const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: 'sk-4bfa048e1bc4498bb07d38f78c0ca6aa',
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

const completion = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "你是谁？"}
    ],
    stream: true,
});

console.log(completion);

let fullContent = "";
console.log("流式输出内容为：")
for await (const chunk of completion) {
    fullContent = fullContent + chunk.choices[0].delta.content;
    console.log(chunk.choices[0].delta.content);
}
console.log("\n完整内容为：")
console.log(fullContent);