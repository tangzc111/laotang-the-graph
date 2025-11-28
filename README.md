# laotang-the-graph (RedEnvelope)

Sepolia 上 `RedEnvelope` 合约的 Subgraph。索引红包的创建、领取、回收事件，存储 `Envelope`、`Claim`、`Reclaim` 实体（见 `schema.graphql`）。

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
- RedEnvelope 合约：`0x2D4Bb1e8A16b7454748B2Ba5c74ff489fAb4dfE8`
- ABI：`./abis/RedEnvelope.json`
- 数据源配置：`subgraph.yaml`

## Schema 与 mapping
- Schema：`schema.graphql` 定义
  - `Envelope`：红包状态、剩余份额/金额、创建信息
  - `Claim`：每次领取记录（不可变）
  - `Reclaim`：过期回收记录（不可变）
- Mapping：`src/red-envelope.ts` 处理事件
  - `handleEnvelopeCreated` 建立红包
  - `handleEnvelopeClaimed` 更新剩余份额/金额，记录领取
  - `handleEnvelopeReclaimed` 标记回收并记录
