;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1859],
  {
    45228: e => {
      e.exports = { calendar: 'calendar-wVs9kh0I' }
    },
    55400: e => {
      e.exports = { row: 'row-9XF0QIKT', mobileRow: 'mobileRow-9XF0QIKT' }
    },
    26074: e => {
      e.exports = {
        dialogWrapper: 'dialogWrapper-70bfoXiO',
        dialogWrapperSmall: 'dialogWrapperSmall-70bfoXiO',
        tabs: 'tabs-70bfoXiO',
        content: 'content-70bfoXiO',
        contentMobile: 'contentMobile-70bfoXiO',
        bodyWrapper: 'bodyWrapper-70bfoXiO',
      }
    },
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
    12539: e => {
      e.exports = {
        calendar: 'calendar-U9DgB4FB',
        popupStyle: 'popupStyle-U9DgB4FB',
        header: 'header-U9DgB4FB',
        title: 'title-U9DgB4FB',
        switchBtn: 'switchBtn-U9DgB4FB',
        prev: 'prev-U9DgB4FB',
        month: 'month-U9DgB4FB',
        weekdays: 'weekdays-U9DgB4FB',
        weeks: 'weeks-U9DgB4FB',
        week: 'week-U9DgB4FB',
        day: 'day-U9DgB4FB',
        disabled: 'disabled-U9DgB4FB',
        selected: 'selected-U9DgB4FB',
        currentDay: 'currentDay-U9DgB4FB',
        isOnHighlightedEdge: 'isOnHighlightedEdge-U9DgB4FB',
        withinSelectedRange: 'withinSelectedRange-U9DgB4FB',
      }
    },
    34020: e => {
      e.exports = {
        container: 'container-tZN1pb1A',
        icon: 'icon-tZN1pb1A',
        tooltip: 'tooltip-tZN1pb1A',
        date: 'date-tZN1pb1A',
        time: 'time-tZN1pb1A',
      }
    },
    554: e => {
      e.exports = {
        pickerInput: 'pickerInput-sZbzL9zH',
        icon: 'icon-sZbzL9zH',
        disabled: 'disabled-sZbzL9zH',
        picker: 'picker-sZbzL9zH',
        fixed: 'fixed-sZbzL9zH',
        absolute: 'absolute-sZbzL9zH',
        nativePicker: 'nativePicker-sZbzL9zH',
      }
    },
    93632: e => {
      e.exports = { tooltip: 'tooltip-QKiUU4Ng' }
    },
    64886: e => {
      e.exports = { slider: 'slider-Q7h4o6oW', inner: 'inner-Q7h4o6oW' }
    },
    42545: e => {
      e.exports = {
        scrollWrap: 'scrollWrap-VabV7Fn8',
        tabsWrap: 'tabsWrap-VabV7Fn8',
        tabs: 'tabs-VabV7Fn8',
        withoutBorder: 'withoutBorder-VabV7Fn8',
        tab: 'tab-VabV7Fn8',
        withHover: 'withHover-VabV7Fn8',
        headerBottomSeparator: 'headerBottomSeparator-VabV7Fn8',
        fadeWithoutSlider: 'fadeWithoutSlider-VabV7Fn8',
        withBadge: 'withBadge-VabV7Fn8',
      }
    },
    41814: e => {
      e.exports = {
        wrap: 'wrap-sfzcrPlH',
        wrapWithArrowsOuting: 'wrapWithArrowsOuting-sfzcrPlH',
        wrapOverflow: 'wrapOverflow-sfzcrPlH',
        scrollWrap: 'scrollWrap-sfzcrPlH',
        noScrollBar: 'noScrollBar-sfzcrPlH',
        icon: 'icon-sfzcrPlH',
        scrollLeft: 'scrollLeft-sfzcrPlH',
        scrollRight: 'scrollRight-sfzcrPlH',
        isVisible: 'isVisible-sfzcrPlH',
        iconWrap: 'iconWrap-sfzcrPlH',
        fadeLeft: 'fadeLeft-sfzcrPlH',
        fadeRight: 'fadeRight-sfzcrPlH',
      }
    },
    91626: e => {
      e.exports = { separator: 'separator-jtAq6E4V' }
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
    90186: (e, t, s) => {
      'use strict'
      function n(e) {
        return i(e, o)
      }
      function r(e) {
        return i(e, a)
      }
      function i(e, t) {
        const s = Object.entries(e).filter(t),
          n = {}
        for (const [e, t] of s) n[e] = t
        return n
      }
      function o(e) {
        const [t, s] = e
        return 0 === t.indexOf('data-') && 'string' == typeof s
      }
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      s.d(t, {
        filterDataProps: () => n,
        filterAriaProps: () => r,
        filterProps: () => i,
        isDataAttribute: () => o,
        isAriaAttribute: () => a,
      })
    },
    54801: (e, t, s) => {
      'use strict'
      s.r(t), s.d(t, { showGoToDateDialog: () => Re })
      var n = s(59496),
        r = s(87995),
        i = s(88537),
        o = s(82992)
      function a(e) {
        return ('0' + e).slice(-2)
      }
      function l(e) {
        const t = new Date(e)
        return t.setMilliseconds(0), t.setSeconds(0), t.setMinutes(0), t.setHours(0), t
      }
      function c(e, t = !1) {
        const s = l(e),
          n = t
            ? (function (e) {
                if (e > 6) throw new Error('Invalid day is provided')
                return 0 === e ? 6 : e - 1
              })(s.getDay())
            : s.getDay()
        return s.setDate(s.getDate() - n), s
      }
      function h(e) {
        const t = l(e)
        return t.setDate(1), t
      }
      function u(e, t) {
        return Number(l(e)) === Number(l(t))
      }
      function d(e) {
        const t = new Date(e)
        return t.setDate(t.getDate() + 7), t
      }
      function p(e, t, s) {
        const n = !t || Number(l(t)) - Number(l(e)) <= 0
        return (!s || Number(l(s)) - Number(l(e)) >= 0) && n
      }
      function m(e) {
        return new Date(e).getTimezoneOffset() / 60
      }
      function f(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() + m(t)), t
      }
      function v(e) {
        const t = new Date(e)
        return t.setHours(t.getHours() - m(t)), t
      }
      var g = s(51826),
        w = s(10480),
        D = s.n(w)
      const b = n.createContext(null)
      function _(e) {
        const { initialGoToDate: t, children: s } = e,
          [r, i] = (0, n.useState)(t),
          o =
            r.valueOf() <=
            (function (e) {
              const t = new Date(e)
              return t.setMilliseconds(999), t.setSeconds(59), t.setMinutes(59), t.setHours(23), t
            })(new Date()).valueOf(),
          a = (0, n.useMemo)(() => ({ date: r, setDate: i, isValid: o }), [r, o])
        return n.createElement(b.Provider, { value: a }, s)
      }
      const C = n.createContext(null)
      function E(e) {
        const { initialRanges: t, children: s } = e,
          [r, i] = (0, n.useState)(t.from),
          [o, a] = (0, n.useState)(t.to),
          l = r.valueOf() <= o.valueOf(),
          c = (0, n.useMemo)(() => ({ dateFrom: r, dateTo: o, setDateFrom: i, setDateTo: a, isValid: l }), [r, o, l])
        return n.createElement(C.Provider, { value: c }, s)
      }
      var S = s(28353),
        N = s(97754),
        y = s.n(N),
        k = s(76422),
        M = s(56840),
        F = s.n(M),
        x = s(52092),
        B = s(24437),
        R = s(50182),
        O = s(55400)
      function P(e) {
        const { children: t } = e
        return n.createElement('div', { className: y()(O.row, _e && O.mobileRow) }, t)
      }
      var T = s(32563),
        I = s(1860),
        z = s(9745),
        V = s(12539)
      class A extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._dateFormatter = new I.DateFormatter()),
            (this._onClick = () => {
              this.props.onClick && !this.props.isDisabled && this.props.onClick(new Date(this.props.day))
            })
        }
        render() {
          const e = N(V.day, {
            [V.selected]: this.props.isSelected,
            [V.disabled]: this.props.isDisabled,
            [V.withinSelectedRange]: this._withinSelectedRange(),
            [V.isOnHighlightedEdge]: this._isOnHighlightedEdge(),
            [V.currentDay]: this._isCurrentDay(),
          })
          return n.createElement(
            'span',
            { className: e, onClick: this._onClick, 'data-day': this._dateFormatter.formatLocal(this.props.day) },
            this.props.day.getDate(),
          )
        }
        _isOnHighlightedEdge() {
          const { day: e, highlightedFrom: t, highlightedTo: s } = this.props
          return !(!t || !s) && (u(e, t) || u(e, s))
        }
        _withinSelectedRange() {
          const { day: e, highlightedFrom: t, highlightedTo: s } = this.props
          return !(!t || !s) && this._isBetweenByDay(t, e, s)
        }
        _isCurrentDay() {
          return u(new Date(), this.props.day)
        }
        _isBetweenByDay(e, t, s) {
          const n = l(e),
            r = l(t),
            i = l(s)
          return n < r && r < i
        }
      }
      const L = [
        (0, S.t)('Mo', { context: 'day_of_week' }),
        (0, S.t)('Tu', { context: 'day_of_week' }),
        (0, S.t)('We', { context: 'day_of_week' }),
        (0, S.t)('Th', { context: 'day_of_week' }),
        (0, S.t)('Fr', { context: 'day_of_week' }),
        (0, S.t)('Sa', { context: 'day_of_week' }),
        (0, S.t)('Su', { context: 'day_of_week' }),
      ]
      class H extends n.PureComponent {
        constructor() {
          super(...arguments), (this._renderWeekdays = () => L.map(e => n.createElement('span', { key: e }, e)))
        }
        render() {
          return n.createElement(
            'div',
            { className: V.month },
            n.createElement('div', { className: V.weekdays }, this._renderWeekdays()),
            n.createElement('div', { className: V.weeks }, this._renderWeeks()),
          )
        }
        _renderWeeks() {
          const e = []
          let t = c(h(this.props.viewDate), !0)
          for (let s = 0; s < 6; s++) e.push(this._renderWeek(t)), (t = new Date(d(t)))
          return e
        }
        _renderWeek(e) {
          const t = []
          for (let i = 0; i < 7; i++) {
            const o = new Date(e)
            o.setDate(o.getDate() + i),
              ((s = o), (r = this.props.viewDate), Number(h(s)) === Number(h(r))) &&
                t.push(
                  n.createElement(A, {
                    key: i,
                    day: o,
                    isDisabled: this._isDayDisabled(o),
                    isSelected: u(o, this.props.selectedDate),
                    onClick: this.props.onClickDay,
                    highlightedFrom: this.props.highlightedFrom,
                    highlightedTo: this.props.highlightedTo,
                  }),
                )
          }
          var s, r
          if (0 === t.length) return null
          const i = (function (e) {
            const t = new Date(e.getFullYear(), 0, 1),
              s = (Number(e) - Number(t)) / 864e5
            return Math.ceil((s + t.getDay() + 1) / 7)
          })(e)
          return n.createElement('div', { className: V.week, key: i }, t)
        }
        _isDayDisabled(e) {
          if (!p(e, this.props.minDate, this.props.maxDate)) return !0
          const t = [6, 0].includes(e.getDay())
          return !!this.props.disableWeekends && t
        }
      }
      var W = s(30360)
      const U = [
        (0, S.t)('January'),
        (0, S.t)('February'),
        (0, S.t)('March'),
        (0, S.t)('April'),
        (0, S.t)('May'),
        (0, S.t)('June'),
        (0, S.t)('July'),
        (0, S.t)('August'),
        (0, S.t)('September'),
        (0, S.t)('October'),
        (0, S.t)('November'),
        (0, S.t)('December'),
      ]
      class K extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._prevMonth = () => {
              const e = new Date(this.state.viewDate)
              e.setMonth(e.getMonth() - 1),
                this.setState({ viewDate: e }),
                this.props.onMonthSwitch && this.props.onMonthSwitch()
            }),
            (this._nextMonth = () => {
              const e = new Date(this.state.viewDate)
              e.setMonth(e.getMonth() + 1),
                this.setState({ viewDate: e }),
                this.props.onMonthSwitch && this.props.onMonthSwitch()
            }),
            (this._onClickDay = e => {
              this.setState({ viewDate: new Date(e) }), this.props.onSelect && this.props.onSelect(new Date(e))
            }),
            (this.state = { viewDate: e.selectedDate })
        }
        render() {
          return n.createElement(
            'div',
            { className: N(V.calendar, this.props.popupStyle && V.popupStyle, this.props.className), tabIndex: -1 },
            n.createElement(
              'div',
              { className: V.header },
              n.createElement(z.Icon, { icon: W, onClick: this._prevMonth, className: N(V.switchBtn, V.prev) }),
              n.createElement(
                'div',
                { className: V.title },
                `${U[this.state.viewDate.getMonth()]} ${this.state.viewDate.getFullYear()}`,
              ),
              n.createElement(z.Icon, { icon: W, onClick: this._nextMonth, className: N(V.switchBtn, V.next) }),
            ),
            n.createElement(H, {
              viewDate: this.state.viewDate,
              selectedDate: this.props.selectedDate,
              maxDate: this.props.maxDate,
              minDate: this.props.minDate,
              onClickDay: this._onClickDay,
              disableWeekends: this.props.disableWeekends,
              highlightedFrom: this.props.highlightedFrom,
              highlightedTo: this.props.highlightedTo,
            }),
          )
        }
      }
      K.defaultProps = { popupStyle: !0 }
      var G = s(86623),
        Y = s(84275),
        Z = s(78274),
        $ = s(76594),
        Q = s(65718),
        X = s(554)
      class j extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._input = null),
            (this._inputContainer = null),
            (this._handleFocus = () => {
              this.props.showOnFocus && this.props.onShowPicker()
            }),
            (this._handleInputRef = e => {
              ;(this._input = e), this.props.inputReference && this.props.inputReference(this._input)
            }),
            (this._handleContainerRef = e => {
              this._inputContainer = e
            }),
            (this._onShowPicker = e => {
              if (e && this._inputContainer) {
                const t = e.getBoundingClientRect(),
                  s = this._inputContainer.getBoundingClientRect()
                t.width && t.width > window.innerWidth - s.left
                  ? ((e.style.right = '0'), (e.style.left = 'auto'))
                  : ((e.style.right = 'auto'), (e.style.left = s.left + 'px'))
                const n = window.innerHeight - s.bottom,
                  r = s.top
                if (n >= t.height) return void (e.style.top = s.bottom + 'px')
                ;(e.style.top = 'auto'), (e.style.bottom = r < t.height ? '0' : n + s.height + 'px')
              }
            }),
            (this._onChange = () => {
              const e = (0, i.ensureNotNull)(this._input).value
              this.setState({ value: e }), this.props.onType(e)
            }),
            (this._onKeyDown = e => {
              this.props.onHidePicker()
            }),
            (this._onKeyPress = e => {
              if (e.charCode) {
                const t = String.fromCharCode(e.charCode)
                this.props.inputRegex.test(t) || e.preventDefault()
              }
            }),
            (this._onKeyUp = e => {
              if (8 !== e.keyCode) {
                const e = (0, i.ensureNotNull)(this._input).value,
                  t = this.props.fixValue(e)
                t !== e && this.setState({ value: t })
              }
            }),
            (this.state = { value: e.value })
        }
        UNSAFE_componentWillReceiveProps(e) {
          e.value !== this.props.value && this.setState({ value: e.value })
        }
        render() {
          const {
            position: e = 'fixed',
            className: t,
            size: s,
            disabled: r,
            readonly: i,
            errors: o,
            icon: a,
            InputComponent: l = G.FormInput,
          } = this.props
          return n.createElement(
            'div',
            { className: X.pickerInput, ref: this._handleContainerRef },
            n.createElement(l, {
              value: this.state.value,
              onBlur: this.props.onBlur,
              onKeyDown: this._onKeyDown,
              onKeyPress: this._onKeyPress,
              onKeyUp: this._onKeyUp,
              onChange: this._onChange,
              onFocus: this._handleFocus,
              onClick: this.props.onShowPicker,
              reference: this._handleInputRef,
              className: t,
              size: s,
              disabled: r,
              errors: o,
              messagesPosition: Y.MessagesPosition.Attached,
              hasErrors: this.props.showErrorMessages && o && o.length > 0,
              name: this.props.name,
              readonly: i,
              endSlot:
                o && o.length
                  ? void 0
                  : n.createElement(
                      Z.EndSlot,
                      null,
                      n.createElement(z.Icon, {
                        icon: a,
                        className: N(X.icon, r && X.disabled),
                        onClick: r || i ? void 0 : this.props.onShowPicker,
                      }),
                    ),
              'data-name': this.props.name,
            }),
            this.props.showPicker && !i
              ? n.createElement(
                  Q.Portal,
                  { top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none' },
                  n.createElement($.OutsideEvent, { mouseDown: !0, handler: this.props.onHidePicker }, t =>
                    n.createElement(
                      'span',
                      { ref: t, style: { pointerEvents: 'auto' } },
                      n.createElement(
                        'div',
                        { className: N(X.picker, X[e]), key: '0', ref: this._onShowPicker },
                        this.props.children,
                      ),
                    ),
                  ),
                )
              : null,
          )
        }
      }
      j.defaultProps = { showOnFocus: !0 }
      class q extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._input = null),
            (this._nativeInputRef = n.createRef()),
            (this._handleInputRef = e => {
              ;(this._input = e), this.props.inputReference && this.props.inputReference(this._input)
            }),
            (this._onFocus = () => {
              this.setState({ isFocused: !0 })
            }),
            (this._onBlur = () => {
              this._nativeInputRef.current && (this._nativeInputRef.current.defaultValue = this.state.value),
                this.setState({ isFocused: !1 })
            }),
            (this._onChange = e => {
              const { value: t } = e.target
              t && (this.setState({ value: t }), this.props.onChange(t))
            }),
            (this.state = { value: e.value, isFocused: !1 })
        }
        componentDidMount() {
          this._nativeInputRef.current && (this._nativeInputRef.current.defaultValue = this.props.value)
        }
        render() {
          const { className: e, disabled: t, errors: s, InputComponent: r = G.FormInput } = this.props,
            i = !this.props.readonly && !t,
            o = this.props.showErrorMessages && s && s.length > 0
          return n.createElement(
            'div',
            { className: X.pickerInput },
            n.createElement(r, {
              value: this.state.value,
              readonly: !0,
              noReadonlyStyles: !0,
              endSlot:
                s && s.length
                  ? void 0
                  : n.createElement(
                      Z.EndSlot,
                      null,
                      n.createElement(z.Icon, { icon: this.props.icon, className: N(X.icon, t && X.disabled) }),
                    ),
              className: e,
              inputClassName: X.textInput,
              size: this.props.size,
              disabled: t,
              hasErrors: o,
              errors: s,
              alwaysShowAttachedErrors: !0,
              messagesPosition: Y.MessagesPosition.Attached,
              name: i ? void 0 : this.props.name,
              reference: this._handleInputRef,
              highlight: this.state.isFocused,
              intent: !o && this.state.isFocused ? 'primary' : void 0,
            }),
            i &&
              n.createElement('input', {
                ref: this._nativeInputRef,
                type: this.props.type,
                className: X.nativePicker,
                onChange: this._onChange,
                onInput: this._onChange,
                min: this.props.min,
                max: this.props.max,
                name: this.props.name,
                onFocus: this._onFocus,
                onBlur: this._onBlur,
              }),
          )
        }
      }
      var J = s(67029),
        ee = s(71767)
      class te extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._pickerInputContainerRef = n.createRef()),
            (this._dateFormatter = new I.DateFormatter()),
            (this._fixValue = e => (
              (e = (e = e.substring(0, 10)).replace(/-+/g, '-')),
              (/^\d{4}$/.test(e) || /^\d{4}-\d{2}$/.test(e)) && (e += '-'),
              e
            )),
            (this._isValid = e => {
              if (/^[0-9]{4}(-[0-9]{2}){2}/.test(e)) {
                const t = new Date(e.concat('T00:00'))
                return (
                  !(function (e) {
                    return Number.isNaN(Number(e))
                  })(t) &&
                  (!!this.props.noRangeValidation || p(t, this.props.minDate, this.props.maxDate))
                )
              }
              return !1
            }),
            (this._onBlur = e => {
              var t
              if (
                !this.props.revertInvalidData ||
                (null === (t = this._pickerInputContainerRef.current) || void 0 === t
                  ? void 0
                  : t.contains(e.relatedTarget))
              )
                return
              const { value: s } = e.target
              if (!this._isValid(s)) {
                const t = new Date(this.state.date)
                this.setState({ pickerInputKey: e.timeStamp, date: t, isInvalid: !1 }), this.props.onPick(t)
              }
            }),
            (this._onType = e => {
              const t = this._isValid(e) ? new Date(e.concat('T00:00')) : null
              t ? this.setState({ date: t, isInvalid: !1 }) : this.setState({ isInvalid: !0 }), this.props.onPick(t)
            }),
            (this._onSelect = e => {
              this.setState({ date: e, showCalendar: !1, isInvalid: !1 }), this.props.onPick(e)
            }),
            (this._showCalendar = () => {
              this.setState({ showCalendar: !0 })
            }),
            (this._hideCalendar = () => {
              this.setState({ showCalendar: !1 })
            }),
            (this._getErrors = () => {
              const e = this.props.errors ? [...this.props.errors] : []
              return this.state.isInvalid && e.push((0, S.t)('Please enter the right date format yyyy-mm-dd')), e
            }),
            (this.state = {
              pickerInputKey: 0,
              date: e.initial,
              showCalendar: !1,
              isInvalid: !this._isValid(this._dateFormatter.formatLocal(e.initial)),
            })
        }
        render() {
          return T.mobiletouch
            ? n.createElement(q, {
                value: this._dateFormatter.formatLocal(this.state.date),
                type: 'date',
                onChange: this._onType,
                icon: ee,
                disabled: this.props.disabled,
                size: this.props.size,
                min: this.props.minDate && this._dateFormatter.formatLocal(this.props.minDate),
                max: this.props.maxDate && this._dateFormatter.formatLocal(this.props.maxDate),
                errors: this._getErrors(),
                showErrorMessages: this.props.showErrorMessages,
                name: this.props.name,
                readonly: this.props.readonly,
                className: N(this._getFontSizeClassName(this.props.size), this.props.className),
                inputReference: this.props.inputReference,
                InputComponent: this.props.InputComponent,
              })
            : n.createElement(
                'div',
                { ref: this._pickerInputContainerRef },
                n.createElement(
                  j,
                  {
                    key: this.state.pickerInputKey,
                    value: this._dateFormatter.formatLocal(this.state.date),
                    inputRegex: /[0-9.]/,
                    fixValue: this._fixValue,
                    onType: this._onType,
                    onBlur: this._onBlur,
                    onShowPicker: this._showCalendar,
                    onHidePicker: this._hideCalendar,
                    showPicker: this.state.showCalendar && this.props.withCalendar,
                    showOnFocus: this.props.showOnFocus,
                    icon: ee,
                    disabled: this.props.disabled,
                    size: this.props.size,
                    errors: this._getErrors(),
                    showErrorMessages: this.props.showErrorMessages,
                    name: this.props.name,
                    readonly: this.props.readonly,
                    position: this.props.position,
                    className: N(this._getFontSizeClassName(this.props.size), this.props.className),
                    inputReference: this.props.inputReference,
                    InputComponent: this.props.InputComponent,
                  },
                  n.createElement(K, {
                    selectedDate: this.state.date,
                    maxDate: this.props.maxDate,
                    minDate: this.props.minDate,
                    onSelect: this._onSelect,
                  }),
                ),
              )
        }
        UNSAFE_componentWillReceiveProps(e) {
          this.props.initial !== e.initial && this.setState({ date: e.initial })
        }
        _getFontSizeClassName(e) {
          return e ? ('large' === e ? J.InputClasses.FontSizeLarge : J.InputClasses.FontSizeMedium) : void 0
        }
      }
      te.defaultProps = { position: 'fixed', withCalendar: !0 }
      var se = s(93632)
      function ne(e) {
        const { className: t, text: s } = e
        return n.createElement('span', { className: y()(se.tooltip, t) }, s)
      }
      var re = s(56712)
      const ie = s(34020)
      function oe(e) {
        const { hasErrors: t, onClick: s, errors: r, className: i, theme: o = ie, ...a } = e
        return n.createElement(
          'div',
          { className: o.container, onClick: s },
          n.createElement(G.FormInput, {
            ...a,
            className: o.date,
            hasErrors: t,
            errors: [],
            endSlot:
              !t &&
              n.createElement(
                Z.EndSlot,
                { icon: !0, interactive: !1 },
                n.createElement(z.Icon, { icon: re, className: o.icon }),
              ),
          }),
          t && n.createElement(ne, { text: (0, S.t)('Please enter the right date'), className: o.tooltip }),
        )
      }
      const ae = n.createContext({ isActive: !1, isFocused: !1 })
      function le(e) {
        const { value: t, reference: s, isActive: r, onPick: i, onFocus: o } = e,
          [a, l] = (0, n.useState)(!1)
        return n.createElement(
          ae.Provider,
          { value: { isActive: r, isFocused: a } },
          n.createElement(
            'div',
            {
              onFocus: function () {
                l(!0), o && o()
              },
              onBlur: function () {
                l(!1)
              },
            },
            n.createElement(te, {
              initial: t,
              inputReference: s,
              InputComponent: ce,
              withCalendar: !1,
              onPick: function (e) {
                if (!e) return
                i(new Date(e))
              },
              revertInvalidData: !0,
              name: e.name,
            }),
          ),
        )
      }
      function ce(e) {
        const { isActive: t, isFocused: s } = (0, n.useContext)(ae)
        return n.createElement(oe, { ...e, highlight: t || s })
      }
      var he = s(36565)
      function ue(e) {
        const { value: t, isDisabled: s, onPick: r } = e
        return n.createElement(he.TimeInput, {
          value: ((i = t), a(i.getHours()) + ':' + a(i.getMinutes())),
          onChange: r,
          disabled: s,
        })
        var i
      }
      var de = s(45228)
      function pe(e) {
        return n.createElement(K, { ...e, className: de.calendar, popupStyle: !1 })
      }
      function me(e, t) {
        const s = new Date(t)
        return s.setFullYear(e.getFullYear()), s.setMonth(e.getMonth()), s.setDate(e.getDate()), s
      }
      function fe(e, t) {
        const s = new Date(t)
        return s.setHours(e.getHours()), s.setMinutes(e.getMinutes()), s
      }
      function ve(e) {
        const { dateOnly: t, onCalendarMonthSwitch: s } = e,
          { date: r, setDate: o } = (0, i.ensureNotNull)((0, n.useContext)(b)),
          a = (0, n.useRef)(null),
          l = (0, n.useRef)(null)
        return (
          (0, n.useEffect)(() => {
            _e || null === l.current || l.current.focus()
          }, []),
          n.createElement(
            'div',
            { ref: a, tabIndex: -1 },
            n.createElement(
              P,
              null,
              n.createElement(le, {
                reference: function (e) {
                  l.current = e
                },
                value: new Date(r),
                onPick: function (e) {
                  const t = me(e, r)
                  o(t)
                },
                isActive: !_e,
              }),
              n.createElement(ue, {
                value: new Date(r),
                isDisabled: t,
                onPick: function (e) {
                  var t
                  const [s, n] = e.split(':'),
                    i = new Date()
                  i.setHours(Number(s)), i.setMinutes(Number(n))
                  const l = fe(i, r)
                  o(l), _e || null === (t = a.current) || void 0 === t || t.focus({ preventScroll: !0 })
                },
              }),
            ),
            !_e &&
              n.createElement(pe, {
                key: `${r.getFullYear()}-${r.getMonth()}-${r.getDate()}`,
                selectedDate: new Date(r),
                onSelect: function (e) {
                  var t
                  const s = me(e, r)
                  o(s), null === (t = a.current) || void 0 === t || t.focus({ preventScroll: !0 })
                },
                onMonthSwitch: s,
                maxDate: new Date(),
              }),
          )
        )
      }
      function ge(e) {
        const { dateOnly: t, onCalendarMonthSwitch: s, onDateInputFocus: r } = e,
          { dateFrom: o, dateTo: a, setDateFrom: l, setDateTo: c } = (0, i.ensureNotNull)((0, n.useContext)(C)),
          [h, u] = (0, n.useState)('from'),
          d = (0, n.useRef)(null),
          p = (0, n.useRef)(null),
          m = (0, n.useRef)(null),
          f = (0, n.useMemo)(() => ('from' === h ? new Date(o) : new Date(a)), [h, a, o])
        return (
          (0, n.useEffect)(() => {
            _e || null === p.current || p.current.focus()
          }, []),
          n.createElement(
            'div',
            { ref: d, tabIndex: -1 },
            n.createElement(
              P,
              null,
              n.createElement(le, {
                value: o,
                reference: function (e) {
                  p.current = e
                },
                isActive: !_e && 'from' === h,
                onPick: function (e) {
                  const t = me(e, o)
                  l(t)
                },
                onFocus: function () {
                  u('from'), r()
                },
                name: 'start-date-range',
              }),
              n.createElement(ue, {
                value: o,
                isDisabled: t,
                onPick: function (e) {
                  v(e, o, l)
                },
              }),
            ),
            n.createElement(
              P,
              null,
              n.createElement(le, {
                value: a,
                reference: function (e) {
                  m.current = e
                },
                isActive: !_e && 'to' === h,
                onPick: function (e) {
                  const t = me(e, a)
                  c(t)
                },
                onFocus: function () {
                  u('to'), r()
                },
                name: 'end-date-range',
              }),
              n.createElement(ue, {
                value: a,
                isDisabled: t,
                onPick: function (e) {
                  v(e, a, c)
                },
              }),
            ),
            !_e &&
              n.createElement(pe, {
                key: `${f.getFullYear()}-${f.getMonth()}-${f.getDate()}`,
                selectedDate: new Date(f),
                onSelect: function (e) {
                  const t = me(e, 'from' === h ? o : a)
                  ;({
                    from: () => {
                      var e
                      l(t), null === (e = m.current) || void 0 === e || e.focus({ preventScroll: !0 })
                    },
                    to: () => {
                      var e
                      c(t), null === (e = d.current) || void 0 === e || e.focus({ preventScroll: !0 })
                    },
                  }[h]())
                },
                onMonthSwitch: s,
                highlightedFrom: new Date(o),
                highlightedTo: new Date(a),
                maxDate: 'from' === h ? new Date(a) : void 0,
                minDate: 'to' === h ? new Date(o) : void 0,
              }),
          )
        )
        function v(e, t, s) {
          var n
          const [r, i] = e.split(':'),
            o = new Date()
          o.setHours(Number(r)), o.setMinutes(Number(i))
          s(fe(o, t)), _e || null === (n = d.current) || void 0 === n || n.focus({ preventScroll: !0 })
        }
      }
      var we = s(31807),
        De = s(90692),
        be = s(26074)
      const _e = T.mobiletouch,
        Ce = () => !0,
        Ee = {
          byId: { Date: { title: (0, S.t)('Date') }, CustomRange: { title: (0, S.t)('Custom range') } },
          allIds: ['Date', 'CustomRange'],
        }
      function Se(e) {
        const { dateOnly: t, onClose: s, onGoToDate: r, onGoToRange: o } = e,
          a = (0, n.useRef)(null),
          [l, c] = (0, n.useState)(F().getValue('GoToDialog.activeTab', 'Date')),
          [h, u] = (0, n.useState)(0),
          { date: d, isValid: p } = (0, i.ensureNotNull)((0, n.useContext)(b)),
          { dateFrom: m, dateTo: f, isValid: v } = (0, i.ensureNotNull)((0, n.useContext)(C))
        return (
          (0, n.useEffect)(
            () => (
              k.subscribe(x.CLOSE_POPUPS_AND_DIALOGS_COMMAND, _, null),
              () => {
                k.unsubscribe(x.CLOSE_POPUPS_AND_DIALOGS_COMMAND, _, null)
              }
            ),
            [s],
          ),
          (0, n.useEffect)(() => {
            null !== a.current && a.current()
          }, [h, l, d, m, f]),
          n.createElement(De.MatchMedia, { rule: B.DialogBreakpoints.TabletSmall }, e =>
            n.createElement(R.AdaptiveConfirmDialog, {
              className: y()(be.dialogWrapper, e && be.dialogWrapperSmall),
              title: (0, S.t)('Go to'),
              dataName: 'go-to-date-dialog',
              render: g,
              defaultActionOnClose: 'cancel',
              onClose: _,
              onClickOutside: _,
              onCancel: _,
              onSubmit: D,
              submitButtonDisabled: w(),
              submitButtonText: (0, S.t)('Go to'),
              forceCloseOnEsc: Ce,
              shouldForceFocus: !1,
              fullScreen: e,
              isOpened: !0,
            }),
          )
        )
        function g({ requestResize: e }) {
          return (
            (a.current = e),
            n.createElement(
              n.Fragment,
              null,
              n.createElement(
                'div',
                { className: be.tabs },
                n.createElement(we.DialogTabs, { activeTabId: l, tabs: Ee, onSelect: E }),
              ),
              n.createElement(
                'div',
                { className: y()(be.content, _e && be.contentMobile) },
                n.createElement(
                  'div',
                  { className: be.bodyWrapper },
                  n.createElement(Ne, { onCalendarMonthSwitch: N, onDateInputFocus: N, activeTab: l, dateOnly: t }),
                ),
              ),
            )
          )
        }
        function w() {
          return { CustomRange: !v, Date: !p }[l]
        }
        function D() {
          switch (l) {
            case 'Date':
              r(d)
              break
            case 'CustomRange':
              o(m, f)
          }
        }
        function _() {
          s()
        }
        function E(e) {
          c(e), F().setValue('GoToDialog.activeTab', e)
        }
        function N() {
          u(h + 1)
        }
      }
      function Ne(e) {
        const { activeTab: t, dateOnly: s, onCalendarMonthSwitch: r, onDateInputFocus: i } = e
        switch (t) {
          case 'Date':
            return n.createElement(ve, { dateOnly: s, onCalendarMonthSwitch: r })
          case 'CustomRange':
            return n.createElement(ge, { dateOnly: s, onCalendarMonthSwitch: r, onDateInputFocus: i })
        }
      }
      function ye(e) {
        const { dateOnly: t, onClose: s, onGoToDate: r, onGoToRange: i, initialGoToDate: o, initialRanges: a } = e
        return n.createElement(
          _,
          { initialGoToDate: o },
          n.createElement(
            E,
            { initialRanges: a },
            n.createElement(Se, { dateOnly: t, onClose: s, onGoToDate: r, onGoToRange: i }),
          ),
        )
      }
      var ke = s(9315),
        Me = s(71053)
      const Fe = new (class {
        constructor() {
          this._hasError = !1
        }
        getItemOrDefault(e, t) {
          return !sessionStorage || this._hasError ? t : sessionStorage.getItem(e)
        }
        setItem(e, t = 'true') {
          try {
            sessionStorage.setItem(e, t), (this._hasError = !1)
          } catch (e) {
            this._hasError = !0
          }
        }
      })()
      var xe = s(27365)
      const Be = new g.DialogsOpenerManager()
      function Re(e) {
        if (Be.isOpened('goTo')) return
        if (!e.hasModel()) return
        const t = e.model(),
          s = document.createElement('div'),
          i = n.createElement(ye, {
            onClose: a,
            dateOnly: t.model().mainSeries().isDWM(),
            initialGoToDate: Oe(),
            initialRanges: Pe(e),
            onGoToDate: e => {
              !(function (e, t) {
                Fe.setItem('goToDateTabLastPickedDate', String(t.valueOf()))
                if (void 0 === e.model().timeScale().tickMarks().minIndex) return
                const s = v(t).valueOf()
                e.model()
                  .gotoTime(s)
                  .then(t => {
                    const s = e.model().mainSeries()
                    void 0 === t ? s.clearGotoDateResult() : s.setGotoDateResult(t)
                  })
              })(t, e),
                a()
            },
            onGoToRange: (t, s) => {
              !(function (e, t, s) {
                const n = (0, xe.getTimezoneName)(e.model())
                if (!n) return
                const r = o.linking.interval.value(),
                  i = r && (0, ke.normalizeIntervalString)(r),
                  a = D().get_timezone(n),
                  l = e => (0, w.cal_to_utc)(a, new Date(e)),
                  c = v(t).valueOf(),
                  h = v(s).valueOf(),
                  u = { val: { type: 'time-range', from: l(c) / 1e3, to: l(h) / 1e3 }, res: i }
                e.chartWidgetCollection().setTimeFrame(u)
              })(e, t, s),
                a()
            },
          })
        function a() {
          r.unmountComponentAtNode(s), Be.setAsClosed('goTo')
        }
        r.render(i, s), Be.setAsOpened('goTo')
      }
      function Oe() {
        const e = Fe.getItemOrDefault('goToDateTabLastPickedDate', null)
        return null === e ? l(new Date()) : new Date(Number(e))
      }
      function Pe(e) {
        const t = (function (e) {
          const t = e.model().timeScale(),
            s = t.visibleBarsStrictRange()
          if (null === s) return
          const n = e.model().mainSeries(),
            r = n.nearestIndex(s.firstBar(), Me.PlotRowSearchMode.NearestRight),
            o = n.nearestIndex(s.lastBar(), Me.PlotRowSearchMode.NearestLeft)
          if (void 0 === r || void 0 === o) return
          return { from: (0, i.ensureNotNull)(t.indexToUserTime(r)), to: (0, i.ensureNotNull)(t.indexToUserTime(o)) }
        })(e)
        return t ? { from: f(t.from), to: f(t.to) } : { from: f(new Date()), to: f(new Date()) }
      }
    },
    39640: (e, t, s) => {
      'use strict'
      function n(e, t, s, n, r) {
        function i(r) {
          if (e > r.timeStamp) return
          const i = r.target
          void 0 !== s && null !== t && null !== i && i.ownerDocument === n && (t.contains(i) || s(r))
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
      s.d(t, { addOutsideEventListener: () => n })
    },
    24437: (e, t, s) => {
      'use strict'
      s.d(t, { DialogBreakpoints: () => r })
      var n = s(96746)
      const r = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      }
    },
    85457: (e, t, s) => {
      'use strict'
      s.d(t, { AdaptivePopupDialog: () => S })
      var n = s(59496),
        r = s(88537)
      var i = s(97754),
        o = s.n(i),
        a = s(68335),
        l = s(35749),
        c = s(63016),
        h = s(1109),
        u = s(24437),
        d = s(90692),
        p = s(95711),
        m = s(52092),
        f = s(76422),
        v = s(9745)
      const g = n.createContext({ setHideClose: () => {} })
      var w = s(37257),
        D = s(91441)
      function b(e) {
        const {
            title: t,
            subtitle: s,
            showCloseIcon: r = !0,
            onClose: i,
            renderBefore: a,
            renderAfter: l,
            draggable: c,
            className: h,
            unsetAlign: u,
          } = e,
          [d, p] = (0, n.useState)(!1)
        return n.createElement(
          g.Provider,
          { value: { setHideClose: p } },
          n.createElement(
            'div',
            { className: o()(D.container, h, (s || u) && D.unsetAlign) },
            a,
            n.createElement(
              'div',
              { 'data-dragg-area': c, className: D.title },
              n.createElement('div', { className: D.ellipsis }, t),
              s && n.createElement('div', { className: o()(D.ellipsis, D.subtitle) }, s),
            ),
            l,
            r &&
              !d &&
              n.createElement(v.Icon, {
                className: D.close,
                icon: w,
                onClick: i,
                'data-name': 'close',
                'data-role': 'button',
              }),
          ),
        )
      }
      var _ = s(67179)
      const C = { vertical: 20 },
        E = { vertical: 0 }
      class S extends n.PureComponent {
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
                this.props.onOpen(this.props.fullScreen || window.matchMedia(u.DialogBreakpoints.TabletSmall).matches)
            }),
            (this._handleKeyDown = e => {
              var t
              if (!e.defaultPrevented)
                switch ((this.props.onKeyDown && this.props.onKeyDown(e), (0, a.hashFromEvent)(e))) {
                  case 27:
                    if (e.defaultPrevented) return
                    if (this.props.forceCloseOnEsc && this.props.forceCloseOnEsc()) return void this._handleClose()
                    const { activeElement: s } = document,
                      n = (0, r.ensureNotNull)(this._reference)
                    if (null !== s) {
                      if (
                        (e.preventDefault(),
                        'true' === (t = s).getAttribute('data-haspopup') && 'true' !== t.getAttribute('data-expanded'))
                      )
                        return void this._handleClose()
                      if ((0, l.isTextEditingField)(s)) return void n.focus()
                      if (n.contains(s)) return void this._handleClose()
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
          f.subscribe(m.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia('(orientation: portrait)')),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener) ? e.addEventListener('change', t) : e.addListener(t))
        }
        componentWillUnmount() {
          var e, t
          f.unsubscribe(m.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener) ? e.removeEventListener('change', t) : e.removeListener(t))
        }
        focus() {
          ;(0, r.ensureNotNull)(this._reference).focus()
        }
        getElement() {
          return this._reference
        }
        contains(e) {
          var t, s
          return (
            null !== (s = null === (t = this._reference) || void 0 === t ? void 0 : t.contains(e)) && void 0 !== s && s
          )
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: s,
              isOpened: r,
              title: i,
              dataName: a,
              onClickOutside: l,
              additionalElementPos: m,
              additionalHeaderElement: f,
              backdrop: v,
              shouldForceFocus: g = !0,
              showSeparator: w,
              subtitle: D,
              draggable: S = !0,
              fullScreen: N = !1,
              showCloseIcon: y = !0,
              rounded: k = !0,
              isAnimationEnabled: M,
              growPoint: F,
              dialogTooltip: x,
              unsetHeaderAlign: B,
              onDragStart: R,
              dataDialogName: O,
            } = this.props,
            P = 'after' !== m ? f : void 0,
            T = 'after' === m ? f : void 0,
            I = 'string' == typeof i ? i : O || ''
          return n.createElement(d.MatchMedia, { rule: u.DialogBreakpoints.SmallHeight }, m =>
            n.createElement(d.MatchMedia, { rule: u.DialogBreakpoints.TabletSmall }, u =>
              n.createElement(
                c.PopupDialog,
                {
                  rounded: !(u || N) && k,
                  className: o()(_.dialog, e),
                  isOpened: r,
                  reference: this._handleReference,
                  onKeyDown: this._handleKeyDown,
                  onClickOutside: l,
                  onClickBackdrop: l,
                  fullscreen: u || N,
                  guard: m ? E : C,
                  boundByScreen: u || N,
                  shouldForceFocus: g,
                  backdrop: v,
                  draggable: S,
                  isAnimationEnabled: M,
                  growPoint: F,
                  name: this.props.dataName,
                  dialogTooltip: x,
                  onDragStart: R,
                },
                n.createElement(
                  'div',
                  { className: o()(_.wrapper, t), 'data-name': a, 'data-dialog-name': I },
                  void 0 !== i &&
                    n.createElement(b, {
                      draggable: S && !(u || N),
                      onClose: this._handleClose,
                      renderAfter: T,
                      renderBefore: P,
                      subtitle: D,
                      title: i,
                      showCloseIcon: y,
                      className: s,
                      unsetAlign: B,
                    }),
                  w && n.createElement(h.Separator, { className: _.separator }),
                  n.createElement(p.PopupContext.Consumer, null, e => this._renderChildren(e, u || N)),
                ),
              ),
            ),
          )
        }
      }
    },
    51826: (e, t, s) => {
      'use strict'
      s.d(t, { DialogsOpenerManager: () => n, dialogsOpenerManager: () => r })
      class n {
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
      const r = new n()
    },
    31807: (e, t, s) => {
      'use strict'
      s.d(t, { DialogTabs: () => m })
      var n = s(59496),
        r = s(97754),
        i = s(64205),
        o = s(40173),
        a = s(64886)
      const l = (0, o.mergeThemes)(i.DEFAULT_SLIDER_THEME, a)
      var c = s(39440),
        h = s(32563),
        u = s(42545)
      const d = u,
        p = (0, i.factory)(function (e) {
          return n.createElement(
            'div',
            { className: l.slider, ref: e.reference },
            n.createElement('div', { className: l.inner }),
          )
        })
      class m extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._createClickHandler = e => () => {
              this.props.onSelect(e)
            })
        }
        render() {
          const {
              theme: e = d,
              hiddenBottomBorders: t,
              fadedSlider: s = !0,
              ScrollComponent: i = c.HorizontalScroll,
            } = this.props,
            o = this._generateDialogTabs()
          return n.createElement(
            'div',
            { className: r(e.scrollWrap) },
            !t && n.createElement('div', { className: e.headerBottomSeparator }),
            n.createElement(
              i,
              {
                isVisibleFade: h.mobiletouch,
                isVisibleButtons: !h.mobiletouch,
                isVisibleScrollbar: !1,
                fadeClassName: r({ [e.fadeWithoutSlider]: !s }),
              },
              n.createElement(
                'div',
                { className: e.tabsWrap },
                n.createElement(p, { className: r(e.tabs, t && e.withoutBorder) }, o),
              ),
            ),
          )
        }
        _generateDialogTabs() {
          const { activeTabId: e, tabs: t, theme: s = d } = this.props
          return t.allIds.map(o => {
            const a = e === o,
              l = t.byId[o].withNotificationsBadge
            return n.createElement(
              i.SliderItem,
              {
                key: o,
                value: o,
                className: r(s.tab, !a && s.withHover, l && u.withBadge),
                isActive: a,
                onClick: this._createClickHandler(o),
              },
              t.byId[o].title,
            )
          })
        }
      }
    },
    39440: (e, t, s) => {
      'use strict'
      s.d(t, { HorizontalScroll: () => D })
      var n = s(59496),
        r = s(97754),
        i = s(9837),
        o = s(88537),
        a = s(9745),
        l = s(59199),
        c = s(68587),
        h = s(62820),
        u = s(33086),
        d = s(41814)
      const p = { isVisibleScrollbar: !0, shouldMeasure: !0, hideButtonsFrom: 1 }
      function m(e) {
        return n.createElement('div', { className: r(d.fadeLeft, e.className, { [d.isVisible]: e.isVisible }) })
      }
      function f(e) {
        return n.createElement('div', { className: r(d.fadeRight, e.className, { [d.isVisible]: e.isVisible }) })
      }
      function v(e) {
        return n.createElement(w, { ...e, className: d.scrollLeft })
      }
      function g(e) {
        return n.createElement(w, { ...e, className: d.scrollRight })
      }
      function w(e) {
        return n.createElement(
          'div',
          { className: r(e.className, { [d.isVisible]: e.isVisible }), onClick: e.onClick },
          n.createElement('div', { className: d.iconWrap }, n.createElement(a.Icon, { icon: u, className: d.icon })),
        )
      }
      const D = (function (e = v, t = g, s = m, a = f) {
        var u
        return (
          ((u = class extends n.PureComponent {
            constructor(e) {
              super(e),
                (this._scroll = n.createRef()),
                (this._wrapMeasureRef = n.createRef()),
                (this._contentMeasureRef = n.createRef()),
                (this._handleScrollLeft = () => {
                  if (this.props.onScrollButtonClick) return void this.props.onScrollButtonClick('left')
                  const e = this.props.scrollStepSize || this.state.widthWrap - 50
                  this.animateTo(Math.max(0, this.currentPosition() - e))
                }),
                (this._handleScrollRight = () => {
                  if (this.props.onScrollButtonClick) return void this.props.onScrollButtonClick('right')
                  const e = this.props.scrollStepSize || this.state.widthWrap - 50
                  this.animateTo(
                    Math.min((this.state.widthContent || 0) - (this.state.widthWrap || 0), this.currentPosition() + e),
                  )
                }),
                (this._handleResizeWrap = e => {
                  this.props.onMeasureWrap && this.props.onMeasureWrap(e),
                    this.setState({ widthWrap: e.width }),
                    this._checkButtonsVisibility()
                }),
                (this._handleResizeContent = e => {
                  this.props.onMeasureContent && this.props.onMeasureContent(e)
                  const { shouldDecreaseWidthContent: t, buttonsWidthIfDecreasedWidthContent: s } = this.props
                  t && s ? this.setState({ widthContent: e.width + 2 * s }) : this.setState({ widthContent: e.width })
                }),
                (this._handleScroll = () => {
                  const { onScroll: e } = this.props
                  e && e(this.currentPosition(), this.isAtLeft(), this.isAtRight()), this._checkButtonsVisibility()
                }),
                (this._checkButtonsVisibility = () => {
                  const { isVisibleLeftButton: e, isVisibleRightButton: t } = this.state,
                    s = this.isAtLeft(),
                    n = this.isAtRight()
                  s || e
                    ? s && e && this.setState({ isVisibleLeftButton: !1 })
                    : this.setState({ isVisibleLeftButton: !0 }),
                    n || t
                      ? n && t && this.setState({ isVisibleRightButton: !1 })
                      : this.setState({ isVisibleRightButton: !0 })
                }),
                (this.state = { widthContent: 0, widthWrap: 0, isVisibleRightButton: !1, isVisibleLeftButton: !1 })
            }
            componentDidMount() {
              this._checkButtonsVisibility()
            }
            componentDidUpdate(e, t) {
              ;(t.widthWrap === this.state.widthWrap && t.widthContent === this.state.widthContent) ||
                this._handleScroll(),
                this.props.shouldMeasure &&
                  this._wrapMeasureRef.current &&
                  this._contentMeasureRef.current &&
                  (this._wrapMeasureRef.current.measure(), this._contentMeasureRef.current.measure())
            }
            currentPosition() {
              return this._scroll.current
                ? (0, h.isRtl)()
                  ? (0, h.getLTRScrollLeft)(this._scroll.current)
                  : this._scroll.current.scrollLeft
                : 0
            }
            isAtLeft() {
              return !this._isOverflowed() || this.currentPosition() <= (0, o.ensureDefined)(this.props.hideButtonsFrom)
            }
            isAtRight() {
              return (
                !this._isOverflowed() ||
                this.currentPosition() + this.state.widthWrap >=
                  this.state.widthContent - (0, o.ensureDefined)(this.props.hideButtonsFrom)
              )
            }
            animateTo(e, t = c.dur) {
              const s = this._scroll.current
              s &&
                ((0, h.isRtl)() && (e = (0, h.getLTRScrollLeftOffset)(s, e)),
                t <= 0
                  ? (s.scrollLeft = Math.round(e))
                  : (0, l.doAnimate)({
                      onStep(e, t) {
                        s.scrollLeft = Math.round(t)
                      },
                      from: s.scrollLeft,
                      to: Math.round(e),
                      easing: c.easingFunc.easeInOutCubic,
                      duration: t,
                    }))
            }
            render() {
              const {
                  children: o,
                  isVisibleScrollbar: l,
                  isVisibleFade: c,
                  isVisibleButtons: h,
                  shouldMeasure: u,
                  shouldDecreaseWidthContent: p,
                  buttonsWidthIfDecreasedWidthContent: m,
                  onMouseOver: f,
                  onMouseOut: v,
                  scrollWrapClassName: g,
                  fadeClassName: w,
                } = this.props,
                { isVisibleRightButton: D, isVisibleLeftButton: b } = this.state,
                _ = p && m
              return n.createElement(
                i,
                {
                  whitelist: ['width'],
                  onMeasure: this._handleResizeWrap,
                  shouldMeasure: u,
                  ref: this._wrapMeasureRef,
                },
                n.createElement(
                  'div',
                  { className: d.wrapOverflow, onMouseOver: f, onMouseOut: v },
                  n.createElement(
                    'div',
                    { className: r(d.wrap, _ ? d.wrapWithArrowsOuting : '') },
                    n.createElement(
                      'div',
                      {
                        className: r(d.scrollWrap, g, { [d.noScrollBar]: !l }),
                        onScroll: this._handleScroll,
                        ref: this._scroll,
                      },
                      n.createElement(
                        i,
                        {
                          onMeasure: this._handleResizeContent,
                          whitelist: ['width'],
                          shouldMeasure: u,
                          ref: this._contentMeasureRef,
                        },
                        o,
                      ),
                    ),
                    c && n.createElement(s, { isVisible: b, className: w }),
                    c && n.createElement(a, { isVisible: D, className: w }),
                    h && n.createElement(e, { onClick: this._handleScrollLeft, isVisible: b }),
                    h && n.createElement(t, { onClick: this._handleScrollRight, isVisible: D }),
                  ),
                ),
              )
            }
            _isOverflowed() {
              const { widthContent: e, widthWrap: t } = this.state
              return e > t
            }
          }).defaultProps = p),
          u
        )
      })(v, g, m, f)
    },
    1109: (e, t, s) => {
      'use strict'
      s.d(t, { Separator: () => o })
      var n = s(59496),
        r = s(97754),
        i = s(91626)
      function o(e) {
        return n.createElement('div', { className: r(i.separator, e.className) })
      }
    },
    64205: (e, t, s) => {
      'use strict'
      s.d(t, { DEFAULT_SLIDER_THEME: () => a, SliderItem: () => l, factory: () => c })
      var n = s(59496),
        r = s(97754),
        i = s(88537),
        o = s(37740)
      const a = o
      function l(e) {
        const t = r(e.className, o.tab, {
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
            ;((0, i.ensureNotNull)(this._slider).style.transition = 'transform 350ms'), this._componentDidUpdate()
          }
          componentDidMount() {
            this._componentDidUpdate()
          }
          render() {
            const { className: t } = this.props,
              s = this._generateTabs()
            return n.createElement(
              'div',
              { className: r(t, o.tabs), 'data-name': this.props['data-name'] },
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
                  r = {
                    reference: e => {
                      s && (this.activeTab.current = e), t.props.reference && t.props.reference(e)
                    },
                  }
                return n.cloneElement(t, r)
              })
            )
          }
          _componentDidUpdate() {
            const e = (0, i.ensureNotNull)(this._slider).style
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
        for (const r of Object.keys(t)) {
          const i = s[r] || r
          i in e && (n[r] = [e[i], t[r]].join(' '))
        }
        return n
      }
      function r(e, t, s = {}) {
        return Object.assign({}, e, n(e, t, s))
      }
      s.d(t, { weakComposeClasses: () => n, mergeThemes: () => r })
    },
    33086: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    30360: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentcolor" stroke-width="1.3" d="M12 9l5 5-5 5"/></svg>'
    },
    56712: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 4h1v2h6V4h1v2h2.5A2.5 2.5 0 0 1 23 8.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 5 19.5v-11A2.5 2.5 0 0 1 7.5 6H10V4zm8 3H7.5C6.67 7 6 7.67 6 8.5v11c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5H18zm-3 2h-2v2h2V9zm-7 4h2v2H8v-2zm12-4h-2v2h2V9zm-7 4h2v2h-2v-2zm-3 4H8v2h2v-2zm3 0h2v2h-2v-2zm7-4h-2v2h2v-2z"/></svg>'
    },
    71767: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M4 0c-.6 0-1 .4-1 1v1H1c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1h-2V1c0-.6-.4-1-1-1h-1c-.6 0-1 .4-1 1v1H6V1c0-.6-.4-1-1-1H4zM2 5h12v9H2V5zm5 2v2h2V7H7zm3 0v2h2V7h-2zm-6 3v2h2v-2H4zm3 0v2h2v-2H7zm3 0v2h2v-2h-2z"/></svg>'
    },
    37257: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>'
    },
  },
])
