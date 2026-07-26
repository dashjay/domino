// ==UserScript==
// @name         Higgs Domino
// @namespace    http://tampermonkey.net/
// @version      2026-07-26.2
// @description  Domino autoplay via domino.cli.serve /analyze + 对局轨迹实时入库 /ingest
// @author       You
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @run-at       document-start
// @match        https://web.topbos.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=topbos.com
// ==/UserScript==

(function () {
    'use strict';

    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 保存原始的 debugger 行为
    const originalDebugger = Function.prototype.constructor;
    // 覆盖 Function 构造函数，阻止 debugger 的调用
    Function.prototype.constructor = function (...args) {
        if (args.join('').includes('debugger')) {
            // console.warn('Debugger call detected and blocked.');
            f()
            return;
        }
        return originalDebugger.apply(this, args);
    };

    console.warn('Debugger prevention script loaded.');




    // 使用闭包保护我们的变量
    const PROTECTED_SCOPE = (function () {
        // 保存原始的控制台方法
        const originalConsole = {
            log: console.log.bind(console),
            warn: console.warn.bind(console),
            debug: console.debug.bind(console),
            info: console.info.bind(console),
            error: console.error.bind(console),
            exception: console.exception ? console.exception.bind(console) : console.error.bind(console),
            table: console.table.bind(console),
            trace: console.trace.bind(console)
        };

        // 保存原始的计时器方法
        const originalSetInterval = window.setInterval.bind(window);
        const originalClearInterval = window.clearInterval.bind(window);
        const originalSetTimeout = window.setTimeout.bind(window);
        const originalClearTimeout = window.clearTimeout.bind(window);

        // 保存原始的Function构造函数
        const OriginalFunction = window.Function;

        // 保存原始的防调试检测函数
        let originalOWmPK = null;
        if (typeof window.oWmPK === 'function') {
            originalOWmPK = window.oWmPK;
        }

        // 创建一个隐藏的iframe来存储我们的代码和状态
        function createHiddenFrame() {
            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.documentElement.appendChild(iframe);

                // 在iframe中存储我们的函数和状态
                const iframeWindow = iframe.contentWindow;
                iframeWindow.originalConsole = originalConsole;
                iframeWindow.originalSetInterval = originalSetInterval;
                iframeWindow.originalSetTimeout = originalSetTimeout;

                return iframe;
            } catch (e) {
                originalConsole.error('创建隐藏iframe失败:', e);
                return null;
            }
        }

        // 使用Web Worker作为另一种保护机制
        function createWorker() {
            try {
                const workerCode = `
                    let active = true;

                    // 每100毫秒发送一次心跳
                    setInterval(() => {
                        if (active) {
                            self.postMessage({type: 'heartbeat', time: Date.now()});
                        }
                    }, 100);

                    // 接收消息
                    self.onmessage = function(e) {
                        if (e.data.type === 'ping') {
                            self.postMessage({type: 'pong', time: Date.now()});
                        } else if (e.data.type === 'restore') {
                            self.postMessage({type: 'restore', time: Date.now()});
                        }
                    };
                `;

                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const workerUrl = URL.createObjectURL(blob);
                const worker = new Worker(workerUrl);

                worker.onmessage = function (e) {
                    if (e.data.type === 'heartbeat') {
                        // 每次收到心跳时恢复控制台
                        restoreConsole();
                    } else if (e.data.type === 'restore') {
                        // 强制恢复所有被修改的函数
                        restoreAllFunctions();
                    }
                };

                // 定期发送ping以保持worker活跃
                originalSetInterval(() => {
                    worker.postMessage({ type: 'ping' });
                }, 1000);

                return worker;
            } catch (e) {
                originalConsole.error('创建Web Worker失败:', e);
                return null;
            }
        }

        // 使用MutationObserver作为另一种触发机制
        function setupMutationObserver() {
            try {
                const observer = new MutationObserver((mutations) => {
                    // 每当DOM变化时恢复控制台
                    restoreConsole();
                });

                // 观察body的变化
                observer.observe(document.documentElement || document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });

                return observer;
            } catch (e) {
                originalConsole.error('设置MutationObserver失败:', e);
                return null;
            }
        }

        // 使用ServiceWorker作为另一种保护机制（如果可用）
        function setupServiceWorker() {
            try {
                if ('serviceWorker' in navigator) {
                    // 创建一个简单的ServiceWorker代码
                    const swCode = `
                        self.addEventListener('install', event => {
                            self.skipWaiting();
                        });

                        self.addEventListener('activate', event => {
                            event.waitUntil(self.clients.claim());
                        });

                        // 每秒发送一次消息
                        setInterval(() => {
                            self.clients.matchAll().then(clients => {
                                clients.forEach(client => {
                                    client.postMessage({type: 'sw-heartbeat', time: Date.now()});
                                });
                            });
                        }, 1000);

                        self.addEventListener('message', event => {
                            if (event.data.type === 'ping') {
                                event.source.postMessage({type: 'pong', time: Date.now()});
                            }
                        });
                    `;

                    const blob = new Blob([swCode], { type: 'application/javascript' });
                    const swUrl = URL.createObjectURL(blob);

                    navigator.serviceWorker.register(swUrl).then(registration => {
                        originalConsole.log('ServiceWorker注册成功:', registration);

                        // 监听来自ServiceWorker的消息
                        navigator.serviceWorker.addEventListener('message', event => {
                            if (event.data.type === 'sw-heartbeat') {
                                restoreConsole();
                            }
                        });

                        // 定期发送ping
                        originalSetInterval(() => {
                            if (navigator.serviceWorker.controller) {
                                navigator.serviceWorker.controller.postMessage({ type: 'ping' });
                            }
                        }, 1000);
                    }).catch(error => {
                        originalConsole.error('ServiceWorker注册失败:', error);
                    });
                }
            } catch (e) {
                originalConsole.error('设置ServiceWorker失败:', e);
            }
        }

        // 使用TemperMonkey的GM_setValue和GM_getValue作为另一种存储和通信机制
        function setupTMStorage() {
            try {
                // 设置一个心跳计数器
                GM_setValue('heartbeat', Date.now());

                // 监听值变化
                GM_addValueChangeListener('heartbeat', (name, old_value, new_value, remote) => {
                    restoreConsole();
                });

                // 定期更新心跳
                originalSetInterval(() => {
                    GM_setValue('heartbeat', Date.now());
                }, 500);

                // 添加一个菜单命令来手动恢复
                GM_registerMenuCommand('手动恢复控制台', () => {
                    restoreAllFunctions();
                    originalConsole.log('%c[手动恢复] 已恢复所有函数', 'color: green; font-weight: bold');
                });
            } catch (e) {
                originalConsole.error('设置TM存储失败:', e);
            }
        }

        // 防止调试器检测
        function preventDebuggerDetection() {
            // 覆盖Function.prototype.toString以隐藏我们的修改
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = function () {
                // 对于我们修改过的函数，返回原始的toString结果
                if (this.isProtected) {
                    return this.originalToString || 'function() { [native code] }';
                }
                return originalToString.apply(this, arguments);
            };

            // 覆盖Function构造函数，拦截可能的调试器检测
            window.Function = function () {
                const args = Array.from(arguments);
                const body = args[args.length - 1];

                // 检测反调试代码
                if (typeof body === 'string') {
                    // 检测调试器检测代码
                    if (body.includes('debugger') ||
                        body.includes('console.clear') ||
                        body.includes('console') && (body.includes('=') || body.includes('function'))) {
                        originalConsole.warn('%c[拦截] 检测到反调试代码', 'color: red', body);

                        // 返回一个无害的函数
                        const safeFn = function () { return true; };
                        safeFn.isProtected = true;
                        return safeFn;
                    }
                }

                // 对于正常代码，使用原始的Function构造函数
                return OriginalFunction.apply(this, arguments);
            };

            // 保持Function的原型链
            window.Function.prototype = OriginalFunction.prototype;
            window.Function.isProtected = true;

            // 覆盖oWmPK函数（如果存在）
            if (originalOWmPK) {
                window.oWmPK = function () {
                    originalConsole.log('%c[拦截] oWmPK函数被调用', 'color: orange');
                    // 返回一个无害的结果
                    return 'function() { [native code] }';
                };
                window.oWmPK.isProtected = true;
            }

            // 拦截debugger语句
            const originalEval = window.eval;
            window.eval = function (code) {
                if (typeof code === 'string' && code.includes('debugger')) {
                    originalConsole.warn('%c[拦截] 拦截了eval中的debugger语句', 'color: red');
                    code = code.replace(/debugger/g, '// debugger被拦截');
                }
                return originalEval(code);
            };
            window.eval.isProtected = true;
        }

        // 恢复控制台方法
        function restoreConsole() {
            for (const method in originalConsole) {
                if (console[method] !== originalConsole[method]) {
                    console[method] = originalConsole[method];
                }
            }
        }

        // 恢复所有被修改的函数
        function restoreAllFunctions() {
            // 恢复控制台
            restoreConsole();

            // 恢复计时器函数
            if (window.setTimeout !== originalSetTimeout) {
                window.setTimeout = originalSetTimeout;
            }
            if (window.setInterval !== originalSetInterval) {
                window.setInterval = originalSetInterval;
            }
            if (window.clearTimeout !== originalClearTimeout) {
                window.clearTimeout = originalClearTimeout;
            }
            if (window.clearInterval !== originalClearInterval) {
                window.clearInterval = originalClearInterval;
            }

            // 重新应用防调试检测保护
            preventDebuggerDetection();
        }

        function hookProtoFn(F, name, fn) {
            const raw_func = F.prototype[name];
            F.prototype[name] = function (...args) {
                if (!fn) {
                    return raw_func.apply(this, args);
                }
                return fn.call(this, raw_func, ...args);
            };
            F.prototype[name].toString = () => raw_func.toString();
        }


        const hookdProps = {};



        function hookProperty(
            target,
            prop,
            onSet
        ) {
            const key = prop + "_" + new Date();
            if (target.hasOwnProperty(prop)) {
                hookdProps[key] = target[prop];

                if (onSet) {
                    let newValue = onSet(hookdProps[key]);
                    if (newValue !== undefined) {
                        hookdProps[key] = newValue;
                    }
                }

                target[prop] = hookdProps[key];
                return;
            }

            Object.defineProperty(target, prop, {
                configurable: true,
                enumerable: true,
                set: function (value) {
                    hookdProps[key] = value;

                    if (onSet) {
                        let newValue = onSet(value);
                        if (newValue !== undefined) {
                            hookdProps[key] = newValue;
                        }
                    }
                },
                get: function () {
                    return hookdProps[key];
                },
            });
        }

        function hookHttpMethods() {
            const checkHttpManager = originalSetInterval(() => {
                try {
                    if (typeof pageWindow.__require !== 'function') {
                        return;
                    }

                    var HttpManager = pageWindow.__require('./Network/HttpManager');

                    hookProtoFn(HttpManager.default, 'HttpGet', function (raw_func, ...args) {
                        originalConsole.log("[HTTP Hook] HttpGet被调用: ", JSON.stringify([...args]));
                        return raw_func.apply(this, args);
                    });

                    hookProtoFn(HttpManager.default, 'HttpPost', function (raw_func, ...args) {
                        originalConsole.log("[HTTP Hook] HttpPost被调用: ", JSON.stringify([...args]));
                        return raw_func.apply(this, args);
                    });

                    hookProperty(HttpManager.default.GetInstance(), 'HttpGet', (originalFn) => {
                        return function (...args) {
                            originalConsole.log("[HTTP Hook] HttpGet被调用: ", JSON.stringify(args));
                            return originalFn.apply(this, args);
                        };
                    });

                    hookProperty(HttpManager.default.GetInstance(), 'HttpPost', (originalFn) => {
                        return function (...args) {
                            originalConsole.log("[HTTP Hook] HttpPost被调用: ", JSON.stringify(args));
                            return originalFn.apply(this, args);
                        };
                    });

                    originalConsole.log('%c[HTTP Hook] HttpManager Hook 成功...', 'color: cyan; font-weight: bold');
                    originalClearInterval(checkHttpManager);
                } catch (e) {
                    // __require 尚未就绪时静默重试
                }
            }, 200);
        }

        // ---- WebSocket 协议日志 ----
        // 默认关闭：不再累积原始帧，只做协议解析。需要抓包时 __wsLog.enable()
        const WS_LOG_MAX = 800;
        const wsLogEntries = [];
        let wsLogEnabled = false;
        let wsSocketSeq = 0;

        function bytesToHex(bytes, maxLen) {
            const lim = Math.min(bytes.length, maxLen || 64);
            let hex = '';
            for (let i = 0; i < lim; i++) {
                hex += bytes[i].toString(16).padStart(2, '0');
                if (i + 1 < lim) hex += ' ';
            }
            if (bytes.length > lim) hex += ' …';
            return hex;
        }

        function summarizePayload(data) {
            if (data == null) {
                return { type: 'null', length: 0, preview: '' };
            }
            if (typeof data === 'string') {
                return {
                    type: 'string',
                    length: data.length,
                    preview: data.length > 200 ? data.slice(0, 200) + '…' : data,
                    text: data,
                };
            }
            if (data instanceof ArrayBuffer) {
                const u8 = new Uint8Array(data);
                return {
                    type: 'ArrayBuffer',
                    length: u8.length,
                    preview: bytesToHex(u8),
                    hex: bytesToHex(u8, u8.length),
                    bytes: Array.from(u8),
                };
            }
            if (ArrayBuffer.isView(data)) {
                const u8 = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
                return {
                    type: data.constructor.name,
                    length: u8.length,
                    preview: bytesToHex(u8),
                    hex: bytesToHex(u8, u8.length),
                    bytes: Array.from(u8),
                };
            }
            if (typeof Blob !== 'undefined' && data instanceof Blob) {
                return {
                    type: 'Blob',
                    length: data.size,
                    preview: `Blob(${data.size}, ${data.type || 'unknown'})`,
                    blob: data,
                };
            }
            return {
                type: typeof data,
                length: 0,
                preview: String(data),
            };
        }

        function pushWsLog(entry) {
            wsLogEntries.push(entry);
            if (wsLogEntries.length > WS_LOG_MAX) {
                wsLogEntries.splice(0, wsLogEntries.length - WS_LOG_MAX);
            }
            if (pageWindow.__wsLog) {
                pageWindow.__wsLog.entries = wsLogEntries;
                pageWindow.__wsLog.last = entry;
            }
        }

        function logWs(dir, sockId, url, summary, raw) {
            if (!wsLogEnabled) return;
            const entry = {
                t: Date.now(),
                iso: new Date().toISOString(),
                dir, // '→' send | '←' recv | 'open' | 'close' | 'error'
                sockId,
                url,
                type: summary.type,
                length: summary.length,
                preview: summary.preview,
                hex: summary.hex,
                text: summary.text,
                bytes: summary.bytes,
            };
            pushWsLog(entry);

            const api = pageWindow.__wsLog;
            // 默认 quiet=true：不打印二进制，只记入 __wsLog；对局事件走 [Domino] 日志
            if (!api || api.quiet !== false) return;
            if (api.filterDir && api.filterDir !== dir && dir !== 'open' && dir !== 'close' && dir !== 'error') {
                return;
            }

            const style =
                dir === '→' ? 'color:#0a0;font-weight:bold' :
                dir === '←' ? 'color:#06c;font-weight:bold' :
                dir === 'error' ? 'color:red;font-weight:bold' :
                'color:#888;font-weight:bold';

            originalConsole.log(
                `%c[WS ${dir}] #%${sockId} ${summary.type || ''} len=${summary.length || 0}`,
                style,
                summary.preview || '',
                raw !== undefined ? raw : ''
            );
        }

        async function resolvePayload(data) {
            const summary = summarizePayload(data);
            if (summary.blob) {
                try {
                    const buf = await summary.blob.arrayBuffer();
                    const u8 = new Uint8Array(buf);
                    return {
                        type: 'Blob→ArrayBuffer',
                        length: u8.length,
                        preview: bytesToHex(u8),
                        hex: bytesToHex(u8, u8.length),
                        bytes: Array.from(u8),
                    };
                } catch (e) {
                    return summary;
                }
            }
            return summary;
        }

        // ---- Domino 协议解析 + 对局状态 / TUI ----
        // 帧: 03 | dir(00=C→S,01=S→C) | len_be16 | 03 00 00 00 | cmd_be16 | pad6 | payload
        // 牌: 一字节高/低半字节 = [A|B]；出牌 side: 0=左端 1=右端
        // 已知 cmd: 10a0发牌 11a0轮次 12a0出牌请求 13a0出牌广播 20a0结算

        function tileStr(t) {
            if (t == null || t < 0) return '??';
            return '[' + (t >> 4) + '|' + (t & 0xf) + ']';
        }

        // 牌编号：协议字节，如 0x35 → id "35" / 面值 [3|5]
        function tileId(t) {
            if (t == null || t < 0) return '??';
            return (t & 0xff).toString(16).padStart(2, '0');
        }

        function tileLabel(t) {
            if (t == null || t < 0) return '??';
            return tileId(t) + tileStr(t);
        }

        function logDomino(msg, style) {
            originalConsole.log('%c[Domino] ' + msg, style || 'color:#0a0;font-weight:bold');
        }

        function createGameState() {
            return {
                mySeat: null,
                dealerSeat: null,
                turnSeat: null,
                hand: [],
                counts: [0, 0, 0, 0],
                board: [],       // oriented [leftPip, rightPip] left→right
                leftEnd: null,
                rightEnd: null,
                history: [],    // {seat, action, tile, side}
                // 各座位因 PASS 已确认没有的点数（供 /analyze missing）
                missingPips: [[], [], [], []],
                // 收到接不上牌链的广播时置位：说明中间漏收过帧，board/counts 不再可信
                desynced: false,
                status: 'idle', // idle|playing|ended
                lastCmd: null,
            };
        }

        function addMissingPip(seat, pip) {
            if (seat == null || pip == null || pip < 0) return;
            const arr = gameState.missingPips[seat];
            if (arr && arr.indexOf(pip) < 0) arr.push(pip);
        }

        let gameState = createGameState();

        function resetGame(partial) {
            const next = createGameState();
            if (partial) Object.assign(next, partial);
            gameState = next;
            return gameState;
        }

        function splitProtocolFrames(u8) {
            const frames = [];
            let i = 0;
            while (i + 4 <= u8.length) {
                if (u8[i] !== 0x03) {
                    i += 1;
                    continue;
                }
                const len = (u8[i + 2] << 8) | u8[i + 3];
                // 长度不合法说明这个 0x03 只是载荷里的普通字节，继续往后找同步点。
                // 早先这里直接 break，会把同一条消息里后面的 13a0 广播一起丢掉
                if (len < 10) {
                    i += 1;
                    continue;
                }
                if (i + len > u8.length) break; // 真·截断帧
                frames.push(u8.subarray(i, i + len));
                i += len;
            }
            return frames;
        }

        function attachTile(tile, side) {
            const a = tile >> 4;
            const b = tile & 0xf;
            if (gameState.leftEnd == null) {
                gameState.board = [[a, b]];
                gameState.leftEnd = a;
                gameState.rightEnd = b;
                return true;
            }
            const preferLeft = side === 0;
            const ends = preferLeft ? ['L', 'R'] : ['R', 'L'];
            for (let e = 0; e < ends.length; e++) {
                const end = ends[e];
                if (end === 'L' && (a === gameState.leftEnd || b === gameState.leftEnd)) {
                    if (a === gameState.leftEnd) {
                        gameState.board.unshift([b, a]);
                        gameState.leftEnd = b;
                    } else {
                        gameState.board.unshift([a, b]);
                        gameState.leftEnd = a;
                    }
                    return true;
                }
                if (end === 'R' && (a === gameState.rightEnd || b === gameState.rightEnd)) {
                    if (a === gameState.rightEnd) {
                        gameState.board.push([a, b]);
                        gameState.rightEnd = b;
                    } else {
                        gameState.board.push([b, a]);
                        gameState.rightEnd = a;
                    }
                    return true;
                }
            }
            return false;
        }

        function removeFromHand(tile) {
            const idx = gameState.hand.indexOf(tile);
            if (idx >= 0) gameState.hand.splice(idx, 1);
        }

        function applyPlay(seat, action, tile, side) {
            if (action === 0 || tile === 0xff) {
                // 过牌 ⇒ 当时两端点数该座位都没有
                if (gameState.leftEnd != null) {
                    addMissingPip(seat, gameState.leftEnd);
                    addMissingPip(seat, gameState.rightEnd);
                }
                gameState.history.push({
                    seat: seat,
                    action: 'PASS',
                    tile: null,
                    side: side,
                    left: gameState.leftEnd,
                    right: gameState.rightEnd,
                });
                return;
            }
            const ok = attachTile(tile, side);
            if (!ok) {
                gameState.desynced = true;
                originalConsole.warn(
                    '[Domino] 牌链对不上：' + tileLabel(tile) +
                    ' 接不到两端 ' + gameState.leftEnd + '|' + gameState.rightEnd +
                    '（漏收了广播，已标记 desynced）'
                );
            }
            gameState.history.push({
                seat: seat,
                action: ok ? 'PLAY' : 'PLAY?',
                tile: tile,
                side: side,
            });
            if (gameState.counts[seat] > 0) gameState.counts[seat] -= 1;
            if (seat === gameState.mySeat) removeFromHand(tile);
        }

        function handleDominoFrame(frame, dir) {
            if (frame.length < 16) return null;
            const cmd = (frame[8] << 8) | frame[9];
            const payload = frame.subarray(16);
            const info = { cmd: cmd.toString(16), dir: dir, payloadLen: payload.length };
            gameState.lastCmd = info.cmd;

            // 10a0: deal — [dealerOrFlag, count, tiles...]
            if (cmd === 0x10a0 && payload.length >= 2) {
                const flag = payload[0];
                const n = payload[1];
                const tiles = Array.from(payload.subarray(2, 2 + n));
                // 新一局必须清空 mySeat / GameView 缓存，否则会沿用上一局座位导致 AI 永远不对
                gameViewRef = null;
                playInFlight = false;
                pendingPlay = null;
                aiRequestInFlight = false;
                turnEpoch += 1;
                startGameLog(flag, tiles);
                resetGame({
                    mySeat: null,
                    dealerSeat: flag,
                    hand: tiles.slice(),
                    counts: [7, 7, 7, 7],
                    status: 'playing',
                });
                info.kind = 'DEAL';
                info.tiles = tiles.map(tileLabel);
                logDomino(
                    '发牌 dealer=S' + flag + ' 手牌: ' + tiles.map(tileLabel).join(' ') +
                    '（已重置 mySeat，等待座位校准）',
                    'color:#c60;font-weight:bold'
                );
                // 发牌后尝试从客户端座位表校准
                originalSetTimeout(syncMySeatFromClient, 300);
                return info;
            }

            // 11a0: turn seat (u8/u32)
            if (cmd === 0x11a0 && payload.length >= 1) {
                gameState.turnSeat = payload[0];
                info.kind = 'TURN';
                info.seat = payload[0];
                // 任意转手都作废旧 AI 请求；轮到自己时开启新 epoch
                turnEpoch += 1;
                playInFlight = false;
                if (pendingPlay != null) {
                    // 没等到自己的 13a0 就转手了：这一手多半没被服务器接受
                    originalConsole.warn(
                        '[Domino] ' + tileLabel(pendingPlay) + ' 未收到出牌确认就轮到 S' +
                        payload[0] + '，手牌可能已与服务器分叉'
                    );
                    pendingPlay = null;
                }
                logDomino(
                    '轮到 ' + seatLabel(payload[0]) + ' (S' + payload[0] + ') epoch=' + turnEpoch,
                    'color:#888'
                );
                maybeRequestAiSuggest();
                return info;
            }

            // 12a0: my play request — 只要是我们发出的出牌包，turnSeat 就是自己的服务器座位
            if (cmd === 0x12a0 && payload.length >= 3) {
                const action = payload[0];
                const tile = payload[1];
                const side = payload[2];
                if (gameState.turnSeat != null) {
                    gameState.mySeat = gameState.turnSeat;
                }
                info.kind = action ? 'MY_PLAY' : 'MY_PASS';
                info.tile = action ? tileLabel(tile) : null;
                info.side = side;
                logActualAction(action ? 'play' : 'pass', action ? tile : null, side);
                if (action) {
                    logDomino(
                        '我出牌 → ' + tileLabel(tile) + ' side=' + (side === 0 ? '左' : '右') +
                        ' mySeat=S' + gameState.mySeat,
                        'color:#0a0;font-weight:bold'
                    );
                } else {
                    logDomino('我过牌 → PASS mySeat=S' + gameState.mySeat, 'color:#0a0;font-weight:bold');
                }
                return info;
            }

            // 13a0: play broadcast
            if (cmd === 0x13a0 && payload.length >= 4) {
                const seat = payload[0];
                const action = payload[1];
                const tile = payload[2];
                const side = payload[3];
                if (action && gameState.mySeat == null && gameState.hand.indexOf(tile) >= 0) {
                    gameState.mySeat = seat;
                }
                applyPlay(seat, action, tile, side);
                info.kind = action ? 'PLAY' : 'PASS';
                info.seat = seat;
                info.tile = action ? tileLabel(tile) : null;
                info.side = side;
                if (seat === gameState.mySeat) {
                    playInFlight = false;
                    pendingPlay = null;
                }
                const who = seatLabel(seat) + '(S' + seat + ')';
                if (action && tile !== 0xff) {
                    logDomino(
                        who + ' 出 ' + tileLabel(tile) +
                        ' →' + (side === 0 ? '左' : '右') +
                        '  桌面两端 ' + gameState.leftEnd + '|' + gameState.rightEnd +
                        '  剩余[' + gameState.counts.join(',') + ']',
                        'color:#06c;font-weight:bold'
                    );
                } else {
                    logDomino(who + ' 过牌 PASS', 'color:#06c');
                }
                logMove(seat, action ? 'PLAY' : 'PASS', action ? tile : null, side);
                return info;
            }

            // 20a0: round result / dead end
            if (cmd === 0x20a0) {
                gameState.status = 'ended';
                aiRequestInFlight = false;
                info.kind = 'RESULT';
                const result = parseResultPayload(payload);
                info.result = result;
                const done = finishGameLog(result);
                if (done) {
                    const s = summarizeGameLog(done);
                    logDomino(
                        '本局结束 #' + s.gameId +
                        ' mySeat=S' + s.mySeat +
                        ' 剩' + s.myRemaining + '张/' + s.myPips + '点' +
                        ' 输赢=' + s.delta +
                        ' AI决策' + s.followedAi + '/' + s.decisions +
                        ' 均胜率=' + s.avgWinRate +
                        ' 均EV=' + s.avgEv +
                        ' 最大延迟=' + s.maxLatencyMs + 'ms',
                        'color:#c00;font-weight:bold'
                    );
                } else {
                    logDomino(
                        '本局结束 手牌: ' + gameState.hand.map(tileLabel).join(' ') +
                        '  人数[' + gameState.counts.join(',') + ']',
                        'color:#c00;font-weight:bold'
                    );
                }
                return info;
            }

            return info;
        }

        function ingestWsBinary(dir, summary) {
            if (!summary || !summary.bytes || !summary.bytes.length) return;
            if (summary.bytes[0] !== 0x03) return;
            const u8 = summary.bytes instanceof Uint8Array
                ? summary.bytes
                : new Uint8Array(summary.bytes);
            const frames = splitProtocolFrames(u8);
            for (let i = 0; i < frames.length; i++) {
                try {
                    handleDominoFrame(frames[i], dir);
                } catch (err) {
                    originalConsole.warn('[Domino] parse error', err);
                }
            }
        }

        // 同步取出帧里的出牌/过牌请求 12a0（必须在 send 当下抓栈，Promise 之后栈就丢了）
        function findFrameByCmd(u8, cmdHi, cmdLo) {
            const frames = splitProtocolFrames(u8);
            for (let i = 0; i < frames.length; i++) {
                const f = frames[i];
                if (f.length >= 10 && f[8] === cmdHi && f[9] === cmdLo) return f;
            }
            return null;
        }

        function dataToU8Sync(data) {
            if (!data) return null;
            if (data instanceof ArrayBuffer) return new Uint8Array(data);
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            return null; // Blob 无法同步读，出牌一般是 ArrayBuffer
        }

        // 出牌调用栈：默认只记不打印（__dominoNet.playStackLog = true 才刷屏）。
        // 留着是因为游戏改版后还得靠它重新定位业务出牌函数
        const PLAY_STACK_MAX = 50;
        const playStackEntries = [];

        function cleanStackFrames(rawStack) {
            const stack = (rawStack || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
            // 去掉 Error / 本 hook 自身几帧，突出游戏业务栈
            const skipRe = /cleanStackFrames|recordPlayCallStack|PatchedWebSocket|dataToU8Sync|findFrameByCmd|tampermonkey|userscript|chrome-extension/i;
            const frames = [];
            for (let i = 0; i < stack.length; i++) {
                const line = stack[i];
                if (i === 0 && /^Error/.test(line)) continue;
                if (skipRe.test(line)) continue;
                frames.push(line);
            }
            return frames;
        }

        function recordPlayCallStack(frame, rawStack) {
            const frames = cleanStackFrames(rawStack);
            const payload = frame.subarray(16);
            // 12a0: [0] cCardNum（0=过牌）, [1] cCard, [2] cOriType
            const num = payload.length >= 3 ? payload[0] : 0;
            const entry = {
                t: Date.now(),
                iso: new Date().toISOString(),
                kind: num ? 'PLAY' : 'PASS',
                tile: num && payload.length >= 3 ? tileLabel(payload[1]) : null,
                side: num && payload.length >= 3 ? payload[2] : null,
                frames: frames,
                raw: rawStack,
            };
            playStackEntries.push(entry);
            if (playStackEntries.length > PLAY_STACK_MAX) {
                playStackEntries.splice(0, playStackEntries.length - PLAY_STACK_MAX);
            }

            try {
                pageWindow.__dominoNet = pageWindow.__dominoNet || {};
                pageWindow.__dominoNet.lastPlayStack = frames;
                pageWindow.__dominoNet.lastPlayStackRaw = rawStack;
            } catch (_) { /* ignore */ }

            if (!pageWindow.__dominoNet || !pageWindow.__dominoNet.playStackLog) return;
            originalConsole.log(
                '%c[Domino][CallStack] ' + entry.kind + (entry.tile ? ' ' + entry.tile : '') +
                ' (12a0) — 往上找业务出牌函数',
                'color:#f90;font-weight:bold'
            );
            originalConsole.log(frames.join('\n') || rawStack);
        }

        function seatLabel(seat) {
            if (seat == null) return '?';
            if (gameState.mySeat == null) return 'S' + seat;
            // 以 mySeat 为 Me：相对座位 Me / R / Top / L（服务器座位 +1 方向）
            const rel = (seat - gameState.mySeat + 4) % 4;
            return ['Me', 'R', 'Top', 'L'][rel] || ('S' + seat);
        }

        // ---- /ingest 实时上报：对局事件逐条写入 domino.cli.serve 的 SQLite ----
        // 失败（服务未启动 / 网络错误 / 5xx）进内存重试队列定时重发；4xx 视为脏数据直接丢弃
        const INGEST_QUEUE_MAX = 500;
        const ingestQueue = [];
        let ingestRetryTimer = null;

        function newGameUid() {
            return 'g-' + Date.now().toString(36) + '-' +
                Math.random().toString(36).slice(2, 8);
        }

        function ingestPost(event) {
            const net = pageWindow.__dominoNet;
            if (net && net.ingestEnabled === false) return;
            if (!event || typeof GM_xmlhttpRequest !== 'function') return;
            sendIngest(event);
        }

        function sendIngest(event) {
            const net = pageWindow.__dominoNet;
            const base = ((net && net.aiHttpUrl) || 'http://127.0.0.1:8000').replace(/\/$/, '');
            GM_xmlhttpRequest({
                method: 'POST',
                url: base + '/ingest',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(event),
                timeout: 4000,
                onload: function (res) {
                    if (res.status >= 500) {
                        enqueueIngestRetry(event);
                    } else if (res.status >= 400) {
                        originalConsole.warn('[Ingest] 事件被拒绝（丢弃）', res.responseText, event);
                    }
                },
                onerror: function () { enqueueIngestRetry(event); },
                ontimeout: function () { enqueueIngestRetry(event); },
            });
        }

        function enqueueIngestRetry(event) {
            if (ingestQueue.length >= INGEST_QUEUE_MAX) ingestQueue.shift();
            ingestQueue.push(event);
            if (!ingestRetryTimer) {
                ingestRetryTimer = originalSetInterval(flushIngestQueue, 5000);
            }
        }

        function flushIngestQueue() {
            if (!ingestQueue.length) {
                originalClearInterval(ingestRetryTimer);
                ingestRetryTimer = null;
                return;
            }
            const batch = ingestQueue.splice(0, 20);
            for (let i = 0; i < batch.length; i++) sendIngest(batch[i]);
        }

        // decision 事件分两阶段 upsert（AI 响应到达 / 实际执行），
        // 服务端按 (game_uid, decision_seq) 覆盖，后到的一次带全量数据
        function decisionIngestEvent(rec) {
            if (!rec || rec._gameUid == null || rec._seq == null) return null;
            return {
                event: 'decision',
                game_uid: rec._gameUid,
                decision_seq: rec._seq,
                request_id: rec.requestId,
                t_ms: rec.t,
                latency_ms: rec.latencyMs,
                request: rec.request,
                response: rec.response,
                executed: rec.executed,
                note: rec.note || null,
            };
        }

        // ---- __dominoLog：每局完整轨迹（发牌 / 每次 AI 决策 / 实际动作 / 结算）----
        // 目的：事后能离线复盘「AI 说了什么 vs 我们做了什么 vs 最终输赢」
        const DOMINO_LOG_MAX_GAMES = 200;
        const dominoLogGames = [];
        let currentGameLog = null;
        let gameSeq = 0;

        function pairOf(tileByte) {
            return [(tileByte >> 4) & 0xf, tileByte & 0xf];
        }

        function startGameLog(dealerSeat, tiles) {
            finishGameLog(null); // 上一局若无结算（中途退出），先归档
            gameSeq += 1;
            currentGameLog = {
                gameId: gameSeq,
                gameUid: newGameUid(),
                startedAt: new Date().toISOString(),
                startedTs: Date.now(),
                dealerSeat: dealerSeat,
                mySeat: null,
                dealtHand: tiles.map(pairOf),
                decisions: [],   // 每次轮到我们：请求 + AI 回复 + 实际执行
                moves: [],       // 全桌 13a0 广播序列
                result: null,
            };
            ingestPost({
                event: 'game_start',
                game_uid: currentGameLog.gameUid,
                started_at: currentGameLog.startedAt,
                dealer_seat: dealerSeat,
                dealt_hand: currentGameLog.dealtHand,
            });
            return currentGameLog;
        }

        function finishGameLog(result) {
            if (!currentGameLog) return null;
            currentGameLog.result = result;
            currentGameLog.endedAt = new Date().toISOString();
            currentGameLog.durationMs = Date.now() - currentGameLog.startedTs;
            currentGameLog.mySeat = gameState.mySeat;
            ingestPost({
                event: 'game_end',
                game_uid: currentGameLog.gameUid,
                ended_at: currentGameLog.endedAt,
                duration_ms: currentGameLog.durationMs,
                my_seat: currentGameLog.mySeat,
                result: result, // null = 中途换局，服务端记 abandoned
            });
            dominoLogGames.push(currentGameLog);
            if (dominoLogGames.length > DOMINO_LOG_MAX_GAMES) {
                dominoLogGames.splice(0, dominoLogGames.length - DOMINO_LOG_MAX_GAMES);
            }
            const done = currentGameLog;
            currentGameLog = null;
            return done;
        }

        function logMove(seat, action, tile, side) {
            if (!currentGameLog) return;
            const move = {
                t: Date.now() - currentGameLog.startedTs,
                seat: seat,
                action: action,
                tile: tile == null ? null : pairOf(tile),
                side: side,
                left: gameState.leftEnd,
                right: gameState.rightEnd,
                counts: gameState.counts.slice(),
            };
            currentGameLog.moves.push(move);
            ingestPost({
                event: 'move',
                game_uid: currentGameLog.gameUid,
                move_index: currentGameLog.moves.length - 1,
                t_ms: move.t,
                seat: seat,
                action: action,
                tile: move.tile,
                side: side,
                left: move.left,
                right: move.right,
                counts: move.counts,
            });
        }

        // AI 请求发出：返回句柄，后续填 response / executed
        function logAiRequest(payload) {
            if (!currentGameLog) return null;
            const rec = {
                t: Date.now() - currentGameLog.startedTs,
                sentTs: Date.now(),
                requestId: payload.requestId,
                request: payload,
                response: null,
                latencyMs: null,
                executed: null,
                _gameUid: currentGameLog.gameUid,
                _seq: currentGameLog.decisions.length,
            };
            currentGameLog.decisions.push(rec);
            return rec;
        }

        function logAiResponse(rec, body, err) {
            if (!rec) return;
            rec.latencyMs = Date.now() - rec.sentTs;
            if (err) {
                rec.response = { ok: false, error: String(err) };
                ingestPost(decisionIngestEvent(rec));
                return;
            }
            const best = body && body.best;
            rec.response = {
                ok: !!(body && body.ok),
                objective: body && body.config && body.config.objective,
                best: best ? {
                    tile: best.tile,
                    side: best.side,
                    side_label: best.side_label,
                    win_rate: best.win_rate,
                    ev: best.ev,
                    blocked_rate: best.blocked_rate,
                } : null,
                // ranking 只留前 5，避免日志膨胀
                ranking: body && body.ranking ? body.ranking.slice(0, 5) : null,
                error: body && body.error,
            };
            ingestPost(decisionIngestEvent(rec));
        }

        // 实际出手（12a0）：挂到最近一次还没执行记录的 AI 决策上；
        // 没有对应决策（手动出牌 / AI 超时被客户端托管）则单独记一条
        function logActualAction(action, tile, side) {
            if (!currentGameLog) return;
            const executed = {
                action: action,
                tile: tile == null ? null : (Array.isArray(tile) ? tile : pairOf(tile)),
                side: side,
                t: Date.now() - currentGameLog.startedTs,
            };
            const last = currentGameLog.decisions[currentGameLog.decisions.length - 1];
            if (last && !last.executed) {
                last.executed = executed;
                ingestPost(decisionIngestEvent(last));
                return;
            }
            const rec = {
                t: executed.t,
                requestId: null,
                request: null,
                response: null,
                latencyMs: null,
                executed: executed,
                note: 'no-ai-decision',
                _gameUid: currentGameLog.gameUid,
                _seq: currentGameLog.decisions.length,
            };
            currentGameLog.decisions.push(rec);
            ingestPost(decisionIngestEvent(rec));
        }

        // 20a0 结算包解析：钱 + 各家剩余手牌
        // layout: [0..3] flag | [4..67] 8×int64LE 金额 | [68..71] 各家剩余张数 | [72..99] 4×7 剩余牌
        function parseResultPayload(payload) {
            if (!payload || payload.length < 100) return null;
            function int64le(off) {
                let lo = 0;
                for (let i = 3; i >= 0; i--) lo = lo * 256 + payload[off + i];
                let hi = 0;
                for (let i = 7; i >= 4; i--) hi = hi * 256 + payload[off + i];
                // 负数按补码还原（金额量级远小于 2^53，安全）
                if (hi === 0xffffffff) return lo - 0x100000000;
                return hi * 0x100000000 + lo;
            }
            const money = [0, 1, 2, 3].map(function (i) { return int64le(4 + i * 8); });
            const counts = [0, 1, 2, 3].map(function (s) { return payload[68 + s]; });
            const hands = [0, 1, 2, 3].map(function (s) {
                const base = 72 + s * 7;
                // 用 counts 截断，否则 [0|0] 与补零无法区分
                return Array.from(payload.subarray(base, base + counts[s])).map(pairOf);
            });
            const pips = hands.map(function (h) {
                return h.reduce(function (a, p) { return a + p[0] + p[1]; }, 0);
            });
            return { money: money, counts: counts, hands: hands, pips: pips };
        }

        function summarizeGameLog(g) {
            const my = g.mySeat;
            const delta = g.result && my != null ? g.result.money[my] : null;
            function bestField(name) {
                return g.decisions
                    .map(function (d) { return d.response && d.response.best && d.response.best[name]; })
                    .filter(function (x) { return typeof x === 'number'; });
            }
            const avg = function (a) {
                return a.length ? Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length * 1000) / 1000 : null;
            };
            const avgWr = avg(bestField('win_rate'));
            const avgEv = avg(bestField('ev'));
            const lat = g.decisions.map(function (d) { return d.latencyMs; }).filter(function (x) { return x != null; });
            return {
                gameId: g.gameId,
                startedAt: g.startedAt,
                mySeat: my,
                decisions: g.decisions.length,
                followedAi: g.decisions.filter(function (d) {
                    if (!d.executed || !d.response || !d.response.best) return false;
                    const b = d.response.best;
                    const e = d.executed;
                    if (e.action === 'pass') return b.tile == null;
                    return !!(b.tile && e.tile && b.tile[0] === e.tile[0] && b.tile[1] === e.tile[1]);
                }).length,
                avgWinRate: avgWr,
                avgEv: avgEv,
                maxLatencyMs: lat.length ? Math.max.apply(null, lat) : null,
                myRemaining: g.result && my != null ? g.result.counts[my] : null,
                myPips: g.result && my != null ? g.result.pips[my] : null,
                delta: delta,
                win: delta == null ? null : delta > 0,
            };
        }

        // ---- 出牌接管：走 SelfHandCard 同款路径（CallBackSendCard + Ani + RemoveCard）----
        let gameViewRef = null;
        let aiBridgeTimer = null;
        let turnEpoch = 0;       // 每次轮到自己 +1，丢弃过期 AI 回调
        let playInFlight = false; // 本地已出牌、等服务器确认
        let pendingPlay = null;   // 已乐观从手牌摘掉、等 13a0 确认的那张牌
        let aiRequestInFlight = false; // /analyze 互斥，避免同一回合重复求解
        let aiRequestEpoch = -1;
        const HANDCARD_SEND = 3;

        function resolveTileByte(tile) {
            if (Array.isArray(tile) && tile.length === 2) {
                const a = tile[0] & 0xf;
                const b = tile[1] & 0xf;
                const packed = (a << 4) | b;
                const swapped = (b << 4) | a;
                if (gameState.hand.indexOf(packed) >= 0) return packed;
                if (gameState.hand.indexOf(swapped) >= 0) return swapped;
                return a <= b ? packed : swapped;
            }
            if (typeof tile === 'number' && !isNaN(tile)) {
                if (tile >= 0 && tile <= 0xff) return tile & 0xff;
            }
            if (typeof tile === 'string') {
                const m = tile.trim().match(/^\[?(\d)\s*[|,]\s*(\d)\]?$/);
                if (m) {
                    const a = parseInt(m[1], 10);
                    const b = parseInt(m[2], 10);
                    const packed = ((a & 0xf) << 4) | (b & 0xf);
                    const swapped = ((b & 0xf) << 4) | (a & 0xf);
                    if (gameState.hand.indexOf(packed) >= 0) return packed;
                    if (gameState.hand.indexOf(swapped) >= 0) return swapped;
                    return a <= b ? packed : swapped;
                }
                if (/^[0-9a-fA-F]{1,2}$/.test(tile.trim())) {
                    return parseInt(tile.trim(), 16) & 0xff;
                }
            }
            return null;
        }

        // 客户端座位 1 永远是自己；从 PlayerInfo 读服务器座位号
        function syncMySeatFromClient() {
            const gv = findGameView();
            if (!gv || !gv.m_pPlayerInfo || !gv.m_pPlayerInfo[1]) return false;
            try {
                const info = gv.m_pPlayerInfo[1];
                let serverSeat = null;
                if (typeof info.GetServerTablePos === 'function') {
                    serverSeat = info.GetServerTablePos();
                } else if (info.m_iServerTablePos != null) {
                    serverSeat = info.m_iServerTablePos;
                } else if (info.m_iTablePos != null) {
                    // 某些版本字段名不同，尽量兜底
                    serverSeat = info.m_iTablePos;
                }
                if (serverSeat != null && serverSeat >= 0 && serverSeat <= 3) {
                    if (gameState.mySeat !== serverSeat) {
                        logDomino(
                            '座位校准 mySeat: S' + gameState.mySeat + ' → S' + serverSeat,
                            'color:#c60;font-weight:bold'
                        );
                    }
                    gameState.mySeat = serverSeat;
                    return true;
                }
            } catch (e) {
                originalConsole.warn('[Domino] syncMySeatFromClient', e);
            }
            return false;
        }

        function canPlayNow() {
            if (gameState.status !== 'playing') return false;
            if (playInFlight) return false;
            const gv = findGameView();
            if (!gv || !gv.m_pSelfHandCard) return false;
            // 以客户端 HANDCARD_SEND 为准（比 turnSeat===mySeat 更可靠）
            if (gv.m_pSelfHandCard.m_iSelfHandState !== HANDCARD_SEND) return false;
            // 座位优先信客户端座位表。HANDCARD_SEND 可能是发牌动画留下的陈旧状态
            // （庄家发完牌就被置位），此时若出牌权其实在别人手上，抢着出牌会被服务器
            // 丢弃，而本地已经把牌从 UI / hand 摘掉了，之后就一直对不上
            if (syncMySeatFromClient()) {
                if (gameState.turnSeat != null && gameState.turnSeat !== gameState.mySeat) {
                    return false;
                }
            } else if (gameState.turnSeat != null) {
                gameState.mySeat = gameState.turnSeat;
            }
            return true;
        }

        function findHandSprite(hand, tileByte) {
            const arr = hand.m_arrSpriteCard;
            if (!arr || !arr.length) return null;
            const a = (tileByte >> 4) & 0xf;
            const b = tileByte & 0xf;
            const alt = ((b & 0xf) << 4) | (a & 0xf);
            for (let i = 0; i < arr.length; i++) {
                const c = arr[i].cCard;
                if (c === tileByte || c === alt) return arr[i];
            }
            return null;
        }

        // 读客户端 UI 里真实的手牌字节；发牌动画没跑完时返回 null
        function readUiHand() {
            const gv = findGameView();
            const arr = gv && gv.m_pSelfHandCard && gv.m_pSelfHandCard.m_arrSpriteCard;
            if (!arr || !arr.length) return null;
            const tiles = [];
            for (let i = 0; i < arr.length; i++) {
                const c = arr[i] && arr[i].cCard;
                if (typeof c === 'number' && c >= 0) tiles.push(c & 0xff);
            }
            return tiles.length ? tiles : null;
        }

        // 手牌以 UI 为准：漏收 13a0、或出牌没被服务器接受，都会让 gameState.hand
        // 留下 UI 里并不存在的「幽灵牌」，AI 一旦推荐它，dominoPlay 就会找不到精灵
        function syncHandFromUi(reason) {
            const ui = readUiHand();
            if (!ui) return false;
            // 发牌动画期间 UI 手牌是一张张长出来的，这时不能拿它去裁剪内存手牌
            if (ui.length < gameState.hand.length &&
                pendingPlay == null &&
                !gameState.history.length &&
                !gameState.board.length) {
                return false;
            }
            const pool = gameState.hand.slice();
            const next = ui.map(function (c) {
                const alt = ((c & 0xf) << 4) | ((c >> 4) & 0xf);
                let i = pool.indexOf(c);
                if (i < 0) i = pool.indexOf(alt);
                if (i < 0) return c;
                // 沿用原字节序，避免下游 [5|6] / [6|5] 无谓抖动
                return pool.splice(i, 1)[0];
            });
            if (next.length === gameState.hand.length && !pool.length) return false;
            const ghosts = pool.slice();
            gameState.hand = next;
            originalConsole.warn(
                '[Domino] 手牌已按 UI 校正（' + reason + '）：' +
                (ghosts.length ? '移除幽灵牌 ' + ghosts.map(tileLabel).join(' ') + ' ' : '') +
                '现有 ' + next.map(tileLabel).join(' ')
            );
            return true;
        }

        function canSendTile(hand, tileByte) {
            if (hand && typeof hand.JudgeSendCard === 'function') {
                try {
                    const j = hand.JudgeSendCard(tileByte);
                    if (j) return !!j.bIfSend;
                } catch (_) { /* fallthrough */ }
            }
            if (gameState.leftEnd == null) return true;
            const a = (tileByte >> 4) & 0xf;
            const b = tileByte & 0xf;
            return a === gameState.leftEnd || b === gameState.leftEnd ||
                a === gameState.rightEnd || b === gameState.rightEnd;
        }

        // AI 指定的牌不在 UI 里时的兜底：挑一张确实能出的，同样能出先扔点数大的。
        // 不兜底的话这一手会白白让给客户端托管
        function pickPlayableFromUi(hand) {
            const arr = hand && hand.m_arrSpriteCard;
            if (!arr || !arr.length) return null;
            let best = null;
            let bestPips = -1;
            for (let i = 0; i < arr.length; i++) {
                const c = arr[i] && arr[i].cCard;
                if (typeof c !== 'number' || c < 0) continue;
                const tileByte = c & 0xff;
                if (!canSendTile(hand, tileByte)) continue;
                const pips = ((tileByte >> 4) & 0xf) + (tileByte & 0xf);
                if (pips > bestPips) {
                    bestPips = pips;
                    best = tileByte;
                }
            }
            return best;
        }

        function inferSideFromHand(hand, tileByte, side) {
            if (side === 0 || side === 1) return side;
            if (typeof hand.JudgeSendCard === 'function') {
                try {
                    const j = hand.JudgeSendCard(tileByte);
                    if (j && j.bIfSend) {
                        // 2 = 两端都能出，默认左
                        return j.cOriType === 2 ? 0 : j.cOriType;
                    }
                } catch (_) { /* fallthrough */ }
            }
            if (gameState.leftEnd == null) return 0;
            const a = tileByte >> 4;
            const b = tileByte & 0xf;
            const canL = a === gameState.leftEnd || b === gameState.leftEnd;
            const canR = a === gameState.rightEnd || b === gameState.rightEnd;
            if (canL && !canR) return 0;
            if (canR && !canL) return 1;
            return 0;
        }

        function findGameView() {
            if (gameViewRef && gameViewRef.node && gameViewRef.node.isValid !== false) {
                return gameViewRef;
            }
            const cc = pageWindow.cc;
            const req = pageWindow.__require;
            if (!cc || !cc.director || typeof req !== 'function') return null;

            let Cls = null;
            const tryNames = ['DoMinoJL_GameView', './DoMinoJL_GameView', 'DoMinoJL_GameView.js'];
            for (let i = 0; i < tryNames.length; i++) {
                try {
                    const mod = req(tryNames[i]);
                    if (mod && mod.default) {
                        Cls = mod.default;
                        break;
                    }
                } catch (_) { /* next */ }
            }
            if (!Cls) return null;

            try {
                const scene = cc.director.getScene();
                if (!scene) return null;
                const comps = scene.getComponentsInChildren(Cls);
                if (comps && comps.length) {
                    gameViewRef = comps[0];
                    return gameViewRef;
                }
            } catch (e) {
                originalConsole.warn('[Domino] findGameView', e);
            }
            return null;
        }

        function hookGameViewCapture() {
            originalSetInterval(function () {
                const gv = findGameView();
                if (!gv || gv.__higgsPlayHooked) return;
                const raw = gv.CallBackSendCard;
                if (typeof raw !== 'function') return;
                gv.__higgsPlayHooked = true;
                try {
                    const proto = Object.getPrototypeOf(gv);
                    if (proto && typeof proto.CallBackSendCard === 'function' && !proto.__higgsPlayHooked) {
                        const rawProto = proto.CallBackSendCard;
                        proto.CallBackSendCard = function () {
                            gameViewRef = this;
                            return rawProto.apply(this, arguments);
                        };
                        proto.__higgsPlayHooked = true;
                    }
                } catch (_) { /* ignore */ }
                gameViewRef = gv;
                originalConsole.log('%c[Domino] GameView 已定位，__dominoNet.play / pass 可用', 'color:#0a0;font-weight:bold');
                try {
                    if (pageWindow.__dominoNet) {
                        pageWindow.__dominoNet.aiEnabled = true;
                        pageWindow.__dominoNet.autoPlay = true;
                    }
                } catch (_) { /* ignore */ }
            }, 1000);
        }

        // 出牌顺序递减座位：下家 = (me - 1 + 4) % 4
        function opponentSeatsInPlayOrder() {
            const me = gameState.mySeat;
            if (me == null) return [0, 1, 2]; // 占位，真正请求前应已校准
            return [(me + 3) % 4, (me + 2) % 4, (me + 1) % 4];
        }

        function countConsecutivePasses() {
            let n = 0;
            for (let i = gameState.history.length - 1; i >= 0; i--) {
                if (gameState.history[i].action === 'PASS') n += 1;
                else break;
            }
            return n;
        }

        // 对接 domimo.cli.serve → POST /analyze
        function exportStateForAi() {
            syncHandFromUi('求解前校正');
            const handPairs = gameState.hand.map(function (t) {
                return [(t >> 4) & 0xf, t & 0xf];
            });
            const payload = {
                hand: handPairs,
                board: gameState.board.map(function (p) { return [p[0], p[1]]; }),
                num_players: 4,
                hand_size: 7,
                max_pip: 6,
                simulations: (pageWindow.__dominoNet && pageWindow.__dominoNet.aiSimulations) || 400,
                rollout: (pageWindow.__dominoNet && pageWindow.__dominoNet.aiRollout) || 'mixed',
                consecutive_passes: countConsecutivePasses(),
                // 仅本地用，服务端会忽略
                requestId: turnEpoch,
            };
            if (gameState.board.length && gameState.leftEnd != null && gameState.rightEnd != null) {
                payload.left = gameState.leftEnd;
                payload.right = gameState.rightEnd;
            }
            if (gameState.mySeat != null) {
                const oppSeats = opponentSeatsInPlayOrder();
                const counts = oppSeats.map(function (s) { return gameState.counts[s] | 0; });
                const unseen = 28 - gameState.hand.length - gameState.board.length;
                if (counts.reduce(function (a, b) { return a + b; }, 0) === unseen && unseen >= 0) {
                    payload.opponent_hand_counts = counts;
                }
                payload.missing = oppSeats.map(function (s) {
                    return (gameState.missingPips[s] || []).slice();
                });
            }
            return payload;
        }

        function dominoPlay(tile, side) {
            if (!canPlayNow()) {
                originalConsole.warn(
                    '[Domino] play 拒绝：非自己回合或未处于可出牌状态',
                    'turn=' + gameState.turnSeat,
                    'my=' + gameState.mySeat,
                    'inFlight=' + playInFlight
                );
                return false;
            }
            const gv = findGameView();
            const hand = gv.m_pSelfHandCard;
            let tileByte = resolveTileByte(tile);
            if (tileByte == null) {
                originalConsole.error('[Domino] play 失败：无法解析牌', tile);
                return false;
            }
            let sprite = findHandSprite(hand, tileByte);
            if (!sprite) {
                originalConsole.error('[Domino] play 失败：手牌 UI 中找不到', tileLabel(tileByte));
                syncHandFromUi('play 找不到牌');
                const fallback = pickPlayableFromUi(hand);
                if (fallback == null) {
                    originalConsole.error('[Domino] UI 手牌里也没有能出的牌，放弃本手');
                    return false;
                }
                originalConsole.warn('[Domino] 改出 ' + tileLabel(fallback));
                tileByte = fallback;
                side = undefined; // 交给 inferSideFromHand 重新判方位
                sprite = findHandSprite(hand, tileByte);
                if (!sprite) return false;
            }
            // 必须以 UI 里的 cCard 为准，否则 RemoveCard 对不上
            tileByte = sprite.cCard;
            const ori = inferSideFromHand(hand, tileByte, side);

            let worldPos;
            try {
                const local = sprite.pCardSprite.node.getPosition();
                worldPos = sprite.pCardSprite.node.parent.convertToWorldSpaceAR(local);
            } catch (_) {
                worldPos = pageWindow.cc && pageWindow.cc.v2
                    ? pageWindow.cc.v2(sprite.iX || 0, sprite.iY || 0)
                    : { x: sprite.iX || 0, y: sprite.iY || 0 };
            }

            originalConsole.log(
                '%c[Domino] play → ' + tileLabel(tileByte) + ' side=' + ori + ' (完整 UI 路径)',
                'color:#0a0;font-weight:bold'
            );
            try {
                playInFlight = true;
                // 与 AutoSendCard / OnJLTouchEnd 相同顺序
                gv.CallBackSendCard(tileByte, 1, ori);
                if (gv.m_pSendCard && typeof gv.m_pSendCard.PlaySendCardAni === 'function') {
                    const prop = typeof gv.GetPlayerUsePropID === 'function'
                        ? gv.GetPlayerUsePropID(1, 3)
                        : 0;
                    gv.m_pSendCard.PlaySendCardAni(tileByte, ori, worldPos, false, 1, prop);
                }
                hand.RemoveCard(tileByte);
                // 同步我们自己的状态机手牌，避免等 13a0
                removeFromHand(tileByte);
                pendingPlay = tileByte;
                // 防止卡死：若迟迟无确认，超时解锁；这一手很可能没被服务器接受，
                // 顺手按 UI 校正手牌，别把分叉留到后面
                originalSetTimeout(function () {
                    if (playInFlight) {
                        originalConsole.warn(
                            '[Domino] play 确认超时（' + tileLabel(tileByte) + '），' +
                            '解除 inFlight 并按 UI 校正手牌'
                        );
                        playInFlight = false;
                        pendingPlay = null;
                        syncHandFromUi('play 确认超时');
                    }
                }, 5000);
                return true;
            } catch (e) {
                playInFlight = false;
                originalConsole.error('[Domino] play 异常', e);
                return false;
            }
        }

        function dominoPass() {
            if (!canPlayNow()) {
                originalConsole.warn('[Domino] pass 拒绝：非自己回合或不可出牌状态');
                return false;
            }
            const gv = findGameView();
            originalConsole.log('%c[Domino] pass → PASS', 'color:#0a0;font-weight:bold');
            try {
                playInFlight = true;
                // 优先走超时自动过牌同款；CallBackSendCard(0,0,0) 亦可
                if (typeof gv.OnTimeAutoPass === 'function') {
                    gv.OnTimeAutoPass();
                } else {
                    gv.CallBackSendCard(0, 0, 0);
                }
                originalSetTimeout(function () {
                    if (playInFlight) playInFlight = false;
                }, 5000);
                return true;
            } catch (e) {
                playInFlight = false;
                originalConsole.error('[Domino] pass 异常', e);
                return false;
            }
        }

        function applyAiSuggestion(msg) {
            if (!msg || !msg.ok) {
                if (msg && msg.error) {
                    originalConsole.warn('[AI] 无建议', msg.error);
                }
                return;
            }
            // 丢弃过期回合的建议
            if (msg.requestId != null && msg.requestId !== turnEpoch) {
                originalConsole.warn(
                    '[AI] 丢弃过期建议 requestId=' + msg.requestId + ' current=' + turnEpoch
                );
                return;
            }
            if (!canPlayNow()) {
                originalConsole.warn('[AI] 丢弃建议：当前不是可出牌时机');
                return;
            }
            originalConsole.log(
                '%c[AI 建议] ' + (msg.text || JSON.stringify(msg)) +
                (pageWindow.__dominoNet.autoPlay ? ' → 自动执行' : ' （autoPlay=false，仅建议）'),
                'color:#c0f;font-weight:bold'
            );
            if (!pageWindow.__dominoNet.autoPlay) return;
            if (msg.action === 'pass') {
                dominoPass();
            } else if (msg.action === 'play') {
                dominoPlay(msg.tile, msg.side);
            }
        }

        // 把 /analyze 响应转成内部 suggestion
        function applyAnalyzeResponse(body, requestId) {
            if (!body) {
                originalConsole.warn('[AI] 空响应');
                return;
            }
            if (!body.ok) {
                originalConsole.warn('[AI] analyze 失败', body.error || body);
                return;
            }
            const best = body.best;
            if (!best) {
                originalConsole.warn('[AI] 无合法着法', body);
                return;
            }
            const isPass = !!best.pass || best.side_label === 'pass' || best.tile == null;
            let tag = best.win_rate != null ? (' wr=' + best.win_rate) : '';
            // ev = 按真实赔付折算的每局期望收益（底注为单位），>0 才是赚的
            if (best.ev != null) tag += ' ev=' + (best.ev > 0 ? '+' : '') + best.ev;
            if (best.blocked_rate != null) tag += ' 堵死率=' + best.blocked_rate;
            const text = isPass
                ? ('PASS' + tag)
                : ('[' + best.tile[0] + '|' + best.tile[1] + '] ' + (best.side_label || '') + tag);
            applyAiSuggestion({
                ok: true,
                requestId: requestId,
                action: isPass ? 'pass' : 'play',
                tile: best.tile,
                side: best.side,
                text: text,
                ranking: body.ranking,
            });
        }

        function requestAiSuggestHttp(state) {
            const net = pageWindow.__dominoNet;
            const base = (net && net.aiHttpUrl) || 'http://127.0.0.1:8000';
            const requestId = state && state.requestId != null ? state.requestId : turnEpoch;
            if (typeof GM_xmlhttpRequest !== 'function') {
                originalConsole.warn('[AI] 需要 GM_xmlhttpRequest（请用 Tampermonkey 运行脚本）');
                return;
            }
            // 同一回合只求解一次：重复请求既浪费算力，又会让先到的旧回复覆盖新局面
            if (aiRequestInFlight && aiRequestEpoch === requestId) {
                originalConsole.warn('[AI] 跳过重复请求 epoch=' + requestId);
                return;
            }
            aiRequestInFlight = true;
            aiRequestEpoch = requestId;

            const url = base.replace(/\/$/, '') + '/analyze';
            const rec = logAiRequest(state);
            originalConsole.log(
                '%c[AI] POST ' + url + ' sims=' + (state.simulations || '?') +
                ' hand=' + state.hand.length + ' board=' + (state.board ? state.board.length : 0),
                'color:#c0f'
            );
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(state),
                timeout: (net && net.aiTimeoutMs) || 6000,
                onload: function (res) {
                    aiRequestInFlight = false;
                    try {
                        const body = JSON.parse(res.responseText);
                        if (res.status >= 400) {
                            logAiResponse(rec, null, 'HTTP ' + res.status);
                            originalConsole.warn('[AI] HTTP ' + res.status, body);
                            return;
                        }
                        logAiResponse(rec, body);
                        applyAnalyzeResponse(body, requestId);
                    } catch (e) {
                        logAiResponse(rec, null, e);
                        originalConsole.warn('[AI] HTTP 响应解析失败', e, res.responseText);
                    }
                },
                onerror: function (err) {
                    aiRequestInFlight = false;
                    logAiResponse(rec, null, err && err.error ? err.error : 'network');
                    originalConsole.warn(
                        '[AI] 请求失败（确认 domimo.cli.serve 在 :8000 运行）',
                        err
                    );
                },
                ontimeout: function () {
                    aiRequestInFlight = false;
                    logAiResponse(rec, null, 'timeout');
                    originalConsole.warn(
                        '[AI] 超时（sims=' + state.simulations + '），客户端可能已自动托管出牌。' +
                        '可降低 __dominoNet.aiSimulations'
                    );
                },
            });
        }

        function maybeRequestAiSuggest() {
            const net = pageWindow.__dominoNet;
            if (!net || !net.aiEnabled) return;
            if (gameState.status !== 'playing') return;
            if (playInFlight) return;
            if (aiRequestInFlight && aiRequestEpoch === turnEpoch) return;

            // 先尽量从客户端校准；仅在校准成功且明确不是自己的回合时跳过
            const synced = syncMySeatFromClient();
            if (synced &&
                gameState.mySeat != null &&
                gameState.turnSeat != null &&
                gameState.turnSeat !== gameState.mySeat) {
                return;
            }

            if (aiBridgeTimer) originalClearTimeout(aiBridgeTimer);

            const epoch = turnEpoch;
            let tries = 0;

            function tryAsk() {
                if (epoch !== turnEpoch) return;
                if (playInFlight) return;
                if (canPlayNow()) {
                    requestAiSuggestHttp(exportStateForAi());
                    return;
                }
                if (gameState.mySeat != null &&
                    gameState.turnSeat != null &&
                    gameState.turnSeat !== gameState.mySeat) {
                    return;
                }
                tries += 1;
                if (tries < 40) {
                    if (tries === 5 || tries === 15) syncMySeatFromClient();
                    aiBridgeTimer = originalSetTimeout(tryAsk, 100);
                } else {
                    originalConsole.warn(
                        '[AI] 等待可出牌状态超时' +
                        ' mySeat=' + gameState.mySeat +
                        ' turn=' + gameState.turnSeat +
                        ' handState=' + (function () {
                            const gv = findGameView();
                            return gv && gv.m_pSelfHandCard
                                ? gv.m_pSelfHandCard.m_iSelfHandState
                                : 'no-gv';
                        })()
                    );
                }
            }

            aiBridgeTimer = originalSetTimeout(tryAsk, 80);
        }

        function installWsApi() {
            pageWindow.__wsLog = {
                entries: wsLogEntries,
                last: null,
                quiet: true,        // 默认不打印二进制；设 false 可恢复 [WS] hex 日志
                filterDir: null,    // '→' | '←' | null
                enable() {
                    wsLogEnabled = true;
                    originalConsole.log('%c[WS] 原始帧记录已开启', 'color:green;font-weight:bold');
                },
                disable() {
                    wsLogEnabled = false;
                    wsLogEntries.length = 0;
                    this.last = null;
                    originalConsole.log('%c[WS] 原始帧记录已关闭并清空', 'color:green');
                },
                clear() {
                    wsLogEntries.length = 0;
                    this.last = null;
                    originalConsole.log('%c[WS] log cleared', 'color:green');
                },
                dump(n) {
                    const slice = wsLogEntries.slice(-(n || 50)).map((e) => ({
                        iso: e.iso,
                        dir: e.dir,
                        sockId: e.sockId,
                        type: e.type,
                        length: e.length,
                        preview: e.preview,
                        hex: e.hex,
                        text: e.text,
                    }));
                    originalConsole.log('%c[WS dump]', 'color:green;font-weight:bold', slice);
                    return slice;
                },
                // 复制友好：最近 N 条的 hex/text
                exportText(n) {
                    const lines = wsLogEntries.slice(-(n || 100)).map((e) => {
                        const body = e.hex || e.text || e.preview || '';
                        return `${e.iso} ${e.dir} #${e.sockId} ${e.type} len=${e.length}\n${body}`;
                    });
                    const text = lines.join('\n---\n');
                    originalConsole.log(text);
                    return text;
                },
            };

            Object.defineProperty(pageWindow.__wsLog, 'enabled', {
                get: function () { return wsLogEnabled; },
                set: function (v) { if (v) this.enable(); else this.disable(); },
                enumerable: true,
            });

            pageWindow.__dominoLog = {
                get games() { return dominoLogGames; },
                get current() { return currentGameLog; },
                clear() {
                    dominoLogGames.length = 0;
                    currentGameLog = null;
                    originalConsole.log('%c[Log] 对局记录已清空', 'color:green');
                },
                // 每局一行的战绩表 + 汇总
                summary() {
                    const rows = dominoLogGames.map(summarizeGameLog);
                    originalConsole.table(rows);
                    const settled = rows.filter(function (r) { return r.delta != null; });
                    const wins = settled.filter(function (r) { return r.win; }).length;
                    const net = settled.reduce(function (a, r) { return a + r.delta; }, 0);
                    const dec = rows.reduce(function (a, r) { return a + r.decisions; }, 0);
                    const followed = rows.reduce(function (a, r) { return a + r.followedAi; }, 0);
                    originalConsole.log(
                        '%c[Log] ' + settled.length + ' 局：胜 ' + wins +
                        '（' + (settled.length ? Math.round(wins / settled.length * 100) : 0) + '%）' +
                        ' 净收益 ' + net +
                        ' | AI 执行率 ' + followed + '/' + dec,
                        'color:#c0f;font-weight:bold'
                    );
                    return rows;
                },
                // JSONL：一行一局，方便离线喂给脚本分析
                export() {
                    const all = currentGameLog
                        ? dominoLogGames.concat([currentGameLog])
                        : dominoLogGames;
                    return all.map(function (g) { return JSON.stringify(g); }).join('\n');
                },
                download(name) {
                    const text = this.export();
                    const filename = name || ('domino-' + new Date().toISOString().replace(/[:.]/g, '-') + '.jsonl');
                    try {
                        const blob = new Blob([text], { type: 'application/x-ndjson' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        originalSetTimeout(function () {
                            URL.revokeObjectURL(a.href);
                            a.remove();
                        }, 1000);
                        originalConsole.log('%c[Log] 已导出 ' + filename, 'color:green;font-weight:bold');
                    } catch (e) {
                        originalConsole.error('[Log] 导出失败，可用 copy(__dominoLog.export())', e);
                    }
                    return filename;
                },
                // 需要贴给别人时：copy(__dominoLog.export())
                copy() {
                    const text = this.export();
                    if (typeof pageWindow.copy === 'function') pageWindow.copy(text);
                    else originalConsole.log(text);
                    return text.length;
                },
            };

            pageWindow.__dominoNet = pageWindow.__dominoNet || {};
            Object.assign(pageWindow.__dominoNet, {
                sockets: pageWindow.__dominoNet.sockets || [],
                gameView: null,
                getState: function () { return gameState; },
                exportState: exportStateForAi,
                play: dominoPlay,
                pass: dominoPass,
                findGameView: findGameView,
                // 对接 python3 -m domimo.cli.serve （POST /analyze）
                aiEnabled: true,
                autoPlay: true,
                aiHttpUrl: 'http://127.0.0.1:8000',
                // 400 次模拟已接近收敛；更高只是变慢，容易超过游戏出牌倒计时被客户端托管
                aiSimulations: 400,
                // mixed：对手混 denial/greedy，纠正纯 counting 自对弈的乐观偏差
                aiRollout: 'mixed',
                aiTimeoutMs: 6000,
                // 对局事件实时写入 serve 的 SQLite（POST /ingest）；false 只留内存 __dominoLog
                ingestEnabled: true,
                // 出牌调用栈默认只记录不打印；游戏改版要重新定位出牌函数时设 true
                playStackLog: false,
                playStacks: function (n) {
                    const slice = playStackEntries.slice(-(n || 10));
                    originalConsole.log(
                        '%c[Domino][CallStack] 最近 ' + slice.length + '/' +
                        playStackEntries.length + ' 次出牌（打开实时打印: ' +
                        '__dominoNet.playStackLog = true）',
                        'color:#f90;font-weight:bold'
                    );
                    for (let i = 0; i < slice.length; i++) {
                        const e = slice[i];
                        originalConsole.log(
                            e.iso + ' ' + e.kind + (e.tile ? ' ' + e.tile : '') + '\n' +
                            (e.frames.join('\n') || e.raw)
                        );
                    }
                    return slice;
                },
                connectAi: function () {
                    this.aiEnabled = true;
                    originalConsole.log(
                        '%c[AI] 已开启 → ' + this.aiHttpUrl + '/analyze' +
                        ' （autoPlay=' + this.autoPlay +
                        ', sims=' + this.aiSimulations +
                        ', rollout=' + this.aiRollout +
                        ', timeout=' + this.aiTimeoutMs + 'ms）',
                        'color:#c0f'
                    );
                },
                askAi: function () {
                    this.aiEnabled = true;
                    requestAiSuggestHttp(exportStateForAi());
                },
            });

            Object.defineProperty(pageWindow.__dominoNet, 'gameView', {
                get: function () { return gameViewRef || findGameView(); },
                set: function (v) { gameViewRef = v; },
                enumerable: true,
            });

            // 启动即开启 AI（HTTP，无需 bridge_ai.py）
            pageWindow.__dominoNet.connectAi();

            originalConsole.log(
                '%c[WS Hook] play/pass 已挂载。默认 AI autoPlay → domimo.cli.serve :8000',
                'color:green;font-weight:bold'
            );
            originalConsole.log(
                '%c[AI] POST http://127.0.0.1:8000/analyze ；关闭: __dominoNet.aiEnabled=false',
                'color:#c0f;font-weight:bold'
            );
            originalConsole.log(
                '%c[Log] 对局事件实时入库 POST /ingest（关闭: __dominoNet.ingestEnabled=false）；' +
                '__dominoLog.summary() 看战绩 / .download() 导出 JSONL；' +
                '原始帧记录默认关闭，需要时 __wsLog.enable()',
                'color:#888'
            );
        }

        function hookWebSocket() {
            const RawWS = pageWindow.WebSocket;
            if (!RawWS || RawWS.__higgsHooked) {
                return;
            }

            function PatchedWebSocket(url, protocols) {
                const sockId = ++wsSocketSeq;
                const ws = protocols !== undefined
                    ? new RawWS(url, protocols)
                    : new RawWS(url);

                try {
                    pageWindow.__dominoNet.sockets.push({ id: sockId, url: String(url), ws });
                } catch (_) { /* ignore */ }

                logWs('open', sockId, String(url), {
                    type: 'connect',
                    length: 0,
                    preview: String(url),
                });

                const rawSend = ws.send.bind(ws);
                ws.send = function (data) {
                    // 出牌瞬间同步抓栈（不能放进 Promise）
                    try {
                        const u8 = dataToU8Sync(data);
                        if (u8 && u8[0] === 0x03) {
                            const playFrame = findFrameByCmd(u8, 0x12, 0xa0);
                            if (playFrame) recordPlayCallStack(playFrame, new Error().stack);
                        }
                    } catch (e) {
                        originalConsole.warn('[Domino] CallStack 捕获失败', e);
                    }

                    resolvePayload(data).then((summary) => {
                        logWs('→', sockId, String(url), summary, data);
                        ingestWsBinary('→', summary);
                    });
                    return rawSend(data);
                };

                ws.addEventListener('message', (ev) => {
                    resolvePayload(ev.data).then((summary) => {
                        logWs('←', sockId, String(url), summary, ev.data);
                        ingestWsBinary('←', summary);
                    });
                });

                ws.addEventListener('close', (ev) => {
                    logWs('close', sockId, String(url), {
                        type: 'close',
                        length: 0,
                        preview: `code=${ev.code} reason=${ev.reason || ''} clean=${ev.wasClean}`,
                    });
                });

                ws.addEventListener('error', () => {
                    logWs('error', sockId, String(url), {
                        type: 'error',
                        length: 0,
                        preview: 'WebSocket error',
                    });
                });

                return ws;
            }

            PatchedWebSocket.prototype = RawWS.prototype;
            PatchedWebSocket.CONNECTING = RawWS.CONNECTING;
            PatchedWebSocket.OPEN = RawWS.OPEN;
            PatchedWebSocket.CLOSING = RawWS.CLOSING;
            PatchedWebSocket.CLOSED = RawWS.CLOSED;
            PatchedWebSocket.__higgsHooked = true;

            pageWindow.WebSocket = PatchedWebSocket;
            // 同步到当前沙箱 window（部分环境下与 unsafeWindow 不同）
            if (window !== pageWindow) {
                window.WebSocket = PatchedWebSocket;
            }

            installWsApi();
            originalConsole.log('%c[WS Hook] WebSocket 已拦截', 'color:green;font-weight:bold');
        }

        // 初始化所有保护机制
        function initProtections() {
            // 最先 hook WS（document-start，赶在游戏建连前）
            hookWebSocket();
            hookGameViewCapture();

            // 开始监控HTTP请求
            hookHttpMethods();

            // 应用防调试检测保护
            preventDebuggerDetection();

            // 创建隐藏的iframe
            const hiddenFrame = createHiddenFrame();

            // 创建Web Worker
            const worker = createWorker();

            // 设置MutationObserver
            const observer = setupMutationObserver();

            // 设置ServiceWorker（如果可用）
            setupServiceWorker();

            // 设置TemperMonkey存储
            setupTMStorage();

            // 使用多种方式确保我们的监控代码会执行

            // 方式1: 使用原始的setInterval
            originalSetInterval(restoreConsole, 100);

            // 方式2: 使用递归的setTimeout
            function timeoutLoop() {
                restoreConsole();
                originalSetTimeout(timeoutLoop, 100);
            }
            timeoutLoop();

            // 方式3: 使用requestAnimationFrame
            function animFrameLoop() {
                restoreConsole();
                requestAnimationFrame(animFrameLoop);
            }
            requestAnimationFrame(animFrameLoop);

            // 方式4: 使用事件监听器
            window.addEventListener('mousemove', restoreConsole);
            window.addEventListener('keydown', restoreConsole);
            window.addEventListener('focus', restoreConsole);
            window.addEventListener('blur', restoreConsole);

            // 输出初始化完成消息
            originalConsole.log('%c[Higgs终极日志恢复] 初始化完成，多重保护机制已启动', 'color: green; font-weight: bold');

        }

        // 返回公共API
        return {
            init: initProtections,
            restore: restoreAllFunctions
        };
    })();

    // 立即初始化保护
    PROTECTED_SCOPE.init();

    // 定期尝试恢复（使用原始的setTimeout，避免被覆盖）
    const originalSetTimeout = window.setTimeout;
    originalSetTimeout(function recoveryLoop() {
        PROTECTED_SCOPE.restore();
        originalSetTimeout(recoveryLoop, 500);
    }, 500);
})();