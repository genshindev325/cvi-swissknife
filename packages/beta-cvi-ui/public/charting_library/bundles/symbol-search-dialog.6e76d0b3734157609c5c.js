'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1754],
  {
    9745: (e, t, n) => {
      n.d(t, { Icon: () => s })
      var o = n(59496)
      const s = o.forwardRef((e, t) => {
        const { icon: n = '', ...s } = e
        return o.createElement('span', { ...s, ref: t, dangerouslySetInnerHTML: { __html: n } })
      })
    },
    99054: (e, t, n) => {
      n.d(t, { setFixedBodyState: () => d })
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
            const s = n.offsetWidth
            n.style.overflow = 'scroll'
            const i = document.createElement('div')
            ;(i.style.width = '100%'), n.appendChild(i)
            const r = i.offsetWidth
            null === (t = n.parentNode) || void 0 === t || t.removeChild(n), (e = s - r)
          }
          return e
        }
      })()
      function s(e, t, n) {
        null !== e && e.style.setProperty(t, n)
      }
      function i(e, t) {
        return getComputedStyle(e, null).getPropertyValue(t)
      }
      function r(e, t) {
        return parseInt(i(e, t))
      }
      let a = 0,
        l = !1
      function d(e) {
        const { body: t } = document,
          n = t.querySelector('.widgetbar-wrap')
        if (e && 1 == ++a) {
          const e = i(t, 'overflow'),
            a = r(t, 'padding-right')
          'hidden' !== e.toLowerCase() &&
            t.scrollHeight > t.offsetHeight &&
            (s(n, 'right', o() + 'px'), (t.style.paddingRight = a + o() + 'px'), (l = !0)),
            t.classList.add('i-no-scroll')
        } else if (!e && a > 0 && 0 == --a && (t.classList.remove('i-no-scroll'), l)) {
          s(n, 'right', '0px')
          let e = 0
          0, t.scrollHeight <= t.clientHeight && (e -= o()), (t.style.paddingRight = (e < 0 ? 0 : e) + 'px'), (l = !1)
        }
      }
    },
    89324: (e, t, n) => {
      n.r(t),
        n.d(t, {
          Components: () => d,
          showDefaultSearchDialog: () => l,
          showSymbolSearchItemsDialog: () => r.showSymbolSearchItemsDialog,
        })
      var o = n(82992),
        s = (n(32563), n(38318)),
        i = n(89453),
        r = n(1861),
        a = n(84015)
      n(67337), n(49483)
      !(0, a.isOnMobileAppPage)('any') && window.matchMedia('(min-width: 602px) and (min-height: 445px)').matches
      function l(e) {
        const t = (0, i.getSymbolSearchCompleteOverrideFunction)(),
          { defaultValue: n, showSpreadActions: a, source: l, onSearchComplete: d, ...c } = e,
          h = {
            ...c,
            showSpreadActions: null != a ? a : (0, s.canShowSpreadActions)(),
            onSearchComplete: e => {
              t(e[0].symbol).then(e => {
                o.linking.symbol.setValue(e), null == d || d(e)
              })
            },
          }
        ;(0, r.showSymbolSearchItemsDialog)({ ...h, defaultValue: n })
      }
      const d = { SymbolSearchWatchlistDialogContentItem: null, SymbolSearchWatchlistDialog: null }
    },
    58095: (e, t, n) => {
      n.d(t, { useOutsideEvent: () => i })
      var o = n(59496),
        s = n(39640)
      function i(e) {
        const {
            click: t,
            mouseDown: n,
            touchEnd: i,
            touchStart: r,
            handler: a,
            reference: l,
            ownerDocument: d = document,
          } = e,
          c = (0, o.useRef)(null),
          h = (0, o.useRef)(new CustomEvent('timestamp').timeStamp)
        return (
          (0, o.useLayoutEffect)(() => {
            const e = { click: t, mouseDown: n, touchEnd: i, touchStart: r },
              o = l ? l.current : c.current
            return (0, s.addOutsideEventListener)(h.current, o, a, d, e)
          }, [t, n, i, r, a]),
          l || c
        )
      }
    },
    90692: (e, t, n) => {
      n.d(t, { MatchMedia: () => s })
      var o = n(59496)
      class s extends o.PureComponent {
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
      n.d(t, { OverlapManager: () => i, getRootOverlapManager: () => a })
      var o = n(88537)
      class s {
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
          ;(this._storage = new s()),
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
      const r = new WeakMap()
      function a(e = document) {
        const t = e.getElementById('overlap-manager-root')
        if (null !== t) return (0, o.ensureDefined)(r.get(t))
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
          return r.set(n, t), t.setContainer(n), e.body.appendChild(n), t
        }
      }
    },
    65718: (e, t, n) => {
      n.d(t, { Portal: () => l, PortalContext: () => d })
      var o = n(59496),
        s = n(87995),
        i = n(9423),
        r = n(88216),
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
            s.createPortal(o.createElement(d.Provider, { value: this }, this.props.children), e)
          )
        }
        moveToTop() {
          this._manager().moveToTop(this._uuid)
        }
        _manager() {
          return null === this.context ? (0, r.getRootOverlapManager)() : this.context
        }
      }
      l.contextType = a.SlotContext
      const d = o.createContext(null)
    },
    50655: (e, t, n) => {
      n.d(t, { Slot: () => s, SlotContext: () => i })
      var o = n(59496)
      class s extends o.Component {
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
  },
])
