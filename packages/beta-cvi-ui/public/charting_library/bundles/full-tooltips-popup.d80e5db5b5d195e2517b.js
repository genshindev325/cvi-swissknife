;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8643],
  {
    59142: function (e, t) {
      var o, n, r
      ;(n = [t]),
        void 0 ===
          (r =
            'function' ==
            typeof (o = function (e) {
              'use strict'
              function t(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, o = Array(e.length); t < e.length; t++) o[t] = e[t]
                  return o
                }
                return Array.from(e)
              }
              Object.defineProperty(e, '__esModule', { value: !0 })
              var o = !1
              if ('undefined' != typeof window) {
                var n = {
                  get passive() {
                    o = !0
                  },
                }
                window.addEventListener('testPassive', null, n), window.removeEventListener('testPassive', null, n)
              }
              var r =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                a = [],
                i = !1,
                l = -1,
                s = void 0,
                c = void 0,
                d = function (e) {
                  return a.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                u = function (e) {
                  var t = e || window.event
                  return !!d(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                m = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== s && ((document.body.style.overflow = s), (s = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, n) {
                if (r) {
                  if (!e)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    e &&
                    !a.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var m = { targetElement: e, options: n || {} }
                    ;(a = [].concat(t(a), [m])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (l = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var o, n, r, a
                        1 === t.targetTouches.length &&
                          ((n = e),
                          (a = (o = t).targetTouches[0].clientY - l),
                          !d(o.target) &&
                            ((n && 0 === n.scrollTop && 0 < a) ||
                            ((r = n) && r.scrollHeight - r.scrollTop <= r.clientHeight && a < 0)
                              ? u(o)
                              : o.stopPropagation()))
                      }),
                      i || (document.addEventListener('touchmove', u, o ? { passive: !1 } : void 0), (i = !0))
                  }
                } else {
                  ;(v = n),
                    setTimeout(function () {
                      if (void 0 === c) {
                        var e = !!v && !0 === v.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((c = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === s && ((s = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var p = { targetElement: e, options: n || {} }
                  a = [].concat(t(a), [p])
                }
                var v
              }),
                (e.clearAllBodyScrollLocks = function () {
                  r
                    ? (a.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      i && (document.removeEventListener('touchmove', u, o ? { passive: !1 } : void 0), (i = !1)),
                      (a = []),
                      (l = -1))
                    : (m(), (a = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (r) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (a = a.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      i &&
                        0 === a.length &&
                        (document.removeEventListener('touchmove', u, o ? { passive: !1 } : void 0), (i = !1))
                  } else
                    1 === a.length && a[0].targetElement === e
                      ? (m(), (a = []))
                      : (a = a.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? o.apply(t, n)
              : o) || (e.exports = r)
    },
    66273: e => {
      e.exports = {
        'css-value-small-size': '18px',
        'css-value-medium-size': '22px',
        'css-value-large-size': '28px',
        'css-value-border-radius-small-size': '9px',
        'css-value-border-radius-medium-size': '11px',
        'css-value-border-radius-large-size': '8px',
        popupWidget: 'popupWidget-QCFoCG9e',
        large: 'large-QCFoCG9e',
        desc: 'desc-QCFoCG9e',
        icon: 'icon-QCFoCG9e',
        small: 'small-QCFoCG9e',
        medium: 'medium-QCFoCG9e',
        title: 'title-QCFoCG9e',
        text: 'text-QCFoCG9e',
        item: 'item-QCFoCG9e',
        boldItem: 'boldItem-QCFoCG9e',
        action: 'action-QCFoCG9e',
        additionalWidget: 'additionalWidget-QCFoCG9e',
      }
    },
    66998: e => {
      e.exports = {
        wrap: 'wrap-3HaHQVJm',
        positionBottom: 'positionBottom-3HaHQVJm',
        backdrop: 'backdrop-3HaHQVJm',
        drawer: 'drawer-3HaHQVJm',
        positionLeft: 'positionLeft-3HaHQVJm',
      }
    },
    4872: (e, t, o) => {
      'use strict'
      o.r(t), o.d(t, { render: () => y })
      var n = o(59496),
        r = o(87995),
        a = (o(28353), o(50628)),
        i = o(90692),
        l = o(41590),
        s = o(37558),
        c = o(9423),
        d = o(97754),
        u = o(88537),
        m = o(9745),
        p = o(77975),
        v = o(80643),
        f = o(66273)
      const h = new WeakMap(),
        g = new WeakMap()
      function w(e) {
        const t = (0, p.useWatchedValueReadonly)({ watchedValue: e.info })
        if (null === t) return null
        const o = t.map(t => {
          const { title: o, titleColor: r, icon: a, iconClassName: i, html: l, action: s, size: p } = t
          h.has(t) || h.set(t, (0, c.randomHash)())
          let w = []
          return (
            void 0 !== e.additionalWidgets &&
              (w = e.additionalWidgets.map(
                e => (
                  g.has(e) || g.set(e, (0, c.randomHash)()),
                  e.renderer((0, u.ensureDefined)(g.get(e)), f.additionalWidget)
                ),
              )),
            n.createElement(
              'div',
              { key: h.get(t), className: d(f.popupWidget, f[p]) },
              n.createElement(m.Icon, { className: d(f.icon, i, f[p]), icon: a || void 0 }),
              n.createElement(
                'div',
                { className: f.desc },
                n.createElement('span', { style: { color: r || void 0 }, className: d(f.title, f[p]) }, o),
                l &&
                  n.createElement(
                    'p',
                    { className: d(f.text, f[p]) },
                    l.map((e, t) => {
                      let o, r
                      return (
                        (0, v.isObject)(e) ? ((o = e.text), (r = e.bold)) : (o = e),
                        n.createElement('span', {
                          key: 'html_item_' + t,
                          className: d(f.item, r && f.boldItem),
                          dangerouslySetInnerHTML: { __html: o },
                        })
                      )
                    }),
                  ),
                s &&
                  n.createElement(
                    'span',
                    {
                      className: d(s.tooltip && 'apply-common-tooltip', f.action, f[p]),
                      onClick: () => {
                        e.onClose(), null == s || s.onClick()
                      },
                      title: s.tooltip,
                    },
                    s.text,
                  ),
                w,
              ),
            )
          )
        })
        return n.createElement(n.Fragment, null, o)
      }
      const C = new WeakMap()
      function E(e) {
        const { statusWidgetInfos: t } = e,
          o = t
            .filter(e => e.visible.value())
            .map(
              t => (
                C.has(t) || C.set(t, (0, c.randomHash)()),
                n.createElement(w, {
                  key: C.get(t),
                  info: t.model.fullInfo(),
                  onClose: e.onClose,
                  additionalWidgets: t.additionalWidgets,
                })
              ),
            )
        return n.createElement(
          s.DrawerManager,
          null,
          n.createElement(i.MatchMedia, { rule: 'screen and (max-width: 428px)' }, t =>
            t
              ? n.createElement(l.Drawer, { onClose: e.onClose, position: 'Bottom' }, o)
              : n.createElement(
                  a.PopupMenu,
                  { isOpened: !0, onClose: e.onClose, position: e.position, doNotCloseOn: e.rendererButton },
                  o,
                ),
          ),
        )
      }
      function y(e, t, o, a, i, l) {
        const s = { rendererButton: o, position: l, statusWidgetInfos: a, onClose: i }
        e ? r.render(n.createElement(E, { ...s }), t) : r.unmountComponentAtNode(t)
      }
    },
    37558: (e, t, o) => {
      'use strict'
      o.d(t, { DrawerManager: () => r, DrawerContext: () => a })
      var n = o(59496)
      class r extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._addDrawer = () => {
              const e = this.state.currentDrawer + 1
              return this.setState({ currentDrawer: e }), e
            }),
            (this._removeDrawer = () => {
              const e = this.state.currentDrawer - 1
              return this.setState({ currentDrawer: e }), e
            }),
            (this.state = { currentDrawer: 0 })
        }
        render() {
          return n.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.currentDrawer,
              },
            },
            this.props.children,
          )
        }
      }
      const a = n.createContext(null)
    },
    41590: (e, t, o) => {
      'use strict'
      o.d(t, { Drawer: () => p })
      var n = o(59496),
        r = o(88537),
        a = o(97754),
        i = o(59142),
        l = o(99054),
        s = o(65718),
        c = o(37558),
        d = o(49483),
        u = o(29197),
        m = o(66998)
      function p(e) {
        const { position: t = 'Bottom', onClose: o, children: p, className: v, theme: f = m } = e,
          h = (0, r.ensureNotNull)((0, n.useContext)(c.DrawerContext)),
          [g, w] = (0, n.useState)(0),
          C = (0, n.useRef)(null),
          E = (0, n.useContext)(u.CloseDelegateContext)
        return (
          (0, n.useEffect)(() => {
            const e = (0, r.ensureNotNull)(C.current)
            return (
              e.focus({ preventScroll: !0 }),
              E.subscribe(h, o),
              0 === h.currentDrawer && (0, l.setFixedBodyState)(!0),
              d.CheckMobile.iOS() && (0, i.disableBodyScroll)(e),
              w(h.addDrawer()),
              () => {
                E.unsubscribe(h, o)
                const t = h.removeDrawer()
                d.CheckMobile.iOS() && (0, i.enableBodyScroll)(e), 0 === t && (0, l.setFixedBodyState)(!1)
              }
            )
          }, []),
          n.createElement(
            s.Portal,
            null,
            n.createElement(
              'div',
              { className: a(m.wrap, m['position' + t]) },
              g === h.currentDrawer && n.createElement('div', { className: m.backdrop, onClick: o }),
              n.createElement(
                'div',
                {
                  className: a(m.drawer, f.drawer, m['position' + t], v),
                  ref: C,
                  tabIndex: -1,
                  'data-name': e['data-name'],
                },
                p,
              ),
            ),
          )
        )
      }
    },
    50628: (e, t, o) => {
      'use strict'
      o.d(t, { PopupMenu: () => c })
      var n = o(59496),
        r = o(87995),
        a = o(65718),
        i = o(27317),
        l = o(29197),
        s = o(58095)
      function c(e) {
        const {
            controller: t,
            children: o,
            isOpened: c,
            closeOnClickOutside: d = !0,
            doNotCloseOn: u,
            onClickOutside: m,
            onClose: p,
            ...v
          } = e,
          f = (0, n.useContext)(l.CloseDelegateContext),
          h = (0, s.useOutsideEvent)({
            handler: function (e) {
              m && m(e)
              if (!d) return
              if (u && e.target instanceof Node) {
                const t = r.findDOMNode(u)
                if (t instanceof Node && t.contains(e.target)) return
              }
              p()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return c
          ? n.createElement(
              a.Portal,
              { top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' },
              n.createElement(
                'span',
                { ref: h, style: { pointerEvents: 'auto' } },
                n.createElement(
                  i.Menu,
                  {
                    ...v,
                    onClose: p,
                    onScroll: function (t) {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: f,
                    ref: t,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
  },
])
