;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1857],
  {
    9465: (e, t) => {
      'use strict'
      function n(e) {
        if (void 0 === e) throw new Error('Value is undefined')
        return e
      }
      function r(e) {
        if (null === e) throw new Error('Value is null')
        return e
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.ensureNever = t.ensure = t.ensureNotNull = t.ensureDefined = t.assert = void 0),
        (t.assert = function (e, t) {
          if (!e) throw new Error('Assertion failed' + (t ? ': ' + t : ''))
        }),
        (t.ensureDefined = n),
        (t.ensureNotNull = r),
        (t.ensure = function (e) {
          return r(n(e))
        }),
        (t.ensureNever = function (e) {})
    },
    58947: (e, t) => {
      'use strict'
      function n(e) {
        return Math.round(1e10 * e) / 1e10
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.alignTo = t.fixComputationError = t.isNaN = t.isInteger = t.isNumber = void 0),
        (t.isNumber = function (e) {
          return 'number' == typeof e && isFinite(e)
        }),
        (t.isInteger = function (e) {
          return 'number' == typeof e && e % 1 == 0
        }),
        (t.isNaN = function (e) {
          return !(e <= 0 || e > 0)
        }),
        (t.fixComputationError = n),
        (t.alignTo = function (e, t) {
          var r = e / t,
            o = Math.floor(r),
            u = r - o
          return u > 2e-10 ? n(u > 0.5 ? (o + 1) * t : o * t) : e
        })
    },
    88537: (e, t) => {
      'use strict'
      function n(e, t) {
        if (void 0 === e) throw new Error((null != t ? t : 'Value') + ' is undefined')
        return e
      }
      function r(e, t) {
        if (null === e) throw new Error((null != t ? t : 'Value') + ' is null')
        return e
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.ensureNever = t.ensure = t.ensureNotNull = t.ensureDefined = t.assert = void 0),
        (t.assert = function (e, t) {
          if (!e) throw new Error('Assertion failed' + (t ? ': ' + t : ''))
        }),
        (t.ensureDefined = n),
        (t.ensureNotNull = r),
        (t.ensure = function (e, t) {
          return r(n(e, t), t)
        }),
        (t.ensureNever = function (e) {})
    },
    93751: (e, t) => {
      'use strict'
      function n(e) {
        return Math.round(1e10 * e) / 1e10
      }
      ;(t.fixComputationError = t.isNumber = void 0),
        (t.isNumber = function (e) {
          return 'number' == typeof e && isFinite(e)
        }),
        (t.fixComputationError = n)
    },
    6617: (e, t) => {
      'use strict'
      ;(t.hasProperty = t.isObject = void 0),
        (t.isObject = function (e) {
          var t = typeof e
          return null !== e && ('object' === t || 'function' === t)
        }),
        (t.hasProperty = function (e, t) {
          return t in e
        })
    },
    34026: (e, t, n) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.pointInCircle = t.pointInPolygon = t.pointInBox = t.pointInTriangle = t.pointInHalfplane = void 0)
      var r = n(5531)
      ;(t.pointInHalfplane = function (e, t) {
        var n = t.edge
        return n.A * e.x + n.B * e.y + n.C > 0 === t.isPositive
      }),
        (t.pointInTriangle = function (e, t, n, o) {
          var u = t.add(n).scaled(0.5).add(o).scaled(0.5),
            i = r.intersectLineSegments(t, n, u, e)
          return (
            null === i &&
            null === (i = r.intersectLineSegments(n, o, u, e)) &&
            null === (i = r.intersectLineSegments(o, t, u, e))
          )
        }),
        (t.pointInBox = function (e, t) {
          return e.x >= t.min.x && e.x <= t.max.x && e.y >= t.min.y && e.y <= t.max.y
        }),
        (t.pointInPolygon = function (e, t) {
          for (var n = t.length - 1, r = !1, o = e.x, u = e.y, i = 0; i < t.length; i++) {
            var a = t[i],
              s = t[n]
            ;((a.y < u && s.y >= u) || (s.y < u && a.y >= u)) &&
              a.x + ((u - a.y) / (s.y - a.y)) * (s.x - a.x) < o &&
              (r = !r),
              (n = i)
          }
          return r
        }),
        (t.pointInCircle = function (e, t, n) {
          return (e.x - t.x) * (e.x - t.x) + (e.y - t.y) * (e.y - t.y) <= n * n
        })
    },
    4652: (e, t) => {
      'use strict'
      function n(e, t, n) {
        var r = t.subtract(e),
          o = n.subtract(e).dotProduct(r) / r.dotProduct(r)
        return { coeff: o, distance: e.addScaled(r, o).subtract(n).length() }
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.distanceToSegment = t.distanceToLine = void 0),
        (t.distanceToLine = n),
        (t.distanceToSegment = function (e, t, r) {
          var o = n(e, t, r)
          if (0 <= o.coeff && o.coeff <= 1) return o
          var u = e.subtract(r).length(),
            i = t.subtract(r).length()
          return u < i ? { coeff: 0, distance: u } : { coeff: 1, distance: i }
        })
    },
    5531: (e, t, n) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.intersectPolygons =
          t.intersectPolygonAndHalfplane =
          t.intersectRayAndBox =
          t.intersectLineAndBox =
          t.intersectLineSegments =
          t.intersectLines =
          t.intersectLineSegmentAndBox =
            void 0)
      var r = n(9465),
        o = n(86441),
        u = n(4652),
        i = n(34026)
      function a(e, t) {
        var n = e.A,
          r = t.A,
          u = e.B,
          i = t.B,
          a = e.C,
          s = t.C,
          d = n * i - r * u
        if (Math.abs(d) < 1e-6) return null
        var c = (u * s - i * a) / d,
          f = (r * a - n * s) / d
        return new o.Point(c, f)
      }
      function s(e, t, n, r) {
        var o = (function (e, t, n, r) {
          var o = t.subtract(e),
            u = r.subtract(n),
            i = o.x * u.y - o.y * u.x
          if (Math.abs(i) < 1e-6) return null
          var a = e.subtract(n)
          return (a.y * u.x - a.x * u.y) / i
        })(e, t, n, r)
        if (null === o) return null
        var i = t.subtract(e).scaled(o).add(e),
          a = u.distanceToSegment(n, r, i)
        return Math.abs(a.distance) < 1e-6 ? o : null
      }
      function d(e, t) {
        for (var n = 0, r = e; n < r.length; n++) {
          var u = r[n]
          if (o.equalPoints(u, t)) return !1
        }
        return e.push(t), !0
      }
      function c(e, t) {
        return !(e.length > 0 && (o.equalPoints(e[e.length - 1], t) || o.equalPoints(e[0], t))) && (e.push(t), !0)
      }
      function f(e, t) {
        for (var n = [], r = 0; r < e.length; ++r) {
          var u = e[r],
            s = e[(r + 1) % e.length],
            d = o.lineThroughPoints(u, s)
          if (i.pointInHalfplane(u, t)) {
            if ((c(n, u), !i.pointInHalfplane(s, t))) null !== (f = a(d, t.edge)) && c(n, f)
          } else if (i.pointInHalfplane(s, t)) {
            var f
            null !== (f = a(d, t.edge)) && c(n, f)
          }
        }
        return n.length >= 3 ? n : null
      }
      ;(t.intersectLineSegmentAndBox = function (e, t) {
        var n = e[0].x,
          r = e[0].y,
          u = e[1].x,
          i = e[1].y,
          a = t.min.x,
          s = t.min.y,
          d = t.max.x,
          c = t.max.y
        function f(e, t, n, r, o, u) {
          var i = 0
          return e < n ? (i |= 1) : e > o && (i |= 2), t < r ? (i |= 4) : t > u && (i |= 8), i
        }
        for (var l = f(n, r, a, s, d, c), p = f(u, i, a, s, d, c), h = !1, g = 0; ; ) {
          if (g > 1e3) throw new Error('Cohen - Sutherland algorithm: infinity loop')
          if ((g++, !(l | p))) {
            h = !0
            break
          }
          if (l & p) break
          var _ = l || p,
            v = void 0,
            b = void 0
          8 & _
            ? ((v = n + ((u - n) * (c - r)) / (i - r)), (b = c))
            : 4 & _
            ? ((v = n + ((u - n) * (s - r)) / (i - r)), (b = s))
            : 2 & _
            ? ((b = r + ((i - r) * (d - n)) / (u - n)), (v = d))
            : ((b = r + ((i - r) * (a - n)) / (u - n)), (v = a)),
            _ === l ? (l = f((n = v), (r = b), a, s, d, c)) : (p = f((u = v), (i = b), a, s, d, c))
        }
        return h
          ? o.equalPoints(o.point(n, r), o.point(u, i))
            ? o.point(n, r)
            : o.lineSegment(o.point(n, r), o.point(u, i))
          : null
      }),
        (t.intersectLines = a),
        (t.intersectLineSegments = s),
        (t.intersectLineAndBox = function (e, t) {
          var n = t.min.x,
            u = t.min.y,
            i = t.max.x,
            a = t.max.y
          if (0 === e.A) {
            var s = -e.C / e.B
            return u <= s && s <= a ? o.lineSegment(o.point(n, s), o.point(i, s)) : null
          }
          if (0 === e.B) {
            var c = -e.C / e.A
            return n <= c && c <= i ? o.lineSegment(o.point(c, u), o.point(c, a)) : null
          }
          var f = [],
            l = function (t) {
              var n = (function (e, t) {
                return -(e.C + e.A * t) / e.B
              })(e, t)
              u <= n && n <= a && d(f, new o.Point(t, n))
            },
            p = function (t) {
              var r = (function (e, t) {
                return -(e.C + e.B * t) / e.A
              })(e, t)
              n <= r && r <= i && d(f, new o.Point(r, t))
            }
          switch ((l(n), p(u), l(i), p(a), f.length)) {
            case 0:
              return null
            case 1:
              return f[0]
            case 2:
              return o.equalPoints(f[0], f[1]) ? f[0] : o.lineSegment(f[0], f[1])
          }
          return r.assert(!1, 'We should have at most two intersection points'), null
        }),
        (t.intersectRayAndBox = function (e, t, n) {
          var r = s(e, t, n.min, new o.Point(n.max.x, n.min.y)),
            u = s(e, t, new o.Point(n.max.x, n.min.y), n.max),
            a = s(e, t, n.max, new o.Point(n.min.x, n.max.y)),
            d = s(e, t, new o.Point(n.min.x, n.max.y), n.min),
            c = []
          if (
            (null !== r && r >= 0 && c.push(r),
            null !== u && u >= 0 && c.push(u),
            null !== a && a >= 0 && c.push(a),
            null !== d && d >= 0 && c.push(d),
            0 === c.length)
          )
            return null
          c.sort(function (e, t) {
            return e - t
          })
          var f = i.pointInBox(e, n) ? c[0] : c[c.length - 1]
          return e.addScaled(t.subtract(e), f)
        }),
        (t.intersectPolygonAndHalfplane = f),
        (t.intersectPolygons = function (e, t) {
          for (var n = e, r = 0; r < t.length && null !== n; ++r) {
            var u = t[r],
              i = t[(r + 1) % t.length],
              a = t[(r + 2) % t.length],
              s = o.lineThroughPoints(u, i)
            n = f(n, o.halfplaneThroughPoint(s, a))
          }
          return n
        })
    },
    86441: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.equalBoxes =
          t.box =
          t.halfplaneThroughPoint =
          t.halfplane =
          t.lineSegment =
          t.lineThroughPoints =
          t.line =
          t.equalPoints =
          t.point =
          t.Point =
            void 0)
      var n = (function () {
        function e(e, t) {
          ;(this.x = e), (this.y = t)
        }
        return (
          (e.prototype.add = function (t) {
            return new e(this.x + t.x, this.y + t.y)
          }),
          (e.prototype.addScaled = function (t, n) {
            return new e(this.x + n * t.x, this.y + n * t.y)
          }),
          (e.prototype.subtract = function (t) {
            return new e(this.x - t.x, this.y - t.y)
          }),
          (e.prototype.dotProduct = function (e) {
            return this.x * e.x + this.y * e.y
          }),
          (e.prototype.crossProduct = function (e) {
            return this.x * e.y - this.y * e.x
          }),
          (e.prototype.signedAngle = function (e) {
            return Math.atan2(this.crossProduct(e), this.dotProduct(e))
          }),
          (e.prototype.angle = function (e) {
            return Math.acos(this.dotProduct(e) / (this.length() * e.length()))
          }),
          (e.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
          }),
          (e.prototype.scaled = function (t) {
            return new e(this.x * t, this.y * t)
          }),
          (e.prototype.normalized = function () {
            return this.scaled(1 / this.length())
          }),
          (e.prototype.transposed = function () {
            return new e(-this.y, this.x)
          }),
          (e.prototype.clone = function () {
            return new e(this.x, this.y)
          }),
          e
        )
      })()
      function r(e, t) {
        return new n(e, t)
      }
      function o(e, t) {
        return e.x === t.x && e.y === t.y
      }
      function u(e, t, n) {
        if (0 === e && 0 === t) throw new Error('A and B can not be both equal to zero.')
        return { A: e, B: t, C: n }
      }
      function i(e, t) {
        return { edge: e, isPositive: t }
      }
      ;(t.Point = n),
        (t.point = r),
        (t.equalPoints = o),
        (t.line = u),
        (t.lineThroughPoints = function (e, t) {
          if (o(e, t)) throw new Error('Points should be distinct')
          return u(e.y - t.y, t.x - e.x, e.x * t.y - t.x * e.y)
        }),
        (t.lineSegment = function (e, t) {
          if (o(e, t)) throw new Error('Points of a segment should be distinct')
          return [e, t]
        }),
        (t.halfplane = i),
        (t.halfplaneThroughPoint = function (e, t) {
          return i(e, e.A * t.x + e.B * t.y + e.C > 0)
        }),
        (t.box = function (e, t) {
          return { min: r(Math.min(e.x, t.x), Math.min(e.y, t.y)), max: r(Math.max(e.x, t.x), Math.max(e.y, t.y)) }
        }),
        (t.equalBoxes = function (e, t) {
          return o(e.min, t.min) && o(e.max, t.max)
        })
    },
    25422: (e, t, n) => {
      'use strict'
      t.transformPoint = t.translationMatrix = t.scalingMatrix = t.rotationMatrix = void 0
      var r = n(86441)
      ;(t.rotationMatrix = function (e) {
        var t = Math.cos(e),
          n = Math.sin(e)
        return [
          [t, -n, 0],
          [n, t, 0],
          [0, 0, 1],
        ]
      }),
        (t.scalingMatrix = function (e, t) {
          return [
            [e, 0, 0],
            [0, t, 0],
            [0, 0, 1],
          ]
        }),
        (t.translationMatrix = function (e, t) {
          return [
            [1, 0, e],
            [0, 1, t],
            [0, 0, 1],
          ]
        }),
        (t.transformPoint = function (e, t) {
          for (var n = [t.x, t.y, 1], o = [0, 0, 0], u = 0; u < 3; u++)
            for (var i = 0; i < 3; i++) o[u] += n[i] * e[u][i]
          return new r.Point(o[0], o[1])
        })
    },
    24377: (e, t, n) => {
      'use strict'
      var r = n(58947)
      function o(e, t, n) {
        return r.isNaN(t) || t < e ? e : t > n ? n : Math.round(t)
      }
      function u(e, t, n) {
        return r.isNaN(t) || t < e ? e : t > n ? n : Math.round(1e4 * t) / 1e4
      }
      function i(e) {
        return o(0, e, 255)
      }
      function a(e) {
        return o(0, e, 255)
      }
      function s(e) {
        return o(0, e, 255)
      }
      function d(e) {
        return u(0, e, 1)
      }
      function c(e) {
        return u(0, e, 1)
      }
      function f(e) {
        return u(0, e, 1)
      }
      function l(e) {
        return u(0, e, 1)
      }
      function p(e) {
        return u(0, e, 1)
      }
      function h(e) {
        return u(0, e, 1)
      }
      function g(e) {
        var t = e[0] / 255,
          n = e[1] / 255,
          r = e[2] / 255,
          o = Math.min(t, n, r),
          u = Math.max(t, n, r),
          i = 0,
          a = 0,
          s = (o + u) / 2
        if (o === u) (i = 0), (a = 0)
        else {
          var d = u - o
          switch (((a = s > 0.5 ? d / (2 - u - o) : d / (u + o)), u)) {
            case t:
              i = ((n - r) / d + (n < r ? 6 : 0)) / 6
              break
            case n:
              i = ((r - t) / d + 2) / 6
              break
            case r:
              i = ((t - n) / d + 4) / 6
          }
        }
        return [i, a, s]
      }
      function _(e, t, n) {
        return (
          n < 0 && (n += 1),
          n > 1 && (n -= 1),
          n < 1 / 6 ? e + 6 * (t - e) * n : n < 0.5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
        )
      }
      function v(e) {
        var t,
          n,
          r,
          o = e[0],
          u = e[1],
          d = e[2]
        if (0 === u) t = n = r = d
        else {
          var c = d < 0.5 ? d * (1 + u) : d + u - d * u,
            f = 2 * d - c
          ;(t = _(f, c, o + 1 / 3)), (n = _(f, c, o)), (r = _(f, c, o - 1 / 3))
        }
        return [i(255 * t), a(255 * n), s(255 * r)]
      }
      ;(t.normalizeAlphaComponent = d),
        (t.areEqualRgb = function (e, t) {
          return e[0] === t[0] && e[1] === t[1] && e[2] === t[2]
        }),
        (t.rgba = function (e, t, n, r) {
          if (Array.isArray(e)) {
            var o = e
            return (r = t), [o[0], o[1], o[2], d(r)]
          }
          var u = t
          return (n = n || 0), (r = r || 0), [i(e), a(u), s(n), d(r)]
        }),
        (t.areEqualRgba = function (e, t) {
          return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3]
        }),
        (t.rgbToHsl = g),
        (t.hslToRgb = v)
      var b = [0.199, 0.687, 0.114]
      function y(e) {
        return b[0] * e[0] + b[1] * e[1] + b[2] * e[2]
      }
      function m(e, t, n) {
        void 0 === n && (n = 0.05)
        var r = g(e),
          o = r[0] + t * n
        return (r[0] = c(o - Math.floor(o))), v(r)
      }
      function w(e, t, n) {
        void 0 === n && (n = 0.05)
        var r = e[0],
          o = e[1],
          u = e[2],
          i = e[3],
          a = m([r, o, u], t, n)
        return [a[0], a[1], a[2], i]
      }
      ;(t.distanceRgb = function (e, t) {
        var n = e[0],
          r = e[1],
          o = e[2],
          u = t[0] - n,
          i = t[1] - r,
          a = t[2] - o
        return Math.sqrt(u * u + i * i + a * a)
      }),
        (t.invertRgb = function (e) {
          return [255 - e[0], 255 - e[1], 255 - e[2]]
        }),
        (t.blendRgba = function (e, t) {
          var n = e[0],
            r = e[1],
            o = e[2],
            u = e[3],
            c = t[0],
            f = t[1],
            l = t[2],
            p = t[3],
            h = d(1 - (1 - p) * (1 - u))
          return [
            i((c * p) / h + (n * u * (1 - p)) / h),
            a((f * p) / h + (r * u * (1 - p)) / h),
            s((l * p) / h + (o * u * (1 - p)) / h),
            h,
          ]
        }),
        (t.shiftRgb = m),
        (t.shiftRgba = w),
        (t.shiftColor = function (e, t, n) {
          return void 0 === n && (n = 0.05), C(w(I(e), t, n))
        })
      var x,
        k,
        j,
        O,
        S = {
          aliceblue: '#f0f8ff',
          antiquewhite: '#faebd7',
          aqua: '#00ffff',
          aquamarine: '#7fffd4',
          azure: '#f0ffff',
          beige: '#f5f5dc',
          bisque: '#ffe4c4',
          black: '#000000',
          blanchedalmond: '#ffebcd',
          blue: '#0000ff',
          blueviolet: '#8a2be2',
          brown: '#a52a2a',
          burlywood: '#deb887',
          cadetblue: '#5f9ea0',
          chartreuse: '#7fff00',
          chocolate: '#d2691e',
          coral: '#ff7f50',
          cornflowerblue: '#6495ed',
          cornsilk: '#fff8dc',
          crimson: '#dc143c',
          cyan: '#00ffff',
          darkblue: '#00008b',
          darkcyan: '#008b8b',
          darkgoldenrod: '#b8860b',
          darkgray: '#a9a9a9',
          darkgreen: '#006400',
          darkkhaki: '#bdb76b',
          darkmagenta: '#8b008b',
          darkolivegreen: '#556b2f',
          darkorange: '#ff8c00',
          darkorchid: '#9932cc',
          darkred: '#8b0000',
          darksalmon: '#e9967a',
          darkseagreen: '#8fbc8f',
          darkslateblue: '#483d8b',
          darkslategray: '#2f4f4f',
          darkturquoise: '#00ced1',
          darkviolet: '#9400d3',
          deeppink: '#ff1493',
          deepskyblue: '#00bfff',
          dimgray: '#696969',
          dodgerblue: '#1e90ff',
          feldspar: '#d19275',
          firebrick: '#b22222',
          floralwhite: '#fffaf0',
          forestgreen: '#228b22',
          fuchsia: '#ff00ff',
          gainsboro: '#dcdcdc',
          ghostwhite: '#f8f8ff',
          gold: '#ffd700',
          goldenrod: '#daa520',
          gray: '#808080',
          green: '#008000',
          greenyellow: '#adff2f',
          honeydew: '#f0fff0',
          hotpink: '#ff69b4',
          indianred: '#cd5c5c',
          indigo: '#4b0082',
          ivory: '#fffff0',
          khaki: '#f0e68c',
          lavender: '#e6e6fa',
          lavenderblush: '#fff0f5',
          lawngreen: '#7cfc00',
          lemonchiffon: '#fffacd',
          lightblue: '#add8e6',
          lightcoral: '#f08080',
          lightcyan: '#e0ffff',
          lightgoldenrodyellow: '#fafad2',
          lightgreen: '#90ee90',
          lightgrey: '#d3d3d3',
          lightpink: '#ffb6c1',
          lightsalmon: '#ffa07a',
          lightseagreen: '#20b2aa',
          lightskyblue: '#87cefa',
          lightslateblue: '#8470ff',
          lightslategray: '#778899',
          lightsteelblue: '#b0c4de',
          lightyellow: '#ffffe0',
          lime: '#00ff00',
          limegreen: '#32cd32',
          linen: '#faf0e6',
          magenta: '#ff00ff',
          maroon: '#800000',
          mediumaquamarine: '#66cdaa',
          mediumblue: '#0000cd',
          mediumorchid: '#ba55d3',
          mediumpurple: '#9370d8',
          mediumseagreen: '#3cb371',
          mediumslateblue: '#7b68ee',
          mediumspringgreen: '#00fa9a',
          mediumturquoise: '#48d1cc',
          mediumvioletred: '#c71585',
          midnightblue: '#191970',
          mintcream: '#f5fffa',
          mistyrose: '#ffe4e1',
          moccasin: '#ffe4b5',
          navajowhite: '#ffdead',
          navy: '#000080',
          oldlace: '#fdf5e6',
          olive: '#808000',
          olivedrab: '#6b8e23',
          orange: '#ffa500',
          orangered: '#ff4500',
          orchid: '#da70d6',
          palegoldenrod: '#eee8aa',
          palegreen: '#98fb98',
          paleturquoise: '#afeeee',
          palevioletred: '#d87093',
          papayawhip: '#ffefd5',
          peachpuff: '#ffdab9',
          peru: '#cd853f',
          pink: '#ffc0cb',
          plum: '#dda0dd',
          powderblue: '#b0e0e6',
          purple: '#800080',
          red: '#ff0000',
          rosybrown: '#bc8f8f',
          royalblue: '#4169e1',
          saddlebrown: '#8b4513',
          salmon: '#fa8072',
          sandybrown: '#f4a460',
          seagreen: '#2e8b57',
          seashell: '#fff5ee',
          sienna: '#a0522d',
          silver: '#c0c0c0',
          skyblue: '#87ceeb',
          slateblue: '#6a5acd',
          slategray: '#708090',
          snow: '#fffafa',
          springgreen: '#00ff7f',
          steelblue: '#4682b4',
          tan: '#d2b48c',
          teal: '#008080',
          thistle: '#d8bfd8',
          tomato: '#ff6347',
          turquoise: '#40e0d0',
          violet: '#ee82ee',
          violetred: '#d02090',
          wheat: '#f5deb3',
          white: '#ffffff',
          whitesmoke: '#f5f5f5',
          yellow: '#ffff00',
          yellowgreen: '#9acd32',
        }
      function L(e, t) {
        return t in e
      }
      function P(e) {
        var t = x.re.exec(e)
        return null !== t ? x.parse(t) : null
      }
      function A(e) {
        var t = k.re.exec(e)
        return null !== t ? k.parse(t) : null
      }
      function E(e) {
        var t = j.re.exec(e)
        return null !== t ? j.parse(t) : null
      }
      function N(e) {
        var t = O.re.exec(e)
        return null !== t ? O.parse(t) : null
      }
      function C(e) {
        return 'rgba(' + e[0] + ', ' + e[1] + ', ' + e[2] + ', ' + e[3] + ')'
      }
      function R(e) {
        if (((e = e.toLowerCase()), L(S, e))) {
          var t = A(S[e])
          if (null !== t) return t
          throw new Error('Invalid named color definition')
        }
        var n = P(e)
        if (null !== n) return n
        var r = A(e)
        if (null !== r) return r
        var o = E(e)
        if (null !== o) return o
        var u = N(e)
        return null !== u ? [u[0], u[1], u[2]] : null
      }
      function T(e) {
        if (((e = e.toLowerCase()), L(S, e))) {
          var t = A(S[e])
          if (null !== t) return [t[0], t[1], t[2], 1]
          throw new Error('Invalid named color definition')
        }
        var n = P(e)
        if (null !== n) return [n[0], n[1], n[2], 1]
        var r = A(e)
        if (null !== r) return [r[0], r[1], r[2], 1]
        var o = E(e)
        if (null !== o) return [o[0], o[1], o[2], 1]
        var u = N(e)
        return null !== u ? u : null
      }
      function I(e) {
        var t = T(e)
        if (null !== t) return t
        throw new Error('Passed color string does not match any of the known color representations')
      }
      !(function (e) {
        ;(e.re = /^rgb\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*\)$/),
          (e.parse = function (e) {
            return [i(parseInt(e[1], 10)), a(parseInt(e[2], 10)), s(parseInt(e[3], 10))]
          })
      })(x || (x = {})),
        (function (e) {
          ;(e.re = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/),
            (e.parse = function (e) {
              return [i(parseInt(e[1], 16)), a(parseInt(e[2], 16)), s(parseInt(e[3], 16))]
            })
        })(k || (k = {})),
        (t.rgbToHexString = function (e) {
          var t = e[0],
            n = e[1],
            r = e[2],
            o = t.toString(16),
            u = n.toString(16),
            i = r.toString(16)
          return (
            '#' + (1 === o.length ? '0' : '') + o + (1 === u.length ? '0' : '') + u + (1 === i.length ? '0' : '') + i
          )
        }),
        (function (e) {
          ;(e.re = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/),
            (e.parse = function (e) {
              return [i(parseInt(e[1] + e[1], 16)), a(parseInt(e[2] + e[2], 16)), s(parseInt(e[3] + e[3], 16))]
            })
        })(j || (j = {})),
        (function (e) {
          ;(e.re = /^rgba\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?[\d]{0,10}(?:\.\d+)?)\s*\)$/),
            (e.parse = function (e) {
              return [i(parseInt(e[1], 10)), a(parseInt(e[2], 10)), s(parseInt(e[3], 10)), d(parseFloat(e[4]))]
            })
        })(O || (O = {})),
        (t.rgbaToString = C),
        (t.rgbToBlackWhiteString = function (e, t) {
          if (t < 0 || t > 255) throw new Error('invalid threshold value, valid values are [0, 255]')
          return y(e) >= t ? 'white' : 'black'
        }),
        (t.parseRgb = function (e) {
          var t = R(e)
          if (null !== t) return t
          throw new Error('Passed color string does not match any of the known color representations')
        }),
        (t.tryParseRgba = T),
        (t.parseRgba = I)
    },
    60521: function (e, t, n) {
      var r
      !(function (o) {
        'use strict'
        var u,
          i = '[big.js] ',
          a = i + 'Invalid ',
          s = a + 'decimal places',
          d = {},
          c = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i
        function f(e, t, n, r) {
          var o = e.c
          if ((void 0 === n && (n = e.constructor.RM), 0 !== n && 1 !== n && 2 !== n && 3 !== n))
            throw Error('[big.js] Invalid rounding mode')
          if (t < 1)
            (r =
              (3 === n && (r || !!o[0])) ||
              (0 === t &&
                ((1 === n && o[0] >= 5) || (2 === n && (o[0] > 5 || (5 === o[0] && (r || void 0 !== o[1]))))))),
              (o.length = 1),
              r ? ((e.e = e.e - t + 1), (o[0] = 1)) : (o[0] = e.e = 0)
          else if (t < o.length) {
            if (
              ((r =
                (1 === n && o[t] >= 5) ||
                (2 === n && (o[t] > 5 || (5 === o[t] && (r || void 0 !== o[t + 1] || 1 & o[t - 1])))) ||
                (3 === n && (r || !!o[0]))),
              (o.length = t--),
              r)
            )
              for (; ++o[t] > 9; ) (o[t] = 0), t-- || (++e.e, o.unshift(1))
            for (t = o.length; !o[--t]; ) o.pop()
          }
          return e
        }
        function l(e, t, n) {
          var r = e.e,
            o = e.c.join(''),
            u = o.length
          if (t) o = o.charAt(0) + (u > 1 ? '.' + o.slice(1) : '') + (r < 0 ? 'e' : 'e+') + r
          else if (r < 0) {
            for (; ++r; ) o = '0' + o
            o = '0.' + o
          } else if (r > 0)
            if (++r > u) for (r -= u; r--; ) o += '0'
            else r < u && (o = o.slice(0, r) + '.' + o.slice(r))
          else u > 1 && (o = o.charAt(0) + '.' + o.slice(1))
          return e.s < 0 && n ? '-' + o : o
        }
        ;(d.abs = function () {
          var e = new this.constructor(this)
          return (e.s = 1), e
        }),
          (d.cmp = function (e) {
            var t,
              n = this,
              r = n.c,
              o = (e = new n.constructor(e)).c,
              u = n.s,
              i = e.s,
              a = n.e,
              s = e.e
            if (!r[0] || !o[0]) return r[0] ? u : o[0] ? -i : 0
            if (u != i) return u
            if (((t = u < 0), a != s)) return (a > s) ^ t ? 1 : -1
            for (i = (a = r.length) < (s = o.length) ? a : s, u = -1; ++u < i; )
              if (r[u] != o[u]) return (r[u] > o[u]) ^ t ? 1 : -1
            return a == s ? 0 : (a > s) ^ t ? 1 : -1
          }),
          (d.div = function (e) {
            var t = this,
              n = t.constructor,
              r = t.c,
              o = (e = new n(e)).c,
              u = t.s == e.s ? 1 : -1,
              i = n.DP
            if (i !== ~~i || i < 0 || i > 1e6) throw Error(s)
            if (!o[0]) throw Error('[big.js] Division by zero')
            if (!r[0]) return (e.s = u), (e.c = [(e.e = 0)]), e
            var a,
              d,
              c,
              l,
              p,
              h = o.slice(),
              g = (a = o.length),
              _ = r.length,
              v = r.slice(0, a),
              b = v.length,
              y = e,
              m = (y.c = []),
              w = 0,
              x = i + (y.e = t.e - e.e) + 1
            for (y.s = u, u = x < 0 ? 0 : x, h.unshift(0); b++ < a; ) v.push(0)
            do {
              for (c = 0; c < 10; c++) {
                if (a != (b = v.length)) l = a > b ? 1 : -1
                else
                  for (p = -1, l = 0; ++p < a; )
                    if (o[p] != v[p]) {
                      l = o[p] > v[p] ? 1 : -1
                      break
                    }
                if (!(l < 0)) break
                for (d = b == a ? o : h; b; ) {
                  if (v[--b] < d[b]) {
                    for (p = b; p && !v[--p]; ) v[p] = 9
                    --v[p], (v[b] += 10)
                  }
                  v[b] -= d[b]
                }
                for (; !v[0]; ) v.shift()
              }
              ;(m[w++] = l ? c : ++c), v[0] && l ? (v[b] = r[g] || 0) : (v = [r[g]])
            } while ((g++ < _ || void 0 !== v[0]) && u--)
            return m[0] || 1 == w || (m.shift(), y.e--, x--), w > x && f(y, x, n.RM, void 0 !== v[0]), y
          }),
          (d.eq = function (e) {
            return 0 === this.cmp(e)
          }),
          (d.gt = function (e) {
            return this.cmp(e) > 0
          }),
          (d.gte = function (e) {
            return this.cmp(e) > -1
          }),
          (d.lt = function (e) {
            return this.cmp(e) < 0
          }),
          (d.lte = function (e) {
            return this.cmp(e) < 1
          }),
          (d.minus = d.sub =
            function (e) {
              var t,
                n,
                r,
                o,
                u = this,
                i = u.constructor,
                a = u.s,
                s = (e = new i(e)).s
              if (a != s) return (e.s = -s), u.plus(e)
              var d = u.c.slice(),
                c = u.e,
                f = e.c,
                l = e.e
              if (!d[0] || !f[0]) return f[0] ? (e.s = -s) : d[0] ? (e = new i(u)) : (e.s = 1), e
              if ((a = c - l)) {
                for ((o = a < 0) ? ((a = -a), (r = d)) : ((l = c), (r = f)), r.reverse(), s = a; s--; ) r.push(0)
                r.reverse()
              } else
                for (n = ((o = d.length < f.length) ? d : f).length, a = s = 0; s < n; s++)
                  if (d[s] != f[s]) {
                    o = d[s] < f[s]
                    break
                  }
              if ((o && ((r = d), (d = f), (f = r), (e.s = -e.s)), (s = (n = f.length) - (t = d.length)) > 0))
                for (; s--; ) d[t++] = 0
              for (s = t; n > a; ) {
                if (d[--n] < f[n]) {
                  for (t = n; t && !d[--t]; ) d[t] = 9
                  --d[t], (d[n] += 10)
                }
                d[n] -= f[n]
              }
              for (; 0 === d[--s]; ) d.pop()
              for (; 0 === d[0]; ) d.shift(), --l
              return d[0] || ((e.s = 1), (d = [(l = 0)])), (e.c = d), (e.e = l), e
            }),
          (d.mod = function (e) {
            var t,
              n = this,
              r = n.constructor,
              o = n.s,
              u = (e = new r(e)).s
            if (!e.c[0]) throw Error('[big.js] Division by zero')
            return (
              (n.s = e.s = 1),
              (t = 1 == e.cmp(n)),
              (n.s = o),
              (e.s = u),
              t
                ? new r(n)
                : ((o = r.DP),
                  (u = r.RM),
                  (r.DP = r.RM = 0),
                  (n = n.div(e)),
                  (r.DP = o),
                  (r.RM = u),
                  this.minus(n.times(e)))
            )
          }),
          (d.plus = d.add =
            function (e) {
              var t,
                n,
                r,
                o = this,
                u = o.constructor
              if (((e = new u(e)), o.s != e.s)) return (e.s = -e.s), o.minus(e)
              var i = o.e,
                a = o.c,
                s = e.e,
                d = e.c
              if (!a[0] || !d[0]) return d[0] || (a[0] ? (e = new u(o)) : (e.s = o.s)), e
              if (((a = a.slice()), (t = i - s))) {
                for (t > 0 ? ((s = i), (r = d)) : ((t = -t), (r = a)), r.reverse(); t--; ) r.push(0)
                r.reverse()
              }
              for (a.length - d.length < 0 && ((r = d), (d = a), (a = r)), t = d.length, n = 0; t; a[t] %= 10)
                n = ((a[--t] = a[t] + d[t] + n) / 10) | 0
              for (n && (a.unshift(n), ++s), t = a.length; 0 === a[--t]; ) a.pop()
              return (e.c = a), (e.e = s), e
            }),
          (d.pow = function (e) {
            var t = this,
              n = new t.constructor('1'),
              r = n,
              o = e < 0
            if (e !== ~~e || e < -1e6 || e > 1e6) throw Error(a + 'exponent')
            for (o && (e = -e); 1 & e && (r = r.times(t)), (e >>= 1); ) t = t.times(t)
            return o ? n.div(r) : r
          }),
          (d.prec = function (e, t) {
            if (e !== ~~e || e < 1 || e > 1e6) throw Error(a + 'precision')
            return f(new this.constructor(this), e, t)
          }),
          (d.round = function (e, t) {
            if (void 0 === e) e = 0
            else if (e !== ~~e || e < -1e6 || e > 1e6) throw Error(s)
            return f(new this.constructor(this), e + this.e + 1, t)
          }),
          (d.sqrt = function () {
            var e,
              t,
              n,
              r = this,
              o = r.constructor,
              u = r.s,
              a = r.e,
              s = new o('0.5')
            if (!r.c[0]) return new o(r)
            if (u < 0) throw Error(i + 'No square root')
            0 === (u = Math.sqrt(r + '')) || u === 1 / 0
              ? (((t = r.c.join('')).length + a) & 1 || (t += '0'),
                (a = (((a + 1) / 2) | 0) - (a < 0 || 1 & a)),
                (e = new o(
                  ((u = Math.sqrt(t)) == 1 / 0 ? '5e' : (u = u.toExponential()).slice(0, u.indexOf('e') + 1)) + a,
                )))
              : (e = new o(u + '')),
              (a = e.e + (o.DP += 4))
            do {
              ;(n = e), (e = s.times(n.plus(r.div(n))))
            } while (n.c.slice(0, a).join('') !== e.c.slice(0, a).join(''))
            return f(e, (o.DP -= 4) + e.e + 1, o.RM)
          }),
          (d.times = d.mul =
            function (e) {
              var t,
                n = this,
                r = n.constructor,
                o = n.c,
                u = (e = new r(e)).c,
                i = o.length,
                a = u.length,
                s = n.e,
                d = e.e
              if (((e.s = n.s == e.s ? 1 : -1), !o[0] || !u[0])) return (e.c = [(e.e = 0)]), e
              for (
                e.e = s + d,
                  i < a && ((t = o), (o = u), (u = t), (d = i), (i = a), (a = d)),
                  t = new Array((d = i + a));
                d--;

              )
                t[d] = 0
              for (s = a; s--; ) {
                for (a = 0, d = i + s; d > s; )
                  (a = t[d] + u[s] * o[d - s - 1] + a), (t[d--] = a % 10), (a = (a / 10) | 0)
                t[d] = a
              }
              for (a ? ++e.e : t.shift(), s = t.length; !t[--s]; ) t.pop()
              return (e.c = t), e
            }),
          (d.toExponential = function (e, t) {
            var n = this,
              r = n.c[0]
            if (void 0 !== e) {
              if (e !== ~~e || e < 0 || e > 1e6) throw Error(s)
              for (n = f(new n.constructor(n), ++e, t); n.c.length < e; ) n.c.push(0)
            }
            return l(n, !0, !!r)
          }),
          (d.toFixed = function (e, t) {
            var n = this,
              r = n.c[0]
            if (void 0 !== e) {
              if (e !== ~~e || e < 0 || e > 1e6) throw Error(s)
              for (e = e + (n = f(new n.constructor(n), e + n.e + 1, t)).e + 1; n.c.length < e; ) n.c.push(0)
            }
            return l(n, !1, !!r)
          }),
          (d.toJSON = d.toString =
            function () {
              var e = this,
                t = e.constructor
              return l(e, e.e <= t.NE || e.e >= t.PE, !!e.c[0])
            }),
          (d.toNumber = function () {
            var e = Number(l(this, !0, !0))
            if (!0 === this.constructor.strict && !this.eq(e.toString())) throw Error(i + 'Imprecise conversion')
            return e
          }),
          (d.toPrecision = function (e, t) {
            var n = this,
              r = n.constructor,
              o = n.c[0]
            if (void 0 !== e) {
              if (e !== ~~e || e < 1 || e > 1e6) throw Error(a + 'precision')
              for (n = f(new r(n), e, t); n.c.length < e; ) n.c.push(0)
            }
            return l(n, e <= n.e || n.e <= r.NE || n.e >= r.PE, !!o)
          }),
          (d.valueOf = function () {
            var e = this,
              t = e.constructor
            if (!0 === t.strict) throw Error(i + 'valueOf disallowed')
            return l(e, e.e <= t.NE || e.e >= t.PE, !0)
          }),
          ((u = (function e() {
            function t(n) {
              var r = this
              if (!(r instanceof t)) return void 0 === n ? e() : new t(n)
              if (n instanceof t) (r.s = n.s), (r.e = n.e), (r.c = n.c.slice())
              else {
                if ('string' != typeof n) {
                  if (!0 === t.strict) throw TypeError(a + 'number')
                  n = 0 === n && 1 / n < 0 ? '-0' : String(n)
                }
                !(function (e, t) {
                  var n, r, o
                  if (!c.test(t)) throw Error(a + 'number')
                  ;(e.s = '-' == t.charAt(0) ? ((t = t.slice(1)), -1) : 1),
                    (n = t.indexOf('.')) > -1 && (t = t.replace('.', ''))
                  ;(r = t.search(/e/i)) > 0
                    ? (n < 0 && (n = r), (n += +t.slice(r + 1)), (t = t.substring(0, r)))
                    : n < 0 && (n = t.length)
                  for (o = t.length, r = 0; r < o && '0' == t.charAt(r); ) ++r
                  if (r == o) e.c = [(e.e = 0)]
                  else {
                    for (; o > 0 && '0' == t.charAt(--o); );
                    for (e.e = n - r - 1, e.c = [], n = 0; r <= o; ) e.c[n++] = +t.charAt(r++)
                  }
                })(r, n)
              }
              r.constructor = t
            }
            return (
              (t.prototype = d),
              (t.DP = 20),
              (t.RM = 1),
              (t.NE = -7),
              (t.PE = 21),
              (t.strict = !1),
              (t.roundDown = 0),
              (t.roundHalfUp = 1),
              (t.roundHalfEven = 2),
              (t.roundUp = 3),
              t
            )
          })()).default = u.Big =
            u),
          void 0 ===
            (r = function () {
              return u
            }.call(t, n, t, e)) || (e.exports = r)
      })()
    },
    81746: (e, t, n) => {
      'use strict'
      n.d(t, { bindToDevicePixelRatio: () => o })
      var r = { allowDownsampling: !0 }
      function o(e, t) {
        return void 0 === t && (t = r), new u(e, t)
      }
      var u = (function () {
        function e(e, t) {
          var n = this
          ;(this._resolutionMediaQueryList = null),
            (this._resolutionListener = function (e) {
              return n._onResolutionChanged()
            }),
            (this._canvasConfiguredListeners = []),
            (this.canvas = e),
            (this._canvasSize = { width: this.canvas.clientWidth, height: this.canvas.clientHeight }),
            (this._options = t),
            this._configureCanvas(),
            this._installResolutionListener()
        }
        return (
          (e.prototype.destroy = function () {
            ;(this._canvasConfiguredListeners.length = 0), this._uninstallResolutionListener(), (this.canvas = null)
          }),
          Object.defineProperty(e.prototype, 'canvasSize', {
            get: function () {
              return { width: this._canvasSize.width, height: this._canvasSize.height }
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.resizeCanvas = function (e) {
            ;(this._canvasSize = { width: e.width, height: e.height }), this._configureCanvas()
          }),
          Object.defineProperty(e.prototype, 'pixelRatio', {
            get: function () {
              var e = this.canvas.ownerDocument.defaultView
              if (null == e) throw new Error('No window is associated with the canvas')
              return e.devicePixelRatio > 1 || this._options.allowDownsampling ? e.devicePixelRatio : 1
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.subscribeCanvasConfigured = function (e) {
            this._canvasConfiguredListeners.push(e)
          }),
          (e.prototype.unsubscribeCanvasConfigured = function (e) {
            this._canvasConfiguredListeners = this._canvasConfiguredListeners.filter(function (t) {
              return t != e
            })
          }),
          (e.prototype._configureCanvas = function () {
            var e = this.pixelRatio
            ;(this.canvas.style.width = this._canvasSize.width + 'px'),
              (this.canvas.style.height = this._canvasSize.height + 'px'),
              (this.canvas.width = this._canvasSize.width * e),
              (this.canvas.height = this._canvasSize.height * e),
              this._emitCanvasConfigured()
          }),
          (e.prototype._emitCanvasConfigured = function () {
            var e = this
            this._canvasConfiguredListeners.forEach(function (t) {
              return t.call(e)
            })
          }),
          (e.prototype._installResolutionListener = function () {
            if (null !== this._resolutionMediaQueryList) throw new Error('Resolution listener is already installed')
            var e = this.canvas.ownerDocument.defaultView
            if (null == e) throw new Error('No window is associated with the canvas')
            var t = e.devicePixelRatio
            ;(this._resolutionMediaQueryList = e.matchMedia('all and (resolution: ' + t + 'dppx)')),
              this._resolutionMediaQueryList.addListener(this._resolutionListener)
          }),
          (e.prototype._uninstallResolutionListener = function () {
            null !== this._resolutionMediaQueryList &&
              (this._resolutionMediaQueryList.removeListener(this._resolutionListener),
              (this._resolutionMediaQueryList = null))
          }),
          (e.prototype._reinstallResolutionListener = function () {
            this._uninstallResolutionListener(), this._installResolutionListener()
          }),
          (e.prototype._onResolutionChanged = function () {
            this._configureCanvas(), this._reinstallResolutionListener()
          }),
          e
        )
      })()
    },
    18606: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => l })
      const r = function () {
        ;(this.__data__ = []), (this.size = 0)
      }
      var o = n(72575)
      const u = function (e, t) {
        for (var n = e.length; n--; ) if ((0, o.default)(e[n][0], t)) return n
        return -1
      }
      var i = Array.prototype.splice
      const a = function (e) {
        var t = this.__data__,
          n = u(t, e)
        return !(n < 0) && (n == t.length - 1 ? t.pop() : i.call(t, n, 1), --this.size, !0)
      }
      const s = function (e) {
        var t = this.__data__,
          n = u(t, e)
        return n < 0 ? void 0 : t[n][1]
      }
      const d = function (e) {
        return u(this.__data__, e) > -1
      }
      const c = function (e, t) {
        var n = this.__data__,
          r = u(n, e)
        return r < 0 ? (++this.size, n.push([e, t])) : (n[r][1] = t), this
      }
      function f(e) {
        var t = -1,
          n = null == e ? 0 : e.length
        for (this.clear(); ++t < n; ) {
          var r = e[t]
          this.set(r[0], r[1])
        }
      }
      ;(f.prototype.clear = r),
        (f.prototype.delete = a),
        (f.prototype.get = s),
        (f.prototype.has = d),
        (f.prototype.set = c)
      const l = f
    },
    67027: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(70830),
        o = n(78160)
      const u = (0, r.default)(o.default, 'Map')
    },
    1141: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => k })
      const r = (0, n(70830).default)(Object, 'create')
      const o = function () {
        ;(this.__data__ = r ? r(null) : {}), (this.size = 0)
      }
      const u = function (e) {
        var t = this.has(e) && delete this.__data__[e]
        return (this.size -= t ? 1 : 0), t
      }
      var i = Object.prototype.hasOwnProperty
      const a = function (e) {
        var t = this.__data__
        if (r) {
          var n = t[e]
          return '__lodash_hash_undefined__' === n ? void 0 : n
        }
        return i.call(t, e) ? t[e] : void 0
      }
      var s = Object.prototype.hasOwnProperty
      const d = function (e) {
        var t = this.__data__
        return r ? void 0 !== t[e] : s.call(t, e)
      }
      const c = function (e, t) {
        var n = this.__data__
        return (this.size += this.has(e) ? 0 : 1), (n[e] = r && void 0 === t ? '__lodash_hash_undefined__' : t), this
      }
      function f(e) {
        var t = -1,
          n = null == e ? 0 : e.length
        for (this.clear(); ++t < n; ) {
          var r = e[t]
          this.set(r[0], r[1])
        }
      }
      ;(f.prototype.clear = o),
        (f.prototype.delete = u),
        (f.prototype.get = a),
        (f.prototype.has = d),
        (f.prototype.set = c)
      const l = f
      var p = n(18606),
        h = n(67027)
      const g = function () {
        ;(this.size = 0), (this.__data__ = { hash: new l(), map: new (h.default || p.default)(), string: new l() })
      }
      const _ = function (e) {
        var t = typeof e
        return 'string' == t || 'number' == t || 'symbol' == t || 'boolean' == t ? '__proto__' !== e : null === e
      }
      const v = function (e, t) {
        var n = e.__data__
        return _(t) ? n['string' == typeof t ? 'string' : 'hash'] : n.map
      }
      const b = function (e) {
        var t = v(this, e).delete(e)
        return (this.size -= t ? 1 : 0), t
      }
      const y = function (e) {
        return v(this, e).get(e)
      }
      const m = function (e) {
        return v(this, e).has(e)
      }
      const w = function (e, t) {
        var n = v(this, e),
          r = n.size
        return n.set(e, t), (this.size += n.size == r ? 0 : 1), this
      }
      function x(e) {
        var t = -1,
          n = null == e ? 0 : e.length
        for (this.clear(); ++t < n; ) {
          var r = e[t]
          this.set(r[0], r[1])
        }
      }
      ;(x.prototype.clear = g),
        (x.prototype.delete = b),
        (x.prototype.get = y),
        (x.prototype.has = m),
        (x.prototype.set = w)
      const k = x
    },
    96335: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => l })
      var r = n(18606)
      const o = function () {
        ;(this.__data__ = new r.default()), (this.size = 0)
      }
      const u = function (e) {
        var t = this.__data__,
          n = t.delete(e)
        return (this.size = t.size), n
      }
      const i = function (e) {
        return this.__data__.get(e)
      }
      const a = function (e) {
        return this.__data__.has(e)
      }
      var s = n(67027),
        d = n(1141)
      const c = function (e, t) {
        var n = this.__data__
        if (n instanceof r.default) {
          var o = n.__data__
          if (!s.default || o.length < 199) return o.push([e, t]), (this.size = ++n.size), this
          n = this.__data__ = new d.default(o)
        }
        return n.set(e, t), (this.size = n.size), this
      }
      function f(e) {
        var t = (this.__data__ = new r.default(e))
        this.size = t.size
      }
      ;(f.prototype.clear = o),
        (f.prototype.delete = u),
        (f.prototype.get = i),
        (f.prototype.has = a),
        (f.prototype.set = c)
      const l = f
    },
    3060: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = n(78160).default.Symbol
    },
    35246: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = n(78160).default.Uint8Array
    },
    31468: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => c })
      const r = function (e, t) {
        for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n)
        return r
      }
      var o = n(53822),
        u = n(54814),
        i = n(25247),
        a = n(17104),
        s = n(54744),
        d = Object.prototype.hasOwnProperty
      const c = function (e, t) {
        var n = (0, u.default)(e),
          c = !n && (0, o.default)(e),
          f = !n && !c && (0, i.default)(e),
          l = !n && !c && !f && (0, s.default)(e),
          p = n || c || f || l,
          h = p ? r(e.length, String) : [],
          g = h.length
        for (var _ in e)
          (!t && !d.call(e, _)) ||
            (p &&
              ('length' == _ ||
                (f && ('offset' == _ || 'parent' == _)) ||
                (l && ('buffer' == _ || 'byteLength' == _ || 'byteOffset' == _)) ||
                (0, a.default)(_, g))) ||
            h.push(_)
        return h
      }
    },
    20883: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e, t) {
        for (var n = -1, r = t.length, o = e.length; ++n < r; ) e[o + n] = t[n]
        return e
      }
    },
    66934: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => i })
      var r = n(24402),
        o = n(72575),
        u = Object.prototype.hasOwnProperty
      const i = function (e, t, n) {
        var i = e[t]
        ;(u.call(e, t) && (0, o.default)(i, n) && (void 0 !== n || t in e)) || (0, r.default)(e, t, n)
      }
    },
    24402: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(76780)
      const o = function (e, t, n) {
        '__proto__' == t && r.default
          ? (0, r.default)(e, t, { configurable: !0, enumerable: !0, value: n, writable: !0 })
          : (e[t] = n)
      }
    },
    29718: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = (function (e) {
        return function (t, n, r) {
          for (var o = -1, u = Object(t), i = r(t), a = i.length; a--; ) {
            var s = i[e ? a : ++o]
            if (!1 === n(u[s], s, u)) break
          }
          return t
        }
      })()
    },
    80838: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(54136),
        o = n(87844)
      const u = function (e, t) {
        for (var n = 0, u = (t = (0, r.default)(t, e)).length; null != e && n < u; ) e = e[(0, o.default)(t[n++])]
        return n && n == u ? e : void 0
      }
    },
    44631: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(20883),
        o = n(54814)
      const u = function (e, t, n) {
        var u = t(e)
        return (0, o.default)(e) ? u : (0, r.default)(u, n(e))
      }
    },
    28177: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => l })
      var r = n(3060),
        o = Object.prototype,
        u = o.hasOwnProperty,
        i = o.toString,
        a = r.default ? r.default.toStringTag : void 0
      const s = function (e) {
        var t = u.call(e, a),
          n = e[a]
        try {
          e[a] = void 0
          var r = !0
        } catch (e) {}
        var o = i.call(e)
        return r && (t ? (e[a] = n) : delete e[a]), o
      }
      var d = Object.prototype.toString
      const c = function (e) {
        return d.call(e)
      }
      var f = r.default ? r.default.toStringTag : void 0
      const l = function (e) {
        return null == e ? (void 0 === e ? '[object Undefined]' : '[object Null]') : f && f in Object(e) ? s(e) : c(e)
      }
    },
    96425: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => N })
      var r = n(96335),
        o = n(1141)
      const u = function (e) {
        return this.__data__.set(e, '__lodash_hash_undefined__'), this
      }
      const i = function (e) {
        return this.__data__.has(e)
      }
      function a(e) {
        var t = -1,
          n = null == e ? 0 : e.length
        for (this.__data__ = new o.default(); ++t < n; ) this.add(e[t])
      }
      ;(a.prototype.add = a.prototype.push = u), (a.prototype.has = i)
      const s = a
      const d = function (e, t) {
        for (var n = -1, r = null == e ? 0 : e.length; ++n < r; ) if (t(e[n], n, e)) return !0
        return !1
      }
      const c = function (e, t) {
        return e.has(t)
      }
      const f = function (e, t, n, r, o, u) {
        var i = 1 & n,
          a = e.length,
          f = t.length
        if (a != f && !(i && f > a)) return !1
        var l = u.get(e)
        if (l && u.get(t)) return l == t
        var p = -1,
          h = !0,
          g = 2 & n ? new s() : void 0
        for (u.set(e, t), u.set(t, e); ++p < a; ) {
          var _ = e[p],
            v = t[p]
          if (r) var b = i ? r(v, _, p, t, e, u) : r(_, v, p, e, t, u)
          if (void 0 !== b) {
            if (b) continue
            h = !1
            break
          }
          if (g) {
            if (
              !d(t, function (e, t) {
                if (!c(g, t) && (_ === e || o(_, e, n, r, u))) return g.push(t)
              })
            ) {
              h = !1
              break
            }
          } else if (_ !== v && !o(_, v, n, r, u)) {
            h = !1
            break
          }
        }
        return u.delete(e), u.delete(t), h
      }
      var l = n(3060),
        p = n(35246),
        h = n(72575)
      const g = function (e) {
        var t = -1,
          n = Array(e.size)
        return (
          e.forEach(function (e, r) {
            n[++t] = [r, e]
          }),
          n
        )
      }
      const _ = function (e) {
        var t = -1,
          n = Array(e.size)
        return (
          e.forEach(function (e) {
            n[++t] = e
          }),
          n
        )
      }
      var v = l.default ? l.default.prototype : void 0,
        b = v ? v.valueOf : void 0
      const y = function (e, t, n, r, o, u, i) {
        switch (n) {
          case '[object DataView]':
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1
            ;(e = e.buffer), (t = t.buffer)
          case '[object ArrayBuffer]':
            return !(e.byteLength != t.byteLength || !u(new p.default(e), new p.default(t)))
          case '[object Boolean]':
          case '[object Date]':
          case '[object Number]':
            return (0, h.default)(+e, +t)
          case '[object Error]':
            return e.name == t.name && e.message == t.message
          case '[object RegExp]':
          case '[object String]':
            return e == t + ''
          case '[object Map]':
            var a = g
          case '[object Set]':
            var s = 1 & r
            if ((a || (a = _), e.size != t.size && !s)) return !1
            var d = i.get(e)
            if (d) return d == t
            ;(r |= 2), i.set(e, t)
            var c = f(a(e), a(t), r, o, u, i)
            return i.delete(e), c
          case '[object Symbol]':
            if (b) return b.call(e) == b.call(t)
        }
        return !1
      }
      var m = n(85747),
        w = Object.prototype.hasOwnProperty
      const x = function (e, t, n, r, o, u) {
        var i = 1 & n,
          a = (0, m.default)(e),
          s = a.length
        if (s != (0, m.default)(t).length && !i) return !1
        for (var d = s; d--; ) {
          var c = a[d]
          if (!(i ? c in t : w.call(t, c))) return !1
        }
        var f = u.get(e)
        if (f && u.get(t)) return f == t
        var l = !0
        u.set(e, t), u.set(t, e)
        for (var p = i; ++d < s; ) {
          var h = e[(c = a[d])],
            g = t[c]
          if (r) var _ = i ? r(g, h, c, t, e, u) : r(h, g, c, e, t, u)
          if (!(void 0 === _ ? h === g || o(h, g, n, r, u) : _)) {
            l = !1
            break
          }
          p || (p = 'constructor' == c)
        }
        if (l && !p) {
          var v = e.constructor,
            b = t.constructor
          v == b ||
            !('constructor' in e) ||
            !('constructor' in t) ||
            ('function' == typeof v && v instanceof v && 'function' == typeof b && b instanceof b) ||
            (l = !1)
        }
        return u.delete(e), u.delete(t), l
      }
      var k = n(17873),
        j = n(54814),
        O = n(25247),
        S = n(54744),
        L = '[object Object]',
        P = Object.prototype.hasOwnProperty
      const A = function (e, t, n, o, u, i) {
        var a = (0, j.default)(e),
          s = (0, j.default)(t),
          d = a ? '[object Array]' : (0, k.default)(e),
          c = s ? '[object Array]' : (0, k.default)(t),
          l = (d = '[object Arguments]' == d ? L : d) == L,
          p = (c = '[object Arguments]' == c ? L : c) == L,
          h = d == c
        if (h && (0, O.default)(e)) {
          if (!(0, O.default)(t)) return !1
          ;(a = !0), (l = !1)
        }
        if (h && !l)
          return i || (i = new r.default()), a || (0, S.default)(e) ? f(e, t, n, o, u, i) : y(e, t, d, n, o, u, i)
        if (!(1 & n)) {
          var g = l && P.call(e, '__wrapped__'),
            _ = p && P.call(t, '__wrapped__')
          if (g || _) {
            var v = g ? e.value() : e,
              b = _ ? t.value() : t
            return i || (i = new r.default()), u(v, b, n, o, i)
          }
        }
        return !!h && (i || (i = new r.default()), x(e, t, n, o, u, i))
      }
      var E = n(83527)
      const N = function e(t, n, r, o, u) {
        return (
          t === n ||
          (null == t || null == n || (!(0, E.default)(t) && !(0, E.default)(n))
            ? t != t && n != n
            : A(t, n, r, o, e, u))
        )
      }
    },
    7492: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => i })
      var r = n(43744)
      const o = (0, n(22828).default)(Object.keys, Object)
      var u = Object.prototype.hasOwnProperty
      const i = function (e) {
        if (!(0, r.default)(e)) return o(e)
        var t = []
        for (var n in Object(e)) u.call(e, n) && 'constructor' != n && t.push(n)
        return t
      }
    },
    95256: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        return function (t) {
          return e(t)
        }
      }
    },
    54136: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => b })
      var r = n(54814),
        o = n(73204),
        u = n(1141)
      function i(e, t) {
        if ('function' != typeof e || (null != t && 'function' != typeof t)) throw new TypeError('Expected a function')
        var n = function () {
          var r = arguments,
            o = t ? t.apply(this, r) : r[0],
            u = n.cache
          if (u.has(o)) return u.get(o)
          var i = e.apply(this, r)
          return (n.cache = u.set(o, i) || u), i
        }
        return (n.cache = new (i.Cache || u.default)()), n
      }
      i.Cache = u.default
      const a = i
      var s = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        d = /\\(\\)?/g
      const c = (function (e) {
        var t = a(e, function (e) {
            return 500 === n.size && n.clear(), e
          }),
          n = t.cache
        return t
      })(function (e) {
        var t = []
        return (
          46 === e.charCodeAt(0) && t.push(''),
          e.replace(s, function (e, n, r, o) {
            t.push(r ? o.replace(d, '$1') : n || e)
          }),
          t
        )
      })
      var f = n(3060)
      const l = function (e, t) {
        for (var n = -1, r = null == e ? 0 : e.length, o = Array(r); ++n < r; ) o[n] = t(e[n], n, e)
        return o
      }
      var p = n(8875),
        h = f.default ? f.default.prototype : void 0,
        g = h ? h.toString : void 0
      const _ = function e(t) {
        if ('string' == typeof t) return t
        if ((0, r.default)(t)) return l(t, e) + ''
        if ((0, p.default)(t)) return g ? g.call(t) : ''
        var n = t + ''
        return '0' == n && 1 / t == -1 / 0 ? '-0' : n
      }
      const v = function (e) {
        return null == e ? '' : _(e)
      }
      const b = function (e, t) {
        return (0, r.default)(e) ? e : (0, o.default)(e, t) ? [e] : c(v(e))
      }
    },
    44702: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(35246)
      const o = function (e) {
        var t = new e.constructor(e.byteLength)
        return new r.default(t).set(new r.default(e)), t
      }
    },
    57508: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => s })
      var r = n(78160)
      e = n.hmd(e)
      var o = 'object' == typeof exports && exports && !exports.nodeType && exports,
        u = o && e && !e.nodeType && e,
        i = u && u.exports === o ? r.default.Buffer : void 0,
        a = i ? i.allocUnsafe : void 0
      const s = function (e, t) {
        if (t) return e.slice()
        var n = e.length,
          r = a ? a(n) : new e.constructor(n)
        return e.copy(r), r
      }
    },
    39895: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(44702)
      const o = function (e, t) {
        var n = t ? (0, r.default)(e.buffer) : e.buffer
        return new e.constructor(n, e.byteOffset, e.length)
      }
    },
    58555: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e, t) {
        var n = -1,
          r = e.length
        for (t || (t = Array(r)); ++n < r; ) t[n] = e[n]
        return t
      }
    },
    75969: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(66934),
        o = n(24402)
      const u = function (e, t, n, u) {
        var i = !n
        n || (n = {})
        for (var a = -1, s = t.length; ++a < s; ) {
          var d = t[a],
            c = u ? u(n[d], e[d], d, n, e) : void 0
          void 0 === c && (c = e[d]), i ? (0, o.default)(n, d, c) : (0, r.default)(n, d, c)
        }
        return n
      }
    },
    76780: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(70830)
      const o = (function () {
        try {
          var e = (0, r.default)(Object, 'defineProperty')
          return e({}, '', {}), e
        } catch (e) {}
      })()
    },
    89956: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = 'object' == typeof n.g && n.g && n.g.Object === Object && n.g
    },
    85747: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => i })
      var r = n(44631),
        o = n(12644),
        u = n(33358)
      const i = function (e) {
        return (0, r.default)(e, u.default, o.default)
      }
    },
    70830: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => b })
      var r = n(62942)
      const o = n(78160).default['__core-js_shared__']
      var u,
        i = (u = /[^.]+$/.exec((o && o.keys && o.keys.IE_PROTO) || '')) ? 'Symbol(src)_1.' + u : ''
      const a = function (e) {
        return !!i && i in e
      }
      var s = n(98279),
        d = n(59990),
        c = /^\[object .+?Constructor\]$/,
        f = Function.prototype,
        l = Object.prototype,
        p = f.toString,
        h = l.hasOwnProperty,
        g = RegExp(
          '^' +
            p
              .call(h)
              .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
            '$',
        )
      const _ = function (e) {
        return !(!(0, s.default)(e) || a(e)) && ((0, r.default)(e) ? g : c).test((0, d.default)(e))
      }
      const v = function (e, t) {
        return null == e ? void 0 : e[t]
      }
      const b = function (e, t) {
        var n = v(e, t)
        return _(n) ? n : void 0
      }
    },
    56838: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = (0, n(22828).default)(Object.getPrototypeOf, Object)
    },
    12644: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => a })
      const r = function (e, t) {
        for (var n = -1, r = null == e ? 0 : e.length, o = 0, u = []; ++n < r; ) {
          var i = e[n]
          t(i, n, e) && (u[o++] = i)
        }
        return u
      }
      var o = n(35987),
        u = Object.prototype.propertyIsEnumerable,
        i = Object.getOwnPropertySymbols
      const a = i
        ? function (e) {
            return null == e
              ? []
              : ((e = Object(e)),
                r(i(e), function (t) {
                  return u.call(e, t)
                }))
          }
        : o.default
    },
    17873: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => b })
      var r = n(70830),
        o = n(78160)
      const u = (0, r.default)(o.default, 'DataView')
      var i = n(67027)
      const a = (0, r.default)(o.default, 'Promise')
      const s = (0, r.default)(o.default, 'Set')
      const d = (0, r.default)(o.default, 'WeakMap')
      var c = n(28177),
        f = n(59990),
        l = (0, f.default)(u),
        p = (0, f.default)(i.default),
        h = (0, f.default)(a),
        g = (0, f.default)(s),
        _ = (0, f.default)(d),
        v = c.default
      ;((u && '[object DataView]' != v(new u(new ArrayBuffer(1)))) ||
        (i.default && '[object Map]' != v(new i.default())) ||
        (a && '[object Promise]' != v(a.resolve())) ||
        (s && '[object Set]' != v(new s())) ||
        (d && '[object WeakMap]' != v(new d()))) &&
        (v = function (e) {
          var t = (0, c.default)(e),
            n = '[object Object]' == t ? e.constructor : void 0,
            r = n ? (0, f.default)(n) : ''
          if (r)
            switch (r) {
              case l:
                return '[object DataView]'
              case p:
                return '[object Map]'
              case h:
                return '[object Promise]'
              case g:
                return '[object Set]'
              case _:
                return '[object WeakMap]'
            }
          return t
        })
      const b = v
    },
    52222: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => s })
      var r = n(98279),
        o = Object.create
      const u = (function () {
        function e() {}
        return function (t) {
          if (!(0, r.default)(t)) return {}
          if (o) return o(t)
          e.prototype = t
          var n = new e()
          return (e.prototype = void 0), n
        }
      })()
      var i = n(56838),
        a = n(43744)
      const s = function (e) {
        return 'function' != typeof e.constructor || (0, a.default)(e) ? {} : u((0, i.default)(e))
      }
    },
    17104: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = /^(?:0|[1-9]\d*)$/
      const o = function (e, t) {
        var n = typeof e
        return (
          !!(t = null == t ? 9007199254740991 : t) &&
          ('number' == n || ('symbol' != n && r.test(e))) &&
          e > -1 &&
          e % 1 == 0 &&
          e < t
        )
      }
    },
    73204: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => a })
      var r = n(54814),
        o = n(8875),
        u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        i = /^\w*$/
      const a = function (e, t) {
        if ((0, r.default)(e)) return !1
        var n = typeof e
        return (
          !('number' != n && 'symbol' != n && 'boolean' != n && null != e && !(0, o.default)(e)) ||
          i.test(e) ||
          !u.test(e) ||
          (null != t && e in Object(t))
        )
      }
    },
    43744: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = Object.prototype
      const o = function (e) {
        var t = e && e.constructor
        return e === (('function' == typeof t && t.prototype) || r)
      }
    },
    59283: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => a })
      var r = n(89956)
      e = n.hmd(e)
      var o = 'object' == typeof exports && exports && !exports.nodeType && exports,
        u = o && e && !e.nodeType && e,
        i = u && u.exports === o && r.default.process
      const a = (function () {
        try {
          var e = u && u.require && u.require('util').types
          return e || (i && i.binding && i.binding('util'))
        } catch (e) {}
      })()
    },
    22828: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e, t) {
        return function (n) {
          return e(t(n))
        }
      }
    },
    78160: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(89956),
        o = 'object' == typeof self && self && self.Object === Object && self
      const u = r.default || o || Function('return this')()
    },
    87844: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(8875)
      const o = function (e) {
        if ('string' == typeof e || (0, r.default)(e)) return e
        var t = e + ''
        return '0' == t && 1 / e == -1 / 0 ? '-0' : t
      }
    },
    59990: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = Function.prototype.toString
      const o = function (e) {
        if (null != e) {
          try {
            return r.call(e)
          } catch (e) {}
          try {
            return e + ''
          } catch (e) {}
        }
        return ''
      }
    },
    27788: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => Q })
      var r = n(96335)
      const o = function (e, t) {
        for (var n = -1, r = null == e ? 0 : e.length; ++n < r && !1 !== t(e[n], n, e); );
        return e
      }
      var u = n(66934),
        i = n(75969),
        a = n(33358)
      const s = function (e, t) {
        return e && (0, i.default)(t, (0, a.default)(t), e)
      }
      var d = n(64162)
      const c = function (e, t) {
        return e && (0, i.default)(t, (0, d.default)(t), e)
      }
      var f = n(57508),
        l = n(58555),
        p = n(12644)
      const h = function (e, t) {
        return (0, i.default)(e, (0, p.default)(e), t)
      }
      var g = n(20883),
        _ = n(56838),
        v = n(35987)
      const b = Object.getOwnPropertySymbols
        ? function (e) {
            for (var t = []; e; ) (0, g.default)(t, (0, p.default)(e)), (e = (0, _.default)(e))
            return t
          }
        : v.default
      const y = function (e, t) {
        return (0, i.default)(e, b(e), t)
      }
      var m = n(85747),
        w = n(44631)
      const x = function (e) {
        return (0, w.default)(e, d.default, b)
      }
      var k = n(17873),
        j = Object.prototype.hasOwnProperty
      const O = function (e) {
        var t = e.length,
          n = new e.constructor(t)
        return t && 'string' == typeof e[0] && j.call(e, 'index') && ((n.index = e.index), (n.input = e.input)), n
      }
      var S = n(44702)
      const L = function (e, t) {
        var n = t ? (0, S.default)(e.buffer) : e.buffer
        return new e.constructor(n, e.byteOffset, e.byteLength)
      }
      var P = /\w*$/
      const A = function (e) {
        var t = new e.constructor(e.source, P.exec(e))
        return (t.lastIndex = e.lastIndex), t
      }
      var E = n(3060),
        N = E.default ? E.default.prototype : void 0,
        C = N ? N.valueOf : void 0
      const R = function (e) {
        return C ? Object(C.call(e)) : {}
      }
      var T = n(39895)
      const I = function (e, t, n) {
        var r = e.constructor
        switch (t) {
          case '[object ArrayBuffer]':
            return (0, S.default)(e)
          case '[object Boolean]':
          case '[object Date]':
            return new r(+e)
          case '[object DataView]':
            return L(e, n)
          case '[object Float32Array]':
          case '[object Float64Array]':
          case '[object Int8Array]':
          case '[object Int16Array]':
          case '[object Int32Array]':
          case '[object Uint8Array]':
          case '[object Uint8ClampedArray]':
          case '[object Uint16Array]':
          case '[object Uint32Array]':
            return (0, T.default)(e, n)
          case '[object Map]':
            return new r()
          case '[object Number]':
          case '[object String]':
            return new r(e)
          case '[object RegExp]':
            return A(e)
          case '[object Set]':
            return new r()
          case '[object Symbol]':
            return R(e)
        }
      }
      var M = n(52222),
        F = n(54814),
        z = n(25247),
        V = n(83527)
      const D = function (e) {
        return (0, V.default)(e) && '[object Map]' == (0, k.default)(e)
      }
      var B = n(95256),
        $ = n(59283),
        q = $.default && $.default.isMap
      const U = q ? (0, B.default)(q) : D
      var H = n(98279)
      const W = function (e) {
        return (0, V.default)(e) && '[object Set]' == (0, k.default)(e)
      }
      var K = $.default && $.default.isSet
      const J = K ? (0, B.default)(K) : W
      var Z = {}
      ;(Z['[object Arguments]'] =
        Z['[object Array]'] =
        Z['[object ArrayBuffer]'] =
        Z['[object DataView]'] =
        Z['[object Boolean]'] =
        Z['[object Date]'] =
        Z['[object Float32Array]'] =
        Z['[object Float64Array]'] =
        Z['[object Int8Array]'] =
        Z['[object Int16Array]'] =
        Z['[object Int32Array]'] =
        Z['[object Map]'] =
        Z['[object Number]'] =
        Z['[object Object]'] =
        Z['[object RegExp]'] =
        Z['[object Set]'] =
        Z['[object String]'] =
        Z['[object Symbol]'] =
        Z['[object Uint8Array]'] =
        Z['[object Uint8ClampedArray]'] =
        Z['[object Uint16Array]'] =
        Z['[object Uint32Array]'] =
          !0),
        (Z['[object Error]'] = Z['[object Function]'] = Z['[object WeakMap]'] = !1)
      const G = function e(t, n, i, d, p, g) {
        var _,
          v = 1 & n,
          b = 2 & n,
          w = 4 & n
        if ((i && (_ = p ? i(t, d, p, g) : i(t)), void 0 !== _)) return _
        if (!(0, H.default)(t)) return t
        var j = (0, F.default)(t)
        if (j) {
          if (((_ = O(t)), !v)) return (0, l.default)(t, _)
        } else {
          var S = (0, k.default)(t),
            L = '[object Function]' == S || '[object GeneratorFunction]' == S
          if ((0, z.default)(t)) return (0, f.default)(t, v)
          if ('[object Object]' == S || '[object Arguments]' == S || (L && !p)) {
            if (((_ = b || L ? {} : (0, M.default)(t)), !v)) return b ? y(t, c(_, t)) : h(t, s(_, t))
          } else {
            if (!Z[S]) return p ? t : {}
            _ = I(t, S, v)
          }
        }
        g || (g = new r.default())
        var P = g.get(t)
        if (P) return P
        g.set(t, _),
          J(t)
            ? t.forEach(function (r) {
                _.add(e(r, n, i, r, t, g))
              })
            : U(t) &&
              t.forEach(function (r, o) {
                _.set(o, e(r, n, i, o, t, g))
              })
        var A = w ? (b ? x : m.default) : b ? keysIn : a.default,
          E = j ? void 0 : A(t)
        return (
          o(E || t, function (r, o) {
            E && (r = t[(o = r)]), (0, u.default)(_, o, e(r, n, i, o, t, g))
          }),
          _
        )
      }
      const Q = function (e) {
        return G(e, 5)
      }
    },
    4889: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => g })
      var r = n(98279),
        o = n(78160)
      const u = function () {
        return o.default.Date.now()
      }
      var i = n(8875),
        a = /^\s+|\s+$/g,
        s = /^[-+]0x[0-9a-f]+$/i,
        d = /^0b[01]+$/i,
        c = /^0o[0-7]+$/i,
        f = parseInt
      const l = function (e) {
        if ('number' == typeof e) return e
        if ((0, i.default)(e)) return NaN
        if ((0, r.default)(e)) {
          var t = 'function' == typeof e.valueOf ? e.valueOf() : e
          e = (0, r.default)(t) ? t + '' : t
        }
        if ('string' != typeof e) return 0 === e ? e : +e
        e = e.replace(a, '')
        var n = d.test(e)
        return n || c.test(e) ? f(e.slice(2), n ? 2 : 8) : s.test(e) ? NaN : +e
      }
      var p = Math.max,
        h = Math.min
      const g = function (e, t, n) {
        var o,
          i,
          a,
          s,
          d,
          c,
          f = 0,
          g = !1,
          _ = !1,
          v = !0
        if ('function' != typeof e) throw new TypeError('Expected a function')
        function b(t) {
          var n = o,
            r = i
          return (o = i = void 0), (f = t), (s = e.apply(r, n))
        }
        function y(e) {
          return (f = e), (d = setTimeout(w, t)), g ? b(e) : s
        }
        function m(e) {
          var n = e - c
          return void 0 === c || n >= t || n < 0 || (_ && e - f >= a)
        }
        function w() {
          var e = u()
          if (m(e)) return x(e)
          d = setTimeout(
            w,
            (function (e) {
              var n = t - (e - c)
              return _ ? h(n, a - (e - f)) : n
            })(e),
          )
        }
        function x(e) {
          return (d = void 0), v && o ? b(e) : ((o = i = void 0), s)
        }
        function k() {
          var e = u(),
            n = m(e)
          if (((o = arguments), (i = this), (c = e), n)) {
            if (void 0 === d) return y(c)
            if (_) return clearTimeout(d), (d = setTimeout(w, t)), b(c)
          }
          return void 0 === d && (d = setTimeout(w, t)), s
        }
        return (
          (t = l(t) || 0),
          (0, r.default)(n) &&
            ((g = !!n.leading),
            (a = (_ = 'maxWait' in n) ? p(l(n.maxWait) || 0, t) : a),
            (v = 'trailing' in n ? !!n.trailing : v)),
          (k.cancel = function () {
            void 0 !== d && clearTimeout(d), (f = 0), (o = c = i = d = void 0)
          }),
          (k.flush = function () {
            return void 0 === d ? s : x(u())
          }),
          k
        )
      }
    },
    72575: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e, t) {
        return e === t || (e != e && t != t)
      }
    },
    99097: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        return e
      }
    },
    53822: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => d })
      var r = n(28177),
        o = n(83527)
      const u = function (e) {
        return (0, o.default)(e) && '[object Arguments]' == (0, r.default)(e)
      }
      var i = Object.prototype,
        a = i.hasOwnProperty,
        s = i.propertyIsEnumerable
      const d = u(
        (function () {
          return arguments
        })(),
      )
        ? u
        : function (e) {
            return (0, o.default)(e) && a.call(e, 'callee') && !s.call(e, 'callee')
          }
    },
    54814: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = Array.isArray
    },
    29419: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(62942),
        o = n(67702)
      const u = function (e) {
        return null != e && (0, o.default)(e.length) && !(0, r.default)(e)
      }
    },
    25247: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => s })
      var r = n(78160)
      const o = function () {
        return !1
      }
      e = n.hmd(e)
      var u = 'object' == typeof exports && exports && !exports.nodeType && exports,
        i = u && e && !e.nodeType && e,
        a = i && i.exports === u ? r.default.Buffer : void 0
      const s = (a ? a.isBuffer : void 0) || o
    },
    38651: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => l })
      var r = n(7492),
        o = n(17873),
        u = n(53822),
        i = n(54814),
        a = n(29419),
        s = n(25247),
        d = n(43744),
        c = n(54744),
        f = Object.prototype.hasOwnProperty
      const l = function (e) {
        if (null == e) return !0
        if (
          (0, a.default)(e) &&
          ((0, i.default)(e) ||
            'string' == typeof e ||
            'function' == typeof e.splice ||
            (0, s.default)(e) ||
            (0, c.default)(e) ||
            (0, u.default)(e))
        )
          return !e.length
        var t = (0, o.default)(e)
        if ('[object Map]' == t || '[object Set]' == t) return !e.size
        if ((0, d.default)(e)) return !(0, r.default)(e).length
        for (var n in e) if (f.call(e, n)) return !1
        return !0
      }
    },
    16230: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => o })
      var r = n(96425)
      const o = function (e, t) {
        return (0, r.default)(e, t)
      }
    },
    62942: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(28177),
        o = n(98279)
      const u = function (e) {
        if (!(0, o.default)(e)) return !1
        var t = (0, r.default)(e)
        return (
          '[object Function]' == t ||
          '[object GeneratorFunction]' == t ||
          '[object AsyncFunction]' == t ||
          '[object Proxy]' == t
        )
      }
    },
    67702: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        return 'number' == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991
      }
    },
    77973: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        return null === e
      }
    },
    3308: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(28177),
        o = n(83527)
      const u = function (e) {
        return 'number' == typeof e || ((0, o.default)(e) && '[object Number]' == (0, r.default)(e))
      }
    },
    98279: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        var t = typeof e
        return null != e && ('object' == t || 'function' == t)
      }
    },
    83527: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function (e) {
        return null != e && 'object' == typeof e
      }
    },
    8875: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(28177),
        o = n(83527)
      const u = function (e) {
        return 'symbol' == typeof e || ((0, o.default)(e) && '[object Symbol]' == (0, r.default)(e))
      }
    },
    54744: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => f })
      var r = n(28177),
        o = n(67702),
        u = n(83527),
        i = {}
      ;(i['[object Float32Array]'] =
        i['[object Float64Array]'] =
        i['[object Int8Array]'] =
        i['[object Int16Array]'] =
        i['[object Int32Array]'] =
        i['[object Uint8Array]'] =
        i['[object Uint8ClampedArray]'] =
        i['[object Uint16Array]'] =
        i['[object Uint32Array]'] =
          !0),
        (i['[object Arguments]'] =
          i['[object Array]'] =
          i['[object ArrayBuffer]'] =
          i['[object Boolean]'] =
          i['[object DataView]'] =
          i['[object Date]'] =
          i['[object Error]'] =
          i['[object Function]'] =
          i['[object Map]'] =
          i['[object Number]'] =
          i['[object Object]'] =
          i['[object RegExp]'] =
          i['[object Set]'] =
          i['[object String]'] =
          i['[object WeakMap]'] =
            !1)
      const a = function (e) {
        return (0, u.default)(e) && (0, o.default)(e.length) && !!i[(0, r.default)(e)]
      }
      var s = n(95256),
        d = n(59283),
        c = d.default && d.default.isTypedArray
      const f = c ? (0, s.default)(c) : a
    },
    33358: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => i })
      var r = n(31468),
        o = n(7492),
        u = n(29419)
      const i = function (e) {
        return (0, u.default)(e) ? (0, r.default)(e) : (0, o.default)(e)
      }
    },
    64162: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => c })
      var r = n(31468),
        o = n(98279),
        u = n(43744)
      const i = function (e) {
        var t = []
        if (null != e) for (var n in Object(e)) t.push(n)
        return t
      }
      var a = Object.prototype.hasOwnProperty
      const s = function (e) {
        if (!(0, o.default)(e)) return i(e)
        var t = (0, u.default)(e),
          n = []
        for (var r in e) ('constructor' != r || (!t && a.call(e, r))) && n.push(r)
        return n
      }
      var d = n(29419)
      const c = function (e) {
        return (0, d.default)(e) ? (0, r.default)(e, !0) : s(e)
      }
    },
    58121: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => K })
      var r = n(96335),
        o = n(24402),
        u = n(72575)
      const i = function (e, t, n) {
        ;((void 0 !== n && !(0, u.default)(e[t], n)) || (void 0 === n && !(t in e))) && (0, o.default)(e, t, n)
      }
      var a = n(29718),
        s = n(57508),
        d = n(39895),
        c = n(58555),
        f = n(52222),
        l = n(53822),
        p = n(54814),
        h = n(29419),
        g = n(83527)
      const _ = function (e) {
        return (0, g.default)(e) && (0, h.default)(e)
      }
      var v = n(25247),
        b = n(62942),
        y = n(98279),
        m = n(28177),
        w = n(56838),
        x = Function.prototype,
        k = Object.prototype,
        j = x.toString,
        O = k.hasOwnProperty,
        S = j.call(Object)
      const L = function (e) {
        if (!(0, g.default)(e) || '[object Object]' != (0, m.default)(e)) return !1
        var t = (0, w.default)(e)
        if (null === t) return !0
        var n = O.call(t, 'constructor') && t.constructor
        return 'function' == typeof n && n instanceof n && j.call(n) == S
      }
      var P = n(54744)
      const A = function (e, t) {
        if (('constructor' !== t || 'function' != typeof e[t]) && '__proto__' != t) return e[t]
      }
      var E = n(75969),
        N = n(64162)
      const C = function (e) {
        return (0, E.default)(e, (0, N.default)(e))
      }
      const R = function (e, t, n, r, o, u, a) {
        var h = A(e, n),
          g = A(t, n),
          m = a.get(g)
        if (m) i(e, n, m)
        else {
          var w = u ? u(h, g, n + '', e, t, a) : void 0,
            x = void 0 === w
          if (x) {
            var k = (0, p.default)(g),
              j = !k && (0, v.default)(g),
              O = !k && !j && (0, P.default)(g)
            ;(w = g),
              k || j || O
                ? (0, p.default)(h)
                  ? (w = h)
                  : _(h)
                  ? (w = (0, c.default)(h))
                  : j
                  ? ((x = !1), (w = (0, s.default)(g, !0)))
                  : O
                  ? ((x = !1), (w = (0, d.default)(g, !0)))
                  : (w = [])
                : L(g) || (0, l.default)(g)
                ? ((w = h),
                  (0, l.default)(h) ? (w = C(h)) : ((0, y.default)(h) && !(0, b.default)(h)) || (w = (0, f.default)(g)))
                : (x = !1)
          }
          x && (a.set(g, w), o(w, g, r, u, a), a.delete(g)), i(e, n, w)
        }
      }
      const T = function e(t, n, o, u, s) {
        t !== n &&
          (0, a.default)(
            n,
            function (a, d) {
              if ((s || (s = new r.default()), (0, y.default)(a))) R(t, n, d, o, e, u, s)
              else {
                var c = u ? u(A(t, d), a, d + '', t, n, s) : void 0
                void 0 === c && (c = a), i(t, d, c)
              }
            },
            N.default,
          )
      }
      var I = n(99097)
      const M = function (e, t, n) {
        switch (n.length) {
          case 0:
            return e.call(t)
          case 1:
            return e.call(t, n[0])
          case 2:
            return e.call(t, n[0], n[1])
          case 3:
            return e.call(t, n[0], n[1], n[2])
        }
        return e.apply(t, n)
      }
      var F = Math.max
      const z = function (e, t, n) {
        return (
          (t = F(void 0 === t ? e.length - 1 : t, 0)),
          function () {
            for (var r = arguments, o = -1, u = F(r.length - t, 0), i = Array(u); ++o < u; ) i[o] = r[t + o]
            o = -1
            for (var a = Array(t + 1); ++o < t; ) a[o] = r[o]
            return (a[t] = n(i)), M(e, this, a)
          }
        )
      }
      const V = function (e) {
        return function () {
          return e
        }
      }
      var D = n(76780)
      const B = D.default
        ? function (e, t) {
            return (0, D.default)(e, 'toString', { configurable: !0, enumerable: !1, value: V(t), writable: !0 })
          }
        : I.default
      var $ = Date.now
      const q = (function (e) {
        var t = 0,
          n = 0
        return function () {
          var r = $(),
            o = 16 - (r - n)
          if (((n = r), o > 0)) {
            if (++t >= 800) return arguments[0]
          } else t = 0
          return e.apply(void 0, arguments)
        }
      })(B)
      const U = function (e, t) {
        return q(z(e, t, I.default), e + '')
      }
      var H = n(17104)
      const W = function (e, t, n) {
        if (!(0, y.default)(n)) return !1
        var r = typeof t
        return (
          !!('number' == r ? (0, h.default)(n) && (0, H.default)(t, n.length) : 'string' == r && t in n) &&
          (0, u.default)(n[t], e)
        )
      }
      const K = (function (e) {
        return U(function (t, n) {
          var r = -1,
            o = n.length,
            u = o > 1 ? n[o - 1] : void 0,
            i = o > 2 ? n[2] : void 0
          for (
            u = e.length > 3 && 'function' == typeof u ? (o--, u) : void 0,
              i && W(n[0], n[1], i) && ((u = o < 3 ? void 0 : u), (o = 1)),
              t = Object(t);
            ++r < o;

          ) {
            var a = n[r]
            a && e(t, a, r, u)
          }
          return t
        })
      })(function (e, t, n) {
        T(e, t, n)
      })
    },
    99094: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => M })
      const r = function (e, t, n, r) {
        var o = -1,
          u = null == e ? 0 : e.length
        for (r && u && (n = e[++o]); ++o < u; ) n = t(n, e[o], o, e)
        return n
      }
      var o = n(29718),
        u = n(33358)
      const i = function (e, t) {
        return e && (0, o.default)(e, t, u.default)
      }
      var a = n(29419)
      const s = (function (e, t) {
        return function (n, r) {
          if (null == n) return n
          if (!(0, a.default)(n)) return e(n, r)
          for (var o = n.length, u = t ? o : -1, i = Object(n); (t ? u-- : ++u < o) && !1 !== r(i[u], u, i); );
          return n
        }
      })(i)
      var d = n(96335),
        c = n(96425)
      const f = function (e, t, n, r) {
        var o = n.length,
          u = o,
          i = !r
        if (null == e) return !u
        for (e = Object(e); o--; ) {
          var a = n[o]
          if (i && a[2] ? a[1] !== e[a[0]] : !(a[0] in e)) return !1
        }
        for (; ++o < u; ) {
          var s = (a = n[o])[0],
            f = e[s],
            l = a[1]
          if (i && a[2]) {
            if (void 0 === f && !(s in e)) return !1
          } else {
            var p = new d.default()
            if (r) var h = r(f, l, s, e, t, p)
            if (!(void 0 === h ? (0, c.default)(l, f, 3, r, p) : h)) return !1
          }
        }
        return !0
      }
      var l = n(98279)
      const p = function (e) {
        return e == e && !(0, l.default)(e)
      }
      const h = function (e) {
        for (var t = (0, u.default)(e), n = t.length; n--; ) {
          var r = t[n],
            o = e[r]
          t[n] = [r, o, p(o)]
        }
        return t
      }
      const g = function (e, t) {
        return function (n) {
          return null != n && n[e] === t && (void 0 !== t || e in Object(n))
        }
      }
      const _ = function (e) {
        var t = h(e)
        return 1 == t.length && t[0][2]
          ? g(t[0][0], t[0][1])
          : function (n) {
              return n === e || f(n, e, t)
            }
      }
      var v = n(80838)
      const b = function (e, t, n) {
        var r = null == e ? void 0 : (0, v.default)(e, t)
        return void 0 === r ? n : r
      }
      const y = function (e, t) {
        return null != e && t in Object(e)
      }
      var m = n(54136),
        w = n(53822),
        x = n(54814),
        k = n(17104),
        j = n(67702),
        O = n(87844)
      const S = function (e, t, n) {
        for (var r = -1, o = (t = (0, m.default)(t, e)).length, u = !1; ++r < o; ) {
          var i = (0, O.default)(t[r])
          if (!(u = null != e && n(e, i))) break
          e = e[i]
        }
        return u || ++r != o
          ? u
          : !!(o = null == e ? 0 : e.length) &&
              (0, j.default)(o) &&
              (0, k.default)(i, o) &&
              ((0, x.default)(e) || (0, w.default)(e))
      }
      const L = function (e, t) {
        return null != e && S(e, t, y)
      }
      var P = n(73204)
      const A = function (e, t) {
        return (0, P.default)(e) && p(t)
          ? g((0, O.default)(e), t)
          : function (n) {
              var r = b(n, e)
              return void 0 === r && r === t ? L(n, e) : (0, c.default)(t, r, 3)
            }
      }
      var E = n(99097)
      const N = function (e) {
        return function (t) {
          return null == t ? void 0 : t[e]
        }
      }
      const C = function (e) {
        return function (t) {
          return (0, v.default)(t, e)
        }
      }
      const R = function (e) {
        return (0, P.default)(e) ? N((0, O.default)(e)) : C(e)
      }
      const T = function (e) {
        return 'function' == typeof e
          ? e
          : null == e
          ? E.default
          : 'object' == typeof e
          ? (0, x.default)(e)
            ? A(e[0], e[1])
            : _(e)
          : R(e)
      }
      const I = function (e, t, n, r, o) {
        return (
          o(e, function (e, o, u) {
            n = r ? ((r = !1), e) : t(n, e, o, u)
          }),
          n
        )
      }
      const M = function (e, t, n) {
        var o = (0, x.default)(e) ? r : I,
          u = arguments.length < 3
        return o(e, T(t, 4), n, u, s)
      }
    },
    35987: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = function () {
        return []
      }
    },
    43370: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => u })
      var r = n(4889),
        o = n(98279)
      const u = function (e, t, n) {
        var u = !0,
          i = !0
        if ('function' != typeof e) throw new TypeError('Expected a function')
        return (
          (0, o.default)(n) && ((u = 'leading' in n ? !!n.leading : u), (i = 'trailing' in n ? !!n.trailing : i)),
          (0, r.default)(e, t, { leading: u, maxWait: t, trailing: i })
        )
      }
    },
    15736: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => c })
      var r = n(54136)
      const o = function (e) {
        var t = null == e ? 0 : e.length
        return t ? e[t - 1] : void 0
      }
      var u = n(80838)
      const i = function (e, t, n) {
        var r = -1,
          o = e.length
        t < 0 && (t = -t > o ? 0 : o + t),
          (n = n > o ? o : n) < 0 && (n += o),
          (o = t > n ? 0 : (n - t) >>> 0),
          (t >>>= 0)
        for (var u = Array(o); ++r < o; ) u[r] = e[r + t]
        return u
      }
      const a = function (e, t) {
        return t.length < 2 ? e : (0, u.default)(e, i(t, 0, -1))
      }
      var s = n(87844)
      const d = function (e, t) {
        return (t = (0, r.default)(t, e)), null == (e = a(e, t)) || delete e[(0, s.default)(o(t))]
      }
      const c = function (e, t) {
        return null == e || d(e, t)
      }
    },
    64531: (e, t) => {
      'use strict'
      var n,
        r = !('undefined' == typeof window || !window.document || !window.document.createElement)
      function o() {
        if (n) return n
        if (!r || !window.document.body) return 'indeterminate'
        var e = window.document.createElement('div')
        return (
          e.appendChild(document.createTextNode('ABCD')),
          (e.dir = 'rtl'),
          (e.style.fontSize = '14px'),
          (e.style.width = '4px'),
          (e.style.height = '1px'),
          (e.style.position = 'absolute'),
          (e.style.top = '-1000px'),
          (e.style.overflow = 'scroll'),
          document.body.appendChild(e),
          (n = 'reverse'),
          e.scrollLeft > 0 ? (n = 'default') : ((e.scrollLeft = 1), 0 === e.scrollLeft && (n = 'negative')),
          document.body.removeChild(e),
          n
        )
      }
      ;(t.detectScrollType = o),
        (t.getNormalizedScrollLeft = function (e, t) {
          var n = e.scrollLeft
          if ('rtl' !== t) return n
          var r = o()
          if ('indeterminate' === r) return Number.NaN
          switch (r) {
            case 'negative':
              return e.scrollWidth - e.clientWidth + n
            case 'reverse':
              return e.scrollWidth - e.clientWidth - n
          }
          return n
        })
    },
    67337: (e, t, n) => {
      'use strict'
      n.r(t),
        n.d(t, { disable: () => f, enable: () => c, enabled: () => s, getAllFeatures: () => l, setEnabled: () => d })
      const r = JSON.parse(
        '{"14851":{},"custom_items_in_context_menu":{},"countdown":{},"symbol_search_parser_mixin":{},"pay_attention_to_ticker_not_symbol":{},"graying_disabled_tools_enabled":{},"update_study_formatter_on_symbol_resolve":{},"constraint_dialogs_movement":{},"phone_verification":{},"show_trading_notifications_history":{},"show_interval_dialog_on_key_press":{},"header_interval_dialog_button":{"subsets":["show_interval_dialog_on_key_press"]},"header_fullscreen_button":{},"header_symbol_search":{},"symbol_search_hot_key":{},"header_resolutions":{"subsets":["header_interval_dialog_button"]},"header_chart_type":{},"header_settings":{},"header_indicators":{},"header_compare":{},"header_undo_redo":{},"header_screenshot":{},"header_saveload":{},"study_on_study":{},"scales_date_format":{},"header_widget":{"subsets":["header_widget_dom_node","header_symbol_search","header_resolutions","header_chart_type","header_settings","header_indicators","header_compare","header_undo_redo","header_fullscreen_button","compare_symbol","header_screenshot"]},"legend_widget":{},"compare_symbol":{"subsets":["header_compare"]},"property_pages":{"subsets":["show_chart_property_page","chart_property_page"]},"show_chart_property_page":{},"chart_property_page":{"subsets":["chart_property_page_scales","chart_property_page_trading","chart_property_page_right_margin_editor"]},"left_toolbar":{},"hide_left_toolbar_by_default":{},"control_bar":{},"widget_logo":{},"timeframes_toolbar":{},"edit_buttons_in_legend":{"subsets":["show_hide_button_in_legend","format_button_in_legend","study_buttons_in_legend","delete_button_in_legend"]},"show_hide_button_in_legend":{},"object_tree_legend_mode":{},"format_button_in_legend":{},"study_buttons_in_legend":{},"delete_button_in_legend":{},"broker_button":{},"buy_sell_buttons":{"subsets":["broker_button"]},"pane_context_menu":{},"scales_context_menu":{},"legend_context_menu":{},"context_menus":{"subsets":["pane_context_menu","scales_context_menu","legend_context_menu","objects_tree_context_menu"]},"items_favoriting":{},"save_chart_properties_to_local_storage":{},"use_localstorage_for_settings":{"subsets":["items_favoriting","save_chart_properties_to_local_storage"]},"handle_scale":{"subsets":["mouse_wheel_scale","pinch_scale","axis_pressed_mouse_move_scale"]},"handle_scroll":{"subsets":["mouse_wheel_scroll","pressed_mouse_move_scroll","horz_touch_drag_scroll","vert_touch_drag_scroll"]},"plain_studymarket":{},"disable_resolution_rebuild":{},"border_around_the_chart":{},"charting_library_debug_mode":{},"saveload_requires_authentication":{},"saveload_storage_customization":{},"volume_force_overlay":{},"create_volume_indicator_by_default":{},"create_volume_indicator_by_default_once":{},"saved_charts_count_restriction":{},"lean_chart_load":{},"stop_study_on_restart":{},"star_some_intervals_by_default":{},"move_logo_to_main_pane":{},"show_animated_logo":{},"link_to_tradingview":{},"logo_without_link":{},"right_bar_stays_on_scroll":{},"chart_content_overrides_by_defaults":{},"snapshot_trading_drawings":{},"allow_supported_resolutions_set_only":{},"widgetbar_tabs":{"subsets":["right_toolbar"]},"show_object_tree":{"subsets":["right_toolbar"]},"dome_widget":{"subsets":["right_toolbar","showdom_button"]},"dom_widget":{"subsets":["right_toolbar","showdom_button"]},"collapsible_header":{},"study_templates":{},"side_toolbar_in_fullscreen_mode":{},"header_in_fullscreen_mode":{},"remove_library_container_border":{},"whotrades_auth_only":{},"support_multicharts":{},"display_market_status":{},"display_data_mode":{},"datasource_copypaste":{},"drawing_templates":{"subsets":["linetoolpropertieswidget_template_button"]},"expand_symbolsearch_items":{},"symbol_search_three_columns_exchanges":{},"symbol_search_flags":{},"symbol_search_limited_exchanges":{},"bugreport_button":{"subsets":["right_toolbar"]},"footer_publish_idea_button":{},"showdom_button":{"subsets":["right_toolbar"]},"text_notes":{},"show_source_code":{},"symbol_info":{},"no_bars_status":{},"clear_bars_on_series_error":{},"hide_loading_screen_on_series_error":{},"seconds_resolution":{},"dont_show_boolean_study_arguments":{},"hide_last_na_study_output":{},"price_scale_always_last_bar_value":{},"study_dialog_fundamentals_economy_addons":{},"uppercase_instrument_names":{},"trading_notifications":{},"chart_crosshair_menu":{},"japanese_chart_styles":{},"hide_series_legend_item":{},"hide_study_overlay_legend_item":{},"hide_study_compare_legend_item":{},"linetoolpropertieswidget_template_button":{},"use_overrides_for_overlay":{},"timezone_menu":{},"main_series_scale_menu":{},"show_login_dialog":{},"remove_img_from_rss":{},"bars_marks":{},"chart_scroll":{},"chart_zoom":{},"source_selection_markers":{},"low_density_bars":{},"end_of_period_timescale_marks":{},"open_account_manager":{},"show_order_panel_on_start":{},"order_panel":{"subsets":["order_panel_close_button","order_panel_undock","right_toolbar","order_info"]},"multiple_watchlists":{},"watchlist_import_export":{},"study_overlay_compare_legend_option":{},"custom_resolutions":{},"referral_program_for_widget_owners":{},"mobile_trading":{},"real_brokers":{},"no_min_chart_width":{},"lock_visible_time_range_on_resize":{},"pricescale_currency":{},"cropped_tick_marks":{},"trading_account_manager":{},"disable_sameinterval_aligning":{},"display_legend_on_all_charts":{},"chart_style_hilo":{},"pricescale_unit":{},"show_spread_operators":{},"hide_exponentiation_spread_operator":{},"hide_reciprocal_spread_operator":{},"compare_symbol_search_spread_operators":{},"studies_symbol_search_spread_operators":{},"hide_resolution_in_legend":{},"hide_unresolved_symbols_in_legend":{},"fix_left_edge":{},"study_symbol_ticker_description":{},"two_character_bar_marks_labels":{},"tick_resolution":{},"secondary_series_extend_time_scale":{},"hide_volume_ma":{},"small_no_display":{},"charting_library_single_symbol_request":{},"use_ticker_on_symbol_info_update":{},"show_zoom_and_move_buttons_on_touch":{},"hide_main_series_symbol_from_indicator_legend":{},"chart_hide_close_position_button":{},"chart_hide_close_order_button":{},"hide_price_scale_global_last_bar_value":{},"keep_object_tree_widget_in_right_toolbar":{},"show_average_close_price_line_and_label":{},"hide_image_invalid_symbol":{},"hide_object_tree_and_price_scale_exchange_label":{},"confirm_overwrite_if_chart_layout_with_name_exists":{},"use_na_string_for_not_available_values":{},"show_last_price_and_change_only_in_series_legend":{},"show_context_menu_in_crosshair_if_only_one_item":{},"tv_production":{"subsets":["auto_enable_symbol_labels","symbol_search_parser_mixin","header_fullscreen_button","header_widget","dont_show_boolean_study_arguments","left_toolbar","buy_sell_buttons","control_bar","symbol_search_hot_key","context_menus","edit_buttons_in_legend","object_tree_legend_mode","uppercase_instrument_names","use_localstorage_for_settings","saveload_requires_authentication","volume_force_overlay","saved_charts_count_restriction","create_volume_indicator_by_default","create_volume_indicator_by_default_once","charts_auto_save","save_old_chart_before_save_as","chart_content_overrides_by_defaults","alerts","header_saveload","header_layouttoggle","datasource_copypaste","show_saved_watchlists","watchlists_from_to_file","add_to_watchlist","property_pages","support_multicharts","display_market_status","display_data_mode","show_chart_warn_message","support_manage_drawings","widgetbar_tabs","study_templates","collapsible_header","drawing_templates","footer_publish_idea_button","text_notes","show_source_code","symbol_info","linetoolpropertieswidget_template_button","trading_notifications","symbol_search_three_columns_exchanges","symbol_search_flags","symbol_search_limited_exchanges","phone_verification","chart_events","custom_resolutions","compare_symbol","study_on_study","japanese_chart_styles","show_login_dialog","dome_widget","dom_widget","bars_marks","chart_scroll","chart_zoom","show_trading_notifications_history","source_selection_markers","study_dialog_fundamentals_economy_addons","multiple_watchlists","marked_symbols","order_panel","pricescale_currency","show_animated_logo","pricescale_currency","show_object_tree","watchlist_import_export","scales_date_format","popup_hints","show_right_widgets_panel_by_default","compare_recent_symbols_enabled","adaptive_trading_sources"]},"widget":{"subsets":["auto_enable_symbol_labels","symbol_search_parser_mixin","uppercase_instrument_names","left_toolbar","control_bar","symbol_search_hot_key","context_menus","edit_buttons_in_legend","object_tree_legend_mode","use_localstorage_for_settings","saveload_requires_authentication","volume_force_overlay","create_volume_indicator_by_default","create_volume_indicator_by_default_once","dont_show_boolean_study_arguments","header_widget_dom_node","header_symbol_search","header_resolutions","header_chart_type","header_compare","header_indicators","star_some_intervals_by_default","display_market_status","display_data_mode","show_chart_warn_message","symbol_info","linetoolpropertieswidget_template_button","symbol_search_three_columns_exchanges","symbol_search_flags","symbol_search_limited_exchanges","widgetbar_tabs","compare_symbol","show_login_dialog","plain_studymarket","japanese_chart_styles","bars_marks","chart_scroll","chart_zoom","source_selection_markers","property_pages","show_right_widgets_panel_by_default"]},"bovespa_widget":{"subsets":["widget","header_settings","linetoolpropertieswidget_template_button","compare_recent_symbols_enabled"]},"charting_library_base":{"subsets":["14851","allow_supported_resolutions_set_only","auto_enable_symbol_labels","border_around_the_chart","collapsible_header","constraint_dialogs_movement","context_menus","control_bar","create_volume_indicator_by_default","custom_items_in_context_menu","datasource_copypaste","uppercase_instrument_names","display_market_status","edit_buttons_in_legend","object_tree_legend_mode","graying_disabled_tools_enabled","header_widget","legend_widget","header_saveload","dont_show_boolean_study_arguments","lean_chart_load","left_toolbar","link_to_tradingview","pay_attention_to_ticker_not_symbol","plain_studymarket","refresh_saved_charts_list_on_dialog_show","right_bar_stays_on_scroll","saveload_storage_customization","stop_study_on_restart","timeframes_toolbar","symbol_search_hot_key","update_study_formatter_on_symbol_resolve","update_timeframes_set_on_symbol_resolve","use_localstorage_for_settings","volume_force_overlay","widget_logo","countdown","use_overrides_for_overlay","trading_notifications","compare_symbol","symbol_info","timezone_menu","main_series_scale_menu","create_volume_indicator_by_default_once","bars_marks","chart_scroll","chart_zoom","source_selection_markers","property_pages","go_to_date","adaptive_logo","show_animated_logo","handle_scale","handle_scroll","shift_visible_range_on_new_bar","chart_content_overrides_by_defaults","cropped_tick_marks","scales_date_format","popup_hints","save_shortcut","show_right_widgets_panel_by_default","show_object_tree","insert_indicator_dialog_shortcut","compare_recent_symbols_enabled","hide_main_series_symbol_from_indicator_legend"]},"charting_library":{"subsets":["charting_library_base"]},"static_charts_service":{"subsets":["charting_library","disable_resolution_rebuild"]},"trading_terminal":{"subsets":["charting_library_base","showdom_button","support_multicharts","header_layouttoggle","japanese_chart_styles","chart_property_page_trading","add_to_watchlist","open_account_manager","show_dom_first_time","order_panel","buy_sell_buttons","multiple_watchlists","show_trading_notifications_history","always_pass_called_order_to_modify","show_object_tree","watchlist_import_export","drawing_templates","trading_account_manager","chart_crosshair_menu","compare_recent_symbols_enabled","adaptive_trading_sources"]}}',
      )
      var o = n.t(r, 2)
      const u = new Map(),
        i = new Map(),
        a = new Set()
      function s(e) {
        const t = u.get(e)
        if (void 0 !== t) return t
        const n = i.get(e)
        return !!n && n.some(s)
      }
      function d(e, t) {
        u.set(String(e), Boolean(t))
      }
      function c(e) {
        d(e, !0)
      }
      function f(e) {
        d(e, !1)
      }
      function l() {
        const e = Object.create(null)
        for (const t of a) e[t] = s(t)
        return e
      }
      !(function () {
        for (const [e, t] of Object.entries(o))
          if ((a.add(e), 'subsets' in t))
            for (const n of t.subsets) {
              a.add(n)
              let t = i.get(n)
              void 0 === t && ((t = []), i.set(n, t)), t.push(e)
            }
        'object' == typeof __initialDisabledFeaturesets &&
          Array.isArray(__initialDisabledFeaturesets) &&
          __initialDisabledFeaturesets.forEach(f),
          'object' == typeof __initialEnabledFeaturesets &&
            Array.isArray(__initialEnabledFeaturesets) &&
            __initialEnabledFeaturesets.forEach(c)
      })()
    },
    80643: function (e, t, n) {
      var r
      e = n.nmd(e)
      var o =
          Array.isArray ||
          function (e) {
            return '[object Array]' === Object.prototype.toString.call(e)
          },
        u = function (e) {
          return 'object' == typeof e && null !== e
        }
      function i(e) {
        return 'number' == typeof e && isFinite(e)
      }
      function a(e) {
        return null != e && e.constructor === Function
      }
      function s(e, t) {
        e.prototype = Object.create(t.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
        })
      }
      'undefined' != typeof window
        ? ((r = window.TradingView = window.TradingView || {}),
          (window.isNumber = i),
          (window.isFunction = a),
          (window.inherit = s),
          (window.isArray = o))
        : (r = this.TradingView = this.TradingView || {}),
        (r.isNaN = function (e) {
          return !(e <= 0 || e > 0)
        }),
        (r.isAbsent = function (e) {
          return null == e
        }),
        (r.isExistent = function (e) {
          return null != e
        }),
        (Number.isNaN =
          Number.isNaN ||
          function (e) {
            return e != e
          }),
        (r.isSameType = function (e, t) {
          return Number.isNaN(e) || Number.isNaN(t)
            ? Number.isNaN(e) === Number.isNaN(t)
            : {}.toString.call(e) === {}.toString.call(t)
        }),
        (r.isInteger = function (e) {
          return 'number' == typeof e && e % 1 == 0
        }),
        (r.parseBool = function (e) {
          return !0 === e || 'true' === e
        }),
        (r.isBoolean = function (e) {
          return !0 === e || !1 === e
        }),
        (r.isString = function (e) {
          return null != e && e.constructor === String
        }),
        (r.isInherited = function (e, t) {
          if (null == e || null == e.prototype)
            throw new TypeError('isInherited: child should be a constructor function')
          if (null == t || null == t.prototype)
            throw new TypeError('isInherited: parent should be a constructor function')
          return e.prototype instanceof t || e.prototype === t.prototype
        }),
        (r.TypeValidator = function (e) {
          this.m_type = e
        }),
        (r.TypeValidator.prototype.check = function (e) {
          return e.constructor === this.m_type || r.isInherited(e.constructor, this.m_type)
        }),
        (r.PredicateValidator = function (e) {
          this.m_predicate = e
        }),
        (r.PredicateValidator.prototype.check = function (e) {
          return this.m_predicate(e)
        }),
        (r.clone = function (e) {
          if (!e || 'object' != typeof e) return e
          var t, n, o
          for (n in ((t = 'function' == typeof e.pop ? [] : {}), e))
            e.hasOwnProperty(n) && ((o = e[n]), (t[n] = o && 'object' == typeof o ? r.clone(o) : o))
          return t
        }),
        (r.deepEquals = function (e, t, n) {
          if ((n || (n = ''), e === t)) return [!0, n]
          if ((a(e) && (e = void 0), a(t) && (t = void 0), void 0 === e && void 0 !== t)) return [!1, n]
          if (void 0 === t && void 0 !== e) return [!1, n]
          if (null === e && null !== t) return [!1, n]
          if (null === t && null !== e) return [!1, n]
          if ('object' != typeof e && 'object' != typeof t) return [e === t, n]
          if (Array.isArray(e) && Array.isArray(t)) {
            var u = e.length
            if (u !== t.length) return [!1, n]
            for (var i = 0; i < u; i++) {
              if (!(d = r.deepEquals(e[i], t[i], n + '[' + i + ']'))[0]) return d
            }
            return [!0, n]
          }
          if (o(e) || o(t)) return [!1, n]
          if (Object.keys(e).length !== Object.keys(t).length) return [!1, n]
          for (var s in e) {
            var d
            if (!(d = r.deepEquals(e[s], t[s], n + '[' + s + ']'))[0]) return d
          }
          return [!0, n]
        }),
        (r.merge = function (e, t) {
          for (var n in t)
            null !== t[n] && 'object' == typeof t[n] && e.hasOwnProperty(n) ? r.merge(e[n], t[n]) : (e[n] = t[n])
          return e
        }),
        (r.mergeObj = function (e, t) {
          for (var n in t) t[n].constructor === Object && e.hasOwnProperty(n) ? r.mergeObj(e[n], t[n]) : (e[n] = t[n])
          return e
        }),
        (r.mergeWithRules = function (e, t, n, o) {
          for (var u in t) {
            var i = o ? o + '.' + u : u
            n && i in n
              ? (e[u] = n[i](e[u], t[u]))
              : 'object' == typeof t[u] && e.hasOwnProperty(u)
              ? r.merge(e[u], t[u], n, i)
              : (e[u] = t[u])
          }
        }),
        (r.sortMultipleFunction = function () {
          var e = [].slice.call(arguments),
            t = e.length
          return function (n, r) {
            var o, u, i, a, s, d, c
            for (
              c = 0;
              c < t &&
              ((d = 0),
              (o = n[(a = 'string' == typeof (i = e[c]) ? i : i.name)]),
              (u = r[a]),
              'function' == typeof i.fn && ((o = i.fn(o)), (u = i.fn(u))),
              (s = i.reverse ? -1 : 1),
              o < u && (d = -1 * s),
              o > u && (d = 1 * s),
              0 === d);
              c++
            );
            return d
          }
        }),
        e &&
          e.exports &&
          (e.exports = {
            inherit: s,
            clone: r.clone,
            merge: r.merge,
            isNumber: i,
            isInteger: r.isInteger,
            isBoolean: r.isBoolean,
            isString: r.isString,
            isObject: u,
            isHashObject: function (e) {
              return u(e) && -1 !== e.constructor.toString().indexOf('function Object')
            },
            isPromise: function (e) {
              return u(e) && e.then
            },
            isNaN: r.isNaN,
            isAbsent: r.isAbsent,
            isExistent: r.isExistent,
            isSameType: r.isSameType,
            isArray: o,
            isFunction: a,
            parseBool: r.parseBool,
            deepEquals: r.deepEquals,
            notNull: function (e) {
              return null !== e
            },
            notUndefined: function (e) {
              return void 0 !== e
            },
            declareClassAsPureInterface: function (e, t) {
              for (var n in e.prototype)
                'function' == typeof e.prototype[n] &&
                  e.prototype.hasOwnProperty(n) &&
                  (e.prototype[n] = function () {
                    throw new Error(
                      t + '::' + n + ' is an interface member declaration and must be overloaded in order to be called',
                    )
                  })
            },
            requireFullInterfaceImplementation: function (e, t, n, r) {
              for (var o in n.prototype)
                if ('function' == typeof n.prototype[o] && !e.prototype[o])
                  throw new Error(
                    'Interface implementation assertion failed: ' +
                      t +
                      ' does not implement ' +
                      r +
                      '::' +
                      o +
                      ' function',
                  )
            },
          })
    },
    94419: (e, t, n) => {
      'use strict'
      n.r(t)
      var r = n(80643)
      const o = /{(\w+)}/g,
        u = /{(\d+)}/g
      String.prototype.format = function (...e) {
        const t = (0, r.isObject)(e[0]),
          n = t ? o : u,
          i = t
            ? (t, n) => {
                const r = e[0]
                return void 0 !== r[n] ? r[n] : t
              }
            : (t, n) => {
                const r = parseInt(n, 10),
                  o = e[r]
                return void 0 !== o ? o : t
              }
        return this.replace(n, i)
      }
    },
    9196: () => {
      'use strict'
      var e, t, n, r, o, u
      window.parent !== window &&
        window.CanvasRenderingContext2D &&
        window.TextMetrics &&
        (t = window.CanvasRenderingContext2D.prototype) &&
        t.hasOwnProperty('font') &&
        t.hasOwnProperty('mozTextStyle') &&
        'function' == typeof t.__lookupSetter__ &&
        (n = t.__lookupSetter__('font')) &&
        (t.__defineSetter__('font', function (e) {
          try {
            return n.call(this, e)
          } catch (e) {
            if ('NS_ERROR_FAILURE' !== e.name) throw e
          }
        }),
        (r = t.measureText),
        (e = function () {
          ;(this.width = 0), (this.isFake = !0), (this.__proto__ = window.TextMetrics.prototype)
        }),
        (t.measureText = function (t) {
          try {
            return r.apply(this, arguments)
          } catch (t) {
            if ('NS_ERROR_FAILURE' !== t.name) throw t
            return new e()
          }
        }),
        (o = t.fillText),
        (t.fillText = function (e, t, n, r) {
          try {
            o.apply(this, arguments)
          } catch (e) {
            if ('NS_ERROR_FAILURE' !== e.name) throw e
          }
        }),
        (u = t.strokeText),
        (t.strokeText = function (e, t, n, r) {
          try {
            u.apply(this, arguments)
          } catch (e) {
            if ('NS_ERROR_FAILURE' !== e.name) throw e
          }
        }))
    },
    32563: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { mobiletouch: () => o, touch: () => u, setClasses: () => i })
      const r = 'ontouchstart' in window,
        o = r && 'onorientationchange' in window,
        u = r || !!navigator.maxTouchPoints
      function i() {
        document.documentElement.classList.add(
          u ? 'feature-touch' : 'feature-no-touch',
          o ? 'feature-mobiletouch' : 'feature-no-mobiletouch',
        )
      }
    },
    49483: (e, t, n) => {
      'use strict'
      const { mobiletouch: r, touch: o } = n(32563)
      var u,
        i,
        a,
        s,
        d,
        c,
        f = (window.TradingView = window.TradingView || {}),
        l = window.chrome && window.chrome.runtime,
        p = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        h = /\sEdge\/\d\d\b/.test(navigator.userAgent),
        g =
          navigator.vendor &&
          navigator.vendor.indexOf('Apple') > -1 &&
          -1 === navigator.userAgent.indexOf('CriOS') &&
          -1 === navigator.userAgent.indexOf('FxiOS')
      ;(f.className = function (e) {
        for (var t in f) if (f[t] === e) return t
        return null
      }),
        (f.isMobile =
          ((u = /Android/i.test(navigator.userAgent)),
          (i = /BlackBerry/i.test(navigator.userAgent)),
          (a = /iPhone|iPad|iPod/.test(navigator.platform)),
          (s = /Opera Mini/i.test(navigator.userAgent)),
          (d = ('MacIntel' === navigator.platform && navigator.maxTouchPoints > 1) || /iPad/.test(navigator.platform)),
          (c = u || i || a || s),
          {
            Android: function () {
              return u
            },
            BlackBerry: function () {
              return i
            },
            iOS: function () {
              return a
            },
            Opera: function () {
              return s
            },
            isIPad: function () {
              return d
            },
            any: function () {
              return c
            },
          })),
        (f.supportTouch = function () {
          return r || o || f.isMobile.any()
        }),
        (f.onWidget = function () {
          for (
            var e = [
                '^widgetembed/?$',
                '^cmewidgetembed/?$',
                '^([0-9a-zA-Z-]+)/widgetembed/?$',
                '^([0-9a-zA-Z-]+)/widgetstatic/?$',
                '^([0-9a-zA-Z-]+)?/?miniwidgetembed/?$',
                '^([0-9a-zA-Z-]+)?/?mediumwidgetembed/?$',
                '^embed(-static)?/([0-9a-zA-Z]{8})/?$',
                '^widgetpopup/?$',
                '^extension/?$',
                '^chatwidgetembed/?$',
                '^ideaswidgetembed/?$',
                '^ideas-widget/?$',
                '^view-idea-widget/([0-9a-zA-Z]{8})/?$',
                '^embed-quotes-provider/?$',
                '^idea-popup/?$',
                '^hotlistswidgetembed/?$',
                '^([0-9a-zA-Z-]+)/hotlistswidgetembed/?$',
                '^marketoverviewwidgetembed/?$',
                '^([0-9a-zA-Z-]+)/marketoverviewwidgetembed/?$',
                '^eventswidgetembed/?$',
                '^tickerswidgetembed/?$',
                '^forexcrossrateswidgetembed/?$',
                '^forexheatmapwidgetembed/?$',
                '^marketquoteswidgetembed/?$',
                '^screenerwidget/?$',
                '^cryptomktscreenerwidget/?$',
                '^([0-9a-zA-Z-]+)/cryptomktscreenerwidget/?$',
                '^([0-9a-zA-Z-]+)/marketquoteswidgetembed/?$',
                '^technical-analysis-widget-embed/$',
                '^singlequotewidgetembed/?$',
                '^([0-9a-zA-Z-]+)/singlequotewidgetembed/?$',
                '^embed-widget/([0-9a-zA-Z-]+)/(([0-9a-zA-Z-]+)/)?$',
              ],
              t = window.location.pathname.replace(/^\//, ''),
              n = e.length - 1;
            n >= 0;
            n--
          )
            if (new RegExp(e[n]).test(t)) return !0
          return !1
        }),
        (f.onOrder = function () {
          return '/order/' === window.location.pathname
        }),
        (e.exports.isMac = function () {
          return /mac/i.test(navigator.platform)
        }),
        (e.exports.isWindows = function () {
          return /Win32|Win64/i.test(navigator.platform)
        }),
        (e.exports.isDesktopApp = function () {
          return /TVDesktop/i.test(navigator.userAgent)
        }),
        (e.exports.desktopAppVersion = function () {
          const e = navigator.userAgent.match(/TVDesktop\/([^\s]+)/)
          return e && e[1]
        }),
        (e.exports.CheckMobile = f.isMobile),
        (e.exports.onWidget = f.onWidget),
        (e.exports.supportTouch = f.supportTouch),
        (e.exports.checkPageType = function (e) {
          return new URLSearchParams(window.location.search).get('page_type') === e
        }),
        (e.exports.isChrome = l),
        (e.exports.isFF = p),
        (e.exports.isEdge = h),
        (e.exports.isSafari = g),
        (e.exports.onOrder = f.onOrder),
        (e.exports.className = f.className),
        (e.exports.onGoPro = function () {
          return '/gopro/' === window.location.pathname
        }),
        (e.exports.onMainPage = function () {
          return '/' === window.location.pathname
        })
    },
    28353: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { t: () => ne })
      const r = window
      function o(e) {
        window.t = e
      }
      function u(e) {
        r.$ || (r.$ = {}), (r.$.t = e)
      }
      const i = (e, t) => e
      function a(e) {
        return (a =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e
              }
            : function (e) {
                return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e
              })(e)
      }
      o(i), u(i)
      var s = n(77189)
      function d(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? Object(arguments[t]) : {},
            r = Object.keys(n)
          'function' == typeof Object.getOwnPropertySymbols &&
            r.push.apply(
              r,
              Object.getOwnPropertySymbols(n).filter(function (e) {
                return Object.getOwnPropertyDescriptor(n, e).enumerable
              }),
            ),
            r.forEach(function (t) {
              ;(0, s.default)(e, t, n[t])
            })
        }
        return e
      }
      function c(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
      }
      function f(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n]
          ;(r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r)
        }
      }
      function l(e, t, n) {
        return t && f(e.prototype, t), n && f(e, n), Object.defineProperty(e, 'prototype', { writable: !1 }), e
      }
      var p = n(75542)
      function h(e, t) {
        if (t && ('object' === a(t) || 'function' == typeof t)) return t
        if (void 0 !== t) throw new TypeError('Derived constructors may only return object or undefined')
        return (0, p.default)(e)
      }
      function g(e) {
        return (g = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (e) {
              return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
      }
      var _ = n(11430)
      function v(e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError('Super expression must either be null or a function')
        ;(e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } })),
          Object.defineProperty(e, 'prototype', { writable: !1 }),
          t && (0, _.default)(e, t)
      }
      var b = {
          type: 'logger',
          log: function (e) {
            this.output('log', e)
          },
          warn: function (e) {
            this.output('warn', e)
          },
          error: function (e) {
            this.output('error', e)
          },
          output: function (e, t) {
            console && console[e] && console[e].apply(console, t)
          },
        },
        y = new ((function () {
          function e(t) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
            c(this, e), this.init(t, n)
          }
          return (
            l(e, [
              {
                key: 'init',
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                  ;(this.prefix = t.prefix || 'i18next:'),
                    (this.logger = e || b),
                    (this.options = t),
                    (this.debug = t.debug)
                },
              },
              {
                key: 'setDebug',
                value: function (e) {
                  this.debug = e
                },
              },
              {
                key: 'log',
                value: function () {
                  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n]
                  return this.forward(t, 'log', '', !0)
                },
              },
              {
                key: 'warn',
                value: function () {
                  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n]
                  return this.forward(t, 'warn', '', !0)
                },
              },
              {
                key: 'error',
                value: function () {
                  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n]
                  return this.forward(t, 'error', '')
                },
              },
              {
                key: 'deprecate',
                value: function () {
                  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n]
                  return this.forward(t, 'warn', 'WARNING DEPRECATED: ', !0)
                },
              },
              {
                key: 'forward',
                value: function (e, t, n, r) {
                  return r && !this.debug
                    ? null
                    : ('string' == typeof e[0] && (e[0] = ''.concat(n).concat(this.prefix, ' ').concat(e[0])),
                      this.logger[t](e))
                },
              },
              {
                key: 'create',
                value: function (t) {
                  return new e(this.logger, d({}, { prefix: ''.concat(this.prefix, ':').concat(t, ':') }, this.options))
                },
              },
            ]),
            e
          )
        })())(),
        m = (function () {
          function e() {
            c(this, e), (this.observers = {})
          }
          return (
            l(e, [
              {
                key: 'on',
                value: function (e, t) {
                  var n = this
                  return (
                    e.split(' ').forEach(function (e) {
                      ;(n.observers[e] = n.observers[e] || []), n.observers[e].push(t)
                    }),
                    this
                  )
                },
              },
              {
                key: 'off',
                value: function (e, t) {
                  this.observers[e] &&
                    (t
                      ? (this.observers[e] = this.observers[e].filter(function (e) {
                          return e !== t
                        }))
                      : delete this.observers[e])
                },
              },
              {
                key: 'emit',
                value: function (e) {
                  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
                    n[r - 1] = arguments[r]
                  if (this.observers[e]) {
                    var o = [].concat(this.observers[e])
                    o.forEach(function (e) {
                      e.apply(void 0, n)
                    })
                  }
                  if (this.observers['*']) {
                    var u = [].concat(this.observers['*'])
                    u.forEach(function (t) {
                      t.apply(t, [e].concat(n))
                    })
                  }
                },
              },
            ]),
            e
          )
        })()
      function w() {
        var e,
          t,
          n = new Promise(function (n, r) {
            ;(e = n), (t = r)
          })
        return (n.resolve = e), (n.reject = t), n
      }
      function x(e) {
        return null == e ? '' : '' + e
      }
      function k(e, t, n) {
        e.forEach(function (e) {
          t[e] && (n[e] = t[e])
        })
      }
      function j(e, t, n) {
        function r(e) {
          return e && e.indexOf('###') > -1 ? e.replace(/###/g, '.') : e
        }
        function o() {
          return !e || 'string' == typeof e
        }
        for (var u = 'string' != typeof t ? [].concat(t) : t.split('.'); u.length > 1; ) {
          if (o()) return {}
          var i = r(u.shift())
          !e[i] && n && (e[i] = new n()), (e = Object.prototype.hasOwnProperty.call(e, i) ? e[i] : {})
        }
        return o() ? {} : { obj: e, k: r(u.shift()) }
      }
      function O(e, t, n) {
        var r = j(e, t, Object)
        r.obj[r.k] = n
      }
      function S(e, t) {
        var n = j(e, t),
          r = n.obj,
          o = n.k
        if (r) return r[o]
      }
      function L(e, t, n) {
        var r = S(e, n)
        return void 0 !== r ? r : S(t, n)
      }
      function P(e, t, n) {
        for (var r in t)
          '__proto__' !== r &&
            'constructor' !== r &&
            (r in e
              ? 'string' == typeof e[r] || e[r] instanceof String || 'string' == typeof t[r] || t[r] instanceof String
                ? n && (e[r] = t[r])
                : P(e[r], t[r], n)
              : (e[r] = t[r]))
        return e
      }
      function A(e) {
        return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
      }
      var E = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' }
      function N(e) {
        return 'string' == typeof e
          ? e.replace(/[&<>"'\/]/g, function (e) {
              return E[e]
            })
          : e
      }
      var C =
          'undefined' != typeof window &&
          window.navigator &&
          window.navigator.userAgent &&
          window.navigator.userAgent.indexOf('MSIE') > -1,
        R = [' ', ',', '?', '!', ';']
      function T(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '.'
        if (e) {
          if (e[t]) return e[t]
          for (var r = t.split(n), o = e, u = 0; u < r.length; ++u) {
            if (!o) return
            if ('string' == typeof o[r[u]] && u + 1 < r.length) return
            if (void 0 === o[r[u]]) {
              for (var i = 2, a = r.slice(u, u + i).join(n), s = o[a]; void 0 === s && r.length > u + i; )
                i++, (s = o[(a = r.slice(u, u + i).join(n))])
              if (void 0 === s) return
              if ('string' == typeof s) return s
              if (a && 'string' == typeof s[a]) return s[a]
              var d = r.slice(u + i).join(n)
              return d ? T(s, d, n) : void 0
            }
            o = o[r[u]]
          }
          return o
        }
      }
      var I = (function (e) {
          function t(e) {
            var n,
              r =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : { ns: ['translation'], defaultNS: 'translation' }
            return (
              c(this, t),
              (n = h(this, g(t).call(this))),
              C && m.call((0, p.default)(n)),
              (n.data = e || {}),
              (n.options = r),
              void 0 === n.options.keySeparator && (n.options.keySeparator = '.'),
              void 0 === n.options.ignoreJSONStructure && (n.options.ignoreJSONStructure = !0),
              n
            )
          }
          return (
            v(t, e),
            l(t, [
              {
                key: 'addNamespaces',
                value: function (e) {
                  this.options.ns.indexOf(e) < 0 && this.options.ns.push(e)
                },
              },
              {
                key: 'removeNamespaces',
                value: function (e) {
                  var t = this.options.ns.indexOf(e)
                  t > -1 && this.options.ns.splice(t, 1)
                },
              },
              {
                key: 'getResource',
                value: function (e, t, n) {
                  var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
                    o = void 0 !== r.keySeparator ? r.keySeparator : this.options.keySeparator,
                    u = void 0 !== r.ignoreJSONStructure ? r.ignoreJSONStructure : this.options.ignoreJSONStructure,
                    i = [e, t]
                  n && 'string' != typeof n && (i = i.concat(n)),
                    n && 'string' == typeof n && (i = i.concat(o ? n.split(o) : n)),
                    e.indexOf('.') > -1 && (i = e.split('.'))
                  var a = S(this.data, i)
                  return a || !u || 'string' != typeof n ? a : T(this.data && this.data[e] && this.data[e][t], n, o)
                },
              },
              {
                key: 'addResource',
                value: function (e, t, n, r) {
                  var o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : { silent: !1 },
                    u = this.options.keySeparator
                  void 0 === u && (u = '.')
                  var i = [e, t]
                  n && (i = i.concat(u ? n.split(u) : n)),
                    e.indexOf('.') > -1 && ((r = t), (t = (i = e.split('.'))[1])),
                    this.addNamespaces(t),
                    O(this.data, i, r),
                    o.silent || this.emit('added', e, t, n, r)
                },
              },
              {
                key: 'addResources',
                value: function (e, t, n) {
                  var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : { silent: !1 }
                  for (var o in n)
                    ('string' != typeof n[o] && '[object Array]' !== Object.prototype.toString.apply(n[o])) ||
                      this.addResource(e, t, o, n[o], { silent: !0 })
                  r.silent || this.emit('added', e, t, n)
                },
              },
              {
                key: 'addResourceBundle',
                value: function (e, t, n, r, o) {
                  var u = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : { silent: !1 },
                    i = [e, t]
                  e.indexOf('.') > -1 && ((r = n), (n = t), (t = (i = e.split('.'))[1])), this.addNamespaces(t)
                  var a = S(this.data, i) || {}
                  r ? P(a, n, o) : (a = d({}, a, n)), O(this.data, i, a), u.silent || this.emit('added', e, t, n)
                },
              },
              {
                key: 'removeResourceBundle',
                value: function (e, t) {
                  this.hasResourceBundle(e, t) && delete this.data[e][t],
                    this.removeNamespaces(t),
                    this.emit('removed', e, t)
                },
              },
              {
                key: 'hasResourceBundle',
                value: function (e, t) {
                  return void 0 !== this.getResource(e, t)
                },
              },
              {
                key: 'getResourceBundle',
                value: function (e, t) {
                  return (
                    t || (t = this.options.defaultNS),
                    'v1' === this.options.compatibilityAPI ? d({}, {}, this.getResource(e, t)) : this.getResource(e, t)
                  )
                },
              },
              {
                key: 'getDataByLanguage',
                value: function (e) {
                  return this.data[e]
                },
              },
              {
                key: 'hasLanguageSomeTranslations',
                value: function (e) {
                  var t = this.getDataByLanguage(e)
                  return !!((t && Object.keys(t)) || []).find(function (e) {
                    return t[e] && Object.keys(t[e]).length > 0
                  })
                },
              },
              {
                key: 'toJSON',
                value: function () {
                  return this.data
                },
              },
            ]),
            t
          )
        })(m),
        M = {
          processors: {},
          addPostProcessor: function (e) {
            this.processors[e.name] = e
          },
          handle: function (e, t, n, r, o) {
            var u = this
            return (
              e.forEach(function (e) {
                u.processors[e] && (t = u.processors[e].process(t, n, r, o))
              }),
              t
            )
          },
        },
        F = {},
        z = (function (e) {
          function t(e) {
            var n,
              r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
            return (
              c(this, t),
              (n = h(this, g(t).call(this))),
              C && m.call((0, p.default)(n)),
              k(
                [
                  'resourceStore',
                  'languageUtils',
                  'pluralResolver',
                  'interpolator',
                  'backendConnector',
                  'i18nFormat',
                  'utils',
                ],
                e,
                (0, p.default)(n),
              ),
              (n.options = r),
              void 0 === n.options.keySeparator && (n.options.keySeparator = '.'),
              (n.logger = y.create('translator')),
              n
            )
          }
          return (
            v(t, e),
            l(
              t,
              [
                {
                  key: 'changeLanguage',
                  value: function (e) {
                    e && (this.language = e)
                  },
                },
                {
                  key: 'exists',
                  value: function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { interpolation: {} }
                    if (null == e) return !1
                    var n = this.resolve(e, t)
                    return n && void 0 !== n.res
                  },
                },
                {
                  key: 'extractFromKey',
                  value: function (e, t) {
                    var n = void 0 !== t.nsSeparator ? t.nsSeparator : this.options.nsSeparator
                    void 0 === n && (n = ':')
                    var r = void 0 !== t.keySeparator ? t.keySeparator : this.options.keySeparator,
                      o = t.ns || this.options.defaultNS,
                      u = n && e.indexOf(n) > -1,
                      i = !(function (e, t, n) {
                        ;(t = t || ''), (n = n || '')
                        var r = R.filter(function (e) {
                          return t.indexOf(e) < 0 || n.indexOf(e) < 0
                        })
                        return (
                          0 === r.length ||
                          !new RegExp(
                            '('.concat(
                              r
                                .map(function (e) {
                                  return '?' === e ? '\\?' : e
                                })
                                .join('|'),
                              ')',
                            ),
                          ).test(e)
                        )
                      })(e, n, r)
                    if (u && !i) {
                      var a = e.match(this.interpolator.nestingRegexp)
                      if (a && a.length > 0) return { key: e, namespaces: o }
                      var s = e.split(n)
                      ;(n !== r || (n === r && this.options.ns.indexOf(s[0]) > -1)) && (o = s.shift()), (e = s.join(r))
                    }
                    return 'string' == typeof o && (o = [o]), { key: e, namespaces: o }
                  },
                },
                {
                  key: 'translate',
                  value: function (e, n, r) {
                    var o = this
                    if (
                      ('object' !== a(n) &&
                        this.options.overloadTranslationOptionHandler &&
                        (n = this.options.overloadTranslationOptionHandler(arguments)),
                      n || (n = {}),
                      null == e)
                    )
                      return ''
                    Array.isArray(e) || (e = [String(e)])
                    var u = void 0 !== n.keySeparator ? n.keySeparator : this.options.keySeparator,
                      i = this.extractFromKey(e[e.length - 1], n),
                      s = i.key,
                      c = i.namespaces,
                      f = c[c.length - 1],
                      l = n.lng || this.language,
                      p = n.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode
                    if (l && 'cimode' === l.toLowerCase()) {
                      if (p) {
                        var h = n.nsSeparator || this.options.nsSeparator
                        return f + h + s
                      }
                      return s
                    }
                    var g = this.resolve(e, n),
                      _ = g && g.res,
                      v = (g && g.usedKey) || s,
                      b = (g && g.exactUsedKey) || s,
                      y = Object.prototype.toString.apply(_),
                      m = ['[object Number]', '[object Function]', '[object RegExp]'],
                      w = void 0 !== n.joinArrays ? n.joinArrays : this.options.joinArrays,
                      x = !this.i18nFormat || this.i18nFormat.handleAsObject,
                      k = 'string' != typeof _ && 'boolean' != typeof _ && 'number' != typeof _
                    if (x && _ && k && m.indexOf(y) < 0 && ('string' != typeof w || '[object Array]' !== y)) {
                      if (!n.returnObjects && !this.options.returnObjects)
                        return (
                          this.options.returnedObjectHandler ||
                            this.logger.warn('accessing an object - but returnObjects options is not enabled!'),
                          this.options.returnedObjectHandler
                            ? this.options.returnedObjectHandler(v, _, d({}, n, { ns: c }))
                            : "key '".concat(s, ' (').concat(this.language, ")' returned an object instead of string.")
                        )
                      if (u) {
                        var j = '[object Array]' === y,
                          O = j ? [] : {},
                          S = j ? b : v
                        for (var L in _)
                          if (Object.prototype.hasOwnProperty.call(_, L)) {
                            var P = ''.concat(S).concat(u).concat(L)
                            ;(O[L] = this.translate(P, d({}, n, { joinArrays: !1, ns: c }))),
                              O[L] === P && (O[L] = _[L])
                          }
                        _ = O
                      }
                    } else if (x && 'string' == typeof w && '[object Array]' === y)
                      (_ = _.join(w)) && (_ = this.extendTranslation(_, e, n, r))
                    else {
                      var A = !1,
                        E = !1,
                        N = void 0 !== n.count && 'string' != typeof n.count,
                        C = t.hasDefaultValue(n),
                        R = N ? this.pluralResolver.getSuffix(l, n.count, n) : '',
                        T = n['defaultValue'.concat(R)] || n.defaultValue
                      !this.isValidLookup(_) && C && ((A = !0), (_ = T)), this.isValidLookup(_) || ((E = !0), (_ = s))
                      var I = n.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey,
                        M = I && E ? void 0 : _,
                        F = C && T !== _ && this.options.updateMissing
                      if (E || A || F) {
                        if ((this.logger.log(F ? 'updateKey' : 'missingKey', l, f, s, F ? T : _), u)) {
                          var z = this.resolve(s, d({}, n, { keySeparator: !1 }))
                          z &&
                            z.res &&
                            this.logger.warn(
                              'Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.',
                            )
                        }
                        var V = [],
                          D = this.languageUtils.getFallbackCodes(this.options.fallbackLng, n.lng || this.language)
                        if ('fallback' === this.options.saveMissingTo && D && D[0])
                          for (var B = 0; B < D.length; B++) V.push(D[B])
                        else
                          'all' === this.options.saveMissingTo
                            ? (V = this.languageUtils.toResolveHierarchy(n.lng || this.language))
                            : V.push(n.lng || this.language)
                        var $ = function (e, t, r) {
                          o.options.missingKeyHandler
                            ? o.options.missingKeyHandler(e, f, t, F ? r : M, F, n)
                            : o.backendConnector &&
                              o.backendConnector.saveMissing &&
                              o.backendConnector.saveMissing(e, f, t, F ? r : M, F, n),
                            o.emit('missingKey', e, f, t, _)
                        }
                        this.options.saveMissing &&
                          (this.options.saveMissingPlurals && N
                            ? V.forEach(function (e) {
                                o.pluralResolver.getSuffixes(e).forEach(function (t) {
                                  $([e], s + t, n['defaultValue'.concat(t)] || T)
                                })
                              })
                            : $(V, s, T))
                      }
                      ;(_ = this.extendTranslation(_, e, n, g, r)),
                        E && _ === s && this.options.appendNamespaceToMissingKey && (_ = ''.concat(f, ':').concat(s)),
                        (E || A) && this.options.parseMissingKeyHandler && (_ = this.options.parseMissingKeyHandler(_))
                    }
                    return _
                  },
                },
                {
                  key: 'extendTranslation',
                  value: function (e, t, n, r, o) {
                    var u = this
                    if (this.i18nFormat && this.i18nFormat.parse)
                      e = this.i18nFormat.parse(e, n, r.usedLng, r.usedNS, r.usedKey, { resolved: r })
                    else if (!n.skipInterpolation) {
                      n.interpolation &&
                        this.interpolator.init(
                          d({}, n, { interpolation: d({}, this.options.interpolation, n.interpolation) }),
                        )
                      var i,
                        a =
                          (n.interpolation && n.interpolation.skipOnVariables) ||
                          this.options.interpolation.skipOnVariables
                      if (a) {
                        var s = e.match(this.interpolator.nestingRegexp)
                        i = s && s.length
                      }
                      var c = n.replace && 'string' != typeof n.replace ? n.replace : n
                      if (
                        (this.options.interpolation.defaultVariables &&
                          (c = d({}, this.options.interpolation.defaultVariables, c)),
                        (e = this.interpolator.interpolate(e, c, n.lng || this.language, n)),
                        a)
                      ) {
                        var f = e.match(this.interpolator.nestingRegexp)
                        i < (f && f.length) && (n.nest = !1)
                      }
                      !1 !== n.nest &&
                        (e = this.interpolator.nest(
                          e,
                          function () {
                            for (var e = arguments.length, r = new Array(e), i = 0; i < e; i++) r[i] = arguments[i]
                            return o && o[0] === r[0] && !n.context
                              ? (u.logger.warn(
                                  'It seems you are nesting recursively key: '.concat(r[0], ' in key: ').concat(t[0]),
                                ),
                                null)
                              : u.translate.apply(u, r.concat([t]))
                          },
                          n,
                        )),
                        n.interpolation && this.interpolator.reset()
                    }
                    var l = n.postProcess || this.options.postProcess,
                      p = 'string' == typeof l ? [l] : l
                    return (
                      null != e &&
                        p &&
                        p.length &&
                        !1 !== n.applyPostProcessor &&
                        (e = M.handle(
                          p,
                          e,
                          t,
                          this.options && this.options.postProcessPassResolved ? d({ i18nResolved: r }, n) : n,
                          this,
                        )),
                      e
                    )
                  },
                },
                {
                  key: 'resolve',
                  value: function (e) {
                    var t,
                      n,
                      r,
                      o,
                      u,
                      i = this,
                      a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                    return (
                      'string' == typeof e && (e = [e]),
                      e.forEach(function (e) {
                        if (!i.isValidLookup(t)) {
                          var s = i.extractFromKey(e, a),
                            d = s.key
                          n = d
                          var c = s.namespaces
                          i.options.fallbackNS && (c = c.concat(i.options.fallbackNS))
                          var f = void 0 !== a.count && 'string' != typeof a.count,
                            l =
                              void 0 !== a.context &&
                              ('string' == typeof a.context || 'number' == typeof a.context) &&
                              '' !== a.context,
                            p = a.lngs ? a.lngs : i.languageUtils.toResolveHierarchy(a.lng || i.language, a.fallbackLng)
                          c.forEach(function (e) {
                            i.isValidLookup(t) ||
                              ((u = e),
                              !F[''.concat(p[0], '-').concat(e)] &&
                                i.utils &&
                                i.utils.hasLoadedNamespace &&
                                !i.utils.hasLoadedNamespace(u) &&
                                ((F[''.concat(p[0], '-').concat(e)] = !0),
                                i.logger.warn(
                                  'key "'
                                    .concat(n, '" for languages "')
                                    .concat(p.join(', '), '" won\'t get resolved as namespace "')
                                    .concat(u, '" was not yet loaded'),
                                  'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!',
                                )),
                              p.forEach(function (n) {
                                if (!i.isValidLookup(t)) {
                                  o = n
                                  var u,
                                    s,
                                    c = d,
                                    p = [c]
                                  if (i.i18nFormat && i.i18nFormat.addLookupKeys)
                                    i.i18nFormat.addLookupKeys(p, d, n, e, a)
                                  else
                                    f && (u = i.pluralResolver.getSuffix(n, a.count, a)),
                                      f && l && p.push(c + u),
                                      l && p.push((c += ''.concat(i.options.contextSeparator).concat(a.context))),
                                      f && p.push((c += u))
                                  for (; (s = p.pop()); )
                                    i.isValidLookup(t) || ((r = s), (t = i.getResource(n, e, s, a)))
                                }
                              }))
                          })
                        }
                      }),
                      { res: t, usedKey: n, exactUsedKey: r, usedLng: o, usedNS: u }
                    )
                  },
                },
                {
                  key: 'isValidLookup',
                  value: function (e) {
                    return !(
                      void 0 === e ||
                      (!this.options.returnNull && null === e) ||
                      (!this.options.returnEmptyString && '' === e)
                    )
                  },
                },
                {
                  key: 'getResource',
                  value: function (e, t, n) {
                    var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}
                    return this.i18nFormat && this.i18nFormat.getResource
                      ? this.i18nFormat.getResource(e, t, n, r)
                      : this.resourceStore.getResource(e, t, n, r)
                  },
                },
              ],
              [
                {
                  key: 'hasDefaultValue',
                  value: function (e) {
                    for (var t in e)
                      if (
                        Object.prototype.hasOwnProperty.call(e, t) &&
                        'defaultValue' === t.substring(0, 'defaultValue'.length) &&
                        void 0 !== e[t]
                      )
                        return !0
                    return !1
                  },
                },
              ],
            ),
            t
          )
        })(m)
      function V(e) {
        return e.charAt(0).toUpperCase() + e.slice(1)
      }
      var D = (function () {
          function e(t) {
            c(this, e),
              (this.options = t),
              (this.supportedLngs = this.options.supportedLngs || !1),
              (this.logger = y.create('languageUtils'))
          }
          return (
            l(e, [
              {
                key: 'getScriptPartFromCode',
                value: function (e) {
                  if (!e || e.indexOf('-') < 0) return null
                  var t = e.split('-')
                  return 2 === t.length
                    ? null
                    : (t.pop(), 'x' === t[t.length - 1].toLowerCase() ? null : this.formatLanguageCode(t.join('-')))
                },
              },
              {
                key: 'getLanguagePartFromCode',
                value: function (e) {
                  if (!e || e.indexOf('-') < 0) return e
                  var t = e.split('-')
                  return this.formatLanguageCode(t[0])
                },
              },
              {
                key: 'formatLanguageCode',
                value: function (e) {
                  if ('string' == typeof e && e.indexOf('-') > -1) {
                    var t = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'],
                      n = e.split('-')
                    return (
                      this.options.lowerCaseLng
                        ? (n = n.map(function (e) {
                            return e.toLowerCase()
                          }))
                        : 2 === n.length
                        ? ((n[0] = n[0].toLowerCase()),
                          (n[1] = n[1].toUpperCase()),
                          t.indexOf(n[1].toLowerCase()) > -1 && (n[1] = V(n[1].toLowerCase())))
                        : 3 === n.length &&
                          ((n[0] = n[0].toLowerCase()),
                          2 === n[1].length && (n[1] = n[1].toUpperCase()),
                          'sgn' !== n[0] && 2 === n[2].length && (n[2] = n[2].toUpperCase()),
                          t.indexOf(n[1].toLowerCase()) > -1 && (n[1] = V(n[1].toLowerCase())),
                          t.indexOf(n[2].toLowerCase()) > -1 && (n[2] = V(n[2].toLowerCase()))),
                      n.join('-')
                    )
                  }
                  return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e
                },
              },
              {
                key: 'isSupportedCode',
                value: function (e) {
                  return (
                    ('languageOnly' === this.options.load || this.options.nonExplicitSupportedLngs) &&
                      (e = this.getLanguagePartFromCode(e)),
                    !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1
                  )
                },
              },
              {
                key: 'getBestMatchFromCodes',
                value: function (e) {
                  var t,
                    n = this
                  return e
                    ? (e.forEach(function (e) {
                        if (!t) {
                          var r = n.formatLanguageCode(e)
                          ;(n.options.supportedLngs && !n.isSupportedCode(r)) || (t = r)
                        }
                      }),
                      !t &&
                        this.options.supportedLngs &&
                        e.forEach(function (e) {
                          if (!t) {
                            var r = n.getLanguagePartFromCode(e)
                            if (n.isSupportedCode(r)) return (t = r)
                            t = n.options.supportedLngs.find(function (e) {
                              if (0 === e.indexOf(r)) return e
                            })
                          }
                        }),
                      t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]),
                      t)
                    : null
                },
              },
              {
                key: 'getFallbackCodes',
                value: function (e, t) {
                  if (!e) return []
                  if (
                    ('function' == typeof e && (e = e(t)),
                    'string' == typeof e && (e = [e]),
                    '[object Array]' === Object.prototype.toString.apply(e))
                  )
                    return e
                  if (!t) return e.default || []
                  var n = e[t]
                  return (
                    n || (n = e[this.getScriptPartFromCode(t)]),
                    n || (n = e[this.formatLanguageCode(t)]),
                    n || (n = e[this.getLanguagePartFromCode(t)]),
                    n || (n = e.default),
                    n || []
                  )
                },
              },
              {
                key: 'toResolveHierarchy',
                value: function (e, t) {
                  var n = this,
                    r = this.getFallbackCodes(t || this.options.fallbackLng || [], e),
                    o = [],
                    u = function (e) {
                      e &&
                        (n.isSupportedCode(e)
                          ? o.push(e)
                          : n.logger.warn('rejecting language code not found in supportedLngs: '.concat(e)))
                    }
                  return (
                    'string' == typeof e && e.indexOf('-') > -1
                      ? ('languageOnly' !== this.options.load && u(this.formatLanguageCode(e)),
                        'languageOnly' !== this.options.load &&
                          'currentOnly' !== this.options.load &&
                          u(this.getScriptPartFromCode(e)),
                        'currentOnly' !== this.options.load && u(this.getLanguagePartFromCode(e)))
                      : 'string' == typeof e && u(this.formatLanguageCode(e)),
                    r.forEach(function (e) {
                      o.indexOf(e) < 0 && u(n.formatLanguageCode(e))
                    }),
                    o
                  )
                },
              },
            ]),
            e
          )
        })(),
        B = [
          {
            lngs: [
              'ach',
              'ak',
              'am',
              'arn',
              'br',
              'fil',
              'gun',
              'ln',
              'mfe',
              'mg',
              'mi',
              'oc',
              'pt',
              'pt-BR',
              'tg',
              'tl',
              'ti',
              'tr',
              'uz',
              'wa',
            ],
            nr: [1, 2],
            fc: 1,
          },
          {
            lngs: [
              'af',
              'an',
              'ast',
              'az',
              'bg',
              'bn',
              'ca',
              'da',
              'de',
              'dev',
              'el',
              'en',
              'eo',
              'es',
              'et',
              'eu',
              'fi',
              'fo',
              'fur',
              'fy',
              'gl',
              'gu',
              'ha',
              'hi',
              'hu',
              'hy',
              'ia',
              'it',
              'kk',
              'kn',
              'ku',
              'lb',
              'mai',
              'ml',
              'mn',
              'mr',
              'nah',
              'nap',
              'nb',
              'ne',
              'nl',
              'nn',
              'no',
              'nso',
              'pa',
              'pap',
              'pms',
              'ps',
              'pt-PT',
              'rm',
              'sco',
              'se',
              'si',
              'so',
              'son',
              'sq',
              'sv',
              'sw',
              'ta',
              'te',
              'tk',
              'ur',
              'yo',
            ],
            nr: [1, 2],
            fc: 2,
          },
          {
            lngs: [
              'ay',
              'bo',
              'cgg',
              'fa',
              'ht',
              'id',
              'ja',
              'jbo',
              'ka',
              'km',
              'ko',
              'ky',
              'lo',
              'ms',
              'sah',
              'su',
              'th',
              'tt',
              'ug',
              'vi',
              'wo',
              'zh',
            ],
            nr: [1],
            fc: 3,
          },
          { lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'], nr: [1, 2, 5], fc: 4 },
          { lngs: ['ar'], nr: [0, 1, 2, 3, 11, 100], fc: 5 },
          { lngs: ['cs', 'sk'], nr: [1, 2, 5], fc: 6 },
          { lngs: ['csb', 'pl'], nr: [1, 2, 5], fc: 7 },
          { lngs: ['cy'], nr: [1, 2, 3, 8], fc: 8 },
          { lngs: ['fr'], nr: [1, 2], fc: 9 },
          { lngs: ['ga'], nr: [1, 2, 3, 7, 11], fc: 10 },
          { lngs: ['gd'], nr: [1, 2, 3, 20], fc: 11 },
          { lngs: ['is'], nr: [1, 2], fc: 12 },
          { lngs: ['jv'], nr: [0, 1], fc: 13 },
          { lngs: ['kw'], nr: [1, 2, 3, 4], fc: 14 },
          { lngs: ['lt'], nr: [1, 2, 10], fc: 15 },
          { lngs: ['lv'], nr: [1, 2, 0], fc: 16 },
          { lngs: ['mk'], nr: [1, 2], fc: 17 },
          { lngs: ['mnk'], nr: [0, 1, 2], fc: 18 },
          { lngs: ['mt'], nr: [1, 2, 11, 20], fc: 19 },
          { lngs: ['or'], nr: [2, 1], fc: 2 },
          { lngs: ['ro'], nr: [1, 2, 20], fc: 20 },
          { lngs: ['sl'], nr: [5, 1, 2, 3], fc: 21 },
          { lngs: ['he', 'iw'], nr: [1, 2, 20, 21], fc: 22 },
        ],
        $ = {
          1: function (e) {
            return Number(e > 1)
          },
          2: function (e) {
            return Number(1 != e)
          },
          3: function (e) {
            return 0
          },
          4: function (e) {
            return Number(
              e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2,
            )
          },
          5: function (e) {
            return Number(
              0 == e ? 0 : 1 == e ? 1 : 2 == e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5,
            )
          },
          6: function (e) {
            return Number(1 == e ? 0 : e >= 2 && e <= 4 ? 1 : 2)
          },
          7: function (e) {
            return Number(1 == e ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2)
          },
          8: function (e) {
            return Number(1 == e ? 0 : 2 == e ? 1 : 8 != e && 11 != e ? 2 : 3)
          },
          9: function (e) {
            return Number(e >= 2)
          },
          10: function (e) {
            return Number(1 == e ? 0 : 2 == e ? 1 : e < 7 ? 2 : e < 11 ? 3 : 4)
          },
          11: function (e) {
            return Number(1 == e || 11 == e ? 0 : 2 == e || 12 == e ? 1 : e > 2 && e < 20 ? 2 : 3)
          },
          12: function (e) {
            return Number(e % 10 != 1 || e % 100 == 11)
          },
          13: function (e) {
            return Number(0 !== e)
          },
          14: function (e) {
            return Number(1 == e ? 0 : 2 == e ? 1 : 3 == e ? 2 : 3)
          },
          15: function (e) {
            return Number(e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2)
          },
          16: function (e) {
            return Number(e % 10 == 1 && e % 100 != 11 ? 0 : 0 !== e ? 1 : 2)
          },
          17: function (e) {
            return Number(1 == e || (e % 10 == 1 && e % 100 != 11) ? 0 : 1)
          },
          18: function (e) {
            return Number(0 == e ? 0 : 1 == e ? 1 : 2)
          },
          19: function (e) {
            return Number(
              1 == e ? 0 : 0 == e || (e % 100 > 1 && e % 100 < 11) ? 1 : e % 100 > 10 && e % 100 < 20 ? 2 : 3,
            )
          },
          20: function (e) {
            return Number(1 == e ? 0 : 0 == e || (e % 100 > 0 && e % 100 < 20) ? 1 : 2)
          },
          21: function (e) {
            return Number(e % 100 == 1 ? 1 : e % 100 == 2 ? 2 : e % 100 == 3 || e % 100 == 4 ? 3 : 0)
          },
          22: function (e) {
            return Number(1 == e ? 0 : 2 == e ? 1 : (e < 0 || e > 10) && e % 10 == 0 ? 2 : 3)
          },
        },
        q = ['v1', 'v2', 'v3'],
        U = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 }
      function H() {
        var e = {}
        return (
          B.forEach(function (t) {
            t.lngs.forEach(function (n) {
              e[n] = { numbers: t.nr, plurals: $[t.fc] }
            })
          }),
          e
        )
      }
      var W = (function () {
          function e(t) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
            c(this, e),
              (this.languageUtils = t),
              (this.options = n),
              (this.logger = y.create('pluralResolver')),
              (this.rules = H())
          }
          return (
            l(e, [
              {
                key: 'addRule',
                value: function (e, t) {
                  this.rules[e] = t
                },
              },
              {
                key: 'getRule',
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                  if (this.shouldUseIntlApi())
                    try {
                      return new Intl.PluralRules(e, { type: t.ordinal ? 'ordinal' : 'cardinal' })
                    } catch (e) {
                      return
                    }
                  return this.rules[e] || this.rules[this.languageUtils.getLanguagePartFromCode(e)]
                },
              },
              {
                key: 'needsPlural',
                value: function (e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = this.getRule(e, t)
                  return this.shouldUseIntlApi()
                    ? n && n.resolvedOptions().pluralCategories.length > 1
                    : n && n.numbers.length > 1
                },
              },
              {
                key: 'getPluralFormsOfKey',
                value: function (e, t) {
                  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
                  return this.getSuffixes(e, n).map(function (e) {
                    return ''.concat(t).concat(e)
                  })
                },
              },
              {
                key: 'getSuffixes',
                value: function (e) {
                  var t = this,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    r = this.getRule(e, n)
                  return r
                    ? this.shouldUseIntlApi()
                      ? r
                          .resolvedOptions()
                          .pluralCategories.sort(function (e, t) {
                            return U[e] - U[t]
                          })
                          .map(function (e) {
                            return ''.concat(t.options.prepend).concat(e)
                          })
                      : r.numbers.map(function (r) {
                          return t.getSuffix(e, r, n)
                        })
                    : []
                },
              },
              {
                key: 'getSuffix',
                value: function (e, t) {
                  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                    r = this.getRule(e, n)
                  return r
                    ? this.shouldUseIntlApi()
                      ? ''.concat(this.options.prepend).concat(r.select(t))
                      : this.getSuffixRetroCompatible(r, t)
                    : (this.logger.warn('no plural rule found for: '.concat(e)), '')
                },
              },
              {
                key: 'getSuffixRetroCompatible',
                value: function (e, t) {
                  var n = this,
                    r = e.noAbs ? e.plurals(t) : e.plurals(Math.abs(t)),
                    o = e.numbers[r]
                  this.options.simplifyPluralSuffix &&
                    2 === e.numbers.length &&
                    1 === e.numbers[0] &&
                    (2 === o ? (o = 'plural') : 1 === o && (o = ''))
                  var u = function () {
                    return n.options.prepend && o.toString() ? n.options.prepend + o.toString() : o.toString()
                  }
                  return 'v1' === this.options.compatibilityJSON
                    ? 1 === o
                      ? ''
                      : 'number' == typeof o
                      ? '_plural_'.concat(o.toString())
                      : u()
                    : 'v2' === this.options.compatibilityJSON ||
                      (this.options.simplifyPluralSuffix && 2 === e.numbers.length && 1 === e.numbers[0])
                    ? u()
                    : this.options.prepend && r.toString()
                    ? this.options.prepend + r.toString()
                    : r.toString()
                },
              },
              {
                key: 'shouldUseIntlApi',
                value: function () {
                  return !q.includes(this.options.compatibilityJSON)
                },
              },
            ]),
            e
          )
        })(),
        K = (function () {
          function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
            c(this, e),
              (this.logger = y.create('interpolator')),
              (this.options = t),
              (this.format =
                (t.interpolation && t.interpolation.format) ||
                function (e) {
                  return e
                }),
              this.init(t)
          }
          return (
            l(e, [
              {
                key: 'init',
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                  e.interpolation || (e.interpolation = { escapeValue: !0 })
                  var t = e.interpolation
                  ;(this.escape = void 0 !== t.escape ? t.escape : N),
                    (this.escapeValue = void 0 === t.escapeValue || t.escapeValue),
                    (this.useRawValueToEscape = void 0 !== t.useRawValueToEscape && t.useRawValueToEscape),
                    (this.prefix = t.prefix ? A(t.prefix) : t.prefixEscaped || '{{'),
                    (this.suffix = t.suffix ? A(t.suffix) : t.suffixEscaped || '}}'),
                    (this.formatSeparator = t.formatSeparator ? t.formatSeparator : t.formatSeparator || ','),
                    (this.unescapePrefix = t.unescapeSuffix ? '' : t.unescapePrefix || '-'),
                    (this.unescapeSuffix = this.unescapePrefix ? '' : t.unescapeSuffix || ''),
                    (this.nestingPrefix = t.nestingPrefix ? A(t.nestingPrefix) : t.nestingPrefixEscaped || A('$t(')),
                    (this.nestingSuffix = t.nestingSuffix ? A(t.nestingSuffix) : t.nestingSuffixEscaped || A(')')),
                    (this.nestingOptionsSeparator = t.nestingOptionsSeparator
                      ? t.nestingOptionsSeparator
                      : t.nestingOptionsSeparator || ','),
                    (this.maxReplaces = t.maxReplaces ? t.maxReplaces : 1e3),
                    (this.alwaysFormat = void 0 !== t.alwaysFormat && t.alwaysFormat),
                    this.resetRegExp()
                },
              },
              {
                key: 'reset',
                value: function () {
                  this.options && this.init(this.options)
                },
              },
              {
                key: 'resetRegExp',
                value: function () {
                  var e = ''.concat(this.prefix, '(.+?)').concat(this.suffix)
                  this.regexp = new RegExp(e, 'g')
                  var t = ''
                    .concat(this.prefix)
                    .concat(this.unescapePrefix, '(.+?)')
                    .concat(this.unescapeSuffix)
                    .concat(this.suffix)
                  this.regexpUnescape = new RegExp(t, 'g')
                  var n = ''.concat(this.nestingPrefix, '(.+?)').concat(this.nestingSuffix)
                  this.nestingRegexp = new RegExp(n, 'g')
                },
              },
              {
                key: 'interpolate',
                value: function (e, t, n, r) {
                  var o,
                    u,
                    i,
                    a = this,
                    s =
                      (this.options && this.options.interpolation && this.options.interpolation.defaultVariables) || {}
                  function c(e) {
                    return e.replace(/\$/g, '$$$$')
                  }
                  var f = function (e) {
                    if (e.indexOf(a.formatSeparator) < 0) {
                      var o = L(t, s, e)
                      return a.alwaysFormat ? a.format(o, void 0, n, d({}, r, t, { interpolationkey: e })) : o
                    }
                    var u = e.split(a.formatSeparator),
                      i = u.shift().trim(),
                      c = u.join(a.formatSeparator).trim()
                    return a.format(L(t, s, i), c, n, d({}, r, t, { interpolationkey: i }))
                  }
                  this.resetRegExp()
                  var l = (r && r.missingInterpolationHandler) || this.options.missingInterpolationHandler,
                    p =
                      (r && r.interpolation && r.interpolation.skipOnVariables) ||
                      this.options.interpolation.skipOnVariables
                  return (
                    [
                      {
                        regex: this.regexpUnescape,
                        safeValue: function (e) {
                          return c(e)
                        },
                      },
                      {
                        regex: this.regexp,
                        safeValue: function (e) {
                          return a.escapeValue ? c(a.escape(e)) : c(e)
                        },
                      },
                    ].forEach(function (t) {
                      for (i = 0; (o = t.regex.exec(e)); ) {
                        if (void 0 === (u = f(o[1].trim())))
                          if ('function' == typeof l) {
                            var n = l(e, o, r)
                            u = 'string' == typeof n ? n : ''
                          } else {
                            if (p) {
                              u = o[0]
                              continue
                            }
                            a.logger.warn('missed to pass in variable '.concat(o[1], ' for interpolating ').concat(e)),
                              (u = '')
                          }
                        else 'string' == typeof u || a.useRawValueToEscape || (u = x(u))
                        var s = t.safeValue(u)
                        if (
                          ((e = e.replace(o[0], s)),
                          p
                            ? ((t.regex.lastIndex += s.length), (t.regex.lastIndex -= o[0].length))
                            : (t.regex.lastIndex = 0),
                          ++i >= a.maxReplaces)
                        )
                          break
                      }
                    }),
                    e
                  )
                },
              },
              {
                key: 'nest',
                value: function (e, t) {
                  var n,
                    r,
                    o = this,
                    u = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                    i = d({}, u)
                  function a(e, t) {
                    var n = this.nestingOptionsSeparator
                    if (e.indexOf(n) < 0) return e
                    var r = e.split(new RegExp(''.concat(n, '[ ]*{'))),
                      o = '{'.concat(r[1])
                    ;(e = r[0]), (o = (o = this.interpolate(o, i)).replace(/'/g, '"'))
                    try {
                      ;(i = JSON.parse(o)), t && (i = d({}, t, i))
                    } catch (t) {
                      return (
                        this.logger.warn('failed parsing options string in nesting for key '.concat(e), t),
                        ''.concat(e).concat(n).concat(o)
                      )
                    }
                    return delete i.defaultValue, e
                  }
                  for (i.applyPostProcessor = !1, delete i.defaultValue; (n = this.nestingRegexp.exec(e)); ) {
                    var s = [],
                      c = !1
                    if (-1 !== n[0].indexOf(this.formatSeparator) && !/{.*}/.test(n[1])) {
                      var f = n[1].split(this.formatSeparator).map(function (e) {
                        return e.trim()
                      })
                      ;(n[1] = f.shift()), (s = f), (c = !0)
                    }
                    if ((r = t(a.call(this, n[1].trim(), i), i)) && n[0] === e && 'string' != typeof r) return r
                    'string' != typeof r && (r = x(r)),
                      r || (this.logger.warn('missed to resolve '.concat(n[1], ' for nesting ').concat(e)), (r = '')),
                      c &&
                        (r = s.reduce(function (e, t) {
                          return o.format(e, t, u.lng, d({}, u, { interpolationkey: n[1].trim() }))
                        }, r.trim())),
                      (e = e.replace(n[0], r)),
                      (this.regexp.lastIndex = 0)
                  }
                  return e
                },
              },
            ]),
            e
          )
        })()
      var J = (function (e) {
        function t(e, n, r) {
          var o,
            u = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}
          return (
            c(this, t),
            (o = h(this, g(t).call(this))),
            C && m.call((0, p.default)(o)),
            (o.backend = e),
            (o.store = n),
            (o.services = r),
            (o.languageUtils = r.languageUtils),
            (o.options = u),
            (o.logger = y.create('backendConnector')),
            (o.state = {}),
            (o.queue = []),
            o.backend && o.backend.init && o.backend.init(r, u.backend, u),
            o
          )
        }
        return (
          v(t, e),
          l(t, [
            {
              key: 'queueLoad',
              value: function (e, t, n, r) {
                var o = this,
                  u = [],
                  i = [],
                  a = [],
                  s = []
                return (
                  e.forEach(function (e) {
                    var r = !0
                    t.forEach(function (t) {
                      var a = ''.concat(e, '|').concat(t)
                      !n.reload && o.store.hasResourceBundle(e, t)
                        ? (o.state[a] = 2)
                        : o.state[a] < 0 ||
                          (1 === o.state[a]
                            ? i.indexOf(a) < 0 && i.push(a)
                            : ((o.state[a] = 1),
                              (r = !1),
                              i.indexOf(a) < 0 && i.push(a),
                              u.indexOf(a) < 0 && u.push(a),
                              s.indexOf(t) < 0 && s.push(t)))
                    }),
                      r || a.push(e)
                  }),
                  (u.length || i.length) && this.queue.push({ pending: i, loaded: {}, errors: [], callback: r }),
                  { toLoad: u, pending: i, toLoadLanguages: a, toLoadNamespaces: s }
                )
              },
            },
            {
              key: 'loaded',
              value: function (e, t, n) {
                var r = e.split('|'),
                  o = r[0],
                  u = r[1]
                t && this.emit('failedLoading', o, u, t),
                  n && this.store.addResourceBundle(o, u, n),
                  (this.state[e] = t ? -1 : 2)
                var i = {}
                this.queue.forEach(function (n) {
                  var r, a, s, d, c, f
                  ;(r = n.loaded),
                    (a = u),
                    (d = j(r, [o], Object)),
                    (c = d.obj),
                    (f = d.k),
                    (c[f] = c[f] || []),
                    s && (c[f] = c[f].concat(a)),
                    s || c[f].push(a),
                    (function (e, t) {
                      for (var n = e.indexOf(t); -1 !== n; ) e.splice(n, 1), (n = e.indexOf(t))
                    })(n.pending, e),
                    t && n.errors.push(t),
                    0 !== n.pending.length ||
                      n.done ||
                      (Object.keys(n.loaded).forEach(function (e) {
                        i[e] || (i[e] = []),
                          n.loaded[e].length &&
                            n.loaded[e].forEach(function (t) {
                              i[e].indexOf(t) < 0 && i[e].push(t)
                            })
                      }),
                      (n.done = !0),
                      n.errors.length ? n.callback(n.errors) : n.callback())
                }),
                  this.emit('loaded', i),
                  (this.queue = this.queue.filter(function (e) {
                    return !e.done
                  }))
              },
            },
            {
              key: 'read',
              value: function (e, t, n) {
                var r = this,
                  o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
                  u = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 350,
                  i = arguments.length > 5 ? arguments[5] : void 0
                return e.length
                  ? this.backend[n](e, t, function (a, s) {
                      a && s && o < 5
                        ? setTimeout(function () {
                            r.read.call(r, e, t, n, o + 1, 2 * u, i)
                          }, u)
                        : i(a, s)
                    })
                  : i(null, {})
              },
            },
            {
              key: 'prepareLoading',
              value: function (e, t) {
                var n = this,
                  r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                  o = arguments.length > 3 ? arguments[3] : void 0
                if (!this.backend)
                  return this.logger.warn('No backend was added via i18next.use. Will not load resources.'), o && o()
                'string' == typeof e && (e = this.languageUtils.toResolveHierarchy(e)),
                  'string' == typeof t && (t = [t])
                var u = this.queueLoad(e, t, r, o)
                if (!u.toLoad.length) return u.pending.length || o(), null
                u.toLoad.forEach(function (e) {
                  n.loadOne(e)
                })
              },
            },
            {
              key: 'load',
              value: function (e, t, n) {
                this.prepareLoading(e, t, {}, n)
              },
            },
            {
              key: 'reload',
              value: function (e, t, n) {
                this.prepareLoading(e, t, { reload: !0 }, n)
              },
            },
            {
              key: 'loadOne',
              value: function (e) {
                var t = this,
                  n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
                  r = e.split('|'),
                  o = r[0],
                  u = r[1]
                this.read(o, u, 'read', void 0, void 0, function (r, i) {
                  r &&
                    t.logger.warn(
                      ''.concat(n, 'loading namespace ').concat(u, ' for language ').concat(o, ' failed'),
                      r,
                    ),
                    !r && i && t.logger.log(''.concat(n, 'loaded namespace ').concat(u, ' for language ').concat(o), i),
                    t.loaded(e, r, i)
                })
              },
            },
            {
              key: 'saveMissing',
              value: function (e, t, n, r, o) {
                var u = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {}
                this.services.utils &&
                this.services.utils.hasLoadedNamespace &&
                !this.services.utils.hasLoadedNamespace(t)
                  ? this.logger.warn(
                      'did not save key "'.concat(n, '" as the namespace "').concat(t, '" was not yet loaded'),
                      'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!',
                    )
                  : null != n &&
                    '' !== n &&
                    (this.backend &&
                      this.backend.create &&
                      this.backend.create(e, t, n, r, null, d({}, u, { isUpdate: o })),
                    e && e[0] && this.store.addResource(e[0], t, n, r))
              },
            },
          ]),
          t
        )
      })(m)
      function Z() {
        return {
          debug: !1,
          initImmediate: !0,
          ns: ['translation'],
          defaultNS: ['translation'],
          fallbackLng: ['dev'],
          fallbackNS: !1,
          supportedLngs: !1,
          nonExplicitSupportedLngs: !1,
          load: 'all',
          preload: !1,
          simplifyPluralSuffix: !0,
          keySeparator: '.',
          nsSeparator: ':',
          pluralSeparator: '_',
          contextSeparator: '_',
          partialBundledLanguages: !1,
          saveMissing: !1,
          updateMissing: !1,
          saveMissingTo: 'fallback',
          saveMissingPlurals: !0,
          missingKeyHandler: !1,
          missingInterpolationHandler: !1,
          postProcess: !1,
          postProcessPassResolved: !1,
          returnNull: !0,
          returnEmptyString: !0,
          returnObjects: !1,
          joinArrays: !1,
          returnedObjectHandler: !1,
          parseMissingKeyHandler: !1,
          appendNamespaceToMissingKey: !1,
          appendNamespaceToCIMode: !1,
          overloadTranslationOptionHandler: function (e) {
            var t = {}
            if (
              ('object' === a(e[1]) && (t = e[1]),
              'string' == typeof e[1] && (t.defaultValue = e[1]),
              'string' == typeof e[2] && (t.tDescription = e[2]),
              'object' === a(e[2]) || 'object' === a(e[3]))
            ) {
              var n = e[3] || e[2]
              Object.keys(n).forEach(function (e) {
                t[e] = n[e]
              })
            }
            return t
          },
          interpolation: {
            escapeValue: !0,
            format: function (e, t, n, r) {
              return e
            },
            prefix: '{{',
            suffix: '}}',
            formatSeparator: ',',
            unescapePrefix: '-',
            nestingPrefix: '$t(',
            nestingSuffix: ')',
            nestingOptionsSeparator: ',',
            maxReplaces: 1e3,
            skipOnVariables: !0,
          },
        }
      }
      function G(e) {
        return (
          'string' == typeof e.ns && (e.ns = [e.ns]),
          'string' == typeof e.fallbackLng && (e.fallbackLng = [e.fallbackLng]),
          'string' == typeof e.fallbackNS && (e.fallbackNS = [e.fallbackNS]),
          e.supportedLngs &&
            e.supportedLngs.indexOf('cimode') < 0 &&
            (e.supportedLngs = e.supportedLngs.concat(['cimode'])),
          e
        )
      }
      function Q() {}
      const Y = new ((function (e) {
          function t() {
            var e,
              n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              r = arguments.length > 1 ? arguments[1] : void 0
            if (
              (c(this, t),
              (e = h(this, g(t).call(this))),
              C && m.call((0, p.default)(e)),
              (e.options = G(n)),
              (e.services = {}),
              (e.logger = y),
              (e.modules = { external: [] }),
              r && !e.isInitialized && !n.isClone)
            ) {
              if (!e.options.initImmediate) return e.init(n, r), h(e, (0, p.default)(e))
              setTimeout(function () {
                e.init(n, r)
              }, 0)
            }
            return e
          }
          return (
            v(t, e),
            l(t, [
              {
                key: 'init',
                value: function () {
                  var e = this,
                    t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    n = arguments.length > 1 ? arguments[1] : void 0
                  function r(e) {
                    return e ? ('function' == typeof e ? new e() : e) : null
                  }
                  if (
                    ('function' == typeof t && ((n = t), (t = {})),
                    !t.defaultNS && t.ns && ('string' == typeof t.ns ? (t.defaultNS = t.ns) : (t.defaultNS = t.ns[0])),
                    (this.options = d({}, Z(), this.options, G(t))),
                    (this.format = this.options.interpolation.format),
                    n || (n = Q),
                    !this.options.isClone)
                  ) {
                    this.modules.logger ? y.init(r(this.modules.logger), this.options) : y.init(null, this.options)
                    var o = new D(this.options)
                    this.store = new I(this.options.resources, this.options)
                    var u = this.services
                    ;(u.logger = y),
                      (u.resourceStore = this.store),
                      (u.languageUtils = o),
                      (u.pluralResolver = new W(o, {
                        prepend: this.options.pluralSeparator,
                        compatibilityJSON: this.options.compatibilityJSON,
                        simplifyPluralSuffix: this.options.simplifyPluralSuffix,
                      })),
                      (u.interpolator = new K(this.options)),
                      (u.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }),
                      (u.backendConnector = new J(r(this.modules.backend), u.resourceStore, u, this.options)),
                      u.backendConnector.on('*', function (t) {
                        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                          r[o - 1] = arguments[o]
                        e.emit.apply(e, [t].concat(r))
                      }),
                      this.modules.languageDetector &&
                        ((u.languageDetector = r(this.modules.languageDetector)),
                        u.languageDetector.init(u, this.options.detection, this.options)),
                      this.modules.i18nFormat &&
                        ((u.i18nFormat = r(this.modules.i18nFormat)), u.i18nFormat.init && u.i18nFormat.init(this)),
                      (this.translator = new z(this.services, this.options)),
                      this.translator.on('*', function (t) {
                        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                          r[o - 1] = arguments[o]
                        e.emit.apply(e, [t].concat(r))
                      }),
                      this.modules.external.forEach(function (t) {
                        t.init && t.init(e)
                      })
                  }
                  if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
                    var i = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng)
                    i.length > 0 && 'dev' !== i[0] && (this.options.lng = i[0])
                  }
                  this.services.languageDetector ||
                    this.options.lng ||
                    this.logger.warn('init: no languageDetector is used and no lng is defined')
                  var a = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage']
                  a.forEach(function (t) {
                    e[t] = function () {
                      var n
                      return (n = e.store)[t].apply(n, arguments)
                    }
                  })
                  var s = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle']
                  s.forEach(function (t) {
                    e[t] = function () {
                      var n
                      return (n = e.store)[t].apply(n, arguments), e
                    }
                  })
                  var c = w(),
                    f = function () {
                      var t = function (t, r) {
                        e.isInitialized &&
                          !e.initializedStoreOnce &&
                          e.logger.warn('init: i18next is already initialized. You should call init just once!'),
                          (e.isInitialized = !0),
                          e.options.isClone || e.logger.log('initialized', e.options),
                          e.emit('initialized', e.options),
                          c.resolve(r),
                          n(t, r)
                      }
                      if (e.languages && 'v1' !== e.options.compatibilityAPI && !e.isInitialized)
                        return t(null, e.t.bind(e))
                      e.changeLanguage(e.options.lng, t)
                    }
                  return this.options.resources || !this.options.initImmediate ? f() : setTimeout(f, 0), c
                },
              },
              {
                key: 'loadResources',
                value: function (e) {
                  var t = this,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Q,
                    r = n,
                    o = 'string' == typeof e ? e : this.language
                  if (
                    ('function' == typeof e && (r = e), !this.options.resources || this.options.partialBundledLanguages)
                  ) {
                    if (o && 'cimode' === o.toLowerCase()) return r()
                    var u = [],
                      i = function (e) {
                        e &&
                          t.services.languageUtils.toResolveHierarchy(e).forEach(function (e) {
                            u.indexOf(e) < 0 && u.push(e)
                          })
                      }
                    if (o) i(o)
                    else {
                      var a = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng)
                      a.forEach(function (e) {
                        return i(e)
                      })
                    }
                    this.options.preload &&
                      this.options.preload.forEach(function (e) {
                        return i(e)
                      }),
                      this.services.backendConnector.load(u, this.options.ns, r)
                  } else r(null)
                },
              },
              {
                key: 'reloadResources',
                value: function (e, t, n) {
                  var r = w()
                  return (
                    e || (e = this.languages),
                    t || (t = this.options.ns),
                    n || (n = Q),
                    this.services.backendConnector.reload(e, t, function (e) {
                      r.resolve(), n(e)
                    }),
                    r
                  )
                },
              },
              {
                key: 'use',
                value: function (e) {
                  if (!e)
                    throw new Error(
                      'You are passing an undefined module! Please check the object you are passing to i18next.use()',
                    )
                  if (!e.type)
                    throw new Error(
                      'You are passing a wrong module! Please check the object you are passing to i18next.use()',
                    )
                  return (
                    'backend' === e.type && (this.modules.backend = e),
                    ('logger' === e.type || (e.log && e.warn && e.error)) && (this.modules.logger = e),
                    'languageDetector' === e.type && (this.modules.languageDetector = e),
                    'i18nFormat' === e.type && (this.modules.i18nFormat = e),
                    'postProcessor' === e.type && M.addPostProcessor(e),
                    '3rdParty' === e.type && this.modules.external.push(e),
                    this
                  )
                },
              },
              {
                key: 'changeLanguage',
                value: function (e, t) {
                  var n = this
                  this.isLanguageChangingTo = e
                  var r = w()
                  this.emit('languageChanging', e)
                  var o = function (e) {
                      if (
                        ((n.language = e),
                        (n.languages = n.services.languageUtils.toResolveHierarchy(e)),
                        (n.resolvedLanguage = void 0),
                        !(['cimode', 'dev'].indexOf(e) > -1))
                      )
                        for (var t = 0; t < n.languages.length; t++) {
                          var r = n.languages[t]
                          if (!(['cimode', 'dev'].indexOf(r) > -1) && n.store.hasLanguageSomeTranslations(r)) {
                            n.resolvedLanguage = r
                            break
                          }
                        }
                    },
                    u = function (u) {
                      e || u || !n.services.languageDetector || (u = [])
                      var i = 'string' == typeof u ? u : n.services.languageUtils.getBestMatchFromCodes(u)
                      i &&
                        (n.language || o(i),
                        n.translator.language || n.translator.changeLanguage(i),
                        n.services.languageDetector && n.services.languageDetector.cacheUserLanguage(i)),
                        n.loadResources(i, function (e) {
                          !(function (e, u) {
                            u
                              ? (o(u),
                                n.translator.changeLanguage(u),
                                (n.isLanguageChangingTo = void 0),
                                n.emit('languageChanged', u),
                                n.logger.log('languageChanged', u))
                              : (n.isLanguageChangingTo = void 0),
                              r.resolve(function () {
                                return n.t.apply(n, arguments)
                              }),
                              t &&
                                t(e, function () {
                                  return n.t.apply(n, arguments)
                                })
                          })(e, i)
                        })
                    }
                  return (
                    e || !this.services.languageDetector || this.services.languageDetector.async
                      ? !e && this.services.languageDetector && this.services.languageDetector.async
                        ? this.services.languageDetector.detect(u)
                        : u(e)
                      : u(this.services.languageDetector.detect()),
                    r
                  )
                },
              },
              {
                key: 'getFixedT',
                value: function (e, t, n) {
                  var r = this,
                    o = function e(t, o) {
                      var u
                      if ('object' !== a(o)) {
                        for (var i = arguments.length, s = new Array(i > 2 ? i - 2 : 0), c = 2; c < i; c++)
                          s[c - 2] = arguments[c]
                        u = r.options.overloadTranslationOptionHandler([t, o].concat(s))
                      } else u = d({}, o)
                      ;(u.lng = u.lng || e.lng), (u.lngs = u.lngs || e.lngs), (u.ns = u.ns || e.ns)
                      var f = r.options.keySeparator || '.',
                        l = n ? ''.concat(n).concat(f).concat(t) : t
                      return r.t(l, u)
                    }
                  return 'string' == typeof e ? (o.lng = e) : (o.lngs = e), (o.ns = t), (o.keyPrefix = n), o
                },
              },
              {
                key: 't',
                value: function () {
                  var e
                  return this.translator && (e = this.translator).translate.apply(e, arguments)
                },
              },
              {
                key: 'exists',
                value: function () {
                  var e
                  return this.translator && (e = this.translator).exists.apply(e, arguments)
                },
              },
              {
                key: 'setDefaultNamespace',
                value: function (e) {
                  this.options.defaultNS = e
                },
              },
              {
                key: 'hasLoadedNamespace',
                value: function (e) {
                  var t = this,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                  if (!this.isInitialized)
                    return this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages), !1
                  if (!this.languages || !this.languages.length)
                    return (
                      this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages), !1
                    )
                  var r = this.resolvedLanguage || this.languages[0],
                    o = !!this.options && this.options.fallbackLng,
                    u = this.languages[this.languages.length - 1]
                  if ('cimode' === r.toLowerCase()) return !0
                  var i = function (e, n) {
                    var r = t.services.backendConnector.state[''.concat(e, '|').concat(n)]
                    return -1 === r || 2 === r
                  }
                  if (n.precheck) {
                    var a = n.precheck(this, i)
                    if (void 0 !== a) return a
                  }
                  return (
                    !!this.hasResourceBundle(r, e) ||
                    !this.services.backendConnector.backend ||
                    !(!i(r, e) || (o && !i(u, e)))
                  )
                },
              },
              {
                key: 'loadNamespaces',
                value: function (e, t) {
                  var n = this,
                    r = w()
                  return this.options.ns
                    ? ('string' == typeof e && (e = [e]),
                      e.forEach(function (e) {
                        n.options.ns.indexOf(e) < 0 && n.options.ns.push(e)
                      }),
                      this.loadResources(function (e) {
                        r.resolve(), t && t(e)
                      }),
                      r)
                    : (t && t(), Promise.resolve())
                },
              },
              {
                key: 'loadLanguages',
                value: function (e, t) {
                  var n = w()
                  'string' == typeof e && (e = [e])
                  var r = this.options.preload || [],
                    o = e.filter(function (e) {
                      return r.indexOf(e) < 0
                    })
                  return o.length
                    ? ((this.options.preload = r.concat(o)),
                      this.loadResources(function (e) {
                        n.resolve(), t && t(e)
                      }),
                      n)
                    : (t && t(), Promise.resolve())
                },
              },
              {
                key: 'dir',
                value: function (e) {
                  if (
                    (e ||
                      (e =
                        this.resolvedLanguage ||
                        (this.languages && this.languages.length > 0 ? this.languages[0] : this.language)),
                    !e)
                  )
                    return 'rtl'
                  return [
                    'ar',
                    'shu',
                    'sqr',
                    'ssh',
                    'xaa',
                    'yhd',
                    'yud',
                    'aao',
                    'abh',
                    'abv',
                    'acm',
                    'acq',
                    'acw',
                    'acx',
                    'acy',
                    'adf',
                    'ads',
                    'aeb',
                    'aec',
                    'afb',
                    'ajp',
                    'apc',
                    'apd',
                    'arb',
                    'arq',
                    'ars',
                    'ary',
                    'arz',
                    'auz',
                    'avl',
                    'ayh',
                    'ayl',
                    'ayn',
                    'ayp',
                    'bbz',
                    'pga',
                    'he',
                    'iw',
                    'ps',
                    'pbt',
                    'pbu',
                    'pst',
                    'prp',
                    'prd',
                    'ug',
                    'ur',
                    'ydd',
                    'yds',
                    'yih',
                    'ji',
                    'yi',
                    'hbo',
                    'men',
                    'xmn',
                    'fa',
                    'jpr',
                    'peo',
                    'pes',
                    'prs',
                    'dv',
                    'sam',
                  ].indexOf(this.services.languageUtils.getLanguagePartFromCode(e)) >= 0
                    ? 'rtl'
                    : 'ltr'
                },
              },
              {
                key: 'createInstance',
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    n = arguments.length > 1 ? arguments[1] : void 0
                  return new t(e, n)
                },
              },
              {
                key: 'cloneInstance',
                value: function () {
                  var e = this,
                    n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Q,
                    o = d({}, this.options, n, { isClone: !0 }),
                    u = new t(o),
                    i = ['store', 'services', 'language']
                  return (
                    i.forEach(function (t) {
                      u[t] = e[t]
                    }),
                    (u.services = d({}, this.services)),
                    (u.services.utils = { hasLoadedNamespace: u.hasLoadedNamespace.bind(u) }),
                    (u.translator = new z(u.services, u.options)),
                    u.translator.on('*', function (e) {
                      for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
                        n[r - 1] = arguments[r]
                      u.emit.apply(u, [e].concat(n))
                    }),
                    u.init(o, r),
                    (u.translator.options = u.options),
                    (u.translator.backendConnector.services.utils = {
                      hasLoadedNamespace: u.hasLoadedNamespace.bind(u),
                    }),
                    u
                  )
                },
              },
              {
                key: 'toJSON',
                value: function () {
                  return {
                    options: this.options,
                    store: this.store,
                    language: this.language,
                    languages: this.languages,
                    resolvedLanguage: this.resolvedLanguage,
                  }
                },
              },
            ]),
            t
          )
        })(m))(),
        X = {
          ar_AE: 'ar',
          br: 'pt',
          de_DE: 'de',
          he_IL: 'he',
          id_ID: 'id',
          in: 'en',
          kr: 'ko',
          ms_MY: 'ms',
          sv_SE: 'sv',
          th_TH: 'th',
          uk: 'en',
          vi_VN: 'vi',
          zh_CN: 'zh-Hans',
          zh_TW: 'zh-Hant',
          zh: 'zh-Hans',
        }
      let ee = i
      const te = window
      if (!te.__tradingviewI18nextInited) {
        let e = window.language || null,
          t = re(e)
        ;(e && t) || (console.error('No translation data'), (e = 'en'), (t = re('en')))
        const n = (function (e) {
          return X[e] || e
        })(e)
        if (e && t) {
          const e = {
            compatibilityJSON: 'v3',
            interpolation: { escapeValue: !1, prefix: '{', suffix: '}', skipOnVariables: !0, maxReplaces: 25 },
            keySeparator: ':::',
            lng: n,
            nsSeparator: ':::',
            resources: { [n]: { translation: t } },
          }
          Y.init(e), (ee = Y.t.bind(Y))
          const r = window
          if (void 0 !== r.customTranslateFunction) {
            const e = r.customTranslateFunction,
              t = ee
            ee = (n, r) => {
              const o = e(n, r)
              return null !== o ? o : t(n, r)
            }
          }
          o(ee), u(ee)
        }
        te.__tradingviewI18nextInited = !0
      }
      function ne(e, t) {
        return ee(e, t)
      }
      function re(e) {
        return (e && te._tv_languages && te._tv_languages[e]) || null
      }
    },
    87795: e => {
      'use strict'
      const t = [776, 2359, 2359, 2367, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]
      function n(e) {
        if ('string' != typeof e) throw new Error('string cannot be undefined or null')
        const t = []
        let n = 0,
          o = 0
        for (; n < e.length; )
          (o += r(n + o, e)),
            a(e[n + o]) && o++,
            u(e[n + o]) && o++,
            i(e[n + o]) && o++,
            s(e[n + o]) ? o++ : (t.push(e.substring(n, n + o)), (n += o), (o = 0))
        return t
      }
      function r(e, t) {
        const n = t[e]
        if (
          !(function (e) {
            return e && c(e[0].charCodeAt(0), 55296, 56319)
          })(n) ||
          e === t.length - 1
        )
          return 1
        const r = n + t[e + 1]
        let u = t.substring(e + 2, e + 5)
        return (o(r) && o(u)) ||
          (function (e) {
            return c(d(e), 127995, 127999)
          })(u)
          ? 4
          : 2
      }
      function o(e) {
        return c(d(e), 127462, 127487)
      }
      function u(e) {
        return 'string' == typeof e && c(e.charCodeAt(0), 65024, 65039)
      }
      function i(e) {
        return 'string' == typeof e && c(e.charCodeAt(0), 8400, 8447)
      }
      function a(e) {
        return 'string' == typeof e && -1 !== t.indexOf(e.charCodeAt(0))
      }
      function s(e) {
        return 'string' == typeof e && 8205 === e.charCodeAt(0)
      }
      function d(e) {
        return ((e.charCodeAt(0) - 55296) << 10) + (e.charCodeAt(1) - 56320) + 65536
      }
      function c(e, t, n) {
        return e >= t && e <= n
      }
      ;(e.exports = n),
        (e.exports.substr = function (e, t, r) {
          const o = n(e)
          if (void 0 === t) return e
          if (t >= o.length) return ''
          const u = o.length - t
          let i = t + (void 0 === r ? u : r)
          return i > t + u && (i = void 0), o.slice(t, i).join('')
        })
    },
    18438: (e, t, n) => {
      'use strict'
      n.d(t, { default: () => r })
      const r = (function () {
        var e = {
            base: 'https://twemoji.maxcdn.com/v/13.0.1/',
            ext: '.png',
            size: '72x72',
            className: 'emoji',
            convert: {
              fromCodePoint: function (e) {
                var t = 'string' == typeof e ? parseInt(e, 16) : e
                if (t < 65536) return a(t)
                return a(55296 + ((t -= 65536) >> 10), 56320 + (1023 & t))
              },
              toCodePoint: _,
            },
            onerror: function () {
              this.parentNode && this.parentNode.replaceChild(s(this.alt, !1), this)
            },
            parse: function (t, n) {
              ;(n && 'function' != typeof n) || (n = { callback: n })
              return ('string' == typeof t ? l : f)(t, {
                callback: n.callback || d,
                attributes: 'function' == typeof n.attributes ? n.attributes : h,
                base: 'string' == typeof n.base ? n.base : e.base,
                ext: n.ext || e.ext,
                size: n.folder || ((r = n.size || e.size), 'number' == typeof r ? r + 'x' + r : r),
                className: n.className || e.className,
                onerror: n.onerror || e.onerror,
              })
              var r
            },
            replace: g,
            test: function (e) {
              n.lastIndex = 0
              var t = n.test(e)
              return (n.lastIndex = 0), t
            },
          },
          t = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' },
          n =
            /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,
          r = /\uFE0F/g,
          o = String.fromCharCode(8205),
          u = /[&<>'"]/g,
          i = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,
          a = String.fromCharCode
        return e
        function s(e, t) {
          return document.createTextNode(t ? e.replace(r, '') : e)
        }
        function d(e, t) {
          return ''.concat(t.base, t.size, '/', e, t.ext)
        }
        function c(e) {
          return _(e.indexOf(o) < 0 ? e.replace(r, '') : e)
        }
        function f(e, t) {
          for (
            var r,
              o,
              u,
              a,
              d,
              f,
              l,
              p,
              h,
              g,
              _,
              v,
              b,
              y = (function e(t, n) {
                for (var r, o, u = t.childNodes, a = u.length; a--; )
                  3 === (o = (r = u[a]).nodeType)
                    ? n.push(r)
                    : 1 !== o || ('ownerSVGElement' in r) || i.test(r.nodeName.toLowerCase()) || e(r, n)
                return n
              })(e, []),
              m = y.length;
            m--;

          ) {
            for (u = !1, a = document.createDocumentFragment(), f = (d = y[m]).nodeValue, p = 0; (l = n.exec(f)); ) {
              if (
                ((h = l.index) !== p && a.appendChild(s(f.slice(p, h), !0)),
                (v = c((_ = l[0]))),
                (p = h + _.length),
                (b = t.callback(v, t)),
                v && b)
              ) {
                for (o in (((g = new Image()).onerror = t.onerror),
                g.setAttribute('draggable', 'false'),
                (r = t.attributes(_, v))))
                  r.hasOwnProperty(o) && 0 !== o.indexOf('on') && !g.hasAttribute(o) && g.setAttribute(o, r[o])
                ;(g.className = t.className), (g.alt = _), (g.src = b), (u = !0), a.appendChild(g)
              }
              g || a.appendChild(s(_, !1)), (g = null)
            }
            u && (p < f.length && a.appendChild(s(f.slice(p), !0)), d.parentNode.replaceChild(a, d))
          }
          return e
        }
        function l(e, t) {
          return g(e, function (e) {
            var n,
              r,
              o = e,
              i = c(e),
              a = t.callback(i, t)
            if (i && a) {
              for (r in ((o = '<img '.concat(
                'class="',
                t.className,
                '" ',
                'draggable="false" ',
                'alt="',
                e,
                '"',
                ' src="',
                a,
                '"',
              )),
              (n = t.attributes(e, i))))
                n.hasOwnProperty(r) &&
                  0 !== r.indexOf('on') &&
                  -1 === o.indexOf(' ' + r + '=') &&
                  (o = o.concat(' ', r, '="', n[r].replace(u, p), '"'))
              o = o.concat('/>')
            }
            return o
          })
        }
        function p(e) {
          return t[e]
        }
        function h() {
          return null
        }
        function g(e, t) {
          return String(e).replace(n, t)
        }
        function _(e, t) {
          for (var n = [], r = 0, o = 0, u = 0; u < e.length; )
            (r = e.charCodeAt(u++)),
              o
                ? (n.push((65536 + ((o - 55296) << 10) + (r - 56320)).toString(16)), (o = 0))
                : 55296 <= r && r <= 56319
                ? (o = r)
                : n.push(r.toString(16))
          return n.join(t || '-')
        }
      })()
    },
    85459: function (e, t, n) {
      var r
      !(function (t) {
        'use strict'
        function o() {}
        var u = o.prototype,
          i = t.EventEmitter
        function a(e, t) {
          for (var n = e.length; n--; ) if (e[n].listener === t) return n
          return -1
        }
        function s(e) {
          return function () {
            return this[e].apply(this, arguments)
          }
        }
        ;(u.getListeners = function (e) {
          var t,
            n,
            r = this._getEvents()
          if (e instanceof RegExp) for (n in ((t = {}), r)) r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n])
          else t = r[e] || (r[e] = [])
          return t
        }),
          (u.flattenListeners = function (e) {
            var t,
              n = []
            for (t = 0; t < e.length; t += 1) n.push(e[t].listener)
            return n
          }),
          (u.getListenersAsObject = function (e) {
            var t,
              n = this.getListeners(e)
            return n instanceof Array && ((t = {})[e] = n), t || n
          }),
          (u.addListener = function (e, t) {
            if (
              !(function e(t) {
                return 'function' == typeof t || t instanceof RegExp || (!(!t || 'object' != typeof t) && e(t.listener))
              })(t)
            )
              throw new TypeError('listener must be a function')
            var n,
              r = this.getListenersAsObject(e),
              o = 'object' == typeof t
            for (n in r) r.hasOwnProperty(n) && -1 === a(r[n], t) && r[n].push(o ? t : { listener: t, once: !1 })
            return this
          }),
          (u.on = s('addListener')),
          (u.addOnceListener = function (e, t) {
            return this.addListener(e, { listener: t, once: !0 })
          }),
          (u.once = s('addOnceListener')),
          (u.defineEvent = function (e) {
            return this.getListeners(e), this
          }),
          (u.defineEvents = function (e) {
            for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t])
            return this
          }),
          (u.removeListener = function (e, t) {
            var n,
              r,
              o = this.getListenersAsObject(e)
            for (r in o) o.hasOwnProperty(r) && -1 !== (n = a(o[r], t)) && o[r].splice(n, 1)
            return this
          }),
          (u.off = s('removeListener')),
          (u.addListeners = function (e, t) {
            return this.manipulateListeners(!1, e, t)
          }),
          (u.removeListeners = function (e, t) {
            return this.manipulateListeners(!0, e, t)
          }),
          (u.manipulateListeners = function (e, t, n) {
            var r,
              o,
              u = e ? this.removeListener : this.addListener,
              i = e ? this.removeListeners : this.addListeners
            if ('object' != typeof t || t instanceof RegExp) for (r = n.length; r--; ) u.call(this, t, n[r])
            else
              for (r in t)
                t.hasOwnProperty(r) && (o = t[r]) && ('function' == typeof o ? u.call(this, r, o) : i.call(this, r, o))
            return this
          }),
          (u.removeEvent = function (e) {
            var t,
              n = typeof e,
              r = this._getEvents()
            if ('string' === n) delete r[e]
            else if (e instanceof RegExp) for (t in r) r.hasOwnProperty(t) && e.test(t) && delete r[t]
            else delete this._events
            return this
          }),
          (u.removeAllListeners = s('removeEvent')),
          (u.emitEvent = function (e, t) {
            var n,
              r,
              o,
              u,
              i = this.getListenersAsObject(e)
            for (u in i)
              if (i.hasOwnProperty(u))
                for (n = i[u].slice(0), o = 0; o < n.length; o++)
                  !0 === (r = n[o]).once && this.removeListener(e, r.listener),
                    r.listener.apply(this, t || []) === this._getOnceReturnValue() && this.removeListener(e, r.listener)
            return this
          }),
          (u.trigger = s('emitEvent')),
          (u.emit = function (e) {
            var t = Array.prototype.slice.call(arguments, 1)
            return this.emitEvent(e, t)
          }),
          (u.setOnceReturnValue = function (e) {
            return (this._onceReturnValue = e), this
          }),
          (u._getOnceReturnValue = function () {
            return !this.hasOwnProperty('_onceReturnValue') || this._onceReturnValue
          }),
          (u._getEvents = function () {
            return this._events || (this._events = {})
          }),
          (o.noConflict = function () {
            return (t.EventEmitter = i), o
          }),
          void 0 ===
            (r = function () {
              return o
            }.call(t, n, t, e)) || (e.exports = r)
      })(this || {})
    },
    75542: (e, t, n) => {
      'use strict'
      function r(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
        return e
      }
      n.d(t, { default: () => r })
    },
    77189: (e, t, n) => {
      'use strict'
      function r(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
            : (e[t] = n),
          e
        )
      }
      n.d(t, { default: () => r })
    },
    11430: (e, t, n) => {
      'use strict'
      function r(e, t) {
        return (r =
          Object.setPrototypeOf ||
          function (e, t) {
            return (e.__proto__ = t), e
          })(e, t)
      }
      n.d(t, { default: () => r })
    },
  },
])
