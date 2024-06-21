'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2183],
  {
    49621: (t, e, i) => {
      i.d(e, { LineAnchorRenderer: () => y })
      var n = i(86441),
        s = i(34026),
        r = i(42759),
        o = i(80643),
        a = i(84346),
        l = i(56589),
        u = i(49094),
        d = i(88537)
      class c extends n.Point {
        constructor(t, e, i, n) {
          super(t, e), (this.data = i), (this.square = n)
        }
      }
      function h(t, e, i, n) {
        const s = i + n / 2
        ;(0, r.drawRoundRect)(t, e.x - s, e.y - s, 2 * s, 2 * s, (i + n) / 2), t.closePath(), (t.lineWidth = n)
      }
      function p(t, e, i, n) {
        ;(t.globalAlpha = 0.2), h(t, e, i, n), t.stroke(), (t.globalAlpha = 1)
      }
      function _(t, e, i, n) {
        h(t, e, i - n, n), t.fill(), t.stroke()
      }
      function P(t, e, i, n) {
        ;(t.globalAlpha = 0.2),
          t.beginPath(),
          t.arc(e.x, e.y, i + n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.stroke(),
          (t.globalAlpha = 1)
      }
      function g(t, e, i, n) {
        t.beginPath(),
          t.arc(e.x, e.y, i - n / 2, 0, 2 * Math.PI, !0),
          t.closePath(),
          (t.lineWidth = n),
          t.fill(),
          t.stroke()
      }
      class y {
        constructor(t) {
          this._data = null != t ? t : null
        }
        setData(t) {
          this._data = t
        }
        draw(t, e) {
          if (null === this._data || !this._data.visible) return
          const i = [],
            n = [],
            s = [],
            r = []
          for (let t = 0; t < this._data.points.length; ++t) {
            const e = this._data.points[t],
              o = this._data.backgroundColors[t]
            e.square ? (i.push(e), n.push(o)) : (s.push(e), r.push(o))
          }
          i.length && ((t.strokeStyle = this._data.color), this._drawPoints(t, e.pixelRatio, i, n, _, p)),
            s.length && ((t.strokeStyle = this._data.color), this._drawPoints(t, e.pixelRatio, s, r, g, P))
        }
        hitTest(t) {
          var e
          if (null === this._data || this._data.disableInteractions) return null
          const { radius: i, points: n, pointsCursorType: s, hittestResult: r } = this._data,
            o = (0, u.interactionTolerance)().anchor
          for (let u = 0; u < n.length; ++u) {
            const d = n[u]
            if (d.subtract(t).length() <= i + o)
              return new a.HitTestResult(Array.isArray(r) ? r[u] : r, {
                pointIndex: d.data,
                cursorType: null !== (e = null == s ? void 0 : s[u]) && void 0 !== e ? e : l.PaneCursorType.Default,
                activeItem: d.activeItem,
                snappingPrice: d.snappingPrice,
                snappingIndex: d.snappingIndex,
              })
          }
          return null
        }
        doesIntersectWithBox(t) {
          return null !== this._data && this._data.points.some(e => (0, s.pointInBox)(e, t))
        }
        _drawPoints(t, e, i, n, s, r) {
          const a = (0, d.ensureNotNull)(this._data),
            l = a.currentPoint,
            h = a.radius
          let p = Math.max(1, Math.floor((a.strokeWidth || 2) * e))
          a.selected && (p += Math.max(1, Math.floor(e / 2)))
          const _ = Math.max(1, Math.floor(e))
          let P = Math.round(h * e * 2)
          P % 2 != _ % 2 && (P += 1)
          const g = (_ % 2) / 2,
            y = (0, u.interactionTolerance)().anchor
          for (let u = 0; u < i.length; ++u) {
            const d = i[u]
            t.fillStyle = n[u]
            if (!((0, o.isInteger)(d.data) && a.linePointBeingEdited === d.data)) {
              if (
                (s(t, new c(Math.round(d.x * e) + g, Math.round(d.y * e) + g, d.data, d.square), P / 2, p),
                !a.disableInteractions)
              ) {
                if (d.subtract(l).length() <= h + y) {
                  const i = Math.max(1, Math.floor(a.selectedStrokeWidth * e))
                  let n = Math.round(h * e * 2)
                  n % 2 != _ % 2 && (n += 1)
                  r(t, new c(Math.round(d.x * e) + g, Math.round(d.y * e) + g, d.data, d.square), n / 2, i)
                }
              }
            }
          }
        }
      }
    },
    49101: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputPriceAxisPaneView: () => r })
      var n = i(87426),
        s = i(97938)
      class r extends s.PriceAxisView {
        constructor(t, e) {
          super(),
            (this._input = t),
            (this._getInputValue = e.getInputValue),
            (this._convertPriceToCoordinate = e.convertPriceToCoordinate),
            (this._formatPrice = e.formatPrice)
        }
        _updateRendererData(t, e, i) {
          t.visible = !1
          const s = this._getInputValue(this._input.id)
          if (null === s) return
          const r = this._convertPriceToCoordinate(s)
          if (null === r) return
          const o = n.axisLabelBackgroundColor.common
          ;(i.background = o),
            (i.textColor = this.generateTextColor(o)),
            (i.coordinate = r),
            (t.text = this._formatPrice(s)),
            (t.visible = !0)
        }
      }
    },
    98149: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputTimeAxisPaneView: () => r })
      var n = i(87426),
        s = i(85578)
      class r extends s.TimeAxisView {
        constructor(t, e, i) {
          super(e), (this._input = t), (this._getInputValue = i)
        }
        _getBgColor() {
          return n.axisLabelBackgroundColor.common
        }
        _getIndex() {
          const t = this._getInputValue(this._input.id)
          return null === t ? null : this._model.timeScale().timePointToIndex(t / 1e3)
        }
        _isVisible() {
          return !0
        }
      }
    },
    94497: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputsAnchorsPaneView: () => h })
      var n = i(86441),
        s = i(45112),
        r = i(71413),
        o = i(84346),
        a = i(56589),
        l = i(49621),
        u = i(71428)
      const d = s.colorsPalette['color-cold-gray-500'],
        c = s.colorsPalette['color-tv-blue-600']
      class h extends u.StudyInputsPaneView {
        constructor(t, e, i) {
          super(t, e, i),
            (this._editable = !0),
            (this._points = []),
            (this._cursors = []),
            (this._studyAnchorRenderers = []),
            (this._isSelected = i.isSelected ? i.isSelected : () => !0),
            (this._isHovered = i.isHovered ? i.isHovered : () => !0)
        }
        setEditable(t) {
          this._editable = t
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(t, e) {
          this._fillInformationAboutPointsAndCursors(t, e),
            this._renderer.append(
              this._createStudyAnchor({ points: this._points, pointsCursorType: this._cursors }, t, 0),
            )
        }
        _fillInformationAboutPointsAndCursors(t, e) {
          if (
            ((this._points = []), (this._cursors = []), this._inputs.find(t => Array.isArray(t) || 'price' === t.type))
          ) {
            if (null === this._convertPriceToCoordinate(0)) return
          }
          this._inputs.forEach((i, s) => {
            let r = a.PaneCursorType.Default,
              o = null,
              l = null,
              u = !0
            const d = i
            if (Array.isArray(i)) {
              const t = 'time' === i[0].type ? i[0] : i[1],
                e = 'price' === i[0].type ? i[0] : i[1],
                n = this._getInputValue(t.id),
                s = this._getInputValue(e.id)
              null !== n &&
                null !== s &&
                ((o = this._convertTimeToCoordinate(n)), (l = this._convertPriceToCoordinate(s)), (u = !1))
            } else {
              const n = this._getInputValue(i.id)
              null !== n &&
                ('time' === i.type
                  ? ((o = this._convertTimeToCoordinate(n)), (l = t / 2), (r = a.PaneCursorType.HorizontalResize))
                  : ((o = e / 2), (l = this._convertPriceToCoordinate(n)), (r = a.PaneCursorType.VerticalResize)))
            }
            if (null !== o && null !== l) {
              const t = new n.Point(o, l)
              ;(t.activeItem = d), (t.square = u), (t.data = s), this._points.push(t), this._cursors.push(r)
            }
          })
        }
        _createStudyAnchor(t, e, i) {
          const s = (0, r.lastMouseOrTouchEventInfo)().isTouch,
            a = this._getStudyAnchorRenderer(i),
            l = this._inputs.indexOf(this._model.activeItemBeingMoved()),
            u = this._model.crossHairSource(),
            h = (this._isHovered() || this._isSelected()) && !this._model.isSnapshot(),
            p = {
              ...t,
              color: this._editable ? c : d,
              backgroundColors: this._studyAnchorColors(t.points, e),
              currentPoint: new n.Point(u.originX(), u.originY()),
              linePointBeingEdited: -1 !== l ? l : null,
              hittestResult: o.HitTestResult.MOVEPOINT,
              radius: s ? 13 : 6,
              strokeWidth: s ? 2 : 1,
              selected: this._isSelected(),
              selectedStrokeWidth: s ? 0 : 3,
              visible: h,
            }
          return this._editable || (p.disableInteractions = !0), a.setData(p), a
        }
        _studyAnchorColors(t, e) {
          return t.map(t => this._model.backgroundColorAtYPercentFromTop(t.y / e))
        }
        _getStudyAnchorRenderer(t) {
          for (; this._studyAnchorRenderers.length <= t; ) this._studyAnchorRenderers.push(new l.LineAnchorRenderer())
          return this._studyAnchorRenderers[t]
        }
      }
    },
    26240: (t, e, i) => {
      i.r(e), i.d(e, { StudyInputsLinesPaneView: () => c })
      var n = i(45112),
        s = i(43891),
        r = i(84346),
        o = i(56589),
        a = i(40254),
        l = i(44349),
        u = i(71428)
      const d = { color: n.colorsPalette['color-cold-gray-500'], linewidth: 1, linestyle: s.LINESTYLE_SOLID }
      class c extends u.StudyInputsPaneView {
        constructor() {
          super(...arguments), (this._editable = !0)
        }
        setEditable(t) {
          this._editable = t
        }
        getEditable() {
          return this._editable
        }
        _fillCompositeRendrer(t, e) {
          this._inputs.forEach(t => {
            if (Array.isArray(t)) {
              const e = t[0],
                i = t[1],
                n = this._getInputValue(e.id),
                s = this._getInputValue(i.id)
              if (null !== n && null !== s) {
                const t = this._createLineRendererForinput(n, e),
                  r = this._createLineRendererForinput(s, i)
                null !== t && null !== r && (this._renderer.append(t), this._renderer.append(r))
              }
            } else {
              const e = this._getInputValue(t.id)
              if (null !== e) {
                const i = this._createLineRendererForinput(e, t)
                null !== i && this._renderer.append(i)
              }
            }
          })
        }
        _createLineRendererForinput(t, e) {
          if ('price' === e.type) {
            const i = this._convertPriceToCoordinate(t)
            if (null !== i) {
              const t = new a.HorizontalLineRenderer()
              t.setData({ ...d, y: i })
              const n = this._editable
                ? new r.HitTestResult(r.HitTestResult.MOVEPOINT, {
                    cursorType: o.PaneCursorType.VerticalResize,
                    activeItem: e,
                  })
                : null
              return t.setHitTest(n), t
            }
          } else if ('time' === e.type) {
            const i = this._convertTimeToCoordinate(t)
            if (null !== i) {
              const t = new l.VerticalLineRenderer()
              t.setData({ ...d, x: i })
              const n = this._editable
                ? new r.HitTestResult(r.HitTestResult.MOVEPOINT, {
                    cursorType: o.PaneCursorType.HorizontalResize,
                    activeItem: e,
                  })
                : null
              return t.setHitTest(n), t
            }
          }
          return null
        }
      }
    },
    71428: (t, e, i) => {
      i.d(e, { StudyInputsPaneView: () => r })
      var n = i(88537),
        s = i(94804)
      class r {
        constructor(t, e, i) {
          ;(this._renderer = new s.CompositeRenderer()),
            (this._invalidated = !0),
            (this._inputs = t),
            (this._model = e),
            (this._convertPriceToCoordinate = i.convertPriceToCoordinate),
            (this._getInputValue = i.getInputValue)
        }
        getInputs() {
          return this._inputs
        }
        addInput(t) {
          ;(0, n.assert)(-1 === this._inputs.indexOf(t), 'Pane view already contains specified input'),
            this._inputs.push(t),
            this.update()
        }
        update(t) {
          this._invalidated = !0
        }
        renderer(t, e) {
          return this._invalidated && (this._updateImpl(t, e), (this._invalidated = !1)), this._renderer
        }
        _updateImpl(t, e) {
          this._renderer.clear()
          this._model.timeScale().isEmpty() || 0 === this._inputs.length || this._fillCompositeRendrer(t, e)
        }
        _convertTimeToCoordinate(t) {
          const e = this._model.timeScale(),
            i = e.timePointToIndex(t / 1e3)
          return null !== i ? e.indexToCoordinate(i) : null
        }
      }
    },
  },
])
