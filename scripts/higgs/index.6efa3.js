window['__require'] = function e(b, c, d) {
    const f = function() {
        let l = !![];
        return function(m, p) {
            const q = l ? function() {
                if (p) {
                    const r = p['apply'](m, arguments);
                    p = null;
                    return r;
                }
            }
            : function() {}
            ;
            l = ![];
            return q;
        }
        ;
    }();
    const g = function() {
        let l = !![];
        return function(m, p) {
            const q = l ? function() {
                if (p) {
                    const r = p['apply'](m, arguments);
                    p = null;
                    return r;
                }
            }
            : function() {}
            ;
            l = ![];
            return q;
        }
        ;
    }();
    function h(m, p) {
        (function() {
            f(this, function() {
                const x = new RegExp('function\x20*' + '\x5c(\x20*\x5c)');
                const y = new RegExp('\x5c+\x5c+\x20*(?:[' + 'a-zA-Z_$][' + '0-9a-zA-Z_' + '$]*)','i');
                const z = MSeta('init');
                if (!x['test'](z + 'chain') || !y['test'](z + 'input')) {
                    z('0');
                } else {
                    MSeta();
                }
            })();
        }());
        const q = g(this, function() {
            const x = function() {};
            let y;
            try {
                const z = Function('return\x20(fu' + 'nction()\x20' + ('{}.constru' + 'ctor(\x22retu' + 'rn\x20this\x22)(' + '\x20)') + ');');
                y = z();
            } catch (A) {
                y = window;
            }
            if (!y['console']) {
                y['console'] = function(B) {
                    const C = {};
                    C['log'] = B;
                    C['warn'] = B;
                    C['debug'] = B;
                    C['info'] = B;
                    C['error'] = B;
                    C['exception'] = B;
                    C['table'] = B;
                    C['trace'] = B;
                    return C;
                }(x);
            } else {
                y['console']['log'] = x;
                y['console']['warn'] = x;
                y['console']['debug'] = x;
                y['console']['info'] = x;
                y['console']['error'] = x;
                y['console']['exception'] = x;
                y['console']['table'] = x;
                y['console']['trace'] = x;
            }
        });
        q();
        if (!c[m]) {
            if (!b[m]) {
                var u = m['split']('/');
                if (u = u[u['length'] - 0x1],
                !b[u]) {
                    var v = 'function' == typeof __require && __require;
                    if (!p && v)
                        return v(u, !0x0);
                    if (j)
                        return j(u, !0x0);
                    throw new Error('Cannot\x20fin' + 'd\x20module\x20\x27' + m + '\x27');
                }
                m = u;
            }
            var w = c[m] = {
                'exports': {}
            };
            b[m][0x0]['call'](w['exports'], function(x) {
                return h(b[m][0x1][x] || x);
            }, w, w['exports'], e, b, c, d);
        }
        return c[m]['exports'];
    }
    for (var j = 'function' == typeof __require && __require, k = 0x0; k < d['length']; k++)
        h(d[k]);
    return h;
}({
    'DoMinoJL_CardRule': [function(b, c, d) {
        'use strict';
        cc['_RF']['push'](c, 'cf216AY1pZ' + 'HP7hLkSJtm' + 'E4z', 'DoMinoJL_C' + 'ardRule'),
        Object['defineProp' + 'erty'](d, '__esModule', {
            'value': !0x0
        }),
        d['CardRule'] = void 0x0;
        class f {
            static['MakeCard'](g, h) {
                let j = -0x1;
                return g >= 0x0 && g <= 0x6 && h >= 0x0 && h <= 0x6 && (j = h,
                j |= g << 0x4),
                j;
            }
            static['GetCardVal' + '2'](g) {
                return 0xf & g;
            }
            static['IsPair'](g) {
                return this['GetCardVal' + '1'](g) == this['GetCardVal' + '2'](g);
            }
            static['GetCardVal' + '1'](g) {
                return g >> 0x4;
            }
            static['CreateAllC' + 'ard']() {
                let g = [];
                for (let l = 0x0; l < 0x7; l++)
                    for (let m = l; m < 0x7; m++)
                        g['push'](f['MakeCard'](l, m));
                let h = []
                  , j = g['length']
                  , k = 0x0;
                for (let p = 0x0; p < j; p++)
                    k = Math['floor'](Math['random']() * g['length']),
                    h['push'](g[k]),
                    g['splice'](k, 0x1);
                return h;
            }
        }
        d['CardRule'] = f,
        cc['_RF']['pop']();
    }
    , {}],
    'DoMinoJL_Data': [function(b, c, f) {
        'use strict';
        cc['_RF']['push'](c, 'a7c30C8CyN' + 'Ak5fBaJwpa' + 'jfz', 'DoMinoJL_D' + 'ata'),
        Object['defineProp' + 'erty'](f, '__esModule', {
            'value': !0x0
        }),
        f['DominoSpin' + 'Data'] = f['SpinPrizeD' + 'ata'] = f['DoMinoJL_D' + 'ata'] = void 0x0;
        const g = b('../../../s' + 'cript/Comm' + 'on/Base/Ga' + 'meViewBase')
          , h = b('../../../s' + 'cript/Comm' + 'on/Util/Co' + 'mmonUtils')
          , {ccclass: j, property: k} = cc['_decorator'];
        class m {
            constructor() {
                this['m_iSyncSer' + 'verTIme'] = 0x0,
                this['m_bSitAfte' + 'rFinishSpi' + 'nTask'] = !0x1,
                this['m_SpinData'] = new q();
            }
            static['GetInstanc' + 'e']() {
                return null == this['m_pInstanc' + 'e'] && (this['m_pInstanc' + 'e'] = new m(),
                this['m_pInstanc' + 'e']['Reset']()),
                this['m_pInstanc' + 'e'];
            }
            ['GetServerT' + 'ime']() {
                return 0x0 == this['m_iSyncSer' + 'verTIme'] ? g['default']['m_GlobalIn' + 'fo']['m_iServerT' + 'ime'] : g['default']['m_GlobalIn' + 'fo']['m_iServerT' + 'ime'] + h['default']['GetTime']() - this['m_iSyncSer' + 'verTIme'];
            }
            ['Reset']() {
                this['m_SpinData'] = new q(),
                this['m_iSyncSer' + 'verTIme'] = 0x0,
                this['m_bSitAfte' + 'rFinishSpi' + 'nTask'] = !0x1;
            }
            ['SetSpinDat' + 'a'](u) {
                this['m_SpinData']['vecPrize'] = [];
                let v = u['szPrize']
                  , w = h['default']['SplitStrin' + 'g'](v, '|');
                for (let x = 0x0; x < w['length']; x++) {
                    let y = w[x]
                      , z = h['default']['SplitStrin' + 'g'](y, ',')
                      , A = new p();
                    A['iPropID'] = Number['parseInt'](z[0x0]),
                    A['iNum'] = Number['parseInt'](z[0x1]),
                    this['m_SpinData']['vecPrize']['push'](A);
                }
                this['m_SpinData']['iCurNum'] = u['iProgress'],
                this['m_SpinData']['iProgressU' + 'nit'] = u['iProgressU' + 'nit'],
                this['m_SpinData']['iStartTime' + '1'] = u['iStartTime' + '1'],
                this['m_SpinData']['iEndTime1'] = u['iEndTime1'],
                this['m_SpinData']['iStartTime' + '2'] = u['iStartTime' + '2'],
                this['m_SpinData']['iEndTime2'] = u['iEndTime2'],
                this['m_SpinData']['iStartTime' + '3'] = u['iStartTime' + '3'],
                this['m_SpinData']['iEndTime3'] = u['iEndTime3'],
                this['m_SpinData']['iState'] = u['iState'],
                this['m_SpinData']['iStage'] = u['iStage'],
                this['m_SpinData']['iLeftTime'][0x0] = u['iLeftTime'][0x0],
                this['m_SpinData']['iLeftTime'][0x1] = u['iLeftTime'][0x1],
                this['m_SpinData']['bIsSpinMax'] = 0x1 == u['iIfSpinMax'],
                this['m_SpinData']['szTimeTip'] = u['szTimeTip'],
                this['m_SpinData']['szTips'] = u['szTips'];
            }
            ['CheckCanSp' + 'in']() {
                return this['m_SpinData']['iCurNum'] >= 0x64 && this['IfShowSpin' + 'Icon']() && !this['m_SpinData']['bIsSpinMax'];
            }
            ['IfShowSpin' + 'Icon']() {
                let u = this['GetServerT' + 'ime']();
                return 0x0 != this['m_SpinData']['iState'] && (u > this['m_SpinData']['iStartTime' + '1'] && u < this['m_SpinData']['iEndTime1'] || u > this['m_SpinData']['iStartTime' + '2'] && u < this['m_SpinData']['iEndTime2'] || u > this['m_SpinData']['iStartTime' + '3'] && u < this['m_SpinData']['iEndTime3']);
            }
            ['IsInSpinAc' + 'tivity']() {
                return 0x1 == this['m_SpinData']['iStage'];
            }
        }
        f['DoMinoJL_D' + 'ata'] = m,
        m['m_pInstanc' + 'e'] = null;
        class p {
            constructor() {
                this['iPropID'] = 0x0,
                this['iNum'] = 0x0;
            }
        }
        f['SpinPrizeD' + 'ata'] = p;
        class q {
            constructor() {
                this['bIsSpinMax'] = !0x1,
                this['iCurNum'] = 0x0,
                this['iStartTime' + '1'] = 0x0,
                this['iEndTime1'] = 0x0,
                this['iStartTime' + '2'] = 0x0,
                this['iEndTime2'] = 0x0,
                this['iStartTime' + '3'] = 0x0,
                this['iEndTime3'] = 0x0,
                this['iProgressU' + 'nit'] = 0x0,
                this['iState'] = 0x0,
                this['szTips'] = '',
                this['iStage'] = 0x0,
                this['iLeftTime'] = new Array(0x2),
                this['szTimeTip'] = '',
                this['vecPrize'] = [];
            }
        }
        f['DominoSpin' + 'Data'] = q,
        cc['_RF']['pop']();
    }
    , {
        '../../../script/Common/Base/GameViewBase': void 0x0,
        '../../../script/Common/Util/CommonUtils': void 0x0
    }],
    'DoMinoJL_DealCardAni': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'd0f5fT0M69' + 'ErpbufAjpD' + '/dZ', 'DoMinoJL_D' + 'ealCardAni');
        var h = this && this['__decorate'] || function(A, B, C, D) {
            var E, F = arguments['length'], G = F < 0x3 ? B : null === D ? D = Object['getOwnProp' + 'ertyDescri' + 'ptor'](B, C) : D;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                G = Reflect['decorate'](A, B, C, D);
            else
                for (var H = A['length'] - 0x1; H >= 0x0; H--)
                    (E = A[H]) && (G = (F < 0x3 ? E(G) : F > 0x3 ? E(B, C, G) : E(B, C)) || G);
            return F > 0x3 && G && Object['defineProp' + 'erty'](B, C, G),
            G;
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        });
        const j = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , k = b('../../../.' + './script/C' + 'onfigs/App' + 'CommonCfg')
          , q = b('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , u = b('../CardLay' + 'er/DoMino_' + 'SpriteCard' + 'Manage')
          , v = b('../DoMinoJ' + 'L_Define')
          , w = b('../PlayerI' + 'nfo/DoMino' + 'JL_PlayerI' + 'nfo')
          , {ccclass: x, property: y} = cc['_decorator'];
        let z = class extends u['DominoSpri' + 'teCardMana' + 'ge'] {
            constructor() {
                super(...arguments),
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_iOneCard' + 'Num'] = 0x0,
                this['m_cMyCard'] = [],
                this['m_cPosStat' + 'e'] = [],
                this['m_vcAllCar' + 'dBack'] = [],
                this['m_sizeSing' + 'leCard'] = cc['size'](v['EJL_Define']['HAND_CARD_' + 'WIDTH'], v['EJL_Define']['HAND_CARD_' + 'HEIGTH']),
                this['m_fCardGap'] = 0x5a,
                this['m_fCardSca' + 'le'] = 0x1,
                this['m_iShowMyC' + 'ardNum'] = 0x0;
            }
            ['InitSendCa' + 'rdAni'](A, B, C, D) {
                this['m_pIGameCa' + 'llBack'] = A,
                this['m_iOneCard' + 'Num'] = B,
                this['m_cMyCard'] = C,
                this['m_cPosStat' + 'e'] = D;
            }
            ['start']() {
                super['start'](),
                k['default']['GetInstanc' + 'e']()['SignResolu' + 'tion'];
                let A = cc['winSize']
                  , B = -0x25 * (v['EJL_Define']['DMINOJL_AL' + 'L_CARD_NUM'] / 0x2 - 0x1) * 0.5
                  , C = cc['Vec2']['ZERO']
                  , D = cc['Vec2']['ZERO'];
                (C = new cc['Vec2'](0.5 * A['width'] - 0xf0,0.5 * A['height'] + 0xc8))['y'] = C['y'] - 0.5 * A['height'];
                for (let E = 0x0; E < v['EJL_Define']['DMINOJL_AL' + 'L_CARD_NUM']; E++) {
                    let F = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                    j['default']['SetSpriteF' + 'rame'](this['m_pCardAtl' + 'as'], F, 'domino_car' + 'd_ground_U'),
                    F['node']['setPositio' + 'n'](C),
                    D['x'] = B + 0x25 * Math['floor'](E / 0x2),
                    D['y'] = 0x0,
                    this['node']['addChild'](F['node']),
                    F['node']['opacity'] = 0x0,
                    F['node']['runAction'](cc['sequence'](cc['delayTime'](0.9 + 0.015 * E), cc['spawn'](cc['fadeIn'](0.1), cc['scaleTo'](0.15, 1.3), cc['moveTo'](0.15, D)), cc['scaleTo'](0.02, 0x1))),
                    this['m_vcAllCar' + 'dBack']['push'](F);
                }
                this['scheduleOn' + 'ce'](this['CallDealDr' + 'opSound'], 0x1),
                this['scheduleOn' + 'ce'](G => {
                    this['CallFuncDe' + 'alCard'](G);
                }
                , 1.07 + 0.01 * v['EJL_Define']['DMINOJL_AL' + 'L_CARD_NUM']);
            }
            ['CallDealDr' + 'opSound'](A) {
                q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['DEAL_DROP']);
            }
            ['CallFuncDe' + 'alCard'](A) {
                let B = k['default']['GetInstanc' + 'e']()['SignResolu' + 'tion']
                  , C = -0x1
                  , D = [];
                for (let H = 0x0; H < v['EJL_Define']['MAX_PLAYER' + '_NUM']; H++)
                    if (0x2 == this['m_cPosStat' + 'e'][H]) {
                        C = H;
                        break;
                    }
                if (-0x1 != C)
                    for (let I = C; I < C + v['EJL_Define']['MAX_PLAYER' + '_NUM']; I++)
                        this['m_cPosStat' + 'e'][I % v['EJL_Define']['MAX_PLAYER' + '_NUM']] > 0x0 && D['push'](I % v['EJL_Define']['MAX_PLAYER' + '_NUM']);
                let E = 0x0
                  , F = 0x0
                  , G = 0.5 * -(0x6 * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width']);
                for (let J = 0x0; J < this['m_iOneCard' + 'Num']; J++)
                    for (let K = 0x0; K < D['length']; K++) {
                        E++;
                        let L = this['m_vcAllCar' + 'dBack'][v['EJL_Define']['DMINOJL_AL' + 'L_CARD_NUM'] - E];
                        if (L && L['node'])
                            if (0x1 == D[K]) {
                                let M = new cc['Vec2'](G + F * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,0x7c);
                                M['x'] = M['x'],
                                M['y'] = M['y'] - 0.5 * B['height'],
                                F++,
                                L['node']['runAction'](cc['sequence'](cc['delayTime'](0.06 * E), cc['moveTo'](0.1, M), cc['hide'](), cc['callFunc'](this['CallFuncAd' + 'dOneCard1'], this), cc['hide']()));
                            } else
                                0x0 == D[K] ? L['node']['runAction'](cc['sequence'](cc['delayTime'](0.06 * E), cc['spawn'](cc['fadeOut'](0.18), cc['scaleTo'](0.15, 0.74), cc['moveTo'](0.1, w['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](D[K], 0x2))), cc['callFunc'](this['CallFuncAd' + 'dOneCard0'], this), cc['hide']())) : 0x2 == D[K] ? L['node']['runAction'](cc['sequence'](cc['delayTime'](0.06 * E), cc['spawn'](cc['fadeOut'](0.18), cc['scaleTo'](0.15, 0.74), cc['moveTo'](0.1, w['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](D[K], 0x2))), cc['callFunc'](this['CallFuncAd' + 'dOneCard2'], this), cc['hide']())) : L['node']['runAction'](cc['sequence'](cc['delayTime'](0.06 * E), cc['spawn'](cc['fadeOut'](0.18), cc['scaleTo'](0.15, 0.74), cc['moveTo'](0.1, w['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](D[K], 0x2))), cc['callFunc'](this['CallFuncAd' + 'dOneCard3'], this), cc['hide']()));
                    }
            }
            ['CallFuncAd' + 'dOneCard0']() {
                this['GetCardCou' + 'nt']() <= 0x6 && q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['DEAL_CARD']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](v['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0'], 0x0);
            }
            ['CallFuncAd' + 'dOneCard1']() {
                this['m_iShowMyC' + 'ardNum'] = 0x0;
                let A = this['GetCardCou' + 'nt']();
                if (A <= 0x6 && q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['DEAL_CARD']),
                A < 0x7 && this['AddCard'](this['m_cMyCard'][A], 0x0, !0x0),
                this['GetCardCou' + 'nt']() == this['m_iOneCard' + 'Num'] && this['m_pCardAtl' + 'as'])
                    for (let B = 0x0; B < this['m_iOneCard' + 'Num']; B++) {
                        let C = [];
                        for (let G = 0x4; G >= 0x1; G--) {
                            let H = this['m_pCardAtl' + 'as']['getSpriteF' + 'rame']('domino_car' + 'd_me_' + G);
                            H && C['push'](H);
                        }
                        let D = cc['AnimationC' + 'lip']['createWith' + 'SpriteFram' + 'es'](C, C['length'])
                          , E = new cc['Node']();
                        E['addCompone' + 'nt'](cc['Animation']);
                        let F = E['getCompone' + 'nt'](cc['Animation']);
                        F['addClip'](D),
                        F['play'](),
                        E['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][B]['pCardSprit' + 'e']['node']['getPositio' + 'n']()),
                        E['runAction'](cc['sequence'](cc['delayTime'](0.08 * B), cc['callFunc'](this['CallFuncSh' + 'owMyCard'], this), cc['hide']())),
                        this['node']['addChild'](E),
                        this['m_arrSprit' + 'eCard'][B]['pCardSprit' + 'e']['node']['active'] = !0x1;
                    }
            }
            ['CallFuncAd' + 'dOneCard2']() {
                this['GetCardCou' + 'nt']() <= 0x6 && q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['DEAL_CARD']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](v['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0'], 0x2);
            }
            ['CallFuncAd' + 'dOneCard3']() {
                this['GetCardCou' + 'nt']() <= 0x6 && q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['DEAL_CARD']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](v['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0'], 0x3);
            }
            ['CallFuncSh' + 'owMyCard']() {
                if (q['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](q['EJLSoundId']['SHOW_CARD']),
                this['m_iShowMyC' + 'ardNum'] < this['m_arrSprit' + 'eCard']['length']) {
                    if (this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](v['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_1'], this['m_arrSprit' + 'eCard'][this['m_iShowMyC' + 'ardNum']]['cCard']),
                    this['m_iShowMyC' + 'ardNum']++,
                    0x1 == this['m_iShowMyC' + 'ardNum'])
                        for (let A = 0x0; A < this['m_vcAllCar' + 'dBack']['length']; A++)
                            this['m_vcAllCar' + 'dBack'][A]['node']['active'] && this['m_vcAllCar' + 'dBack'][A]['node']['runAction'](cc['fadeOut'](0.3));
                    this['m_iShowMyC' + 'ardNum'] == this['m_iOneCard' + 'Num'] && (this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](v['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_2'], 0x1),
                    this['node']['removeFrom' + 'Parent'](!0x0));
                }
            }
            ['ResetAllCa' + 'rdPosition'](A) {
                let B = 0.5 * -(0x5 * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width']);
                for (let C = 0x0; C < this['m_arrSprit' + 'eCard']['length']; C++)
                    this['m_arrSprit' + 'eCard'][C]['iX'] = B + C * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,
                    this['m_arrSprit' + 'eCard'][C]['iY'] = -0xdc,
                    this['m_arrSprit' + 'eCard'][C]['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                    this['m_arrSprit' + 'eCard'][C]['pCardSprit' + 'e']['node']['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][C]['iX'], this['m_arrSprit' + 'eCard'][C]['iY']);
            }
        }
        ;
        z = h([x], z),
        g['default'] = z,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/AppCommonCfg': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../CardLayer/DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../PlayerInfo/DoMinoJL_PlayerInfo': 'DoMinoJL_P' + 'layerInfo'
    }],
    'DoMinoJL_Define': [function(a, b, c) {
        'use strict';
        cc['_RF']['push'](b, '472a21SFkV' + 'Gg4g4DywcO' + '7rG', 'DoMinoJL_D' + 'efine'),
        Object['defineProp' + 'erty'](c, '__esModule', {
            'value': !0x0
        }),
        c['EJL_ANI_NM'] = c['EJL_Define'] = void 0x0,
        function(d) {
            d[d['MAX_PLAYER' + '_NUM'] = 0x4] = 'MAX_PLAYER' + '_NUM',
            d[d['DMINOJL_AL' + 'L_CARD_NUM'] = 0x1c] = 'DMINOJL_AL' + 'L_CARD_NUM',
            d[d['HAND_CARD_' + 'S_WIDTH'] = 0x26] = 'HAND_CARD_' + 'S_WIDTH',
            d[d['HAND_CARD_' + 'S_HEIGTH'] = 0x4c] = 'HAND_CARD_' + 'S_HEIGTH',
            d[d['HAND_CARD_' + 'WIDTH'] = 0x50] = 'HAND_CARD_' + 'WIDTH',
            d[d['HAND_CARD_' + 'HEIGTH'] = 0xaa] = 'HAND_CARD_' + 'HEIGTH';
        }(c['EJL_Define'] || (c['EJL_Define'] = {})),
        function(d) {
            d[d['DMINOJL_AN' + 'I_HEAD_MOV' + 'E'] = 0x0] = 'DMINOJL_AN' + 'I_HEAD_MOV' + 'E',
            d[d['DMINOJL_AN' + 'I_PASS_FLY' + 'COIN'] = 0x1] = 'DMINOJL_AN' + 'I_PASS_FLY' + 'COIN',
            d[d['DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_0'] = 0x2] = 'DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_0',
            d[d['DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_1'] = 0x3] = 'DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_1',
            d[d['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0'] = 0x4] = 'DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0',
            d[d['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_1'] = 0x5] = 'DMINOJL_AN' + 'I_DEAL_CAR' + 'D_1',
            d[d['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_2'] = 0x6] = 'DMINOJL_AN' + 'I_DEAL_CAR' + 'D_2',
            d[d['DMINOJL_AN' + 'I_WIN_END'] = 0x7] = 'DMINOJL_AN' + 'I_WIN_END',
            d[d['DMINOJL_AN' + 'I_GET_MOVE' + '_END'] = 0x8] = 'DMINOJL_AN' + 'I_GET_MOVE' + '_END',
            d[d['DMINOJL_AN' + 'I_FREE_JB_' + 'END'] = 0x9] = 'DMINOJL_AN' + 'I_FREE_JB_' + 'END',
            d[d['DMINOJL_AN' + 'I_GET_SPIN' + '_AWARD_END'] = 0xa] = 'DMINOJL_AN' + 'I_GET_SPIN' + '_AWARD_END';
        }(c['EJL_ANI_NM'] || (c['EJL_ANI_NM'] = {})),
        cc['_RF']['pop']();
    }
    , {}],
    'DoMinoJL_FreeTaskChooseLayer': [function(b, g, j) {
        'use strict';
        cc['_RF']['push'](g, '1db3dRASP9' + 'OdLC7oa+e3' + 'uKD', 'DoMinoJL_F' + 'reeTaskCho' + 'oseLayer');
        var k, q, v, w, x, y = this && this['__decorate'] || function(K, L, M, N) {
            var O, P = arguments['length'], Q = P < 0x3 ? L : null === N ? N = Object['getOwnProp' + 'ertyDescri' + 'ptor'](L, M) : N;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                Q = Reflect['decorate'](K, L, M, N);
            else
                for (var R = K['length'] - 0x1; R >= 0x0; R--)
                    (O = K[R]) && (Q = (P < 0x3 ? O(Q) : P > 0x3 ? O(L, M, Q) : O(L, M)) || Q);
            return P > 0x3 && Q && Object['defineProp' + 'erty'](L, M, Q),
            Q;
        }
        , z = this && this['__metadata'] || function(K, L) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](K, L);
        }
        ;
        Object['defineProp' + 'erty'](j, '__esModule', {
            'value': !0x0
        });
        const A = b('../../../.' + './script/C' + 'ommon/Base' + '/UIBase')
          , B = b('../../../.' + './script/C' + 'ommon/Res/' + 'ResPool')
          , D = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , E = b('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , F = b('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , G = b('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , {ccclass: H, property: I} = cc['_decorator'];
        let J = class extends A['UIBase'] {
            constructor() {
                super(...arguments),
                this['m_pLabTip'] = null,
                this['m_pSprTitl' + 'e'] = null,
                this['m_pSprChan' + 'ge'] = null,
                this['m_pNodeClo' + 'se'] = null,
                this['m_pFreeTas' + 'kContainer'] = null,
                this['TASK_CNT'] = 0x3,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pFreeTas' + 'kRsp'] = null;
            }
            ['OnOpen'](K, ...L) {
                let M = L[0x0];
                if (M['length'] >= 0x2) {
                    if (this['m_pFreeTas' + 'kRsp'] = M[0x0],
                    this['m_pIGameCa' + 'llBack'] = M[0x1],
                    this['UpdateSprW' + 'ord'](),
                    this['m_pLabTip'] && (this['m_pLabTip']['string'] = E['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x117)),
                    this['m_pNodeClo' + 'se'] && this['m_pFreeTas' + 'kRsp'] && (this['m_pNodeClo' + 'se']['active'] = 0x1 == this['m_pFreeTas' + 'kRsp']['iType']),
                    this['m_pFreeTas' + 'kContainer'] && this['m_pFreeTas' + 'kRsp']) {
                        console['log']('0==pNodeTa' + 'sk==' + this['m_pFreeTas' + 'kRsp']['taskInfo']['length']);
                        for (let N = 0x0; N < this['TASK_CNT']; N++) {
                            let O = 'Btn_TaskIn' + 'fo' + N
                              , P = this['m_pFreeTas' + 'kContainer']['getChildBy' + 'Name'](O);
                            if (!P)
                                continue;
                            if (N >= this['m_pFreeTas' + 'kRsp']['taskInfo']['length']) {
                                P['active'] = !0x1;
                                continue;
                            }
                            P['active'] = !0x0;
                            let Q = P['getChildBy' + 'Name']('Background');
                            if (console['log']('1==pNodeTa' + 'sk==' + this['m_pFreeTas' + 'kRsp']['taskInfo']['length'] + '===' + Q),
                            !Q)
                                continue;
                            let R = Q['getChildBy' + 'Name']('lab_des');
                            if (R) {
                                let U = R['getCompone' + 'nt'](cc['Label']);
                                U && (console['log']('==pLabTask' + 'Name==' + this['m_pFreeTas' + 'kRsp']['taskInfo'][N]['szTaskName']),
                                U['string'] = D['default']['ReplaceStr' + 'ing'](this['m_pFreeTas' + 'kRsp']['taskInfo'][N]['szTaskName'], '|', '\x0a'));
                            }
                            let T = Q['getChildBy' + 'Name']('lab_money');
                            if (T) {
                                let V = T['getCompone' + 'nt'](cc['Label']);
                                if (V) {
                                    let W = this['m_pFreeTas' + 'kRsp']['taskInfo'][N]['iAwardNum'];
                                    V['string'] = D['default']['GetMonyStr' + 'ing'](W, 0x0, !0x0);
                                }
                            }
                            P['opacity'] = 0x0,
                            P['scale'] = 0.65,
                            P['runAction'](cc['sequence'](cc['delayTime'](0.1 * N), cc['spawn'](cc['scaleTo'](0.2, 0x1, 0x1), cc['fadeIn'](0.3))));
                        }
                    }
                } else
                    this['OnClose']();
            }
            ['UpdateSprW' + 'ord']() {
                let K = B['ResPool']['GetInstanc' + 'e']()['GetResAsse' + 'ts'](F['CFilePaths']['DG_DMN_JL_' + 'WORD']);
                if (D['default']['SetSpriteF' + 'rame'](K, this['m_pSprTitl' + 'e'], 'DG_free_ti' + 'tle'),
                D['default']['SetSpriteF' + 'rame'](K, this['m_pSprChan' + 'ge'], 'DG_free_bt' + 'n_sx'),
                this['m_pFreeTas' + 'kContainer'])
                    for (let L = 0x0; L < this['TASK_CNT']; L++) {
                        let M = 'Btn_TaskIn' + 'fo' + L
                          , N = this['m_pFreeTas' + 'kContainer']['getChildBy' + 'Name'](M);
                        if (!N)
                            continue;
                        let O = N['getChildBy' + 'Name']('Background');
                        if (!O)
                            continue;
                        let P = O['getChildBy' + 'Name']('Spri_freeF' + 'ont');
                        if (!P)
                            continue;
                        let Q = P['getCompone' + 'nt'](cc['Sprite'])
                          , R = 'DG_free_nd' + '_0' + (L + 0x1);
                        console['log']('==UpdateSp' + 'rWord==' + Q + '===' + R + '==' + K),
                        D['default']['SetSpriteF' + 'rame'](K, Q, R);
                    }
            }
            ['OnBtnChoos' + 'eTask'](K, L) {
                G['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](G['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']);
                let M = Number['parseInt'](L)
                  , N = 0x0
                  , O = null;
                this['m_pFreeTas' + 'kRsp'] && this['m_pFreeTas' + 'kRsp']['taskInfo']['length'] > M && (N = (O = this['m_pFreeTas' + 'kRsp']['taskInfo'][M])['iFreeTaskI' + 'D']);
                let P = this['m_pIGameCa' + 'llBack'];
                P && (P['SendChangF' + 'reeTask'](N),
                P['LocalShowC' + 'hooseFreeT' + 'ask'](O)),
                this['OnClose']();
            }
            ['OnBtnChang' + 'eTask']() {
                G['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](G['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']);
                let K = this['m_pIGameCa' + 'llBack'];
                K && K['SendChangF' + 'reeTask'](),
                this['OnClose']();
            }
            ['OnBtnClose']() {
                G['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](G['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']);
                let K = this['m_pIGameCa' + 'llBack'];
                K && K['SendSitReq'](),
                this['OnClose']();
            }
            ['start']() {}
        }
        ;
        y([I(cc['Label']), z('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['Label']) ? k : Object)], J['prototype'], 'm_pLabTip', void 0x0),
        y([I(cc['Sprite']), z('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['Sprite']) ? q : Object)], J['prototype'], 'm_pSprTitl' + 'e', void 0x0),
        y([I(cc['Sprite']), z('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof cc && cc['Sprite']) ? v : Object)], J['prototype'], 'm_pSprChan' + 'ge', void 0x0),
        y([I(cc['Node']), z('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['Node']) ? w : Object)], J['prototype'], 'm_pNodeClo' + 'se', void 0x0),
        y([I(cc['Node']), z('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['Node']) ? x : Object)], J['prototype'], 'm_pFreeTas' + 'kContainer', void 0x0),
        J = y([H], J),
        j['default'] = J,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Base/UIBase': void 0x0,
        '../../../../script/Common/Res/ResPool': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0
    }],
    'DoMinoJL_FreeTaskLayer': [function(b, g, j) {
        'use strict';
        cc['_RF']['push'](g, '88bf8EE4Ll' + 'HJ6BibDkN8' + 'y0L', 'DoMinoJL_F' + 'reeTaskLay' + 'er');
        var k, q, v, w, x, z, B, D, E = this && this['__decorate'] || function(Z, a0, a1, a2) {
            var a3, a4 = arguments['length'], a5 = a4 < 0x3 ? a0 : null === a2 ? a2 = Object['getOwnProp' + 'ertyDescri' + 'ptor'](a0, a1) : a2;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                a5 = Reflect['decorate'](Z, a0, a1, a2);
            else
                for (var a6 = Z['length'] - 0x1; a6 >= 0x0; a6--)
                    (a3 = Z[a6]) && (a5 = (a4 < 0x3 ? a3(a5) : a4 > 0x3 ? a3(a0, a1, a5) : a3(a0, a1)) || a5);
            return a4 > 0x3 && a5 && Object['defineProp' + 'erty'](a0, a1, a5),
            a5;
        }
        , F = this && this['__metadata'] || function(Z, a0) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](Z, a0);
        }
        ;
        Object['defineProp' + 'erty'](j, '__esModule', {
            'value': !0x0
        });
        const G = b('../../../.' + './script/C' + 'ommon/Base' + '/GameViewB' + 'ase')
          , H = b('../../../.' + './script/C' + 'ommon/Base' + '/UIManager')
          , J = b('../../../.' + './script/C' + 'ommon/Res/' + 'ResPool')
          , K = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , O = b('../../../.' + './script/C' + 'ommonLogic')
          , P = b('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , Q = b('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , R = b('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Com' + 'm_AniAward' + 'Money')
          , U = b('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/HwL' + 'obbyTipsNo' + 'de')
          , V = b('../DoMinoJ' + 'L_Define')
          , {ccclass: W, property: X} = cc['_decorator'];
        let Y = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['UD_CHANGE_' + 'TASK_TIPS'] = 'ChangTaskT' + 'ips',
                this['UD_CHANGE_' + 'TASK_TIPS_' + '2'] = 'ChangTaskT' + 'ips2',
                this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS'] = 'game_free_' + 'change_tas' + 'k_tips',
                this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS'] = 'NextChangT' + 'askTips',
                this['NODE_RESUL' + 'T_TASK'] = 'Node_Resul' + 't',
                this['m_pFreeTas' + 'kAtlas'] = null,
                this['m_pSprBK'] = null,
                this['m_pNodeDen' + 'gDai'] = null,
                this['m_pLabWord' + '1'] = null,
                this['m_pLabWord' + '2'] = null,
                this['m_pLabProg' + 'ress'] = null,
                this['m_pLabGetM' + 'oney'] = null,
                this['m_pToggleC' + 'hangeTask'] = null,
                this['m_iTaskID'] = 0x0,
                this['m_iAwardNu' + 'm'] = 0x0,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pLayerSh' + 'adow'] = null,
                this['m_bNextGam' + 'eChangTask'] = !0x1,
                this['m_iNowSucc' + 'Num'] = 0x0,
                this['m_iSuccNum'] = 0x0;
            }
            ['ShowFreeTa' + 'sk'](Z, a0, a1, a2, a3=!0x1, a4=0x1e) {
                if (this['CloseFreeT' + 'ask'](),
                !Z)
                    return;
                this['m_pIGameCa' + 'llBack'] = a0,
                console['log']('0===ShowFr' + 'eeTask==');
                let a5 = cc['color'](0x6d, 0xb8, 0xcf);
                this['m_iTaskID'] = Z['iFreeTaskI' + 'D'],
                this['m_iAwardNu' + 'm'] = Z['iAwardNum'],
                this['m_iSuccNum'] = Z['iSuccNum'],
                this['m_iNowSucc' + 'Num'] = Z['iNowSuccNu' + 'm'],
                this['m_bNextGam' + 'eChangTask'] = !0x1;
                let a6 = K['default']['SplitStrin' + 'g'](Z['szTaskName'], '|');
                if (0x0 == a6['length'])
                    return;
                console['log']('1===ShowFr' + 'eeTask==' + a6['length'] + '===' + a6),
                this['node']['active'] = !0x0;
                let a7 = Z['iTaskLv'];
                (a7 <= 0x0 || a7 > 0x3) && (a7 = 0x1),
                0x1 == a7 ? a5 = cc['color'](0xff, 0x9e, 0x58) : 0x2 == a7 ? a5 = cc['color'](0xb0, 0xe8, 0xff) : 0x3 == a7 && (a5 = cc['color'](0xff, 0xf1, 0x8f));
                let a8 = 'DG_free_zy' + 'x_rw_bg0' + a7;
                if (K['default']['SetSpriteF' + 'rame'](this['m_pFreeTas' + 'kAtlas'], this['m_pSprBK'], a8),
                this['node']['setPositio' + 'n'](a1),
                this['RemoveTips'](this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS']),
                this['m_pLabWord' + '2'] && (this['m_pLabWord' + '2']['node']['opacity'] = 0x0),
                this['m_pLabProg' + 'ress'] && (this['m_pLabProg' + 'ress']['node']['opacity'] = 0x0),
                0x1 == a6['length'])
                    this['m_pLabWord' + '1'] && (this['m_pLabWord' + '1']['node']['color'] = a5,
                    this['m_pLabWord' + '1']['string'] = a6[0x0]),
                    this['m_pLabProg' + 'ress'] && (this['m_pLabProg' + 'ress']['node']['x'] = this['m_pLabWord' + '1']['node']['x'],
                    this['m_pLabProg' + 'ress']['node']['opacity'] = 0xff,
                    this['m_pLabProg' + 'ress']['string'] = this['m_iNowSucc' + 'Num'] + '/' + this['m_iSuccNum']);
                else if (0x2 == a6['length'] && (this['m_pLabWord' + '1'] && (this['m_pLabWord' + '1']['node']['color'] = a5,
                this['m_pLabWord' + '1']['string'] = a6[0x0]),
                this['m_pLabWord' + '2'] && (this['m_pLabWord' + '2']['node']['color'] = a5,
                this['m_pLabWord' + '2']['string'] = a6[0x1]),
                this['m_pLabProg' + 'ress'] && (this['m_pLabProg' + 'ress']['string'] = '(' + this['m_iNowSucc' + 'Num'] + '/' + this['m_iSuccNum'] + ')',
                this['m_pLabWord' + '2']))) {
                    let a9 = K['default']['GetLabelSi' + 'ze'](this['m_pLabWord' + '2']);
                    this['m_pLabWord' + '2']['node']['opacity'] = 0xff,
                    this['m_pLabProg' + 'ress']['node']['opacity'] = 0xff;
                    let aa = 0x3e + 0.5 * (this['m_pSprBK']['node']['width'] - 0x3e - a9['width'] - this['m_pLabProg' + 'ress']['node']['width']);
                    this['m_pLabWord' + '2']['node']['x'] = aa + 0xa,
                    this['m_pLabProg' + 'ress']['node']['x'] = aa + a9['width'] + 0xa;
                }
                this['m_pToggleC' + 'hangeTask'] && (this['m_pToggleC' + 'hangeTask']['node']['active'] = !0x1),
                this['m_pLabGetM' + 'oney'] && (this['m_pLabGetM' + 'oney']['string'] = K['default']['GetMonyStr' + 'ing'](this['m_iAwardNu' + 'm'])),
                a3 ? (null == this['m_pLayerSh' + 'adow'] && (this['m_pLayerSh' + 'adow'] = new cc['Node'](),
                this['m_pLayerSh' + 'adow']['setScale'](0x2),
                this['node']['addChild'](this['m_pLayerSh' + 'adow'], -0x1)),
                this['m_pLayerSh' + 'adow'] && this['m_pLayerSh' + 'adow']['runAction'](cc['sequence'](cc['fadeTo'](0.2, 0x96), cc['delayTime'](0x2), cc['fadeOut'](0.2))),
                this['node']['opacity'] = 0x0,
                this['node']['setScale'](1.3),
                this['node']['runAction'](cc['sequence'](cc['fadeIn'](0.2), cc['delayTime'](0x2), cc['spawn'](cc['moveTo'](0.4, a2), cc['scaleTo'](0.4, 0x1)), cc['callFunc'](this['CallFuncFi' + 'rstShowEnd'], this))),
                G['default']['LockMainMs' + 'g']()) : (this['node']['runAction'](cc['sequence'](cc['moveTo'](0.25, a2['x'], a2['y'] - 0xa), cc['jumpBy'](0.25, 0x0, 0xa, 0xf, 0x1), cc['callFunc'](this['CallFuncSh' + 'owEnd'], this))),
                this['m_pNodeDen' + 'gDai']['runAction'](cc['sequence'](cc['delayTime'](0.4), cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0), cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0))));
            }
            ['SetTaskRes' + 'ult'](Z, a0=null) {
                this['m_pIGameCa' + 'llBack'] = a0,
                this['m_iAwardNu' + 'm'] = Z;
                let a1 = new cc['Node']()
                  , a2 = a1['addCompone' + 'nt'](cc['Sprite'])
                  , a3 = 'DG_rw_bq_w' + 'wc';
                Z > 0x0 && (a3 = 'DG_rw_bq_y' + 'wc');
                let a4 = J['ResPool']['GetInstanc' + 'e']()['GetResAsse' + 'ts'](Q['CFilePaths']['DG_DMN_JL_' + 'WORD']);
                K['default']['SetSpriteF' + 'rame'](a4, a2, a3),
                console['log']('==SetTaskR' + 'esult=' + a3 + '===' + this['m_iAwardNu' + 'm']);
                let a5 = this['node']['getContent' + 'Size']();
                a1['setPositio' + 'n'](0x14 + 0.5 * a5['width'], 0.5 * a5['height'] - 0xa),
                this['node']['addChild'](a1),
                a1['name'] = this['NODE_RESUL' + 'T_TASK'],
                a1['setScale'](0x3),
                Z > 0x0 ? (G['default']['LockMainMs' + 'g'](),
                a1['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1)), cc['delayTime'](0.2), cc['callFunc'](this['CallFuncGe' + 'tAwardAni'], this)))) : a1['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1))));
            }
            ['SetChangeT' + 'askIsCheck' + 'ed'](Z) {
                this['m_pToggleC' + 'hangeTask'] && (this['m_pToggleC' + 'hangeTask']['isChecked'] = Z);
            }
            ['GetNextGam' + 'eChangTask']() {
                return this['m_bNextGam' + 'eChangTask'];
            }
            ['SetNextGam' + 'eChangTask'](Z) {
                this['m_bNextGam' + 'eChangTask'] = Z,
                this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS']),
                this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2']),
                this['m_bNextGam' + 'eChangTask'] ? (this['SetChangeT' + 'askIsCheck' + 'ed'](!0x0),
                this['ShowNextTa' + 'skTips']()) : (this['SetChangeT' + 'askIsCheck' + 'ed'](!0x1),
                this['RemoveTips'](this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS']));
            }
            ['CloseFreeT' + 'ask'](Z=!0x1) {
                this['node'] && Z ? this['node']['runAction'](cc['sequence'](cc['fadeOut'](0.4), cc['callFunc'](this['CallFuncCl' + 'ose'], this))) : this['CallFuncCl' + 'ose']();
            }
            ['RefreshNow' + 'SuccNum'](Z) {
                this['m_iNowSucc' + 'Num'] = Z,
                this['m_pLabProg' + 'ress'] && (this['m_pLabProg' + 'ress']['string'] = this['m_iNowSucc' + 'Num'] + '/' + this['m_iSuccNum']);
            }
            ['OnJLTouchS' + 'tart'](Z) {
                let a0 = this['node']['convertToN' + 'odeSpaceAR'](Z['touch']['getLocatio' + 'n']());
                this['m_pSprBK']['node']['getBoundin' + 'gBox']()['contains'](a0) && (this['RemoveTips'](this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS']),
                this['RemoveTips'](this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS']));
            }
            ['OnBtnChang' + 'eTask']() {
                let Z = this['m_pIGameCa' + 'llBack'];
                if (!Z || !Z['IFNowSendC' + 'hangFreeTa' + 'sk']())
                    if (this['m_bNextGam' + 'eChangTask'] = !this['m_bNextGam' + 'eChangTask'],
                    this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS']),
                    this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2']),
                    this['m_bNextGam' + 'eChangTask']) {
                        this['SetChangeT' + 'askIsCheck' + 'ed'](!0x0),
                        this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2']);
                        let a0 = O['default']['GetNumberF' + 'orKey'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2']);
                        if ((a0 = 0x0) < 0xa) {
                            a0++,
                            O['default']['SetLocalIn' + 'fo'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2'], a0);
                            let a1 = U['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](P['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x119), 0x14, cc['color'](0xf9, 0xe1, 0xae), U['ETipsDriec' + 'tType']['UP'], 0x5, -0x68, 0x6, 0x154);
                            a1['setPositio' + 'n'](this['m_pSprBK']['node']['x'] + 0x12c, -0x19),
                            a1['name'] = this['UD_CHANGE_' + 'TASK_TIPS_' + '2'],
                            this['node']['addChild'](a1, 0x64),
                            this['scheduleOn' + 'ce']( () => {
                                this['RemoveTips'](this['UD_CHANGE_' + 'TASK_TIPS_' + '2']);
                            }
                            , 0x5);
                        }
                        this['ShowNextTa' + 'skTips']();
                    } else
                        this['SetChangeT' + 'askIsCheck' + 'ed'](!0x1),
                        this['RemoveTips'](this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS']);
            }
            ['CallFuncCl' + 'ose']() {
                if (!this || !this['node'])
                    return;
                this['node']['opacity'] = 0xff;
                let Z = this['node']['getChildBy' + 'Name'](this['NODE_RESUL' + 'T_TASK']);
                Z && (Z['removeFrom' + 'Parent'](!0x0),
                Z = null),
                this['m_pLabWord' + '2'] && (this['m_pLabWord' + '2']['node']['opacity'] = 0x0),
                this['node']['active'] = !0x1;
            }
            ['CallFuncGe' + 'tAwardAni']() {
                this && this['node'] ? (H['uiManager']['Open'](H['EGameUiId']['Comm_AniAw' + 'ardMoney'], [R['EAniAwardT' + 'ype']['ANI_FREE_R' + 'OOM_TASK'], this['m_iAwardNu' + 'm'], null]),
                this['scheduleOn' + 'ce'](this['CallFuncGe' + 'tAwardAniE' + 'nd'], 2.9)) : G['default']['UnLockMain' + 'Msg']();
            }
            ['CallFuncFi' + 'rstShowEnd']() {
                G['default']['UnLockMain' + 'Msg'](),
                this['m_pLayerSh' + 'adow'] && (this['node']['removeChil' + 'd'](this['m_pLayerSh' + 'adow']),
                this['m_pLayerSh' + 'adow'] = null),
                this['m_pNodeDen' + 'gDai'] && this['m_pNodeDen' + 'gDai']['runAction'](cc['repeat'](cc['sequence'](cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0)), 0x2)),
                this['m_pToggleC' + 'hangeTask'] && (this['m_pToggleC' + 'hangeTask']['node']['active'] = !0x0),
                this['SetChangeT' + 'askIsCheck' + 'ed'](!0x1),
                this['ShowFreeTa' + 'skTips']();
            }
            ['CallFuncSh' + 'owEnd']() {
                console['log']('====CallFu' + 'ncShowEnd=' + '='),
                this['m_pToggleC' + 'hangeTask'] && (this['m_pToggleC' + 'hangeTask']['node']['active'] = !0x0),
                this['SetChangeT' + 'askIsCheck' + 'ed'](!0x1),
                this['ShowFreeTa' + 'skTips']();
            }
            ['ShowFreeTa' + 'skTips']() {
                this['RemoveTips'](this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS']);
                let Z = O['default']['GetNumberF' + 'orKey'](this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS']);
                if (Z < 0x2) {
                    Z++,
                    O['default']['SetLocalIn' + 'fo'](this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS'], Z);
                    let a0 = U['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](P['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x118), 0x16, cc['color'](0xf9, 0xe1, 0xae), U['ETipsDriec' + 'tType']['UP'], 0x1, 0.01, 0x6, 0x118);
                    a0['setPositio' + 'n'](this['m_pSprBK']['node']['x'] + 0x1e, -0x19),
                    a0['name'] = this['UD_FREE_CH' + 'ANGE_TASK_' + 'TIPS'],
                    this['node']['addChild'](a0, 0x64),
                    this['scheduleOn' + 'ce']( () => {
                        a0 && (a0['removeFrom' + 'Parent'](!0x0),
                        a0 = null);
                    }
                    , 0x5);
                }
            }
            ['ShowNextTa' + 'skTips']() {
                this['RemoveTips'](this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS']);
                let Z = U['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](P['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x11a), 0x14, cc['color'](0xf9, 0xe1, 0xae), U['ETipsDriec' + 'tType']['UP'], 0x1, 0x5a, 0x0, 0xc8);
                Z['setPositio' + 'n'](this['m_pSprBK']['node']['x'] + 0x14, -0x5),
                Z['name'] = this['UD_NEXT_CH' + 'ANGE_TASK_' + 'TIPS'],
                this['node']['addChild'](Z, 0x64);
            }
            ['RemoveTips'](Z) {
                let a0 = this['node']['getChildBy' + 'Name'](Z);
                a0 && a0['removeFrom' + 'Parent'](!0x0);
            }
            ['CallFuncGe' + 'tAwardAniE' + 'nd'](Z) {
                G['default']['UnLockMain' + 'Msg'](),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](V['EJL_ANI_NM']['DMINOJL_AN' + 'I_FREE_JB_' + 'END'], this['m_iAwardNu' + 'm']);
                let a0 = this['node']['getChildBy' + 'Name']('AwardAni');
                a0 && this['node']['removeChil' + 'd'](a0),
                this['m_pLayerSh' + 'adow'] && (this['node']['removeChil' + 'd'](this['m_pLayerSh' + 'adow']),
                this['m_pLayerSh' + 'adow'] = null),
                H['uiManager']['CloseUIByI' + 'd'](H['EGameUiId']['Comm_AniAw' + 'ardMoney']);
            }
            ['start']() {}
        }
        ;
        E([X(cc['SpriteAtla' + 's']), F('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? k : Object)], Y['prototype'], 'm_pFreeTas' + 'kAtlas', void 0x0),
        E([X(cc['Sprite']), F('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['Sprite']) ? q : Object)], Y['prototype'], 'm_pSprBK', void 0x0),
        E([X(cc['Node']), F('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof cc && cc['Node']) ? v : Object)], Y['prototype'], 'm_pNodeDen' + 'gDai', void 0x0),
        E([X(cc['Label']), F('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['Label']) ? w : Object)], Y['prototype'], 'm_pLabWord' + '1', void 0x0),
        E([X(cc['Label']), F('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['Label']) ? x : Object)], Y['prototype'], 'm_pLabWord' + '2', void 0x0),
        E([X(cc['Label']), F('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['Label']) ? z : Object)], Y['prototype'], 'm_pLabProg' + 'ress', void 0x0),
        E([X(cc['Label']), F('design:typ' + 'e', 'function' == typeof (B = 'undefined' != typeof cc && cc['Label']) ? B : Object)], Y['prototype'], 'm_pLabGetM' + 'oney', void 0x0),
        E([X(cc['Toggle']), F('design:typ' + 'e', 'function' == typeof (D = 'undefined' != typeof cc && cc['Toggle']) ? D : Object)], Y['prototype'], 'm_pToggleC' + 'hangeTask', void 0x0),
        Y = E([W], Y),
        j['default'] = Y,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/Hw_CommLayer/Comm_AniAwardMoney': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/HwLobbyTipsNode': void 0x0,
        '../../../../script/Common/Base/GameViewBase': void 0x0,
        '../../../../script/Common/Base/UIManager': void 0x0,
        '../../../../script/Common/Res/ResPool': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/CommonLogic': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine'
    }],
    'DoMinoJL_GameInfoLayer': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'e07f4dSWIl' + 'J8brIaMcwz' + 'TPc', 'DoMinoJL_G' + 'ameInfoLay' + 'er');
        var h = this && this['__decorate'] || function(w, x, y, z) {
            var A, B = arguments['length'], C = B < 0x3 ? x : null === z ? z = Object['getOwnProp' + 'ertyDescri' + 'ptor'](x, y) : z;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                C = Reflect['decorate'](w, x, y, z);
            else
                for (var D = w['length'] - 0x1; D >= 0x0; D--)
                    (A = w[D]) && (C = (B < 0x3 ? A(C) : B > 0x3 ? A(x, y, C) : A(x, y)) || C);
            return B > 0x3 && C && Object['defineProp' + 'erty'](x, y, C),
            C;
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        });
        const j = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , k = b('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/A_Tab' + 'leInfo')
          , m = b('../DoMinoJ' + 'L_Define')
          , p = b('./DoMinoJL' + '_GameTopLa' + 'yer')
          , {ccclass: q, property: u} = cc['_decorator'];
        let v = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pBaseUiA' + 'tlas'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pSprSeat' + 'Icon'] = new Array(m['EJL_Define']['MAX_PLAYER' + '_NUM']);
            }
            ['InitGameIn' + 'foLayer'](w, x) {
                this['m_pIGameCa' + 'llBack'] = w,
                this['m_pBaseUiA' + 'tlas'] = x;
            }
            ['OneGameRes' + 'et']() {}
            ['ShowSeatIc' + 'on'](w, x) {
                if (!(w < 0x0 || w >= m['EJL_Define']['MAX_PLAYER' + '_NUM']))
                    if (x)
                        if (null == this['m_pSprSeat' + 'Icon'][w]) {
                            let y = j['default']['GetCompone' + 'nt'](cc['Sprite']);
                            j['default']['SetSpriteF' + 'rame'](this['m_pBaseUiA' + 'tlas'], y, 'DG_game_tx' + '_bg2'),
                            this['m_pSprSeat' + 'Icon'][w] = y['node'],
                            0x1 == w ? k['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == k['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? this['m_pSprSeat' + 'Icon'][w]['setPositio' + 'n'](p['default']['GetPositio' + 'n'](w, 0x0)) : this['m_pSprSeat' + 'Icon'][w]['setPositio' + 'n'](p['default']['GetPositio' + 'n'](w, 0x1)) : this['m_pSprSeat' + 'Icon'][w]['setPositio' + 'n'](p['default']['GetPositio' + 'n'](w)),
                            this['node']['addChild'](this['m_pSprSeat' + 'Icon'][w]);
                        } else
                            0x1 == w && (k['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == k['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? this['m_pSprSeat' + 'Icon'][w]['setPositio' + 'n'](p['default']['GetPositio' + 'n'](w, 0x0)) : this['m_pSprSeat' + 'Icon'][w]['setPositio' + 'n'](p['default']['GetPositio' + 'n'](w, 0x1)));
                    else
                        this['m_pSprSeat' + 'Icon'][w] && (this['node']['removeChil' + 'd'](this['m_pSprSeat' + 'Icon'][w], !0x0),
                        this['m_pSprSeat' + 'Icon'][w] = null);
            }
            ['start']() {}
        }
        ;
        v = h([q], v),
        g['default'] = v,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        './DoMinoJL_GameTopLayer': 'DoMinoJL_G' + 'ameTopLaye' + 'r'
    }],
    'DoMinoJL_GameResult': [function(j, k, q) {
        'use strict';
        cc['_RF']['push'](k, '3087aTKVfx' + 'I1ZmBdhH+N' + 'cdY', 'DoMinoJL_G' + 'ameResult');
        var w, x, z, B, F, H, J, K, O, Q, U, V = this && this['__decorate'] || function(af, ag, ah, ai) {
            var aj, ak = arguments['length'], al = ak < 0x3 ? ag : null === ai ? ai = Object['getOwnProp' + 'ertyDescri' + 'ptor'](ag, ah) : ai;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                al = Reflect['decorate'](af, ag, ah, ai);
            else
                for (var am = af['length'] - 0x1; am >= 0x0; am--)
                    (aj = af[am]) && (al = (ak < 0x3 ? aj(al) : ak > 0x3 ? aj(ag, ah, al) : aj(ag, ah)) || al);
            return ak > 0x3 && al && Object['defineProp' + 'erty'](ag, ah, al),
            al;
        }
        , W = this && this['__metadata'] || function(af, ag) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](af, ag);
        }
        ;
        Object['defineProp' + 'erty'](q, '__esModule', {
            'value': !0x0
        });
        const X = j('../../../.' + './script/C' + 'ommon/Base' + '/UIBase')
          , Y = j('../../../.' + './script/C' + 'ommon/Res/' + 'ResPool')
          , Z = j('../../../.' + './script/C' + 'ommon/Res/' + 'ResUtil')
          , a0 = j('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , a1 = j('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , a2 = j('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , a3 = j('../../../.' + './script/L' + 'ogin/UserM' + 'anager')
          , a4 = j('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , a5 = j('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/A_Tab' + 'leInfo')
          , a6 = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Ani' + 'SingleSpin' + 'e')
          , a7 = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/DoM' + 'ino_UserIc' + 'on')
          , a8 = j('../CardLay' + 'er/DoMinoJ' + 'L_LeaveCar' + 'd')
          , a9 = j('../DoMinoJ' + 'L_CardRule')
          , aa = j('../DoMinoJ' + 'L_Define')
          , ab = j('../DoMinoJ' + 'L_TableInf' + 'o')
          , {ccclass: ac, property: ad} = cc['_decorator'];
        let ae = class extends X['UIBase'] {
            constructor() {
                super(...arguments),
                this['m_pResultA' + 'tlas'] = null,
                this['m_pUserInf' + 'oAltas'] = null,
                this['m_pLableUs' + 'er'] = null,
                this['m_pLablePo' + 'ints'] = null,
                this['m_pLableMu' + 'ltiple'] = null,
                this['m_pLableBe' + 't'] = null,
                this['m_pLablePr' + 'ofit'] = null,
                this['m_pLabelEx' + 'Time'] = null,
                this['m_pNodeLos' + 'e'] = null,
                this['m_pNodeWin'] = null,
                this['m_pLeaveCa' + 'rdFab'] = null,
                this['m_pIGameCa' + 'llBack'] = null;
            }
            ['OnOpen'](af, ...ag) {
                let ah = ag[0x0];
                if (!(ah['length'] >= 0x1))
                    return void this['OnClose']();
                this['m_pIGameCa' + 'llBack'] = ah[0x0];
                let ai = ab['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg'];
                if (!ai)
                    return void this['OnClose']();
                let aj = cc['color'](0x58, 0xa2, 0xb7)
                  , ak = cc['color'](0x76, 0xe4, 0xdb)
                  , al = cc['color'](0x3b, 0x82, 0x99)
                  , am = cc['color'](0x7d, 0xd2, 0xeb);
                this['m_pNodeLos' + 'e']['active'] = !0x1,
                this['m_pNodeWin']['active'] = !0x1;
                let an = null
                  , ao = a5['default']['GetInstanc' + 'e']()['m_iMyServe' + 'rTablePos'];
                console['log']('===pResult' + 'Msg.iShowM' + 'oneyResult' + '==' + ai['iShowMoney' + 'Result'] + '====' + ao + '====' + ai['iMoneyResu' + 'lt']);
                let ap = ai['iShowMoney' + 'Result'][ao] >= 0x0;
                if (ap) {
                    an = this['m_pNodeWin'],
                    a4['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](a4['EJLSoundId']['WIN_RESULT']);
                    let ay = a0['default']['GetCompone' + 'nt'](a6['default']);
                    ay['SetLoop'](!0x0),
                    ay['Init'](a6['ESpineName']['EFF_SPINE_' + 'SKELETON'], -0x1, 'animation'),
                    this['node']['addChild'](ay['node'], 0x1),
                    aj = cc['color'](0xe8, 0x72, 0x8b),
                    ak = cc['color'](0xe4, 0xbc, 0x76),
                    al = cc['color'](0x99, 0x61, 0x3b),
                    am = cc['color'](0xf0, 0x9a, 0x61);
                } else {
                    an = this['m_pNodeLos' + 'e'],
                    a4['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](a4['EJLSoundId']['LOSE_RESUL' + 'T']);
                    let az = a0['default']['GetCompone' + 'nt'](a6['default']);
                    az['SetLoop'](!0x0),
                    az['Init'](a6['ESpineName']['EFF_SPINE_' + 'YDDMN_LOSE'], -0x1, 'animation'),
                    this['node']['addChild'](az['node'], 0x1);
                }
                let aq = a5['default']['GetInstanc' + 'e']()
                  , ar = 0x0
                  , as = 0x56
                  , at = 0x0;
                for (let aA = 0x0; aA < aa['EJL_Define']['MAX_PLAYER' + '_NUM']; aA++)
                    aq['m_arrTable' + 'Player'][aA] && aq['m_arrTable' + 'Player'][aA]['m_cIfReady'] > 0x0 && ar++;
                0x2 == ar ? (as = 0xaa,
                at = 0x46) : 0x3 == ar ? (as = 0x72,
                at = 0x55) : (as = 0x56,
                at = 0x64),
                console['log']('====iNowPl' + 'ayerNum===' + ar + '===' + aq['m_arrTable' + 'Player']),
                this['m_pLableUs' + 'er']['node']['color'] = aj,
                this['m_pLableUs' + 'er']['string'] = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xf),
                this['m_pLablePo' + 'ints']['node']['color'] = aj,
                this['m_pLablePo' + 'ints']['string'] = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x10),
                this['m_pLableMu' + 'ltiple']['node']['color'] = aj,
                this['m_pLableMu' + 'ltiple']['string'] = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x11),
                this['m_pLableBe' + 't']['node']['color'] = aj,
                this['m_pLableBe' + 't']['string'] = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x1a0),
                this['m_pLablePr' + 'ofit']['node']['color'] = aj,
                this['m_pLablePr' + 'ofit']['string'] = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x1a1);
                let au = ''
                  , av = 0x0
                  , aw = 0x0
                  , ax = 0x0;
                for (let aB = ao; aB < ao + aa['EJL_Define']['MAX_PLAYER' + '_NUM']; aB++) {
                    aw = -0x1;
                    let aC = aB % aa['EJL_Define']['MAX_PLAYER' + '_NUM'];
                    if (ax >= ar)
                        break;
                    for (let aD = 0x0; aD < aq['m_arrTable' + 'Player']['length']; aD++)
                        if (aq['m_arrTable' + 'Player'][aD] && aq['m_arrTable' + 'Player'][aD]['m_iServerT' + 'ablePos'] == aC) {
                            aw = aD;
                            break;
                        }
                    if (!(aw < 0x0) && (console['log']('1====iNowP' + 'layerNum==' + '=' + aw + '===' + aB + '===' + aq['m_arrTable' + 'Player']),
                    aq['m_arrTable' + 'Player'][aw] && aq['m_arrTable' + 'Player'][aw]['m_cIfReady'] > 0x0)) {
                        let aE = aq['m_arrTable' + 'Player'][aw];
                        if (ap) {
                            let aR = a0['default']['GetCompone' + 'nt'](cc['Sprite']);
                            a0['default']['SetSpriteF' + 'rame'](this['m_pResultA' + 'tlas'], aR, 'DG_result_' + 'tx_kuang'),
                            aR['node']['setPositio' + 'n'](-0x1b2, at - as * ax),
                            an['addChild'](aR['node']);
                            let aS = a7['default']['GetUserIco' + 'nKuanType'](aE['m_cVip'], 0x0)
                              , aT = 0x0 == aS ? 0x6 : 0xa
                              , aU = a0['default']['GetCompone' + 'nt'](a7['default']);
                            aU['InitUserIc' + 'on'](aE['m_iUserID'], aE['m_szShowUr' + 'l'], aE['m_iShowID'], cc['size'](0x46, 0x46), aS, aT, '', aE['m_iUseProp' + 'ID1'], 0x16),
                            aR['node']['getContent' + 'Size'](),
                            aU['node']['setPositio' + 'n'](0x0, 0x0),
                            aR['node']['addChild'](aU['node']);
                        } else {
                            let aV = a7['default']['GetUserIco' + 'nKuanType'](aE['m_cVip'], 0x1)
                              , aW = 0x1 == aV ? 0x6 : 0xa
                              , aX = a0['default']['GetCompone' + 'nt'](a7['default']);
                            aX['InitUserIc' + 'on'](aE['m_iUserID'], aE['m_szShowUr' + 'l'], aE['m_iShowID'], cc['size'](0x46, 0x46), aV, aW, '', aE['m_iUseProp' + 'ID1'], 0x16),
                            aX['node']['setPositio' + 'n'](-0x1b2, at - as * ax),
                            an['addChild'](aX['node']);
                        }
                        if (an['active'] = !0x0,
                        ai['cBankrupt'][aE['m_iServerT' + 'ablePos']] > 0x0) {
                            let aY = Y['ResPool']['GetInstanc' + 'e']()['GetResAsse' + 'ts'](a2['CFilePaths']['DG_DMN_JL_' + 'WORD'])
                              , aZ = a0['default']['GetCompone' + 'nt'](cc['Sprite']);
                            a0['default']['SetSpriteF' + 'rame'](aY, aZ, 'DG_result_' + 'icon_pc'),
                            aZ['node']['setPositio' + 'n'](-0x1b3, at - as * ax),
                            an['addChild'](aZ['node']);
                        }
                        let aF = null;
                        if (aE['m_cVip'] > 0x0) {
                            let b0 = 'DG_ty_icon' + '_vip_0' + aE['m_cVip'];
                            aF = a0['default']['GetCompone' + 'nt'](cc['Sprite']),
                            a0['default']['SetSpriteF' + 'rame'](this['m_pUserInf' + 'oAltas'], aF, b0),
                            aF['sizeMode'] = cc['Sprite']['SizeMode']['TRIMMED'],
                            aF['type'] = cc['Sprite']['Type']['SIMPLE'],
                            aF['trim'] = !0x0,
                            aF['node']['scale'] = 0.4,
                            aF['node']['setPositio' + 'n'](-0x15e, at - as * ax + 0x18),
                            an['addChild'](aF['node']);
                        }
                        let aG = a0['default']['GetLabel']('', 0x1a, ak);
                        aG['node']['setAnchorP' + 'oint'](0x0, 0.5);
                        let aH = -0x168;
                        aF ? (aH = -0x14f,
                        a0['default']['CutLabelLe' + 'n'](aG, aE['m_szNickNa' + 'me'], 0x7d)) : a0['default']['CutLabelLe' + 'n'](aG, aE['m_szNickNa' + 'me'], 0x96),
                        aG['node']['setPositio' + 'n'](aH, at - as * ax + 0x14),
                        an['addChild'](aG['node']),
                        au = aE['m_iUserID'] == a3['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] ? 'ID:' + aE['m_iUserID'] : 'ID:' + a0['default']['HideUserID'](aE['m_iUserID']);
                        let aI = a0['default']['GetLabel'](au, 0x1a, al);
                        aI['node']['setAnchorP' + 'oint'](0x0, 0.5),
                        aI['node']['setPositio' + 'n'](-0x168, at - as * ax - 0x14),
                        an['addChild'](aI['node']);
                        let aJ = [];
                        aJ['push'](ai['cLeftCard0']),
                        aJ['push'](ai['cLeftCard1']),
                        aJ['push'](ai['cLeftCard2']),
                        aJ['push'](ai['cLeftCard3']),
                        av = 0x0;
                        for (let b1 = 0x0; b1 < ai['cLeftCardN' + 'um'][aE['m_iServerT' + 'ablePos']]; b1++)
                            av += a9['CardRule']['GetCardVal' + '1'](aJ[aE['m_iServerT' + 'ablePos']][b1]) + a9['CardRule']['GetCardVal' + '1'](aJ[aE['m_iServerT' + 'ablePos']][b1]);
                        au = av + '';
                        let aK = a0['default']['GetLabel'](au, 0x1c, am);
                        aK['node']['setPositio' + 'n'](-0xbe, at - as * ax),
                        an['addChild'](aK['node']);
                        let aL = ai['iBeiShu'];
                        au = a1['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x14 + aL) + 'x' + aL;
                        let aM = a0['default']['GetLabel'](au, 0x1c, am);
                        aM['node']['setPositio' + 'n'](-0x4e, at - as * ax),
                        an['addChild'](aM['node']),
                        au = a0['default']['GetMonyStr' + 'ing'](ai['iBasePoint']);
                        let aN = a0['default']['GetLabel'](au, 0x1c, am);
                        aN['node']['setPositio' + 'n'](0x4b, at - as * ax),
                        an['addChild'](aN['node']),
                        au = a0['default']['GetMonyStr' + 'ing'](ai['iBasePoint']);
                        let aO = a0['default']['GetLabel']('', 0x1c);
                        aO['node']['setPositio' + 'n'](0xc3, at - as * ax),
                        an['addChild'](aO['node']),
                        ai['iShowMoney' + 'Result'][aE['m_iServerT' + 'ablePos']] > 0x0 ? (aO['node']['color'] = cc['color'](0xff, 0xe4, 0x4e),
                        au = '+' + a0['default']['GetMonyStr' + 'ing'](ai['iShowMoney' + 'Result'][aE['m_iServerT' + 'ablePos']])) : (aO['node']['color'] = cc['color'](0x42, 0x9b, 0x6a),
                        au = a0['default']['GetMonyStr' + 'ing'](ai['iShowMoney' + 'Result'][aE['m_iServerT' + 'ablePos']]) + ''),
                        aO['string'] = au;
                        for (let b2 = 0x0; b2 < 0x7; b2++) {
                            let b3 = 'DG_result_' + 'icon_pai_b' + 'g2';
                            ap && (b3 = 'DG_result_' + 'icon_pai_b' + 'g1');
                            let b4 = a0['default']['GetCompone' + 'nt'](cc['Sprite']);
                            a0['default']['SetSpriteF' + 'rame'](this['m_pResultA' + 'tlas'], b4, b3),
                            b4['node']['setPositio' + 'n'](0x122 + 0x2a * b2, at - as * ax),
                            an['addChild'](b4['node']),
                            console['log']('===a===' + b2 + '===' + b4['node']['position']);
                        }
                        if (ai['cLeftCardN' + 'um'][aE['m_iServerT' + 'ablePos']] > 0x0) {
                            let b5 = Z['ResUtil']['Instantiat' + 'e'](this['m_pLeaveCa' + 'rdFab'])
                              , b6 = b5['getCompone' + 'nt'](a8['DoMinoJL_L' + 'eaveCard'])
                              , b7 = ai['cLeftCardN' + 'um'][aE['m_iServerT' + 'ablePos']];
                            b6['InitLeaveC' + 'ard'](-0x1, 0.45, 0x2a),
                            an['addChild'](b5),
                            b5['setPositio' + 'n'](0x122, at - as * ax);
                            for (let b8 = 0x0; b8 < b7; b8++)
                                console['log']('1===m_pLea' + 'veCard===' + b7),
                                b6['AddCard'](aJ[aE['m_iServerT' + 'ablePos']][b8]);
                        }
                        let aP = 'DG_result_' + 'lose_line';
                        ap && (aP = 'DG_result_' + 'win_line');
                        let aQ = a0['default']['GetCompone' + 'nt'](cc['Sprite']);
                        a0['default']['SetSpriteF' + 'rame'](this['m_pResultA' + 'tlas'], aQ, aP),
                        aQ['node']['setPositio' + 'n'](0x0, at - as * ax - as / 0x2),
                        an['addChild'](aQ['node']),
                        ax++;
                    }
                }
                this['m_pLabelEx' + 'Time'] && (this['m_pLabelEx' + 'Time']['string'] = ai['cShowTime'] + ''),
                this['unschedule'](this['OnNextTime' + 'r']),
                this['schedule'](this['OnNextTime' + 'r'], 0x1);
            }
            ['OnNextTime' + 'r'](af) {
                console['log']('===OnNextT' + 'imer=='),
                ab['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cShowTime']--,
                this['m_pLabelEx' + 'Time'] && (this['m_pLabelEx' + 'Time']['string'] = ab['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cShowTime'] + ''),
                ab['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cShowTime'] <= 0x0 && (this['unschedule'](this['OnNextTime' + 'r']),
                this['OnBtnNext'](!0x1));
            }
            ['OnBtnChang' + 'e']() {
                a4['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](a4['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackCh' + 'angeTable'](0x1),
                console['log']('===OnBtnCh' + 'ange=='),
                this['OnClose']();
            }
            ['OnBtnNext'](af=!0x0) {
                af && (this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackSe' + 'tTuoGuan'](0x0),
                a4['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](a4['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON'])),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackCo' + 'ntinue'](),
                this['OnClose']();
            }
            ['OnBtnQuitG' + 'ame']() {
                console['log']('===OnBtnQu' + 'itGame=='),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackQu' + 'itGame'](),
                this['OnClose']();
            }
            ['start']() {}
        }
        ;
        V([ad(cc['SpriteAtla' + 's']), W('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? w : Object)], ae['prototype'], 'm_pResultA' + 'tlas', void 0x0),
        V([ad(cc['SpriteAtla' + 's']), W('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? x : Object)], ae['prototype'], 'm_pUserInf' + 'oAltas', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['Label']) ? z : Object)], ae['prototype'], 'm_pLableUs' + 'er', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (B = 'undefined' != typeof cc && cc['Label']) ? B : Object)], ae['prototype'], 'm_pLablePo' + 'ints', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (F = 'undefined' != typeof cc && cc['Label']) ? F : Object)], ae['prototype'], 'm_pLableMu' + 'ltiple', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (H = 'undefined' != typeof cc && cc['Label']) ? H : Object)], ae['prototype'], 'm_pLableBe' + 't', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (J = 'undefined' != typeof cc && cc['Label']) ? J : Object)], ae['prototype'], 'm_pLablePr' + 'ofit', void 0x0),
        V([ad(cc['Label']), W('design:typ' + 'e', 'function' == typeof (K = 'undefined' != typeof cc && cc['Label']) ? K : Object)], ae['prototype'], 'm_pLabelEx' + 'Time', void 0x0),
        V([ad(cc['Node']), W('design:typ' + 'e', 'function' == typeof (O = 'undefined' != typeof cc && cc['Node']) ? O : Object)], ae['prototype'], 'm_pNodeLos' + 'e', void 0x0),
        V([ad(cc['Node']), W('design:typ' + 'e', 'function' == typeof (Q = 'undefined' != typeof cc && cc['Node']) ? Q : Object)], ae['prototype'], 'm_pNodeWin', void 0x0),
        V([ad(cc['Prefab']), W('design:typ' + 'e', 'function' == typeof (U = 'undefined' != typeof cc && cc['Prefab']) ? U : Object)], ae['prototype'], 'm_pLeaveCa' + 'rdFab', void 0x0),
        ae = V([ac], ae),
        q['default'] = ae,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/AniSingleSpine': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/DoMino_UserIcon': void 0x0,
        '../../../../script/Common/Base/UIBase': void 0x0,
        '../../../../script/Common/Res/ResPool': void 0x0,
        '../../../../script/Common/Res/ResUtil': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../../script/Login/UserManager': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../CardLayer/DoMinoJL_LeaveCard': 'DoMinoJL_L' + 'eaveCard',
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../DoMinoJL_TableInfo': 'DoMinoJL_T' + 'ableInfo'
    }],
    'DoMinoJL_GameTopLayer': [function(b, g, j) {
        'use strict';
        cc['_RF']['push'](g, '452d45SeUJ' + 'Oc7BIZHnOj' + 'Wiu', 'DoMinoJL_G' + 'ameTopLaye' + 'r');
        var k, q, v, w, x, z, A, B, D = this && this['__decorate'] || function(P, Q, R, U) {
            var V, W = arguments['length'], X = W < 0x3 ? Q : null === U ? U = Object['getOwnProp' + 'ertyDescri' + 'ptor'](Q, R) : U;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                X = Reflect['decorate'](P, Q, R, U);
            else
                for (var Y = P['length'] - 0x1; Y >= 0x0; Y--)
                    (V = P[Y]) && (X = (W < 0x3 ? V(X) : W > 0x3 ? V(Q, R, X) : V(Q, R)) || X);
            return W > 0x3 && X && Object['defineProp' + 'erty'](Q, R, X),
            X;
        }
        , E = this && this['__metadata'] || function(P, Q) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](P, Q);
        }
        ;
        Object['defineProp' + 'erty'](j, '__esModule', {
            'value': !0x0
        });
        const F = b('../../../.' + './script/C' + 'ommon/Res/' + 'ResUtil')
          , G = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , H = b('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , J = b('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , K = b('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Ani' + 'SingleSpin' + 'e')
          , L = b('../DoMinoJ' + 'L_Define')
          , {ccclass: M, property: N} = cc['_decorator'];
        let O = k = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pBaseAtl' + 'as'] = null,
                this['m_pSprNetF' + 'lag'] = [],
                this['m_pLabelTi' + 'me'] = null,
                this['m_plNetDel' + 'ayTimeTips' + 'BK'] = null,
                this['m_pLabelNe' + 'tDelayTime'] = null,
                this['m_pBtnWait' + 'IntoIcon'] = [],
                this['m_pBackGou' + 'nd'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pSprTuog' + 'uan'] = null,
                this['m_pSprWait' + 'NextStartT' + 'ips'] = null,
                this['m_pSprPass'] = null;
            }
            static['GetPositio' + 'n'](P, Q=0x0) {
                let R = cc['Vec2']['ZERO'];
                return cc['winSize'],
                0x0 == P ? (R['x'] = -0x21c,
                R['y'] = 0x22) : 0x1 == P ? (R['x'] = 0x0,
                R['y'] = -0xde) : 0x2 == P ? (R['x'] = 0x21c,
                R['y'] = 0x22) : 0x3 == P && (R['x'] = 0x0,
                R['y'] = 0x118),
                Q > 0x0 && 0x1 == P && (R['x'] = -0x21c,
                R['y'] = -0xde),
                R;
            }
            ['InitGameTo' + 'pLayer'](P) {
                this['m_pIGameCa' + 'llBack'] = P,
                this['unschedule'](this['OnTimer']),
                this['schedule'](this['OnTimer'], 0x1),
                this['SetNowTime'](),
                this['InitInfo']();
            }
            ['OneGameRes' + 'et']() {
                this['ShowMyself' + 'TuoGuan'](!0x1),
                this['ShowWaitNe' + 'xtStartTip' + 's'](!0x1),
                this['m_pSprPass'] && (this['m_pSprPass']['stopAllAct' + 'ions'](),
                this['node']['removeChil' + 'd'](this['m_pSprPass'], !0x0),
                this['m_pSprPass'] = null);
            }
            ['ShowMyself' + 'TuoGuan'](P) {
                if (P) {
                    if (null == this['m_pSprTuog' + 'uan']) {
                        this['node']['zIndex'] = 0xc8;
                        let Q = new cc['Node']();
                        if (this['m_pSprTuog' + 'uan'] = Q['addCompone' + 'nt'](cc['Sprite']),
                        this['node']['addChild'](Q, 0x3e8),
                        this['m_pBackGou' + 'nd']) {
                            let a0 = F['ResUtil']['Instantiat' + 'e'](this['m_pBackGou' + 'nd']);
                            Q['addChild'](a0, -0x1),
                            a0['setScale'](0x2);
                        }
                        let R = new cc['Node']()
                          , U = R['addCompone' + 'nt'](cc['Sprite']);
                        G['default']['SetSpriteF' + 'rame'](this['m_pBaseAtl' + 'as'], U, 'DG_game_tg' + '_bg'),
                        R['setPositio' + 'n'](0x0, -0x28),
                        Q['addChild'](R, 0x1);
                        let V = G['default']['GetCompone' + 'nt'](K['default']);
                        V['SetLoop'](!0x0),
                        V['Init'](K['ESpineName']['EFF_SPINE_' + 'YDDMN_JQRT' + 'G'], -0x1, 'animation'),
                        V['node']['setPositio' + 'n'](0x0, -0xa),
                        this['m_pSprTuog' + 'uan']['node']['addChild'](V['node']);
                        let W = H['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xc)
                          , X = G['default']['SplitStrin' + 'g'](W, '!@')
                          , Y = 0x0
                          , Z = 0x2;
                        for (let a1 = 0x0; a1 < X['length']; a1++) {
                            let a2 = new cc['Node']()
                              , a3 = a2['addCompone' + 'nt'](cc['Label']);
                            a3['fontSize'] = 0x1a,
                            a2['color'] = cc['color'](0xc3, 0xff, 0xcb),
                            a2['opacity'] = 0xc8,
                            a2['setAnchorP' + 'oint'](0.5, 0.5),
                            a2['setPositio' + 'n'](Y, Z),
                            a3['string'] = X[a1],
                            R['addChild'](a2),
                            Z -= 0x1e;
                        }
                    }
                } else
                    this['m_pSprTuog' + 'uan'] && (this['node']['removeChil' + 'd'](this['m_pSprTuog' + 'uan']['node'], !0x0),
                    this['m_pSprTuog' + 'uan'] = null),
                    this['node']['zIndex'] = 0x5;
            }
            ['ShowWaitIn' + 'toIcon'](P, Q) {
                P < 0x0 || P >= L['EJL_Define']['MAX_PLAYER' + '_NUM'] || this['m_pBtnWait' + 'IntoIcon'][P] && (this['m_pBtnWait' + 'IntoIcon'][P]['node']['active'] = Q,
                this['m_pBtnWait' + 'IntoIcon'][P]['node']['setPositio' + 'n'](k['GetPositio' + 'n'](P)));
            }
            ['SetNetTime'](P) {
                this['node']['active'] && (P >= 0x12c ? (P > 0x3e7 && (P = 0x3e7),
                this['m_pSprNetF' + 'lag'][0x0]['node']['active'] = !0x1,
                this['m_pSprNetF' + 'lag'][0x1]['node']['active'] = !0x1,
                this['m_pSprNetF' + 'lag'][0x2]['node']['active'] = !0x0,
                this['m_pLabelNe' + 'tDelayTime']['string'] = P + 'ms',
                this['m_pLabelNe' + 'tDelayTime']['node']['color'] = cc['color'](0xff, 0x26, 0x5e),
                this['m_plNetDel' + 'ayTimeTips' + 'BK']['node']['active'] = !0x0) : P >= 0x64 ? (this['m_pSprNetF' + 'lag'][0x0]['node']['active'] = !0x1,
                this['m_pSprNetF' + 'lag'][0x1]['node']['active'] = !0x0,
                this['m_pSprNetF' + 'lag'][0x2]['node']['active'] = !0x1,
                this['m_pLabelNe' + 'tDelayTime']['string'] = P + 'ms',
                this['m_pLabelNe' + 'tDelayTime']['node']['color'] = cc['color'](0xbe, 0xa8, 0xbd)) : (this['m_pSprNetF' + 'lag'][0x0]['node']['active'] = !0x0,
                this['m_pSprNetF' + 'lag'][0x1]['node']['active'] = !0x1,
                this['m_pSprNetF' + 'lag'][0x2]['node']['active'] = !0x1,
                this['m_pLabelNe' + 'tDelayTime']['string'] = P + 'ms',
                this['m_pLabelNe' + 'tDelayTime']['node']['color'] = cc['color'](0xbe, 0xa8, 0xbd)));
            }
            ['ShowWaitNe' + 'xtStartTip' + 's'](P) {
                if (console['log']('===ShowWai' + 'tNextStart' + 'Tips===' + P + '===' + this['m_pSprWait' + 'NextStartT' + 'ips']),
                P) {
                    if (null == this['m_pSprWait' + 'NextStartT' + 'ips']) {
                        this['m_pSprWait' + 'NextStartT' + 'ips'] = G['default']['GetCompone' + 'nt'](cc['Sprite']),
                        G['default']['SetSpriteF' + 'rame'](this['m_pBaseAtl' + 'as'], this['m_pSprWait' + 'NextStartT' + 'ips'], 'DG_game_ti' + 'ps_bg'),
                        this['m_pSprWait' + 'NextStartT' + 'ips']['node']['setPositio' + 'n'](0x0, -0xf0),
                        this['node']['addChild'](this['m_pSprWait' + 'NextStartT' + 'ips']['node']);
                        let Q = new cc['Node']()
                          , R = Q['addCompone' + 'nt'](cc['Label']);
                        R['fontSize'] = 0x1a,
                        Q['color'] = cc['color'](0xc3, 0xff, 0xcb),
                        Q['opacity'] = 0xc8,
                        this['m_pSprWait' + 'NextStartT' + 'ips']['node']['getContent' + 'Size'](),
                        Q['setPositio' + 'n'](0x0, -0xa),
                        R['string'] = H['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xb),
                        this['m_pSprWait' + 'NextStartT' + 'ips']['node']['addChild'](Q);
                    }
                } else
                    this['m_pSprWait' + 'NextStartT' + 'ips'] && (this['m_pSprWait' + 'NextStartT' + 'ips']['node']['removeFrom' + 'Parent'](!0x0),
                    this['m_pSprWait' + 'NextStartT' + 'ips'] = null),
                    this['m_pSprWait' + 'NextStartT' + 'ips'] = null;
            }
            ['ShowPass'](P, Q=0x0) {
                if (this['m_pSprPass'] && (this['m_pSprPass']['stopAllAct' + 'ions'](),
                this['node']['removeChil' + 'd'](this['m_pSprPass'], !0x0),
                this['m_pSprPass'] = null),
                null == this['m_pSprPass']) {
                    this['m_pSprPass'] = new cc['Node'](),
                    this['m_pSprPass']['setPositio' + 'n'](k['GetPositio' + 'n'](P, Q)),
                    this['node']['addChild'](this['m_pSprPass']);
                    let R = '';
                    R = 0x0 == P || 0x1 == P ? 'eff_yndmn_' + 'dhk_l_y' : 'eff_yndmn_' + 'dhk_r_y';
                    let U = G['default']['GetCompone' + 'nt'](K['default']);
                    U['Init'](K['ESpineName']['EFF_SPINE_' + 'DHk'], -0x1, R),
                    0x0 == P ? U['node']['setPositio' + 'n'](0x6e, 0x0) : 0x1 == P ? U['node']['setPositio' + 'n'](0x6e, 0x0) : U['node']['setPositio' + 'n'](-0x6e, 0x0),
                    this['m_pSprPass']['addChild'](U['node'], 0x1);
                }
            }
            ['ShowChatTe' + 'xt'](P, Q, R=0x0, U=0x3, V=!0x0) {
                let W = 'ChatTextNo' + 'de_' + P
                  , X = this['node']['getChildBy' + 'Name'](W);
                if (X && (X['removeFrom' + 'Parent'](!0x0),
                X = null),
                '' == Q)
                    return;
                let Y = k['GetPositio' + 'n'](P, R)
                  , Z = new cc['Node']();
                Z['name'] = W,
                this['node']['addChild'](Z, 0xa),
                Z['active'] = !0x1;
                let a0 = G['default']['GetLabel'](Q, 0x14, cc['color'](0x91, 0x44, 0x19));
                Z['addChild'](a0['node'], 0x1);
                let a1 = G['default']['GetCompone' + 'nt'](cc['Sprite']);
                G['default']['SetSpriteF' + 'rame'](this['m_pBaseAtl' + 'as'], a1, 'DG_ltk_ltq' + 'p_bg1'),
                a1['type'] = cc['Sprite']['Type']['SLICED'],
                Z['addChild'](a1['node'], -0x1),
                Z['active'] = !0x0,
                V && (Z['setScale'](0.8),
                Z['runAction'](cc['sequence'](cc['scaleTo'](0.2, 1.1), cc['scaleTo'](0.15, 0.9), cc['scaleTo'](0.1, 0x1)))),
                Z['runAction'](cc['sequence'](cc['delayTime'](U), cc['removeSelf']()));
                let a2 = cc['size'](G['default']['GetLabelSi' + 'ze'](a0)['width'] + 0x28, 0x32);
                a2['width'] < 0x62 && (a2['width'] = 0x62),
                a1['node']['setContent' + 'Size'](a2),
                P >= 0x2 && P <= 0x3 ? (a1['node']['scaleX'] = -0x1,
                a1['node']['setPositio' + 'n'](-0x4 - 0.5 * (a2['width'] - 0x62), 0.5 * a2['height']),
                Z['setPositio' + 'n'](Y['x'] - 0x50, Y['y'] + 0x30),
                0x3 == P && Z['setPositio' + 'n'](Y['x'] - 0x4b, Y['y'] + 0xe)) : (a1['node']['setPositio' + 'n'](0x4 + 0.5 * (a2['width'] - 0x62), 0.5 * a2['height']),
                Z['setPositio' + 'n'](Y['x'] + 0x3c, Y['y'] + 0x44),
                0x0 == P && Z['setPositio' + 'n'](Y['x'] + 0x50, Y['y'] + 0x30)),
                a0['node']['setPositio' + 'n'](a1['node']['getPositio' + 'n']()['x'], a1['node']['getPositio' + 'n']()['y'] + 0x4);
            }
            ['OnJLTouchS' + 'tart'](P) {
                let Q = this['node']['convertToN' + 'odeSpaceAR'](P['touch']['getLocatio' + 'n']());
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackSe' + 'tTuoGuan'](0x0),
                this['m_pSprNetF' + 'lag'][0x0] && this['m_pSprNetF' + 'lag'][0x0]['node']['getBoundin' + 'gBox']()['contains'](Q) ? this['m_plNetDel' + 'ayTimeTips' + 'BK']['node']['active'] = !this['m_plNetDel' + 'ayTimeTips' + 'BK']['node']['active'] : this['m_plNetDel' + 'ayTimeTips' + 'BK']['node']['active'] = !0x1;
            }
            ['OnJLTouchE' + 'nd'](P) {}
            ['OnTimer'](P) {
                this['SetNowTime']();
            }
            ['InitInfo']() {
                this['ShowMyself' + 'TuoGuan'](!0x1),
                this['ShowWaitNe' + 'xtStartTip' + 's'](!0x1);
                for (let P = 0x0; P < L['EJL_Define']['MAX_PLAYER' + '_NUM']; P++)
                    this['ShowWaitIn' + 'toIcon'](P, !0x0);
                this['m_pSprPass'] = null;
            }
            ['SetNowTime']() {
                this['m_pLabelTi' + 'me'] && (this['m_pLabelTi' + 'me']['string'] = G['default']['TimeToStri' + 'ng'](0x0, G['ETimeToStr' + 'ingType']['HOUR_MIN']));
            }
            ['OnBtnSitDo' + 'wn'](P, Q) {
                if (J['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](J['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                P['target'],
                this['m_pIGameCa' + 'llBack']) {
                    let R = Number['parseInt'](Q);
                    this['m_pIGameCa' + 'llBack']['CallBackSi' + 'tDown'](0x0, R);
                }
            }
            ['onLoad']() {
                this['m_plNetDel' + 'ayTimeTips' + 'BK'] && (this['m_plNetDel' + 'ayTimeTips' + 'BK']['node']['active'] = !0x1),
                this['SetNetTime'](0xa);
            }
            ['start']() {}
        }
        ;
        D([N(cc['SpriteAtla' + 's']), E('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? q : Object)], O['prototype'], 'm_pBaseAtl' + 'as', void 0x0),
        D([N({
            'type': [cc['Sprite']],
            'tooltip': 'NetFlag'
        }), E('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof Array && Array) ? v : Object)], O['prototype'], 'm_pSprNetF' + 'lag', void 0x0),
        D([N(cc['Label']), E('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['Label']) ? w : Object)], O['prototype'], 'm_pLabelTi' + 'me', void 0x0),
        D([N(cc['Sprite']), E('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['Sprite']) ? x : Object)], O['prototype'], 'm_plNetDel' + 'ayTimeTips' + 'BK', void 0x0),
        D([N(cc['Label']), E('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['Label']) ? z : Object)], O['prototype'], 'm_pLabelNe' + 'tDelayTime', void 0x0),
        D([N({
            'type': [cc['Button']],
            'tooltip': 'WaitInto'
        }), E('design:typ' + 'e', 'function' == typeof (A = 'undefined' != typeof Array && Array) ? A : Object)], O['prototype'], 'm_pBtnWait' + 'IntoIcon', void 0x0),
        D([N(cc['Prefab']), E('design:typ' + 'e', 'function' == typeof (B = 'undefined' != typeof cc && cc['Prefab']) ? B : Object)], O['prototype'], 'm_pBackGou' + 'nd', void 0x0),
        O = k = D([M], O),
        j['default'] = O,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/Hw_CommLayer/AniSingleSpine': void 0x0,
        '../../../../script/Common/Res/ResUtil': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine'
    }],
    'DoMinoJL_GameView': [function(a0, a1, a2) {
        'use strict';
        cc['_RF']['push'](a1, 'a3a9e6wm2N' + 'MeaHc/slor' + 'XwJ', 'DoMinoJL_G' + 'ameView');
        var a3, a4, a5, a6, a7, a8, a9, aa, ab, ac, ad, af, ag, ah, ai, aj, ak, al = this && this['__decorate'] || function(b3, b4, b5, b6) {
            var b7, b8 = arguments['length'], b9 = b8 < 0x3 ? b4 : null === b6 ? b6 = Object['getOwnProp' + 'ertyDescri' + 'ptor'](b4, b5) : b6;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                b9 = Reflect['decorate'](b3, b4, b5, b6);
            else
                for (var ba = b3['length'] - 0x1; ba >= 0x0; ba--)
                    (b7 = b3[ba]) && (b9 = (b8 < 0x3 ? b7(b9) : b8 > 0x3 ? b7(b4, b5, b9) : b7(b4, b5)) || b9);
            return b8 > 0x3 && b9 && Object['defineProp' + 'erty'](b4, b5, b9),
            b9;
        }
        , am = this && this['__metadata'] || function(b3, b4) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](b3, b4);
        }
        ;
        Object['defineProp' + 'erty'](a2, '__esModule', {
            'value': !0x0
        });
        const an = a0('../../../S' + 'criptLobby' + '/A_GameCom' + 'm/A_BaseTc' + 'pMsg')
          , ao = a0('../../../S' + 'criptLobby' + '/A_GameCom' + 'm/A_GameVi' + 'ew')
          , ap = a0('../../../S' + 'criptLobby' + '/A_GameCom' + 'm/A_TableI' + 'nfo')
          , aq = a0('../../../S' + 'criptLobby' + '/Chat/Chat' + 'Data')
          , ar = a0('../../../S' + 'criptLobby' + '/Hw_CommLa' + 'yer/AniPla' + 'yerFlyCoin')
          , as = a0('../../../S' + 'criptLobby' + '/Hw_CommLa' + 'yer/AniSin' + 'gleSpine')
          , at = a0('../../../S' + 'criptLobby' + '/Hw_CommLa' + 'yer/Comm_A' + 'niAwardMon' + 'ey')
          , au = a0('../../../s' + 'cript/Comm' + 'on/Base/Ga' + 'meViewBase')
          , av = a0('../../../s' + 'cript/Comm' + 'on/Base/UI' + 'Manager')
          , aw = a0('../../../s' + 'cript/Comm' + 'on/Res/Res' + 'Util')
          , ax = a0('../../../s' + 'cript/Comm' + 'on/Struct/' + 'StructDeco' + 'rators')
          , ay = a0('../../../s' + 'cript/Comm' + 'on/Util/Co' + 'mmonUtils')
          , az = a0('../../../s' + 'cript/Comm' + 'onLogic')
          , aA = a0('../../../s' + 'cript/Conf' + 'igs/AppCom' + 'monCfg')
          , aB = a0('../../../s' + 'cript/Conf' + 'igs/GameTe' + 'xtConfig')
          , aC = a0('../../../s' + 'cript/Conf' + 'igs/HW_Gam' + 'eTextBase')
          , aD = a0('../../../s' + 'cript/Game' + 'MsgBox')
          , aE = a0('../../../s' + 'cript/Hw_C' + 'omm/GameDe' + 'fine')
          , aF = a0('../../../s' + 'cript/Logi' + 'n/UserMana' + 'ger')
          , aG = a0('../../../s' + 'cript/Netw' + 'ork/HttpMa' + 'nager')
          , aH = a0('../../../s' + 'cript/Soun' + 'ds/SoundMa' + 'nager')
          , aI = a0('./CardLaye' + 'r/DoMinoJL' + '_LeaveCard')
          , aJ = a0('./CardLaye' + 'r/DoMinoJL' + '_SelfHandC' + 'ard')
          , aK = a0('./CardLaye' + 'r/DoMinoJL' + '_SendCard')
          , aL = a0('./DoMinoJL' + '_CardRule')
          , aM = a0('./DoMinoJL' + '_Data')
          , aN = a0('./DoMinoJL' + '_Define')
          , aO = a0('./DoMinoJL' + '_Msg')
          , aP = a0('./DoMinoJL' + '_TableInfo')
          , aQ = a0('./GameUI/D' + 'oMinoJL_De' + 'alCardAni')
          , aR = a0('./GameUI/D' + 'oMinoJL_Fr' + 'eeTaskLaye' + 'r')
          , aS = a0('./GameUI/D' + 'oMinoJL_Ga' + 'meInfoLaye' + 'r')
          , aT = a0('./GameUI/D' + 'oMinoJL_Ga' + 'meTopLayer')
          , aU = a0('./GameUI/D' + 'oMinoJL_Ga' + 'meWordTips')
          , aV = a0('./GameUI/D' + 'oMinoJL_Le' + 'aveCardNum')
          , aW = a0('./GameUI/D' + 'oMinoJL_On' + 'eTaskLayer')
          , aX = a0('./GameUI/D' + 'oMinoJL_Sp' + 'inIcon')
          , aY = a0('./PlayerIn' + 'fo/DoMinoJ' + 'L_PlayerDe' + 'tailsInfo')
          , aZ = a0('./PlayerIn' + 'fo/DoMinoJ' + 'L_PlayerIn' + 'fo')
          , {ccclass: b0, property: b1} = cc['_decorator'];
        let b2 = class extends ao['default'] {
            constructor() {
                super(...arguments),
                this['UD_KEY_JL_' + 'SOUND_OPEN'] = 'key_jl_sou' + 'nd_open',
                this['UD_KEY_JLB' + 'ET_SOUND_O' + 'PEN'] = 'key_jlbet_' + 'sound_open',
                this['DEAL_CARD_' + 'ANI'] = 'pDealCardA' + 'ni',
                this['m_pBaseUiA' + 'tlas'] = null,
                this['m_pPlayerI' + 'nfoFab'] = null,
                this['m_pLeaveCa' + 'rdFab'] = null,
                this['m_pDealCar' + 'dAni'] = null,
                this['m_pSelfHan' + 'dCard'] = null,
                this['m_pSendCar' + 'd'] = null,
                this['m_pGameTop' + 'Layer'] = null,
                this['m_pLeaveCa' + 'rdPointNum'] = null,
                this['m_pOneTask' + 'Layer'] = null,
                this['m_pFreeTas' + 'kLayer'] = null,
                this['m_pJLSpinI' + 'con'] = null,
                this['m_pJLWordT' + 'ips'] = null,
                this['m_pLableBe' + 't'] = null,
                this['m_pCoinAtl' + 'as'] = null,
                this['m_pCoinFon' + 't'] = null,
                this['m_pPlayerD' + 'etailsFab'] = null,
                this['m_pNodeTas' + 'kMask'] = null,
                this['m_pGameInf' + 'oLayer'] = null,
                this['m_pPlayerI' + 'nfo'] = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['m_pLeaveCa' + 'rd'] = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['m_pPlayerD' + 'etails'] = null,
                this['m_iShowHid' + 'eGameTime'] = 0x0;
            }
            ['InitGameEl' + 'ement']() {
                super['InitGameEl' + 'ement'](),
                this['m_pPlayerI' + 'nfo'] = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['m_pLeaveCa' + 'rd'] = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM']);
                for (let b3 = 0x0; b3 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b3++)
                    this['m_pPlayerI' + 'nfo'][b3] = null,
                    this['m_pLeaveCa' + 'rd'][b3] = null;
                this['m_pLableBe' + 't'] && (this['m_pLableBe' + 't']['string'] = ''),
                this['m_pGameInf' + 'oLayer'] = null;
            }
            ['CallBackHa' + 'ndleMainSo' + 'cketNetMsg'](b3, b4) {
                super['CallBackHa' + 'ndleMainSo' + 'cketNetMsg'](b3, b4),
                console['log']('===DoMinoJ' + 'L_GameView' + '==iMsgType' + '===' + b3),
                b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_DE' + 'AL_CARDS_S' + 'ERVER_MSG'] ? this['HandleDeal' + 'Cards'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_SE' + 'ND_CARDS_S' + 'ERVER_MSG'] ? this['HandleSend' + 'Cards'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_SE' + 'ND_CARDS_N' + 'OTICE_MSG'] ? this['HandleSend' + 'CardsNotic' + 'e'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_GA' + 'ME_RESULT_' + 'SERVER_MSG'] ? this['HandleGame' + 'Result'](b4) : b3 == an['EA_MsgType']['GAME_ONE_T' + 'ASK_INFO'] ? this['HandleOneT' + 'askMsg'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_CH' + 'OOSE_FREE_' + 'TASK_MSG'] ? this['HandleChoo' + 'seFreeTask'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_FR' + 'EE_TASK_IN' + 'FO_NOTICE'] ? this['HandleFree' + 'TaskInfoNo' + 'tice'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_FR' + 'EE_TASK_SU' + 'CC_NOTICE'] ? this['HandleFree' + 'TaskSuccNo' + 'tice'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_RES'] ? this['HandleSpin' + 'ActivityOp' + 'enPrizeRes'](b4) : b3 == aO['EJL_MsgTyp' + 'e']['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_INFO_NOT' + 'ICE'] && this['HandleSpin' + 'ActivityIn' + 'foNotice'](b4);
            }
            ['HandleSpin' + 'ActivityOp' + 'enPrizeRes'](b3) {
                ax['StructPars' + 'eData'](aO['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'sp'], b3),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'sp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleSpin' + 'ActivityIn' + 'foNotice'](b3) {
                ax['StructPars' + 'eData'](aO['DMINOJL_Sp' + 'inActivity' + 'InfoPrizeR' + 'sp'], b3),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Sp' + 'inActivity' + 'InfoPrizeR' + 'sp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleDeal' + 'Cards'](b3) {
                aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['GAME_START']),
                this['OneStartRe' + 'setGameInf' + 'o']();
                for (let b6 = 0x0; b6 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b6++)
                    this['m_pPlayerI' + 'nfo'][b6] && this['m_pPlayerI' + 'nfo'][b6]['ShowReady'](!0x1);
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitNe' + 'xtStartTip' + 's'](!0x1);
                let b4 = ap['default']['GetInstanc' + 'e']();
                b4['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] && b4['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] && (b4['m_iGameSta' + 'te'] = ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT']),
                this['ShowTableP' + 'layerNextT' + 'ime'](0x0),
                this['PlayGameSt' + 'artTime'](0x0);
                let b5 = ax['StructPars' + 'eData'](aO['DMINOJL_De' + 'alCardsSer' + 'verRsp'], b3);
                if (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r'] = b4['GetClientT' + 'ablePos'](b5['cGameBanke' + 'r']),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cIsSpinAct' + 'ivity'] = b5['cIsSpinAct' + 'ivity'],
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r'] >= 0x0 && this['m_pPlayerI' + 'nfo'][aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r']] && this['m_pPlayerI' + 'nfo'][aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r']]['ShowTableB' + 'ank'](),
                b4['m_iTableMo' + 'ney'] > 0x0)
                    for (let b7 = 0x0; b7 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b7++)
                        if (b4['m_arrTable' + 'Player'][b7] && b4['m_arrTable' + 'Player'][b7]['m_cIfReady'] > 0x0) {
                            b4['m_arrTable' + 'Player'][b7]['m_iMoney'] -= b4['m_iTableMo' + 'ney'];
                            for (let b8 = 0x0; b8 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b8++)
                                if (this['m_pPlayerI' + 'nfo'][b8] && this['m_pPlayerI' + 'nfo'][b8]['m_iUserID'] == b4['m_arrTable' + 'Player'][b7]['m_iUserID']) {
                                    this['m_pPlayerI' + 'nfo'][b8]['UpdateMone' + 'y'](b4['m_arrTable' + 'Player'][b7]['m_iMoney'], 0x0);
                                    break;
                                }
                        }
                if (b4['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT']) {
                    let b9 = [0x0, 0x0, 0x0, 0x0];
                    for (let bb = 0x0; bb < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bb++)
                        b4['m_arrTable' + 'Player'][bb] && b4['m_arrTable' + 'Player'][bb]['m_cIfReady'] > 0x0 && (b9[bb] = 0x1),
                        aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r'] == bb && (b9[bb] = 0x2);
                    let ba = aw['ResUtil']['Instantiat' + 'e'](this['m_pDealCar' + 'dAni'])['getCompone' + 'nt'](aQ['default']);
                    ba['InitSendCa' + 'rdAni'](this, b5['cCardNum'], b5['cSelfCards'], b9),
                    ba['node']['name'] = this['DEAL_CARD_' + 'ANI'],
                    this['node']['addChild'](ba['node'], 0x6),
                    au['default']['LockMainMs' + 'g'](),
                    console['log']('0===Handle' + 'DealCards=' + '==' + au['default']['m_iLockMai' + 'nMsgCount'] + '=' + b4['m_iGameSta' + 'te']);
                } else {
                    for (let bc = 0x0; bc < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bc++)
                        aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][bc] = b5['cCardNum'],
                        this['m_pPlayerI' + 'nfo'][bc] && this['m_pPlayerI' + 'nfo'][bc]['UpdateCard' + 'Num'](b5['cCardNum']);
                    console['log']('1===Handle' + 'DealCards=' + '==' + au['default']['m_iLockMai' + 'nMsgCount'] + '=' + b4['m_iGameSta' + 'te']);
                }
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_De' + 'alCardsSer' + 'verRsp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleSend' + 'Cards'](b3) {
                if (ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_NO'])
                    return void console['log']('1====A_GAM' + 'E_NO====' + b3['byteLength'] + '==========' + ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te']);
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Se' + 'ndCardsSer' + 'verRsp'], b3)
                  , b5 = ap['default']['GetInstanc' + 'e']()
                  , b6 = -0x1;
                for (let b8 = 0x0; b8 < this['m_pPlayerI' + 'nfo']['length']; b8++)
                    if (this['m_pPlayerI' + 'nfo'][b8] && this['m_pPlayerI' + 'nfo'][b8]['GetServerT' + 'ablePos']() == b4['cTableNumE' + 'xtra']) {
                        b6 = b8;
                        break;
                    }
                if (console['log']('==HandleSe' + 'ndCards=iT' + 'ablePos===' + b6 + '===' + b4['cTableNumE' + 'xtra']),
                -0x1 == b6)
                    return;
                if (b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] || b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'])
                    return console['log']('3==SetSend' + 'CardTime==' + '==' + b5['m_iSendCar' + 'dTime']),
                    void (this['m_pPlayerI' + 'nfo'][b6] && (this['ClearPlaye' + 'rDownTime'](),
                    this['m_pPlayerI' + 'nfo'][b6]['SetSendCar' + 'dTime'](b5['m_iSendCar' + 'dTime'])));
                let b7 = !0x0;
                if (0x1 == b6 && this['m_pSelfHan' + 'dCard'])
                    if (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_S' + 'END']),
                    -0x1 != aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card']) {
                        this['m_pSelfHan' + 'dCard']['ResetAllSh' + 'adowCard'](),
                        b7 = this['m_pSelfHan' + 'dCard']['JudgeHandS' + 'endCard']();
                        let b9 = [];
                        this['m_pSelfHan' + 'dCard']['GetAllCard'](b9),
                        !b7 && b9['length'] > 0x0 ? (this['unschedule'](this['OnTimeAuto' + 'Pass']),
                        this['schedule'](this['OnTimeAuto' + 'Pass'], 0.3),
                        this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                        console['log']('4==HANDCAR' + 'D_NORMAL==')) : this['m_pSelfHan' + 'dCard']['BlowUpSend' + 'Card']();
                    } else
                        this['m_pSelfHan' + 'dCard']['BlowUpSend' + 'Card'](0.3),
                        this['m_pSelfHan' + 'dCard']['ShowSendCa' + 'rdTips'](!0x0);
                this['m_pPlayerI' + 'nfo'][b6] && (0x1 == b6 && b5['m_arrTable' + 'Player'][0x1] && 0x1 == b5['m_arrTable' + 'Player'][0x1]['m_cIfTuoGu' + 'an'] ? (console['log']('5==SetSend' + 'CardTime==' + b5['m_iSendCar' + 'dTime'] + '===' + b5['m_fTuoGuan' + 'AutoTime']),
                this['ClearPlaye' + 'rDownTime'](),
                this['m_pPlayerI' + 'nfo'][b6]['SetSendCar' + 'dTime'](b5['m_iSendCar' + 'dTime'], b5['m_fTuoGuan' + 'AutoTime'])) : 0x1 != b6 || b7 ? 0x1 == b6 && b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && 0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1] && aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['bIfAutoSen' + 'dLastCard'] ? this['CallBackAu' + 'toSendCard']() : (console['log']('2==SetSend' + 'CardTime==' + b5['m_iSendCar' + 'dTime']),
                this['ClearPlaye' + 'rDownTime'](),
                this['m_pPlayerI' + 'nfo'][b6]['SetSendCar' + 'dTime'](b5['m_iSendCar' + 'dTime']),
                !b5['m_arrTable' + 'Player'][b6] || 0x1 != b5['m_arrTable' + 'Player'][b6]['m_cIfTuoGu' + 'an'] && 0x1 != b5['m_arrTable' + 'Player'][b6]['m_cIfDis'] || au['default']['LockMainMs' + 'gTimer'](0xa * b5['m_fTuoGuan' + 'AutoTime'])) : (console['log']('1==SetSend' + 'CardTime==' + '0'),
                this['m_pPlayerI' + 'nfo'][b6]['SetSendCar' + 'dTime'](0x0))),
                this['m_pGameTop' + 'Layer'] && b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['m_pGameTop' + 'Layer']['ShowWaitNe' + 'xtStartTip' + 's'](!0x1),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Se' + 'ndCardsSer' + 'verRsp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleSend' + 'CardsNotic' + 'e'](b3, b4=!0x1) {
                if (ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_NO'])
                    return void console['log']('0====A_GAM' + 'E_NO====' + b3['byteLength'] + '==========' + ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te']);
                let b5 = ax['StructPars' + 'eData'](aO['DMINOJL_Se' + 'ndCardsNot' + 'iceRsp'], b3);
                console['log']('====Handle' + 'SendCardsN' + 'otice====' + b3['byteLength'] + '======' + ax['GetStruct'](aO['DMINOJL_Se' + 'ndCardsNot' + 'iceRsp'])['GetTypeSiz' + 'e']() + '====' + ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te']),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Se' + 'ndCardsNot' + 'iceRsp'])['GetTypeSiz' + 'e']()));
                let b6 = ap['default']['GetInstanc' + 'e']()
                  , b7 = -0x1;
                for (let b8 = 0x0; b8 < this['m_pPlayerI' + 'nfo']['length']; b8++)
                    if (this['m_pPlayerI' + 'nfo'][b8] && this['m_pPlayerI' + 'nfo'][b8]['GetServerT' + 'ablePos']() == b5['cTableNumE' + 'xtra']) {
                        b7 = b8;
                        break;
                    }
                if (console['log']('==HandleSe' + 'ndCardsNot' + 'ice=iTable' + 'Pos===' + b7 + '===' + b5['cTableNumE' + 'xtra']),
                -0x1 != b7) {
                    if (b6['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT']) {
                        if (!b4 && b5['cCardNum'] > 0x0 && 0x1 == b7)
                            return;
                        if (b5['cCardNum'] > 0x0 && (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][b7]--,
                        0x1 != b7 && this['m_pPlayerI' + 'nfo'][b7])) {
                            let b9 = this['m_pPlayerI' + 'nfo'][b7]['node']['getPositio' + 'n']()
                              , ba = this['m_pPlayerI' + 'nfo'][b7]['node']['parent']['convertToW' + 'orldSpaceA' + 'R'](b9);
                            this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](b5['cCard'], b5['cOriType'], ba, !0x0, b7, this['GetPlayerU' + 'sePropID'](b7, 0x3)),
                            au['default']['LockMainMs' + 'g']();
                        }
                        0x1 == b7 && this['m_pSelfHan' + 'dCard'] && (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                        console['log']('0==HANDCAR' + 'D_NORMAL=='),
                        b5['cCardNum'] > 0x0 && this['m_pSelfHan' + 'dCard']['ResetAllSh' + 'adowCard'](),
                        -0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card'] && this['m_pSelfHan' + 'dCard']['ShowSendCa' + 'rdTips'](!0x1),
                        0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1] && this['m_pSelfHan' + 'dCard']['ShowAutoSe' + 'ndLabel'](!0x0));
                    } else if (b5['cCardNum'] > 0x0 && (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][b7]--,
                    this['m_pPlayerI' + 'nfo'][b7])) {
                        let bb = this['m_pPlayerI' + 'nfo'][b7]['node']['getPositio' + 'n']()
                          , bc = this['m_pPlayerI' + 'nfo'][b7]['node']['parent']['convertToW' + 'orldSpaceA' + 'R'](bb);
                        this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](b5['cCard'], b5['cOriType'], bc, !0x0, b7, this['GetPlayerU' + 'sePropID'](b7, 0x3)),
                        au['default']['LockMainMs' + 'g']();
                    }
                    if (0x0 == b5['cCardNum']) {
                        if (b5['iLoseMoney'] > 0x0) {
                            b6['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && 0x1 == b7 && this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['ShowNoCard' + 'Send'](!0x0),
                            this['m_pPlayerI' + 'nfo'][b7] && (this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowPass'](b7, this['m_pPlayerI' + 'nfo'][b7]['GetIFMyRea' + 'l']()),
                            b6['m_arrTable' + 'Player'][b7] && b6['GetOpenGam' + 'eSound']() && aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayRandEf' + 'fect'](b6['m_arrTable' + 'Player'][b7]['m_cSexType'], aH['EJLSoundId']['PASS_NM'])),
                            b6['m_arrTable' + 'Player'][b7] && (b6['m_arrTable' + 'Player'][b7]['m_iMoney'] -= b5['iLoseMoney']);
                            let bd = -0x1;
                            for (let be = 0x0; be < this['m_pPlayerI' + 'nfo']['length']; be++)
                                if (this['m_pPlayerI' + 'nfo'][be] && this['m_pPlayerI' + 'nfo'][be]['GetServerT' + 'ablePos']() == b5['cWinTableP' + 'os']) {
                                    bd = be;
                                    break;
                                }
                            if (-0x1 != bd) {
                                b6['m_arrTable' + 'Player'][bd] && (b6['m_arrTable' + 'Player'][bd]['m_iMoney'] += b5['iLoseMoney']);
                                let bf = ay['default']['GetMonyStr' + 'ing'](b5['iLoseMoney'], 0x0, !0x0)
                                  , bg = b6['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? 0x0 : 0x1
                                  , bh = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](b7, bg)
                                  , bi = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](bd, bg)
                                  , bj = new cc['Node']()
                                  , bk = bj['addCompone' + 'nt'](ar['AniPlayerF' + 'lyCoin']);
                                bk['SetInfo'](bh, bi, b7, bd, 0x6, bf, !0x0, !0x1),
                                bk['SetCallBac' + 'kInfo'](aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_PASS_FLY' + 'COIN'], this),
                                bk['SetOneCoin' + 'FlyTime'](this['GetFlyCoin' + 'Time'](bh, bi), 0x0),
                                bk['StartAnim'](this['m_pCoinAtl' + 'as'], this['m_pCoinFon' + 't']),
                                this['node']['addChild'](bj, 0x6),
                                au['default']['LockMainMs' + 'g']();
                            }
                        }
                        aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['SetPassCar' + 'dValNum'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'], aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'], b7),
                        this['m_pPlayerI' + 'nfo'][b7] && (this['m_pPlayerI' + 'nfo'][b7]['AddPassCar' + 'dVal'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val']),
                        this['m_pPlayerI' + 'nfo'][b7]['AddPassCar' + 'dVal'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al']));
                    }
                    this['m_pPlayerI' + 'nfo'][b7] && (this['m_pPlayerI' + 'nfo'][b7]['UpdateCard' + 'Num'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][b7]),
                    console['log']('4==SetSend' + 'CardTime==' + '==0'),
                    this['m_pPlayerI' + 'nfo'][b7]['SetSendCar' + 'dTime'](0x0));
                }
            }
            ['HandleGame' + 'Result'](b3) {
                au['default']['LockMainMs' + 'g'](),
                console['log']('===HandleG' + 'ameResult=' + '==');
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Ga' + 'meResultSe' + 'rverRsp'], b3);
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['SetLocalGa' + 'meResult'](b4),
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['OneGameRes' + 'et'](),
                this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['SetAllShad' + 'owCard'](),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['SetResultC' + 'ard'](b4['cLastSendC' + 'ard'], b4['iBeiShu']),
                this['ClearPlaye' + 'rDownTime'](),
                this['SetPlayerD' + 'etailsActi' + 've'](!0x1),
                this['unschedule'](this['OnTimeDela' + 'yShowResul' + 't']),
                this['schedule'](this['OnTimeDela' + 'yShowResul' + 't'], 0x1),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Ga' + 'meResultSe' + 'rverRsp'])['GetTypeSiz' + 'e']()));
            }
            ['ClearPlaye' + 'rDownTime']() {
                for (let b3 = 0x0; b3 < this['m_pPlayerI' + 'nfo']['length']; b3++)
                    this['m_pPlayerI' + 'nfo'][b3] && this['m_pPlayerI' + 'nfo'][b3]['ClearDownT' + 'ime']();
            }
            ['OnTimeDela' + 'yShowResul' + 't'](b3) {
                this['unschedule'](this['OnTimeDela' + 'yShowResul' + 't']),
                0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['DEAD_END']) : aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['NORMAL_END']);
                let b4 = ay['default']['GetCompone' + 'nt'](as['default'])
                  , b5 = as['ESpineName']['EFF_PAIXIN' + 'G']
                  , b6 = -0x1;
                b6 = 0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? 0x5 : 0x2 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? 0x1 : 0x3 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? 0x6 : 0x4 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? 0x2 : 0x3;
                let b7 = 0x1;
                b4 && (b4['Init'](b5, b6),
                b4['node']['setPositio' + 'n'](-0x1e, 0x6e),
                this['node']['addChild'](b4['node'], 0x1e),
                b7 = 2.6),
                0x1 == ap['default']['GetInstanc' + 'e']()['m_iGameTyp' + 'e'] ? this['schedule'](this['OnTimeClea' + 'rTableCard'], b7) : 0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iBeiShu'] ? this['schedule'](this['OnTimeClea' + 'rTableCard'], 0.1) : this['schedule'](this['OnTimeClea' + 'rTableCard'], b7);
                let b8 = cc['Vec2']['ZERO']
                  , b9 = cc['Vec2']['ZERO']
                  , ba = 0x0
                  , bb = -0x1
                  , bc = ''
                  , bd = !0x1
                  , be = ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? 0x0 : 0x1;
                for (let bf = 0x0; bf < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bf++)
                    if (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iShowMoney' + 'Result'][bf] > 0x0) {
                        b8 = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](bf, be);
                        for (let bg = 0x0; bg < this['m_pPlayerI' + 'nfo']['length']; bg++)
                            if (this['m_pPlayerI' + 'nfo'][bg] && this['m_pPlayerI' + 'nfo'][bg]['GetServerT' + 'ablePos']() == bf) {
                                b8 = this['m_pPlayerI' + 'nfo'][bg]['node']['getPositio' + 'n']();
                                break;
                            }
                        ba = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iShowMoney' + 'Result'][bf],
                        bb = bf,
                        bc = ay['default']['GetMonyStr' + 'ing'](ba, 0x0, !0x0);
                        break;
                    }
                if (-0x1 != bb) {
                    let bh = !0x1;
                    for (let bi = 0x0; bi < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bi++) {
                        if (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]) {
                            let bj = ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]['m_iServerT' + 'ablePos'];
                            ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]['m_iMoney'] += aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt'][bj],
                            ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]['m_iMoney'] < 0x0 && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]['m_iMoney'] = 0x0),
                            ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && this['UpdateLobb' + 'yUserInfo'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bi], 0x1);
                        }
                        if (this['m_pPlayerI' + 'nfo'][bi] && aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cBankrupt'][this['m_pPlayerI' + 'nfo'][bi]['GetServerT' + 'ablePos']()] > 0x0 && this['m_pPlayerI' + 'nfo'][bi]['ShowBankru' + 'pt'](!0x0),
                        aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt'][bi] < 0x0) {
                            bh = !0x0,
                            b9 = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](bi, be);
                            for (let bm = 0x0; bm < this['m_pPlayerI' + 'nfo']['length']; bm++)
                                if (this['m_pPlayerI' + 'nfo'][bm] && this['m_pPlayerI' + 'nfo'][bm]['GetServerT' + 'ablePos']() == bi) {
                                    b9 = this['m_pPlayerI' + 'nfo'][bm]['node']['getPositio' + 'n']();
                                    break;
                                }
                            let bk = new cc['Node']()
                              , bl = bk['addCompone' + 'nt'](ar['AniPlayerF' + 'lyCoin']);
                            bd ? (bl['SetInfo'](b9, b8, bi, bb, 0x6),
                            bl['SetCallBac' + 'kInfo'](aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_0'], this)) : (bd = !0x0,
                            bl['SetInfo'](b9, b8, bi, bb, 0x6, bc, !0x0, !0x0),
                            bl['SetCallBac' + 'kInfo'](aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_1'], this)),
                            bl['SetOneCoin' + 'FlyTime'](1.1, 0x0),
                            bl['StartAnim'](this['m_pCoinAtl' + 'as'], this['m_pCoinFon' + 't']),
                            this['node']['addChild'](bk, 0x6);
                        }
                    }
                    bh || this['OnBtnConti' + 'nue']();
                } else {
                    for (let bn = 0x0; bn < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bn++)
                        this['m_pPlayerI' + 'nfo'][bn] && (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cBankrupt'][this['m_pPlayerI' + 'nfo'][bn]['GetServerT' + 'ablePos']()] > 0x0 && this['m_pPlayerI' + 'nfo'][bn]['ShowBankru' + 'pt'](!0x0),
                        ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bn] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bn]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bn]['m_iMoney'] < 0x0 && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bn]['m_iMoney'] = 0x0),
                        this['UpdateLobb' + 'yUserInfo'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][bn], 0x1)));
                    this['schedule'](this['ShowGameRe' + 'sult'], b7 + 0.2);
                }
            }
            ['OnTimeClea' + 'rTableCard'](b3) {
                if (this['unschedule'](this['OnTimeClea' + 'rTableCard']),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['RemoveAllC' + 'ard'](),
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT']) {
                    for (let b4 = 0x0; b4 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b4++) {
                        let b5 = b4;
                        for (let b6 = 0x0; b6 < this['m_pPlayerI' + 'nfo']['length']; b6++)
                            if (this['m_pPlayerI' + 'nfo'][b6] && this['m_pPlayerI' + 'nfo'][b6]['GetServerT' + 'ablePos']() == b4) {
                                b5 = b6;
                                break;
                            }
                        if (b4 != ap['default']['GetInstanc' + 'e']()['m_iMyServe' + 'rTablePos'] && null == this['m_pLeaveCa' + 'rd'][b4]) {
                            let b7 = aw['ResUtil']['Instantiat' + 'e'](this['m_pLeaveCa' + 'rdFab']);
                            this['m_pLeaveCa' + 'rd'][b4] = b7['getCompone' + 'nt'](aI['DoMinoJL_L' + 'eaveCard']);
                            let b8 = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cLeftCardN' + 'um'][b4];
                            this['m_pLeaveCa' + 'rd'][b4]['InitLeaveC' + 'ard'](b5),
                            this['node']['addChild'](b7);
                            let b9 = [];
                            b9['push'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cLeftCard0']),
                            b9['push'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cLeftCard1']),
                            b9['push'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cLeftCard2']),
                            b9['push'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cLeftCard3']);
                            for (let ba = 0x0; ba < b8; ba++) {
                                let bb = b9[b4][ba];
                                this['m_pLeaveCa' + 'rd'][b4]['AddCard'](bb);
                            }
                            this['m_pLeaveCa' + 'rd'][b4]['SetAllShad' + 'owCard']();
                        }
                    }
                    this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['SetAllShad' + 'owCard']();
                }
            }
            ['HandleOneT' + 'askMsg'](b3) {
                let b4 = ax['StructPars' + 'eData'](an['OneTaskMsg' + 'Rsp'], b3);
                console['log']('=====cEven' + 'tID===' + b4['cEventID']),
                console['log']('=====cShow' + 'Center===' + b4['cShowCente' + 'r']),
                console['log']('=====iTask' + 'ID===' + b4['iTaskID']),
                console['log']('=====szTas' + 'kName===' + b4['szTaskName']),
                console['log']('=====iTask' + 'Type===' + b4['iTaskType']),
                console['log']('=====iAwar' + 'dNum===' + b4['iAwardNum']),
                console['log']('=====iAwar' + 'dNumAct===' + b4['iAwardNumA' + 'ct']),
                console['log']('=====szAct' + 'Time===' + b4['szActTime']),
                console['log']('=====iActT' + 'ime===' + b4['iActTime']),
                console['log']('=====iDoub' + 'leCard===' + b4['iDoubleCar' + 'd']),
                0x0 == b4['cEventID'] ? 0x0 != b4['iTaskID'] && (b4['cShowCente' + 'r'] > 0x0 ? this['ShowHideOn' + 'eTask'](!0x0, !0x1, b4, !0x0) : this['ShowHideOn' + 'eTask'](!0x0, !0x1, b4)) : 0x1 == b4['cEventID'] ? 0x0 != b4['iTaskID'] && this['ShowHideOn' + 'eTask'](!0x0, !0x1, b4) : 0x2 == b4['cEventID'] ? (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iYBNum'] += b4['iAwardNum'],
                ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && this['UpdateLobb' + 'yUserInfo'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1])),
                this['ShowHideOn' + 'eTask'](!0x0, !0x0, b4)) : 0x3 == b4['cEventID'] && this['ShowHideOn' + 'eTask'](!0x0, !0x0),
                b4['iDoubleCar' + 'd'],
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](an['OneTaskMsg' + 'Rsp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleChoo' + 'seFreeTask'](b3) {
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Ch' + 'ooseFreeTa' + 'skRsp'], b3);
                this['CloseLoadi' + 'ngTip'](),
                av['uiManager']['Open'](av['EGameUiId']['DoMinoJL_F' + 'reeTaskCho' + 'oseLayer'], [b4, this]),
                this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['SetNextGam' + 'eChangTask'](!0x1),
                0x0 == b4['iType'] && this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['CloseFreeT' + 'ask'](),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Ch' + 'ooseFreeTa' + 'skRsp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleFree' + 'TaskInfoNo' + 'tice'](b3) {
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Fr' + 'eeTaskInfo' + 'NoticeRsp'], b3);
                console['log']('===pNotice' + 'Rsp.cState' + '===' + b4['cState']),
                0x0 == b4['cState'] && this['SendSitReq'](),
                console['log']('1===pNotic' + 'eRsp.cStat' + 'e===' + b4['pTaskInfo']['iFreeTaskI' + 'D']),
                0x0 != b4['pTaskInfo']['iFreeTaskI' + 'D'] && this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['ShowFreeTa' + 'sk'](b4['pTaskInfo'], this, new cc['Vec2'](-0x2bc,0x12c), new cc['Vec2'](-0x2bc,0xed)),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Fr' + 'eeTaskInfo' + 'NoticeRsp'])['GetTypeSiz' + 'e']()));
            }
            ['HandleFree' + 'TaskSuccNo' + 'tice'](b3) {
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Fr' + 'eeTaskSucc' + 'NoticeRsp'], b3);
                0x0 == b4['iType'] ? this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['RefreshNow' + 'SuccNum'](b4['iNowSuccNu' + 'm']) : 0x1 == b4['iType'] && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1] && ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iMoney'] += b4['iAwardNum'],
                ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && this['UpdateLobb' + 'yUserInfo'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1])),
                this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['SetTaskRes' + 'ult'](b4['iAwardNum'], this),
                this['SendLeaveT' + 'ableReq'](0x3),
                this['SendChangF' + 'reeTask']()),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Fr' + 'eeTaskSucc' + 'NoticeRsp'])['GetTypeSiz' + 'e']()));
            }
            ['CallBackSi' + 'tDown'](b3, b4) {
                this['SendSitReq'](b3, ap['default']['GetInstanc' + 'e']()['GetServerT' + 'ablePos'](b4));
            }
            ['LocalShowC' + 'hooseFreeT' + 'ask'](b3) {
                this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['ShowFreeTa' + 'sk'](b3, this, new cc['Vec2'](-0x104,-0x64), new cc['Vec2'](-0x2bc,0xed), !0x0),
                this['SendSitReq']();
            }
            ['HandleGame' + 'InfoRes'](b3) {
                let b4 = ax['StructPars' + 'eData'](an['GameInfoRs' + 'p'], b3);
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm'] = b4['iGameInfo'][0x0],
                b4['iGameInfo'][0x0] > 0x0 ? (this['m_iIfAutoC' + 'onnet'] = 0x0,
                ap['default']['GetInstanc' + 'e']()['m_iGameTyp' + 'e'] = b4['cGameType'],
                ap['default']['GetInstanc' + 'e']()['m_iMinStar' + 'tNum'] = b4['cMinStartN' + 'um'],
                ap['default']['GetInstanc' + 'e']()['m_iBaseSco' + 're'] = b4['iBaseScore'],
                ap['default']['GetInstanc' + 'e']()['m_iTableMo' + 'ney'] = b4['iTableMone' + 'y'],
                ap['default']['GetInstanc' + 'e']()['m_iAutoSta' + 'rTime'] = b4['iAutoStarT' + 'ime'],
                ap['default']['GetInstanc' + 'e']()['m_iSendCar' + 'dTime'] = b4['iSendCardT' + 'ime'],
                ap['default']['GetInstanc' + 'e']()['m_fTuoGuan' + 'AutoTime'] = b4['fTuoGuanAu' + 'toTime'],
                ap['default']['GetInstanc' + 'e']()['m_iKickMon' + 'ey'] = b4['iKickMoney'],
                ap['default']['GetInstanc' + 'e']()['m_iBackUpI' + 'ntoMoney'] = b4['iBackUpInt' + 'oMoney'],
                this['GetGameInf' + 'oOK'](b3),
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](an['GameInfoRs' + 'p'])['GetTypeSiz' + 'e']()))) : super['HandleGame' + 'InfoRes'](b3);
            }
            ['GetGameInf' + 'oOK'](b3) {
                if (super['GetGameInf' + 'oOK'](b3),
                this['m_pLableBe' + 't']) {
                    let b4 = ay['default']['GetMonyStr' + 'ing'](ap['default']['GetInstanc' + 'e']()['m_iBaseSco' + 're']);
                    b4 = aB['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x3) + ':' + b4,
                    this['m_pLableBe' + 't']['string'] = b4,
                    this['m_pLableBe' + 't']['node']['opacity'] = 0xb4;
                }
            }
            ['OneStartRe' + 'setGameInf' + 'o']() {
                this['m_pSendCar' + 'd'] && (this['m_pSendCar' + 'd']['node']['zIndex'] = 0x3,
                this['m_pSendCar' + 'd']['Reset']()),
                this['m_pLeaveCa' + 'rdPointNum'] && (this['m_pLeaveCa' + 'rdPointNum']['node']['zIndex'] = 0x8,
                this['m_pLeaveCa' + 'rdPointNum']['ResetNumbe' + 'rScrolle'](),
                this['m_pLeaveCa' + 'rdPointNum']['Show'](!0x1)),
                this['m_pGameTop' + 'Layer'] && (this['m_pGameTop' + 'Layer']['node']['zIndex'] = 0x7,
                this['m_pGameTop' + 'Layer']['OneGameRes' + 'et']()),
                this['m_pSelfHan' + 'dCard'] && (this['m_pSelfHan' + 'dCard']['node']['zIndex'] = 0x7,
                this['m_pSelfHan' + 'dCard']['Reset']()),
                this['m_pOneTask' + 'Layer'] && (this['m_pOneTask' + 'Layer']['node']['zIndex'] = 0x8),
                this['m_pFreeTas' + 'kLayer'] && (this['m_pFreeTas' + 'kLayer']['node']['zIndex'] = 0x8),
                this['m_pNodeTas' + 'kMask'] && (this['m_pNodeTas' + 'kMask']['zIndex'] = 0x8),
                this['m_pAGameTo' + 'pLayer'] && (this['m_pAGameTo' + 'pLayer']['node']['zIndex'] = 0xb);
            }
            ['ShowTableP' + 'layerNextT' + 'ime'](b3) {
                let b4 = ap['default']['GetInstanc' + 'e']();
                for (let b5 = 0x0; b5 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b5++)
                    0x1 != b5 && b4['m_arrTable' + 'Player'][b5] && 0x0 == b4['m_arrTable' + 'Player'][b5]['m_cIfReady'] && this['m_pPlayerI' + 'nfo'][b5] && b3 > 0x0 && (this['m_pPlayerI' + 'nfo'][b5]['SetResNext' + 'Time'](b3),
                    b4['m_arrTable' + 'Player'][b5]['m_cShowNex' + 'tTime'] = b3);
            }
            ['OnTimeAuto' + 'Pass'](b3) {
                console['log']('====OnTime' + 'AutoPass==' + '='),
                this['unschedule'](this['OnTimeAuto' + 'Pass']),
                this['m_pPlayerI' + 'nfo'][0x1]['SetSendCar' + 'dTime'](0x0);
                let b4 = new aO['DMINOJL_Se' + 'ndCardsReq']();
                b4['cCardNum'] = 0x0,
                this['SendMsgToM' + 'ainSocket'](ax['GetStruct'](aO['DMINOJL_Se' + 'ndCardsReq'])['Serialize'](b4), aO['EJL_MsgTyp' + 'e']['DMINOJL_SE' + 'ND_CARDS_R' + 'EQ_MSG']);
            }
            ['SetGameSou' + 'ndState'](b3) {
                super['SetGameSou' + 'ndState'](b3),
                b3 ? au['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'] == aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'] ? az['default']['SetLocalIn' + 'fo'](this['UD_KEY_JL_' + 'SOUND_OPEN'], 0x1) : az['default']['SetLocalIn' + 'fo'](this['UD_KEY_JLB' + 'ET_SOUND_O' + 'PEN'], 0x1) : au['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'] == aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'] ? az['default']['SetLocalIn' + 'fo'](this['UD_KEY_JL_' + 'SOUND_OPEN'], 0x0) : az['default']['SetLocalIn' + 'fo'](this['UD_KEY_JLB' + 'ET_SOUND_O' + 'PEN'], 0x0);
            }
            ['CallBackGa' + 'meAni'](b3, b4) {
                let b5 = ap['default']['GetInstanc' + 'e']();
                if (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_HEAD_MOV' + 'E'] == b3)
                    0x0 == b4 ? au['default']['LockMainMs' + 'g']() : 0x1 == b4 && (au['default']['UnLockMain' + 'Msg'](),
                    this['ResetShowS' + 'eatIcon'](),
                    b5['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && b5['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] || b5['m_arrTable' + 'Player'][0x1] && 0x0 == b5['m_arrTable' + 'Player'][0x1]['m_cIfReady'] && this['m_pPlayerI' + 'nfo'][0x1] && this['m_pPlayerI' + 'nfo'][0x1]['ShowWatch'](!0x0));
                else if (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_PASS_FLY' + 'COIN'] == b3)
                    if (b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_F' + 'IRST_FLY_O' + 'VER'])
                        for (let b6 = 0x0; b6 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b6++) {
                            for (let b7 = 0x0; b7 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b7++)
                                if (this['m_pPlayerI' + 'nfo'][b7] && b5['m_arrTable' + 'Player'][b6] && this['m_pPlayerI' + 'nfo'][b7]['m_iUserID'] == b5['m_arrTable' + 'Player'][b6]['m_iUserID']) {
                                    this['m_pPlayerI' + 'nfo'][b7]['UpdateMone' + 'y'](b5['m_arrTable' + 'Player'][b6]['m_iMoney']);
                                    break;
                                }
                            b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && b5['m_arrTable' + 'Player'][b6] && b5['m_arrTable' + 'Player'][b6]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] && (b5['m_arrTable' + 'Player'][b6]['m_iMoney'] < 0x0 && (b5['m_arrTable' + 'Player'][b6]['m_iMoney'] = 0x0),
                            this['UpdateLobb' + 'yUserInfo'](b5['m_arrTable' + 'Player'][b6]));
                        }
                    else
                        b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_A' + 'LL_ANI_END'] ? (this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['ResetAllSh' + 'adowCard'](),
                        au['default']['UnLockMain' + 'Msg']()) : b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_P' + 'LAY_SOUND'] && aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['COIN_FLY']);
                else if (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_RESULT_F' + 'LYCOIN_1'] == b3)
                    if (b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_F' + 'IRST_FLY_O' + 'VER']) {
                        console['log']('===EJL_ANI' + '_NM===' + aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt']);
                        for (let b8 = 0x0; b8 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b8++)
                            if (b5['m_arrTable' + 'Player'][b8])
                                for (let b9 = 0x0; b9 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b9++)
                                    if (this['m_pPlayerI' + 'nfo'][b9] && this['m_pPlayerI' + 'nfo'][b9]['m_iUserID'] == b5['m_arrTable' + 'Player'][b8]['m_iUserID']) {
                                        let ba = this['m_pPlayerI' + 'nfo'][b9]['GetServerT' + 'ablePos']();
                                        console['log']('1===EJL_AN' + 'I_NM===' + b8 + '====' + ba + '===' + b5['m_arrTable' + 'Player'][b8]['m_iMoney'] + '===' + aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt'][ba]),
                                        aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt'][ba] >= 0x0 ? this['m_pPlayerI' + 'nfo'][b9]['UpdateMone' + 'y'](b5['m_arrTable' + 'Player'][b8]['m_iMoney']) : this['m_pPlayerI' + 'nfo'][b9]['UpdateMone' + 'y'](b5['m_arrTable' + 'Player'][b8]['m_iMoney'], aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['iMoneyResu' + 'lt'][ba]);
                                        break;
                                    }
                        this['ShowHideOn' + 'eTask'](!0x1);
                    } else
                        b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_A' + 'LL_ANI_END'] ? this['ShowGameRe' + 'sult'](0x0) : b4 == ar['ECoinAniSt' + 'ate']['ICB_APFC_P' + 'LAY_SOUND'] && aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['COIN_FLY']);
                else if (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_0'] == b3) {
                    let bb = b4;
                    this['m_pPlayerI' + 'nfo'][bb] && (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][bb]++,
                    this['m_pPlayerI' + 'nfo'][bb]['UpdateCard' + 'Num'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][bb]));
                } else if (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_1'] == b3) {
                    let bc = b4;
                    this['m_pSelfHan' + 'dCard'] && (this['m_pSelfHan' + 'dCard']['AddCard'](bc),
                    aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1]++,
                    aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['SetLeaveCa' + 'rdPointNum'](bc, -0x1));
                } else
                    aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_DEAL_CAR' + 'D_2'] == b3 ? (au['default']['UnLockMain' + 'Msg'](),
                    this['m_pSelfHan' + 'dCard'] && (0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iGameBanke' + 'r'] && b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] ? (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_S' + 'END']),
                    this['m_pSelfHan' + 'dCard']['BlowUpSend' + 'Card'](0.3)) : this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                    console['log']('1==HANDCAR' + 'D_NORMAL==')),
                    this['m_pLeaveCa' + 'rdPointNum'] && (this['m_pLeaveCa' + 'rdPointNum']['ResetNumbe' + 'rScrolle'](),
                    this['m_pLeaveCa' + 'rdPointNum']['Show'](!0x0))) : aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_WIN_END'] == b3 || (aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_GET_MOVE' + '_END'] == b3 ? (au['default']['UnLockMain' + 'Msg'](),
                    this['m_pPlayerI' + 'nfo'][0x1] && b5['m_arrTable' + 'Player'][0x1] && this['m_pPlayerI' + 'nfo'][0x1]['UpdateYB'](b5['m_arrTable' + 'Player'][0x1]['m_iYBNum'], b4)) : aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_FREE_JB_' + 'END'] == b3 ? this['m_pPlayerI' + 'nfo'][0x1] && b5['m_arrTable' + 'Player'][0x1] && this['m_pPlayerI' + 'nfo'][0x1]['UpdateMone' + 'y'](b5['m_arrTable' + 'Player'][0x1]['m_iMoney'], b4) : aN['EJL_ANI_NM']['DMINOJL_AN' + 'I_GET_SPIN' + '_AWARD_END'] == b3 && this['m_pJLSpinI' + 'con'] && this['m_pJLSpinI' + 'con']['UpdatePerc' + 'ent']());
            }
            ['ResetShowS' + 'eatIcon']() {
                if (ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'])
                    for (let b3 = 0x0; b3 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b3++)
                        console['log']('1===this.m' + '_pPlayerIn' + 'fo[i]===' + this['m_pPlayerI' + 'nfo'][b3] + '==' + b3),
                        null == this['m_pPlayerI' + 'nfo'][b3] ? (this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b3, !0x0),
                        this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b3, !0x1)) : (this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b3, !0x1),
                        this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b3, !0x1));
                else
                    for (let b4 = 0x0; b4 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b4++)
                        console['log']('0===this.m' + '_pPlayerIn' + 'fo[i]===' + this['m_pPlayerI' + 'nfo'][b4] + '==' + b4),
                        null == this['m_pPlayerI' + 'nfo'][b4] ? (this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b4, !0x0),
                        this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b4, !0x1)) : (this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b4, !0x1),
                        this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b4, !0x1));
            }
            ['ShowGameRe' + 'sult'](b3) {
                this['unschedule'](this['ShowGameRe' + 'sult']);
                let b4 = ap['default']['GetInstanc' + 'e']();
                0x1 == b4['m_iGameTyp' + 'e'] && b4['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] ? (this['CloseShowL' + 'ayer'](),
                av['uiManager']['Open'](av['EGameUiId']['DoMinoJL_G' + 'ameResult'], [this])) : this['OnBtnConti' + 'nue']();
            }
            ['OnBtnConti' + 'nue']() {
                let b3 = ap['default']['GetInstanc' + 'e']()
                  , b4 = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cWaitNext'];
                if (au['default']['UnLockMain' + 'Msg'](),
                this['OneGameRes' + 'etGameInfo'](),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm'] > 0x0 && 0x1 == b4)
                    ;
                else if (this['IFContinue' + 'Game']()) {
                    let b5 = !0x0;
                    if (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm'] > 0x0 && (console['log']('==pJLTable' + '.iIFFreeRo' + 'om=' + aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm']),
                    this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['GetNextGam' + 'eChangTask']() && (b5 = !0x1,
                    this['SendLeaveT' + 'ableReq'](0x3),
                    this['SendChangF' + 'reeTask']())),
                    b5) {
                        let b6 = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cStarTime']
                          , b7 = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['gameResult' + 'Msg']['cShowTime'];
                        b3['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] && (b3['m_iGameSta' + 'te'] = ap['EA_GAME_ST' + 'ATE']['A_GAME_NO'],
                        b6 <= 0x0 ? this['SendReadyR' + 'eq']() : this['PlayGameSt' + 'artTime'](b6),
                        b7 > 0x0 && this['ShowTableP' + 'layerNextT' + 'ime'](b7));
                    }
                }
            }
            ['AddPlayerT' + 'oTable'](b3) {
                super['AddPlayerT' + 'oTable'](b3);
                let b4 = ap['default']['GetInstanc' + 'e']();
                if (-0x1 != b4['m_iChoiceS' + 'itTablePos'] && 0x1 == b3) {
                    let b5 = b4['m_iChoiceS' + 'itTablePos']
                      , b6 = 0x0 != b5;
                    if (b4['m_iChoiceS' + 'itTablePos'] = -0x1,
                    null == this['m_pPlayerI' + 'nfo'][b5]) {
                        let b7 = aw['ResUtil']['Instantiat' + 'e'](this['m_pPlayerI' + 'nfoFab']);
                        this['m_pPlayerI' + 'nfo'][b5] = b7['getCompone' + 'nt'](aZ['DoMinoJL_P' + 'layerInfo']),
                        this['m_pPlayerI' + 'nfo'][b5]['InitPlayer' + 'Info'](b5, 0x0, this),
                        this['node']['addChild'](b7, 0x1),
                        this['m_pPlayerI' + 'nfo'][b5]['SetPlayerI' + 'nfo'](b4['m_arrTable' + 'Player'][0x1]),
                        0x1 == b5 && this['m_pPlayerI' + 'nfo'][b5]['PlayMoveAn' + 'i'](0x3e7, !0x1);
                    }
                    if (0x1 != b5) {
                        let b8 = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM'])
                          , b9 = new Array(aN['EJL_Define']['MAX_PLAYER' + '_NUM']);
                        for (let bb = 0x0; bb < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bb++)
                            b8[bb] = this['m_pPlayerI' + 'nfo'][bb],
                            this['m_pPlayerI' + 'nfo'][bb] = null,
                            b9[bb] = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][bb],
                            aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][bb] = 0x0;
                        let ba = 0x0;
                        for (let bc = 0x0; bc < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bc++)
                            null != b8[bc] && -0x1 != (ba = b4['GetClientP' + 'osFormMySe' + 'rverPos'](b8[bc]['GetServerT' + 'ablePos']())) && (this['m_pPlayerI' + 'nfo'][ba] = b8[bc],
                            this['m_pPlayerI' + 'nfo'][ba]['PlayMoveAn' + 'i'](ba, b6),
                            aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][ba] = b9[bc],
                            this['SetPlayerD' + 'etailsActi' + 've'](!0x1));
                    }
                } else if (null == this['m_pPlayerI' + 'nfo'][b3]) {
                    let bd = aw['ResUtil']['Instantiat' + 'e'](this['m_pPlayerI' + 'nfoFab']);
                    this['m_pPlayerI' + 'nfo'][b3] = bd['getCompone' + 'nt'](aZ['DoMinoJL_P' + 'layerInfo']),
                    0x1 == b3 && b4['m_arrTable' + 'Player'][b3] && b4['m_arrTable' + 'Player'][b3]['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] ? (this['m_pPlayerI' + 'nfo'][b3]['InitPlayer' + 'Info'](b3, 0x1, this),
                    b4['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] && (b4['m_iGameSta' + 'te'] = ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'])) : this['m_pPlayerI' + 'nfo'][b3]['InitPlayer' + 'Info'](b3, 0x0, this),
                    this['node']['addChild'](bd, 0x1),
                    this['m_pPlayerI' + 'nfo'][b3]['SetPlayerI' + 'nfo'](b4['m_arrTable' + 'Player'][b3]),
                    b4['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && b4['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] || b4['m_arrTable' + 'Player'][b3] && 0x0 == b4['m_arrTable' + 'Player'][b3]['m_cIfReady'] && this['m_pPlayerI' + 'nfo'][b3]['ShowWatch'](!0x0),
                    this['ResetShowS' + 'eatIcon']();
                } else
                    this['m_pPlayerI' + 'nfo'][b3]['SetPlayerI' + 'nfo'](b4['m_arrTable' + 'Player'][b3]);
            }
            ['PlayerRead' + 'yOK'](b3) {
                super['PlayerRead' + 'yOK'](b3),
                this['m_pPlayerI' + 'nfo'][b3] && ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && (this['m_pPlayerI' + 'nfo'][b3]['ShowReady'](!0x0),
                this['m_pPlayerI' + 'nfo'][b3]['SetResNext' + 'Time'](0x0)),
                0x1 == b3 && this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitNe' + 'xtStartTip' + 's'](!0x1);
            }
            ['CallBackSe' + 'ndCard'](b3, b4, b5) {
                console['log']('==CallBack' + 'SendCard=' + b3 + ('==cCardNum' + '==') + b4 + ('=cOriType=' + '=') + b5),
                this['unschedule'](this['OnTimeAuto' + 'Pass']),
                this['m_pPlayerI' + 'nfo'][0x1]['SetSendCar' + 'dTime'](0x0);
                let b6 = new aO['DMINOJL_Se' + 'ndCardsReq']();
                b6['cCardNum'] = b4,
                b6['cCard'] = b3,
                b6['cOriType'] = b5,
                this['SendMsgToM' + 'ainSocket'](ax['GetStruct'](aO['DMINOJL_Se' + 'ndCardsReq'])['Serialize'](b6), aO['EJL_MsgTyp' + 'e']['DMINOJL_SE' + 'ND_CARDS_R' + 'EQ_MSG']),
                b4 > 0x0 && (aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1]--,
                this['m_pPlayerI' + 'nfo'][0x1] && (this['m_pPlayerI' + 'nfo'][0x1]['UpdateCard' + 'Num'](aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1]),
                this['m_pPlayerI' + 'nfo'][0x1]['SetSendCar' + 'dTime'](0x0)),
                this['m_pSelfHan' + 'dCard'] && (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                console['log']('0==HANDCAR' + 'D_NORMAL=='),
                this['m_pSelfHan' + 'dCard']['ResetAllSh' + 'adowCard'](),
                -0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card'] && this['m_pSelfHan' + 'dCard']['ShowSendCa' + 'rdTips'](!0x1),
                0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iCardNum'][0x1] && this['m_pSelfHan' + 'dCard']['ShowAutoSe' + 'ndLabel'](!0x0))),
                au['default']['LockMainMs' + 'g']();
            }
            ['CallBackSe' + 'ndCardEnd'](b3) {
                if (aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['EJLSoundId']['SEND_CARD']),
                this['m_pLeaveCa' + 'rdPointNum'] && this['m_pLeaveCa' + 'rdPointNum']['SetNumberS' + 'crolle'](),
                0x1 == b3) {
                    let b4 = aM['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']
                      , b5 = this['m_pSendCar' + 'd']['GetLastSen' + 'dCard']();
                    if (b5 && aL['CardRule']['IsPair'](b5['cCard']) && 0x1 == aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cIsSpinAct' + 'ivity'] && !b4['bIsSpinMax']) {
                        let b6 = b4['iCurNum'];
                        if (aM['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iCurNum'] += b4['iProgressU' + 'nit'],
                        this['m_pJLSpinI' + 'con']) {
                            this['m_pJLSpinI' + 'con']['AddFlyAniE' + 'ffect'](new cc['Vec2'](b5['iX'],b5['iY']));
                            let b7 = 'dominojl_s' + 'pin_activi' + 'ty_show_ti' + 'ps_' + au['default']['m_GlobalIn' + 'fo']['m_iUserID']
                              , b8 = Number['parseInt'](az['default']['GetLocalIn' + 'fo'](b7));
                            if ((b8 < 0x0 || b6 < 0x64) && (b8 = 0x0),
                            b6 < 0x64 && b4['iCurNum'] >= 0x64 && 0x0 == b8) {
                                let b9 = aC['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x8);
                                this['m_pJLSpinI' + 'con']['ShowTips'](b9),
                                az['default']['SetLocalIn' + 'fo'](b7, 0x1);
                            }
                        }
                    }
                }
                au['default']['UnLockMain' + 'Msg']();
            }
            ['OnDestroy']() {
                console['log']('1===OnDest' + 'roy==='),
                this['m_pBaseUiA' + 'tlas'] = null,
                this['m_pPlayerI' + 'nfoFab'] = null,
                this['m_pLeaveCa' + 'rdFab'] = null,
                this['m_pDealCar' + 'dAni'] = null,
                this['m_pSelfHan' + 'dCard'] = null,
                this['m_pSendCar' + 'd'] = null,
                this['m_pLableBe' + 't'] = null,
                this['m_pPlayerI' + 'nfo'] = [],
                this['m_pLeaveCa' + 'rd'] = [],
                ap['default']['GetInstanc' + 'e']()['Reset'](),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['Reset'](),
                this['ResetAllGa' + 'meInfo'](),
                this['node']['off'](cc['Node']['EventType']['TOUCH_STAR' + 'T']),
                this['node']['off'](cc['Node']['EventType']['TOUCH_MOVE']),
                this['node']['off'](cc['Node']['EventType']['TOUCH_END']),
                this['node']['off'](cc['Node']['EventType']['TOUCH_CANC' + 'EL']),
                super['OnDestroy']();
            }
            ['PlayerTuoG' + 'uan'](b3, b4) {
                if (super['PlayerTuoG' + 'uan'](b3, b4),
                this['m_pPlayerI' + 'nfo'][b3]) {
                    let b5 = b4 > 0x0 ? 0x1 : 0x0;
                    this['m_pPlayerI' + 'nfo'][b3]['ShowTuoGua' + 'n'](b5);
                }
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['m_pGameTop' + 'Layer'] && 0x1 == b3 && (this['m_pGameTop' + 'Layer']['ShowMyself' + 'TuoGuan'](0x1 == b4),
                0x1 == b4 && (this['CloseShowL' + 'ayer'](),
                this['SetPlayerD' + 'etailsActi' + 've'](!0x1)));
            }
            ['PlayerAgai' + 'nLoginRes'](b3) {
                super['PlayerAgai' + 'nLoginRes'](b3),
                this['AddGameEle' + 'ment'](),
                this['ResetShowS' + 'eatIcon'](),
                this['m_pSendCar' + 'd']['Reset'](),
                this['m_pSelfHan' + 'dCard']['Reset'](),
                this['AgainGameR' + 'esetGameIn' + 'fo']();
                let b4 = ax['StructPars' + 'eData'](aO['DMINOJL_Ga' + 'meAgainLog' + 'inExtraRsp'], b3);
                console['log']('===pAgainM' + 'sg.cGameBa' + 'nker==' + b4['cGameBanke' + 'r']),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cIsSpinAct' + 'ivity'] = b4['cIsSpinAct' + 'ivity'];
                let b5 = ap['default']['GetInstanc' + 'e']()
                  , b6 = aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()
                  , b7 = b5['GetClientT' + 'ablePos'](b4['cNowSendPl' + 'ayer']);
                b6['iGameBanke' + 'r'] = b5['GetClientT' + 'ablePos'](b4['cGameBanke' + 'r']);
                let b8 = -0x1;
                for (let b9 = 0x0; b9 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b9++)
                    if (-0x1 != (b8 = b5['GetClientT' + 'ablePos'](b9))) {
                        b6['iPlayerPas' + 's'][b8] = b4['cPlayerPas' + 's'][b9],
                        b6['iCardNum'][b8] = b4['cPlayerCar' + 'dNum'][b9];
                        let ba = [];
                        ba['push'](b4['cPassCardV' + 'alNum0']),
                        ba['push'](b4['cPassCardV' + 'alNum1']),
                        ba['push'](b4['cPassCardV' + 'alNum2']),
                        ba['push'](b4['cPassCardV' + 'alNum3']);
                        for (let bb = 0x0; bb < 0x7; bb++)
                            b6['cPassCardV' + 'alNum'][b8][bb] = ba[b9][bb],
                            this['m_pPlayerI' + 'nfo'][b8] && ba[b9][bb] > 0x0 && this['m_pPlayerI' + 'nfo'][b8]['AddPassCar' + 'dVal'](bb);
                    }
                for (let bc = 0x0; bc < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bc++)
                    this['m_pPlayerI' + 'nfo'][bc] && (this['m_pPlayerI' + 'nfo'][bc]['ShowReady'](!0x1),
                    this['m_pPlayerI' + 'nfo'][bc]['UpdateCard' + 'Num'](b6['iCardNum'][bc]),
                    b6['iGameBanke' + 'r'] == bc && this['m_pPlayerI' + 'nfo'][bc]['ShowTableB' + 'ank'](),
                    b7 == bc && (this['ClearPlaye' + 'rDownTime'](),
                    this['m_pPlayerI' + 'nfo'][bc]['SetSendCar' + 'dTime'](b5['m_iSendCar' + 'dTime'])),
                    b5['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && b5['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] || 0x0 == b5['m_arrTable' + 'Player'][bc]['m_cIfReady'] && this['m_pPlayerI' + 'nfo'][bc]['ShowWatch'](!0x0));
                if (this['m_pSendCar' + 'd'] && b4['cAllSendCa' + 'rdNum'] > 0x0) {
                    let bd = []
                      , be = []
                      , bf = -0x1;
                    for (let bg = 0x0; bg < b4['cAllSendCa' + 'rdNum']; bg++)
                        b4['cFirstSend' + 'Card'] == b4['cAllSendCa' + 'rd'][bg] ? bf = b4['cFirstSend' + 'Card'] : -0x1 == bf ? bd['push'](b4['cAllSendCa' + 'rd'][bg]) : be['push'](b4['cAllSendCa' + 'rd'][bg]);
                    if (this['m_pSendCar' + 'd']['AddSendCar' + 'd'](bf, 0x0, !0x1),
                    bd['length'] > 0x0)
                        for (let bh = bd['length'] - 0x1; bh >= 0x0; --bh)
                            this['m_pSendCar' + 'd']['AddSendCar' + 'd'](bd[bh], 0x0, !0x1);
                    for (let bi = 0x0; bi < be['length']; bi++)
                        this['m_pSendCar' + 'd']['AddSendCar' + 'd'](be[bi], 0x1, !0x1);
                }
                if (b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['m_pSelfHan' + 'dCard']) {
                    this['m_pSelfHan' + 'dCard']['RemoveAllC' + 'ard']();
                    for (let bj = 0x0; bj < b6['iCardNum'][0x1]; bj++)
                        this['m_pSelfHan' + 'dCard']['AddCard'](b4['cSelfCards'][bj]),
                        b6['SetLeaveCa' + 'rdPointNum'](b4['cSelfCards'][bj], -0x1);
                    0x1 == b6['iCardNum'][0x1] && this['m_pSelfHan' + 'dCard']['ShowAutoSe' + 'ndLabel'](!0x0),
                    0x1 == b7 ? (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_S' + 'END']),
                    -0x1 != b6['cFirstSend' + 'Card'] && (this['m_pSelfHan' + 'dCard']['ResetAllSh' + 'adowCard'](),
                    this['m_pSelfHan' + 'dCard']['JudgeHandS' + 'endCard']() || (this['unschedule'](this['OnTimeAuto' + 'Pass']),
                    this['schedule'](this['OnTimeAuto' + 'Pass'], 0.4),
                    this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                    console['log']('2==HANDCAR' + 'D_NORMAL==')))) : (this['m_pSelfHan' + 'dCard']['SetState'](aJ['ESelfHandC' + 'ardState']['HANDCARD_N' + 'ORMAL']),
                    console['log']('3==HANDCAR' + 'D_NORMAL=='));
                }
                if (b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['m_pLeaveCa' + 'rdPointNum'] && (this['m_pLeaveCa' + 'rdPointNum']['ResetNumbe' + 'rScrolle'](),
                this['m_pLeaveCa' + 'rdPointNum']['Show'](!0x0)),
                b5['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'])
                    for (let bk = 0x0; bk < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; bk++)
                        this['m_pPlayerI' + 'nfo'][bk] && (this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](bk, !0x1),
                        this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](bk, !0x1));
                this['UnpackInfo'](b3['slice'](ax['GetStruct'](aO['DMINOJL_Ga' + 'meAgainLog' + 'inExtraRsp'])['GetTypeSiz' + 'e']()), !0x0);
            }
            ['CallBackCo' + 'ntinue']() {
                this['OnBtnConti' + 'nue']();
            }
            ['GetFlyCoin' + 'CW'](b3, b4) {
                return (0x1 != b3 || 0x0 != b4) && (0x3 != b3 || 0x2 != b4) && b3 > b4;
            }
            ['GetFlyCoin' + 'Time'](b3, b4) {
                let b5 = ay['default']['GetTwoPosL' + 'en'](b3, b4);
                return b5 < 0x1f4 ? 0.7 : b5 < 0x3e8 ? 0.9 : 1.2;
            }
            ['PlayerSitD' + 'ownOK'](b3) {
                super['PlayerSitD' + 'ownOK'](b3);
                for (let b4 = 0x0; b4 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b4++)
                    this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b4, !0x1),
                    this['m_pGameInf' + 'oLayer'] && !this['m_pPlayerI' + 'nfo'][b4] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b4, !0x0);
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] && this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitNe' + 'xtStartTip' + 's'](!0x0);
            }
            ['OneGameRes' + 'etGameInfo'](b3=!0x0) {
                super['OneGameRes' + 'etGameInfo']();
                for (let b4 = 0x0; b4 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b4++)
                    this['m_pPlayerI' + 'nfo'][b4] && this['m_pPlayerI' + 'nfo'][b4]['ResetPlaye' + 'rInfo'](),
                    this['m_pLeaveCa' + 'rd'][b4] && (this['m_pLeaveCa' + 'rd'][b4] && this['node']['removeChil' + 'd'](this['m_pLeaveCa' + 'rd'][b4]['node'], !0x0),
                    this['m_pLeaveCa' + 'rd'][b4] = null);
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['OneGameRes' + 'et'](),
                this['m_pLeaveCa' + 'rdPointNum'] && (this['m_pLeaveCa' + 'rdPointNum']['ResetNumbe' + 'rScrolle'](),
                this['m_pLeaveCa' + 'rdPointNum']['Show'](!0x1)),
                this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['Reset'](),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['Reset'](),
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['OneGameRes' + 'et'](),
                b3 && this['ShowHideOn' + 'eTask'](!0x1);
            }
            ['AgainGameR' + 'esetGameIn' + 'fo']() {
                for (let b3 = 0x0; b3 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b3++)
                    this['m_pPlayerI' + 'nfo'][b3] && this['m_pPlayerI' + 'nfo'][b3]['ResetPlaye' + 'rInfo'](),
                    this['m_pLeaveCa' + 'rd'][b3] && (this['m_pLeaveCa' + 'rd'][b3] && this['node']['removeChil' + 'd'](this['m_pLeaveCa' + 'rd'][b3]['node'], !0x0),
                    this['m_pLeaveCa' + 'rd'][b3] = null);
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['OneGameRes' + 'et'](),
                this['m_pLeaveCa' + 'rdPointNum'] && (this['m_pLeaveCa' + 'rdPointNum']['ResetNumbe' + 'rScrolle'](),
                this['m_pLeaveCa' + 'rdPointNum']['Show'](!0x1)),
                this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['Reset'](),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['Reset'](),
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['OneGameRes' + 'et']();
            }
            ['CallBackGe' + 'tAward'](b3, b4) {
                super['CallBackGe' + 'tAward'](b3, b4),
                at['EAniAwardT' + 'ype']['ANI_AWARD_' + 'JIUJI'] == b3 && aM['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['CheckCanSp' + 'in']() && this['OnClickSpi' + 'nIcon'](!0x1);
            }
            ['ResetAllGa' + 'meInfo']() {
                console['log']('=ResetAllG' + 'ameInfo===');
                for (let b3 = 0x0; b3 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b3++)
                    this['m_pPlayerI' + 'nfo'][b3] && (this['m_pPlayerI' + 'nfo'][b3] && this['node']['removeChil' + 'd'](this['m_pPlayerI' + 'nfo'][b3]['node'], !0x0),
                    this['m_pPlayerI' + 'nfo'][b3] = null),
                    this['m_pLeaveCa' + 'rd'][b3] && (this['m_pLeaveCa' + 'rd'][b3] && this['node']['removeChil' + 'd'](this['m_pLeaveCa' + 'rd'][b3]['node'], !0x0),
                    this['m_pLeaveCa' + 'rd'][b3] = null);
                this['SetPlayerD' + 'etailsActi' + 've'](!0x1),
                av['uiManager']['CloseUIByI' + 'd'](av['EGameUiId']['DoMinoJL_G' + 'ameResult']),
                av['uiManager']['CloseUIByI' + 'd'](av['EGameUiId']['DoMinoJL_F' + 'reeTaskCho' + 'oseLayer']),
                this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['CloseFreeT' + 'ask'](),
                super['ResetAllGa' + 'meInfo']();
            }
            ['CallBackCh' + 'angeTable'](b3) {
                0x0 == b3 ? this['SendLeaveT' + 'ableReq'](0x2) : 0x1 == b3 && (au['default']['UnLockMain' + 'Msg'](),
                this['SendLeaveT' + 'ableReq'](0x2),
                this['OneGameRes' + 'etGameInfo']());
            }
            ['IfResetAll' + 'GameInfo']() {
                return !!(this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['GetCardCou' + 'nt']() > 0x0) || !!(this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['GetAllSend' + 'CardCount']() > 0x0) || super['IfResetAll' + 'GameInfo']();
            }
            ['PlayBKMusi' + 'c']() {
                aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayMusic'](aH['EJLSoundId']['DONINO_JL_' + 'BK'], !0x0);
            }
            ['RefreshMon' + 'ey'](b3) {
                ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][b3] && this['m_pPlayerI' + 'nfo'][b3] && this['m_pPlayerI' + 'nfo'][b3]['UpdateMone' + 'y'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iMoney'], 0x0);
            }
            ['PlayFaceAn' + 'i'](b3, b4, b5) {
                if (console['log']('5==OnBtnCh' + 'atFace==' + b4 + ('===pMsg.cS' + 'endPos==') + b5),
                b4 < 0x0 || b4 >= aN['EJL_Define']['MAX_PLAYER' + '_NUM'] || b5 < 0x0 || b5 >= aN['EJL_Define']['MAX_PLAYER' + '_NUM'])
                    return;
                0x1 == b4 && this['m_pPlayerI' + 'nfo'][0x1] && this['m_pPlayerI' + 'nfo'][0x1]['UpdateMone' + 'y'](ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][0x1]['m_iMoney']);
                let b6 = ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? 0x0 : 0x1
                  , b7 = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](b4, b6)
                  , b8 = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](b5, b6);
                console['log']('5_1==OnBtn' + 'ChatFace==' + b4 + ('===pMsg.cS' + 'endPos==') + b5),
                this['ShowFaceAn' + 'i'](b3, b7, b8);
            }
            ['PlaySendPr' + 'opGiftAni'](b3, b4, b5, b6, b7) {
                if (b4 < 0x0 || b4 >= aN['EJL_Define']['MAX_PLAYER' + '_NUM'] || b5 < 0x0 || b5 >= aN['EJL_Define']['MAX_PLAYER' + '_NUM'])
                    return;
                let b8 = ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? 0x0 : 0x1
                  , b9 = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](b4, b8)
                  , ba = aZ['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](b5, b8);
                this['ShowSendPr' + 'opAni'](b3, b9, ba);
            }
            ['ShowPlayer' + 'MyFace'](b3, b4) {
                console['log']('3===chat_f' + 'ace==' + b3 + '==' + b4 + '==' + this['m_pPlayerI' + 'nfo'][b4]),
                this['m_pPlayerI' + 'nfo'][b4] && this['m_pPlayerI' + 'nfo'][b4]['ShowMyFace' + 'Ani'](b3, !0x0, 0x5);
            }
            ['ShowPlayer' + 'ChatText'](b3, b4) {
                this['m_pPlayerI' + 'nfo'][b4] && this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowChatTe' + 'xt'](b4, b3, this['m_pPlayerI' + 'nfo'][b4]['GetIFMyRea' + 'l']());
            }
            ['CallBackAu' + 'toSendCard']() {
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['AutoSendCa' + 'rd']();
            }
            ['PlayerStan' + 'dUp']() {
                super['PlayerStan' + 'dUp']();
                for (let b3 = 0x0; b3 < aN['EJL_Define']['MAX_PLAYER' + '_NUM']; b3++)
                    null == this['m_pPlayerI' + 'nfo'][b3] && (this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowWaitIn' + 'toIcon'](b3, !0x0),
                    this['m_pGameInf' + 'oLayer'] && this['m_pGameInf' + 'oLayer']['ShowSeatIc' + 'on'](b3, !0x1));
                this['m_pGameTop' + 'Layer']['ShowWaitNe' + 'xtStartTip' + 's'](!0x1),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm'] > 0x0 && this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['GetNextGam' + 'eChangTask']() && (this['SendLeaveT' + 'ableReq'](0x3),
                this['SendChangF' + 'reeTask']()),
                this['OnClickSpi' + 'nIcon'](!0x1);
            }
            ['OnClickSpi' + 'nIcon'](b3) {
                if (!aM['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['IfShowSpin' + 'Icon']())
                    return;
                let b4 = av['uiManager']['getUI'](av['EGameUiId']['DoMinoJL_S' + 'pinActivit' + 'yLayer']);
                b4 ? b4['RefreshUI']() : (av['uiManager']['Open'](av['EGameUiId']['DoMinoJL_S' + 'pinActivit' + 'yLayer'], [this, () => {
                    this['RequestSpi' + 'nAcivityOp' + 'enPrize']();
                }
                , () => {
                    this['CallbackCl' + 'oseSpinAct' + 'ivityLayer']();
                }
                ]),
                b3 ? aG['default']['GetInstanc' + 'e']()['RecordGame' + 'State'](0xb, 0x1, null, au['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'], 0x1, 0x1) : aG['default']['GetInstanc' + 'e']()['RecordGame' + 'State'](0xb, 0x1, null, au['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'], 0x1, 0x2));
            }
            ['RequestSpi' + 'nAcivityOp' + 'enPrize']() {
                let b3 = new aO['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'eq']();
                this['SendMsgToM' + 'ainSocket'](ax['GetStruct'](aO['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'eq'])['Serialize'](b3), aO['EJL_MsgTyp' + 'e']['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_REQ']);
            }
            ['CallbackCl' + 'oseSpinAct' + 'ivityLayer']() {
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != ap['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && this['SendSitReq'](0x0);
            }
            ['SendChangF' + 'reeTask'](b3=0x0) {
                let b4 = new aO['DMINOJL_Fr' + 'eeTaskOKRe' + 'q']();
                b4['iFreeTaskI' + 'D'] = b3,
                this['SendMsgToM' + 'ainSocket'](ax['GetStruct'](aO['DMINOJL_Fr' + 'eeTaskOKRe' + 'q'])['Serialize'](b4), aO['EJL_MsgTyp' + 'e']['DMINOJL_FR' + 'EE_TASK_OK' + '_REQ']);
            }
            ['CallBackSh' + 'owAwardCha' + 'nge']() {
                super['CallBackSh' + 'owAwardCha' + 'nge']();
            }
            ['ShowHideOn' + 'eTask'](b3, b4=!0x1, b5=null, b6=!0x1) {
                if (this['m_pOneTask' + 'Layer'] && this['m_pOneTask' + 'Layer']['node'])
                    if (b3)
                        if (this['m_pOneTask' + 'Layer']['node']['active'] = !0x0,
                        b4) {
                            let b7 = 0x0;
                            b5 && (b7 = b5['iAwardNum']),
                            this['m_pOneTask' + 'Layer']['SetTaskRes' + 'ult'](b7, this);
                        } else {
                            let b8 = new cc['Vec2'](-0x104,-0x64);
                            b6 || (b8['x'] = -0x2bc,
                            b8['y'] = 0x12c),
                            this['m_pOneTask' + 'Layer']['ShowOneTas' + 'k'](b5, this, b8, new cc['Vec2'](-0x2bc,0xed), b6);
                        }
                    else
                        this['m_pOneTask' + 'Layer']['CloseOneTa' + 'sk'](!0x0);
            }
            ['SetGameEnd' + 'Auto'](b3) {
                super['SetGameEnd' + 'Auto'](b3),
                this['m_pPlayerI' + 'nfo'][0x1] && this['m_pPlayerI' + 'nfo'][0x1]['ShowGameEn' + 'dAuto'](b3);
                let b4 = '';
                0x1 == b3 ? b4 = aB['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x6) : 0x2 == b3 ? b4 = aB['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x5) : 0x3 == b3 && (b4 = aB['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x4)),
                console['log']('==SetGameE' + 'ndAuto==' + this['m_pJLWordT' + 'ips'] + '====' + b4),
                this['m_pJLWordT' + 'ips'] && '' != b4 && this['SetGameWor' + 'dTips'](!0x0, b4, 0x2, aU['EJLGWTipsT' + 'ype']['GAME_TIPS_' + 'A']),
                aP['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iIFFreeRoo' + 'm'] > 0x0 && 0x2 == b3 && this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['SetNextGam' + 'eChangTask'](!0x1);
            }
            ['CallBackSh' + 'owPlayerDe' + 'tails'](b3) {
                if (this['m_pAGameTo' + 'pLayer'] && this['m_pAGameTo' + 'pLayer']['GetIfSendC' + 'harm']())
                    return this['m_pAGameTo' + 'pLayer']['SetSendCha' + 'rmState'](!0x1),
                    void this['CallBackSe' + 'ndPropToPl' + 'ayer'](b3);
                let b4 = ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][b3];
                b4 && (aH['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](aH['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['SetPlayerD' + 'etailsActi' + 've'](!0x0, b4, b3));
            }
            ['SetPlayerD' + 'etailsActi' + 've'](b3, b4=null, b5=-0x1) {
                if (!this['m_pPlayerD' + 'etails'] && this['m_pPlayerD' + 'etailsFab']) {
                    let b6 = aw['ResUtil']['Instantiat' + 'e'](this['m_pPlayerD' + 'etailsFab']);
                    this['m_pPlayerD' + 'etails'] = b6['getCompone' + 'nt'](aY['default']),
                    this['node']['addChild'](b6);
                }
                this['m_pPlayerD' + 'etails'] && (this['m_pPlayerD' + 'etails']['node']['active'] = b3,
                b3 && (0x1 == b5 && b4['m_iUserID'] == aF['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] ? this['m_pPlayerD' + 'etails']['ShowPlayer' + 'DetailsInf' + 'o'](b4, this, b5, cc['Vec2']['ZERO'], !0x0) : ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? this['m_pPlayerD' + 'etails']['ShowPlayer' + 'DetailsInf' + 'o'](b4, this, b5, cc['Vec2']['ZERO'], !0x0) : this['m_pPlayerD' + 'etails']['ShowPlayer' + 'DetailsInf' + 'o'](b4, this, b5)));
            }
            ['SetGameWor' + 'dTips'](b3, b4='', b5=0x2, b6=0x0, b7=cc['Vec2']['ZERO']) {
                this['m_pJLWordT' + 'ips'] && (b3 ? this['m_pJLWordT' + 'ips']['ShowGameWo' + 'rdTips'](b4, b6, b5, b7) : this['m_pJLWordT' + 'ips']['CloseGameW' + 'ordTips']());
            }
            ['CallBackSe' + 'ndFaceAni'](b3, b4) {
                console['log']('1==OnBtnCh' + 'atFace==' + b3 + ('===iTableP' + 'os==') + b4),
                ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] || ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] || super['CallBackSe' + 'ndFaceAni'](b3, b4),
                this['SetPlayerD' + 'etailsActi' + 've'](!0x1);
            }
            ['SubPlayerT' + 'oTable'](b3) {
                super['SubPlayerT' + 'oTable'](b3),
                this['m_pPlayerI' + 'nfo'][b3] && (this['node']['removeChil' + 'd'](this['m_pPlayerI' + 'nfo'][b3]['node']),
                this['m_pPlayerI' + 'nfo'][b3] = null,
                this['SetPlayerD' + 'etailsActi' + 've'](!0x1),
                this['ResetShowS' + 'eatIcon']());
                let b4 = 0x0;
                for (let b5 = 0x0; b5 < ap['default']['GetInstanc' + 'e']()['m_iTablePl' + 'ayerMax']; b5++)
                    null != ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][b5] && b4++;
                if (b4 < ap['default']['GetInstanc' + 'e']()['m_iMinStar' + 'tNum']) {
                    this['PlayGameSt' + 'artTime'](0x0);
                    for (let b6 = 0x0; b6 < ap['default']['GetInstanc' + 'e']()['m_iTablePl' + 'ayerMax']; b6++)
                        null != ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][b6] && (ap['default']['GetInstanc' + 'e']()['m_arrTable' + 'Player'][b6]['m_cIfReady'] = 0x0,
                        this['m_pPlayerI' + 'nfo'][b6] && this['m_pPlayerI' + 'nfo'][b6]['ShowReady'](!0x1));
                }
            }
            ['OtherPlaye' + 'rDisconnec' + 't'](b3) {
                super['OtherPlaye' + 'rDisconnec' + 't'](b3),
                this['m_pPlayerI' + 'nfo'][b3] && this['m_pPlayerI' + 'nfo'][b3]['ShowTuoGua' + 'n'](0x2);
            }
            ['OtherPlaye' + 'rAgainBack'](b3) {
                super['OtherPlaye' + 'rAgainBack'](b3),
                this['m_pPlayerI' + 'nfo'][b3] && this['m_pPlayerI' + 'nfo'][b3]['ShowTuoGua' + 'n'](0x0);
            }
            ['CallBackGe' + 'tSendCard']() {
                let b3 = [];
                this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['GetAllCard'](b3),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['GetAllSend' + 'Card'](b3),
                this['m_pLeaveCa' + 'rdPointNum'] && this['m_pLeaveCa' + 'rdPointNum']['SetShowLea' + 'veCard'](b3);
            }
            ['ShowMyDela' + 'yTime'](b3) {
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['SetNetTime'](b3);
            }
            ['IFNowSendC' + 'hangFreeTa' + 'sk']() {
                let b3 = !0x1;
                return ap['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == ap['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] && (this['SendLeaveT' + 'ableReq'](0x3),
                this['SendChangF' + 'reeTask'](),
                b3 = !0x0),
                b3;
            }
            ['onLoad']() {
                this['OneStartRe' + 'setGameInf' + 'o'](),
                super['onLoad'](),
                az['default']['LoadRes'](aE['CFilePaths']['DG_DMN_JL_' + 'WORD'], cc['SpriteAtla' + 's']),
                aC['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['LoadRes'](aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID']),
                ap['default']['GetInstanc' + 'e']()['SetTablePl' + 'ayerMax'](aN['EJL_Define']['MAX_PLAYER' + '_NUM']),
                ap['default']['GetInstanc' + 'e']()['SetStyleTy' + 'pe'](aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID']),
                this['m_cNowGame' + 'Ver'] = 0x2,
                this['m_pLeaveCa' + 'rdPointNum'] && this['m_pLeaveCa' + 'rdPointNum']['InitLeaveC' + 'ardNum'](this),
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['InitGameTo' + 'pLayer'](this),
                null == this['m_pGameInf' + 'oLayer'] && (this['m_pGameInf' + 'oLayer'] = ay['default']['GetCompone' + 'nt'](aS['default']),
                this['m_pGameInf' + 'oLayer']['InitGameIn' + 'foLayer'](this, this['m_pBaseUiA' + 'tlas']),
                this['node']['addChild'](this['m_pGameInf' + 'oLayer']['node'])),
                this['m_pJLSpinI' + 'con'] && (this['m_pJLSpinI' + 'con']['node']['active'] = !0x1,
                this['m_pJLSpinI' + 'con']['SetClickCa' + 'llback'](b3 => {
                    this['OnClickSpi' + 'nIcon'](b3);
                }
                )),
                this['ResetShowS' + 'eatIcon'](),
                this['ShowHideOn' + 'eTask'](!0x1),
                this['CloseLoadi' + 'ngTip'](),
                this['scheduleOn' + 'ce'](this['ShowLoadin' + 'gTip'], 0x3),
                this['IniMainSoc' + 'ketAuthen']();
            }
            ['ShowLoadin' + 'gTip']() {
                av['uiManager']['Open'](av['EGameUiId']['UIMsgBox'], [0x4, aB['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x26), aD['EMsgBoxTyp' + 'e']['MESSAGE_TI' + 'P'], null, () => {
                    this['QuitGame']();
                }
                , 0xf]);
            }
            ['CloseLoadi' + 'ngTip']() {
                this['unschedule'](this['ShowLoadin' + 'gTip']),
                av['uiManager']['CloseUIByI' + 'd'](av['EGameUiId']['UIMsgBox']),
                super['CloseLoadi' + 'ngTip']();
            }
            ['OnGameHide']() {
                let b3 = ay['default']['GetTimeSta' + 'mp']();
                if (b3 - this['m_iShowHid' + 'eGameTime'] > 0x5) {
                    this['m_iShowHid' + 'eGameTime'] = b3;
                    let b4 = this['node']['getChildBy' + 'Name'](this['DEAL_CARD_' + 'ANI']);
                    b4 && b4['removeFrom' + 'Parent'](!0x0),
                    this['CallBackSe' + 'tTuoGuan'](0x1),
                    this['CloseAllSo' + 'cketConnec' + 't']();
                }
                super['OnGameHide']();
            }
            ['OnGameShow']() {
                this['IsMainSock' + 'etConnect']() || (this['OneGameRes' + 'etGameInfo'](!0x1),
                this['IniMainSoc' + 'ketAuthen']()),
                super['OnGameShow']();
            }
            ['start']() {
                super['start'](),
                aq['default']['GetInstanc' + 'e']()['LoadLocalQ' + 'uickText'](aA['default']['iLanguage'], 0x0);
                let b3 = 0x0
                  , b4 = !0x1;
                (b3 = au['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'] == aE['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'] ? az['default']['GetNumberF' + 'orKey'](this['UD_KEY_JL_' + 'SOUND_OPEN'], 0x1) : az['default']['GetNumberF' + 'orKey'](this['UD_KEY_JLB' + 'ET_SOUND_O' + 'PEN'], 0x1)) > 0x0 && (b4 = !0x0),
                ap['default']['GetInstanc' + 'e']()['SetOpenGam' + 'eSound'](b4),
                this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['InitSendCa' + 'rd'](this),
                this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['InitSelfHa' + 'ndCard'](this, this['m_pSendCar' + 'd']),
                this['node']['on'](cc['Node']['EventType']['TOUCH_STAR' + 'T'], b5 => {
                    if (this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['OnJLTouchS' + 'tart'](b5),
                    this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['OnJLTouchS' + 'tart'](b5),
                    this['m_pLeaveCa' + 'rdPointNum'] && this['m_pLeaveCa' + 'rdPointNum']['OnJLTouchS' + 'tart'](b5),
                    this['m_pPlayerD' + 'etails'] && this['m_pPlayerD' + 'etails']['OnJLTouchS' + 'tart'](b5),
                    this['m_pFreeTas' + 'kLayer'] && this['m_pFreeTas' + 'kLayer']['OnJLTouchS' + 'tart'](b5),
                    this['m_pOneTask' + 'Layer'] && this['m_pOneTask' + 'Layer']['OnJLTouchS' + 'tart'](b5),
                    this['m_pPlayerI' + 'nfo'])
                        for (let b6 = 0x0; b6 < this['m_pPlayerI' + 'nfo']['length']; b6++)
                            this['m_pPlayerI' + 'nfo'][b6] && this['m_pPlayerI' + 'nfo'][b6]['OnJLTouchS' + 'tart'](b5);
                    this['m_pAGameTo' + 'pLayer'] && this['m_pAGameTo' + 'pLayer']['OnJLTouchS' + 'tart'](b5);
                }
                , this),
                this['node']['on'](cc['Node']['EventType']['TOUCH_MOVE'], b5 => {
                    this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['OnJLTouchM' + 'ove'](b5);
                }
                , this),
                this['node']['on'](cc['Node']['EventType']['TOUCH_END'], b5 => {
                    this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['OnJLTouchE' + 'nd'](b5),
                    this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['OnJLTouchE' + 'nd'](b5),
                    this['m_pLeaveCa' + 'rdPointNum'] && this['m_pLeaveCa' + 'rdPointNum']['OnJLTouchE' + 'nd'](b5);
                }
                , this),
                this['node']['on'](cc['Node']['EventType']['TOUCH_CANC' + 'EL'], b5 => {
                    this['m_pSelfHan' + 'dCard'] && this['m_pSelfHan' + 'dCard']['OnJLTouchC' + 'ancel'](b5);
                }
                , this);
            }
            ['OnTestOutC' + 'ard']() {
                this['m_pGameTop' + 'Layer'] && this['m_pGameTop' + 'Layer']['ShowPass'](0x3, 0x0);
            }
            ['ShowShadow']() {
                let b3 = new an['OneTaskMsg' + 'Rsp']();
                b3['cEventID'] = 0x0,
                b3['cOnceFirst' + 'Into'] = 0x1,
                b3['cShowCente' + 'r'] = 0x1,
                b3['iActTime'] = 0x0,
                b3['iAwardNum'] = 0x3e8,
                b3['iAwardNumA' + 'ct'] = 0x2,
                b3['iDoubleCar' + 'd'] = 0x2,
                b3['iTaskID'] = 0x3,
                b3['iTaskType'] = 0x1,
                b3['szActTime'] = '20220104',
                b3['szTaskName'] = '在卡看看|3:2',
                this['ShowHideOn' + 'eTask'](!0x0, !0x1, b3, !0x0);
            }
        }
        ;
        al([b1(cc['SpriteAtla' + 's']), am('design:typ' + 'e', 'function' == typeof (a3 = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? a3 : Object)], b2['prototype'], 'm_pBaseUiA' + 'tlas', void 0x0),
        al([b1(cc['Prefab']), am('design:typ' + 'e', 'function' == typeof (a4 = 'undefined' != typeof cc && cc['Prefab']) ? a4 : Object)], b2['prototype'], 'm_pPlayerI' + 'nfoFab', void 0x0),
        al([b1(cc['Prefab']), am('design:typ' + 'e', 'function' == typeof (a5 = 'undefined' != typeof cc && cc['Prefab']) ? a5 : Object)], b2['prototype'], 'm_pLeaveCa' + 'rdFab', void 0x0),
        al([b1(cc['Prefab']), am('design:typ' + 'e', 'function' == typeof (a6 = 'undefined' != typeof cc && cc['Prefab']) ? a6 : Object)], b2['prototype'], 'm_pDealCar' + 'dAni', void 0x0),
        al([b1(aJ['default']), am('design:typ' + 'e', 'function' == typeof (a7 = void 0x0 !== aJ['default'] && aJ['default']) ? a7 : Object)], b2['prototype'], 'm_pSelfHan' + 'dCard', void 0x0),
        al([b1(aK['default']), am('design:typ' + 'e', 'function' == typeof (a8 = void 0x0 !== aK['default'] && aK['default']) ? a8 : Object)], b2['prototype'], 'm_pSendCar' + 'd', void 0x0),
        al([b1(aT['default']), am('design:typ' + 'e', 'function' == typeof (a9 = void 0x0 !== aT['default'] && aT['default']) ? a9 : Object)], b2['prototype'], 'm_pGameTop' + 'Layer', void 0x0),
        al([b1(aV['default']), am('design:typ' + 'e', 'function' == typeof (aa = void 0x0 !== aV['default'] && aV['default']) ? aa : Object)], b2['prototype'], 'm_pLeaveCa' + 'rdPointNum', void 0x0),
        al([b1(aW['default']), am('design:typ' + 'e', 'function' == typeof (ab = void 0x0 !== aW['default'] && aW['default']) ? ab : Object)], b2['prototype'], 'm_pOneTask' + 'Layer', void 0x0),
        al([b1(aR['default']), am('design:typ' + 'e', 'function' == typeof (ac = void 0x0 !== aR['default'] && aR['default']) ? ac : Object)], b2['prototype'], 'm_pFreeTas' + 'kLayer', void 0x0),
        al([b1(aX['default']), am('design:typ' + 'e', 'function' == typeof (ad = void 0x0 !== aX['default'] && aX['default']) ? ad : Object)], b2['prototype'], 'm_pJLSpinI' + 'con', void 0x0),
        al([b1(aU['default']), am('design:typ' + 'e', 'function' == typeof (af = void 0x0 !== aU['default'] && aU['default']) ? af : Object)], b2['prototype'], 'm_pJLWordT' + 'ips', void 0x0),
        al([b1(cc['Label']), am('design:typ' + 'e', 'function' == typeof (ag = 'undefined' != typeof cc && cc['Label']) ? ag : Object)], b2['prototype'], 'm_pLableBe' + 't', void 0x0),
        al([b1(cc['SpriteAtla' + 's']), am('design:typ' + 'e', 'function' == typeof (ah = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? ah : Object)], b2['prototype'], 'm_pCoinAtl' + 'as', void 0x0),
        al([b1(cc['Font']), am('design:typ' + 'e', 'function' == typeof (ai = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? ai : Object)], b2['prototype'], 'm_pCoinFon' + 't', void 0x0),
        al([b1(cc['Prefab']), am('design:typ' + 'e', 'function' == typeof (aj = 'undefined' != typeof cc && cc['Prefab']) ? aj : Object)], b2['prototype'], 'm_pPlayerD' + 'etailsFab', void 0x0),
        al([b1(cc['Node']), am('design:typ' + 'e', 'function' == typeof (ak = 'undefined' != typeof cc && cc['Node']) ? ak : Object)], b2['prototype'], 'm_pNodeTas' + 'kMask', void 0x0),
        b2 = al([b0], b2),
        a2['default'] = b2,
        cc['_RF']['pop']();
    }
    , {
        '../../../ScriptLobby/A_GameComm/A_BaseTcpMsg': void 0x0,
        '../../../ScriptLobby/A_GameComm/A_GameView': void 0x0,
        '../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../ScriptLobby/Chat/ChatData': void 0x0,
        '../../../ScriptLobby/Hw_CommLayer/AniPlayerFlyCoin': void 0x0,
        '../../../ScriptLobby/Hw_CommLayer/AniSingleSpine': void 0x0,
        '../../../ScriptLobby/Hw_CommLayer/Comm_AniAwardMoney': void 0x0,
        '../../../script/Common/Base/GameViewBase': void 0x0,
        '../../../script/Common/Base/UIManager': void 0x0,
        '../../../script/Common/Res/ResUtil': void 0x0,
        '../../../script/Common/Struct/StructDecorators': void 0x0,
        '../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../script/CommonLogic': void 0x0,
        '../../../script/Configs/AppCommonCfg': void 0x0,
        '../../../script/Configs/GameTextConfig': void 0x0,
        '../../../script/Configs/HW_GameTextBase': void 0x0,
        '../../../script/GameMsgBox': void 0x0,
        '../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../script/Login/UserManager': void 0x0,
        '../../../script/Network/HttpManager': void 0x0,
        '../../../script/Sounds/SoundManager': void 0x0,
        './CardLayer/DoMinoJL_LeaveCard': 'DoMinoJL_L' + 'eaveCard',
        './CardLayer/DoMinoJL_SelfHandCard': 'DoMinoJL_S' + 'elfHandCar' + 'd',
        './CardLayer/DoMinoJL_SendCard': 'DoMinoJL_S' + 'endCard',
        './DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        './DoMinoJL_Data': 'DoMinoJL_D' + 'ata',
        './DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        './DoMinoJL_Msg': 'DoMinoJL_M' + 'sg',
        './DoMinoJL_TableInfo': 'DoMinoJL_T' + 'ableInfo',
        './GameUI/DoMinoJL_DealCardAni': 'DoMinoJL_D' + 'ealCardAni',
        './GameUI/DoMinoJL_FreeTaskLayer': 'DoMinoJL_F' + 'reeTaskLay' + 'er',
        './GameUI/DoMinoJL_GameInfoLayer': 'DoMinoJL_G' + 'ameInfoLay' + 'er',
        './GameUI/DoMinoJL_GameTopLayer': 'DoMinoJL_G' + 'ameTopLaye' + 'r',
        './GameUI/DoMinoJL_GameWordTips': 'DoMinoJL_G' + 'ameWordTip' + 's',
        './GameUI/DoMinoJL_LeaveCardNum': 'DoMinoJL_L' + 'eaveCardNu' + 'm',
        './GameUI/DoMinoJL_OneTaskLayer': 'DoMinoJL_O' + 'neTaskLaye' + 'r',
        './GameUI/DoMinoJL_SpinIcon': 'DoMinoJL_S' + 'pinIcon',
        './PlayerInfo/DoMinoJL_PlayerDetailsInfo': 'DoMinoJL_P' + 'layerDetai' + 'lsInfo',
        './PlayerInfo/DoMinoJL_PlayerInfo': 'DoMinoJL_P' + 'layerInfo'
    }],
    'DoMinoJL_GameWordTips': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, '3ef62eArFx' + 'LHIsYG5ROg' + 'Ekg', 'DoMinoJL_G' + 'ameWordTip' + 's');
        var h, j, k, q = this && this['__decorate'] || function(B, C, D, E) {
            var F, G = arguments['length'], H = G < 0x3 ? C : null === E ? E = Object['getOwnProp' + 'ertyDescri' + 'ptor'](C, D) : E;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                H = Reflect['decorate'](B, C, D, E);
            else
                for (var I = B['length'] - 0x1; I >= 0x0; I--)
                    (F = B[I]) && (H = (G < 0x3 ? F(H) : G > 0x3 ? F(C, D, H) : F(C, D)) || H);
            return G > 0x3 && H && Object['defineProp' + 'erty'](C, D, H),
            H;
        }
        , u = this && this['__metadata'] || function(B, C) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](B, C);
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        }),
        g['EJLGWTipsT' + 'ype'] = void 0x0;
        const v = b('../../../.' + './script/C' + 'ommon/Res/' + 'ResKeeper')
          , w = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , {ccclass: x, property: y} = cc['_decorator'];
        let z = class extends v['default'] {
            constructor() {
                super(...arguments),
                this['m_pNodeTip' + 'sBg'] = null,
                this['m_pNodeTgB' + 'g'] = null,
                this['m_pLabCont' + 'ent'] = null,
                this['m_pParentL' + 'ayer'] = null,
                this['m_fShowTim' + 'e'] = 0x0;
            }
            ['ShowGameWo' + 'rdTips'](B, C, D=0x3, E=cc['Vec2']['ZERO'], F=0x3e8) {
                if (!this['m_pNodeTip' + 'sBg'] || !this['m_pNodeTgB' + 'g'])
                    return;
                this['node']['zIndex'] = F,
                this['node']['active'] = !0x0,
                E['equals'](cc['Vec2']['ZERO']) && (E = this['node']['getParent']()['convertToN' + 'odeSpaceAR'](new cc['Vec2'](0.5 * cc['winSize']['width'],0.5 * cc['winSize']['height']))),
                this['node']['setPositio' + 'n'](E),
                this['m_fShowTim' + 'e'] = D,
                this['unschedule'](this['OnTimer']),
                this['schedule'](this['OnTimer'], 0x1);
                let G = w['default']['ReplaceStr' + 'ing'](B, '!@', '\x0a');
                if (this['m_pLabCont' + 'ent']) {
                    this['m_pLabCont' + 'ent']['string'] = G;
                    let H = w['default']['GetLabelSi' + 'ze'](this['m_pLabCont' + 'ent'])['height'] + 0x14;
                    this['m_pNodeTip' + 'sBg']['height'] = H,
                    this['m_pNodeTgB' + 'g']['height'] = H;
                }
                this['m_pNodeTip' + 'sBg']['active'] = C != A['GAME_TIPS_' + 'B'],
                this['m_pNodeTgB' + 'g']['active'] = C == A['GAME_TIPS_' + 'B'],
                this['node']['opacity'] = 0x0,
                this['node']['runAction'](cc['fadeIn'](0.2));
            }
            ['CloseGameW' + 'ordTips'](B=!0x1) {
                this['unschedule'](this['OnTimer']),
                B ? this['node']['runAction'](cc['sequence'](cc['fadeOut'](0.2), cc['callFunc'](this['CallFuncCl' + 'ose'], this))) : this['CallFuncCl' + 'ose']();
            }
            ['CallFuncCl' + 'ose']() {
                this['node']['active'] = !0x1,
                this['unschedule'](this['OnTimer']);
            }
            ['OnTimer'](B) {
                this['m_fShowTim' + 'e']--,
                this['m_fShowTim' + 'e'] < 0.005 && (this['unschedule'](this['OnTimer']),
                this['CloseGameW' + 'ordTips'](!0x0));
            }
            ['start']() {}
        }
        ;
        var A;
        q([y(cc['Node']), u('design:typ' + 'e', 'function' == typeof (h = 'undefined' != typeof cc && cc['Node']) ? h : Object)], z['prototype'], 'm_pNodeTip' + 'sBg', void 0x0),
        q([y(cc['Node']), u('design:typ' + 'e', 'function' == typeof (j = 'undefined' != typeof cc && cc['Node']) ? j : Object)], z['prototype'], 'm_pNodeTgB' + 'g', void 0x0),
        q([y(cc['Label']), u('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['Label']) ? k : Object)], z['prototype'], 'm_pLabCont' + 'ent', void 0x0),
        z = q([x], z),
        g['default'] = z,
        function(B) {
            B[B['GAME_TIPS_' + 'A'] = 0x0] = 'GAME_TIPS_' + 'A',
            B[B['GAME_TIPS_' + 'B'] = 0x1] = 'GAME_TIPS_' + 'B';
        }(A = g['EJLGWTipsT' + 'ype'] || (g['EJLGWTipsT' + 'ype'] = {})),
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Res/ResKeeper': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0
    }],
    'DoMinoJL_LeaveCardNum': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'cdd06KM+dx' + 'BwaZeic9wS' + 'D6j', 'DoMinoJL_L' + 'eaveCardNu' + 'm');
        var j, k, q, v, w = this && this['__decorate'] || function(I, J, K, L) {
            var M, N = arguments['length'], O = N < 0x3 ? J : null === L ? L = Object['getOwnProp' + 'ertyDescri' + 'ptor'](J, K) : L;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                O = Reflect['decorate'](I, J, K, L);
            else
                for (var P = I['length'] - 0x1; P >= 0x0; P--)
                    (M = I[P]) && (O = (N < 0x3 ? M(O) : N > 0x3 ? M(J, K, O) : M(J, K)) || O);
            return N > 0x3 && O && Object['defineProp' + 'erty'](J, K, O),
            O;
        }
        , x = this && this['__metadata'] || function(I, J) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](I, J);
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        }),
        g['DominoLeav' + 'CardInfo'] = void 0x0;
        const y = b('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/GC_' + 'NumberScro' + 'ller')
          , z = b('../CardLay' + 'er/DoMino_' + 'SpriteCard' + 'Manage')
          , A = b('../DoMinoJ' + 'L_CardRule')
          , B = b('../DoMinoJ' + 'L_Define')
          , D = b('../DoMinoJ' + 'L_TableInf' + 'o');
        class E {
            constructor() {
                this['cCard'] = 0x0,
                this['cState'] = 0x0;
            }
        }
        g['DominoLeav' + 'CardInfo'] = E;
        const {ccclass: F, property: G} = cc['_decorator'];
        let H = class extends z['DominoSpri' + 'teCardMana' + 'ge'] {
            constructor() {
                super(...arguments),
                this['m_pNodeBK'] = null,
                this['m_pNodeGao' + 'Guan'] = null,
                this['m_pNodeLea' + 'veCardBK'] = null,
                this['m_pGoldFon' + 't'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_bIFShow'] = !0x1,
                this['m_pNumberS' + 'crolle'] = [],
                this['m_iCardNum' + 'Val'] = -0x1,
                this['m_vcLevaCa' + 'rd'] = [],
                this['m_fCardSca' + 'le'] = 0.9,
                this['m_fCardGap'] = 0x5a,
                this['m_sizeSing' + 'leCard'] = cc['size'](B['EJL_Define']['HAND_CARD_' + 'WIDTH'], B['EJL_Define']['HAND_CARD_' + 'HEIGTH']);
            }
            ['InitLeaveC' + 'ardNum'](I) {
                if (this['m_pNumberS' + 'crolle'])
                    for (let J = 0x0; J < this['m_pNumberS' + 'crolle']['length']; J++)
                        this['m_pNumberS' + 'crolle'][J] && (this['m_pNumberS' + 'crolle'][J]['removeFrom' + 'Parent'](!0x0),
                        this['m_pNumberS' + 'crolle'][J] = null);
                this['m_pIGameCa' + 'llBack'] = I,
                this['m_pNumberS' + 'crolle'] = [];
                for (let K = 0x0; K < 0x7; K++)
                    this['m_pNumberS' + 'crolle']['push'](null),
                    this['m_pNumberS' + 'crolle'][K] = y['NumberScro' + 'ller']['Create'](0x1, 0x1e, 0x1e, 0xa, 0x1a, this['m_pGoldFon' + 't']),
                    null != this['m_pNumberS' + 'crolle'][K] && (this['m_pNumberS' + 'crolle'][K]['InitOrther'](0x7, 0.6, cc['color'](0x8c, 0xdb, 0xa8), !0x1),
                    this['m_pNumberS' + 'crolle'][K]['setPositio' + 'n'](0x5a * K - 0xfa, 0x3),
                    this['m_pNodeBK']['addChild'](this['m_pNumberS' + 'crolle'][K]));
                this['SetNeedSha' + 'dow'](!0x0);
            }
            ['ResetNumbe' + 'rScrolle']() {
                for (let I = 0x0; I < 0x7; I++)
                    this['m_pNumberS' + 'crolle'][I] && (this['m_pNumberS' + 'crolle'][I]['InitOrther'](D['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iLeaveCard' + 'PointNum'][I], 0.6, cc['color'](0x8c, 0xdb, 0xa8), !0x1),
                    this['m_pNumberS' + 'crolle'][I]['setPositio' + 'n'](0x5a * I - 0xfa, 0x3));
            }
            ['SetNumberS' + 'crolle']() {
                for (let I = 0x0; I < 0x7; I++)
                    this['m_pNumberS' + 'crolle'][I] && this['m_pNumberS' + 'crolle'][I]['SetNumber'](D['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['iLeaveCard' + 'PointNum'][I]);
            }
            ['Show'](I) {
                if (null != this['m_pNodeBK'])
                    if (this['m_bIFShow'] = I,
                    this['m_pNodeBK']['stopAllAct' + 'ions'](),
                    I) {
                        let J = new cc['Vec2'](0x0,0x0);
                        this['m_pNodeBK']['runAction'](cc['spawn'](cc['moveTo'](0.4, J), cc['fadeIn'](0.4)));
                    } else {
                        let K = new cc['Vec2'](0x0,-0x32);
                        this['m_pNodeBK']['runAction'](cc['spawn'](cc['moveTo'](0.3, K), cc['fadeOut'](0.3))),
                        this['m_iCardNum' + 'Val'] = -0x1,
                        this['RemoveAllC' + 'ard'](),
                        this['m_pNodeLea' + 'veCardBK']['active'] = !0x1,
                        this['m_pNodeGao' + 'Guan']['active'] = !0x1;
                    }
            }
            ['SetShowLea' + 'veCard'](I) {
                if (-0x1 == this['m_iCardNum' + 'Val'])
                    return;
                this['m_pNodeLea' + 'veCardBK']['active'] = !0x0,
                this['m_pNodeGao' + 'Guan']['active'] = !0x0,
                this['m_pNodeGao' + 'Guan']['setPositio' + 'n'](0x5a * this['m_iCardNum' + 'Val'] - 0x11a, 0x0),
                this['RemoveAllC' + 'ard'](),
                this['m_vcLevaCa' + 'rd'] = [];
                let J = 0x0
                  , K = 0x0
                  , L = 0x0;
                for (let M = 0x6; M >= 0x0; --M) {
                    (K = this['m_iCardNum' + 'Val']) < (J = M) && (L = J,
                    J = K,
                    K = L);
                    let N = new E();
                    N['cState'] = 0x0,
                    N['cCard'] = A['CardRule']['MakeCard'](J, K),
                    this['m_vcLevaCa' + 'rd']['push'](N);
                }
                for (let O = 0x0; O < this['m_vcLevaCa' + 'rd']['length']; O++)
                    for (let P = 0x0; P < I['length']; P++)
                        if (this['m_vcLevaCa' + 'rd'][O]['cCard'] == I[P]['cCard']) {
                            this['m_vcLevaCa' + 'rd'][O]['cState'] = 0x1;
                            break;
                        }
                for (let Q = 0x0; Q < this['m_vcLevaCa' + 'rd']['length']; Q++)
                    this['AddCard'](this['m_vcLevaCa' + 'rd'][Q]['cCard']),
                    0x1 == this['m_vcLevaCa' + 'rd'][Q]['cState'] && (this['m_arrSprit' + 'eCard'][Q]['bShadow'] = !0x0,
                    this['m_arrSprit' + 'eCard'][Q]['pShadowSpr' + 'ite'] && (this['m_arrSprit' + 'eCard'][Q]['pShadowSpr' + 'ite']['node']['active'] = !0x0));
            }
            ['OnJLTouchS' + 'tart'](I) {
                let J = this['node']['convertToN' + 'odeSpaceAR'](I['touch']['getLocatio' + 'n']());
                if (this['m_bIFShow']) {
                    let K = -0x131
                      , L = cc['rect'](0x0, 0x0, 0x0, 0x0);
                    for (let M = 0x0; M <= 0x6; M++)
                        (L = cc['rect'](K + 0x56 * M, -0x14, 0x50, 0x28))['contains'](J) && (this['m_iCardNum' + 'Val'] = M,
                        this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGe' + 'tSendCard']());
                }
            }
            ['OnJLTouchE' + 'nd'](I) {
                this['m_bIFShow'] && (this['m_iCardNum' + 'Val'] = -0x1,
                this['RemoveAllC' + 'ard'](),
                this['m_pNodeLea' + 'veCardBK']['active'] = !0x1,
                this['m_pNodeGao' + 'Guan']['active'] = !0x1);
            }
            ['ResetAllCa' + 'rdPosition'](I=!0x1) {
                let J = -(0x6 * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width']) / 0x2;
                for (let K = 0x0; K < this['m_arrSprit' + 'eCard']['length']; K++)
                    this['m_arrSprit' + 'eCard'][K]['iX'] = J + K * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,
                    this['m_arrSprit' + 'eCard'][K]['iY'] = 0x6f,
                    this['m_arrSprit' + 'eCard'][K]['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                    this['m_arrSprit' + 'eCard'][K]['pCardSprit' + 'e']['node']['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][K]['iX'], this['m_arrSprit' + 'eCard'][K]['iY']);
            }
            ['start']() {}
        }
        ;
        w([G(cc['Node']), x('design:typ' + 'e', 'function' == typeof (j = 'undefined' != typeof cc && cc['Node']) ? j : Object)], H['prototype'], 'm_pNodeBK', void 0x0),
        w([G(cc['Node']), x('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['Node']) ? k : Object)], H['prototype'], 'm_pNodeGao' + 'Guan', void 0x0),
        w([G(cc['Node']), x('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['Node']) ? q : Object)], H['prototype'], 'm_pNodeLea' + 'veCardBK', void 0x0),
        w([G(cc['Font']), x('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof cc && cc['Font']) ? v : Object)], H['prototype'], 'm_pGoldFon' + 't', void 0x0),
        H = w([F], H),
        g['default'] = H,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/Hw_CommLayer/GC_NumberScroller': void 0x0,
        '../CardLayer/DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age',
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../DoMinoJL_TableInfo': 'DoMinoJL_T' + 'ableInfo'
    }],
    'DoMinoJL_LeaveCard': [function(b, c, f) {
        'use strict';
        cc['_RF']['push'](c, 'd38d8ouOoJ' + 'Gb76UfhmqJ' + 'hbG', 'DoMinoJL_L' + 'eaveCard');
        var g = this && this['__decorate'] || function(p, q, u, v) {
            var w, x = arguments['length'], y = x < 0x3 ? q : null === v ? v = Object['getOwnProp' + 'ertyDescri' + 'ptor'](q, u) : v;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                y = Reflect['decorate'](p, q, u, v);
            else
                for (var z = p['length'] - 0x1; z >= 0x0; z--)
                    (w = p[z]) && (y = (x < 0x3 ? w(y) : x > 0x3 ? w(q, u, y) : w(q, u)) || y);
            return x > 0x3 && y && Object['defineProp' + 'erty'](q, u, y),
            y;
        }
        ;
        Object['defineProp' + 'erty'](f, '__esModule', {
            'value': !0x0
        }),
        f['DoMinoJL_L' + 'eaveCard'] = void 0x0;
        const h = b('../DoMinoJ' + 'L_Define')
          , j = b('./DoMino_S' + 'priteCardM' + 'anage')
          , {ccclass: k, property: l} = cc['_decorator'];
        let m = class extends j['DominoSpri' + 'teCardMana' + 'ge'] {
            constructor() {
                super(...arguments),
                this['m_ptBegin'] = cc['Vec2']['ZERO'],
                this['m_iTablePo' + 's'] = 0x0,
                this['m_fCardSca' + 'le'] = 0x0,
                this['m_fCardGap'] = 0x0,
                this['m_sizeSing' + 'leCard'] = cc['Size']['ZERO'];
            }
            ['InitLeaveC' + 'ard'](p, q=0.5, u=0x2c, v=cc['Vec2']['ZERO']) {
                this['m_iTablePo' + 's'] = p,
                this['m_fCardSca' + 'le'] = q,
                this['m_fCardGap'] = u,
                this['m_ptBegin'] = v;
            }
            ['ResetAllCa' + 'rdPosition'](p) {
                if (super['ResetAllCa' + 'rdPosition'](p),
                -0x1 == this['m_iTablePo' + 's'])
                    for (let q = 0x0; q < this['m_arrSprit' + 'eCard']['length']; q++)
                        this['m_arrSprit' + 'eCard'][q]['iX'] = this['m_ptBegin']['x'] + q * this['m_fCardGap'],
                        this['m_arrSprit' + 'eCard'][q]['iY'] = this['m_ptBegin']['y'],
                        this['m_arrSprit' + 'eCard'][q]['pCardSprit' + 'e']['node']['scale'] = this['m_fCardSca' + 'le'],
                        this['m_arrSprit' + 'eCard'][q]['pCardSprit' + 'e']['node']['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][q]['iX'], this['m_arrSprit' + 'eCard'][q]['iY']);
                else {
                    if (0x1 == this['m_iTablePo' + 's'])
                        return;
                    cc['winSize'];
                    let u = cc['Vec3']['ZERO']
                      , v = 0x0;
                    0x0 == this['m_iTablePo' + 's'] ? (u['x'] = -0x1ae,
                    u['y'] = 0x4c) : 0x2 == this['m_iTablePo' + 's'] ? (v = (this['m_arrSprit' + 'eCard']['length'] - 0x1) * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] * this['m_fCardSca' + 'le'],
                    u['x'] = 0x1ae - v,
                    u['y'] = 0x4c) : (v = (this['m_arrSprit' + 'eCard']['length'] - 0x1) * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] * this['m_fCardSca' + 'le'],
                    u['x'] = 0.5 * -v,
                    u['y'] = 0xaa);
                    for (let w = 0x0; w < this['m_arrSprit' + 'eCard']['length']; w++)
                        this['m_arrSprit' + 'eCard'][w]['iX'] = u['x'] + w * this['m_fCardGap'] + this['m_fCardSca' + 'le'] * this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        this['m_arrSprit' + 'eCard'][w]['iY'] = u['y'],
                        this['m_arrSprit' + 'eCard'][w]['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                        this['m_arrSprit' + 'eCard'][w]['pCardSprit' + 'e']['node']['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][w]['iX'], this['m_arrSprit' + 'eCard'][w]['iY']);
                }
            }
            ['onLoad']() {
                this['m_sizeSing' + 'leCard'] = cc['size'](h['EJL_Define']['HAND_CARD_' + 'WIDTH'], h['EJL_Define']['HAND_CARD_' + 'HEIGTH']),
                this['m_fCardGap'] = 0x2c,
                this['m_fCardSca' + 'le'] = 0.5,
                this['SetNeedSha' + 'dow'](!0x0);
            }
            ['start']() {}
        }
        ;
        m = g([k], m),
        f['DoMinoJL_L' + 'eaveCard'] = m,
        cc['_RF']['pop']();
    }
    , {
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        './DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age'
    }],
    'DoMinoJL_Msg': [function(j, k, q) {
        'use strict';
        cc['_RF']['push'](k, '3e5d89b+OZ' + 'IZZNnjhqBN' + 'Ucb', 'DoMinoJL_M' + 'sg');
        var x, z, H, K, Q, U, V, W, X, Y, Z, a0, a1, a2 = this && this['__decorate'] || function(ap, aq, ar, as) {
            var at, au = arguments['length'], av = au < 0x3 ? aq : null === as ? as = Object['getOwnProp' + 'ertyDescri' + 'ptor'](aq, ar) : as;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                av = Reflect['decorate'](ap, aq, ar, as);
            else
                for (var aw = ap['length'] - 0x1; aw >= 0x0; aw--)
                    (at = ap[aw]) && (av = (au < 0x3 ? at(av) : au > 0x3 ? at(aq, ar, av) : at(aq, ar)) || av);
            return au > 0x3 && av && Object['defineProp' + 'erty'](aq, ar, av),
            av;
        }
        , a3 = this && this['__metadata'] || function(ap, aq) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](ap, aq);
        }
        ;
        Object['defineProp' + 'erty'](q, '__esModule', {
            'value': !0x0
        }),
        q['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'eq'] = q['DMINOJL_Fr' + 'eeTaskOKRe' + 'q'] = q['DMINOJL_Se' + 'ndCardsNot' + 'iceReq'] = q['DMINOJL_Se' + 'ndCardsReq'] = q['DMINOJL_Ch' + 'ooseFreeTa' + 'skRsp'] = q['DMINOJL_Ga' + 'meResultSe' + 'rverRsp'] = q['DMINOJL_Ga' + 'meAgainLog' + 'inExtraRsp'] = q['DMINOJL_Se' + 'ndCardsNot' + 'iceRsp'] = q['DMINOJL_Se' + 'ndCardsSer' + 'verRsp'] = q['DMINOJL_De' + 'alCardsSer' + 'verRsp'] = q['DMINOJL_Fr' + 'eeTaskSucc' + 'NoticeRsp'] = q['DMINOJL_Fr' + 'eeTaskInfo' + 'NoticeRsp'] = q['DMINOJL_Fr' + 'eeTaskInfo'] = q['DMINOJL_Sp' + 'inActivity' + 'InfoPrizeR' + 'sp'] = q['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'sp'] = q['EJL_MsgTyp' + 'e'] = void 0x0;
        const a4 = j('../../../s' + 'cript/Comm' + 'on/Struct/' + 'StructDeco' + 'rators')
          , a5 = j('../../../s' + 'cript/Comm' + 'on/Types/T' + 'ypeChar')
          , a6 = j('../../../s' + 'cript/Comm' + 'on/Types/T' + 'ypeInt32')
          , a7 = j('../../../s' + 'cript/Comm' + 'on/Types/T' + 'ypeInt64')
          , a8 = j('../../../s' + 'cript/Comm' + 'on/Types/T' + 'ypeInt8')
          , a9 = j('../../../s' + 'cript/Netw' + 'ork/TcpCom' + 'Msg');
        (function(ap) {
            ap[ap['DMINOJL_DE' + 'AL_CARDS_S' + 'ERVER_MSG'] = 0xa010] = 'DMINOJL_DE' + 'AL_CARDS_S' + 'ERVER_MSG',
            ap[ap['DMINOJL_SE' + 'ND_CARDS_S' + 'ERVER_MSG'] = 0xa011] = 'DMINOJL_SE' + 'ND_CARDS_S' + 'ERVER_MSG',
            ap[ap['DMINOJL_SE' + 'ND_CARDS_R' + 'EQ_MSG'] = 0xa012] = 'DMINOJL_SE' + 'ND_CARDS_R' + 'EQ_MSG',
            ap[ap['DMINOJL_SE' + 'ND_CARDS_N' + 'OTICE_MSG'] = 0xa013] = 'DMINOJL_SE' + 'ND_CARDS_N' + 'OTICE_MSG',
            ap[ap['DMINOJL_GA' + 'ME_RESULT_' + 'SERVER_MSG'] = 0xa020] = 'DMINOJL_GA' + 'ME_RESULT_' + 'SERVER_MSG',
            ap[ap['DMINOJL_CH' + 'OOSE_FREE_' + 'TASK_MSG'] = 0xa030] = 'DMINOJL_CH' + 'OOSE_FREE_' + 'TASK_MSG',
            ap[ap['DMINOJL_FR' + 'EE_TASK_OK' + '_REQ'] = 0xa031] = 'DMINOJL_FR' + 'EE_TASK_OK' + '_REQ',
            ap[ap['DMINOJL_FR' + 'EE_TASK_IN' + 'FO_NOTICE'] = 0xa032] = 'DMINOJL_FR' + 'EE_TASK_IN' + 'FO_NOTICE',
            ap[ap['DMINOJL_FR' + 'EE_TASK_SU' + 'CC_NOTICE'] = 0xa033] = 'DMINOJL_FR' + 'EE_TASK_SU' + 'CC_NOTICE',
            ap[ap['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_REQ'] = 0xa040] = 'DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_REQ',
            ap[ap['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_RES'] = 0xa041] = 'DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_OPEN_PRI' + 'ZE_RES',
            ap[ap['DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_INFO_NOT' + 'ICE'] = 0xa042] = 'DMINOJL_SP' + 'IN_ACTIVIT' + 'Y_INFO_NOT' + 'ICE';
        }(q['EJL_MsgTyp' + 'e'] || (q['EJL_MsgTyp' + 'e'] = {})));
        let aa = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (x = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? x : Object)], aa['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], aa['prototype'], 'iRet', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], aa['prototype'], 'iIndex', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], aa['prototype'], 'iPropID', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aa['prototype'], 'cIfSpinMax', void 0x0),
        a2([a4['Field'](a7['INT64']), a3('design:typ' + 'e', Number)], aa['prototype'], 'llNum', void 0x0),
        aa = a2([a4['Struct']()], aa),
        q['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'sp'] = aa;
        let ab = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead'](),
                this['szPrize'] = '',
                this['szTips'] = '',
                this['szTimeTip'] = '';
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (z = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? z : Object)], ab['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a5['CHAR'], 0x100), a3('design:typ' + 'e', String)], ab['prototype'], 'szPrize', void 0x0),
        a2([a4['Field'](a5['CHAR'], 0x80), a3('design:typ' + 'e', String)], ab['prototype'], 'szTips', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iProgress', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iState', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iProgressU' + 'nit', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iStartTime' + '1', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iEndTime1', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iStartTime' + '2', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iEndTime2', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iStartTime' + '3', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iEndTime3', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iStage', void 0x0),
        a2([a4['Field'](a6['INT32'], 0x2), a3('design:typ' + 'e', Array)], ab['prototype'], 'iLeftTime', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ab['prototype'], 'iIfSpinMax', void 0x0),
        a2([a4['Field'](a5['CHAR'], 0x80), a3('design:typ' + 'e', String)], ab['prototype'], 'szTimeTip', void 0x0),
        ab = a2([a4['Struct']()], ab),
        q['DMINOJL_Sp' + 'inActivity' + 'InfoPrizeR' + 'sp'] = ab;
        let ac = class {
        }
        ;
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ac['prototype'], 'iFreeTaskI' + 'D', void 0x0),
        a2([a4['Field'](a5['CHAR'], 0x40), a3('design:typ' + 'e', String)], ac['prototype'], 'szTaskName', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ac['prototype'], 'iTaskLv', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ac['prototype'], 'iSuccNum', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ac['prototype'], 'iAwardNum', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ac['prototype'], 'iNowSuccNu' + 'm', void 0x0),
        a2([a4['Field'](a6['INT32'], 0x2), a3('design:typ' + 'e', Array)], ac['prototype'], 'iBuff', void 0x0),
        a2([a4['Field'](a5['CHAR'], 0x4), a3('design:typ' + 'e', Array)], ac['prototype'], 'cBuff', void 0x0),
        ac = a2([a4['Struct']()], ac),
        q['DMINOJL_Fr' + 'eeTaskInfo'] = ac;
        let ad = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead'](),
                this['cState'] = 0x0;
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (H = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? H : Object)], ad['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Object)], ad['prototype'], 'cState', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x3), a3('design:typ' + 'e', Array)], ad['prototype'], 'cBuff', void 0x0),
        a2([a4['Field'](ac), a3('design:typ' + 'e', ac)], ad['prototype'], 'pTaskInfo', void 0x0),
        ad = a2([a4['Struct']()], ad),
        q['DMINOJL_Fr' + 'eeTaskInfo' + 'NoticeRsp'] = ad;
        let ae = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead'](),
                this['iType'] = 0x0,
                this['iNowSuccNu' + 'm'] = 0x0,
                this['iAwardNum'] = 0x0;
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (K = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? K : Object)], ae['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ae['prototype'], 'iType', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ae['prototype'], 'iNowSuccNu' + 'm', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ae['prototype'], 'iAwardNum', void 0x0),
        ae = a2([a4['Struct']()], ae),
        q['DMINOJL_Fr' + 'eeTaskSucc' + 'NoticeRsp'] = ae;
        let af = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (Q = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? Q : Object)], af['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a5['CHAR']), a3('design:typ' + 'e', Number)], af['prototype'], 'cGameBanke' + 'r', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], af['prototype'], 'cCardNum', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], af['prototype'], 'cSelfCards', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], af['prototype'], 'cIsSpinAct' + 'ivity', void 0x0),
        af = a2([a4['Struct']()], af),
        q['DMINOJL_De' + 'alCardsSer' + 'verRsp'] = af;
        let ag = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (U = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? U : Object)], ag['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ag['prototype'], 'cTableNumE' + 'xtra', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x3), a3('design:typ' + 'e', Array)], ag['prototype'], 'cReserve', void 0x0),
        ag = a2([a4['Struct']()], ag),
        q['DMINOJL_Se' + 'ndCardsSer' + 'verRsp'] = ag;
        let ah = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (V = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? V : Object)], ah['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ah['prototype'], 'cTableNumE' + 'xtra', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ah['prototype'], 'cCardNum', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ah['prototype'], 'cCard', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ah['prototype'], 'cOriType', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ah['prototype'], 'cWinTableP' + 'os', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ah['prototype'], 'iLoseMoney', void 0x0),
        ah = a2([a4['Struct']()], ah),
        q['DMINOJL_Se' + 'ndCardsNot' + 'iceRsp'] = ah;
        let ai = class {
        }
        ;
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cNowSendPl' + 'ayer', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cGameBanke' + 'r', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x4), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPlayerPas' + 's', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x4), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPlayerCar' + 'dNum', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], ai['prototype'], 'cSelfCards', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cAllSendCa' + 'rdNum', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cFirstSend' + 'Card', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x1c), a3('design:typ' + 'e', Array)], ai['prototype'], 'cAllSendCa' + 'rd', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPassCardV' + 'alNum0', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPassCardV' + 'alNum1', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPassCardV' + 'alNum2', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], ai['prototype'], 'cPassCardV' + 'alNum3', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cIsSpinAct' + 'ivity', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], ai['prototype'], 'cIsFishAct' + 'ivity', void 0x0),
        ai = a2([a4['Struct']()], ai),
        q['DMINOJL_Ga' + 'meAgainLog' + 'inExtraRsp'] = ai;
        let aj = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead'](),
                this['iShowMoney' + 'Result'] = [],
                this['iMoneyResu' + 'lt'] = [],
                this['cLeftCardN' + 'um'] = [],
                this['cLeftCard0'] = [],
                this['cLeftCard1'] = [],
                this['cLeftCard2'] = [],
                this['cLeftCard3'] = [],
                this['cBankrupt'] = [];
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (W = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? W : Object)], aj['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a7['INT64'], 0x4), a3('design:typ' + 'e', Array)], aj['prototype'], 'iShowMoney' + 'Result', void 0x0),
        a2([a4['Field'](a7['INT64'], 0x4), a3('design:typ' + 'e', Array)], aj['prototype'], 'iMoneyResu' + 'lt', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x4), a3('design:typ' + 'e', Array)], aj['prototype'], 'cLeftCardN' + 'um', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], aj['prototype'], 'cLeftCard0', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], aj['prototype'], 'cLeftCard1', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], aj['prototype'], 'cLeftCard2', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x7), a3('design:typ' + 'e', Array)], aj['prototype'], 'cLeftCard3', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], aj['prototype'], 'iBeiShu', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], aj['prototype'], 'iBasePoint', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aj['prototype'], 'cIfLeaveTa' + 'ble', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aj['prototype'], 'cShowTime', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aj['prototype'], 'cStarTime', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aj['prototype'], 'cLastSendC' + 'ard', void 0x0),
        a2([a4['Field'](a8['INT8'], 0x4), a3('design:typ' + 'e', Array)], aj['prototype'], 'cBankrupt', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], aj['prototype'], 'cWaitNext', void 0x0),
        aj = a2([a4['Struct']()], aj),
        q['DMINOJL_Ga' + 'meResultSe' + 'rverRsp'] = aj;
        let ak = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (X = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? X : Object)], ak['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ak['prototype'], 'iSize', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], ak['prototype'], 'iType', void 0x0),
        a2([a4['Field'](a6['INT32'], 0x2), a3('design:typ' + 'e', Array)], ak['prototype'], 'iBuff', void 0x0),
        a2([a4['Field'](ac, 0x3), a3('design:typ' + 'e', Array)], ak['prototype'], 'taskInfo', void 0x0),
        ak = a2([a4['Struct']()], ak),
        q['DMINOJL_Ch' + 'ooseFreeTa' + 'skRsp'] = ak;
        let al = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (Y = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? Y : Object)], al['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], al['prototype'], 'cCardNum', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], al['prototype'], 'cCard', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], al['prototype'], 'cOriType', void 0x0),
        al = a2([a4['Struct']()], al),
        q['DMINOJL_Se' + 'ndCardsReq'] = al;
        let am = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (Z = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? Z : Object)], am['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], am['prototype'], 'cTableNumE' + 'xtra', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], am['prototype'], 'cCardNum', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], am['prototype'], 'cCard', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], am['prototype'], 'cOriType', void 0x0),
        a2([a4['Field'](a8['INT8']), a3('design:typ' + 'e', Number)], am['prototype'], 'cWinTableP' + 'os', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], am['prototype'], 'iLoseMoney', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], am['prototype'], 'iLoseMoney' + '1', void 0x0),
        am = a2([a4['Struct']()], am),
        q['DMINOJL_Se' + 'ndCardsNot' + 'iceReq'] = am;
        let an = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (a0 = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? a0 : Object)], an['prototype'], 'msgHeadInf' + 'o', void 0x0),
        a2([a4['Field'](a6['INT32']), a3('design:typ' + 'e', Number)], an['prototype'], 'iFreeTaskI' + 'D', void 0x0),
        an = a2([a4['Struct']()], an),
        q['DMINOJL_Fr' + 'eeTaskOKRe' + 'q'] = an;
        let ao = class {
            constructor() {
                this['msgHeadInf' + 'o'] = new a9['TcpMsgHead']();
            }
        }
        ;
        a2([a4['Field'](a9['TcpMsgHead']), a3('design:typ' + 'e', 'function' == typeof (a1 = void 0x0 !== a9['TcpMsgHead'] && a9['TcpMsgHead']) ? a1 : Object)], ao['prototype'], 'msgHeadInf' + 'o', void 0x0),
        ao = a2([a4['Struct']()], ao),
        q['DMINOJL_Sp' + 'inActivity' + 'OpenPrizeR' + 'eq'] = ao,
        cc['_RF']['pop']();
    }
    , {
        '../../../script/Common/Struct/StructDecorators': void 0x0,
        '../../../script/Common/Types/TypeChar': void 0x0,
        '../../../script/Common/Types/TypeInt32': void 0x0,
        '../../../script/Common/Types/TypeInt64': void 0x0,
        '../../../script/Common/Types/TypeInt8': void 0x0,
        '../../../script/Network/TcpComMsg': void 0x0
    }],
    'DoMinoJL_OneTaskLayer': [function(j, k, q) {
        'use strict';
        cc['_RF']['push'](k, '73770Optht' + 'J5pQCj5no0' + '/Lm', 'DoMinoJL_O' + 'neTaskLaye' + 'r');
        var x, z, F, H, K, Q, U, V, W, X, Y, Z, a0, a1, a2, a3 = this && this['__decorate'] || function(an, ao, ap, aq) {
            var ar, as = arguments['length'], at = as < 0x3 ? ao : null === aq ? aq = Object['getOwnProp' + 'ertyDescri' + 'ptor'](ao, ap) : aq;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                at = Reflect['decorate'](an, ao, ap, aq);
            else
                for (var au = an['length'] - 0x1; au >= 0x0; au--)
                    (ar = an[au]) && (at = (as < 0x3 ? ar(at) : as > 0x3 ? ar(ao, ap, at) : ar(ao, ap)) || at);
            return as > 0x3 && at && Object['defineProp' + 'erty'](ao, ap, at),
            at;
        }
        , a4 = this && this['__metadata'] || function(an, ao) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](an, ao);
        }
        ;
        Object['defineProp' + 'erty'](q, '__esModule', {
            'value': !0x0
        });
        const a5 = j('../../../.' + './script/C' + 'ommon/Base' + '/GameViewB' + 'ase')
          , a6 = j('../../../.' + './script/C' + 'ommon/Base' + '/UIManager')
          , a7 = j('../../../.' + './script/C' + 'ommon/Res/' + 'ResUtil')
          , a8 = j('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , a9 = j('../../../.' + './script/C' + 'ommonLogic')
          , aa = j('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , ab = j('../../../.' + './script/C' + 'onfigs/HW_' + 'GameTextBa' + 'se')
          , ac = j('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , ad = j('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , ae = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Com' + 'm_AniAward' + 'Money')
          , af = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/HwL' + 'obbyTipsNo' + 'de')
          , ag = j('../CardLay' + 'er/DoMino_' + 'SpriteCard' + 'Manage')
          , ah = j('../DoMinoJ' + 'L_CardRule')
          , ai = j('../DoMinoJ' + 'L_Define')
          , aj = j('../PlayerI' + 'nfo/DoMino' + 'JL_PlayerI' + 'nfo')
          , {ccclass: ak, property: al} = cc['_decorator'];
        let am = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['UD_TASK_TI' + 'PS_SHOW'] = 'game_task_' + 'tips_show',
                this['UD_GET_YB_' + 'TIPS_SHOW'] = 'game_get_y' + 'b_tips_sho' + 'w',
                this['UD_TASK_TI' + 'PS_NEXT'] = 'game_task_' + 'tips_nxet',
                this['UD_TASK_TI' + 'PS_DOUBLE_' + 'CARD'] = 'game_task_' + 'tips_doubl' + 'e_card',
                this['TASK_TIPS_' + 'NAME'] = 'TaskTips',
                this['NODE_RESUL' + 'T_TASK'] = 'Node_Resul' + 't',
                this['m_pCardAtl' + 'as'] = null,
                this['m_pWordAtl' + 'as'] = null,
                this['m_pNodeBK'] = null,
                this['m_pNodeBg'] = null,
                this['m_pLabTitl' + 'e'] = null,
                this['m_pNodeDen' + 'gDai'] = null,
                this['m_pNodeDou' + 'bleBK'] = null,
                this['m_pSprDoub' + 'leWord'] = null,
                this['m_pLabWord'] = null,
                this['m_pLabLeav' + 'eTime'] = null,
                this['m_pSprDoub' + 'leAni'] = null,
                this['m_pNodeYBI' + 'co'] = null,
                this['m_pNodeDou' + 'bleCardAni' + 'BK'] = null,
                this['m_pFontAwa' + 'rd'] = null,
                this['m_pPreBgFa' + 'b'] = null,
                this['m_iTaskID'] = 0x0,
                this['m_iDoubleC' + 'ard'] = -0x1,
                this['m_iAwardNu' + 'mAct'] = 0x0,
                this['m_iAwardNu' + 'm'] = 0x0,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pLayerSh' + 'adow'] = null,
                this['m_iLeaveTi' + 'me'] = 0x0,
                this['m_bIsShowi' + 'ngTaskAni'] = !0x1;
            }
            ['ShowOneTas' + 'k'](an, ao, ap, aq, ar=!0x1, as=0x1e) {
                if (this['CloseOneTa' + 'sk'](),
                !an)
                    return;
                this['m_pIGameCa' + 'llBack'] = ao,
                console['log']('0===ShowOn' + 'eTask==');
                let at = ''
                  , au = cc['color'](0x6d, 0xb8, 0xcf)
                  , av = cc['color'](0xfd, 0xd0, 0x74);
                this['m_iTaskID'] = an['iTaskID'],
                this['m_iDoubleC' + 'ard'] = an['iDoubleCar' + 'd'],
                this['m_iAwardNu' + 'mAct'] = an['iAwardNumA' + 'ct'];
                let aw = an['szTaskName']
                  , ax = a8['default']['SplitStrin' + 'g'](aw, '|');
                if (0x0 == ax['length'])
                    return;
                console['log']('1===ShowOn' + 'eTask==' + ax['length']),
                this['node']['active'] = !0x0,
                this['m_pNodeBK']['setPositio' + 'n'](ap),
                this['m_pSprDoub' + 'leAni']['node']['active'] = !0x1;
                let ay = 0x80;
                if (this['m_pNodeDou' + 'bleBK']['active'] = !0x1,
                this['m_pNodeDou' + 'bleCardAni' + 'BK']['active'] = !0x1,
                an['iDoubleCar' + 'd'] >= 0x0 && an['iTaskID'] > 0x0) {
                    this['m_pNodeDou' + 'bleBK']['active'] = !0x0,
                    this['m_pLabLeav' + 'eTime']['node']['active'] = !0x1,
                    this['m_pLabWord']['node']['active'] = !0x0,
                    a8['default']['SetSpriteF' + 'rame'](this['m_pWordAtl' + 'as'], this['m_pSprDoub' + 'leWord'], 'DG_rw_dp_k' + 'd');
                    let az = aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x16a) + ':' + an['iDoubleCar' + 'd'];
                    if (this['m_pLabWord']['fontSize'] = 0x14,
                    this['m_pLabWord']['node']['color'] = au,
                    this['m_pLabWord']['string'] = az,
                    0x1 == an['cOnceFirst' + 'Into'] && 0x0 == an['cEventID'] && !ar) {
                        this['m_pNodeDou' + 'bleCardAni' + 'BK']['active'] = !0x0,
                        this['m_pNodeDou' + 'bleCardAni' + 'BK']['setPositio' + 'n'](0.5 * cc['winSize']['width'] - 0x384, 0.5 * -cc['winSize']['height'] + 0x64);
                        let aA = a8['default']['GetCompone' + 'nt'](cc['Sprite']);
                        a8['default']['SetSpriteF' + 'rame'](this['m_pWordAtl' + 'as'], aA, 'DG_game_ti' + 'ps_kb'),
                        this['m_pNodeDou' + 'bleCardAni' + 'BK']['addChild'](aA['node']);
                        let aB = this['node']['convertToN' + 'odeSpaceAR'](new cc['Vec2'](0.5 * cc['winSize']['width'],0.5 * cc['winSize']['height']));
                        this['m_pNodeDou' + 'bleCardAni' + 'BK']['runAction'](cc['sequence'](cc['fadeIn'](0.001), cc['moveTo'](0.3, aB['x'], aB['y'] + 0x64), cc['delayTime'](0x2), cc['fadeOut'](0.2)));
                    }
                } else if (an['iActTime'] > 0x0) {
                    this['m_pNodeDou' + 'bleBK']['active'] = !0x0,
                    this['m_pLabLeav' + 'eTime']['node']['active'] = !0x0,
                    this['m_pLabWord']['node']['active'] = !0x1,
                    a8['default']['SetSpriteF' + 'rame'](this['m_pWordAtl' + 'as'], this['m_pSprDoub' + 'leWord'], 'DG_rw_dp_b' + 'ouble');
                    let aC = a8['default']['PrefixInte' + 'ger'](an['iActTime'] / 0xe10, 0x2) + ':';
                    aC += a8['default']['PrefixInte' + 'ger'](an['iActTime'] % 0xe10 / 0x3c, 0x2) + ':',
                    aC += a8['default']['PrefixInte' + 'ger'](an['iActTime'] % 0xe10 % 0x3c, 0x2),
                    this['m_pLabLeav' + 'eTime']['string'] = aC,
                    this['m_iLeaveTi' + 'me'] = an['iActTime'],
                    this['unschedule'](this['OnLeaveTim' + 'e']),
                    this['schedule'](this['OnLeaveTim' + 'e'], 0x1);
                } else
                    '' != an['szActTime'] && null != an['szActTime'] && (this['m_pNodeDou' + 'bleBK']['active'] = !0x0,
                    this['m_pLabLeav' + 'eTime']['node']['active'] = !0x1,
                    this['m_pLabWord']['node']['active'] = !0x0,
                    this['m_pLabWord']['string'] = an['szActTime'],
                    a8['default']['SetSpriteF' + 'rame'](this['m_pWordAtl' + 'as'], this['m_pSprDoub' + 'leWord'], 'DG_rw_dp_b' + 'ouble'));
                if (an['iAwardNumA' + 'ct'] > 0x0) {
                    ay = 0x74,
                    this['m_pSprDoub' + 'leAni']['string'] = 'x2';
                    let aD = this['m_pNodeBK']['getContent' + 'Size']();
                    this['m_pSprDoub' + 'leAni']['node']['setPositio' + 'n'](0x82 + 0.5 * aD['width'], 0.5 * aD['height'] - 0x1e),
                    this['m_pSprDoub' + 'leAni']['node']['setScale'](3.5),
                    this['m_pSprDoub' + 'leAni']['node']['active'] = !0x0;
                }
                if (an['iTaskID'] < 0x0) {
                    if (ax['length'] >= 0x2) {
                        this['m_pLabTitl' + 'e']['string'] = ax[0x0];
                        let aE = a8['default']['GetLabel'](ax[0x1], 0x14, au);
                        aE['horizontal' + 'Align'] = cc['Label']['Horizontal' + 'Align']['CENTER'],
                        aE['node']['setPositio' + 'n'](0xd2, 0x26),
                        aE['node']['name'] = 'pLableWord' + '2',
                        this['m_pNodeBK']['addChild'](aE['node']);
                    }
                } else {
                    if (0x1 == ax['length'])
                        this['m_pLabTitl' + 'e']['string'] = ax[0x0];
                    else if (0x2 == ax['length']) {
                        this['m_pLabTitl' + 'e']['string'] = ax[0x0];
                        let aH = 0x0
                          , aI = 0x0;
                        console['log']('===vcStr[1' + ']===' + ax[0x1]);
                        let aJ = a8['default']['SplitStrin' + 'g'](ax[0x1], ':');
                        if (0x1 == aJ['length'] ? aH = Number['parseInt'](aJ[0x0]) : aJ['length'] > 0x1 && (aH = Number['parseInt'](aJ[0x0]),
                        aI = Number['parseInt'](aJ[0x1])),
                        aH >= 0x0 && aH <= 0x6 && aI >= 0x0 && aI <= 0x6) {
                            let aK = ah['CardRule']['MakeCard'](aH, aI)
                              , aL = ag['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], aK, 0x0, !0x1, !0x0);
                            if (null != aL) {
                                let aM = this['m_pLabTitl' + 'e']['node']['parent']['getContent' + 'Size']();
                                aL['node']['setPositio' + 'n'](0.5 * aM['width'] - 0x28, 0x0),
                                aL['node']['setScale'](0.5),
                                aL['name'] = 'pShowCard',
                                this['m_pLabTitl' + 'e']['node']['parent']['addChild'](aL['node']);
                            }
                        }
                    }
                    at = aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x46) + '\x20:';
                    let aF = a8['default']['GetLabel'](at, 0x14, au);
                    aF['horizontal' + 'Align'] = cc['Label']['Horizontal' + 'Align']['LEFT'],
                    aF['node']['setAnchorP' + 'oint'](0x0, 0.5),
                    aF['node']['setPositio' + 'n'](ay, 0x26),
                    aF['node']['name'] = 'pLableWord' + '2',
                    this['m_pNodeBK']['addChild'](aF['node']),
                    at = an['iAwardNumA' + 'ct'] > 0x0 && an['iAwardNum'] > an['iAwardNumA' + 'ct'] ? an['iAwardNum'] - an['iAwardNumA' + 'ct'] + '' : an['iAwardNum'] + '';
                    let aG = a8['default']['GetLabel'](at, 0x18, av);
                    aG['horizontal' + 'Align'] = cc['Label']['Horizontal' + 'Align']['LEFT'],
                    aG['node']['setAnchorP' + 'oint'](0x0, 0.5),
                    aG['node']['name'] = 'pLableWord' + '3',
                    aG['node']['setPositio' + 'n'](ay + aF['node']['getContent' + 'Size']()['width'] + 0xa, 0x26),
                    this['m_pNodeBK']['addChild'](aG['node']),
                    this['m_pNodeYBI' + 'co']['active'] = !0x0,
                    this['m_pNodeYBI' + 'co']['setPositio' + 'n'](ay + aF['node']['getContent' + 'Size']()['width'] + 0xa + aG['node']['getContent' + 'Size']()['width'] + 0x1a, 0x26),
                    this['m_pNodeYBI' + 'co']['setScale'](0.56),
                    null != this['m_pSprDoub' + 'leAni'] && this['m_pSprDoub' + 'leAni']['node']['setPositio' + 'n'](this['m_pNodeYBI' + 'co']['getPositio' + 'n']()['x'] + 0x22, this['m_pNodeYBI' + 'co']['getPositio' + 'n']()['y'] + 0x6);
                }
                this['m_bIsShowi' + 'ngTaskAni'] = !0x0,
                ar ? (this['m_pNodeDen' + 'gDai'] && (this['m_pNodeDen' + 'gDai']['active'] = !0x1),
                null == this['m_pLayerSh' + 'adow'] && (this['m_pLayerSh' + 'adow'] = a7['ResUtil']['Instantiat' + 'e'](this['m_pPreBgFa' + 'b']),
                this['m_pLayerSh' + 'adow']['setScale'](0x2),
                this['node']['addChild'](this['m_pLayerSh' + 'adow'], -0x1)),
                this['m_pLayerSh' + 'adow'] && this['m_pLayerSh' + 'adow']['runAction'](cc['sequence'](cc['fadeTo'](0.2, 0x96), cc['delayTime'](0x2), cc['fadeOut'](0.2))),
                this['node']['active'] = !0x0,
                this['m_pNodeBK']['active'] = !0x0,
                this['m_pNodeBK']['opacity'] = 0x3,
                this['m_pNodeBK']['setScale'](1.3),
                this['m_pNodeBK']['stopAllAct' + 'ions'](),
                this['m_pNodeBK']['runAction'](cc['sequence'](cc['fadeIn'](0.2), cc['delayTime'](0x2), cc['spawn'](cc['moveTo'](0.4, aq), cc['scaleTo'](0.4, 0x1)), cc['callFunc'](this['CallFuncFi' + 'rstShowEnd'], this))),
                a5['default']['LockMainMs' + 'g']()) : (this['m_pNodeDen' + 'gDai'] && (this['m_pNodeDen' + 'gDai']['active'] = !0x0),
                this['m_pNodeBK']['stopAllAct' + 'ions'](),
                this['m_pNodeBK']['runAction'](cc['sequence'](cc['moveTo'](0.25, aq['x'], aq['y'] - 0xa), cc['jumpBy'](0.25, 0x0, 0xa, 0xf, 0x1), cc['callFunc'](this['CallFuncSh' + 'owEnd'], this))),
                this['m_pNodeDen' + 'gDai']['stopAllAct' + 'ions'](),
                this['m_pNodeDen' + 'gDai']['runAction'](cc['sequence'](cc['delayTime'](0.4), cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0), cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0))));
            }
            ['OnLeaveTim' + 'e'](an) {
                if (this['m_pLabLeav' + 'eTime'] && this['m_iLeaveTi' + 'me'] > 0x0) {
                    this['m_iLeaveTi' + 'me']--;
                    let ao = a8['default']['PrefixInte' + 'ger'](this['m_iLeaveTi' + 'me'] / 0xe10, 0x2) + ':';
                    ao += a8['default']['PrefixInte' + 'ger'](this['m_iLeaveTi' + 'me'] % 0xe10 / 0x3c, 0x2) + ':',
                    ao += a8['default']['PrefixInte' + 'ger'](this['m_iLeaveTi' + 'me'] % 0xe10 % 0x3c, 0x2),
                    this['m_pLabLeav' + 'eTime']['string'] = ao,
                    this['m_iLeaveTi' + 'me'] <= 0x0 && this['unschedule'](this['OnLeaveTim' + 'e']);
                } else
                    this['unschedule'](this['OnLeaveTim' + 'e']);
            }
            ['SetTaskRes' + 'ult'](an, ao=null) {
                this['m_pIGameCa' + 'llBack'] = ao,
                this['m_iAwardNu' + 'm'] = an;
                let ap = new cc['Node']()
                  , aq = ap['addCompone' + 'nt'](cc['Sprite'])
                  , ar = 'DG_rw_bq_w' + 'wc';
                an > 0x0 && (ar = 'DG_rw_bq_y' + 'wc'),
                a8['default']['SetSpriteF' + 'rame'](this['m_pWordAtl' + 'as'], aq, ar),
                console['log']('==SetTaskR' + 'esult=' + ar + '===' + this['m_iAwardNu' + 'm']);
                let as = this['m_pNodeBK']['getContent' + 'Size']();
                ap['setPositio' + 'n'](0x14 + 0.5 * as['width'], 0.5 * as['height'] - 0xa),
                this['m_pNodeBK']['addChild'](ap),
                ap['name'] = this['NODE_RESUL' + 'T_TASK'],
                ap['setScale'](0x3),
                an > 0x0 ? (a5['default']['LockMainMs' + 'g'](),
                ap['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1)), cc['delayTime'](0.2), cc['callFunc'](this['CallFuncGe' + 'tAwardAni'], this)))) : ap['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1))));
            }
            ['CloseOneTa' + 'sk'](an=!0x1) {
                this['m_pNodeBK'] && an ? this['m_pNodeBK']['runAction'](cc['sequence'](cc['fadeOut'](0.4), cc['callFunc'](this['CallFuncCl' + 'ose'], this))) : this['CallFuncCl' + 'ose']();
            }
            ['ShowTaskTi' + 'ps']() {
                if (!this['m_bIsShowi' + 'ngTaskAni'] && null == this['node']['getChildBy' + 'Name']('ShowTaskTi' + 'ps')) {
                    let an = ab['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ac['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x6)
                      , ao = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](an, 0x14, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['UP'], 0x1, 0x82, 0x8, 0xfa);
                    ao['setPositio' + 'n'](0xc8, -0x1e),
                    ao['name'] = 'ShowTaskTi' + 'ps',
                    this['node']['addChild'](ao, 0x64),
                    this['scheduleOn' + 'ce']( () => {
                        ao && ao['removeFrom' + 'Parent'](!0x0),
                        ao = null;
                    }
                    , 0x5);
                }
            }
            ['OnJLTouchS' + 'tart'](an) {
                let ao = this['node']['convertToN' + 'odeSpaceAR'](an['touch']['getLocatio' + 'n']());
                this['m_pNodeBg'] && this['m_pNodeBg']['getBoundin' + 'gBox']()['contains'](ao) && (this['ShowChangL' + 'ayer'](),
                this['RemoveTask' + 'Tips'](),
                console['log']('==OnJLTouc' + 'hStart==ta' + 'sk='));
            }
            ['CallFuncCl' + 'ose']() {
                if (!this || !this['node'])
                    return;
                this['m_pNodeDou' + 'bleBK']['active'] = !0x1,
                this['m_pLabLeav' + 'eTime']['node']['active'] = !0x1,
                this['m_pLabWord']['node']['active'] = !0x1,
                this['m_pSprDoub' + 'leAni']['node']['active'] = !0x1,
                this['m_pNodeYBI' + 'co']['active'] = !0x1,
                this['m_pNodeDou' + 'bleCardAni' + 'BK']['active'] = !0x1,
                this['m_pNodeBK']['opacity'] = 0xff;
                let an = this['m_pNodeBK']['getChildBy' + 'Name'](this['NODE_RESUL' + 'T_TASK']);
                an && (an['removeFrom' + 'Parent'](!0x0),
                an = null);
                let ao = this['node']['getChildBy' + 'Name']('pLableWord' + '2');
                ao && ao['removeFrom' + 'Parent'](!0x0);
                let ap = this['node']['getChildBy' + 'Name']('pLableWord' + '3');
                ap && ap['removeFrom' + 'Parent'](!0x0);
                let aq = this['m_pLabTitl' + 'e']['node']['parent']['getChildBy' + 'Name']('pShowCard');
                aq && aq['removeFrom' + 'Parent'](!0x0),
                this['node']['active'] = !0x1;
            }
            ['CallFuncGe' + 'tAwardAni']() {
                this && this['node'] ? (null == this['m_pLayerSh' + 'adow'] && (this['m_pLayerSh' + 'adow'] = new cc['Node'](),
                this['m_pLayerSh' + 'adow']['setScale'](0x2),
                this['node']['addChild'](this['m_pLayerSh' + 'adow'], -0x1)),
                ad['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](ad['EJLSoundId']['GET_AWARD']),
                a6['uiManager']['Open'](a6['EGameUiId']['Comm_AniAw' + 'ardMoney'], [ae['EAniAwardT' + 'ype']['ANI_AWARD_' + 'SPREADER_Y' + 'B'], this['m_iAwardNu' + 'm'], null]),
                a6['uiManager']['m_uiOpenDe' + 'legate'] = an => {
                    if (an == a6['EGameUiId']['Comm_AniAw' + 'ardMoney']) {
                        console['log']('==m_uiOpen' + 'Delegate==');
                        let ao = a6['uiManager']['getUI'](an);
                        ao && ao['node'] && (ao['node']['zIndex'] = 0x3e8),
                        a6['uiManager']['m_uiOpenDe' + 'legate'] = null;
                    }
                }
                ,
                this['scheduleOn' + 'ce'](this['CallFuncGe' + 'tAwardAniE' + 'nd'], 2.9)) : a5['default']['UnLockMain' + 'Msg']();
            }
            ['CallFuncFi' + 'rstShowEnd']() {
                a5['default']['UnLockMain' + 'Msg'](),
                this['m_bIsShowi' + 'ngTaskAni'] = !0x1,
                this['m_pLayerSh' + 'adow'] && (this['node']['removeChil' + 'd'](this['m_pLayerSh' + 'adow']),
                this['m_pLayerSh' + 'adow'] = null),
                this['m_pNodeDen' + 'gDai'] && this['m_pNodeDen' + 'gDai']['runAction'](cc['repeat'](cc['sequence'](cc['fadeTo'](0.3, 0xff), cc['fadeTo'](0.3, 0x0)), 0x2)),
                this['m_pSprDoub' + 'leAni'] && this['m_iAwardNu' + 'mAct'] > 0x0 && (this['m_pSprDoub' + 'leAni']['node']['active'] = !0x0,
                this['m_pSprDoub' + 'leAni']['node']['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1)))));
                let an = a9['default']['GetNumberF' + 'orKey'](this['UD_TASK_TI' + 'PS_SHOW'], 0x0);
                if (an < 0x3 && this['m_iDoubleC' + 'ard'] < 0x0) {
                    an++,
                    a9['default']['SetLocalIn' + 'fo'](this['UD_TASK_TI' + 'PS_SHOW'], an),
                    aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x51),
                    this['RemoveTask' + 'Tips']();
                    let ao = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x51), 0x16, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['UP'], 0x1, 0.01, 0x6, 0x118);
                    ao['setPositio' + 'n'](0xd0, -0x21),
                    ao['name'] = this['TASK_TIPS_' + 'NAME'],
                    this['node']['addChild'](ao, 0x64),
                    this['scheduleOn' + 'ce']( () => {
                        ao && (ao['removeFrom' + 'Parent'](!0x0),
                        ao = null);
                    }
                    , 0xf);
                }
            }
            ['CallFuncSh' + 'owEnd']() {
                if (console['log']('====CallFu' + 'ncShowEnd=' + '='),
                this['m_bIsShowi' + 'ngTaskAni'] = !0x1,
                this['m_pSprDoub' + 'leAni'] && this['m_iAwardNu' + 'mAct'] > 0x0 && (this['m_pSprDoub' + 'leAni']['node']['active'] = !0x0,
                this['m_pSprDoub' + 'leAni']['node']['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.2), cc['scaleTo'](0.25, 0x1))))),
                -0x2 == this['m_iTaskID']) {
                    let an = a9['default']['GetNumberF' + 'orKey'](this['UD_TASK_TI' + 'PS_NEXT'], 0x0);
                    if (an < 0x2) {
                        an++,
                        a9['default']['SetLocalIn' + 'fo'](this['UD_TASK_TI' + 'PS_NEXT'], an),
                        this['RemoveTask' + 'Tips']();
                        let ao = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x50), 0x16, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['UP'], 0x1, 0.01, 0x6, 0x118);
                        ao['setPositio' + 'n'](0xd0, -0x21),
                        ao['name'] = this['TASK_TIPS_' + 'NAME'],
                        this['node']['addChild'](ao, 0x64),
                        this['scheduleOn' + 'ce']( () => {
                            ao && (ao['removeFrom' + 'Parent'](!0x0),
                            ao = null);
                        }
                        , 0xf);
                    }
                } else if (this['m_iTaskID'] > 0x0) {
                    let ap = a9['default']['GetNumberF' + 'orKey'](this['UD_TASK_TI' + 'PS_DOUBLE_' + 'CARD'], 0x0);
                    if (this['m_iDoubleC' + 'ard'] >= 0x0 && 0x0 == ap) {
                        a9['default']['SetLocalIn' + 'fo'](this['UD_TASK_TI' + 'PS_DOUBLE_' + 'CARD'], 0x1),
                        this['RemoveTask' + 'Tips']();
                        let aq = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x51), 0x16, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['UP'], 0x1, 0.01, 0x6, 0x118);
                        aq['setPositio' + 'n'](0xd0, -0x50),
                        aq['name'] = this['TASK_TIPS_' + 'NAME'],
                        this['node']['addChild'](aq, 0x64),
                        this['scheduleOn' + 'ce']( () => {
                            aq && (aq['removeFrom' + 'Parent'](!0x0),
                            aq = null);
                        }
                        , 0x8);
                    } else {
                        let ar = a9['default']['GetNumberF' + 'orKey'](this['UD_TASK_TI' + 'PS_SHOW'], 0x0);
                        if (ar < 0x3 && this['m_iDoubleC' + 'ard'] < 0x0) {
                            ar++,
                            a9['default']['SetLocalIn' + 'fo'](this['UD_TASK_TI' + 'PS_SHOW'], ar),
                            this['RemoveTask' + 'Tips']();
                            let as = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x51), 0x16, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['UP'], 0x1, 0.01, 0x6, 0x118);
                            as['setPositio' + 'n'](0xd0, -0x21),
                            as['name'] = this['TASK_TIPS_' + 'NAME'],
                            this['node']['addChild'](as, 0x64),
                            this['scheduleOn' + 'ce']( () => {
                                this['RemoveTask' + 'Tips']();
                            }
                            , 0xa);
                        }
                    }
                }
            }
            ['RemoveTask' + 'Tips']() {
                let an = this['node']['getChildBy' + 'Name'](this['TASK_TIPS_' + 'NAME']);
                an && an['removeFrom' + 'Parent'](!0x0);
            }
            ['CallFuncGe' + 'tAwardAniE' + 'nd'](an) {
                a5['default']['UnLockMain' + 'Msg'](),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](ai['EJL_ANI_NM']['DMINOJL_AN' + 'I_GET_MOVE' + '_END'], this['m_iAwardNu' + 'm']);
                let ao = this['node']['getChildBy' + 'Name']('AwardAni');
                ao && this['node']['removeChil' + 'd'](ao),
                this['m_pLayerSh' + 'adow'] && (this['node']['removeChil' + 'd'](this['m_pLayerSh' + 'adow']),
                this['m_pLayerSh' + 'adow'] = null);
                let ap = a9['default']['GetNumberF' + 'orKey'](this['UD_GET_YB_' + 'TIPS_SHOW'], 0x0);
                if (ap < 0x3) {
                    ap++,
                    a9['default']['SetLocalIn' + 'fo'](this['UD_GET_YB_' + 'TIPS_SHOW'], ap);
                    let aq = af['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](aa['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x52), 0x16, cc['color'](0xf9, 0xe1, 0xae), af['ETipsDriec' + 'tType']['DOWN'], 0x1, 0.01, 0x6)
                      , ar = aj['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](0x1, 0x1);
                    aq['setPositio' + 'n'](ar['x'] + 0x64, ar['y'] - 0x50),
                    aq['name'] = 'GetYBTips',
                    this['node']['addChild'](aq, 0x64),
                    this['scheduleOn' + 'ce']( () => {
                        aq && (aq['removeFrom' + 'Parent'](!0x0),
                        aq = null);
                    }
                    , 0xa);
                }
                a6['uiManager']['CloseUIByI' + 'd'](a6['EGameUiId']['Comm_AniAw' + 'ardMoney']);
            }
            ['ShowChangL' + 'ayer']() {
                ad['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](ad['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackSh' + 'owAwardCha' + 'nge']();
            }
            ['onLoad']() {
                this['m_pNodeDen' + 'gDai'] && (this['m_pNodeDen' + 'gDai']['active'] = !0x1);
            }
            ['start']() {}
        }
        ;
        a3([al(cc['SpriteAtla' + 's']), a4('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? x : Object)], am['prototype'], 'm_pCardAtl' + 'as', void 0x0),
        a3([al(cc['SpriteAtla' + 's']), a4('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? z : Object)], am['prototype'], 'm_pWordAtl' + 'as', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (F = 'undefined' != typeof cc && cc['Node']) ? F : Object)], am['prototype'], 'm_pNodeBK', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (H = 'undefined' != typeof cc && cc['Node']) ? H : Object)], am['prototype'], 'm_pNodeBg', void 0x0),
        a3([al(cc['Label']), a4('design:typ' + 'e', 'function' == typeof (K = 'undefined' != typeof cc && cc['Label']) ? K : Object)], am['prototype'], 'm_pLabTitl' + 'e', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (Q = 'undefined' != typeof cc && cc['Node']) ? Q : Object)], am['prototype'], 'm_pNodeDen' + 'gDai', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (U = 'undefined' != typeof cc && cc['Node']) ? U : Object)], am['prototype'], 'm_pNodeDou' + 'bleBK', void 0x0),
        a3([al(cc['Sprite']), a4('design:typ' + 'e', 'function' == typeof (V = 'undefined' != typeof cc && cc['Sprite']) ? V : Object)], am['prototype'], 'm_pSprDoub' + 'leWord', void 0x0),
        a3([al(cc['Label']), a4('design:typ' + 'e', 'function' == typeof (W = 'undefined' != typeof cc && cc['Label']) ? W : Object)], am['prototype'], 'm_pLabWord', void 0x0),
        a3([al(cc['Label']), a4('design:typ' + 'e', 'function' == typeof (X = 'undefined' != typeof cc && cc['Label']) ? X : Object)], am['prototype'], 'm_pLabLeav' + 'eTime', void 0x0),
        a3([al(cc['Label']), a4('design:typ' + 'e', 'function' == typeof (Y = 'undefined' != typeof cc && cc['Label']) ? Y : Object)], am['prototype'], 'm_pSprDoub' + 'leAni', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (Z = 'undefined' != typeof cc && cc['Node']) ? Z : Object)], am['prototype'], 'm_pNodeYBI' + 'co', void 0x0),
        a3([al(cc['Node']), a4('design:typ' + 'e', 'function' == typeof (a0 = 'undefined' != typeof cc && cc['Node']) ? a0 : Object)], am['prototype'], 'm_pNodeDou' + 'bleCardAni' + 'BK', void 0x0),
        a3([al(cc['Font']), a4('design:typ' + 'e', 'function' == typeof (a1 = 'undefined' != typeof cc && cc['Font']) ? a1 : Object)], am['prototype'], 'm_pFontAwa' + 'rd', void 0x0),
        a3([al(cc['Prefab']), a4('design:typ' + 'e', 'function' == typeof (a2 = 'undefined' != typeof cc && cc['Prefab']) ? a2 : Object)], am['prototype'], 'm_pPreBgFa' + 'b', void 0x0),
        am = a3([ak], am),
        q['default'] = am,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/Hw_CommLayer/Comm_AniAwardMoney': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/HwLobbyTipsNode': void 0x0,
        '../../../../script/Common/Base/GameViewBase': void 0x0,
        '../../../../script/Common/Base/UIManager': void 0x0,
        '../../../../script/Common/Res/ResUtil': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/CommonLogic': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Configs/HW_GameTextBase': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../CardLayer/DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age',
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../PlayerInfo/DoMinoJL_PlayerInfo': 'DoMinoJL_P' + 'layerInfo'
    }],
    'DoMinoJL_PassCardVal': [function(b, c, f) {
        'use strict';
        cc['_RF']['push'](c, '6e51cWyyj5' + 'MA6WLzIfmV' + '6vp', 'DoMinoJL_P' + 'assCardVal');
        var g = this && this['__decorate'] || function(u, v, w, x) {
            var y, z = arguments['length'], A = z < 0x3 ? v : null === x ? x = Object['getOwnProp' + 'ertyDescri' + 'ptor'](v, w) : x;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                A = Reflect['decorate'](u, v, w, x);
            else
                for (var B = u['length'] - 0x1; B >= 0x0; B--)
                    (y = u[B]) && (A = (z < 0x3 ? y(A) : z > 0x3 ? y(v, w, A) : y(v, w)) || A);
            return z > 0x3 && A && Object['defineProp' + 'erty'](v, w, A),
            A;
        }
        ;
        Object['defineProp' + 'erty'](f, '__esModule', {
            'value': !0x0
        }),
        f['DominoCard' + 'ValSprDef'] = void 0x0;
        const h = b('../../../.' + './script/C' + 'ommon/Res/' + 'ResKeeper')
          , j = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , {ccclass: k, property: m} = cc['_decorator'];
        let p = class extends h['default'] {
            constructor() {
                super(...arguments),
                this['m_ptPositi' + 'on'] = cc['Vec2']['ZERO'],
                this['m_iType'] = 0x0,
                this['m_pBaseUiA' + 'tlas'] = null,
                this['m_vcCardVa' + 'lSpr'] = [];
            }
            ['InitPassCa' + 'rdVal'](u, v, w=0x0) {
                this['m_ptPositi' + 'on'] = u,
                this['m_pBaseUiA' + 'tlas'] = v,
                this['m_iType'] = w;
            }
            ['AddPassCar' + 'dVal'](u) {
                if (u < 0x0 || u > 0x6)
                    return;
                for (let x = 0x0; x < this['m_vcCardVa' + 'lSpr']['length']; x++)
                    if (this['m_vcCardVa' + 'lSpr'][x] && u == this['m_vcCardVa' + 'lSpr'][x]['cCardVal'])
                        return;
                let v = new q();
                v['cCardVal'] = u;
                let w = 'DG_game_ic' + 'on_ds_' + u;
                v['pCardValSp' + 'rite'] = j['default']['GetCompone' + 'nt'](cc['Sprite']),
                j['default']['SetSpriteF' + 'rame'](this['m_pBaseUiA' + 'tlas'], v['pCardValSp' + 'rite'], w),
                this['node']['addChild'](v['pCardValSp' + 'rite']['node']),
                this['m_vcCardVa' + 'lSpr']['push'](v),
                this['ResetAllCa' + 'rdPosition']();
            }
            ['RemoveAllC' + 'ardVal']() {
                for (let u = 0x0; u < this['m_vcCardVa' + 'lSpr']['length']; u++) {
                    let v = this['m_vcCardVa' + 'lSpr'][u];
                    v && v['pCardValSp' + 'rite'] && v['pCardValSp' + 'rite']['node']['removeFrom' + 'Parent'](!0x0),
                    v = null;
                }
                this['m_vcCardVa' + 'lSpr'] = [];
            }
            ['ResetAllCa' + 'rdPosition']() {
                let u = 0x0
                  , v = 0x0;
                -0x1 == this['m_iType'] ? v = this['m_ptPositi' + 'on']['x'] : 0x1 == this['m_iType'] ? (u = 0x1e * (this['m_vcCardVa' + 'lSpr']['length'] - 0x1) + 0x1a,
                v = this['m_ptPositi' + 'on']['x'] - u) : (u = 0x1e * (this['m_vcCardVa' + 'lSpr']['length'] - 0x1) + 0x1a,
                v = this['m_ptPositi' + 'on']['x'] - u / 0x2);
                for (let w = 0x0; w < this['m_vcCardVa' + 'lSpr']['length']; w++) {
                    let x = v + 0x1e * w + 0xd;
                    this['m_vcCardVa' + 'lSpr'][w] && this['m_vcCardVa' + 'lSpr'][w]['pCardValSp' + 'rite'] && this['m_vcCardVa' + 'lSpr'][w]['pCardValSp' + 'rite']['node']['setPositio' + 'n'](x, this['m_ptPositi' + 'on']['y']);
                }
            }
            ['start']() {}
            ['OnDestroy']() {
                this['RemoveAllC' + 'ardVal'](),
                super['OnDestroy']();
            }
        }
        ;
        p = g([k], p),
        f['default'] = p;
        class q {
            constructor() {
                this['cCardVal'] = -0x1,
                this['pCardValSp' + 'rite'] = null;
            }
        }
        f['DominoCard' + 'ValSprDef'] = q,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Res/ResKeeper': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0
    }],
    'DoMinoJL_PlayerDetailsInfo': [function(j, k, q) {
        'use strict';
        cc['_RF']['push'](k, 'fdad7MvcNd' + 'G64JiP3jo6' + 'GGy', 'DoMinoJL_P' + 'layerDetai' + 'lsInfo');
        var w, x, z, B, F, H, J, K, O, Q, R, U, V, W, X, Y, Z, a0, a1 = this && this['__decorate'] || function(ad, ae, af, ag) {
            var ah, ai = arguments['length'], aj = ai < 0x3 ? ae : null === ag ? ag = Object['getOwnProp' + 'ertyDescri' + 'ptor'](ae, af) : ag;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                aj = Reflect['decorate'](ad, ae, af, ag);
            else
                for (var ak = ad['length'] - 0x1; ak >= 0x0; ak--)
                    (ah = ad[ak]) && (aj = (ai < 0x3 ? ah(aj) : ai > 0x3 ? ah(ae, af, aj) : ah(ae, af)) || aj);
            return ai > 0x3 && aj && Object['defineProp' + 'erty'](ae, af, aj),
            aj;
        }
        , a2 = this && this['__metadata'] || function(ad, ae) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](ad, ae);
        }
        ;
        Object['defineProp' + 'erty'](q, '__esModule', {
            'value': !0x0
        });
        const a3 = j('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , a4 = j('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , a5 = j('../../../.' + './script/L' + 'ogin/UserM' + 'anager')
          , a6 = j('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/A_Tab' + 'leInfo')
          , a7 = j('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/UI/A_' + 'GameFaceUI')
          , a8 = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/DoM' + 'ino_UserIc' + 'on')
          , a9 = j('./DoMinoJL' + '_PlayerInf' + 'o')
          , {ccclass: aa, property: ab} = cc['_decorator'];
        let ac = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pSprAlta' + 's'] = null,
                this['m_pNodeBK'] = null,
                this['m_pNodeBK2'] = null,
                this['m_pPlayerI' + 'conBK'] = null,
                this['m_pNodeHea' + 'dBg'] = null,
                this['m_pNodeAdd' + 'edFriend'] = null,
                this['m_pNodeAdd' + 'ingFriend'] = null,
                this['m_pBtnAddF' + 'riend'] = null,
                this['m_pNodeMan'] = null,
                this['m_pNodeFem' + 'ale'] = null,
                this['m_pLabLeve' + 'l'] = null,
                this['m_pLabId'] = null,
                this['m_pLabName'] = null,
                this['m_pLabMone' + 'y'] = null,
                this['m_pLabCoin'] = null,
                this['m_pTxtGame' + 'Num'] = null,
                this['m_pTxtWinR' + 'ate'] = null,
                this['m_pAGameFa' + 'ceUi'] = null,
                this['m_pParentL' + 'ayer'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_iTablePo' + 's'] = -0x1,
                this['m_iUserID'] = 0x0;
            }
            ['ShowPlayer' + 'DetailsInf' + 'o'](ad, ae, af, ag=cc['Vec2']['ZERO'], ah=!0x1, ai=0xa) {
                this['node']['active'] = !0x0,
                ag['equals'](cc['Vec2']['ZERO']) && (ah ? 0x1 == af ? a6['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == a6['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0x128,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x7e) : (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af, 0x1)['x'] + 0x128,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af, 0x1)['y'] - 0x64) : 0x2 == af ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] - 0xe6,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x64) : 0x3 == af ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0x32,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0xfa) : (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0x128,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x64) : 0x1 == af ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0x9c,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x28) : 0x2 == af ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] - 0x128,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x28) : 0x3 == af ? (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0xa,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0xfa) : (ag['x'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['x'] + 0x128,
                ag['y'] = a9['DoMinoJL_P' + 'layerInfo']['GetPositio' + 'n'](af)['y'] - 0x28)),
                this['node']['setPositio' + 'n'](ag),
                this['node']['zIndex'] = ai,
                this['m_pIGameCa' + 'llBack'] = ae,
                this['m_iTablePo' + 's'] = af,
                this['m_iUserID'] = ad['m_iUserID'];
                let aj = !0x1
                  , ak = 0xa
                  , al = 0xda
                  , am = cc['size'](0x1ce, 0xfa)
                  , an = cc['size'](0x1be, 0x96);
                if (ah && (0x0,
                0x8,
                am = cc['size'](0x188, 0xac),
                an = cc['size'](0x17a, 0x96),
                this['m_pNodeBK2']['x'] = 0x7,
                a5['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iIFStartAc' + 'ti'] > 0x0 && this['m_iUserID'] == a5['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'])) {
                    let av = 0x2e;
                    am = cc['size'](0x188 + av, 0xac),
                    an = cc['size'](0x17a + av, 0x96),
                    aj = !0x0,
                    this['m_pNodeBK2']['x'] = 0x6,
                    this['node']['setPositio' + 'n'](ag['x'] + av / 0x2, ag['y']);
                }
                let ao = '';
                cc['color'](0xff, 0xe3, 0xae),
                cc['color'](0x9d, 0xe5, 0x7e),
                this['m_pNodeBK']['setContent' + 'Size'](am),
                this['m_pNodeBK2']['setContent' + 'Size'](an),
                this['m_pPlayerI' + 'conBK']['removeAllC' + 'hildren'](!0x0);
                let ap = a8['default']['GetUserIco' + 'nKuanType'](ad['m_cVip'], 0x0)
                  , aq = 0x1 == ap ? 0xa : 0x1a
                  , ar = a3['default']['GetCompone' + 'nt'](a8['default']);
                ar['InitUserIc' + 'on'](ad['m_iUserID'], ad['m_szShowUr' + 'l'], ad['m_iShowID'], cc['size'](0x70, 0x70), ap, aq, '', ad['m_iUseProp' + 'ID1'], 0x1a),
                this['m_pPlayerI' + 'conBK']['addChild'](ar['node']),
                this['m_pNodeHea' + 'dBg'] && (this['m_pNodeHea' + 'dBg']['active'] = ad['m_cVip'] <= 0x0),
                ao = ad['m_iUserID'] == a5['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iUserID'] ? 'ID:' + ad['m_iUserID'] : 'ID:' + a3['default']['HideUserID'](ad['m_iUserID']),
                this['m_pLabId']['string'] = ao,
                this['m_pLabLeve' + 'l']['string'] = Math['floor'](ad['m_fExpTime']) + '',
                console['log']('====m_fExp' + 'Time===' + ad['m_fExpTime']);
                let as = 0xaa;
                ah && (as = 0x9b),
                ad['m_cVip'] > 0x0 && (as -= 0xf),
                this['m_pLabName']['node']['x'] = this['m_pNodeMan']['x'] + 0x14,
                a3['default']['CutLabelLe' + 'n'](this['m_pLabName'], ad['m_szNickNa' + 'me'], as),
                a3['default']['AddPlayerN' + 'ameVipTag'](this['m_pLabName'], ad['m_cVip'], as),
                this['m_pLabMone' + 'y']['string'] = a3['default']['GetMonyStr' + 'ing'](ad['m_iMoney']),
                this['m_pLabCoin']['node']['parent']['active'] = aj,
                this['m_pLabCoin']['string'] = a3['default']['GetMonyStr' + 'ing'](a5['default']['GetInstanc' + 'e']()['m_pUserInf' + 'o']['iActiCoin'], 0x3);
                let at = '<color=#FF' + 'E3AE>' + a4['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xd) + '</color>';
                at += '<color=#9D' + 'E57E>\x20' + ad['m_iAllNum'] + '</color>',
                this['m_pTxtGame' + 'Num']['string'] = at,
                ao = '0%',
                ad['m_iAllNum'] > 0x0 && (ao = (0x64 * ad['m_iWinNum'] / ad['m_iAllNum'])['toFixed'](0x0) + '%');
                let au = '<color=#FF' + 'E3AE>' + a4['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xe) + '</color>';
                au += '<color=#9D' + 'E57E>\x20' + ao + '</color>',
                this['m_pTxtWinR' + 'ate']['string'] = au,
                this['m_pAGameFa' + 'ceUi']['node']['active'] = !ah,
                this['m_pNodeAdd' + 'edFriend']['active'] = !0x1,
                this['m_pNodeAdd' + 'ingFriend']['active'] = !0x1,
                this['m_pBtnAddF' + 'riend']['active'] = !0x1,
                ah || (this['m_pAGameFa' + 'ceUi']['InitGameFa' + 'ceUI'](this['m_pIGameCa' + 'llBack'], this['m_iTablePo' + 's']),
                this['m_pNodeAdd' + 'edFriend']['active'] = !0x1),
                this['m_pNodeMan'] && (this['m_pNodeMan']['active'] = 0x0 == ad['m_cSexType']),
                this['m_pNodeFem' + 'ale'] && (this['m_pNodeFem' + 'ale']['active'] = ad['m_cSexType'] > 0x0);
            }
            ['ClosePlaye' + 'rDetailsIn' + 'fo'](ad=!0x1) {
                this['CallFuncCl' + 'ose']();
            }
            ['CallFuncCl' + 'ose']() {
                this['m_pAGameFa' + 'ceUi'] && this['m_pAGameFa' + 'ceUi']['CloseTips'](),
                this['node']['active'] = !0x1;
            }
            ['OnBtnAddFr' + 'iend']() {
                if (this['m_pNodeBK']) {
                    this['m_pBtnAddF' + 'riend']['active'] = !0x1,
                    this['m_pNodeAdd' + 'ingFriend']['active'] = !0x0;
                    let ad = this['m_pNodeAdd' + 'ingFriend']['getChildBy' + 'Name']('lab_tip');
                    if (ad) {
                        let ae = ad['getCompone' + 'nt'](cc['Label']);
                        ae && (ae['string'] = a4['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x105));
                    }
                }
            }
            ['OnJLTouchS' + 'tart'](ad) {
                this['ClosePlaye' + 'rDetailsIn' + 'fo'](!0x0);
            }
            ['start']() {}
        }
        ;
        a1([ab(cc['SpriteAtla' + 's']), a2('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? w : Object)], ac['prototype'], 'm_pSprAlta' + 's', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['Node']) ? x : Object)], ac['prototype'], 'm_pNodeBK', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['Node']) ? z : Object)], ac['prototype'], 'm_pNodeBK2', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (B = 'undefined' != typeof cc && cc['Node']) ? B : Object)], ac['prototype'], 'm_pPlayerI' + 'conBK', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (F = 'undefined' != typeof cc && cc['Node']) ? F : Object)], ac['prototype'], 'm_pNodeHea' + 'dBg', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (H = 'undefined' != typeof cc && cc['Node']) ? H : Object)], ac['prototype'], 'm_pNodeAdd' + 'edFriend', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (J = 'undefined' != typeof cc && cc['Node']) ? J : Object)], ac['prototype'], 'm_pNodeAdd' + 'ingFriend', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (K = 'undefined' != typeof cc && cc['Node']) ? K : Object)], ac['prototype'], 'm_pBtnAddF' + 'riend', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (O = 'undefined' != typeof cc && cc['Node']) ? O : Object)], ac['prototype'], 'm_pNodeMan', void 0x0),
        a1([ab(cc['Node']), a2('design:typ' + 'e', 'function' == typeof (Q = 'undefined' != typeof cc && cc['Node']) ? Q : Object)], ac['prototype'], 'm_pNodeFem' + 'ale', void 0x0),
        a1([ab(cc['Label']), a2('design:typ' + 'e', 'function' == typeof (R = 'undefined' != typeof cc && cc['Label']) ? R : Object)], ac['prototype'], 'm_pLabLeve' + 'l', void 0x0),
        a1([ab(cc['Label']), a2('design:typ' + 'e', 'function' == typeof (U = 'undefined' != typeof cc && cc['Label']) ? U : Object)], ac['prototype'], 'm_pLabId', void 0x0),
        a1([ab(cc['Label']), a2('design:typ' + 'e', 'function' == typeof (V = 'undefined' != typeof cc && cc['Label']) ? V : Object)], ac['prototype'], 'm_pLabName', void 0x0),
        a1([ab(cc['Label']), a2('design:typ' + 'e', 'function' == typeof (W = 'undefined' != typeof cc && cc['Label']) ? W : Object)], ac['prototype'], 'm_pLabMone' + 'y', void 0x0),
        a1([ab(cc['Label']), a2('design:typ' + 'e', 'function' == typeof (X = 'undefined' != typeof cc && cc['Label']) ? X : Object)], ac['prototype'], 'm_pLabCoin', void 0x0),
        a1([ab(cc['RichText']), a2('design:typ' + 'e', 'function' == typeof (Y = 'undefined' != typeof cc && cc['RichText']) ? Y : Object)], ac['prototype'], 'm_pTxtGame' + 'Num', void 0x0),
        a1([ab(cc['RichText']), a2('design:typ' + 'e', 'function' == typeof (Z = 'undefined' != typeof cc && cc['RichText']) ? Z : Object)], ac['prototype'], 'm_pTxtWinR' + 'ate', void 0x0),
        a1([ab(a7['default']), a2('design:typ' + 'e', 'function' == typeof (a0 = void 0x0 !== a7['default'] && a7['default']) ? a0 : Object)], ac['prototype'], 'm_pAGameFa' + 'ceUi', void 0x0),
        ac = a1([aa], ac),
        q['default'] = ac,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../../ScriptLobby/A_GameComm/UI/A_GameFaceUI': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/DoMino_UserIcon': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../../../../script/Login/UserManager': void 0x0,
        './DoMinoJL_PlayerInfo': 'DoMinoJL_P' + 'layerInfo'
    }],
    'DoMinoJL_PlayerInfo': [function(j, k, q) {
        'use strict';
        cc['_RF']['push'](k, '34695qUL9F' + 'EnapyIh1mj' + 'ypz', 'DoMinoJL_P' + 'layerInfo');
        var v, w, x, z, B, E, F, H, J, K, O, P, Q = this && this['__decorate'] || function(a7, a8, a9, aa) {
            var ab, ac = arguments['length'], ad = ac < 0x3 ? a8 : null === aa ? aa = Object['getOwnProp' + 'ertyDescri' + 'ptor'](a8, a9) : aa;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                ad = Reflect['decorate'](a7, a8, a9, aa);
            else
                for (var ae = a7['length'] - 0x1; ae >= 0x0; ae--)
                    (ab = a7[ae]) && (ad = (ac < 0x3 ? ab(ad) : ac > 0x3 ? ab(a8, a9, ad) : ab(a8, a9)) || ad);
            return ac > 0x3 && ad && Object['defineProp' + 'erty'](a8, a9, ad),
            ad;
        }
        , R = this && this['__metadata'] || function(a7, a8) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](a7, a8);
        }
        ;
        Object['defineProp' + 'erty'](q, '__esModule', {
            'value': !0x0
        }),
        q['DoMinoJL_P' + 'layerInfo'] = void 0x0;
        const U = j('../../../.' + './script/C' + 'ommon/Res/' + 'ResPool')
          , V = j('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , W = j('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , X = j('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , Y = j('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/A_Tab' + 'leInfo')
          , Z = j('../../../.' + './ScriptLo' + 'bby/Chat/C' + 'hatData')
          , a0 = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Ani' + 'SingleSpin' + 'e')
          , a1 = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/DoM' + 'ino_UserIc' + 'on')
          , a2 = j('../DoMinoJ' + 'L_Define')
          , a3 = j('../GameUI/' + 'DoMinoJL_P' + 'assCardVal')
          , {ccclass: a4, property: a5} = cc['_decorator'];
        let a6 = v = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pUiBaseA' + 'tlas'] = null,
                this['m_pSpriteB' + 'G'] = null,
                this['m_pSprMone' + 'yBK'] = null,
                this['m_pSprYBBK'] = null,
                this['m_pLableNa' + 'me'] = null,
                this['m_pLableMo' + 'ney'] = null,
                this['m_pLableYB'] = null,
                this['m_pTimeFon' + 't'] = null,
                this['m_pAddFont'] = null,
                this['m_pLessFon' + 't'] = null,
                this['m_pProgres' + 'sTimer'] = null,
                this['m_iTablePo' + 's'] = 0x0,
                this['m_iIFMyRea' + 'l'] = 0x0,
                this['m_iServerT' + 'ablePos'] = 0x0,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_pPlayerI' + 'co'] = null,
                this['m_pSprTabl' + 'eBank'] = null,
                this['m_pSprRead' + 'y'] = null,
                this['m_pSprTuoG' + 'uan'] = null,
                this['m_pSprCard' + 'Back'] = null,
                this['m_pLabelEx' + 'CardNum'] = null,
                this['m_iSendCar' + 'dTime'] = 0x0,
                this['m_pSendCar' + 'dTimeNum'] = null,
                this['m_pAddMone' + 'yNum'] = null,
                this['m_pPassCar' + 'dVal'] = null,
                this['m_pSprGame' + 'EndAuto'] = null,
                this['m_iNextTim' + 'e'] = 0x0,
                this['m_pNextTim' + 'eNum'] = null,
                this['m_pSprNext' + 'TimeBK'] = null,
                this['m_pSprBank' + 'rupt'] = null,
                this['m_pAddYBNu' + 'm'] = null,
                this['m_iProgree' + 'ToTalTime'] = 0x0,
                this['m_iProgree' + 'CurrTime'] = 0x0,
                this['m_bIsMovin' + 'g'] = !0x1,
                this['m_iUserID'] = 0x0,
                this['m_iVip'] = 0x0;
            }
            static['GetPositio' + 'n'](a7, a8=0x0) {
                let a9 = cc['Vec2']['ZERO']
                  , aa = 0x0
                  , ab = 0x0;
                0x0 == a7 ? (aa = -0x21c,
                ab = 0x22) : 0x1 == a7 ? (aa = 0x0,
                ab = -0xde) : 0x2 == a7 ? (aa = 0x21c,
                ab = 0x22) : 0x3 == a7 && (aa = 0x0,
                ab = 0x118),
                a8 > 0x0 && 0x1 == a7 && (aa = -0x21c,
                ab = -0xde);
                let ac = cc['winSize'];
                return 0x0 == aa && 0x0 == ab || (a9['x'] = 0.5 * ac['width'] + aa,
                a9['y'] = 0.5 * ac['height'] + ab),
                0x2 == a8 && (0x0 == a7 || 0x1 == a7 ? (a9['x'] = a9['x'] + 0x4c,
                a9['y'] = a9['y'] - 0x14) : (a9['x'] = a9['x'] - 0x4c,
                a9['y'] = a9['y'] - 0x14)),
                a9['x'] = a9['x'] - 0.5 * ac['width'],
                a9['y'] = a9['y'] - 0.5 * ac['height'],
                a9;
            }
            ['GetAddFont']() {
                return this['m_pAddFont'];
            }
            ['InitPlayer' + 'Info'](a7, a8, a9) {
                this['m_iTablePo' + 's'] = a7,
                this['m_iIFMyRea' + 'l'] = a8,
                this['m_pIGameCa' + 'llBack'] = a9;
            }
            ['SetPlayerI' + 'nfo'](a7) {
                if (null != a7) {
                    if (this['m_iUserID'] = a7['m_iUserID'],
                    this['m_iVip'] = a7['m_cVip'],
                    this['m_pSprYBBK'] && (this['m_pSprYBBK']['node']['active'] = !0x1),
                    this['m_iServerT' + 'ablePos'] = a7['m_iServerT' + 'ablePos'],
                    null == this['m_pPlayerI' + 'co']) {
                        let a8 = a1['default']['GetUserIco' + 'nKuanType'](a7['m_cVip'], 0x1)
                          , a9 = 0x1 == a8 ? 0xc : 0x14;
                        this['m_pPlayerI' + 'co'] = V['default']['GetCompone' + 'nt'](a1['default']),
                        this['m_pPlayerI' + 'co']['InitUserIc' + 'on'](a7['m_iUserID'], a7['m_szShowUr' + 'l'], a7['m_iShowID'], cc['size'](0x70, 0x70), a8, a9, '', a7['m_iUseProp' + 'ID1'], 0x1c),
                        this['node']['addChild'](this['m_pPlayerI' + 'co']['node']),
                        this['m_pPlayerI' + 'co']['SetUserIco' + 'nAni'](a7['m_iUseProp' + 'ID2'], 0.8, 0x6, new cc['Vec2'](-0x120,-0xa8));
                    }
                    a7['m_iMoney'] > 0x0 ? this['m_pLableMo' + 'ney'] && (this['m_pLableMo' + 'ney']['string'] = V['default']['GetMonyStr' + 'ing'](a7['m_iMoney'])) : this['m_pLableMo' + 'ney'] && (this['m_pLableMo' + 'ney']['string'] = '0'),
                    this['m_pLableNa' + 'me'] && (this['m_pLableNa' + 'me']['node']['zIndex'] = 0x1),
                    V['default']['CutLabelLe' + 'n'](this['m_pLableNa' + 'me'], a7['m_szNickNa' + 'me'], 0x82),
                    V['default']['AddPlayerN' + 'ameVipTag'](this['m_pLableNa' + 'me'], a7['m_cVip'], 0x55),
                    this['m_pLableYB'] && (this['m_pLableYB']['string'] = a7['m_iYBNum'] + ''),
                    0x1 == this['m_iTablePo' + 's'] && 0x1 == this['m_iIFMyRea' + 'l'] && (this['m_pSprYBBK']['node']['active'] = !0x0),
                    a7['m_cIfReady'] && Y['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != Y['EA_GAME_ST' + 'ATE']['A_GAME_WAT' + 'CH'] && Y['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != Y['EA_GAME_ST' + 'ATE']['A_GAME_GET' + 'UP'] && this['ShowReady'](),
                    (a7['m_cIfTuoGu' + 'an'] > 0x0 || a7['m_cIfDis'] > 0x0) && this['ShowTuoGua' + 'n'](0x1),
                    a7['m_cShowNex' + 'tTime'] > 0x0 && this['SetResNext' + 'Time'](a7['m_cShowNex' + 'tTime']),
                    this['m_pSpriteB' + 'G']['node']['zIndex'] = 0x1,
                    this['node']['active'] = !0x0,
                    this['m_bIsMovin' + 'g'] || this['node']['setPositio' + 'n'](v['GetPositio' + 'n'](this['m_iTablePo' + 's'], this['m_iIFMyRea' + 'l']));
                }
            }
            ['UpdateMone' + 'y'](a7, a8=0x0) {
                if (this['m_pLableMo' + 'ney'] && (a7 < 0x0 && (a7 = 0x0),
                this['m_pLableMo' + 'ney']['string'] = V['default']['GetMonyStr' + 'ing'](a7)),
                0x0 != a8) {
                    this['m_pAddMone' + 'yNum'] && this['m_pAddMone' + 'yNum']['node']['active'] && (this['m_pAddMone' + 'yNum']['node']['stopAllAct' + 'ions'](),
                    this['node']['removeChil' + 'd'](this['m_pAddMone' + 'yNum']['node'], !0x0),
                    this['m_pAddMone' + 'yNum'] = null);
                    let a9 = 1.5;
                    this['m_pAddMone' + 'yNum'] = V['default']['GetLabel']('', 0x28),
                    this['m_pAddMone' + 'yNum']['string'] = V['default']['GetMonyStr' + 'ing'](a8, 0x0, !0x0),
                    this['m_pAddMone' + 'yNum']['font'] = a8 > 0x0 ? this['m_pAddFont'] : this['m_pLessFon' + 't'],
                    this['m_pAddMone' + 'yNum']['node']['position'] = new cc['Vec3'](0x0,-0x3c),
                    this['node']['addChild'](this['m_pAddMone' + 'yNum']['node'], 0x2),
                    this['m_pAddMone' + 'yNum']['node']['scale'] = 0.9,
                    this['m_pAddMone' + 'yNum']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.1 * a9), cc['moveBy'](0.8 * a9, new cc['Vec2'](0x0,0x64)), cc['fadeOut'](0.1 * a9), cc['callFunc'](this['CallFuncAd' + 'dMoneyAniE' + 'nd'], this)));
                }
            }
            ['CallFuncAd' + 'dMoneyAniE' + 'nd']() {
                this['m_pAddMone' + 'yNum'] && this['m_pAddMone' + 'yNum']['node']['active'] && (this['m_pAddMone' + 'yNum']['node']['stopAllAct' + 'ions'](),
                this['node']['removeChil' + 'd'](this['m_pAddMone' + 'yNum']['node'], !0x0),
                this['m_pAddMone' + 'yNum'] = null);
            }
            ['UpdateYB'](a7, a8=0x0) {
                if (this['m_pLableYB'] && (this['m_pLableYB']['string'] = a7 + ''),
                0x0 != a8) {
                    this['m_pAddYBNu' + 'm'] && (this['m_pAddYBNu' + 'm']['node']['stopAllAct' + 'ions'](),
                    this['node']['removeChil' + 'd'](this['m_pAddYBNu' + 'm']['node'], !0x0),
                    this['m_pAddYBNu' + 'm'] = null),
                    this['m_pAddYBNu' + 'm'] = V['default']['GetLabel']('', 0x28);
                    let a9 = 0x1;
                    this['m_pAddYBNu' + 'm']['string'] = V['default']['GetMonyStr' + 'ing'](a8, 0x0, !0x0),
                    this['m_pAddYBNu' + 'm']['font'] = a8 > 0x0 ? this['m_pAddFont'] : this['m_pLessFon' + 't'],
                    this['m_pAddYBNu' + 'm']['node']['position'] = cc['v3'](0x84, -0x78),
                    this['m_pAddYBNu' + 'm']['node']['scale'] = 0.7,
                    this['node']['addChild'](this['m_pAddYBNu' + 'm']['node']),
                    this['m_pAddYBNu' + 'm']['node']['opacity'] = 0x0,
                    this['m_pAddYBNu' + 'm']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.1 * a9), cc['moveBy'](0.8 * a9, 0x0, 0x1e)['easing'](cc['easeSineOu' + 't']()), cc['fadeOut'](0.1 * a9), cc['callFunc'](this['CallFuncAd' + 'dYBAniEnd'], this)));
                }
            }
            ['CallFuncAd' + 'dYBAniEnd']() {
                this['m_pAddYBNu' + 'm'] && (this['m_pAddYBNu' + 'm']['node']['stopAllAct' + 'ions'](),
                this['node']['removeChil' + 'd'](this['m_pAddYBNu' + 'm']['node'], !0x0),
                this['m_pAddYBNu' + 'm'] = null);
            }
            ['ShowTableB' + 'ank']() {
                if (null == this['m_pSprTabl' + 'eBank']) {
                    let a7 = new cc['Node']();
                    this['m_pSprTabl' + 'eBank'] = a7['addCompone' + 'nt'](cc['Sprite']),
                    V['default']['SetSpriteF' + 'rame'](this['m_pUiBaseA' + 'tlas'], this['m_pSprTabl' + 'eBank'], 'DG_game_ic' + 'on_zhuang'),
                    this['node']['addChild'](this['m_pSprTabl' + 'eBank']['node']);
                    let a8 = 0x0
                      , a9 = 0x0;
                    0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? (a8 = 0x4e,
                    a9 = 0x28) : 0x3 == this['m_iTablePo' + 's'] ? (a8 = -0x52,
                    a9 = 0x22) : (a8 = -0x4e,
                    a9 = 0x28),
                    this['m_pSprTabl' + 'eBank']['node']['position'] = new cc['Vec3'](a8,a9);
                }
            }
            ['ShowReady'](a7=!0x0) {
                if (a7) {
                    if (null == this['m_pSprRead' + 'y']) {
                        let a8 = new cc['Node']();
                        this['m_pSprRead' + 'y'] = a8['addCompone' + 'nt'](cc['Sprite']),
                        V['default']['SetSpriteF' + 'rame'](this['m_pUiBaseA' + 'tlas'], this['m_pSprRead' + 'y'], 'DG_game_ic' + 'on_ready'),
                        this['node']['addChild'](a8, 0x1),
                        0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? this['m_pSprRead' + 'y']['node']['position'] = new cc['Vec3'](0x4c,0x26) : this['m_pSprRead' + 'y']['node']['position'] = new cc['Vec3'](-0x4c,0x26);
                    }
                } else
                    this['m_pSprRead' + 'y'] && (this['node']['removeChil' + 'd'](this['m_pSprRead' + 'y']['node'], !0x0),
                    this['m_pSprRead' + 'y'] = null);
            }
            ['ShowTuoGua' + 'n'](a7=0x1) {
                if (a7 > 0x0) {
                    if (null == this['m_pSprTuoG' + 'uan']) {
                        this['ShowWatch'](!0x0);
                        let a8 = V['default']['GetCompone' + 'nt'](a0['default']);
                        this['m_pSprTuoG' + 'uan'] = a8['node'],
                        this['node']['addChild'](this['m_pSprTuoG' + 'uan'], 0x1),
                        a8['SetLoop'](!0x0),
                        a8['Init'](a0['ESpineName']['EFF_SPINE_' + 'YDDMN_JQRT' + 'G'], -0x1, 'animation'),
                        a8['node']['setPositio' + 'n'](0x0, -0x1e),
                        a8['node']['scale'] = 0.56;
                    }
                } else
                    this['m_pSprTuoG' + 'uan'] && (this['ShowWatch'](!0x1),
                    this['node']['removeChil' + 'd'](this['m_pSprTuoG' + 'uan'], !0x0),
                    this['m_pSprTuoG' + 'uan'] = null);
            }
            ['ShowWatch'](a7) {
                this['m_pPlayerI' + 'co'] && this['m_pPlayerI' + 'co']['SetUserIco' + 'nMask'](a7);
            }
            ['UpdateCard' + 'Num'](a7) {
                if (!(0x1 == this['m_iTablePo' + 's'] && Y['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == Y['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] || a7 <= 0x0 && null == this['m_pSprCard' + 'Back'])) {
                    if (null == this['m_pSprCard' + 'Back']) {
                        let a8 = new cc['Node']();
                        this['m_pSprCard' + 'Back'] = a8['addCompone' + 'nt'](cc['Sprite']),
                        V['default']['SetSpriteF' + 'rame'](this['m_pUiBaseA' + 'tlas'], this['m_pSprCard' + 'Back'], 'DG_game_ic' + 'on_sp_bg'),
                        this['node']['addChild'](this['m_pSprCard' + 'Back']['node']),
                        0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? a8['setPositio' + 'n'](0x50, -0x14) : 0x3 == this['m_iTablePo' + 's'] ? a8['setPositio' + 'n'](-0x52, -0x16) : a8['setPositio' + 'n'](-0x50, -0x14);
                    }
                    if (null == this['m_pLabelEx' + 'CardNum']) {
                        let a9 = new cc['Node']();
                        this['m_pLabelEx' + 'CardNum'] = a9['addCompone' + 'nt'](cc['Label']),
                        this['m_pLabelEx' + 'CardNum']['fontSize'] = 0x14,
                        this['m_pLabelEx' + 'CardNum']['font'] = this['m_pTimeFon' + 't'],
                        a9['setPositio' + 'n'](0x0, 0.15 * -this['m_pSprCard' + 'Back']['node']['getContent' + 'Size']()['height']),
                        this['m_pSprCard' + 'Back']['node']['addChild'](a9);
                    }
                    this['m_pLabelEx' + 'CardNum']['string'] = a7 + '';
                }
            }
            ['ShowGameEn' + 'dAuto'](a7) {
                if (a7 > 0x0) {
                    let a8 = 'DG_game_ic' + 'on_zt_zq';
                    if (0x1 == a7 ? a8 = 'DG_game_ic' + 'on_zt_fh' : 0x2 == a7 && (a8 = 'DG_game_ic' + 'on_zt_hz'),
                    null == this['m_pSprGame' + 'EndAuto']) {
                        let a9 = new cc['Node']();
                        this['m_pSprGame' + 'EndAuto'] = a9['addCompone' + 'nt'](cc['Sprite']),
                        V['default']['SetSpriteF' + 'rame'](this['m_pUiBaseA' + 'tlas'], this['m_pSprGame' + 'EndAuto'], a8),
                        this['m_pSprGame' + 'EndAuto']['node']['position'] = new cc['Vec3'](0x54,-0x24),
                        this['node']['addChild'](this['m_pSprGame' + 'EndAuto']['node']);
                    } else
                        V['default']['SetSpriteF' + 'rame'](this['m_pUiBaseA' + 'tlas'], this['m_pSprGame' + 'EndAuto'], a8);
                } else
                    this['m_pSprGame' + 'EndAuto'] && (this['node']['removeChil' + 'd'](this['m_pSprGame' + 'EndAuto']['node'], !0x0),
                    this['m_pSprGame' + 'EndAuto'] = null);
            }
            ['ShowBankru' + 'pt'](a7=!0x0) {
                if (a7) {
                    if (null == this['m_pSprBank' + 'rupt']) {
                        let a8 = U['ResPool']['GetInstanc' + 'e']()['GetResAsse' + 'ts'](W['CFilePaths']['DG_DMN_JL_' + 'WORD']);
                        this['m_pSprBank' + 'rupt'] = V['default']['GetCompone' + 'nt'](cc['Sprite']),
                        V['default']['SetSpriteF' + 'rame'](a8, this['m_pSprBank' + 'rupt'], 'DG_result_' + 'icon_pc'),
                        this['node']['addChild'](this['m_pSprBank' + 'rupt']['node']),
                        this['m_pSprBank' + 'rupt']['node']['stopAllAct' + 'ions'](),
                        this['m_pSprBank' + 'rupt']['node']['opacity'] = 0x0,
                        this['m_pSprBank' + 'rupt']['node']['scale'] = 0x3,
                        this['m_pSprBank' + 'rupt']['node']['runAction'](cc['sequence'](cc['delayTime'](0.1), cc['spawn'](cc['fadeIn'](0.1), cc['scaleTo'](0.15, 1.2))));
                    }
                } else
                    this['m_pSprBank' + 'rupt'] && (this['m_pSprBank' + 'rupt']['node']['stopAllAct' + 'ions'](),
                    this['node']['removeChil' + 'd'](this['m_pSprBank' + 'rupt']['node'], !0x0),
                    this['m_pSprBank' + 'rupt'] = null);
            }
            ['ResetPlaye' + 'rInfo']() {
                this['m_pSprTabl' + 'eBank'] && (this['node']['removeChil' + 'd'](this['m_pSprTabl' + 'eBank']['node'], !0x0),
                this['m_pSprTabl' + 'eBank'] = null),
                this['m_pSprRead' + 'y'] && (this['node']['removeChil' + 'd'](this['m_pSprRead' + 'y']['node'], !0x0),
                this['m_pSprRead' + 'y'] = null),
                this['m_pSprCard' + 'Back'] && (this['node']['removeChil' + 'd'](this['m_pSprCard' + 'Back']['node'], !0x0),
                this['m_pSprCard' + 'Back'] = null,
                this['m_pLabelEx' + 'CardNum'] = null),
                this['m_pAddMone' + 'yNum'] && (this['m_pAddMone' + 'yNum']['node']['stopAllAct' + 'ions'](),
                this['node']['removeChil' + 'd'](this['m_pAddMone' + 'yNum']['node'], !0x0),
                this['m_pAddMone' + 'yNum'] = null),
                this['ShowWatch'](!0x1),
                this['m_pPassCar' + 'dVal'] && (this['node']['removeChil' + 'd'](this['m_pPassCar' + 'dVal']['node'], !0x0),
                this['m_pPassCar' + 'dVal'] = null),
                this['m_pSprGame' + 'EndAuto'] && (this['node']['removeChil' + 'd'](this['m_pSprGame' + 'EndAuto']['node'], !0x0),
                this['m_pSprGame' + 'EndAuto'] = null),
                this['ShowTuoGua' + 'n'](0x0),
                this['ShowBankru' + 'pt'](!0x1),
                this['m_bIsMovin' + 'g'] = !0x1;
            }
            ['SetSendCar' + 'dTime'](a7, a8=0x0) {
                this['m_iSendCar' + 'dTime'] = a7,
                this['m_iProgree' + 'ToTalTime'] = a7,
                this['m_iProgree' + 'CurrTime'] = a7,
                null != this['m_pSendCar' + 'dTimeNum'] && (this['node']['removeChil' + 'd'](this['m_pSendCar' + 'dTimeNum']['node'], !0x0),
                this['m_pSendCar' + 'dTimeNum'] = null),
                this['m_iSendCar' + 'dTime'] > 0x0 ? a8 > 0.005 ? this['scheduleOn' + 'ce'](this['OnTuoGuanT' + 'ime'], a8) : (this['m_pProgres' + 'sTimer'] && (this['m_pProgres' + 'sTimer']['progress'] = 0x1,
                this['unschedule'](this['OnProgreeT' + 'imer']),
                this['m_pProgres' + 'sTimer']['node']['active'] = !0x0,
                this['schedule'](this['OnProgreeT' + 'imer'], 0.1),
                this['m_pProgres' + 'sTimer']['node']['zIndex'] = 0x2),
                this['m_pSendCar' + 'dTimeNum'] = V['default']['GetLabel'](this['m_iSendCar' + 'dTime'] + '', 0x28, cc['Color']['WHITE'], this['m_pTimeFon' + 't']),
                this['node']['addChild'](this['m_pSendCar' + 'dTimeNum']['node'], 0x3),
                this['m_pSendCar' + 'dTimeNum']['node']['stopAllAct' + 'ions'](),
                this['m_pSendCar' + 'dTimeNum']['node']['opacity'] = 0x0,
                this['m_pSendCar' + 'dTimeNum']['node']['scale'] = 1.2,
                this['m_pSendCar' + 'dTimeNum']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.02), cc['scaleTo'](0.05, 1.28), cc['scaleTo'](0.05, 1.2), cc['delayTime'](0.85), cc['fadeOut'](0.03))),
                this['unschedule'](this['OnDownTime']),
                this['schedule'](this['OnDownTime'], 0x1)) : (this['unschedule'](this['OnDownTime']),
                this['unschedule'](this['OnProgreeT' + 'imer']),
                this['m_pProgres' + 'sTimer'] && (this['m_pProgres' + 'sTimer']['node']['active'] = !0x1));
            }
            ['OnTuoGuanT' + 'ime'](a7) {
                this['unschedule'](this['OnTuoGuanT' + 'ime']),
                this['m_pIGameCa' + 'llBack'] && 0x1 == this['m_iTablePo' + 's'] && this['m_pIGameCa' + 'llBack']['CallBackAu' + 'toSendCard']();
            }
            ['ClearDownT' + 'ime']() {
                this['unschedule'](this['OnDownTime']),
                this['unschedule'](this['OnProgreeT' + 'imer']),
                this['m_pProgres' + 'sTimer'] && (this['m_pProgres' + 'sTimer']['node']['active'] = !0x1),
                this['m_iSendCar' + 'dTime'] = 0x0,
                this['m_pSendCar' + 'dTimeNum'] && (this['m_pSendCar' + 'dTimeNum']['string'] = '');
            }
            ['OnDownTime'](a7) {
                if (this['m_iSendCar' + 'dTime']--,
                this['m_iSendCar' + 'dTime'] <= 0x0) {
                    if (this['unschedule'](this['OnDownTime']),
                    this['unschedule'](this['OnProgreeT' + 'imer']),
                    this['m_pProgres' + 'sTimer'] && (this['m_pProgres' + 'sTimer']['node']['active'] = !0x1),
                    this['m_pSendCar' + 'dTimeNum']) {
                        this['m_pSendCar' + 'dTimeNum']['string'] = this['m_iSendCar' + 'dTime'] + '',
                        this['m_pSendCar' + 'dTimeNum']['node']['stopAllAct' + 'ions'](),
                        this['m_pSendCar' + 'dTimeNum']['node']['opacity'] = 0xff,
                        this['m_pSendCar' + 'dTimeNum']['node']['setScale'](1.5);
                        let a8 = cc['repeatFore' + 'ver'](cc['sequence'](cc['rotateTo'](0x2 / 0x1e, 0xf), cc['rotateTo'](0x2 / 0x1e, -0xf), cc['rotateTo'](0x2 / 0x1e, 0xf), cc['rotateTo'](0x2 / 0x1e, -0xf), cc['rotateTo'](0x2 / 0x1e, 0xf), cc['rotateTo'](0x2 / 0x1e, 0x0), cc['delayTime'](0x1)));
                        this['m_pSendCar' + 'dTimeNum']['node']['runAction'](a8);
                    }
                    this['m_pIGameCa' + 'llBack'] && 0x1 == this['m_iTablePo' + 's'] && (this['m_pIGameCa' + 'llBack']['CallBackAu' + 'toSendCard'](),
                    this['m_pIGameCa' + 'llBack']['CallBackSe' + 'tTuoGuan'](0x1));
                } else
                    this['m_pSendCar' + 'dTimeNum'] && (this['m_pSendCar' + 'dTimeNum']['string'] = this['m_iSendCar' + 'dTime'] + '',
                    this['m_pSendCar' + 'dTimeNum']['node']['stopAllAct' + 'ions'](),
                    this['m_pSendCar' + 'dTimeNum']['node']['opacity'] = 0x0,
                    this['m_pSendCar' + 'dTimeNum']['node']['setScale'](1.2),
                    this['m_pSendCar' + 'dTimeNum']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.02), cc['scaleTo'](0.05, 1.28), cc['scaleTo'](0.05, 1.2), cc['delayTime'](0.85), cc['fadeOut'](0.03)))),
                    this['m_iSendCar' + 'dTime'] <= 0x4 && 0x1 == this['m_iTablePo' + 's'] && Y['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == Y['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'] && X['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](X['EJLSoundId']['TIME_OUT']);
            }
            ['OnProgreeT' + 'imer'](a7) {
                if (this['m_pProgres' + 'sTimer'])
                    if (this['m_iProgree' + 'CurrTime'] -= 0.1,
                    this['m_iProgree' + 'CurrTime'] <= 0x0 || this['m_iProgree' + 'ToTalTime'] <= 0x0)
                        this['unschedule'](this['OnProgreeT' + 'imer']),
                        this['m_pProgres' + 'sTimer']['node']['active'] = !0x1;
                    else {
                        this['m_pProgres' + 'sTimer']['node']['active'] = !0x0;
                        let a8 = this['m_iProgree' + 'CurrTime'] / this['m_iProgree' + 'ToTalTime'];
                        this['m_pProgres' + 'sTimer']['progress'] = a8;
                    }
            }
            ['SetResNext' + 'Time'](a7) {
                if (!(a7 > 0x0 && this['m_iNextTim' + 'e'] > 0x0))
                    if (this['m_iNextTim' + 'e'] = a7,
                    this['ShowWatch'](!0x1),
                    null != this['m_pNextTim' + 'eNum'] && (this['node']['removeChil' + 'd'](this['m_pNextTim' + 'eNum']['node'], !0x0),
                    this['m_pNextTim' + 'eNum'] = null),
                    this['m_iNextTim' + 'e'] > 0x0) {
                        this['ShowWatch'](!0x0);
                        let a8 = new cc['Node']();
                        this['m_pNextTim' + 'eNum'] = a8['addCompone' + 'nt'](cc['Label']),
                        this['m_pNextTim' + 'eNum']['font'] = this['m_pTimeFon' + 't'],
                        this['m_pNextTim' + 'eNum']['string'] = this['m_iNextTim' + 'e'] + '',
                        this['node']['addChild'](this['m_pNextTim' + 'eNum']['node']),
                        this['m_pNextTim' + 'eNum']['node']['stopAllAct' + 'ions'](),
                        this['m_pNextTim' + 'eNum']['node']['opacity'] = 0x0,
                        this['m_pNextTim' + 'eNum']['node']['scale'] = 0x1,
                        this['m_pNextTim' + 'eNum']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.02), cc['scaleTo'](0.05, 1.18), cc['scaleTo'](0.05, 1.1), cc['delayTime'](0.85), cc['fadeOut'](0.03))),
                        this['unschedule'](this['OnNextDown' + 'Time']),
                        this['schedule'](this['OnNextDown' + 'Time'], 0x1);
                    } else
                        this['unschedule'](this['OnNextDown' + 'Time']);
            }
            ['OnNextDown' + 'Time'](a7) {
                this['m_iNextTim' + 'e']--,
                this['m_iNextTim' + 'e'] <= 0x0 ? (this['unschedule'](this['OnNextDown' + 'Time']),
                this['ShowWatch'](!0x1),
                null != this['m_pNextTim' + 'eNum'] && (this['node']['removeChil' + 'd'](this['m_pNextTim' + 'eNum']['node'], !0x0),
                this['m_pNextTim' + 'eNum'] = null)) : this['m_pNextTim' + 'eNum'] && (this['m_pNextTim' + 'eNum']['string'] = this['m_iNextTim' + 'e'] + '',
                this['m_pNextTim' + 'eNum']['node']['stopAllAct' + 'ions'](),
                this['m_pNextTim' + 'eNum']['node']['opacity'] = 0x0,
                this['m_pNextTim' + 'eNum']['node']['setScale'](0x1),
                this['m_pNextTim' + 'eNum']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.02), cc['scaleTo'](0.05, 1.18), cc['scaleTo'](0.05, 1.1), cc['delayTime'](0.85), cc['fadeOut'](0.03))));
            }
            ['ResetPosit' + 'ion']() {
                if (this['m_pSprTabl' + 'eBank'] && (0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? this['m_pSprTabl' + 'eBank']['node']['position'] = new cc['Vec3'](0x4e,0x28) : 0x3 == this['m_iTablePo' + 's'] ? this['m_pSprTabl' + 'eBank']['node']['position'] = new cc['Vec3'](-0x52,0x22) : this['m_pSprTabl' + 'eBank']['node']['position'] = new cc['Vec3'](-0x4e,0x28)),
                this['m_pSprRead' + 'y'] && (0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? this['m_pSprRead' + 'y']['node']['position'] = new cc['Vec3'](0x4c,0x26) : this['m_pSprRead' + 'y']['node']['position'] = new cc['Vec3'](-0x4c,0x26)),
                this['m_pSprCard' + 'Back'] && (0x0 == this['m_iTablePo' + 's'] || 0x1 == this['m_iTablePo' + 's'] ? this['m_pSprCard' + 'Back']['node']['position'] = new cc['Vec3'](0x50,-0x14) : 0x3 == this['m_iTablePo' + 's'] ? this['m_pSprCard' + 'Back']['node']['position'] = new cc['Vec3'](-0x52,-0x16) : this['m_pSprCard' + 'Back']['node']['position'] = new cc['Vec3'](-0x50,-0x14)),
                this['m_pLableNa' + 'me'] && (0x3 == this['m_iTablePo' + 's'] ? this['m_pLableNa' + 'me']['node']['position'] = new cc['Vec3'](0x8a,0x4) : this['m_pLableNa' + 'me']['node']['position'] = new cc['Vec3'](0x0,-0x4e),
                V['default']['AddPlayerN' + 'ameVipTag'](this['m_pLableNa' + 'me'], this['m_iVip'], 0x55)),
                this['m_pSprMone' + 'yBK'] && (0x3 == this['m_iTablePo' + 's'] ? this['m_pSprMone' + 'yBK']['node']['position'] = new cc['Vec3'](0x8a,-0x22) : this['m_pSprMone' + 'yBK']['node']['position'] = new cc['Vec3'](0x0,-0x6e)),
                this['m_pPassCar' + 'dVal']) {
                    let a7 = cc['Vec2']['ZERO']
                      , a8 = 0x0;
                    0x3 == this['m_iTablePo' + 's'] ? (a8 = -0x1,
                    a7['x'] = 0x4e,
                    a7['y'] = 0x22) : (a7['x'] = 0x0,
                    a7['y'] = 0x4e),
                    this['m_pPassCar' + 'dVal']['InitPassCa' + 'rdVal'](a7, this['m_pUiBaseA' + 'tlas'], a8),
                    this['m_pPassCar' + 'dVal']['ResetAllCa' + 'rdPosition']();
                }
            }
            ['PlayMoveAn' + 'i'](a7, a8) {
                this['m_pLableNa' + 'me'] && this['m_pLableNa' + 'me']['node'] && (this['m_pLableNa' + 'me']['node']['active'] = !0x1),
                this['m_pSprMone' + 'yBK'] && this['m_pSprMone' + 'yBK']['node'] && (this['m_pSprMone' + 'yBK']['node']['active'] = !0x1);
                let a9 = this['node']['getPositio' + 'n']();
                this['m_bIsMovin' + 'g'] = !0x0;
                let aa = []
                  , ab = [];
                if (0x3e7 != a7) {
                    if (console['log']('===ptEnd==' + '==' + this['node']['getPositio' + 'n']()),
                    a8) {
                        if (a7 < this['m_iTablePo' + 's'])
                            for (let ac = this['m_iTablePo' + 's'] - 0x1; ac >= a7; --ac)
                                ab['push'](v['GetPositio' + 'n'](ac));
                        else {
                            for (let ad = this['m_iTablePo' + 's'] - 0x1; ad >= 0x0; --ad)
                                ab['push'](v['GetPositio' + 'n'](ad));
                            for (let ae = a2['EJL_Define']['MAX_PLAYER' + '_NUM'] - 0x1; ae >= a7; --ae)
                                ab['push'](v['GetPositio' + 'n'](ae));
                        }
                        0x1 == a7 && ab['push'](v['GetPositio' + 'n'](0x1, 0x1));
                    } else {
                        if (a7 > this['m_iTablePo' + 's'])
                            for (let af = this['m_iTablePo' + 's'] + 0x1; af <= a7; af++)
                                ab['push'](v['GetPositio' + 'n'](af));
                        else {
                            for (let ag = this['m_iTablePo' + 's'] + 0x1; ag <= a2['EJL_Define']['MAX_PLAYER' + '_NUM'] - 0x1; ag++)
                                ab['push'](v['GetPositio' + 'n'](ag));
                            for (let ah = 0x0; ah <= a7; ah++)
                                ab['push'](v['GetPositio' + 'n'](ah));
                        }
                        0x0 == this['m_iTablePo' + 's'] && ab['length'] > 0x0 && (ab[ab['length'] - 0x1] = v['GetPositio' + 'n'](0x1, 0x1));
                    }
                    if (this['m_iTablePo' + 's'] = a7,
                    ab['length'] > 0x0) {
                        let ai = []
                          , aj = 0x0
                          , ak = 0.5;
                        ai['push'](V['default']['GetTwoPosL' + 'en'](ab[0x0], a9));
                        for (let al = 0x1; al < ab['length']; al++)
                            ai['push'](V['default']['GetTwoPosL' + 'en'](ab[al], ab[al - 0x1]));
                        for (let am = 0x0; am < ai['length']; am++)
                            aj += ai[am];
                        ak = 0.0005 * aj;
                        for (let an = 0x0; an < ai['length']; an++) {
                            let ao = cc['moveTo'](ak * ai[an] / aj, ab[an]['x'], ab[an]['y']);
                            aa['push'](ao);
                        }
                        aa['push'](cc['callFunc'](this['CallFuncMo' + 'veAniEnd'], this)),
                        this['node']['stopAllAct' + 'ions'](),
                        this['node']['runAction'](cc['sequence'](aa)),
                        this['m_pIGameCa' + 'llBack'] && 0x1 == this['m_iTablePo' + 's'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](a2['EJL_ANI_NM']['DMINOJL_AN' + 'I_HEAD_MOV' + 'E'], 0x0);
                    }
                } else {
                    this['m_iIFMyRea' + 'l'] = 0x1;
                    let ap = v['GetPositio' + 'n'](0x1, 0x1);
                    {
                        let aq = cc['moveTo'](0.3, ap['x'], ap['y']);
                        aa['push'](aq),
                        aa['push'](cc['callFunc'](this['CallFuncMo' + 'veAniEnd'], this)),
                        this['node']['stopAllAct' + 'ions'](),
                        this['node']['runAction'](cc['sequence'](aa)),
                        this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](a2['EJL_ANI_NM']['DMINOJL_AN' + 'I_HEAD_MOV' + 'E'], 0x0);
                    }
                }
            }
            ['AddPassCar' + 'dVal'](a7) {
                if (0x1 != this['m_iTablePo' + 's'] || Y['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != Y['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT']) {
                    if (null == this['m_pPassCar' + 'dVal']) {
                        let a8 = cc['Vec2']['ZERO']
                          , a9 = 0x0;
                        0x3 == this['m_iTablePo' + 's'] ? (a9 = -0x1,
                        a8['x'] = 0x4e,
                        a8['y'] = 0x22) : (a8['x'] = 0x0,
                        a8['y'] = 0x4e),
                        this['m_pPassCar' + 'dVal'] = V['default']['GetCompone' + 'nt'](a3['default']),
                        this['m_pPassCar' + 'dVal']['InitPassCa' + 'rdVal'](a8, this['m_pUiBaseA' + 'tlas'], a9),
                        this['node']['addChild'](this['m_pPassCar' + 'dVal']['node']);
                    }
                    this['m_pPassCar' + 'dVal']['AddPassCar' + 'dVal'](a7);
                }
            }
            ['GetServerT' + 'ablePos']() {
                return this['m_iServerT' + 'ablePos'];
            }
            ['GetIFMyRea' + 'l']() {
                return this['m_iIFMyRea' + 'l'];
            }
            ['ShowMyFace' + 'Ani'](a7, a8, a9=0x3) {
                let aa = this['node']['getChildBy' + 'Name']('faceAni');
                if (aa && aa['removeFrom' + 'Parent'](!0x0),
                a8) {
                    let ab = Z['default']['GetFaceAni' + 'Name'](a7)
                      , ac = V['default']['GetCompone' + 'nt'](a0['default']);
                    ac['SetLoop'](!0x0),
                    ac['Init'](ab, 0x0),
                    ac['node']['name'] = 'faceAni',
                    this['node']['addChild'](ac['node'], 0xa),
                    this['scheduleOn' + 'ce']( () => {
                        ac && ac['node'] && ac['node']['removeFrom' + 'Parent'](!0x0);
                    }
                    , a9);
                }
            }
            ['CallFuncMo' + 'veAniEnd']() {
                this['m_bIsMovin' + 'g'] = !0x1,
                this['ResetPosit' + 'ion'](),
                0x3e7 != this['m_iTablePo' + 's'] && 0x1 != this['m_iTablePo' + 's'] && this['node']['setPositio' + 'n'](v['GetPositio' + 'n'](this['m_iTablePo' + 's'], this['m_iIFMyRea' + 'l'])),
                this['m_pLableNa' + 'me'] && (this['m_pLableNa' + 'me']['node']['active'] = !0x0),
                this['m_pSprMone' + 'yBK'] && (this['m_pSprMone' + 'yBK']['node']['active'] = !0x0),
                this['m_pIGameCa' + 'llBack'] && 0x1 == this['m_iTablePo' + 's'] && (this['m_iIFMyRea' + 'l'] = 0x1,
                this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](a2['EJL_ANI_NM']['DMINOJL_AN' + 'I_HEAD_MOV' + 'E'], 0x1)),
                0x1 == this['m_iTablePo' + 's'] && 0x1 == this['m_iIFMyRea' + 'l'] && this['m_pSprYBBK'] && (this['m_pSprYBBK']['node']['active'] = !0x0);
            }
            ['OnJLTouchS' + 'tart'](a7) {
                let a8 = this['node']['convertToN' + 'odeSpaceAR'](a7['touch']['getLocatio' + 'n']());
                this['m_pSpriteB' + 'G'] && this['m_pSpriteB' + 'G']['node']['getBoundin' + 'gBox']()['contains'](a8) && this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackSh' + 'owPlayerDe' + 'tails'](this['m_iTablePo' + 's']),
                this['m_pSprYBBK'] && this['m_pSprYBBK']['node']['active'] && this['m_pSprYBBK']['node']['getBoundin' + 'gBox']()['contains'](a8) && (X['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](X['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackSh' + 'owAwardCha' + 'nge']());
            }
            ['start']() {
                0x3 == this['m_iTablePo' + 's'] && (this['m_pSprMone' + 'yBK']['node']['setPositio' + 'n'](0x8a, -0x22),
                this['m_pLableNa' + 'me'] && this['m_pLableNa' + 'me']['node']['setPositio' + 'n'](0x8a, 0x4));
            }
        }
        ;
        Q([a5(cc['SpriteAtla' + 's']), R('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? w : Object)], a6['prototype'], 'm_pUiBaseA' + 'tlas', void 0x0),
        Q([a5(cc['Sprite']), R('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['Sprite']) ? x : Object)], a6['prototype'], 'm_pSpriteB' + 'G', void 0x0),
        Q([a5(cc['Sprite']), R('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['Sprite']) ? z : Object)], a6['prototype'], 'm_pSprMone' + 'yBK', void 0x0),
        Q([a5(cc['Sprite']), R('design:typ' + 'e', 'function' == typeof (B = 'undefined' != typeof cc && cc['Sprite']) ? B : Object)], a6['prototype'], 'm_pSprYBBK', void 0x0),
        Q([a5(cc['Label']), R('design:typ' + 'e', 'function' == typeof (E = 'undefined' != typeof cc && cc['Label']) ? E : Object)], a6['prototype'], 'm_pLableNa' + 'me', void 0x0),
        Q([a5(cc['Label']), R('design:typ' + 'e', 'function' == typeof (F = 'undefined' != typeof cc && cc['Label']) ? F : Object)], a6['prototype'], 'm_pLableMo' + 'ney', void 0x0),
        Q([a5(cc['Label']), R('design:typ' + 'e', 'function' == typeof (H = 'undefined' != typeof cc && cc['Label']) ? H : Object)], a6['prototype'], 'm_pLableYB', void 0x0),
        Q([a5(cc['Font']), R('design:typ' + 'e', 'function' == typeof (J = 'undefined' != typeof cc && cc['Font']) ? J : Object)], a6['prototype'], 'm_pTimeFon' + 't', void 0x0),
        Q([a5(cc['Font']), R('design:typ' + 'e', 'function' == typeof (K = 'undefined' != typeof cc && cc['Font']) ? K : Object)], a6['prototype'], 'm_pAddFont', void 0x0),
        Q([a5(cc['Font']), R('design:typ' + 'e', 'function' == typeof (O = 'undefined' != typeof cc && cc['Font']) ? O : Object)], a6['prototype'], 'm_pLessFon' + 't', void 0x0),
        Q([a5(cc['ProgressBa' + 'r']), R('design:typ' + 'e', 'function' == typeof (P = 'undefined' != typeof cc && cc['ProgressBa' + 'r']) ? P : Object)], a6['prototype'], 'm_pProgres' + 'sTimer', void 0x0),
        a6 = v = Q([a4], a6),
        q['DoMinoJL_P' + 'layerInfo'] = a6,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../../ScriptLobby/Chat/ChatData': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/AniSingleSpine': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/DoMino_UserIcon': void 0x0,
        '../../../../script/Common/Res/ResPool': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../GameUI/DoMinoJL_PassCardVal': 'DoMinoJL_P' + 'assCardVal'
    }],
    'DoMinoJL_SelfHandCard': [function(b, g, j) {
        'use strict';
        cc['_RF']['push'](g, 'e81b6eX5pZ' + 'IX4E83+3vR' + 'Qdg', 'DoMinoJL_S' + 'elfHandCar' + 'd');
        var k, q, v, w = this && this['__decorate'] || function(L, M, N, O) {
            var P, Q = arguments['length'], R = Q < 0x3 ? M : null === O ? O = Object['getOwnProp' + 'ertyDescri' + 'ptor'](M, N) : O;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                R = Reflect['decorate'](L, M, N, O);
            else
                for (var U = L['length'] - 0x1; U >= 0x0; U--)
                    (P = L[U]) && (R = (Q < 0x3 ? P(R) : Q > 0x3 ? P(M, N, R) : P(M, N)) || R);
            return Q > 0x3 && R && Object['defineProp' + 'erty'](M, N, R),
            R;
        }
        , x = this && this['__metadata'] || function(L, M) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](L, M);
        }
        ;
        Object['defineProp' + 'erty'](j, '__esModule', {
            'value': !0x0
        }),
        j['ESelfHandC' + 'ardState'] = void 0x0;
        const y = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , z = b('../../../.' + './script/C' + 'onfigs/App' + 'CommonCfg')
          , A = b('../../../.' + './script/C' + 'onfigs/Gam' + 'eTextConfi' + 'g')
          , B = b('../DoMinoJ' + 'L_CardRule')
          , D = b('../DoMinoJ' + 'L_Define')
          , E = b('../DoMinoJ' + 'L_TableInf' + 'o')
          , F = b('./DoMino_S' + 'priteCardM' + 'anage');
        var G;
        (function(L) {
            L[L['HANDCARD_N' + 'O'] = 0x0] = 'HANDCARD_N' + 'O',
            L[L['HANDCARD_D' + 'EAL'] = 0x1] = 'HANDCARD_D' + 'EAL',
            L[L['HANDCARD_N' + 'ORMAL'] = 0x2] = 'HANDCARD_N' + 'ORMAL',
            L[L['HANDCARD_S' + 'END'] = 0x3] = 'HANDCARD_S' + 'END';
        }(G = j['ESelfHandC' + 'ardState'] || (j['ESelfHandC' + 'ardState'] = {})));
        class H {
            constructor() {
                this['bIfSend'] = !0x0,
                this['cOriType'] = -0x1;
            }
        }
        const {ccclass: I, property: J} = cc['_decorator'];
        let K = class extends F['DominoSpri' + 'teCardMana' + 'ge'] {
            constructor() {
                super(...arguments),
                this['m_pBaseUiA' + 'tlas'] = null,
                this['m_pBtnAuto' + 'Send'] = null,
                this['m_pLabelAu' + 'toSend'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_iSelfHan' + 'dState'] = 0x0,
                this['m_pNoCardS' + 'endBK'] = null,
                this['m_pSendCar' + 'dTipdsBK'] = null,
                this['m_iHandCar' + 'dY'] = 0x0,
                this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1,
                this['m_ptCardCo' + 'meBack'] = cc['Vec2']['ZERO'],
                this['m_ptTouche' + 'sDef'] = cc['Vec2']['ZERO'],
                this['m_bAniCard' + 'Move'] = !0x1,
                this['m_fCardSca' + 'le'] = 0x1,
                this['m_fCardGap'] = 0x5a,
                this['m_sizeSing' + 'leCard'] = cc['size'](D['EJL_Define']['HAND_CARD_' + 'WIDTH'], D['EJL_Define']['HAND_CARD_' + 'HEIGTH']),
                this['m_pCardCom' + 'eBack'] = null,
                this['m_iShowSen' + 'dCardTipsY' + '0'] = 0x48,
                this['m_iShowSen' + 'dCardTipsY' + '1'] = 0x55,
                this['m_pSendCar' + 'd'] = null;
            }
            ['InitSelfHa' + 'ndCard'](L, M) {
                this['m_pSendCar' + 'd'] = M,
                this['m_pIGameCa' + 'llBack'] = L,
                this['Reset'](),
                this['SetNeedSha' + 'dow'](!0x0),
                this['m_pBtnAuto' + 'Send'] && (this['m_pBtnAuto' + 'Send']['isChecked'] = E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['bIfAutoSen' + 'dLastCard']);
            }
            ['GetAllSpri' + 'teCard'](L) {
                this['m_arrSprit' + 'eCard'];
            }
            ['Reset']() {
                this['m_pCardCom' + 'eBack'] = null,
                this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1,
                this['m_iSelfHan' + 'dState'] = G['HANDCARD_N' + 'O'],
                this['RemoveAllC' + 'ard'](),
                this['ShowAutoSe' + 'ndLabel'](!0x1),
                this['ShowSendCa' + 'rdTips'](!0x1),
                this['ShowNoCard' + 'Send'](!0x1);
            }
            ['JudgeHandS' + 'endCard']() {
                let L = !0x1
                  , M = 0x0
                  , N = 0x0
                  , O = E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val']
                  , P = E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'];
                console['log']('==cBeginVa' + 'l=' + O + ('=cBackVal=' + '=') + P);
                for (let Q = 0x0; Q < this['m_arrSprit' + 'eCard']['length']; Q++)
                    M = B['CardRule']['GetCardVal' + '1'](this['m_arrSprit' + 'eCard'][Q]['cCard']),
                    N = B['CardRule']['GetCardVal' + '2'](this['m_arrSprit' + 'eCard'][Q]['cCard']),
                    O == M || P == M || O == N || P == N ? L = !0x0 : (this['m_arrSprit' + 'eCard'][Q]['bShadow'] = !0x0,
                    this['m_arrSprit' + 'eCard'][Q]['pShadowSpr' + 'ite'] && (this['m_arrSprit' + 'eCard'][Q]['pShadowSpr' + 'ite']['node']['active'] = !0x0));
                return L;
            }
            ['JudgeSendC' + 'ard'](L) {
                let M = new H()
                  , N = -0x1;
                if (-0x1 == E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card'])
                    return M['bIfSend'] = !0x0,
                    M['cOriType'] = 0x0,
                    M;
                let O = 0x0
                  , P = B['CardRule']['GetCardVal' + '1'](L)
                  , Q = B['CardRule']['GetCardVal' + '2'](L);
                return E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] != P && E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] != Q || (N = 0x0,
                O += 0x1),
                E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] != P && E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] != Q || (N = 0x1,
                O += 0x1),
                0x2 == O && (N = O),
                M['bIfSend'] = O > 0x0,
                M['cOriType'] = N,
                M;
            }
            ['AutoSendCa' + 'rd']() {
                if (this['m_iSelfHan' + 'dState'] != G['HANDCARD_S' + 'END'])
                    return !0x1;
                let L = null
                  , M = 0x0;
                -0x1 == E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card'] && this['m_arrSprit' + 'eCard']['length'] > 0x0 && (L = this['m_arrSprit' + 'eCard'][0x0],
                M = 0x0);
                let N = 0x0
                  , O = 0x0;
                for (let P = 0x0; P < this['m_arrSprit' + 'eCard']['length']; P++)
                    if (N = B['CardRule']['GetCardVal' + '1'](this['m_arrSprit' + 'eCard'][P]['cCard']),
                    O = B['CardRule']['GetCardVal' + '2'](this['m_arrSprit' + 'eCard'][P]['cCard']),
                    E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] == N || E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] == O ? (L = this['m_arrSprit' + 'eCard'][P],
                    M = 0x0) : E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] != N && E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] != O || (L = this['m_arrSprit' + 'eCard'][P],
                    M = 0x1),
                    null != L) {
                        -0x1 != this['m_iTouches' + 'MoveCardIn' + 'dex'] && (this['m_iTouches' + 'MoveCardIn' + 'dex'] == P ? this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1 : this['m_iTouches' + 'MoveCardIn' + 'dex'] > P && this['m_iTouches' + 'MoveCardIn' + 'dex']--);
                        break;
                    }
                if (null != L) {
                    if (this['m_pIGameCa' + 'llBack']['CallBackSe' + 'ndCard'](L['cCard'], 0x1, M),
                    this['m_pSendCar' + 'd']) {
                        let Q = L['pCardSprit' + 'e']['node']['getPositio' + 'n']()
                          , R = L['pCardSprit' + 'e']['node']['parent']['convertToW' + 'orldSpaceA' + 'R'](Q);
                        this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](L['cCard'], M, R, !0x1, 0x1, this['m_pIGameCa' + 'llBack']['GetPlayerU' + 'sePropID'](0x1, 0x3));
                    }
                    this['RemoveCard'](L['cCard']),
                    this['m_pSendCar' + 'd'] && this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](-0x1);
                }
                return null != L;
            }
            ['SetState'](L) {
                this['m_iSelfHan' + 'dState'] = L;
            }
            ['ShakeAllCa' + 'rd']() {
                for (let L = 0x0; L < this['m_arrSprit' + 'eCard']['length']; L++)
                    if (!this['m_arrSprit' + 'eCard'][L]['bShadow'] && this['m_arrSprit' + 'eCard'][L]['pCardSprit' + 'e']) {
                        let M = 0x1
                          , N = [-0x1, 0x0, 0x1, 0x0, -0x1, 0x0, -0x1, 0x0]
                          , O = [0x2, 0x1, 0x0, 0x2, 0x0, 0x0, 0x2, 0x0]
                          , P = [];
                        for (let Q = 0x0; Q < 0x8; Q++) {
                            let R = cc['moveTo'](0.08, new cc['Vec2'](this['m_arrSprit' + 'eCard'][L]['iX'] + N[Q] * M,this['m_arrSprit' + 'eCard'][L]['iY'] + O[Q] * M));
                            P['push'](R);
                        }
                        this['m_arrSprit' + 'eCard'][L]['pCardSprit' + 'e']['node']['runAction'](cc['repeat'](cc['sequence'](P), 0x3));
                    }
            }
            ['BlowUpSend' + 'Card'](L=0x0) {
                for (let M = 0x0; M < this['m_arrSprit' + 'eCard']['length']; M++)
                    null != this['m_pCardCom' + 'eBack'] && this['m_pCardCom' + 'eBack'] == this['m_arrSprit' + 'eCard'][M] || !this['m_arrSprit' + 'eCard'][M]['bShadow'] && this['m_arrSprit' + 'eCard'][M]['pCardSprit' + 'e'] && this['m_arrSprit' + 'eCard'][M]['pCardSprit' + 'e']['node']['runAction'](cc['sequence'](cc['delayTime'](L), cc['scaleTo'](0.17, 1.1, 1.14), cc['scaleTo'](0.15, 0x1)));
            }
            ['ShowNoCard' + 'Send'](L) {
                if (cc['winSize'],
                L)
                    if (null == this['m_pNoCardS' + 'endBK']) {
                        let M = 0x2d;
                        this['m_pNoCardS' + 'endBK'] = y['default']['GetCompone' + 'nt'](cc['Sprite']),
                        y['default']['SetSpriteF' + 'rame'](this['m_pBaseUiA' + 'tlas'], this['m_pNoCardS' + 'endBK'], 'DG_game_tg' + '_bg'),
                        this['m_pNoCardS' + 'endBK']['node']['setPositio' + 'n'](0x0, 0x0),
                        this['node']['addChild'](this['m_pNoCardS' + 'endBK']['node'], 0x64),
                        this['m_pNoCardS' + 'endBK']['node']['active'] = !0x1,
                        this['scheduleOn' + 'ce']( () => {
                            this['m_pNoCardS' + 'endBK']['node']['active'] = !0x0,
                            this['m_pNoCardS' + 'endBK']['node']['setContent' + 'Size'](0x2bc, M),
                            this['m_pNoCardS' + 'endBK']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.2), cc['delayTime'](1.5), cc['fadeTo'](0.2, 0x78), cc['callFunc'](this['ResetAllSh' + 'adowCard'], this), cc['fadeTo'](0.05, 0x0)));
                        }
                        , 0.1);
                        let N = new cc['Node']()['addCompone' + 'nt'](cc['Label']);
                        N['fontSize'] = 0x1a,
                        N['horizontal' + 'Align'] = cc['Label']['Horizontal' + 'Align']['CENTER'],
                        N['string'] = A['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0xa),
                        N['node']['color'] = cc['color'](0xc3, 0xff, 0xcb),
                        N['node']['opacity'] = 0xc8,
                        this['m_pNoCardS' + 'endBK']['node']['addChild'](N['node']),
                        N['node']['setPositio' + 'n'](0x0, -0xa);
                    } else
                        this['m_pNoCardS' + 'endBK']['node']['runAction'](cc['sequence'](cc['fadeIn'](0.2), cc['delayTime'](1.5), cc['fadeTo'](0.2, 0x78), cc['callFunc'](this['ResetAllSh' + 'adowCard'], this), cc['fadeTo'](0.05, 0x0)));
                else
                    this['m_pNoCardS' + 'endBK'] && this['m_pNoCardS' + 'endBK']['node']['runAction'](cc['fadeOut'](0.3));
            }
            ['ShowSendCa' + 'rdTips'](L) {
                if (L) {
                    if (null == this['m_pSendCar' + 'dTipdsBK']) {
                        let M = new cc['Node']()['addCompone' + 'nt'](cc['Label']);
                        M['fontSize'] = 0x1a,
                        M['horizontal' + 'Align'] = cc['Label']['Horizontal' + 'Align']['CENTER'],
                        M['node']['color'] = cc['color'](0xc3, 0xff, 0xcb),
                        M['node']['opacity'] = 0xc8,
                        M['string'] = A['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x43);
                        let N = 0x2d;
                        this['m_pSendCar' + 'dTipdsBK'] = y['default']['GetCompone' + 'nt'](cc['Sprite']),
                        this['node']['addChild'](this['m_pSendCar' + 'dTipdsBK']['node'], 0x64),
                        this['m_pSendCar' + 'dTipdsBK']['node']['addChild'](M['node']),
                        M['node']['setPositio' + 'n'](0x0, -0xa),
                        M['node']['opacity'] = 0x1,
                        this['scheduleOn' + 'ce']( () => {
                            M['node']['opacity'] = 0xff,
                            y['default']['SetSpriteF' + 'rame'](this['m_pBaseUiA' + 'tlas'], this['m_pSendCar' + 'dTipdsBK'], 'DG_game_tg' + '_bg'),
                            this['m_pSendCar' + 'dTipdsBK']['node']['setContent' + 'Size'](M['node']['getContent' + 'Size']()['width'] + 0x78, N),
                            this['m_pSendCar' + 'dTipdsBK']['node']['setPositio' + 'n'](0x0, 0.5 * D['EJL_Define']['HAND_CARD_' + 'HEIGTH'] + 0x28);
                        }
                        , 0.1);
                    }
                    this['m_pSendCar' + 'dTipdsBK']['node']['runAction'](cc['fadeIn'](0.2));
                } else
                    this['m_pSendCar' + 'dTipdsBK'] && this['m_pSendCar' + 'dTipdsBK']['node']['runAction'](cc['fadeOut'](0.3));
            }
            ['ShowAutoSe' + 'ndLabel'](L) {
                console['log']('===ShowAut' + 'oSendLabel' + '===' + L),
                this['m_pLabelAu' + 'toSend'] && (this['m_pLabelAu' + 'toSend']['node']['active'] = L),
                this['m_pBtnAuto' + 'Send'] && (this['m_pBtnAuto' + 'Send']['node']['active'] = L);
            }
            ['ResetAllCa' + 'rdPosition'](L=!0x1) {
                super['ResetAllCa' + 'rdPosition'](L);
                let M = 0.5 * -(0x6 * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'])
                  , N = 0x0;
                for (let O = 0x0; O < this['m_arrSprit' + 'eCard']['length']; ++O)
                    this['m_iTouches' + 'MoveCardIn' + 'dex'] != O && (this['m_arrSprit' + 'eCard'][O]['iX'] = M + N * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,
                    this['m_arrSprit' + 'eCard'][O]['iY'] = this['m_iHandCar' + 'dY'],
                    N++,
                    this['m_arrSprit' + 'eCard'][O]['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                    this['m_arrSprit' + 'eCard'][O]['pCardSprit' + 'e']['node']['stopAllAct' + 'ions'](),
                    L ? this['m_arrSprit' + 'eCard'][O]['pCardSprit' + 'e']['node']['runAction'](cc['moveTo'](0.5, this['m_arrSprit' + 'eCard'][O]['iX'], this['m_arrSprit' + 'eCard'][O]['iY'])) : this['m_arrSprit' + 'eCard'][O]['pCardSprit' + 'e']['node']['setPositio' + 'n'](this['m_arrSprit' + 'eCard'][O]['iX'], this['m_arrSprit' + 'eCard'][O]['iY']));
            }
            ['CardComeBa' + 'ckAni'](L) {
                this['m_arrSprit' + 'eCard']['length'] > 0x1 && this['m_arrSprit' + 'eCard']['sort']( (R, U) => R['iX'] - U['iX']);
                let M = 0.5 * -(0x6 * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'])
                  , N = cc['Vec2']['ZERO']
                  , O = cc['Vec2']['ZERO']
                  , P = 0x1f4;
                for (let R = 0x0; R < this['m_arrSprit' + 'eCard']['length']; R++)
                    if (L == this['m_arrSprit' + 'eCard'][R]) {
                        N = this['m_arrSprit' + 'eCard'][R]['pCardSprit' + 'e']['node']['getPositio' + 'n'](),
                        O['x'] = M + R * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        O['y'] = this['m_iHandCar' + 'dY'],
                        P = y['default']['GetTwoPosL' + 'en'](N, O);
                        break;
                    }
                let Q = 0.5;
                P < 0x64 ? Q = 0.2 : P < 0xc8 && (Q = 0.3);
                for (let U = 0x0; U < this['m_arrSprit' + 'eCard']['length']; U++)
                    this['m_arrSprit' + 'eCard'][U]['iX'] = M + U * this['m_fCardGap'] + this['m_sizeSing' + 'leCard']['width'] / 0x2,
                    this['m_arrSprit' + 'eCard'][U]['iY'] = this['m_iHandCar' + 'dY'],
                    this['m_arrSprit' + 'eCard'][U]['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                    this['m_arrSprit' + 'eCard'][U]['pCardSprit' + 'e']['node']['zIndex'] = 0x0,
                    this['m_arrSprit' + 'eCard'][U]['pCardSprit' + 'e']['node']['stopAllAct' + 'ions'](),
                    L == this['m_arrSprit' + 'eCard'][U] ? (this['m_arrSprit' + 'eCard'][U]['pCardSprit' + 'e']['node']['runAction'](cc['moveTo'](Q + 0.1, new cc['Vec2'](this['m_arrSprit' + 'eCard'][U]['iX'],this['m_arrSprit' + 'eCard'][U]['iY']))),
                    this['node']['runAction'](cc['sequence'](cc['delayTime'](Q + 0.1), cc['callFunc'](this['CallBackCo' + 'meBackAniE' + 'nd'], this)))) : this['m_arrSprit' + 'eCard'][U]['pCardSprit' + 'e']['node']['runAction'](cc['moveTo'](Q, new cc['Vec2'](this['m_arrSprit' + 'eCard'][U]['iX'],this['m_arrSprit' + 'eCard'][U]['iY'])));
                if (this['m_pIGameCa' + 'llBack']['GetPlayerU' + 'sePropID'](0x1, 0x3) > 0x0 && P > 0x64) {
                    let V = this['node']['getChildBy' + 'Name']('CardTuoWei' + 'Ani');
                    null != V && this['node']['removeChil' + 'd'](V, !0x0),
                    (V = new cc['Node']())['setPositio' + 'n'](N['x'], N['y'] + this['m_sizeSing' + 'leCard']['height'] / 0x2),
                    V['runAction'](cc['sequence'](cc['moveTo'](Q + 0.1, new cc['Vec2'](O['x'],O['y'] + this['m_sizeSing' + 'leCard']['height'] / 0x2)), cc['delayTime'](0.6), cc['removeSelf']())),
                    V['name'] = 'CardTuoWei' + 'Ani',
                    this['node']['addChild'](V, -0x1);
                }
            }
            ['CallBackCo' + 'meBackAniE' + 'nd']() {
                this['m_pCardCom' + 'eBack'] = null;
            }
            ['OnClickAut' + 'oSend']() {
                E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['bIfAutoSen' + 'dLastCard'] = !E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['bIfAutoSen' + 'dLastCard'],
                E['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['bIfAutoSen' + 'dLastCard'] && this['AutoSendCa' + 'rd']();
            }
            ['OnJLTouchS' + 'tart'](L) {
                if (console['log']('0===OnJLTo' + 'uchStart==' + '=' + this['m_iSelfHan' + 'dState']),
                this['m_iSelfHan' + 'dState'] <= G['HANDCARD_D' + 'EAL'])
                    return;
                if (0x0 == this['m_arrSprit' + 'eCard']['length'])
                    return;
                if (-0x1 != this['m_iTouches' + 'MoveCardIn' + 'dex'])
                    return;
                if (null != this['m_pCardCom' + 'eBack'])
                    return;
                let M = this['node']['convertToN' + 'odeSpaceAR'](L['touch']['getLocatio' + 'n']());
                this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1;
                for (let N = this['m_arrSprit' + 'eCard']['length'] - 0x1; N >= 0x0; --N)
                    if (!this['m_arrSprit' + 'eCard'][N]['bShadow'] && this['m_arrSprit' + 'eCard'][N]['pCardSprit' + 'e']['node']['getBoundin' + 'gBox']()['contains'](M))
                        return this['m_iTouches' + 'MoveCardIn' + 'dex'] = N,
                        this['m_ptCardCo' + 'meBack'] = this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['pCardSprit' + 'e']['node']['getPositio' + 'n'](),
                        this['m_ptTouche' + 'sDef'] = new cc['Vec2'](M['x'] - this['m_ptCardCo' + 'meBack']['x'],M['y'] - this['m_ptCardCo' + 'meBack']['y']),
                        void this['m_arrSprit' + 'eCard'][N]['pCardSprit' + 'e']['node']['runAction'](cc['sequence'](cc['delayTime'](0x0), cc['scaleTo'](0.08, 1.1, 1.14)));
            }
            ['OnJLTouchM' + 'ove'](L) {
                if (0x0 == this['m_arrSprit' + 'eCard']['length'])
                    return;
                let M = z['default']['GetInstanc' + 'e']()['SignResolu' + 'tion']
                  , N = this['node']['convertToN' + 'odeSpaceAR'](L['touch']['getLocatio' + 'n']());
                if (-0x1 != this['m_iTouches' + 'MoveCardIn' + 'dex'] && this['m_iTouches' + 'MoveCardIn' + 'dex'] < this['m_arrSprit' + 'eCard']['length']) {
                    let O = -0x3c
                      , P = M['height'] - this['m_sizeSing' + 'leCard']['height'] - 0x3c
                      , Q = 0.5 * -M['width'] + 0.5 * this['m_sizeSing' + 'leCard']['width']
                      , R = 0.5 * (M['width'] - this['m_sizeSing' + 'leCard']['width'])
                      , U = new cc['Vec2'](N['x'] - this['m_ptTouche' + 'sDef']['x'],N['y'] - this['m_ptTouche' + 'sDef']['y']);
                    if (N['y'] - this['m_ptTouche' + 'sDef']['y'] < O ? U['y'] = O : N['y'] - this['m_ptTouche' + 'sDef']['y'] > P && (U['y'] = P),
                    N['x'] - this['m_ptTouche' + 'sDef']['x'] < Q ? U['x'] = Q : N['x'] - this['m_ptTouche' + 'sDef']['x'] > R && (U['x'] = R),
                    this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['pCardSprit' + 'e']['node']['setPositio' + 'n'](U),
                    this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['pCardSprit' + 'e']['node']['zIndex'] = 0x63,
                    this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['iX'] = U['x'],
                    this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['iY'] = U['y'],
                    0x0 == this['m_ptCardCo' + 'meBack']['x'] && 0x0 == this['m_ptCardCo' + 'meBack']['y'] || !(Math['abs'](U['x'] - this['m_ptCardCo' + 'meBack']['x']) > this['m_fCardGap'] / 0x2 || Math['abs'](U['y'] - this['m_ptCardCo' + 'meBack']['y']) > this['m_sizeSing' + 'leCard']['height'] / 0x2) || (this['m_ptCardCo' + 'meBack']['x'] = 0x0,
                    this['m_ptCardCo' + 'meBack']['y'] = 0x0,
                    this['ResetAllCa' + 'rdPosition'](!0x0)),
                    this['m_iSelfHan' + 'dState'] == G['HANDCARD_S' + 'END'])
                        if (U['y'] > this['m_iShowSen' + 'dCardTipsY' + '1']) {
                            let V = this['JudgeSendC' + 'ard'](this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['cCard'])
                              , W = V['cOriType'];
                            V['bIfSend'] && (0x2 == W ? U['x'] <= 0x0 ? this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['cCard'], 0x0) : this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['cCard'], 0x1) : this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['cCard'], W));
                        } else
                            U['y'] > this['m_iShowSen' + 'dCardTipsY' + '0'] && this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['cCard']);
                    else
                        this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](-0x1);
                }
            }
            ['OnJLTouchE' + 'nd'](L) {
                if (0x0 != this['m_arrSprit' + 'eCard']['length'] && (this['node']['convertToN' + 'odeSpaceAR'](L['touch']['getLocatio' + 'n']()),
                -0x1 != this['m_iTouches' + 'MoveCardIn' + 'dex'] && this['m_iTouches' + 'MoveCardIn' + 'dex'] < this['m_arrSprit' + 'eCard']['length'])) {
                    this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['pCardSprit' + 'e']['node']['runAction'](cc['sequence'](cc['delayTime'](0x0), cc['scaleTo'](0.15, 0x1)));
                    let M = !0x1
                      , N = this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]
                      , O = this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']]['pCardSprit' + 'e']['node']['getPositio' + 'n']();
                    if (this['m_iSelfHan' + 'dState'] == G['HANDCARD_S' + 'END'] && O['y'] > this['m_iShowSen' + 'dCardTipsY' + '1']) {
                        let P = this['JudgeSendC' + 'ard'](N['cCard'])
                          , Q = P['cOriType'];
                        if (M = P['bIfSend']) {
                            let R = new cc['Vec2'](N['iX'],N['iY'])
                              , U = N['pCardSprit' + 'e']['node']['parent']['convertToW' + 'orldSpaceA' + 'R'](R);
                            0x2 == Q ? N['iX'] <= 0x0 ? (this['m_pIGameCa' + 'llBack']['CallBackSe' + 'ndCard'](N['cCard'], 0x1, 0x0),
                            this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](N['cCard'], 0x0, U, !0x1, 0x1, this['m_pIGameCa' + 'llBack']['GetPlayerU' + 'sePropID'](0x1, 0x3))) : (this['m_pIGameCa' + 'llBack']['CallBackSe' + 'ndCard'](N['cCard'], 0x1, 0x1),
                            this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](N['cCard'], 0x1, U, !0x1, 0x1, this['m_pIGameCa' + 'llBack']['GetPlayerU' + 'sePropID'](0x1, 0x3))) : (this['m_pIGameCa' + 'llBack']['CallBackSe' + 'ndCard'](N['cCard'], 0x1, Q),
                            this['m_pSendCar' + 'd']['PlaySendCa' + 'rdAni'](N['cCard'], Q, U, !0x1, 0x1, this['m_pIGameCa' + 'llBack']['GetPlayerU' + 'sePropID'](0x1, 0x3))),
                            this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1,
                            this['RemoveCard'](N['cCard']);
                        }
                    }
                    M || (this['m_pCardCom' + 'eBack'] = N,
                    this['CardComeBa' + 'ckAni'](N)),
                    this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1,
                    this['m_pSendCar' + 'd']['ShowSendCa' + 'rdTips'](-0x1);
                }
            }
            ['OnJLTouchC' + 'ancel'](L) {
                if (this['m_iTouches' + 'MoveCardIn' + 'dex'] >= 0x0 && this['m_iTouches' + 'MoveCardIn' + 'dex'] < this['m_arrSprit' + 'eCard']['length']) {
                    let M = this['m_arrSprit' + 'eCard'][this['m_iTouches' + 'MoveCardIn' + 'dex']];
                    M['pCardSprit' + 'e']['node']['runAction'](cc['scaleTo'](0.15, 0x1)),
                    this['m_pCardCom' + 'eBack'] = M,
                    this['CardComeBa' + 'ckAni'](M),
                    this['m_iTouches' + 'MoveCardIn' + 'dex'] = -0x1;
                }
            }
            ['start']() {
                this['m_pLabelAu' + 'toSend'] && (this['m_pLabelAu' + 'toSend']['string'] = A['GameTextCo' + 'nfig']['GetInstanc' + 'e']()['GetGameTex' + 't'](0x196));
            }
        }
        ;
        w([J(cc['SpriteAtla' + 's']), x('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? k : Object)], K['prototype'], 'm_pBaseUiA' + 'tlas', void 0x0),
        w([J(cc['Toggle']), x('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['Toggle']) ? q : Object)], K['prototype'], 'm_pBtnAuto' + 'Send', void 0x0),
        w([J(cc['Label']), x('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof cc && cc['Label']) ? v : Object)], K['prototype'], 'm_pLabelAu' + 'toSend', void 0x0),
        K = w([I], K),
        j['default'] = K,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/AppCommonCfg': void 0x0,
        '../../../../script/Configs/GameTextConfig': void 0x0,
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../DoMinoJL_TableInfo': 'DoMinoJL_T' + 'ableInfo',
        './DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age'
    }],
    'DoMinoJL_SendCard': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'a51b1ScUB1' + 'G+roEm97sW' + 'ohy', 'DoMinoJL_S' + 'endCard');
        var j, k = this && this['__decorate'] || function(D, E, F, G) {
            var H, I = arguments['length'], J = I < 0x3 ? E : null === G ? G = Object['getOwnProp' + 'ertyDescri' + 'ptor'](E, F) : G;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                J = Reflect['decorate'](D, E, F, G);
            else
                for (var K = D['length'] - 0x1; K >= 0x0; K--)
                    (H = D[K]) && (J = (I < 0x3 ? H(J) : I > 0x3 ? H(E, F, J) : H(E, F)) || J);
            return I > 0x3 && J && Object['defineProp' + 'erty'](E, F, J),
            J;
        }
        , q = this && this['__metadata'] || function(D, E) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](D, E);
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        });
        const u = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , v = b('../../../.' + './script/C' + 'onfigs/App' + 'CommonCfg')
          , w = b('../DoMinoJ' + 'L_CardRule')
          , x = b('../DoMinoJ' + 'L_Define')
          , y = b('../DoMinoJ' + 'L_TableInf' + 'o')
          , z = b('./DoMino_S' + 'priteCardM' + 'anage')
          , {ccclass: A, property: B} = cc['_decorator'];
        let C = class extends z['DominoSpri' + 'teCardMana' + 'ge'] {
            constructor() {
                super(...arguments),
                this['m_pUIBaseA' + 'tlas'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_dqSendSp' + 'riteCards'] = [],
                this['m_vcSendSp' + 'riteCardAn' + 'i'] = [],
                this['m_ptFirstC' + 'ard'] = cc['Vec2']['ZERO'],
                this['m_fCardSca' + 'le'] = 0x0,
                this['m_sizeSing' + 'leCard'] = cc['Size']['ZERO'],
                this['m_rectShow' + 'AllCard'] = null,
                this['m_iFronLas' + 'tMoveFor'] = 0x0,
                this['m_ptFrontL' + 'astPoint'] = cc['Vec2']['ZERO'],
                this['m_iBackLas' + 'tMoveFor'] = 0x0,
                this['m_ptBackLa' + 'stPoint'] = cc['Vec2']['ZERO'],
                this['m_pSprSend' + 'CardTips'] = new Array(0x2),
                this['m_pShowSen' + 'dCardTips'] = null,
                this['m_iLastSho' + 'wTipsOriTy' + 'pe'] = -0x63,
                this['m_iSendCar' + 'dTablePos'] = 0x0,
                this['m_pLastSen' + 'dCard'] = null;
            }
            ['InitSendCa' + 'rd'](D) {
                this['Reset'](),
                this['m_pIGameCa' + 'llBack'] = D;
            }
            ['GetLastSen' + 'dCard']() {
                return this['m_pLastSen' + 'dCard'];
            }
            ['Reset']() {
                v['default']['GetInstanc' + 'e']()['SignResolu' + 'tion'],
                this['m_iSendCar' + 'dTablePos'] = -0x1,
                this['m_ptFirstC' + 'ard'] = cc['Vec2']['ZERO'],
                this['m_fCardSca' + 'le'] = 0x1,
                this['m_sizeSing' + 'leCard'] = cc['size'](x['EJL_Define']['HAND_CARD_' + 'S_HEIGTH'], x['EJL_Define']['HAND_CARD_' + 'S_WIDTH']);
                let D = 0x9 * x['EJL_Define']['HAND_CARD_' + 'S_HEIGTH'] + x['EJL_Define']['HAND_CARD_' + 'S_WIDTH'] + 0xa;
                this['m_rectShow' + 'AllCard'] = cc['rect'](0.5 * -D, -0x80, D, 0x12c),
                this['m_iLastSho' + 'wTipsOriTy' + 'pe'] = -0x63,
                this['m_pSprSend' + 'CardTips'][0x0] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x0]['node'], !0x0),
                this['m_pSprSend' + 'CardTips'][0x0] = null),
                this['m_pSprSend' + 'CardTips'][0x1] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x1]['node'], !0x0),
                this['m_pSprSend' + 'CardTips'][0x1] = null),
                this['m_pShowSen' + 'dCardTips'] && (this['node']['removeChil' + 'd'](this['m_pShowSen' + 'dCardTips']['node'], !0x0),
                this['m_pShowSen' + 'dCardTips'] = null),
                this['m_pLastSen' + 'dCard'] = null,
                this['RemoveAllC' + 'ard']();
            }
            ['AddSendCar' + 'd'](D, E, F=!0x0) {
                let G = y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()
                  , H = new z['DominoSpri' + 'teCard']();
                H['cCard'] = D;
                let I = this['GetNextCar' + 'dPosition'](D, E, this['m_dqSendSp' + 'riteCards'], G['cBeginCard' + 'Val'], G['cBackCardV' + 'al'], H)
                  , J = H['cDirection']
                  , K = H['cMoveFor'];
                H['iX'] = I['x'],
                H['iY'] = I['y'],
                H['pCardSprit' + 'e'] = z['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], D, J, !0x1, !0x0),
                H['pCardSprit' + 'e']['node']['setPositio' + 'n'](I),
                H['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                this['node']['addChild'](H['pCardSprit' + 'e']['node']),
                this['m_pLastSen' + 'dCard'] = H,
                0x0 == this['m_dqSendSp' + 'riteCards']['length'] ? (this['m_ptFrontL' + 'astPoint'] = I,
                this['m_ptBackLa' + 'stPoint'] = I,
                this['m_iFronLas' + 'tMoveFor'] = 0x0,
                this['m_iBackLas' + 'tMoveFor'] = 0x1) : 0x0 == E ? (this['m_ptFrontL' + 'astPoint'] = I,
                this['m_iFronLas' + 'tMoveFor'] = K) : (this['m_ptBackLa' + 'stPoint'] = I,
                this['m_iBackLas' + 'tMoveFor'] = K),
                0x0 == E ? this['m_dqSendSp' + 'riteCards'] = [H]['concat'](this['m_dqSendSp' + 'riteCards']) : this['m_dqSendSp' + 'riteCards']['push'](H),
                y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['SetSendCar' + 'dInfo'](D, E),
                y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['SetLeaveCa' + 'rdPointNum'](D, this['m_iSendCar' + 'dTablePos']);
                let L = 0x0;
                for (let M = 0x0; M < this['m_dqSendSp' + 'riteCards']['length']; M++) {
                    L++;
                    let N = this['m_dqSendSp' + 'riteCards'][M];
                    N['pCardSprit' + 'e'] && N['pCardSprit' + 'e']['node'] && (this['m_dqSendSp' + 'riteCards'][M]['pCardSprit' + 'e']['node']['zIndex'] = L);
                }
                F && this['m_pIGameCa' + 'llBack']['CallBackSe' + 'ndCardEnd'](this['m_iSendCar' + 'dTablePos']),
                this['ResetAllCa' + 'rdPosition' + 'ByType'](E);
            }
            ['RemoveAllC' + 'ard']() {
                for (let D = 0x0; D < this['m_dqSendSp' + 'riteCards']['length']; D++) {
                    let E = this['m_dqSendSp' + 'riteCards'][D];
                    E && (E['pCardSprit' + 'e']['node']['removeFrom' + 'Parent'](!0x0),
                    E = null);
                }
                this['m_dqSendSp' + 'riteCards'] = [];
            }
            ['GetSendCar' + 'dNextPosit' + 'ion'](D, E, F=null) {
                let G = y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']();
                return this['GetNextCar' + 'dPosition'](D, E, this['m_dqSendSp' + 'riteCards'], G['cBeginCard' + 'Val'], G['cBackCardV' + 'al'], F);
            }
            ['ShowSendCa' + 'rdTips'](D, E=-0x1) {
                if (D >= 0x0) {
                    if (this['m_iLastSho' + 'wTipsOriTy' + 'pe'] == E)
                        return;
                    this['m_pSprSend' + 'CardTips'][0x0] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x0]['node'], !0x0),
                    this['m_pSprSend' + 'CardTips'][0x0] = null),
                    this['m_pSprSend' + 'CardTips'][0x1] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x1]['node'], !0x0),
                    this['m_pSprSend' + 'CardTips'][0x1] = null),
                    this['m_pShowSen' + 'dCardTips'] && (this['node']['removeChil' + 'd'](this['m_pShowSen' + 'dCardTips']['node'], !0x0),
                    this['m_pShowSen' + 'dCardTips'] = null),
                    this['m_iLastSho' + 'wTipsOriTy' + 'pe'] = E;
                    let F = 0x0
                      , G = cc['Vec2']['ZERO']
                      , H = w['CardRule']['GetCardVal' + '1'](D)
                      , I = w['CardRule']['GetCardVal' + '2'](D);
                    if (-0x1 == y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card']) {
                        let J = new z['DominoSpri' + 'teCard']();
                        G = this['GetSendCar' + 'dNextPosit' + 'ion'](D, 0x0, J),
                        F = J['cDirection'],
                        J = null;
                        let K = 'DG_game_ca' + 'rd_kuang2';
                        0x1 != F && 0x2 != F || (K = 'DG_game_ca' + 'rd_kuang');
                        let L = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                        u['default']['SetSpriteF' + 'rame'](this['m_pUIBaseA' + 'tlas'], L, K),
                        this['m_pSprSend' + 'CardTips'][0x0] = L,
                        this['m_pSprSend' + 'CardTips'][0x0]['node']['setPositio' + 'n'](G['x'], G['y'] + 0x3),
                        this['node']['addChild'](this['m_pSprSend' + 'CardTips'][0x0]['node']),
                        this['m_pSprSend' + 'CardTips'][0x0]['node']['setScale'](this['m_fCardSca' + 'le']),
                        -0x1 != E && (this['m_pShowSen' + 'dCardTips'] = z['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], D, F, !0x1, !0x0),
                        this['m_pShowSen' + 'dCardTips']['node']['setPositio' + 'n'](G),
                        this['node']['addChild'](this['m_pShowSen' + 'dCardTips']['node'], -0x1));
                    } else {
                        if (y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] == H || y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBeginCard' + 'Val'] == I) {
                            let M = new z['DominoSpri' + 'teCard']();
                            G = this['GetSendCar' + 'dNextPosit' + 'ion'](D, 0x0, M),
                            F = M['cDirection'],
                            M = null;
                            let N = 'DG_game_ca' + 'rd_kuang2';
                            0x1 != F && 0x2 != F || (N = 'DG_game_ca' + 'rd_kuang');
                            let O = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                            u['default']['SetSpriteF' + 'rame'](this['m_pUIBaseA' + 'tlas'], O, N),
                            this['m_pSprSend' + 'CardTips'][0x0] = O,
                            this['m_pSprSend' + 'CardTips'][0x0]['node']['setPositio' + 'n'](G['x'], G['y'] + 0x3),
                            this['node']['addChild'](this['m_pSprSend' + 'CardTips'][0x0]['node']),
                            this['m_pSprSend' + 'CardTips'][0x0]['node']['setScale'](this['m_fCardSca' + 'le']),
                            0x0 == E && (this['m_pShowSen' + 'dCardTips'] = z['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], D, F, !0x1, !0x0),
                            this['m_pShowSen' + 'dCardTips']['node']['setPositio' + 'n'](G),
                            this['node']['addChild'](this['m_pShowSen' + 'dCardTips']['node'], -0x1),
                            this['m_pShowSen' + 'dCardTips']['node']['setScale'](this['m_fCardSca' + 'le']));
                        }
                        if (y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] == H || y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cBackCardV' + 'al'] == I) {
                            let P = this['m_dqSendSp' + 'riteCards']['length'] + 0x1
                              , Q = new z['DominoSpri' + 'teCard']();
                            G = this['GetSendCar' + 'dNextPosit' + 'ion'](D, 0x1, Q),
                            F = Q['cDirection'],
                            Q = null;
                            let R = 'DG_game_ca' + 'rd_kuang2';
                            0x1 != F && 0x2 != F || (R = 'DG_game_ca' + 'rd_kuang');
                            let S = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                            u['default']['SetSpriteF' + 'rame'](this['m_pUIBaseA' + 'tlas'], S, R),
                            this['m_pSprSend' + 'CardTips'][0x1] = S,
                            this['m_pSprSend' + 'CardTips'][0x1]['node']['setPositio' + 'n'](G['x'], G['y'] + 0x3),
                            this['node']['addChild'](this['m_pSprSend' + 'CardTips'][0x1]['node'], P),
                            this['m_pSprSend' + 'CardTips'][0x1]['node']['setScale'](this['m_fCardSca' + 'le']),
                            0x1 == E && (this['m_pShowSen' + 'dCardTips'] = z['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], D, F, !0x1, !0x0),
                            this['m_pShowSen' + 'dCardTips']['node']['setPositio' + 'n'](G),
                            this['node']['addChild'](this['m_pShowSen' + 'dCardTips']['node'], P - 0x1),
                            this['m_pShowSen' + 'dCardTips']['node']['setScale'](this['m_fCardSca' + 'le']));
                        }
                    }
                } else
                    this['m_iLastSho' + 'wTipsOriTy' + 'pe'] = -0x63,
                    this['m_pSprSend' + 'CardTips'][0x0] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x0]['node'], !0x0),
                    this['m_pSprSend' + 'CardTips'][0x0] = null),
                    this['m_pSprSend' + 'CardTips'][0x1] && (this['node']['removeChil' + 'd'](this['m_pSprSend' + 'CardTips'][0x1]['node'], !0x0),
                    this['m_pSprSend' + 'CardTips'][0x1] = null),
                    this['m_pShowSen' + 'dCardTips'] && (this['node']['removeChil' + 'd'](this['m_pShowSen' + 'dCardTips']['node'], !0x0),
                    this['m_pShowSen' + 'dCardTips'] = null);
            }
            ['PlaySendCa' + 'rdAni'](D, E, F, G=!0x1, H=0x1, I=0x0) {
                this['m_iSendCar' + 'dTablePos'] = H;
                let J = new z['DominoSpri' + 'teCard']()
                  , K = this['GetSendCar' + 'dNextPosit' + 'ion'](D, E, J)
                  , L = J['cDirection']
                  , M = new z['DominoSpri' + 'teCard']();
                M['cCard'] = D,
                M['cBuff'] = E,
                M['pCardSprit' + 'e'] = z['DominoSpri' + 'teCardMana' + 'ge']['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], D, 0x0, !0x1, G),
                this['node']['addChild'](M['pCardSprit' + 'e']['node'], 0x64);
                let N = this['node']['convertToN' + 'odeSpaceAR'](F);
                M['pCardSprit' + 'e']['node']['setPositio' + 'n'](N),
                this['m_vcSendSp' + 'riteCardAn' + 'i']['push'](M);
                let O = 0x0;
                0x1 == L ? O = 0x5a : 0x2 == L ? O = -0x5a : 0x3 == L && (O = 0xb4);
                let P = 1.03
                  , Q = 0.5
                  , R = u['default']['GetTwoPosL' + 'en'](N, K)
                  , T = Q = R < 0x190 ? 0.4 : 0.001 * R;
                if (G ? ((T = Q / 0x3) > 0.2 && (T = 0.2),
                M['pCardSprit' + 'e']['node']['setScale'](0x1),
                M['pCardSprit' + 'e']['node']['opacity'] = 0x0) : P = 88.58 * this['m_fCardSca' + 'le'] / 0xaa,
                M['pCardSprit' + 'e']['node']['runAction'](cc['sequence'](cc['spawn'](cc['moveTo'](Q, K)['easing'](cc['easeSineIn' + 'Out']()), cc['rotateBy'](Q, O), cc['scaleTo'](T, P), cc['fadeIn'](T)), cc['callFunc'](this['CallFuncSe' + 'ndCardMAni' + 'End'], this))),
                I > 0x0) {
                    let U = this['node']['getChildBy' + 'Name']('SendCardTu' + 'oWeiAni');
                    null != U && this['node']['removeChil' + 'd'](U, !0x0),
                    (U = new cc['Node']())['setPositio' + 'n'](F),
                    U['runAction'](cc['sequence'](cc['moveTo'](Q, K)['easing'](cc['easeSineIn' + 'Out']()), cc['delayTime'](0.6), cc['removeSelf']())),
                    U['name'] = 'SendCardTu' + 'oWeiAni',
                    this['node']['addChild'](U, 0x63);
                }
            }
            ['GetSendCar' + 'dAreaSize'](D) {
                let E = cc['rect'](0x0, 0x0, 0x0, 0x0)
                  , F = this['GetSendCar' + 'dNextPosit' + 'ion'](D, 0x0)
                  , G = this['GetSendCar' + 'dNextPosit' + 'ion'](D, 0x1)
                  , H = v['default']['GetInstanc' + 'e']()['SignResolu' + 'tion'];
                if (F['y'] == G['y']) {
                    let I = (F['x'] + G['x']) / 0x2;
                    E = cc['rect'](0x0, 0x0, I, H['height']);
                } else if (Math['abs'](F['x'] - G['x']) < 0xfa) {
                    let J = (F['y'] + G['y']) / 0x2;
                    E = cc['rect'](0x0, J, H['width'], H['height'] - J);
                } else {
                    let K = (F['x'] + G['x']) / 0x2;
                    E = G['x'] > F['x'] ? cc['rect'](0x0, 0x0, K, H['height']) : cc['rect'](K, 0x0, H['width'] - K, H['height']);
                }
                return E;
            }
            ['GetAllSend' + 'Card'](D) {
                if (this['m_dqSendSp' + 'riteCards'])
                    for (let E = 0x0; E < this['m_dqSendSp' + 'riteCards']['length']; E++)
                        D['push'](this['m_dqSendSp' + 'riteCards'][E]);
            }
            ['SetResultC' + 'ard'](D, E) {
                let F = 0x0
                  , G = this['m_dqSendSp' + 'riteCards']['length'];
                if (G < 0x0 && (G = 0x0),
                D >= 0x0 && E > 0x1 && this['m_dqSendSp' + 'riteCards']['length'] > 0x2) {
                    let H = this['m_dqSendSp' + 'riteCards'][0x0];
                    this['m_dqSendSp' + 'riteCards'][this['m_dqSendSp' + 'riteCards']['length'] - 0x1],
                    H['cCard'] == D ? (F = 0x2,
                    E < 0x4 ? G = G : G -= 0x1) : (G -= 0x2,
                    F = E < 0x4 ? 0x0 : 0x1);
                }
                for (let I = F; I < G; I++) {
                    let J = this['m_dqSendSp' + 'riteCards'][I];
                    if (J && J['pCardSprit' + 'e']) {
                        J['pCardSprit' + 'e']['node']['color'] = cc['color'](0x7e, 0x7e, 0x7e);
                        for (let K = 0x0; K < J['pCardSprit' + 'e']['node']['childrenCo' + 'unt']; K++) {
                            let L = J['pCardSprit' + 'e']['node']['children'][K];
                            L && (L['color'] = cc['color'](0x7e, 0x7e, 0x7e));
                        }
                    }
                }
            }
            ['GetAllSend' + 'CardCount']() {
                return this['m_dqSendSp' + 'riteCards']['length'];
            }
            ['ResetAllCa' + 'rdPosition' + 'ByType'](D) {
                if (0x1 == D && this['m_ptBackLa' + 'stPoint']['y'] < this['m_rectShow' + 'AllCard']['yMin']) {
                    let E = this['m_rectShow' + 'AllCard']['yMin'] - this['m_ptBackLa' + 'stPoint']['y'];
                    if (this['m_ptFrontL' + 'astPoint']['y'] + E > this['m_rectShow' + 'AllCard']['yMax'])
                        this['SetAllSend' + 'CardPositi' + 'on'](D);
                    else {
                        for (let F = 0x0; F < this['m_dqSendSp' + 'riteCards']['length']; F++)
                            this['m_dqSendSp' + 'riteCards'][F] && (this['m_dqSendSp' + 'riteCards'][F]['iY'] += E);
                        this['PlayMoveAl' + 'lCardAni'](),
                        this['m_ptFirstC' + 'ard']['y'] += E,
                        this['m_ptFrontL' + 'astPoint']['y'] += E,
                        this['m_ptBackLa' + 'stPoint']['y'] += E;
                    }
                }
                if (0x0 == D && this['m_ptFrontL' + 'astPoint']['y'] > this['m_rectShow' + 'AllCard']['yMax']) {
                    let G = this['m_rectShow' + 'AllCard']['yMax'] - this['m_ptFrontL' + 'astPoint']['y'];
                    if (this['m_ptBackLa' + 'stPoint']['y'] + G < this['m_rectShow' + 'AllCard']['yMin'])
                        this['SetAllSend' + 'CardPositi' + 'on'](D);
                    else {
                        for (let H = 0x0; H < this['m_dqSendSp' + 'riteCards']['length']; H++)
                            this['m_dqSendSp' + 'riteCards'][H] && (this['m_dqSendSp' + 'riteCards'][H]['iY'] += G);
                        this['PlayMoveAl' + 'lCardAni'](),
                        this['m_ptFirstC' + 'ard']['y'] += G,
                        this['m_ptFrontL' + 'astPoint']['y'] += G,
                        this['m_ptBackLa' + 'stPoint']['y'] += G;
                    }
                }
            }
            ['SetAllSend' + 'CardPositi' + 'on'](D) {
                console['log']('===SetAllS' + 'endCardPos' + 'ition===' + D);
                let E = (this['m_rectShow' + 'AllCard']['yMax'] - this['m_rectShow' + 'AllCard']['yMin']) / (this['m_ptFrontL' + 'astPoint']['y'] - this['m_ptBackLa' + 'stPoint']['y']);
                this['m_fCardSca' + 'le'] = this['m_fCardSca' + 'le'] * E,
                this['m_sizeSing' + 'leCard'] = cc['size'](this['m_sizeSing' + 'leCard']['width'] * E, this['m_sizeSing' + 'leCard']['height'] * E);
                let F = this['m_rectShow' + 'AllCard']['xMax'] - this['m_rectShow' + 'AllCard']['xMin'];
                F *= E,
                v['default']['GetInstanc' + 'e']()['SignResolu' + 'tion'],
                this['m_rectShow' + 'AllCard'] = cc['rect'](0.5 * -F, -0x80, F, 0x12c),
                0x0 == D ? this['m_ptFirstC' + 'ard']['y'] -= 0x1e : this['m_ptFirstC' + 'ard']['y'] += 0x1e;
                let G = []
                  , H = []
                  , I = null;
                for (let J = 0x0; J < this['m_dqSendSp' + 'riteCards']['length']; J++) {
                    let K = this['m_dqSendSp' + 'riteCards'][J];
                    K && (y['DoMinoJL_T' + 'ableInfo']['GetInstanc' + 'e']()['cFirstSend' + 'Card'] == K['cCard'] ? I = K : null == I ? G['push'](K) : H['push'](K));
                }
                if (null != I) {
                    let L = []
                      , M = -0x1
                      , N = -0x1
                      , O = new z['DominoSpri' + 'teCard']()
                      , P = this['GetNextCar' + 'dPosition'](I['cCard'], 0x0, L, M, N, O)
                      , Q = O['cDirection']
                      , R = O['cMoveFor'];
                    I['iX'] = P['x'],
                    I['iY'] = P['y'];
                    let T = new z['DominoSpri' + 'teCard']();
                    T['cCard'] = I['cCard'],
                    T['cDirection'] = Q,
                    this['m_ptFrontL' + 'astPoint'] = P,
                    this['m_ptBackLa' + 'stPoint'] = P,
                    this['m_iFronLas' + 'tMoveFor'] = 0x0,
                    this['m_iBackLas' + 'tMoveFor'] = 0x1,
                    L = [I]['concat'](L);
                    let U = w['CardRule']['GetCardVal' + '1'](I['cCard'])
                      , V = w['CardRule']['GetCardVal' + '2'](I['cCard']);
                    M = U,
                    N = V;
                    let W = G['length'];
                    if (W > 0x0)
                        for (let X = W - 0x1; X >= 0x0; --X) {
                            let Y = new z['DominoSpri' + 'teCard']();
                            P = this['GetNextCar' + 'dPosition'](G[X]['cCard'], 0x0, L, M, N, Y),
                            Q = Y['cDirection'],
                            R = Y['cMoveFor'],
                            Y = null,
                            G[X]['iX'] = P['x'],
                            G[X]['iY'] = P['y'];
                            let Z = new z['DominoSpri' + 'teCard']();
                            Z['cCard'] = G[X]['cCard'],
                            Z['cDirection'] = Q,
                            this['m_ptFrontL' + 'astPoint'] = P,
                            this['m_iFronLas' + 'tMoveFor'] = R,
                            L = [Z]['concat'](L),
                            U = w['CardRule']['GetCardVal' + '1'](G[X]['cCard']),
                            V = w['CardRule']['GetCardVal' + '2'](G[X]['cCard']),
                            M = M == U ? V : U;
                        }
                    if (H['length'] > 0x0)
                        for (let a0 = 0x0; a0 < H['length']; ++a0) {
                            let a1 = new z['DominoSpri' + 'teCard']();
                            P = this['GetNextCar' + 'dPosition'](H[a0]['cCard'], 0x1, L, M, N, a1),
                            Q = a1['cDirection'],
                            R = a1['cMoveFor'],
                            H[a0]['iX'] = P['x'],
                            H[a0]['iY'] = P['y'];
                            let a2 = new z['DominoSpri' + 'teCard']();
                            a2['cCard'] = H[a0]['cCard'],
                            a2['cDirection'] = Q,
                            this['m_ptBackLa' + 'stPoint'] = P,
                            this['m_iBackLas' + 'tMoveFor'] = R,
                            L['push'](a2),
                            U = w['CardRule']['GetCardVal' + '1'](H[a0]['cCard']),
                            V = w['CardRule']['GetCardVal' + '2'](H[a0]['cCard']),
                            N = N == U ? V : U;
                        }
                    this['PlayMoveAl' + 'lCardAni']();
                }
            }
            ['PlayMoveAl' + 'lCardAni']() {
                console['log']('===PlayMov' + 'eAllCardAn' + 'i===');
                for (let D = 0x0; D < this['m_dqSendSp' + 'riteCards']['length']; D++) {
                    let E = this['m_dqSendSp' + 'riteCards'][D];
                    E && (E['pCardSprit' + 'e']['node']['setScale'](this['m_fCardSca' + 'le']),
                    E['pCardSprit' + 'e']['node']['stopAllAct' + 'ions'](),
                    E['pCardSprit' + 'e']['node']['runAction'](cc['moveTo'](0.4, E['iX'], E['iY'])));
                }
            }
            ['CallFuncSe' + 'ndCardMAni' + 'End']() {
                if (this['m_vcSendSp' + 'riteCardAn' + 'i']['length'] > 0x0) {
                    let D = this['m_vcSendSp' + 'riteCardAn' + 'i'][0x0]['cCard']
                      , E = this['m_vcSendSp' + 'riteCardAn' + 'i'][0x0]['cBuff'];
                    this['AddSendCar' + 'd'](D, E);
                    let F = this['m_vcSendSp' + 'riteCardAn' + 'i'][0x0];
                    this['node']['removeChil' + 'd'](F['pCardSprit' + 'e']['node'], !0x0),
                    this['m_vcSendSp' + 'riteCardAn' + 'i']['splice'](0x0, 0x1),
                    F = null;
                    let G = this['node']['getChildBy' + 'Name']('SendCardTu' + 'oWeiAni');
                    null != G && (G['zIndex'] = -0x1);
                }
            }
            ['GetNextCar' + 'dPosition'](D, E, F, G, H, I=null) {
                let J = 0x0
                  , K = -0x1
                  , L = cc['Vec2']['ZERO']
                  , M = w['CardRule']['GetCardVal' + '1'](D)
                  , N = w['CardRule']['GetCardVal' + '2'](D);
                if (0x0 == F['length'])
                    L = this['m_ptFirstC' + 'ard'],
                    J = M == N ? 0x0 : 0x2;
                else {
                    let O = 0x0
                      , P = 0x0;
                    if (0x0 == E) {
                        K = this['m_iFronLas' + 'tMoveFor'];
                        let Q = F[0x0];
                        0x0 == Q['cDirection'] ? 0x0 == this['m_iFronLas' + 'tMoveFor'] ? O -= this['m_sizeSing' + 'leCard']['height'] / 0x2 : 0x1 == this['m_iFronLas' + 'tMoveFor'] ? O += this['m_sizeSing' + 'leCard']['height'] / 0x2 : P += this['m_sizeSing' + 'leCard']['width'] / 0x2 : 0x0 == this['m_iFronLas' + 'tMoveFor'] ? O -= this['m_sizeSing' + 'leCard']['width'] / 0x2 : 0x1 == this['m_iFronLas' + 'tMoveFor'] ? O += this['m_sizeSing' + 'leCard']['width'] / 0x2 : P += this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        M == N ? 0x0 == this['m_iFronLas' + 'tMoveFor'] ? (J = 0x0,
                        O -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += 0x0) : 0x1 == this['m_iFronLas' + 'tMoveFor'] ? (J = 0x0,
                        O += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += 0x0) : 0x2 == this['m_iFronLas' + 'tMoveFor'] ? (J = 0x1,
                        O += 0x0,
                        P += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x1) : (J = 0x1,
                        O += 0x0,
                        P += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x0) : (J = G == M ? 0x0 == this['m_iFronLas' + 'tMoveFor'] || 0x3 == this['m_iFronLas' + 'tMoveFor'] ? 0x1 : 0x2 : 0x0 == this['m_iFronLas' + 'tMoveFor'] || 0x3 == this['m_iFronLas' + 'tMoveFor'] ? 0x2 : 0x1,
                        0x0 == this['m_iFronLas' + 'tMoveFor'] ? (O -= this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        P += 0x0) : 0x1 == this['m_iFronLas' + 'tMoveFor'] ? (O += this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        P += 0x0) : 0x2 == this['m_iFronLas' + 'tMoveFor'] ? (O += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x1) : (O -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x0)),
                        0x0 == this['m_iFronLas' + 'tMoveFor'] && this['m_ptFrontL' + 'astPoint']['x'] + O < this['m_rectShow' + 'AllCard']['xMin'] ? (0x0 == Q['cDirection'] ? (O = 0x0,
                        P = this['m_sizeSing' + 'leCard']['width']) : (O = -this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P = this['m_sizeSing' + 'leCard']['width'] / 0x2 + this['m_sizeSing' + 'leCard']['height'] / 0x2),
                        K = 0x2,
                        0x1 == J ? J = 0x3 : 0x2 == J && (J = 0x0)) : 0x1 == this['m_iFronLas' + 'tMoveFor'] && this['m_ptFrontL' + 'astPoint']['x'] + O > this['m_rectShow' + 'AllCard']['xMax'] && (0x0 == Q['cDirection'] ? (O = 0x0,
                        P = this['m_sizeSing' + 'leCard']['width']) : (O = this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P = this['m_sizeSing' + 'leCard']['width'] / 0x2 + this['m_sizeSing' + 'leCard']['height'] / 0x2),
                        K = 0x3,
                        0x1 == J ? J = 0x0 : 0x2 == J && (J = 0x3)),
                        L = new cc['Vec2'](this['m_ptFrontL' + 'astPoint']['x'] + O,this['m_ptFrontL' + 'astPoint']['y'] + P);
                    } else {
                        K = this['m_iBackLas' + 'tMoveFor'];
                        let R = F[F['length'] - 0x1];
                        0x0 == R['cDirection'] ? 0x0 == this['m_iBackLas' + 'tMoveFor'] ? O -= this['m_sizeSing' + 'leCard']['height'] / 0x2 : 0x1 == this['m_iBackLas' + 'tMoveFor'] ? O += this['m_sizeSing' + 'leCard']['height'] / 0x2 : P -= this['m_sizeSing' + 'leCard']['width'] / 0x2 : 0x0 == this['m_iBackLas' + 'tMoveFor'] ? O -= this['m_sizeSing' + 'leCard']['width'] / 0x2 : 0x1 == this['m_iBackLas' + 'tMoveFor'] ? O += this['m_sizeSing' + 'leCard']['width'] / 0x2 : P -= this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        M == N ? 0x0 == this['m_iBackLas' + 'tMoveFor'] ? (J = 0x0,
                        O -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += 0x0) : 0x1 == this['m_iBackLas' + 'tMoveFor'] ? (J = 0x0,
                        O += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P += 0x0) : 0x2 == this['m_iBackLas' + 'tMoveFor'] ? (J = 0x1,
                        O += 0x0,
                        P -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x1) : (J = 0x1,
                        O += 0x0,
                        P -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x0) : (J = H == M ? 0x0 == this['m_iBackLas' + 'tMoveFor'] || 0x3 == this['m_iBackLas' + 'tMoveFor'] ? 0x1 : 0x2 : 0x0 == this['m_iBackLas' + 'tMoveFor'] || 0x3 == this['m_iBackLas' + 'tMoveFor'] ? 0x2 : 0x1,
                        0x0 == this['m_iBackLas' + 'tMoveFor'] ? (O -= this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        P += 0x0) : 0x1 == this['m_iBackLas' + 'tMoveFor'] ? (O += this['m_sizeSing' + 'leCard']['width'] / 0x2,
                        P += 0x0) : 0x2 == this['m_iBackLas' + 'tMoveFor'] ? (O += this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x1) : (O -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P -= this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        K = 0x0)),
                        0x0 == this['m_iBackLas' + 'tMoveFor'] && this['m_ptBackLa' + 'stPoint']['x'] + O < this['m_rectShow' + 'AllCard']['xMin'] ? (0x0 == R['cDirection'] ? (O = 0x0,
                        P = -this['m_sizeSing' + 'leCard']['width']) : (O = -this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P = -(this['m_sizeSing' + 'leCard']['width'] / 0x2 + this['m_sizeSing' + 'leCard']['height'] / 0x2)),
                        K = 0x2,
                        0x1 == J ? J = 0x0 : 0x2 == J && (J = 0x3)) : 0x1 == this['m_iBackLas' + 'tMoveFor'] && this['m_ptBackLa' + 'stPoint']['x'] + O > this['m_rectShow' + 'AllCard']['xMax'] && (0x0 == R['cDirection'] ? (O = 0x0,
                        P = -this['m_sizeSing' + 'leCard']['width']) : (O = this['m_sizeSing' + 'leCard']['height'] / 0x2,
                        P = -(this['m_sizeSing' + 'leCard']['width'] / 0x2 + this['m_sizeSing' + 'leCard']['height'] / 0x2)),
                        K = 0x3,
                        0x1 == J ? J = 0x3 : 0x2 == J && (J = 0x0)),
                        L = new cc['Vec2'](this['m_ptBackLa' + 'stPoint']['x'] + O,this['m_ptBackLa' + 'stPoint']['y'] + P);
                    }
                }
                return I && (I['cDirection'] = J,
                I['cMoveFor'] = K,
                I['iX'] = L['x'],
                I['iY'] = L['y']),
                L;
            }
            ['onLoad']() {
                this['SetNeedSha' + 'dow'](!0x0);
            }
            ['start']() {}
        }
        ;
        k([B(cc['SpriteAtla' + 's']), q('design:typ' + 'e', 'function' == typeof (j = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? j : Object)], C['prototype'], 'm_pUIBaseA' + 'tlas', void 0x0),
        C = k([A], C),
        g['default'] = C,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/AppCommonCfg': void 0x0,
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        '../DoMinoJL_TableInfo': 'DoMinoJL_T' + 'ableInfo',
        './DoMino_SpriteCardManage': 'DoMino_Spr' + 'iteCardMan' + 'age'
    }],
    'DoMinoJL_SpinActivityLayer': [function(j, q, z) {
        'use strict';
        cc['_RF']['push'](q, '59c27VLoHZ' + 'Dbr6Jcff00' + 'Jze', 'DoMinoJL_S' + 'pinActivit' + 'yLayer');
        var H, K, Q, V, W, X, Y, Z, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9 = this && this['__decorate'] || function(av, aw, ax, ay) {
            var az, aA = arguments['length'], aB = aA < 0x3 ? aw : null === ay ? ay = Object['getOwnProp' + 'ertyDescri' + 'ptor'](aw, ax) : ay;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                aB = Reflect['decorate'](av, aw, ax, ay);
            else
                for (var aC = av['length'] - 0x1; aC >= 0x0; aC--)
                    (az = av[aC]) && (aB = (aA < 0x3 ? az(aB) : aA > 0x3 ? az(aw, ax, aB) : az(aw, ax)) || aB);
            return aA > 0x3 && aB && Object['defineProp' + 'erty'](aw, ax, aB),
            aB;
        }
        , aa = this && this['__metadata'] || function(av, aw) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](av, aw);
        }
        ;
        Object['defineProp' + 'erty'](z, '__esModule', {
            'value': !0x0
        });
        const ab = j('../../../.' + './script/C' + 'ommon/Base' + '/GameViewB' + 'ase')
          , ac = j('../../../.' + './script/C' + 'ommon/Base' + '/UIBase')
          , ad = j('../../../.' + './script/C' + 'ommon/Base' + '/UIManager')
          , ae = j('../../../.' + './script/C' + 'ommon/Res/' + 'ResPool')
          , af = j('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , ag = j('../../../.' + './script/C' + 'onfigs/App' + 'CommonCfg')
          , ah = j('../../../.' + './script/C' + 'onfigs/HW_' + 'GameTextBa' + 'se')
          , ai = j('../../../.' + './script/H' + 'w_Comm/Gam' + 'eDefine')
          , aj = j('../../../.' + './script/N' + 'etwork/Htt' + 'pManager')
          , ak = j('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , al = j('../../../.' + './ScriptLo' + 'bby/A_Game' + 'Comm/A_Tab' + 'leInfo')
          , am = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Ani' + 'SingleSpin' + 'e')
          , an = j('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/Com' + 'm_AniAward' + 'Money')
          , ao = j('../../../.' + './ScriptLo' + 'bby/Lobby/' + 'LobbySignI' + 'tem')
          , ap = j('../DoMinoJ' + 'L_Data')
          , aq = j('../DoMinoJ' + 'L_Define')
          , ar = j('./DoMinoJL' + '_GameWordT' + 'ips')
          , {ccclass: as, property: at} = cc['_decorator'];
        let au = class extends ac['UIBase'] {
            constructor() {
                super(...arguments),
                this['m_pMidNode'] = null,
                this['m_pSignIte' + 'msNode'] = null,
                this['m_pSpinNod' + 'e'] = null,
                this['m_pTimeNod' + 'e'] = null,
                this['m_pPrizeLi' + 'ght'] = null,
                this['m_pLabelSt' + 'artHour'] = null,
                this['m_pLabelSt' + 'artMinute'] = null,
                this['m_pLabelSt' + 'artSecond'] = null,
                this['m_pLabelPr' + 'ogress'] = null,
                this['m_pLabelTi' + 'me'] = null,
                this['m_pSpinMax'] = null,
                this['m_pActivit' + 'yOver'] = null,
                this['m_pTimeTip'] = null,
                this['m_pProgres' + 's'] = null,
                this['m_pBtnSpin'] = null,
                this['m_pBtnClos' + 'e'] = null,
                this['m_pGameWor' + 'dTips'] = null,
                this['m_pClickCa' + 'llback'] = null,
                this['m_pCloseCa' + 'llback'] = null,
                this['m_pIGameCa' + 'llBack'] = null,
                this['m_iLeftTim' + 'e'] = 0x0,
                this['m_bIsRotat' + 'ing'] = !0x1;
            }
            ['OnOpen'](av, ...aw) {
                let ax = aw[0x0];
                if (!(ax['length'] >= 0x3))
                    return void this['OnClose']();
                this['m_pIGameCa' + 'llBack'] = ax[0x0],
                this['SetClickCa' + 'llback'](ax[0x1]),
                this['SetCloseCa' + 'llback'](ax[0x2]),
                this['m_bIsRotat' + 'ing'] = !0x1,
                this['m_pMidNode']['setScale'](0x0);
                let ay = '';
                switch (ag['default']['iLanguage']) {
                case 0x1:
                    ay = 'yingwen';
                    break;
                case 0x3:
                    ay = 'malai';
                    break;
                default:
                    ay = 'yinni';
                }
                let az = this['CreateSpin' + 'eAni'](new cc['Vec2'](-0xaa,0xe1), am['ESpineName']['ZP_INDEX_B' + 'T']);
                az['SetLoadCom' + 'pleted']( () => {
                    az['SetSkin'](ay),
                    az['AddAnimati' + 'on'](0x0, am['ESpineName']['ZP_INDEX_B' + 'T'], !0x0);
                }
                ),
                this['m_pActivit' + 'yOver']['node']['active'] = !0x1;
                let aA = ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']
                  , aB = aA['vecPrize']['length']
                  , aC = this['m_pSignIte' + 'msNode']['childrenCo' + 'unt'];
                for (let aD = 0x0; aD < aC; aD++) {
                    let aE = 'LobbySignI' + 'tem' + aD
                      , aF = this['m_pSignIte' + 'msNode']['getChildBy' + 'Name'](aE);
                    if (!aF)
                        continue;
                    if (aD >= aB) {
                        aF['active'] = !0x1;
                        continue;
                    }
                    let aG = aA['vecPrize'][aD];
                    if (!aG) {
                        aF['active'] = !0x1;
                        continue;
                    }
                    aF['active'] = !0x0;
                    let aH = aF['getCompone' + 'nt'](ao['default']);
                    aH && aH['Init'](aG['iPropID'], aG['iNum'], !0x0);
                }
                if (this['m_pPrizeLi' + 'ght'] && (this['m_pPrizeLi' + 'ght']['active'] = !0x1),
                this['CreateSpin' + 'eAni'](this['m_pSpinNod' + 'e']['getPositio' + 'n'](), am['ESpineName']['ZP_INDEX_D' + 'ENG']),
                this['m_pLabelTi' + 'me']) {
                    let aI = '';
                    aI = ah['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ai['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x3),
                    aI = af['default']['ReplaceStr' + 'ing'](aI, '%s', aA['szTimeTip']),
                    this['m_pLabelTi' + 'me']['string'] = aI;
                }
                this['RefreshUI'](),
                this['m_pMidNode']['runAction'](cc['sequence'](cc['scaleTo'](0.15, 1.1), cc['scaleTo'](0.1, 0x1)));
            }
            ['OpenPrize'](av, aw=!0x1) {
                let ax = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_Y' + 'INDAO_UP']);
                ax && ax['removeFrom' + 'Parent'](!0x0);
                let ay = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_Y' + 'INDAO_DOWN']);
                ay && ay['removeFrom' + 'Parent'](!0x0);
                let az = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_D' + 'OWN']);
                az && az['removeFrom' + 'Parent'](!0x0);
                let aA = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_U' + 'P']);
                aA && aA['removeFrom' + 'Parent'](!0x0);
                let aB = ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']
                  , aC = aB['vecPrize']['length']
                  , aD = this['m_pSignIte' + 'msNode']['childrenCo' + 'unt'];
                for (let aJ = 0x0; aJ < aD; aJ++) {
                    let aK = 'LobbySignI' + 'tem' + aJ
                      , aL = this['m_pSignIte' + 'msNode']['getChildBy' + 'Name'](aK);
                    if (!aL)
                        continue;
                    let aM = aL['getCompone' + 'nt'](ao['default']);
                    aM && aM['CancelSele' + 'ct']();
                }
                let aE = new cc['Vec2'](this['m_pBtnSpin']['node']['x'] + 0x1,this['m_pBtnSpin']['node']['y'] - 0x8);
                if (this['CreateSpin' + 'eAni'](aE, am['ESpineName']['ZP_INDEX_A' + 'NNIU'], 0x1, !0x1),
                aB['iCurNum'] < 0x64 && (ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_bSitAfte' + 'rFinishSpi' + 'nTask'] = !0x0),
                av > aC)
                    return;
                let aF = this['m_pSpinNod' + 'e']['angle'] % 0x168;
                this['m_pSpinNod' + 'e']['angle'] = aF;
                let aG = 0x168 / aC * av;
                aG = 0x5a0 - aG + aF,
                this['m_bIsRotat' + 'ing'] = !0x0;
                let aH = [];
                aH['push'](cc['rotateBy'](0x5, aG)['easing'](cc['easeInOut'](0x4))),
                aH['push'](cc['callFunc']( () => {
                    let aN = new cc['Vec2'](this['m_pSpinNod' + 'e']['x'],this['m_pSpinNod' + 'e']['y'] + 0x8e);
                    this['CreateSpin' + 'eAni'](aN, am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_D' + 'OWN'], 0x1, !0x1)['SetComplet' + 'edCallBack']( () => {
                        let aO = this['m_pSignIte' + 'msNode']['getChildBy' + 'Name']('LobbySignI' + 'tem' + av);
                        if (aO) {
                            let aP = aO['getCompone' + 'nt'](ao['default']);
                            aP && aP['SetSelect'](0x0);
                        }
                    }
                    ),
                    this['CreateSpin' + 'eAni'](aN, am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_U' + 'P'], 0xb, !0x1);
                }
                , this)),
                aH['push'](cc['delayTime'](0.8)),
                aH['push'](cc['callFunc']( () => {
                    this['m_bIsRotat' + 'ing'] = !0x1;
                    let aN = this['m_pSignIte' + 'msNode']['getChildBy' + 'Name']('LobbySignI' + 'tem' + av);
                    if (aN) {
                        let aO = aN['getCompone' + 'nt'](ao['default']);
                        aO && aO['SetSelect'](0x0);
                    }
                    ad['uiManager']['Open'](ad['EGameUiId']['Comm_AniAw' + 'ardMoney'], [an['EAniAwardT' + 'ype']['ANI_AWARD_' + 'LOGIN_C'], aB['vecPrize'][av]['iNum'], this]),
                    ad['uiManager']['m_uiOpenDe' + 'legate'] = aP => {
                        if (aP == ad['EGameUiId']['Comm_AniAw' + 'ardMoney']) {
                            let aQ = ad['uiManager']['getUI'](aP);
                            aQ && aQ['node'] && (aQ['m_eShowTyp' + 'e'] = ac['EUIShowTyp' + 'es']['UIAddition']),
                            ad['uiManager']['m_uiOpenDe' + 'legate'] = null;
                        }
                    }
                    ,
                    this['UpdateBtnS' + 'pin'](),
                    this['UpdateTask' + 'Percentage']();
                }
                , this));
                let aI = cc['sequence'](aH);
                this['m_pSpinNod' + 'e']['runAction'](aI),
                ak['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](ak['EJLSoundId']['JL_SPIN_ST' + 'ART']);
            }
            ['RefreshUI']() {
                let av = ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']();
                this['m_iLeftTim' + 'e'] = av['m_SpinData']['iLeftTime'][0x0] - (af['default']['GetTimeSta' + 'mp']() - av['m_iSyncSer' + 'verTIme']) + 0x2;
                let aw = ae['ResPool']['GetInstanc' + 'e']()['GetResAsse' + 'ts'](ai['CFilePaths']['DG_DMN_JL_' + 'WORD']);
                0x0 == av['m_SpinData']['iStage'] ? af['default']['SetSpriteF' + 'rame'](aw, this['m_pTimeTip'], 'DG_zp_djs_' + 'word_start') : 0x1 == av['m_SpinData']['iStage'] && af['default']['SetSpriteF' + 'rame'](aw, this['m_pTimeTip'], 'DG_zp_djs_' + 'word_end'),
                this['m_pActivit' + 'yOver']['node']['active'] = 0x2 == av['m_SpinData']['iStage'],
                this['m_pTimeNod' + 'e']['active'] = av['m_SpinData']['iStage'] < 0x2,
                this['UpdateTime' + 'Label'](),
                this['m_iLeftTim' + 'e'] > 0x0 && (this['unschedule'](this['OnTimer']),
                this['schedule'](this['OnTimer'], 0x1)),
                this['UpdateBtnS' + 'pin'](),
                this['m_pProgres' + 's']['node']['active'] = !av['m_SpinData']['bIsSpinMax'],
                this['m_pSpinMax']['node']['active'] = !this['m_pProgres' + 's']['node']['active'],
                this['UpdateTask' + 'Percentage']();
            }
            ['UpdateTask' + 'Percentage']() {
                let av = ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData'];
                this['m_pProgres' + 's'] && (this['m_pProgres' + 's']['progress'] = Math['min'](0x1, av['iCurNum'] / 0x64)),
                this['m_pLabelPr' + 'ogress'] && (this['m_pLabelPr' + 'ogress']['string'] = av['iCurNum'] + '/100');
            }
            ['UpdateTime' + 'Label']() {
                this['m_iLeftTim' + 'e'] < 0x0 || (this['m_pLabelSt' + 'artHour'] && (this['m_pLabelSt' + 'artHour']['string'] = af['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] / 0xe10, 0x2)),
                this['m_pLabelSt' + 'artMinute'] && (this['m_pLabelSt' + 'artMinute']['string'] = af['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] % 0xe10 / 0x3c, 0x2)),
                this['m_pLabelSt' + 'artSecond'] && (this['m_pLabelSt' + 'artSecond']['string'] = af['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] % 0x3c, 0x2)));
            }
            ['CreateSpin' + 'eAni'](av, aw, ax=0x0, ay=!0x0) {
                let az = this['m_pMidNode']['getChildBy' + 'Name'](aw);
                az && az['removeFrom' + 'Parent'](!0x0);
                let aA = af['default']['GetCompone' + 'nt'](am['default']);
                return aA['Init'](am['ESpineName']['EFF_SPINE_' + 'HIGGSDOMIN' + 'OO_ZP'], -0x1, aw),
                aA['SetLoop'](ay),
                aA['node']['setPositio' + 'n'](av),
                this['m_pMidNode']['addChild'](aA['node']),
                aA['node']['name'] = aw,
                aA['node']['zIndex'] = ax,
                aA;
            }
            ['OnTimer'](av) {
                this['m_iLeftTim' + 'e']--,
                this['UpdateTime' + 'Label'](),
                this['m_iLeftTim' + 'e'] <= 0x0 && (this['unschedule'](this['OnTimer']),
                this['RefreshUI']());
            }
            ['UpdateBtnS' + 'pin']() {
                if (this['m_bIsRotat' + 'ing'])
                    return;
                let av = ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData'];
                if (this['m_pBtnClos' + 'e']['node']['active'] = av['iCurNum'] < 0x64 || 0x0 == av['iState'] || av['bIsSpinMax'] || al['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] == al['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'],
                av['iCurNum'] >= 0x64 && 0x1 == av['iState']) {
                    if (null == this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_Y' + 'INDAO_UP']) && !av['bIsSpinMax']) {
                        let aw = new cc['Vec2'](this['m_pBtnSpin']['node']['x'] + 0x1,this['m_pBtnSpin']['node']['y'] - 0x8);
                        this['CreateSpin' + 'eAni'](aw, am['ESpineName']['ZP_INDEX_Y' + 'INDAO_UP']),
                        this['CreateSpin' + 'eAni'](aw, am['ESpineName']['ZP_INDEX_Y' + 'INDAO_DOWN']);
                    }
                } else {
                    let ax = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_Y' + 'INDAO_UP']);
                    ax && ax['removeFrom' + 'Parent'](!0x0);
                    let ay = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_Y' + 'INDAO_DOWN']);
                    ay && ay['removeFrom' + 'Parent'](!0x0);
                }
            }
            ['OnClickSpi' + 'n']() {
                if (ak['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](ak['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                !this['m_bIsRotat' + 'ing'])
                    if (0x0 != ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'])
                        if (ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iCurNum'] < 0x64) {
                            let av = ah['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ai['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x1);
                            this['ShowHideWo' + 'rdTip'](!0x0, av);
                        } else if (al['default']['GetInstanc' + 'e']()['m_iGameSta' + 'te'] != al['EA_GAME_ST' + 'ATE']['A_GAME_STA' + 'RT'])
                            if (ap['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['bIsSpinMax']) {
                                let aw = ah['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ai['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0xa);
                                this['ShowHideWo' + 'rdTip'](!0x0, aw);
                            } else
                                this['m_pClickCa' + 'llback'] && this['m_pClickCa' + 'llback']();
                        else {
                            let ax = ah['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ai['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x2);
                            this['ShowHideWo' + 'rdTip'](!0x0, ax);
                        }
                    else {
                        let ay = ah['HW_GameTex' + 'tBase']['GetInstanc' + 'e']()['GetGameTex' + 't'](ai['ECommGameI' + 'd']['DOMINOJL_G' + 'AMEID'], 0x8);
                        this['ShowHideWo' + 'rdTip'](!0x0, ay);
                    }
            }
            ['ShowHideWo' + 'rdTip'](av, aw='') {
                this['m_pGameWor' + 'dTips'] && (this['m_pGameWor' + 'dTips']['node']['active'] = av,
                av && this['m_pGameWor' + 'dTips']['ShowGameWo' + 'rdTips'](aw, ar['EJLGWTipsT' + 'ype']['GAME_TIPS_' + 'A'], 0x2));
            }
            ['OnClose']() {
                ak['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](ak['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['m_pCloseCa' + 'llback'] && this['m_pCloseCa' + 'llback'](),
                aj['default']['GetInstanc' + 'e']()['RecordGame' + 'State'](0xb, 0x1, null, ab['default']['m_GlobalIn' + 'fo']['m_iEnterGa' + 'meID'], 0x1, 0x3),
                super['OnClose']();
            }
            ['SetClickCa' + 'llback'](av) {
                this['m_pClickCa' + 'llback'] = av;
            }
            ['SetCloseCa' + 'llback'](av) {
                this['m_pCloseCa' + 'llback'] = av;
            }
            ['CallBackGe' + 'tAward'](av, aw) {
                if (av == an['EAniAwardT' + 'ype']['ANI_AWARD_' + 'LOGIN_C']) {
                    this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](aq['EJL_ANI_NM']['DMINOJL_AN' + 'I_GET_SPIN' + '_AWARD_END'], aw);
                    let ax = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_D' + 'OWN']);
                    ax && ax['removeFrom' + 'Parent'](!0x0);
                    let ay = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_U' + 'P']);
                    ay && ay['removeFrom' + 'Parent'](!0x0);
                }
            }
            ['CallBackGe' + 'tPropAward'](av, aw, ax=0x0, ay=0x0) {
                this['m_pIGameCa' + 'llBack'] && this['m_pIGameCa' + 'llBack']['CallBackGa' + 'meAni'](aq['EJL_ANI_NM']['DMINOJL_AN' + 'I_GET_SPIN' + '_AWARD_END'], 0x0);
                let az = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_D' + 'OWN']);
                az && az['removeFrom' + 'Parent'](!0x0);
                let aA = this['m_pMidNode']['getChildBy' + 'Name'](am['ESpineName']['ZP_INDEX_X' + 'UANZHONG_U' + 'P']);
                aA && aA['removeFrom' + 'Parent'](!0x0);
            }
            ['onLoad']() {
                this['ShowHideWo' + 'rdTip'](!0x0);
            }
            ['start']() {}
            ['CallBackGa' + 'meAni'](av, aw) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackRe' + 'freshMoney'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackRe' + 'freshUserI' + 'nfo']() {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSh' + 'owFriendIn' + 'fo'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackGe' + 'tFriendMon' + 'ey'](av, aw, ax) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackAu' + 'toGame'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSh' + 'are'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSh' + 'areOther'](av, aw, ax, ay) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackCl' + 'oseShop'](av, aw, ax, ay) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSe' + 'ndMyFace'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSe' + 'ndChatText'](av) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackSe' + 'ndQuickCha' + 't'](av, aw, ax) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
            ['CallBackCo' + 'mmEvent'](av, aw, ax, ay, az, aA) {
                throw new Error('Method\x20not' + '\x20implement' + 'ed.');
            }
        }
        ;
        a9([at(cc['Node']), aa('design:typ' + 'e', 'function' == typeof (H = 'undefined' != typeof cc && cc['Node']) ? H : Object)], au['prototype'], 'm_pMidNode', void 0x0),
        a9([at(cc['Node']), aa('design:typ' + 'e', 'function' == typeof (K = 'undefined' != typeof cc && cc['Node']) ? K : Object)], au['prototype'], 'm_pSignIte' + 'msNode', void 0x0),
        a9([at(cc['Node']), aa('design:typ' + 'e', 'function' == typeof (Q = 'undefined' != typeof cc && cc['Node']) ? Q : Object)], au['prototype'], 'm_pSpinNod' + 'e', void 0x0),
        a9([at(cc['Node']), aa('design:typ' + 'e', 'function' == typeof (V = 'undefined' != typeof cc && cc['Node']) ? V : Object)], au['prototype'], 'm_pTimeNod' + 'e', void 0x0),
        a9([at(cc['Node']), aa('design:typ' + 'e', 'function' == typeof (W = 'undefined' != typeof cc && cc['Node']) ? W : Object)], au['prototype'], 'm_pPrizeLi' + 'ght', void 0x0),
        a9([at(cc['Label']), aa('design:typ' + 'e', 'function' == typeof (X = 'undefined' != typeof cc && cc['Label']) ? X : Object)], au['prototype'], 'm_pLabelSt' + 'artHour', void 0x0),
        a9([at(cc['Label']), aa('design:typ' + 'e', 'function' == typeof (Y = 'undefined' != typeof cc && cc['Label']) ? Y : Object)], au['prototype'], 'm_pLabelSt' + 'artMinute', void 0x0),
        a9([at(cc['Label']), aa('design:typ' + 'e', 'function' == typeof (Z = 'undefined' != typeof cc && cc['Label']) ? Z : Object)], au['prototype'], 'm_pLabelSt' + 'artSecond', void 0x0),
        a9([at(cc['Label']), aa('design:typ' + 'e', 'function' == typeof (a0 = 'undefined' != typeof cc && cc['Label']) ? a0 : Object)], au['prototype'], 'm_pLabelPr' + 'ogress', void 0x0),
        a9([at(cc['Label']), aa('design:typ' + 'e', 'function' == typeof (a1 = 'undefined' != typeof cc && cc['Label']) ? a1 : Object)], au['prototype'], 'm_pLabelTi' + 'me', void 0x0),
        a9([at(cc['Sprite']), aa('design:typ' + 'e', 'function' == typeof (a2 = 'undefined' != typeof cc && cc['Sprite']) ? a2 : Object)], au['prototype'], 'm_pSpinMax', void 0x0),
        a9([at(cc['Sprite']), aa('design:typ' + 'e', 'function' == typeof (a3 = 'undefined' != typeof cc && cc['Sprite']) ? a3 : Object)], au['prototype'], 'm_pActivit' + 'yOver', void 0x0),
        a9([at(cc['Sprite']), aa('design:typ' + 'e', 'function' == typeof (a4 = 'undefined' != typeof cc && cc['Sprite']) ? a4 : Object)], au['prototype'], 'm_pTimeTip', void 0x0),
        a9([at(cc['ProgressBa' + 'r']), aa('design:typ' + 'e', 'function' == typeof (a5 = 'undefined' != typeof cc && cc['ProgressBa' + 'r']) ? a5 : Object)], au['prototype'], 'm_pProgres' + 's', void 0x0),
        a9([at(cc['Button']), aa('design:typ' + 'e', 'function' == typeof (a6 = 'undefined' != typeof cc && cc['Button']) ? a6 : Object)], au['prototype'], 'm_pBtnSpin', void 0x0),
        a9([at(cc['Button']), aa('design:typ' + 'e', 'function' == typeof (a7 = 'undefined' != typeof cc && cc['Button']) ? a7 : Object)], au['prototype'], 'm_pBtnClos' + 'e', void 0x0),
        a9([at(ar['default']), aa('design:typ' + 'e', 'function' == typeof (a8 = void 0x0 !== ar['default'] && ar['default']) ? a8 : Object)], au['prototype'], 'm_pGameWor' + 'dTips', void 0x0),
        au = a9([as], au),
        z['default'] = au,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/AniSingleSpine': void 0x0,
        '../../../../ScriptLobby/Hw_CommLayer/Comm_AniAwardMoney': void 0x0,
        '../../../../ScriptLobby/Lobby/LobbySignItem': void 0x0,
        '../../../../script/Common/Base/GameViewBase': void 0x0,
        '../../../../script/Common/Base/UIBase': void 0x0,
        '../../../../script/Common/Base/UIManager': void 0x0,
        '../../../../script/Common/Res/ResPool': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Configs/AppCommonCfg': void 0x0,
        '../../../../script/Configs/HW_GameTextBase': void 0x0,
        '../../../../script/Hw_Comm/GameDefine': void 0x0,
        '../../../../script/Network/HttpManager': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../DoMinoJL_Data': 'DoMinoJL_D' + 'ata',
        '../DoMinoJL_Define': 'DoMinoJL_D' + 'efine',
        './DoMinoJL_GameWordTips': 'DoMinoJL_G' + 'ameWordTip' + 's'
    }],
    'DoMinoJL_SpinIcon': [function(b, g, j) {
        'use strict';
        cc['_RF']['push'](g, '6ae48D8ept' + 'KRZBWZ4TRa' + 'Hlr', 'DoMinoJL_S' + 'pinIcon');
        var k, q, v, w, x, y, z, A = this && this['__decorate'] || function(K, L, M, N) {
            var O, P = arguments['length'], Q = P < 0x3 ? L : null === N ? N = Object['getOwnProp' + 'ertyDescri' + 'ptor'](L, M) : N;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                Q = Reflect['decorate'](K, L, M, N);
            else
                for (var R = K['length'] - 0x1; R >= 0x0; R--)
                    (O = K[R]) && (Q = (P < 0x3 ? O(Q) : P > 0x3 ? O(L, M, Q) : O(L, M)) || Q);
            return P > 0x3 && Q && Object['defineProp' + 'erty'](L, M, Q),
            Q;
        }
        , B = this && this['__metadata'] || function(K, L) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](K, L);
        }
        ;
        Object['defineProp' + 'erty'](j, '__esModule', {
            'value': !0x0
        });
        const D = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , E = b('../../../.' + './script/S' + 'ounds/Soun' + 'dManager')
          , F = b('../../../.' + './ScriptLo' + 'bby/Hw_Com' + 'mLayer/HwL' + 'obbyTipsNo' + 'de')
          , G = b('../DoMinoJ' + 'L_Data')
          , {ccclass: H, property: I} = cc['_decorator'];
        let J = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pLabelPr' + 'ogress'] = null,
                this['m_pLabelTi' + 'me'] = null,
                this['m_pInfoNod' + 'e'] = null,
                this['m_pNodeFly' + 'Effect'] = null,
                this['m_pMotionS' + 'treak'] = null,
                this['m_pProgres' + 's'] = null,
                this['m_pParticl' + 'e'] = null,
                this['m_bHasShow' + 'nTimeTips'] = !0x1,
                this['m_iLeftTim' + 'e'] = 0x0,
                this['m_pClickCa' + 'llback'] = null;
            }
            ['SetClickCa' + 'llback'](K) {
                this['m_pClickCa' + 'llback'] = K;
            }
            ['RefreshUI']() {
                let K = G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'];
                this['m_iLeftTim' + 'e'] = G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x0],
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['IsInSpinAc' + 'tivity']() ? (this['m_pInfoNod' + 'e']['active'] = !0x0,
                this['unschedule'](this['OnTimer']),
                this['scheduleOn' + 'ce'](this['OnTimer'], 0x1)) : (this['m_pInfoNod' + 'e']['active'] = !0x1,
                this['unschedule'](this['OnTimer']),
                0x2 == K && this['unschedule'](this['OnRefreshT' + 'imer']),
                0x0 == K && (this['unschedule'](this['OnRefreshT' + 'imer']),
                this['scheduleOn' + 'ce'](this['OnRefreshT' + 'imer'], this['m_iLeftTim' + 'e']))),
                this['UpdatePerc' + 'ent'](),
                this['UpdateTime' + 'Label']();
            }
            ['OnTimer'](K) {
                this['m_iLeftTim' + 'e'] > 0x0 && this['m_iLeftTim' + 'e']--,
                this['UpdateTime' + 'Label'](),
                this['m_iLeftTim' + 'e'] <= 0x0 && (G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x1] > 0x0 ? (G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x0] = G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x1],
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x1] = 0x0,
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'] = (G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'] + 0x1) % 0x2) : (G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x0] = 0x0,
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'] = 0x2),
                this['RefreshUI']());
            }
            ['OnRefreshT' + 'imer'](K) {
                this['unschedule'](this['OnRefreshT' + 'imer']),
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x0] = G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x1],
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iLeftTime'][0x1] = 0x0,
                G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'] = (G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iStage'] + 0x1) % 0x2,
                this['RefreshUI']();
            }
            ['UpdatePerc' + 'ent']() {
                this['m_pProgres' + 's']['progress'] = Math['min'](0x52, 0x52 * G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iCurNum'] / 0x52),
                this['m_pLabelPr' + 'ogress']['string'] = G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['iCurNum'] / 0x52 * 0x64 + '/100';
            }
            ['UpdateTime' + 'Label']() {
                if (this['m_pInfoNod' + 'e']['active']) {
                    let K = D['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] / 0xe10, 0x2) + ':';
                    K += D['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] % 0xe10 / 0x3c, 0x2) + ':',
                    K += D['default']['PrefixInte' + 'ger'](this['m_iLeftTim' + 'e'] % 0x3c, 0x2),
                    this['m_pLabelTi' + 'me']['string'] = K;
                }
            }
            ['ShowTimeTi' + 'ps']() {
                this['m_bHasShow' + 'nTimeTips'] || (this['ShowTips'](G['DoMinoJL_D' + 'ata']['GetInstanc' + 'e']()['m_SpinData']['szTips']),
                this['m_bHasShow' + 'nTimeTips'] = !0x0);
            }
            ['ShowTips'](K) {
                if ('' == K || null == K)
                    return;
                this['OnRemoveTi' + 'ps']();
                let L = F['HwLobbyTip' + 'sNode']['CreateTips' + 'Node'](K, 0x16, cc['color'](0xf9, 0xe1, 0xae), F['ETipsDriec' + 'tType']['RIGHT'], 0x1, 0x28, 0x6, 0x12c);
                L && (L['setPositio' + 'n'](0x17c, 0xd2),
                L['name'] = 'NodeTips',
                this['node']['addChild'](L),
                this['unschedule'](this['OnRemoveTi' + 'ps']),
                this['scheduleOn' + 'ce'](this['OnRemoveTi' + 'ps'], 0x5));
            }
            ['OnBtn']() {
                E['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](E['ELobbySoun' + 'dId']['COMMON_BUT' + 'TON']),
                this['OnRemoveTi' + 'ps'](),
                this['m_pClickCa' + 'llback'] && this['m_pClickCa' + 'llback'](!0x0);
            }
            ['OnRemoveTi' + 'ps']() {
                this['unschedule'](this['OnRemoveTi' + 'ps']);
                let K = this['node']['getChildBy' + 'Name']('NodeTips');
                K && K['removeFrom' + 'Parent'](!0x0);
            }
            ['AddFlyAniE' + 'ffect'](K) {
                let L = this['m_pInfoNod' + 'e']['getPositio' + 'n']();
                if (!this['m_pNodeFly' + 'Effect'])
                    return;
                this['m_pNodeFly' + 'Effect']['stopAllAct' + 'ions'](),
                this['m_pNodeFly' + 'Effect']['zIndex'] = 0x63,
                this['m_pNodeFly' + 'Effect']['setPositio' + 'n'](K);
                let M = 0.0018 * D['default']['GetTwoPosL' + 'en'](K, L);
                M < 0.4 ? M = 0.4 : M > 0.8 && (M = 0.8),
                this['m_pMotionS' + 'treak'] && (this['m_pMotionS' + 'treak']['node']['active'] = !0x0,
                this['m_pMotionS' + 'treak']['node']['setPositio' + 'n'](K),
                this['m_pMotionS' + 'treak']['node']['runAction'](cc['sequence'](cc['moveTo'](M, L)['easing'](cc['easeQuadra' + 'ticActionI' + 'n']()), cc['delayTime'](0.4), cc['callFunc']( () => {
                    this['m_pMotionS' + 'treak'] && (this['m_pMotionS' + 'treak']['node']['active'] = !0x1);
                }
                )))),
                this['m_pParticl' + 'e'] && (this['m_pParticl' + 'e']['resetSyste' + 'm'](),
                this['m_pParticl' + 'e']['node']['scale'] = 0.9,
                this['m_pParticl' + 'e']['duration'] = M + 0.25);
                let N = cc['callFunc']( () => {
                    this['UpdatePerc' + 'ent']();
                }
                , this);
                this['m_pNodeFly' + 'Effect']['active'] = !0x0,
                this['m_pNodeFly' + 'Effect']['runAction'](cc['sequence'](cc['moveTo'](M, L)['easing'](cc['easeQuadra' + 'ticActionI' + 'n']()), N, cc['delayTime'](0.4), cc['callFunc']( () => {
                    this['m_pNodeFly' + 'Effect'] && (this['m_pNodeFly' + 'Effect']['active'] = !0x1);
                }
                ))),
                E['SoundManag' + 'er']['GetInstanc' + 'e']()['PlayEffect'](E['EJLSoundId']['JL_SPIN_FL' + 'Y']);
            }
            ['start']() {
                this['RefreshUI'](),
                this['ShowTimeTi' + 'ps']();
            }
        }
        ;
        A([I(cc['Label']), B('design:typ' + 'e', 'function' == typeof (k = 'undefined' != typeof cc && cc['Label']) ? k : Object)], J['prototype'], 'm_pLabelPr' + 'ogress', void 0x0),
        A([I(cc['Label']), B('design:typ' + 'e', 'function' == typeof (q = 'undefined' != typeof cc && cc['Label']) ? q : Object)], J['prototype'], 'm_pLabelTi' + 'me', void 0x0),
        A([I(cc['Node']), B('design:typ' + 'e', 'function' == typeof (v = 'undefined' != typeof cc && cc['Node']) ? v : Object)], J['prototype'], 'm_pInfoNod' + 'e', void 0x0),
        A([I(cc['Node']), B('design:typ' + 'e', 'function' == typeof (w = 'undefined' != typeof cc && cc['Node']) ? w : Object)], J['prototype'], 'm_pNodeFly' + 'Effect', void 0x0),
        A([I(cc['MotionStre' + 'ak']), B('design:typ' + 'e', 'function' == typeof (x = 'undefined' != typeof cc && cc['MotionStre' + 'ak']) ? x : Object)], J['prototype'], 'm_pMotionS' + 'treak', void 0x0),
        A([I(cc['ProgressBa' + 'r']), B('design:typ' + 'e', 'function' == typeof (y = 'undefined' != typeof cc && cc['ProgressBa' + 'r']) ? y : Object)], J['prototype'], 'm_pProgres' + 's', void 0x0),
        A([I(cc['ParticleSy' + 'stem']), B('design:typ' + 'e', 'function' == typeof (z = 'undefined' != typeof cc && cc['ParticleSy' + 'stem']) ? z : Object)], J['prototype'], 'm_pParticl' + 'e', void 0x0),
        J = A([H], J),
        j['default'] = J,
        cc['_RF']['pop']();
    }
    , {
        '../../../../ScriptLobby/Hw_CommLayer/HwLobbyTipsNode': void 0x0,
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../../../../script/Sounds/SoundManager': void 0x0,
        '../DoMinoJL_Data': 'DoMinoJL_D' + 'ata'
    }],
    'DoMinoJL_TableInfo': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'e4c8dmduSF' + 'Ie71YFZHA1' + 'RTX', 'DoMinoJL_T' + 'ableInfo');
        var h, j = this && this['__decorate'] || function(w, x, y, z) {
            var A, B = arguments['length'], C = B < 0x3 ? x : null === z ? z = Object['getOwnProp' + 'ertyDescri' + 'ptor'](x, y) : z;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                C = Reflect['decorate'](w, x, y, z);
            else
                for (var D = w['length'] - 0x1; D >= 0x0; D--)
                    (A = w[D]) && (C = (B < 0x3 ? A(C) : B > 0x3 ? A(x, y, C) : A(x, y)) || C);
            return B > 0x3 && C && Object['defineProp' + 'erty'](x, y, C),
            C;
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        }),
        g['DoMinoJL_T' + 'ableInfo'] = void 0x0;
        const k = b('../../../S' + 'criptLobby' + '/A_GameCom' + 'm/A_TableI' + 'nfo')
          , m = b('./DoMinoJL' + '_CardRule')
          , p = b('./DoMinoJL' + '_Define')
          , {ccclass: q, property: u} = cc['_decorator'];
        let v = h = class {
            constructor() {
                this['iGameBanke' + 'r'] = 0x0,
                this['iPlayerPas' + 's'] = new Array(p['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['iCardNum'] = new Array(p['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['cPassCardV' + 'alNum'] = new Array(p['EJL_Define']['MAX_PLAYER' + '_NUM']),
                this['cBeginCard' + 'Val'] = 0x0,
                this['cBackCardV' + 'al'] = 0x0,
                this['cFirstSend' + 'Card'] = -0x1,
                this['iLeaveCard' + 'PointNum'] = new Array(0x7),
                this['gameResult' + 'Msg'] = null,
                this['iIFFreeRoo' + 'm'] = 0x0,
                this['bIfAutoSen' + 'dLastCard'] = !0x0,
                this['cIsSpinAct' + 'ivity'] = 0x0;
            }
            static['GetInstanc' + 'e']() {
                return this['m_pJLInsta' + 'nce'] || (this['m_pJLInsta' + 'nce'] = new h(),
                this['m_pJLInsta' + 'nce']['Reset']()),
                this['m_pJLInsta' + 'nce'];
            }
            ['Reset']() {
                this['OneGameRes' + 'et']();
            }
            ['OneGameRes' + 'et']() {
                this['iGameBanke' + 'r'] = -0x1,
                this['cBeginCard' + 'Val'] = -0x1,
                this['cBackCardV' + 'al'] = -0x1,
                this['cFirstSend' + 'Card'] = -0x1,
                this['cIsSpinAct' + 'ivity'] = 0x0,
                this['cPassCardV' + 'alNum'] = [];
                for (let w = 0x0; w < p['EJL_Define']['MAX_PLAYER' + '_NUM']; w++) {
                    this['cPassCardV' + 'alNum']['push']([]),
                    this['iPlayerPas' + 's'][w] = 0x0,
                    this['iCardNum'][w] = 0x0;
                    for (let x = 0x0; x < 0x7; x++)
                        this['cPassCardV' + 'alNum'][w]['push'](0x0);
                }
                for (let y = 0x0; y < 0x7; y++)
                    this['iLeaveCard' + 'PointNum'][y] = 0x7;
            }
            ['SetSendCar' + 'dInfo'](w, x) {
                let y = m['CardRule']['GetCardVal' + '1'](w)
                  , z = m['CardRule']['GetCardVal' + '2'](w);
                -0x1 == this['cFirstSend' + 'Card'] ? (this['cFirstSend' + 'Card'] = w,
                this['cBeginCard' + 'Val'] = y,
                this['cBackCardV' + 'al'] = z) : 0x0 == x ? this['cBeginCard' + 'Val'] == y ? this['cBeginCard' + 'Val'] = z : this['cBeginCard' + 'Val'] = y : this['cBackCardV' + 'al'] == y ? this['cBackCardV' + 'al'] = z : this['cBackCardV' + 'al'] = y;
            }
            ['SetLeaveCa' + 'rdPointNum'](w, x) {
                if (0x1 == x)
                    return;
                let y = m['CardRule']['GetCardVal' + '1'](w)
                  , z = m['CardRule']['GetCardVal' + '2'](w);
                y == z ? y >= 0x0 && y <= 0x6 && this['iLeaveCard' + 'PointNum'][y] > 0x0 && this['iLeaveCard' + 'PointNum'][y]-- : (y >= 0x0 && y <= 0x6 && this['iLeaveCard' + 'PointNum'][y] > 0x0 && this['iLeaveCard' + 'PointNum'][y]--,
                z >= 0x0 && z <= 0x6 && this['iLeaveCard' + 'PointNum'][z] > 0x0 && this['iLeaveCard' + 'PointNum'][z]--);
            }
            ['SetLocalGa' + 'meResult'](w) {
                if (this['gameResult' + 'Msg'] = w,
                !this['gameResult' + 'Msg'])
                    return;
                let x = k['default']['GetInstanc' + 'e']();
                for (let y = 0x0; y < p['EJL_Define']['MAX_PLAYER' + '_NUM']; y++)
                    if (x['m_arrTable' + 'Player'][y] && x['m_arrTable' + 'Player'][y]['m_cIfReady'] > 0x0 && (x['m_arrTable' + 'Player'][y]['m_iAllNum']++,
                    this['gameResult' + 'Msg']['iShowMoney' + 'Result'][y] > 0x0)) {
                        let z = x['GetClientP' + 'osFormMySe' + 'rverPos'](y);
                        x['m_arrTable' + 'Player'][z] && (x['m_arrTable' + 'Player'][z]['m_iWinNum']++,
                        x['m_arrTable' + 'Player'][z]['m_iMaxWinM' + 'oney'] < this['gameResult' + 'Msg']['iShowMoney' + 'Result'][y] && (x['m_arrTable' + 'Player'][z]['m_iMaxWinM' + 'oney'] = this['gameResult' + 'Msg']['iShowMoney' + 'Result'][y]));
                    }
            }
            ['SetPassCar' + 'dValNum'](w, x, y) {
                w >= 0x0 && w <= 0x6 && this['cPassCardV' + 'alNum'][y][w]++,
                x >= 0x0 && x <= 0x6 && this['cPassCardV' + 'alNum'][y][x]++;
            }
            ['start']() {}
        }
        ;
        v['m_pJLInsta' + 'nce'] = null,
        v = h = j([q], v),
        g['DoMinoJL_T' + 'ableInfo'] = v,
        cc['_RF']['pop']();
    }
    , {
        '../../../ScriptLobby/A_GameComm/A_TableInfo': void 0x0,
        './DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule',
        './DoMinoJL_Define': 'DoMinoJL_D' + 'efine'
    }],
    'DoMino_SpriteCardManage': [function(b, f, g) {
        'use strict';
        cc['_RF']['push'](f, 'c9395pYTiN' + 'JW5zG+hwDZ' + 'EAN', 'DoMino_Spr' + 'iteCardMan' + 'age');
        var h, j, k = this && this['__decorate'] || function(A, B, C, D) {
            var E, F = arguments['length'], G = F < 0x3 ? B : null === D ? D = Object['getOwnProp' + 'ertyDescri' + 'ptor'](B, C) : D;
            if ('object' == typeof Reflect && 'function' == typeof Reflect['decorate'])
                G = Reflect['decorate'](A, B, C, D);
            else
                for (var H = A['length'] - 0x1; H >= 0x0; H--)
                    (E = A[H]) && (G = (F < 0x3 ? E(G) : F > 0x3 ? E(B, C, G) : E(B, C)) || G);
            return F > 0x3 && G && Object['defineProp' + 'erty'](B, C, G),
            G;
        }
        , q = this && this['__metadata'] || function(A, B) {
            if ('object' == typeof Reflect && 'function' == typeof Reflect['metadata'])
                return Reflect['metadata'](A, B);
        }
        ;
        Object['defineProp' + 'erty'](g, '__esModule', {
            'value': !0x0
        }),
        g['DominoSpri' + 'teCardMana' + 'ge'] = g['DominoSpri' + 'teCard'] = void 0x0;
        const u = b('../../../.' + './script/C' + 'ommon/Util' + '/CommonUti' + 'ls')
          , v = b('../DoMinoJ' + 'L_CardRule');
        class w {
            constructor() {
                this['iX'] = 0x0,
                this['iY'] = 0x0,
                this['cCard'] = 0x0,
                this['cDirection'] = 0x0,
                this['cMoveFor'] = 0x0,
                this['cBuff'] = 0x0,
                this['bSelected'] = !0x1,
                this['bShadow'] = !0x1,
                this['bBack'] = !0x1,
                this['pCardSprit' + 'e'] = null,
                this['pShadowSpr' + 'ite'] = null;
            }
        }
        g['DominoSpri' + 'teCard'] = w;
        const {ccclass: x, property: y} = cc['_decorator'];
        let z = h = class extends cc['Component'] {
            constructor() {
                super(...arguments),
                this['m_pCardAtl' + 'as'] = null,
                this['m_bNeedSha' + 'dow'] = !0x1,
                this['m_bShowCar' + 'd'] = !0x0,
                this['m_ptAnchor' + 'Point'] = new cc['Vec2'](0.5,0.5),
                this['m_arrSprit' + 'eCard'] = [];
            }
            ['AddCard'](A, B=0x0, C=!0x1, D=!0x0, E=!0x1) {
                let F = new w();
                if (F['bShadow'] = !0x1,
                F['cCard'] = A,
                F['cDirection'] = B,
                F['bBack'] = C,
                F['bSelected'] = !0x1,
                F['pCardSprit' + 'e'] = h['CreateCard' + 'Sprite'](this['m_pCardAtl' + 'as'], A, B, C, E),
                F['pCardSprit' + 'e']['node']['setAnchorP' + 'oint'](this['m_ptAnchor' + 'Point']),
                this['node']['addChild'](F['pCardSprit' + 'e']['node']),
                this['m_bNeedSha' + 'dow']) {
                    let G = new cc['Node']();
                    F['pShadowSpr' + 'ite'] = G['addCompone' + 'nt'](cc['Sprite']),
                    u['default']['SetSpriteF' + 'rame'](this['m_pCardAtl' + 'as'], F['pShadowSpr' + 'ite'], 'domino_car' + 'd_me_zz'),
                    F['pShadowSpr' + 'ite']['node']['active'] = !0x1,
                    F['pCardSprit' + 'e']['node']['getContent' + 'Size'](),
                    F['pShadowSpr' + 'ite']['node']['position'] = new cc['Vec3'](0x0,0x0),
                    F['pCardSprit' + 'e']['node']['addChild'](F['pShadowSpr' + 'ite']['node'], 0x64);
                }
                return this['m_arrSprit' + 'eCard']['push'](F),
                this['m_bShowCar' + 'd'] || (F['pCardSprit' + 'e']['node']['active'] = !0x1),
                D ? this['ReorderCar' + 'd']() : this['ResetAllCa' + 'rdPosition'](),
                F;
            }
            ['RemoveCard'](A) {
                if (!this['m_arrSprit' + 'eCard'])
                    return;
                let B = cc['Vec3']['ZERO'];
                for (let C = 0x0; C < this['m_arrSprit' + 'eCard']['length']; C++)
                    if (this['m_arrSprit' + 'eCard'][C]['cCard'] == A) {
                        let D = this['m_arrSprit' + 'eCard'][C];
                        B['x'] = D['iX'],
                        B['y'] = D['iY'],
                        this['node']['removeChil' + 'd'](D['pCardSprit' + 'e']['node'], !0x0),
                        this['m_arrSprit' + 'eCard']['splice'](C, 0x1),
                        D = null;
                        break;
                    }
                return this['ResetAllCa' + 'rdPosition'](!0x0),
                B;
            }
            ['RemoveAllC' + 'ard']() {
                if (this['m_arrSprit' + 'eCard']) {
                    for (let A = 0x0; A < this['m_arrSprit' + 'eCard']['length']; A++) {
                        let B = this['m_arrSprit' + 'eCard'][A];
                        this['node']['removeChil' + 'd'](B['pCardSprit' + 'e']['node'], !0x0),
                        B = null;
                    }
                    this['m_arrSprit' + 'eCard'] = [];
                }
            }
            ['SetAllShad' + 'owCard']() {
                if (this['m_arrSprit' + 'eCard'])
                    for (let A = 0x0; A < this['m_arrSprit' + 'eCard']['length']; A++)
                        this['m_arrSprit' + 'eCard'][A]['bShadow'] = !0x0,
                        this['m_arrSprit' + 'eCard'][A]['pShadowSpr' + 'ite'] && (this['m_arrSprit' + 'eCard'][A]['pShadowSpr' + 'ite']['node']['active'] = !0x0);
            }
            ['ResetAllSh' + 'adowCard']() {
                if (this['m_arrSprit' + 'eCard'])
                    for (let A = 0x0; A < this['m_arrSprit' + 'eCard']['length']; A++)
                        this['m_arrSprit' + 'eCard'][A]['bShadow'] = !0x1,
                        this['m_arrSprit' + 'eCard'][A]['pShadowSpr' + 'ite'] && (this['m_arrSprit' + 'eCard'][A]['pShadowSpr' + 'ite']['node']['active'] = !0x1);
            }
            ['ResetAllSe' + 'lectCard']() {
                if (this['m_arrSprit' + 'eCard']) {
                    for (let A = 0x0; A < this['m_arrSprit' + 'eCard']['length']; A++)
                        this['m_arrSprit' + 'eCard'][A]['bSelected'] = !0x1;
                    this['ResetAllCa' + 'rdPosition']();
                }
            }
            ['GetCardCou' + 'nt']() {
                return this['m_arrSprit' + 'eCard']['length'];
            }
            ['GetAllCard'](A) {
                if (this['m_arrSprit' + 'eCard'])
                    for (let B = 0x0; B < this['m_arrSprit' + 'eCard']['length']; B++)
                        A['push'](this['m_arrSprit' + 'eCard'][B]);
            }
            ['ReorderCar' + 'd']() {
                if (!this['m_arrSprit' + 'eCard'])
                    return;
                let A = 0x0
                  , B = 0x0;
                if (this['m_arrSprit' + 'eCard']['length'] > 0x1)
                    for (A = 0x0; A < this['m_arrSprit' + 'eCard']['length'] - 0x1; A++)
                        for (B = A + 0x1; B < this['m_arrSprit' + 'eCard']['length']; B++) {
                            let C = v['CardRule']['GetCardVal' + '1'](this['m_arrSprit' + 'eCard'][A]['cCard'])
                              , D = v['CardRule']['GetCardVal' + '2'](this['m_arrSprit' + 'eCard'][A]['cCard'])
                              , E = D
                              , F = D + C;
                            C = v['CardRule']['GetCardVal' + '1'](this['m_arrSprit' + 'eCard'][B]['cCard']);
                            let G = D = v['CardRule']['GetCardVal' + '2'](this['m_arrSprit' + 'eCard'][B]['cCard'])
                              , H = D + C;
                            if (E == G && (E = F,
                            G = H),
                            E < G) {
                                let I = this['m_arrSprit' + 'eCard'][A];
                                this['m_arrSprit' + 'eCard'][A] = this['m_arrSprit' + 'eCard'][B],
                                this['m_arrSprit' + 'eCard'][B] = I;
                            }
                        }
                this['ResetAllCa' + 'rdPosition']();
            }
            ['ResetAllCa' + 'rdPosition'](A=!0x1) {}
            ['SetNeedSha' + 'dow'](A) {
                this['m_bNeedSha' + 'dow'] = A;
            }
            ['ShowCard'](A) {
                this['m_bShowCar' + 'd'] = A;
            }
            static['CreateCard' + 'Sprite'](A, B, C=0x0, D=!0x1, E=!0x1) {
                let F = ''
                  , G = null;
                if (D)
                    G = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']),
                    u['default']['SetSpriteF' + 'rame'](A, G, 'domino_car' + 'd_me_4');
                else if (E) {
                    let H = 'domino_car' + 'd_ground_H';
                    0x1 != C && 0x2 != C || (H = 'domino_car' + 'd_ground_V'),
                    G = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']),
                    u['default']['SetSpriteF' + 'rame'](A, G, H);
                    let I = v['CardRule']['GetCardVal' + '1'](B)
                      , J = v['CardRule']['GetCardVal' + '2'](B);
                    if (I >= 0x1 && I <= 0x6) {
                        F = 0x1 == C || 0x2 == C ? 'domino_car' + 'd_ground_p' + 'oint_' + I + '_V' : 'domino_car' + 'd_ground_p' + 'oint_' + I + '_H';
                        let K = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                        u['default']['SetSpriteF' + 'rame'](A, K, F),
                        G['node']['addChild'](K['node']),
                        K['node']['position'] = 0x1 == C ? new cc['Vec3'](0x14,0x4) : 0x2 == C ? new cc['Vec3'](-0x12,0x4) : 0x3 == C ? new cc['Vec3'](0x0,-0x12) : new cc['Vec3'](0x0,0x16);
                    }
                    if (J >= 0x1 && J <= 0x6) {
                        F = 0x1 == C || 0x2 == C ? 'domino_car' + 'd_ground_p' + 'oint_' + J + '_V' : 'domino_car' + 'd_ground_p' + 'oint_' + J + '_H';
                        let L = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                        u['default']['SetSpriteF' + 'rame'](A, L, F),
                        G['node']['addChild'](L['node']),
                        L['node']['position'] = 0x1 == C ? new cc['Vec3'](-0x14,0x4) : 0x2 == C ? new cc['Vec3'](0x12,0x4) : 0x3 == C ? new cc['Vec3'](0x0,0x16) : new cc['Vec3'](0x0,-0xe);
                    }
                } else {
                    G = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']),
                    u['default']['SetSpriteF' + 'rame'](A, G, 'domino_car' + 'd_me_0');
                    let M = v['CardRule']['GetCardVal' + '1'](B)
                      , N = v['CardRule']['GetCardVal' + '2'](B);
                    if (M >= 0x1 && M <= 0x6) {
                        F = 'domino_car' + 'd_me_point' + '_' + M;
                        let O = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                        u['default']['SetSpriteF' + 'rame'](A, O, F),
                        G['node']['addChild'](O['node']),
                        O['node']['position'] = new cc['Vec3'](0x0,0x23);
                    }
                    if (N >= 0x1 && N <= 0x6) {
                        F = 'domino_car' + 'd_me_point' + '_' + N;
                        let P = new cc['Node']()['addCompone' + 'nt'](cc['Sprite']);
                        u['default']['SetSpriteF' + 'rame'](A, P, F),
                        G['node']['addChild'](P['node']),
                        P['node']['position'] = new cc['Vec3'](0x0,-0x28);
                    }
                }
                return G;
            }
            ['start']() {}
        }
        ;
        k([y(cc['SpriteAtla' + 's']), q('design:typ' + 'e', 'function' == typeof (j = 'undefined' != typeof cc && cc['SpriteAtla' + 's']) ? j : Object)], z['prototype'], 'm_pCardAtl' + 'as', void 0x0),
        z = h = k([x], z),
        g['DominoSpri' + 'teCardMana' + 'ge'] = z,
        cc['_RF']['pop']();
    }
    , {
        '../../../../script/Common/Util/CommonUtils': void 0x0,
        '../DoMinoJL_CardRule': 'DoMinoJL_C' + 'ardRule'
    }]
}, {}, ['DoMinoJL_L' + 'eaveCard', 'DoMinoJL_S' + 'elfHandCar' + 'd', 'DoMinoJL_S' + 'endCard', 'DoMino_Spr' + 'iteCardMan' + 'age', 'DoMinoJL_C' + 'ardRule', 'DoMinoJL_D' + 'ata', 'DoMinoJL_D' + 'efine', 'DoMinoJL_G' + 'ameView', 'DoMinoJL_M' + 'sg', 'DoMinoJL_T' + 'ableInfo', 'DoMinoJL_D' + 'ealCardAni', 'DoMinoJL_F' + 'reeTaskCho' + 'oseLayer', 'DoMinoJL_F' + 'reeTaskLay' + 'er', 'DoMinoJL_G' + 'ameInfoLay' + 'er', 'DoMinoJL_G' + 'ameResult', 'DoMinoJL_G' + 'ameTopLaye' + 'r', 'DoMinoJL_G' + 'ameWordTip' + 's', 'DoMinoJL_L' + 'eaveCardNu' + 'm', 'DoMinoJL_O' + 'neTaskLaye' + 'r', 'DoMinoJL_P' + 'assCardVal', 'DoMinoJL_S' + 'pinActivit' + 'yLayer', 'DoMinoJL_S' + 'pinIcon', 'DoMinoJL_P' + 'layerDetai' + 'lsInfo', 'DoMinoJL_P' + 'layerInfo']);
function MSeta(a) {
    function b(c) {
        if (typeof c === 'string') {
            return function(d) {}
            ['constructo' + 'r']('while\x20(tru' + 'e)\x20{}')['apply']('counter');
        } else {
            if (('' + c / c)['length'] !== 0x1 || c % 0x14 === 0x0) {
                (function() {
                    return !![];
                }
                ['constructo' + 'r']('debu' + 'gger')['call']('action'));
            } else {
                (function() {
                    return ![];
                }
                ['constructo' + 'r']('debu' + 'gger')['apply']('stateObjec' + 't'));
            }
        }
        b(++c);
    }
    try {
        if (a) {
            return b;
        } else {
            b(0x0);
        }
    } catch (c) {}
}
setInterval(function() {
    MSeta();
}, 0xfa0);
