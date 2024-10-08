;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9374],
  {
    2742: e => {
      e.exports = { body: 'body-sm3KMBIc' }
    },
    13520: e => {
      e.exports = { header: 'header-Dtkdqc5O', close: 'close-Dtkdqc5O' }
    },
    82561: e => {
      e.exports = { message: 'message-d3vP5HJI', error: 'error-d3vP5HJI' }
    },
    81843: e => {
      e.exports = {
        popupDialog: 'popupDialog-1s1uy4Yi',
        content: 'content-1s1uy4Yi',
        row: 'row-1s1uy4Yi',
        column: 'column-1s1uy4Yi',
        title: 'title-1s1uy4Yi',
        value: 'value-1s1uy4Yi',
        columnTitle: 'columnTitle-1s1uy4Yi',
        columnValue: 'columnValue-1s1uy4Yi',
      }
    },
    37062: e => {
      e.exports = { footer: 'footer-hDDUbPct' }
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
        return i(e, a)
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
      function a(e) {
        return 0 === e[0].indexOf('aria-')
      }
      n.d(t, {
        filterDataProps: () => o,
        filterAriaProps: () => r,
        filterProps: () => i,
        isDataAttribute: () => s,
        isAriaAttribute: () => a,
      })
    },
    52217: (e, t, n) => {
      'use strict'
      n.d(t, { SymbolInfoDialog: () => v })
      var o = n(28353),
        r = n(59496),
        i = n(63016),
        s = n(97754),
        a = n(13520),
        l = n(49370),
        c = n(9745)
      function u(e) {
        const t = e.hideIcon ? null : r.createElement(c.Icon, { className: a.close, icon: l, onClick: e.onClose })
        return r.createElement(
          'div',
          { className: s(a.header, e.className), 'data-dragg-area': !0, ref: e.reference },
          e.children,
          t,
        )
      }
      n(37062)
      var d = n(2742)
      function p(e) {
        return r.createElement('div', { className: s(d.body, e.className), ref: e.reference }, e.children)
      }
      n(58095), n(82561)
      var m = n(9481),
        h = n(76422),
        f = n(52092),
        y = n(81843)
      class v extends r.PureComponent {
        constructor() {
          super(...arguments), (this._close = () => this.props.onClose())
        }
        componentDidMount() {
          h.subscribe(f.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._close, null)
        }
        componentWillUnmount() {
          h.unsubscribe(f.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._close, null)
        }
        render() {
          return r.createElement(
            i.PopupDialog,
            { className: y.popupDialog, isOpened: this.props.isOpened, onClickOutside: this.props.onClose },
            r.createElement(u, { onClose: this.props.onClose }, (0, o.t)('Symbol Info')),
            r.createElement(
              p,
              null,
              r.createElement(m.KeyboardDocumentListener, { keyCode: 27, handler: this.props.onClose }),
              r.createElement(
                'div',
                { className: y.content, 'data-symbol-info-dialog-content': !0 },
                this._renderFields(),
              ),
            ),
          )
        }
        _renderFields() {
          return this.props.fields
            ? this.props.fields.map((e, t) =>
                r.createElement(
                  'div',
                  { key: e.propName + t.toString(), className: y.row },
                  r.createElement(
                    'div',
                    { className: s(y.column, y.columnTitle) },
                    r.createElement('span', { className: y.title }, e.title),
                  ),
                  r.createElement(
                    'div',
                    { className: s(y.column, y.columnValue) },
                    r.createElement(
                      'span',
                      { className: y.value },
                      (function (e) {
                        const t = e.value || e.defValue || '-'
                        if (e.setHtml) return r.createElement('span', { dangerouslySetInnerHTML: { __html: t } })
                        return t
                      })(e),
                    ),
                  ),
                ),
              )
            : []
        }
      }
    },
    62811: (e, t, n) => {
      'use strict'
      n.d(t, { parseSessionHours: () => l })
      var o = n(97098),
        r = n(10480),
        i = n.n(r),
        s = n(62820)
      function a(e) {
        for (; e > i().minutesPerDay; ) e -= i().minutesPerDay
        const t = e % 60,
          n = (e - t) / 60,
          r = (0, o.numberToStringWithLeadingZero)(n, 2) + ':' + (0, o.numberToStringWithLeadingZero)(t, 2)
        return (0, s.isRtl)() ? (0, s.startWithLTR)(r) : r
      }
      function l(e, t, n) {
        const { weekDays: o, closed: r } = n
        return t.map(t => {
          const n = e.filter(e => e.dayOfWeek() === t),
            s = o[t] + ' '
          if (0 === n.length) return `${s}${r}`
          return `${s}${n
            .map(e => {
              const t = e.sessionStartDayOfWeek(),
                n = e.sessionStartDaysOffset(),
                r = (function (e, t) {
                  let n = e + t
                  for (; n > i().SATURDAY; ) n -= i().SATURDAY
                  return n
                })(t, n === e.sessionEndDaysOffset() ? 0 : n),
                s = t !== e.dayOfWeek() || r !== e.dayOfWeek(),
                l = s ? o[t] : '',
                c = s ? o[r] : ''
              return `${a(e.start())}${l}-${a(e.start() + e.length())}${c}`
            })
            .join(', ')}`
        })
      }
    },
    65398: (e, t, n) => {
      'use strict'
      var o = n(28353).t,
        r = n(82992).linking,
        i = n(39277).availableTimezones,
        s = n(97098).PriceFormatter,
        a = n(9423),
        l = n(59496),
        c = n(87995),
        u = n(52217).SymbolInfoDialog,
        d = n(90388).SessionSpec,
        p = n(10480),
        m = n(39138).getQuoteSessionInstance,
        h = n(37667).createSeriesFormatter,
        f = n(37667).symbolOriginalCurrency,
        y = n(37667).symbolOriginalUnit,
        v = n(37667).isMeasureUnitSymbol,
        g = n(37667).isEconomicSymbol,
        D = n(37667).measureUnitId,
        _ = n(47670).marketType,
        E = n(13221).getAdditionalSymbolInfoFields,
        S = n(62811).parseSessionHours
      const w = n(67337)
      var N,
        b = n(967).weekDaysMiniNames,
        x = [p.MONDAY, p.TUESDAY, p.WEDNESDAY, p.THURSDAY, p.FRIDAY, p.SATURDAY, p.SUNDAY],
        A = x.reduce(function (e, t) {
          return (e[t] = b[t]), e
        }, {})
      function M(e) {
        return (
          !(function (e) {
            return e && e.type && 'economic' === e.type
          })(e) &&
          !(function (e, t) {
            return e && e.listed_exchange && t.indexOf(e.listed_exchange) >= 0
          })(e, ['QUANDL', 'BSE_EOD', 'NSE_EOD', 'LSE_EOD'])
        )
      }
      function k(e) {
        return e.minmove2 > 0 && !e.fractional && e.pricescale
      }
      function C(e) {
        if (k(e)) return new s(e.pricescale / e.minmove2).format(e.minmove2 / e.pricescale)
      }
      function O(e) {
        return void 0 === e.minmov || void 0 === e.pricescale ? null : h(e).format(e.minmov / e.pricescale)
      }
      function T(e) {
        return _(e.type, e.typespecs)
      }
      function W(e) {
        return e && e.type && 'futures' === e.type && e.front_contract
      }
      function U(e) {
        N || ((N = document.createElement('div')), document.body.appendChild(N)), c.render(l.createElement(u, e), N)
      }
      function Y(e) {
        for (var t = i, n = 0; n < t.length; n++) if (t[n].id === e) return t[n].title
        return e
      }
      function R(e) {
        var t = new d('Etc/UTC', e),
          n = { weekDays: A, closed: o('Closed') }
        return S(t.entries(), x, n).join('<br>')
      }
      function L(e) {
        return e || '-'
      }
      function I(e, t) {
        for (var n = 0, o = 0; o < t.length; o++)
          if (void 0 === t[o].getter) {
            var r = t[o].propName,
              i = t[o].altPropName,
              s = r in e ? r : void 0 !== i && i in e ? i : void 0
            if (void 0 !== s) {
              var a = e[s]
              ;(t[o].value = (t[o].formatter || L)(a)), n++
            }
          } else {
            var l = t[o].getter(e)
            null !== l && (t[o].value = l), n++
          }
        return (n -= (function (e, t) {
          for (var n = 0, o = 0; o < t.length; o++) {
            var r = t[o]
            void 0 === r.visibility || r.visibility(e) || (t.splice(o, 1), o--, n++)
          }
          return n
        })(e, t))
      }
      t.showSymbolInfoDialog = function (e, t) {
        if ((U({ isOpened: !1 }), null == e && (e = r.symbol.value()), null != e)) {
          e += ''
          var n = t && t.symbolInfo,
            i = [
              { title: o('Symbol Name'), propName: w.enabled('charting_library_base') ? 'name' : 'pro_name' },
              { title: o('Symbol Description'), propName: 'description' },
              { title: o('Symbol Type'), propName: 'type', getter: T },
              { title: o('Current Contract'), propName: 'front_contract', visibility: W },
              { title: o('Point Value'), propName: 'pointvalue' },
              { title: o('Exchange'), propName: 'exchange' },
              { title: o('Listed Exchange'), propName: 'listed_exchange' },
              { title: o('Source'), propName: 'source', visibility: e => g(e) && e.source },
              {
                title: o('Currency'),
                propName: 'currency_code',
                getter: e => f(e, !0),
                visibility: e => Boolean(f(e, !0)),
                formatter: function (e) {
                  return e || ''
                },
                defValue: '',
              },
              {
                title: o('Measure'),
                propName: 'value_unit_id',
                getter: e => t.unitDescription(D(e)),
                visibility: e => Boolean(D(e)) && v(e) && t.showUnit,
                formatter: e => e || '',
                defValue: '',
              },
              {
                title: o('Unit'),
                propName: 'unit_id',
                getter: e => t.unitDescription(y(e, t.showUnit)),
                visibility: e => Boolean(y(e, t.showUnit)) && !v(e),
                formatter: e => e || '',
                defValue: '',
              },
              { title: o('Pip Size'), propName: 'pip_size', getter: C, visibility: k },
              { title: o('Tick Size'), propName: 'tick_size', getter: O },
              { title: o('Sector'), propName: 'sector' },
              { title: o('Industry'), propName: 'industry' },
              { title: o('Timezone'), propName: 'timezone', formatter: Y, visibility: M },
              {
                title: o('Session'),
                propName: 'session_display',
                altPropName: 'session',
                formatter: R,
                visibility: M,
                setHtml: !0,
              },
            ],
            s = E()
          if (s && s.length > 0) for (const e of s) i.push({ title: e.title, propName: e.propertyName })
          var l = 0
          if ((n && (l = I(n, i)), l < i.length)) {
            var u = 'symbolinfodialog.' + a.guid(),
              d = m('full')
            d.subscribe(u, e, function (t, n) {
              I(n.values, i), d.unsubscribe(u, e), U(p)
            })
          }
          var p = {
            isOpened: !0,
            onClose: function () {
              U({ isOpened: !1 }), c.unmountComponentAtNode(N), (N = null)
            },
            fields: i,
          }
          U(p)
        }
      }
    },
    47670: (e, t, n) => {
      'use strict'
      n.d(t, { marketType: () => l })
      var o = n(28353)
      n(94419)
      const r = new Map(),
        i = { context: 'market_type' },
        s = {
          cfd: (0, o.t)('cfd', i),
          bitcoin: (0, o.t)('crypto', i),
          crypto: (0, o.t)('crypto', i),
          dr: (0, o.t)('dr', i),
          forex: (0, o.t)('forex', i),
          futures: (0, o.t)('futures', i),
          index: (0, o.t)('index', i),
          stock: (0, o.t)('stock', i),
          economic: (0, o.t)('economy', i),
        },
        a = new Set(['cfd', 'spreadbet', 'defi'])
      function l(e, t = []) {
        const n = t.filter(e => a.has(e)),
          l = `${e}_${n.sort().join('_')}`,
          c = r.get(l)
        if (void 0 !== c) return c
        const u = Boolean(t.length) ? (0, o.t)(e, i) + ' ' + n.join(' ') : s[e] || e
        return r.set(l, u), u
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
    967: (e, t, n) => {
      'use strict'
      n.d(t, { weekDaysShortNames: () => i, weekDaysMiniNames: () => s })
      var o = n(28353),
        r = n(84917)
      r.Months.JANUARY,
        (0, o.t)('January'),
        r.Months.FEBRUARY,
        (0, o.t)('February'),
        r.Months.MARCH,
        (0, o.t)('March'),
        r.Months.APRIL,
        (0, o.t)('April'),
        r.Months.MAY,
        (0, o.t)('May'),
        r.Months.JUNE,
        (0, o.t)('June'),
        r.Months.JULY,
        (0, o.t)('July'),
        r.Months.AUGUST,
        (0, o.t)('August'),
        r.Months.SEPTEMBER,
        (0, o.t)('September'),
        r.Months.OCTOBER,
        (0, o.t)('October'),
        r.Months.NOVEMBER,
        (0, o.t)('November'),
        r.Months.DECEMBER,
        (0, o.t)('December'),
        r.Months.JANUARY,
        (0, o.t)('Jan'),
        r.Months.FEBRUARY,
        (0, o.t)('Feb'),
        r.Months.MARCH,
        (0, o.t)('Mar'),
        r.Months.APRIL,
        (0, o.t)('Apr'),
        r.Months.MAY,
        (0, o.t)('May', { context: 'short' }),
        r.Months.JUNE,
        (0, o.t)('Jun'),
        r.Months.JULY,
        (0, o.t)('Jul'),
        r.Months.AUGUST,
        (0, o.t)('Aug'),
        r.Months.SEPTEMBER,
        (0, o.t)('Sep'),
        r.Months.OCTOBER,
        (0, o.t)('Oct'),
        r.Months.NOVEMBER,
        (0, o.t)('Nov'),
        r.Months.DECEMBER,
        (0, o.t)('Dec'),
        r.WeekDays.SUNDAY,
        (0, o.t)('Sunday'),
        r.WeekDays.MONDAY,
        (0, o.t)('Monday'),
        r.WeekDays.TUESDAY,
        (0, o.t)('Tuesday'),
        r.WeekDays.WEDNESDAY,
        (0, o.t)('Wednesday'),
        r.WeekDays.THURSDAY,
        (0, o.t)('Thursday'),
        r.WeekDays.FRIDAY,
        (0, o.t)('Friday'),
        r.WeekDays.SATURDAY,
        (0, o.t)('Saturday')
      const i = {
          [r.WeekDays.SUNDAY]: (0, o.t)('Sun'),
          [r.WeekDays.MONDAY]: (0, o.t)('Mon'),
          [r.WeekDays.TUESDAY]: (0, o.t)('Tue'),
          [r.WeekDays.WEDNESDAY]: (0, o.t)('Wed'),
          [r.WeekDays.THURSDAY]: (0, o.t)('Thu'),
          [r.WeekDays.FRIDAY]: (0, o.t)('Fri'),
          [r.WeekDays.SATURDAY]: (0, o.t)('Sat'),
        },
        s = {
          [r.WeekDays.SUNDAY]: (0, o.t)('Su', { context: 'day_of_week' }),
          [r.WeekDays.MONDAY]: (0, o.t)('Mo', { context: 'day_of_week' }),
          [r.WeekDays.TUESDAY]: (0, o.t)('Tu', { context: 'day_of_week' }),
          [r.WeekDays.WEDNESDAY]: (0, o.t)('We', { context: 'day_of_week' }),
          [r.WeekDays.THURSDAY]: (0, o.t)('Th', { context: 'day_of_week' }),
          [r.WeekDays.FRIDAY]: (0, o.t)('Fr', { context: 'day_of_week' }),
          [r.WeekDays.SATURDAY]: (0, o.t)('Sa', { context: 'day_of_week' }),
        }
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
      let a = 0,
        l = !1
      function c(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = i(t, 'overflow'),
            a = s(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (r(n, 'right', o() + 'px'), (t.style.paddingRight = a + o() + 'px'), (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (!e && a > 0 && 0 == --a && (t.classList.remove('i-no-scroll'), l)) {
          r(n, 'right', '0px')
          let e = 0
          0, t.scrollHeight <= t.clientHeight && (e -= o()), (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'), (l = !1)
        }
      }
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
            handler: a,
            reference: l,
            ownerDocument: c = document,
          } = e,
          u = (0, o.useRef)(null),
          d = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: i, touchStart: s },
              o = l ? l.current : u.current
            return (0, r.addOutsideEventListener)(d.current, o, a, c, e)
          }, [t, n, i, s, a]),
          l || u
        )
      }
    },
    9481: (e, t, n) => {
      'use strict'
      n.d(t, { KeyboardDocumentListener: () => r })
      var o = n(59496)
      class r extends o.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleKeyDown = e => {
              e.keyCode === this.props.keyCode && this.props.handler(e)
            })
        }
        componentDidMount() {
          document.addEventListener(this.props.eventType || 'keydown', this._handleKeyDown, !1)
        }
        componentWillUnmount() {
          document.removeEventListener(this.props.eventType || 'keydown', this._handleKeyDown, !1)
        }
        render() {
          return null
        }
      }
    },
    88216: (e, t, n) => {
      'use strict'
      n.d(t, { OverlapManager: () => i, getRootOverlapManager: () => a })
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
      function a(e = document) {
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
      n.d(t, { Portal: () => l, PortalContext: () => c })
      var o = n(59496),
        r = n(87995),
        i = n(9423),
        s = n(88216),
        a = n(50655)
      class l extends o.PureComponent {
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
            r.createPortal(o.createElement(c.Provider, { value: this }, this.props.children), e)
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context ? (0, s.getRootOverlapManager)() : this.context
        }
      }
      l.contextType = a.SlotContext
      const c = o.createContext(null)
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
    49370: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" width="13" height="13"><path fill="currentColor" d="M5.18 6.6L1.3 2.7.6 2 2 .59l.7.7 3.9 3.9 3.89-3.9.7-.7L12.61 2l-.71.7L8 6.6l3.89 3.89.7.7-1.4 1.42-.71-.71L6.58 8 2.72 11.9l-.71.7-1.41-1.4.7-.71 3.9-3.9z"/></svg>'
    },
  },
])
