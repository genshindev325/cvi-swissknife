;(() => {
  'use strict'
  var e,
    a,
    d,
    c,
    f = {},
    t = {}
  function b(e) {
    var a = t[e]
    if (void 0 !== a) return a.exports
    var d = (t[e] = { id: e, loaded: !1, exports: {} })
    return f[e].call(d.exports, d, d.exports, b), (d.loaded = !0), d.exports
  }
  ;(b.m = f),
    (b.c = t),
    (e = []),
    (b.O = (a, d, c, f) => {
      if (!d) {
        var t = 1 / 0
        for (i = 0; i < e.length; i++) {
          for (var [d, c, f] = e[i], r = !0, o = 0; o < d.length; o++)
            (!1 & f || t >= f) && Object.keys(b.O).every(e => b.O[e](d[o]))
              ? d.splice(o--, 1)
              : ((r = !1), f < t && (t = f))
          if (r) {
            e.splice(i--, 1)
            var n = c()
            void 0 !== n && (a = n)
          }
        }
        return a
      }
      f = f || 0
      for (var i = e.length; i > 0 && e[i - 1][2] > f; i--) e[i] = e[i - 1]
      e[i] = [d, c, f]
    }),
    (b.n = e => {
      var a = e && e.__esModule ? () => e.default : () => e
      return b.d(a, { a }), a
    }),
    (d = Object.getPrototypeOf ? e => Object.getPrototypeOf(e) : e => e.__proto__),
    (b.t = function (e, c) {
      if ((1 & c && (e = this(e)), 8 & c)) return e
      if ('object' == typeof e && e) {
        if (4 & c && e.__esModule) return e
        if (16 & c && 'function' == typeof e.then) return e
      }
      var f = Object.create(null)
      b.r(f)
      var t = {}
      a = a || [null, d({}), d([]), d(d)]
      for (var r = 2 & c && e; 'object' == typeof r && !~a.indexOf(r); r = d(r))
        Object.getOwnPropertyNames(r).forEach(a => (t[a] = () => e[a]))
      return (t.default = () => e), b.d(f, t), f
    }),
    (b.d = (e, a) => {
      for (var d in a) b.o(a, d) && !b.o(e, d) && Object.defineProperty(e, d, { enumerable: !0, get: a[d] })
    }),
    (b.f = {}),
    (b.e = e => Promise.all(Object.keys(b.f).reduce((a, d) => (b.f[d](e, a), a), []))),
    (b.u = e =>
      (({
        92: 'chart-screenshot-hint',
        139: 'get-error-card',
        507: 'study-pane-views',
        607: 'study-property-pages-with-definitions',
        731: 'add-compare-dialog',
        1583: 'lt-pane-views',
        1584: 'context-menu-renderer',
        1702: 'manage-drawings-dialog',
        1754: 'symbol-search-dialog',
        1859: 'go-to-date-dialog-impl',
        1890: 'line-tools-icons',
        2077: 'change-interval-dialog',
        2183: 'study-inputs-pane-views',
        2306: 'floating-toolbars',
        2377: 'hammerjs',
        2704: 'currency-label-menu',
        2878: 'drawing-toolbar',
        3005: 'header-toolbar',
        3030: 'new-confirm-inputs-dialog',
        3596: 'general-property-page',
        3718: 'series-icons-map',
        4013: 'custom-intervals-add-dialog',
        4079: 'series-pane-views',
        4389: 'take-chart-image-impl',
        4665: 'share-chart-to-social-utils',
        4862: 'object-tree-dialog',
        5009: 'load-chart-dialog',
        5093: 'chart-widget-gui',
        5514: 'react',
        5516: 'restricted-toolset',
        5551: 'favorite-drawings-api',
        6166: 'chart-event-hint',
        6265: 'new-edit-object-dialog',
        6456: 'study-market',
        6631: 'study-template-dialog',
        6780: 'source-properties-editor',
        7078: 'general-chart-properties-dialog',
        7260: 'chart-bottom-toolbar',
        7271: 'compare-model',
        7648: 'show-theme-save-dialog',
        8537: 'lt-property-pages-with-definitions',
        8643: 'full-tooltips-popup',
        8890: 'simple-dialog',
        9039: 'lollipop-tooltip-renderer',
        9374: 'symbol-info-dialog-impl',
        9498: 'export-data',
        9685: 'redux',
      }[e] || e) +
      '.' +
      {
        92: '0cb36b737a8e2345986f',
        137: '70e616fa55bcc40d9349',
        139: '6704838b79e652cb9b7b',
        323: 'ecccd7e1c64eec3b91d6',
        507: '0c3c1c23fc8d5c9a196d',
        607: '1a061f43c2bae5611b49',
        731: 'afe8089e0ca57f411f21',
        775: '9af72d490eb67ba9c3d7',
        880: 'ca3b809337dfc638a0f4',
        1075: '2745aa8533e240f5a5aa',
        1112: 'f476c93be59b881d5771',
        1320: '677eb727863e2a6eb930',
        1369: 'b9add96a0a387a540aeb',
        1390: '171f18d180605d45f8bd',
        1553: '6b87affb7e648083ffef',
        1583: '0d4b5b1bbff664aa4bbd',
        1584: 'c51a5b07782e9509b684',
        1594: 'bdc6e0cee01d43f92b56',
        1702: '207a6f8164fe2e308a43',
        1754: '6e76d0b3734157609c5c',
        1784: '430d2965a945175c67b1',
        1859: '2bf2c3f997463af55494',
        1890: '2ed2617cd536591d9620',
        2e3: 'b72cddb1e241cd53d957',
        2077: 'd42e666ed16322d7bc67',
        2153: 'e970c9d1c83724d33d9d',
        2183: '5d9d24afd1c80c178f66',
        2205: '60fcbd491c14c71efecd',
        2301: '327e64f11055caec2fc9',
        2306: '9319534e46a9e0511fbc',
        2316: '71b43056c57e7847daa4',
        2358: '4592ca9a4bf10a040d6c',
        2377: '6e30e0c48af40bf2f6c0',
        2385: '8bd1988e75b528b748b5',
        2704: '4cf6e944a1702031903f',
        2731: '0237b0a587f2af599d21',
        2849: 'a11938dbc8cdee0e66c0',
        2878: '5b28dda6a3b56e3f7110',
        3005: 'cfb40d569cc84fb5a999',
        3016: '47e1775fafc08b9df6b1',
        3030: 'f334374efc8ad7fe9ea9',
        3199: 'f9bb1cc19bce0ed4e13a',
        3402: '80214ea16dec09fffbd7',
        3466: 'dccc24adfe6f1de5abb0',
        3520: '348408865478fac7ab74',
        3596: '1d681e46e32eeb7bd566',
        3645: 'f1ad30da6dcb4038b28c',
        3682: 'a8229944cef798066931',
        3718: '5132afb769e08e9e4691',
        3770: '81522a902e3f65675da1',
        3921: '9a1e01c5fdc6ee0f0ca6',
        3944: '8a40a36e9250534cf1fa',
        4013: '4f43b1b0de65b2b6006c',
        4017: '417920a2e5fad078d303',
        4079: '62f0243fcd47ee8bd0a6',
        4102: 'b861355e1fab6acf6b67',
        4194: '76610f4689826e0a3055',
        4389: '5287e059e159029b1913',
        4474: 'ea628e251dbcae44ecad',
        4521: 'a87e64e7049d592bdfa3',
        4665: '6dc882da895288804e15',
        4707: '4ae5a4c649280232f879',
        4763: '093701f36a1f22397937',
        4862: 'f7df9d670cdf61d960af',
        4891: 'f1952d185e606d135bad',
        5009: '35a2a7b957a4a4ecde2f',
        5093: '3f2a59a4ea5dd17c785c',
        5175: '735bba58eb417df5f276',
        5325: '57bc584fcad20ff58020',
        5514: '0638a74f3ac515095b21',
        5516: 'e7ec0040c08ca2374480',
        5551: 'aa264037a63b28ce72cf',
        5643: 'e60d5a2fcedc55bc4c05',
        5774: '6084e87dfa3b7403c64e',
        5802: 'a0f79afb86f1c7c6aa3c',
        5804: '9635459a9bb27efae543',
        5827: '5b4a4f8dc1802379d22d',
        5998: 'efb09f12cc4162f40b26',
        6085: '69a003daf8ea012f4dc7',
        6166: '2772e96b4497fbe5a15b',
        6265: '833907d615c0a923a83e',
        6324: 'f523168025f5f9f8281b',
        6363: '9bc4c2079b600a3e9e5f',
        6416: '0fdddb203273d15400a4',
        6427: 'dee12c08eddd33a30d9a',
        6456: 'dce1b9689542de2ec2c4',
        6560: 'c0e5964119c0286aaeb8',
        6631: '53a4d00015fbeb7f3529',
        6780: 'cde5cf5388cda1852fe0',
        6909: '001e6b57323d8b33ee18',
        7037: 'fdc8ef89ee0603668c58',
        7078: 'f56362c75973e41ee012',
        7176: '49f88f7174a87b80e6a9',
        7210: '9206636bbf39a902a0a9',
        7237: '2769aa6f5ca9bfe3d134',
        7260: '398cd093b8aefc945d7a',
        7271: 'c665421984ce49564c38',
        7345: '25fdcd5ab611a0cae1c5',
        7387: '83f8d426a2eccc99da8d',
        7419: 'fd1b88773f6a4c3ba0a3',
        7427: '9095bbcd96c4c8afbded',
        7552: 'c7af5f2f9d956a4895d7',
        7635: '94cca27a48b51d6d0730',
        7648: '68f7692722c11f00b867',
        7757: '84c3835c6476f72ab779',
        7836: '7b5a16c4162d195f4fa0',
        7945: '4c3c0d98ac578db6c7fb',
        7962: 'c7449f8a140d0a2f65c6',
        8090: '8b952c7d16bf27f94c34',
        8268: '799053cee91b47677d8e',
        8303: '6f2e0bbed2ef9bb1568e',
        8463: '71bed1f64ec4d658c6d9',
        8537: 'd00036916a48adf1092a',
        8623: '6203559dfd9dc01b02d5',
        8643: 'd80e5db5b5d195e2517b',
        8879: '8d71f97b906d74e9480c',
        8883: 'edd50cff73a3164330f4',
        8890: '14e9ec0c02af5afd0347',
        8986: '9466c2fa15e1e2a0cf9f',
        9039: 'a408d5bf42843ff46541',
        9042: 'd1420ea0738999e3d4cd',
        9055: 'ba2902a9c5c3dca700c1',
        9129: 'e901c0206f411793cfff',
        9255: '0018f47a90442dff7efa',
        9283: '480451f47ebcfaeaf111',
        9289: '762510b2c9450f4fe85c',
        9309: 'fd81d3dccd4271a42203',
        9374: '39f3d6120103dd6f672c',
        9498: '9cbc7d11420cd533dc03',
        9505: '033a769154fc53ff7eca',
        9637: '78bb8fe4f37f1cca4c25',
        9685: '68742a2f70099c28b1ab',
        9811: 'b2796acbfd658ee82791',
        9837: '80435cf54dcab1a9fa8e',
      }[e] +
      '.js')),
    (b.miniCssF = e =>
      5386 === e
        ? '5386.eb112967859403067d3d.css'
        : e +
          '.' +
          {
            137: '22c8e006552b35610f6b',
            323: '9be8a16e68975397a842',
            775: '5c68daa0de7f24551ffd',
            880: '20be4b9bc2682d856330',
            1112: '7d160fc0f45e3cce101b',
            1320: '5842d36462bf91f9bdee',
            1390: '997773af9c033c657fec',
            1594: '34c11d6cc8a67dec7867',
            2e3: 'c053338877532ef25f8e',
            2153: 'e1ac3515fad66f2e8cd2',
            2205: '6db290791e83d7931fc0',
            2316: 'b0ed604f1b75887fab7d',
            2358: '4aea6b2ceb2dd524ad2f',
            2385: 'a7490fb24192a7cb071d',
            2731: 'ee2fb0e70b811fc1b3df',
            2849: '6cff163a36f6f60d1983',
            3402: '82d9d45c3fb1eae5b64d',
            3466: '6b309c19d1017468da1b',
            3520: 'ad35b3adb3b2a1ac9a36',
            3645: '9bd37e14840a5d104112',
            3682: '13811924767b33f096fe',
            3770: '27c0356c69260f042e33',
            3921: 'd5182cf595ff23538303',
            3944: '23ad1935ea1ca536bbdb',
            4017: '0d88d48dec4b694d4517',
            4102: '915f81c69fc5e4623606',
            4194: 'f5256f014a8f2810c953',
            4474: '73bf3a3dea54feb8ae44',
            4521: 'fb1ce34b17639871bac0',
            4763: '574e022a146295a230c1',
            5175: '6da12b40a46c3dc1bec7',
            5325: 'f73e6a1009e185976981',
            5643: 'e3046972325597a71d4d',
            5774: '141a04a858b83c24fd16',
            5802: '92bc0e290d3769e49cfb',
            5804: '6d5505a6271d865543a7',
            5998: 'f7e5ad8f8bcc58c55639',
            6324: '365b73847767a54140ab',
            6363: '455be323006da46e86ba',
            6416: 'a5a589cf5a0320e1d8ef',
            6427: '0426a3a24088f56e85f6',
            6560: 'f01881003ac6fef45147',
            6909: '8cf1749a0435c38f0042',
            7037: '6c0a17273325fb793ea5',
            7176: '90e52d563ea0d904aceb',
            7237: 'c5b4b4a1c530e5649853',
            7345: 'f2d6787a34679ca6bb6e',
            7419: 'fe8ff7c7e5d60ec6a2aa',
            7427: '3632e181ea85cc112694',
            7552: '889d45f5aa64d5c7293b',
            7635: '68f0d52fbb176c87eb48',
            7757: 'a33871177538e5af0eea',
            7836: 'e76c27a228c01ba0f51a',
            7945: '2d37a0fa10623d3390a6',
            7962: '5dc755e884297017b802',
            8090: '9f6f63205b18b2006aae',
            8268: '22931d534c7e1ef01eb1',
            8303: 'd7429ccb60ab73751723',
            8463: 'eb12cff5d8de975762fb',
            8879: '79825d729c8f4d360834',
            8986: 'a6ccf711a394e8924fa1',
            9042: '5e6d175178eb40bf9d3c',
            9055: '3b864f08d4f696c7bf5e',
            9129: 'fbb750fd312778403036',
            9283: '361babf6593344d18b51',
            9289: '5f9496920ea48da5931b',
            9309: 'aceadf5355c94350ec2c',
            9637: 'e1a8d0ef8a2a124944fd',
          }[e] +
          '.css'),
    (b.g = (function () {
      if ('object' == typeof globalThis) return globalThis
      try {
        return this || new Function('return this')()
      } catch (e) {
        if ('object' == typeof window) return window
      }
    })()),
    (b.hmd = e => (
      (e = Object.create(e)).children || (e.children = []),
      Object.defineProperty(e, 'exports', {
        enumerable: !0,
        set: () => {
          throw new Error(
            'ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + e.id,
          )
        },
      }),
      e
    )),
    (b.o = (e, a) => Object.prototype.hasOwnProperty.call(e, a)),
    (c = {}),
    (b.l = (e, a, d, f) => {
      if (c[e]) c[e].push(a)
      else {
        var t, r
        if (void 0 !== d)
          for (var o = document.getElementsByTagName('script'), n = 0; n < o.length; n++) {
            var i = o[n]
            if (i.getAttribute('src') == e || i.getAttribute('data-webpack') == 'tradingview:' + d) {
              t = i
              break
            }
          }
        t ||
          ((r = !0),
          ((t = document.createElement('script')).charset = 'utf-8'),
          (t.timeout = 120),
          b.nc && t.setAttribute('nonce', b.nc),
          t.setAttribute('data-webpack', 'tradingview:' + d),
          (t.src = e),
          0 !== t.src.indexOf(window.location.origin + '/') && (t.crossOrigin = 'anonymous')),
          (c[e] = [a])
        var l = (a, d) => {
            ;(t.onerror = t.onload = null), clearTimeout(s)
            var f = c[e]
            if ((delete c[e], t.parentNode && t.parentNode.removeChild(t), f && f.forEach(e => e(d)), a)) return a(d)
          },
          s = setTimeout(l.bind(null, void 0, { type: 'timeout', target: t }), 12e4)
        ;(t.onerror = l.bind(null, t.onerror)), (t.onload = l.bind(null, t.onload)), r && document.head.appendChild(t)
      }
    }),
    (b.r = e => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 })
    }),
    (b.nmd = e => ((e.paths = []), e.children || (e.children = []), e)),
    (b.p = 'bundles/'),
    (b.p = window.WEBPACK_PUBLIC_PATH || b.p)
  var r,
    o,
    n = b.e,
    i = Object.create(null)
  ;(b.e = function (e) {
    if (!i[e]) {
      i[e] = (function e(a, d) {
        return n(a).catch(function () {
          return new Promise(function (c) {
            var f = function () {
              window.removeEventListener('online', f, !1),
                !1 === navigator.onLine ? window.addEventListener('online', f, !1) : c(d < 2 ? e(a, d + 1) : n(a))
            }
            setTimeout(f, d * d * 1e3)
          })
        })
      })(e, 0)
      var a = function () {
        delete i[e]
      }
      i[e].then(a, a)
    }
    return i[e]
  }),
    (r = e =>
      new Promise((a, d) => {
        var c = b.miniCssF(e),
          f = b.p + c
        if (
          ((e, a) => {
            for (var d = document.getElementsByTagName('link'), c = 0; c < d.length; c++) {
              var f = (b = d[c]).getAttribute('data-href') || b.getAttribute('href')
              if ('stylesheet' === b.rel && (f === e || f === a)) return b
            }
            var t = document.getElementsByTagName('style')
            for (c = 0; c < t.length; c++) {
              var b
              if ((f = (b = t[c]).getAttribute('data-href')) === e || f === a) return b
            }
          })(c, f)
        )
          return a()
        ;((e, a, d, c) => {
          var f = document.createElement('link')
          ;(f.rel = 'stylesheet'),
            (f.type = 'text/css'),
            (f.onerror = f.onload =
              t => {
                if (((f.onerror = f.onload = null), 'load' === t.type)) d()
                else {
                  var b = t && ('load' === t.type ? 'missing' : t.type),
                    r = (t && t.target && t.target.href) || a,
                    o = new Error('Loading CSS chunk ' + e + ' failed.\n(' + r + ')')
                  ;(o.code = 'CSS_CHUNK_LOAD_FAILED'), (o.type = b), (o.request = r), f.parentNode.removeChild(f), c(o)
                }
              }),
            (f.href = a),
            0 !== f.href.indexOf(window.location.origin + '/') && (f.crossOrigin = 'anonymous'),
            document.head.appendChild(f)
        })(e, f, a, d)
      })),
    (o = { 3666: 0 }),
    (b.f.miniCss = (e, a) => {
      o[e]
        ? a.push(o[e])
        : 0 !== o[e] &&
          {
            137: 1,
            323: 1,
            775: 1,
            880: 1,
            1112: 1,
            1320: 1,
            1390: 1,
            1594: 1,
            2e3: 1,
            2153: 1,
            2205: 1,
            2316: 1,
            2358: 1,
            2385: 1,
            2731: 1,
            2849: 1,
            3402: 1,
            3466: 1,
            3520: 1,
            3645: 1,
            3682: 1,
            3770: 1,
            3921: 1,
            3944: 1,
            4017: 1,
            4102: 1,
            4194: 1,
            4474: 1,
            4521: 1,
            4763: 1,
            5175: 1,
            5325: 1,
            5643: 1,
            5774: 1,
            5802: 1,
            5804: 1,
            5998: 1,
            6324: 1,
            6363: 1,
            6416: 1,
            6427: 1,
            6560: 1,
            6909: 1,
            7037: 1,
            7176: 1,
            7237: 1,
            7345: 1,
            7419: 1,
            7427: 1,
            7552: 1,
            7635: 1,
            7757: 1,
            7836: 1,
            7945: 1,
            7962: 1,
            8090: 1,
            8268: 1,
            8303: 1,
            8463: 1,
            8879: 1,
            8986: 1,
            9042: 1,
            9055: 1,
            9129: 1,
            9283: 1,
            9289: 1,
            9309: 1,
            9637: 1,
          }[e] &&
          a.push(
            (o[e] = r(e).then(
              () => {
                o[e] = 0
              },
              a => {
                throw (delete o[e], a)
              },
            )),
          )
    }),
    (() => {
      var e = { 3666: 0, 5386: 0 }
      ;(b.f.j = (a, d) => {
        var c = b.o(e, a) ? e[a] : void 0
        if (0 !== c)
          if (c) d.push(c[2])
          else if (
            /^(1(5(53|83|84)|7(02|54|84)|8(57|59|90)|075|297|369|39)|2(3(01|06|77)|077|183|704|878)|3(0(05|16|30)|199|596|718)|4(013|079|389|665|707|862|891)|5(0(09|7|93)|5(14|16|51)|827)|6(07|085|166|265|456|631|780)|7(2(10|60|71)|078|31|387|648)|8((62|64|88)3|537|890)|9((25|50|68)5|039|2|374|498|811|837))$/.test(
              a,
            )
          ) {
            var f = new Promise((d, f) => (c = e[a] = [d, f]))
            d.push((c[2] = f))
            var t = b.p + b.u(a),
              r = new Error()
            b.l(
              t,
              d => {
                if (b.o(e, a) && (0 !== (c = e[a]) && (e[a] = void 0), c)) {
                  var f = d && ('load' === d.type ? 'missing' : d.type),
                    t = d && d.target && d.target.src
                  ;(r.message = 'Loading chunk ' + a + ' failed.\n(' + f + ': ' + t + ')'),
                    (r.name = 'ChunkLoadError'),
                    (r.type = f),
                    (r.request = t),
                    c[1](r)
                }
              },
              'chunk-' + a,
              a,
            )
          } else e[a] = 0
      }),
        (b.O.j = a => 0 === e[a])
      var a = (a, d) => {
          var c,
            f,
            [t, r, o] = d,
            n = 0
          if (t.some(a => 0 !== e[a])) {
            for (c in r) b.o(r, c) && (b.m[c] = r[c])
            if (o) var i = o(b)
          }
          for (a && a(d); n < t.length; n++) (f = t[n]), b.o(e, f) && e[f] && e[f][0](), (e[t[n]] = 0)
          return b.O(i)
        },
        d = (self.webpackChunktradingview = self.webpackChunktradingview || [])
      d.forEach(a.bind(null, 0)), (d.push = a.bind(null, d.push.bind(d)))
    })(),
    (() => {
      const { miniCssF: e } = b
      b.miniCssF = a => ('rtl' === document.dir ? e(a).replace(/\.css$/, '.rtl.css') : e(a))
    })()
})()
