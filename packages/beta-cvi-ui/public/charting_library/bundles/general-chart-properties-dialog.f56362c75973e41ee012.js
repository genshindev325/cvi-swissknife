;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7078],
  {
    59142: function (e, t) {
      var n, i, o
      ;(i = [t]),
        void 0 ===
          (o =
            'function' ==
            typeof (n = function (e) {
              'use strict'
              function t(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t]
                  return n
                }
                return Array.from(e)
              }
              Object.defineProperty(e, '__esModule', { value: !0 })
              var n = !1
              if ('undefined' != typeof window) {
                var i = {
                  get passive() {
                    n = !0
                  },
                }
                window.addEventListener('testPassive', null, i), window.removeEventListener('testPassive', null, i)
              }
              var o =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                l = [],
                a = !1,
                s = -1,
                r = void 0,
                c = void 0,
                m = function (e) {
                  return l.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                d = function (e) {
                  var t = e || window.event
                  return !!m(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                h = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== r && ((document.body.style.overflow = r), (r = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, i) {
                if (o) {
                  if (!e)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    e &&
                    !l.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var h = { targetElement: e, options: i || {} }
                    ;(l = [].concat(t(l), [h])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (s = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var n, i, o, l
                        1 === t.targetTouches.length &&
                          ((i = e),
                          (l = (n = t).targetTouches[0].clientY - s),
                          !m(n.target) &&
                            ((i && 0 === i.scrollTop && 0 < l) ||
                            ((o = i) && o.scrollHeight - o.scrollTop <= o.clientHeight && l < 0)
                              ? d(n)
                              : n.stopPropagation()))
                      }),
                      a || (document.addEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !0))
                  }
                } else {
                  ;(p = i),
                    setTimeout(function () {
                      if (void 0 === c) {
                        var e = !!p && !0 === p.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((c = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === r && ((r = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var u = { targetElement: e, options: i || {} }
                  l = [].concat(t(l), [u])
                }
                var p
              }),
                (e.clearAllBodyScrollLocks = function () {
                  o
                    ? (l.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      a && (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !1)),
                      (l = []),
                      (s = -1))
                    : (h(), (l = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (o) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (l = l.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      a &&
                        0 === l.length &&
                        (document.removeEventListener('touchmove', d, n ? { passive: !1 } : void 0), (a = !1))
                  } else
                    1 === l.length && l[0].targetElement === e
                      ? (h(), (l = []))
                      : (l = l.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? n.apply(t, i)
              : n) || (e.exports = o)
    },
    24929: e => {
      e.exports = { backButton: 'backButton-ydU3v7fN' }
    },
    54565: e => {
      e.exports = {
        wrapper: 'wrapper-Zcmov9JL',
        container: 'container-Zcmov9JL',
        tab: 'tab-Zcmov9JL',
        active: 'active-Zcmov9JL',
        title: 'title-Zcmov9JL',
        icon: 'icon-Zcmov9JL',
        titleText: 'titleText-Zcmov9JL',
        nested: 'nested-Zcmov9JL',
        isTablet: 'isTablet-Zcmov9JL',
        isMobile: 'isMobile-Zcmov9JL',
      }
    },
    79349: e => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'tablet-small-breakpoint': 'screen and (max-width: 428px)',
        withSidebar: 'withSidebar-26RvWdey',
        content: 'content-26RvWdey',
        tabContent: 'tabContent-26RvWdey',
        applyToAllButton: 'applyToAllButton-26RvWdey',
      }
    },
    12662: e => {
      e.exports = {
        themesButtonText: 'themesButtonText-FIFiZujG',
        themesButtonIcon: 'themesButtonIcon-FIFiZujG',
        defaultsButtonText: 'defaultsButtonText-FIFiZujG',
        defaultsButtonItem: 'defaultsButtonItem-FIFiZujG',
      }
    },
    524: e => {
      e.exports = {
        separator: 'separator-GzmeVcFo',
        small: 'small-GzmeVcFo',
        normal: 'normal-GzmeVcFo',
        large: 'large-GzmeVcFo',
      }
    },
    22265: (e, t, n) => {
      'use strict'
      n.d(t, { DialogSidebarContainer: () => m, DialogSidebarWrapper: () => d, DialogSidebarItem: () => h })
      var i = n(59496),
        o = n(97754),
        l = n.n(o),
        a = n(9745),
        s = n(30360),
        r = n(54565)
      function c(e) {
        return { isMobile: 'mobile' === e, isTablet: 'tablet' === e }
      }
      function m(e) {
        const { mode: t, className: n, ...o } = e,
          { isMobile: a, isTablet: s } = c(t),
          m = l()(r.container, s && r.isTablet, a && r.isMobile, n)
        return i.createElement('div', { ...o, className: m, 'data-role': 'dialog-sidebar' })
      }
      function d(e) {
        return i.createElement('div', { className: r.wrapper, ...e })
      }
      function h(e) {
        const { mode: t, title: n, icon: o, isActive: m, onClick: d, ...h } = e,
          { isMobile: u, isTablet: p } = c(t)
        return i.createElement(
          'div',
          { ...h, className: l()(r.tab, p && r.isTablet, u && r.isMobile, m && r.active), onClick: d },
          i.createElement(a.Icon, { className: r.icon, icon: o }),
          !p &&
            i.createElement(
              'span',
              { className: r.title },
              i.createElement('span', { className: r.titleText }, n),
              u && i.createElement(a.Icon, { className: r.nested, icon: s }),
            ),
        )
      }
    },
    72811: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { GeneralChartPropertiesDialogRenderer: () => U })
      var i = n(28353),
        o = n(59496),
        l = n(87995),
        a = n(94720),
        s = n(90545),
        r = n(50182),
        c = n(66849),
        m = n(35868),
        d = n(56840),
        h = n.n(d),
        u = n(42060),
        p = n(90692),
        b = n(9745),
        g = n(95276),
        v = n(16396),
        y = n(51613),
        f = n(6087),
        C = (n(94419), n(3615))
      const T = (0, i.t)("Do you really want to delete Color Theme '{name}' ?")
      var _ = n(50655),
        S = n(82724),
        k = n(96040),
        A = n(51768),
        E = n(70412),
        w = n(32563),
        P = n(12662)
      function B(e) {
        const { themeName: t, chartWidgetCollection: n, onRemove: i, manager: l } = e,
          [a, s] = (0, E.useHover)(),
          r = o.useCallback(
            () =>
              (function (e, t, n) {
                window.is_authenticated &&
                  (0, C.showConfirm)(
                    {
                      text: T.format({ name: e }),
                      onConfirm: ({ dialogClose: n }) => {
                        ;(0, f.removeTheme)(e), t && t(e), n()
                      },
                    },
                    n,
                  )
              })(t, i, l),
            [t, i, l],
          ),
          c = o.useCallback(() => {
            ;(0, f.loadTheme)(n, { themeName: t, standardTheme: !1 }).then(() => {
              n.readOnly() || window.saver.saveChartSilently(), (0, A.trackEvent)('GUI', 'Switch to custom theme')
            })
          }, [t, n])
        return o.createElement(
          'div',
          { ...s },
          o.createElement(v.PopupMenuItem, {
            className: P.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: c,
            toolbox: o.createElement(k.RemoveButton, { hidden: !w.mobiletouch && !a, onClick: r }),
          }),
        )
      }
      var M = n(31328)
      const x = (0, i.t)('Template'),
        I = (0, i.t)('Apply defaults'),
        L = ((0, S.appendEllipsis)((0, i.t)('Save as')), (0, i.t)('Apply to all'))
      class D extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._manager = null),
            (this._handleApplyDefaults = () => {
              const { model: e, chartWidgetCollection: t } = this.props
              e.restorePreferences()
              const n = (0, f.getCurrentTheme)().name
              ;(0, f.loadTheme)(t, { themeName: n, standardTheme: !0, applyOverrides: !0 })
            }),
            (this._handleSaveAs = () => {
              0
            }),
            (this._handleRemoveTheme = e => {
              this.setState({ themes: this.state.themes.filter(t => t !== e) })
            }),
            (this._syncThemeList = () => {
              0
            }),
            (this.state = { themes: [] }),
            this._syncThemeList()
        }
        render() {
          return o.createElement(
            _.SlotContext.Consumer,
            null,
            e => (
              (this._manager = e),
              o.createElement(p.MatchMedia, { rule: 'screen and (max-width: 768px)' }, e =>
                o.createElement(
                  g.ControlDisclosure,
                  {
                    id: 'series-theme-manager',
                    className: !e && P.themesButtonText,
                    hideArrowButton: e,
                    'data-name': 'theme-select',
                    buttonChildren: this._getPlaceHolderItem(e),
                  },
                  this._getThemeItems(e),
                ),
              )
            ),
          )
        }
        _getPlaceHolderItem(e) {
          return e ? o.createElement(b.Icon, { className: P.themesButtonIcon, icon: M }) : x
        }
        _getThemeItems(e) {
          const { isApplyToAllVisible: t, chartWidgetCollection: n, applyToAllCallback: i } = this.props,
            { themes: l } = this.state
          return o.createElement(
            o.Fragment,
            null,
            e &&
              t &&
              o.createElement(v.PopupMenuItem, { className: P.defaultsButtonItem, isActive: !1, label: L, onClick: i }),
            o.createElement(v.PopupMenuItem, {
              className: P.defaultsButtonItem,
              isActive: !1,
              label: I,
              onClick: this._handleApplyDefaults,
            }),
            !1,
            l.length > 0 &&
              o.createElement(
                o.Fragment,
                null,
                o.createElement(y.PopupMenuSeparator, { key: 'separator' }),
                l.map(e =>
                  o.createElement(B, {
                    key: e,
                    themeName: e,
                    onRemove: this._handleRemoveTheme,
                    chartWidgetCollection: n,
                    manager: this._manager,
                  }),
                ),
              ),
          )
        }
      }
      var N = n(59064),
        z = n(71953),
        W = n(24437),
        R = n(22265),
        V = n(86656)
      const F = {
        areaSymbolMinTick: 'normal',
        areaSymbolTimezone: 'normal',
        barSymbolMinTick: 'normal',
        barSymbolTimezone: 'normal',
        baselineSymbolMinTick: 'normal',
        baselineSymbolTimezone: 'normal',
        candleSymbolMinTick: 'normal',
        candleSymbolTimezone: 'normal',
        dateFormat: 'normal',
        haSymbolMinTick: 'normal',
        haSymbolTimezone: 'normal',
        hiloSymbolMinTick: 'normal',
        hiloSymbolTimezone: 'normal',
        hollowCandleSymbolMinTick: 'normal',
        hollowCandleSymbolTimezone: 'normal',
        kagiAtrLength: 'normal',
        kagiReversalAmount: 'normal',
        kagiStyle: 'normal',
        kagiSymbolMinTick: 'normal',
        kagiSymbolTimezone: 'normal',
        lineSymbolMinTick: 'normal',
        lineSymbolTimezone: 'normal',
        sessionId: 'normal',
        lockScale: 'normal',
        mainSeriesSymbolAreaPriceSource: 'normal',
        mainSeriesSymbolBaseLevelPercentage: 'normal',
        mainSeriesSymbolBaseLinePriceSource: 'normal',
        mainSeriesSymbolLinePriceSource: 'normal',
        mainSeriesSymbolStyleType: 'normal',
        navButtons: 'big',
        paneButtons: 'big',
        scalesCurrencyUnit: 'big',
        pbLb: 'normal',
        pbSymbolMinTick: 'normal',
        pbSymbolTimezone: 'normal',
        pnfAtrLength: 'normal',
        pnfBoxSize: 'normal',
        pnfReversalAmount: 'normal',
        pnfSources: 'normal',
        pnfStyle: 'normal',
        pnfSymbolMinTick: 'normal',
        pnfSymbolTimezone: 'normal',
        rangeSymbolMinTick: 'normal',
        rangeSymbolTimezone: 'normal',
        renkoAtrLength: 'normal',
        renkoBoxSize: 'normal',
        renkoStyle: 'normal',
        renkoSymbolMinTick: 'normal',
        renkoSymbolTimezone: 'normal',
        scalesPlacement: 'normal',
        symbolLastValueLabel: 'big',
        symbolTextSource: 'normal',
      }
      var Z = n(24929),
        G = n(64360)
      function J(e) {
        return o.createElement(b.Icon, { className: Z.backButton, icon: G, onClick: e.onClick })
      }
      var O = n(79349)
      class H extends o.PureComponent {
        constructor(e) {
          var t
          super(e),
            (this._renderChildren = ({ requestResize: e, isSmallWidth: t }) => (
              (this._requestResize = e),
              o.createElement('div', { className: O.content }, this._renderTabs(t), this._renderTabContent(t))
            )),
            (this._renderApplyToAllButton = () =>
              o.createElement(p.MatchMedia, { rule: W.DialogBreakpoints.TabletNormal }, e =>
                this._renderApplyToAll(e),
              )),
            (this._renderFooterLeft = () => {
              const { model: e, chartWidgetCollection: t } = this.props,
                { isApplyToAllVisible: n } = this.state
              return o.createElement(D, {
                model: e,
                isApplyToAllVisible: n,
                applyToAllCallback: this._handleApplyToAll,
                chartWidgetCollection: t,
              })
            }),
            (this._createTabClickHandler = e => () => this._selectPage(e)),
            (this._selectPage = (e, t) => {
              const { activePage: n } = this.state
              e !== n &&
                (n && n.definitions.unsubscribe(this._onChangeActivePageDefinitions),
                null !== e &&
                  (t || h().setValue('properties_dialog.last_page_id', e.id),
                  e.definitions.subscribe(this._onChangeActivePageDefinitions)),
                this.setState({ activePage: e, tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize()
                }))
            }),
            (this._onChangeActivePageDefinitions = () => {
              z.logger.logNormal('Definition collection was updated'),
                this.setState({ tableKey: Date.now() }, () => {
                  this._requestResize && this._requestResize()
                })
            }),
            (this._onTabVisibilityChanged = () => {
              const e = this.props.pages.filter(e => e.visible.value())
              this.setState({ visiblePages: e })
              const t = this.state.activePage
              null === t || e.includes(t) || this._selectPage(0 === e.length ? null : e[0], !0)
            }),
            (this._handleCancel = () => {
              this.props.onCancel(), this.props.onClose()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this.props.onClose()
            }),
            (this._handleScroll = () => {
              N.globalCloseDelegate.fire()
            }),
            (this._handleApplyToAll = () => {
              const { chartWidgetCollection: e, model: t } = this.props,
                { isApplyToAllVisible: n } = this.state
              n && e.applyPreferencesToAllCharts(t)
            }),
            (this._syncApplyToAllVisibility = () => {
              const { chartWidgetCollection: e } = this.props
              this.setState({ isApplyToAllVisible: (0, u.isMultipleLayout)(e.layout.value()) })
            }),
            (this._handleBackClick = () => {
              const { activePage: e } = this.state
              e && e.definitions.unsubscribe(this._onChangeActivePageDefinitions), this.setState({ activePage: null })
            })
          const { pages: n, activePageId: i } = e,
            l = n.filter(e => e.visible.value())
          let a = null !== (t = l.find(e => e.id === i)) && void 0 !== t ? t : null
          if (!a) {
            const e = h().getValue('properties_dialog.last_page_id'),
              t = l.find(t => t.id === e)
            a = t || (l.length > 0 ? l[0] : null)
          }
          this.state = {
            activePage: a,
            visiblePages: l,
            isApplyToAllVisible: (0, u.isMultipleLayout)(e.chartWidgetCollection.layout.value()),
            tableKey: Date.now(),
          }
        }
        componentDidMount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: n } = this.state
          e.layout.subscribe(this._syncApplyToAllVisibility),
            n && n.definitions.subscribe(this._onChangeActivePageDefinitions),
            t.forEach(e => e.visible.subscribe(this._onTabVisibilityChanged))
        }
        componentWillUnmount() {
          const { chartWidgetCollection: e, pages: t } = this.props,
            { activePage: n } = this.state
          n && n.definitions.unsubscribe(this._onChangeActivePageDefinitions),
            e.layout.unsubscribe(this._syncApplyToAllVisibility),
            t.forEach(e => e.visible.unsubscribe(this._onTabVisibilityChanged))
        }
        render() {
          const { isOpened: e, onClose: t } = this.props,
            { activePage: n } = this.state
          return o.createElement(p.MatchMedia, { rule: W.DialogBreakpoints.TabletSmall }, l =>
            o.createElement(r.AdaptiveConfirmDialog, {
              className: O.withSidebar,
              dataName: 'series-properties-dialog',
              onClose: t,
              isOpened: e,
              title: null !== n && l ? n.title : (0, i.t)('Chart settings'),
              footerLeftRenderer: this._renderFooterLeft,
              additionalButtons: this._renderApplyToAllButton(),
              additionalHeaderElement:
                null !== n && l ? o.createElement(J, { onClick: this._handleBackClick }) : void 0,
              onSubmit: this._handleSubmit,
              onCancel: this._handleCancel,
              render: this._renderChildren,
              submitOnEnterKey: !1,
            }),
          )
        }
        _renderTabContent(e) {
          const { pages: t } = this.props,
            n = this._getCurrentPage(e)
          if (n) {
            const e = t.find(e => e.id === n.id),
              i = e ? e.definitions.value() : []
            return o.createElement(
              V.TouchScrollContainer,
              { className: O.tabContent, onScroll: this._handleScroll },
              o.createElement(
                c.ControlCustomWidthContext.Provider,
                { value: F },
                o.createElement(
                  m.PropertyTable,
                  { key: this.state.tableKey },
                  i.map(e => o.createElement(s.Section, { key: e.id, definition: e })),
                ),
              ),
            )
          }
          return null
        }
        _renderTabs(e) {
          const { activePage: t, visiblePages: n } = this.state
          if (t && e) return null
          const i = this._getCurrentPage(e)
          return o.createElement(p.MatchMedia, { rule: W.DialogBreakpoints.TabletNormal }, e =>
            o.createElement(p.MatchMedia, { rule: W.DialogBreakpoints.TabletSmall }, t => {
              const l = t ? 'mobile' : e ? 'tablet' : void 0
              return o.createElement(
                R.DialogSidebarContainer,
                { mode: l, onScroll: this._handleScroll },
                n.map(e =>
                  o.createElement(R.DialogSidebarItem, {
                    key: e.id,
                    mode: l,
                    'data-name': e.id,
                    title: e.title,
                    icon: e.icon,
                    onClick: this._createTabClickHandler(e),
                    isActive: i ? e.id === i.id : void 0,
                  }),
                ),
              )
            }),
          )
        }
        _renderApplyToAll(e) {
          const { isApplyToAllVisible: t } = this.state
          return (
            !e &&
            t &&
            o.createElement(
              'span',
              { className: O.applyToAllButton },
              o.createElement(
                a.Button,
                { appearance: 'stroke', onClick: this._handleApplyToAll },
                (0, i.t)('Apply to all'),
              ),
            )
          )
        }
        _getCurrentPage(e) {
          const { pages: t } = this.props,
            { activePage: n } = this.state
          let i = null
          return n ? (i = n) : !e && t.length && (i = t[0]), i
        }
      }
      var j = n(76422),
        q = n(22729)
      const K = (0, i.t)('Chart settings')
      class U extends q.DialogRenderer {
        constructor(e) {
          super(),
            (this._handleClose = () => {
              l.unmountComponentAtNode(this._container), this._setVisibility(!1), this._onClose && this._onClose()
            }),
            (this._handleSubmit = () => {}),
            (this._handleCancel = () => {
              this._model.undoToCheckpoint(this._checkpoint)
            }),
            (this._propertyPages = e.propertyPages),
            (this._model = e.model),
            (this._activePageId = e.activePageId),
            (this._onClose = e.onClose),
            (this._chartWidgetCollection = e.chartWidgetCollection),
            (this._checkpoint = this._ensureCheckpoint(e.undoCheckPoint))
        }
        hide(e) {
          e ? this._handleCancel() : this._handleSubmit(), this._handleClose()
        }
        isVisible() {
          return this.visible().value()
        }
        show() {
          l.render(
            o.createElement(H, {
              title: K,
              isOpened: !0,
              onSubmit: this._handleSubmit,
              onClose: this._handleClose,
              onCancel: this._handleCancel,
              pages: this._propertyPages,
              model: this._model,
              activePageId: this._activePageId,
              chartWidgetCollection: this._chartWidgetCollection,
            }),
            this._container,
          ),
            this._setVisibility(!0),
            j.emit('edit_object_dialog', { objectType: 'mainSeries', scriptTitle: this._model.mainSeries().title() })
        }
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
      }
    },
    51613: (e, t, n) => {
      'use strict'
      n.d(t, { PopupMenuSeparator: () => s })
      var i = n(59496),
        o = n(97754),
        l = n.n(o),
        a = n(524)
      function s(e) {
        const { size: t = 'normal', className: n } = e
        return i.createElement('div', {
          className: l()(
            a.separator,
            'small' === t && a.small,
            'normal' === t && a.normal,
            'large' === t && a.large,
            n,
          ),
        })
      }
    },
    30360: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentcolor" stroke-width="1.3" d="M12 9l5 5-5 5"/></svg>'
    },
  },
])
