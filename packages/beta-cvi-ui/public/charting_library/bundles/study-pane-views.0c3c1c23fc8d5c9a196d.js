'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [507],
  {
    2375: (t, e, i) => {
      i.d(e, { PolygonRenderer: () => u })
      var s = i(34026),
        r = i(4652),
        a = i(29892),
        n = i(63300),
        o = i(49612),
        l = i(84346),
        d = i(68906),
        h = i(16282),
        c = i(49094)
      class u extends h.ScaledPaneRenderer {
        constructor(t) {
          super(),
            (this._data = null),
            (this._backHittest = new l.HitTestResult(l.HitTestResult.MOVEPOINT_BACKGROUND)),
            (this._points = []),
            (this._hittest = null != t ? t : new l.HitTestResult(l.HitTestResult.MOVEPOINT))
        }
        setData(t) {
          ;(this._data = t), (this._points = t.points)
        }
        hitTest(t) {
          if (null === this._data || (void 0 !== this._data.mouseTouchable && !this._data.mouseTouchable)) return null
          const e = Math.max((0, c.interactionTolerance)().line, Math.ceil(this._data.linewidth / 2)),
            i = this._points.length
          if (1 === i) {
            return (0, s.pointInCircle)(t, this._points[0], e) ? this._hittest : null
          }
          for (let s = 1; s < i; s++) {
            const i = this._points[s - 1],
              a = this._points[s]
            if ((0, r.distanceToSegment)(i, a, t).distance <= e) return this._hittest
          }
          if (this._data.filled && this._data.fillBackground && i > 0) {
            const s = this._points[0],
              a = this._points[i - 1]
            if ((0, r.distanceToSegment)(s, a, t).distance <= e) return this._hittest
          }
          return this._data.filled && this._data.fillBackground && (0, s.pointInPolygon)(t, this._data.points)
            ? this._backHittest
            : null
        }
        _drawImpl(t, e) {
          var i, s
          const r = this._points.length
          if (null === this._data || 0 === r) return
          if (1 === r) return void this._drawPoint(t, this._points[0], this._data.linewidth / 2, this._data.color)
          t.beginPath()
          const l = null !== (i = this._data.linecap) && void 0 !== i ? i : 'butt'
          ;(t.lineCap = l),
            (t.strokeStyle = this._data.color),
            (t.lineWidth = this._data.linewidth),
            (t.lineJoin = null !== (s = this._data.linejoin) && void 0 !== s ? s : 'miter'),
            (0, a.setLineStyle)(t, this._data.linestyle)
          const h = this._points[0]
          t.moveTo(h.x, h.y)
          for (const e of this._points) t.lineTo(e.x, e.y)
          if (
            (this._data.filled &&
              this._data.fillBackground &&
              ((t.fillStyle = (0, d.generateColor)(this._data.backcolor, this._data.transparency)), t.fill()),
            this._data.filled && !this._data.skipClosePath && t.closePath(),
            this._data.linewidth > 0 && t.stroke(),
            r > 1)
          ) {
            if (('butt' !== l && (t.lineCap = 'butt'), this._data.leftend === o.LineEnd.Arrow)) {
              const i = this._correctArrowPoints(this._points[1], this._points[0], t.lineWidth, l)
              ;(0, n.drawArrow)(i[0], i[1], t, t.lineWidth, e.pixelRatio)
            }
            if (this._data.rightend === o.LineEnd.Arrow) {
              const i = this._correctArrowPoints(this._points[r - 2], this._points[r - 1], t.lineWidth, l)
              ;(0, n.drawArrow)(i[0], i[1], t, t.lineWidth, e.pixelRatio)
            }
          }
        }
        _drawPoint(t, e, i, s) {
          0 !== i && (t.beginPath(), (t.fillStyle = s), t.arc(e.x, e.y, i, 0, 2 * Math.PI, !0), t.fill(), t.closePath())
        }
        _correctArrowPoints(t, e, i, s) {
          const r = e.subtract(t),
            a = r.length()
          if ('butt' === s || a < 1) return [t, e]
          const n = a + i / 2
          return [t, r.scaled(n / a).add(t)]
        }
      }
    },
    72984: (t, e, i) => {
      i.r(e), i.d(e, { BackgroundPaneView: () => l })
      var s = i(88537),
        r = i(94804),
        a = i(93435),
        n = i(68906)
      class o {
        constructor(t) {
          this._data = t
        }
        hitTest(t) {
          return null
        }
        draw(t, e) {}
        drawBackground(t, e) {
          const i = this._data,
            s = (0, n.generateColor)(this._data.color, this._data.transparency),
            r = e.pixelRatio,
            o = Math.round(i.x1 * r),
            l = Math.round(i.x2 * r)
          ;(0, a.fillRect)(t, o, 0, l - o, e.physicalHeight, s)
        }
      }
      class l {
        constructor(t, e, i) {
          ;(this._data = []), (this._invalidated = !0), (this._provider = t), (this._model = e), (this._data = [])
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated && (this._updateViewInternal(), (this._invalidated = !1))
          const t = new r.CompositeRenderer()
          for (const e of this._data) t.append(new o(e))
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().backgrounds()
          if (0 === i.size) return
          const r = this._model.timeScale().visibleBarsStrictRange()
          if (null === r) return
          const a = r.firstBar(),
            n = r.lastBar()
          i.forEach((t, i) => {
            const r = this._provider.properties().graphics.backgrounds[i]
            if (!r.visible.value()) return
            let o, l
            t.forEach(t => {
              const i = null !== t.start ? t.start : (0, s.ensureNotNull)(e.points().firstIndex()),
                d = t.stop
              if (d < a || n < i) return
              let h = e.indexToCoordinate(i) - 0.5 * e.barSpacing()
              const c = e.indexToCoordinate(d) + 0.5 * e.barSpacing()
              l === i - 1 && (h = o || h),
                (o = c),
                (l = d),
                (h < 0 && c < 0) ||
                  (h > e.width() && c > e.width()) ||
                  this._data.push({ x1: h, x2: c, color: r.color.value(), transparency: r.transparency.value() })
            })
          })
        }
      }
    },
    93742: (t, e, i) => {
      i.r(e), i.d(e, { HHistPaneView: () => x })
      var s = i(24377),
        r = i(88537),
        a = i(84346),
        n = i(95018),
        o = i(94804),
        l = i(98664),
        d = i(86441),
        h = i(93435),
        c = i(67802),
        u = i(22799)
      function p(t, e) {
        return { min: Math.min(t, e), max: Math.max(t, e) }
      }
      function _(t) {
        return t.max - t.min
      }
      class f {
        constructor(t) {
          this._data = t
        }
        hitTest(t, e) {
          const i = this._data
          for (const s of i.histograms) {
            if (s.yRange.min >= t.y || t.y >= s.yRange.max) continue
            let r = null
            const o = _(s.xRange)
            for (const l of s.bars) {
              const d = i.styles[l.styleId]
              if (!d.visible) continue
              if (d.location === n.HHistLocation.Absolute && (s.xRange.min >= t.x || t.x >= s.xRange.max)) continue
              null === r &&
                ((r = 0),
                s.bars.forEach(t => {
                  const e = t.subBarValues.reduce((t, e) => t + e)
                  r = Math.max(r, e)
                }))
              const h = v(s.xRange, d, e.cssWidth),
                { xBasePoint: c, sign: u } = h,
                p = Math.max((d.percentWidth * o) / 100 - l.subBarValues.length, 0)
              let _ = c
              for (let e = 0; e < l.subBarValues.length; e++) {
                const i = l.y,
                  s = l.y + l.height,
                  n = _,
                  o = n + u * ((p * l.subBarValues[e]) / r)
                if (((_ = o), ((t.x >= n && t.x <= o) || (t.x >= o && t.x <= n)) && t.y >= i && t.y <= s))
                  return new a.HitTestResult(a.HitTestResult.REGULAR)
              }
            }
          }
          return null
        }
        draw(t, e) {
          const i = this._data
          t.save(),
            i.histograms.forEach(r => {
              const a = []
              let n = 0,
                o = 0
              r.bars.forEach(t => {
                const e = t.subBarValues.reduce((t, e) => t + e)
                ;(n = Math.max(n, e)), (o += t.height)
              })
              const l = o / r.bars.length,
                d = ((h = l), (c = e.pixelRatio), Math.floor(h * c) >= 1 * c ? Math.floor(c) : 0)
              var h, c
              const u = _(r.xRange),
                p = []
              if (
                (r.bars.forEach(s => {
                  const o = i.styles[s.styleId]
                  if (!o.visible) return
                  if (o.showValues && o.addToTotalValue)
                    for (let t = 0; t < s.subBarValues.length; t++) a[t] = (a[t] || 0) + s.subBarValues[t]
                  const l = v(r.xRange, o, e.cssWidth),
                    { xBasePoint: h, sign: c } = l
                  if (s.y > e.cssHeight || s.y + s.height < 0) return
                  const _ = Math.max((o.percentWidth * u) / 100 - s.subBarValues.length, 0)
                  let f = h
                  for (let i = 0; i < s.subBarValues.length; i++) {
                    const r = s.y,
                      a = s.y + s.height,
                      l = f,
                      h = l + c * ((_ * s.subBarValues[i]) / n)
                    if (((f = h), Math.abs(h - l) < 0.5)) continue
                    ;(t.fillStyle = o.colors[i]), t.beginPath()
                    const u = Math.round(l * e.pixelRatio),
                      p = Math.round(r * e.pixelRatio),
                      v = Math.round(h * e.pixelRatio),
                      g = Math.round(a * e.pixelRatio),
                      m = v - u,
                      R = Math.max(g - p - d, 1)
                    t.rect(u, p, m, R), t.fill()
                  }
                  if (!o.showValues) return
                  const R = g(s.displayedValues, o.direction),
                    w = m(u, s.y, s.height, l, o, R)
                  p.push(w)
                }),
                a.length > 0)
              ) {
                const t = i.styles[r.bars[0].styleId],
                  n = v(r.xRange, t, e.cssWidth),
                  o = g(a, t.direction),
                  d = r.bars[r.bars.length - 1],
                  h = m(u, d.y + d.height, l, n, t, o)
                ;(h.color = (0, s.shiftColor)(h.color, 1.5)), p.push(h)
              }
              const f = Math.min(...p.map(t => t.fontSize))
              if (f >= 7.5) for (const i of p) (i.fontSize = f), R(t, e, i)
            }),
            t.restore()
        }
      }
      function v(t, e, i) {
        const s = e.location === n.HHistLocation.Absolute,
          r = e.location === n.HHistLocation.Relative,
          a = e.direction === n.HHistDirection.LeftToRight,
          o = e.direction === n.HHistDirection.RightToLeft
        let l, d
        if (s && a) (l = t.min), (d = 1)
        else if (s && o) (l = t.max), (d = -1)
        else if (r && a) (l = 0), (d = 1)
        else {
          if (!r || !o) throw new Error(`Unknown location/direction values: ${e.location}/${e.direction}`)
          ;(l = i), (d = -1)
        }
        return { xBasePoint: l, sign: d }
      }
      function g(t, e) {
        e === n.HHistDirection.RightToLeft && (t = t.slice()).reverse()
        const i = new c.VolumeFormatter()
        return t.map(t => i.format(t)).join('x')
      }
      function m(t, e, i, s, r, a) {
        const o = Math.min(Math.round((1.7 * t) / a.length), Math.round(0.6 * i)),
          l = r.direction === n.HHistDirection.LeftToRight ? 'left' : 'right',
          { xBasePoint: h, sign: c } = s,
          u = h + 3 * c,
          p = e + 0.7 * i
        return { text: a, color: r.valuesColor, fontSize: o, align: l, point: new d.Point(u, p) }
      }
      function R(t, e, i) {
        const { text: s, color: r, fontSize: a, align: n, point: o } = i
        ;(t.font = `${a}px ${u.CHART_FONT_FAMILY}`),
          (t.fillStyle = r),
          (t.textAlign = n),
          (0, h.drawScaled)(t, e.pixelRatio, () => t.fillText(s, o.x, o.y))
      }
      var w = i(68906)
      class x {
        constructor(t, e, i) {
          ;(this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._rendererData = { histograms: [], styles: {} }),
            (this._textData = []),
            (this._hhistRenderer = new f(this._rendererData))
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated && (this._updateViewInternal(), (this._invalidated = !1))
          const t = new o.CompositeRenderer()
          t.append(this._hhistRenderer)
          for (const e of this._textData) t.append(new l.TextRenderer(e, new a.HitTestResult(a.HitTestResult.REGULAR)))
          return t
        }
        _resetRenderersData() {
          ;(this._rendererData.histograms = []), (this._rendererData.styles = {}), (this._textData = [])
        }
        _prepareStyles() {
          const t = (0, r.ensureDefined)(this._provider.graphicsInfo().hhists),
            e = Object.keys(t),
            i = this._provider.properties().graphics.hhists,
            s = this._provider.properties().child('inputs').child('volume').value() === n.HHistVolumeMode.Delta
          for (const a of e) {
            const e = (0, r.ensureDefined)(i.child(a)),
              n = (0, r.ensureDefined)(t[a])
            if (s)
              (this._rendererData.styles[a + 'UpDominate'] = {
                colors: T(e.colors[0].value(), e.transparencies[0].value()),
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: n.location,
                direction: e.direction.value(),
                showValues: e.showValues.value(),
                addToTotalValue: !1,
                valuesColor: e.valuesColor.value(),
              }),
                (this._rendererData.styles[a + 'DownDominate'] = {
                  colors: T(e.colors[1].value(), e.transparencies[1].value()),
                  visible: e.visible.value(),
                  percentWidth: e.percentWidth.value(),
                  location: n.location,
                  direction: e.direction.value(),
                  showValues: e.showValues.value(),
                  addToTotalValue: !1,
                  valuesColor: e.valuesColor.value(),
                })
            else {
              const t = (0, w.generateColor)(e.colors[0].value(), e.transparencies[0].value()),
                i = e.colors[1] ? (0, w.generateColor)(e.colors[1].value(), e.transparencies[1].value()) : t
              this._rendererData.styles[a] = {
                colors: [t, i],
                visible: e.visible.value(),
                percentWidth: e.percentWidth.value(),
                location: n.location,
                direction: e.direction.value(),
                showValues: e.showValues.value(),
                addToTotalValue: !0,
                valuesColor: e.valuesColor.value(),
              }
            }
          }
        }
        _updateViewInternal() {
          this._resetRenderersData()
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          if (null === this._provider.firstValue()) return
          const i = this._provider.graphics().hhistsByTimePointIndex()
          if (0 === i.size) return
          const s = e.visibleBarsStrictRange()
          if (null === s) return
          const a = s.firstBar(),
            n = s.lastBar()
          this._prepareStyles(),
            (0, r.ensureDefined)(i).forEach((i, s) => {
              let r = 1 / 0,
                o = -1 / 0
              i.forEach(t => {
                ;(r = Math.min(r, t.firstBarTime)), (o = Math.max(o, t.lastBarTime))
              }),
                o < a || r > n || this._updateDataForRenderers(i, t, e)
            })
        }
        _updateDataForRenderers(t, e, i) {
          if (t.size <= 0) return
          let s = null
          if (
            (t.forEach(t => {
              s = s || t
            }),
            null === s)
          )
            return
          let a = s
          t.forEach(t => {
            t.priceLow < a.priceLow && (a = t)
          })
          const o = this._provider.properties().child('inputs').child('volume').value() === n.HHistVolumeMode.Delta,
            l = (function (t, e) {
              return p(e.indexToCoordinate(t.firstBarTime), e.indexToCoordinate(t.lastBarTime))
            })(s, i),
            d = (0, r.ensureNotNull)(this._provider.firstValue()),
            h = []
          t.forEach(t => {
            null == t.rate[t.rate.length - 1] && t.rate.splice(-1, 1)
            let i = [],
              s = [],
              r = t.styleId
            if (o) {
              const [e, a, n] =
                t.rate[0] > t.rate[1] ? [t.rate[1], t.rate[0], 'UpDominate'] : [t.rate[0], t.rate[1], 'DownDominate']
              ;(i = [a - e, e, e]), (s = [a - e]), (r += n)
            } else (i = t.rate), (s = t.rate)
            const a = (function (t, e, i) {
              return p(e.priceToCoordinate(t.priceHigh, i), e.priceToCoordinate(t.priceLow, i))
            })(t, e, d)
            h.push({ height: a.max - a.min, y: a.min, subBarValues: i, displayedValues: s, styleId: r })
          }),
            h.sort((t, e) => t.y - e.y),
            this._rendererData.histograms.push({
              xRange: l,
              yRange: p(h[0].y, h[h.length - 1].y + h[h.length - 1].height),
              bars: h,
            })
        }
      }
      function T(t, e) {
        let i
        if ((0, w.isHexColor)(t)) i = 100 - e
        else {
          const r = (0, s.tryParseRgba)(t)
          i = 100 - (null !== r ? (0, w.alphaToTransparency)(r[3]) : e)
        }
        return [
          (0, w.generateColor)(t, 100 - i, !0),
          (0, w.generateColor)(t, 100 - i / 2, !0),
          (0, w.generateColor)(t, 100 - i / 4, !0),
        ]
      }
    },
    22107: (t, e, i) => {
      i.r(e), i.d(e, { HorizLinePaneView: () => o })
      var s = i(88537),
        r = i(84346),
        a = i(94804),
        n = i(40254)
      class o {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._hitTestResult =
              void 0 !== i
                ? new r.HitTestResult(r.HitTestResult.CUSTOM, i)
                : new r.HitTestResult(r.HitTestResult.REGULAR))
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated && (this._updateViewInternal(), (this._invalidated = !1))
          const t = new a.CompositeRenderer()
          for (const e of this._data) {
            const i = new n.HorizontalLineRenderer()
            i.setData(e), i.setHitTest(this._hitTestResult), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().horizlines()
          if (0 === i.size) return
          const r = this._model.timeScale().visibleBarsStrictRange()
          if (null === r) return
          const a = this._provider.firstValue()
          if (null === a) return
          const n = r.firstBar(),
            o = r.lastBar()
          i.forEach((i, r) => {
            const l = this._provider.properties().graphics.horizlines[r]
            l.visible.value() &&
              i.forEach(i => {
                const r = i.startIndex,
                  d = i.endIndex
                ;(!i.extendRight && Math.max(r, d) < n) ||
                  (!i.extendLeft && Math.min(r, d) > o) ||
                  this._data.push({
                    y: t.priceToCoordinate((0, s.ensureDefined)(i.level), a),
                    left: i.extendLeft ? void 0 : e.indexToCoordinate(r),
                    right: i.extendRight ? void 0 : e.indexToCoordinate(d),
                    color: l.color.value(),
                    linewidth: l.width.value(),
                    linestyle: l.style.value(),
                  })
              })
          })
        }
      }
    },
    54077: (t, e, i) => {
      i.r(e), i.d(e, { PolygonPaneView: () => d })
      var s = i(88537),
        r = i(86441),
        a = i(84346),
        n = i(94804),
        o = i(43891),
        l = i(2375)
      class d {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._hitTestResult =
              void 0 !== i
                ? new a.HitTestResult(a.HitTestResult.CUSTOM, i)
                : new a.HitTestResult(a.HitTestResult.REGULAR))
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated && (this._updateViewInternal(), (this._invalidated = !1))
          const t = new n.CompositeRenderer()
          for (const e of this._data) {
            const i = new l.PolygonRenderer(this._hitTestResult)
            i.setData(e), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphics().polygons()
          if (0 === i.size) return
          const a = this._model.timeScale().visibleBarsStrictRange()
          if (null === a) return
          const n = this._provider.firstValue()
          if (null === n) return
          const l = a.firstBar(),
            d = a.lastBar(),
            h = this._provider.properties().graphics.polygons,
            c = (0, s.ensureDefined)(this._provider.metaInfo().graphics.polygons)
          i.forEach((i, a) => {
            const u = h[a]
            100 !== u.transparency.value() &&
              i.forEach(i => {
                let h = 1 / 0,
                  p = -1 / 0
                for (const t of i.points) {
                  const e = t.index + (t.offset || 0)
                  ;(h = Math.min(h, e)), (p = Math.max(p, e))
                }
                if (p < l || d < h) return
                const _ = i.points.map(i => {
                  const a = e.indexToCoordinate(i.index + (i.offset || 0)),
                    o = t.priceToCoordinate((0, s.ensureDefined)(i.level), n)
                  return new r.Point(a, o)
                })
                this._data.push({
                  points: _,
                  color: u.color.value(),
                  backcolor: u.color.value(),
                  linewidth: void 0 !== u.showBorder && u.showBorder.value() ? 1 : 0,
                  linestyle: o.LINESTYLE_SOLID,
                  filled: !0,
                  fillBackground: !0,
                  transparency: u.transparency.value(),
                  mouseTouchable: (0, s.ensureDefined)(c[a]).mouseTouchable,
                })
              })
          })
        }
      }
    },
    59778: (t, e, i) => {
      i.r(e), i.d(e, { VertLinePaneView: () => l })
      var s = i(88537),
        r = i(84346),
        a = i(95936),
        n = i(94804),
        o = i(44349)
      class l {
        constructor(t, e, i) {
          ;(this._data = []),
            (this._invalidated = !0),
            (this._provider = t),
            (this._model = e),
            (this._hitTestResult =
              void 0 !== i
                ? new r.HitTestResult(r.HitTestResult.CUSTOM, i)
                : new r.HitTestResult(r.HitTestResult.REGULAR))
        }
        update() {
          this._invalidated = !0
        }
        renderer() {
          this._invalidated && (this._updateViewInternal(), (this._invalidated = !1))
          const t = new n.CompositeRenderer()
          for (const e of this._data) {
            const i = new o.VerticalLineRenderer()
            i.setData(e), i.setHitTest(this._hitTestResult), t.append(i)
          }
          return t
        }
        _updateViewInternal() {
          this._data = []
          const t = this._provider.priceScale(),
            e = this._model.timeScale()
          if (!t || t.isEmpty() || e.isEmpty()) return
          const i = this._provider.graphicsInfo().vertlines,
            r = this._provider.graphics().vertlines()
          if (0 === r.size || void 0 === i) return
          const n = this._model.timeScale().visibleBarsStrictRange()
          if (null === n) return
          const o = this._provider.firstValue()
          if (null === o) return
          const l = n.firstBar(),
            d = n.lastBar()
          r.forEach((r, n) => {
            const h = this._provider.properties().graphics.vertlines[n]
            if (!h.visible.value()) return
            let c = 0
            switch ((0, s.ensureDefined)(i[n]).halign) {
              case a.HAlign.Left:
                c = -e.barSpacing() / 2
                break
              case a.HAlign.Right:
                c = e.barSpacing() / 2
            }
            r.forEach(i => {
              const r = i.index
              r < l ||
                d < r ||
                this._data.push({
                  x: e.indexToCoordinate(r) + c,
                  top: i.extendTop ? void 0 : t.priceToCoordinate((0, s.ensureDefined)(i.endPrice), o),
                  bottom: i.extendBottom ? void 0 : t.priceToCoordinate((0, s.ensureDefined)(i.startPrice), o),
                  color: h.color.value(),
                  linewidth: h.width.value(),
                  linestyle: h.style.value(),
                })
            })
          })
        }
      }
    },
  },
])
