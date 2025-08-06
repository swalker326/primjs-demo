import PrimJS from './primjs.js';
import primjsWasm from './primjs.wasm';

let PrimJSModule = null;

document.querySelector("#root").innerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrimJS WebAssembly Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        .panel {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        textarea {
            width: 100%;
            height: 300px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
            resize: vertical;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
        button:hover {
            background: #45a049;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        #output {
            background: #f8f8f8;
            min-height: 300px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 10px;
        }
        .status {
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .status.loading {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .status.ready {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .examples {
            margin-top: 20px;
        }
        .example-btn {
            background: #2196F3;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .example-btn:hover {
            background: #0b7dda;
        }
    </style>
</head>
<body>
    <h1>PrimJS WebAssembly Test Interface</h1>
    
    <div id="status" class="status loading">Loading PrimJS WebAssembly module...</div>
    
    <div class="container">
        <div class="panel">
            <h2>JavaScript Code</h2>
            <textarea id="code" placeholder="Enter JavaScript code here...">// PrimJS WebAssembly Test
// Basic QuickJS without standard library - expressions return their values

// Test basic operations
2 + 2;

// You can also try:
// Math.sqrt(16)
// "Hello " + "World"
// [1,2,3].map(x => x * 2)
// JSON.stringify({name: "PrimJS", version: "1.0"})</textarea>
            <button id="runBtn" onclick="runCode()" disabled>Run Code</button>
            <button id="clearBtn" onclick="clearOutput()">Clear Output</button>
            
            <div class="examples">
                <h3>Example Scripts:</h3>
                <button class="example-btn" onclick="loadExample('basic')">Basic Test</button>
                <button class="example-btn" onclick="loadExample('es6')">ES6 Features</button>
                <button class="example-btn" onclick="loadExample('async')">Async/Await</button>
                <button class="example-btn" onclick="loadExample('benchmark')">Performance</button>
            </div>
        </div>
        
        <div class="panel">
            <h2>Output</h2>
            <div id="output"></div>
        </div>
    </div>

    <script>
        
    </script>
</body>
</html>
`;

const examples = {
  basic: `// Basic JavaScript test - returns computed value
// Variables and types
let x = 10;
const y = 20;
var z = x + y;

// String operations
const str = "PrimJS";
const info = {
    sum: z,
    string: str,
    length: str.length,
    uppercase: str.toUpperCase(),
    pi: Math.PI,
    sqrt16: Math.sqrt(16)
};

// Return the results as JSON
JSON.stringify(info, null, 2)`,

  es6: `// ES6 Features Test - returns results
// Arrow functions
const multiply = (a, b) => a * b;

// Template literals
const name = "PrimJS";
const version = 1.0;
const message = \`Running \${name} version \${version}\`;

// Destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

// Classes
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    get area() {
        return this.width * this.height;
    }
}

const rect = new Rectangle(10, 5);

// Return all results
JSON.stringify({
    multiply_result: multiply(5, 3),
    template_literal: message,
    destructured: {a, b, rest},
    spread_result: arr2,
    rectangle_area: rect.area
}, null, 2)`,

  async: `// Async/Await Test - Note: setTimeout not available in basic QuickJS
// Test Promise resolution
const testPromise = Promise.resolve(42);

// Test async function
async function asyncTest() {
    const result = await Promise.resolve("Hello async");
    const number = await testPromise;
    
    return {
        message: result,
        answer: number,
        status: "Async test completed"
    };
}

// Return promise result as string
asyncTest().then(r => JSON.stringify(r, null, 2))`,

  benchmark: `// Performance Benchmark - returns timing results
// Fibonacci benchmark
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const start = Date.now();
const result = fibonacci(30);
const elapsed = Date.now() - start;

// Array operations benchmark
const arraySize = 10000;
const arr = Array.from({length: arraySize}, (_, i) => i);

const start2 = Date.now();
const sum = arr.reduce((acc, val) => acc + val, 0);
const elapsed2 = Date.now() - start2;

// Object creation benchmark
const start3 = Date.now();
const objects = [];
for (let i = 0; i < 1000; i++) {
    objects.push({
        id: i,
        value: Math.random(),
        name: "Object_" + i
    });
}
const elapsed3 = Date.now() - start3;

// Return benchmark results
JSON.stringify({
    fibonacci: {
        n: 30,
        result: result,
        time_ms: elapsed
    },
    array_sum: {
        size: arraySize,
        sum: sum,
        time_ms: elapsed2
    },
    object_creation: {
        count: objects.length,
        time_ms: elapsed3
    },
    total_time_ms: elapsed + elapsed2 + elapsed3
}, null, 2)`
};

function loadExample(type) {
  document.getElementById("code").value = examples[type];
}

function updateStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;
}

function addOutput(message, isError = false) {
  const output = document.getElementById("output");
  const timestamp = new Date().toLocaleTimeString();
  const prefix = isError ? "❌ " : "► ";
  output.textContent += `[${timestamp}] ${prefix}${message}\n`;
  output.scrollTop = output.scrollHeight;
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// Override console.log to capture output
const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  if (PrimJSModule) {
    addOutput(args.join(" "));
  }
};

async function initPrimJS() {
  try {
    updateStatus("Loading PrimJS module...", "loading");

    // Initialize the module using the imported PrimJS
    PrimJSModule = await PrimJS({
      locateFile: (path) => {
        if (path.endsWith(".wasm")) {
          return primjsWasm;
        }
        return path;
      }
    });

    // Wait for runtime to be ready
    if (PrimJSModule._primjs_init) {
      setupPrimJS();
    } else {
      // If functions aren't ready yet, wait for onRuntimeInitialized
      PrimJSModule.onRuntimeInitialized = setupPrimJS;
    }
  } catch (error) {
    updateStatus(`Error: ${error.message}`, "error");
    addOutput(error.message, true);
    addOutput("Make sure you have run: ./build_wasm_module.sh", true);
  }
}

function setupPrimJS() {
  try {
    // Initialize PrimJS runtime with 64MB memory limit
    const result = PrimJSModule._primjs_init(64 * 1024 * 1024);
    if (result !== 0) {
      throw new Error("Failed to initialize PrimJS runtime");
    }

    updateStatus("PrimJS WebAssembly loaded successfully!", "ready");
    document.getElementById("runBtn").disabled = false;
    addOutput("PrimJS WebAssembly runtime initialized");
    addOutput("Ready to execute JavaScript code");
  } catch (error) {
    updateStatus(`Setup error: ${error.message}`, "error");
    addOutput(error.message, true);
  }
}

function runCode() {
  if (!PrimJSModule) {
    addOutput("PrimJS not initialized", true);
    return;
  }

  const code = document.getElementById("code").value;
  if (!code.trim()) {
    addOutput("No code to execute", true);
    return;
  }

  try {
    addOutput("--- Executing code ---");

    // Call the wrapper function using ccall
    const resultPtr = PrimJSModule.ccall(
      "primjs_eval",
      "number", // return type (pointer)
      ["string"], // argument types
      [code] // arguments
    );

    // Convert result pointer to string
    const resultStr = PrimJSModule.UTF8ToString(resultPtr);

    // Check if it's an error (simple heuristic)
    if (resultStr.startsWith("Error:")) {
      addOutput(resultStr, true);
    } else {
      addOutput(`Result: ${resultStr}`);
    }

    // Free the result string
    PrimJSModule._primjs_free_string(resultPtr);

    // Run garbage collection
    PrimJSModule._primjs_gc();

    addOutput("--- Execution complete ---");
  } catch (error) {
    addOutput(`Execution error: ${error.message}`, true);
  }
}

// Make functions globally accessible
window.runCode = runCode;
window.clearOutput = clearOutput;
window.loadExample = loadExample;

// Initialize when page loads
window.addEventListener("load", initPrimJS);

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (PrimJSModule) {
    PrimJSModule._primjs_cleanup();
  }
});
