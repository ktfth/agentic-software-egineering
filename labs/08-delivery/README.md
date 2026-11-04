# Lab 08 — releaseGate

Run from the repository root with Node 24.22.1 and npm 11.9.0:

```sh
npm ci
npm run lab -- 08 starter
```

The starter is intentionally incomplete and must fail. Implement `releaseGate` in `labs/08-delivery/starter/src/policy.ts`, preserving its exported type. Acceptance cases are executable in `tests/lab-contracts.ts`, case 08; read them before implementation. Do not modify the contract.

Reference implementation: `packages/agent-runtime/src/index.ts`; the solution entry exports that implementation. After your attempt run:

```sh
npm run lab -- 08 solution
npm run lab -- 08 starter
npm run validate
```

Success means all contract assertions pass and each command exits zero. You may replace the starter with the solution export to reproduce the reference outcome, but explain the implementation and its limitations before claiming understanding. The book discusses the decisions and boundaries of each exercise; all local acceptance cases can run without a model provider or external service.
