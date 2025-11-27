# laotang-the-graph

Sepolia 上 `MyLogger` 合约的 Subgraph。索引事件 `DataStored(indexed address sender, string message, uint256 timestamp)`，并以 `DataStored` 实体存储（见 `schema.graphql`）。

## 快速开始
```bash
yarn install
yarn codegen
yarn build
# 部署到 Graph Studio（需先在 Studio 创建子图并准备 deploy key）
graph auth <DEPLOY_KEY>
graph deploy laotang-the-graph
```

## 地址信息
- 网络：`sepolia`
- MyLogger 合约：`0x711c33E504066a40B2E0666d37895E60078363a6`
- ABI：`./abis/MyLogger.json`
- 数据源配置：`subgraph.yaml`

## Schema 与 mapping
- Schema：`schema.graphql` 定义 `DataStored`，字段包含 sender、message、timestamp 以及区块/交易元数据。
- Mapping：`src/my-logger.ts` 处理 `DataStored` 事件，使用 `txHash + logIndex` 作为实体 ID 保存。
