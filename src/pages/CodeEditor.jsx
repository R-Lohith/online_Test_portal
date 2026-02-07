import { useState } from 'react';
import { Play, Copy, Check, RefreshCw } from 'lucide-react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to Code Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'go', name: 'Go', icon: '🔵' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
  ];

  const boilerplates = {
    javascript: `// Welcome to Code Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
    python: `# Welcome to Code Editor
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
    java: `// Welcome to Code Editor
public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
    cpp: `// Welcome to Code Editor
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}`,
    typescript: `// Welcome to Code Editor
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
    go: `// Welcome to Code Editor
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println(fibonacci(10))
}`,
    rust: `// Welcome to Code Editor
fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    println!("{}", fibonacci(10));
}`,
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(boilerplates[lang]);
    setOutput('');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    
    setTimeout(() => {
      // Simulate code execution
      const simulatedOutput = `Running ${languages.find(l => l.id === language).name}...\n\nOutput:\n55\n\nExecution completed successfully!\nTime: 0.${Math.floor(Math.random() * 900 + 100)}s\nMemory: ${Math.floor(Math.random() * 50 + 10)}MB`;
      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(boilerplates[language]);
    setOutput('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Code Editor</h1>
        <p className="text-gray-600">Write, test, and execute your code</p>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                language === lang.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-3 text-gray-300 text-sm font-medium">
                {languages.find(l => l.id === language).name}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                title="Reset code"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[500px] p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-none"
              spellCheck="false"
              style={{
                lineHeight: '1.6',
                tabSize: 2,
              }}
            />
            {/* Line numbers */}
            <div className="absolute top-0 left-0 p-4 text-gray-500 font-mono text-sm pointer-events-none select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} style={{ lineHeight: '1.6' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
            <span className="text-gray-300 text-sm font-medium">Output</span>
          </div>
          
          <div className="h-[560px] overflow-y-auto">
            {output ? (
              <pre className="p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Play size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Click "Run Code" to see the output</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Use Tab for indentation and proper code formatting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Test your code with different inputs to ensure correctness</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Click the copy button to save your code to clipboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Use the reset button to restore the boilerplate code</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CodeEditor;
