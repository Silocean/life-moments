# 人生时刻 - 记录流逝的天数

记录人生中某个时刻过去的天数，支持多时刻管理。一目了然查看「已经过去 X 天」。

## 功能

- **时刻管理**：添加、编辑、删除时刻（名称、日期、描述、分类）
- **天数展示**：实时计算并展示每个时刻已过去的天数
- **里程碑高亮**：100 天、1 年、5 年等节点特殊展示
- **搜索与排序**：按关键词搜索，支持按日期、名称、天数排序
- **主题切换**：明/暗主题
- **数据管理**：导入/导出 JSON 备份
- **分享**：分享单条时刻到社交平台或复制到剪贴板

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```

产物在 `dist/` 目录。

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- date-fns

## 文档

详见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
