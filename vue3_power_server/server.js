const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 7003;
const SECRET_KEY = "your_secret_key";

// 设置 CORS 配置
app.use(cors({
  origin: "http://localhost:8080", // 替换为前端运行的实际地址
  methods: ["GET", "POST"], // 允许的 HTTP 方法
  credentials: true // 如果需要携带 cookie，可以开启此配置
}));

//增加头部信息解决跨域问题
// app.all('*', function (req, res, next){
//   res.header("Access-Control-Allow-Origin", "*");//允许源访问，本利前端访问路径为“http://localhost:5173”
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("X-Powered-By", ' 3.2.1');
//   next();
// });

app.use(bodyParser.json());

// 模拟用户数据
const users = [
  { id: 1,name:'老马', username: "admin", password: "admin123", role: "admin" }, // 管理员
  { id: 2,name:'黎明', username: "liming", password: "liming123", role: "member" },   // 普通用户
  { id: 3,name:'山忆y', username: "shanyi", password: "shanyi123", role: "member" },   // 普通用户
  { id: 4,name:'大马', username: "dama", password: "dama123", role: "member" },   // 普通用户
  { id: 5,name:'小马', username: "xiaoma", password: "xiaoma123", role: "member" },   // 普通用户
  { id: 6,name:'雾雨魔理沙', username: "molisha", password: "molisha123", role: "member" },   // 普通用户
  { id: 7,name:'友利奈绪', username: "youlinaixu", password: "youlinaixu123", role: "member" },   // 普通用户
  { id: 8,name:'red', username: "red", password: "red123", role: "member" },   // 普通用户
  { id: 9,name:'日天', username: "ritian", password: "ritian123", role: "member" },   // 普通用户
];

// 模拟导航数据
const NavData = {
  admin: [
    { id: 1,name:'index', title: "首页", path: "/index",component:'index' },
    { id: 2,name:'user-management', title: "用户管理", path: "/user-management",component:'user-management' },
    { id: 3,name:'settings', title: "系统设置", path: "/settings",component:'settings' }
  ],
  member: [
    { id: 1,name:'index', title: "首页", path: "/index",component:'index' },
    { id: 2, name:'personal-center',title: "个人中心", path: "/personal-center",component:'personal-center' },
    { id: 2, name:'llm-view',title: "ChatB1ngPT", path: "/llm-view",component:'llm-view' }
  ]
};

// 登录路由
app.post("/login", (req, res) => {
  console.log("/login收到请求:", req.data); // 打印接收到的请求 req.data与req.body等价
  const { account, password } = req.body;
  const user = users.find(u => u.username === account && u.password === password);

  if (user) {
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    console.log("/login成功生成token:", token); // 打印生成的 token
    res.json({
      data: { token },
      message: "登录成功"
    });
  } else {
    console.log("/login登录失败: 用户名或密码错误"); // 记录失败的原因
    res.status(401).json({ message: "用户名或密码错误" });
  }
});

// 认证中间件：验证 JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // 获取 Bearer Token

  if (!token) {
    return res.status(403).json({ message: "没有提供 token" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "无效的 token" });
    }

    req.user = user; // 保存用户信息到请求对象中
    next(); // 继续处理请求
  });
};

// 角色授权中间件：检查用户角色是否符合权限要求
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "权限不足" });
    }
    next(); // 继续处理请求
  };
};

// 导航数据路由，根据用户角色返回不同的导航数据
app.get('/getResource', authenticateJWT, (req, res) => {
  console.log('/getResource收到请求');
  
  const role = req.user.role; // 从用户信息中获取角色
  const resources = NavData[role]; // 根据角色获取不同的资源

  if (resources) {
    console.log('/getResource获取数据成功');
    
    res.json({
      data: resources,
      message: "导航数据获取成功"
    });
  } else {
    console.log('/getResource获取数据失败');
    res.status(403).json({ message: "无效的角色或没有权限访问该资源" });
  }
});

// 管理员专用的路由，只有管理员角色可以访问
app.get('/adminDashboard', authenticateJWT, authorizeRole(["admin"]), (req, res) => {
  res.json({
    message: "欢迎来到管理员控制面板"
  });
});

// 用户专用的路由，只有普通用户可以访问
app.get('/userDashboard', authenticateJWT, authorizeRole(["member"]), (req, res) => {
  res.json({
    message: "欢迎来到用户控制面板"
  });
});

// 获取用户信息接口
app.get('/getUserInfo', authenticateJWT, (req, res) => {
  console.log('/getUserInfo收到请求');
  
  // 从解析后的 token 中获取用户 ID 和角色信息
  const { userId, role } = req.user;

  // 根据用户 ID 查找用户信息
  const user = users.find(u => u.id === userId);

  if (user) {
    console.log('/getUserInfo获取用户信息成功', user);

    // 返回用户信息（排除敏感字段）
    res.json({
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      },
      message: "用户信息获取成功"
    });
  } else {
    console.log('/getUserInfo获取用户信息失败: 用户不存在');
    res.status(404).json({ message: "用户信息不存在" });
  }
});

// 获取【全部】用户信息接口
app.get('/getAllUsers', authenticateJWT, (req, res) => {
  console.log('/getAllUsers收到请求');

  // 从解析后的 token 中获取用户 ID 和角色信息
  const { userId, role } = req.user;

  // 根据用户 ID 查找用户信息
  const user = users.find(u => u.id === userId);

  if (user && role === 'admin') {
    console.log('/getAllUsers获取“全部”用户信息成功', user);

    // 返回所有用户信息（排除敏感字段，例如密码）
    const filteredUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role
    }));

    res.json({
      data: filteredUsers,
      message: "成功获取“全部”用户信息"
    });
  } else {
    console.log('/getAllUsers获取用户信息失败：权限不足');
    res.status(403).json({ message: "权限不足，无法获取用户信息" });
  }
});


app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://127.0.0.1:${PORT}`);
});
