;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3596],
  {
    47806: (e, t, i) => {
      'use strict'
      i.r(t), i.d(t, { ChartPropertyDefinitionsViewModel: () => Pt })
      var r = i(88537),
        n = i(28353),
        o = i(67337),
        a = (i(27759), i(92033), i(52714)),
        s = i.n(a),
        l = i(50366),
        c = i(80331),
        p = i(95707),
        h = i(62428),
        d = i(74325),
        g = i(87387),
        y = i(13647),
        u = i(24980),
        b = i(81465),
        v = i(79680),
        P = i(54089)
      const m = new u.TranslatedString(
          'change symbol description visibility',
          (0, n.t)('change symbol description visibility'),
        ),
        f = new u.TranslatedString('change symbol legend format', (0, n.t)('change symbol legend format')),
        w = new u.TranslatedString(
          'change open market status visibility',
          (0, n.t)('change open market status visibility'),
        ),
        S = new u.TranslatedString('change OHLC values visibility', (0, n.t)('change OHLC values visibility')),
        D = new u.TranslatedString('change bar change visibility', (0, n.t)('change bar change visibility')),
        T = new u.TranslatedString(
          'change indicator arguments visibility',
          (0, n.t)('change indicator arguments visibility'),
        ),
        _ = new u.TranslatedString(
          'change indicator titles visibility',
          (0, n.t)('change indicator titles visibility'),
        ),
        k = new u.TranslatedString(
          'change indicator values visibility',
          (0, n.t)('change indicator values visibility'),
        ),
        C = new u.TranslatedString(
          'change legend background visibility',
          (0, n.t)('change legend background visibility'),
        ),
        V = new u.TranslatedString(
          'change legend background transparency',
          (0, n.t)('change legend background transparency'),
        ),
        L = new u.TranslatedString('change volume values visibility', (0, n.t)('change volume values visibility')),
        M = (0, n.t)('Symbol'),
        x = (0, n.t)('OHLC values'),
        O = (0, n.t)('Bar change values'),
        z = (0, n.t)('Volume'),
        A = (0, n.t)('Indicator titles'),
        G = (0, n.t)('Indicator arguments'),
        E = (0, n.t)('Indicator values'),
        H = (0, n.t)('Background'),
        R = (0, n.t)('Open market status')
      var N = i(3825),
        W = i(37787),
        F = i(76166),
        B = i(8175)
      const j = o.enabled('show_average_close_price_line_and_label'),
        I = new u.TranslatedString('change symbol labels visibility', (0, n.t)('change symbol labels visibility')),
        U = new u.TranslatedString(
          'change symbol last value visibility',
          (0, n.t)('change symbol last value visibility'),
        ),
        q = new u.TranslatedString('change symbol last value mode', (0, n.t)('change symbol last value mode')),
        J =
          (new u.TranslatedString(
            'change symbol previous close value visibility',
            (0, n.t)('change symbol previous close value visibility'),
          ),
          new u.TranslatedString(
            'change bid and ask labels visibility',
            (0, n.t)('change bid and ask labels visibility'),
          ),
          new u.TranslatedString(
            'change pre/post market price label visibility',
            (0, n.t)('change pre/post market price label visibility'),
          ),
          new u.TranslatedString(
            'change high and low price labels visibility',
            (0, n.t)('change high and low price labels visibility'),
          )),
        K = new u.TranslatedString(
          'change average close price label visibility',
          (0, n.t)('change average close price label visibility'),
        ),
        Q =
          (new u.TranslatedString(
            'change indicators and financials name labels visibility',
            (0, n.t)('change indicators and financials name labels visibility'),
          ),
          new u.TranslatedString(
            'change indicators name labels visibility',
            (0, n.t)('change indicators name labels visibility'),
          )),
        X =
          (new u.TranslatedString(
            'change indicators and financials value labels visibility',
            (0, n.t)('change indicators and financials value labels visibility'),
          ),
          new u.TranslatedString(
            'change indicators value labels visibility',
            (0, n.t)('change indicators value labels visibility'),
          )),
        Y = new u.TranslatedString('change no overlapping labels', (0, n.t)('change no overlapping labels')),
        Z = new u.TranslatedString(
          'change countdown to bar close visibility',
          (0, n.t)('change countdown to bar close visibility'),
        ),
        $ = new u.TranslatedString('change currency label visibility', (0, n.t)('change currency label visibility')),
        ee = new u.TranslatedString('change unit label visibility', (0, n.t)('change unit label visibility')),
        te = new u.TranslatedString(
          'change currency and unit labels visibility',
          (0, n.t)('change currency and unit labels visibility'),
        ),
        ie = new u.TranslatedString('change plus button visibility', (0, n.t)('change plus button visibility')),
        re = new u.TranslatedString('toggle lock scale', (0, n.t)('toggle lock scale')),
        ne = new u.TranslatedString('change price to bar ratio', (0, n.t)('change price to bar ratio')),
        oe = new u.TranslatedString('change date format', (0, n.t)('change date format')),
        ae = (0, n.t)('Symbol name label'),
        se = (0, n.t)('Symbol last price label'),
        le =
          ((0, n.t)('Symbol previous day close price label'),
          (0, n.t)('Indicators and financials name labels'),
          (0, n.t)('Indicators name labels')),
        ce = ((0, n.t)('Indicators and financials value labels'), (0, n.t)('Indicators value labels')),
        pe =
          ((0, n.t)('Bid and ask labels'),
          (0, n.t)('Pre/post market price label'),
          (0, n.t)('Average close price label')),
        he = (0, n.t)('Countdown to bar close'),
        de = (0, n.t)('Currency'),
        ge = (0, n.t)('Unit'),
        ye = (0, n.t)('Currency and Unit'),
        ue = (0, n.t)('Plus button'),
        be = (0, n.t)('Scales placement'),
        ve = (0, n.t)('Date format'),
        Pe = (0, n.t)('Lock price to bar ratio'),
        me = (0, n.t)('No overlapping labels'),
        fe = [
          {
            value: N.PriceAxisLastValueMode.LastPriceAndPercentageValue,
            title: (0, n.t)('Price and percentage value'),
          },
          { value: N.PriceAxisLastValueMode.LastValueAccordingToScale, title: (0, n.t)('Value according to scale') },
        ]
      var we = i(32449)
      const Se = new u.TranslatedString('change chart background color', (0, n.t)('change chart background color')),
        De = new u.TranslatedString('change chart background type', (0, n.t)('change chart background type')),
        Te = new u.TranslatedString('change vert grid lines color', (0, n.t)('change vert grid lines color')),
        _e = new u.TranslatedString('change vert grid lines style', (0, n.t)('change vert grid lines style')),
        ke = new u.TranslatedString('change horz grid lines color', (0, n.t)('change horz grid lines color')),
        Ce = new u.TranslatedString('change horz grid lines style', (0, n.t)('change horz grid lines style')),
        Ve = new u.TranslatedString('change sessions breaks visibility', (0, n.t)('change sessions breaks visibility')),
        Le = new u.TranslatedString('change sessions breaks color', (0, n.t)('change sessions breaks color')),
        Me = new u.TranslatedString('change sessions breaks width', (0, n.t)('change sessions breaks width')),
        xe = new u.TranslatedString('change sessions breaks style', (0, n.t)('change sessions breaks style')),
        Oe = new u.TranslatedString('change scales text color', (0, n.t)('change scales text color')),
        ze = new u.TranslatedString('change scales font size', (0, n.t)('change scales font size')),
        Ae = new u.TranslatedString('change scales lines color', (0, n.t)('change scales lines color')),
        Ge = new u.TranslatedString('change pane separators color', (0, n.t)('change pane separators color')),
        Ee = new u.TranslatedString('change crosshair color', (0, n.t)('change crosshair color')),
        He = new u.TranslatedString('change crosshair width', (0, n.t)('change crosshair width')),
        Re = new u.TranslatedString('change crosshair style', (0, n.t)('change crosshair style')),
        Ne = new u.TranslatedString(
          'change symbol watermark visibility',
          (0, n.t)('change symbol watermark visibility'),
        ),
        We = new u.TranslatedString('change symbol watermark color', (0, n.t)('change symbol watermark color')),
        Fe = new u.TranslatedString(
          'change navigation buttons visibility',
          (0, n.t)('change navigation buttons visibility'),
        ),
        Be = new u.TranslatedString('change pane buttons visibility', (0, n.t)('change pane buttons visibility')),
        je = new u.TranslatedString('change top margin', (0, n.t)('change top margin')),
        Ie = new u.TranslatedString('change bottom margin', (0, n.t)('change bottom margin')),
        Ue = new u.TranslatedString('change right margin', (0, n.t)('change right margin')),
        qe = (0, n.t)('Background'),
        Je = (0, n.t)('Vert grid lines'),
        Ke = (0, n.t)('Horz grid lines'),
        Qe = (0, n.t)('Session breaks'),
        Xe = (0, n.t)('Scales text'),
        Ye = (0, n.t)('Scales lines'),
        Ze = (0, n.t)('Pane separators'),
        $e = (0, n.t)('Crosshair'),
        et = (0, n.t)('Watermark'),
        tt = (0, n.t)('Top margin'),
        it = (0, n.t)('Navigation buttons'),
        rt = (0, n.t)('Pane buttons'),
        nt = (0, n.t)('Bottom margin'),
        ot = (0, n.t)('Right margin'),
        at = (0, n.t)('bars', { context: 'unit' })
      var st = i(7043),
        lt = i(21761),
        ct = i(1860),
        pt = i(39277)
      const ht = {
          symbol: i(41509),
          legend: i(23426),
          scales: i(85612),
          appearance: i(15516),
          events: i(73257),
          trading: i(1784),
        },
        dt = (0, n.t)('Symbol'),
        gt = (0, n.t)('Status line'),
        yt = (0, n.t)('Scales'),
        ut = (0, n.t)('Appearance')
      ;(0, n.t)('Events'), (0, n.t)('Trading'), (0, n.t)('money'), (0, n.t)('pips'), (0, n.t)('ticks')
      function bt() {
        const e = new Date(Date.UTC(1997, 8, 29))
        return st.availableDateFormats.map(t => ({ value: t, title: new ct.DateFormatter(t).format(e) }))
      }
      const vt = [
        { id: 'symbol-text-source-description', value: 'description', title: (0, n.t)('Description') },
        { id: 'symbol-text-source-ticker', value: 'ticker', title: (0, n.t)('Ticker') },
        {
          id: 'symbol-text-source-ticker-and-description',
          value: 'ticker-and-description',
          title: (0, n.t)('Ticker and description'),
        },
      ]
      class Pt {
        constructor(e, t, i) {
          ;(this._propertyPages = null),
            (this._maxRightOffsetPropertyObject = null),
            (this._profitLossOptions = null),
            (this._pipValueTypeSpawn = null),
            (this._isDestroyed = !1),
            (this._undoModel = e),
            (this._model = this._undoModel.model()),
            (this._series = this._model.mainSeries()),
            (this._chartWidgetProperties = t),
            (this._options = i),
            (this._seriesPropertyDefinitionViewModel = this._createSeriesViewModel()),
            (this._legendPropertyPage = this._createLegendPropertyPage()),
            (this._scalesPropertyPage = this._createScalesPropertyPage()),
            (this._appearancePropertyPage = this._createAppearancePropertyPage()),
            (this._tradingPropertyPage = this._createTradingPropertyPage()),
            (this._eventsPropertyPage = this._createEventsPropertyPage()),
            this._series.onStyleChanged().subscribe(this, this._updateDefinitions),
            this._series.priceScaleChanged().subscribe(this, this._updateDefinitions)
        }
        destroy() {
          var e
          null !== this._propertyPages &&
            this._propertyPages
              .filter((e, t) => 0 !== t)
              .forEach(e => {
                ;(0, l.destroyDefinitions)(e.definitions.value())
              }),
            this._seriesPropertyDefinitionViewModel.destroy(),
            null === (e = this._pipValueTypeSpawn) || void 0 === e || e.destroy(),
            this._series.onStyleChanged().unsubscribe(this, this._updateDefinitions),
            this._series.priceScaleChanged().unsubscribe(this, this._updateDefinitions)
          ;(0, r.ensureNotNull)(this._model.timeScale()).maxRightOffsetChanged().unsubscribeAll(this),
            (this._isDestroyed = !0)
        }
        propertyPages() {
          return null === this._propertyPages
            ? this._seriesPropertyDefinitionViewModel.propertyPages().then(e => {
                if (this._isDestroyed) throw new Error('ChartPropertyDefinitionsViewModel already destroyed')
                return (
                  null === this._propertyPages &&
                    ((this._propertyPages = [...e]),
                    this._propertyPages.push(
                      this._legendPropertyPage,
                      this._scalesPropertyPage,
                      this._appearancePropertyPage,
                    ),
                    null !== this._tradingPropertyPage && this._propertyPages.push(this._tradingPropertyPage),
                    null !== this._eventsPropertyPage && this._propertyPages.push(this._eventsPropertyPage)),
                  this._propertyPages
                )
              })
            : Promise.resolve(this._propertyPages)
        }
        _updatePlDisplayOptions() {
          ;(0, r.ensureNotNull)(this._pipValueTypeSpawn).value()
          ;(0, r.ensureNotNull)(this._profitLossOptions).setValue([])
        }
        _updateDefinitions() {
          ;(0, l.destroyDefinitions)(this._scalesPropertyPage.definitions.value())
          const e = this._createScalesDefinitions()
          this._scalesPropertyPage.definitions.setValue(e.definitions)
        }
        _createSeriesViewModel() {
          const e = {
            property: this._model.properties().childs().timezone,
            values: pt.availableTimezones.map(e => ({ value: e.id, title: e.title })),
          }
          return new g.SeriesPropertyDefinitionsViewModel(this._series, this._undoModel, 'symbol', dt, ht.symbol, e)
        }
        _createLegendPropertyPage() {
          const e = this._chartWidgetProperties.childs().paneProperties.childs().legendProperties.childs(),
            t = { property: this._series.properties().childs().statusViewStyle.childs().symbolTextSource, values: vt },
            i = (function (e, t, i, r, n) {
              const o = [],
                a = [],
                c = (0, l.createOptionsPropertyDefinition)(
                  {
                    checked: (0, l.convertToDefinitionProperty)(e, t.showSeriesTitle, m),
                    option: (0, l.convertToDefinitionProperty)(e, i.property, f),
                  },
                  { id: 'symbolTextSource', title: M, options: new (s())(i.values) },
                )
              if ((a.push(c), null !== r)) {
                const t = (0, P.combineWithFilteredUpdate)(
                    e => 'market' === e,
                    e => null !== e,
                    e.mainSeries().marketStatusModel().status(),
                  ),
                  i = (0, l.createCheckablePropertyDefinition)(
                    {
                      checked: (0, l.convertToDefinitionProperty)(e, r, w),
                      visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(t),
                    },
                    { id: 'showOpenMarketStatus', title: R },
                  )
                a.push(i)
              }
              const p = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, t.showSeriesOHLC, S) },
                { id: 'ohlcTitle', title: x },
              )
              a.push(p)
              const h = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, t.showBarChange, D) },
                { id: 'barChange', title: O },
              )
              a.push(h),
                a.push(
                  (0, l.createCheckablePropertyDefinition)(
                    { checked: (0, l.convertToDefinitionProperty)(e, t.showVolume, L) },
                    { id: 'barVolume', title: z },
                  ),
                ),
                o.push((0, l.createPropertyDefinitionsGeneralGroup)(a, 'seriesLegendVisibilityGroup'))
              const d = [],
                g = (0, l.createCheckablePropertyDefinition)(
                  { checked: (0, l.convertToDefinitionProperty)(e, t.showStudyArguments, T) },
                  { id: 'studyArguments', title: G },
                ),
                y = (0, l.createCheckableSetPropertyDefinition)(
                  { checked: (0, l.convertToDefinitionProperty)(e, t.showStudyTitles, _) },
                  { id: 'studyTitles', title: A },
                  [g],
                ),
                u = (0, l.createCheckablePropertyDefinition)(
                  { checked: (0, l.convertToDefinitionProperty)(e, t.showStudyValues, k) },
                  { id: 'studyValues', title: E },
                ),
                N = (0, b.createWVFromGetterAndSubscription)(
                  () =>
                    e
                      .model()
                      .priceDataSources()
                      .some(e => !(0, v.isActingAsSymbolSource)(e) && e.showInObjectTree()),
                  e.model().dataSourceCollectionChanged(),
                )
              d.push(y, u),
                o.push((0, l.createPropertyDefinitionsGeneralGroup)(d, 'studiesLegendVisibilityGroup', void 0, N))
              const W = [],
                F = (0, l.createTransparencyPropertyDefinition)(
                  {
                    checked: (0, l.convertToDefinitionProperty)(e, t.showBackground, C),
                    transparency: (0, l.convertToDefinitionProperty)(e, t.backgroundTransparency, V),
                  },
                  { id: 'legendBgTransparency', title: H },
                )
              return (
                W.push(F),
                o.push((0, l.createPropertyDefinitionsGeneralGroup)(W, 'generalLegendGroup')),
                { definitions: o }
              )
            })(this._undoModel, e, t, this._options.marketStatusWidgetEnabled ? y.showMarketOpenStatusProperty : null)
          return (0, c.createPropertyPage)(i, 'legend', gt, ht.legend)
        }
        _createScalesPropertyPage() {
          const e = this._createScalesDefinitions()
          return (0, c.createPropertyPage)(e, 'scales', yt, ht.scales)
        }
        _createScalesDefinitions() {
          const e = this._chartWidgetProperties.childs().scalesProperties.childs(),
            t = {
              property: this._model.properties().childs().priceScaleSelectionStrategyName,
              values: (0, d.allPriceScaleSelectionStrategyInfo)().map(e => ({ value: e.name, title: e.title })),
            },
            i = { property: lt.dateFormatProperty, values: bt() },
            r = this._model.mainSeriesScaleRatioProperty()
          return (function (e, t, i, r) {
            const n = r.seriesPriceScale.properties().childs(),
              a = [],
              c = []
            if (r.seriesHasClosePrice) {
              const t = (0, l.createCheckablePropertyDefinition)(
                  { checked: (0, l.convertToDefinitionProperty)(e, i.showSymbolLabels, I) },
                  { id: 'symbolNameLabel', title: ae },
                ),
                r = (0, l.createOptionsPropertyDefinition)(
                  {
                    checked: (0, l.convertToDefinitionProperty)(e, i.showSeriesLastValue, U),
                    option: (0, l.convertToDefinitionProperty)(e, i.seriesLastValueMode, q),
                  },
                  { id: 'symbolLastValueLabel', title: se, options: new (s())(fe) },
                )
              c.push(t, r)
            }
            const p = t.highLowAvgPrice.childs(),
              h = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, p.highLowPriceLabelsVisible, J) },
                { id: 'highLowPriceLabels', title: 'High and low price labels' },
              )
            if ((c.push(h), j)) {
              const t = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, p.averageClosePriceLabelVisible, K) },
                { id: 'averageClosePriceLabel', title: pe },
              )
              c.push(t)
            }
            const d = (0, b.createWVFromGetterAndSubscription)(
              () =>
                e
                  .model()
                  .priceDataSources()
                  .some(e => !(0, v.isActingAsSymbolSource)(e) && e.showInObjectTree()),
              e.model().dataSourceCollectionChanged(),
            )
            {
              const t = (0, l.createCheckablePropertyDefinition)(
                {
                  visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(d),
                  checked: (0, l.convertToDefinitionProperty)(e, i.showStudyPlotLabels, Q),
                },
                { id: 'studyNameLabel', title: le },
              )
              c.push(t)
            }
            const g = (0, b.createWVFromGetterAndSubscription)(
              () =>
                e
                  .model()
                  .priceDataSources()
                  .some(e => !(0, v.isActingAsSymbolSource)(e) && e.showInObjectTree()),
              e.model().dataSourceCollectionChanged(),
            )
            {
              const t = (0, l.createCheckablePropertyDefinition)(
                {
                  visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(g),
                  checked: (0, l.convertToDefinitionProperty)(e, i.showStudyLastValue, X),
                },
                { id: 'studyLastValueLabel', title: ce },
              )
              c.push(t)
            }
            const y = (0, l.createCheckablePropertyDefinition)(
              { checked: (0, l.convertToDefinitionProperty)(e, n.alignLabels, Y) },
              { id: 'noOverlappingLabels', title: me },
            )
            if ((c.push(y), r.countdownEnabled)) {
              const i = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, t.showCountdown, Z) },
                { id: 'countdown', title: he },
              )
              c.push(i)
            }
            if (e.crossHairSource().isMenuEnabled()) {
              const t = (0, l.createCheckablePropertyDefinition)(
                { checked: (0, l.convertToDefinitionProperty)(e, F.addPlusButtonProperty, ie) },
                { id: 'addPlusButton', title: ue },
              )
              c.push(t)
            }
            if (r.currencyConversionEnabled || r.unitConversionEnabled) {
              const t =
                  r.currencyConversionEnabled && r.unitConversionEnabled ? ye : r.currencyConversionEnabled ? de : ge,
                i = r.currencyConversionEnabled && r.unitConversionEnabled ? te : r.currencyConversionEnabled ? $ : ee,
                n = (0, l.createOptionsPropertyDefinition)(
                  { option: (0, l.convertToDefinitionProperty)(e, (0, B.currencyUnitVisibilityProperty)(), i) },
                  { id: 'scalesCurrencyUnit', title: t, options: new (s())((0, B.currencyUnitVisibilityOptions)()) },
                )
              c.push(n)
            }
            a.push((0, l.createPropertyDefinitionsGeneralGroup)(c, 'generalScalesLabelsGroup'))
            const u = (0, l.createNumberPropertyDefinition)(
                {
                  checked: (0, l.getLockPriceScaleDefinitionProperty)(e, n.lockScale, r.seriesPriceScale, re),
                  value: (0, l.getScaleRatioDefinitionProperty)(e, r.mainSeriesScaleRatioProperty, ne, [
                    (0, W.limitedPrecision)(7),
                    e => e,
                  ]),
                },
                {
                  id: 'lockScale',
                  title: Pe,
                  min: new (s())(r.mainSeriesScaleRatioProperty.getMinValue()),
                  max: new (s())(r.mainSeriesScaleRatioProperty.getMaxValue()),
                  step: new (s())(r.mainSeriesScaleRatioProperty.getStepChangeValue()),
                },
              ),
              P = (0, l.createOptionsPropertyDefinition)(
                {
                  option: (0, l.getPriceScaleSelectionStrategyDefinitionProperty)(
                    e,
                    r.scalesPlacementPropertyObj.property,
                  ),
                },
                { id: 'scalesPlacement', title: be, options: new (s())(r.scalesPlacementPropertyObj.values) },
              )
            if ((a.push(u, P), o.enabled('scales_date_format'))) {
              const t = (0, l.createOptionsPropertyDefinition)(
                { option: (0, l.convertToDefinitionProperty)(e, r.dateFormatPropertyObj.property, oe) },
                { id: 'dateFormat', title: ve, options: new (s())(r.dateFormatPropertyObj.values) },
              )
              a.push(t)
            }
            return { definitions: a }
          })(this._undoModel, this._series.properties().childs(), e, {
            disableSeriesPrevCloseValueProperty: this._series.isDWMProperty(),
            seriesHasClosePrice: this._series.hasClosePrice(),
            seriesPriceScale: this._series.priceScale(),
            mainSeriesScaleRatioProperty: r,
            scalesPlacementPropertyObj: t,
            dateFormatPropertyObj: i,
            currencyConversionEnabled: this._options.currencyConversionEnabled,
            unitConversionEnabled: this._options.unitConversionEnabled,
            countdownEnabled: this._options.countdownEnabled,
          })
        }
        _createMaxOffsetPropertyObject() {
          const e = (0, r.ensureNotNull)(this._model.timeScale()),
            t = new (s())(Math.floor(e.maxRightOffset()))
          e.maxRightOffsetChanged().subscribe(this, e => {
            t.setValue(Math.floor(e))
          }),
            (this._maxRightOffsetPropertyObject = { value: e.defaultRightOffset(), min: new (s())(0), max: t })
        }
        _createAppearancePropertyPage() {
          const e = this._chartWidgetProperties.childs(),
            t = e.paneProperties.childs(),
            i = e.scalesProperties.childs(),
            n = this._model.watermarkSource()
          let a = null
          null !== n && (a = n.properties().childs())
          const d = { property: p.property(), values: p.availableValues() },
            g = { property: h.property(), values: h.availableValues() },
            y = this._model.sessions().properties().childs().graphics.childs().vertlines.childs().sessBreaks.childs()
          null === this._maxRightOffsetPropertyObject && this._createMaxOffsetPropertyObject()
          const u = (0, r.ensureNotNull)(this._maxRightOffsetPropertyObject),
            v = (function (e, t, i, r, n, a, c, p, h) {
              const d = [],
                g = (0, l.createColorPropertyDefinition)(
                  {
                    color: (0, l.getColorDefinitionProperty)(e, t.background, null, Se),
                    gradientColor1: (0, l.getColorDefinitionProperty)(e, t.backgroundGradientStartColor, null, Se),
                    gradientColor2: (0, l.getColorDefinitionProperty)(e, t.backgroundGradientEndColor, null, Se),
                    type: (0, l.convertToDefinitionProperty)(e, t.backgroundType, De),
                  },
                  { id: 'chartBackground', title: qe, noAlpha: !0 },
                ),
                y = t.vertGridProperties.childs(),
                u = (0, l.createLinePropertyDefinition)(
                  {
                    color: (0, l.getColorDefinitionProperty)(e, y.color, null, Te),
                    style: (0, l.convertToDefinitionProperty)(e, y.style, _e),
                  },
                  { id: 'vertGridLine', title: Je },
                ),
                v = t.horzGridProperties.childs(),
                P = (0, l.createLinePropertyDefinition)(
                  {
                    color: (0, l.getColorDefinitionProperty)(e, v.color, null, ke),
                    style: (0, l.convertToDefinitionProperty)(e, v.style, Ce),
                  },
                  { id: 'horizGridLine', title: Ke },
                ),
                m = (0, b.combineProperty)(e => !e, e.mainSeries().isDWMProperty()),
                f = (0, l.createLinePropertyDefinition)(
                  {
                    visible: (0, we.makeProxyDefinitionPropertyDestroyable)(m),
                    checked: (0, l.convertToDefinitionProperty)(e, n.visible, Ve),
                    color: (0, l.getColorDefinitionProperty)(e, n.color, null, Le),
                    width: (0, l.convertToDefinitionProperty)(e, n.width, Me),
                    style: (0, l.convertToDefinitionProperty)(e, n.style, xe),
                  },
                  { id: 'sessionBeaks', title: Qe },
                ),
                w = (0, l.createTextPropertyDefinition)(
                  {
                    color: (0, l.getColorDefinitionProperty)(e, r.textColor, null, Oe),
                    size: (0, l.convertToDefinitionProperty)(e, r.fontSize, ze),
                  },
                  { id: 'scalesText', title: Xe },
                ),
                S = (0, l.createLinePropertyDefinition)(
                  { color: (0, l.getColorDefinitionProperty)(e, r.lineColor, null, Ae) },
                  { id: 'scalesLine', title: Ye },
                ),
                D = (0, b.createWVFromGetterAndSubscription)(
                  () => 1 !== e.model().panes().length,
                  e.model().panesCollectionChanged(),
                ),
                T = (0, l.createLinePropertyDefinition)(
                  {
                    visible: (0, l.convertFromReadonlyWVToDefinitionProperty)(D),
                    color: (0, l.getColorDefinitionProperty)(e, t.separatorColor, null, Ge),
                  },
                  { id: 'paneSeparators', title: Ze },
                ),
                _ = t.crossHairProperties.childs(),
                k = (0, l.createLinePropertyDefinition)(
                  {
                    color: (0, l.getColorDefinitionProperty)(e, _.color, _.transparency, Ee),
                    width: (0, l.convertToDefinitionProperty)(e, _.width, He),
                    style: (0, l.convertToDefinitionProperty)(e, _.style, Re),
                  },
                  { id: 'crossHair', title: $e },
                )
              if ((d.push(g, u, P, f, w, S, T, k), null !== i)) {
                const t = (0, l.createColorPropertyDefinition)(
                  {
                    checked: (0, l.convertToDefinitionProperty)(e, i.visibility, Ne),
                    color: (0, l.getColorDefinitionProperty)(e, i.color, null, We),
                  },
                  { id: 'watermark', title: et },
                )
                d.push(t)
              }
              const C = (0, l.createOptionsPropertyDefinition)(
                { option: (0, l.convertToDefinitionProperty)(e, p.property, Fe) },
                { id: 'navButtons', title: it, options: new (s())(p.values) },
              )
              d.push(C)
              const V = (0, l.createOptionsPropertyDefinition)(
                { option: (0, l.convertToDefinitionProperty)(e, h.property, Be) },
                { id: 'paneButtons', title: rt, options: new (s())(h.values) },
              )
              d.push(V)
              const L = (0, l.createNumberPropertyDefinition)(
                  { value: (0, l.convertToDefinitionProperty)(e, t.topMargin, je, [W.floor]) },
                  {
                    type: 0,
                    id: 'paneTopMargin',
                    title: tt,
                    min: new (s())(0),
                    max: new (s())(25),
                    step: new (s())(1),
                    unit: new (s())('%'),
                  },
                ),
                M = (0, l.createNumberPropertyDefinition)(
                  { value: (0, l.convertToDefinitionProperty)(e, t.bottomMargin, Ie, [W.floor]) },
                  {
                    type: 0,
                    id: 'paneBottomMargin',
                    title: nt,
                    min: new (s())(0),
                    max: new (s())(25),
                    step: new (s())(1),
                    unit: new (s())('%'),
                  },
                ),
                x = (0, l.createNumberPropertyDefinition)(
                  { value: (0, l.convertFromWVToDefinitionProperty)(e, c.value, Ue, [W.floor]) },
                  {
                    type: 0,
                    id: 'paneRightMargin',
                    title: ot,
                    min: c.min,
                    max: c.max,
                    step: new (s())(1),
                    unit: new (s())(at),
                  },
                ),
                O = [(0, l.createPropertyDefinitionsGeneralGroup)(d, 'generalAppearanceGroup'), L, M]
              return o.enabled('chart_property_page_right_margin_editor') && O.push(x), { definitions: O }
            })(this._undoModel, t, a, i, y, this._series.isDWMProperty(), u, d, g)
          return (0, c.createPropertyPage)(v, 'appearance', ut, ht.appearance)
        }
        _createTradingPropertyPage() {
          return null
        }
        _createEventsPropertyPage() {
          return null
        }
      }
    },
    15516: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 16.5l-1 1v4h4l1-1m-4-4l2 2m-2-2l9-9m-5 13l-2-2m2 2l9-9m-11 7l9-9m0 0l-2-2m2 2l2 2m-4-4l.94-.94a1.5 1.5 0 0 1 2.12 0l1.88 1.88a1.5 1.5 0 0 1 0 2.12l-.94.94"/></svg>'
    },
    73257: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 4h1v2h6V4h1v2h2.5A2.5 2.5 0 0 1 23 8.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 5 19.5v-11A2.5 2.5 0 0 1 7.5 6H10V4zm8 3H7.5A1.5 1.5 0 0 0 6 8.5v11A1.5 1.5 0 0 0 7.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 20.5 7H18zm-3 2h-2v2h2V9zm-7 4h2v2H8v-2zm12-4h-2v2h2V9zm-7 4h2v2h-2v-2zm-3 4H8v2h2v-2zm3 0h2v2h-2v-2zm7-4h-2v2h2v-2z"/></svg>'
    },
    85612: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 20.5a2 2 0 1 1-2-2m2 2a2 2 0 0 0-2-2m2 2h14m-16-2v-14m16 16L21 17m3.5 3.5L21 24M8.5 4.5L12 8M8.5 4.5L5 8"/></svg>'
    },
    23426: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" d="M6 13h12v1H6zM6 17h12v1H6zM6 21h12v1H6z"/><rect width="17" height="3" stroke="currentColor" rx="1.5" x="5.5" y="6.5"/></svg>'
    },
    41509: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9 7H7v14h2v3h1v-3h2V7h-2V4H9v3zM8 8v12h3V8H8zm9 1h-2v10h2v3h1v-3h2V9h-2V6h-1v3zm-1 1v8h3v-8h-3z"/></svg>'
    },
    1784: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M24.068 9a.569.569 0 0 1 .73.872L19 14.842l-5.798-4.97a.569.569 0 0 1 .73-.872l4.751 3.887.317.26.317-.26L24.068 9zm1.47-.67a1.569 1.569 0 0 0-2.103-.104L19 11.854l-4.435-3.628a1.569 1.569 0 0 0-2.014 2.405l6.124 5.249.325.279.325-.28 6.124-5.248a1.569 1.569 0 0 0 .088-2.3zm-11.484 9.728a.57.57 0 0 0 .688-.91L9 12.636l-5.742 4.512a.57.57 0 0 0 .688.91l4.76-3.462.294-.214.294.214 4.76 3.462zm1.446.649a1.57 1.57 0 0 1-2.034.16L9 15.618l-4.466 3.249a1.57 1.57 0 0 1-1.894-2.505l6.051-4.755.309-.243.309.243 6.051 4.755c.74.581.806 1.68.14 2.345z"/></svg>'
    },
  },
])
