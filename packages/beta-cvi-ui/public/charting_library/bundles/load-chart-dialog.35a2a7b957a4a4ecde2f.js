;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5009],
  {
    88227: e => {
      e.exports = { highlight: 'highlight-qXMjeLA3', active: 'active-qXMjeLA3' }
    },
    86956: e => {
      e.exports = { dialog: 'dialog-uOI0EVoT', contentList: 'contentList-uOI0EVoT' }
    },
    63843: e => {
      e.exports = {
        container: 'container-jjwO7WRQ',
        list: 'list-jjwO7WRQ',
        overlayScrollWrap: 'overlayScrollWrap-jjwO7WRQ',
        scroll: 'scroll-jjwO7WRQ',
      }
    },
    92360: e => {
      e.exports = { container: 'container-PLu464zm', title: 'title-PLu464zm' }
    },
    28712: e => {
      e.exports = {
        container: 'container-CcsqUMct',
        inputContainer: 'inputContainer-CcsqUMct',
        withCancel: 'withCancel-CcsqUMct',
        input: 'input-CcsqUMct',
        icon: 'icon-CcsqUMct',
        cancel: 'cancel-CcsqUMct',
      }
    },
    36690: e => {
      e.exports = {
        container: 'container-cz7bNe0c',
        labelWrap: 'labelWrap-cz7bNe0c',
        icon: 'icon-cz7bNe0c',
        text: 'text-cz7bNe0c',
      }
    },
    30636: e => {
      e.exports = { sortButton: 'sortButton-Ya1Tq1iv', icon: 'icon-Ya1Tq1iv' }
    },
    81524: e => {
      e.exports = { highlighted: 'highlighted-YWUtZHTy' }
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
    90186: (e, t, o) => {
      'use strict'
      function n(e) {
        return i(e, a)
      }
      function r(e) {
        return i(e, c)
      }
      function i(e, t) {
        const o = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of o) n[e] = t
        return n
      }
      function a(e) {
        const [t, o] = e
        return 0 === t.indexOf('data-') && 'string' == typeof o
      }
      function c(e) {
        return 0 === e[0].indexOf('aria-')
      }
      o.d(t, {
        filterDataProps: () => n,
        filterAriaProps: () => r,
        filterProps: () => i,
        isDataAttribute: () => a,
        isAriaAttribute: () => c,
      })
    },
    40233: (e, t, o) => {
      'use strict'
      o.d(t, {
        VerticalAttachEdge: () => n,
        HorizontalAttachEdge: () => r,
        VerticalDropDirection: () => i,
        HorizontalDropDirection: () => a,
        getPopupPositioner: () => s,
      })
      var n,
        r,
        i,
        a,
        c = o(88537)
      !(function (e) {
        ;(e[(e.Top = 0)] = 'Top'), (e[(e.Bottom = 1)] = 'Bottom')
      })(n || (n = {})),
        (function (e) {
          ;(e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right')
        })(r || (r = {})),
        (function (e) {
          ;(e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'), (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop')
        })(i || (i = {})),
        (function (e) {
          ;(e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'), (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft')
        })(a || (a = {}))
      const l = {
        verticalAttachEdge: n.Bottom,
        horizontalAttachEdge: r.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      }
      function s(e, t) {
        return (o, s) => {
          const u = (0, c.ensureNotNull)(e).getBoundingClientRect(),
            {
              verticalAttachEdge: d = l.verticalAttachEdge,
              verticalDropDirection: m = l.verticalDropDirection,
              horizontalAttachEdge: h = l.horizontalAttachEdge,
              horizontalDropDirection: f = l.horizontalDropDirection,
              horizontalMargin: v = l.horizontalMargin,
              verticalMargin: g = l.verticalMargin,
              matchButtonAndListboxWidths: p = l.matchButtonAndListboxWidths,
            } = t,
            E = d === n.Top ? -1 * g : g,
            C = h === r.Right ? u.right : u.left,
            y = d === n.Top ? u.top : u.bottom,
            S = { x: C - (f === a.FromRightToLeft ? o : 0) + v, y: y - (m === i.FromBottomToTop ? s : 0) + E }
          return p && (S.overrideWidth = u.width), S
        }
      }
    },
    9512: (e, t, o) => {
      'use strict'
      o.r(t), o.d(t, { LoadChartDialogRenderer: () => ne })
      var n = o(59496),
        r = o(87995),
        i = o(88537),
        a = o(28353),
        c = o(56840),
        l = o(49483),
        s = o(85457),
        u = o(97754),
        d = o.n(u),
        m = o(50628),
        h = o(40233),
        f = o(9745),
        v = o(26659),
        g = o(46185),
        p = o(30636)
      function E(e) {
        const { sortDirection: t, children: o, ...r } = e,
          i = (0, n.useRef)(null),
          [a, c] = (0, n.useState)(!1)
        return n.createElement(
          'div',
          {
            ...r,
            ref: i,
            className: u(p.sortButton, 'apply-common-tooltip', 'common-tooltip-vertical'),
            onClick: function () {
              c(!a)
            },
          },
          n.createElement(f.Icon, { className: p.icon, icon: 0 === t ? v : g }),
          n.createElement(
            m.PopupMenu,
            {
              doNotCloseOn: i.current,
              isOpened: a,
              onClose: () => {
                c(!1)
              },
              position: (0, h.getPopupPositioner)(i.current, { verticalMargin: -35, verticalAttachEdge: 0 }),
            },
            o,
          ),
        )
      }
      var C = o(16396),
        y = o(36690)
      function S(e) {
        const {
            label: t,
            listSortField: o,
            itemSortField: r,
            listSortDirection: i,
            itemSortDirection: a,
            onClick: c,
            className: l,
            ...s
          } = e,
          d = r === o && a === i
        return n.createElement(C.PopupMenuItem, {
          ...s,
          className: u(y.container, l),
          label: n.createElement(
            'div',
            { className: y.labelWrap },
            n.createElement(f.Icon, { className: y.icon, icon: 0 === a ? v : g }),
            n.createElement('span', { className: y.text }, t),
          ),
          isActive: d,
          onClick: function () {
            c(r, a)
          },
          'data-active': d.toString(),
          'data-sort-field': r,
          'data-sort-direction': 0 === a ? 'asc' : 'desc',
        })
      }
      var b = o(69654),
        x = o(92360)
      function w(e) {
        const { children: t, className: o } = e
        return n.createElement('div', { className: d()(x.container, o) }, t)
      }
      function D(e) {
        const { title: t } = e
        return n.createElement('div', { className: x.title }, t)
      }
      var F = o(93751)
      var k = o(83199),
        M = o(9837),
        T = o.n(M),
        N = o(62820),
        O = o(898),
        L = o(33127)
      var R = o(3085),
        I = o(63843)
      function A(e) {
        const { className: t, onScroll: o, onTouchStart: r, reference: i, children: a, scrollbar: c, ...s } = e,
          [u, m] = (0, O.useDimensions)(),
          [h, f, v, g] = (0, L.useOverlayScroll)()
        return (
          (0, n.useEffect)(() => {
            const e = () => {}
            return l.isFF
              ? (document.addEventListener('wheel', () => e),
                () => {
                  document.removeEventListener('wheel', e)
                })
              : e
          }, []),
          n.createElement(
            T(),
            { onMeasure: u },
            n.createElement(
              'div',
              { ...('overlay' === c && f), className: d()(I.container, t), onTouchStart: r, onScrollCapture: o },
              'overlay' === c && n.createElement(R.OverlayScrollContainer, { ...h, className: I.overlayScrollWrap }),
              n.createElement(k.FixedSizeList, {
                ref: i,
                className: d()('native' === c ? I.scroll : I.list),
                outerRef: 'overlay' === c ? v : void 0,
                onItemsRendered: g,
                layout: 'vertical',
                width: '100%',
                height: (null == m ? void 0 : m.height) || 0,
                children: a,
                direction: (0, N.isRtl)() ? 'rtl' : 'ltr',
                ...s,
              }),
            ),
          )
        )
      }
      var P = o(84015)
      var z = o(64530),
        W = o(9315),
        B = o(50655),
        j = o(3615)
      var H = o(1860),
        q = o(64806),
        _ = o(24637),
        U = o(19785),
        G = o(88227)
      const K = new H.DateFormatter('dd-MM-yyyy'),
        V = new q.TimeFormatter('%h:%m')
      function $(e) {
        const {
            chart: t,
            chartWidgetCollection: o,
            trackEvent: r,
            localFavorites: i,
            onClose: c,
            searchString: l,
            onClickRemove: s,
            onRemoveCanceled: u,
            isSelected: m,
          } = e,
          [h, f] = (0, n.useState)(() => t.active()),
          [v, g] = (0, n.useState)(!1),
          p = t.url
            ? (function (e) {
                const t = e.chartId ? `/chart/${e.chartId}/` : '/chart/',
                  o = new URL(t, location.href)
                return (
                  e.symbol && o.searchParams.append('symbol', e.symbol),
                  e.interval && o.searchParams.append('interval', e.interval),
                  e.style && o.searchParams.append('style', e.style),
                  (0, P.urlWithMobileAppParams)(o.href)
                )
              })({ chartId: t.url })
            : void 0,
          E = (0, n.useContext)(B.SlotContext),
          C = (0, n.useMemo)(() => new Date(1e3 * t.modified), [t]),
          y = (0, n.useMemo)(() => (0, U.createRegExpList)(l), [l]),
          S = d()(G.highlight, h && G.active)
        return (
          (0, n.useEffect)(
            () => (
              o && o.metaInfo.id.subscribe(x),
              () => {
                o && o.metaInfo.id.unsubscribe(x)
              }
            ),
            [],
          ),
          n.createElement(z.DialogContentItem, {
            url: p,
            title: n.createElement(_.HighlightedText, { className: S, queryString: l, rules: y, text: t.title }),
            subtitle: n.createElement(
              n.Fragment,
              null,
              n.createElement(_.HighlightedText, { className: S, queryString: l, rules: y, text: t.description }),
              ' ',
              '(',
              K.format(C).replace(/-/g, '.'),
              ' ',
              V.formatLocal(C),
              ')',
            ),
            onClick: function (e) {
              0
              t.openAction(), !1
            },
            onClickFavorite: function () {
              0
              const e = { ...i }
              e[t.id] ? delete e[t.id] : (e[t.id] = !0)
              t.favoriteAction(e)
            },
            onClickRemove: async function () {
              if (v) return
              g(!0)
              const e = await (async function (e) {
                const t = (0, a.t)("Do you really want to delete Chart Layout '{name}' ?", {
                  replace: { name: e.title },
                })
                return t
              })(t)
              g(!1),
                (function (e, t, o, n) {
                  ;(0, j.showConfirm)(
                    {
                      text: e,
                      onConfirm: ({ dialogClose: e }) => {
                        t(), e()
                      },
                      onClose: () => {
                        o()
                      },
                    },
                    n,
                  )
                })(e, b, u, E)
            },
            isFavorite: Boolean(i[t.id]),
            isActive: h,
            isSelected: m,
            'data-name': 'load-chart-dialog-item',
          })
        )
        function b() {
          t.deleteAction().then(() => s(t.id))
        }
        function x(e) {
          f(t.id === e)
        }
      }
      var Q = o(59064),
        Y = o(68335)
      var Z = o(86956)
      const J = { sortField: 'modified', sortDirection: 1 },
        X = (function (e) {
          const { paddingTop: t = 0, paddingBottom: o = 0 } = e
          return (0, n.forwardRef)(({ style: e, ...r }, i) => {
            const { height: a = 0 } = e
            return n.createElement('div', {
              ref: i,
              style: { ...e, height: ((0, F.isNumber)(a) ? a : parseFloat(a)) + t + o + 'px' },
              ...r,
            })
          })
        })({ paddingBottom: 6 })
      function ee(e) {
        let t
        try {
          t = (0, W.getTranslatedResolution)(e)
        } catch (o) {
          t = e
        }
        return t
      }
      function te(e) {
        const { charts: t, onClose: o, favoriteChartsService: r, chartWidgetCollection: u } = e,
          [d, m] = (0, n.useState)(''),
          [h, f] = (0, n.useState)(d),
          [v, g] = (0, n.useState)([]),
          p = (0, n.useRef)(null),
          [C, y] = (0, n.useState)(() => r.get()),
          [x, F] = (0, n.useState)(() => c.getJSON('loadChartDialog.viewState', J)),
          k = (0, n.useRef)(null),
          M = (0, n.useRef)(null),
          T = (0, n.useMemo)(() => t.map(e => ({ ...e, description: `${e.symbol}, ${ee(e.interval)}` })), [t])
        ;(0, n.useEffect)(() => {
          l.CheckMobile.any() || (0, i.ensureNotNull)(k.current).focus()
        }, [])
        const N = (0, n.useRef)()
        ;(0, n.useEffect)(
          () => (
            (N.current = setTimeout(() => {
              m(h)
            }, 300)),
            () => {
              clearTimeout(N.current)
            }
          ),
          [h],
        ),
          (0, n.useEffect)(
            () => (
              r.getOnChange().subscribe(null, H),
              () => {
                r.getOnChange().unsubscribe(null, H)
              }
            ),
            [],
          )
        const O = (0, n.useCallback)(() => !0, []),
          L = (0, n.useMemo)(() => {
            return (0, U.rankedSearch)({
              data: T.filter(e => !v.includes(e.id)).sort(
                ((e = x.sortDirection),
                (t, o) => {
                  if (C[t.id] && !C[o.id]) return -1
                  if (!C[t.id] && C[o.id]) return 1
                  const n = 0 === e ? 1 : -1
                  return 'modified' === x.sortField ? n * (t.modified - o.modified) : n * t.title.localeCompare(o.title)
                }),
              ),
              rules: (0, U.createRegExpList)(d),
              queryString: d,
              primaryKey: 'title',
              secondaryKey: 'description',
            })
            var e
          }, [d, x, v, C]),
          {
            selectedItemIndex: R,
            setSelectedItemIndex: I,
            handleKeyboardSelection: P,
          } = (function (e, t, o) {
            const [r, i] = (0, n.useState)(-1)
            return (
              (0, n.useEffect)(() => {
                var e
                ;-1 !== r && (null === (e = o.current) || void 0 === e || e.scrollToItem(r))
              }, [r]),
              {
                selectedItemIndex: r,
                setSelectedItemIndex: i,
                handleKeyboardSelection: function (o) {
                  switch ((0, Y.hashFromEvent)(o)) {
                    case 40:
                      if (r === e - 1) return
                      i(r + 1)
                      break
                    case 38:
                      if (0 === r) return
                      if (-1 === r) return void i(r + 1)
                      i(r - 1)
                      break
                    case 13:
                      t(o)
                  }
                },
              }
            )
          })(
            L.length,
            function (e) {
              const t = L[R]
              if (-1 === R || !t) return
              0
              t.openAction(), !1
            },
            M,
          )
        return n.createElement(s.AdaptivePopupDialog, {
          ref: p,
          onClose: o,
          onClickOutside: o,
          onKeyDown: P,
          isOpened: !0,
          className: Z.dialog,
          title: (0, a.t)('Load layout'),
          dataName: 'load-layout-dialog',
          render: function () {
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(b.DialogSearch, { reference: k, onChange: W, placeholder: (0, a.t)('Search') }),
              n.createElement(
                w,
                null,
                n.createElement(D, { title: (0, a.t)('Layout name') }),
                n.createElement(
                  E,
                  {
                    sortDirection: x.sortDirection,
                    title: (0, a.t)('Sort by layout name, date changed'),
                    'data-name': 'load-chart-dialog-sort-button',
                  },
                  n.createElement(S, {
                    label: (0, a.t)('Layout name (A to Z)'),
                    listSortField: x.sortField,
                    itemSortField: 'title',
                    listSortDirection: x.sortDirection,
                    itemSortDirection: 0,
                    onClick: _,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  n.createElement(S, {
                    label: (0, a.t)('Layout name (Z to A)'),
                    listSortField: x.sortField,
                    itemSortField: 'title',
                    listSortDirection: x.sortDirection,
                    itemSortDirection: 1,
                    onClick: _,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  n.createElement(S, {
                    label: (0, a.t)('Date modified (oldest first)'),
                    listSortField: x.sortField,
                    itemSortField: 'modified',
                    listSortDirection: x.sortDirection,
                    itemSortDirection: 0,
                    onClick: _,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                  n.createElement(S, {
                    label: (0, a.t)('Date modified (newest first)'),
                    listSortField: x.sortField,
                    itemSortField: 'modified',
                    listSortDirection: x.sortDirection,
                    itemSortDirection: 1,
                    onClick: _,
                    'data-name': 'load-chart-dialog-sort-menu-item',
                  }),
                ),
              ),
              n.createElement(A, {
                scrollbar: 'native',
                reference: M,
                itemCount: L.length,
                itemSize: 52,
                className: Z.contentList,
                onScroll: z,
                innerElementType: X,
                itemKey: e => (C[L[e].id] ? 'f_' : '') + L[e].id,
                children: ({ style: e, index: t }) =>
                  n.createElement(
                    'div',
                    { style: e },
                    n.createElement($, {
                      chart: L[t],
                      onClose: o,
                      chartWidgetCollection: u,
                      trackEvent: B,
                      onRemoveCanceled: q,
                      localFavorites: C,
                      searchString: d,
                      onClickRemove: j,
                      isSelected: t === R,
                    }),
                  ),
              }),
            )
          },
          forceCloseOnEsc: O,
        })
        function z() {
          Q.globalCloseDelegate.fire()
        }
        function W(e) {
          const t = e.currentTarget.value
          f(t), I(-1)
        }
        function B(e) {
          0
        }
        function j(e) {
          g([e, ...v])
        }
        function H(e) {
          y(e)
        }
        function q() {
          ;(0, i.ensureNotNull)(p.current).focus()
        }
        function _(e, t) {
          const o = { sortField: e, sortDirection: t }
          F(o), c.setValue('loadChartDialog.viewState', JSON.stringify(o), { forceFlush: !0 }), B()
        }
      }
      var oe = o(22729)
      class ne extends oe.DialogRenderer {
        constructor(e) {
          super(), (this._options = e)
        }
        show() {
          r.render(n.createElement(te, { ...this._options, onClose: () => this.hide() }), this._container),
            this._setVisibility(!0)
        }
        hide() {
          r.unmountComponentAtNode(this._container), this._setVisibility(!1)
        }
      }
    },
    39640: (e, t, o) => {
      'use strict'
      function n(e, t, o, n, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== o && null !== t && null !== i && i.ownerDocument === n && (t.contains(i) || o(r))
        }
        return (
          r.click && n.addEventListener('click', i, !1),
          r.mouseDown && n.addEventListener('mousedown', i, !1),
          r.touchEnd && n.addEventListener('touchend', i, !1),
          r.touchStart && n.addEventListener('touchstart', i, !1),
          () => {
            n.removeEventListener('click', i, !1),
              n.removeEventListener('mousedown', i, !1),
              n.removeEventListener('touchend', i, !1),
              n.removeEventListener('touchstart', i, !1)
          }
        )
      }
      o.d(t, { addOutsideEventListener: () => n })
    },
    69654: (e, t, o) => {
      'use strict'
      o.d(t, { DialogSearch: () => u })
      var n = o(59496),
        r = o(97754),
        i = o.n(r),
        a = o(28353),
        c = o(9745),
        l = o(5639),
        s = o(28712)
      function u(e) {
        const { children: t, renderInput: o, onCancel: r, ...u } = e
        return n.createElement(
          'div',
          { className: s.container },
          n.createElement(
            'div',
            { className: i()(s.inputContainer, r && s.withCancel) },
            o || n.createElement(d, { ...u }),
          ),
          t,
          n.createElement(c.Icon, { className: s.icon, icon: l }),
          r && n.createElement('div', { className: s.cancel, onClick: r }, (0, a.t)('Cancel')),
        )
      }
      function d(e) {
        const {
          className: t,
          reference: o,
          value: r,
          onChange: a,
          onFocus: c,
          onBlur: l,
          onKeyDown: u,
          onSelect: d,
          placeholder: m,
          ...h
        } = e
        return n.createElement('input', {
          ...h,
          ref: o,
          type: 'text',
          className: i()(t, s.input),
          autoComplete: 'off',
          'data-role': 'search',
          placeholder: m,
          value: r,
          onChange: a,
          onFocus: c,
          onBlur: l,
          onSelect: d,
          onKeyDown: u,
        })
      }
    },
    19785: (e, t, o) => {
      'use strict'
      o.d(t, { rankedSearch: () => r, createRegExpList: () => i, getHighlightedChars: () => a })
      var n = o(80643)
      function r(e) {
        const {
          data: t,
          rules: o,
          queryString: r,
          isPreventedFromFiltering: i,
          primaryKey: a,
          secondaryKey: c = a,
          optionalPrimaryKey: l,
        } = e
        return t
          .map(e => {
            const t = l && e[l] ? e[l] : e[a],
              i = e[c]
            let s,
              u = 0
            return (
              o.forEach(e => {
                var o, a, c, l
                const { re: d, fullMatch: m } = e
                return (
                  (d.lastIndex = 0),
                  t && t.toLowerCase() === r.toLowerCase()
                    ? ((u = 3), void (s = null === (o = t.match(m)) || void 0 === o ? void 0 : o.index))
                    : (0, n.isString)(t) && m.test(t)
                    ? ((u = 2), void (s = null === (a = t.match(m)) || void 0 === a ? void 0 : a.index))
                    : (0, n.isString)(i) && m.test(i)
                    ? ((u = 1), void (s = null === (c = i.match(m)) || void 0 === c ? void 0 : c.index))
                    : void (
                        (0, n.isString)(i) &&
                        d.test(i) &&
                        ((u = 1), (s = null === (l = i.match(d)) || void 0 === l ? void 0 : l.index))
                      )
                )
              }),
              { matchPriority: u, matchIndex: s, item: e }
            )
          })
          .filter(e => i || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1
            if (e.matchPriority > t.matchPriority) return -1
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0
              if (e.matchIndex > t.matchIndex) return 1
              if (e.matchIndex < t.matchIndex) return -1
            }
            return 0
          })
          .map(({ item: e }) => e)
      }
      function i(e, t) {
        const o = [],
          n = e.toLowerCase(),
          r =
            e
              .split('')
              .map((e, t) => `(${0 !== t ? '[/\\s-]' + c(e) : c(e)})`)
              .join('(.*?)') + '(.*)'
        return (
          o.push({
            fullMatch: new RegExp(`(${c(e)})`, 'i'),
            re: new RegExp('^' + r, 'i'),
            reserveRe: new RegExp(r, 'i'),
            fuzzyHighlight: !0,
          }),
          t && t.hasOwnProperty(n) && o.push({ fullMatch: t[n], re: t[n], fuzzyHighlight: !1 }),
          o
        )
      }
      function a(e, t, o) {
        const n = []
        return e && o
          ? (o.forEach(e => {
              const { fullMatch: o, re: r, reserveRe: i } = e
              ;(o.lastIndex = 0), (r.lastIndex = 0)
              const a = o.exec(t),
                c = a || r.exec(t) || (i && i.exec(t))
              if (((e.fuzzyHighlight = !a), c))
                if (e.fuzzyHighlight) {
                  let e = c.index
                  for (let t = 1; t < c.length; t++) {
                    const o = c[t],
                      r = c[t].length
                    if (t % 2) {
                      const t = o.startsWith(' ') || o.startsWith('/') || o.startsWith('-')
                      n[t ? e + 1 : e] = !0
                    }
                    e += r
                  }
                } else for (let e = 0; e < c[0].length; e++) n[c.index + e] = !0
            }),
            n)
          : n
      }
      function c(e) {
        return e.replace(/[!-/[-^{-}]/g, '\\$&')
      }
    },
    24637: (e, t, o) => {
      'use strict'
      o.d(t, { HighlightedText: () => c })
      var n = o(59496),
        r = o(97754),
        i = o(19785),
        a = o(81524)
      function c(e) {
        const { queryString: t, rules: o, text: c, className: l } = e,
          s = (0, n.useMemo)(() => (0, i.getHighlightedChars)(t, c, o), [t, o, c])
        return n.createElement(
          n.Fragment,
          null,
          s.length
            ? c
                .split('')
                .map((e, t) =>
                  n.createElement(
                    n.Fragment,
                    { key: t },
                    s[t]
                      ? n.createElement('span', { className: r(a.highlighted, l) }, e)
                      : n.createElement('span', null, e),
                  ),
                )
            : c,
        )
      }
    },
    16396: (e, t, o) => {
      'use strict'
      o.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => s, PopupMenuItem: () => m })
      var n = o(59496),
        r = o(97754),
        i = o(59064),
        a = o(51768),
        c = o(90186),
        l = o(23576)
      const s = l
      function u(e) {
        const { reference: t, ...o } = e,
          r = { ...o, ref: t }
        return n.createElement(e.href ? 'a' : 'div', r)
      }
      function d(e) {
        e.stopPropagation()
      }
      function m(e) {
        const {
            id: t,
            role: o,
            'aria-selected': s,
            className: m,
            title: h,
            labelRowClassName: f,
            labelClassName: v,
            shortcut: g,
            forceShowShortcuts: p,
            icon: E,
            isActive: C,
            isDisabled: y,
            isHovered: S,
            appearAsDisabled: b,
            label: x,
            link: w,
            showToolboxOnHover: D,
            target: F,
            rel: k,
            toolbox: M,
            reference: T,
            onMouseOut: N,
            onMouseOver: O,
            suppressToolboxClick: L = !0,
            theme: R = l,
          } = e,
          I = (0, c.filterDataProps)(e),
          A = (0, n.useRef)(null)
        return n.createElement(
          u,
          {
            ...I,
            id: t,
            role: o,
            'aria-selected': s,
            className: r(m, R.item, E && R.withIcon, { [R.isActive]: C, [R.isDisabled]: y || b, [R.hovered]: S }),
            title: h,
            href: w,
            target: F,
            rel: k,
            reference: function (e) {
              ;(A.current = e), 'function' == typeof T && T(e)
              'object' == typeof T && (T.current = e)
            },
            onClick: function (t) {
              const { dontClosePopup: o, onClick: n, onClickArg: r, trackEventObject: c } = e
              if (y) return
              c && (0, a.trackEvent)(c.category, c.event, c.label)
              n && n(r, t)
              o || (0, i.globalCloseMenu)()
            },
            onContextMenu: function (t) {
              const { trackEventObject: o, trackRightClick: n } = e
              o && n && (0, a.trackEvent)(o.category, o.event, o.label + '_rightClick')
            },
            onMouseUp: function (t) {
              const { trackEventObject: o, trackMouseWheelClick: n } = e
              if (1 === t.button && w && o) {
                let e = o.label
                n && (e += '_mouseWheelClick'), (0, a.trackEvent)(o.category, o.event, e)
              }
            },
            onMouseOver: O,
            onMouseOut: N,
          },
          void 0 !== E && n.createElement('div', { className: R.icon, dangerouslySetInnerHTML: { __html: E } }),
          n.createElement(
            'div',
            { className: r(R.labelRow, f) },
            n.createElement('div', { className: r(R.label, v) }, x),
          ),
          (void 0 !== g || p) && n.createElement('div', { className: R.shortcut }, (P = g) && P.split('+').join(' + ')),
          void 0 !== M &&
            n.createElement('div', { onClick: L ? d : void 0, className: r(R.toolbox, { [R.showOnHover]: D }) }, M),
        )
        var P
      }
    },
    50628: (e, t, o) => {
      'use strict'
      o.d(t, { PopupMenu: () => s })
      var n = o(59496),
        r = o(87995),
        i = o(65718),
        a = o(27317),
        c = o(29197),
        l = o(58095)
      function s(e) {
        const {
            controller: t,
            children: o,
            isOpened: s,
            closeOnClickOutside: u = !0,
            doNotCloseOn: d,
            onClickOutside: m,
            onClose: h,
            ...f
          } = e,
          v = (0, n.useContext)(c.CloseDelegateContext),
          g = (0, l.useOutsideEvent)({
            handler: function (e) {
              m && m(e)
              if (!u) return
              if (d && e.target instanceof Node) {
                const t = r.findDOMNode(d)
                if (t instanceof Node && t.contains(e.target)) return
              }
              h()
            },
            mouseDown: !0,
            touchStart: !0,
          })
        return s
          ? n.createElement(
              i.Portal,
              { top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' },
              n.createElement(
                'span',
                { ref: g, style: { pointerEvents: 'auto' } },
                n.createElement(
                  a.Menu,
                  {
                    ...f,
                    onClose: h,
                    onScroll: function (t) {
                      const { onScroll: o } = e
                      o && o(t)
                    },
                    customCloseDelegate: v,
                    ref: t,
                  },
                  o,
                ),
              ),
            )
          : null
      }
    },
    46185: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 7v13.5M4.5 16.5l4 4 4-4"/></svg>'
    },
    26659: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 20.5V7M12.5 11l-4-4-4 4"/></svg>'
    },
    5639: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>'
    },
  },
])
