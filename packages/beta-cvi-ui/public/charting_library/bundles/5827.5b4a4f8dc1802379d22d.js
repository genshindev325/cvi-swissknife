;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5827],
  {
    59142: function (e, t) {
      var n, r, o
      ;(r = [t]),
        void 0 ===
          (o =
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
                var r = {
                  get passive() {
                    n = !0
                  },
                }
                window.addEventListener('testPassive', null, r), window.removeEventListener('testPassive', null, r)
              }
              var o =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                u = [],
                i = !1,
                a = -1,
                s = void 0,
                c = void 0,
                l = function (e) {
                  return u.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                d = function (e) {
                  var t = e || window.event
                  return !!l(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                p = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== s && ((document.body.style.overflow = s), (s = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, r) {
                if (o) {
                  if (!e)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    e &&
                    !u.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var p = { targetElement: e, options: r || {} }
                    ;(u = [].concat(t(u), [p])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (a = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var n, r, o, u
                        1 === t.targetTouches.length &&
                          ((r = e),
                          (u = (n = t).targetTouches[0].clientY - a),
                          !l(n.target) &&
                            ((r && 0 === r.scrollTop && 0 < u) ||
                            ((o = r) && o.scrollHeight - o.scrollTop <= o.clientHeight && u < 0)
                              ? d(n)
                              : n.stopPropagation()))
                      }),
                      i || (document.addEventListener('touchmove', d, n ? { passive: !1 } : void 0), (i = !0))
                  }
                } else {
                  ;(v = r),
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
                  var f = { targetElement: e, options: r || {} }
                  u = [].concat(t(u), [f])
                }
                var v
              }),
                (e.clearAllBodyScrollLocks = function () {
                  o
                    ? (u.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      i && (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (i = !1)),
                      (u = []),
                      (a = -1))
                    : (p(), (u = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (o) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (u = u.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      i &&
                        0 === u.length &&
                        (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (i = !1))
                  } else
                    1 === u.length && u[0].targetElement === e
                      ? (p(), (u = []))
                      : (u = u.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? n.apply(t, r)
              : n) || (e.exports = o)
    },
    72535: (e, t, n) => {
      'use strict'
      var r = n(56237),
        o = {
          childContextTypes: !0,
          contextType: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          getDerivedStateFromError: !0,
          getDerivedStateFromProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0,
        },
        u = { name: !0, length: !0, prototype: !0, caller: !0, callee: !0, arguments: !0, arity: !0 },
        i = { $$typeof: !0, compare: !0, defaultProps: !0, displayName: !0, propTypes: !0, type: !0 },
        a = {}
      function s(e) {
        return r.isMemo(e) ? i : a[e.$$typeof] || o
      }
      ;(a[r.ForwardRef] = { $$typeof: !0, render: !0, defaultProps: !0, displayName: !0, propTypes: !0 }),
        (a[r.Memo] = i)
      var c = Object.defineProperty,
        l = Object.getOwnPropertyNames,
        d = Object.getOwnPropertySymbols,
        p = Object.getOwnPropertyDescriptor,
        f = Object.getPrototypeOf,
        v = Object.prototype
      e.exports = function e(t, n, r) {
        if ('string' != typeof n) {
          if (v) {
            var o = f(n)
            o && o !== v && e(t, o, r)
          }
          var i = l(n)
          d && (i = i.concat(d(n)))
          for (var a = s(t), h = s(n), m = 0; m < i.length; ++m) {
            var y = i[m]
            if (!(u[y] || (r && r[y]) || (h && h[y]) || (a && a[y]))) {
              var g = p(n, y)
              try {
                c(t, y, g)
              } catch (e) {}
            }
          }
        }
        return t
      }
    },
    79049: (e, t, n) => {
      'use strict'
      n.d(t, { Provider: () => c, connect: () => L })
      var r = n(59496),
        o = (n(19036), r.createContext(null))
      var u = function (e) {
          e()
        },
        i = function () {
          return u
        },
        a = { notify: function () {} }
      var s = (function () {
        function e(e, t) {
          ;(this.store = e),
            (this.parentSub = t),
            (this.unsubscribe = null),
            (this.listeners = a),
            (this.handleChangeWrapper = this.handleChangeWrapper.bind(this))
        }
        var t = e.prototype
        return (
          (t.addNestedSub = function (e) {
            return this.trySubscribe(), this.listeners.subscribe(e)
          }),
          (t.notifyNestedSubs = function () {
            this.listeners.notify()
          }),
          (t.handleChangeWrapper = function () {
            this.onStateChange && this.onStateChange()
          }),
          (t.isSubscribed = function () {
            return Boolean(this.unsubscribe)
          }),
          (t.trySubscribe = function () {
            this.unsubscribe ||
              ((this.unsubscribe = this.parentSub
                ? this.parentSub.addNestedSub(this.handleChangeWrapper)
                : this.store.subscribe(this.handleChangeWrapper)),
              (this.listeners = (function () {
                var e = i(),
                  t = null,
                  n = null
                return {
                  clear: function () {
                    ;(t = null), (n = null)
                  },
                  notify: function () {
                    e(function () {
                      for (var e = t; e; ) e.callback(), (e = e.next)
                    })
                  },
                  get: function () {
                    for (var e = [], n = t; n; ) e.push(n), (n = n.next)
                    return e
                  },
                  subscribe: function (e) {
                    var r = !0,
                      o = (n = { callback: e, next: null, prev: n })
                    return (
                      o.prev ? (o.prev.next = o) : (t = o),
                      function () {
                        r &&
                          null !== t &&
                          ((r = !1),
                          o.next ? (o.next.prev = o.prev) : (n = o.prev),
                          o.prev ? (o.prev.next = o.next) : (t = o.next))
                      }
                    )
                  },
                }
              })()))
          }),
          (t.tryUnsubscribe = function () {
            this.unsubscribe &&
              (this.unsubscribe(), (this.unsubscribe = null), this.listeners.clear(), (this.listeners = a))
          }),
          e
        )
      })()
      const c = function (e) {
        var t = e.store,
          n = e.context,
          u = e.children,
          i = (0, r.useMemo)(
            function () {
              var e = new s(t)
              return (e.onStateChange = e.notifyNestedSubs), { store: t, subscription: e }
            },
            [t],
          ),
          a = (0, r.useMemo)(
            function () {
              return t.getState()
            },
            [t],
          )
        ;(0, r.useEffect)(
          function () {
            var e = i.subscription
            return (
              e.trySubscribe(),
              a !== t.getState() && e.notifyNestedSubs(),
              function () {
                e.tryUnsubscribe(), (e.onStateChange = null)
              }
            )
          },
          [i, a],
        )
        var c = n || o
        return r.createElement(c.Provider, { value: i }, u)
      }
      var l = n(19624),
        d = n(20042),
        p = n(72535),
        f = n.n(p),
        v = n(56237),
        h =
          'undefined' != typeof window && void 0 !== window.document && void 0 !== window.document.createElement
            ? r.useLayoutEffect
            : r.useEffect,
        m = [],
        y = [null, null]
      function g(e, t) {
        var n = e[1]
        return [t.payload, n + 1]
      }
      function b(e, t, n) {
        h(function () {
          return e.apply(void 0, t)
        }, n)
      }
      function w(e, t, n, r, o, u, i) {
        ;(e.current = r), (t.current = o), (n.current = !1), u.current && ((u.current = null), i())
      }
      function P(e, t, n, r, o, u, i, a, s, c) {
        if (e) {
          var l = !1,
            d = null,
            p = function () {
              if (!l) {
                var e,
                  n,
                  p = t.getState()
                try {
                  e = r(p, o.current)
                } catch (e) {
                  ;(n = e), (d = e)
                }
                n || (d = null),
                  e === u.current
                    ? i.current || s()
                    : ((u.current = e),
                      (a.current = e),
                      (i.current = !0),
                      c({ type: 'STORE_UPDATED', payload: { error: n } }))
              }
            }
          ;(n.onStateChange = p), n.trySubscribe(), p()
          return function () {
            if (((l = !0), n.tryUnsubscribe(), (n.onStateChange = null), d)) throw d
          }
        }
      }
      var S = function () {
        return [null, 0]
      }
      function E(e, t) {
        void 0 === t && (t = {})
        var n = t,
          u = n.getDisplayName,
          i =
            void 0 === u
              ? function (e) {
                  return 'ConnectAdvanced(' + e + ')'
                }
              : u,
          a = n.methodName,
          c = void 0 === a ? 'connectAdvanced' : a,
          p = n.renderCountProp,
          h = void 0 === p ? void 0 : p,
          E = n.shouldHandleStateChanges,
          O = void 0 === E || E,
          C = n.storeKey,
          T = void 0 === C ? 'store' : C,
          M = (n.withRef, n.forwardRef),
          N = void 0 !== M && M,
          x = n.context,
          R = void 0 === x ? o : x,
          D = (0, d.default)(n, [
            'getDisplayName',
            'methodName',
            'renderCountProp',
            'shouldHandleStateChanges',
            'storeKey',
            'withRef',
            'forwardRef',
            'context',
          ]),
          q = R
        return function (t) {
          var n = t.displayName || t.name || 'Component',
            o = i(n),
            u = (0, l.default)({}, D, {
              getDisplayName: i,
              methodName: c,
              renderCountProp: h,
              shouldHandleStateChanges: O,
              storeKey: T,
              displayName: o,
              wrappedComponentName: n,
              WrappedComponent: t,
            }),
            a = D.pure
          var p = a
            ? r.useMemo
            : function (e) {
                return e()
              }
          function E(n) {
            var o = (0, r.useMemo)(
                function () {
                  var e = n.forwardedRef,
                    t = (0, d.default)(n, ['forwardedRef'])
                  return [n.context, e, t]
                },
                [n],
              ),
              i = o[0],
              a = o[1],
              c = o[2],
              f = (0, r.useMemo)(
                function () {
                  return i && i.Consumer && (0, v.isContextConsumer)(r.createElement(i.Consumer, null)) ? i : q
                },
                [i, q],
              ),
              h = (0, r.useContext)(f),
              E = Boolean(n.store) && Boolean(n.store.getState) && Boolean(n.store.dispatch)
            Boolean(h) && Boolean(h.store)
            var C = E ? n.store : h.store,
              T = (0, r.useMemo)(
                function () {
                  return (function (t) {
                    return e(t.dispatch, u)
                  })(C)
                },
                [C],
              ),
              M = (0, r.useMemo)(
                function () {
                  if (!O) return y
                  var e = new s(C, E ? null : h.subscription),
                    t = e.notifyNestedSubs.bind(e)
                  return [e, t]
                },
                [C, E, h],
              ),
              N = M[0],
              x = M[1],
              R = (0, r.useMemo)(
                function () {
                  return E ? h : (0, l.default)({}, h, { subscription: N })
                },
                [E, h, N],
              ),
              D = (0, r.useReducer)(g, m, S),
              B = D[0][0],
              j = D[1]
            if (B && B.error) throw B.error
            var W = (0, r.useRef)(),
              k = (0, r.useRef)(c),
              A = (0, r.useRef)(),
              F = (0, r.useRef)(!1),
              H = p(
                function () {
                  return A.current && c === k.current ? A.current : T(C.getState(), c)
                },
                [C, B, c],
              )
            b(w, [k, W, F, c, H, A, x]), b(P, [O, C, N, T, k, W, F, A, x, j], [C, N, T])
            var L = (0, r.useMemo)(
              function () {
                return r.createElement(t, (0, l.default)({}, H, { ref: a }))
              },
              [a, t, H],
            )
            return (0, r.useMemo)(
              function () {
                return O ? r.createElement(f.Provider, { value: R }, L) : L
              },
              [f, L, R],
            )
          }
          var C = a ? r.memo(E) : E
          if (((C.WrappedComponent = t), (C.displayName = o), N)) {
            var M = r.forwardRef(function (e, t) {
              return r.createElement(C, (0, l.default)({}, e, { forwardedRef: t }))
            })
            return (M.displayName = o), (M.WrappedComponent = t), f()(M, t)
          }
          return f()(C, t)
        }
      }
      function O(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
      }
      function C(e, t) {
        if (O(e, t)) return !0
        if ('object' != typeof e || null === e || 'object' != typeof t || null === t) return !1
        var n = Object.keys(e),
          r = Object.keys(t)
        if (n.length !== r.length) return !1
        for (var o = 0; o < n.length; o++)
          if (!Object.prototype.hasOwnProperty.call(t, n[o]) || !O(e[n[o]], t[n[o]])) return !1
        return !0
      }
      var T = n(83243)
      function M(e) {
        return function (t, n) {
          var r = e(t, n)
          function o() {
            return r
          }
          return (o.dependsOnOwnProps = !1), o
        }
      }
      function N(e) {
        return null !== e.dependsOnOwnProps && void 0 !== e.dependsOnOwnProps
          ? Boolean(e.dependsOnOwnProps)
          : 1 !== e.length
      }
      function x(e, t) {
        return function (t, n) {
          n.displayName
          var r = function (e, t) {
            return r.dependsOnOwnProps ? r.mapToProps(e, t) : r.mapToProps(e)
          }
          return (
            (r.dependsOnOwnProps = !0),
            (r.mapToProps = function (t, n) {
              ;(r.mapToProps = e), (r.dependsOnOwnProps = N(e))
              var o = r(t, n)
              return 'function' == typeof o && ((r.mapToProps = o), (r.dependsOnOwnProps = N(o)), (o = r(t, n))), o
            }),
            r
          )
        }
      }
      const R = [
        function (e) {
          return 'function' == typeof e ? x(e) : void 0
        },
        function (e) {
          return e
            ? void 0
            : M(function (e) {
                return { dispatch: e }
              })
        },
        function (e) {
          return e && 'object' == typeof e
            ? M(function (t) {
                return (0, T.bindActionCreators)(e, t)
              })
            : void 0
        },
      ]
      const D = [
        function (e) {
          return 'function' == typeof e ? x(e) : void 0
        },
        function (e) {
          return e
            ? void 0
            : M(function () {
                return {}
              })
        },
      ]
      function q(e, t, n) {
        return (0, l.default)({}, n, {}, e, {}, t)
      }
      const B = [
        function (e) {
          return 'function' == typeof e
            ? (function (e) {
                return function (t, n) {
                  n.displayName
                  var r,
                    o = n.pure,
                    u = n.areMergedPropsEqual,
                    i = !1
                  return function (t, n, a) {
                    var s = e(t, n, a)
                    return i ? (o && u(s, r)) || (r = s) : ((i = !0), (r = s)), r
                  }
                }
              })(e)
            : void 0
        },
        function (e) {
          return e
            ? void 0
            : function () {
                return q
              }
        },
      ]
      function j(e, t, n, r) {
        return function (o, u) {
          return n(e(o, u), t(r, u), u)
        }
      }
      function W(e, t, n, r, o) {
        var u,
          i,
          a,
          s,
          c,
          l = o.areStatesEqual,
          d = o.areOwnPropsEqual,
          p = o.areStatePropsEqual,
          f = !1
        function v(o, f) {
          var v,
            h,
            m = !d(f, i),
            y = !l(o, u)
          return (
            (u = o),
            (i = f),
            m && y
              ? ((a = e(u, i)), t.dependsOnOwnProps && (s = t(r, i)), (c = n(a, s, i)))
              : m
              ? (e.dependsOnOwnProps && (a = e(u, i)), t.dependsOnOwnProps && (s = t(r, i)), (c = n(a, s, i)))
              : y
              ? ((v = e(u, i)), (h = !p(v, a)), (a = v), h && (c = n(a, s, i)), c)
              : c
          )
        }
        return function (o, l) {
          return f ? v(o, l) : ((a = e((u = o), (i = l))), (s = t(r, i)), (c = n(a, s, i)), (f = !0), c)
        }
      }
      function k(e, t) {
        var n = t.initMapStateToProps,
          r = t.initMapDispatchToProps,
          o = t.initMergeProps,
          u = (0, d.default)(t, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']),
          i = n(e, u),
          a = r(e, u),
          s = o(e, u)
        return (u.pure ? W : j)(i, a, s, e, u)
      }
      function A(e, t, n) {
        for (var r = t.length - 1; r >= 0; r--) {
          var o = t[r](e)
          if (o) return o
        }
        return function (t, r) {
          throw new Error(
            'Invalid value of type ' +
              typeof e +
              ' for ' +
              n +
              ' argument when connecting component ' +
              r.wrappedComponentName +
              '.',
          )
        }
      }
      function F(e, t) {
        return e === t
      }
      function H(e) {
        var t = void 0 === e ? {} : e,
          n = t.connectHOC,
          r = void 0 === n ? E : n,
          o = t.mapStateToPropsFactories,
          u = void 0 === o ? D : o,
          i = t.mapDispatchToPropsFactories,
          a = void 0 === i ? R : i,
          s = t.mergePropsFactories,
          c = void 0 === s ? B : s,
          p = t.selectorFactory,
          f = void 0 === p ? k : p
        return function (e, t, n, o) {
          void 0 === o && (o = {})
          var i = o,
            s = i.pure,
            p = void 0 === s || s,
            v = i.areStatesEqual,
            h = void 0 === v ? F : v,
            m = i.areOwnPropsEqual,
            y = void 0 === m ? C : m,
            g = i.areStatePropsEqual,
            b = void 0 === g ? C : g,
            w = i.areMergedPropsEqual,
            P = void 0 === w ? C : w,
            S = (0, d.default)(i, [
              'pure',
              'areStatesEqual',
              'areOwnPropsEqual',
              'areStatePropsEqual',
              'areMergedPropsEqual',
            ]),
            E = A(e, u, 'mapStateToProps'),
            O = A(t, a, 'mapDispatchToProps'),
            T = A(n, c, 'mergeProps')
          return r(
            f,
            (0, l.default)(
              {
                methodName: 'connect',
                getDisplayName: function (e) {
                  return 'Connect(' + e + ')'
                },
                shouldHandleStateChanges: Boolean(e),
                initMapStateToProps: E,
                initMapDispatchToProps: O,
                initMergeProps: T,
                pure: p,
                areStatesEqual: h,
                areOwnPropsEqual: y,
                areStatePropsEqual: b,
                areMergedPropsEqual: P,
              },
              S,
            ),
          )
        }
      }
      const L = H()
      var $,
        U = n(87995)
      ;($ = U.unstable_batchedUpdates), (u = $)
    },
  },
])
