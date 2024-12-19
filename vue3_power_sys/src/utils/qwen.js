import OpenAI from "openai";

const myApiKey = "sk-4bfa048e1bc4498bb07d38f78c0ca6aa";
const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        // apiKey: process.env.DASHSCOPE_API_KEY,
        apiKey:myApiKey,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        dangerouslyAllowBrowser: true,
    }
);

export default openai;