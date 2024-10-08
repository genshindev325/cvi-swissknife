;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9811],
  {
    96746: e => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 428px)',
      }
    },
    67179: e => {
      e.exports = { dialog: 'dialog-HExheUfY', wrapper: 'wrapper-HExheUfY', separator: 'separator-HExheUfY' }
    },
    89185: e => {
      e.exports = {
        itemRow: 'itemRow-9Sl1Rwzy',
        favoriteButton: 'favoriteButton-9Sl1Rwzy',
        active: 'active-9Sl1Rwzy',
        selected: 'selected-9Sl1Rwzy',
        mobile: 'mobile-9Sl1Rwzy',
        itemInfo: 'itemInfo-9Sl1Rwzy',
        title: 'title-9Sl1Rwzy',
        details: 'details-9Sl1Rwzy',
        itemInfoWithPadding: 'itemInfoWithPadding-9Sl1Rwzy',
        favorite: 'favorite-9Sl1Rwzy',
        removeButton: 'removeButton-9Sl1Rwzy',
      }
    },
    91441: e => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        container: 'container-tuOy5zvD',
        unsetAlign: 'unsetAlign-tuOy5zvD',
        title: 'title-tuOy5zvD',
        subtitle: 'subtitle-tuOy5zvD',
        ellipsis: 'ellipsis-tuOy5zvD',
        close: 'close-tuOy5zvD',
      }
    },
    97623: e => {
      e.exports = { scrollWrap: 'scrollWrap-9M00JHkT' }
    },
    62230: e => {
      e.exports = {
        wrap: 'wrap-Shy8LdqT',
        'wrap--horizontal': 'wrap--horizontal-Shy8LdqT',
        bar: 'bar-Shy8LdqT',
        barInner: 'barInner-Shy8LdqT',
        'barInner--horizontal': 'barInner--horizontal-Shy8LdqT',
        'bar--horizontal': 'bar--horizontal-Shy8LdqT',
      }
    },
    16842: e => {
      e.exports = {
        favorite: 'favorite-JVQQsDQk',
        disabled: 'disabled-JVQQsDQk',
        active: 'active-JVQQsDQk',
        checked: 'checked-JVQQsDQk',
      }
    },
    91626: e => {
      e.exports = { separator: 'separator-jtAq6E4V' }
    },
    73432: e => {
      e.exports = {
        button: 'button-SD4Dbbwd',
        disabled: 'disabled-SD4Dbbwd',
        active: 'active-SD4Dbbwd',
        hidden: 'hidden-SD4Dbbwd',
      }
    },
    24437: (e, t, n) => {
      'use strict'
      n.d(t, { DialogBreakpoints: () => o })
      var r = n(96746)
      const o = {
        SmallHeight: r['small-height-breakpoint'],
        TabletSmall: r['tablet-small-breakpoint'],
        TabletNormal: r['tablet-normal-breakpoint'],
      }
    },
    85457: (e, t, n) => {
      'use strict'
      n.d(t, { AdaptivePopupDialog: () => D })
      var r = n(59496),
        o = n(88537)
      var i = n(97754),
        l = n.n(i),
        s = n(68335),
        a = n(35749),
        c = n(63016),
        u = n(1109),
        d = n(24437),
        h = n(90692),
        v = n(95711),
        m = n(52092),
        p = n(76422),
        f = n(9745)
      const g = r.createContext({ setHideClose: () => {} })
      var b = n(37257),
        w = n(91441)
      function E(e) {
        const {
            title: t,
            subtitle: n,
            showCloseIcon: o = !0,
            onClose: i,
            renderBefore: s,
            renderAfter: a,
            draggable: c,
            className: u,
            unsetAlign: d,
          } = e,
          [h, v] = (0, r.useState)(!1)
        return r.createElement(
          g.Provider,
          { value: { setHideClose: v } },
          r.createElement(
            'div',
            { className: l()(w.container, u, (n || d) && w.unsetAlign) },
            s,
            r.createElement(
              'div',
              { 'data-dragg-area': c, className: w.title },
              r.createElement('div', { className: w.ellipsis }, t),
              n && r.createElement('div', { className: l()(w.ellipsis, w.subtitle) }, n),
            ),
            a,
            o &&
              !h &&
              r.createElement(f.Icon, {
                className: w.close,
                icon: b,
                onClick: i,
                'data-name': 'close',
                'data-role': 'button',
              }),
          ),
        )
      }
      var C = n(67179)
      const N = { vertical: 20 },
        S = { vertical: 0 }
      class D extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = e => (this._reference = e)),
            (this._handleClose = () => {
              this.props.onClose()
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(this.props.fullScreen || window.matchMedia(d.DialogBreakpoints.TabletSmall).matches)
            }),
            (this._handleKeyDown = e => {
              var t
              if (!e.defaultPrevented)
                switch ((this.props.onKeyDown && this.props.onKeyDown(e), (0, s.hashFromEvent)(e))) {
                  case 27:
                    if (e.defaultPrevented) return
                    if (this.props.forceCloseOnEsc && this.props.forceCloseOnEsc()) return void this._handleClose()
                    const { activeElement: n } = document,
                      r = (0, o.ensureNotNull)(this._reference)
                    if (null !== n) {
                      if (
                        (e.preventDefault(),
                        'true' === (t = n).getAttribute('data-haspopup') && 'true' !== t.getAttribute('data-expanded'))
                      )
                        return void this._handleClose()
                      if ((0, a.isTextEditingField)(n)) return void r.focus()
                      if (r.contains(n)) return void this._handleClose()
                    }
                }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds()
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit()
            })
        }
        componentDidMount() {
          var e, t
          p.subscribe(m.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia('(orientation: portrait)')),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener) ? e.addEventListener('change', t) : e.addListener(t))
        }
        componentWillUnmount() {
          var e, t
          p.unsubscribe(m.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener) ? e.removeEventListener('change', t) : e.removeListener(t))
        }
        focus() {
          ;(0, o.ensureNotNull)(this._reference).focus()
        }
        getElement() {
          return this._reference
        }
        contains(e) {
          var t, n
          return (
            null !== (n = null === (t = this._reference) || void 0 === t ? void 0 : t.contains(e)) && void 0 !== n && n
          )
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: n,
              isOpened: o,
              title: i,
              dataName: s,
              onClickOutside: a,
              additionalElementPos: m,
              additionalHeaderElement: p,
              backdrop: f,
              shouldForceFocus: g = !0,
              showSeparator: b,
              subtitle: w,
              draggable: D = !0,
              fullScreen: z = !1,
              showCloseIcon: _ = !0,
              rounded: k = !0,
              isAnimationEnabled: y,
              growPoint: L,
              dialogTooltip: x,
              unsetHeaderAlign: P,
              onDragStart: O,
              dataDialogName: M,
            } = this.props,
            R = 'after' !== m ? p : void 0,
            A = 'after' === m ? p : void 0,
            B = 'string' == typeof i ? i : M || ''
          return r.createElement(h.MatchMedia, { rule: d.DialogBreakpoints.SmallHeight }, m =>
            r.createElement(h.MatchMedia, { rule: d.DialogBreakpoints.TabletSmall }, d =>
              r.createElement(
                c.PopupDialog,
                {
                  rounded: !(d || z) && k,
                  className: l()(C.dialog, e),
                  isOpened: o,
                  reference: this._handleReference,
                  onKeyDown: this._handleKeyDown,
                  onClickOutside: a,
                  onClickBackdrop: a,
                  fullscreen: d || z,
                  guard: m ? S : N,
                  boundByScreen: d || z,
                  shouldForceFocus: g,
                  backdrop: f,
                  draggable: D,
                  isAnimationEnabled: y,
                  growPoint: L,
                  name: this.props.dataName,
                  dialogTooltip: x,
                  onDragStart: O,
                },
                r.createElement(
                  'div',
                  { className: l()(C.wrapper, t), 'data-name': s, 'data-dialog-name': B },
                  void 0 !== i &&
                    r.createElement(E, {
                      draggable: D && !(d || z),
                      onClose: this._handleClose,
                      renderAfter: A,
                      renderBefore: R,
                      subtitle: w,
                      title: i,
                      showCloseIcon: _,
                      className: n,
                      unsetAlign: P,
                    }),
                  b && r.createElement(u.Separator, { className: C.separator }),
                  r.createElement(v.PopupContext.Consumer, null, e => this._renderChildren(e, d || z)),
                ),
              ),
            ),
          )
        }
      }
    },
    64530: (e, t, n) => {
      'use strict'
      n.d(t, { DialogContentItem: () => d })
      var r = n(59496),
        o = n(97754),
        i = n.n(o),
        l = n(49483),
        s = n(36189),
        a = n(96040)
      function c(e) {
        const { url: t, ...n } = e
        return t ? r.createElement('a', { ...n, href: t }) : r.createElement('div', { ...n })
      }
      var u = n(89185)
      function d(e) {
        const {
          title: t,
          subtitle: n,
          removeBtnLabel: o,
          onClick: d,
          onClickFavorite: v,
          onClickRemove: m,
          isActive: p,
          isSelected: f,
          isFavorite: g,
          isMobile: b = !1,
          showFavorite: w = !0,
          ...E
        } = e
        return r.createElement(
          c,
          {
            ...E,
            className: i()(u.itemRow, p && !f && u.active, b && u.mobile, f && u.selected),
            onClick: h.bind(null, d),
            'data-role': 'list-item',
            'data-active': p,
          },
          w &&
            v &&
            r.createElement(s.FavoriteButton, {
              className: i()(u.favoriteButton, g && u.favorite, l.CheckMobile.any() && u.mobile),
              isActive: p && !f,
              isFilled: g,
              onClick: h.bind(null, v),
              'data-name': 'list-item-favorite-button',
              'data-favorite': g,
            }),
          r.createElement(
            'div',
            { className: i()(u.itemInfo, !w && u.itemInfoWithPadding) },
            r.createElement(
              'div',
              { className: i()(u.title, p && !f && u.active, b && u.mobile), 'data-name': 'list-item-title' },
              t,
            ),
            r.createElement('div', { className: i()(u.details, p && !f && u.active, b && u.mobile) }, n),
          ),
          r.createElement(a.RemoveButton, {
            className: u.removeButton,
            isActive: p && !f,
            onClick: h.bind(null, m),
            'data-name': 'list-item-remove-button',
            title: o,
          }),
        )
      }
      function h(e, t) {
        t.defaultPrevented || (t.preventDefault(), e(t))
      }
    },
    3085: (e, t, n) => {
      'use strict'
      n.d(t, { OverlayScrollContainer: () => v })
      var r = n(59496),
        o = n(97754),
        i = n.n(o),
        l = n(88537),
        s = n(64514),
        a = n(62820)
      const c = n(62230)
      function u(e) {
        const {
            size: t,
            scrollSize: n,
            clientSize: o,
            scrollProgress: u,
            onScrollProgressChange: d,
            horizontal: h,
            theme: v = c,
            onDragStart: m,
            onDragEnd: p,
            minBarSize: f = 40,
          } = e,
          g = (0, r.useRef)(null),
          b = (0, r.useRef)(null),
          [w, E] = (0, r.useState)(!1),
          C = (0, r.useRef)(0)
        ;(0, r.useEffect)(() => {
          const e = (0, l.ensureNotNull)(g.current).ownerDocument
          return (
            w ? (m && m(), e && (e.addEventListener('mousemove', k), e.addEventListener('mouseup', y))) : p && p(),
            () => {
              e && (e.removeEventListener('mousemove', k), e.removeEventListener('mouseup', y))
            }
          )
        }, [w])
        const N = t / n || 0,
          S = o * N || 0,
          D = Math.max(S, f),
          z = (t - D) / (t - S),
          _ = (function (e) {
            if ((0, a.isRtl)() && h) return e - n + o
            return e
          })((0, s.clamp)(u, 0, n - t))
        return r.createElement(
          'div',
          {
            ref: g,
            className: i()(v.wrap, h && v['wrap--horizontal']),
            style: { [h ? 'width' : 'height']: t },
            onMouseDown: function (e) {
              if (e.isDefaultPrevented()) return
              e.preventDefault()
              const r = (0, l.ensureNotNull)(b.current).getBoundingClientRect()
              C.current = (h ? r.width : r.height) / 2
              const o = n - t
              let i = L(e.nativeEvent, (0, l.ensureNotNull)(g.current)) - C.current
              i < 0
                ? ((i = 0), (C.current = L(e.nativeEvent, (0, l.ensureNotNull)(g.current))))
                : i > o * N * z &&
                  ((i = o * N * z), (C.current = L(e.nativeEvent, (0, l.ensureNotNull)(g.current)) - i))
              d(i / N / z), E(!0)
            },
          },
          r.createElement(
            'div',
            {
              ref: b,
              className: i()(v.bar, h && v['bar--horizontal']),
              style: {
                [h ? 'minWidth' : 'minHeight']: f,
                [h ? 'width' : 'height']: D,
                transform: `translate${h ? 'X' : 'Y'}(${_ * N * z || 0}px)`,
              },
              onMouseDown: function (e) {
                e.preventDefault(), (C.current = L(e.nativeEvent, (0, l.ensureNotNull)(b.current))), E(!0)
              },
            },
            r.createElement('div', { className: i()(v.barInner, h && v['barInner--horizontal']) }),
          ),
        )
        function k(e) {
          const t = L(e, (0, l.ensureNotNull)(g.current)) - C.current
          d(t / N / z)
        }
        function y(e) {
          E(!1)
        }
        function L(e, t) {
          const n = t.getBoundingClientRect()
          return h ? e.clientX - n.left : e.clientY - n.top
        }
      }
      var d = n(70412),
        h = n(97623)
      function v(e) {
        const {
            reference: t,
            className: n,
            containerHeight: i = 0,
            containerWidth: l = 0,
            contentHeight: s = 0,
            contentWidth: a = 0,
            scrollPosTop: c = 0,
            scrollPosLeft: v = 0,
            onVerticalChange: m,
            onHorizontalChange: p,
            visible: f,
          } = e,
          [g, b] = (0, d.useHover)(),
          [w, E] = (0, r.useState)(!1),
          C = i < s,
          N = l < a,
          S = C && N ? 8 : 0
        return r.createElement(
          'div',
          { ...b, ref: t, className: o(n, h.scrollWrap), style: { visibility: f || g || w ? 'visible' : 'hidden' } },
          C &&
            r.createElement(u, {
              size: i - S,
              scrollSize: s - S,
              clientSize: i - S,
              scrollProgress: c,
              onScrollProgressChange: function (e) {
                m && m(e)
              },
              onDragStart: D,
              onDragEnd: z,
            }),
          N &&
            r.createElement(u, {
              size: l - S,
              scrollSize: a - S,
              clientSize: l - S,
              scrollProgress: v,
              onScrollProgressChange: function (e) {
                p && p(e)
              },
              onDragStart: D,
              onDragEnd: z,
              horizontal: !0,
            }),
        )
        function D() {
          E(!0)
        }
        function z() {
          E(!1)
        }
      }
    },
    36189: (e, t, n) => {
      'use strict'
      n.d(t, { FavoriteButton: () => d })
      var r = n(28353),
        o = n(59496),
        i = n(97754),
        l = n(9745),
        s = n(20614),
        a = n(55783),
        c = n(16842)
      const u = { add: (0, r.t)('Add to favorites'), remove: (0, r.t)('Remove from favorites') }
      function d(e) {
        const { className: t, isFilled: n, isActive: r, onClick: d, ...h } = e
        return o.createElement(l.Icon, {
          ...h,
          className: i(c.favorite, 'apply-common-tooltip', n && c.checked, r && c.active, t),
          icon: n ? s : a,
          onClick: d,
          title: n ? u.remove : u.add,
        })
      }
    },
    898: (e, t, n) => {
      'use strict'
      n.d(t, { useDimensions: () => o })
      var r = n(59496)
      function o() {
        const [e, t] = (0, r.useState)(null)
        return [
          (0, r.useCallback)(
            n => {
              ;(n.width === (null == e ? void 0 : e.width) && n.height === e.height) || t(n)
            },
            [e],
          ),
          e,
        ]
      }
    },
    70412: (e, t, n) => {
      'use strict'
      n.d(t, { hoverMouseEventFilter: () => i, useAccurateHover: () => l, useHover: () => o })
      var r = n(59496)
      function o() {
        const [e, t] = (0, r.useState)(!1)
        return [
          e,
          {
            onMouseOver: function (e) {
              i(e) && t(!0)
            },
            onMouseOut: function (e) {
              i(e) && t(!1)
            },
          },
        ]
      }
      function i(e) {
        return !e.currentTarget.contains(e.relatedTarget)
      }
      function l(e) {
        const [t, n] = (0, r.useState)(!1)
        return (
          (0, r.useEffect)(() => {
            const t = t => {
              if (null === e.current) return
              const r = e.current.contains(t.target)
              n(r)
            }
            return document.addEventListener('mouseover', t), () => document.removeEventListener('mouseover', t)
          }, []),
          t
        )
      }
    },
    33127: (e, t, n) => {
      'use strict'
      n.d(t, { useOverlayScroll: () => a })
      var r = n(59496),
        o = n(88537),
        i = n(70412),
        l = n(49483)
      const s = { onMouseOver: () => {}, onMouseOut: () => {} }
      function a(e, t = l.CheckMobile.any()) {
        const n = (0, r.useRef)(null),
          a = e || (0, r.useRef)(null),
          [c, u] = (0, i.useHover)(),
          [d, h] = (0, r.useState)({
            reference: n,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: function (e) {
              h(t => ({ ...t, scrollPosTop: e })), ((0, o.ensureNotNull)(a.current).scrollTop = e)
            },
            onHorizontalChange: function (e) {
              h(t => ({ ...t, scrollPosLeft: e })), ((0, o.ensureNotNull)(a.current).scrollLeft = e)
            },
            visible: c,
          }),
          v = (0, r.useCallback)(() => {
            if (!a.current) return
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: r,
                clientWidth: o,
                scrollWidth: i,
                scrollLeft: l,
              } = a.current,
              s = n.current ? n.current.offsetTop : 0
            h(n => ({
              ...n,
              containerHeight: e - s,
              contentHeight: t - s,
              scrollPosTop: r,
              containerWidth: o,
              contentWidth: i,
              scrollPosLeft: l,
            }))
          }, [])
        function m() {
          h(e => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(a.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(a.current).scrollLeft,
          }))
        }
        return (
          (0, r.useEffect)(() => {
            c && v(), h(e => ({ ...e, visible: c }))
          }, [c]),
          (0, r.useEffect)(() => {
            const e = a.current
            return (
              e && e.addEventListener('scroll', m),
              () => {
                e && e.removeEventListener('scroll', m)
              }
            )
          }, [a]),
          [d, t ? s : u, a, v]
        )
      }
    },
    1109: (e, t, n) => {
      'use strict'
      n.d(t, { Separator: () => l })
      var r = n(59496),
        o = n(97754),
        i = n(91626)
      function l(e) {
        return r.createElement('div', { className: o(i.separator, e.className) })
      }
    },
    96040: (e, t, n) => {
      'use strict'
      n.d(t, { RemoveButton: () => u })
      var r = n(28353),
        o = n(59496),
        i = n(97754),
        l = n(9745),
        s = n(73366),
        a = n(73432)
      const c = { remove: (0, r.t)('Remove') }
      function u(e) {
        const {
          className: t,
          isActive: n,
          onClick: r,
          onMouseDown: u,
          title: d,
          hidden: h,
          'data-name': v = 'remove-button',
          ...m
        } = e
        return o.createElement(l.Icon, {
          ...m,
          'data-name': v,
          className: i(a.button, 'apply-common-tooltip', n && a.active, h && a.hidden, t),
          icon: s,
          onClick: r,
          onMouseDown: u,
          title: d || c.remove,
        })
      }
    },
    73366: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    37257: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
    20614: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    55783: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
