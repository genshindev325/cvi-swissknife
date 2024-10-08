'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4389],
  {
    4897: (e, t, a) => {
      a.r(t),
        a.d(t, {
          copyToClipboardClientScreenshot: () => u,
          copyToClipboardImageOfChart: () => h,
          downloadClientScreenshot: () => y,
          getImageOfChartSilently: () => g,
        })
      var n = a(98125),
        o = a(67337),
        i = a(95792),
        r = a(82029),
        s = a(65446),
        c = a(58455),
        l = a(20301),
        d = (a(94419), a(28353), a(85198))
      function p(e, t = {}) {
        return new Promise((a, n) => {
          !(async function (e, t, a, n = {}) {
            var i
            const r = new FormData()
            if (void 0 !== n.previews) for (const e of n.previews) r.append('previews[]', e)
            void 0 !== n.cme && r.append('cme', String(n.cme))
            void 0 !== n.wl && r.append('wl', String(n.wl))
            void 0 !== n.onWidget && r.append('onWidget', String(n.onWidget))
            n.isReport && r.append('isReport', String(n.isReport))
            n.asyncSave && r.append('asyncSave', String(n.asyncSave))
            const s = window.urlParams
            s && s.locale && r.append('language', s.locale)
            const c = e.activeChartWidget.value(),
              l = c.widgetCustomer()
            void 0 !== l && r.append('customer', l)
            let p = c.properties().childs().timezone.value()
            'exchange' === p &&
              (p = (null === (i = c.model().mainSeries().symbolInfo()) || void 0 === i ? void 0 : i.timezone) || p)
            r.append('timezone', p), r.append('symbol', c.model().mainSeries().symbol())
            const w = await e.clientSnapshot({ showHeaderMainSymbol: n.showHeaderMainSymbol }),
              m = await new Promise(e => w.toBlob(e))
            null !== m && r.append('preparedImage', m)
            !(async function (e, t, a, n = {}) {
              const i = o.enabled('charting_library_base')
                ? n.snapshotUrl || 'https://www.tradingview.com/snapshot/'
                : '/snapshot/'
              try {
                const n = await (0, d.fetch)(i, { body: e, method: 'POST', credentials: 'same-origin' }),
                  o = await n.text()
                n.ok ? t(o) : a()
              } catch (e) {
                a()
              }
            })(r, t, a, n)
          })(e, a, n, t)
        })
      }
      const w = (0, n.getLogger)('Platform.TakeChartImage'),
        m = new i.DateTimeFormatter({ dateTimeSeparator: '_', timeFormat: '%h-%m-%s' })
      async function h(e, t) {
        const a = p(e, t),
          n = a.then(e => (o.enabled('charting_library_base') && t.snapshotUrl ? e : (0, l.convertImageNameToUrl)(e))),
          i = n.then(e => new Blob([e], { type: 'text/plain' }))
        try {
          return await (0, s.writePromiseUsingApi)(i, 'text/plain'), a
        } catch (e) {
          throw (window.open(await n), e)
        }
      }
      async function g(e, t) {
        try {
          return await p(e, t)
        } catch (e) {
          throw (w.logWarn('Error while trying to create snapshot'), e)
        }
      }
      async function u(e) {
        const t = e.clientSnapshot(),
          a = t.then(
            e =>
              new Promise(t =>
                e.toBlob(e => {
                  null !== e && t(e)
                }),
              ),
          )
        try {
          return await (0, s.writePromiseUsingApi)(a, 'image/png')
        } catch (e) {
          const a = window.open()
          throw (a && a.document.write(`<img width="100%" src="${(await t).toDataURL()}"/>`), e)
        }
      }
      async function y(e) {
        const t = e.activeChartWidget.value().model().mainSeries().actualSymbol(),
          a = `${(0, r.shortName)(t)}_${m.formatLocal(new Date())}`,
          n = await e.clientSnapshot()
        ;(0, c.downloadFile)(a + '.png', n.toDataURL())
      }
    },
    20301: (e, t, a) => {
      a.d(t, { convertImageNameToUrl: () => i })
      var n = a(67337),
        o = a(76861)
      function i(e) {
        return n.enabled('charting_library_base') || (0, o.isProd)()
          ? 'https://www.tradingview.com/x/' + e + '/'
          : window.location.protocol + '//' + window.location.host + '/x/' + e + '/'
      }
    },
    58455: (e, t, a) => {
      function n(e, t) {
        const a = document.createElement('a')
        ;(a.style.display = 'none'), (a.href = t), (a.download = e), a.click()
      }
      a.d(t, { downloadFile: () => n })
    },
  },
])
