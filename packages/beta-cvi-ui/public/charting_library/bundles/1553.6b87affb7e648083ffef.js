;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1553],
  {
    11553: (t, e, i) => {
      var n
      !(function (r, s, o, a) {
        'use strict'
        var h,
          u = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'],
          c = s.createElement('div'),
          l = Math.round,
          p = Math.abs,
          f = Date.now
        function v(t, e, i) {
          return setTimeout(I(t, i), e)
        }
        function d(t, e, i) {
          return !!Array.isArray(t) && (m(t, i[e], i), !0)
        }
        function m(t, e, i) {
          var n
          if (t)
            if (t.forEach) t.forEach(e, i)
            else if (void 0 !== t.length) for (n = 0; n < t.length; ) e.call(i, t[n], n, t), n++
            else for (n in t) t.hasOwnProperty(n) && e.call(i, t[n], n, t)
        }
        function g(t, e, i) {
          var n = 'DEPRECATED METHOD: ' + e + '\n' + i + ' AT \n'
          return function () {
            var e = new Error('get-stack-trace'),
              i =
                e && e.stack
                  ? e.stack
                      .replace(/^[^\(]+?[\n$]/gm, '')
                      .replace(/^\s+at\s+/gm, '')
                      .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                  : 'Unknown Stack Trace',
              s = r.console && (r.console.warn || r.console.log)
            return s && s.call(r.console, n, i), t.apply(this, arguments)
          }
        }
        h =
          'function' != typeof Object.assign
            ? function (t) {
                if (null == t) throw new TypeError('Cannot convert undefined or null to object')
                for (var e = Object(t), i = 1; i < arguments.length; i++) {
                  var n = arguments[i]
                  if (null != n) for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r])
                }
                return e
              }
            : Object.assign
        var T = g(
            function (t, e, i) {
              for (var n = Object.keys(e), r = 0; r < n.length; )
                (!i || (i && void 0 === t[n[r]])) && (t[n[r]] = e[n[r]]), r++
              return t
            },
            'extend',
            'Use `assign`.',
          ),
          y = g(
            function (t, e) {
              return T(t, e, !0)
            },
            'merge',
            'Use `assign`.',
          )
        function E(t, e, i) {
          var n,
            r = e.prototype
          ;((n = t.prototype = Object.create(r)).constructor = t), (n._super = r), i && h(n, i)
        }
        function I(t, e) {
          return function () {
            return t.apply(e, arguments)
          }
        }
        function A(t, e) {
          return 'function' == typeof t ? t.apply((e && e[0]) || void 0, e) : t
        }
        function C(t, e) {
          return void 0 === t ? e : t
        }
        function b(t, e, i) {
          m(x(e), function (e) {
            t.addEventListener(e, i, !1)
          })
        }
        function _(t, e, i) {
          m(x(e), function (e) {
            t.removeEventListener(e, i, !1)
          })
        }
        function S(t, e) {
          for (; t; ) {
            if (t == e) return !0
            t = t.parentNode
          }
          return !1
        }
        function P(t, e) {
          return t.indexOf(e) > -1
        }
        function x(t) {
          return t.trim().split(/\s+/g)
        }
        function D(t, e, i) {
          if (t.indexOf && !i) return t.indexOf(e)
          for (var n = 0; n < t.length; ) {
            if ((i && t[n][i] == e) || (!i && t[n] === e)) return n
            n++
          }
          return -1
        }
        function w(t) {
          return Array.prototype.slice.call(t, 0)
        }
        function O(t, e, i) {
          for (var n = [], r = [], s = 0; s < t.length; ) {
            var o = e ? t[s][e] : t[s]
            D(r, o) < 0 && n.push(t[s]), (r[s] = o), s++
          }
          return (
            i &&
              (n = e
                ? n.sort(function (t, i) {
                    return t[e] > i[e]
                  })
                : n.sort()),
            n
          )
        }
        function R(t, e) {
          for (var i, n, r = e[0].toUpperCase() + e.slice(1), s = 0; s < u.length; ) {
            if ((n = (i = u[s]) ? i + r : e) in t) return n
            s++
          }
        }
        var M = 1
        function z(t) {
          var e = t.ownerDocument || t
          return e.defaultView || e.parentWindow || r
        }
        var N = 'ontouchstart' in r,
          X = void 0 !== R(r, 'PointerEvent'),
          Y = N && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),
          F = ['x', 'y'],
          k = ['clientX', 'clientY']
        function W(t, e) {
          var i = this
          ;(this.manager = t),
            (this.callback = e),
            (this.element = t.element),
            (this.target = t.options.inputTarget),
            (this.domHandler = function (e) {
              A(t.options.enable, [t]) && i.handler(e)
            }),
            this.init()
        }
        function q(t, e, i) {
          var n = i.pointers.length,
            r = i.changedPointers.length,
            s = 1 & e && n - r == 0,
            o = 12 & e && n - r == 0
          ;(i.isFirst = !!s),
            (i.isFinal = !!o),
            s && (t.session = {}),
            (i.eventType = e),
            (function (t, e) {
              var i = t.session,
                n = e.pointers,
                r = n.length
              i.firstInput || (i.firstInput = L(e))
              r > 1 && !i.firstMultiple ? (i.firstMultiple = L(e)) : 1 === r && (i.firstMultiple = !1)
              var s = i.firstInput,
                o = i.firstMultiple,
                a = o ? o.center : s.center,
                h = (e.center = H(n))
              ;(e.timeStamp = f()),
                (e.deltaTime = e.timeStamp - s.timeStamp),
                (e.angle = G(a, h)),
                (e.distance = j(a, h)),
                (function (t, e) {
                  var i = e.center,
                    n = t.offsetDelta || {},
                    r = t.prevDelta || {},
                    s = t.prevInput || {}
                  ;(1 !== e.eventType && 4 !== s.eventType) ||
                    ((r = t.prevDelta = { x: s.deltaX || 0, y: s.deltaY || 0 }),
                    (n = t.offsetDelta = { x: i.x, y: i.y }))
                  ;(e.deltaX = r.x + (i.x - n.x)), (e.deltaY = r.y + (i.y - n.y))
                })(i, e),
                (e.offsetDirection = V(e.deltaX, e.deltaY))
              var u = U(e.deltaTime, e.deltaX, e.deltaY)
              ;(e.overallVelocityX = u.x),
                (e.overallVelocityY = u.y),
                (e.overallVelocity = p(u.x) > p(u.y) ? u.x : u.y),
                (e.scale = o ? ((c = o.pointers), (l = n), j(l[0], l[1], k) / j(c[0], c[1], k)) : 1),
                (e.rotation = o
                  ? (function (t, e) {
                      return G(e[1], e[0], k) + G(t[1], t[0], k)
                    })(o.pointers, n)
                  : 0),
                (e.maxPointers = i.prevInput
                  ? e.pointers.length > i.prevInput.maxPointers
                    ? e.pointers.length
                    : i.prevInput.maxPointers
                  : e.pointers.length),
                (function (t, e) {
                  var i,
                    n,
                    r,
                    s,
                    o = t.lastInterval || e,
                    a = e.timeStamp - o.timeStamp
                  if (8 != e.eventType && (a > 25 || void 0 === o.velocity)) {
                    var h = e.deltaX - o.deltaX,
                      u = e.deltaY - o.deltaY,
                      c = U(a, h, u)
                    ;(n = c.x), (r = c.y), (i = p(c.x) > p(c.y) ? c.x : c.y), (s = V(h, u)), (t.lastInterval = e)
                  } else (i = o.velocity), (n = o.velocityX), (r = o.velocityY), (s = o.direction)
                  ;(e.velocity = i), (e.velocityX = n), (e.velocityY = r), (e.direction = s)
                })(i, e)
              var c, l
              var v = t.element
              S(e.srcEvent.target, v) && (v = e.srcEvent.target)
              e.target = v
            })(t, i),
            t.emit('hammer.input', i),
            t.recognize(i),
            (t.session.prevInput = i)
        }
        function L(t) {
          for (var e = [], i = 0; i < t.pointers.length; )
            (e[i] = { clientX: l(t.pointers[i].clientX), clientY: l(t.pointers[i].clientY) }), i++
          return { timeStamp: f(), pointers: e, center: H(e), deltaX: t.deltaX, deltaY: t.deltaY }
        }
        function H(t) {
          var e = t.length
          if (1 === e) return { x: l(t[0].clientX), y: l(t[0].clientY) }
          for (var i = 0, n = 0, r = 0; r < e; ) (i += t[r].clientX), (n += t[r].clientY), r++
          return { x: l(i / e), y: l(n / e) }
        }
        function U(t, e, i) {
          return { x: e / t || 0, y: i / t || 0 }
        }
        function V(t, e) {
          return t === e ? 1 : p(t) >= p(e) ? (t < 0 ? 2 : 4) : e < 0 ? 8 : 16
        }
        function j(t, e, i) {
          i || (i = F)
          var n = e[i[0]] - t[i[0]],
            r = e[i[1]] - t[i[1]]
          return Math.sqrt(n * n + r * r)
        }
        function G(t, e, i) {
          i || (i = F)
          var n = e[i[0]] - t[i[0]],
            r = e[i[1]] - t[i[1]]
          return (180 * Math.atan2(r, n)) / Math.PI
        }
        W.prototype = {
          handler: function () {},
          init: function () {
            this.evEl && b(this.element, this.evEl, this.domHandler),
              this.evTarget && b(this.target, this.evTarget, this.domHandler),
              this.evWin && b(z(this.element), this.evWin, this.domHandler)
          },
          destroy: function () {
            this.evEl && _(this.element, this.evEl, this.domHandler),
              this.evTarget && _(this.target, this.evTarget, this.domHandler),
              this.evWin && _(z(this.element), this.evWin, this.domHandler)
          },
        }
        var Z = { mousedown: 1, mousemove: 2, mouseup: 4 }
        function B() {
          ;(this.evEl = 'mousedown'), (this.evWin = 'mousemove mouseup'), (this.pressed = !1), W.apply(this, arguments)
        }
        E(B, W, {
          handler: function (t) {
            var e = Z[t.type]
            1 & e && 0 === t.button && (this.pressed = !0),
              2 & e && 1 !== t.which && (e = 4),
              this.pressed &&
                (4 & e && (this.pressed = !1),
                this.callback(this.manager, e, {
                  pointers: [t],
                  changedPointers: [t],
                  pointerType: 'mouse',
                  srcEvent: t,
                }))
          },
        })
        var $ = { pointerdown: 1, pointermove: 2, pointerup: 4, pointercancel: 8, pointerout: 8 },
          J = { 2: 'touch', 3: 'pen', 4: 'mouse', 5: 'kinect' },
          K = 'pointerdown',
          Q = 'pointermove pointerup pointercancel'
        function tt() {
          ;(this.evEl = K),
            (this.evWin = Q),
            W.apply(this, arguments),
            (this.store = this.manager.session.pointerEvents = [])
        }
        r.MSPointerEvent &&
          !r.PointerEvent &&
          ((K = 'MSPointerDown'), (Q = 'MSPointerMove MSPointerUp MSPointerCancel')),
          E(tt, W, {
            handler: function (t) {
              var e = this.store,
                i = !1,
                n = t.type.toLowerCase().replace('ms', ''),
                r = $[n],
                s = J[t.pointerType] || t.pointerType,
                o = 'touch' == s,
                a = D(e, t.pointerId, 'pointerId')
              1 & r && (0 === t.button || o) ? a < 0 && (e.push(t), (a = e.length - 1)) : 12 & r && (i = !0),
                a < 0 ||
                  ((e[a] = t),
                  this.callback(this.manager, r, { pointers: e, changedPointers: [t], pointerType: s, srcEvent: t }),
                  i && e.splice(a, 1))
            },
          })
        var et = { touchstart: 1, touchmove: 2, touchend: 4, touchcancel: 8 }
        function it() {
          ;(this.evTarget = 'touchstart'),
            (this.evWin = 'touchstart touchmove touchend touchcancel'),
            (this.started = !1),
            W.apply(this, arguments)
        }
        function nt(t, e) {
          var i = w(t.touches),
            n = w(t.changedTouches)
          return 12 & e && (i = O(i.concat(n), 'identifier', !0)), [i, n]
        }
        E(it, W, {
          handler: function (t) {
            var e = et[t.type]
            if ((1 === e && (this.started = !0), this.started)) {
              var i = nt.call(this, t, e)
              12 & e && i[0].length - i[1].length == 0 && (this.started = !1),
                this.callback(this.manager, e, {
                  pointers: i[0],
                  changedPointers: i[1],
                  pointerType: 'touch',
                  srcEvent: t,
                })
            }
          },
        })
        var rt = { touchstart: 1, touchmove: 2, touchend: 4, touchcancel: 8 }
        function st() {
          ;(this.evTarget = 'touchstart touchmove touchend touchcancel'),
            (this.targetIds = {}),
            W.apply(this, arguments)
        }
        function ot(t, e) {
          var i = w(t.touches),
            n = this.targetIds
          if (3 & e && 1 === i.length) return (n[i[0].identifier] = !0), [i, i]
          var r,
            s,
            o = w(t.changedTouches),
            a = [],
            h = this.target
          if (
            ((s = i.filter(function (t) {
              return S(t.target, h)
            })),
            1 === e)
          )
            for (r = 0; r < s.length; ) (n[s[r].identifier] = !0), r++
          for (r = 0; r < o.length; ) n[o[r].identifier] && a.push(o[r]), 12 & e && delete n[o[r].identifier], r++
          return a.length ? [O(s.concat(a), 'identifier', !0), a] : void 0
        }
        E(st, W, {
          handler: function (t) {
            var e = rt[t.type],
              i = ot.call(this, t, e)
            i &&
              this.callback(this.manager, e, {
                pointers: i[0],
                changedPointers: i[1],
                pointerType: 'touch',
                srcEvent: t,
              })
          },
        })
        function at() {
          W.apply(this, arguments)
          var t = I(this.handler, this)
          ;(this.touch = new st(this.manager, t)),
            (this.mouse = new B(this.manager, t)),
            (this.primaryTouch = null),
            (this.lastTouches = [])
        }
        function ht(t, e) {
          1 & t ? ((this.primaryTouch = e.changedPointers[0].identifier), ut.call(this, e)) : 12 & t && ut.call(this, e)
        }
        function ut(t) {
          var e = t.changedPointers[0]
          if (e.identifier === this.primaryTouch) {
            var i = { x: e.clientX, y: e.clientY }
            this.lastTouches.push(i)
            var n = this.lastTouches
            setTimeout(function () {
              var t = n.indexOf(i)
              t > -1 && n.splice(t, 1)
            }, 2500)
          }
        }
        function ct(t) {
          for (var e = t.srcEvent.clientX, i = t.srcEvent.clientY, n = 0; n < this.lastTouches.length; n++) {
            var r = this.lastTouches[n],
              s = Math.abs(e - r.x),
              o = Math.abs(i - r.y)
            if (s <= 25 && o <= 25) return !0
          }
          return !1
        }
        E(at, W, {
          handler: function (t, e, i) {
            var n = 'touch' == i.pointerType,
              r = 'mouse' == i.pointerType
            if (!(r && i.sourceCapabilities && i.sourceCapabilities.firesTouchEvents)) {
              if (n) ht.call(this, e, i)
              else if (r && ct.call(this, i)) return
              this.callback(t, e, i)
            }
          },
          destroy: function () {
            this.touch.destroy(), this.mouse.destroy()
          },
        })
        var lt = R(c.style, 'touchAction'),
          pt = void 0 !== lt,
          ft = (function () {
            if (!pt) return !1
            var t = {},
              e = r.CSS && r.CSS.supports
            return (
              ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (i) {
                t[i] = !e || r.CSS.supports('touch-action', i)
              }),
              t
            )
          })()
        function vt(t, e) {
          ;(this.manager = t), this.set(e)
        }
        vt.prototype = {
          set: function (t) {
            'compute' == t && (t = this.compute()),
              pt && this.manager.element.style && ft[t] && (this.manager.element.style[lt] = t),
              (this.actions = t.toLowerCase().trim())
          },
          update: function () {
            this.set(this.manager.options.touchAction)
          },
          compute: function () {
            var t = []
            return (
              m(this.manager.recognizers, function (e) {
                A(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
              }),
              (function (t) {
                if (P(t, 'none')) return 'none'
                var e = P(t, 'pan-x'),
                  i = P(t, 'pan-y')
                if (e && i) return 'none'
                if (e || i) return e ? 'pan-x' : 'pan-y'
                if (P(t, 'manipulation')) return 'manipulation'
                return 'auto'
              })(t.join(' '))
            )
          },
          preventDefaults: function (t) {
            var e = t.srcEvent,
              i = t.offsetDirection
            if (this.manager.session.prevented) e.preventDefault()
            else {
              var n = this.actions,
                r = P(n, 'none') && !ft.none,
                s = P(n, 'pan-y') && !ft['pan-y'],
                o = P(n, 'pan-x') && !ft['pan-x']
              if (r) {
                var a = 1 === t.pointers.length,
                  h = t.distance < 2,
                  u = t.deltaTime < 250
                if (a && h && u) return
              }
              if (!o || !s) return r || (s && 6 & i) || (o && 24 & i) ? this.preventSrc(e) : void 0
            }
          },
          preventSrc: function (t) {
            ;(this.manager.session.prevented = !0), t.preventDefault()
          },
        }
        function dt(t) {
          ;(this.options = h({}, this.defaults, t || {})),
            (this.id = M++),
            (this.manager = null),
            (this.options.enable = C(this.options.enable, !0)),
            (this.state = 1),
            (this.simultaneous = {}),
            (this.requireFail = [])
        }
        function mt(t) {
          return 16 & t ? 'cancel' : 8 & t ? 'end' : 4 & t ? 'move' : 2 & t ? 'start' : ''
        }
        function gt(t) {
          return 16 == t ? 'down' : 8 == t ? 'up' : 2 == t ? 'left' : 4 == t ? 'right' : ''
        }
        function Tt(t, e) {
          var i = e.manager
          return i ? i.get(t) : t
        }
        function yt() {
          dt.apply(this, arguments)
        }
        function Et() {
          yt.apply(this, arguments), (this.pX = null), (this.pY = null)
        }
        function It() {
          yt.apply(this, arguments)
        }
        function At() {
          dt.apply(this, arguments), (this._timer = null), (this._input = null)
        }
        function Ct() {
          yt.apply(this, arguments)
        }
        function bt() {
          yt.apply(this, arguments)
        }
        function _t() {
          dt.apply(this, arguments),
            (this.pTime = !1),
            (this.pCenter = !1),
            (this._timer = null),
            (this._input = null),
            (this.count = 0)
        }
        function St(t, e) {
          return ((e = e || {}).recognizers = C(e.recognizers, St.defaults.preset)), new Pt(t, e)
        }
        ;(dt.prototype = {
          defaults: {},
          set: function (t) {
            return h(this.options, t), this.manager && this.manager.touchAction.update(), this
          },
          recognizeWith: function (t) {
            if (d(t, 'recognizeWith', this)) return this
            var e = this.simultaneous
            return e[(t = Tt(t, this)).id] || ((e[t.id] = t), t.recognizeWith(this)), this
          },
          dropRecognizeWith: function (t) {
            return d(t, 'dropRecognizeWith', this) || ((t = Tt(t, this)), delete this.simultaneous[t.id]), this
          },
          requireFailure: function (t) {
            if (d(t, 'requireFailure', this)) return this
            var e = this.requireFail
            return -1 === D(e, (t = Tt(t, this))) && (e.push(t), t.requireFailure(this)), this
          },
          dropRequireFailure: function (t) {
            if (d(t, 'dropRequireFailure', this)) return this
            t = Tt(t, this)
            var e = D(this.requireFail, t)
            return e > -1 && this.requireFail.splice(e, 1), this
          },
          hasRequireFailures: function () {
            return this.requireFail.length > 0
          },
          canRecognizeWith: function (t) {
            return !!this.simultaneous[t.id]
          },
          emit: function (t) {
            var e = this,
              i = this.state
            function n(i) {
              e.manager.emit(i, t)
            }
            i < 8 && n(e.options.event + mt(i)),
              n(e.options.event),
              t.additionalEvent && n(t.additionalEvent),
              i >= 8 && n(e.options.event + mt(i))
          },
          tryEmit: function (t) {
            if (this.canEmit()) return this.emit(t)
            this.state = 32
          },
          canEmit: function () {
            for (var t = 0; t < this.requireFail.length; ) {
              if (!(33 & this.requireFail[t].state)) return !1
              t++
            }
            return !0
          },
          recognize: function (t) {
            var e = h({}, t)
            if (!A(this.options.enable, [this, e])) return this.reset(), void (this.state = 32)
            56 & this.state && (this.state = 1), (this.state = this.process(e)), 30 & this.state && this.tryEmit(e)
          },
          process: function (t) {},
          getTouchAction: function () {},
          reset: function () {},
        }),
          E(yt, dt, {
            defaults: { pointers: 1 },
            attrTest: function (t) {
              var e = this.options.pointers
              return 0 === e || t.pointers.length === e
            },
            process: function (t) {
              var e = this.state,
                i = t.eventType,
                n = 6 & e,
                r = this.attrTest(t)
              return n && (8 & i || !r) ? 16 | e : n || r ? (4 & i ? 8 | e : 2 & e ? 4 | e : 2) : 32
            },
          }),
          E(Et, yt, {
            defaults: { event: 'pan', threshold: 10, pointers: 1, direction: 30 },
            getTouchAction: function () {
              var t = this.options.direction,
                e = []
              return 6 & t && e.push('pan-y'), 24 & t && e.push('pan-x'), e
            },
            directionTest: function (t) {
              var e = this.options,
                i = !0,
                n = t.distance,
                r = t.direction,
                s = t.deltaX,
                o = t.deltaY
              return (
                r & e.direction ||
                  (6 & e.direction
                    ? ((r = 0 === s ? 1 : s < 0 ? 2 : 4), (i = s != this.pX), (n = Math.abs(t.deltaX)))
                    : ((r = 0 === o ? 1 : o < 0 ? 8 : 16), (i = o != this.pY), (n = Math.abs(t.deltaY)))),
                (t.direction = r),
                i && n > e.threshold && r & e.direction
              )
            },
            attrTest: function (t) {
              return (
                yt.prototype.attrTest.call(this, t) && (2 & this.state || (!(2 & this.state) && this.directionTest(t)))
              )
            },
            emit: function (t) {
              ;(this.pX = t.deltaX), (this.pY = t.deltaY)
              var e = gt(t.direction)
              e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
            },
          }),
          E(It, yt, {
            defaults: { event: 'pinch', threshold: 0, pointers: 2 },
            getTouchAction: function () {
              return ['none']
            },
            attrTest: function (t) {
              return (
                this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || 2 & this.state)
              )
            },
            emit: function (t) {
              if (1 !== t.scale) {
                var e = t.scale < 1 ? 'in' : 'out'
                t.additionalEvent = this.options.event + e
              }
              this._super.emit.call(this, t)
            },
          }),
          E(At, dt, {
            defaults: { event: 'press', pointers: 1, time: 251, threshold: 9 },
            getTouchAction: function () {
              return ['auto']
            },
            process: function (t) {
              var e = this.options,
                i = t.pointers.length === e.pointers,
                n = t.distance < e.threshold,
                r = t.deltaTime > e.time
              if (((this._input = t), !n || !i || (12 & t.eventType && !r))) this.reset()
              else if (1 & t.eventType)
                this.reset(),
                  (this._timer = v(
                    function () {
                      ;(this.state = 8), this.tryEmit()
                    },
                    e.time,
                    this,
                  ))
              else if (4 & t.eventType) return 8
              return 32
            },
            reset: function () {
              clearTimeout(this._timer)
            },
            emit: function (t) {
              8 === this.state &&
                (t && 4 & t.eventType
                  ? this.manager.emit(this.options.event + 'up', t)
                  : ((this._input.timeStamp = f()), this.manager.emit(this.options.event, this._input)))
            },
          }),
          E(Ct, yt, {
            defaults: { event: 'rotate', threshold: 0, pointers: 2 },
            getTouchAction: function () {
              return ['none']
            },
            attrTest: function (t) {
              return (
                this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || 2 & this.state)
              )
            },
          }),
          E(bt, yt, {
            defaults: { event: 'swipe', threshold: 10, velocity: 0.3, direction: 30, pointers: 1 },
            getTouchAction: function () {
              return Et.prototype.getTouchAction.call(this)
            },
            attrTest: function (t) {
              var e,
                i = this.options.direction
              return (
                30 & i
                  ? (e = t.overallVelocity)
                  : 6 & i
                  ? (e = t.overallVelocityX)
                  : 24 & i && (e = t.overallVelocityY),
                this._super.attrTest.call(this, t) &&
                  i & t.offsetDirection &&
                  t.distance > this.options.threshold &&
                  t.maxPointers == this.options.pointers &&
                  p(e) > this.options.velocity &&
                  4 & t.eventType
              )
            },
            emit: function (t) {
              var e = gt(t.offsetDirection)
              e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            },
          }),
          E(_t, dt, {
            defaults: { event: 'tap', pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 },
            getTouchAction: function () {
              return ['manipulation']
            },
            process: function (t) {
              var e = this.options,
                i = t.pointers.length === e.pointers,
                n = t.distance < e.threshold,
                r = t.deltaTime < e.time
              if ((this.reset(), 1 & t.eventType && 0 === this.count)) return this.failTimeout()
              if (n && r && i) {
                if (4 != t.eventType) return this.failTimeout()
                var s = !this.pTime || t.timeStamp - this.pTime < e.interval,
                  o = !this.pCenter || j(this.pCenter, t.center) < e.posThreshold
                if (
                  ((this.pTime = t.timeStamp),
                  (this.pCenter = t.center),
                  o && s ? (this.count += 1) : (this.count = 1),
                  (this._input = t),
                  0 === this.count % e.taps)
                )
                  return this.hasRequireFailures()
                    ? ((this._timer = v(
                        function () {
                          ;(this.state = 8), this.tryEmit()
                        },
                        e.interval,
                        this,
                      )),
                      2)
                    : 8
              }
              return 32
            },
            failTimeout: function () {
              return (
                (this._timer = v(
                  function () {
                    this.state = 32
                  },
                  this.options.interval,
                  this,
                )),
                32
              )
            },
            reset: function () {
              clearTimeout(this._timer)
            },
            emit: function () {
              8 == this.state &&
                ((this._input.tapCount = this.count), this.manager.emit(this.options.event, this._input))
            },
          }),
          (St.VERSION = '2.0.7'),
          (St.defaults = {
            domEvents: !1,
            touchAction: 'compute',
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
              [Ct, { enable: !1 }],
              [It, { enable: !1 }, ['rotate']],
              [bt, { direction: 6 }],
              [Et, { direction: 6 }, ['swipe']],
              [_t],
              [_t, { event: 'doubletap', taps: 2 }, ['tap']],
              [At],
            ],
            cssProps: {
              userSelect: 'none',
              touchSelect: 'none',
              touchCallout: 'none',
              contentZooming: 'none',
              userDrag: 'none',
              tapHighlightColor: 'rgba(0,0,0,0)',
            },
          })
        function Pt(t, e) {
          var i
          ;(this.options = h({}, St.defaults, e || {})),
            (this.options.inputTarget = this.options.inputTarget || t),
            (this.handlers = {}),
            (this.session = {}),
            (this.recognizers = []),
            (this.oldCssProps = {}),
            (this.element = t),
            (this.input = new ((i = this).options.inputClass || (X ? tt : Y ? st : N ? at : B))(i, q)),
            (this.touchAction = new vt(this, this.options.touchAction)),
            xt(this, !0),
            m(
              this.options.recognizers,
              function (t) {
                var e = this.add(new t[0](t[1]))
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
              },
              this,
            )
        }
        function xt(t, e) {
          var i,
            n = t.element
          n.style &&
            (m(t.options.cssProps, function (r, s) {
              ;(i = R(n.style, s)),
                e ? ((t.oldCssProps[i] = n.style[i]), (n.style[i] = r)) : (n.style[i] = t.oldCssProps[i] || '')
            }),
            e || (t.oldCssProps = {}))
        }
        ;(Pt.prototype = {
          set: function (t) {
            return (
              h(this.options, t),
              t.touchAction && this.touchAction.update(),
              t.inputTarget && (this.input.destroy(), (this.input.target = t.inputTarget), this.input.init()),
              this
            )
          },
          stop: function (t) {
            this.session.stopped = t ? 2 : 1
          },
          recognize: function (t) {
            var e = this.session
            if (!e.stopped) {
              var i
              this.touchAction.preventDefaults(t)
              var n = this.recognizers,
                r = e.curRecognizer
              ;(!r || (r && 8 & r.state)) && (r = e.curRecognizer = null)
              for (var s = 0; s < n.length; )
                (i = n[s]),
                  2 === e.stopped || (r && i != r && !i.canRecognizeWith(r)) ? i.reset() : i.recognize(t),
                  !r && 14 & i.state && (r = e.curRecognizer = i),
                  s++
            }
          },
          get: function (t) {
            if (t instanceof dt) return t
            for (var e = this.recognizers, i = 0; i < e.length; i++) if (e[i].options.event == t) return e[i]
            return null
          },
          add: function (t) {
            if (d(t, 'add', this)) return this
            var e = this.get(t.options.event)
            return e && this.remove(e), this.recognizers.push(t), (t.manager = this), this.touchAction.update(), t
          },
          remove: function (t) {
            if (d(t, 'remove', this)) return this
            if ((t = this.get(t))) {
              var e = this.recognizers,
                i = D(e, t)
              ;-1 !== i && (e.splice(i, 1), this.touchAction.update())
            }
            return this
          },
          on: function (t, e) {
            if (void 0 !== t && void 0 !== e) {
              var i = this.handlers
              return (
                m(x(t), function (t) {
                  ;(i[t] = i[t] || []), i[t].push(e)
                }),
                this
              )
            }
          },
          off: function (t, e) {
            if (void 0 !== t) {
              var i = this.handlers
              return (
                m(x(t), function (t) {
                  e ? i[t] && i[t].splice(D(i[t], e), 1) : delete i[t]
                }),
                this
              )
            }
          },
          emit: function (t, e) {
            this.options.domEvents &&
              (function (t, e) {
                var i = s.createEvent('Event')
                i.initEvent(t, !0, !0), (i.gesture = e), e.target.dispatchEvent(i)
              })(t, e)
            var i = this.handlers[t] && this.handlers[t].slice()
            if (i && i.length) {
              ;(e.type = t),
                (e.preventDefault = function () {
                  e.srcEvent.preventDefault()
                })
              for (var n = 0; n < i.length; ) i[n](e), n++
            }
          },
          destroy: function () {
            this.element && xt(this, !1),
              (this.handlers = {}),
              (this.session = {}),
              this.input.destroy(),
              (this.element = null)
          },
        }),
          h(St, {
            INPUT_START: 1,
            INPUT_MOVE: 2,
            INPUT_END: 4,
            INPUT_CANCEL: 8,
            STATE_POSSIBLE: 1,
            STATE_BEGAN: 2,
            STATE_CHANGED: 4,
            STATE_ENDED: 8,
            STATE_RECOGNIZED: 8,
            STATE_CANCELLED: 16,
            STATE_FAILED: 32,
            DIRECTION_NONE: 1,
            DIRECTION_LEFT: 2,
            DIRECTION_RIGHT: 4,
            DIRECTION_UP: 8,
            DIRECTION_DOWN: 16,
            DIRECTION_HORIZONTAL: 6,
            DIRECTION_VERTICAL: 24,
            DIRECTION_ALL: 30,
            Manager: Pt,
            Input: W,
            TouchAction: vt,
            TouchInput: st,
            MouseInput: B,
            PointerEventInput: tt,
            TouchMouseInput: at,
            SingleTouchInput: it,
            Recognizer: dt,
            AttrRecognizer: yt,
            Tap: _t,
            Pan: Et,
            Swipe: bt,
            Pinch: It,
            Rotate: Ct,
            Press: At,
            on: b,
            off: _,
            each: m,
            merge: y,
            extend: T,
            assign: h,
            inherit: E,
            bindFn: I,
            prefixed: R,
          }),
          ((void 0 !== r ? r : 'undefined' != typeof self ? self : {}).Hammer = St),
          void 0 ===
            (n = function () {
              return St
            }.call(e, i, e, t)) || (t.exports = n)
      })(window, document)
    },
  },
])
