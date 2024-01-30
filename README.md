<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://avatars.githubusercontent.com/u/118692557?s=200&v=4" width="180" alt="Meteor logo">
</a >
</p >
<br/>

# Meteor Hooks

[![npm version](https://img.shields.io/npm/v/@meteor-web3/hooks.svg)](https://www.npmjs.com/package/@meteor-web3/hooks)
![npm](https://img.shields.io/npm/dw/@meteor-web3/hooks)
[![License](https://img.shields.io/npm/l/@meteor-web3/hooks.svg)](https://github.com/meteor-web3/meteor-hooks/blob/main/LICENSE.md)


## Overview

This repository contains `React` hooks for meteor primitives, making it
easier to create your dApp logic and components.

## Install

```
pnpm install @meteor-web3/hooks
```

## Example
### import provider
```typescript
import { MeteorContextProvider } from "@meteor-web3/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MeteorContextProvider>
    <App />
  </MeteorContextProvider>
);
```

### use store
```typescript
import { useStore } from "@meteor-web3/hooks";

const { state } = useStore();
```

### use hooks
```typescript
const { connectApp } = useApp({
  onSuccess: (result) => {
    console.log("connect app success, result:", result);
  },
});

const { createdStream: publicPost, createStream: createPublicStream } = useCreateStream({
  streamType: StreamType.Public,
  onSuccess: (result: any) => {
    console.log("create public stream success:", result);
  },
});
```

You can find more meteor-hooks usage in
[dapp-examples](https://github.com/meteor-web3/dapp-examples).

## Documentation

View [hooks API Doc](https://meteor-web3.github.io/meteor-hooks/index.html).