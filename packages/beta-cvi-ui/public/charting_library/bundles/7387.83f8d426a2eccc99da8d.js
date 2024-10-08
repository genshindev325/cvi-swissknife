'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7387],
  {
    16717: (e, i, t) => {
      t.d(i, { getSeriesStylePropertiesDefinitions: () => me })
      var n = t(88537),
        o = t(28353),
        r = t(24980),
        s = t(50366),
        l = t(37667),
        a = t(52714),
        c = t.n(a),
        d = t(67337),
        h = t(37787),
        p = t(80054)
      const g = new r.TranslatedString(
          'change color bars based on previous close',
          (0, o.t)('change color bars based on previous close'),
        ),
        u = new r.TranslatedString('change HLC bars', (0, o.t)('change HLC bars')),
        y = new r.TranslatedString('change bar up color', (0, o.t)('change bar up color')),
        f = new r.TranslatedString('change bar down color', (0, o.t)('change bar down color')),
        b = new r.TranslatedString('change thin bars', (0, o.t)('change thin bars')),
        S = new r.TranslatedString('change line price source', (0, o.t)('change line price source')),
        w = new r.TranslatedString('change line type', (0, o.t)('change line type')),
        T = new r.TranslatedString('change line color', (0, o.t)('change line color')),
        P = new r.TranslatedString('change line width', (0, o.t)('change line width')),
        m = new r.TranslatedString('change area price source', (0, o.t)('change area price source')),
        v = new r.TranslatedString('change area line color', (0, o.t)('change area line color')),
        D = new r.TranslatedString('change area line width', (0, o.t)('change area line width')),
        _ = new r.TranslatedString('change area fill color', (0, o.t)('change area fill color')),
        C = new r.TranslatedString('change baseline price source', (0, o.t)('change baseline price source')),
        k = new r.TranslatedString('change baseline top line color', (0, o.t)('change baseline top line color')),
        M = new r.TranslatedString('change baseline top line width', (0, o.t)('change baseline top line width')),
        L = new r.TranslatedString('change baseline bottom line color', (0, o.t)('change baseline bottom line color')),
        I = new r.TranslatedString('change baseline bottom line width', (0, o.t)('change baseline bottom line width')),
        E = new r.TranslatedString(
          'change baseline fill top area color',
          (0, o.t)('change baseline fill top area color'),
        ),
        O = new r.TranslatedString(
          'change baseline fill bottom area color',
          (0, o.t)('change baseline fill bottom area color'),
        ),
        x = new r.TranslatedString('change base level', (0, o.t)('change base level')),
        B = new r.TranslatedString('change high-low body visibility', (0, o.t)('change high-low body visibility')),
        W = new r.TranslatedString('change high-low body color', (0, o.t)('change high-low body color')),
        V = new r.TranslatedString(
          'change high-low borders visibility',
          (0, o.t)('change high-low borders visibility'),
        ),
        H = new r.TranslatedString('change high-low border color', (0, o.t)('change high-low border color')),
        $ = new r.TranslatedString('change high-low labels visibility', (0, o.t)('change high-low labels visibility')),
        A = new r.TranslatedString('change high-low labels color', (0, o.t)('change high-low labels color')),
        j = new r.TranslatedString('change high-low labels font size', (0, o.t)('change high-low labels font size')),
        N =
          (new r.TranslatedString('change renko wick visibility', (0, o.t)('change renko wick visibility')),
          new r.TranslatedString('change renko wick up color', (0, o.t)('change renko wick up color')),
          new r.TranslatedString('change renko wick down color', (0, o.t)('change renko wick down color')),
          new r.TranslatedString(
            'change the display of real prices on price scale (instead of Heiken-Ashi price)',
            (0, o.t)('change the display of real prices on price scale (instead of Heiken-Ashi price)'),
          ),
          new r.TranslatedString('change range thin bars', (0, o.t)('change range thin bars')),
          new r.TranslatedString(
            'change {candleType} body visibility',
            (0, o.t)('change {candleType} body visibility'),
          )),
        F = new r.TranslatedString('change {candleType} up color', (0, o.t)('change {candleType} up color')),
        z = new r.TranslatedString('change {candleType} down color', (0, o.t)('change {candleType} down color')),
        R = new r.TranslatedString(
          'change {candleType} border visibility',
          (0, o.t)('change {candleType} border visibility'),
        ),
        U = new r.TranslatedString(
          'change {candleType} up border color',
          (0, o.t)('change {candleType} up border color'),
        ),
        Y = new r.TranslatedString(
          'change {candleType} down border color',
          (0, o.t)('change {candleType} down border color'),
        ),
        G = new r.TranslatedString(
          'change {candleType} wick visibility',
          (0, o.t)('change {candleType} wick visibility'),
        ),
        J = new r.TranslatedString('change {candleType} wick up color', (0, o.t)('change {candleType} wick up color')),
        K = new r.TranslatedString(
          'change {candleType} wick down color',
          (0, o.t)('change {candleType} wick down color'),
        ),
        q =
          (new r.TranslatedString('change {chartType} up color', (0, o.t)('change {chartType} up color')),
          new r.TranslatedString('change {chartType} down color', (0, o.t)('change {chartType} down color')),
          new r.TranslatedString(
            'change {chartType} projection bar up color',
            (0, o.t)('change {chartType} projection bar up color'),
          ),
          new r.TranslatedString(
            'change {chartType} projection bar down color',
            (0, o.t)('change {chartType} projection bar down color'),
          ),
          new r.TranslatedString(
            'change {chartType} border bar up color',
            (0, o.t)('change {chartType} border bar up color'),
          ),
          new r.TranslatedString(
            'change {chartType} border bar down color',
            (0, o.t)('change {chartType} border bar down color'),
          ),
          new r.TranslatedString(
            'change {chartType} projection border bar up color',
            (0, o.t)('change {chartType} projection border bar up color'),
          ),
          new r.TranslatedString(
            'change {chartType} projection border bar up color',
            (0, o.t)('change {chartType} projection border bar up color'),
          ),
          new r.TranslatedString('change column up color', (0, o.t)('change column up color'))),
        Q = new r.TranslatedString('change column down color', (0, o.t)('change column down color')),
        X = new r.TranslatedString('change column price source', (0, o.t)('change column price source')),
        Z = (0, o.t)('Color bars based on previous close'),
        ee = (0, o.t)('HLC bars'),
        ie = (0, o.t)('Up color'),
        te = (0, o.t)('Down color'),
        ne = (0, o.t)('Thin bars'),
        oe = (0, o.t)('Body'),
        re = (0, o.t)('Borders'),
        se = (0, o.t)('Wick'),
        le = (0, o.t)('Price source'),
        ae = (0, o.t)('Type'),
        ce = (0, o.t)('Line'),
        de = (0, o.t)('Top line'),
        he = (0, o.t)('Bottom line'),
        pe = (0, o.t)('Fill'),
        ge = (0, o.t)('Fill top area'),
        ue = (0, o.t)('Fill bottom area'),
        ye =
          ((0, o.t)('Up bars'),
          (0, o.t)('Down bars'),
          (0, o.t)('Projection up bars'),
          (0, o.t)('Projection down bars'),
          (0, o.t)('Real prices on price scale (instead of Heikin-Ashi price)'),
          (0, o.t)('Base level')),
        fe = (0, o.t)('Body'),
        be = (0, o.t)('Borders'),
        Se = (0, o.t)('Labels')
      function we(e, i, t, n) {
        return (0, s.createCheckablePropertyDefinition)(
          { checked: (0, s.convertToDefinitionProperty)(e, i.barColorsOnPrevClose, g) },
          { id: `${t}${n}`, title: Z },
        )
      }
      function Te(e, i, t, n, o, r) {
        return (0, s.createOptionsPropertyDefinition)(
          { option: (0, s.convertToDefinitionProperty)(e, i.priceSource, r) },
          { id: `${n}${o}`, title: le, options: new (c())(t) },
        )
      }
      function Pe(e, i, t, n) {
        const o = (0, p.removeSpaces)(t.originalText())
        return [
          (0, s.createTwoColorsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(e, i.drawBody, N.format({ candleType: t })),
              color1: (0, s.getColorDefinitionProperty)(e, i.upColor, null, F.format({ candleType: t })),
              color2: (0, s.getColorDefinitionProperty)(e, i.downColor, null, z.format({ candleType: t })),
            },
            { id: `${n}Symbol${o}CandlesColor`, title: oe },
          ),
          (0, s.createTwoColorsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(e, i.drawBorder, R.format({ candleType: t })),
              color1: (0, s.getColorDefinitionProperty)(e, i.borderUpColor, null, U.format({ candleType: t })),
              color2: (0, s.getColorDefinitionProperty)(e, i.borderDownColor, null, Y.format({ candleType: t })),
            },
            { id: `${n}Symbol${o}BordersColor`, title: re },
          ),
          (0, s.createTwoColorsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(e, i.drawWick, G.format({ candleType: t })),
              color1: (0, s.getColorDefinitionProperty)(e, i.wickUpColor, null, J.format({ candleType: t })),
              color2: (0, s.getColorDefinitionProperty)(e, i.wickDownColor, null, K.format({ candleType: t })),
            },
            { id: `${n}Symbol${o}WickColors`, title: se },
          ),
        ]
      }
      function me(e, i, t, a, p) {
        switch (t) {
          case 0:
            return (function (e, i, t) {
              return [
                we(e, i, t, 'SymbolBarStyleBarColorsOnPrevClose'),
                (0, s.createCheckablePropertyDefinition)(
                  { checked: (0, s.convertToDefinitionProperty)(e, i.dontDrawOpen, u) },
                  { id: t + 'SymbolDontDrawOpen', title: ee },
                ),
                (0, s.createColorPropertyDefinition)(
                  { color: (0, s.getColorDefinitionProperty)(e, i.upColor, null, y) },
                  { id: t + 'SymbolUpColor', title: ie },
                ),
                (0, s.createColorPropertyDefinition)(
                  { color: (0, s.getColorDefinitionProperty)(e, i.downColor, null, f) },
                  { id: t + 'SymbolDownColor', title: te },
                ),
                (0, s.createCheckablePropertyDefinition)(
                  { checked: (0, s.convertToDefinitionProperty)(e, i.thinBars, b) },
                  { id: t + 'SymbolBarThinBars', title: ne },
                ),
              ]
            })(e, i.barStyle.childs(), p)
          case 1:
            return (function (e, i, t) {
              return [
                we(e, i, t, 'SymbolCandleStyleBarColorsOnPrevClose'),
                ...Pe(e, i, new r.TranslatedString('candle', (0, o.t)('candle')), t),
              ]
            })(e, i.candleStyle.childs(), p)
          case 2:
            return (function (e, i, t, n, o) {
              return [
                Te(e, i, t, o, 'SymbolLinePriceSource', S),
                (0, s.createOptionsPropertyDefinition)(
                  { option: (0, s.convertToDefinitionProperty)(e, i.styleType, w) },
                  { id: o + 'SymbolStyleType', title: ae, options: new (c())(n) },
                ),
                (0, s.createLinePropertyDefinition)(
                  {
                    color: (0, s.getColorDefinitionProperty)(e, i.color, null, T),
                    width: (0, s.convertToDefinitionProperty)(e, i.linewidth, P),
                  },
                  { id: o + 'SymbolLineStyle', title: ce },
                ),
              ]
            })(e, i.lineStyle.childs(), a.seriesPriceSources, a.lineStyleTypes, p)
          case 3:
            return (function (e, i, t, n) {
              return [
                Te(e, i, t, n, 'SymbolAreaPriceSource', m),
                (0, s.createLinePropertyDefinition)(
                  {
                    color: (0, s.getColorDefinitionProperty)(e, i.linecolor, null, v),
                    width: (0, s.convertToDefinitionProperty)(e, i.linewidth, D),
                  },
                  { id: n + 'SymbolAreaLineStyle', title: ce },
                ),
                (0, s.createTwoColorsPropertyDefinition)(
                  {
                    color1: (0, s.getColorDefinitionProperty)(e, i.color1, i.transparency, _),
                    color2: (0, s.getColorDefinitionProperty)(e, i.color2, i.transparency, _),
                  },
                  { id: n + 'SymbolAreaFills', title: pe },
                ),
              ]
            })(e, i.areaStyle.childs(), a.seriesPriceSources, p)
          case 9:
            return Pe(
              e,
              i.hollowCandleStyle.childs(),
              new r.TranslatedString('hollow candles', (0, o.t)('hollow candles')),
              p,
            )
          case 10:
            return (function (e, i, t, n) {
              return [
                Te(e, i, t, n, 'SymbolBaseLinePriceSource', C),
                (0, s.createLinePropertyDefinition)(
                  {
                    color: (0, s.getColorDefinitionProperty)(e, i.topLineColor, null, k),
                    width: (0, s.convertToDefinitionProperty)(e, i.topLineWidth, M),
                  },
                  { id: n + 'SymbolBaseLineTopLine', title: de },
                ),
                (0, s.createLinePropertyDefinition)(
                  {
                    color: (0, s.getColorDefinitionProperty)(e, i.bottomLineColor, null, L),
                    width: (0, s.convertToDefinitionProperty)(e, i.bottomLineWidth, I),
                  },
                  { id: n + 'SymbolBaseLineBottomLine', title: he },
                ),
                (0, s.createTwoColorsPropertyDefinition)(
                  {
                    color1: (0, s.getColorDefinitionProperty)(e, i.topFillColor1, null, E),
                    color2: (0, s.getColorDefinitionProperty)(e, i.topFillColor2, null, E),
                  },
                  { id: n + 'SymbolBaseLineTopFills', title: ge },
                ),
                (0, s.createTwoColorsPropertyDefinition)(
                  {
                    color1: (0, s.getColorDefinitionProperty)(e, i.bottomFillColor1, null, O),
                    color2: (0, s.getColorDefinitionProperty)(e, i.bottomFillColor2, null, O),
                  },
                  { id: n + 'SymbolBaseLineBottomFills', title: ue },
                ),
                (0, s.createNumberPropertyDefinition)(
                  { value: (0, s.convertToDefinitionProperty)(e, i.baseLevelPercentage, x, [h.floor]) },
                  {
                    id: n + 'SymbolBaseLevelPercentage',
                    title: ye,
                    type: 0,
                    min: new (c())(0),
                    max: new (c())(100),
                    step: new (c())(1),
                    unit: new (c())('%'),
                  },
                ),
              ]
            })(e, i.baselineStyle.childs(), a.seriesPriceSources, p)
          case 13:
            return (function (e, i, t, n) {
              return [
                Te(e, i, t, n, 'SymbolColumnPriceSource', X),
                we(e, i, n, 'SymbolColumnStyleColumnColorsOnPrevClose'),
                (0, s.createColorPropertyDefinition)(
                  { color: (0, s.getColorDefinitionProperty)(e, i.upColor, null, q) },
                  { id: n + 'SymbolUpColor', title: ie },
                ),
                (0, s.createColorPropertyDefinition)(
                  { color: (0, s.getColorDefinitionProperty)(e, i.downColor, null, Q) },
                  { id: n + 'SymbolDownColor', title: te },
                ),
              ]
            })(e, i.columnStyle.childs(), a.seriesPriceSources, p)
        }
        if (!i.hasOwnProperty('haStyle')) return []
        if (a.isJapaneseChartsAvailable && 8 === t) {
          return (function (e, i, t) {
            const n = []
            return (
              n.push(
                we(e, i, t, 'SymbolHAStyleBarColorsOnPrevClose'),
                ...Pe(e, i, new r.TranslatedString('Heikin Ashi', (0, o.t)('Heikin Ashi')), t),
              ),
              n
            )
          })(e, i.haStyle.childs(), p)
        }
        a.isJapaneseChartsAvailable && d.enabled('japanese_chart_styles')
        if (d.enabled('chart_style_hilo') && 12 === t) {
          const t = i.hiloStyle.childs(),
            o = (0, l.chartStyleStudyId)(12)
          return (function (e, i, t, n) {
            const o = (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(e, i.drawBody, B),
                  color: (0, s.getColorDefinitionProperty)(e, i.color, null, W),
                },
                { id: n + 'SymbolBodiesColor', title: fe },
              ),
              r = (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(e, i.showBorders, V),
                  color: (0, s.getColorDefinitionProperty)(e, i.borderColor, null, H),
                },
                { id: n + 'SymbolBorderColor', title: be },
              ),
              l = t.map(e => ({ title: String(e), value: e }))
            return [
              o,
              r,
              (0, s.createTextPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(e, i.showLabels, $),
                  color: (0, s.getColorDefinitionProperty)(e, i.labelColor, null, A),
                  size: (0, s.convertToDefinitionProperty)(e, i.fontSize, j),
                },
                { id: n + 'SymbolLabels', title: Se, isEditable: !1, isMultiLine: !1, sizeItems: l },
              ),
            ]
          })(e, t, (0, n.ensure)(a.defaultSeriesFontSizes)[o], p)
        }
        return []
      }
    },
    87387: (e, i, t) => {
      t.d(i, {
        SeriesPropertyDefinitionsViewModel: () => ce,
        basePriceSources: () => se,
        lineStyleTypes: () => le,
        seriesPrecisionValues: () => ae,
      })
      var n = t(88537),
        o = t(28353),
        r = t(24980),
        s = t(67337),
        l = t(50366),
        a = (t(32449), t(52714)),
        c = t.n(a),
        d = t(37667),
        h = t(16654),
        p = t(16717),
        g = t(37787)
      const u = new r.TranslatedString('change {inputName} property', (0, o.t)('change {inputName} property'))
      function y(e) {
        return e.map(e => ({ value: e, title: (0, o.t)(e) }))
      }
      function f(e, i, t, s, a, h, p) {
        const f = []
        return (
          t.forEach(t => {
            if (
              !(function (e, i) {
                return (
                  !e.isHidden &&
                  (void 0 === e.visible ||
                    (function (e, i) {
                      if (!e) return !0
                      const t = e.split('==')
                      return !(t.length < 2) && i[t[0]].value() === t[1]
                    })(e.visible, i))
                )
              })(t, s)
            )
              return
            const b = t.id
            if (!s.hasOwnProperty(b)) return
            const S = s[b],
              w = (function (e, i) {
                return 'style' === e.id
                  ? 'Box size assignment method'
                  : 'boxSize' === e.id
                  ? 'Box size'
                  : i.childs().name.value()
              })(t, a[b]),
              T = (function (e) {
                return (0, o.t)(e)
              })(w),
              P = new r.TranslatedString(w, T)
            if ('options' in t) {
              const i = (0, n.ensure)(t.options)
              f.push(
                (0, l.createOptionsPropertyDefinition)(
                  { option: (0, l.convertToDefinitionProperty)(e, S, u.format({ inputName: P })) },
                  { id: `${p}${t.name}`, title: T, options: new (c())(y(i)) },
                ),
              )
            } else if ('integer' !== t.type) {
              if ('float' === t.type) {
                let n
                return (
                  (n =
                    (function (e, i) {
                      return !(
                        ((i === (0, d.chartStyleStudyId)(4) || i === (0, d.chartStyleStudyId)(6)) && 'boxSize' === e) ||
                        (i === (0, d.chartStyleStudyId)(5) && 'reversalAmount' === e)
                      )
                    })(b, i) || null === h.value()
                      ? new (c())(t.min)
                      : h),
                  void f.push(
                    (0, l.createNumberPropertyDefinition)(
                      { value: (0, l.convertToDefinitionProperty)(e, S, u.format({ inputName: P })) },
                      { id: `${p}${t.name}`, title: T, type: 1, min: n, max: new (c())(t.max), defval: t.defval },
                    ),
                  )
                )
              }
              'text' !== t.type
                ? 'bool' !== t.type ||
                  f.push(
                    (0, l.createCheckablePropertyDefinition)(
                      { checked: (0, l.convertToDefinitionProperty)(e, S, u.format({ inputName: P })) },
                      { id: `${p}${t.name}`, title: T },
                    ),
                  )
                : f.push(
                    (0, l.createTextPropertyDefinition)(
                      { text: (0, l.convertToDefinitionProperty)(e, S, u.format({ inputName: P })) },
                      { id: `${p}${t.name}`, title: T, isEditable: !0, isMultiLine: !1 },
                    ),
                  )
            } else
              f.push(
                (0, l.createNumberPropertyDefinition)(
                  { value: (0, l.convertToDefinitionProperty)(e, S, u.format({ inputName: P }), [g.floor]) },
                  {
                    id: `${p}${t.name}`,
                    title: T,
                    type: 0,
                    min: new (c())(t.min),
                    max: new (c())(t.max),
                    defval: t.defval,
                  },
                ),
              )
          }),
          f
        )
      }
      var b = t(98125),
        S = t(88461),
        w = t(81465),
        T = t(54089),
        P = t(56450)
      const m = (0, b.getLogger)('Chart.Definitions.Series'),
        v = s.enabled('show_average_close_price_line_and_label'),
        D = s.enabled('pre_post_market_sessions'),
        _ = new r.TranslatedString('change decimal places', (0, o.t)('change decimal places')),
        C = new r.TranslatedString('change timezone', (0, o.t)('change timezone')),
        k =
          (new r.TranslatedString('adjust data for dividends', (0, o.t)('adjust data for dividends')),
          new r.TranslatedString(
            'use settlement as close on daily interval',
            (0, o.t)('use settlement as close on daily interval'),
          ),
          new r.TranslatedString('adjust for contract changes', (0, o.t)('adjust for contract changes')),
          new r.TranslatedString('change session', (0, o.t)('change session'))),
        M = new r.TranslatedString('change extended hours color', (0, o.t)('change extended hours color')),
        L = new r.TranslatedString('change pre market color', (0, o.t)('change pre market color')),
        I = new r.TranslatedString('change post market color', (0, o.t)('change post market color')),
        E = new r.TranslatedString('change price line visibility', (0, o.t)('change price line visibility')),
        O = new r.TranslatedString('change price line color', (0, o.t)('change price line color')),
        x = new r.TranslatedString('change price line width', (0, o.t)('change price line width')),
        B =
          (new r.TranslatedString(
            'change previous close price line visibility',
            (0, o.t)('change previous close price line visibility'),
          ),
          new r.TranslatedString(
            'change previous close price line color',
            (0, o.t)('change previous close price line color'),
          ),
          new r.TranslatedString(
            'change previous close price line width',
            (0, o.t)('change previous close price line width'),
          ),
          new r.TranslatedString(
            'change pre/post market price lines visibility',
            (0, o.t)('change pre/post market price lines visibility'),
          ),
          new r.TranslatedString('change pre market line color', (0, o.t)('change pre market line color')),
          new r.TranslatedString('change post market line color', (0, o.t)('change post market line color')),
          new r.TranslatedString(
            'change bid and ask lines visibility',
            (0, o.t)('change bid and ask lines visibility'),
          ),
          new r.TranslatedString('change bid line color', (0, o.t)('change bid line color')),
          new r.TranslatedString('change ask line color', (0, o.t)('change ask line color')),
          new r.TranslatedString(
            'change high and low price lines visibility',
            (0, o.t)('change high and low price lines visibility'),
          )),
        W = new r.TranslatedString(
          'change high and low price line color',
          (0, o.t)('change high and low price line color'),
        ),
        V = new r.TranslatedString(
          'change high and low price line width',
          (0, o.t)('change high and low price line width'),
        ),
        H = new r.TranslatedString(
          'change average close price line visibility',
          (0, o.t)('change average close price line visibility'),
        ),
        $ = new r.TranslatedString(
          'change average close price line color',
          (0, o.t)('change average close price line color'),
        ),
        A = new r.TranslatedString(
          'change average close price line width',
          (0, o.t)('change average close price line width'),
        ),
        j = ((0, o.t)('Adjust data for dividends'), (0, o.t)('Session')),
        N =
          ((0, o.t)('Adjust for contract changes'),
          (0, o.t)('Use settlement as close on daily interval'),
          (0, o.t)('Pre/post market hours background')),
        F = (0, o.t)('Last price line'),
        z =
          ((0, o.t)('Previous day close price line'),
          (0, o.t)('Bid and ask lines'),
          (0, o.t)('Pre/post market price line'),
          (0, o.t)('Precision')),
        R = (0, o.t)('Timezone'),
        U = (0, o.t)('Open'),
        Y = (0, o.t)('High'),
        G = (0, o.t)('Low'),
        J = (0, o.t)('Close'),
        K = (0, o.t)('(H + L)/2'),
        q = (0, o.t)('(H + L + C)/3'),
        Q = (0, o.t)('(O + H + L + C)/4'),
        X = (0, o.t)('Simple'),
        Z = (0, o.t)('With markers'),
        ee = (0, o.t)('Step'),
        ie = (0, o.t)('Default'),
        te = (0, o.t)('High and low price lines'),
        ne = (0, o.t)('Average close price line'),
        oe = { [(0, d.chartStyleStudyId)(12)]: [7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 40] },
        re = [
          { priceScale: 1, minMove: 1, frac: !1 },
          { priceScale: 10, minMove: 1, frac: !1 },
          { priceScale: 100, minMove: 1, frac: !1 },
          { priceScale: 1e3, minMove: 1, frac: !1 },
          { priceScale: 1e4, minMove: 1, frac: !1 },
          { priceScale: 1e5, minMove: 1, frac: !1 },
          { priceScale: 1e6, minMove: 1, frac: !1 },
          { priceScale: 1e7, minMove: 1, frac: !1 },
          { priceScale: 1e8, minMove: 1, frac: !1 },
          { priceScale: 1e9, minMove: 1, frac: !1 },
          { priceScale: 1e10, minMove: 1, frac: !1 },
          { priceScale: 2, minMove: 1, frac: !0 },
          { priceScale: 4, minMove: 1, frac: !0 },
          { priceScale: 8, minMove: 1, frac: !0 },
          { priceScale: 16, minMove: 1, frac: !0 },
          { priceScale: 32, minMove: 1, frac: !0 },
          { priceScale: 64, minMove: 1, frac: !0 },
          { priceScale: 128, minMove: 1, frac: !0 },
          { priceScale: 320, minMove: 1, frac: !0 },
        ],
        se = [
          { title: U, value: 'open', id: 'price-source-open' },
          { title: Y, value: 'high', id: 'price-source-high' },
          { title: G, value: 'low', id: 'price-source-low' },
          { title: J, value: 'close', id: 'price-source-close' },
          { title: K, value: 'hl2', id: 'price-source-hl2' },
          { title: q, value: 'hlc3', id: 'price-source-hlc3' },
          { title: Q, value: 'ohlc4', id: 'price-source-ohlc4' },
        ],
        le = [
          { title: X, value: h.STYLE_LINE_TYPE_SIMPLE },
          { title: Z, value: h.STYLE_LINE_TYPE_MARKERS },
          { title: ee, value: h.STYLE_LINE_TYPE_STEP },
        ]
      function ae() {
        const e = [{ title: ie, value: 'default' }]
        for (let i = 0; i < re.length; i++)
          e.push({
            title: `${re[i].minMove}/${re[i].priceScale}`,
            value: `${re[i].priceScale},${re[i].minMove},${re[i].frac}`,
          })
        return e
      }
      class ce {
        constructor(e, i, t, n, o, r) {
          ;(this._definitions = null),
            (this._inputsSubscriptions = null),
            (this._isDestroyed = !1),
            (this._propertyPages = null),
            (this._seriesMinTickWV = null),
            (this._sessionIdOptionsWV = new (c())([])),
            (this._series = e),
            (this._undoModel = i),
            (this._model = this._undoModel.model()),
            (this._propertyPageId = t),
            (this._propertyPageName = n),
            (this._propertyPageIcon = o),
            (this._timezonePropertyObj = r),
            this._series.onStyleChanged().subscribe(this, this._updateDefinitions),
            this._series.dataEvents().symbolResolved().subscribe(this, this._updateSeriesMinTickWV),
            this._series.dataEvents().symbolResolved().subscribe(this, this._updateSessionIdOptionsWV),
            this._updateSeriesMinTickWV(),
            this._updateSessionIdOptionsWV()
        }
        destroy() {
          null !== this._propertyPages &&
            this._propertyPages.forEach(e => {
              ;(0, l.destroyDefinitions)(e.definitions.value())
            }),
            this._series.onStyleChanged().unsubscribe(this, this._updateDefinitions),
            this._series.dataEvents().symbolResolved().unsubscribeAll(this),
            this._unsubscribeInputsUpdate(),
            (this._isDestroyed = !0)
        }
        propertyPages() {
          return null === this._propertyPages
            ? this._getDefinitions().then(e => {
                var i
                if (this._isDestroyed) throw new Error('SeriesPropertyDefinitionsViewModel already destroyed')
                return (
                  null === this._propertyPages &&
                    (this._propertyPages = [
                      {
                        id: this._propertyPageId,
                        title: this._propertyPageName,
                        icon: this._propertyPageIcon,
                        definitions: new (c())(e.definitions),
                        visible: null !== (i = e.visible) && void 0 !== i ? i : new (c())(!0).readonly(),
                      },
                    ]),
                  this._propertyPages
                )
              })
            : Promise.resolve(this._propertyPages)
        }
        _seriesMinTick() {
          const e = this._series.symbolInfo()
          return null !== e ? e.minmov / e.pricescale : null
        }
        _updateSeriesMinTickWV() {
          null === this._seriesMinTickWV
            ? (this._seriesMinTickWV = new (c())(this._seriesMinTick()))
            : this._seriesMinTickWV.setValue(this._seriesMinTick())
        }
        _updateSessionIdOptionsWV() {
          if (!D) return
          const e = this._series.symbolInfo()
          if (null === e) return
          const i = (e.subsessions || [])
            .filter(e => !e.private)
            .map(e => ({ title: (0, P.translateSessionDescription)(e.description), value: e.id }))
          this._sessionIdOptionsWV.setValue(i)
        }
        _updateDefinitions() {
          null !== this._definitions && (0, l.destroyDefinitions)(this._definitions.definitions),
            (this._definitions = null),
            this._unsubscribeInputsUpdate(),
            this._createSeriesDefinitions().then(e => {
              if (this._isDestroyed) throw new Error('SeriesPropertyDefinitionsViewModel already destroyed')
              ;(0, n.ensureNotNull)(this._propertyPages)[0].definitions.setValue(e.definitions)
            })
        }
        _getDefinitions() {
          return null === this._definitions ? this._createSeriesDefinitions() : Promise.resolve(this._definitions)
        }
        _unsubscribeInputsUpdate() {
          null !== this._inputsSubscriptions &&
            (this._inputsSubscriptions.forEach(e => {
              e.unsubscribeAll(this)
            }),
            (this._inputsSubscriptions = null))
        }
        _subscribeInputsUpdate(e, i) {
          const t = []
          e.forEach(e => {
            if (void 0 !== e.visible) {
              const n = e.visible.split('==')
              if (2 === n.length) {
                const e = i[n[0]]
                ;-1 === t.indexOf(e) && (e.subscribe(this, this._updateDefinitions), t.push(e))
              }
            }
          }),
            t.length > 0 ? (this._inputsSubscriptions = t) : (this._inputsSubscriptions = null)
        }
        _createSeriesDefinitions() {
          const e = this._series.properties().childs(),
            i = this._series.getInputsProperties(),
            t = this._series.getInputsInfoProperties(),
            o = e.style.value(),
            r = this._series.getStyleShortName()
          return new Promise(e => {
            const s = (0, d.chartStyleStudyId)(o)
            null !== s
              ? this._model
                  .studyMetaInfoRepository()
                  .findById({ type: 'java', studyId: s })
                  .then(o => {
                    if (this._isDestroyed) throw new Error('SeriesPropertyDefinitionsViewModel already destroyed')
                    if (null !== this._definitions) return void e(null)
                    const s = (0, n.ensureNotNull)(this._seriesMinTickWV),
                      l = f(this._undoModel, o.id, o.inputs, i, t, s, r)
                    this._subscribeInputsUpdate(o.inputs, i), e(l)
                  })
                  .catch(i => {
                    m.logWarn('Find meta info for create series definitions with error - ' + (0, S.errorToString)(i)),
                      e(null)
                  })
              : e(null)
          }).then(i => {
            if (this._isDestroyed) throw new Error('SeriesPropertyDefinitionsViewModel already destroyed')
            if (null !== this._definitions) return this._definitions
            const t = (0, p.getSeriesStylePropertiesDefinitions)(
              this._undoModel,
              e,
              o,
              { seriesPriceSources: se, lineStyleTypes: le, isJapaneseChartsAvailable: !0, defaultSeriesFontSizes: oe },
              'mainSeries',
            )
            null !== i && t.push(...i)
            const n = (0, l.createOptionsPropertyDefinition)(
                { option: (0, l.convertToDefinitionProperty)(this._undoModel, e.minTick, _) },
                { id: r + 'SymbolMinTick', title: z, options: new (c())(ae()) },
              ),
              s = (0, l.createOptionsPropertyDefinition)(
                { option: (0, l.convertToDefinitionProperty)(this._undoModel, this._timezonePropertyObj.property, C) },
                { id: r + 'SymbolTimezone', title: R, options: new (c())(this._timezonePropertyObj.values) },
              )
            return (
              (this._definitions = {
                definitions: [
                  (0, l.createPropertyDefinitionsGeneralGroup)(t, 'generalSymbolStylesGroup'),
                  ...this._seriesPriceLinesDefinitions(r),
                  ...this._seriesDataDefinitions(r),
                  n,
                  s,
                ],
              }),
              this._definitions
            )
          })
        }
        _seriesDataDefinitions(e) {
          const i = []
          if (D) {
            const t = this._series.sessionIdProxyProperty(),
              n = (0, T.combineWithFilteredUpdate)(
                (e, i) => !i && (0, d.symbolHasSeveralSessions)(this._series.symbolInfo()),
                (e, i) => i || !e,
                this._series.symbolResolvingActive(),
                (0, w.createWVFromProperty)(this._series.isDWMProperty()),
              ),
              o = (0, l.createOptionsPropertyDefinition)(
                {
                  option: (0, l.convertToDefinitionProperty)(this._undoModel, t, k),
                  visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(n),
                },
                { id: 'sessionId', title: j, options: this._sessionIdOptionsWV },
              )
            i.push(o)
            const r = this._model.sessions().graphicsInfo()
            let s = !1
            r.backgrounds && (s = void 0 !== r.backgrounds.outOfSession)
            const a = s ? this._createOutOfSessionDefinition(e) : this._createPrePostMarketDefinition(e)
            i.push(a)
          }
          return i
        }
        _createOutOfSessionDefinition(e) {
          const i = this._model
            .sessions()
            .properties()
            .childs()
            .graphics.childs()
            .backgrounds.childs()
            .outOfSession.childs()
          return (0, l.createColorPropertyDefinition)(
            { color: (0, l.getColorDefinitionProperty)(this._undoModel, i.color, i.transparency, M) },
            { id: e + 'SymbolExtendedHoursColors', title: N },
          )
        }
        _createPrePostMarketDefinition(e) {
          const i = (0, T.combineWithFilteredUpdate)(
              (e, i) =>
                !i &&
                (0, d.symbolHasPreOrPostMarket)(this._series.symbolInfo()) &&
                !(0, d.isRegularSessionId)(this._series.sessionIdProxyProperty().value()),
              (e, i) => i || !e,
              this._series.symbolResolvingActive(),
              (0, w.createWVFromProperty)(this._series.isDWMProperty()),
            ),
            t = this._model.sessions(),
            n = t.properties().childs().graphics.childs().backgrounds.childs().preMarket.childs(),
            o = t.properties().childs().graphics.childs().backgrounds.childs().postMarket.childs()
          return (0, l.createTwoColorsPropertyDefinition)(
            {
              color1: (0, l.getColorDefinitionProperty)(this._undoModel, n.color, n.transparency, L),
              color2: (0, l.getColorDefinitionProperty)(this._undoModel, o.color, o.transparency, I),
              visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(i),
            },
            { id: e + 'SymbolExtendedHoursColors', title: N },
          )
        }
        _seriesPriceLinesDefinitions(e) {
          const i = [],
            t = this._series.properties().childs()
          if (this._series.hasClosePrice()) {
            const n = (0, l.createLinePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(this._undoModel, t.showPriceLine, E),
                color: (0, l.getColorDefinitionProperty)(this._undoModel, t.priceLineColor, null, O),
                width: (0, l.convertToDefinitionProperty)(this._undoModel, t.priceLineWidth, x),
              },
              { id: e + 'SymbolLastValuePriceLine', title: F },
            )
            i.push(n)
          }
          this._series.hasClosePrice()
          const n = t.highLowAvgPrice.childs(),
            o = (0, l.createLinePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(this._undoModel, n.highLowPriceLinesVisible, B),
                color: (0, l.getColorDefinitionProperty)(this._undoModel, n.highLowPriceLinesColor, null, W),
                width: (0, l.convertToDefinitionProperty)(this._undoModel, n.highLowPriceLinesWidth, V),
              },
              { id: e + 'SymbolHighLowPriceLines', title: te },
            )
          if ((i.push(o), v)) {
            const t = (0, l.createLinePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(this._undoModel, n.averageClosePriceLineVisible, H),
                color: (0, l.getColorDefinitionProperty)(this._undoModel, n.averagePriceLineColor, null, $),
                width: (0, l.convertToDefinitionProperty)(this._undoModel, n.averagePriceLineWidth, A),
              },
              { id: e + 'SymbolAverageClosePriceLine', title: ne },
            )
            i.push(t)
          }
          return i
        }
      }
    },
    56450: (e, i, t) => {
      t.d(i, { translateSessionDescription: () => r, translateSessionShortDescription: () => l })
      var n = t(28353)
      const o = new Map([
        ['Premarket', (0, n.t)('Premarket', { context: 'sessions' })],
        ['Postmarket', (0, n.t)('Postmarket', { context: 'sessions' })],
        ['Regular Trading Hours', (0, n.t)('Regular trading hours', { context: 'sessions' })],
        ['Extended Trading Hours', (0, n.t)('Extended trading hours', { context: 'sessions' })],
        ['Electronic Trading Hours', (0, n.t)('Electronic trading hours', { context: 'sessions' })],
      ])
      function r(e) {
        var i
        return null !== (i = o.get(e)) && void 0 !== i ? i : e
      }
      const s = new Map([
        ['Premarket', (0, n.t)('PRE', { context: 'sessions' })],
        ['Postmarket', (0, n.t)('POST', { context: 'sessions' })],
        ['Regular Trading Hours', (0, n.t)('RTH', { context: 'sessions' })],
        ['Extended Trading Hours', (0, n.t)('ETH', { context: 'sessions' })],
        ['Electronic Trading Hours', (0, n.t)('ETH', { context: 'sessions' })],
      ])
      function l(e) {
        var i
        return null !== (i = s.get(e)) && void 0 !== i ? i : e
      }
    },
  },
])
