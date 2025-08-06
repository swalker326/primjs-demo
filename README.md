# PrimJS WebAssembly Demo

A web interface for testing JavaScript execution in a WebAssembly-compiled PrimJS runtime. This demo showcases how to integrate PrimJS (a JavaScript engine based on QuickJS, compiled to WebAssembly) with a modern web application built using Rspack.

## What is this?

This application provides an interactive web interface for executing JavaScript code in a sandboxed WebAssembly environment using PrimJS. Features include:

- **WebAssembly JavaScript Engine**: Runs JavaScript code in a PrimJS engine (based on QuickJS) compiled to WebAssembly
- **Interactive Code Editor**: Web-based textarea for writing and testing JavaScript
- **Real-time Execution**: Execute code and see results immediately
- **Example Scripts**: Pre-built examples demonstrating ES6 features, async/await, and performance benchmarks
- **Memory Management**: Built-in garbage collection and memory usage monitoring
- **Modern Build System**: Uses Rspack for fast bundling and development

The application demonstrates how to properly structure and bundle WebAssembly modules with ES6 imports in a modern web application.

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server, and the app will be available at [http://localhost:8080](http://localhost:8080).

```bash
pnpm run dev
```

Build the app for production:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

## Live Demo

The application is deployed to Zephyr Cloud and available at: https://shane-swalker-dev-12083-rspack-vanilla-ts-starter-476520fc8-ze.zephyrcloud.app

## Project Structure

- `src/index.js` - Main application with PrimJS integration and web interface
- `src/primjs.js` - WebAssembly JavaScript engine (PrimJS compiled to WASM)
- `src/primjs.wasm` - WebAssembly binary for the PrimJS runtime
- `rspack.config.ts` - Build configuration with WASM support and Node.js polyfills

## Technical Details

This project demonstrates several important concepts:

1. **WebAssembly Integration**: How to properly import and initialize WASM modules in a web application
2. **ES6 Module Bundling**: Using modern import/export syntax with WebAssembly assets
3. **Node.js Polyfills**: Configuring bundlers to handle Node.js-specific code in browser environments
4. **Memory Management**: Interfacing with WASM memory allocation and garbage collection

The bundler configuration includes special handling for `.wasm` files as assets and Node.js polyfills to prevent bundling errors from server-side code paths in the WebAssembly module.

## Learn more

- [Rspack documentation](https://rspack.dev) - explore Rspack features and APIs
- [PrimJS](https://github.com/lynx-family/primjs) - JavaScript engine based on QuickJS
- [QuickJS](https://bellard.org/quickjs/) - the underlying JavaScript engine that PrimJS is based on
- [WebAssembly](https://webassembly.org/) - learn about WebAssembly technology
