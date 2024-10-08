'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7271],
  {
    58442: (e, t, s) => {
      s.d(t, { qualifyProName: () => i, QualifiedSources: () => o })
      var o,
        n = s(88537),
        r = s(67337)
      s(81319)
      function i(e) {
        return e
      }
      !(function (e) {
        function t(e) {
          return e.pro_name
        }
        function s(e) {
          {
            const t = r.enabled('pay_attention_to_ticker_not_symbol') ? e.ticker : e.full_name
            return (0, n.ensureDefined)(t)
          }
        }
        ;(e.fromQuotesSnapshot = function (e) {
          return 'error' === e.status ? e.symbolname : e.values.pro_name
        }),
          (e.fromQuotesResponse = function (e) {
            const { values: s, symbolname: o, status: n } = e
            return 'error' === n && o ? o : t(s)
          }),
          (e.fromQuotes = t),
          (e.fromSymbolSearchResult = function (e, t) {
            {
              const { ticker: s, full_name: o } = null != t ? t : e
              return r.enabled('pay_attention_to_ticker_not_symbol')
                ? (0, n.ensureDefined)(null != s ? s : o)
                : (0, n.ensureDefined)(o)
            }
          }),
          (e.fromSymbolInfo = s),
          (e.fromSymbolMessage = function (e, t) {
            return 'symbol_resolved' === t.method ? s(t.params[1]) : e
          })
      })(o || (o = {}))
    },
    20882: (e, t, s) => {
      function o(e) {
        return '' === e.value()
      }
      function n(e, t) {
        return e.filter(e => e.includes(t))
      }
      function r(e) {
        const t = new Map()
        return (
          e.forEach(e => {
            t.has(e.group()) ? t.get(e.group()).push(e) : t.set(e.group(), [e])
          }),
          t
        )
      }
      function i(e, t) {
        return t.map(t => new e(t))
      }
      s.d(t, {
        isAllSearchSourcesSelected: () => o,
        filterSearchSources: () => n,
        splitSearchSourcesByGroup: () => r,
        createSearchSources: () => i,
      })
    },
    81319: (e, t, s) => {
      s.d(t, {
        exchangeSelectDisabled: () => m,
        getAllSymbolTypesValue: () => u,
        getAvailableExchanges: () => l,
        getAvailableSearchSources: () => a,
        getAvailableSymbolTypes: () => h,
        getDefaultSearchSource: () => c,
        getSymbolFullName: () => i,
        isOpenFirstContractEnabled: () => y,
      })
      var o = s(28353),
        n = s(20882)
      class r {
        constructor(e) {
          this._exchange = e
        }
        value() {
          return this._exchange.value
        }
        name() {
          return (0, n.isAllSearchSourcesSelected)(this) ? (0, o.t)('All sources') : this._exchange.name
        }
        description() {
          return this._exchange.desc
        }
        country() {
          return this._exchange.country
        }
        providerId() {
          return this._exchange.providerId
        }
        group() {
          return this._exchange.group
        }
        includes(e) {
          return (function (e, t) {
            const s = t.toLowerCase(),
              { name: o, desc: n, searchTerms: r } = e
            return (
              o.toLowerCase().includes(s) ||
              n.toLowerCase().includes(s) ||
              (void 0 !== r && r.some(e => e.toLowerCase().includes(s)))
            )
          })(this._exchange, e)
        }
        getRequestExchangeValue() {
          return this._exchange.value
        }
        getRequestCountryValue() {}
      }
      function i(e) {
        if (e.fullName) return e.fullName
        let t
        return (
          (t = e.prefix || e.exchange ? (e.prefix || e.exchange) + ':' + e.name : e.name),
          t.replace(/<\/?[^>]+(>|$)/g, '')
        )
      }
      function c() {
        const e = a()
        return e.find(n.isAllSearchSourcesSelected) || e[0] || null
      }
      function a() {
        return (0, n.createSearchSources)(r, d())
      }
      function l() {
        return d()
      }
      function d() {
        return window.ChartApiInstance.supportedExchangesList().map(e => ({
          ...e,
          country: '',
          providerId: '',
          flag: '',
        }))
      }
      function h() {
        return window.ChartApiInstance.supportedSymbolsTypes()
      }
      function u() {
        return ''
      }
      function m() {
        return !1
      }
      const y = !1
    },
    43900: (e, t, s) => {
      s.r(t), s.d(t, { CompareModel: () => v })
      var o = s(88537),
        n = s(67337),
        r = s(72857),
        i = s(19234),
        c = s(52714),
        a = s.n(c),
        l = s(46148),
        d = s(9771),
        h = s(55153),
        u = s(58442),
        m = s(81319)
      new Set(
        n.enabled('widget')
          ? ['pro_name', 'short_name', 'description', 'exchange', 'type', 'country_code', 'provider_id']
          : [
              'pro_name',
              'short_name',
              'description',
              'exchange',
              'type',
              'country_code',
              'provider_id',
              'logoid',
              'currency-logoid',
              'base-currency-logoid',
            ],
      )
      const y = (0, m.getAvailableExchanges)(),
        S = {}
      for (const e of y) S[e.value] = { country: e.country, providerId: e.providerId }
      function _(e) {
        return e instanceof d.study_Overlay || e instanceof h.StudyCompare
      }
      function p(e, t, s) {
        const o = u.QualifiedSources.fromSymbolInfo(e),
          n = (function (e) {
            if (!e) return
            const [t, s] = e.split(':')
            return s && t && S[t] ? S[t] : void 0
          })(o)
        return {
          id: (null == s ? void 0 : s.id()) || o,
          symbol: o,
          checked: t,
          title: e.name,
          description: e.description,
          exchangeName: e.exchange,
          country: null == n ? void 0 : n.country,
          providerId: null == n ? void 0 : n.providerId,
          marketType: e.type,
          study: s,
        }
      }
      function f(e, t, s, o) {
        return { id: void 0 !== s ? s.id() : e, symbol: e, checked: t, title: e, study: s, description: o }
      }
      var b = s(56840),
        g = s(76422)
      class v {
        constructor(e) {
          ;(this._contentItemList = new (a())([])),
            (this._checkedSymbols = new Map()),
            (this._recentLength = 10),
            (this._isDataReady = new (a())(!1)),
            (this._highlightedSymbol = new (a())(null)),
            (this._defaultSymbolsDescriptions = new Map()),
            (this._idToStudyMap = new Map()),
            (this._chartSession = null),
            (this._recentSymbolsEnabled = n.enabled('compare_recent_symbols_enabled')),
            (this._preventHandleSourcesChange = !0),
            (this.removeStudy = e => {
              const { symbol: t, study: s } = e
              if (!s) return
              this._chartWidget.model().removeSource(s, !1)
              const o = this._checkedSymbols.get(t)
              o && o.length > 1 ? this._removeStudyIdFromCheckedSymbols(t, s.id()) : this._checkedSymbols.delete(t),
                this._updateContentItemList(this._contentItemList.value(), !0)
            }),
            (this._getResolveSymbolPromise = (e, t) =>
              new Promise(s => {
                const n = (0, o.ensureNotNull)(this._chartSession).resolveSymbol(
                  (0, r.makeNextSymbolId)(),
                  (0, i.encodeExtendedSymbolOrGetSimpleSymbolString)({ symbol: e }),
                  s,
                )
                t && t.set(e, n)
              })),
            (this._chartWidget = e.activeChartWidget.value()),
            (this._chartSession = this._chartWidget.model().model().chartApi())
          const t = new Set(this._loadRecent().reverse()),
            s = new Set(),
            c = new Set(),
            l = this._chartWidget.model().model().dataSources().filter(_),
            d = l.map(e => {
              const t = e.symbolInfo()
              if (t) return Promise.resolve(u.QualifiedSources.fromSymbolInfo(t))
              const s = e.symbol()
              return (0, u.qualifyProName)(s)
            })
          Promise.all(d).then(e => {
            const o = e.map((e, t) => l[t])
            e.forEach((e, n) => {
              const r = o[n],
                i = r.id()
              this._addStudyIdToCheckedSymbols(e, i), this._idToStudyMap.set(i, r), t.has(e) ? s.add(e) : c.add(e)
            })
            const n = Array.from(t)
                .filter(e => this._checkedSymbols.has(e))
                .reduce((e, t) => (s.has(t) && e.push(t), e), [])
                .concat(Array.from(c)),
              r = Array.from(t)
            if (this._recentSymbolsEnabled && r.length < this._recentLength) {
              let e
              ;(e = []),
                this._chartWidget.compareSymbols() &&
                  this._chartWidget.compareSymbols().forEach(t => {
                    e.push((0, u.qualifyProName)(t.symbol)), this._defaultSymbolsDescriptions.set(t.symbol, t.title)
                  })
              const t = [...r, ...e]
              n.push(...t)
            } else n.push(...r)
            const i = Array.from(new Set(n))
            {
              const e = new Map(),
                t = i.map(t => this._getResolveSymbolPromise(t, e))
              Promise.all(t).then(t =>
                this._handleInitProcess(
                  n,
                  s => {
                    const o = e.get(s)
                    return t.find(e => e.params[0] === o)
                  },
                  (e, t) => u.QualifiedSources.fromSymbolMessage(t, e),
                  (e, t, s, o) =>
                    'symbol_resolved' === e.method ? p(e.params[1], s, o) : f(t, s, o, this._getSymbolDescription(t)),
                ),
              )
            }
          })
        }
        chartModel() {
          return this._chartWidget.model().model()
        }
        handleSourcesChange() {
          if (this._preventHandleSourcesChange) return
          const e = this.chartModel().dataSources().filter(_),
            t = new Set(e.map(e => e.id()))
          Array.from(t).forEach(e => {
            if (!this._checkedStudiesIds().has(e)) {
              const t = this.chartModel().dataSourceForId(e) || null
              if (null !== t && _(t)) {
                const t = this._getContentItemByStudyId(e)
                if (!t) return
                this._addStudyIdToCheckedSymbols(t.symbol, e),
                  this._saveRecent(t.symbol),
                  this._updateContentItemList(this._contentItemList.value(), !0)
              }
            }
          })
          Array.from(this._checkedStudiesIds()).forEach(e => {
            if (!t.has(e)) {
              const t = this._getContentItemByStudyId(e)
              if (!t) return
              const s = this._checkedSymbols.get(t.symbol)
              s && s.length > 1
                ? this._removeStudyIdFromCheckedSymbols(t.symbol, e)
                : this._checkedSymbols.delete(t.symbol),
                this._updateContentItemList(this._contentItemList.value(), !0)
            }
          })
        }
        studies() {
          return this._contentItemList.readonly()
        }
        isDataReady() {
          return this._isDataReady.readonly()
        }
        highlightedSymbol() {
          return this._highlightedSymbol.readonly()
        }
        applyStudy(e, t, s) {
          const o = this._chartWidget
          if (!o) return
          let n
          switch (t) {
            case l.CompareOption.SameScale:
              n = o.addCompareAsOverlay(e, s)
              break
            case l.CompareOption.NewPriceScale:
              n = o.addOverlayStudy(e, !0, s)
              break
            case l.CompareOption.NewPane:
              n = o.addOverlayStudy(e, !1, s)
          }
          Promise.all([this._getResolveSymbolPromise(e), n]).then(t =>
            this._handleApplyProcess(
              t,
              t => u.QualifiedSources.fromSymbolMessage(e, t),
              (e, t, s) => ('symbol_resolved' === e.method ? p(e.params[1], !0, s) : f(t, !0, s)),
            ),
          ),
            g.emit('add_compare')
        }
        _snapshoter() {
          throw new Error('not implemented')
        }
        _handleApplyProcess(e, t, s) {
          const [o, n] = e
          if (!o || null === n) return
          const r = n.id(),
            i = t(o),
            c = s(o, i, n)
          this._saveRecent(i), this._addStudyIdToCheckedSymbols(i, r), this._showNewItem(c, i, r)
        }
        _handleInitProcess(e, t, s, o) {
          const n = []
          for (const r of e) {
            const e = t(r)
            if (!e) continue
            const i = s(e, r),
              c = this._checkedSymbols.get(i),
              a = -1 !== n.findIndex(e => e.symbol === i)
            if (void 0 === c || a) this._recentSymbolsEnabled && n.push(o(e, i, !1))
            else for (const t of c) n.push(o(e, i, !0, this._idToStudyMap.get(t)))
          }
          this._updateContentItemList(n), this._isDataReady.setValue(!0)
        }
        _showNewItem(e, t, s) {
          const o = this._contentItemList.value().map(this._updateChecked, this)
          o.unshift(e),
            this._recentSymbolsEnabled && o.unshift({ ...e, id: t, study: void 0, checked: !1 }),
            this._updateContentItemList(o),
            this._highlightedSymbol.setValue(s),
            setTimeout(() => this._highlightedSymbol.setValue(null), 500)
        }
        _addStudyIdToCheckedSymbols(e, t) {
          const s = this._checkedSymbols.get(e) || []
          this._checkedSymbols.set(e, [...s, t])
        }
        _removeStudyIdFromCheckedSymbols(e, t) {
          const s = this._checkedSymbols.get(e)
          if (s) {
            const o = s.indexOf(t)
            s.splice(o, 1), this._checkedSymbols.set(e, s)
          }
        }
        _updateChecked(e) {
          var t
          const s = this._checkedSymbols.get(e.symbol),
            o = null === (t = e.study) || void 0 === t ? void 0 : t.id()
          return o ? { ...e, checked: Boolean(s && s.includes(o)) } : e
        }
        _updateContentItemList(e, t) {
          const s = t ? e.map(this._updateChecked, this) : e,
            o = s.filter(e => e.checked)
          if (this._recentSymbolsEnabled) {
            const e = new Set(),
              t = s
                .reduce((t, s) => (s.checked || e.has(s.symbol) || (t.push(s), e.add(s.symbol)), t), [])
                .slice(0, this._recentLength)
            this._contentItemList.setValue(o.concat(t))
          } else this._contentItemList.setValue(o)
        }
        _checkedStudiesIds() {
          const e = [].concat(...Array.from(this._checkedSymbols.values()))
          return new Set(e)
        }
        _getContentItemByStudyId(e) {
          const t = this._contentItemList.value(),
            s = t.findIndex(t => t.study && t.study.id() === e)
          return t[s]
        }
        _loadRecent() {
          return this._recentSymbolsEnabled ? b.getJSON('CompareDialog.recent', []) : []
        }
        _saveRecent(e) {
          if (!this._recentSymbolsEnabled) return
          const t = new Set(this._loadRecent())
          t.has(e) && t.delete(e), t.add(e), b.setJSON('CompareDialog.recent', Array.from(t).slice(-this._recentLength))
        }
        _getSymbolDescription(e) {
          var t
          return this._defaultSymbolsDescriptions.size &&
            null !== (t = this._defaultSymbolsDescriptions.get(e)) &&
            void 0 !== t
            ? t
            : ''
        }
      }
      v._snapshoter = null
    },
    46148: (e, t, s) => {
      var o
      s.d(t, { CompareOption: () => o }),
        (function (e) {
          ;(e[(e.SameScale = 0)] = 'SameScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane')
        })(o || (o = {}))
    },
  },
])
