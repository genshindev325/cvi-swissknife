;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [731],
  {
    59142: function (e, t) {
      var n, o, r
      ;(o = [t]),
        void 0 ===
          (r =
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
                var o = {
                  get passive() {
                    n = !0
                  },
                }
                window.addEventListener('testPassive', null, o), window.removeEventListener('testPassive', null, o)
              }
              var r =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                a = [],
                l = !1,
                i = -1,
                s = void 0,
                c = void 0,
                d = function (e) {
                  return a.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                  })
                },
                u = function (e) {
                  var t = e || window.event
                  return !!d(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1)
                },
                m = function () {
                  setTimeout(function () {
                    void 0 !== c && ((document.body.style.paddingRight = c), (c = void 0)),
                      void 0 !== s && ((document.body.style.overflow = s), (s = void 0))
                  })
                }
              ;(e.disableBodyScroll = function (e, o) {
                if (r) {
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
                    var m = { targetElement: e, options: o || {} }
                    ;(a = [].concat(t(a), [m])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (i = e.targetTouches[0].clientY)
                      }),
                      (e.ontouchmove = function (t) {
                        var n, o, r, a
                        1 === t.targetTouches.length &&
                          ((o = e),
                          (a = (n = t).targetTouches[0].clientY - i),
                          !d(n.target) &&
                            ((o && 0 === o.scrollTop && 0 < a) ||
                            ((r = o) && r.scrollHeight - r.scrollTop <= r.clientHeight && a < 0)
                              ? u(n)
                              : n.stopPropagation()))
                      }),
                      l || (document.addEventListener('touchmove', u, n ? { passive: !1 } : void 0), (l = !0))
                  }
                } else {
                  ;(p = o),
                    setTimeout(function () {
                      if (void 0 === c) {
                        var e = !!p && !0 === p.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth
                        e &&
                          0 < t &&
                          ((c = document.body.style.paddingRight), (document.body.style.paddingRight = t + 'px'))
                      }
                      void 0 === s && ((s = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var h = { targetElement: e, options: o || {} }
                  a = [].concat(t(a), [h])
                }
                var p
              }),
                (e.clearAllBodyScrollLocks = function () {
                  r
                    ? (a.forEach(function (e) {
                        ;(e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null)
                      }),
                      l && (document.removeEventListener('touchmove', u, n ? { passive: !1 } : void 0), (l = !1)),
                      (a = []),
                      (i = -1))
                    : (m(), (a = []))
                }),
                (e.enableBodyScroll = function (e) {
                  if (r) {
                    if (!e)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (a = a.filter(function (t) {
                        return t.targetElement !== e
                      })),
                      l &&
                        0 === a.length &&
                        (document.removeEventListener('touchmove', u, n ? { passive: !1 } : void 0), (l = !1))
                  } else
                    1 === a.length && a[0].targetElement === e
                      ? (m(), (a = []))
                      : (a = a.filter(function (t) {
                          return t.targetElement !== e
                        }))
                })
            })
              ? n.apply(t, o)
              : n) || (e.exports = r)
    },
    37593: e => {
      e.exports = {
        wrapper: 'wrapper-5Xd5conM',
        input: 'input-5Xd5conM',
        box: 'box-5Xd5conM',
        icon: 'icon-5Xd5conM',
        noOutline: 'noOutline-5Xd5conM',
        'intent-danger': 'intent-danger-5Xd5conM',
        check: 'check-5Xd5conM',
        dot: 'dot-5Xd5conM',
      }
    },
    71489: e => {
      e.exports = {
        button: 'button-MtWCmkmc',
        bordersVisible: 'bordersVisible-MtWCmkmc',
        selected: 'selected-MtWCmkmc',
      }
    },
    72142: e => {
      e.exports = { footer: 'footer-C0oTZgbU' }
    },
    35725: e => {
      e.exports = { wrap: 'wrap-IVoYCPDG', header: 'header-IVoYCPDG', item: 'item-IVoYCPDG' }
    },
    74618: e => {
      e.exports = { label: 'label-jkX9S6js' }
    },
    61257: e => {
      e.exports = {
        scrollable: 'scrollable-JgZSADtd',
        spinnerWrap: 'spinnerWrap-JgZSADtd',
        item: 'item-JgZSADtd',
        heading: 'heading-JgZSADtd',
        checkboxWrap: 'checkboxWrap-JgZSADtd',
        checkbox: 'checkbox-JgZSADtd',
        emptyState: 'emptyState-JgZSADtd',
        image: 'image-JgZSADtd',
        text: 'text-JgZSADtd',
      }
    },
    20512: e => {
      e.exports = { dialog: 'dialog-VLZxw4Dg', tablet: 'tablet-VLZxw4Dg' }
    },
    66998: e => {
      e.exports = {
        wrap: 'wrap-3HaHQVJm',
        positionBottom: 'positionBottom-3HaHQVJm',
        backdrop: 'backdrop-3HaHQVJm',
        drawer: 'drawer-3HaHQVJm',
        positionLeft: 'positionLeft-3HaHQVJm',
      }
    },
    23576: e => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 428px)',
        item: 'item-4TFSfyGO',
        hovered: 'hovered-4TFSfyGO',
        isDisabled: 'isDisabled-4TFSfyGO',
        isActive: 'isActive-4TFSfyGO',
        shortcut: 'shortcut-4TFSfyGO',
        toolbox: 'toolbox-4TFSfyGO',
        withIcon: 'withIcon-4TFSfyGO',
        icon: 'icon-4TFSfyGO',
        labelRow: 'labelRow-4TFSfyGO',
        label: 'label-4TFSfyGO',
        showOnHover: 'showOnHover-4TFSfyGO',
      }
    },
    84413: (e, t, n) => {
      'use strict'
      n.d(t, { CheckboxInput: () => c })
      var o = n(59496),
        r = n(97754),
        a = n(9745),
        l = n(49154),
        i = n(37593),
        s = n.n(i)
      function c(e) {
        const t = r(s().box, s()['intent-' + e.intent], {
            [s().check]: !Boolean(e.indeterminate),
            [s().dot]: Boolean(e.indeterminate),
            [s().noOutline]: -1 === e.tabIndex,
          }),
          n = r(s().wrapper, e.className)
        return o.createElement(
          'span',
          { className: n, title: e.title },
          o.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: s().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: function () {
              e.onChange && e.onChange(e.value)
            },
            ref: e.reference,
          }),
          o.createElement('span', { className: t }, o.createElement(a.Icon, { icon: l, className: s().icon })),
        )
      }
    },
    9745: (e, t, n) => {
      'use strict'
      n.d(t, { Icon: () => r })
      var o = n(59496)
      const r = o.forwardRef((e, t) => {
        const { icon: n = '', ...r } = e
        return o.createElement('span', { ...r, ref: t, dangerouslySetInnerHTML: { __html: n } })
      })
    },
    99054: (e, t, n) => {
      'use strict'
      n.d(t, { setFixedBodyState: () => c })
      const o = (() => {
        let e
        return () => {
          var t
          if (void 0 === e) {
            const n = document.createElement('div'),
              o = n.style
            ;(o.visibility = 'hidden'),
              (o.width = '100px'),
              (o.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(n)
            const r = n.offsetWidth
            n.style.overflow = 'scroll'
            const a = document.createElement('div')
            ;(a.style.width = '100%'), n.appendChild(a)
            const l = a.offsetWidth
            null === (t = n.parentNode) || void 0 === t || t.removeChild(n), (e = r - l)
          }
          return e
        }
      })()
      function r(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function a(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function l(e, t) {
        return parseInt(a(e, t))
      }
      let i = 0,
        s = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++i) {
          const e = a(t, 'overflow'),
            i = l(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (r(n, 'right', o() + 'px'), (t.style.paddingRight = i + o() + 'px'), (s = !0)),
            t.classList.add('i-no-scroll')
        } else if (!e && i > 0 && 0 == --i && (t.classList.remove('i-no-scroll'), s)) {
          r(n, 'right', '0px')
          let e = 0
          0, t.scrollHeight <= t.clientHeight && (e -= o()), (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'), (s = !1)
        }
      }
    },
    39362: (e, t, n) => {
      'use strict'
      n.d(t, { SymbolSearchDialogFooter: () => i })
      var o = n(59496),
        r = n(97754),
        a = n.n(r),
        l = n(72142)
      function i(e) {
        const { className: t, children: n } = e
        return o.createElement('div', { className: a()(l.footer, t) }, n)
      }
    },
    89035: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { getCompareDialogRenderer: () => se })
      var o = n(59496),
        r = n(28353),
        a = n(32563),
        l = n(67337),
        i = n(89453),
        s = n(97754),
        c = n.n(s),
        d = n(9837),
        u = n.n(d),
        m = n(88537),
        h = n(9745),
        p = n(86656),
        v = n(77975),
        f = n(61074),
        g = n(26843),
        b = n(45345),
        w = n(84524),
        S = n(5648)
      const C = o.createContext(null)
      var y = n(70412),
        x = n(78036)
      const E = o.createContext(null)
      var I = n(16396),
        M = n(41590),
        D = n(37558),
        k = n(71489)
      function _(e) {
        const {
          theme: t = k,
          children: n,
          onClick: r,
          isSelected: a,
          areBordersVisible: l,
          isItemSelected: i,
          className: s,
          value: d,
          name: u,
        } = e
        return o.createElement(
          'button',
          {
            type: 'button',
            className: c()(s, t.button, a && t.selected, l && !a && !i && t.bordersVisible),
            name: u,
            value: d,
            onClick: r,
          },
          n,
        )
      }
      function N(e) {
        const { value: t, onClick: n, ...r } = e,
          a = (0, o.useCallback)(e => n(t, e), [t, n])
        return o.createElement(_, { ...r, value: String(t), onClick: a })
      }
      var O = n(46148),
        T = n(35725)
      const P = {
        sameScale: (0, r.t)('Same % scale'),
        newPriceScale: (0, r.t)('New price scale'),
        newPane: (0, r.t)('New pane'),
      }
      function A(e) {
        const { fullSymbolName: t, isSelected: n, className: a } = e,
          { isMobile: l, searchRef: s, setMode: d } = (0, x.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: u,
            selectedCompareOption: m,
            setHoveredItemId: h,
            clearInput: p,
            allowExtendTimeScale: v,
          } = (0, x.useEnsuredContext)(C),
          { callback: f } = (0, x.useEnsuredContext)(E)
        return l
          ? o.createElement(
              D.DrawerManager,
              null,
              o.createElement(
                M.Drawer,
                { position: 'Bottom', onClose: g.bind(null, !1) },
                o.createElement('div', { className: T.header }, (0, r.t)('Add to')),
                o.createElement(I.PopupMenuItem, {
                  className: T.item,
                  onClick: b,
                  onClickArg: O.CompareOption.SameScale,
                  label: P.sameScale,
                }),
                o.createElement(I.PopupMenuItem, {
                  className: T.item,
                  onClick: b,
                  onClickArg: O.CompareOption.NewPriceScale,
                  label: P.newPriceScale,
                }),
                o.createElement(I.PopupMenuItem, {
                  className: T.item,
                  onClick: b,
                  onClickArg: O.CompareOption.NewPane,
                  label: P.newPane,
                }),
              ),
            )
          : o.createElement(
              'div',
              { className: c()(T.wrap, a), 'data-name': 'compare-buttons-group' },
              o.createElement(
                N,
                {
                  onClick: b,
                  value: O.CompareOption.SameScale,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === O.CompareOption.SameScale,
                },
                P.sameScale,
              ),
              o.createElement(
                N,
                {
                  onClick: b,
                  value: O.CompareOption.NewPriceScale,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === O.CompareOption.NewPriceScale,
                },
                P.newPriceScale,
              ),
              o.createElement(
                N,
                {
                  onClick: b,
                  value: O.CompareOption.NewPane,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === O.CompareOption.NewPane,
                },
                P.newPane,
              ),
            )
        function g(e) {
          l && f && f(), p && e && p(s, d)
        }
        function b(e, n) {
          if ((n.preventDefault(), u && t && void 0 !== e)) {
            ;(0, i.getSymbolSearchCompleteOverrideFunction)()(t).then(t => {
              u.applyStudy(t, e, v), h(''), g(!0)
            })
          }
        }
      }
      function B(e) {
        const { isSelected: t, fullSymbolName: n, onExpandClick: r, actions: l, id: s, isOffset: c } = e,
          {
            isMobile: d,
            toggleExpand: u,
            searchSpreads: m,
            searchRef: h,
            setMode: p,
            mode: v,
          } = (0, x.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: f,
            hoveredItemId: g,
            setHoveredItemId: b,
            clearInput: I,
            allowExtendTimeScale: M,
          } = (0, x.useEnsuredContext)(C),
          [D, k] = (0, o.useState)(!1),
          _ = (0, o.useRef)(null),
          N = (0, y.useAccurateHover)(_),
          T = (0, o.useMemo)(() => ({ callback: L }), [L]),
          P = !Boolean(r) && !Boolean(l),
          B = s === g
        return o.createElement(
          E.Provider,
          { value: T },
          o.createElement(S.SymbolSearchDialogContentItem, {
            hideMarkedListFlag: 'compare' === v,
            ...e,
            reference: _,
            onClick: function (t) {
              if (Boolean(r) && s && !c) return t.preventDefault(), void u(s)
              if (!D && d) return void k(!0)
              if (m && e.onClick) return void e.onClick(t)
              if ((a.mobiletouch ? B : !D) && n) {
                ;(0, i.getSymbolSearchCompleteOverrideFunction)()(n).then(e => {
                  f.applyStudy(e, O.CompareOption.SameScale, M)
                }),
                  b(''),
                  I && I(h, p)
              }
              a.mobiletouch && !d && !B && s && b(s)
            },
            hoverComponent: (function () {
              if (!P) return !1
              if (d) return D
              if (a.mobiletouch) return B
              return Boolean(N || t)
            })()
              ? A
              : void 0,
          }),
        )
        function L() {
          k(!1)
        }
      }
      var L = n(35932),
        R = n(68974),
        H = n(86440),
        z = n(61257)
      function W(e) {
        const { handleListWidth: t } = (0, m.ensureNotNull)((0, o.useContext)(w.SymbolSearchItemsDialogContext)),
          { compareModel: n, selectedCompareIndex: a, selectedItemRef: l } = (0, m.ensureNotNull)((0, o.useContext)(C)),
          i = (0, v.useWatchedValueReadonly)({ watchedValue: n.isDataReady() }),
          s = (0, v.useWatchedValueReadonly)({ watchedValue: n.studies() }),
          d = (0, v.useWatchedValueReadonly)({ watchedValue: n.highlightedSymbol() }),
          y = (0, o.useMemo)(() => s.filter(e => e.checked), [s]),
          x = (0, o.useMemo)(() => s.filter(e => !e.checked), [s])
        return (
          (0, o.useEffect)(
            () => (
              n.chartModel().dataSourceCollectionChanged().subscribe(n, n.handleSourcesChange),
              () => n.chartModel().dataSourceCollectionChanged().unsubscribe(n, n.handleSourcesChange)
            ),
            [n],
          ),
          o.createElement(
            u(),
            {
              onMeasure: function (e) {
                t(e.width)
              },
            },
            o.createElement(
              p.TouchScrollContainer,
              { className: z.scrollable },
              (function () {
                if (!i) return o.createElement('div', { className: z.spinnerWrap }, o.createElement(f.Spinner, null))
                if (!Boolean(y.length) && !Boolean(x.length)) {
                  const e = b.watchedTheme.value() === g.StdTheme.Dark ? R : L
                  return o.createElement(
                    'div',
                    { className: z.emptyState },
                    o.createElement(h.Icon, { className: z.image, icon: e }),
                    o.createElement('div', { className: z.text }, (0, r.t)('No symbols here yet — why not add some?')),
                  )
                }
                return o.createElement(
                  o.Fragment,
                  null,
                  Boolean(y.length) &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement('div', { className: z.heading }, (0, r.t)('Added symbols')),
                      y.map((e, t) =>
                        o.createElement(S.SymbolSearchDialogContentItem, {
                          'data-role': 'added-symbol-item',
                          className: z.item,
                          key: e.id,
                          id: e.id,
                          shortName: e.title,
                          title: e.title,
                          logoId: e.logoId,
                          currencyLogoId: e.currencyLogoId,
                          baseCurrencyLogoId: e.baseCurrencyLogoId,
                          dangerousDescriptionHTML: e.description,
                          exchangeName: e.exchangeName,
                          marketType: e.marketType,
                          country: e.country,
                          providerId: e.providerId,
                          onClick: E.bind(null, e),
                          isHighlighted: e.id === d,
                          isSelected: I(e),
                          itemRef: I(e) ? l : void 0,
                          actions: o.createElement(
                            'div',
                            { className: z.checkboxWrap },
                            o.createElement(
                              _,
                              {
                                className: z.checkbox,
                                onClick: E.bind(null, e),
                                isSelected: I(e),
                              },
                              o.createElement(h.Icon, { icon: H }),
                            ),
                          ),
                        }),
                      ),
                    ),
                  Boolean(x.length) &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement('div', { className: z.heading }, (0, r.t)('Recent symbols')),
                      x.map(e =>
                        o.createElement(B, {
                          'data-role': 'recent-symbol-item',
                          className: c()(z.item, e.id === d && z.highlighted),
                          key: e.id,
                          id: e.id,
                          shortName: e.title,
                          logoId: e.logoId,
                          currencyLogoId: e.currencyLogoId,
                          baseCurrencyLogoId: e.baseCurrencyLogoId,
                          title: e.title,
                          dangerousDescriptionHTML: e.description,
                          exchangeName: e.exchangeName,
                          marketType: e.marketType,
                          country: e.country,
                          providerId: e.providerId,
                          fullSymbolName: e.symbol,
                          isSelected: I(e),
                          itemRef: I(e) ? l : void 0,
                        }),
                      ),
                    ),
                )
              })(),
            ),
          )
        )
        function E(e, t) {
          t.preventDefault(), n.removeStudy(e)
        }
        function I(e) {
          return s.indexOf(e) === a
        }
      }
      var F = n(56840)
      class V extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._selectedItemRef = o.createRef()),
            (this._getContextValue = () => {
              const { compareModel: e } = this.props,
                {
                  selectedCompareOption: t,
                  selectedCompareIndex: n,
                  hoveredItemId: o,
                  allowExtendTimeScale: r,
                } = this.state
              return {
                compareModel: e,
                selectedCompareOption: t,
                setSelectedCompareOption: this._setSelectedCompareOption,
                hoveredItemId: o,
                setHoveredItemId: this._setHoveredItemId,
                selectedCompareIndex: n,
                setSelectedCompareIndex: this._setSelectedCompareIndex,
                selectedItemRef: this._selectedItemRef,
                clearInput: this._clearInput,
                allowExtendTimeScale: r,
                toggleAllowExtendTimeScale: this._toggleAllowExtendTimeScale,
              }
            }),
            (this._clearInput = (e, t) => {
              e && e.current && ((e.current.value = ''), t('compare'))
            }),
            (this._setSelectedCompareOption = e => {
              this.setState({ selectedCompareOption: e })
            }),
            (this._setHoveredItemId = e => {
              this.setState({ hoveredItemId: e })
            }),
            (this._setSelectedCompareIndex = (e, t) => {
              this.setState({ selectedCompareIndex: e }, t)
            }),
            (this._toggleAllowExtendTimeScale = () => {
              const e = !this.state.allowExtendTimeScale
              F.setValue('showAddSymbolDialog.extendCheckboxState', e), this.setState({ allowExtendTimeScale: e })
            }),
            (this.state = {
              selectedCompareOption: 0,
              selectedCompareIndex: -1,
              hoveredItemId: void 0,
              allowExtendTimeScale: Boolean(F.getBool('showAddSymbolDialog.extendCheckboxState')),
            })
        }
        render() {
          const { children: e } = this.props
          return o.createElement(C.Provider, { value: this._getContextValue() }, e)
        }
      }
      var G = n(68335),
        J = n(85457),
        Z = n(20512)
      const q = Object.keys(O.CompareOption).length / 2
      function U(e) {
        const {
            openedItems: t,
            searchRef: n,
            feedItems: r,
            selectedIndex: a,
            toggleExpand: l,
            onSearchComplete: i,
            mode: c,
            setMode: d,
            setSelectedIndex: u,
            isMobile: m,
            isTablet: h,
            onClose: p,
            upperCaseEnabled: f,
          } = (0, x.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: g,
            hoveredItemId: b,
            setHoveredItemId: S,
            selectedCompareOption: y,
            setSelectedCompareOption: E,
            selectedCompareIndex: I,
            setSelectedCompareIndex: M,
            selectedItemRef: D,
            clearInput: k,
            allowExtendTimeScale: _,
          } = (0, x.useEnsuredContext)(C),
          N = (0, v.useWatchedValueReadonly)({ watchedValue: g.studies() }),
          O = r[a],
          T = 'compare' === c
        return (
          (0, o.useEffect)(() => {
            b && S(''), I && M(-1)
          }, [c]),
          o.createElement(J.AdaptivePopupDialog, {
            ...e,
            className: s(Z.dialog, !m && h && Z.tablet),
            onKeyDown: function (e) {
              var o
              const s = (0, G.hashFromEvent)(e),
                c = T ? I : a,
                u = T ? N : r
              switch (s) {
                case 38:
                  if ((e.preventDefault(), 0 === c)) return
                  if (-1 === c) return void P(0)
                  P(c - 1)
                  break
                case 40:
                  if ((e.preventDefault(), c === u.length - 1)) return
                  P(c + 1)
                  break
                case 37: {
                  const n = B()
                  if (n && t.has(n)) return e.preventDefault(), void l(n)
                  if (!y || n) return
                  e.preventDefault(), E(y - 1)
                  break
                }
                case 39: {
                  const n = B()
                  if (n && !t.has(n)) return e.preventDefault(), void l(n)
                  if (y === q - 1 || n) return
                  e.preventDefault(), E(y + 1)
                  break
                }
                case 13: {
                  if (T)
                    return void (function () {
                      if (-1 === I) return
                      const e = N[I]
                      e.checked ? g.removeStudy(e) : g.applyStudy(e.symbol, y, _)
                      M(-1)
                    })()
                  const t = B()
                  if (t) return e.preventDefault(), void l(t)
                  e.preventDefault()
                  const r = null === (o = null == n ? void 0 : n.current) || void 0 === o ? void 0 : o.value.trim()
                  r &&
                    k &&
                    (i([{ symbol: f ? r.toUpperCase() : r, resolved: !1, compareOption: y, allowExtendTimeScale: _ }]),
                    k(n, d))
                  break
                }
                case 27:
                  e.preventDefault(), p()
              }
            },
            dataName: 'compare-dialog',
            draggable: !0,
          })
        )
        function P(e) {
          T ? M(e, A) : u(e)
        }
        function A() {
          var e
          null === (e = D.current) || void 0 === e || e.scrollIntoView({ block: 'nearest' })
        }
        function B() {
          if (!O) return
          const { id: e, isOffset: t, onExpandClick: n } = O
          return !t && Boolean(n) && e ? e : void 0
        }
      }
      var j = n(87995),
        X = n(24389),
        Q = n(12045),
        Y = (n(1861), n(22729))
      class K extends Y.DialogRenderer {
        constructor(e) {
          super(), (this._props = e)
        }
        show() {
          if (this.visible().value()) return
          const e = o.createElement(
            X.QuoteSessionContext.Provider,
            { value: null },
            o.createElement(Q.SymbolSearchItemsDialog, {
              ...this._props,
              initialMode: this._props.initialMode || 'symbolSearch',
              onClose: () => this.hide(),
            }),
          )
          j.render(e, this._container), this._setVisibility(!0)
        }
        hide() {
          var e, t
          j.unmountComponentAtNode(this._container),
            this._visibility.setValue(!1),
            null === (t = (e = this._props).onClose) || void 0 === t || t.call(e)
        }
      }
      var $ = n(81319),
        ee = n(69654),
        te = n(70613)
      function ne(e) {
        const { searchRef: t, setMode: n } = (0, x.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          { currentMode: r } = (0, x.useEnsuredContext)(te.SymbolSearchDialogBodyContext)
        return (
          (0, o.useEffect)(() => {
            const e = t.current
            if (e)
              return (
                e.addEventListener('input', a),
                () => {
                  e && e.removeEventListener('input', a)
                }
              )
          }, []),
          o.createElement(ee.DialogSearch, { ...e })
        )
        function a() {
          var e, o, a, l
          t.current &&
            r &&
            ('compare' !== r.current ||
            '' ===
              (null === (o = null === (e = null == t ? void 0 : t.current) || void 0 === e ? void 0 : e.value) ||
              void 0 === o
                ? void 0
                : o.trim())
              ? 'symbolSearch' === r.current &&
                '' ===
                  (null === (l = null === (a = null == t ? void 0 : t.current) || void 0 === a ? void 0 : a.value) ||
                  void 0 === l
                    ? void 0
                    : l.trim()) &&
                n('compare')
              : n('symbolSearch'))
        }
      }
      var oe = n(84413),
        re = n(39362),
        ae = n(74618)
      function le(e) {
        const { allowExtendTimeScale: t, toggleAllowExtendTimeScale: n } = (0, m.ensureNotNull)((0, o.useContext)(C))
        return o.createElement(
          re.SymbolSearchDialogFooter,
          null,
          o.createElement(
            'label',
            null,
            o.createElement(oe.CheckboxInput, { checked: t, value: t ? 'on' : 'off', onChange: n }),
            o.createElement('span', { className: ae.label }, (0, r.t)('Allow extend time scale')),
          ),
        )
      }
      const ie = l.enabled('secondary_series_extend_time_scale')
      function se(e) {
        return new K({
          wrapper: ((t = e), e => o.createElement(V, { ...e, compareModel: t })),
          dialog: U,
          contentItem: B,
          initialScreen: W,
          searchInput: ne,
          footer: ie ? o.createElement(le) : void 0,
          initialMode: 'compare',
          dialogTitle: (0, r.t)('Compare symbol'),
          autofocus: !a.mobiletouch,
          dialogWidth: 'fixed',
          onSearchComplete: t => {
            const { compareOption: n, allowExtendTimeScale: o } = t[0]
            if (void 0 !== n) {
              ;(0, i.getSymbolSearchCompleteOverrideFunction)()(t[0].symbol).then(t => {
                e.applyStudy(t, n, o)
              })
            }
          },
          symbolTypes: (0, $.getAvailableSymbolTypes)(),
          showSpreadActions: l.enabled('show_spread_operators') && l.enabled('compare_symbol_search_spread_operators'),
        })
        var t
      }
    },
    46148: (e, t, n) => {
      'use strict'
      var o
      n.d(t, { CompareOption: () => o }),
        (function (e) {
          ;(e[(e.SameScale = 0)] = 'SameScale'),
            (e[(e.NewPriceScale = 1)] = 'NewPriceScale'),
            (e[(e.NewPane = 2)] = 'NewPane')
        })(o || (o = {}))
    },
    37558: (e, t, n) => {
      'use strict'
      n.d(t, { DrawerManager: () => r, DrawerContext: () => a })
      var o = n(59496)
      class r extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._addDrawer = () => {
              const e = this.state.currentDrawer + 1
              return this.setState({ currentDrawer: e }), e
            }),
            (this._removeDrawer = () => {
              const e = this.state.currentDrawer - 1
              return this.setState({ currentDrawer: e }), e
            }),
            (this.state = { currentDrawer: 0 })
        }
        render() {
          return o.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.currentDrawer,
              },
            },
            this.props.children,
          )
        }
      }
      const a = o.createContext(null)
    },
    41590: (e, t, n) => {
      'use strict'
      n.d(t, { Drawer: () => h })
      var o = n(59496),
        r = n(88537),
        a = n(97754),
        l = n(59142),
        i = n(99054),
        s = n(65718),
        c = n(37558),
        d = n(49483),
        u = n(29197),
        m = n(66998)
      function h(e) {
        const { position: t = 'Bottom', onClose: n, children: h, className: p, theme: v = m } = e,
          f = (0, r.ensureNotNull)((0, o.useContext)(c.DrawerContext)),
          [g, b] = (0, o.useState)(0),
          w = (0, o.useRef)(null),
          S = (0, o.useContext)(u.CloseDelegateContext)
        return (
          (0, o.useEffect)(() => {
            const e = (0, r.ensureNotNull)(w.current)
            return (
              e.focus({ preventScroll: !0 }),
              S.subscribe(f, n),
              0 === f.currentDrawer && (0, i.setFixedBodyState)(!0),
              d.CheckMobile.iOS() && (0, l.disableBodyScroll)(e),
              b(f.addDrawer()),
              () => {
                S.unsubscribe(f, n)
                const t = f.removeDrawer()
                d.CheckMobile.iOS() && (0, l.enableBodyScroll)(e), 0 === t && (0, i.setFixedBodyState)(!1)
              }
            )
          }, []),
          o.createElement(
            s.Portal,
            null,
            o.createElement(
              'div',
              { className: a(m.wrap, m['position' + t]) },
              g === f.currentDrawer && o.createElement('div', { className: m.backdrop, onClick: n }),
              o.createElement(
                'div',
                {
                  className: a(m.drawer, v.drawer, m['position' + t], p),
                  ref: w,
                  tabIndex: -1,
                  'data-name': e['data-name'],
                },
                h,
              ),
            ),
          )
        )
      }
    },
    70412: (e, t, n) => {
      'use strict'
      n.d(t, { hoverMouseEventFilter: () => a, useAccurateHover: () => l, useHover: () => r })
      var o = n(59496)
      function r() {
        const [e, t] = (0, o.useState)(!1)
        return [
          e,
          {
            onMouseOver: function (e) {
              a(e) && t(!0)
            },
            onMouseOut: function (e) {
              a(e) && t(!1)
            },
          },
        ]
      }
      function a(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function l(e) {
        const [t, n] = (0, o.useState)(!1)
        return (
          (0, o.useEffect)(() => {
            const t = t => {
              if (null === e.current) return
              const o = e.current.contains(t.target)
              n(o)
            }
            return document.addEventListener('mouseover', t), () => document.removeEventListener('mouseover', t)
          }, []),
          t
        )
      }
    },
    58095: (e, t, n) => {
      'use strict'
      n.d(t, { useOutsideEvent: () => a })
      var o = n(59496),
        r = n(39640)
      function a(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: a,
            touchStart: l,
            handler: i,
            reference: s,
            ownerDocument: c = document,
          } = e,
          d = (0, o.useRef)(null),
          u = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: a, touchStart: l },
              o = s ? s.current : d.current
            return (0, r.addOutsideEventListener)(u.current, o, i, c, e)
          }, [t, n, a, l, i]),
          s || d
        )
      }
    },
    90692: (e, t, n) => {
      'use strict'
      n.d(t, { MatchMedia: () => r })
      var o = n(59496)
      class r extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate()
            }),
            (this.state = { query: window.matchMedia(this.props.rule) })
        }
        componentDidMount() {
          this._subscribe(this.state.query)
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query && (this._unsubscribe(t.query), this._subscribe(this.state.query))
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query)
        }
        render() {
          return this.props.children(this.state.query.matches)
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media ? { query: window.matchMedia(e.rule) } : null
        }
        _subscribe(e) {
          e.addListener(this._handleChange)
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange)
        }
      }
    },
    88216: (e, t, n) => {
      'use strict'
      n.d(t, { OverlapManager: () => a, getRootOverlapManager: () => i })
      var o = n(88537)
      class r {
        constructor() {
          this._storage = []
        }
        add(e) {
          this._storage.push(e)
        }
        remove(e) {
          this._storage = this._storage.filter(t => e !== t)
        }
        has(e) {
          return this._storage.includes(e)
        }
        getItems() {
          return this._storage
        }
      }
      class a {
        constructor(e = document) {
          ;(this._storage = new r()),
            (this._windows = new Map()),
            (this._index = 0),
            (this._document = e),
            (this._container = e.createDocumentFragment())
        }
        setContainer(e) {
          const t = this._container,
            n = null === e ? this._document.createDocumentFragment() : e
          !(function (e, t) {
            Array.from(e.childNodes).forEach(e => {
              e.nodeType === Node.ELEMENT_NODE && t.appendChild(e)
            })
          })(t, n),
            (this._container = n)
        }
        registerWindow(e) {
          this._storage.has(e) || this._storage.add(e)
        }
        ensureWindow(e, t = { position: 'fixed', direction: 'normal' }) {
          const n = this._windows.get(e)
          if (void 0 !== n) return n
          this.registerWindow(e)
          const o = this._document.createElement('div')
          if (
            ((o.style.position = t.position),
            (o.style.zIndex = this._index.toString()),
            (o.dataset.id = e),
            void 0 !== t.index)
          ) {
            const e = this._container.childNodes.length
            if (t.index >= e) this._container.appendChild(o)
            else if (t.index <= 0) this._container.insertBefore(o, this._container.firstChild)
            else {
              const e = this._container.childNodes[t.index]
              this._container.insertBefore(o, e)
            }
          } else
            'reverse' === t.direction
              ? this._container.insertBefore(o, this._container.firstChild)
              : this._container.appendChild(o)
          return this._windows.set(e, o), ++this._index, o
        }
        unregisterWindow(e) {
          this._storage.remove(e)
          const t = this._windows.get(e)
          void 0 !== t && (null !== t.parentElement && t.parentElement.removeChild(t), this._windows.delete(e))
        }
        getZindex(e) {
          const t = this.ensureWindow(e)
          return parseInt(t.style.zIndex || '0')
        }
        moveToTop(e) {
          if (this.getZindex(e) !== this._index) {
            this.ensureWindow(e).style.zIndex = (++this._index).toString()
          }
        }
        removeWindow(e) {
          this.unregisterWindow(e)
        }
      }
      const l = new WeakMap()
      function i(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(l.get(t))
        {
          const t = new a(e),
            n = (function (e) {
              const t = e.createElement('div')
              return (
                (t.style.position = 'absolute'),
                (t.style.zIndex = (150).toString()),
                (t.style.top = '0px'),
                (t.style.left = '0px'),
                (t.id = 'overlap-manager-root'),
                t
              )
            })(e)
          return l.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    16396: (e, t, n) => {
      'use strict'
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => c, PopupMenuItem: () => m })
      var o = n(59496),
        r = n(97754),
        a = n(59064),
        l = n(51768),
        i = n(90186),
        s = n(23576)
      const c = s
      function d(e) {
        const { reference: t, ...n } = e,
          r = { ...n, ref: t }
        return o.createElement(e.href ? 'a' : 'div', r)
      }
      function u(e) {
        e.stopPropagation()
      }
      function m(e) {
        const {
            id: t,
            role: n,
            'aria-selected': c,
            className: m,
            title: h,
            labelRowClassName: p,
            labelClassName: v,
            shortcut: f,
            forceShowShortcuts: g,
            icon: b,
            isActive: w,
            isDisabled: S,
            isHovered: C,
            appearAsDisabled: y,
            label: x,
            link: E,
            showToolboxOnHover: I,
            target: M,
            rel: D,
            toolbox: k,
            reference: _,
            onMouseOut: N,
            onMouseOver: O,
            suppressToolboxClick: T = !0,
            theme: P = s,
          } = e,
          A = (0, i.filterDataProps)(e),
          B = (0, o.useRef)(null)
        return o.createElement(
          d,
          {
            ...A,
            id: t,
            role: n,
            'aria-selected': c,
            className: r(m, P.item, b && P.withIcon, { [P.isActive]: w, [P.isDisabled]: S || y, [P.hovered]: C }),
            title: h,
            href: E,
            target: M,
            rel: D,
            reference: function (e) {
              ;(B.current = e), 'function' == typeof _ && _(e)
              'object' == typeof _ && (_.current = e)
            },
            onClick: function (t) {
              const { dontClosePopup: n, onClick: o, onClickArg: r, trackEventObject: i } = e
              if (S) return
              i && (0, l.trackEvent)(i.category, i.event, i.label)
              o && o(r, t)
              n || (0, a.globalCloseMenu)()
            },
            onContextMenu: function (t) {
              const { trackEventObject: n, trackRightClick: o } = e
              n && o && (0, l.trackEvent)(n.category, n.event, n.label + '_rightClick')
            },
            onMouseUp: function (t) {
              const { trackEventObject: n, trackMouseWheelClick: o } = e
              if (1 === t.button && E && n) {
                let e = n.label
                o && (e += '_mouseWheelClick'), (0, l.trackEvent)(n.category, n.event, e)
              }
            },
            onMouseOver: O,
            onMouseOut: N,
          },
          void 0 !== b && o.createElement('div', { className: P.icon, dangerouslySetInnerHTML: { __html: b } }),
          o.createElement(
            'div',
            { className: r(P.labelRow, p) },
            o.createElement('div', { className: r(P.label, v) }, x),
          ),
          (void 0 !== f || g) && o.createElement('div', { className: P.shortcut }, (L = f) && L.split('+').join(' + ')),
          void 0 !== k &&
            o.createElement('div', { onClick: T ? u : void 0, className: r(P.toolbox, { [P.showOnHover]: I }) }, k),
        )
        var L
      }
    },
    29197: (e, t, n) => {
      'use strict'
      n.d(t, { CloseDelegateContext: () => a })
      var o = n(59496),
        r = n(59064)
      const a = o.createContext(r.globalCloseDelegate)
    },
    65718: (e, t, n) => {
      'use strict'
      n.d(t, { Portal: () => s, PortalContext: () => c })
      var o = n(59496),
        r = n(87995),
        a = n(9423),
        l = n(88216),
        i = n(50655)
      class s extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, a.guid)())
        }
        componentWillUnmount() {
          this._manager().removeWindow(this._uuid)
        }
        render() {
          const e = this._manager().ensureWindow(this._uuid, this.props.layerOptions)
          return (
            (e.style.top = this.props.top || ''),
            (e.style.bottom = this.props.bottom || ''),
            (e.style.left = this.props.left || ''),
            (e.style.right = this.props.right || ''),
            (e.style.pointerEvents = this.props.pointerEvents || ''),
            r.createPortal(o.createElement(c.Provider, { value: this }, this.props.children), e)
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context ? (0, l.getRootOverlapManager)() : this.context
        }
      }
      s.contextType = i.SlotContext
      const c = o.createContext(null)
    },
    50655: (e, t, n) => {
      'use strict'
      n.d(t, { Slot: () => r, SlotContext: () => a })
      var o = n(59496)
      class r extends o.Component {
        shouldComponentUpdate() {
          return !1
        }
        render() {
          return o.createElement('div', {
            style: { position: 'fixed', zIndex: 150, left: 0, top: 0 },
            ref: this.props.reference,
          })
        }
      }
      const a = o.createContext(null)
    },
    86656: (e, t, n) => {
      'use strict'
      n.d(t, { TouchScrollContainer: () => i })
      var o = n(59496),
        r = n(59142),
        a = n(88537),
        l = n(49483)
      function i(e) {
        const { reference: t, children: n, ...a } = e,
          i = (0, o.useRef)(null),
          c = (0, o.useCallback)(
            e => {
              t && (t.current = e),
                l.CheckMobile.iOS() &&
                  (null !== i.current && (0, r.enableBodyScroll)(i.current),
                  (i.current = e),
                  null !== i.current && (0, r.disableBodyScroll)(i.current, { allowTouchMove: s(i) }))
            },
            [t],
          )
        return o.createElement('div', { ref: c, ...a }, n)
      }
      function s(e) {
        return t => {
          const n = (0, a.ensureNotNull)(e.current),
            o = document.activeElement
          return !n.contains(t) || (null !== o && n.contains(o) && o.contains(t))
        }
      }
    },
    49154: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    86440: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    68974: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#D1D4DC" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#D1D4DC" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#1976D2" cx="97.5" cy="39" r="13"/><path fill="#D1D4DC" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
    35932: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#1E222D" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#1E222D" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#2196F3" cx="97.5" cy="39" r="13"/><path fill="#fff" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>'
    },
  },
])
