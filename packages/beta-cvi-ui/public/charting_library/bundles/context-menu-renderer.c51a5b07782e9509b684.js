;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1584],
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
                i = [],
                s = !1,
                a = -1,
                c = void 0,
                l = void 0,
                u = function (e) {
                  return i.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                d = function (e) {
                  var t = e || window.event
                  return !!u(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                h = function () {
                  setTimeout(function () {
                    void 0 !== l && ((document.body.style.paddingRight = l), (l = void 0)),
                      void 0 !== c && ((document.body.style.overflow = c), (c = void 0))
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
                    !i.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var h = { targetElement: e, options: n || {} }
                    ;(i = [].concat(t(i), [h])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (a = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var o, n, r, i
                        1 === t.targetTouches.length &&
                          ((n = e),
                          (i = (o = t).targetTouches[0].clientY - a),
                          !u(o.target) &&
                            ((n && 0 === n.scrollTop && 0 < i) ||
                            ((r = n) && r.scrollHeight - r.scrollTop <= r.clientHeight && i < 0)
                              ? d(o)
                              : o.stopPropagation()))
                      }),
                      s || (document.addEventListener('touchmove', d, o ? { passive: !1 } : void 0), (s = !0))
                  }
                } else {
                  ;(m = n),
                    setTimeout(function () {
                      if (void 0 === l) {
                        var e = !!m && !0 === m.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((l = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === c && ((c = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var v = { targetElement: e, options: n || {} }
                  i = [].concat(t(i), [v])
                }
                var m
              }),
                (e.clearAllBodyScrollLocks = function () {
                  r
                    ? (i.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      s && (document.removeEventListener('touchmove', d, o ? { passive: !1 } : void 0), (s = !1)),
                      (i = []),
                      (a = -1))
                    : (h(), (i = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (r) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (i = i.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      s &&
                        0 === i.length &&
                        (document.removeEventListener('touchmove', d, o ? { passive: !1 } : void 0), (s = !1))
                  } else
                    1 === i.length && i[0].targetElement === e
                      ? (h(), (i = []))
                      : (i = i.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? o.apply(t, n)
              : o) || (e.exports = r)
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
    16842: e => {
      e.exports = {
        favorite: 'favorite-JVQQsDQk',
        disabled: 'disabled-JVQQsDQk',
        active: 'active-JVQQsDQk',
        checked: 'checked-JVQQsDQk',
      }
    },
    46608: (e, t, o) => {
      'use strict'
      o.r(t), o.d(t, { ContextMenuRenderer: () => c })
      var n = o(59496),
        r = o(87995),
        i = o(29332),
        s = o(62820),
        a = o(50655)
      class c {
        constructor(e, t, o, r) {
          ;(this._root = document.createElement('div')),
            (this._isShown = !1),
            (this._manager = null),
            (this._props = {
              isOpened: !1,
              items: e,
              position: { x: 0, y: 0 },
              menuStatName: t.statName,
              mode: t.mode,
              'data-name': t['data-name'],
            }),
            (this._onDestroy = o),
            (this._onShow = r),
            (this._activeElement = document.activeElement),
            (this._returnFocus = t.returnFocus),
            (this._takeFocus = t.takeFocus),
            (this._menuElementRef = n.createRef()),
            (this._doNotCloseOn = t.doNotCloseOn),
            t.manager && (this._manager = t.manager)
        }
        show(e) {
          this._onShow && this._onShow(),
            (this._isShown = !0),
            this._render({
              ...this._props,
              position: (t, o, n) => {
                var r, i, a
                e.touches &&
                  e.touches.length > 0 &&
                  (e = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
                let c
                switch (null !== (r = e.attachToXBy) && void 0 !== r ? r : (0, s.isRtl)() ? 'right' : 'left') {
                  case 'left':
                    c = e.clientX
                    break
                  case 'right':
                    c = e.clientX - t
                }
                let l,
                  u = null !== (i = e.attachToYBy) && void 0 !== i ? i : 'auto',
                  d = e.clientY
                if ('auto-strict' === u) {
                  const t = d + (null !== (a = e.boxHeight) && void 0 !== a ? a : 0)
                  n < t + o ? (u = 'bottom') : ((u = 'top'), (d = t))
                }
                switch (u) {
                  case 'top':
                    l = Math.min(o, n - d)
                    break
                  case 'bottom':
                    ;(d -= Math.min(o, d)), (l = 0 === d ? e.clientY : void 0)
                }
                return { x: c, y: d, overrideHeight: l }
              },
              isOpened: !0,
              onClose: () => {
                this.hide(), this._unmount()
              },
              doNotCloseOn: this._doNotCloseOn,
              takeFocus: this._takeFocus,
              menuElementReference: this._menuElementRef,
            })
        }
        hide() {
          ;(this._isShown = !1), this._render({ ...this._props, isOpened: !1 })
        }
        isShown() {
          return this._isShown
        }
        _unmount() {
          ;(this._isShown = !1),
            r.unmountComponentAtNode(this._root),
            this._onDestroy && this._onDestroy(),
            this._returnFocus &&
              this._activeElement instanceof HTMLElement &&
              this._activeElement.focus({ preventScroll: !0 })
        }
        _render(e) {
          r.render(
            n.createElement(
              a.SlotContext.Provider,
              { value: this._manager },
              n.createElement(i.OverlapContextMenu, { ...e }),
            ),
            this._root,
          )
        }
      }
    },
    39640: (e, t, o) => {
      'use strict'
      function n(e, t, o, n, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== o && null !== t && null !== i && i.ownerDocument === n && (t.contains(i) || o(r))
        }
        return (
          r.click && n.addEventListener('click', i, !1),
          r.mouseDown && n.addEventListener('mousedown', i, !1),
          r.touchEnd && n.addEventListener('touchend', i, !1),
          r.touchStart && n.addEventListener('touchstart', i, !1),
          () => {
            n.removeEventListener('click', i, !1),
              n.removeEventListener('mousedown', i, !1),
              n.removeEventListener('touchend', i, !1),
              n.removeEventListener('touchstart', i, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    37558: (e, t, o) => {
      'use strict'
      o.d(t, { DrawerManager: () => r, DrawerContext: () => i })
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
            i.Provider,
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
      const i = n.createContext(null)
    },
    41590: (e, t, o) => {
      'use strict'
      o.d(t, { Drawer: () => v })
      var n = o(59496),
        r = o(88537),
        i = o(97754),
        s = o(59142),
        a = o(99054),
        c = o(65718),
        l = o(37558),
        u = o(49483),
        d = o(29197),
        h = o(66998)
      function v(e) {
        const { position: t = 'Bottom', onClose: o, children: v, className: m, theme: w = h } = e,
          p = (0, r.ensureNotNull)((0, n.useContext)(l.DrawerContext)),
          [f, g] = (0, n.useState)(0),
          E = (0, n.useRef)(null),
          _ = (0, n.useContext)(d.CloseDelegateContext)
        return (
          (0, n.useEffect)(() => {
            const e = (0, r.ensureNotNull)(E.current)
            return (
              e.focus({ preventScroll: !0 }),
              _.subscribe(p, o),
              0 === p.currentDrawer && (0, a.setFixedBodyState)(!0),
              u.CheckMobile.iOS() && (0, s.disableBodyScroll)(e),
              g(p.addDrawer()),
              () => {
                _.unsubscribe(p, o)
                const t = p.removeDrawer()
                u.CheckMobile.iOS() && (0, s.enableBodyScroll)(e), 0 === t && (0, a.setFixedBodyState)(!1)
              }
            )
          }, []),
          n.createElement(
            c.Portal,
            null,
            n.createElement(
              'div',
              { className: i(h.wrap, h['position' + t]) },
              f === p.currentDrawer && n.createElement('div', { className: h.backdrop, onClick: o }),
              n.createElement(
                'div',
                {
                  className: i(h.drawer, w.drawer, h['position' + t], m),
                  ref: E,
                  tabIndex: -1,
                  'data-name': e['data-name'],
                },
                v,
              ),
            ),
          )
        )
      }
    },
    36189: (e, t, o) => {
      'use strict'
      o.d(t, { FavoriteButton: () => d })
      var n = o(28353),
        r = o(59496),
        i = o(97754),
        s = o(9745),
        a = o(20614),
        c = o(55783),
        l = o(16842)
      const u = { add: (0, n.t)('Add to favorites'), remove: (0, n.t)('Remove from favorites') }
      function d(e) {
        const { className: t, isFilled: o, isActive: n, onClick: d, ...h } = e
        return r.createElement(s.Icon, {
          ...h,
          className: i(l.favorite, 'apply-common-tooltip', o && l.checked, n && l.active, t),
          icon: o ? a : c,
          onClick: d,
          title: o ? u.remove : u.add,
        })
      }
    },
    37049: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    20614: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    55783: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
