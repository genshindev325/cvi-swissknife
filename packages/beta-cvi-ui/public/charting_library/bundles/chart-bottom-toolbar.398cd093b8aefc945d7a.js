;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7260],
  {
    59142: function (e, t) {
      var s, n, i
      ;(n = [t]),
        void 0 ===
          (i =
            'function' ==
            typeof (s = function (e) {
              'use strict'
              function t(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, s = Array(e.length); t < e.length; t++) s[t] = e[t]
                  return s
                }
                return Array.from(e)
              }
              Object.defineProperty(e, '__esModule', { value: !0 })
              var s = !1
              if ('undefined' != typeof window) {
                var n = {
                  get passive() {
                    s = !0
                  },
                }
                window.addEventListener('testPassive', null, n), window.removeEventListener('testPassive', null, n)
              }
              var i =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                a = [],
                o = !1,
                r = -1,
                l = void 0,
                c = void 0,
                d = function (e) {
                  return a.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                h = function (e) {
                  var t = e || window.event
                  return !!d(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                u = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== l && ((document.body.style.overflow = l), (l = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, n) {
                if (i) {
                  if (!e)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    e &&
                    !a.some(function (t) {
                      return t.targetElement === e
                    })
                  ) {
                    var u = { targetElement: e, options: n || {} }
                    ;(a = [].concat(t(a), [u])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (r = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var s, n, i, a
                        1 === t.targetTouches.length &&
                          ((n = e),
                          (a = (s = t).targetTouches[0].clientY - r),
                          !d(s.target) &&
                            ((n && 0 === n.scrollTop && 0 < a) ||
                            ((i = n) && i.scrollHeight - i.scrollTop <= i.clientHeight && a < 0)
                              ? h(s)
                              : s.stopPropagation()))
                      }),
                      o || (document.addEventListener('touchmove', h, s ? { passive: !1 } : void 0), (o = !0))
                  }
                } else {
                  ;(g = n),
                    setTimeout(function () {
                      if (void 0 === c) {
                        var e = !!g && !0 === g.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((c = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === l && ((l = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var m = { targetElement: e, options: n || {} }
                  a = [].concat(t(a), [m])
                }
                var g
              }),
                (e.clearAllBodyScrollLocks = function () {
                  i
                    ? (a.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      o && (document.removeEventListener('touchmove', h, s ? { passive: !1 } : void 0), (o = !1)),
                      (a = []),
                      (r = -1))
                    : (u(), (a = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (i) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (a = a.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      o &&
                        0 === a.length &&
                        (document.removeEventListener('touchmove', h, s ? { passive: !1 } : void 0), (o = !1))
                  } else
                    1 === a.length && a[0].targetElement === e
                      ? (u(), (a = []))
                      : (a = a.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? s.apply(t, n)
              : s) || (e.exports = i)
    },
    62092: e => {
      e.exports = {
        loader: 'loader-MuZZSHRY',
        static: 'static-MuZZSHRY',
        item: 'item-MuZZSHRY',
        'tv-button-loader': 'tv-button-loader-MuZZSHRY',
        medium: 'medium-MuZZSHRY',
        small: 'small-MuZZSHRY',
        black: 'black-MuZZSHRY',
        white: 'white-MuZZSHRY',
        gray: 'gray-MuZZSHRY',
        primary: 'primary-MuZZSHRY',
        'loader-initial': 'loader-initial-MuZZSHRY',
        'loader-appear': 'loader-appear-MuZZSHRY',
      }
    },
    32925: e => {
      e.exports = { button: 'button-WhrIKIq9', hover: 'hover-WhrIKIq9', inner: 'inner-WhrIKIq9' }
    },
    78966: e => {
      e.exports = { title: 'title-mAu74Mtg' }
    },
    43527: e => {
      e.exports = {
        toolbar: 'toolbar-sFd8og5Y',
        dateRangeWrapper: 'dateRangeWrapper-sFd8og5Y',
        seriesControlWrapper: 'seriesControlWrapper-sFd8og5Y',
        dateRangeExpanded: 'dateRangeExpanded-sFd8og5Y',
        dateRangeCollapsed: 'dateRangeCollapsed-sFd8og5Y',
        item: 'item-sFd8og5Y',
        first: 'first-sFd8og5Y',
        last: 'last-sFd8og5Y',
        inline: 'inline-sFd8og5Y',
        timezone: 'timezone-sFd8og5Y',
        session: 'session-sFd8og5Y',
        icon: 'icon-sFd8og5Y',
        hidden: 'hidden-sFd8og5Y',
        collapsed: 'collapsed-sFd8og5Y',
      }
    },
    47393: e => {
      e.exports = { button: 'button-YwWuPcCo', separator: 'separator-YwWuPcCo' }
    },
    25033: e => {
      e.exports = { button: 'button-wNyKS1Qc', hover: 'hover-wNyKS1Qc', icon: 'icon-wNyKS1Qc' }
    },
    71922: e => {
      e.exports = { separator: 'separator-ArqK8T1e' }
    },
    70439: e => {
      e.exports = { headerMenuText: 'headerMenuText-suXx3uas' }
    },
    17963: e => {
      e.exports = { button: 'button-U8Px2hz6' }
    },
    22880: e => {
      e.exports = {
        item: 'item-G1QqQDLk',
        hover: 'hover-G1QqQDLk',
        isActive: 'isActive-G1QqQDLk',
        isFirst: 'isFirst-G1QqQDLk',
        isLast: 'isLast-G1QqQDLk',
      }
    },
    72767: e => {
      e.exports = { slider: 'slider-eR7xmZ00', inner: 'inner-eR7xmZ00' }
    },
    38952: e => {
      e.exports = { sliderRow: 'sliderRow-DtHrLXA3' }
    },
    19119: e => {
      e.exports = {
        item: 'item-tPYeYcJa',
        interactive: 'interactive-tPYeYcJa',
        hovered: 'hovered-tPYeYcJa',
        disabled: 'disabled-tPYeYcJa',
        active: 'active-tPYeYcJa',
        shortcut: 'shortcut-tPYeYcJa',
        normal: 'normal-tPYeYcJa',
        big: 'big-tPYeYcJa',
        iconCell: 'iconCell-tPYeYcJa',
        icon: 'icon-tPYeYcJa',
        checkmark: 'checkmark-tPYeYcJa',
        content: 'content-tPYeYcJa',
        label: 'label-tPYeYcJa',
        checked: 'checked-tPYeYcJa',
        toolbox: 'toolbox-tPYeYcJa',
        showToolboxOnHover: 'showToolboxOnHover-tPYeYcJa',
        arrowIcon: 'arrowIcon-tPYeYcJa',
        subMenu: 'subMenu-tPYeYcJa',
        invisibleHotkey: 'invisibleHotkey-tPYeYcJa',
      }
    },
    61999: e => {
      e.exports = {
        item: 'item-zoYF2FPa',
        emptyIcons: 'emptyIcons-zoYF2FPa',
        loading: 'loading-zoYF2FPa',
        disabled: 'disabled-zoYF2FPa',
        interactive: 'interactive-zoYF2FPa',
        hovered: 'hovered-zoYF2FPa',
        normal: 'normal-zoYF2FPa',
        big: 'big-zoYF2FPa',
        icon: 'icon-zoYF2FPa',
        label: 'label-zoYF2FPa',
        title: 'title-zoYF2FPa',
        nested: 'nested-zoYF2FPa',
        shortcut: 'shortcut-zoYF2FPa',
        remove: 'remove-zoYF2FPa',
      }
    },
    91626: e => {
      e.exports = { separator: 'separator-jtAq6E4V' }
    },
    524: e => {
      e.exports = {
        separator: 'separator-GzmeVcFo',
        small: 'small-GzmeVcFo',
        normal: 'normal-GzmeVcFo',
        large: 'large-GzmeVcFo',
      }
    },
    37740: e => {
      e.exports = {
        tabs: 'tabs-rKFlMYkc',
        tab: 'tab-rKFlMYkc',
        noBorder: 'noBorder-rKFlMYkc',
        disabled: 'disabled-rKFlMYkc',
        active: 'active-rKFlMYkc',
        defaultCursor: 'defaultCursor-rKFlMYkc',
        slider: 'slider-rKFlMYkc',
        content: 'content-rKFlMYkc',
      }
    },
    26996: (e, t, s) => {
      'use strict'
      s.d(t, { Loader: () => c })
      var n,
        i = s(59496),
        a = s(97754),
        o = s(74991),
        r = s(62092),
        l = s.n(r)
      !(function (e) {
        ;(e[(e.Initial = 0)] = 'Initial'), (e[(e.Appear = 1)] = 'Appear'), (e[(e.Active = 2)] = 'Active')
      })(n || (n = {}))
      class c extends i.PureComponent {
        constructor(e) {
          super(e), (this._stateChangeTimeout = null), (this.state = { state: n.Initial })
        }
        render() {
          const { className: e, color: t = 'black', size: s = 'medium', staticPosition: n } = this.props,
            o = a(l().item, l()[t], l()[s])
          return i.createElement(
            'span',
            { className: a(l().loader, n && l().static, this._getStateClass(), e) },
            i.createElement('span', { className: o }),
            i.createElement('span', { className: o }),
            i.createElement('span', { className: o }),
          )
        }
        componentDidMount() {
          this.setState({ state: n.Appear }),
            (this._stateChangeTimeout = setTimeout(() => {
              this.setState({ state: n.Active })
            }, 2 * o.dur))
        }
        componentWillUnmount() {
          this._stateChangeTimeout && (clearTimeout(this._stateChangeTimeout), (this._stateChangeTimeout = null))
        }
        _getStateClass() {
          switch (this.state.state) {
            case n.Initial:
              return l()['loader-initial']
            case n.Appear:
              return l()['loader-appear']
            default:
              return ''
          }
        }
      }
    },
    49466: (e, t, s) => {
      'use strict'
      s.d(t, { ToolWidgetMenuSummary: () => o })
      var n = s(59496),
        i = s(97754),
        a = s(78966)
      function o(e) {
        return n.createElement('div', { className: i(e.className, a.title) }, e.children)
      }
    },
    50168: (e, t, s) => {
      'use strict'
      s.r(t), s.d(t, { BottomToolbarRenderer: () => nt })
      var n = s(59496),
        i = s(87995),
        a = s(28353),
        o = s(19036),
        r = s(97754),
        l = s(9837),
        c = s(67337),
        d = s(35390),
        h = s(40233),
        u = s(59064),
        m = s(90692),
        g = s(16396),
        p = s(51613),
        v = s(88537),
        b = s(51768),
        _ = s(55402),
        C = s(2872),
        S = s.n(C),
        f = s(16654)
      class y {
        constructor(e) {
          ;(this._state = { ranges: [] }),
            (this._change = new (S())()),
            (this._rangeChangedListenerBound = this._onRangeChanged.bind(this))
          const { chartWidget: t } = (this._context = e)
          t.withModel(null, () => {
            const e = t.model(),
              s = e.mainSeries()
            s.onStatusChanged().subscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                s.dataEvents().symbolResolved().subscribe(this, this._updateAvailableRanges),
              s.priceScale().properties().childs().lockScale.subscribe(this, this._updateAvailableRanges)
            const n = e.model().appliedTimeFrame()
            n.subscribe(this._rangeChangedListenerBound),
              this._rangeChangedListenerBound(n.value()),
              this._updateAvailableRanges()
          })
        }
        state() {
          return this._state
        }
        onChange() {
          return this._change
        }
        selectRange(e) {
          this._setState({ activeRange: e.value.value })
          const { chartWidgetCollection: t } = this._context,
            s = { val: e.value, res: e.targetResolution }
          t.setTimeFrame(s)
        }
        destroy() {
          const { chartWidget: e } = this._context
          e.withModel(null, () => {
            const t = e.model(),
              s = t.mainSeries()
            s.onStatusChanged().unsubscribe(this, this._updateAvailableRanges),
              c.enabled('update_timeframes_set_on_symbol_resolve') &&
                s.dataEvents().symbolResolved().unsubscribe(this, this._updateAvailableRanges),
              s.priceScale().properties().childs().lockScale.unsubscribe(this, this._updateAvailableRanges),
              t.model().appliedTimeFrame().unsubscribe(this._rangeChangedListenerBound)
          }),
            this._change.destroy()
        }
        _setState(e) {
          ;(this._state = Object.assign({}, this._state, e)), this._change.fire(this._state)
        }
        _onRangeChanged(e) {
          let t
          null !== e && 'period-back' === e.val.type && (t = e.val.value), this._setState({ activeRange: t })
        }
        _updateAvailableRanges() {
          const { availableTimeFrames: e, chartWidget: t } = this._context
          if (!t.hasModel()) return
          const s = t.model().mainSeries(),
            n = s.status()
          if (n === f.STATUS_LOADING || n === f.STATUS_RESOLVING) return
          const i = e(s.symbolInfo(), s.status())
          0 !== i.length && this._setState({ ranges: i })
        }
      }
      const x = (0, _.registryContextType)()
      function E(e) {
        var t
        return (
          ((t = class extends n.PureComponent {
            constructor(e, t) {
              super(e, t),
                (this._handleUpdate = e => {
                  this.setState(e)
                }),
                (this._handleSelectRange = e => {
                  var t, s
                  ;(0, b.trackEvent)('GUI', 'Chart Bottom Toolbar', 'range ' + e.value),
                    null === (s = (t = this.props).onSelectRange) || void 0 === s || s.call(t, e),
                    this._binding.selectRange(e)
                }),
                (0, _.validateRegistry)(t, {
                  availableTimeFrames: o.any.isRequired,
                  chartWidgetCollection: o.any.isRequired,
                  chartWidget: o.any.isRequired,
                }),
                M.has(t.chartWidget) || M.set(t.chartWidget, new y(t))
              const s = (this._binding = (0, v.ensureDefined)(M.get(t.chartWidget)))
              this.state = s.state()
            }
            componentDidMount() {
              this._binding.onChange().subscribe(this, this._handleUpdate)
            }
            componentWillUnmount() {
              this._binding.onChange().unsubscribe(this, this._handleUpdate)
            }
            render() {
              return n.createElement(e, {
                goToDateButton: this.props.goToDateButton,
                className: this.props.className,
                ranges: this.state.ranges,
                activeRange: this.state.activeRange,
                onSelectRange: this._handleSelectRange,
              })
            }
          }).contextType = x),
          t
        )
      }
      const M = new WeakMap()
      var R = s(94420),
        k = s(23829),
        w = s(1109),
        T = s(82724),
        A = s(52360),
        W = s(47393)
      function N(e) {
        const { ranges: t, activeRange: s, onSelectRange: i } = e
        return n.createElement(
          n.Fragment,
          null,
          t.map(e =>
            n.createElement(k.ContextMenuItem, {
              key: e.value.value,
              label: e.description || e.text,
              active: s === e.value.value,
              checked: s === e.value.value,
              checkable: !0,
              disabled: !1,
              onClick: a.bind(null, e),
              doNotCloseOnClick: !1,
              subItems: [],
            }),
          ),
        )
        function a(e) {
          e && i && i(e), (0, u.globalCloseMenu)()
        }
      }
      function B(e) {
        const { onGoToDateClick: t } = e
        return n.createElement(
          n.Fragment,
          null,
          n.createElement(w.Separator, { className: W.separator }),
          n.createElement(k.ContextMenuItem, {
            icon: A,
            label: (0, T.appendEllipsis)((0, a.t)('Go to')),
            onClick: t,
            active: !1,
            checked: !1,
            checkable: !1,
            disabled: !1,
            doNotCloseOnClick: !1,
            subItems: [],
          }),
        )
      }
      const F = { title: (0, a.t)('Date Range'), goToDate: (0, T.appendEllipsis)((0, a.t)('Go to')) },
        P = (0, _.registryContextType)()
      class z extends n.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleGoToDateClick = () => {
              const { chartWidget: e } = this.context
              ;(0, R.showGoToDateDialog)(e), (0, u.globalCloseMenu)()
            }),
            (this._handleRangeSelect = e => {
              e && this.props.onSelectRange && this.props.onSelectRange(e), (0, u.globalCloseMenu)()
            }),
            (this._renderChildren = e => {
              const { ranges: t, activeRange: s, goToDateButton: i } = this.props
              return e
                ? n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(N, { ranges: t, activeRange: s, onSelectRange: this._handleRangeSelect }),
                    i && n.createElement(B, { onGoToDateClick: this._handleGoToDateClick }),
                  )
                : n.createElement(
                    n.Fragment,
                    null,
                    t.map(e =>
                      n.createElement(g.PopupMenuItem, {
                        key: e.value.value,
                        label: e.description || e.text,
                        isActive: s === e.value.value,
                        onClick: this._handleRangeSelect,
                        onClickArg: e,
                      }),
                    ),
                    i && n.createElement(p.PopupMenuSeparator, null),
                    i && n.createElement(g.PopupMenuItem, { label: F.goToDate, onClick: this._handleGoToDateClick }),
                  )
            }),
            (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired })
        }
        render() {
          return n.createElement(m.MatchMedia, { rule: 'screen and (max-width: 428px)' }, e =>
            n.createElement(
              d.ToolWidgetMenu,
              {
                className: W.button,
                content: F.title,
                arrow: !0,
                verticalAttachEdge: h.VerticalAttachEdge.Top,
                verticalDropDirection: h.VerticalDropDirection.FromBottomToTop,
                horizontalMargin: 4,
                'data-name': 'date-ranges-menu',
                isDrawer: e,
                onClick: this._trackClick,
              },
              this._renderChildren(e),
            ),
          )
        }
        _trackClick() {
          0
        }
      }
      z.contextType = P
      const D = E(z)
      var Y = s(64205),
        L = s(22880)
      function I(e) {
        const t = r(e.className, L.item, { [L.isActive]: e.isActive, [L.isFirst]: e.isFirst, [L.isLast]: e.isLast })
        return n.createElement('div', { className: t, onClick: e.onClick, ref: e.reference }, e.children)
      }
      var H = s(40173),
        j = s(72767)
      const Z = (0, H.mergeThemes)(Y.DEFAULT_SLIDER_THEME, j)
      var G = s(38952)
      const q = (0, Y.factory)(function (e) {
        return n.createElement(
          'div',
          { className: r(e.className, Z.slider), ref: e.reference },
          n.createElement('div', { className: Z.inner }),
        )
      })
      const O = E(function (e) {
        const { className: t, ranges: s, activeRange: i, onSelectRange: a } = e
        return n.createElement(
          q,
          { className: r(G.sliderRow, t), 'data-name': 'date-ranges-tabs' },
          s.map((e, t) =>
            n.createElement(
              I,
              {
                key: e.value.value,
                value: e.value.value,
                isFirst: 0 === t,
                isLast: t === s.length - 1,
                isActive: i === e.value.value,
                onClick: a && a.bind(null, e),
              },
              n.createElement('div', { title: e.description || e.text, className: 'apply-common-tooltip' }, e.text),
            ),
          ),
        )
      })
      var U = s(9745),
        V = s(61814),
        J = s(68335),
        K = s(68139),
        Q = s(25033)
      const X = (0, V.hotKeySerialize)({
          keys: [(0, J.humanReadableModifiers)(J.Modifiers.Alt, !1), 'G'],
          text: '{0} + {1}',
        }),
        $ = (0, _.registryContextType)()
      class ee extends n.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._handleClick = () => {
              const { chartWidget: e } = this.context
              ;(0, b.trackEvent)('GUI', 'Chart Bottom Toolbar', 'go to'), (0, R.showGoToDateDialog)(e)
            }),
            (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired })
        }
        render() {
          const { className: e, ranges: t } = this.props
          return (
            t.length > 0 &&
            n.createElement(
              'div',
              {
                className: r('apply-common-tooltip', Q.button, e),
                'data-name': 'go-to-date',
                'data-tooltip-hotkey': X,
                onClick: this._handleClick,
                title: (0, a.t)('Go to'),
              },
              n.createElement(U.Icon, { className: Q.icon, icon: K }),
            )
          )
        }
      }
      ee.contextType = $
      const te = E(ee)
      var se = s(32925)
      function ne(e) {
        const { reference: t, className: s, children: i, ...a } = e
        return n.createElement(
          'button',
          { ...a, className: r(s, se.button), ref: t },
          n.createElement('span', { className: se.inner }, i),
        )
      }
      var ie = s(23095),
        ae = s(64806),
        oe = s(28296),
        re = s(97056)
      class le extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._element = null),
            (this._menuShown = !1),
            (this._preventShowingMenu = !1),
            (this._handleRef = e => {
              this._element = e
            }),
            (this._onMouseDown = () => {
              this._preventShowingMenu = this._menuShown
            }),
            (this._showMenu = () => {
              if (this._preventShowingMenu) return void re.ContextMenuManager.hideAll()
              const { getActions: e } = this.props,
                t = (0, v.ensureNotNull)(this._element),
                s = e()
              if (0 === s.length) return
              const n = t.getBoundingClientRect()
              re.ContextMenuManager.showMenu(
                s,
                { clientX: n.left, clientY: n.top, attachToYBy: 'bottom' },
                void 0,
                { menuName: 'TimezoneMenuContextMenu' },
                () => {
                  this._menuShown = !1
                },
              ).then(() => {
                this._menuShown = !0
              })
            })
        }
        render() {
          const { children: e } = this.props
          return n.createElement(
            'span',
            { onClick: this._showMenu, onMouseDown: this._onMouseDown, ref: this._handleRef },
            e,
          )
        }
      }
      var ce = s(10480),
        de = s(17963)
      const he = { hint: (0, a.t)('Timezone') }
      const ue = (0, _.registryContextType)()
      class me extends n.PureComponent {
        constructor(e, t) {
          super(e, t),
            (this._timeFormatter = new ae.TimeFormatter()),
            (this._tickInterval = void 0),
            (this._tickClock = () => {
              const { chartApiInstance: e } = this.context
              if (void 0 !== this._timezone) {
                const t = (0, ce.utc_to_cal)(this._timezone, e.serverTime())
                this.setState({ time: this._timeFormatter.format(t) })
              }
            }),
            (this._getActions = () => {
              if (!this.props.withMenu) return []
              const { chartWidget: e } = this.context
              return (function (e) {
                e.updateActions()
                const t = e.actions()
                return t && t.applyTimeZone instanceof oe.Action ? t.applyTimeZone.getSubItems() : []
              })(e)
            }),
            (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired, chartApiInstance: o.any.isRequired }),
            (this.state = { time: '' })
        }
        componentDidMount() {
          const { chartWidget: e } = this.context
          ;(this._tickInterval = setInterval(this._tickClock, 1e3)),
            e.withModel(null, () => {
              const t = e.model()
              t.model().mainSeries().dataEvents().symbolResolved().subscribe(this, this.updateTimezonesButton),
                t.model().properties().childs().timezone.subscribe(this, this.updateTimezonesButton)
            })
        }
        componentWillUnmount() {
          const { chartWidget: e } = this.context
          clearInterval(this._tickInterval),
            e.withModel(null, () => {
              const t = e.model()
              t.model().mainSeries().dataEvents().symbolResolved().unsubscribe(this, this.updateTimezonesButton),
                t.model().properties().childs().timezone.unsubscribe(this, this.updateTimezonesButton)
            })
        }
        render() {
          const { className: e, withMenu: t } = this.props,
            { time: s } = this.state,
            i = void 0 !== this._timezone ? (0, ie.parseTzOffset)(this._timezone.name()).string : null
          return n.createElement(
            le,
            { getActions: this._getActions },
            n.createElement(
              ne,
              {
                className: r(e, de.button, 'apply-common-tooltip'),
                title: t ? he.hint : void 0,
                disabled: !t,
                'data-name': 'time-zone-menu',
              },
              s && i && `${s} (${i})`,
            ),
          )
        }
        updateTimezonesButton() {
          const { chartWidget: e } = this.context
          if (!e.hasModel()) return
          if (null === e.model().mainSeries().symbolInfo()) return
          let t = e.model().model().timezone()
          if ('exchange' === t) {
            const s = (0, v.ensureNotNull)(e.model().mainSeries().symbolInfo()).timezone
            s && (t = s)
          }
          ;(this._timezone = (0, ce.get_timezone)(t)), this._tickClock()
        }
      }
      me.contextType = ue
      var ge = s(71922)
      function pe(e) {
        return n.createElement('span', { className: r(ge.separator, e.className) })
      }
      var ve = s(4825),
        be = s(24980),
        _e = s(49483)
      class Ce {
        constructor(e, t, s) {
          ;(this._highlighted = !1),
            (this._chartWidget = e),
            (this._priceScaleGetter = t),
            (this._owner = s),
            (this._setHighlight = this._setHighlight.bind(this)),
            (this._removeHighlight = this._removeHighlight.bind(this))
        }
        destroy() {
          this._highlighted && this._removeHighlight()
        }
        handlers() {
          const e = _e.CheckMobile.any()
          return { onMouseEnter: e ? void 0 : this._setHighlight, onMouseLeave: e ? void 0 : this._removeHighlight }
        }
        _setHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries()),
            s = this._priceScaleGetter()
          if (null === t || null === s) return
          const n = this._chartWidget.paneByState(t)
          if (null !== n) {
            const t = n.rightPriceAxisesContainer().findAxisWidgetForScale(s)
            let i = null
            null !== t && (i = t.axisInfo())
            const a = n.leftPriceAxisesContainer().findAxisWidgetForScale(s)
            null !== a && (i = a.axisInfo())
            const o = n.highlightedPriceAxis()
            null !== i &&
              o.value().axis !== i &&
              (o.setValue({ owner: this._owner, axis: i }), e.lightUpdate(), (this._highlighted = !0))
          }
        }
        _removeHighlight() {
          if (!this._chartWidget.hasModel()) return
          const e = this._chartWidget.model().model(),
            t = e.paneForSource(e.mainSeries())
          if (null === t) return
          const s = this._chartWidget.paneByState(t)
          if (null !== s) {
            const t = s.highlightedPriceAxis(),
              n = t.value()
            null !== n.axis &&
              n.owner === this._owner &&
              (t.setValue({ owner: this._owner, axis: null }), e.lightUpdate(), (this._highlighted = !1))
          }
        }
      }
      const Se = (0, _.registryContextType)(),
        fe = new be.TranslatedString('toggle log scale', (0, a.t)('toggle log scale'))
      const ye = (0, _.registryContextType)(),
        xe = new be.TranslatedString('toggle auto scale', (0, a.t)('toggle auto scale'))
      const Ee = (0, _.registryContextType)(),
        Me = new be.TranslatedString('toggle percentage scale', (0, a.t)('toggle percentage scale'))
      const Re = (0, _.registryContextType)()
      var ke = s(42142),
        we = s(54475),
        Te = s(49466),
        Ae = s(56450),
        We = s(70439)
      const Ne = new be.TranslatedString('change session', (0, a.t)('change session')),
        Be = { hint: (0, a.t)('Session'), headerMenuText: (0, a.t)('Sessions') },
        Fe = (0, _.registryContextType)()
      class Pe extends n.PureComponent {
        constructor(e, t) {
          super(e, t),
            (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired, chartApiInstance: o.any.isRequired }),
            (this.state = { availableSessions: [] })
        }
        componentDidMount() {
          const { chartWidget: e } = this.context
          e.withModel(null, () => {
            const t = e.model()
            t.model().mainSeries().dataEvents().symbolResolved().subscribe(this, this.updateSessionButton),
              t.model().mainSeries().properties().childs().sessionId.subscribe(this, this.updateSessionButton),
              this.updateSessionButton()
          })
        }
        componentWillUnmount() {
          const { chartWidget: e } = this.context
          e.withModel(null, () => {
            const t = e.model()
            t.model().mainSeries().dataEvents().symbolResolved().unsubscribe(this, this.updateSessionButton),
              t.model().mainSeries().properties().childs().sessionId.unsubscribe(this, this.updateSessionButton)
          })
        }
        render() {
          const { className: e, withMenu: t } = this.props,
            { sessionName: s } = this.state
          return n.createElement(
            d.ToolWidgetMenu,
            {
              arrow: !1,
              isDisabled: !t,
              content: s,
              className: e,
              closeOnClickOutside: !0,
              title: t ? Be.hint : void 0,
              'data-name': 'session-menu',
              verticalDropDirection: h.VerticalDropDirection.FromBottomToTop,
              verticalAttachEdge: h.VerticalAttachEdge.Top,
              onClick: this._trackClick,
            },
            this._menuItems(),
          )
        }
        updateSessionButton() {
          var e, t
          const { chartWidget: s } = this.context
          if (!s.model()) return
          const n = s.model().mainSeries().symbolInfo()
          if (null === n) return
          const i = n.subsession_id,
            a =
              null !== (t = null === (e = n.subsessions) || void 0 === e ? void 0 : e.filter(e => !e.private)) &&
              void 0 !== t
                ? t
                : [],
            o = a.find(e => e.id === i)
          this.setState({
            sessionId: i,
            sessionName: (0, Ae.translateSessionShortDescription)((null == o ? void 0 : o.description) || ''),
            availableSessions: a,
          })
        }
        _menuItems() {
          if (!this.props.withMenu) return []
          const { chartWidget: e } = this.context,
            { availableSessions: t } = this.state
          if (!e.model()) return []
          const s = e.model().mainSeries(),
            i = [
              n.createElement(
                Te.ToolWidgetMenuSummary,
                { key: 'header_menu_text', className: We.headerMenuText },
                Be.headerMenuText.toUpperCase(),
              ),
            ]
          for (const a of t) {
            const t = { category: 'SetSession', event: a.id },
              o = () => {
                e.model().setProperty(s.properties().childs().sessionId, a.id, Ne)
              }
            i.push(
              n.createElement(g.PopupMenuItem, {
                key: a.id,
                label: (0, Ae.translateSessionDescription)(a.description),
                isActive: this.state.sessionId === a.id,
                trackEventObject: t,
                onClick: o,
              }),
            )
          }
          return i
        }
        _trackClick() {
          0
        }
      }
      Pe.contextType = Fe
      var ze = s(99499),
        De = s(11178),
        Ye = s(43527)
      const Le = {
          extLabel: (0, a.t)('ext'),
          extHint: (0, a.t)('Extended Hours is available only for intraday charts'),
          percentageHint: (0, a.t)('Toggle Percentage'),
          logLabel: (0, a.t)('log', { context: 'scale' }),
          logHint: (0, a.t)('Toggle Log Scale'),
          autoLabel: (0, a.t)('auto', { context: 'scale' }),
          autoHint: (0, a.t)('Toggle Auto Scale'),
          fullscreenHint: (0, a.t)('Toggle Maximize Chart'),
          adjLabel: (0, a.t)('adj', { context: 'adjustments' }),
          adjHint: (0, a.t)('Adjust data for dividends'),
          adjForDividendsOnlyHint: (0, a.t)('Main symbol data is adjusted for dividends only'),
          adjForSplitsOnlyHint: (0, a.t)('Main symbol data is adjusted for splits only'),
          backAdjustLabel: (0, a.t)('b-adj', { context: 'adjustments' }),
          backAdjustHint: (0, a.t)('Adjust for contract changes'),
          settlementAsCloseLabel: (0, a.t)('set', { context: 'adjustments' }),
          settlementAsCloseHint: (0, a.t)('Use settlement as close on daily interval'),
        },
        Ie =
          ((He = e =>
            n.createElement(ve.ToolWidgetButton, {
              text: Le.logLabel,
              title: Le.logHint,
              className: e.className,
              isActive: e.isLogarithm,
              isGrouped: !0,
              onClick: Qe(e.onClick, 'log', e.isLogarithm),
              onMouseEnter: e.onMouseEnter,
              onMouseLeave: e.onMouseLeave,
              'data-name': 'logarithm',
            })),
          ((je = class extends n.PureComponent {
            constructor(e, t) {
              super(e, t),
                (this._priceScale = null),
                (this._handleSelect = () => {
                  const e = this.context.chartWidget.model(),
                    t = (0, v.ensureNotNull)(this.state.series),
                    s = t.priceScale(),
                    n = s.mode()
                  t.priceScale().isLockScale() || e.setPriceScaleMode({ log: !n.log }, s, fe)
                }),
                (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired }),
                (this.state = { isActive: !1, series: null }),
                (this._priceAxisHighlighter = new Ce(this.context.chartWidget, () => this._priceScale, 'logarithm'))
            }
            componentDidMount() {
              const e = this.context.chartWidget
              e.withModel(null, () => {
                const t = e.model().mainSeries(),
                  s = t.priceScale()
                this._handleMainSeriesPriceScaleChanged(s),
                  t.priceScaleChanged().subscribe(this, this._handleMainSeriesPriceScaleChanged),
                  this._handleModeChanged({}, s.mode()),
                  this.setState({ isActive: t.priceScale().isLog(), series: t })
              })
            }
            componentWillUnmount() {
              const e = this.context.chartWidget
              e.withModel(null, () => {
                e.model().mainSeries().priceScaleChanged().unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
              }),
                null !== this._priceScale &&
                  (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null)),
                this._priceAxisHighlighter.destroy()
            }
            render() {
              const { className: e } = this.props,
                { isActive: t, series: s } = this.state
              return n.createElement(He, {
                ...this._priceAxisHighlighter.handlers(),
                className: e,
                isLogarithm: t,
                isDisabled: null === s,
                onClick: this._handleSelect,
              })
            }
            _handleMainSeriesPriceScaleChanged(e) {
              null !== this._priceScale && this._priceScale.modeChanged().unsubscribe(this, this._handleModeChanged),
                (this._priceScale = e),
                this._priceScale.modeChanged().subscribe(this, this._handleModeChanged),
                this._handleModeChanged({}, e.mode())
            }
            _handleModeChanged(e, t) {
              Boolean(t.log) !== this.state.isActive && this.setState({ isActive: Boolean(t.log) })
            }
          }).contextType = Se),
          je)
      var He, je
      const Ze = (function (e) {
          var t
          return (
            ((t = class extends n.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series).priceScale(),
                      s = t.mode()
                    e.setPriceScaleMode({ autoScale: !s.autoScale }, t, xe)
                  }),
                  (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new Ce(this.context.chartWidget, () => this._priceScale, 'auto'))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    s = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(s),
                    t.priceScaleChanged().subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleModeChanged({}, s.mode()),
                    this.setState({ isActive: t.priceScale().isAutoScale(), series: t })
                })
              }
              componentWillUnmount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  e.model().mainSeries().priceScaleChanged().unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
                }),
                  null !== this._priceScale &&
                    (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null)),
                  this._priceAxisHighlighter.destroy()
              }
              render() {
                const { className: t } = this.props,
                  { isActive: s, series: i } = this.state
                return n.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isAuto: s,
                  isDisabled: null === i,
                  onClick: this._handleSelect,
                })
              }
              _handleMainSeriesPriceScaleChanged(e) {
                null !== this._priceScale && this._priceScale.modeChanged().unsubscribe(this, this._handleModeChanged),
                  (this._priceScale = e),
                  this._priceScale.modeChanged().subscribe(this, this._handleModeChanged),
                  this._handleModeChanged({}, e.mode())
              }
              _handleModeChanged(e, t) {
                Boolean(t.autoScale) !== this.state.isActive && this.setState({ isActive: Boolean(t.autoScale) })
              }
            }).contextType = ye),
            t
          )
        })(e =>
          n.createElement(ve.ToolWidgetButton, {
            text: Le.autoLabel,
            title: Le.autoHint,
            className: e.className,
            isActive: e.isAuto,
            isGrouped: !0,
            onClick: Qe(e.onClick, 'auto', e.isAuto),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'auto',
          }),
        ),
        Ge = (function (e) {
          var t
          return (
            ((t = class extends n.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._priceScale = null),
                  (this._handleSelect = () => {
                    const e = this.context.chartWidget.model(),
                      t = (0, v.ensureNotNull)(this.state.series),
                      s = t.priceScale(),
                      n = s.mode()
                    t.priceScale().isLockScale() || e.setPriceScaleMode({ percentage: !n.percentage }, s, Me)
                  }),
                  (0, _.validateRegistry)(t, { chartWidget: o.any.isRequired }),
                  (this.state = { isActive: !1, series: null }),
                  (this._priceAxisHighlighter = new Ce(this.context.chartWidget, () => this._priceScale, 'percentage'))
              }
              componentDidMount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  const t = e.model().mainSeries(),
                    s = t.priceScale()
                  this._handleMainSeriesPriceScaleChanged(s),
                    t.priceScaleChanged().subscribe(this, this._handleMainSeriesPriceScaleChanged),
                    this._handleScaleChange({}, s.mode()),
                    this.setState({ isActive: t.priceScale().isPercentage(), series: t })
                })
              }
              componentWillUnmount() {
                const e = this.context.chartWidget
                e.withModel(null, () => {
                  e.model().mainSeries().priceScaleChanged().unsubscribe(this, this._handleMainSeriesPriceScaleChanged)
                }),
                  null !== this._priceScale &&
                    (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null)),
                  this._priceAxisHighlighter.destroy()
              }
              render() {
                const { className: t } = this.props,
                  { isActive: s, series: i } = this.state
                return n.createElement(e, {
                  ...this._priceAxisHighlighter.handlers(),
                  className: t,
                  isPercentage: s,
                  isDisabled: null === i,
                  onClick: this._handleSelect,
                })
              }
              _handleMainSeriesPriceScaleChanged(e) {
                null !== this._priceScale && this._priceScale.modeChanged().unsubscribe(this, this._handleScaleChange),
                  (this._priceScale = e),
                  this._priceScale.modeChanged().subscribe(this, this._handleScaleChange),
                  this._handleScaleChange({}, e.mode())
              }
              _handleScaleChange(e, t) {
                Boolean(t.percentage) !== this.state.isActive && this.setState({ isActive: Boolean(t.percentage) })
              }
            }).contextType = Ee),
            t
          )
        })(e =>
          n.createElement(ve.ToolWidgetButton, {
            icon: ze,
            title: Le.percentageHint,
            className: e.className,
            isActive: e.isPercentage,
            isDisabled: e.isDisabled,
            isGrouped: !0,
            onClick: Qe(e.onClick, 'percent', e.isPercentage),
            onMouseEnter: e.onMouseEnter,
            onMouseLeave: e.onMouseLeave,
            'data-name': 'percentage',
          }),
        )
      const qe = (0, V.hotKeySerialize)({
          keys: [(0, J.humanReadableModifiers)(J.Modifiers.Alt, !1), 'Enter'],
          text: '{0} + {1}',
        }),
        Oe = (function (e) {
          var t
          return (
            ((t = class extends n.PureComponent {
              constructor(e, t) {
                super(e, t),
                  (this._handleClick = e => {
                    const { resizerDetacher: t, chartWidgetCollection: s } = this.context
                    e.shiftKey && t.detachable.value()
                      ? t.detach()
                      : this.state.isFullscreen
                      ? t.exitFullscreen()
                      : t.requestFullscreen()
                  }),
                  (this._handleLayoutChange = e => {
                    this.setState({ isFullscreen: e })
                  }),
                  (this._handlePhoneSize = () => {
                    0
                  }),
                  (0, _.validateRegistry)(t, {
                    chartWidgetCollection: o.any.isRequired,
                    resizerDetacher: o.any.isRequired,
                  })
                const { resizerDetacher: s } = t
                this.state = { isFullscreen: s.fullscreen.value(), isChangeLayoutButton: this._isChangeLayoutButton() }
              }
              componentDidMount() {
                const { resizerDetacher: e, chartWidgetCollection: t } = this.context,
                  { mobileChangeLayoutEnabled: s } = this.props
                e.fullscreen.subscribe(this._handleLayoutChange)
              }
              componentWillUnmount() {
                const { resizerDetacher: e, chartWidgetCollection: t } = this.context,
                  { mobileChangeLayoutEnabled: s } = this.props
                e.fullscreen.unsubscribe(this._handleLayoutChange)
              }
              render() {
                const { className: t } = this.props,
                  { isFullscreen: s, isChangeLayoutButton: i } = this.state
                return n.createElement(e, { className: t, isFullscreen: s, onClick: this._handleClick })
              }
              _isChangeLayoutButton() {
                return !1
              }
            }).contextType = Re),
            t
          )
        })(e =>
          n.createElement(ve.ToolWidgetButton, {
            icon: De,
            title: Le.fullscreenHint,
            className: e.className,
            isActive: e.isFullscreen,
            onClick: Qe(e.onClick, 'maximize chart', e.isFullscreen),
            'data-tooltip-hotkey': qe,
            'data-name': 'fullscreen',
          }),
        ),
        Ue = { properties: !0, fullscreen: !0, preventPhoneLayout: !0 },
        Ve = {
          fullscreen: Number.MIN_SAFE_INTEGER,
          preventPhoneLayout: Number.MIN_SAFE_INTEGER,
          properties: Number.MIN_SAFE_INTEGER,
          separator: -2,
          timeZones: -1,
          auto: 0,
          logarithm: 1,
          percentage: 2,
          session: 3,
          adj: 4,
          backAdj: 5,
          settlementAsClose: 6,
        },
        Je = (() => {
          const e = new Map()
          return (
            e.set(Ie, 'logarithm'),
            e.set(Ge, 'percentage'),
            e.set(Ze, 'auto'),
            e.set(Pe, 'session'),
            e.set(Oe, 'fullscreen'),
            e
          )
        })()
      function Ke(e) {
        0
      }
      function Qe(e, t, s) {
        return t => {
          e(t)
        }
      }
      const Xe = {
          dateRangeMode: 'hidden',
          separator: !0,
          timeZones: !0,
          fullscreen: !0,
          preventPhoneLayout: !0,
          properties: !0,
          auto: !0,
          logarithm: !0,
          percentage: !0,
          session: !0,
          adj: !0,
          backAdj: !0,
          settlementAsClose: !0,
        },
        $e = (0, _.registryContextType)()
      class et extends n.PureComponent {
        constructor(e, t) {
          var s, a
          super(e, t),
            (this._timezoneButtonRef = null),
            (this._layout = Object.assign({}, Xe)),
            (this._raf = null),
            (this._toolbar = null),
            (this._rangeExpanded = null),
            (this._rangeCollapsed = null),
            (this._seriesComponents = {}),
            (this._injector =
              ((s = () => this._layout),
              (a = (e, t) => (this._seriesComponents[t] = e)),
              (e, t, i) => {
                if (n.isValidElement(e) && 'string' != typeof e.type) {
                  const { props: o } = e
                  if ('string' == typeof o.className) {
                    const l = { className: r(o.className, 0 === t && Ye.first, t === i.length - 1 && Ye.last) },
                      c = s(),
                      d = (0, v.ensureDefined)(Je.get(e.type))
                    return n.createElement(
                      'div',
                      {
                        key: null === e.key ? void 0 : e.key,
                        className: r(Ye.inline, c[d] && Ye.collapsed),
                        ref: e => a(e, d),
                        onClick: () => Ke(),
                      },
                      n.cloneElement(e, l),
                    )
                  }
                }
                return e
              })),
            (this._updateButtonsVisibility = () => {
              const { chartWidget: e } = this.context,
                t = e.model().model(),
                s = t.mainSeries(),
                n = s.symbolInfo(),
                i = !s.isDWMProperty().value()
              if (s.symbolResolvingActive().value())
                return void this._setStateWithResize({ intervalAllowsSessionButton: i })
              const a = ((null == n ? void 0 : n.subsessions) || []).filter(e => !e.private).length > 1
              this._setStateWithResize({ intervalAllowsSessionButton: i, symbolAllowsSessionButton: a })
            }),
            (this._handleResize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  const e = this._layout,
                    t = (0, v.ensureNotNull)(this._toolbar),
                    s = (0, v.ensureNotNull)(this._rangeExpanded),
                    n =
                      ((a = (function (e) {
                        const t = {}
                        return (
                          Object.keys(e).forEach(s => {
                            const n = e[s]
                            if (null !== n) {
                              const e = i.findDOMNode(n)
                              null !== e && (t[s] = e)
                            }
                          }),
                          t
                        )
                      })(this._seriesComponents)),
                      Object.keys(a)
                        .map(e => ({ name: e, width: a[e].offsetWidth }))
                        .sort((e, t) => Ve[e.name] - Ve[t.name]))
                  var a
                  const o = t.offsetWidth,
                    r = n.reduce((e, t) => e + t.width, 0),
                    l = s.offsetWidth,
                    c = !Boolean(s.textContent) || o - r - l <= 0 ? 'collapsed' : 'expanded'
                  if ((Object.assign(e, { dateRangeMode: c }), 'expanded' !== c)) {
                    const t = o - (0, v.ensureNotNull)(this._rangeCollapsed).offsetWidth - 0
                    let s = 0,
                      i = 0
                    for (const a of n)
                      (s += a.width),
                        a.name in Ue
                          ? ((i += a.width), Object.assign(e, { [a.name]: !1 }))
                          : Object.assign(e, { [a.name]: t <= s })
                    t <= i && Object.assign(e, { dateRangeMode: 'hidden' })
                  } else
                    Object.assign(e, {
                      separator: !1,
                      timeZones: !1,
                      fullscreen: !1,
                      preventPhoneLayout: !1,
                      properties: !1,
                      auto: !1,
                      logarithm: !1,
                      percentage: !1,
                      session: !1,
                      adj: !1,
                      settlementAsClose: !1,
                      backAdj: !1,
                    })
                  this._applyResizing(), (this._raf = null)
                }))
            }),
            (this._handleTimezoneButtonRef = e => {
              this._timezoneButtonRef = e
            }),
            (this._handleMeasure = () => {
              null !== this._toolbar && this.resizeUI()
            }),
            (this._handleFullscreenableChange = e => {
              this._setStateWithResize({ isFullscreenable: e })
            }),
            (this._handlePreventPhoneLayoutButtonVisibility = () => {
              0
            }),
            (this._handleToolbarRef = e => (this._toolbar = e)),
            (this._handleRangeCollapsedRef = e => (this._rangeCollapsed = e)),
            (this._handleRangeExpandedRef = e => (this._rangeExpanded = e)),
            (this._handleTimeZonesRef = e => {
              this._seriesComponents.timeZones = e
            }),
            (this._handleSessionsRef = e => {
              this._seriesComponents.session = e
            }),
            (this._handleSeparatorRef = e => {
              this._seriesComponents.separator = e
            }),
            (0, _.validateRegistry)(t, {
              onContentBoxChanged: o.any.isRequired,
              chartApiInstance: o.any.isRequired,
              chartWidget: o.any.isRequired,
              chartWidgetCollection: o.any.isRequired,
              resizerDetacher: o.any.isRequired,
            })
          const { resizerDetacher: l } = this.context
          this.state = {
            isFullscreenable: l.fullscreenable.value(),
            isPreventPhoneLayoutButton: this._isPreventPhoneLayoutButton(),
          }
        }
        componentDidMount() {
          const { onContentBoxChanged: e, resizerDetacher: t, chartWidgetCollection: s, chartWidget: n } = this.context
          e.subscribe(this, this._handleResize),
            t.fullscreenable.subscribe(this._handleFullscreenableChange),
            n.withModel(null, () => {
              const e = n.model(),
                t = e.model()
              e.mainSeries().isDWMProperty().subscribe(this, this._updateButtonsVisibility),
                t.symbolSourceResolvingActive().subscribe(this._updateButtonsVisibility),
                t.symbolSourceCollectionChanged().subscribe(this, this._updateButtonsVisibility),
                this._updateButtonsVisibility()
            }),
            this.updateTimezonesButton(),
            this.resizeUI()
        }
        componentWillUnmount() {
          const { onContentBoxChanged: e, resizerDetacher: t, chartWidgetCollection: s, chartWidget: n } = this.context
          e.unsubscribe(this, this._handleResize),
            t.fullscreenable.unsubscribe(this._handleFullscreenableChange),
            n.withModel(null, () => {
              const e = n.model(),
                t = e.model()
              e.mainSeries().isDWMProperty().unsubscribe(this, this._updateButtonsVisibility),
                e.mainSeries().isBackAdjustmentForbiddenProperty().unsubscribe(this, this._updateButtonsVisibility),
                e.mainSeries().isSettlementAsCloseForbiddenProperty().unsubscribe(this, this._updateButtonsVisibility),
                t.symbolSourceCollectionChanged().unsubscribe(this, this._updateButtonsVisibility),
                t.symbolSourceResolvingActive().unsubscribe(this._updateButtonsVisibility)
            }),
            null !== this._raf && (cancelAnimationFrame(this._raf), (this._raf = null))
        }
        render() {
          const e = this._layout,
            {
              timeFramesWidgetEnabled: t,
              timeWidgetEnabled: s,
              percentageScaleButtonEnabled: i,
              logScaleButtonEnabled: a,
              autoScaleButtonEnabled: o,
              fullscreenButtonEnabled: d,
            } = this.props
          return n.createElement(
            'div',
            { className: Ye.toolbar, ref: this._handleToolbarRef, onContextMenu: we.preventDefault },
            t &&
              n.createElement(
                ke.FragmentMap,
                null,
                n.createElement(
                  'div',
                  {
                    className: r(Ye.dateRangeWrapper, 'collapsed' !== e.dateRangeMode && Ye.collapsed),
                    ref: this._handleRangeCollapsedRef,
                  },
                  n.createElement(
                    'div',
                    { className: r(Ye.dateRangeCollapsed) },
                    n.createElement(D, { goToDateButton: this.props.goToDateEnabled }),
                  ),
                ),
                n.createElement(
                  l,
                  { onMeasure: this._handleMeasure },
                  n.createElement(
                    'div',
                    {
                      className: r(Ye.dateRangeWrapper, 'expanded' !== e.dateRangeMode && Ye.collapsed),
                      ref: this._handleRangeExpandedRef,
                    },
                    n.createElement(
                      'div',
                      { className: r(Ye.dateRangeExpanded) },
                      n.createElement(O, { onSelectRange: this._trackRangeButtonClick }),
                      this.props.goToDateEnabled && n.createElement(pe, null),
                      this.props.goToDateEnabled && n.createElement(te, null),
                    ),
                  ),
                ),
              ),
            n.createElement(
              'div',
              { className: Ye.seriesControlWrapper },
              s &&
                n.createElement(
                  l,
                  { onMeasure: this._handleMeasure },
                  n.createElement(
                    'div',
                    { className: r(Ye.inline, e.timeZones && Ye.collapsed), ref: this._handleTimeZonesRef },
                    n.createElement(
                      'div',
                      { className: Ye.inline, onClick: this._trackTimezonesButtonClick },
                      n.createElement(me, {
                        className: Ye.timezone,
                        withMenu: this.props.timezoneMenuEnabled,
                        ref: this._handleTimezoneButtonRef,
                      }),
                    ),
                  ),
                ),
              this.props.sessionIdButtonEnabled &&
                this.state.symbolAllowsSessionButton &&
                this.state.intervalAllowsSessionButton &&
                n.createElement(
                  l,
                  { onMeasure: this._handleMeasure },
                  n.createElement(
                    'div',
                    { className: r(Ye.inline, e.session && Ye.collapsed), ref: this._handleSessionsRef },
                    n.createElement(
                      'div',
                      { className: Ye.inline },
                      n.createElement(Pe, { className: Ye.session, withMenu: this.props.sessionIdButtonEnabled }),
                    ),
                  ),
                ),
              n.createElement(
                'div',
                { ref: this._handleSeparatorRef, className: r(Ye.inline, e.separator && Ye.collapsed) },
                n.createElement(pe, null),
              ),
              n.createElement(
                ke.FragmentMap,
                { map: this._injector },
                !1,
                !1,
                !1,
                i && !c.enabled('fundamental_widget') && n.createElement(Ge, { className: Ye.icon }),
                a && n.createElement(Ie, { className: Ye.item }),
                o && n.createElement(Ze, { className: Ye.item }),
                d &&
                  this.state.isFullscreenable &&
                  n.createElement(Oe, {
                    className: Ye.icon,
                    mobileChangeLayoutEnabled: this.props.mobileChangeLayoutEnabled,
                  }),
                !1,
              ),
            ),
          )
        }
        updateTimezonesButton() {
          null !== this._timezoneButtonRef && this._timezoneButtonRef.updateTimezonesButton()
        }
        resizeUI() {
          this._handleResize()
        }
        _trackRangeButtonClick(e) {
          0
        }
        _trackTimezonesButtonClick() {
          Ke()
        }
        _setStateWithResize(e) {
          Object.assign(this._layout, Xe), this._applyResizing(), this.setState(e, () => this._handleResize())
        }
        _applyResizing() {
          const { dateRangeMode: e, ...t } = this._layout
          this._rangeExpanded && this._rangeExpanded.classList.toggle(Ye.collapsed, 'expanded' !== e),
            this._rangeCollapsed && this._rangeCollapsed.classList.toggle(Ye.collapsed, 'collapsed' !== e),
            Object.keys(t).forEach(e => {
              const s = e,
                n = this._seriesComponents[s]
              n && n.classList.toggle(Ye.collapsed, t[s])
            })
        }
        _isPreventPhoneLayoutButton() {
          return !1
        }
      }
      et.contextType = $e
      const tt = {
        onContentBoxChanged: o.any,
        computeContentBox: o.any,
        chartWidget: o.any,
        chartApiInstance: o.any,
        chartWidgetCollection: o.any,
        resizerDetacher: o.any,
        availableTimeFrames: o.any,
      }
      class st extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._setActiveChart = e => {
              this._defineRegistry(e), this.setState({ chartWidget: e })
            })
          const t = this.props.chartWidgetCollection.activeChartWidget.value()
          ;(this.state = { chartWidget: t }), this._defineRegistry(t)
        }
        componentDidMount() {
          this.props.chartWidgetCollection.activeChartWidget.subscribe(this._setActiveChart)
        }
        componentWillUnmount() {
          this.props.chartWidgetCollection.activeChartWidget.unsubscribe(this._setActiveChart)
        }
        render() {
          const { chartWidget: e } = this.state
          if (!e) return null
          const { options: t } = this.props,
            s = {
              timeFramesWidgetEnabled: t.timeFramesWidgetEnabled,
              goToDateEnabled: t.timeFramesWidget.goToDateEnabled,
              timeWidgetEnabled: t.timeWidgetEnabled,
              timezoneMenuEnabled: t.timeWidget && t.timeWidget.timezoneMenuEnabled,
              sessionIdButtonEnabled: t.sessionIdButtonEnabled,
              backAdjustmentButtonEnabled: t.backAdjustmentButtonEnabled,
              settlementAsCloseButtonEnabled: t.settlementAsCloseButtonEnabled,
              adjustForDividendsButtonEnabled: t.adjustForDividendsButtonEnabled,
              logScaleButtonEnabled: t.logScaleButtonEnabled,
              percentageScaleButtonEnabled: t.percentageScaleButtonEnabled,
              autoScaleButtonEnabled: t.autoScaleButtonEnabled,
              fullscreenButtonEnabled: t.fullscreenButtonEnabled,
              mobileChangeLayoutEnabled: t.mobileChangeLayoutEnabled,
            }
          return n.createElement(
            _.RegistryProvider,
            { validation: tt, value: this._registry },
            n.createElement(et, { key: e.id(), ...s }),
          )
        }
        _defineRegistry(e) {
          const {
              onContentBoxChanged: t,
              computeContentBox: s,
              chartApiInstance: n,
              chartWidgetCollection: i,
              options: { timeFramesWidgetEnabled: a, timeFramesWidget: o },
            } = this.props,
            r = a ? o.availableTimeFrames : void 0
          this._registry = {
            onContentBoxChanged: t,
            computeContentBox: s,
            chartWidget: e,
            availableTimeFrames: r,
            chartApiInstance: n,
            chartWidgetCollection: i,
            resizerDetacher: e.getResizerDetacher(),
          }
        }
      }
      class nt {
        constructor(e, t, s, a, o, r, l) {
          this._container = e
          const c = n.createElement(st, {
            onContentBoxChanged: t,
            computeContentBox: s,
            chartWidgetCollection: a,
            chartApiInstance: o,
            chartWidgetOptions: r,
            options: l,
          })
          i.render(c, e), e.setAttribute('data-initialized', 'true')
        }
        destroy() {
          i.unmountComponentAtNode(this._container), this._container.removeAttribute('data-initialized')
        }
      }
    },
    55402: (e, t, s) => {
      'use strict'
      s.d(t, { validateRegistry: () => r, RegistryProvider: () => l, registryContextType: () => c })
      var n = s(59496),
        i = s(19036),
        a = s.n(i)
      const o = n.createContext({})
      function r(e, t) {
        a().checkPropTypes(t, e, 'context', 'RegistryContext')
      }
      function l(e) {
        const { validation: t, value: s } = e
        return r(s, t), n.createElement(o.Provider, { value: s }, e.children)
      }
      function c() {
        return o
      }
    },
    56450: (e, t, s) => {
      'use strict'
      s.d(t, { translateSessionDescription: () => a, translateSessionShortDescription: () => r })
      var n = s(28353)
      const i = new Map([
        ['Premarket', (0, n.t)('Premarket', { context: 'sessions' })],
        ['Postmarket', (0, n.t)('Postmarket', { context: 'sessions' })],
        ['Regular Trading Hours', (0, n.t)('Regular trading hours', { context: 'sessions' })],
        ['Extended Trading Hours', (0, n.t)('Extended trading hours', { context: 'sessions' })],
        ['Electronic Trading Hours', (0, n.t)('Electronic trading hours', { context: 'sessions' })],
      ])
      function a(e) {
        var t
        return null !== (t = i.get(e)) && void 0 !== t ? t : e
      }
      const o = new Map([
        ['Premarket', (0, n.t)('PRE', { context: 'sessions' })],
        ['Postmarket', (0, n.t)('POST', { context: 'sessions' })],
        ['Regular Trading Hours', (0, n.t)('RTH', { context: 'sessions' })],
        ['Extended Trading Hours', (0, n.t)('ETH', { context: 'sessions' })],
        ['Electronic Trading Hours', (0, n.t)('ETH', { context: 'sessions' })],
      ])
      function r(e) {
        var t
        return null !== (t = o.get(e)) && void 0 !== t ? t : e
      }
    },
    42142: (e, t, s) => {
      'use strict'
      s.d(t, { FragmentMap: () => i })
      var n = s(59496)
      function i(e) {
        if (e.map) {
          return n.Children.toArray(e.children).map(e.map)
        }
        return e.children
      }
    },
    99025: (e, t, s) => {
      'use strict'
      s.d(t, { Hint: () => r })
      var n = s(59496),
        i = s(97754),
        a = s.n(i),
        o = s(19119)
      function r(e) {
        const { text: t = '', className: s } = e
        return n.createElement('span', { className: a()(o.shortcut, s) }, t)
      }
    },
    23829: (e, t, s) => {
      'use strict'
      s.d(t, { ContextMenuItem: () => g })
      var n = s(59496),
        i = s(97754),
        a = s.n(i),
        o = s(9745),
        r = s(26996),
        l = s(54627),
        c = s(99025),
        d = s(86440),
        h = s(4585),
        u = s(74471),
        m = s(61999)
      function g(e) {
        const {
            isTitle: t,
            isLoading: s,
            isHovered: i,
            active: g,
            checkable: p,
            disabled: v,
            checked: b,
            icon: _,
            iconChecked: C,
            hint: S,
            subItems: f,
            label: y,
            onClick: x,
            children: E,
            toolbox: M,
            jsxLabel: R,
            size: k = 'normal',
          } = e,
          w = (0, n.useContext)(l.EmptyIconsContext),
          T = !!f.length
        return s
          ? n.createElement('li', { className: a()(m.item, m.loading, m[k]) }, n.createElement(r.Loader, null))
          : n.createElement(
              'li',
              {
                className: a()(
                  m.item,
                  m.interactive,
                  t && m.title,
                  v && m.disabled,
                  i && m.hovered,
                  g && m.active,
                  w && m.emptyIcons,
                  m[k],
                ),
                onClick: x,
              },
              n.createElement(o.Icon, {
                className: a()(m.icon),
                icon: (function () {
                  if (p && b) return C || _ || d
                  return _
                })(),
              }),
              n.createElement('span', { className: a()(m.label) }, null != R ? R : y),
              !!M &&
                n.createElement(o.Icon, {
                  onClick: function () {
                    M && M.action()
                  },
                  className: m.remove,
                  icon: u,
                }),
              !T && S && n.createElement(c.Hint, { className: m.shortcut, text: S }),
              T && n.createElement(o.Icon, { className: m.nested, icon: h }),
              E,
            )
      }
    },
    54627: (e, t, s) => {
      'use strict'
      s.d(t, { EmptyIconsContext: () => n })
      const n = s(59496).createContext(!1)
    },
    1109: (e, t, s) => {
      'use strict'
      s.d(t, { Separator: () => o })
      var n = s(59496),
        i = s(97754),
        a = s(91626)
      function o(e) {
        return n.createElement('div', { className: i(a.separator, e.className) })
      }
    },
    51613: (e, t, s) => {
      'use strict'
      s.d(t, { PopupMenuSeparator: () => r })
      var n = s(59496),
        i = s(97754),
        a = s.n(i),
        o = s(524)
      function r(e) {
        const { size: t = 'normal', className: s } = e
        return n.createElement('div', {
          className: a()(
            o.separator,
            'small' === t && o.small,
            'normal' === t && o.normal,
            'large' === t && o.large,
            s,
          ),
        })
      }
    },
    64205: (e, t, s) => {
      'use strict'
      s.d(t, { DEFAULT_SLIDER_THEME: () => r, SliderItem: () => l, factory: () => c })
      var n = s(59496),
        i = s(97754),
        a = s(88537),
        o = s(37740)
      const r = o
      function l(e) {
        const t = i(e.className, o.tab, {
          [o.active]: e.isActive,
          [o.disabled]: e.isDisabled,
          [o.defaultCursor]: !!e.shouldUseDefaultCursor,
          [o.noBorder]: !!e.noBorder,
        })
        return n.createElement(
          'div',
          {
            className: t,
            onClick: e.onClick,
            ref: e.reference,
            'data-type': 'tab-item',
            'data-value': e.value,
            'data-name': 'tab-item-' + e.value.toString().toLowerCase(),
          },
          e.children,
        )
      }
      function c(e) {
        return class extends n.PureComponent {
          constructor() {
            super(...arguments), (this.activeTab = { current: null })
          }
          componentDidUpdate() {
            ;((0, a.ensureNotNull)(this._slider).style.transition = 'transform 350ms'), this._componentDidUpdate()
          }
          componentDidMount() {
            this._componentDidUpdate()
          }
          render() {
            const { className: t } = this.props,
              s = this._generateTabs()
            return n.createElement(
              'div',
              { className: i(t, o.tabs), 'data-name': this.props['data-name'] },
              s,
              n.createElement(e, {
                reference: e => {
                  this._slider = e
                },
              }),
            )
          }
          _generateTabs() {
            return (
              (this.activeTab.current = null),
              n.Children.map(this.props.children, e => {
                const t = e,
                  s = Boolean(t.props.isActive),
                  i = {
                    reference: e => {
                      s && (this.activeTab.current = e), t.props.reference && t.props.reference(e)
                    },
                  }
                return n.cloneElement(t, i)
              })
            )
          }
          _componentDidUpdate() {
            const e = (0, a.ensureNotNull)(this._slider).style
            if (this.activeTab.current) {
              const t = this.activeTab.current.offsetWidth,
                s = this.activeTab.current.offsetLeft
              ;(e.transform = `translateX(${s}px)`), (e.width = t + 'px'), (e.opacity = '1')
            } else e.opacity = '0'
          }
        }
      }
      c(function (e) {
        return n.createElement('div', { className: o.slider, ref: e.reference })
      })
    },
    40173: (e, t, s) => {
      'use strict'
      function n(e, t, s = {}) {
        const n = Object.assign({}, t)
        for (const i of Object.keys(t)) {
          const a = s[i] || i
          a in e && (n[i] = [e[a], t[i]].join(' '))
        }
        return n
      }
      function i(e, t, s = {}) {
        return Object.assign({}, e, n(e, t, s))
      }
      s.d(t, { weakComposeClasses: () => n, mergeThemes: () => i })
    },
    4585: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    11178: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="none" stroke="currentColor" d="M11 1.5h3.5a2 2 0 0 1 2 2V7m0 5v2.5a2 2 0 0 1-2 2H11m-4 0H3.5a2 2 0 0 1-2-2V11m0-4V3.5a2 2 0 0 1 2-2H7"/></svg>'
    },
    99499: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g fill="none" stroke="currentColor"><circle cx="3.5" cy="3.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><path stroke-linecap="square" d="M9.5 1.5l-5 11"/></g></svg>'
    },
    86440: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    74471: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
    52360: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13v-2.5m8.5 11h6.5a2 2 0 0 0 2-2v-9m-17 0v-2c0-1.1.9-2 2-2h13a2 2 0 0 1 2 2v2m-17 0h17"/><path fill="currentColor" d="M10 4h1v4h-1V4zM17 4h1v4h-1V4z"/><path stroke="currentColor" d="M4 18.5h7.5m0 0L8 22m3.5-3.5L8 15"/></svg>'
    },
    68139: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M1.5 8V6.5m7.5 9h5.5a2 2 0 0 0 2-2v-7m-15 0v-2c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v2m-15 0h15"/><path fill="currentColor" d="M5 1h1v3H5V1zM12 1h1v3h-1V1z"/><path stroke="currentColor" d="M0 12.5h7.5m0 0L4 16m3.5-3.5L4 9"/></svg>'
    },
  },
])
