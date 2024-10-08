'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9498],
  {
    29630: (e, t, s) => {
      s.r(t), s.d(t, { exportData: () => d })
      var l = s(28353),
        i = s(88537),
        n = s(81688),
        a = s(71053),
        o = s(50993),
        c = s(9771),
        r = s(88129)
      const u = {
        includeTime: !0,
        includeUserTime: !1,
        includeSeries: !0,
        includeDisplayedValues: !1,
        includedStudies: 'all',
      }
      function d(e, t = {}) {
        const s = Object.assign({}, u, t),
          l = { schema: [], data: [], displayedData: [] },
          o = e.timeScale().points(),
          d = e.mainSeries(),
          h = (function (e, t) {
            const s = e.allStudies().filter(e => e.showInObjectTree())
            if ('all' === t) return s
            return s.filter(e => t.includes(e.id()))
          })(e, s.includedStudies),
          T = h.filter(e => e instanceof c.study_Overlay).map(e => e.data())
        ;(s.includeSeries || 0 === T.length) && T.push(d.bars())
        const g = (function (e, t, s, l) {
            const o = (0, i.ensureNotNull)(void 0 !== s ? e.indexOf(s, !0) : e.firstIndex()),
              c = (0, i.ensureNotNull)(void 0 !== l ? e.indexOf(l, !0) : e.lastIndex())
            let r = c,
              u = o
            for (const e of t) {
              const t = e.search(o, a.PlotRowSearchMode.NearestRight)
              null !== t && t.index < r && (r = t.index)
              const s = e.search(c, a.PlotRowSearchMode.NearestLeft)
              null !== s && s.index > u && (u = s.index)
            }
            return (0, i.assert)(r <= u, 'Range must contain at least 1 time point'), new n.BarsRange(r, u)
          })(o, T, s.from, s.to),
          y = g.firstBar(),
          P = g.lastBar()
        s.includeTime && l.schema.push({ type: 'time' })
        const S = l.schema.length
        s.includeUserTime && l.schema.push({ type: 'userTime' })
        const w = l.schema.length
        if (s.includeSeries) {
          const e = d.statusProvider({ hideResolution: !0 }).getSplitTitle(),
            t = Object.values(e)
              .filter(e => '' !== e)
              .join(', ')
          l.schema.push(p('open', t)),
            l.schema.push(p('high', t)),
            l.schema.push(p('low', t)),
            l.schema.push(p('close', t))
        }
        let v = l.schema.length
        const N = []
        for (const e of h) {
          const t = f(e)
          N.push(t), l.schema.push(...t.fields)
        }
        const x = l.schema.length
        if (0 === x) return l
        for (let e = y; e <= P; ++e) {
          const e = new Float64Array(x)
          e.fill(NaN), l.data.push(e), s.includeDisplayedValues && l.displayedData.push(new Array(x).fill(''))
        }
        if (s.includeTime || s.includeUserTime) {
          const t = e.timeScale(),
            n = e.dateTimeFormatter()
          for (let e = y; e <= P; ++e) {
            s.includeTime && (l.data[e - y][0] = (0, i.ensureNotNull)(o.valueAt(e)))
            const a = (0, i.ensureNotNull)(t.indexToUserTime(e))
            if ((s.includeUserTime && (l.data[e - y][S] = a.getTime() / 1e3), s.includeDisplayedValues)) {
              const t = n.format(a)
              s.includeTime && (l.displayedData[e - y][0] = t), s.includeUserTime && (l.displayedData[e - y][S] = t)
            }
          }
        }
        if (s.includeSeries) {
          const e = d.bars().range(y, P),
            t = (0, r.getPriceValueFormatterForSource)(d)
          e.each((e, i) => {
            const n = l.data[e - y],
              a = m(i[1]),
              o = m(i[2]),
              c = m(i[3]),
              r = m(i[4])
            if (((n[w] = a), (n[w + 1] = o), (n[w + 2] = c), (n[w + 3] = r), s.includeDisplayedValues)) {
              const s = l.displayedData[e - y]
              ;(s[w] = t(a)), (s[w + 1] = t(o)), (s[w + 2] = t(c)), (s[w + 3] = t(r))
            }
            return !1
          })
        }
        for (let e = 0; e < h.length; ++e) {
          const t = h[e],
            i = N[e],
            n = (0, r.getPriceValueFormatterForSource)(t)
          for (let e = 0; e < i.fields.length; ++e) {
            const a = i.fieldPlotOffsets[e],
              o = i.fieldToPlotIndex[e],
              c = y - a,
              r = P - a,
              u = v + e
            t.data()
              .range(c, r)
              .each((e, t) => {
                const i = l.data[e - c],
                  a = m(t[o])
                return (i[u] = a), s.includeDisplayedValues && (l.displayedData[e - c][u] = n(a)), !1
              })
          }
          v += i.fields.length
        }
        return l
      }
      function f(e) {
        const t = e.metaInfo(),
          s = { fieldToPlotIndex: [], fieldPlotOffsets: [], fields: [] },
          n = e.id(),
          a = e.title(!1, void 0, !1)
        for (let c = 0; c < t.plots.length; ++c) {
          const r = t.plots[c]
          let u,
            d = ''
          if ((0, o.isLinePlot)(r) || (0, o.isShapesPlot)(r) || (0, o.isCharsPlot)(r) || (0, o.isArrowsPlot)(r))
            u = (0, i.ensureDefined)(t.styles)[r.id]
          else if ((0, o.isOhlcPlot)(r))
            switch (((u = t.ohlcPlots && t.ohlcPlots[r.target]), r.type)) {
              case 'ohlc_open':
                d = ` (${(0, l.t)('Open')})`
                break
              case 'ohlc_high':
                d = ' (' + (0, l.t)('High')
                break
              case 'ohlc_low':
                d = ` (${(0, l.t)('Low')})`
                break
              case 'ohlc_close':
                d = ` (${(0, l.t)('Close')})`
            }
          if (void 0 === u || void 0 === u.title) continue
          const f = `${u.title}${d}`
          s.fields.push(h(n, a, f)), s.fieldToPlotIndex.push(c + 1), s.fieldPlotOffsets.push(e.offset(r.id))
        }
        return s
      }
      function h(e, t, s) {
        return { type: 'value', sourceType: 'study', sourceId: e, sourceTitle: t, plotTitle: s }
      }
      function p(e, t) {
        return { type: 'value', sourceType: 'series', plotTitle: e, sourceTitle: t }
      }
      function m(e) {
        return null != e ? e : NaN
      }
    },
  },
])
