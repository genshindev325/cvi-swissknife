;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7210],
  {
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
    88797: e => {
      e.exports = { loaderWrap: 'loaderWrap-wpeeczk7', big: 'big-wpeeczk7', loader: 'loader-wpeeczk7' }
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
    52506: e => {
      e.exports = { row: 'row-Bc0VIp30', line: 'line-Bc0VIp30', hint: 'hint-Bc0VIp30' }
    },
    33549: e => {
      e.exports = { menu: 'menu-qOMHRo3C' }
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
    76860: e => {
      e.exports = { separator: 'separator-ErQ6N9mF' }
    },
    73432: e => {
      e.exports = {
        button: 'button-SD4Dbbwd',
        disabled: 'disabled-SD4Dbbwd',
        active: 'active-SD4Dbbwd',
        hidden: 'hidden-SD4Dbbwd',
      }
    },
    84413: (e, t, n) => {
      'use strict'
      n.d(t, { CheckboxInput: () => c })
      var s = n(59496),
        o = n(97754),
        a = n(9745),
        r = n(49154),
        i = n(37593),
        l = n.n(i)
      function c(e) {
        const t = o(l().box, l()['intent-' + e.intent], {
            [l().check]: !Boolean(e.indeterminate),
            [l().dot]: Boolean(e.indeterminate),
            [l().noOutline]: -1 === e.tabIndex,
          }),
          n = o(l().wrapper, e.className)
        return s.createElement(
          'span',
          { className: n, title: e.title },
          s.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: l().input,
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
          s.createElement('span', { className: t }, s.createElement(a.Icon, { icon: r, className: l().icon })),
        )
      }
    },
    26996: (e, t, n) => {
      'use strict'
      n.d(t, { Loader: () => c })
      var s,
        o = n(59496),
        a = n(97754),
        r = n(74991),
        i = n(62092),
        l = n.n(i)
      !(function (e) {
        ;(e[(e.Initial = 0)] = 'Initial'), (e[(e.Appear = 1)] = 'Appear'), (e[(e.Active = 2)] = 'Active')
      })(s || (s = {}))
      class c extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._stateChangeTimeout = null),
            (this.state = {
              state: s.Initial,
            })
        }
        render() {
          const { className: e, color: t = 'black', size: n = 'medium', staticPosition: s } = this.props,
            r = a(l().item, l()[t], l()[n])
          return o.createElement(
            'span',
            { className: a(l().loader, s && l().static, this._getStateClass(), e) },
            o.createElement('span', { className: r }),
            o.createElement('span', { className: r }),
            o.createElement('span', { className: r }),
          )
        }
        componentDidMount() {
          this.setState({ state: s.Appear }),
            (this._stateChangeTimeout = setTimeout(() => {
              this.setState({ state: s.Active })
            }, 2 * r.dur))
        }
        componentWillUnmount() {
          this._stateChangeTimeout && (clearTimeout(this._stateChangeTimeout), (this._stateChangeTimeout = null))
        }
        _getStateClass() {
          switch (this.state.state) {
            case s.Initial:
              return l()['loader-initial']
            case s.Appear:
              return l()['loader-appear']
            default:
              return ''
          }
        }
      }
    },
    8312: (e, t, n) => {
      'use strict'
      n.d(t, { ActionsTable: () => Y })
      var s = n(59496),
        o = n(52506)
      function a(e) {
        return s.createElement(
          'tr',
          { className: o.row },
          s.createElement('td', null, s.createElement('div', { className: o.line })),
          s.createElement(
            'td',
            null,
            s.createElement('div', { className: o.line }),
            e.hint ? s.createElement('div', { className: o.hint }, e.hint) : null,
          ),
        )
      }
      var r = n(88537),
        i = n(97754),
        l = n.n(i),
        c = n(84413),
        u = n(49483),
        h = n(32563)
      var p = n(96040),
        d = n(36189),
        m = n(99025),
        b = n(25812),
        v = n(51956),
        x = n(37049),
        C = n(19119)
      class g extends s.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleMouseOver = e => {
              ;(function (e) {
                const t = e.sourceCapabilities
                let n = t && t.firesTouchEvents
                return void 0 === n && (n = h.touch), n
              })(e.nativeEvent) ||
                (this.props.onMouseOver && this.props.onMouseOver())
            }),
            (this._handleClickToolbox = e => {
              e.stopPropagation(), this.props.onClickToolbox && this.props.onClickToolbox()
            })
        }
        render() {
          const {
              hasSubItems: e,
              shortcutHint: t,
              hint: n,
              invisibleHotkey: o,
              favourite: a,
              theme: r = C,
              size: l = 'normal',
            } = this.props,
            c = this.props.checkable && this.props.checkboxInput ? 'label' : 'div'
          return s.createElement(
            s.Fragment,
            null,
            s.createElement(
              'tr',
              {
                className: i(
                  r.item,
                  !this.props.noInteractive && r.interactive,
                  this.props.hovered && r.hovered,
                  this.props.disabled && r.disabled,
                  this.props.active && r.active,
                  this.props.selected && r.selected,
                  r[l],
                ),
                onClick: this.props.onClick,
                onMouseOver: this._handleMouseOver,
                ref: this.props.reference,
                'data-action-name': this.props.actionName,
              },
              void 0 !== a &&
                s.createElement(
                  'td',
                  null,
                  s.createElement(d.FavoriteButton, {
                    className: r.favourite,
                    isFilled: a,
                    onClick: this.props.onFavouriteClick,
                  }),
                ),
              s.createElement('td', { className: i(r.iconCell), 'data-icon-cell': !0 }, this._icon(r)),
              s.createElement(
                'td',
                { className: r.contentCell },
                s.createElement(
                  c,
                  { className: r.content },
                  s.createElement(
                    'span',
                    { className: i(r.label, this.props.checked && r.checked), 'data-label': !0 },
                    this.props.label,
                  ),
                  this._toolbox(r),
                  e &&
                    s.createElement('span', {
                      className: r.arrowIcon,
                      dangerouslySetInnerHTML: { __html: x },
                      'data-submenu-arrow': !0,
                    }),
                  !e &&
                    t &&
                    !u.CheckMobile.any() &&
                    s.createElement(m.Hint, { className: i(o && r.invisibleHotkey), text: t }),
                  !e && !t && n && s.createElement(m.Hint, { text: n }),
                ),
              ),
            ),
            s.createElement('tr', { className: r.subMenu }, s.createElement('td', null, this.props.children)),
          )
        }
        _icon(e) {
          if (this.props.checkable) {
            if (this.props.checkboxInput)
              return s.createElement(c.CheckboxInput, {
                className: i(e.icon, e.checkboxInput),
                checked: this.props.checked,
              })
            if (this.props.checked) {
              const t = !this.props.icon && !this.props.iconChecked,
                n = this.props.iconChecked || this.props.icon || v
              return s.createElement('span', {
                className: i(e.icon, t && e.checkmark),
                dangerouslySetInnerHTML: { __html: n },
                'data-icon-checkmark': t,
              })
            }
            return this.props.icon
              ? s.createElement('span', { className: e.icon, dangerouslySetInnerHTML: { __html: this.props.icon } })
              : s.createElement('span', { className: e.icon })
          }
          return this.props.icon
            ? s.createElement('span', { className: e.icon, dangerouslySetInnerHTML: { __html: this.props.icon } })
            : null
        }
        _toolbox(e) {
          return this.props.toolbox
            ? s.createElement(
                'span',
                {
                  className: i(e.toolbox, this.props.showToolboxOnHover && e.showToolboxOnHover),
                  onClick: this._handleClickToolbox,
                  'data-toolbox': !0,
                },
                this._renderToolboxContent(),
              )
            : null
        }
        _renderToolboxContent() {
          if (this.props.toolbox)
            switch (this.props.toolbox.type) {
              case b.ToolboxType.Delete:
                return s.createElement(p.RemoveButton, { onClick: this.props.toolbox.action })
            }
          return null
        }
      }
      var k = n(29332),
        E = n(59064),
        w = n(51768),
        _ = n(62820)
      var f = n(14758),
        M = n(26996),
        S = n(88797)
      function N(e) {
        const { size: t = 'normal' } = e
        return s.createElement(g, {
          size: t,
          label: s.createElement(
            'div',
            { className: l()(S.loaderWrap, S[t]) },
            s.createElement(M.Loader, { className: S.loader }),
          ),
          noInteractive: !0,
          onMouseOver: e.onMouseOver,
        })
      }
      class I extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._itemRef = null),
            (this._menuElementRef = s.createRef()),
            (this._menuRef = null),
            (this._handleClick = e => {
              e.isDefaultPrevented() ||
                this.state.disabled ||
                (this._hasSubItems()
                  ? this._showSubMenu()
                  : (this.state.doNotCloseOnClick || (0, E.globalCloseMenu)(),
                    this.props.action.execute(),
                    this._trackEvent(),
                    this.props.onExecute && this.props.onExecute(this.props.action)))
            }),
            (this._handleClickToolbox = () => {
              ;(0, E.globalCloseMenu)()
            }),
            (this._handleItemMouseOver = () => {
              this._showSubMenu(), this._setCurrentContextValue()
            }),
            (this._handleMenuMouseOver = () => {
              this._setCurrentContextValue()
            }),
            (this._showSubMenu = () => {
              this.props.onShowSubMenu(this.props.action)
            }),
            (this._calcSubMenuPos = e =>
              (function (e, t, n = { x: 0, y: 10 }) {
                if (t) {
                  const { left: n, right: s, top: o } = t.getBoundingClientRect(),
                    a = document.documentElement.clientWidth,
                    r = { x: n - e, y: o },
                    i = { x: s, y: o }
                  return (0, _.isRtl)() ? (n <= e ? i : r) : a - s >= e ? i : r
                }
                return n
              })(e, this._itemRef)),
            (this._updateState = e => {
              this.setState(e.getState())
            }),
            (this._setItemRef = e => {
              this._itemRef = e
            }),
            (this._handleMenuRef = e => {
              this._menuRef = e
            }),
            (this._registerSubmenu = () => {
              var e
              return null === (e = this.context) || void 0 === e
                ? void 0
                : e.registerSubmenu(
                    this.props.action.id,
                    e =>
                      (0, r.ensureNotNull)(this._itemRef).contains(e) ||
                      (null !== this._menuElementRef.current && this._menuElementRef.current.contains(e)),
                  )
            }),
            (this.state = { ...this.props.action.getState() })
        }
        componentDidMount() {
          this.props.action.onUpdate().subscribe(this, this._updateState),
            this.state.subItems.length && (this._unsubscribe = this._registerSubmenu()),
            this.props.reference && (this._itemRef = this.props.reference.current)
        }
        componentDidUpdate(e, t) {
          var n, s, o
          t.loading !== this.state.loading &&
            (null === (s = (n = this.props).onRequestUpdate) || void 0 === s || s.call(n)),
            0 === t.subItems.length && this.state.subItems.length > 0 && (this._unsubscribe = this._registerSubmenu()),
            t.subItems.length > 0 &&
              0 === this.state.subItems.length &&
              (null === (o = this._unsubscribe) || void 0 === o || o.call(this)),
            t.subItems !== this.state.subItems && null !== this._menuRef && this._menuRef.update()
        }
        componentWillUnmount() {
          this.props.action.onUpdate().unsubscribe(this, this._updateState), this._unsubscribe && this._unsubscribe()
        }
        render() {
          var e, t, n
          const o = null !== (e = this.state.jsxLabel) && void 0 !== e ? e : this.state.label,
            a = (null === (t = this.context) || void 0 === t ? void 0 : t.current)
              ? this.context.current === this.props.action.id
              : this.props.isSubMenuOpened
          return this.state.loading
            ? s.createElement(N, { size: this.state.size })
            : s.createElement(
                g,
                {
                  theme: this.props.theme,
                  reference: null !== (n = this.props.reference) && void 0 !== n ? n : this._setItemRef,
                  onClick: this._handleClick,
                  onClickToolbox: this._handleClickToolbox,
                  onMouseOver: this._handleItemMouseOver,
                  hovered: a,
                  hasSubItems: this._hasSubItems(),
                  actionName: this.state.name,
                  checkboxInput: this.props.checkboxInput,
                  selected: this.props.selected,
                  ...this.state,
                  label: o,
                },
                s.createElement(k.ContextMenu, {
                  isOpened: a,
                  items: this.state.subItems,
                  position: this._calcSubMenuPos,
                  menuStatName: this.props.menuStatName,
                  parentStatName: this._getStatName(),
                  menuElementReference: this._menuElementRef,
                  onMouseOver: this.state.subItems.length ? this._handleMenuMouseOver : void 0,
                  ref: this._handleMenuRef,
                }),
              )
        }
        _setCurrentContextValue() {
          var e
          this.state.subItems.length &&
            (null === (e = this.context) || void 0 === e || e.setCurrent(this.props.action.id))
        }
        _hasSubItems() {
          return this.state.subItems.length > 0
        }
        _trackEvent() {
          const e = this._getStatName()
          ;(0, w.trackEvent)('ContextMenuClick', this.props.menuStatName || '', e)
        }
        _getStatName() {
          return [this.props.parentStatName, this.state.statName].filter(e => Boolean(e)).join('.')
        }
      }
      I.contextType = f.SubmenuContext
      class Y extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._handleShowSubMenu = e => {
              const t = e.getState()
              this.setState({ showSubMenuOf: t.subItems.length ? e : void 0 })
            }),
            (this.state = {})
        }
        render() {
          return s.createElement(
            'table',
            null,
            s.createElement(
              'tbody',
              null,
              this.props.items.map(e => this._item(e)),
            ),
          )
        }
        static getDerivedStateFromProps(e, t) {
          return !e.parentIsOpened && t.showSubMenuOf ? { showSubMenuOf: void 0 } : null
        }
        _item(e) {
          switch (e.type) {
            case 'separator':
              return s.createElement(a, { key: e.id, hint: e.getHint() })
            case 'action':
              return s.createElement(I, {
                key: e.id,
                action: e,
                onShowSubMenu: this._handleShowSubMenu,
                isSubMenuOpened: this.state.showSubMenuOf === e,
                menuStatName: this.props.menuStatName,
                parentStatName: this.props.parentStatName,
                onRequestUpdate: this.props.onRequestUpdate,
              })
          }
        }
      }
    },
    29332: (e, t, n) => {
      'use strict'
      n.d(t, { ContextMenu: () => f, OverlapContextMenu: () => M })
      var s = n(59496),
        o = n(97754),
        a = n.n(o),
        r = n(86431),
        i = n(27317),
        l = n(76594),
        c = n(9481),
        u = n(8312),
        h = n(37558),
        p = n(90692),
        d = n(76860)
      function m(e) {
        return s.createElement('li', { className: d.separator })
      }
      var b = n(23829),
        v = n(41590),
        x = n(59064)
      function C(e) {
        const { action: t } = e,
          [n, o] = (0, s.useState)(() => t.getState()),
          [a, r] = (0, s.useState)(!1),
          i = !!n.subItems.length,
          l = i && a
        return (
          (0, s.useEffect)(() => {
            const e = () => o(t.getState())
            return (
              t.onUpdate().subscribe(null, e),
              () => {
                t.onUpdate().unsubscribe(null, e)
              }
            )
          }, []),
          s.createElement(
            b.ContextMenuItem,
            {
              ...n,
              onClick: function (e) {
                if (n.disabled || e.defaultPrevented) return
                if (i) return void r(!0)
                n.doNotCloseOnClick || (0, x.globalCloseMenu)()
                t.execute()
              },
              isLoading: n.loading,
              isHovered: l,
            },
            l &&
              s.createElement(
                v.Drawer,
                { onClose: c },
                s.createElement(E, { items: n.subItems, parentAction: t, closeNested: c }),
              ),
          )
        )
        function c(e) {
          e && e.preventDefault(), r(!1)
        }
      }
      var g = n(54627),
        k = n(4301)
      function E(e) {
        const { items: t, parentAction: n, closeNested: o } = e,
          a =
            !Boolean(n) &&
            t.every(e => !Boolean('separator' !== e.type && (e.getState().icon || e.getState().checkable)))
        return s.createElement(
          g.EmptyIconsContext.Provider,
          { value: a },
          s.createElement(
            'ul',
            null,
            n &&
              s.createElement(
                s.Fragment,
                null,
                s.createElement(b.ContextMenuItem, {
                  label: n.getState().label,
                  isTitle: !0,
                  active: !1,
                  disabled: !1,
                  subItems: [],
                  checkable: !1,
                  checked: !1,
                  doNotCloseOnClick: !1,
                  icon: k,
                  onClick: o,
                }),
                s.createElement(m, null),
              ),
            t.map(e => {
              switch (e.type) {
                case 'action':
                  return s.createElement(C, { key: e.id, action: e })
                case 'separator':
                  return s.createElement(m, { key: e.id })
              }
            }),
          ),
        )
      }
      const w = s.createContext(null)
      var _ = n(33549)
      class f extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._menuRef = s.createRef()),
            (this._handleRequestUpdate = () => {
              this.update()
            }),
            (this._handleClose = () => {
              this.props.onClose && this.props.onClose()
            }),
            (this._handleOutsideClickClose = e => {
              const { doNotCloseOn: t, onClose: n } = this.props
              !n || (void 0 !== t && t.contains(e.target)) || n()
            }),
            (this._handleFocusOnOpen = () => {
              var e, t
              ;(null === (e = this.props.menuElementReference) || void 0 === e ? void 0 : e.current) &&
                this.props.takeFocus &&
                (null === (t = this.props.menuElementReference) ||
                  void 0 === t ||
                  t.current.focus({ preventScroll: !0 }))
            }),
            (this.state = {})
        }
        render() {
          const {
            isOpened: e,
            onClose: t,
            items: n,
            doNotCloseOn: o,
            menuStatName: r,
            parentStatName: d,
            takeFocus: m,
            ...b
          } = this.props
          return e
            ? s.createElement(
                h.DrawerManager,
                null,
                s.createElement(c.KeyboardDocumentListener, {
                  keyCode: 27,
                  eventType: 'keyup',
                  handler: this._handleClose,
                }),
                s.createElement(p.MatchMedia, { rule: 'screen and (max-width: 428px)' }, t =>
                  this._isDrawer(t)
                    ? s.createElement(
                        w.Provider,
                        { value: { type: 'drawer' } },
                        s.createElement(
                          v.Drawer,
                          { onClose: this._handleClose, position: 'Bottom', 'data-name': b['data-name'] },
                          s.createElement(E, { items: n }),
                        ),
                      )
                    : s.createElement(
                        w.Provider,
                        { value: { type: 'menu' } },
                        s.createElement(
                          l.OutsideEvent,
                          {
                            handler: this._handleOutsideClickClose,
                            mouseDown: !0,
                            touchStart: !0,
                            reference: this.props.menuElementReference,
                          },
                          t =>
                            s.createElement(
                              i.Menu,
                              {
                                ...b,
                                reference: t,
                                className: a()(_.menu, 'context-menu'),
                                onClose: this._handleClose,
                                noMomentumBasedScroll: !0,
                                ref: this._menuRef,
                                tabIndex: m ? -1 : void 0,
                                onOpen: this._handleFocusOnOpen,
                              },
                              s.createElement(u.ActionsTable, {
                                items: n,
                                menuStatName: r,
                                parentStatName: d,
                                parentIsOpened: e,
                                onRequestUpdate: this._handleRequestUpdate,
                              }),
                            ),
                        ),
                      ),
                ),
              )
            : null
        }
        update() {
          this._menuRef.current && this._menuRef.current.update()
        }
        _isDrawer(e) {
          return void 0 === this.props.mode ? e : 'drawer' === this.props.mode
        }
      }
      const M = (0, r.makeOverlapable)(f)
    },
    99025: (e, t, n) => {
      'use strict'
      n.d(t, { Hint: () => i })
      var s = n(59496),
        o = n(97754),
        a = n.n(o),
        r = n(19119)
      function i(e) {
        const { text: t = '', className: n } = e
        return s.createElement('span', { className: a()(r.shortcut, n) }, t)
      }
    },
    23829: (e, t, n) => {
      'use strict'
      n.d(t, { ContextMenuItem: () => m })
      var s = n(59496),
        o = n(97754),
        a = n.n(o),
        r = n(9745),
        i = n(26996),
        l = n(54627),
        c = n(99025),
        u = n(86440),
        h = n(4585),
        p = n(74471),
        d = n(61999)
      function m(e) {
        const {
            isTitle: t,
            isLoading: n,
            isHovered: o,
            active: m,
            checkable: b,
            disabled: v,
            checked: x,
            icon: C,
            iconChecked: g,
            hint: k,
            subItems: E,
            label: w,
            onClick: _,
            children: f,
            toolbox: M,
            jsxLabel: S,
            size: N = 'normal',
          } = e,
          I = (0, s.useContext)(l.EmptyIconsContext),
          Y = !!E.length
        return n
          ? s.createElement('li', { className: a()(d.item, d.loading, d[N]) }, s.createElement(i.Loader, null))
          : s.createElement(
              'li',
              {
                className: a()(
                  d.item,
                  d.interactive,
                  t && d.title,
                  v && d.disabled,
                  o && d.hovered,
                  m && d.active,
                  I && d.emptyIcons,
                  d[N],
                ),
                onClick: _,
              },
              s.createElement(r.Icon, {
                className: a()(d.icon),
                icon: (function () {
                  if (b && x) return g || C || u
                  return C
                })(),
              }),
              s.createElement('span', { className: a()(d.label) }, null != S ? S : w),
              !!M &&
                s.createElement(r.Icon, {
                  onClick: function () {
                    M && M.action()
                  },
                  className: d.remove,
                  icon: p,
                }),
              !Y && k && s.createElement(c.Hint, { className: d.shortcut, text: k }),
              Y && s.createElement(r.Icon, { className: d.nested, icon: h }),
              f,
            )
      }
    },
    54627: (e, t, n) => {
      'use strict'
      n.d(t, { EmptyIconsContext: () => s })
      const s = n(59496).createContext(!1)
    },
    9481: (e, t, n) => {
      'use strict'
      n.d(t, { KeyboardDocumentListener: () => o })
      var s = n(59496)
      class o extends s.PureComponent {
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
    76594: (e, t, n) => {
      'use strict'
      n.d(t, { OutsideEvent: () => o })
      var s = n(58095)
      function o(e) {
        const { children: t, ...n } = e
        return t((0, s.useOutsideEvent)(n))
      }
    },
    86431: (e, t, n) => {
      'use strict'
      n.d(t, { makeOverlapable: () => a })
      var s = n(59496),
        o = n(65718)
      function a(e) {
        return class extends s.PureComponent {
          render() {
            const { isOpened: t, root: n } = this.props
            if (!t) return null
            const a = s.createElement(e, { ...this.props, zIndex: 150 })
            return 'parent' === n ? a : s.createElement(o.Portal, null, a)
          }
        }
      }
    },
    96040: (e, t, n) => {
      'use strict'
      n.d(t, { RemoveButton: () => u })
      var s = n(28353),
        o = n(59496),
        a = n(97754),
        r = n(9745),
        i = n(73366),
        l = n(73432)
      const c = { remove: (0, s.t)('Remove') }
      function u(e) {
        const {
          className: t,
          isActive: n,
          onClick: s,
          onMouseDown: u,
          title: h,
          hidden: p,
          'data-name': d = 'remove-button',
          ...m
        } = e
        return o.createElement(r.Icon, {
          ...m,
          'data-name': d,
          className: a(l.button, 'apply-common-tooltip', n && l.active, p && l.hidden, t),
          icon: i,
          onClick: s,
          onMouseDown: u,
          title: h || c.remove,
        })
      }
    },
    49154: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'
    },
    4301: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 20L11 14.5 16.5 9"/></svg>'
    },
    4585: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>'
    },
    51956: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 14" width="18" height="14"><path fill="currentColor" d="M6 11.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41-10.59 10.58z"/></svg>'
    },
    86440: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>'
    },
    73366: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>'
    },
    74471: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.7 9l4.65-4.65-.7-.7L9 8.29 4.35 3.65l-.7.7L8.29 9l-4.64 4.65.7.7L9 9.71l4.65 4.64.7-.7L9.71 9z"/></svg>'
    },
  },
])
