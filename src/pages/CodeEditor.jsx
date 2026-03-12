import { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Send, ChevronLeft, CheckCircle2, XCircle,
  Lock, Unlock, Trophy, Target, Clock, AlertTriangle, RefreshCw, Cpu, ChevronDown
} from 'lucide-react';

// ── LANGUAGE CONFIG ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: '🟨', monacoId: 'javascript', ext: 'js' },
  { id: 'c', label: 'C', icon: '🔵', monacoId: 'c', ext: 'c' },
  { id: 'cpp', label: 'C++', icon: '🟦', monacoId: 'cpp', ext: 'cpp' },
  { id: 'java', label: 'Java', icon: '☕', monacoId: 'java', ext: 'java' },
];

// Starter code templates per language (generic — used when no problem-specific one exists)
const LANG_STARTERS = {
  javascript: (fnName) => `function ${fnName}() {\n  // Your solution here\n  \n}`,
  c: (fnName) => `#include <stdio.h>\n#include <stdlib.h>\n\n// Write your solution here\nint ${fnName}() {\n    // TODO\n    return 0;\n}\n\nint main() {\n    // Test your solution\n    return 0;\n}`,
  cpp: (fnName) => `#include <bits/stdc++.h>\nusing namespace std;\n\n// Write your solution here\nint ${fnName}() {\n    // TODO\n    return 0;\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Test your solution\n    return 0;\n}`,
  java: (fnName) => `import java.util.*;\n\npublic class Solution {\n    public int ${fnName}() {\n        // TODO\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        // Test your solution\n    }\n}`,
};

// ── PROBLEM BANK ─────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number[] — [i, j] where nums[i] + nums[j] === target',
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
  
}`,
    fnName: 'twoSum',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], visible: true },
      { input: [[3, 2, 4], 6], expected: [1, 2], visible: true },
      { input: [[3, 3], 6], expected: [0, 1], visible: true },
      { input: [[1, 2, 3, 4, 5], 9], expected: [3, 4], visible: false },
      { input: [[-1, -2, -3, 5], 2], expected: [2, 3], visible: false },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3], visible: false },
      { input: [[1, 5, 3, 7], 8], expected: [1, 2], visible: false },
      { input: [[2, 3, 1, 6], 7], expected: [1, 3], visible: false },
      { input: [[10, 2, 8, 4], 12], expected: [0, 2], visible: false },
      { input: [[1, 3, 4, 2], 6], expected: [2, 3], visible: false },
    ],
    compare: (r, e) => Array.isArray(r) && r.length === 2 && ((r[0] === e[0] && r[1] === e[1]) || (r[0] === e[1] && r[1] === e[0])),
  },
  {
    id: 2, title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack', 'String'],
    description: 'Given a string `s` containing only `()[]{}`, determine if the input string is valid. Brackets must close in the correct order.',
    inputFormat: 's: string',
    outputFormat: 'boolean',
    constraints: ['1 ≤ s.length ≤ 10⁴', 's only contains ()[]{}'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    starterCode: `function isValid(s) {\n  // Your solution here\n  \n}`,
    fnName: 'isValid',
    testCases: [
      { input: ['()'], expected: true, visible: true },
      { input: ['()[]{}'], expected: true, visible: true },
      { input: ['(]'], expected: false, visible: true },
      { input: ['([)]'], expected: false, visible: false },
      { input: ['{[]}'], expected: true, visible: false },
      { input: [''], expected: true, visible: false },
      { input: ['{'], expected: false, visible: false },
      { input: ['((()))'], expected: true, visible: false },
      { input: ['[{()}]'], expected: true, visible: false },
      { input: ['((())]'], expected: false, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 3, title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', tags: ['Array', 'DP'],
    description: 'Given array `prices` where `prices[i]` is stock price on day `i`, return the maximum profit from a single buy-then-sell. If no profit is possible, return `0`.',
    inputFormat: 'prices: number[]',
    outputFormat: 'number — maximum profit',
    constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy day 2 (1), sell day 5 (6). Profit = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction exists.' },
    ],
    starterCode: `function maxProfit(prices) {\n  // Your solution here\n  \n}`,
    fnName: 'maxProfit',
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, visible: true },
      { input: [[7, 6, 4, 3, 1]], expected: 0, visible: true },
      { input: [[1, 2]], expected: 1, visible: true },
      { input: [[2, 4, 1]], expected: 2, visible: false },
      { input: [[3, 2, 6, 5, 0, 3]], expected: 4, visible: false },
      { input: [[1]], expected: 0, visible: false },
      { input: [[5, 5, 5, 5]], expected: 0, visible: false },
      { input: [[1, 2, 3, 4, 5]], expected: 4, visible: false },
      { input: [[10, 1, 3, 7, 2, 8]], expected: 7, visible: false },
      { input: [[9, 3, 5, 1, 8, 2]], expected: 7, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 4, title: 'Longest Substring Without Repeating', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Map'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    inputFormat: 's: string',
    outputFormat: 'number',
    constraints: ['0 ≤ s.length ≤ 5×10⁴'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3.' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    starterCode: `function lengthOfLongestSubstring(s) {\n  // Your solution here\n  \n}`,
    fnName: 'lengthOfLongestSubstring',
    testCases: [
      { input: ['abcabcbb'], expected: 3, visible: true },
      { input: ['bbbbb'], expected: 1, visible: true },
      { input: ['pwwkew'], expected: 3, visible: true },
      { input: [''], expected: 0, visible: false },
      { input: [' '], expected: 1, visible: false },
      { input: ['au'], expected: 2, visible: false },
      { input: ['dvdf'], expected: 3, visible: false },
      { input: ['abcdefg'], expected: 7, visible: false },
      { input: ['aab'], expected: 2, visible: false },
      { input: ['tmmzuxt'], expected: 5, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 5, title: 'Container With Most Water', difficulty: 'Medium', tags: ['Two Pointers', 'Array'],
    description: 'Given integer array `height` of length `n` representing vertical lines, find two lines that together with the x-axis form a container holding the most water.',
    inputFormat: 'height: number[]',
    outputFormat: 'number',
    constraints: ['2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' },
    ],
    starterCode: `function maxArea(height) {\n  // Your solution here\n  \n}`,
    fnName: 'maxArea',
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, visible: true },
      { input: [[1, 1]], expected: 1, visible: true },
      { input: [[4, 3, 2, 1, 4]], expected: 16, visible: true },
      { input: [[1, 2, 1]], expected: 2, visible: false },
      { input: [[2, 3, 10, 5, 7, 8, 9]], expected: 36, visible: false },
      { input: [[1, 3, 2, 5, 25, 24, 5]], expected: 24, visible: false },
      { input: [[0, 0]], expected: 0, visible: false },
      { input: [[10, 9, 8, 7, 6]], expected: 24, visible: false },
      { input: [[2, 3, 4, 5, 18, 17, 6]], expected: 17, visible: false },
      { input: [[1, 8, 6, 2, 5, 4, 8, 25, 7]], expected: 49, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 6, title: 'Binary Search', difficulty: 'Easy', tags: ['Binary Search', 'Array'],
    description: 'Given a sorted ascending integer array `nums` and a `target`, return the index of `target` if found, else return `-1`. Must run in O(log n).',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number — index or -1',
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All unique, sorted ascending'],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    starterCode: `function search(nums, target) {\n  // Your solution here\n  \n}`,
    fnName: 'search',
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, visible: true },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, visible: true },
      { input: [[5], 5], expected: 0, visible: true },
      { input: [[1, 3, 5, 7, 9], 3], expected: 1, visible: false },
      { input: [[2, 4, 6, 8, 10], 7], expected: -1, visible: false },
      { input: [[1], 0], expected: -1, visible: false },
      { input: [[1, 2, 3, 4, 5], 1], expected: 0, visible: false },
      { input: [[1, 2, 3, 4, 5], 5], expected: 4, visible: false },
      { input: [[-10, -5, 0, 5, 10], 0], expected: 2, visible: false },
      { input: [[100, 200, 300], 200], expected: 1, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 7, title: 'Climbing Stairs', difficulty: 'Medium', tags: ['Dynamic Programming', 'Math'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    inputFormat: 'n: number',
    outputFormat: 'number — distinct ways',
    constraints: ['1 ≤ n ≤ 45'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '(1,1) or (2)' },
      { input: 'n = 3', output: '3', explanation: '(1,1,1), (1,2), (2,1)' },
    ],
    starterCode: `function climbStairs(n) {\n  // Your solution here\n  \n}`,
    fnName: 'climbStairs',
    testCases: [
      { input: [1], expected: 1, visible: true },
      { input: [2], expected: 2, visible: true },
      { input: [3], expected: 3, visible: true },
      { input: [4], expected: 5, visible: false },
      { input: [5], expected: 8, visible: false },
      { input: [6], expected: 13, visible: false },
      { input: [10], expected: 89, visible: false },
      { input: [15], expected: 987, visible: false },
      { input: [20], expected: 10946, visible: false },
      { input: [30], expected: 1346269, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 8, title: 'Reverse Linked List (Array)', difficulty: 'Easy', tags: ['Array', 'Recursion'],
    description: 'Given an array representing a linked list, return the reversed array. Implement both iterative and think about recursive approach.',
    inputFormat: 'head: number[]',
    outputFormat: 'number[] — reversed',
    constraints: ['0 ≤ length ≤ 5000', '-5000 ≤ val ≤ 5000'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
    ],
    starterCode: `function reverseList(head) {\n  // head is an array, return reversed array\n  \n}`,
    fnName: 'reverseList',
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], visible: true },
      { input: [[1, 2]], expected: [2, 1], visible: true },
      { input: [[1]], expected: [1], visible: true },
      { input: [[]], expected: [], visible: false },
      { input: [[3, 2, 1]], expected: [1, 2, 3], visible: false },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5], visible: false },
      { input: [[1, 1, 1]], expected: [1, 1, 1], visible: false },
      { input: [[0, -1, 2]], expected: [2, -1, 0], visible: false },
      { input: [[10, 20, 30, 40]], expected: [40, 30, 20, 10], visible: false },
      { input: [[7]], expected: [7], visible: false },
    ],
    compare: (r, e) => JSON.stringify(r) === JSON.stringify(e),
  },
  {
    id: 9, title: 'Maximum Subarray', difficulty: 'Medium', tags: ['Array', 'DP', "Kadane's Algorithm"],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. (Kadane\'s Algorithm)',
    inputFormat: 'nums: number[]',
    outputFormat: 'number — maximum sum',
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6.' },
      { input: 'nums = [1]', output: '1' },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Your solution here\n  \n}`,
    fnName: 'maxSubArray',
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, visible: true },
      { input: [[1]], expected: 1, visible: true },
      { input: [[5, 4, -1, 7, 8]], expected: 23, visible: true },
      { input: [[-1, -2, -3]], expected: -1, visible: false },
      { input: [[0]], expected: 0, visible: false },
      { input: [[-2, -1]], expected: -1, visible: false },
      { input: [[1, 2, 3, 4, 5]], expected: 15, visible: false },
      { input: [[2, -1, 2, 3, 4, -1]], expected: 10, visible: false },
      { input: [[-5, 3, -1, 4, -2]], expected: 6, visible: false },
      { input: [[8, -19, 5, -4, 20]], expected: 21, visible: false },
    ],
    compare: (r, e) => r === e,
  },
  {
    id: 10, title: 'Word Break', difficulty: 'Hard', tags: ['DP', 'Trie', 'Memoization'],
    description: 'Given string `s` and dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of dictionary words. Words may be reused.',
    inputFormat: 's: string, wordDict: string[]',
    outputFormat: 'boolean',
    constraints: ['1 ≤ s.length ≤ 300', '1 ≤ wordDict.length ≤ 1000'],
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
    ],
    starterCode: `function wordBreak(s, wordDict) {\n  // Your solution here\n  \n}`,
    fnName: 'wordBreak',
    testCases: [
      { input: ['leetcode', ['leet', 'code']], expected: true, visible: true },
      { input: ['applepenapple', ['apple', 'pen']], expected: true, visible: true },
      { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false, visible: true },
      { input: ['cars', ['car', 'ca', 'rs']], expected: true, visible: false },
      { input: ['aaaaaaa', ['aaaa', 'aaa']], expected: true, visible: false },
      { input: ['bb', ['a', 'b', 'bbb', 'bbbb']], expected: true, visible: false },
      { input: ['abcd', ['a', 'abc', 'b', 'cd']], expected: true, visible: false },
      { input: ['goalspecial', ['go', 'goal', 'goals', 'special']], expected: true, visible: false },
      { input: ['aaaaaaaaaaaaaab', ['a', 'aa', 'aaa', 'aaaa', 'aaaaa']], expected: false, visible: false },
      { input: ['hello', ['hell', 'o', 'hel', 'lo']], expected: true, visible: false },
    ],
    compare: (r, e) => r === e,
  },
];

// ── Real JS execution engine with console.log capture ────────────────────────
function executeCode(code, problem, submitAll) {
  const toRun = submitAll ? problem.testCases : problem.testCases.filter(t => t.visible);
  const results = [];
  let fn;

  // Capture all console.log calls
  const logs = [];
  const origLog = console.log;
  console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));

  try {
    // Provide safe CommonJS mocks so code that accidentally references
    // module / exports / require doesn't crash in the browser ESM context.
    const _module = { exports: {} };
    const _exports = _module.exports;
    const _require = () => { throw new Error('require() is not available — use ES module syntax'); };
    // eslint-disable-next-line no-new-func
    const _factory = new Function('module', 'exports', 'require',
      `${code}\nreturn (typeof ${problem.fnName} === 'function' ? ${problem.fnName} : undefined);`
    );
    fn = _factory(_module, _exports, _require);
    if (typeof fn !== 'function') throw new Error(`Function "${problem.fnName}" not found. Make sure it's declared with that exact name.`);
  } catch (err) {
    console.log = origLog;
    return { compileError: err.message, results: toRun.map((tc, i) => ({ id: i + 1, passed: false, visible: tc.visible, error: err.message })), logs };
  }

  for (let i = 0; i < toRun.length; i++) {
    const tc = toRun[i];
    const inputCopy = JSON.parse(JSON.stringify(tc.input));
    const t0 = performance.now();
    let got, error;
    try { got = fn(...inputCopy); }
    catch (e) { error = e.message; }
    const ms = (performance.now() - t0).toFixed(1);
    results.push({ id: problem.testCases.indexOf(tc) + 1, passed: error ? false : problem.compare(got, tc.expected), visible: tc.visible, got, expected: tc.expected, error, ms });
  }

  console.log = origLog;
  return { compileError: null, results, logs };
}

// ── UI constants ──────────────────────────────────────────────────────────────
const DC = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };
const DB = { Easy: '#052e16', Medium: '#422006', Hard: '#450a0a' };
const fmt = v => JSON.stringify(v);

// ─────────────────────────────────────────────────────────────────────────────
export default function CodeEditor() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(1);
  const [language, setLanguage] = useState('javascript');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  // codes keyed as `${problemId}::${langId}`
  const [codes, setCodes] = useState(() => {
    const init = {};
    PROBLEMS.forEach(p => {
      LANGUAGES.forEach(l => {
        const key = `${p.id}::${l.id}`;
        init[key] = l.id === 'javascript' ? p.starterCode : LANG_STARTERS[l.id](p.fnName);
      });
    });
    return init;
  });
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [solved, setSolved] = useState({});
  const [panel, setPanel] = useState('desc');   // desc | cases | result
  const [filter, setFilter] = useState('All');
  const editorRef = useRef(null);

  const prob = PROBLEMS.find(p => p.id === activeId);
  const codeKey = `${activeId}::${language}`;
  const code = codes[codeKey] ?? (language === 'javascript' ? prob.starterCode : LANG_STARTERS[language](prob.fnName));
  const setCode = useCallback(v => setCodes(p => ({ ...p, [codeKey]: v ?? '' })), [codeKey]);
  const langMeta = LANGUAGES.find(l => l.id === language);

  const selectProblem = id => { setActiveId(id); setResult(null); setPanel('desc'); };
  const switchLanguage = (langId) => { setLanguage(langId); setLangMenuOpen(false); setResult(null); };

  const handleRun = () => {
    if (language !== 'javascript') {
      setPanel('result');
      setResult({ __langNote: true, mode: 'run', lang: langMeta.label });
      return;
    }
    setRunning(true); setPanel('result');
    setTimeout(() => {
      setResult({ ...executeCode(code, prob, false), mode: 'run' });
      setRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    if (language !== 'javascript') {
      setPanel('result');
      setResult({ __langNote: true, mode: 'submit', lang: langMeta.label });
      return;
    }
    setSubmit(true); setPanel('result');
    setTimeout(() => {
      const res = executeCode(code, prob, true);
      setResult({ ...res, mode: 'submit' });
      const allPass = !res.compileError && res.results.every(r => r.passed);
      setSolved(s => ({ ...s, [activeId]: allPass ? 'ac' : 'wa' }));
      setSubmit(false);
    }, 700);
  };

  const filtered = filter === 'All' ? PROBLEMS : PROBLEMS.filter(p => p.difficulty === filter);
  const solvedCount = Object.values(solved).filter(v => v === 'ac').length;

  const summaryPassed = result ? result.results.filter(r => r.passed).length : 0;
  const summaryTotal = result ? result.results.length : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#0d1117', color: '#e6edf3', fontFamily: "'Inter',sans-serif", zIndex: 50 }}>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <div style={{ height: 48, background: '#161b22', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '0.82rem', padding: '4px 8px', borderRadius: 6 }}>
            <ChevronLeft size={16} /> Dashboard
          </button>
          <span style={{ color: '#30363d' }}>|</span>
          <div style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius: 6, padding: '3px 10px', fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>
            BIT Code
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', color: '#8b949e' }}>
          <span>✅ Solved: <b style={{ color: '#22c55e' }}>{solvedCount}</b>/10</span>
          <span style={{ color: '#eab308' }}>🟡 Medium: 4</span>
          <span style={{ color: '#ef4444' }}>🔴 Hard: 1</span>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── PROBLEM LIST ─────────────────────────────────────────────── */}
        <aside style={{ width: 240, flexShrink: 0, background: '#161b22', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #30363d' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button key={d} onClick={() => setFilter(d)} style={{ flex: 1, padding: '4px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, background: filter === d ? (DC[d] || '#6366f1') : '#0d1117', color: filter === d ? '#fff' : '#6e7681', transition: 'all 0.15s' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(p => {
              const st = solved[p.id];
              const isAct = p.id === activeId;
              return (
                <div key={p.id} onClick={() => selectProblem(p.id)} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #0d1117', background: isAct ? '#0d1117' : 'transparent', borderLeft: isAct ? '3px solid #6366f1' : '3px solid transparent', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = '#1c2128'; }}
                  onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.68rem', color: '#6e7681' }}>#{p.id}</span>
                    {st === 'ac' && <CheckCircle2 size={12} color="#22c55e" />}
                    {st === 'wa' && <XCircle size={12} color="#ef4444" />}
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', fontWeight: 600, color: isAct ? '#e6edf3' : '#8b949e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: DB[p.difficulty], color: DC[p.difficulty] }}>{p.difficulty}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── DESCRIPTION / RESULTS PANEL ──────────────────────────────── */}
        <section style={{ width: 360, flexShrink: 0, background: '#161b22', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #30363d', flexShrink: 0 }}>
            {[{ id: 'desc', label: '📄 Problem' }, { id: 'cases', label: '🧪 Tests' }, { id: 'result', label: '📊 Results' }].map(t => (
              <button key={t.id} onClick={() => setPanel(t.id)} style={{ flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: '0.75rem', fontWeight: 700, color: panel === t.id ? '#6366f1' : '#6e7681', borderBottom: panel === t.id ? '2px solid #6366f1' : '2px solid transparent', transition: 'all 0.15s' }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

            {/* DESCRIPTION */}
            {panel === 'desc' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#e6edf3' }}>{prob.id}. {prob.title}</h2>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: DB[prob.difficulty], color: DC[prob.difficulty] }}>{prob.difficulty}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {prob.tags.map(t => <span key={t} style={{ background: '#1f2937', color: '#93c5fd', padding: '2px 8px', borderRadius: 5, fontSize: '0.68rem', fontWeight: 600 }}>{t}</span>)}
                </div>
                <p style={{ color: '#8b949e', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: 14 }}>{prob.description}</p>

                <div style={{ background: '#0d1117', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.68rem', fontWeight: 700, color: '#6366f1' }}>INPUT</p>
                  <code style={{ color: '#a5b4fc', fontSize: '0.78rem' }}>{prob.inputFormat}</code>
                </div>
                <div style={{ background: '#0d1117', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.68rem', fontWeight: 700, color: '#22c55e' }}>OUTPUT</p>
                  <code style={{ color: '#86efac', fontSize: '0.78rem' }}>{prob.outputFormat}</code>
                </div>

                <p style={{ margin: '0 0 8px', fontSize: '0.68rem', fontWeight: 700, color: '#eab308' }}>CONSTRAINTS</p>
                {prob.constraints.map((c, i) => <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}><span style={{ color: '#eab308' }}>•</span><code style={{ color: '#fbbf24', fontSize: '0.76rem' }}>{c}</code></div>)}

                <p style={{ margin: '14px 0 8px', fontSize: '0.68rem', fontWeight: 700, color: '#8b949e' }}>EXAMPLES</p>
                {prob.examples.map((ex, i) => (
                  <div key={i} style={{ background: '#0d1117', borderRadius: 8, padding: 12, marginBottom: 8, borderLeft: '3px solid #30363d' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.68rem', color: '#6e7681', fontWeight: 700 }}>Example {i + 1}</p>
                    <div style={{ fontSize: '0.78rem', marginBottom: 2 }}><span style={{ color: '#6e7681' }}>Input: </span><code style={{ color: '#e6edf3' }}>{ex.input}</code></div>
                    <div style={{ fontSize: '0.78rem', marginBottom: ex.explanation ? 2 : 0 }}><span style={{ color: '#6e7681' }}>Output: </span><code style={{ color: '#22c55e' }}>{ex.output}</code></div>
                    {ex.explanation && <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#6e7681' }}>Explanation: {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* TEST CASES */}
            {panel === 'cases' && (
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: '#6e7681', fontWeight: 600 }}>
                  {prob.testCases.filter(t => t.visible).length} visible • {prob.testCases.length} total
                </p>
                {prob.testCases.map((tc, i) => (
                  <div key={i} style={{ background: '#0d1117', borderRadius: 8, padding: 12, marginBottom: 10, border: '1px solid #21262d' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e6edf3' }}>Test {i + 1}</span>
                      {tc.visible ? <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.68rem', color: '#22c55e' }}><Unlock size={10} />Visible</span>
                        : <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.68rem', color: '#6e7681' }}><Lock size={10} />Hidden</span>}
                    </div>
                    {tc.visible ? <>
                      <div style={{ marginBottom: 4 }}><span style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 700 }}>Input: </span><code style={{ color: '#a5b4fc', fontSize: '0.76rem', wordBreak: 'break-all' }}>{fmt(tc.input)}</code></div>
                      <div><span style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700 }}>Expected: </span><code style={{ color: '#86efac', fontSize: '0.76rem' }}>{fmt(tc.expected)}</code></div>
                    </> : <p style={{ color: '#484f58', fontSize: '0.76rem', margin: 0 }}>🔒 Revealed on Submit</p>}
                  </div>
                ))}
              </div>
            )}

            {/* RESULTS */}
            {panel === 'result' && (
              <div>
                {(running || submitting) ? (
                  <div style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ width: 44, height: 44, border: '3px solid #30363d', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                    <p style={{ color: '#6e7681', fontSize: '0.85rem' }}>{submitting ? 'Running all 10 test cases…' : 'Running visible test cases…'}</p>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </div>
                ) : !result ? (
                  <div style={{ textAlign: 'center', paddingTop: 60, color: '#484f58' }}>
                    <Target size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p style={{ fontSize: '0.85rem' }}>Run or Submit to see results</p>
                  </div>
                ) : result.__langNote ? (
                  <div style={{ paddingTop: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🖥️</div>
                    <h3 style={{ color: '#e6edf3', fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>
                      {result.lang} requires server-side compilation
                    </h3>
                    <p style={{ color: '#6e7681', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 260, margin: '0 auto 20px' }}>
                      In-browser execution only supports <b style={{ color: '#f59e0b' }}>JavaScript</b>.
                      For {result.lang}, write your solution here and submit — a judge server would compile and run it.
                    </p>
                    <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 10, padding: '12px 16px', textAlign: 'left', maxWidth: 280, margin: '0 auto' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '0.68rem', fontWeight: 700, color: '#6366f1' }}>💡 TIP</p>
                      <p style={{ margin: 0, color: '#8b949e', fontSize: '0.76rem', lineHeight: 1.6 }}>
                        Switch to <b style={{ color: '#f59e0b' }}>JavaScript</b> to test your logic instantly in the browser. Then rewrite it in {result.lang} for your final submission.
                      </p>
                    </div>
                  </div>
                ) : <>
                  {/* Summary */}
                  {result.compileError ? (
                    <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><AlertTriangle size={14} color="#ef4444" /><span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>Compile Error</span></div>
                      <code style={{ color: '#fca5a5', fontSize: '0.76rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.compileError}</code>
                    </div>
                  ) : (
                    <div style={{ borderRadius: 10, padding: 14, marginBottom: 16, background: summaryPassed === summaryTotal ? '#052e16' : '#450a0a', border: `1px solid ${summaryPassed === summaryTotal ? '#166534' : '#7f1d1d'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        {summaryPassed === summaryTotal ? <><Trophy size={18} color="#22c55e" /><span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.95rem' }}>{result.mode === 'submit' ? '🎉 Accepted!' : '✅ All Passed'}</span></>
                          : <><XCircle size={18} color="#ef4444" /><span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.95rem' }}>{result.mode === 'submit' ? 'Wrong Answer' : 'Some Tests Failed'}</span></>}
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', marginBottom: 10 }}>
                        <span style={{ color: '#8b949e' }}>Passed: <b style={{ color: '#22c55e' }}>{summaryPassed}</b>/{summaryTotal}</span>
                        <span style={{ color: '#8b949e' }}>Score: <b style={{ color: summaryPassed === summaryTotal ? '#22c55e' : '#eab308' }}>{Math.round(summaryPassed / summaryTotal * 100)}%</b></span>
                        {result.mode === 'run' && <span style={{ color: '#484f58', fontSize: '0.72rem' }}>(visible only)</span>}
                      </div>
                      <div style={{ height: 5, background: '#1c2128', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 10, width: `${summaryPassed / summaryTotal * 100}%`, background: summaryPassed === summaryTotal ? '#22c55e' : '#eab308', transition: 'width 0.6s' }} />
                      </div>
                    </div>
                  )}

                  {/* Per-case */}
                  {result.results.map(r => (
                    <div key={r.id} style={{ borderRadius: 8, padding: 10, marginBottom: 8, background: r.passed ? '#0d2818' : '#1c0a0a', border: `1px solid ${r.passed ? '#166534' : '#450a0a'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: (!r.passed && !r.error) ? 6 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {r.passed ? <CheckCircle2 size={13} color="#22c55e" /> : <XCircle size={13} color="#ef4444" />}
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: r.passed ? '#22c55e' : '#f87171' }}>Test {r.id} — {r.passed ? 'PASSED' : 'FAILED'}</span>
                          {!r.visible && result.mode === 'run' && <span style={{ fontSize: '0.65rem', color: '#484f58' }}>(hidden)</span>}
                        </div>
                        {r.ms && <span style={{ fontSize: '0.65rem', color: '#484f58', display: 'flex', alignItems: 'center', gap: 2 }}><Clock size={9} />{r.ms}ms</span>}
                      </div>
                      {!r.passed && !r.error && <div style={{ fontSize: '0.75rem', marginTop: 4 }}>
                        <div style={{ marginBottom: 2 }}><span style={{ color: '#6e7681' }}>Expected: </span><code style={{ color: '#86efac' }}>{fmt(r.expected)}</code></div>
                        <div><span style={{ color: '#6e7681' }}>Got: </span><code style={{ color: '#fca5a5' }}>{fmt(r.got)}</code></div>
                      </div>}
                      {r.error && <div style={{ marginTop: 4 }}><span style={{ color: '#6e7681', fontSize: '0.75rem' }}>Error: </span><code style={{ color: '#fca5a5', fontSize: '0.72rem' }}>{r.error}</code></div>}
                    </div>
                  ))}

                  {/* Console logs */}
                  {result.logs && result.logs.length > 0 && (
                    <div style={{ marginTop: 12, background: '#0d1117', borderRadius: 8, padding: 12 }}>
                      <p style={{ margin: '0 0 8px', fontSize: '0.7rem', fontWeight: 700, color: '#6e7681' }}>CONSOLE</p>
                      {result.logs.map((l, i) => <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#8b949e', marginBottom: 2 }}>&gt; {l}</div>)}
                    </div>
                  )}
                </>}
              </div>
            )}
          </div>
        </section>

        {/* ── CODE EDITOR ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* toolbar */}
          <div style={{ height: 40, background: '#161b22', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 8, color: '#6e7681', fontSize: '0.76rem', fontFamily: 'monospace' }}>
                solution.{langMeta.ext}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* ── Language switcher ── */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setLangMenuOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 6,
                    border: '1px solid #30363d', background: '#21262d',
                    color: '#e6edf3', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <Cpu size={12} />
                  {langMeta.icon} {langMeta.label}
                  <ChevronDown size={11} style={{ opacity: 0.6 }} />
                </button>

                {langMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 100,
                    background: '#161b22', border: '1px solid #30363d',
                    borderRadius: 8, overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 140,
                  }}>
                    {LANGUAGES.map(l => (
                      <button
                        key={l.id}
                        onClick={() => switchLanguage(l.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          gap: 8, padding: '8px 14px', border: 'none',
                          background: language === l.id ? '#21262d' : 'transparent',
                          color: language === l.id ? '#e6edf3' : '#8b949e',
                          fontSize: '0.8rem', fontWeight: language === l.id ? 700 : 500,
                          cursor: 'pointer', textAlign: 'left',
                          borderLeft: language === l.id ? '2px solid #6366f1' : '2px solid transparent',
                        }}
                        onMouseEnter={e => { if (language !== l.id) e.currentTarget.style.background = '#1c2128'; }}
                        onMouseLeave={e => { if (language !== l.id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{l.icon}</span>
                        {l.label}
                        {language === l.id && <span style={{ marginLeft: 'auto', color: '#6366f1', fontSize: '0.65rem' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setCode(language === 'javascript' ? prob.starterCode : LANG_STARTERS[language](prob.fnName))} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 5, border: '1px solid #30363d', background: 'transparent', color: '#8b949e', fontSize: '0.72rem', cursor: 'pointer' }}>
                <RefreshCw size={11} /> Reset
              </button>
            </div>
          </div>

          {/* Monaco editor */}
          <div style={{ flex: 1, overflow: 'hidden' }} onClick={() => langMenuOpen && setLangMenuOpen(false)}>
            <Editor
              height="100%"
              language={langMeta.monacoId}
              theme="vs-dark"
              value={code}
              onChange={setCode}
              onMount={e => (editorRef.current = e)}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                tabSize: language === 'java' ? 4 : 2,
                wordWrap: 'on',
                padding: { top: 12 },
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* action bar */}
          <div style={{ height: 52, background: '#161b22', borderTop: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px', gap: 10, flexShrink: 0 }}>
            <button onClick={handleRun} disabled={running || submitting} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 22px', borderRadius: 7, border: '1px solid #30363d', background: '#21262d', color: running || submitting ? '#484f58' : '#e6edf3', fontWeight: 700, fontSize: '0.85rem', cursor: running || submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
              <Play size={14} />{running ? 'Running…' : 'Run'}
            </button>
            <button onClick={handleSubmit} disabled={running || submitting} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 26px', borderRadius: 7, border: 'none', background: running || submitting ? '#1a3a1a' : 'linear-gradient(135deg,#238636,#2ea043)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: running || submitting ? 'not-allowed' : 'pointer', opacity: running || submitting ? 0.6 : 1, boxShadow: running || submitting ? 'none' : '0 0 14px rgba(46,160,67,0.35)', transition: 'all 0.15s' }}>
              <Send size={14} />{submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
