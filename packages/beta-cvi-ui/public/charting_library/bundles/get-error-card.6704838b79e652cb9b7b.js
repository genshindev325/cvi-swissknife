;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [139],
  {
    41571: e => {
      e.exports = {
        errorCard: 'errorCard-iiZjDmS7',
        errorCard__icon: 'errorCard__icon-iiZjDmS7',
        errorCard_size_big: 'errorCard_size_big-iiZjDmS7',
        errorCard__message: 'errorCard__message-iiZjDmS7',
        errorCard_limitWidth: 'errorCard_limitWidth-iiZjDmS7',
        errorCardRendererContainer: 'errorCardRendererContainer-iiZjDmS7',
      }
    },
    9745: (e, r, t) => {
      'use strict'
      t.d(r, { Icon: () => o })
      var i = t(59496)
      const o = i.forwardRef((e, r) => {
        const { icon: t = '', ...o } = e
        return i.createElement('span', { ...o, ref: r, dangerouslySetInnerHTML: { __html: t } })
      })
    },
    81200: (e, r, t) => {
      'use strict'
      t.r(r), t.d(r, { ErrorCard: () => g, ResizableErrorCard: () => v, ErrorCardRenderer: () => C })
      var i = t(59496),
        o = t(87995),
        a = t(43370),
        n = t(97754),
        s = t.n(n),
        d = t(9745),
        l = (t(28353), t(69067)),
        c = t(61812),
        m = t(41571)
      const h = { ghost: { 1: l, 2: c }, 'stop-hand': { 1: void 0, 2: void 0 } },
        g = i.forwardRef((e, r) => {
          const { icon: t, message: o, size: a = 1, rawHtml: n = !1, doNotLimitWidth: l } = e
          return i.createElement(
            'div',
            { ref: r, className: s()(m.errorCard, 2 === a && m.errorCard_size_big, !l && m.errorCard_limitWidth) },
            i.createElement(d.Icon, { icon: t && h[t][a], className: m.errorCard__icon }),
            n
              ? i.createElement('div', { className: m.errorCard__message, dangerouslySetInnerHTML: { __html: o } })
              : i.createElement('div', { className: m.errorCard__message }, o),
          )
        })
      function v(e) {
        const {
            icon: r,
            message: t,
            rawHtml: o,
            doNotLimitWidth: n,
            maxWidth: s = 200,
            maxHeight: d = 200,
            offsetHeight: l = 0,
          } = e,
          c = i.useRef(null),
          [m, h] = i.useState(1)
        return (
          i.useEffect(() => {
            const e = c.current
            if (e) {
              const r = new ResizeObserver((0, a.default)(v, 150))
              return r.observe(e), () => r.disconnect()
            }
          }, [s, d, l]),
          i.createElement(g, { ref: c, message: t, icon: r, size: m, rawHtml: o, doNotLimitWidth: n })
        )
        function v() {
          const e = c.current
          e && (e.clientWidth < s || e.clientHeight + l < d ? h(1) : h(2))
        }
      }
      class C {
        constructor() {
          this._state = {
            message: null,
            rawHtml: !1,
            doNotLimitWidth: !1,
            icon: void 0,
            backgroundColor: null,
            textColor: null,
            maxWidth: 200,
            maxHeight: 200,
            offsetHeight: 0,
          }
          const e = document.createElement('div')
          e.classList.add(m.errorCardRendererContainer), (this.container = e)
        }
        destroy() {
          o.unmountComponentAtNode(this.container)
        }
        update(e) {
          ;(this._state = Object.assign({}, this._state, e)), this._updateContainer(), this._render()
        }
        _updateContainer() {
          const { backgroundColor: e, textColor: r } = this._state
          this.container.style.setProperty('--backgroundColor', e), this.container.style.setProperty('--textColor', r)
        }
        _render() {
          const {
            message: e,
            icon: r,
            rawHtml: t,
            doNotLimitWidth: a,
            maxWidth: n,
            maxHeight: s,
            offsetHeight: d,
          } = this._state
          o.render(
            e
              ? i.createElement(v, {
                  message: e,
                  icon: r,
                  rawHtml: t,
                  doNotLimitWidth: a,
                  maxWidth: n,
                  maxHeight: s,
                  offsetHeight: d,
                })
              : i.createElement(i.Fragment, null),
            this.container,
          )
        }
      }
    },
    61812: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><path fill="currentColor" fill-rule="evenodd" d="M23 39a36 36 0 0 1 72 0v13.15l15.1 8.44 2.16 1.2-1.64 1.86-12.85 14.59 3.73 4.03L98.57 85 95 81.13V117H77v-12H67v9H50V95H40v22H23V81.28l-3.8 3.61-2.76-2.9 4.05-3.84-12.77-14.5-1.64-1.86 2.16-1.2L23 52.34V39Zm72 36.33 10.98-12.46L95 56.73v18.6ZM23 56.92v18.03L12.35 62.87 23 56.92ZM59 7a32 32 0 0 0-32 32v74h9V91h18v19h9v-9h18v12h10V39A32 32 0 0 0 59 7Zm-7 36a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm19 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>'
    },
    69067: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'
    },
  },
])
