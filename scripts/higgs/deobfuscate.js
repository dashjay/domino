#!/usr/bin/env node
/**
 * 还原 index.6efa3.js 的字符串切片混淆，便于 grep 定位业务代码。
 *
 * 该 bundle 把每个标识符/字符串都切成 10 字符片段再拼接：
 *     this['m_pPlayerI' + 'nfo'][1]['GetServerT' + 'ablePos']()
 * 导致直接搜索 `GetServerTablePos` 零命中。本脚本反复合并相邻的字符串
 * 字面量（一个名字可能被切成 3 段以上），只做词法变换，不改变语义。
 *
 * 用法：
 *     node deobfuscate.js index.6efa3.js /tmp/index.deobf.js
 *     rg -n "CallBackSendCard" /tmp/index.deobf.js
 */
const fs = require('fs');

const [, , input, output] = process.argv;
if (!input || !output) {
    console.error('用法: node deobfuscate.js <输入.js> <输出.js>');
    process.exit(1);
}

const joinPair = /'((?:[^'\\]|\\.)*)'\s*\+\s*'((?:[^'\\]|\\.)*)'/g;
let text = fs.readFileSync(input, 'utf8');
let rounds = 0;
for (; rounds < 16; rounds++) {
    const next = text.replace(joinPair, (_, a, b) => `'${a}${b}'`);
    if (next === text) break;
    text = next;
}

fs.writeFileSync(output, text);
console.log(`${input} -> ${output}（合并 ${rounds} 轮）`);
