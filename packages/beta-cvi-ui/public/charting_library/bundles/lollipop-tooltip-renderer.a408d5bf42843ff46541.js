;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9039],
  {
    59142: function (e, t) {
      var n, o, r
      ;(o = [t]),
        void 0 ===
          (r =
            'function' ==
            typeof (n = function (e) {
              'use strict'
              function t(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t]
                  return n
                }
                return Array.from(e)
              }
              Object.defineProperty(e, '__esModule', { value: !0 })
              var n = !1
              if ('undefined' != typeof window) {
                var o = {
                  get passive() {
                    n = !0
                  },
                }
                window.addEventListener('testPassive', null, o), window.removeEventListener('testPassive', null, o)
              }
              var r =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                l = [],
                a = !1,
                s = -1,
                i = void 0,
                c = void 0,
                u = function (e) {
                  return l.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                d = function (e) {
                  var t = e || window.event
                  return !!u(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                m = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== i && ((document.body.style.overflow = i), (i = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, o) {
                if (r) {
                  if (!e)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    e &&
                    !l.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var m = { targetElement: e, options: o || {} }
                    ;(l = [].concat(t(l), [m])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (s = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var n, o, r, l
                        1 === t.targetTouches.length &&
                          ((o = e),
                          (l = (n = t).targetTouches[0].clientY - s),
                          !u(n.target) &&
                            ((o && 0 === o.scrollTop && 0 < l) ||
                            ((r = o) && r.scrollHeight - r.scrollTop <= r.clientHeight && l < 0)
                              ? d(n)
                              : n.stopPropagation()))
                      }),
                      a || (document.addEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !0))
                  }
                } else {
                  ;(f = o),
                    setTimeout(function () {
                      if (void 0 === c) {
                        var e = !!f && !0 === f.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((c = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === i && ((i = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var p = { targetElement: e, options: o || {} }
                  l = [].concat(t(l), [p])
                }
                var f
              }),
                (e.clearAllBodyScrollLocks = function () {
                  r
                    ? (l.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      a && (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !1)),
                      (l = []),
                      (s = -1))
                    : (m(), (l = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (r) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (l = l.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      a &&
                        0 === l.length &&
                        (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !1))
                  } else
                    1 === l.length && l[0].targetElement === e
                      ? (m(), (l = []))
                      : (l = l.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? n.apply(t, o)
              : n) || (e.exports = r)
    },
    9245: e => {
      e.exports = {
        drawer: 'drawer-BF9dzroi',
        drawerItem: 'drawerItem-BF9dzroi',
        menuWrap: 'menuWrap-BF9dzroi',
        menuBox: 'menuBox-BF9dzroi',
        card: 'card-BF9dzroi',
        mini: 'mini-BF9dzroi',
        fadeTop: 'fadeTop-BF9dzroi',
        fadeBottom: 'fadeBottom-BF9dzroi',
      }
    },
    85174: e => {
      e.exports = {
        content: 'content-A343HTYW',
        titleWrapper: 'titleWrapper-A343HTYW',
        title: 'title-A343HTYW',
        subtitle: 'subtitle-A343HTYW',
        text: 'text-A343HTYW',
        icon: 'icon-A343HTYW',
        group: 'group-A343HTYW',
        groupIcon: 'groupIcon-A343HTYW',
        beforeMarketOpen: 'beforeMarketOpen-A343HTYW',
        afterMarketClose: 'afterMarketClose-A343HTYW',
        groupTitle: 'groupTitle-A343HTYW',
        groupRow: 'groupRow-A343HTYW',
        groupCell: 'groupCell-A343HTYW',
        link: 'link-A343HTYW',
        mob: 'mob-A343HTYW',
        mini: 'mini-A343HTYW',
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
    22838: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { LollipopCardType: () => B, showLollipopTooltip: () => M })
      var o = n(59496),
        r = n(87995),
        l = n(88537),
        a = n(97754),
        s = n.n(a)
      function i(e, t, n) {
        ;(0, o.useEffect)(() => {
          const o = new IntersectionObserver(
            e => {
              e[e.length - 1].intersectionRatio < 0.25 ? n() : t()
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1], root: null, rootMargin: '0px' },
          )
          return e.current && o.observe(e.current), () => o.disconnect()
        }, [])
      }
      var c = n(90692),
        u = n(41590),
        d = n(37558),
        m = n(50628),
        p = n(68335),
        f = n(59064),
        v = n(80643)
      const h = (0, o.forwardRef)((e, t) => {
        const {
            onClose: n,
            onForceClose: r,
            onClickOutside: l,
            className: a,
            customCloseSubscriptions: s = [],
            ...i
          } = e,
          c = (0, o.useRef)(null),
          u = (0, o.useCallback)(
            e => {
              27 === (0, p.hashFromEvent)(e) && r()
            },
            [r],
          ),
          d = (0, o.useCallback)(() => {
            ;(0, f.globalCloseMenu)(), r()
          }, [r]),
          h = (0, o.useCallback)(() => {
            c.current && c.current.focus({ preventScroll: !0 })
          }, [])
        return (
          (0, o.useEffect)(() => {
            const e = ((t = d), window.addEventListener('scroll', t), () => window.removeEventListener('scroll', t))
            var t
            const n =
              s &&
              (function (e, t) {
                for (const n of e) n.subscribe(null, t)
                return () => {
                  for (const n of e) n.unsubscribe(null, t)
                }
              })(s, d)
            return () => {
              e(), (0, v.isFunction)(n) && n()
            }
          }, [s, d]),
          o.createElement(
            m.PopupMenu,
            {
              className: a,
              isOpened: !0,
              tabIndex: -1,
              reference: e => {
                'function' == typeof t ? t(e) : (0, v.isObject)(t) && (t.current = e), (c.current = e)
              },
              onClose: n,
              onClickOutside: l,
              onKeyDown: u,
              onOpen: h,
              ...i,
            },
            e.children,
          )
        )
      })
      var g,
        w = n(40173),
        E = n(27317),
        C = n(9745),
        b = n(85174)
      function y(e) {
        const { name: t, value: n, style: r, valueRightIcon: l } = e
        return o.createElement(
          'div',
          { className: b.groupRow, style: r },
          t && o.createElement('div', { className: b.groupCell }, o.createElement('span', { className: b.text }, t)),
          o.createElement(
            'div',
            { className: b.groupCell },
            o.createElement('span', { className: b.text }, n),
            l &&
              o.createElement(C.Icon, {
                icon: l.iconContent,
                className: s()(b.groupIcon, l.iconClass, 'apply-common-tooltip'),
                title: l.tooltipText,
              }),
          ),
        )
      }
      function k(e) {
        const { text: t, href: n, onClick: r } = e
        return o.createElement(
          'a',
          {
            href: n,
            onClick:
              r &&
              (e => {
                e.preventDefault(), r()
              }),
            className: b.link,
          },
          t,
        )
      }
      function T(e) {
        var t
        const { content: n = [], subTitle: r, cardType: l, anchor: a } = e,
          i = n.map((e, t) => {
            const { title: n, content: r } = e
            return o.createElement(
              'div',
              { key: 'group' + t, className: b.group },
              n && o.createElement('span', { className: b.groupTitle }, n),
              r.map((e, t) => o.createElement(y, { key: 'contentRow' + t, ...e })),
            )
          }),
          c = l ? s()(b.content, b[l]) : b.content,
          u = 'string' == typeof r ? r : r.map((e, t) => o.createElement(y, { key: 'subTitle' + t, ...e }))
        return o.createElement(
          o.Fragment,
          null,
          o.createElement(
            'div',
            { className: c },
            e.title &&
              o.createElement(
                'div',
                { className: b.titleWrapper },
                e.tooltipIcon &&
                  o.createElement(C.Icon, {
                    icon: e.tooltipIcon,
                    className: b.icon,
                    style: { color: null === (t = e.style) || void 0 === t ? void 0 : t.color },
                  }),
                o.createElement('span', { className: b.title }, e.title),
              ),
            o.createElement('span', { className: b.subtitle }, u),
            i.length > 0 && o.createElement('div', null, i),
            a && o.createElement('div', { className: b.group }, o.createElement(k, { ...a })),
          ),
        )
      }
      !(function (e) {
        ;(e[(e.BeforeMarketOpen = b.beforeMarketOpen)] = 'BeforeMarketOpen'),
          (e[(e.AfterMarketClose = b.afterMarketClose)] = 'AfterMarketClose')
      })(g || (g = {}))
      var N = n(9245)
      const S = (0, w.mergeThemes)(E.DEFAULT_MENU_THEME, { menuWrap: N.menuWrap, menuBox: N.menuBox })
      function x(e) {
        const {
            tooltips: t,
            onClose: n,
            onForceClose: r,
            onClickOutside: l,
            position: a,
            customCloseSubscriptions: m,
            showScrollFades: p,
            cardType: f,
          } = e,
          v = (0, o.useRef)(null),
          g = (0, o.useRef)(null),
          w = (0, o.useRef)(null),
          E = (0, o.useRef)(null),
          [C, b] = (0, o.useState)('100%'),
          y = e => {
            null !== e && b(e.clientWidth + 'px')
          },
          [k, x] = (0, o.useState)(!1)
        i(
          w,
          () => x(!1),
          () => x(!0),
        )
        const D = { display: k ? 'block' : 'none', width: C },
          [M, O] = (0, o.useState)(!1)
        i(
          E,
          () => O(!1),
          () => O(!0),
        )
        const H = { display: M ? 'block' : 'none', width: C },
          W = f ? s()(N.card, N[f]) : N.card
        return o.createElement(
          d.DrawerManager,
          null,
          o.createElement(c.MatchMedia, { rule: 'screen and (max-width: 419px)' }, e =>
            e
              ? o.createElement(
                  u.Drawer,
                  { className: N.drawer, onClose: r || n, position: 'Bottom' },
                  t.map((e, t) =>
                    o.createElement(
                      'div',
                      { key: '' + t, className: N.drawerItem },
                      o.createElement(T, { cardType: B.Mobile, ...e }),
                    ),
                  ),
                )
              : o.createElement(
                  h,
                  {
                    position: a,
                    theme: S,
                    onClose: n,
                    onForceClose: r || n,
                    onClickOutside: l,
                    customCloseSubscriptions: m,
                  },
                  p &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement('div', { ref: v, className: N.fadeTop, style: D }),
                      o.createElement('div', { ref: w }),
                    ),
                  o.createElement(
                    'div',
                    { ref: y },
                    t.map((e, t) => {
                      var n
                      return o.createElement(
                        'div',
                        {
                          key: '' + t,
                          className: W,
                          style: { borderColor: null === (n = e.style) || void 0 === n ? void 0 : n.color },
                        },
                        o.createElement(T, { cardType: f, ...e }),
                      )
                    }),
                  ),
                  p &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement('div', { ref: E }),
                      o.createElement('div', { ref: g, className: N.fadeBottom, style: H }),
                    ),
                ),
          ),
        )
      }
      var B
      !(function (e) {
        ;(e.Mobile = 'mob'), (e.Minimal = 'mini')
      })(B || (B = {}))
      let D = null
      function M(e) {
        if (!e.items.length) return
        const t = {
          tooltips: e.items,
          onClose: O,
          onForceClose: () => {
            O(), 'function' == typeof e.onCustomClose && e.onCustomClose()
          },
          onClickOutside: e.onClickOutside,
          position: H.bind(null, e.position),
          customCloseSubscriptions: e.customCloseSubscriptions,
          showScrollFades: e.showScrollFades,
          cardType: e.cardType,
        }
        null === D && ((D = document.createElement('div')), document.body.appendChild(D)),
          r.render(o.createElement(x, { ...t }), D)
      }
      function O() {
        null !== D && (r.unmountComponentAtNode(D), D.remove(), (D = null))
      }
      function H(e, t, n) {
        const o = e.target,
          r = o.getBoundingClientRect(),
          a = r.width - e.targetSize.w,
          s = r.height - e.targetSize.h,
          i = (0, l.ensureNotNull)(o.closest('.chart-container')),
          c = i.getBoundingClientRect(),
          u = (0, l.ensureNotNull)(i.parentElement).getBoundingClientRect(),
          d = r.left + e.point.x + a,
          m = Math.round(d - t / 2),
          p = Math.min(m + t, c.right, u.right)
        let f,
          v,
          h = Math.max(p - t, c.left, u.left)
        h + t >= u.right && (h = u.right - t)
        const g = c.bottom - (r.top + e.point.y + s),
          w = c.height - g - e.marginTop
        return (
          w < n ? ((v = e.marginTop + c.top), (f = Math.max(w, 0))) : (v = c.height + c.top - g - n),
          { x: h, y: v, overrideHeight: f }
        )
      }
    },
    39640: (e, t, n) => {
      'use strict'
      function o(e, t, n, o, r) {
        function l(r) {
          if (e > r.timeStamp) return
          const l = r.target
          void 0 !== n && null !== t && null !== l && l.ownerDocument === o && (t.contains(l) || n(r))
        }
        return (
          r.click && o.addEventListener('click', l, !1),
          r.mouseDown && o.addEventListener('mousedown', l, !1),
          r.touchEnd && o.addEventListener('touchend', l, !1),
          r.touchStart && o.addEventListener('touchstart', l, !1),
          () => {
            o.removeEventListener('click', l, !1),
              o.removeEventListener('mousedown', l, !1),
              o.removeEventListener('touchend', l, !1),
              o.removeEventListener('touchstart', l, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    37558: (e, t, n) => {
      'use strict'
      n.d(t, { DrawerManager: () => r, DrawerContext: () => l })
      var o = n(59496)
      class r extends o.PureComponent {
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
          return o.createElement(
            l.Provider,
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
      const l = o.createContext(null)
    },
    41590: (e, t, n) => {
      'use strict'
      n.d(t, { Drawer: () => p })
      var o = n(59496),
        r = n(88537),
        l = n(97754),
        a = n(59142),
        s = n(99054),
        i = n(65718),
        c = n(37558),
        u = n(49483),
        d = n(29197),
        m = n(66998)
      function p(e) {
        const { position: t = 'Bottom', onClose: n, children: p, className: f, theme: v = m } = e,
          h = (0, r.ensureNotNull)((0, o.useContext)(c.DrawerContext)),
          [g, w] = (0, o.useState)(0),
          E = (0, o.useRef)(null),
          C = (0, o.useContext)(d.CloseDelegateContext)
        return (
          (0, o.useEffect)(() => {
            const e = (0, r.ensureNotNull)(E.current)
            return (
              e.focus({ preventScroll: !0 }),
              C.subscribe(h, n),
              0 === h.currentDrawer && (0, s.setFixedBodyState)(!0),
              u.CheckMobile.iOS() && (0, a.disableBodyScroll)(e),
              w(h.addDrawer()),
              () => {
                C.unsubscribe(h, n)
                const t = h.removeDrawer()
                u.CheckMobile.iOS() && (0, a.enableBodyScroll)(e), 0 === t && (0, s.setFixedBodyState)(!1)
              }
            )
          }, []),
          o.createElement(
            i.Portal,
            null,
            o.createElement(
              'div',
              { className: l(m.wrap, m['position' + t]) },
              g === h.currentDrawer && o.createElement('div', { className: m.backdrop, onClick: n }),
              o.createElement(
                'div',
                {
                  className: l(m.drawer, v.drawer, m['position' + t], f),
                  ref: E,
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
    50628: (e, t, n) => {
      'use strict'
      n.d(t, { PopupMenu: () => c })
      var o = n(59496),
        r = n(87995),
        l = n(65718),
        a = n(27317),
        s = n(29197),
        i = n(58095)
      function c(e) {
        const {
            controller: t,
            children: n,
            isOpened: c,
            closeOnClickOutside: u = !0,
            doNotCloseOn: d,
            onClickOutside: m,
            onClose: p,
            ...f
          } = e,
          v = (0, o.useContext)(s.CloseDelegateContext),
          h = (0, i.useOutsideEvent)({
            handler: function (e) {
              m && m(e)
              if (!u) return
              if (d && e.target instanceof Node) {
                const t = r.findDOMNode(d)
                if (t instanceof Node && t.contains(e.target)) return
              }
              p()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return c
          ? o.createElement(
              l.Portal,
              { top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' },
              o.createElement(
                'span',
                {
                  ref: h,
                  style: { pointerEvents: 'auto' },
                },
                o.createElement(
                  a.Menu,
                  {
                    ...f,
                    onClose: p,
                    onScroll: function (t) {
                      const { onScroll: n } = e
                      n && n(t)
                    },
                    customCloseDelegate: v,
                    ref: t,
                  },
                  n,
                ),
              ),
            )
          : null
      }
    },
    40173: (e, t, n) => {
      'use strict'
      function o(e, t, n = {}) {
        const o = Object.assign({}, t)
        for (const r of Object.keys(t)) {
          const l = n[r] || r
          l in e && (o[r] = [e[l], t[r]].join(' '))
        }
        return o
      }
      function r(e, t, n = {}) {
        return Object.assign({}, e, o(e, t, n))
      }
      n.d(t, { weakComposeClasses: () => o, mergeThemes: () => r })
    },
  },
])
