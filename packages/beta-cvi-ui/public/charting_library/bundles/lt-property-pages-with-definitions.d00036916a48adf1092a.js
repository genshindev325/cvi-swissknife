'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [8537],
  {
    30672: (e, t, i) => {
      i.d(t, { getLinesStylesPropertiesDefinitions: () => y })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(50366),
        s = i(80054)
      const a = new n.TranslatedString(
          'change {title} price label visibility',
          (0, r.t)('change {title} price label visibility'),
        ),
        c = new n.TranslatedString('change {title} extension', (0, r.t)('change {title} extension')),
        p = new n.TranslatedString(
          'change {title} time label visibility',
          (0, r.t)('change {title} time label visibility'),
        ),
        d = (0, r.t)('Price label'),
        h = (0, r.t)('Time label'),
        g = (0, r.t)('Extend')
      function y(e, t, i) {
        const r = (0, s.removeSpaces)(i.originalText()),
          n = [],
          y = (0, o.createLineStyleDefinition)(
            e,
            { lineColor: t.linecolor, lineWidth: t.linewidth, lineStyle: t.linestyle },
            i,
            'Line',
          )
        if ((n.push(y), 'showPrice' in t)) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showPrice, a.format({ title: i })) },
            { id: r + 'ShowPrice', title: d },
          )
          n.push(o)
        }
        if ('extendLine' in t) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.extendLine, c.format({ title: i })) },
            { id: r + 'ExtendLine', title: g },
          )
          n.push(o)
        }
        if ('showTime' in t) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showTime, p.format({ title: i })) },
            { id: r + 'ShowTime', title: h },
          )
          n.push(o)
        }
        return { definitions: n }
      }
    },
    23206: (e, t, i) => {
      i.r(t), i.d(t, { getSelectionStylePropertiesDefinitions: () => y })
      var r = i(28353),
        n = i(37865),
        o = i(98222),
        l = i(24980),
        s = i(50366)
      const a = new l.TranslatedString('lines width', (0, r.t)('lines width')),
        c = new l.TranslatedString('lines style', (0, r.t)('lines style')),
        p = new l.TranslatedString('lines color', (0, r.t)('lines color')),
        d = new l.TranslatedString('backgrounds color', (0, r.t)('backgrounds color')),
        h = new l.TranslatedString('backgrounds filled', (0, r.t)('backgrounds filled')),
        g = new l.TranslatedString('text color', (0, r.t)('text color'))
      function y(e, t) {
        const i = []
        if ('linesWidths' in e || 'linestyle' in e || 'linesColors' in e) {
          const l = (0, s.createLinePropertyDefinition)(
            {
              width: e.linesWidths
                ? new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.linesWidths), a, t)
                : void 0,
              style: e.linestyle
                ? new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.linestyle), c, t)
                : void 0,
              color: e.linesColors
                ? new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.linesColors), p, t)
                : void 0,
            },
            { id: 'LineStyles', title: (0, r.t)('Line') },
          )
          i.push(l)
        }
        if ('backgroundsColors' in e) {
          const l = (0, s.createColorPropertyDefinition)(
            {
              checked: e.fillBackground
                ? new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.fillBackground), h, t)
                : void 0,
              color: new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.backgroundsColors), d, t),
            },
            { id: 'BackgroundColors', title: (0, r.t)('Background') },
          )
          i.push(l)
        }
        if ('textsColors' in e) {
          const l = (0, s.createLinePropertyDefinition)(
            { color: new o.CollectiblePropertyUndoWrapper(new n.LineToolCollectedProperty(e.textsColors), g, t) },
            { id: 'TextColors', title: (0, r.t)('Text') },
          )
          i.push(l)
        }
        return { definitions: i }
      }
    },
    53710: (e, t, i) => {
      i.d(t, {
        getTrendLineToolsStylePropertiesDefinitions: () => M,
      })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(50366),
        s = i(52714),
        a = i.n(s),
        c = i(13632),
        p = i(80054)
      const d = new n.TranslatedString(
          'change {title} middle point visibility',
          (0, r.t)('change {title} middle point visibility'),
        ),
        h = new n.TranslatedString(
          'change {title} price labels visibility',
          (0, r.t)('change {title} price labels visibility'),
        ),
        g = new n.TranslatedString(
          'change {title} price range visibility',
          (0, r.t)('change {title} price range visibility'),
        ),
        y = new n.TranslatedString(
          'change {title} bars range visibility',
          (0, r.t)('change {title} bars range visibility'),
        ),
        f = new n.TranslatedString(
          'change {title} date/time range visibility',
          (0, r.t)('change {title} date/time range visibility'),
        ),
        u = new n.TranslatedString(
          'change {title} distance visibility',
          (0, r.t)('change {title} distance visibility'),
        ),
        v = new n.TranslatedString('change {title} angle visibility', (0, r.t)('change {title} angle visibility')),
        b = new n.TranslatedString('change {title} always show stats', (0, r.t)('change {title} always show stats')),
        D = new n.TranslatedString('change {title} stats position', (0, r.t)('change {title} stats position')),
        T = [
          { value: c.StatsPosition.Left, title: (0, r.t)('Left') },
          { value: c.StatsPosition.Center, title: (0, r.t)('Center') },
          { value: c.StatsPosition.Right, title: (0, r.t)('Right') },
        ],
        w = (0, r.t)('Middle point'),
        _ = (0, r.t)('Price labels'),
        P = (0, r.t)('Stats position'),
        m = (0, r.t)('Price range'),
        S = (0, r.t)('Bars range'),
        x = (0, r.t)('Date/time range'),
        k = (0, r.t)('Distance'),
        L = (0, r.t)('Angle'),
        C = (0, r.t)('Always show stats'),
        A = (0, r.t)('Stats')
      function M(e, t, i, r) {
        const n = (0, p.removeSpaces)(i.originalText()),
          s = [],
          c = t,
          M = (0, o.createLineStyleDefinition)(
            e,
            { ...c, lineColor: t.linecolor, lineWidth: t.linewidth, lineStyle: t.linestyle },
            i,
            'Line',
          )
        s.push(M)
        const V = (0, l.createCheckablePropertyDefinition)(
          { checked: (0, l.convertToDefinitionProperty)(e, t.showMiddlePoint, d.format({ title: i })) },
          { id: n + 'MiddlePoint', title: (r && r.middlePoint) || w },
        )
        s.push(V)
        const B = (0, l.createCheckablePropertyDefinition)(
          { checked: (0, l.convertToDefinitionProperty)(e, t.showPriceLabels, h.format({ title: i })) },
          { id: n + 'ShowPriceLabels', title: (r && r.showPriceLabelsTitle) || _ },
        )
        s.push(B)
        const N = [],
          z = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showPriceRange, g.format({ title: i })) },
            { id: n + 'PriceRange', title: (r && r.priceRange) || m },
          )
        N.push(z)
        const W = (0, l.createCheckablePropertyDefinition)(
          { checked: (0, l.convertToDefinitionProperty)(e, t.showBarsRange, y.format({ title: i })) },
          { id: n + 'BarsRange', title: (r && r.barRange) || S },
        )
        if ((N.push(W), 'showDateTimeRange' in t)) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showDateTimeRange, f.format({ title: i })) },
            { id: n + 'DateTimeRange', title: (r && r.dateTimeRange) || x },
          )
          N.push(o)
        }
        if ('showDistance' in t) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showDistance, u.format({ title: i })) },
            { id: n + 'Distance', title: (r && r.distance) || k },
          )
          N.push(o)
        }
        if ('showAngle' in t) {
          const o = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(e, t.showAngle, v.format({ title: i })) },
            { id: n + 'Angle', title: (r && r.angle) || L },
          )
          N.push(o)
        }
        const R = (0, l.createCheckablePropertyDefinition)(
          { checked: (0, l.convertToDefinitionProperty)(e, t.alwaysShowStats, b.format({ title: i })) },
          { id: n + 'ShowStats', title: (r && r.showStats) || C },
        )
        N.push(R)
        const E = (0, l.createOptionsPropertyDefinition)(
          { option: (0, l.convertToDefinitionProperty)(e, t.statsPosition, D.format({ title: i })) },
          { id: n + 'StatsPosition', title: (r && r.statsPosition) || P, options: new (a())(T) },
        )
        return (
          N.push(E), s.push((0, l.createPropertyDefinitionsGeneralGroup)(N, n + 'StatsGroup', A)), { definitions: s }
        )
      }
    },
    73642: (e, t, i) => {
      i.d(t, { createLineStyleDefinition: () => b })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(80054)
      const s = new n.TranslatedString(
          'change {toolName} line visibility',
          (0, r.t)('change {toolName} line visibility'),
        ),
        a = new n.TranslatedString('change {toolName} line width', (0, r.t)('change {toolName} line width')),
        c = new n.TranslatedString('change {toolName} line style', (0, r.t)('change {toolName} line style')),
        p = new n.TranslatedString('change {toolName} line color', (0, r.t)('change {toolName} line color')),
        d = new n.TranslatedString(
          'change {toolName} line extending left',
          (0, r.t)('change {toolName} line extending left'),
        ),
        h = new n.TranslatedString('change {toolName} line left end', (0, r.t)('change {toolName} line left end')),
        g = new n.TranslatedString(
          'change {toolName} line extending right',
          (0, r.t)('change {toolName} line extending right'),
        ),
        y = new n.TranslatedString('change {toolName} line right end', (0, r.t)('change {toolName} line right end')),
        f = (0, r.t)('Line'),
        u = (0, r.t)('Extend left line'),
        v = (0, r.t)('Extend right line')
      function b(e, t, i, r, n) {
        const b = {},
          D = { id: `${(0, l.removeSpaces)(i.originalText())}${r}`, title: (n && n.line) || f }
        return (
          void 0 !== t.showLine &&
            (b.checked = (0, o.convertToDefinitionProperty)(e, t.showLine, s.format({ toolName: i }))),
          void 0 !== t.lineWidth &&
            (b.width = (0, o.convertToDefinitionProperty)(e, t.lineWidth, a.format({ toolName: i }))),
          void 0 !== t.lineStyle &&
            (b.style = (0, o.convertToDefinitionProperty)(e, t.lineStyle, c.format({ toolName: i }))),
          void 0 !== t.lineColor &&
            (b.color = (0, o.getColorDefinitionProperty)(e, t.lineColor, null, p.format({ toolName: i }))),
          void 0 !== t.extendLeft &&
            ((b.extendLeft = (0, o.convertToDefinitionProperty)(e, t.extendLeft, d.format({ toolName: i }))),
            (D.extendLeftTitle = (n && n.extendLeftTitle) || u)),
          void 0 !== t.leftEnd &&
            (b.leftEnd = (0, o.convertToDefinitionProperty)(e, t.leftEnd, h.format({ toolName: i }))),
          void 0 !== t.extendRight &&
            ((b.extendRight = (0, o.convertToDefinitionProperty)(e, t.extendRight, g.format({ toolName: i }))),
            (D.extendRightTitle = (n && n.extendRightTitle) || v)),
          void 0 !== t.rightEnd &&
            (b.rightEnd = (0, o.convertToDefinitionProperty)(e, t.rightEnd, y.format({ toolName: i }))),
          (0, o.createLinePropertyDefinition)(b, D)
        )
      }
    },
    59278: (e, t, i) => {
      i.d(t, { createTextStyleDefinition: () => S })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(80054)
      const s = new n.TranslatedString(
          'change {toolName} text visibility',
          (0, r.t)('change {toolName} text visibility'),
        ),
        a = new n.TranslatedString('change {toolName} text color', (0, r.t)('change {toolName} text color')),
        c = new n.TranslatedString('change {toolName} text font size', (0, r.t)('change {toolName} text font size')),
        p = new n.TranslatedString('change {toolName} text font bold', (0, r.t)('change {toolName} text font bold')),
        d = new n.TranslatedString(
          'change {toolName} text font italic',
          (0, r.t)('change {toolName} text font italic'),
        ),
        h = new n.TranslatedString('change {toolName} text', (0, r.t)('change {toolName} text')),
        g = new n.TranslatedString(
          'change {toolName} labels alignment vertical',
          (0, r.t)('change {toolName} labels alignment vertical'),
        ),
        y = new n.TranslatedString(
          'change {toolName} labels alignment horizontal',
          (0, r.t)('change {toolName} labels alignment horizontal'),
        ),
        f = new n.TranslatedString(
          'change {toolName} labels direction',
          (0, r.t)('change {toolName} labels direction'),
        ),
        u = new n.TranslatedString(
          'change {toolName} text background visibility',
          (0, r.t)('change {toolName} text background visibility'),
        ),
        v = new n.TranslatedString(
          'change {toolName} text background color',
          (0, r.t)('change {toolName} text background color'),
        ),
        b = new n.TranslatedString(
          'change {toolName} text border visibility',
          (0, r.t)('change {toolName} text border visibility'),
        ),
        D = new n.TranslatedString(
          'change {toolName} text border width',
          (0, r.t)('change {toolName} text border width'),
        ),
        T = new n.TranslatedString(
          'change {toolName} text border color',
          (0, r.t)('change {toolName} text border color'),
        ),
        w = new n.TranslatedString('change {toolName} text wrap', (0, r.t)('change {toolName} text wrap')),
        _ = (0, r.t)('Background'),
        P = (0, r.t)('Border'),
        m = (0, r.t)('Text wrap')
      function S(e, t, i, r) {
        const n = {},
          S = {
            id: (0, l.removeSpaces)(i.originalText()) + 'Text',
            title: (r.customTitles && r.customTitles.text) || '',
          }
        if (
          (void 0 !== t.showText &&
            (n.checked = (0, o.convertToDefinitionProperty)(e, t.showText, s.format({ toolName: i }))),
          void 0 !== t.textColor &&
            (n.color = (0, o.getColorDefinitionProperty)(
              e,
              t.textColor,
              t.transparency || null,
              a.format({ toolName: i }),
            )),
          void 0 !== t.fontSize &&
            (n.size = (0, o.convertToDefinitionProperty)(e, t.fontSize, c.format({ toolName: i }))),
          void 0 !== t.bold && (n.bold = (0, o.convertToDefinitionProperty)(e, t.bold, p.format({ toolName: i }))),
          void 0 !== t.italic &&
            (n.italic = (0, o.convertToDefinitionProperty)(e, t.italic, d.format({ toolName: i }))),
          void 0 !== t.text &&
            ((n.text = (0, o.convertToDefinitionProperty)(e, t.text, h.format({ toolName: i }))),
            (S.isEditable = Boolean(r.isEditable)),
            (S.isMultiLine = Boolean(r.isMultiLine))),
          void 0 !== t.vertLabelsAlign &&
            ((n.alignmentVertical = (0, o.convertToDefinitionProperty)(
              e,
              t.vertLabelsAlign,
              g.format({ toolName: i }),
            )),
            (S.alignmentVerticalItems = r.alignmentVerticalItems)),
          void 0 !== t.horzLabelsAlign &&
            ((n.alignmentHorizontal = (0, o.convertToDefinitionProperty)(
              e,
              t.horzLabelsAlign,
              y.format({ toolName: i }),
            )),
            (S.alignmentHorizontalItems = r.alignmentHorizontalItems)),
          void 0 !== t.textOrientation &&
            (n.orientation = (0, o.convertToDefinitionProperty)(e, t.textOrientation, f.format({ toolName: i }))),
          void 0 !== t.backgroundVisible &&
            (n.backgroundVisible = (0, o.convertToDefinitionProperty)(
              e,
              t.backgroundVisible,
              u.format({ toolName: i }),
            )),
          void 0 !== t.backgroundColor)
        ) {
          let r = null
          void 0 !== t.backgroundTransparency && (r = t.backgroundTransparency),
            (n.backgroundColor = (0, o.getColorDefinitionProperty)(e, t.backgroundColor, r, v.format({ toolName: i })))
        }
        return (
          (void 0 === t.backgroundVisible && void 0 === t.backgroundColor) ||
            (S.backgroundTitle = (r.customTitles && r.customTitles.backgroundTitle) || _),
          void 0 !== t.borderVisible &&
            (n.borderVisible = (0, o.convertToDefinitionProperty)(e, t.borderVisible, b.format({ toolName: i }))),
          void 0 !== t.borderWidth &&
            (n.borderWidth = (0, o.convertToDefinitionProperty)(e, t.borderWidth, D.format({ toolName: i }))),
          void 0 !== t.borderColor &&
            (n.borderColor = (0, o.getColorDefinitionProperty)(e, t.borderColor, null, T.format({ toolName: i }))),
          (void 0 === t.borderVisible && void 0 === t.borderColor && void 0 === t.borderWidth) ||
            (S.borderTitle = (r.customTitles && r.customTitles.borderTitle) || P),
          void 0 !== t.wrap &&
            ((n.wrap = (0, o.convertToDefinitionProperty)(e, t.wrap, w.format({ toolName: i }))),
            (S.wrapTitle = (r.customTitles && r.customTitles.wrapTitle) || m)),
          (0, o.createTextPropertyDefinition)(n, S)
        )
      }
    },
    72930: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkDefinitionsViewModel: () => d })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(68623),
        s = i(50366)
      const a = new n.TranslatedString('change arrow color', (0, r.t)('change arrow color')),
        c = (0, r.t)('Text'),
        p = (0, r.t)('Arrow')
      class d extends l.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: c } },
              ),
            ],
          }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                { color: (0, s.getColorDefinitionProperty)(this._propertyApplier, e.arrowColor, null, a) },
                { id: 'ArrowColor', title: p },
              ),
            ],
          }
        }
      }
    },
    92138: (e, t, i) => {
      i.r(t), i.d(t, { ArrowMarkerDefinitionsViewModel: () => h })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(68623),
        s = i(80054),
        a = i(59278)
      const c = new n.TranslatedString('change {title} color', (0, r.t)('change {title} color')),
        p = (0, r.t)('Color'),
        d = (0, r.t)('Text')
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createColorPropertyDefinition)(
                {
                  color: (0, o.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    null,
                    c.format({ title: i }),
                  ),
                },
                { id: (0, s.removeSpaces)(t + 'Color'), title: p },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, a.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  text: e.text,
                  showText: e.showLabel,
                  textColor: e.textColor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } },
              ),
            ],
          }
        }
      }
    },
    60991: (e, t, i) => {
      i.r(t), i.d(t, { BalloonDefinitionsViewModel: () => a })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(68623)
      const s = (0, r.t)('Text')
      class a extends l.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: s } },
              ),
            ],
          }
        }
      }
    },
    14725: (e, t, i) => {
      i.r(t), i.d(t, { BarsPatternDefinitionsViewModel: () => w })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(50366),
        s = i(52714),
        a = i.n(s),
        c = i(8059),
        p = i(37787),
        d = i(80054)
      const h = new n.TranslatedString('change {title} color', (0, r.t)('change {title} color')),
        g = new n.TranslatedString('change {title} mode', (0, r.t)('change {title} mode')),
        y = new n.TranslatedString('change {title} mirrored', (0, r.t)('change {title} mirrored')),
        f = new n.TranslatedString('change {title} flipped', (0, r.t)('change {title} flipped')),
        u = (0, r.t)('Color'),
        v = (0, r.t)('Mode'),
        b = (0, r.t)('Mirrored'),
        D = (0, r.t)('Flipped'),
        T = [
          { value: c.LineToolBarsPatternMode.Bars, title: (0, r.t)('HL bars') },
          { value: c.LineToolBarsPatternMode.OpenClose, title: (0, r.t)('OC bars') },
          { value: c.LineToolBarsPatternMode.Line, title: (0, r.t)('Line - close') },
          { value: c.LineToolBarsPatternMode.LineOpen, title: (0, r.t)('Line - open') },
          { value: c.LineToolBarsPatternMode.LineHigh, title: (0, r.t)('Line - high') },
          { value: c.LineToolBarsPatternMode.LineLow, title: (0, r.t)('Line - low') },
          { value: c.LineToolBarsPatternMode.LineHL2, title: (0, r.t)('Line - HL/2') },
        ]
      class w extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title()),
            r = (0, d.removeSpaces)(t)
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    h.format({ title: i }),
                  ),
                },
                { id: r + 'Color', title: u },
              ),
              (0, l.createOptionsPropertyDefinition)(
                {
                  option: (0, l.convertToDefinitionProperty)(this._propertyApplier, e.mode, g.format({ title: i }), [
                    p.convertToInt,
                  ]),
                },
                { id: r + 'Mode', title: v, options: new (a())(T) },
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.mirrored,
                    y.format({ title: i }),
                  ),
                },
                { id: r + 'Mirrored', title: b },
              ),
              (0, l.createCheckablePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, e.flipped, f.format({ title: i })),
                },
                { id: r + 'Flipped', title: D },
              ),
            ],
          }
        }
      }
    },
    288: (e, t, i) => {
      i.r(t), i.d(t, { BrushDefinitionsViewModel: () => h })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        p = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        d = (0, r.t)('Background')
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth, leftEnd: e.leftEnd, rightEnd: e.rightEnd },
                i,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'BackgroundColor'), title: d },
              ),
            ],
          }
        }
      }
    },
    26599: (e, t, i) => {
      i.r(t), i.d(t, { CalloutDefinitionsViewModel: () => l })
      var r = i(59278),
        n = i(68623),
        o = i(24980)
      class l extends n.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.bordercolor,
                  borderWidth: e.linewidth,
                  wrap: e.wordWrap,
                },
                new o.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
    },
    99645: (e, t, i) => {
      i.r(t), i.d(t, { CrossLineDefinitionsViewModel: () => c })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(30672),
        s = i(59278)
      const a = (0, r.t)('Text')
      class c extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          if ('showLabel' in e) {
            return {
              definitions: [
                (0, s.createTextStyleDefinition)(
                  this._propertyApplier,
                  { ...e, showText: e.showLabel, textColor: e.textcolor, fontSize: e.fontsize },
                  new n.TranslatedString(this._source.name(), this._source.title()),
                  { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
                ),
              ],
            }
          }
          return null
        }
      }
    },
    66819: (e, t, i) => {
      i.r(t), i.d(t, { CyclicAndSineLinesPatternDefinitionsViewModel: () => a })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623)
      const s = (0, r.t)('Lines')
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth, lineStyle: e.linestyle },
                new n.TranslatedString(this._source.name(), this._source.title()),
                'Line',
                { line: s },
              ),
            ],
          }
        }
      }
    },
    31522: (e, t, i) => {
      i.r(t), i.d(t, { ElliottPatternDefinitionsViewModel: () => u })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(52714),
        c = i.n(a),
        p = i(80054)
      const d = new n.TranslatedString('change {title} color', (0, r.t)('change {title} color')),
        h = new n.TranslatedString('change {title} degree', (0, r.t)('change {title} degree')),
        g = (0, r.t)('Color'),
        y = (0, r.t)('Wave'),
        f = (0, r.t)('Degree')
      class u extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, p.removeSpaces)(t + 'BackgroundColor'), title: g },
              ),
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { showLine: e.showWave, lineWidth: e.linewidth },
                i,
                'Line',
                { line: y },
              ),
              (0, s.createOptionsPropertyDefinition)(
                { option: (0, s.convertToDefinitionProperty)(this._propertyApplier, e.degree, h.format({ title: i })) },
                { id: t + 'Degree', title: f, options: new (c())(this._source.availableDegreesValues()) },
              ),
            ],
          }
        }
      }
    },
    3410: (e, t, i) => {
      i.r(t), i.d(t, { EllipseCircleDefinitionsViewModel: () => a })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(24965)
      const s = (0, r.t)('Text')
      class a extends l.GeneralFiguresDefinitionsViewModelBase {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  showText: e.showLabel,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: s } },
              ),
            ],
          }
        }
      }
    },
    9948: (e, t, i) => {
      i.r(t), i.d(t, { FibCirclesDefinitionsViewModel: () => S })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(50366),
        a = i(68623),
        c = i(80054),
        p = i(88451)
      const d = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        h = new o.TranslatedString('change {title} levels visibility', (0, n.t)('change {title} levels visibility')),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        u = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        v = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        b = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        D = new o.TranslatedString(
          'change {title} coeffs as percents visibility',
          (0, n.t)('change {title} coeffs as percents visibility'),
        ),
        T = (0, n.t)('Trend line'),
        w = (0, n.t)('Use one color'),
        _ = (0, n.t)('Background'),
        P = (0, n.t)('Levels'),
        m = (0, n.t)('Coeffs as percents')
      class S extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new o.TranslatedString(i, this._source.title()),
            S = t.trendline.childs(),
            x = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              { showLine: S.visible, lineColor: S.color, lineStyle: S.linestyle, lineWidth: S.linewidth },
              a,
              'TrendLine',
              { line: T },
            )
          e.push(x)
          const k = this._source.levelsCount()
          for (let i = 1; i <= k; i++) {
            const r = t['level' + i].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    d.format({ title: a, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    g.format({ title: a, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    y.format({ title: a, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.coeff,
                    f.format({ title: a, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}` },
              )
            e.push(o)
          }
          const L = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                u.format({ title: a }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: w },
          )
          e.push(L)
          const C = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                v.format({ title: a }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                b.format({ title: a }),
              ),
            },
            { id: n + 'Background', title: _ },
          )
          e.push(C)
          const A = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.showCoeffs, h.format({ title: a })),
            },
            { id: n + 'Levels', title: P },
          )
          e.push(A)
          const M = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.coeffsAsPercents,
                D.format({ title: a }),
              ),
            },
            { id: n + 'Percentage', title: m },
          )
          return e.push(M), { definitions: e }
        }
      }
    },
    34670: (e, t, i) => {
      i.r(t), i.d(t, { FibDrawingsWith24LevelsDefinitionsViewModel: () => $ })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(50366),
        a = i(68623),
        c = i(45384),
        p = i(52714),
        d = i.n(p),
        h = i(80054),
        g = i(88451)
      const y = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        v = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        b = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        D = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        T = new o.TranslatedString('change {title} reverse', (0, n.t)('change {title} reverse')),
        w = new o.TranslatedString('change {title} prices visibility', (0, n.t)('change {title} prices visibility')),
        _ = new o.TranslatedString('change {title} labels alignment', (0, n.t)('change {title} labels alignment')),
        P = new o.TranslatedString('change {title} labels font size', (0, n.t)('change {title} labels font size')),
        m = new o.TranslatedString('change {title} style', (0, n.t)('change {title} style')),
        S = new o.TranslatedString(
          'change {title} fib levels based on log scale',
          (0, n.t)('change {title} fib levels based on log scale'),
        ),
        x = (0, n.t)('Trend line'),
        k = (0, n.t)('Levels line'),
        L = (0, n.t)('Extend right'),
        C = (0, n.t)('Extend left'),
        A = (0, n.t)('Extend lines right'),
        M = (0, n.t)('Extend lines left'),
        V = (0, n.t)('Reverse'),
        B = (0, n.t)('Prices'),
        N = (0, n.t)('Levels'),
        z = (0, n.t)('Labels'),
        W = (0, n.t)('Font size'),
        R = (0, n.t)('Use one color'),
        E = (0, n.t)('Background'),
        G = (0, n.t)('Fib levels based on log scale'),
        F = [
          { id: 'values', value: !1, title: (0, n.t)('Values') },
          { id: 'percents', value: !0, title: (0, n.t)('Percents') },
        ],
        O = [
          { id: 'bottom', value: 'bottom', title: (0, n.t)('Top') },
          { id: 'middle', value: 'middle', title: (0, n.t)('Middle') },
          { id: 'top', value: 'top', title: (0, n.t)('Bottom') },
        ],
        U = [10, 11, 12, 14, 16, 20, 24].map(e => ({ title: String(e), value: e }))
      class $ extends a.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t), (this._disabledBasedOnLog = null)
          if ('fibLevelsBasedOnLogScale' in this._source.properties().childs()) {
            const e = this._source.priceScale()
            null !== e &&
              ((this._disabledBasedOnLog = new (d())(Boolean(!e.mode().log))),
              this._createPropertyRages(),
              e.modeChanged().subscribe(this, (e, t) => {
                null !== this._disabledBasedOnLog && this._disabledBasedOnLog.setValue(Boolean(!t.log))
              }))
          }
        }
        destroy() {
          super.destroy()
          const e = this._source.priceScale()
          null !== e && e.modeChanged().unsubscribeAll(this)
        }
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, h.removeSpaces)(i),
            a = new o.TranslatedString(i, this._source.title())
          if ('trendline' in t) {
            const i = t.trendline.childs(),
              r = (0, l.createLineStyleDefinition)(
                this._propertyApplier,
                { showLine: i.visible, lineColor: i.color, lineStyle: i.linestyle, lineWidth: i.linewidth },
                a,
                'TrendLine',
                { line: x },
              )
            e.push(r)
          }
          const p = t.levelsStyle.childs(),
            $ = { lineStyle: p.linestyle, lineWidth: p.linewidth },
            I = { line: k }
          'extendLines' in t && (($.extendRight = t.extendLines), (I.extendRightTitle = A)),
            'extendLinesLeft' in t && (($.extendLeft = t.extendLinesLeft), (I.extendLeftTitle = M)),
            'extendRight' in t && (($.extendRight = t.extendRight), (I.extendRightTitle = L)),
            'extendLeft' in t && (($.extendLeft = t.extendLeft), (I.extendLeftTitle = C))
          const H = (0, l.createLineStyleDefinition)(this._propertyApplier, $, a, 'LevelsStyleLine', I)
          e.push(H)
          const j = [],
            Y = this._source.levelsCount()
          for (let e = 1; e <= Y; e++) {
            const i = t['level' + e].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    y.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    f.format({ title: a, index: e }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    u.format({ title: a, index: e }),
                  ),
                },
                { id: `${n}LineLevel${e}` },
              )
            j.push(r)
          }
          const X = (0, s.createPropertyDefinitionsLeveledLinesGroup)(j, n + 'LeveledLinesGroup')
          e.push((0, s.createPropertyDefinitionsGeneralGroup)([X], n + 'Group'))
          const q = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new g.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: a }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: R },
          )
          e.push(q)
          const J = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                b.format({ title: a }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                D.format({ title: a }),
              ),
            },
            {
              id: n + 'Background',
              title: E,
            },
          )
          e.push(J)
          const K = t
          if ('reverse' in K) {
            const t = (0, s.createCheckablePropertyDefinition)(
              { checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, K.reverse, T.format({ title: a })) },
              { id: n + 'Reverse', title: V },
            )
            e.push(t)
          }
          const Q = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.showPrices, w.format({ title: a })),
            },
            { id: n + 'Prices', title: B },
          )
          e.push(Q)
          const Z = (0, s.createOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.showCoeffs, m.format({ title: a })),
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.coeffsAsPercents,
                m.format({ title: a }),
              ),
            },
            { id: n + 'PitchStyle', title: N, options: new (d())(F) },
          )
          e.push(Z)
          const ee = (0, s.createTwoOptionsPropertyDefinition)(
            {
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                _.format({ title: a }),
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                _.format({ title: a }),
              ),
            },
            {
              id: n + 'Alignment',
              title: z,
              optionsItems1: new (d())(c.availableAlignmentHorizontalItems),
              optionsItems2: new (d())(O),
            },
          )
          e.push(ee)
          const te = (0, s.createOptionsPropertyDefinition)(
            {
              option: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.labelFontSize,
                P.format({ title: a }),
              ),
            },
            { id: n + 'FontSize', title: W, options: new (d())(U) },
          )
          if ((e.push(te), 'fibLevelsBasedOnLogScale' in t && null !== this._disabledBasedOnLog)) {
            const i = (0, s.createCheckablePropertyDefinition)(
              {
                disabled: (0, s.convertFromWVToDefinitionProperty)(
                  this._propertyApplier,
                  this._disabledBasedOnLog,
                  S.format({ title: a }),
                ),
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fibLevelsBasedOnLogScale,
                  S.format({ title: a }),
                ),
              },
              { id: n + 'BasedOnLog', title: G },
            )
            e.push(i)
          }
          return { definitions: e }
        }
      }
    },
    17770: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceArcsDefinitionsViewModel: () => S })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(50366),
        a = i(68623),
        c = i(80054),
        p = i(88451)
      const d = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        h = new o.TranslatedString('change {title} levels visibility', (0, n.t)('change {title} levels visibility')),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        u = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        v = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        b = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        D = new o.TranslatedString(
          'change {title} full circles visibility',
          (0, n.t)('change {title} full circles visibility'),
        ),
        T = (0, n.t)('Trend line'),
        w = (0, n.t)('Use one color'),
        _ = (0, n.t)('Background'),
        P = (0, n.t)('Levels'),
        m = (0, n.t)('Full circles')
      class S extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new o.TranslatedString(i, this._source.title()),
            S = t.trendline.childs(),
            x = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              { showLine: S.visible, lineColor: S.color, lineStyle: S.linestyle, lineWidth: S.linewidth },
              a,
              'TrendLine',
              { line: T },
            )
          e.push(x)
          const k = this._source.levelsCount()
          for (let i = 1; i <= k; i++) {
            const r = t['level' + i].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    d.format({ title: a, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    g.format({ title: a, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    y.format({ title: a, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.coeff,
                    f.format({ title: a, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}` },
              )
            e.push(o)
          }
          const L = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                u.format({ title: a }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: w },
          )
          e.push(L)
          const C = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                v.format({ title: a }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                b.format({ title: a }),
              ),
            },
            { id: n + 'Background', title: _ },
          )
          e.push(C)
          const A = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.showCoeffs, h.format({ title: a })),
            },
            { id: n + 'Levels', title: P },
          )
          e.push(A)
          const M = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.fullCircles, D.format({ title: a })),
            },
            { id: n + 'FullCircles', title: m },
          )
          return e.push(M), { definitions: e }
        }
      }
    },
    51697: (e, t, i) => {
      i.r(t), i.d(t, { FibSpeedResistanceFanDefinitionsViewModel: () => z })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(50366),
        s = i(68623),
        a = i(80054),
        c = i(88451)
      const p = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        d = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        h = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        g = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        y = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        f = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        u = new o.TranslatedString(
          'change {title} left labels visibility',
          (0, n.t)('change {title} left labels visibility'),
        ),
        v = new o.TranslatedString(
          'change {title} right labels visibility',
          (0, n.t)('change {title} right labels visibility'),
        ),
        b = new o.TranslatedString(
          'change {title} top labels visibility',
          (0, n.t)('change {title} top labels visibility'),
        ),
        D = new o.TranslatedString(
          'change {title} bottom labels visibility',
          (0, n.t)('change {title} bottom labels visibility'),
        ),
        T = new o.TranslatedString('change {title} reverse', (0, n.t)('change {title} reverse')),
        w = new o.TranslatedString('change {title} grid visibility', (0, n.t)('change {title} grid visibility')),
        _ = new o.TranslatedString('change {title} grid line color', (0, n.t)('change {title} grid line color')),
        P = new o.TranslatedString('change {title} grid line width', (0, n.t)('change {title} grid line width')),
        m = new o.TranslatedString('change {title} grid line style', (0, n.t)('change {title} grid line style')),
        S = (0, n.t)('Use one color'),
        x = (0, n.t)('Background'),
        k = (0, n.t)('Price levels'),
        L = (0, n.t)('Time levels'),
        C = (0, n.t)('Left labels'),
        A = (0, n.t)('Right labels'),
        M = (0, n.t)('Top labels'),
        V = (0, n.t)('Bottom labels'),
        B = (0, n.t)('Grid'),
        N = (0, n.t)('Reverse')
      class z extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.title()),
            z = [],
            W = this._source.hLevelsCount()
          for (let e = 1; e <= W; e++) {
            const i = t['hlevel' + e].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    h.format({ title: s, index: e }),
                  ),
                },
                { id: `${n}HLineLevel${e}` },
              )
            z.push(r)
          }
          const R = (0, l.createPropertyDefinitionsLeveledLinesGroup)(z, n + 'HLeveledLinesGroup'),
            E = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  u.format({ title: s }),
                ),
              },
              { id: n + 'LeftLabels', title: C },
            ),
            G = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  v.format({ title: s }),
                ),
              },
              { id: n + 'RightLabels', title: A },
            ),
            F = (0, l.createPropertyDefinitionsGeneralGroup)([R, E, G], n + 'HLevelGroup', k)
          e.push(F)
          const O = [],
            U = this._source.vLevelsCount()
          for (let e = 1; e <= U; e++) {
            const i = t['vlevel' + e].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    h.format({ title: s, index: e }),
                  ),
                },
                { id: `${n}VLineLevel${e}` },
              )
            O.push(r)
          }
          const $ = (0, l.createPropertyDefinitionsLeveledLinesGroup)(O, n + 'VLeveledLinesGroup'),
            I = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  b.format({ title: s }),
                ),
              },
              { id: n + 'TopLabels', title: M },
            ),
            H = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  D.format({ title: s }),
                ),
              },
              { id: n + 'BottomLabels', title: V },
            ),
            j = (0, l.createPropertyDefinitionsGeneralGroup)([$, I, H], n + 'VLevelGroup', L)
          e.push(j)
          const Y = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                g.format({ title: s }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: S },
          )
          e.push(Y)
          const X = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                y.format({ title: s }),
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                f.format({ title: s }),
              ),
            },
            { id: n + 'Background', title: x },
          )
          e.push(X)
          const q = t.grid.childs(),
            J = (0, l.createLinePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, q.visible, w.format({ title: s })),
                color: (0, l.getColorDefinitionProperty)(this._propertyApplier, q.color, null, _.format({ title: s })),
                width: (0, l.convertToDefinitionProperty)(this._propertyApplier, q.linewidth, P.format({ title: s })),
                style: (0, l.convertToDefinitionProperty)(this._propertyApplier, q.linestyle, m.format({ title: s })),
              },
              { id: n + 'GridLine', title: B },
            )
          e.push(J)
          const K = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, t.reverse, T.format({ title: s })) },
            { id: n + 'Reverse', title: N },
          )
          return e.push(K), { definitions: e }
        }
      }
    },
    29216: (e, t, i) => {
      i.r(t), i.d(t, { FibSpiralDefinitionsViewModel: () => y })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(68623),
        s = i(80054)
      const a = new n.TranslatedString('change {title} line color', (0, r.t)('change {title} line color')),
        c = new n.TranslatedString('change {title} line width', (0, r.t)('change {title} line width')),
        p = new n.TranslatedString('change {title} line style', (0, r.t)('change {title} line style')),
        d = new n.TranslatedString('change {title} counterclockwise', (0, r.t)('change {title} counterclockwise')),
        h = (0, r.t)('Line'),
        g = (0, r.t)('Counterclockwise')
      class y extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, s.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLinePropertyDefinition)(
                {
                  color: (0, o.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.linecolor,
                    null,
                    a.format({ title: r }),
                  ),
                  width: (0, o.convertToDefinitionProperty)(this._propertyApplier, e.linewidth, c.format({ title: r })),
                  style: (0, o.convertToDefinitionProperty)(this._propertyApplier, e.linestyle, p.format({ title: r })),
                },
                { id: i + 'Line', title: h },
              ),
              (0, o.createCheckablePropertyDefinition)(
                {
                  checked: (0, o.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.counterclockwise,
                    d.format({ title: r }),
                  ),
                },
                { id: i + 'Counterclockwise', title: g },
              ),
            ],
          }
        }
      }
    },
    45384: (e, t, i) => {
      i.r(t),
        i.d(t, {
          availableAlignmentVerticalItems: () => S,
          availableAlignmentHorizontalItems: () => x,
          FibTimezoneDefinitionsViewModel: () => k,
        })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(50366),
        s = i(68623),
        a = i(52714),
        c = i.n(a),
        p = i(80054),
        d = i(88451)
      const h = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line style',
          (0, n.t)('change {title} level {index} line style'),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        v = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        b = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        D = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        T = new o.TranslatedString('change {title} labels visibility', (0, n.t)('change {title} labels visibility')),
        w = new o.TranslatedString('change {title} labels alignment', (0, n.t)('change {title} labels alignment')),
        _ = (0, n.t)('Use one color'),
        P = (0, n.t)('Background'),
        m = (0, n.t)('Labels'),
        S = [
          { id: 'top', value: 'top', title: (0, n.t)('Top') },
          { id: 'middle', value: 'middle', title: (0, n.t)('Middle') },
          { id: 'bottom', value: 'bottom', title: (0, n.t)('Bottom') },
        ],
        x = [
          { id: 'left', value: 'left', title: (0, n.t)('Left') },
          { id: 'center', value: 'center', title: (0, n.t)('Center') },
          { id: 'right', value: 'right', title: (0, n.t)('Right') },
        ]
      class k extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, p.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.title()),
            a = this._source.levelsCount()
          for (let i = 1; i <= a; i++) {
            const r = t['level' + i].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    h.format({ title: s, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    g.format({ title: s, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    y.format({ title: s, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linestyle,
                    f.format({ title: s, index: i }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.coeff,
                    u.format({ title: s, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}` },
              )
            e.push(o)
          }
          const k = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new d.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: s }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: _ },
          )
          e.push(k)
          const L = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                b.format({ title: s }),
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                D.format({ title: s }),
              ),
            },
            { id: n + 'Background', title: P },
          )
          e.push(L)
          const C = (0, l.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, t.showLabels, T.format({ title: s })),
              option1: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.horzLabelsAlign,
                w.format({ title: s }),
              ),
              option2: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.vertLabelsAlign,
                w.format({ title: s }),
              ),
            },
            { id: n + 'Labels', title: m, optionsItems1: new (c())(x), optionsItems2: new (c())(S) },
          )
          return e.push(C), { definitions: e }
        }
      }
    },
    90156: (e, t, i) => {
      i.r(t), i.d(t, { FibWedgeDefinitionsViewModel: () => P })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(50366),
        a = i(68623),
        c = i(80054),
        p = i(88451)
      const d = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        h = new o.TranslatedString('change {title} levels visibility', (0, n.t)('change {title} levels visibility')),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        u = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        v = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        b = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        D = (0, n.t)('Trend line'),
        T = (0, n.t)('Use one color'),
        w = (0, n.t)('Background'),
        _ = (0, n.t)('Levels')
      class P extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, c.removeSpaces)(i),
            a = new o.TranslatedString(i, this._source.title()),
            P = t.trendline.childs(),
            m = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              { showLine: P.visible, lineColor: P.color, lineWidth: P.linewidth },
              a,
              'TrendLine',
              { line: D },
            )
          e.push(m)
          const S = this._source.levelsCount()
          for (let i = 1; i <= S; i++) {
            const r = t['level' + i].childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    d.format({ title: a, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    g.format({ title: a, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    y.format({ title: a, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.coeff,
                    f.format({ title: a, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}` },
              )
            e.push(o)
          }
          const x = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                u.format({ title: a }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: T },
          )
          e.push(x)
          const k = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                v.format({ title: a }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                b.format({ title: a }),
              ),
            },
            { id: n + 'Background', title: w },
          )
          e.push(k)
          const L = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.showCoeffs, h.format({ title: a })),
            },
            { id: n + 'Levels', title: _ },
          )
          return e.push(L), { definitions: e }
        }
      }
    },
    18661: (e, t, i) => {
      i.r(t), i.d(t, { FlagMarkDefinitionsViewModel: () => c })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(50366)
      const s = new n.TranslatedString('change flag color', (0, r.t)('change flag color')),
        a = (0, r.t)('Flag')
      class c extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                { color: (0, l.getColorDefinitionProperty)(this._propertyApplier, e.flagColor, null, s) },
                { id: 'FlagColor', title: a },
              ),
            ],
          }
        }
      }
    },
    48009: (e, t, i) => {
      i.r(t), i.d(t, { isGannComplexLineTool: () => R, GannComplexAndFixedDefinitionsViewModel: () => E })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(59278),
        s = i(50366),
        a = i(68623),
        c = i(52870),
        p = i(52714),
        d = i.n(p),
        h = i(37787),
        g = i(80054),
        y = i(88451)
      const f = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        v = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        b = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        D = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        T = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        w = new o.TranslatedString('change {title} reverse', (0, n.t)('change {title} reverse')),
        _ = new o.TranslatedString(
          'change {title} fan {index} line visibility',
          (0, n.t)('change {title} fan {index} line visibility'),
        ),
        P = new o.TranslatedString(
          'change {title} fan {index} line color',
          (0, n.t)('change {title} fan {index} line color'),
        ),
        m = new o.TranslatedString(
          'change {title} fan {index} line width',
          (0, n.t)('change {title} fan {index} line width'),
        ),
        S = new o.TranslatedString(
          'change {title} arcs {index} line visibility',
          (0, n.t)('change {title} arcs {index} line visibility'),
        ),
        x = new o.TranslatedString(
          'change {title} arcs {index} line color',
          (0, n.t)('change {title} arcs {index} line color'),
        ),
        k = new o.TranslatedString(
          'change {title} arcs {index} line width',
          (0, n.t)('change {title} arcs {index} line width'),
        ),
        L = new o.TranslatedString('change top margin', (0, n.t)('change top margin')),
        C = (0, n.t)('Reverse'),
        A = (0, n.t)('Use one color'),
        M = (0, n.t)('Background'),
        V = (0, n.t)('Price/bar ratio'),
        B = (0, n.t)('Ranges and ratio'),
        N = (0, n.t)('Levels'),
        z = (0, n.t)('Fans'),
        W = (0, n.t)('Arcs')
      function R(e) {
        return e instanceof c.LineToolGannComplex
      }
      class E extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, g.removeSpaces)(i),
            a = new o.TranslatedString(i, this._source.title()),
            c = [],
            p = t.levels.childCount()
          for (let e = 0; e < p; e++) {
            const i = t.levels.childs()[e].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    f.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    u.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    v.format({ title: a, index: e }),
                  ),
                },
                { id: `${n}LineLevel${e}`, title: '' + e },
              )
            c.push(r)
          }
          const E = (0, s.createPropertyDefinitionsLeveledLinesGroup)(c, n + 'LeveledLinesGroup')
          e.push((0, s.createPropertyDefinitionsGeneralGroup)([E], n + 'LevelGroup', N))
          const G = [],
            F = t.fanlines.childCount()
          for (let e = 0; e < F; e++) {
            const i = t.fanlines.childs()[e].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    _.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    P.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    m.format({ title: a, index: e }),
                  ),
                },
                { id: `${n}FanLineLevel${e}`, title: `${i.x.value()}x${i.y.value()}` },
              )
            G.push(r)
          }
          const O = (0, s.createPropertyDefinitionsLeveledLinesGroup)(G, n + 'FanLeveledLinesGroup')
          e.push((0, s.createPropertyDefinitionsGeneralGroup)([O], n + 'FanLinesGroup', z))
          const U = [],
            $ = t.arcs.childCount()
          for (let e = 0; e < $; e++) {
            const i = t.arcs.childs()[e].childs(),
              r = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    S.format({ title: a, index: e }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    x.format({ title: a, index: e }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.width,
                    k.format({ title: a, index: e }),
                  ),
                },
                { id: `${n}ArcsLineLevel${e}`, title: `${i.x.value()}x${i.y.value()}` },
              )
            U.push(r)
          }
          const I = (0, s.createPropertyDefinitionsLeveledLinesGroup)(U, n + 'ArcsLeveledLinesGroup')
          e.push((0, s.createPropertyDefinitionsGeneralGroup)([I], n + 'ArcsLinesGroup', W))
          const H = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new y.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  b.format({ title: a }),
                ),
                null,
                null,
              ),
            },
            { id: n + 'AllLineColor', title: A },
          )
          e.push(H)
          const j = t.arcsBackground.childs(),
            Y = (0, s.createTransparencyPropertyDefinition)(
              {
                checked: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.fillBackground,
                  D.format({ title: a }),
                ),
                transparency: (0, s.convertToDefinitionProperty)(
                  this._propertyApplier,
                  j.transparency,
                  T.format({ title: a }),
                ),
              },
              { id: n + 'Background', title: M },
            )
          e.push(Y)
          const X = (0, s.createCheckablePropertyDefinition)(
            { checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, t.reverse, w.format({ title: a })) },
            { id: n + 'Reverse', title: C },
          )
          if ((e.push(X), R(this._source))) {
            const t = this._source,
              i = t.properties().childs(),
              r = (0, s.createNumberPropertyDefinition)(
                {
                  value: (0, s.convertToDefinitionProperty)(this._propertyApplier, i.scaleRatio, L, [
                    (0, h.limitedPrecision)(7),
                    e => (null !== e ? parseFloat(t.getScaleRatioFormatter().format('' + e)) : null),
                  ]),
                },
                {
                  id: 'scaleRatio',
                  title: V,
                  min: new (d())(1e-7),
                  max: new (d())(1e8),
                  step: new (d())(t.getScaleRatioStep()),
                },
              )
            e.push(r)
            const n = i.labelsStyle.childs(),
              o = (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                { showText: i.showLabels, fontSize: n.fontSize, bold: n.bold, italic: n.italic },
                a,
                { customTitles: { text: B } },
              )
            e.push(o)
          }
          return { definitions: e }
        }
      }
    },
    73511: (e, t, i) => {
      i.r(t), i.d(t, { GannFanDefinitionsViewModel: () => w })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(50366),
        s = i(68623),
        a = i(80054),
        c = i(88451)
      const p = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        d = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        h = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line style',
          (0, n.t)('change {title} level {index} line style'),
        ),
        y = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        f = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        u = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        v = new o.TranslatedString('change {title} labels visibility', (0, n.t)('change {title} labels visibility')),
        b = (0, n.t)('Use one color'),
        D = (0, n.t)('Background'),
        T = (0, n.t)('Labels')
      class w extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.title()),
            w = this._source.levelsCount()
          for (let i = 1; i <= w; i++) {
            const r = t['level' + i].childs(),
              o = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    p.format({ title: s, index: i }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    d.format({ title: s, index: i }),
                  ),
                  width: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    h.format({ title: s, index: i }),
                  ),
                  style: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linestyle,
                    g.format({ title: s, index: i }),
                  ),
                },
                { id: `${n}LineLevel${i}`, title: `${r.coeff1.value()}/${r.coeff2.value()}` },
              )
            e.push(o)
          }
          const _ = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                y.format({ title: s }),
              ),
            },
            { id: n + 'AllLineColor', title: b },
          )
          e.push(_)
          const P = (0, l.createTransparencyPropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                f.format({ title: s }),
              ),
              transparency: (0, l.convertToDefinitionProperty)(
                this._propertyApplier,
                t.transparency,
                u.format({ title: s }),
              ),
            },
            { id: n + 'Background', title: D },
          )
          e.push(P)
          const m = (0, l.createCheckablePropertyDefinition)(
            {
              checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, t.showLabels, v.format({ title: s })),
            },
            { id: n + 'Labels', title: T },
          )
          return e.push(m), { definitions: e }
        }
      }
    },
    58026: (e, t, i) => {
      i.r(t), i.d(t, { GannSquareDefinitionsViewModel: () => B })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(50366),
        s = i(68623),
        a = i(80054),
        c = i(88451)
      const p = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        d = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        h = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        g = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        y = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        f = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        u = new o.TranslatedString('change {title} reverse', (0, n.t)('change {title} reverse')),
        v = new o.TranslatedString(
          'change {title} left labels visibility',
          (0, n.t)('change {title} left labels visibility'),
        ),
        b = new o.TranslatedString(
          'change {title} right labels visibility',
          (0, n.t)('change {title} right labels visibility'),
        ),
        D = new o.TranslatedString(
          'change {title} top labels visibility',
          (0, n.t)('change {title} top labels visibility'),
        ),
        T = new o.TranslatedString(
          'change {title} bottom labels visibility',
          (0, n.t)('change {title} bottom labels visibility'),
        ),
        w = new o.TranslatedString('change {title} fans visibility', (0, n.t)('change {title} fans visibility')),
        _ = new o.TranslatedString('change {title} fans line color', (0, n.t)('change {title} fans line color')),
        P = (0, n.t)('Use one color'),
        m = (0, n.t)('Background'),
        S = (0, n.t)('Price levels'),
        x = (0, n.t)('Time levels'),
        k = (0, n.t)('Left labels'),
        L = (0, n.t)('Right labels'),
        C = (0, n.t)('Top labels'),
        A = (0, n.t)('Bottom labels'),
        M = (0, n.t)('Angles'),
        V = (0, n.t)('Reverse')
      class B extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            n = (0, a.removeSpaces)(i),
            s = new o.TranslatedString(i, this._source.title()),
            B = [],
            N = this._source.hLevelsCount()
          for (let e = 1; e <= N; e++) {
            const i = t['hlevel' + e].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    h.format({ title: s, index: e }),
                  ),
                },
                { id: `${n}HLineLevel${e}` },
              )
            B.push(r)
          }
          const z = (0, l.createPropertyDefinitionsLeveledLinesGroup)(B, n + 'HLeveledLinesGroup'),
            W = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showLeftLabels,
                  v.format({ title: s }),
                ),
              },
              { id: n + 'LeftLabels', title: k },
            ),
            R = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showRightLabels,
                  b.format({ title: s }),
                ),
              },
              { id: n + 'RightLabels', title: L },
            ),
            E = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillHorzBackground,
                  y.format({ title: s }),
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.horzTransparency,
                  f.format({ title: s }),
                ),
              },
              { id: n + 'BackgroundH', title: m },
            ),
            G = (0, l.createPropertyDefinitionsGeneralGroup)([z, W, R, E], n + 'HLevelGroup', S)
          e.push(G)
          const F = [],
            O = this._source.vLevelsCount()
          for (let e = 1; e <= O; e++) {
            const i = t['vlevel' + e].childs(),
              r = (0, l.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.visible,
                    p.format({ title: s, index: e }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    i.color,
                    null,
                    d.format({ title: s, index: e }),
                  ),
                  level: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.coeff,
                    h.format({ title: s, index: e }),
                  ),
                },
                { id: `${n}VLineLevel${e}` },
              )
            F.push(r)
          }
          const U = (0, l.createPropertyDefinitionsLeveledLinesGroup)(F, n + 'VLeveledLinesGroup'),
            $ = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showTopLabels,
                  D.format({ title: s }),
                ),
              },
              { id: n + 'TopLabels', title: C },
            ),
            I = (0, l.createCheckablePropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.showBottomLabels,
                  T.format({ title: s }),
                ),
              },
              { id: n + 'BottomLabels', title: A },
            ),
            H = (0, l.createTransparencyPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.fillVertBackground,
                  y.format({ title: s }),
                ),
                transparency: (0, l.convertToDefinitionProperty)(
                  this._propertyApplier,
                  t.vertTransparency,
                  f.format({ title: s }),
                ),
              },
              { id: n + 'BackgroundV', title: m },
            ),
            j = (0, l.createPropertyDefinitionsGeneralGroup)([U, $, I, H], n + 'VLevelGroup', x)
          e.push(j)
          const Y = (0, l.createColorPropertyDefinition)(
            {
              color: (0, l.getColorDefinitionProperty)(
                this._propertyApplier,
                new c.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                g.format({ title: s }),
                !0,
              ),
            },
            { id: n + 'AllLineColor', title: P },
          )
          e.push(Y)
          const X = t.fans.childs(),
            q = (0, l.createColorPropertyDefinition)(
              {
                checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, X.visible, w.format({ title: s })),
                color: (0, l.getColorDefinitionProperty)(this._propertyApplier, X.color, null, _.format({ title: s })),
              },
              { id: n + 'FansLines', title: M },
            )
          e.push(q)
          const J = (0, l.createCheckablePropertyDefinition)(
            { checked: (0, l.convertToDefinitionProperty)(this._propertyApplier, t.reverse, u.format({ title: s })) },
            { id: n + 'Reverse', title: V },
          )
          return e.push(J), { definitions: e }
        }
      }
    },
    79462: (e, t, i) => {
      i.r(t), i.d(t, { GeneralBezierDefinitionsViewModel: () => h })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        p = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        d = (0, r.t)('Background')
      class h extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._undoModel,
                {
                  lineColor: e.linecolor,
                  lineWidth: e.linewidth,
                  lineStyle: e.linestyle,
                  extendLeft: e.extendLeft,
                  extendRight: e.extendRight,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                i,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._undoModel,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._undoModel,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'BackgroundColor'), title: d },
              ),
            ],
          }
        }
      }
    },
    80447: (e, t, i) => {
      i.r(t), i.d(t, { GeneralDatePriceRangeDefinitionsViewModel: () => m })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(59278),
        s = i(68623),
        a = i(50366),
        c = i(80054)
      const p = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        d = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        h = new n.TranslatedString('change {title} extend top', (0, r.t)('change {title} extend top')),
        g = new n.TranslatedString('change {title} extend bottom', (0, r.t)('change {title} extend bottom')),
        y = new n.TranslatedString('change {title} extend left', (0, r.t)('change {title} extend left')),
        f = (0, r.t)('Line'),
        u = (0, r.t)('Border'),
        v = (0, r.t)('Background'),
        b = (0, r.t)('Extend top'),
        D = (0, r.t)('Extend bottom'),
        T = (0, r.t)('Extend left'),
        w = (0, r.t)('Extend right'),
        _ = (0, r.t)('Label'),
        P = (0, r.t)('Label background')
      class m extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties().childs(),
            i = this._source.name(),
            r = (0, c.removeSpaces)(i),
            s = new n.TranslatedString(i, this._source.title()),
            m = (0, o.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: t.linecolor, lineWidth: t.linewidth },
              s,
              'Line',
              { line: f },
            )
          if ((e.push(m), t.hasOwnProperty('borderWidth'))) {
            const i = (0, o.createLineStyleDefinition)(
              this._propertyApplier,
              { showLine: t.drawBorder, lineColor: t.borderColor, lineWidth: t.borderWidth },
              s,
              'Border',
              { line: u },
            )
            e.push(i)
          }
          const S = (0, a.createColorPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                t.fillBackground,
                p.format({ title: s }),
              ),
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                t.backgroundColor,
                t.backgroundTransparency,
                d.format({ title: s }),
              ),
            },
            { id: r + 'BackgroundColor', title: v },
          )
          if (
            (e.push(S),
            (function (e) {
              return e.hasOwnProperty('extendTop')
            })(t))
          ) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendTop,
                    h.format({ title: s }),
                  ),
                },
                { id: r + 'ExtendTop', title: b },
              ),
              n = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendBottom,
                    g.format({ title: s }),
                  ),
                },
                { id: r + 'ExtendBottom', title: D },
              )
            e.push(i, n)
          }
          if (
            (function (e) {
              return e.hasOwnProperty('extendLeft')
            })(t)
          ) {
            const i = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendLeft,
                    y.format({ title: s }),
                  ),
                },
                { id: r + 'extendLeft', title: T },
              ),
              n = (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    t.extendRight,
                    g.format({ title: s }),
                  ),
                },
                { id: r + 'ExtendBottom', title: w },
              )
            e.push(i, n)
          }
          const x = (0, l.createTextStyleDefinition)(
            this._propertyApplier,
            {
              textColor: t.textcolor,
              backgroundColor: t.labelBackgroundColor,
              backgroundTransparency: t.backgroundTransparency,
              fontSize: t.fontsize,
              backgroundVisible: t.fillLabelBackground,
            },
            s,
            { isEditable: !0, isMultiLine: !0, customTitles: { text: _, backgroundTitle: P } },
          )
          return e.push(x), { definitions: e }
        }
      }
    },
    24965: (e, t, i) => {
      i.r(t), i.d(t, { GeneralFiguresDefinitionsViewModelBase: () => g, GeneralFiguresDefinitionsViewModel: () => y })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        p = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        d = (0, r.t)('Border'),
        h = (0, r.t)('Background')
      class g extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title()),
            r = (0, o.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: e.color, lineWidth: e.linewidth },
              i,
              'Line',
              { line: d },
            ),
            l = 'transparency' in e ? e.transparency : null
          return {
            definitions: [
              r,
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    l,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'BackgroundColor'), title: h },
              ),
            ],
          }
        }
      }
      class y extends g {}
    },
    14145: (e, t, i) => {
      i.r(t), i.d(t, { GeneralTrendFiguresDefinitionsViewModel: () => y })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(59278),
        s = i(68623),
        a = i(50366),
        c = i(80054)
      const p = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        d = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        h = (0, r.t)('Prices'),
        g = (0, r.t)('Background')
      class y extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { ...e, lineColor: e.linecolor, lineWidth: e.linewidth, lineStyle: e.linestyle },
                i,
                'Line',
              ),
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  showText: e.showPrices,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                },
                i,
                { customTitles: { text: h } },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    p.format({ title: i }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, c.removeSpaces)(t + 'Background'), title: g },
              ),
            ],
          }
        }
      }
    },
    65818: (e, t, i) => {
      i.r(t), i.d(t, { GhostFeedDefinitionsViewModel: () => x })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(50366),
        s = i(52714),
        a = i.n(s),
        c = i(80054)
      const p = new n.TranslatedString('change {title} candle up color', (0, r.t)('change {title} candle up color')),
        d = new n.TranslatedString('change {title} candle down color', (0, r.t)('change {title} candle down color')),
        h = new n.TranslatedString(
          'change {title} candle border visibility',
          (0, r.t)('change {title} candle border visibility'),
        ),
        g = new n.TranslatedString(
          'change {title} candle border up color',
          (0, r.t)('change {title} candle border up color'),
        ),
        y = new n.TranslatedString(
          'change {title} candle border down color',
          (0, r.t)('change {title} candle border down color'),
        ),
        f = new n.TranslatedString(
          'change {title} candle wick visibility',
          (0, r.t)('change {title} candle wick visibility'),
        ),
        u = new n.TranslatedString('change {title} candle wick color', (0, r.t)('change {title} candle wick color')),
        v = new n.TranslatedString('change {title} transparency', (0, r.t)('change {title} transparency')),
        b = new n.TranslatedString('change {title} average HL value', (0, r.t)('change {title} average HL value')),
        D = new n.TranslatedString('change {title} variance value', (0, r.t)('change {title} variance value')),
        T = (0, r.t)('Candles'),
        w = (0, r.t)('Borders'),
        _ = (0, r.t)('Wick'),
        P = (0, r.t)('Transparency'),
        m = (0, r.t)('Avg HL in minticks'),
        S = (0, r.t)('Variance')
      class x extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, c.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title()),
            o = e.candleStyle.childs()
          return {
            definitions: [
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.upColor,
                    null,
                    p.format({ title: r }),
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.downColor,
                    null,
                    d.format({ title: r }),
                  ),
                },
                { id: i + 'Candle2Colors', title: T },
              ),
              (0, l.createTwoColorsPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.drawBorder,
                    h.format({ title: r }),
                  ),
                  color1: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.borderUpColor,
                    null,
                    g.format({ title: r }),
                  ),
                  color2: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.borderDownColor,
                    null,
                    y.format({ title: r }),
                  ),
                },
                { id: i + 'CandleBorder2Colors', title: w },
              ),
              (0, l.createColorPropertyDefinition)(
                {
                  checked: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    o.drawWick,
                    f.format({ title: r }),
                  ),
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    o.wickColor,
                    null,
                    u.format({ title: r }),
                  ),
                },
                { id: i + 'CandleWickColor', title: _ },
              ),
              (0, l.createTransparencyPropertyDefinition)(
                {
                  transparency: (0, l.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.transparency,
                    v.format({ title: r }),
                  ),
                },
                { id: i + 'Transparency', title: P },
              ),
            ],
          }
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, c.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(this._propertyApplier, e.averageHL, b.format({ title: r })),
                },
                { id: i + 'AvgHL', title: m, type: 0, min: new (a())(1), max: new (a())(5e4), step: new (a())(1) },
              ),
              (0, l.createNumberPropertyDefinition)(
                {
                  value: (0, l.convertToDefinitionProperty)(this._propertyApplier, e.variance, D.format({ title: r })),
                },
                { id: i + 'Variance', title: S, type: 0, min: new (a())(1), max: new (a())(100), step: new (a())(1) },
              ),
            ],
          }
        }
      }
    },
    19461: (e, t, i) => {
      i.r(t), i.d(t, { HighlighterDefinitionsViewModel: () => l })
      var r = i(73642),
        n = i(68623),
        o = i(24980)
      class l extends n.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor },
                new o.TranslatedString(this._source.name(), this._source.title()),
                'Line',
              ),
            ],
          }
        }
      }
    },
    81204: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalLineDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(40169),
        s = i(80054),
        a = i(68623),
        c = i(30672),
        p = i(59278)
      const d = (0, r.t)('Text'),
        h = (0, r.t)('#1 (price)', { context: 'linetool point' })
      class g extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, c.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
          )
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._getYCoordinateStepWV(),
            i = (0, l.getCoordinateYMetaInfo)(this._propertyApplier, e, t)
          return {
            definitions: [
              (0, o.createCoordinatesPropertyDefinition)(
                { y: i.property },
                { id: (0, s.removeSpaces)(this._source.name() + 'Point'), title: h, ...i.info },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, p.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } },
              ),
            ],
          }
        }
      }
    },
    58148: (e, t, i) => {
      i.r(t), i.d(t, { HorizontalRayDefinitionsViewModel: () => c })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(30672),
        s = i(59278)
      const a = (0, r.t)('Text')
      class c extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
            ],
          }
        }
      }
    },
    80449: (e, t, i) => {
      i.r(t), i.d(t, { IconsDefinitionsViewModel: () => p })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(50366),
        s = i(80054)
      const a = new n.TranslatedString('change {title} color', (0, r.t)('change {title} color')),
        c = (0, r.t)('Color')
      class p extends o.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, l.createColorPropertyDefinition)(
                {
                  color: (0, l.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color,
                    null,
                    a.format({ title: i }),
                  ),
                },
                { id: (0, s.removeSpaces)(t + 'Color'), title: c },
              ),
            ],
          }
        }
      }
    },
    55510: (e, t, i) => {
      i.r(t), i.d(t, { NoteDefinitionsViewModel: () => d })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        p = (0, r.t)('Label')
      class d extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.markerColor,
                    null,
                    c.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'LabelColor'), title: p },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  fontSize: e.fontSize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
    },
    35468: (e, t, i) => {
      i.r(t), i.d(t, { ParallelChannelDefinitionsViewModel: () => b })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(68623),
        s = i(73642),
        a = i(80054)
      const c = new n.TranslatedString('change {title} extending left', (0, r.t)('change {title} extending left')),
        p = new n.TranslatedString('change {title} extending right', (0, r.t)('change {title} extending right')),
        d = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        h = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        g = (0, r.t)('Background'),
        y = (0, r.t)('Extend left line'),
        f = (0, r.t)('Extend right line'),
        u = (0, r.t)('Channel'),
        v = (0, r.t)('Middle')
      class b extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, s.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineStyle: e.linestyle, lineWidth: e.linewidth },
                r,
                'ChannelLine',
                { line: u },
              ),
              (0, s.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  showLine: e.showMidline,
                  lineColor: e.midlinecolor,
                  lineStyle: e.midlinestyle,
                  lineWidth: e.midlinewidth,
                },
                r,
                'MiddleLine',
                { line: v },
              ),
              (0, o.createCheckablePropertyDefinition)(
                {
                  checked: (0, o.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.extendLeft,
                    c.format({ title: r }),
                  ),
                },
                { id: i + 'ExtendLeft', title: y },
              ),
              (0, o.createCheckablePropertyDefinition)(
                {
                  checked: (0, o.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.extendRight,
                    p.format({ title: r }),
                  ),
                },
                { id: i + 'ExtendRight', title: f },
              ),
              (0, o.createColorPropertyDefinition)(
                {
                  checked: (0, o.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    d.format({ title: r }),
                  ),
                  color: (0, o.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    h.format({ title: r }),
                  ),
                },
                { id: i + 'Background', title: g },
              ),
            ],
          }
        }
      }
    },
    4283: (e, t, i) => {
      i.r(t), i.d(t, { PathDefinitionsViewModel: () => a })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623)
      const s = (0, r.t)('Line')
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                {
                  lineColor: e.lineColor,
                  lineWidth: e.lineWidth,
                  lineStyle: e.lineStyle,
                  leftEnd: e.leftEnd,
                  rightEnd: e.rightEnd,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                'Line',
                { line: s },
              ),
            ],
          }
        }
      }
    },
    93262: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithBackgroundDefinitionViewModel: () => f })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(59278),
        s = i(68623),
        a = i(50366),
        c = i(80054)
      const p = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        d = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        h = (0, r.t)('Label'),
        g = (0, r.t)('Border'),
        y = (0, r.t)('Background')
      class f extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textcolor, fontSize: e.fontsize, bold: e.bold, italic: e.italic },
                i,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: h } },
              ),
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                i,
                'Line',
                { line: g },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    p.format({ title: i }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    d.format({ title: i }),
                  ),
                },
                { id: (0, c.removeSpaces)(t + 'BackgroundColor'), title: y },
              ),
            ],
          }
        }
      }
    },
    98890: (e, t, i) => {
      i.r(t), i.d(t, { PatternWithoutBackgroundDefinitionsViewModel: () => p })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(59278),
        s = i(68623)
      const a = (0, r.t)('Label'),
        c = (0, r.t)('Border')
      class p extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = new n.TranslatedString(this._source.name(), this._source.title())
          return {
            definitions: [
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textcolor, fontSize: e.fontsize, bold: e.bold, italic: e.italic },
                t,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.color, lineWidth: e.linewidth },
                t,
                'Line',
                { line: c },
              ),
            ],
          }
        }
      }
    },
    34879: (e, t, i) => {
      i.r(t), i.d(t, { PitchBaseDefinitionsViewModel: () => m })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(68623),
        a = i(50366),
        c = i(80054),
        p = i(88451)
      const d = new o.TranslatedString('change {title} extend lines', (0, n.t)('change {title} extend lines')),
        h = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        g = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        y = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line style',
          (0, n.t)('change {title} level {index} line style'),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        v = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        b = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        D = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        T = (0, n.t)('Median'),
        w = (0, n.t)('Use one color'),
        _ = (0, n.t)('Background'),
        P = (0, n.t)('Extend lines')
      class m extends s.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            n = this._source.name(),
            s = (0, c.removeSpaces)(n),
            m = new o.TranslatedString(n, this._source.title())
          t.hasChild('extendLines') &&
            e.push(
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    i.extendLines,
                    d.format({ title: m }),
                  ),
                },
                { id: s + 'ExtendLines', title: P },
              ),
            )
          const S = i.median.childs(),
            x = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              { lineColor: S.color, lineStyle: S.linestyle, lineWidth: S.linewidth },
              m,
              'Median',
              { line: T },
            )
          e.push(x)
          const k = this._source.levelsCount()
          for (let t = 0; t <= k; t++) {
            const r = i['level' + t].childs(),
              n = (0, a.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.visible,
                    h.format({ title: m, index: t + 1 }),
                  ),
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    r.color,
                    null,
                    g.format({ title: m, index: t + 1 }),
                  ),
                  width: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linewidth,
                    y.format({ title: m, index: t + 1 }),
                  ),
                  style: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.linestyle,
                    f.format({ title: m, index: t + 1 }),
                  ),
                  level: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    r.coeff,
                    u.format({ title: m, index: t + 1 }),
                  ),
                },
                { id: `${s}LineLevel${t + 1}` },
              )
            e.push(n)
          }
          const L = (0, a.createColorPropertyDefinition)(
            {
              color: (0, a.getColorDefinitionProperty)(
                this._propertyApplier,
                new p.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                v.format({ title: m }),
                !0,
              ),
            },
            { id: s + 'AllLineColor', title: w },
          )
          e.push(L)
          const C = (0, a.createTransparencyPropertyDefinition)(
            {
              checked: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                b.format({ title: m }),
              ),
              transparency: (0, a.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                D.format({ title: m }),
              ),
            },
            { id: s + 'Background', title: _ },
          )
          return e.push(C), { definitions: e }
        }
      }
    },
    84806: (e, t, i) => {
      i.r(t), i.d(t, { PitchForkDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(34879),
        s = i(30823),
        a = i(52714),
        c = i.n(a)
      const p = new n.TranslatedString('change {title} style', (0, r.t)('change {title} style')),
        d = (0, r.t)('Style'),
        h = [
          { value: s.LineToolPitchforkStyle.Original, title: (0, r.t)('Original') },
          { value: s.LineToolPitchforkStyle.Schiff2, title: (0, r.t)('Schiff') },
          { value: s.LineToolPitchforkStyle.Schiff, title: (0, r.t)('Modified Schiff') },
          { value: s.LineToolPitchforkStyle.Inside, title: (0, r.t)('Inside') },
        ]
      class g extends l.PitchBaseDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = super._stylePropertyDefinitions(),
            t = this._source.properties().childs(),
            i = this._source.name(),
            r = new n.TranslatedString(i, this._source.title()),
            l = (0, o.createOptionsPropertyDefinition)(
              { option: (0, o.convertToDefinitionProperty)(this._propertyApplier, t.style, p.format({ title: r })) },
              { id: i + 'PitchStyle', title: d, options: new (c())(h) },
            )
          return e.definitions.push(l), e
        }
      }
    },
    29946: (e, t, i) => {
      i.r(t), i.d(t, { PolylinesDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        p = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        d = (0, r.t)('Border'),
        h = (0, r.t)('Background')
      class g extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                i,
                'Line',
                { line: d },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'BackgroundColor'), title: h },
              ),
            ],
          }
        }
      }
    },
    53697: (e, t, i) => {
      i.r(t), i.d(t, { PredictionDefinitionsViewModel: () => C })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} source text color',
          (0, r.t)('change {title} source text color'),
        ),
        p = new n.TranslatedString(
          'change {title} source background color',
          (0, r.t)('change {title} source background color'),
        ),
        d = new n.TranslatedString(
          'change {title} source border color',
          (0, r.t)('change {title} source border color'),
        ),
        h = new n.TranslatedString('change {title} target text color', (0, r.t)('change {title} target text color')),
        g = new n.TranslatedString(
          'change {title} target background color',
          (0, r.t)('change {title} target background color'),
        ),
        y = new n.TranslatedString(
          'change {title} target border color',
          (0, r.t)('change {title} target border color'),
        ),
        f = new n.TranslatedString('change {title} success text color', (0, r.t)('change {title} success text color')),
        u = new n.TranslatedString(
          'change {title} success background color',
          (0, r.t)('change {title} success background color'),
        ),
        v = new n.TranslatedString('change {title} failure text color', (0, r.t)('change {title} failure text color')),
        b = new n.TranslatedString(
          'change {title} failure background color',
          (0, r.t)('change {title} failure background color'),
        ),
        D = (0, r.t)('Source text'),
        T = (0, r.t)('Source background'),
        w = (0, r.t)('Source border'),
        _ = (0, r.t)('Target text'),
        P = (0, r.t)('Target background'),
        m = (0, r.t)('Target border'),
        S = (0, r.t)('Success text'),
        x = (0, r.t)('Success background'),
        k = (0, r.t)('Failure text'),
        L = (0, r.t)('Failure background')
      class C extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                r,
                'Line',
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceTextColor,
                    null,
                    c.format({ title: r }),
                  ),
                },
                { id: i + 'SourceTextColor', title: D },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceBackColor,
                    e.transparency,
                    p.format({ title: r }),
                  ),
                },
                { id: i + 'SourceBackgroundColor', title: T },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.sourceStrokeColor,
                    null,
                    d.format({ title: r }),
                  ),
                },
                { id: i + 'SourceBorderColor', title: w },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetTextColor,
                    null,
                    h.format({ title: r }),
                  ),
                },
                { id: i + 'TargetTextColor', title: _ },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetBackColor,
                    null,
                    g.format({ title: r }),
                  ),
                },
                { id: i + 'TargetBackgroundColor', title: P },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.targetStrokeColor,
                    null,
                    y.format({ title: r }),
                  ),
                },
                { id: i + 'TargetBorderColor', title: m },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successTextColor,
                    null,
                    f.format({ title: r }),
                  ),
                },
                { id: i + 'SuccessTextColor', title: S },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.successBackground,
                    null,
                    u.format({ title: r }),
                  ),
                },
                { id: i + 'SuccessBackgroundColor', title: x },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureTextColor,
                    null,
                    v.format({ title: r }),
                  ),
                },
                { id: i + 'FailureTextColor', title: k },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.failureBackground,
                    null,
                    b.format({ title: r }),
                  ),
                },
                { id: i + 'FailureBackgroundColor', title: L },
              ),
            ],
          }
        }
      }
    },
    61641: (e, t, i) => {
      i.r(t), i.d(t, { PriceLabelDefinitionsViewModel: () => a })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(68623)
      const s = (0, r.t)('Text')
      class a extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.transparency,
                  borderColor: e.borderColor,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { customTitles: { text: s } },
              ),
            ],
          }
        }
      }
    },
    90727: (e, t, i) => {
      i.r(t), i.d(t, { PriceNoteDefinitionsViewModel: () => f })
      var r = i(28353),
        n = i(24980),
        o = i(59278),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString('change {title} line color', (0, r.t)('change {title} line color')),
        p = (0, r.t)('Label text'),
        d = (0, r.t)('Text'),
        h = (0, r.t)('Line color'),
        g = (0, r.t)('Label border'),
        y = (0, r.t)('Label background')
      class f extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, a.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title()),
            l = (0, s.createColorPropertyDefinition)(
              {
                color: (0, s.getColorDefinitionProperty)(
                  this._propertyApplier,
                  e.lineColor,
                  null,
                  c.format({ title: r }),
                ),
              },
              { id: i + 'LineColor', title: h },
            )
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.priceLabelTextColor,
                  fontSize: e.priceLabelFontSize,
                  bold: e.priceLabelBold,
                  italic: e.priceLabelItalic,
                  backgroundColor: e.priceLabelBackgroundColor,
                  borderColor: e.priceLabelBorderColor,
                },
                r,
                { isEditable: !1, isMultiLine: !1, customTitles: { text: p, borderTitle: g, backgroundTitle: y } },
              ),
              l,
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, o.createTextStyleDefinition)(
                this._propertyApplier,
                { ...e, showText: e.showLabel, textColor: e.textColor, fontSize: e.fontSize },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } },
              ),
            ],
          }
        }
      }
    },
    12590: (e, t, i) => {
      i.r(t), i.d(t, { ProjectionDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background color 1',
          (0, r.t)('change {title} background color 1'),
        ),
        p = new n.TranslatedString('change {title} background color 2', (0, r.t)('change {title} background color 2')),
        d = (0, r.t)('Border'),
        h = (0, r.t)('Background')
      class g extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, s.createTwoColorsPropertyDefinition)(
                {
                  color1: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color1,
                    e.transparency,
                    c.format({ title: i }),
                  ),
                  color2: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.color2,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'Background2Color'), title: h },
              ),
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.trendline.childs().color, lineWidth: e.linewidth },
                i,
                'Line',
                { line: d },
              ),
            ],
          }
        }
      }
    },
    39457: (e, t, i) => {
      i.r(t), i.d(t, { RectangleDefinitionsViewModel: () => y })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(24965),
        s = i(59278)
      const a = new n.TranslatedString('change {title} extending left', (0, r.t)('change {title} extending left')),
        c = new n.TranslatedString('change {title} extending right', (0, r.t)('change {title} extending right')),
        p = (0, r.t)('Text'),
        d = (0, r.t)('Extend left'),
        h = (0, r.t)('Extend right'),
        g = [
          { value: 'bottom', title: (0, r.t)('Top') },
          { value: 'middle', title: (0, r.t)('Inside') },
          { value: 'top', title: (0, r.t)('Bottom') },
        ]
      class y extends l.GeneralFiguresDefinitionsViewModelBase {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title()),
            r = super._stylePropertyDefinitions(),
            l = (0, o.createCheckablePropertyDefinition)(
              {
                checked: (0, o.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.extendRight,
                  c.format({ title: i }),
                ),
              },
              { id: t + 'ExtendRight', title: h },
            )
          r.definitions.push(l)
          const s = (0, o.createCheckablePropertyDefinition)(
            {
              checked: (0, o.convertToDefinitionProperty)(this._propertyApplier, e.extendLeft, a.format({ title: i })),
            },
            { id: t + 'ExtendLeft', title: d },
          )
          return r.definitions.push(s), r
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.textColor,
                  text: e.text,
                  bold: e.bold,
                  italic: e.italic,
                  fontSize: e.fontSize,
                  horzLabelsAlign: e.horzLabelsAlign,
                  vertLabelsAlign: e.vertLabelsAlign,
                  showText: e.showLabel,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, alignmentVerticalItems: g, customTitles: { text: p } },
              ),
            ],
          }
        }
      }
    },
    18736: (e, t, i) => {
      i.r(t), i.d(t, { RiskRewardDefinitionsViewModel: () => H })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(59278),
        s = i(68623),
        a = i(50366),
        c = i(10324),
        p = i(52714),
        d = i.n(p),
        h = i(80054)
      const g = new n.TranslatedString('change {title} stop color', (0, r.t)('change {title} stop color')),
        y = new n.TranslatedString('change {title} target color', (0, r.t)('change {title} target color')),
        f = new n.TranslatedString(
          'change {title} price labels visibility',
          (0, r.t)('change {title} price labels visibility'),
        ),
        u = new n.TranslatedString('change {title} compact stats mode', (0, r.t)('change {title} compact stats mode')),
        v = new n.TranslatedString('change {title} always show stats', (0, r.t)('change {title} always show stats')),
        b = new n.TranslatedString('change {title} account size', (0, r.t)('change {title} account size')),
        D = new n.TranslatedString('change {title} lot size', (0, r.t)('change {title} lot size')),
        T = new n.TranslatedString('change {title} risk', (0, r.t)('change {title} risk')),
        w = new n.TranslatedString('change {title} risk display mode', (0, r.t)('change {title} risk display mode')),
        _ = new n.TranslatedString('change {title} entry price', (0, r.t)('change {title} entry price')),
        P = new n.TranslatedString('change {title} profit level', (0, r.t)('change {title} profit level')),
        m = new n.TranslatedString('change {title} profit price', (0, r.t)('change {title} profit price')),
        S = new n.TranslatedString('change {title} stop level', (0, r.t)('change {title} stop level')),
        x = new n.TranslatedString('change {title} stop price', (0, r.t)('change {title} stop price')),
        k = (0, r.t)('Lines'),
        L = (0, r.t)('Stop color'),
        C = (0, r.t)('Target color'),
        A = (0, r.t)('Text'),
        M = (0, r.t)('Compact stats mode'),
        V = (0, r.t)('Ticks'),
        B = (0, r.t)('Price'),
        N = (0, r.t)('Entry price'),
        z = (0, r.t)('Profit level'),
        W = (0, r.t)('Stop level'),
        R = (0, r.t)('Account size'),
        E = (0, r.t)('Lot size'),
        G = (0, r.t)('Risk'),
        F = (0, r.t)('Always show stats'),
        O = (0, r.t)('Price labels'),
        U = (0, r.t)('%'),
        $ = (0, r.t)('Cash')
      function I(e) {
        return [
          { value: c.RiskDisplayMode.Percentage, title: U },
          { value: c.RiskDisplayMode.Money, title: e || $ },
        ]
      }
      class H extends s.LineDataSourceDefinitionsViewModel {
        constructor(e, t) {
          super(e, t)
          const i = this._source.properties().childs(),
            r = i.riskDisplayMode.value()
          ;(this._riskMaxWV = new (d())(this._getRiskMax(r))),
            (this._riskStepWV = new (d())(this._getRiskStep(r))),
            (this._riskPrecisionWV = new (d())(this._getRiskPrecision(r))),
            (this._riskUnitWV = new (d())(this._getRiskUnit())),
            (this._riskUnitOptionsWV = new (d())(this._getRiskUnitOptions())),
            (this._lotSizeStepWV = new (d())(this._getLotSizeStep())),
            this._createPropertyRages(),
            i.riskDisplayMode.subscribe(this, e => this._onRiskDisplayChanged(e)),
            i.accountSize.subscribe(this, () => this._onAccountSizeChanged()),
            i.lotSize.subscribe(this, () => this._onLotSizeChanged()),
            this._undoModel
              .model()
              .mainSeries()
              .dataEvents()
              .symbolResolved()
              .subscribe(this, this._onSymbolInfoChanged)
        }
        destroy() {
          super.destroy()
          const e = this._source.properties().childs()
          e.riskDisplayMode.unsubscribeAll(this),
            e.accountSize.unsubscribeAll(this),
            e.lotSize.unsubscribeAll(this),
            this._undoModel.model().mainSeries().dataEvents().symbolResolved().unsubscribeAll(this)
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, h.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth },
                r,
                'Line',
                { line: k },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.stopBackground,
                    e.stopBackgroundTransparency,
                    g.format({ title: r }),
                  ),
                },
                { id: i + 'StopColor', title: L },
              ),
              (0, a.createColorPropertyDefinition)(
                {
                  color: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.profitBackground,
                    e.profitBackgroundTransparency,
                    y.format({ title: r }),
                  ),
                },
                { id: i + 'ProfitColor', title: C },
              ),
              (0, l.createTextStyleDefinition)(
                this._propertyApplier,
                { textColor: e.textcolor, fontSize: e.fontsize },
                r,
                { isEditable: !0, isMultiLine: !0, customTitles: { text: A } },
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showPriceLabels,
                    f.format({ title: r }),
                  ),
                },
                { id: i + 'ShowPriceLabels', title: O },
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.compact, u.format({ title: r })),
                },
                { id: i + 'CompactMode', title: M },
              ),
              (0, a.createCheckablePropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.alwaysShowStats,
                    v.format({ title: r }),
                  ),
                },
                { id: i + 'AlwaysShowStats', title: F },
              ),
            ],
          }
        }
        _inputsPropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = (0, h.removeSpaces)(t),
            r = new n.TranslatedString(t, this._source.title()),
            o = this._getYCoordinateStepWV(),
            l = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.accountSize, b.format({ title: r })),
              },
              {
                id: i + 'AccountSize',
                title: R,
                type: 1,
                min: new (d())(1e-9),
                max: new (d())(1e9),
                step: new (d())(1),
                unit: this._riskUnitWV,
              },
            ),
            s = (0, a.createNumberPropertyDefinition)(
              { value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.lotSize, D.format({ title: r })) },
              {
                id: i + 'LotSize',
                title: E,
                type: 1,
                min: new (d())(1e-9),
                max: new (d())(1e8),
                step: this._lotSizeStepWV,
              },
            ),
            c = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.risk, T.format({ title: r }), [
                  e => parseFloat(e),
                ]),
                unitOptionsValue: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.riskDisplayMode,
                  w.format({ title: r }),
                ),
              },
              {
                id: i + 'Risk',
                title: G,
                type: 1,
                min: new (d())(1e-9),
                max: this._riskMaxWV,
                precision: this._riskPrecisionWV,
                step: this._riskStepWV,
                unitOptions: this._riskUnitOptionsWV,
              },
            ),
            p = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.entryPrice, _.format({ title: r })),
              },
              { id: i + 'EntryPrice', title: N, type: 1, step: o },
            ),
            g = (0, a.createPropertyDefinitionsGeneralGroup)([l, s, c, p], i + 'AccountRisk'),
            y = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.profitLevel, P.format({ title: r })),
              },
              {
                id: i + 'ProfitLevelTicks',
                title: V,
                type: 0,
                min: new (d())(0),
                max: new (d())(1e9),
                step: new (d())(1),
              },
            ),
            f = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(
                  this._propertyApplier,
                  e.targetPrice,
                  m.format({ title: r }),
                  [e => e, e => this._source.preparseProfitPrice(e)],
                ),
              },
              { id: i + 'ProfitLevelPrice', title: B, type: 1, step: o },
            ),
            u = (0, a.createPropertyDefinitionsGeneralGroup)([y, f], i + 'ProfitLevel', z),
            v = (0, a.createNumberPropertyDefinition)(
              { value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.stopLevel, S.format({ title: r })) },
              {
                id: i + 'StopLevelTicks',
                title: V,
                type: 0,
                min: new (d())(0),
                max: new (d())(1e9),
                step: new (d())(1),
              },
            ),
            k = (0, a.createNumberPropertyDefinition)(
              {
                value: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.stopPrice, x.format({ title: r }), [
                  e => e,
                  e => this._source.preparseStopPrice(e),
                ]),
              },
              { id: i + 'StopLevelPrice', title: B, type: 1, step: o },
            )
          return { definitions: [g, u, (0, a.createPropertyDefinitionsGeneralGroup)([v, k], i + 'StopLevel', W)] }
        }
        _onRiskDisplayChanged(e) {
          const t = e.value()
          this._riskMaxWV.setValue(this._getRiskMax(t)),
            this._riskStepWV.setValue(this._getRiskStep(t)),
            this._riskPrecisionWV.setValue(this._getRiskPrecision(t))
        }
        _onAccountSizeChanged() {
          this._riskMaxWV.setValue(this._getRiskMax(this._source.properties().childs().riskDisplayMode.value()))
        }
        _onLotSizeChanged() {
          this._lotSizeStepWV.setValue(this._getLotSizeStep())
        }
        _onSymbolInfoChanged() {
          this._riskUnitWV.setValue(this._getRiskUnit()), this._riskUnitOptionsWV.setValue(this._getRiskUnitOptions())
        }
        _getRiskMax(e) {
          return e === c.RiskDisplayMode.Percentage ? 100 : this._source.properties().childs().accountSize.value()
        }
        _getRiskStep(e) {
          return e === c.RiskDisplayMode.Percentage ? 0.01 : 1
        }
        _getRiskPrecision(e) {
          if (e === c.RiskDisplayMode.Percentage) return 2
        }
        _getLotSizeStep() {
          const e = this._source.properties().childs().lotSize.value()
          if (e % 1 == 0) return 1
          const t = e.toString(),
            i = t.split('.')
          if (2 === i.length) return Number('1e-' + i[1].length)
          {
            const e = /\d+e-(\d+)/.exec(t)
            if (null !== e) return Number('1e-' + e[1])
          }
          return this._lotSizeStepWV.value()
        }
        _getRiskUnit() {
          const e = this._undoModel.model().mainSeries().symbolInfo()
          return (null !== e && e.currency_code) || ''
        }
        _getRiskUnitOptions() {
          const e = this._undoModel.model().mainSeries().symbolInfo()
          return null !== e ? I(e.currency_code) : I()
        }
      }
    },
    30882: (e, t, i) => {
      i.r(t), i.d(t, { SignpostDefinitionsViewModel: () => b })
      var r = i(28353),
        n = i(24980),
        o = i(80054),
        l = i(52714),
        s = i.n(l),
        a = i(50366),
        c = i(59278),
        p = i(40169),
        d = i(68623)
      const h = new n.TranslatedString(
          'change vertical position Y coordinate',
          (0, r.t)('change vertical position Y coordinate'),
        ),
        g = new n.TranslatedString('change {title} emoji visibility', (0, r.t)('change {title} emoji visibility')),
        y = new n.TranslatedString(
          'change {title} image background color',
          (0, r.t)('change {title} image background color'),
        ),
        f = new n.TranslatedString('change {title} emoji', (0, r.t)('change {title} emoji')),
        u = (0, r.t)('#1 (vertical position %, bar)', { context: 'linetool point' }),
        v = (0, r.t)('Emoji pin')
      class b extends d.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, c.createTextStyleDefinition)(
                this._propertyApplier,
                { text: e.text, fontSize: e.fontSize, bold: e.bold, italic: e.italic },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = this._source.name(),
            i = (0, p.getCoordinateXMetaInfo)(this._propertyApplier, e),
            r = {
              property: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.price, h),
              info: { typeY: 1, stepY: new (s())(1), minY: new (s())(-100), maxY: new (s())(100) },
            }
          return {
            definitions: [
              (0, a.createCoordinatesPropertyDefinition)(
                { x: i.property, y: r.property },
                { id: (0, o.removeSpaces)(`${t}Coordinates${u}`), title: u, ...i.info, ...r.info },
              ),
            ],
          }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, a.createEmojiPropertyDefinition)(
                {
                  checked: (0, a.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.showImage,
                    g.format({ title: i }),
                  ),
                  backgroundColor: (0, a.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.plateColor,
                    null,
                    y.format({ title: i }),
                  ),
                  emoji: (0, a.convertToDefinitionProperty)(this._propertyApplier, e.emoji, f.format({ title: i })),
                },
                { id: (0, o.removeSpaces)(`${t}Emoji${u}`), title: v },
              ),
            ],
          }
        }
      }
    },
    99734: (e, t, i) => {
      i.r(t), i.d(t, { TextDefinitionsViewModel: () => l })
      var r = i(59278),
        n = i(68623),
        o = i(24980)
      class l extends n.LineDataSourceDefinitionsViewModel {
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, r.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  textColor: e.color,
                  fontSize: e.fontsize,
                  bold: e.bold,
                  italic: e.italic,
                  text: e.text,
                  backgroundVisible: e.fillBackground,
                  backgroundColor: e.backgroundColor,
                  backgroundTransparency: e.backgroundTransparency,
                  borderVisible: e.drawBorder,
                  borderColor: e.borderColor,
                  wrap: e.wordWrap,
                },
                new o.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0 },
              ),
            ],
          }
        }
      }
    },
    3956: (e, t, i) => {
      i.r(t), i.d(t, { TimeCyclesPatternDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(73642),
        l = i(68623),
        s = i(50366),
        a = i(80054)
      const c = new n.TranslatedString(
          'change {title} background visibility',
          (0, r.t)('change {title} background visibility'),
        ),
        p = new n.TranslatedString('change {title} background color', (0, r.t)('change {title} background color')),
        d = (0, r.t)('Line'),
        h = (0, r.t)('Background')
      class g extends l.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs(),
            t = this._source.name(),
            i = new n.TranslatedString(t, this._source.title())
          return {
            definitions: [
              (0, o.createLineStyleDefinition)(
                this._propertyApplier,
                { lineColor: e.linecolor, lineWidth: e.linewidth, lineStyle: e.linestyle },
                i,
                'Line',
                { line: d },
              ),
              (0, s.createColorPropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    e.fillBackground,
                    c.format({ title: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    e.backgroundColor,
                    e.transparency,
                    p.format({ title: i }),
                  ),
                },
                { id: (0, a.removeSpaces)(t + 'BackgroundColor'), title: h },
              ),
            ],
          }
        }
      }
    },
    38909: (e, t, i) => {
      i.r(t), i.d(t, { TrendAngleDefinitionsViewModel: () => f })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(68623),
        s = i(52714),
        a = i.n(s),
        c = i(40169),
        p = i(53710)
      const d = new n.TranslatedString('change angle', (0, r.t)('change angle')),
        h = (0, r.t)('Angle'),
        g = (0, r.t)('Text'),
        y = (0, r.t)('#1 (price, bar)', { context: 'linetool point' })
      class f extends l.LineDataSourceDefinitionsViewModel {
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = [],
            i = this._source.pointsProperty().childs().points[0].childs(),
            r = this._getYCoordinateStepWV()
          t.push((0, c.getCoordinatesPropertiesDefinitions)(this._propertyApplier, i, e[0], r, y, this._source.name()))
          const n = (0, o.createNumberPropertyDefinition)(
            {
              value: (0, o.convertToDefinitionProperty)(
                this._propertyApplier,
                this._source.properties().childs().angle,
                d,
              ),
            },
            { id: 'TrendLineAngleCoordinate', title: h, min: new (a())(-360), max: new (a())(360), step: new (a())(1) },
          )
          return t.push(n), { definitions: t }
        }
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, p.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
            { text: g },
          )
        }
      }
    },
    42882: (e, t, i) => {
      i.r(t), i.d(t, { TrendBasedFibTimeDefinitionsViewModel: () => L })
      var r = i(88537),
        n = i(28353),
        o = i(24980),
        l = i(73642),
        s = i(50366),
        a = i(68623),
        c = i(45384),
        p = i(52714),
        d = i.n(p),
        h = i(80054),
        g = i(88451)
      const y = new o.TranslatedString(
          'change {title} level {index} line visibility',
          (0, n.t)('change {title} level {index} line visibility'),
        ),
        f = new o.TranslatedString(
          'change {title} level {index} line color',
          (0, n.t)('change {title} level {index} line color'),
        ),
        u = new o.TranslatedString(
          'change {title} level {index} line width',
          (0, n.t)('change {title} level {index} line width'),
        ),
        v = new o.TranslatedString(
          'change {title} level {index} line style',
          (0, n.t)('change {title} level {index} line style'),
        ),
        b = new o.TranslatedString(
          'change {title} level {index} line coeff',
          (0, n.t)('change {title} level {index} line coeff'),
        ),
        D = new o.TranslatedString('change {title} all lines color', (0, n.t)('change {title} all lines color')),
        T = new o.TranslatedString(
          'change {title} background visibility',
          (0, n.t)('change {title} background visibility'),
        ),
        w = new o.TranslatedString(
          'change {title} background transparency',
          (0, n.t)('change {title} background transparency'),
        ),
        _ = new o.TranslatedString('change {title} labels visibility', (0, n.t)('change {title} labels visibility')),
        P = new o.TranslatedString('change {title} labels alignment', (0, n.t)('change {title} labels alignment')),
        m = (0, n.t)('Trend line'),
        S = (0, n.t)('Use one color'),
        x = (0, n.t)('Background'),
        k = (0, n.t)('Labels')
      class L extends a.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = [],
            t = this._source.properties(),
            i = t.childs(),
            n = this._source.name(),
            a = (0, h.removeSpaces)(n),
            p = new o.TranslatedString(n, this._source.title()),
            L = i.trendline.childs(),
            C = (0, l.createLineStyleDefinition)(
              this._propertyApplier,
              { showLine: L.visible, lineColor: L.color, lineStyle: L.linestyle, lineWidth: L.linewidth },
              p,
              'TrendLine',
              { line: m },
            )
          e.push(C)
          const A = this._source.levelsCount()
          for (let i = 1; i <= A; i++) {
            const n = (0, r.ensureDefined)(t.child('level' + i)).childs(),
              o = (0, s.createLeveledLinePropertyDefinition)(
                {
                  checked: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.visible,
                    y.format({ title: p, index: i }),
                  ),
                  color: (0, s.getColorDefinitionProperty)(
                    this._propertyApplier,
                    n.color,
                    null,
                    f.format({ title: p, index: i }),
                  ),
                  width: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linewidth,
                    u.format({ title: p, index: i }),
                  ),
                  style: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.linestyle,
                    v.format({ title: p, index: i }),
                  ),
                  level: (0, s.convertToDefinitionProperty)(
                    this._propertyApplier,
                    n.coeff,
                    b.format({ title: p, index: i }),
                  ),
                },
                { id: `${a}LineLevel${i}` },
              )
            e.push(o)
          }
          const M = (0, s.createColorPropertyDefinition)(
            {
              color: (0, s.getColorDefinitionProperty)(
                this._propertyApplier,
                new g.CollectibleColorPropertyUndoWrapper(
                  (0, r.ensureNotNull)(this._source.lineColorsProperty()),
                  this._propertyApplier,
                  null,
                ),
                null,
                D.format({ title: p }),
                !0,
              ),
            },
            { id: a + 'AllLineColor', title: S },
          )
          e.push(M)
          const V = (0, s.createTransparencyPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.fillBackground,
                T.format({ title: p }),
              ),
              transparency: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.transparency,
                w.format({ title: p }),
              ),
            },
            { id: a + 'Background', title: x },
          )
          e.push(V)
          const B = (0, s.createTwoOptionsPropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(this._propertyApplier, i.showCoeffs, _.format({ title: p })),
              option1: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.horzLabelsAlign,
                P.format({ title: p }),
              ),
              option2: (0, s.convertToDefinitionProperty)(
                this._propertyApplier,
                i.vertLabelsAlign,
                P.format({ title: p }),
              ),
            },
            {
              id: a + 'Labels',
              title: k,
              optionsItems1: new (d())(c.availableAlignmentHorizontalItems),
              optionsItems2: new (d())(c.availableAlignmentVerticalItems),
            },
          )
          return e.push(B), { definitions: e }
        }
      }
    },
    43266: (e, t, i) => {
      i.r(t), i.d(t, { TrendLineDefinitionsViewModel: () => c })
      var r = i(28353),
        n = i(24980),
        o = i(68623),
        l = i(53710),
        s = i(59278)
      const a = (0, r.t)('Text')
      class c extends o.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, l.getTrendLineToolsStylePropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
          )
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, s.createTextStyleDefinition)(
                this._propertyApplier,
                { ...e, showText: e.showLabel, textColor: e.textcolor, fontSize: e.fontsize },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: a } },
              ),
            ],
          }
        }
      }
    },
    90308: (e, t, i) => {
      i.r(t), i.d(t, { VerticalLineDefinitionsViewModel: () => g })
      var r = i(28353),
        n = i(24980),
        o = i(50366),
        l = i(40169),
        s = i(30672),
        a = i(80054),
        c = i(68623),
        p = i(59278)
      const d = (0, r.t)('Text'),
        h = (0, r.t)('#1 (bar)', { context: 'linetool point' })
      class g extends c.LineDataSourceDefinitionsViewModel {
        _stylePropertyDefinitions() {
          const e = this._source.properties().childs()
          return (0, s.getLinesStylesPropertiesDefinitions)(
            this._propertyApplier,
            e,
            new n.TranslatedString(this._source.name(), this._source.title()),
          )
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.pointsProperty().childs().points[0].childs(),
            t = (0, l.getCoordinateXMetaInfo)(this._propertyApplier, e)
          return {
            definitions: [
              (0, o.createCoordinatesPropertyDefinition)(
                { x: t.property },
                { id: (0, a.removeSpaces)(this._source.name() + 'Point1'), title: h, ...t.info },
              ),
            ],
          }
        }
        _textPropertyDefinitions() {
          const e = this._source.properties().childs()
          return {
            definitions: [
              (0, p.createTextStyleDefinition)(
                this._propertyApplier,
                {
                  ...e,
                  showText: e.showLabel,
                  textColor: e.textcolor,
                  fontSize: e.fontsize,
                  textOrientation: e.textOrientation,
                },
                new n.TranslatedString(this._source.name(), this._source.title()),
                { isEditable: !0, isMultiLine: !0, customTitles: { text: d } },
              ),
            ],
          }
        }
      }
    },
    88451: (e, t, i) => {
      i.d(t, { CollectibleColorPropertyUndoWrapper: () => s, CollectibleColorPropertyDirectWrapper: () => a })
      var r = i(88537),
        n = i(2015),
        o = i.n(n)
      class l extends o() {
        constructor(e) {
          super(), (this._listenersMappers = []), (this._isProcess = !1), (this._baseProperty = e)
        }
        destroy() {
          this._baseProperty.destroy()
        }
        value() {
          const e = this._baseProperty.value()
          return 'mixed' === e ? '' : e
        }
        visible() {
          return this._baseProperty.visible()
        }
        setValue(e) {
          ;(this._isProcess = !0),
            this._baseProperty.setValue('' === e ? 'mixed' : e, void 0, { applyValue: this._applyValue.bind(this) }),
            (this._isProcess = !1),
            this._listenersMappers.forEach(e => {
              e.method.call(e.obj, this)
            })
        }
        subscribe(e, t) {
          const i = i => {
              this._isProcess || t.call(e, this)
            },
            r = { obj: e, method: t, callback: i }
          this._listenersMappers.push(r), this._baseProperty.subscribe(e, i)
        }
        unsubscribe(e, t) {
          var i
          const n = (0, r.ensureDefined)(
            null === (i = this._listenersMappers.find(i => i.obj === e && i.method === t)) || void 0 === i
              ? void 0
              : i.callback,
          )
          this._baseProperty.unsubscribe(e, n)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
      class s extends l {
        constructor(e, t, i) {
          super(e), (this._propertyApplier = t), (this._undoText = i)
        }
        _applyValue(e, t) {
          this._propertyApplier.setProperty(e, t, this._undoText)
        }
      }
      class a extends l {
        _applyValue(e, t) {
          e.setValue(t)
        }
      }
    },
  },
])
