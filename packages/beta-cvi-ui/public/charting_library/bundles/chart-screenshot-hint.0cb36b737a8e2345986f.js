;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [92],
  {
    16178: t => {
      t.exports = {
        'close-button': 'close-button-WaM0Er9G',
        'close-icon': 'close-icon-WaM0Er9G',
        'button-l': 'button-l-WaM0Er9G',
        'button-m': 'button-m-WaM0Er9G',
        'button-s': 'button-s-WaM0Er9G',
        'button-xs': 'button-xs-WaM0Er9G',
        'button-xxs': 'button-xxs-WaM0Er9G',
      }
    },
    69599: t => {
      t.exports = {
        container: 'container-PxtBx6dp',
        'container-danger': 'container-danger-PxtBx6dp',
        icon: 'icon-PxtBx6dp',
        header: 'header-PxtBx6dp',
        'container-warning': 'container-warning-PxtBx6dp',
        'container-success': 'container-success-PxtBx6dp',
        'container-default': 'container-default-PxtBx6dp',
        'text-wrap': 'text-wrap-PxtBx6dp',
        'close-button': 'close-button-PxtBx6dp',
      }
    },
    18546: t => {
      t.exports = {
        container: 'container-64c268VA',
        bottomPadding: 'bottomPadding-64c268VA',
        centerElement: 'centerElement-64c268VA',
        notice: 'notice-64c268VA',
        'notice-showed': 'notice-showed-64c268VA',
      }
    },
    9745: (t, e, n) => {
      'use strict'
      n.d(e, { Icon: () => s })
      var o = n(59496)
      const s = o.forwardRef((t, e) => {
        const { icon: n = '', ...s } = t
        return o.createElement('span', { ...s, ref: e, dangerouslySetInnerHTML: { __html: n } })
      })
    },
    78621: (t, e, n) => {
      'use strict'
      n.r(e), n.d(e, { ChartScreenshotHintRenderer: () => P })
      var o = n(59496),
        s = n(87995),
        r = n(4889),
        a = n(97754),
        i = n(9745),
        c = n(64120),
        l = n(12565),
        d = n(95781),
        h = n(7801),
        w = n(33584),
        u = n(16178),
        m = n.n(u)
      function x(t = 'l') {
        switch (t) {
          case 'l':
            return c
          case 'm':
            return l
          case 's':
            return d
          case 'xs':
            return h
          case 'xxs':
            return w
          default:
            return l
        }
      }
      const g = o.forwardRef((t, e) => {
        const { className: n, size: s, ...r } = t,
          c = a(m()['close-button'], m()['button-' + s], n)
        return o.createElement(
          'button',
          { ...r, type: 'button', className: c, ref: e },
          o.createElement(i.Icon, { icon: x(s), className: m()['close-icon'], 'aria-hidden': !0 }),
        )
      })
      var p = n(79704),
        v = n(26),
        b = n(87172),
        f = n(69599),
        E = n.n(f)
      const _ = { danger: p, warning: p, success: b, default: v }
      function B(t) {
        const {
          informerIntent: e,
          content: n,
          className: s,
          header: r,
          isIconShown: c = !0,
          isCloseButtonShown: l,
          icon: d,
          onCloseClick: h,
          closeButtonLabel: w = 'Close',
        } = t
        return o.createElement(
          'div',
          { className: a(E().container, E()['container-' + e], s) },
          c && o.createElement(i.Icon, { className: E().icon, icon: null != d ? d : _[e] }),
          o.createElement(
            'div',
            { className: E()['text-wrap'] },
            o.createElement('span', { className: E().header }, r),
            ' ',
            n,
          ),
          l && o.createElement(g, { 'aria-label': w, onClick: h, className: E()['close-button'], size: 'xs' }),
        )
      }
      var M = n(18546)
      function C(t) {
        const [e, n] = (0, o.useState)(!1)
        return (
          (0, o.useLayoutEffect)(() => {
            const t = setTimeout(() => n(!0), 50),
              e = setTimeout(() => n(!1), 2500)
            return () => {
              clearTimeout(t), clearTimeout(e)
            }
          }, []),
          o.createElement(
            'div',
            { className: a(M.container, t.bottomPadding && M.bottomPadding) },
            o.createElement(
              'div',
              { className: M.centerElement },
              o.createElement(B, {
                content: t.text,
                informerIntent: 'success',
                className: a(M.notice, e && M['notice-showed']),
              }),
            ),
          )
        )
      }
      class P {
        constructor(t, e) {
          ;(this._showed = !1),
            (this._wrap = document.createElement('div')),
            (this._container = t),
            (this._debouncedHide = (0, r.default)(() => this.hide(), 3e3)),
            (this._bottomPadding = e.bottomPadding)
        }
        show(t) {
          this._wrap &&
            !this._showed &&
            ((this._showed = !0),
            this._container.append(this._wrap),
            s.render(o.createElement(C, { text: t, bottomPadding: this._bottomPadding }), this._wrap),
            this._debouncedHide())
        }
        hide() {
          this._wrap && ((this._showed = !1), s.unmountComponentAtNode(this._wrap), this._wrap.remove())
        }
        destroy() {
          this.hide(), delete this._wrap
        }
      }
    },
    87172: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zm4.15 5.87a.75.75 0 0 0-1.3-.74l-3.51 6.15-2.31-2.31a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.18-.16l4-7z"/></svg>'
    },
    79704: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zM7.75 5.48a1.27 1.27 0 1 1 2.5 0l-.67 4.03a.59.59 0 0 1-1.16 0l-.67-4.03zM8 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg>'
    },
    26: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zm1 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 8a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1z"/></svg>'
    },
    64120: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23"><path stroke="currentColor" stroke-width="1.2" d="M1 1l21 21m0-21L1 22"/></svg>'
    },
    12565: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
    95781: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13"><path stroke="currentColor" stroke-width="1.2" d="M1 1l11 11m0-11L1 12"/></svg>'
    },
    7801: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11" width="11" height="11"><path stroke="currentColor" stroke-width="1.2" d="M1 1l9 9m0-9l-9 9"/></svg>'
    },
    33584: t => {
      t.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" width="9" height="9"><path stroke="currentColor" stroke-width="1.2" d="M1 1l7 7m0-7L1 8"/></svg>'
    },
  },
])
