'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4079],
  {
    26868: (t, e, i) => {
      var a = i(86441).Point,
        s = i(28353).t,
        r = i(94804).CompositeRenderer,
        l = i(1860).DateFormatter,
        n = i(64806).TimeFormatter,
        d = i(93435).calcTextHorizontalShift,
        o = i(62820).isRtl,
        h = i(22799).CHART_FONT_FAMILY,
        _ = i(16282).ScaledPaneRenderer
      class m extends _ {
        constructor() {
          super(), (this._data = null)
        }
        setData(t) {
          this._data = t
        }
        hitTest() {
          return null
        }
        _drawImpl(t) {
          if (null !== this._data) {
            var e = Math.round(4.5),
              i = 0
            t.save(), t.setFont('12px ' + h)
            var a = s('Last available bar')
            if (this._data.eod) i = t.measureText(a).width
            else {
              var r = t.measureText(this._data.dateString || '').width,
                l = t.measureText(this._data.timeString || '').width
              i = Math.max(r, l)
            }
            var n = this._data.timeString ? 2 : 1,
              _ = document.querySelector('html').classList.contains('theme-dark')
            ;(t.fillStyle = _ ? '#50535E' : '#2A2E39'), t.translate(this._data.point.x + 0.5, this._data.point.y + 0.5)
            var m = Math.round(-i / 2) - 8,
              u = -17 * n - 8 - 4 - 5,
              T = Math.round(m + i + 16)
            if (
              (t.beginPath(),
              t.moveTo(m + 2, u),
              t.lineTo(T - 2, u),
              t.arcTo(T, u, T, u + 2, 2),
              t.lineTo(T, -11),
              t.arcTo(T, -9, T - 2, -9, 2),
              t.lineTo(6, -9),
              t.lineTo(0, -5),
              t.lineTo(-6, -9),
              t.lineTo(m + 2, -9),
              t.arcTo(m, -9, m, -11, 2),
              t.lineTo(m, u + 2),
              t.arcTo(m, u, m + 2, u, 2),
              t.fill(),
              (t.fillStyle = '#F0F3FA'),
              (t.textBaseline = 'middle'),
              (t.textAlign = o() ? 'right' : 'left'),
              this._data.eod)
            ) {
              var c = d(t, i)
              t.fillText(a, m + 8 + c, u + (-9 - u) / 2)
            } else {
              var v = m + 8 + (i - r) / 2,
                f = d(t, r)
              if ((t.fillText(this._data.dateString, v + f, u + e + 8), this._data.timeString)) {
                var g = d(t, l),
                  p = m + 8 + (i - l) / 2
                t.fillText(this._data.timeString, p + g, u + 17 * n - e)
              }
            }
            t.restore()
          }
        }
      }
      t.exports.GotoDateView = class {
        constructor(t, e) {
          ;(this._gotoDateResult = e), (this._series = t), (this._invalidated = !0), (this._renderer = new m())
        }
        update() {
          this._invalidated = !0
        }
        updateImpl() {
          delete this._point, delete this._dateString, delete this._timeString, delete this._eod
          var t = this._series.model().timeScale().timePointToIndex(this._gotoDateResult.timestamp),
            e = this._series.bars(),
            i = null
          if (
            (t < e.firstIndex() && null !== e.first()
              ? ((t = e.firstIndex()), (i = e.first().value))
              : t > e.lastIndex() && null !== e.last()
              ? ((t = e.lastIndex()), (i = e.last().value))
              : (i = e.valueAt(t)),
            null !== i)
          ) {
            var s = this._series.firstValue()
            if (null != s) {
              var r = this._series.priceScale().priceToCoordinate(i[TradingView.HIGH_PLOT], s),
                d = this._series.model().timeScale().indexToCoordinate(t)
              if (((this._point = new a(d, r)), this._gotoDateResult.eod)) this._eod = !0
              else {
                var o = this._series.model().timeScale().indexToUserTime(t)
                ;(this._dateString = new l().format(o)), this._series.isDWM() || (this._timeString = new n().format(o))
              }
            }
          }
        }
        renderer() {
          return (
            this._invalidated && (this.updateImpl(), (this._invalidated = !1)),
            this._point
              ? (this._renderer.setData({
                  point: this._point,
                  dateString: this._dateString,
                  timeString: this._timeString,
                  eod: this._eod,
                }),
                this._renderer)
              : new r()
          )
        }
      }
    },
  },
])
