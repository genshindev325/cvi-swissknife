;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2077],
  {
    21103: e => {
      e.exports = {
        container: 'container-pgo9gj31',
        'intent-default': 'intent-default-pgo9gj31',
        focused: 'focused-pgo9gj31',
        readonly: 'readonly-pgo9gj31',
        disabled: 'disabled-pgo9gj31',
        'with-highlight': 'with-highlight-pgo9gj31',
        grouped: 'grouped-pgo9gj31',
        'adjust-position': 'adjust-position-pgo9gj31',
        'first-row': 'first-row-pgo9gj31',
        'first-col': 'first-col-pgo9gj31',
        stretch: 'stretch-pgo9gj31',
        'font-size-medium': 'font-size-medium-pgo9gj31',
        'font-size-large': 'font-size-large-pgo9gj31',
        'size-small': 'size-small-pgo9gj31',
        'size-medium': 'size-medium-pgo9gj31',
        'size-large': 'size-large-pgo9gj31',
        'intent-success': 'intent-success-pgo9gj31',
        'intent-warning': 'intent-warning-pgo9gj31',
        'intent-danger': 'intent-danger-pgo9gj31',
        'intent-primary': 'intent-primary-pgo9gj31',
        'border-none': 'border-none-pgo9gj31',
        'border-thin': 'border-thin-pgo9gj31',
        'border-thick': 'border-thick-pgo9gj31',
        'no-corner-top-left': 'no-corner-top-left-pgo9gj31',
        'no-corner-top-right': 'no-corner-top-right-pgo9gj31',
        'no-corner-bottom-right': 'no-corner-bottom-right-pgo9gj31',
        'no-corner-bottom-left': 'no-corner-bottom-left-pgo9gj31',
        highlight: 'highlight-pgo9gj31',
        shown: 'shown-pgo9gj31',
      }
    },
    10306: e => {
      e.exports = {
        'inner-slot': 'inner-slot-QpAAIiaV',
        interactive: 'interactive-QpAAIiaV',
        icon: 'icon-QpAAIiaV',
        'inner-middle-slot': 'inner-middle-slot-QpAAIiaV',
        'before-slot': 'before-slot-QpAAIiaV',
        'after-slot': 'after-slot-QpAAIiaV',
      }
    },
    66579: e => {
      e.exports = {
        input: 'input-uGWFLwEy',
        'with-start-slot': 'with-start-slot-uGWFLwEy',
        'with-end-slot': 'with-end-slot-uGWFLwEy',
      }
    },
    86605: e => {
      e.exports = {
        dialog: 'dialog-LHVt4Nih',
        dialogInner: 'dialogInner-LHVt4Nih',
        titleWrapper: 'titleWrapper-LHVt4Nih',
        title: 'title-LHVt4Nih',
        infoHint: 'infoHint-LHVt4Nih',
        form: 'form-LHVt4Nih',
        inputWrapper: 'inputWrapper-LHVt4Nih',
        input: 'input-LHVt4Nih',
        hint: 'hint-LHVt4Nih',
        error: 'error-LHVt4Nih',
      }
    },
    86332: (e, t, n) => {
      'use strict'
      n.d(t, { ControlGroupContext: () => o })
      const o = n(59496).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      })
    },
    95604: (e, t, n) => {
      'use strict'
      function o(e) {
        let t = 0
        return (
          (e.isTop && e.isLeft) || (t += 1),
          (e.isTop && e.isRight) || (t += 2),
          (e.isBottom && e.isLeft) || (t += 8),
          (e.isBottom && e.isRight) || (t += 4),
          t
        )
      }
      n.d(t, { getGroupCellRemoveRoundBorders: () => o })
    },
    67029: (e, t, n) => {
      'use strict'
      n.d(t, { ControlSkeleton: () => y, InputClasses: () => f })
      var o = n(59496),
        r = n(97754),
        i = n(88537),
        s = n(66092),
        l = n(90186),
        a = n(86332),
        u = n(95604)
      var c = n(21103),
        d = n.n(c)
      function p(e) {
        let t = ''
        return (
          0 !== e &&
            (1 & e && (t = r(t, d()['no-corner-top-left'])),
            2 & e && (t = r(t, d()['no-corner-top-right'])),
            4 & e && (t = r(t, d()['no-corner-bottom-right'])),
            8 & e && (t = r(t, d()['no-corner-bottom-left']))),
          t
        )
      }
      function g(e, t, n, o) {
        const {
            removeRoundBorder: i,
            className: s,
            intent: l = 'default',
            borderStyle: a = 'thin',
            size: c,
            highlight: g,
            disabled: h,
            readonly: f,
            stretch: m,
            noReadonlyStyles: v,
            isFocused: y,
          } = e,
          w = p(null != i ? i : (0, u.getGroupCellRemoveRoundBorders)(n))
        return r(
          d().container,
          d()['intent-' + l],
          d()['border-' + a],
          c && d()['size-' + c],
          w,
          g && d()['with-highlight'],
          h && d().disabled,
          f && !v && d().readonly,
          y && d().focused,
          m && d().stretch,
          t && d().grouped,
          !o && d()['adjust-position'],
          n.isTop && d()['first-row'],
          n.isLeft && d()['first-col'],
          s,
        )
      }
      function h(e, t) {
        const { highlight: n, highlightRemoveRoundBorder: o } = e
        if (!n) return d().highlight
        const i = p(null != o ? o : (0, u.getGroupCellRemoveRoundBorders)(t))
        return r(d().highlight, d().shown, i)
      }
      const f = {
          FontSizeMedium: (0, i.ensureDefined)(d()['font-size-medium']),
          FontSizeLarge: (0, i.ensureDefined)(d()['font-size-large']),
        },
        m = { passive: !1 }
      function v(e, t) {
        const {
            id: n,
            role: r,
            onFocus: i,
            onBlur: u,
            onMouseOver: c,
            onMouseOut: d,
            onMouseDown: p,
            onMouseUp: f,
            onKeyDown: v,
            onClick: y,
            tabIndex: w,
            startSlot: C,
            middleSlot: b,
            endSlot: E,
            onWheel: x,
            onWheelNoPassive: S = null,
          } = e,
          { isGrouped: M, cellState: _, disablePositionAdjustment: N = !1 } = (0, o.useContext)(a.ControlGroupContext),
          D = (function (e, t = null, n) {
            const r = (0, o.useRef)(null),
              i = (0, o.useRef)(null),
              s = (0, o.useCallback)(() => {
                if (null === r.current || null === i.current) return
                const [e, t, n] = i.current
                null !== t && r.current.addEventListener(e, t, n)
              }, []),
              l = (0, o.useCallback)(() => {
                if (null === r.current || null === i.current) return
                const [e, t, n] = i.current
                null !== t && r.current.removeEventListener(e, t, n)
              }, []),
              a = (0, o.useCallback)(e => {
                l(), (r.current = e), s()
              }, [])
            return (0, o.useEffect)(() => ((i.current = [e, t, n]), s(), l), [e, t, n]), a
          })('wheel', S, m)
        return o.createElement(
          'span',
          {
            id: n,
            role: r,
            className: g(e, M, _, N),
            tabIndex: w,
            ref: (0, s.useMergedRefs)([t, D]),
            onFocus: i,
            onBlur: u,
            onMouseOver: c,
            onMouseOut: d,
            onMouseDown: p,
            onMouseUp: f,
            onKeyDown: v,
            onClick: y,
            onWheel: x,
            ...(0, l.filterDataProps)(e),
            ...(0, l.filterAriaProps)(e),
          },
          C,
          b,
          E,
          o.createElement('span', { className: h(e, _) }),
        )
      }
      v.displayName = 'ControlSkeleton'
      const y = o.forwardRef(v)
    },
    78274: (e, t, n) => {
      'use strict'
      n.d(t, { StartSlot: () => l, MiddleSlot: () => a, EndSlot: () => u, AfterSlot: () => c })
      var o = n(59496),
        r = n(97754),
        i = n(10306),
        s = n.n(i)
      function l(e) {
        const { className: t, interactive: n = !0, icon: i = !1, children: l } = e
        return o.createElement('span', { className: r(s()['inner-slot'], n && s().interactive, i && s().icon, t) }, l)
      }
      function a(e) {
        const { className: t, children: n } = e
        return o.createElement('span', { className: r(s()['inner-slot'], s()['inner-middle-slot'], t) }, n)
      }
      function u(e) {
        const { className: t, interactive: n = !0, icon: i = !1, children: l } = e
        return o.createElement('span', { className: r(s()['inner-slot'], n && s().interactive, i && s().icon, t) }, l)
      }
      function c(e) {
        const { className: t, children: n } = e
        return o.createElement('span', { className: r(s()['after-slot'], t) }, n)
      }
    },
    31261: (e, t, n) => {
      'use strict'
      n.d(t, { InputControl: () => y })
      var o = n(59496),
        r = n(97754),
        i = n(90186),
        s = n(47201),
        l = n(48907),
        a = n(66092),
        u = n(48027),
        c = n(29202),
        d = n(45812),
        p = n(67029),
        g = n(78274),
        h = n(66579),
        f = n.n(h)
      function m(e) {
        return !(0, i.isAriaAttribute)(e) && !(0, i.isDataAttribute)(e)
      }
      function v(e) {
        const {
            id: t,
            title: n,
            role: s,
            tabIndex: l,
            placeholder: a,
            name: u,
            type: c,
            value: d,
            defaultValue: h,
            draggable: v,
            autoComplete: y,
            autoFocus: w,
            maxLength: C,
            min: b,
            max: E,
            step: x,
            pattern: S,
            inputMode: M,
            onSelect: _,
            onFocus: N,
            onBlur: D,
            onKeyDown: I,
            onKeyUp: L,
            onKeyPress: R,
            onChange: O,
            onDragStart: j,
            size: k = 'medium',
            className: F,
            inputClassName: A,
            disabled: H,
            readonly: W,
            containerTabIndex: V,
            startSlot: z,
            endSlot: B,
            reference: P,
            containerReference: T,
            onContainerFocus: U,
            ...G
          } = e,
          K = (0, i.filterProps)(G, m),
          q = {
            ...(0, i.filterAriaProps)(G),
            ...(0, i.filterDataProps)(G),
            id: t,
            title: n,
            role: s,
            tabIndex: l,
            placeholder: a,
            name: u,
            type: c,
            value: d,
            defaultValue: h,
            draggable: v,
            autoComplete: y,
            autoFocus: w,
            maxLength: C,
            min: b,
            max: E,
            step: x,
            pattern: S,
            inputMode: M,
            onSelect: _,
            onFocus: N,
            onBlur: D,
            onKeyDown: I,
            onKeyUp: L,
            onKeyPress: R,
            onChange: O,
            onDragStart: j,
          }
        return o.createElement(p.ControlSkeleton, {
          ...K,
          disabled: H,
          readonly: W,
          tabIndex: V,
          className: r(f().container, F),
          size: k,
          ref: T,
          onFocus: U,
          startSlot: z,
          middleSlot: o.createElement(
            g.MiddleSlot,
            null,
            o.createElement('input', {
              ...q,
              className: r(f().input, A, z && f()['with-start-slot'], B && f()['with-end-slot']),
              disabled: H,
              readOnly: W,
              ref: P,
            }),
          ),
          endSlot: B,
        })
      }
      function y(e) {
        e = (0, u.useControl)(e)
        const {
            disabled: t,
            autoSelectOnFocus: n,
            tabIndex: r = 0,
            onFocus: i,
            onBlur: p,
            reference: g,
            containerReference: h = null,
          } = e,
          f = (0, o.useRef)(null),
          m = (0, o.useRef)(null),
          [y, w] = (0, c.useFocus)(),
          C = t ? void 0 : y ? -1 : r,
          b = t ? void 0 : y ? r : -1,
          { isMouseDown: E, handleMouseDown: x, handleMouseUp: S } = (0, d.useIsMouseDown)(),
          M = (0, s.createSafeMulticastEventHandler)(
            w.onFocus,
            function (e) {
              n && !E.current && (0, l.selectAllContent)(e.currentTarget)
            },
            i,
          ),
          _ = (0, s.createSafeMulticastEventHandler)(w.onBlur, p),
          N = (0, o.useCallback)(
            e => {
              ;(f.current = e), g && ('function' == typeof g && g(e), 'object' == typeof g && (g.current = e))
            },
            [f, g],
          )
        return o.createElement(v, {
          ...e,
          isFocused: y,
          containerTabIndex: C,
          tabIndex: b,
          onContainerFocus: function (e) {
            m.current === e.target && null !== f.current && f.current.focus()
          },
          onFocus: M,
          onBlur: _,
          reference: N,
          containerReference: (0, a.useMergedRefs)([m, h]),
          onMouseDown: x,
          onMouseUp: S,
        })
      }
    },
    48027: (e, t, n) => {
      'use strict'
      n.d(t, { useControl: () => i })
      var o = n(47201),
        r = n(29202)
      function i(e) {
        const { onFocus: t, onBlur: n, intent: i, highlight: s, disabled: l } = e,
          [a, u] = (0, r.useFocus)(void 0, l),
          c = (0, o.createSafeMulticastEventHandler)(l ? void 0 : u.onFocus, t),
          d = (0, o.createSafeMulticastEventHandler)(l ? void 0 : u.onBlur, n)
        return { ...e, intent: i || (a ? 'primary' : 'default'), highlight: null != s ? s : a, onFocus: c, onBlur: d }
      }
    },
    29202: (e, t, n) => {
      'use strict'
      n.d(t, { useFocus: () => r })
      var o = n(59496)
      function r(e, t) {
        const [n, r] = (0, o.useState)(!1)
        ;(0, o.useEffect)(() => {
          t && n && r(!1)
        }, [t, n])
        const i = {
          onFocus: (0, o.useCallback)(
            function (t) {
              ;(void 0 !== e && e.current !== t.target) || r(!0)
            },
            [e],
          ),
          onBlur: (0, o.useCallback)(
            function (t) {
              ;(void 0 !== e && e.current !== t.target) || r(!1)
            },
            [e],
          ),
        }
        return [n, i]
      }
    },
    45812: (e, t, n) => {
      'use strict'
      n.d(t, { useIsMouseDown: () => r })
      var o = n(59496)
      function r() {
        const e = (0, o.useRef)(!1),
          t = (0, o.useCallback)(() => {
            e.current = !0
          }, [e]),
          n = (0, o.useCallback)(() => {
            e.current = !1
          }, [e])
        return { isMouseDown: e, handleMouseDown: t, handleMouseUp: n }
      }
    },
    66092: (e, t, n) => {
      'use strict'
      n.d(t, { useMergedRefs: () => r })
      var o = n(59496)
      function r(e) {
        return (0, o.useCallback)(
          (function (e) {
            return t => {
              e.forEach(e => {
                'function' == typeof e ? e(t) : null != e && (e.current = t)
              })
            }
          })(e),
          e,
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
    90186: (e, t, n) => {
      'use strict'
      function o(e) {
        return i(e, s)
      }
      function r(e) {
        return i(e, l)
      }
      function i(e, t) {
        const n = Object.entries(e).filter(t),
          o = {}
        for (const [e, t] of n) o[e] = t
        return o
      }
      function s(e) {
        const [t, n] = e
        return 0 === t.indexOf('data-') && 'string' == typeof n
      }
      function l(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterDataProps: () => o,
        filterAriaProps: () => r,
        filterProps: () => i,
        isDataAttribute: () => s,
        isAriaAttribute: () => l,
      })
    },
    48907: (e, t, n) => {
      'use strict'
      function o(e) {
        null !== e && e.setSelectionRange(0, e.value.length)
      }
      n.d(t, { selectAllContent: () => o })
    },
    47201: (e, t, n) => {
      'use strict'
      function o(...e) {
        return t => {
          for (const n of e) void 0 !== n && n(t)
        }
      }
      n.d(t, { createSafeMulticastEventHandler: () => o })
    },
    30349: (e, t, n) => {
      'use strict'
      n.r(t), n.d(t, { showChangeIntervalDialog: () => x })
      var o = n(59496),
        r = n(87995),
        i = n(97754),
        s = n.n(i),
        l = n(28353),
        a = n(31261),
        u = n(67029),
        c = n(82992),
        d = n(63016),
        p = n(9745),
        g = n(60495)
      const h = (0, l.t)(
          'Type the interval number for minute charts (i.e. 5 if it is going to be a five minute chart). Or number plus letter for H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)',
        ),
        f = (0, l.t)(
          "Type the interval number for minute charts (i.e. 5 if it's going to be a five minute chart). Or number plus letter for other intervals: S for 1 second chart (15S for 15 second chart, etc.), H (Hourly), D (Daily), W (Weekly), M (Monthly) intervals (i.e. D or 2H)",
        )
      function m(e) {
        const { className: t, isSecondsEnabled: n } = e
        return o.createElement(p.Icon, { icon: g, className: s()('apply-common-tooltip', t), title: n ? f : h })
      }
      var v = n(38318),
        y = n(9315)
      var w = n(29823),
        C = n(86605)
      function b(e) {
        const { initVal: t, selectOnInit: n, onClose: r } = e,
          i = (0, o.useRef)(null),
          [p, g] = (0, o.useState)(t.toUpperCase()),
          h = (0, o.useMemo)(() => (0, v.parseIntervalValue)(p), [p]),
          f = (function (e, t) {
            return (0, o.useMemo)(() => {
              let n = !t.error && (0, v.intervalIsSupported)(e)
              if (!n) return !1
              const o = t.unit
              if ('R' === o && t.qty > (0, y.getMaxResolutionValue)('R')) n = !1
              else if (null === o || 'H' === o) {
                t.qty * ('H' === o ? 60 : 1) > (0, y.getMaxResolutionValue)('1') && (n = !1)
              } else
                'S' === o ? t.qty > (0, y.getMaxResolutionValue)('S') && (n = !1) : 'T' === o && 1 !== t.qty && (n = !1)
              return n
            }, [e, t])
          })(p, h),
          b = (0, o.useMemo)(() => {
            if (!f) return null
            const e = h.qty + (h.unit || '')
            return (0, y.getTranslatedResolutionModel)(e).hint
          }, [f, h])
        return (
          (0, o.useLayoutEffect)(() => {
            var e, t
            n
              ? null === (e = i.current) || void 0 === e || e.select()
              : null === (t = i.current) || void 0 === t || t.focus()
          }, [n]),
          o.createElement(
            d.PopupDialog,
            {
              className: C.dialog,
              'data-dialog-name': 'change-interval-dialog',
              isOpened: !0,
              onClickOutside: r,
              onFocus: function () {
                var e
                null === (e = i.current) || void 0 === e || e.focus()
              },
              onKeyDown: function (e) {
                27 === e.keyCode && (null == r || r())
              },
            },
            o.createElement(
              'div',
              { className: C.dialogInner },
              o.createElement(
                'div',
                { className: C.titleWrapper },
                o.createElement('div', { className: C.title }, (0, l.t)('Change interval')),
                o.createElement(m, { className: C.infoHint, isSecondsEnabled: (0, y.isSecondsEnabled)() }),
              ),
              o.createElement(
                'form',
                {
                  className: C.form,
                  onSubmit: function (e) {
                    e.preventDefault()
                    const t = c.linking.interval.value(),
                      n = w.Interval.normalize(p)
                    n && t !== n && f && ((o = n), (0, y.setLastUsedResolution)(o), c.linking.interval.setValue(o))
                    var o
                    null == r || r()
                  },
                },
                o.createElement(a.InputControl, {
                  className: s()(C.inputWrapper, u.InputClasses.FontSizeLarge),
                  inputClassName: C.input,
                  type: 'text',
                  size: 'large',
                  reference: i,
                  value: p,
                  maxLength: 8,
                  intent: f ? void 0 : 'danger',
                  onChange: function (e) {
                    const { value: t } = e.target
                    g(t.toUpperCase())
                  },
                }),
              ),
              f
                ? o.createElement('div', { className: C.hint }, b)
                : o.createElement('div', { className: s()(C.hint, C.error) }, (0, l.t)('Not applicable')),
            ),
          )
        )
      }
      var E = n(51826)
      function x(e) {
        if (E.dialogsOpenerManager.isOpened('ChangeIntervalDialog') || E.dialogsOpenerManager.isOpened('SymbolSearch'))
          return
        const t = document.createElement('div'),
          { initVal: n, selectOnInit: i, onClose: s } = e,
          l = o.createElement(b, {
            initVal: n,
            selectOnInit: i,
            onClose: function () {
              r.unmountComponentAtNode(t), E.dialogsOpenerManager.setAsClosed('ChangeIntervalDialog'), null == s || s()
            },
          })
        r.render(l, t), E.dialogsOpenerManager.setAsOpened('ChangeIntervalDialog')
      }
    },
    39640: (e, t, n) => {
      'use strict'
      function o(e, t, n, o, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== n && null !== t && null !== i && i.ownerDocument === o && (t.contains(i) || n(r))
        }
        return (
          r.click && o.addEventListener('click', i, !1),
          r.mouseDown && o.addEventListener('mousedown', i, !1),
          r.touchEnd && o.addEventListener('touchend', i, !1),
          r.touchStart && o.addEventListener('touchstart', i, !1),
          () => {
            o.removeEventListener('click', i, !1),
              o.removeEventListener('mousedown', i, !1),
              o.removeEventListener('touchend', i, !1),
              o.removeEventListener('touchstart', i, !1)
          }
        )
      }
      n.d(t, { addOutsideEventListener: () => o })
    },
    99054: (e, t, n) => {
      'use strict'
      n.d(t, { setFixedBodyState: () => u })
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
            const i = document.createElement('div')
            ;(i.style.width = '100%'), n.appendChild(i)
            const s = i.offsetWidth
            null === (t = n.parentNode) || void 0 === t || t.removeChild(n), (e = r - s)
          }
          return e
        }
      })()
      function r(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function i(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function s(e, t) {
        return parseInt(i(e, t))
      }
      let l = 0,
        a = !1
      function u(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++l) {
          const e = i(t, 'overflow'),
            l = s(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (r(n, 'right', o() + 'px'), (t.style.paddingRight = l + o() + 'px'), (a = !0)),
            t.classList.add('i-no-scroll')
        } else if (!e && l > 0 && 0 == --l && (t.classList.remove('i-no-scroll'), a)) {
          r(n, 'right', '0px')
          let e = 0
          0, t.scrollHeight <= t.clientHeight && (e -= o()), (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'), (a = !1)
        }
      }
    },
    51826: (e, t, n) => {
      'use strict'
      n.d(t, { DialogsOpenerManager: () => o, dialogsOpenerManager: () => r })
      class o {
        constructor() {
          this._storage = new Map()
        }
        setAsOpened(e, t) {
          this._storage.set(e, t)
        }
        setAsClosed(e) {
          this._storage.delete(e)
        }
        isOpened(e) {
          return this._storage.has(e)
        }
        getDialogPayload(e) {
          return this._storage.get(e)
        }
      }
      const r = new o()
    },
    58095: (e, t, n) => {
      'use strict'
      n.d(t, { useOutsideEvent: () => i })
      var o = n(59496),
        r = n(39640)
      function i(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: i,
            touchStart: s,
            handler: l,
            reference: a,
            ownerDocument: u = document,
          } = e,
          c = (0, o.useRef)(null),
          d = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: i, touchStart: s },
              o = a ? a.current : c.current
            return (0, r.addOutsideEventListener)(d.current, o, l, u, e)
          }, [t, n, i, s, l]),
          a || c
        )
      }
    },
    88216: (e, t, n) => {
      'use strict'
      n.d(t, { OverlapManager: () => i, getRootOverlapManager: () => l })
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
      class i {
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
      const s = new WeakMap()
      function l(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(s.get(t))
        {
          const t = new i(e),
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
          return s.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    65718: (e, t, n) => {
      'use strict'
      n.d(t, { Portal: () => a, PortalContext: () => u })
      var o = n(59496),
        r = n(87995),
        i = n(9423),
        s = n(88216),
        l = n(50655)
      class a extends o.PureComponent {
        constructor() {
          super(...arguments), (this._uuid = (0, i.guid)())
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
            r.createPortal(o.createElement(u.Provider, { value: this }, this.props.children), e)
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context ? (0, s.getRootOverlapManager)() : this.context
        }
      }
      a.contextType = l.SlotContext
      const u = o.createContext(null)
    },
    50655: (e, t, n) => {
      'use strict'
      n.d(t, { Slot: () => r, SlotContext: () => i })
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
      const i = o.createContext(null)
    },
    60495: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 8.5h1.5V14"/><circle fill="currentColor" cx="9" cy="5" r="1"/><path stroke="currentColor" d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/></svg>'
    },
  },
])
