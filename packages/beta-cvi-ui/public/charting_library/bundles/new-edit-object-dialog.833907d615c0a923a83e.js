;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6265],
  {
    26390: e => {
      e.exports = {
        switcher: 'switcher-GT7Z98Io',
        'disable-cursor-pointer': 'disable-cursor-pointer-GT7Z98Io',
        input: 'input-GT7Z98Io',
        'thumb-wrapper': 'thumb-wrapper-GT7Z98Io',
        'size-small': 'size-small-GT7Z98Io',
        'size-large': 'size-large-GT7Z98Io',
        'intent-default': 'intent-default-GT7Z98Io',
        'disable-active-state-styles': 'disable-active-state-styles-GT7Z98Io',
        'intent-select': 'intent-select-GT7Z98Io',
        track: 'track-GT7Z98Io',
        thumb: 'thumb-GT7Z98Io',
      }
    },
    31405: e => {
      e.exports = {
        wrapper: 'wrapper-IbP2mmCe',
        hovered: 'hovered-IbP2mmCe',
        labelRow: 'labelRow-IbP2mmCe',
        label: 'label-IbP2mmCe',
        labelHint: 'labelHint-IbP2mmCe',
        labelOn: 'labelOn-IbP2mmCe',
      }
    },
    20959: e => {
      e.exports = {
        smallStyleControl: 'smallStyleControl-tMebfShj',
        additionalSelect: 'additionalSelect-tMebfShj',
        childRowContainer: 'childRowContainer-tMebfShj',
        defaultSelect: 'defaultSelect-tMebfShj',
        defaultSelectItem: 'defaultSelectItem-tMebfShj',
        block: 'block-tMebfShj',
        group: 'group-tMebfShj',
        wrapGroup: 'wrapGroup-tMebfShj',
        textMarkGraphicBlock: 'textMarkGraphicBlock-tMebfShj',
        textMarkGraphicWrapGroup: 'textMarkGraphicWrapGroup-tMebfShj',
      }
    },
    942: e => {
      e.exports = { scrollable: 'scrollable-pm9AiChK' }
    },
    84662: e => {
      e.exports = {
        defaultsButtonText: 'defaultsButtonText-4BZduqY4',
        defaultsButtonItem: 'defaultsButtonItem-4BZduqY4',
        defaultsButtonIcon: 'defaultsButtonIcon-4BZduqY4',
      }
    },
    85623: e => {
      e.exports = {
        themesButtonText: 'themesButtonText-KBqedPzF',
        themesButtonIcon: 'themesButtonIcon-KBqedPzF',
        defaultsButtonText: 'defaultsButtonText-KBqedPzF',
        defaultsButtonItem: 'defaultsButtonItem-KBqedPzF',
      }
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
    84096: (e, t, r) => {
      'use strict'
      r.d(t, { DEFAULT_MENU_ITEM_SWITCHER_THEME: () => u, MenuItemSwitcher: () => m })
      var l = r(59496),
        n = r(97754),
        s = r.n(n)
      const i = (0, l.createContext)({ enablePointerOnHover: !0, enableActiveStateStyles: !0 })
      var o = r(26390),
        a = r.n(o)
      function c(e) {
        const t = (0, l.useContext)(i),
          {
            className: r,
            intent: s = 'default',
            size: o = 'small',
            enablePointerOnHover: c = t.enablePointerOnHover,
            enableActiveStateStyles: p = t.enableActiveStateStyles,
          } = e
        return n(
          r,
          a().switcher,
          a()['size-' + o],
          a()['intent-' + s],
          !c && a()['disable-cursor-pointer'],
          !p && a()['disable-active-state-styles'],
        )
      }
      function p(e) {
        const { reference: t, size: r, intent: n, ...s } = e
        return l.createElement(
          'div',
          { className: c(e) },
          l.createElement('input', { ...s, type: 'checkbox', className: a().input, ref: t }),
          l.createElement(
            'div',
            { className: a()['thumb-wrapper'] },
            l.createElement('div', { className: a().track }),
            l.createElement('div', { className: a().thumb }),
          ),
        )
      }
      var d = r(90186),
        h = r(31405)
      const u = h
      function m(e) {
        const {
            className: t,
            checked: r,
            id: n,
            label: i,
            labelDescription: o,
            value: a,
            preventLabelHighlight: c,
            reference: u,
            switchReference: m,
            theme: y = h,
            disabled: v,
          } = e,
          g = s()(y.label, r && !c && y.labelOn),
          b = s()(t, y.wrapper, r && y.wrapperWithOnLabel)
        return l.createElement(
          'label',
          { className: b, htmlFor: n, ref: u },
          l.createElement(
            'div',
            { className: y.labelRow },
            l.createElement('div', { className: g }, i),
            o && l.createElement('div', { className: y.labelHint }, o),
          ),
          l.createElement(p, {
            disabled: v,
            className: y.switch,
            reference: m,
            checked: r,
            onChange: function (t) {
              const r = t.target.checked
              void 0 !== e.onChange && e.onChange(r)
            },
            value: a,
            tabIndex: -1,
            id: n,
            ...(0, d.filterDataProps)(e),
          }),
        )
      }
    },
    80331: (e, t, r) => {
      'use strict'
      r.r(t), r.d(t, { createPropertyPage: () => s })
      var l = r(52714),
        n = r.n(l)
      function s(e, t, r, l = null) {
        var s
        const i = {
          id: t,
          title: r,
          definitions: new (n())(e.definitions),
          visible: null !== (s = e.visible) && void 0 !== s ? s : new (n())(!0).readonly(),
        }
        return null !== l && (i.icon = l), i
      }
    },
    80975: (e, t, r) => {
      'use strict'
      r.r(t),
        r.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => ce,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => pe,
        })
      var l = r(28353),
        n = r(24980),
        s = r(67337),
        i = r(50366),
        o = r(52714),
        a = r.n(o),
        c = r(9315),
        p = r(37865),
        d = r(98222)
      const h = new n.TranslatedString(
          'change {title} visibility on ticks',
          (0, l.t)('change {title} visibility on ticks'),
        ),
        u = new n.TranslatedString(
          'change {title} visibility on seconds',
          (0, l.t)('change {title} visibility on seconds'),
        ),
        m = new n.TranslatedString('change {title} seconds from', (0, l.t)('change {title} seconds from')),
        y = new n.TranslatedString('change {title} seconds to', (0, l.t)('change {title} seconds to')),
        v = new n.TranslatedString(
          'change {title} visibility on minutes',
          (0, l.t)('change {title} visibility on minutes'),
        ),
        g = new n.TranslatedString('change {title} minutes from', (0, l.t)('change {title} minutes from')),
        b = new n.TranslatedString('change {title} minutes to', (0, l.t)('change {title} minutes to')),
        f = new n.TranslatedString(
          'change {title} visibility on hours',
          (0, l.t)('change {title} visibility on hours'),
        ),
        w = new n.TranslatedString('change {title} hours from', (0, l.t)('change {title} hours from')),
        C = new n.TranslatedString('change {title} hours to', (0, l.t)('change {title} hours to')),
        S = new n.TranslatedString('change {title} visibility on days', (0, l.t)('change {title} visibility on days')),
        P = new n.TranslatedString('change {title} days from', (0, l.t)('change {title} days from')),
        T = new n.TranslatedString('change {title} days to', (0, l.t)('change {title} days to')),
        E = new n.TranslatedString(
          'change {title} visibility on weeks',
          (0, l.t)('change {title} visibility on weeks'),
        ),
        _ = new n.TranslatedString('change {title} weeks from', (0, l.t)('change {title} weeks from')),
        k = new n.TranslatedString('change {title} weeks to', (0, l.t)('change {title} weeks to')),
        x = new n.TranslatedString(
          'change {title} visibility on months',
          (0, l.t)('change {title} visibility on months'),
        ),
        I = new n.TranslatedString('change {title} months from', (0, l.t)('change {title} months from')),
        L = new n.TranslatedString('change {title} months to', (0, l.t)('change {title} months to')),
        M =
          (new n.TranslatedString(
            'change {title} visibility on ranges',
            (0, l.t)('change {title} visibility on ranges'),
          ),
          (0, l.t)('Ticks')),
        V = (0, l.t)('Seconds'),
        R = (0, l.t)('Minutes'),
        B = (0, l.t)('Hours'),
        D = (0, l.t)('Days'),
        N = (0, l.t)('Weeks'),
        W = (0, l.t)('Months'),
        z = ((0, l.t)('Ranges'), new n.TranslatedString('ticks', (0, l.t)('ticks'))),
        F = new n.TranslatedString('seconds', (0, l.t)('seconds')),
        A = new n.TranslatedString('seconds from', (0, l.t)('seconds from')),
        H = new n.TranslatedString('seconds to', (0, l.t)('seconds to')),
        G = new n.TranslatedString('minutes', (0, l.t)('minutes')),
        O = new n.TranslatedString('minutes from', (0, l.t)('minutes from')),
        U = new n.TranslatedString('minutes to', (0, l.t)('minutes to')),
        j = new n.TranslatedString('hours', (0, l.t)('hours')),
        K = new n.TranslatedString('hours from', (0, l.t)('hours from')),
        Z = new n.TranslatedString('hours to', (0, l.t)('hours to')),
        q = new n.TranslatedString('days', (0, l.t)('days')),
        Y = new n.TranslatedString('days from', (0, l.t)('days from')),
        Q = new n.TranslatedString('days to', (0, l.t)('days to')),
        X = new n.TranslatedString('weeks', (0, l.t)('weeks')),
        $ = new n.TranslatedString('weeks from', (0, l.t)('weeks from')),
        J = new n.TranslatedString('weeks to', (0, l.t)('weeks to')),
        ee = new n.TranslatedString('months', (0, l.t)('months')),
        te = new n.TranslatedString('months from', (0, l.t)('months from')),
        re = new n.TranslatedString('months to', (0, l.t)('months to')),
        le = (new n.TranslatedString('ranges', (0, l.t)('ranges')), [1, 59]),
        ne = [1, 59],
        se = [1, 24],
        ie = [1, 366],
        oe = [1, 52],
        ae = [1, 12]
      function ce(e, t, r) {
        const l = []
        if (s.enabled('tick_resolution')) {
          const n = (0, i.createCheckablePropertyDefinition)(
            { checked: (0, i.convertToDefinitionProperty)(e, t.ticks, h.format({ title: r })) },
            { id: 'IntervalsVisibilitiesTicks', title: M },
          )
          l.push(n)
        }
        if ((0, c.isSecondsEnabled)()) {
          const n = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.seconds, u.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.secondsFrom, m.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.secondsTo, y.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesSecond', title: V, min: new (a())(le[0]), max: new (a())(le[1]) },
          )
          l.push(n)
        }
        const n = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.minutes, v.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.minutesFrom, g.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.minutesTo, b.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesMinutes', title: R, min: new (a())(ne[0]), max: new (a())(ne[1]) },
          ),
          o = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.hours, f.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.hoursFrom, w.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.hoursTo, C.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesHours', title: B, min: new (a())(se[0]), max: new (a())(se[1]) },
          ),
          p = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.days, S.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.daysFrom, P.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.daysTo, T.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesDays', title: D, min: new (a())(ie[0]), max: new (a())(ie[1]) },
          )
        l.push(n, o, p)
        const d = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.weeks, E.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.weeksFrom, _.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.weeksTo, k.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesWeeks', title: N, min: new (a())(oe[0]), max: new (a())(oe[1]) },
          ),
          z = (0, i.createRangePropertyDefinition)(
            {
              checked: (0, i.convertToDefinitionProperty)(e, t.months, x.format({ title: r })),
              from: (0, i.convertToDefinitionProperty)(e, t.monthsFrom, I.format({ title: r })),
              to: (0, i.convertToDefinitionProperty)(e, t.monthsTo, L.format({ title: r })),
            },
            { id: 'IntervalsVisibilitiesMonths', title: W, min: new (a())(ae[0]), max: new (a())(ae[1]) },
          )
        return l.push(d, z), { definitions: l }
      }
      function pe(e, t) {
        const r = []
        if (s.enabled('tick_resolution')) {
          const l = (0, i.createCheckablePropertyDefinition)(
            { checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.ticks), z, t) },
            { id: 'IntervalsVisibilitiesTicks', title: M },
          )
          r.push(l)
        }
        if ((0, c.isSecondsEnabled)()) {
          const l = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.seconds), F, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.secondsFrom), A, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.secondsTo), H, t),
            },
            { id: 'IntervalsVisibilitiesSecond', title: V, min: new (a())(le[0]), max: new (a())(le[1]) },
          )
          r.push(l)
        }
        const l = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.minutes), G, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.minutesFrom), O, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.minutesTo), U, t),
            },
            { id: 'IntervalsVisibilitiesMinutes', title: R, min: new (a())(ne[0]), max: new (a())(ne[1]) },
          ),
          n = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.hours), j, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.hoursFrom), K, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.hoursTo), Z, t),
            },
            { id: 'IntervalsVisibilitiesHours', title: B, min: new (a())(se[0]), max: new (a())(se[1]) },
          ),
          o = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.days), q, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.daysFrom), Y, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.daysTo), Q, t),
            },
            { id: 'IntervalsVisibilitiesDays', title: D, min: new (a())(ie[0]), max: new (a())(ie[1]) },
          )
        r.push(l, n, o)
        const h = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.weeks), X, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.weeksFrom), $, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.weeksTo), J, t),
            },
            { id: 'IntervalsVisibilitiesWeeks', title: N, min: new (a())(oe[0]), max: new (a())(oe[1]) },
          ),
          u = (0, i.createRangePropertyDefinition)(
            {
              checked: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.months), ee, t),
              from: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.monthsFrom), te, t),
              to: new d.CollectiblePropertyUndoWrapper(new p.LineToolCollectedProperty(e.monthsTo), re, t),
            },
            { id: 'IntervalsVisibilitiesMonths', title: W, min: new (a())(ae[0]), max: new (a())(ae[1]) },
          )
        return r.push(h, u), { definitions: r }
      }
    },
    98222: (e, t, r) => {
      'use strict'
      r.d(t, { CollectiblePropertyUndoWrapper: () => c })
      var l = r(88537),
        n = r(28353),
        s = r(24980),
        i = r(2015),
        o = r.n(i)
      const a = new s.TranslatedString('change {propertyName} property', (0, n.t)('change {propertyName} property'))
      class c extends o() {
        constructor(e, t, r) {
          super(),
            (this._isProcess = !1),
            (this._listenersMappers = []),
            (this._valueApplier = {
              applyValue: (e, t) => {
                this._propertyApplier.setProperty(e, t, a)
              },
            }),
            (this._baseProperty = e),
            (this._propertyApplier = r),
            (this._propertyName = t)
        }
        destroy() {
          this._baseProperty.destroy()
        }
        value() {
          return this._baseProperty.value()
        }
        setValue(e, t) {
          this._propertyApplier.beginUndoMacro(a.format({ propertyName: this._propertyName })),
            (this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, this._valueApplier),
            (this._isProcess = !1),
            this._propertyApplier.endUndoMacro(),
            this._listenersMappers.forEach(e => {
              e.method.call(e.obj, this)
            })
        }
        subscribe(e, t) {
          const r = () => {
            this._isProcess || t.call(e, this)
          }
          this._listenersMappers.push({ obj: e, method: t, callback: r }), this._baseProperty.subscribe(e, r)
        }
        unsubscribe(e, t) {
          var r
          const n = (0, l.ensureDefined)(
            null === (r = this._listenersMappers.find(r => r.obj === e && r.method === t)) || void 0 === r
              ? void 0
              : r.callback,
          )
          this._baseProperty.unsubscribe(e, n)
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e)
        }
      }
    },
    73562: (e, t, r) => {
      'use strict'
      r.r(t), r.d(t, { EditObjectDialogRenderer: () => er })
      var l = r(87995),
        n = r(59496),
        s = r(88537),
        i = r(28353),
        o = r(24980),
        a = r(11372),
        c = r(56840),
        p = r(67337),
        d = r(76422),
        h = r(51768),
        u = r(31807),
        m = r(34290),
        y = r(50182),
        v = r(59064),
        g = r(86656),
        b = r(81851),
        f = r(37289),
        w = r(14291),
        C = r(18460),
        S = r(942)
      class P extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleClose = e => {
              ;((null == e ? void 0 : e.target) && e.target.closest('[data-dialog-name="gopro"]')) ||
                this.props.onClose()
            }),
            (this._renderFooterLeft = e => {
              const { source: t, model: r } = this.props
              if ((0, w.isLineTool)(t)) return n.createElement(C.FooterMenu, { source: t, model: r })
              if ((0, b.isStudy)(t))
                return n.createElement(m.StudyDefaultsManager, { model: r, source: t, mode: e ? 'compact' : 'normal' })
              throw new TypeError('Unsupported source type.')
            }),
            (this._handleSelect = e => {
              this.setState({ activeTabId: e }, () => {
                this._requestResize && this._requestResize()
              }),
                this.props.onActiveTabChanged && this.props.onActiveTabChanged(e)
            }),
            (this._handleScroll = () => {
              v.globalCloseDelegate.fire()
            }),
            (this._handleSubmit = () => {
              this.props.onSubmit(), this.props.onClose()
            })
          const { pages: t, initialActiveTab: r } = this.props
          this.state = { activeTabId: t.allIds.includes(r) ? r : t.allIds[0] }
        }
        render() {
          const { title: e, onCancel: t, onClose: r } = this.props,
            { activeTabId: l } = this.state
          return n.createElement(y.AdaptiveConfirmDialog, {
            dataName: 'indicator-properties-dialog',
            title: e,
            isOpened: !0,
            onSubmit: this._handleSubmit,
            onCancel: t,
            onClickOutside: this._handleClose,
            onClose: r,
            footerLeftRenderer: this._renderFooterLeft,
            render: this._renderChildren(l),
            submitOnEnterKey: !1,
          })
        }
        _renderChildren(e) {
          return ({ requestResize: t }) => {
            this._requestResize = t
            const { pages: r, source: l, model: s } = this.props,
              i = r.byId[e],
              o = 'Component' in i ? void 0 : i.page
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(u.DialogTabs, { activeTabId: e, onSelect: this._handleSelect, tabs: r }),
              n.createElement(
                g.TouchScrollContainer,
                { className: S.scrollable, onScroll: this._handleScroll },
                'Component' in i
                  ? n.createElement(i.Component, { source: l, model: s })
                  : n.createElement(f.PropertiesEditorTab, { page: o, tableKey: e }),
              ),
            )
          }
        }
      }
      var T = r(27423),
        E = r(56756)
      class _ extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._properties = this.props.source.properties()),
            (this._inputs = new E.MetaInfoHelper(this.props.source.metaInfo()).getUserEditableInputs())
        }
        render() {
          return n.createElement(T.InputsTabContent, {
            property: this._properties,
            model: this.props.model,
            study: this.props.source,
            inputs: this._inputs,
          })
        }
      }
      var k = r(22064),
        x = r(50993),
        I = r(67072),
        L = r.n(I),
        M = r(87536),
        V = r(48100),
        R = r(463)
      const B = new o.TranslatedString('change visibility', (0, i.t)('change visibility'))
      class D extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = e => {
              const { setValue: t } = this.context,
                { visible: r } = this.props
              r && (0, R.setPropertyValue)(r, r => t(r, e, B))
            })
        }
        render() {
          const { id: e, title: t, visible: r, disabled: l } = this.props,
            s = (0, a.clean)((0, i.t)(t, { context: 'input' }), !0)
          return n.createElement(V.BoolInputComponent, {
            label: s,
            disabled: l,
            input: { id: e, type: 'bool', defval: !0, name: 'visible' },
            value: !r || (0, R.getPropertyValue)(r),
            onChange: this._onChange,
          })
        }
      }
      D.contextType = M.StylePropertyContext
      var N = r(27547),
        W = r(51613),
        z = r(84096),
        F = r(94697),
        A = r(86891),
        H = r(84863),
        G = r(85550),
        O = r(5377),
        U = r(76115),
        j = r(40551),
        K = r(8273),
        Z = r(99594),
        q = r(79142),
        Y = r(28853)
      const Q = {
          [x.LineStudyPlotStyle.Line]: { type: x.LineStudyPlotStyle.Line, order: 0, icon: A, label: (0, i.t)('Line') },
          [x.LineStudyPlotStyle.LineWithBreaks]: {
            type: x.LineStudyPlotStyle.LineWithBreaks,
            order: 1,
            icon: H,
            label: (0, i.t)('Line with breaks'),
          },
          [x.LineStudyPlotStyle.StepLine]: {
            type: x.LineStudyPlotStyle.StepLine,
            order: 2,
            icon: G,
            label: (0, i.t)('Step line'),
          },
          [x.LineStudyPlotStyle.StepLineWithDiamonds]: {
            type: x.LineStudyPlotStyle.StepLineWithDiamonds,
            order: 3,
            icon: O,
            label: (0, i.t)('Step line with diamonds'),
          },
          [x.LineStudyPlotStyle.Histogram]: {
            type: x.LineStudyPlotStyle.Histogram,
            order: 4,
            icon: U,
            label: (0, i.t)('Histogram'),
          },
          [x.LineStudyPlotStyle.Cross]: {
            type: x.LineStudyPlotStyle.Cross,
            order: 5,
            icon: j,
            label: (0, i.t)('Cross', { context: 'chart_type' }),
          },
          [x.LineStudyPlotStyle.Area]: { type: x.LineStudyPlotStyle.Area, order: 6, icon: K, label: (0, i.t)('Area') },
          [x.LineStudyPlotStyle.AreaWithBreaks]: {
            type: x.LineStudyPlotStyle.AreaWithBreaks,
            order: 7,
            icon: Z,
            label: (0, i.t)('Area with breaks'),
          },
          [x.LineStudyPlotStyle.Columns]: {
            type: x.LineStudyPlotStyle.Columns,
            order: 8,
            icon: q,
            label: (0, i.t)('Columns'),
          },
          [x.LineStudyPlotStyle.Circles]: {
            type: x.LineStudyPlotStyle.Circles,
            order: 9,
            icon: Y,
            label: (0, i.t)('Circles'),
          },
        },
        X = Object.values(Q)
          .sort((e, t) => e.order - t.order)
          .map(e => ({
            value: e.type,
            selectedContent: n.createElement(F.DisplayItem, { icon: e.icon }),
            content: n.createElement(F.DropItem, { icon: e.icon, label: e.label }),
          })),
        $ = (0, i.t)('Price line')
      class J extends n.PureComponent {
        render() {
          const {
            id: e,
            plotType: t,
            className: r,
            priceLine: l,
            plotTypeChange: s,
            priceLineChange: i,
            disabled: o,
          } = this.props
          if (!(t in Q)) return null
          const a = {
            readonly: !0,
            content: n.createElement(
              n.Fragment,
              null,
              n.createElement(z.MenuItemSwitcher, {
                id: 'PlotTypePriceLineSwitch',
                checked: l,
                label: $,
                preventLabelHighlight: !0,
                value: 'priceLineSwitcher',
                onChange: i,
              }),
              n.createElement(W.PopupMenuSeparator, null),
            ),
          }
          return n.createElement(F.IconDropdown, {
            id: e,
            disabled: o,
            className: r,
            hideArrowButton: !0,
            items: [a, ...X],
            value: t,
            onChange: s,
          })
        }
      }
      var ee = r(79946),
        te = r(20959)
      const re = new o.TranslatedString('change plot type', (0, i.t)('change plot type')),
        le = new o.TranslatedString('change price line visibility', (0, i.t)('change price line visibility'))
      class ne extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = e => {
              const { setValue: t } = this.context,
                {
                  styleProp: { plottype: r },
                } = this.props
              r && t(r, e, re)
            }),
            (this._onPriceLineChange = e => {
              const { setValue: t } = this.context,
                {
                  styleProp: { trackPrice: r },
                } = this.props
              r && t(r, e, le)
            })
        }
        render() {
          const {
              id: e,
              paletteColor: t,
              paletteColorProps: r,
              styleProp: l,
              isLine: s,
              hasPlotTypeSelect: o,
              grouped: a,
              offset: c,
            } = this.props,
            p = r.childs()
          return n.createElement(
            N.InputRow,
            {
              grouped: a,
              label: n.createElement(
                'div',
                { className: te.childRowContainer },
                (0, i.t)(t.name, { context: 'input' }),
              ),
              offset: c,
            },
            n.createElement(ee.ColorWithThicknessSelect, {
              disabled: !l.visible.value(),
              color: p.color,
              transparency: l.transparency,
              thickness: s ? p.width : void 0,
              isPaletteColor: !0,
            }),
            s && o && l.plottype && l.trackPrice
              ? n.createElement(J, {
                  id: (0, k.createDomId)(e, 'plot-type-select'),
                  disabled: !l.visible.value(),
                  className: te.smallStyleControl,
                  plotType: l.plottype.value(),
                  priceLine: l.trackPrice.value(),
                  plotTypeChange: this._onPlotTypeChange,
                  priceLineChange: this._onPriceLineChange,
                })
              : null,
          )
        }
      }
      ne.contextType = M.StylePropertyContext
      var se = r(35868)
      class ie extends n.PureComponent {
        render() {
          const {
              plot: e,
              area: t,
              palette: r,
              paletteProps: l,
              hideVisibilitySwitch: i,
              styleProp: o,
              showOnlyTitle: a,
              showSeparator: c = !0,
              offset: p,
            } = this.props,
            d = e ? e.id : (0, s.ensureDefined)(t).id,
            h = !d.startsWith('fill') && e && (0, x.isLinePlot)(e)
          return n.createElement(
            n.Fragment,
            null,
            !i &&
              n.createElement(
                se.PropertyTable.Row,
                null,
                n.createElement(
                  se.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, offset: p },
                  a
                    ? n.createElement('div', null, t ? t.title : o.title.value())
                    : n.createElement(D, { id: d, title: t ? t.title : o.title.value(), visible: o.visible }),
                ),
              ),
            (function (e, t, r, l, i, o) {
              const a = t.colors,
                c = r.colors
              return Object.keys(a).map((t, r) =>
                n.createElement(ne, {
                  key: t,
                  id: e,
                  grouped: !0,
                  paletteColor: (0, s.ensureDefined)(a[t]),
                  paletteColorProps: (0, s.ensureDefined)(c[t]),
                  styleProp: l,
                  isLine: i,
                  hasPlotTypeSelect: 0 === r,
                  offset: o,
                }),
              )
            })(d, r, l, o, h, p),
            c && n.createElement(se.PropertyTable.GroupSeparator, null),
          )
        }
      }
      ie.contextType = M.StylePropertyContext
      var oe = r(50890)
      const ae = new o.TranslatedString('change plot type', (0, i.t)('change plot type')),
        ce = new o.TranslatedString('change price line visibility', (0, i.t)('change price line visibility'))
      class pe extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = e => {
              const { setValue: t } = this.context,
                {
                  property: { plottype: r },
                } = this.props
              r && t(r, e, ae)
            }),
            (this._onPriceLineChange = e => {
              const { setValue: t } = this.context,
                {
                  property: { trackPrice: r },
                } = this.props
              r && t(r, e, ce)
            })
        }
        render() {
          const {
            id: e,
            isRGB: t,
            isFundamental: r,
            property: { title: l, color: s, plottype: i, linewidth: o, transparency: a, trackPrice: c, visible: p },
          } = this.props
          return n.createElement(
            N.InputRow,
            { label: n.createElement(D, { id: e, title: l.value(), visible: p }) },
            t && !r
              ? this._getInputForRgb()
              : n.createElement(ee.ColorWithThicknessSelect, {
                  disabled: !p.value(),
                  color: s,
                  transparency: a,
                  thickness: o,
                }),
            n.createElement(J, {
              id: (0, k.createDomId)(e, 'plot-type-select'),
              disabled: !p.value(),
              className: te.smallStyleControl,
              plotType: i.value(),
              priceLine: c.value(),
              plotTypeChange: this._onPlotTypeChange,
              priceLineChange: this._onPriceLineChange,
            }),
          )
        }
        _getInputForRgb() {
          const { id: e, showLineWidth: t, property: r } = this.props,
            { linewidth: l, visible: s } = r
          return l && t
            ? n.createElement(oe.LineWidthSelect, {
                id: (0, k.createDomId)(e, 'line-width-select'),
                property: l,
                disabled: !s.value(),
              })
            : null
        }
      }
      pe.contextType = M.StylePropertyContext
      const de = n.createContext(null)
      class he extends n.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            title: r,
            visible: l,
            color: s,
            transparency: i,
            thickness: o,
            children: a,
            switchable: c = !0,
            offset: p,
            grouped: d,
          } = this.props
          return n.createElement(
            N.InputRow,
            { label: c ? n.createElement(D, { id: e, title: r, visible: l }) : r, offset: p, grouped: d },
            t
              ? null
              : n.createElement(ee.ColorWithThicknessSelect, {
                  disabled: l && !(Array.isArray(l) ? l[0].value() : l.value()),
                  color: s,
                  transparency: i,
                  thickness: o,
                }),
            a,
          )
        }
      }
      he.contextType = M.StylePropertyContext
      class ue extends n.PureComponent {
        render() {
          const {
            id: e,
            isRGB: t,
            property: { colorup: r, colordown: l, transparency: i, visible: o },
          } = this.props
          return n.createElement(de.Consumer, null, a =>
            n.createElement(
              n.Fragment,
              null,
              n.createElement(
                se.PropertyTable.Row,
                null,
                n.createElement(
                  se.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2, grouped: !0 },
                  n.createElement(D, { id: e, title: Oe((0, s.ensureNotNull)(a), e), visible: o }),
                ),
              ),
              !t &&
                n.createElement(
                  n.Fragment,
                  null,
                  n.createElement(he, {
                    id: e,
                    title: We,
                    color: r,
                    transparency: i,
                    visible: o,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                  n.createElement(he, {
                    id: e,
                    title: ze,
                    color: l,
                    transparency: i,
                    visible: o,
                    switchable: !1,
                    offset: !0,
                    grouped: !0,
                  }),
                ),
              n.createElement(se.PropertyTable.GroupSeparator, null),
            ),
          )
        }
      }
      ue.contextType = M.StylePropertyContext
      var me = r(87795),
        ye = r.n(me),
        ve = r(97754),
        ge = r(31261),
        be = r(45685),
        fe = r(95936)
      const we = {
          [fe.MarkLocation.AboveBar]: { value: fe.MarkLocation.AboveBar, content: (0, i.t)('Above bar'), order: 0 },
          [fe.MarkLocation.BelowBar]: { value: fe.MarkLocation.BelowBar, content: (0, i.t)('Below bar'), order: 1 },
          [fe.MarkLocation.Top]: { value: fe.MarkLocation.Top, content: (0, i.t)('Top'), order: 2 },
          [fe.MarkLocation.Bottom]: { value: fe.MarkLocation.Bottom, content: (0, i.t)('Bottom'), order: 3 },
          [fe.MarkLocation.Absolute]: { value: fe.MarkLocation.Absolute, content: (0, i.t)('Absolute'), order: 4 },
        },
        Ce = Object.values(we).sort((e, t) => e.order - t.order)
      class Se extends n.PureComponent {
        render() {
          const {
            id: e,
            shapeLocation: t,
            className: r,
            menuItemClassName: l,
            shapeLocationChange: s,
            disabled: i,
          } = this.props
          return n.createElement(be.Select, {
            id: e,
            disabled: i,
            className: r,
            menuItemClassName: l,
            items: Ce,
            value: t,
            onChange: s,
          })
        }
      }
      const Pe = new o.TranslatedString('change char', (0, i.t)('change char')),
        Te = new o.TranslatedString('change location', (0, i.t)('change location'))
      class Ee extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onCharChange = e => {
              const { setValue: t } = this.context,
                r = e.currentTarget.value.trim(),
                l = ye()(r),
                n = 0 === l.length ? '' : l[l.length - 1],
                {
                  property: { char: s },
                } = this.props
              t(s, n, Pe)
            }),
            (this._onLocationChange = e => {
              const { setValue: t } = this.context,
                {
                  property: { location: r },
                } = this.props
              t(r, e, Te)
            })
        }
        render() {
          const {
            id: e,
            isRGB: t,
            property: { title: r, color: l, transparency: s, char: i, location: o, visible: a },
            hasPalette: c,
          } = this.props
          return n.createElement(
            N.InputRow,
            { grouped: c, label: n.createElement(D, { id: e, title: r.value(), visible: a }) },
            !c &&
              !t &&
              n.createElement(ee.ColorWithThicknessSelect, { disabled: !a.value(), color: l, transparency: s }),
            n.createElement(ge.InputControl, {
              disabled: !a.value(),
              className: te.smallStyleControl,
              value: i.value(),
              onChange: this._onCharChange,
            }),
            n.createElement(Se, {
              id: (0, k.createDomId)(e, 'shape-style-select'),
              disabled: !a.value(),
              className: ve(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: o.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      Ee.contextType = M.StylePropertyContext
      var _e = r(56138)
      const ke = {
        arrow_down: r(91596),
        arrow_up: r(57614),
        circle: r(6220),
        cross: r(59903),
        diamond: r(27708),
        flag: r(92578),
        label_down: r(33665),
        label_up: r(82397),
        square: r(76046),
        triangle_down: r(21760),
        triangle_up: r(653),
        x_cross: r(18670),
      }
      function xe(e) {
        return ke[e]
      }
      const Ie = []
      Object.keys(_e.plotShapesData).forEach(e => {
        const t = _e.plotShapesData[e]
        Ie.push({
          id: t.id,
          value: t.id,
          selectedContent: n.createElement(F.DisplayItem, { icon: xe(t.icon) }),
          content: n.createElement(F.DropItem, { icon: xe(t.icon), label: t.guiName }),
        })
      })
      class Le extends n.PureComponent {
        render() {
          const { id: e, shapeStyleId: t, className: r, shapeStyleChange: l, disabled: s } = this.props
          return n.createElement(F.IconDropdown, {
            id: e,
            disabled: s,
            className: r,
            hideArrowButton: !0,
            items: Ie,
            value: t,
            onChange: l,
          })
        }
      }
      const Me = new o.TranslatedString('change shape', (0, i.t)('change shape')),
        Ve = new o.TranslatedString('change location', (0, i.t)('change location'))
      class Re extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPlotTypeChange = e => {
              const { setValue: t } = this.context,
                {
                  property: { plottype: r },
                } = this.props
              t(r, e, Me)
            }),
            (this._onLocationChange = e => {
              const { setValue: t } = this.context,
                {
                  property: { location: r },
                } = this.props
              t(r, e, Ve)
            })
        }
        render() {
          const {
            id: e,
            isRGB: t,
            hasPalette: r,
            property: { title: l, color: s, transparency: i, plottype: o, location: a, visible: c },
          } = this.props
          return n.createElement(
            N.InputRow,
            { grouped: r, label: n.createElement(D, { id: e, title: l.value(), visible: c }) },
            !r &&
              !t &&
              n.createElement(ee.ColorWithThicknessSelect, { disabled: !c.value(), color: s, transparency: i }),
            n.createElement(Le, {
              id: (0, k.createDomId)(e, 'shape-style-select'),
              disabled: !c.value(),
              className: te.smallStyleControl,
              shapeStyleId: o.value(),
              shapeStyleChange: this._onPlotTypeChange,
            }),
            n.createElement(Se, {
              id: (0, k.createDomId)(e, 'shape-location-select'),
              disabled: !c.value(),
              className: ve(te.defaultSelect, te.additionalSelect),
              menuItemClassName: te.defaultSelectItem,
              shapeLocation: a.value(),
              shapeLocationChange: this._onLocationChange,
            }),
          )
        }
      }
      Re.contextType = M.StylePropertyContext
      var Be = r(98125),
        De = r(32255)
      const Ne = (0, Be.getLogger)('Chart.Study.PropertyPage'),
        We = (0, i.t)('Up'),
        ze = (0, i.t)('Down'),
        Fe = (0, i.t)('Body'),
        Ae = (0, i.t)('Wick'),
        He = (0, i.t)('Border')
      class Ge extends n.PureComponent {
        render() {
          const { plot: e, palettes: t, study: r } = this.props,
            l = e.id,
            s = r.properties().styles[l],
            i = e.type,
            o = t.main,
            a = !!r.metaInfo().isRGB
          if ('line' === i || 'bar_colorer' === i || 'bg_colorer' === i)
            return o && o.palette && o.paletteProps
              ? n.createElement(ie, { plot: e, palette: o.palette, paletteProps: o.paletteProps, styleProp: s })
              : n.createElement(pe, { id: l, property: s, isRGB: a, isFundamental: !1, showLineWidth: 'line' === i })
          if ('arrows' === i) {
            const i = this._getPlotSwitch(l, Oe(r, l), s.visible)
            if (a) return i
            const o = t.up,
              c = t.down
            return o || c
              ? n.createElement(
                  n.Fragment,
                  null,
                  i,
                  o && o.palette && o.paletteProps
                    ? n.createElement(ie, {
                        plot: e,
                        palette: o.palette,
                        paletteProps: o.paletteProps,
                        styleProp: { ...s, title: (0, De.createPrimitiveProperty)(We) },
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : n.createElement(he, {
                        id: l,
                        isRGB: a,
                        title: We,
                        color: s.colorup,
                        visible: s.visible,
                        transparency: s.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  c && c.palette && c.paletteProps
                    ? n.createElement(ie, {
                        plot: e,
                        palette: c.palette,
                        paletteProps: c.paletteProps,
                        styleProp: { ...s, title: (0, De.createPrimitiveProperty)(ze) },
                        showSeparator: !1,
                        showOnlyTitle: !0,
                        offset: !0,
                      })
                    : n.createElement(he, {
                        id: l,
                        isRGB: a,
                        title: ze,
                        color: s.colordown,
                        visible: s.visible,
                        transparency: s.transparency,
                        switchable: !1,
                        grouped: !0,
                        offset: !0,
                      }),
                  n.createElement(se.PropertyTable.GroupSeparator, null),
                )
              : n.createElement(ue, { id: l, property: s, isRGB: a, plot: e, palettes: t, styleProp: s })
          }
          if ('chars' === i || 'shapes' === i)
            return n.createElement(
              n.Fragment,
              null,
              'chars' === i
                ? n.createElement(Ee, { id: l, property: s, hasPalette: Boolean(o && o.palette), isRGB: a })
                : n.createElement(Re, { id: l, property: s, hasPalette: Boolean(o && o.palette), isRGB: a }),
              o &&
                o.palette &&
                o.paletteProps &&
                n.createElement(ie, {
                  plot: e,
                  palette: o.palette,
                  paletteProps: o.paletteProps,
                  hideVisibilitySwitch: !0,
                  styleProp: s,
                }),
            )
          if ((0, x.isOhlcPlot)(e)) {
            const s = e.target,
              i = r.properties().ohlcPlots[s],
              c = this._getPlotSwitch(l, i.title.value(), i.visible)
            if (a) return c
            const p = t.wick && t.wick.palette && t.wick.paletteProps,
              d = t.border && t.border.palette && t.border.paletteProps
            return n.createElement(
              n.Fragment,
              null,
              c,
              o && o.palette && o.paletteProps
                ? n.createElement(ie, {
                    plot: e,
                    palette: o.palette,
                    paletteProps: o.paletteProps,
                    styleProp: { ...i, title: (0, De.createPrimitiveProperty)(Fe) },
                    showSeparator: !1,
                    showOnlyTitle: !0,
                    offset: !0,
                  })
                : n.createElement(he, {
                    id: l,
                    isRGB: a,
                    title: Fe,
                    visible: i.visible,
                    color: i.color,
                    transparency: i.transparency,
                    switchable: !1,
                    grouped: !0,
                    offset: !0,
                  }),
              t.wick &&
                t.wick.palette &&
                t.wick.paletteProps &&
                n.createElement(ie, {
                  plot: e,
                  palette: t.wick.palette,
                  paletteProps: t.wick.paletteProps,
                  styleProp: { ...i, title: (0, De.createPrimitiveProperty)(Ae) },
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!p && i.wickColor) &&
                n.createElement(he, {
                  id: l,
                  isRGB: a,
                  title: Ae,
                  visible: i.visible,
                  color: i.wickColor,
                  transparency: i.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              t.border &&
                t.border.palette &&
                t.border.paletteProps &&
                n.createElement(ie, {
                  plot: e,
                  palette: t.border.palette,
                  paletteProps: t.border.paletteProps,
                  styleProp: { ...i, title: (0, De.createPrimitiveProperty)(He) },
                  showSeparator: !1,
                  showOnlyTitle: !0,
                  offset: !0,
                }),
              Boolean(!d && i.borderColor) &&
                n.createElement(he, {
                  id: l,
                  isRGB: a,
                  title: He,
                  visible: i.visible,
                  color: i.borderColor,
                  transparency: i.transparency,
                  switchable: !1,
                  grouped: !0,
                  offset: !0,
                }),
              n.createElement(se.PropertyTable.GroupSeparator, null),
            )
          }
          return Ne.logError('Unknown plot type: ' + i), null
        }
        _getPlotSwitch(e, t, r) {
          return n.createElement(
            se.PropertyTable.Row,
            null,
            n.createElement(
              se.PropertyTable.Cell,
              { placement: 'first', colSpan: 2 },
              n.createElement(D, { id: e, title: t, visible: r }),
            ),
          )
        }
      }
      function Oe(e, t) {
        const r = (0, s.ensureDefined)(e.metaInfo().styles),
          { title: l } = (0, s.ensureDefined)(r[t])
        return (0, s.ensureDefined)(l)
      }
      var Ue = r(48948),
        je = r(53598)
      const Ke = new o.TranslatedString('change line style', (0, i.t)('change line style'))
      class Ze extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onLineStyleChange = e => {
              const { setValue: t } = this.context,
                { lineStyle: r } = this.props
              ;(0, R.setPropertyValue)(r, r => t(r, e, Ke))
            })
        }
        render() {
          const { lineStyle: e, ...t } = this.props
          return n.createElement(je.LineStyleSelect, {
            ...t,
            lineStyle: (0, R.getPropertyValue)(e),
            lineStyleChange: this._onLineStyleChange,
          })
        }
      }
      Ze.contextType = M.StylePropertyContext
      const qe = new o.TranslatedString('change value', (0, i.t)('change value'))
      class Ye extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onValueChange = e => {
              const { setValue: t } = this.context,
                { value: r } = this.props.property
              t(r, e, qe)
            })
        }
        render() {
          const {
            id: e,
            property: { name: t, color: r, linestyle: l, linewidth: s, transparency: i, value: o, visible: a },
          } = this.props
          return n.createElement(
            N.InputRow,
            { labelAlign: 'adaptive', label: n.createElement(D, { id: e, title: t.value(), visible: a }) },
            n.createElement(
              'div',
              { className: te.block },
              n.createElement(
                'div',
                { className: te.group },
                n.createElement(ee.ColorWithThicknessSelect, {
                  disabled: !a.value(),
                  color: r,
                  transparency: i,
                  thickness: s,
                }),
                n.createElement(Ze, {
                  id: (0, k.createDomId)(e, 'line-style-select'),
                  disabled: !a.value(),
                  className: te.smallStyleControl,
                  lineStyle: l,
                }),
              ),
              n.createElement(
                'div',
                { className: ve(te.wrapGroup, te.defaultSelect, te.additionalSelect) },
                n.createElement(Ue.FloatInputComponent, {
                  input: { id: '', name: '', type: 'float', defval: 0 },
                  value: o.value(),
                  disabled: !a.value(),
                  onChange: this._onValueChange,
                }),
              ),
            ),
          )
        }
      }
      Ye.contextType = M.StylePropertyContext
      class Qe extends n.PureComponent {
        render() {
          const {
            orders: { visible: e, showLabels: t, showQty: r },
          } = this.props
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(D, { id: 'chart-orders-switch', title: (0, i.t)('Trades on chart'), visible: e }),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(D, { id: 'chart-orders-labels-switch', title: (0, i.t)('Signal labels'), visible: t }),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(D, { id: 'chart-orders-qty-switch', title: (0, i.t)('Quantity'), visible: r }),
              ),
            ),
          )
        }
      }
      Qe.contextType = M.StylePropertyContext
      var Xe = r(95018),
        $e = r(26007)
      const Je = new o.TranslatedString('change percent width', (0, i.t)('change percent width')),
        et = new o.TranslatedString('change placement', (0, i.t)('change placement')),
        tt = new o.TranslatedString('change values visibility', (0, i.t)('change values visibility')),
        rt = [
          { value: Xe.HHistDirection.LeftToRight, content: (0, i.t)('Left') },
          { value: Xe.HHistDirection.RightToLeft, content: (0, i.t)('Right') },
        ],
        lt = (0, i.t)('Width (% of the box)'),
        nt = (0, i.t)('Placement'),
        st = (0, i.t)('Values'),
        it = (0, i.t)('Text color')
      class ot extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onPercentWidthChange = e => {
              const { setValue: t } = this.context,
                { percentWidth: r } = this.props.property.childs()
              t(r, e, Je)
            }),
            (this._onPlacementChange = e => {
              const { setValue: t } = this.context,
                { direction: r } = this.props.property.childs()
              t(r, e, et)
            }),
            (this._onShowValuesChange = e => {
              const { setValue: t } = this.context,
                { showValues: r } = this.props.property.childs()
              t(r, e, tt)
            })
        }
        render() {
          const {
            title: e,
            percentWidth: t,
            direction: r,
            showValues: l,
            valuesColor: s,
            visible: i,
          } = this.props.property.childs()
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2, grouped: !0 },
                n.createElement(D, { id: e.value(), title: e.value(), visible: i }),
              ),
            ),
            n.createElement(
              N.InputRow,
              { label: n.createElement('div', { className: te.childRowContainer }, lt), grouped: !0 },
              n.createElement($e.IntegerInputComponent, {
                input: { id: '', name: '', type: 'integer', defval: 0 },
                value: t.value(),
                disabled: !i.value(),
                onChange: this._onPercentWidthChange,
              }),
            ),
            n.createElement(
              N.InputRow,
              { label: n.createElement('div', { className: te.childRowContainer }, nt), grouped: !0 },
              n.createElement(be.Select, {
                id: 'hhist-graphic-placement-select',
                disabled: !i.value(),
                className: te.defaultSelect,
                menuItemClassName: te.defaultSelectItem,
                items: rt,
                value: r.value(),
                onChange: this._onPlacementChange,
              }),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { className: te.childRowContainer, placement: 'first', colSpan: 2, grouped: !0 },
                n.createElement(V.BoolInputComponent, {
                  label: st,
                  input: { id: e.value() + '_showValues', type: 'bool', defval: !0, name: 'visible' },
                  value: !l || l.value(),
                  disabled: !i.value(),
                  onChange: this._onShowValuesChange,
                }),
              ),
            ),
            n.createElement(
              N.InputRow,
              { label: n.createElement('div', { className: te.childRowContainer }, it), grouped: !0 },
              n.createElement(ee.ColorWithThicknessSelect, { disabled: i && !i.value(), color: s }),
            ),
            this._renderColors(),
            n.createElement(se.PropertyTable.GroupSeparator, null),
          )
        }
        _renderColors() {
          const { colors: e, titles: t, transparencies: r, visible: l } = this.props.property.childs()
          return e.childNames().map(s =>
            n.createElement(
              N.InputRow,
              {
                key: s,
                grouped: !0,
                label: n.createElement('div', { className: te.childRowContainer }, t.childs()[s].value()),
              },
              n.createElement(ee.ColorWithThicknessSelect, {
                disabled: !l.value(),
                color: e.childs()[s],
                transparency: r.childs()[s],
              }),
            ),
          )
        }
      }
      ot.contextType = M.StylePropertyContext
      class at extends n.PureComponent {
        render() {
          const { title: e } = this.props,
            { color: t, transparency: r, width: l, style: s, visible: i } = this.props.property.childs()
          return n.createElement(
            N.InputRow,
            { label: n.createElement(D, { id: e.value(), title: e.value(), visible: i }) },
            n.createElement(ee.ColorWithThicknessSelect, {
              disabled: !i.value(),
              color: t,
              transparency: r,
              thickness: l,
            }),
            n.createElement(Ze, {
              id: (0, k.createDomId)(e.value(), 'line-style-select'),
              disabled: !i.value(),
              className: te.smallStyleControl,
              lineStyle: s,
            }),
          )
        }
      }
      at.contextType = M.StylePropertyContext
      class ct extends n.PureComponent {
        render() {
          const { graphicType: e, study: t } = this.props,
            r = t.metaInfo().graphics,
            l = t.properties().graphics,
            i = (0, s.ensureDefined)(r[e])
          return Object.keys(i).map((t, r) => {
            const s = l[e][t]
            return 'horizlines' === e || 'vertlines' === e || 'lines' === e
              ? n.createElement(at, { key: t, title: 'lines' === e ? s.title : s.name, property: s })
              : 'hhists' === e
              ? n.createElement(ot, { key: t, property: s })
              : null
          })
        }
      }
      var pt = r(66045)
      const dt = new o.TranslatedString('change font size', (0, i.t)('change font size')),
        ht = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map(e => ({ value: e, title: e.toString() }))
      class ut extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onFontSizeChange = e => {
              const { setValue: t } = this.context,
                { fontSize: r } = this.props
              t(r, e, dt)
            })
        }
        render() {
          const { fontSize: e, ...t } = this.props
          return n.createElement(pt.FontSizeSelect, {
            ...t,
            fontSizes: ht,
            fontSize: e.value(),
            fontSizeChange: this._onFontSizeChange,
          })
        }
      }
      ut.contextType = M.StylePropertyContext
      const mt = new o.TranslatedString('change visibility', (0, i.t)('change visibility')),
        yt = (0, i.t)('Labels font'),
        vt = (0, i.t)('Labels'),
        gt = {
          Traditional: new Set(['S5/R5', 'S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Fibonacci: new Set(['S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Woodie: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          Classic: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
          DM: new Set(['S1/R1', 'P']),
          DeMark: new Set(['S1/R1', 'P']),
          Camarilla: new Set(['S4/R4', 'S3/R3', 'S2/R2', 'S1/R1', 'P']),
        }
      class bt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = e => {
              const { setValue: t } = this.context,
                { levelsStyle: r } = this.props.property.childs(),
                { showLabels: l } = r.childs()
              t(l, e, mt)
            })
        }
        render() {
          const { fontsize: e, levelsStyle: t } = this.props.property.childs()
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              N.InputRow,
              { labelAlign: 'adaptive', label: n.createElement('span', null, yt) },
              n.createElement(
                'div',
                { className: te.block },
                n.createElement(
                  'div',
                  { className: ve(te.wrapGroup, te.additionalSelect) },
                  n.createElement(ut, { id: 'pivot-points-standard-font-size-select', fontSize: e }),
                ),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(V.BoolInputComponent, {
                  label: vt,
                  input: { id: 'ShowLabels', type: 'bool', defval: !0, name: 'visible' },
                  value: t.childs().showLabels.value(),
                  onChange: this._onChange,
                }),
              ),
            ),
            this._renderColors(),
          )
        }
        _renderColors() {
          const { levelsStyle: e, inputs: t } = this.props.property.childs(),
            { colors: r, widths: l, visibility: i } = e.childs(),
            { kind: o } = t.childs(),
            a = (0, s.ensureDefined)(gt[o.value()])
          return r
            .childNames()
            .filter(e => a.has(e))
            .map(e =>
              n.createElement(he, {
                key: e,
                id: e,
                title: e,
                color: r.childs()[e],
                visible: i.childs()[e],
                thickness: l.childs()[e],
              }),
            )
        }
      }
      bt.contextType = M.StylePropertyContext
      const ft = new o.TranslatedString('change visibility', (0, i.t)('change visibility')),
        wt = (0, i.t)('Volume profile'),
        Ct = (0, i.t)('Values'),
        St = (0, i.t)('Width (% of the box)'),
        Pt = (0, i.t)('Placement'),
        Tt = (0, i.t)('Developing VA'),
        Et = (0, i.t)('Values in status line'),
        _t = (0, i.t)('Labels on price scale'),
        kt = [
          { value: Xe.HHistDirection.RightToLeft, content: (0, i.t)('Right') },
          { value: Xe.HHistDirection.LeftToRight, content: (0, i.t)('Left') },
        ]
      class xt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = e => {
              this._setHhistsProperty('visible', e)
            }),
            (this._onShowValuesChange = e => {
              this._setHhistsProperty('showValues', e)
            }),
            (this._onValueChange = e => {
              this._setHhistsProperty('percentWidth', e)
            }),
            (this._onDirectionChange = e => {
              this._setHhistsProperty('direction', e)
            })
        }
        render() {
          var e, t, r, l, o, a
          const { metaInfo: c } = this.props,
            { graphics: p, styles: d, showLabelsOnPriceScale: h, showLegendValues: u } = this.props.property.childs(),
            { hhists: m, horizlines: y, polygons: v } = p.childs(),
            g = (0, s.ensureDefined)(c.graphics.hhists),
            b = Object.keys(g),
            f = m.childs()[b[0]],
            w = f.childs().visible,
            C = b.map(e => m.childs()[e].childs().showValues),
            S = f.childs().percentWidth,
            P = f.childs().direction,
            T = b.map(e => m.childs()[e].childs().valuesColor),
            E = null === (e = y.childs()) || void 0 === e ? void 0 : e.vahLines,
            _ = null === (t = c.graphics.horizlines) || void 0 === t ? void 0 : t.vahLines,
            k = null === (r = y.childs()) || void 0 === r ? void 0 : r.valLines,
            x = null === (l = c.graphics.horizlines) || void 0 === l ? void 0 : l.valLines,
            I = y.childs().pocLines,
            L = (0, s.ensureDefined)(null === (o = c.graphics.horizlines) || void 0 === o ? void 0 : o.pocLines),
            M = d.childs().developingPoc,
            R = (0, s.ensureDefined)(null === (a = c.styles) || void 0 === a ? void 0 : a.developingPoc),
            B = d.childs().developingVAHigh,
            W = d.childs().developingVALow,
            z = c.graphics.polygons && c.graphics.polygons.histBoxBg
          return n.createElement(
            n.Fragment,
            null,
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first', colSpan: 2 },
                n.createElement(V.BoolInputComponent, {
                  label: wt,
                  input: { id: 'VolumeProfile', type: 'bool', defval: !0, name: 'visible' },
                  value: w.value(),
                  onChange: this._onChange,
                }),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement(
                  'div',
                  { className: te.childRowContainer },
                  n.createElement(V.BoolInputComponent, {
                    disabled: !w.value(),
                    label: Ct,
                    input: { id: 'ShowValues', type: 'bool', defval: !0, name: 'visible' },
                    value: C[0].value(),
                    onChange: this._onShowValuesChange,
                  }),
                ),
              ),
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement(ee.ColorWithThicknessSelect, { disabled: !w.value() || !C[0].value(), color: T }),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement('div', { className: te.childRowContainer }, St),
              ),
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement($e.IntegerInputComponent, {
                  disabled: !w.value(),
                  input: { id: '', name: '', type: 'integer', defval: 0 },
                  value: S.value(),
                  onChange: this._onValueChange,
                }),
              ),
            ),
            n.createElement(
              se.PropertyTable.Row,
              null,
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'first' },
                n.createElement('div', { className: te.childRowContainer }, Pt),
              ),
              n.createElement(
                se.PropertyTable.Cell,
                { placement: 'last' },
                n.createElement(be.Select, {
                  id: 'hhist-direction-select',
                  disabled: !w.value(),
                  className: te.defaultSelect,
                  menuItemClassName: te.defaultSelectItem,
                  items: kt,
                  value: P.value(),
                  onChange: this._onDirectionChange,
                }),
              ),
            ),
            b.map(e =>
              n.createElement(
                n.Fragment,
                { key: e },
                m
                  .childs()
                  [e].childs()
                  .colors.childNames()
                  .map((t, r) => {
                    const l = g[e]
                    return n.createElement(
                      N.InputRow,
                      {
                        key: r,
                        label: n.createElement(
                          'div',
                          { className: te.childRowContainer },
                          (l && (0, i.t)(l.titles[r])) || '',
                        ),
                      },
                      n.createElement(ee.ColorWithThicknessSelect, {
                        disabled: !w.value(),
                        color: m.childs()[e].childs().colors.childs()[r],
                        transparency: m.childs()[e].childs().transparencies.childs()[r],
                      }),
                    )
                  }),
              ),
            ),
            _ &&
              E &&
              n.createElement(
                he,
                {
                  id: 'vahLines',
                  title: _.name,
                  color: E.childs().color,
                  visible: E.childs().visible,
                  thickness: E.childs().width,
                },
                n.createElement(Ze, {
                  id: 'vah-lines-line-style-select',
                  disabled: !E.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: E.childs().style,
                }),
              ),
            x &&
              k &&
              n.createElement(
                he,
                {
                  id: 'valLines',
                  title: x.name,
                  color: k.childs().color,
                  visible: k.childs().visible,
                  thickness: k.childs().width,
                },
                n.createElement(Ze, {
                  id: 'val-lines-line-style-select',
                  disabled: !k.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: k.childs().style,
                }),
              ),
            n.createElement(
              he,
              {
                id: 'pocLines',
                title: L.name,
                color: I.childs().color,
                visible: I.childs().visible,
                thickness: I.childs().width,
              },
              n.createElement(Ze, {
                id: 'poc-lines-line-style-select',
                disabled: !I.childs().visible.value(),
                className: te.smallStyleControl,
                lineStyle: I.childs().style,
              }),
            ),
            M &&
              n.createElement(
                he,
                {
                  id: 'developingPoc',
                  title: (R.title && (0, i.t)(R.title)) || '',
                  color: M.childs().color,
                  visible: M.childs().visible,
                  thickness: M.childs().linewidth,
                },
                n.createElement(Ze, {
                  id: 'developing-poc-line-style-select',
                  disabled: !M.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: M.childs().linestyle,
                }),
              ),
            B &&
              W &&
              n.createElement(
                he,
                {
                  id: 'developingPoc',
                  title: Tt,
                  color: [B.childs().color, W.childs().color],
                  visible: [B.childs().visible, W.childs().visible],
                  thickness: [B.childs().linewidth, W.childs().linewidth],
                },
                n.createElement(Ze, {
                  id: 'developing-VA-line-style-select',
                  disabled: !B.childs().visible.value() && !W.childs().visible.value(),
                  className: te.smallStyleControl,
                  lineStyle: [B.childs().linestyle, W.childs().linestyle],
                }),
              ),
            v &&
              n.createElement(
                N.InputRow,
                { label: n.createElement('div', null, (z && (0, i.t)(z.name)) || '') },
                n.createElement(ee.ColorWithThicknessSelect, {
                  color: v.childs().histBoxBg.childs().color,
                  transparency: v.childs().histBoxBg.childs().transparency,
                }),
              ),
            'VbPFixed' !== c.shortId &&
              n.createElement(
                n.Fragment,
                null,
                n.createElement(
                  se.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2 },
                  n.createElement(D, { id: 'showLabelsOnPriceScale', title: _t, visible: h }),
                ),
                n.createElement(
                  se.PropertyTable.Cell,
                  { placement: 'first', colSpan: 2 },
                  n.createElement(D, { id: 'showLegendValues', title: Et, visible: u }),
                ),
              ),
          )
        }
        _setHhistsProperty(e, t) {
          const { setValue: r } = this.context,
            { metaInfo: l, property: n } = this.props,
            i = n.childs().graphics.childs().hhists,
            o = Object.keys((0, s.ensureDefined)(l.graphics.hhists))
          for (let l = 0; l < o.length; l++) {
            const n = i.childs()[o[l]].child(e)
            r((0, s.ensureDefined)(n), t, ft)
          }
        }
      }
      function It() {
        const e = (0, s.ensureNotNull)((0, n.useContext)(de)),
          t = e.metaInfo(),
          r = e.properties()
        return n.createElement(xt, { metaInfo: t, property: r })
      }
      xt.contextType = M.StylePropertyContext
      var Lt = r(44488)
      const Mt = {
        VbPFixed: It,
        PivotPointsStandard: function () {
          const e = (0, s.ensureNotNull)((0, n.useContext)(de)).properties()
          return n.createElement(bt, { property: e })
        },
        VbPVisible: It,
      }
      class Vt extends n.PureComponent {
        render() {
          const e = (0, s.ensureNotNull)(this.context)
          return n.createElement(de.Consumer, null, t =>
            n.createElement(
              M.StylePropertyContainer,
              { property: (0, s.ensureNotNull)(t).properties(), model: e },
              n.createElement(
                se.PropertyTable,
                null,
                this._renderCustomContent((0, s.ensureNotNull)(t).metaInfo().shortId),
              ),
            ),
          )
        }
        _renderCustomContent(e) {
          if (e in Mt) {
            const t = Mt[e]
            return n.createElement(t, null)
          }
          return null
        }
      }
      Vt.contextType = Lt.ModelContext
      var Rt = r(37701)
      const Bt = new o.TranslatedString('change precision', (0, i.t)('change precision')),
        Dt = (0, i.t)('Default'),
        Nt = (0, i.t)('Precision'),
        Wt = [{ value: 'default', content: Dt }]
      for (let e = 0; e <= 8; e++) Wt.push({ value: e, content: e.toString() })
      class zt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = e => {
              const { setValue: t } = this.context,
                { precision: r } = this.props
              t(r, e, Bt)
            })
        }
        render() {
          const { id: e, precision: t } = this.props
          return n.createElement(
            N.InputRow,
            { label: Nt },
            n.createElement(be.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: Wt,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      zt.contextType = M.StylePropertyContext
      const Ft = new o.TranslatedString('change min tick', (0, i.t)('change min tick')),
        At = (0, i.t)('Default'),
        Ht = (0, i.t)('Override min tick'),
        Gt = [
          { priceScale: 1, minMove: 1, frac: !1 },
          { priceScale: 10, minMove: 1, frac: !1 },
          { priceScale: 100, minMove: 1, frac: !1 },
          { priceScale: 1e3, minMove: 1, frac: !1 },
          { priceScale: 1e4, minMove: 1, frac: !1 },
          { priceScale: 1e5, minMove: 1, frac: !1 },
          { priceScale: 1e6, minMove: 1, frac: !1 },
          { priceScale: 1e7, minMove: 1, frac: !1 },
          { priceScale: 1e8, minMove: 1, frac: !1 },
          { priceScale: 2, minMove: 1, frac: !0 },
          { priceScale: 4, minMove: 1, frac: !0 },
          { priceScale: 8, minMove: 1, frac: !0 },
          { priceScale: 16, minMove: 1, frac: !0 },
          { priceScale: 32, minMove: 1, frac: !0 },
          { priceScale: 64, minMove: 1, frac: !0 },
          { priceScale: 128, minMove: 1, frac: !0 },
          { priceScale: 320, minMove: 1, frac: !0 },
        ],
        Ot = [{ id: 'tick-default', value: 'default', content: At }]
      for (let e = 0; e < Gt.length; e++) {
        const t = Gt[e]
        Ot.push({ value: t.priceScale + ',' + t.minMove + ',' + t.frac, content: t.minMove + '/' + t.priceScale })
      }
      class Ut extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._onChange = e => {
              const { setValue: t } = this.context,
                { minTick: r } = this.props
              t(r, e, Ft)
            })
        }
        render() {
          const { id: e, minTick: t } = this.props
          return n.createElement(
            N.InputRow,
            { label: Ht },
            n.createElement(be.Select, {
              id: e,
              className: te.defaultSelect,
              menuItemClassName: te.defaultSelectItem,
              items: Ot,
              value: t.value(),
              onChange: this._onChange,
            }),
          )
        }
      }
      Ut.contextType = M.StylePropertyContext
      var jt = r(72280),
        Kt = r(86067)
      const Zt = (0, i.t)('Outputs')
      class qt extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._findPlotPalettes = e => {
              const { study: t } = this.props,
                r = t.metaInfo(),
                l = (0, s.ensureDefined)(r.palettes)
              return (0, x.isBarColorerPlot)(e) || (0, x.isBgColorerPlot)(e)
                ? { main: { palette: l[e.palette], paletteProps: t.properties().palettes[e.palette] } }
                : this._findPalettesByTargetId(e.id)
            })
        }
        render() {
          const { study: e } = this.props,
            t = e.metaInfo()
          if ((0, Rt.isCustomStudy)(t.shortId)) return n.createElement(Vt, null)
          const r = e.properties(),
            { precision: l, strategy: s, minTick: i, showLabelsOnPriceScale: o, showLegendValues: a } = r,
            c = t.plots.length > 0,
            p = t.plots.some(e => !(0, x.isPlotWithTechnicalValues)(e)),
            d = c || t.inputs.some(e => 'price' === e.type),
            h = (0, jt.createAdapter)(e).canOverrideMinTick()
          return n.createElement(
            se.PropertyTable,
            null,
            this._plotsElement(),
            this._bandsElement(),
            this._bandsBackgroundsElement(),
            this._areasBackgroundsElement(),
            this._filledAreasElement(),
            this._graphicsElement(),
            h && n.createElement(Ut, { id: (0, k.createDomId)(t.id, 'min-tick-select'), minTick: i }),
            L().isScriptStrategy(t) && n.createElement(Qe, { orders: s.orders }),
            (d || p) &&
              n.createElement(
                se.PropertyTable.Row,
                null,
                n.createElement(se.PropertyTable.GroupSeparator, { size: 1 }),
                n.createElement(Kt.GroupTitleSection, { title: Zt, name: Zt }),
                d && n.createElement(zt, { id: (0, k.createDomId)(t.id, 'precision-select'), precision: l }),
                p &&
                  n.createElement(
                    n.Fragment,
                    null,
                    n.createElement(
                      se.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      n.createElement(D, { id: 'showLabelsOnPriceScale', title: 'Labels on price scale', visible: o }),
                    ),
                    n.createElement(
                      se.PropertyTable.Cell,
                      { placement: 'first', colSpan: 2 },
                      n.createElement(D, { id: 'showLegendValues', title: 'Values in status line', visible: a }),
                    ),
                  ),
              ),
          )
        }
        _plotsElement() {
          const { study: e } = this.props,
            t = e.metaInfo()
          return new E.MetaInfoHelper(t)
            .getUserEditablePlots()
            .filter(
              e =>
                !(
                  (0, x.isUpColorerPlot)(e) ||
                  (0, x.isDownColorerPlot)(e) ||
                  (0, x.isCandleBorderColorerPlot)(e) ||
                  (0, x.isCandleWickColorerPlot)(e)
                ),
            )
            .map(t => {
              const r = (0, x.isOhlcPlot)(t) ? { ...t, id: t.target } : t,
                l = this._findPlotPalettes(r)
              return n.createElement(Ge, { key: t.id, plot: t, palettes: l, study: e })
            })
        }
        _bandsElement() {
          const { study: e } = this.props,
            t = e.properties(),
            { bands: r } = t
          return (
            r &&
            r.childNames().map((e, t) => {
              const l = r.child(e)
              if (!l.isHidden || !l.isHidden.value())
                return n.createElement(Ye, { key: t, id: l.name.value(), property: l })
            })
          )
        }
        _bandsBackgroundsElement() {
          const { study: e } = this.props,
            t = e.properties(),
            { bandsBackground: r } = t
          return (
            r &&
            n.createElement(he, {
              id: 'bandsBackground',
              title: 'Background',
              visible: r.fillBackground,
              color: r.backgroundColor,
              transparency: r.transparency,
            })
          )
        }
        _areasBackgroundsElement() {
          const { study: e } = this.props,
            t = e.metaInfo(),
            r = e.properties(),
            { areaBackground: l } = r
          return t.isRGB
            ? null
            : l &&
                n.createElement(he, {
                  id: 'areaBackground',
                  title: 'Background',
                  visible: l.fillBackground,
                  color: l.backgroundColor,
                  transparency: l.transparency,
                })
        }
        _filledAreasElement() {
          const { study: e } = this.props,
            t = e.metaInfo(),
            r = t.filledAreas
          return !r || t.isRGB
            ? []
            : r.map(t => {
                if (t.isHidden) return null
                const r = e.properties().filledAreasStyle[t.id],
                  l = t.title || 'Background'
                if (t.palette) {
                  const e = this._findPalettesByTargetId(t.id),
                    l = (0, s.ensureDefined)(e.main)
                  return n.createElement(ie, {
                    key: t.id,
                    area: t,
                    palette: (0, s.ensureDefined)(l.palette),
                    paletteProps: (0, s.ensureDefined)(l.paletteProps),
                    styleProp: r,
                  })
                }
                return n.createElement(he, {
                  key: t.id,
                  id: t.id,
                  title: l,
                  color: r.color,
                  visible: r.visible,
                  transparency: r.transparency,
                })
              })
        }
        _graphicsElement() {
          const { study: e } = this.props,
            t = e.metaInfo().graphics
          return t && Object.keys(t).map((t, r) => n.createElement(ct, { key: t, graphicType: t, study: e }))
        }
        _findPalettesByTargetId(e) {
          const { study: t } = this.props,
            r = t.metaInfo(),
            l = r.plots,
            n = (0, s.ensureDefined)(r.palettes),
            i = {}
          for (const r of l)
            ((0, x.isColorerPlot)(r) || (0, x.isOhlcColorerPlot)(r)) &&
              r.target === e &&
              (i.main = { palette: n[r.palette], paletteProps: t.properties().palettes[r.palette] }),
              (0, x.isUpColorerPlot)(r) &&
                r.target === e &&
                (i.up = { palette: n[r.palette], paletteProps: t.properties().palettes[r.palette] }),
              (0, x.isDownColorerPlot)(r) &&
                r.target === e &&
                (i.down = { palette: n[r.palette], paletteProps: t.properties().palettes[r.palette] }),
              (0, x.isCandleWickColorerPlot)(r) &&
                r.target === e &&
                (i.wick = { palette: n[r.palette], paletteProps: t.properties().palettes[r.palette] }),
              (0, x.isCandleBorderColorerPlot)(r) &&
                r.target === e &&
                (i.border = { palette: n[r.palette], paletteProps: t.properties().palettes[r.palette] })
          return i
        }
      }
      function Yt(e) {
        return (0, M.bindPropertyContext)(qt, { ...e, property: e.study.properties() })
      }
      class Qt extends n.PureComponent {
        render() {
          return n.createElement(
            Lt.ModelContext.Provider,
            { value: this.props.model },
            n.createElement(
              de.Provider,
              { value: this.props.source },
              n.createElement(Yt, { study: this.props.source }),
            ),
          )
        }
      }
      var Xt = r(80331),
        $t = r(22729),
        Jt = r(80975)
      class er extends $t.DialogRenderer {
        constructor(e, t, r, n) {
          super(),
            (this._timeout = null),
            (this._handleClose = () => {
              l.unmountComponentAtNode(this._container),
                this._setVisibility(!1),
                this._subscription.unsubscribe(this, this._handleCollectionChanged)
            }),
            (this._handleCancel = () => {
              this._model.undoToCheckpoint(this._checkpoint)
            }),
            (this._handleSubmit = () => {}),
            (this._handleActiveTabChanged = e => {
              c.setValue(this._activeTabSettingsName(), e)
            }),
            (this._source = e),
            (this._model = t),
            (this._propertyPages = n),
            (this._checkpoint = this._ensureCheckpoint(r)),
            (this._subscription = this._model.model().dataSourceCollectionChanged()),
            this._subscription.subscribe(this, this._handleCollectionChanged)
        }
        hide(e) {
          e ? this._handleCancel() : this._handleSubmit(), this._handleClose()
        }
        isVisible() {
          return this.visible().value()
        }
        show(e = {}) {
          if (!p.enabled('property_pages')) return
          const t = this._source.metaInfo()
          if (
            ((0, w.isLineTool)(this._source) && (0, h.trackEvent)('GUI', 'Drawing Properties', this._source.name()),
            (0, b.isStudy)(this._source))
          ) {
            const e = !this._source.isPine() || this._source.isStandardPine() ? t.description : 'Custom Pine'
            ;(0, h.trackEvent)('GUI', 'Study Properties', e)
          }
          let r = {
            byId: {
              inputs: { title: (0, i.t)('Inputs'), Component: _ },
              style: { title: (0, i.t)('Style'), Component: Qt },
            },
            allIds: [],
          }
          const s = new E.MetaInfoHelper(t)
          s.hasUserEditableInputs() && r.allIds.push('inputs'),
            s.hasUserEditableProperties(),
            s.hasUserEditableStyles() && r.allIds.push('style'),
            this._propertyPages ||
              ((r.byId.visibilities = { title: (0, i.t)('Visibility'), page: this._createVisibilitiesPropertyPage() }),
              r.allIds.push('visibilities')),
            (r = this._getPagesForStudyLineTool(r))
          const o = e.initialTab || c.getValue(this._activeTabSettingsName()) || 'inputs'
          let u = (0, a.clean)(t.shortDescription, !0)
          l.render(
            n.createElement(P, {
              title: u,
              model: this._model,
              source: this._source,
              initialActiveTab: r.allIds.includes(o) ? o : r.allIds[0],
              pages: r,
              onSubmit: this._handleSubmit,
              onCancel: this._handleCancel,
              onClose: this._handleClose,
              onActiveTabChanged: this._handleActiveTabChanged,
            }),
            this._container,
          ),
            this._setVisibility(!0),
            d.emit('edit_object_dialog', { objectType: 'study', scriptTitle: this._source.title() })
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source.properties().childs().intervalsVisibilities.childs()
          return (0, Xt.createPropertyPage)(
            (0, Jt.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._model,
              e,
              new o.TranslatedString(this._source.name(!0), this._source.title(!0)),
            ),
            'visibility',
            (0, i.t)('Visibility'),
          )
        }
        _activeTabSettingsName() {
          return 'properties_dialog.active_tab.study'
        }
        _ensureCheckpoint(e) {
          return void 0 === e && (e = this._model.createUndoCheckpoint()), e
        }
        _getPagesForStudyLineTool(e) {
          if (this._propertyPages) {
            const t = this._propertyPages.filter(e => 'coordinates' === e.id || 'visibility' === e.id),
              r = {
                allIds: t.map(e => e.id),
                byId: t.reduce((e, t) => ({ ...e, [t.id]: { title: t.title, page: t } }), {}),
              }
            return { allIds: [...e.allIds, ...r.allIds], byId: { ...e.byId, ...r.byId } }
          }
          return e
        }
        _handleCollectionChanged() {
          null === this._timeout &&
            (this._timeout = setTimeout(() => {
              this._closeDialogIfSourceIsDeleted(), (this._timeout = null)
            }))
        }
        _closeDialogIfSourceIsDeleted() {
          null === this._model.model().dataSourceForId(this._source.id()) && this._handleClose()
        }
      }
    },
    34290: (e, t, r) => {
      'use strict'
      r.d(t, { StudyDefaultsManager: () => u })
      var l = r(59496),
        n = r(97754),
        s = r.n(n),
        i = r(9745),
        o = r(28353),
        a = r(95276),
        c = r(16396),
        p = r(31328),
        d = r(84662)
      const h = {
        reset: (0, o.t)('Reset settings'),
        saveAsDefault: (0, o.t)('Save as default'),
        defaults: (0, o.t)('Defaults'),
      }
      class u extends l.PureComponent {
        constructor() {
          super(...arguments),
            (this._handleResetToDefaults = () => {
              this.props.model.restorePropertiesForSource(this.props.source)
            }),
            (this._handleSaveAsDefaults = () => {
              this.props.source.properties().saveDefaults()
            })
        }
        render() {
          const { mode: e } = this.props
          return l.createElement(
            a.ControlDisclosure,
            {
              id: 'study-defaults-manager',
              className: s()('normal' === e && d.defaultsButtonText),
              hideArrowButton: 'compact' === e,
              buttonChildren: this._getPlaceHolderItem('compact' === e),
            },
            l.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: h.reset,
              onClick: this._handleResetToDefaults,
            }),
            l.createElement(c.PopupMenuItem, {
              className: d.defaultsButtonItem,
              isActive: !1,
              label: h.saveAsDefault,
              onClick: this._handleSaveAsDefaults,
            }),
          )
        }
        _getPlaceHolderItem(e) {
          return e ? l.createElement(i.Icon, { className: d.defaultsButtonIcon, icon: p }) : h.defaults
        }
      }
    },
    95275: (e, t, r) => {
      'use strict'
      r.d(t, { FooterMenu: () => d })
      var l = r(59496),
        n = r(28353),
        s = r(9745),
        i = r(95276),
        o = r(90692),
        a = r(85623),
        c = r(31328)
      function p(e) {
        return e.isTabletWidth
          ? l.createElement(s.Icon, { className: a.themesButtonIcon, icon: c })
          : l.createElement(l.Fragment, null, (0, n.t)('Template'))
      }
      function d(e) {
        return l.createElement(o.MatchMedia, { rule: 'screen and (max-width: 768px)' }, t =>
          l.createElement(
            i.ControlDisclosure,
            {
              className: !t && a.themesButtonText,
              hideArrowButton: t,
              buttonChildren: l.createElement(p, { isTabletWidth: t }),
            },
            e.children,
          ),
        )
      }
    },
    44e3: (e, t, r) => {
      'use strict'
      r.d(t, { TemplateMenuItem: () => c })
      var l = r(59496),
        n = r(16396),
        s = r(96040),
        i = r(70412),
        o = r(32563),
        a = r(85623)
      function c(e) {
        const { name: t, onRemove: r, onClick: c } = e,
          [p, d] = (0, i.useHover)(),
          h = l.useCallback(() => c(t), [c, t]),
          u = l.useCallback(() => {
            r && r(t)
          }, [r, t])
        return l.createElement(
          'div',
          { ...d },
          l.createElement(n.PopupMenuItem, {
            className: a.defaultsButtonItem,
            isActive: !1,
            label: t,
            onClick: h,
            toolbox: r && l.createElement(s.RemoveButton, { hidden: !o.mobiletouch && !p, onClick: u }),
          }),
        )
      }
    },
    37289: (e, t, r) => {
      'use strict'
      r.d(t, { PropertiesEditorTab: () => c })
      var l = r(59496),
        n = r(66849)
      const s = {
          'Elliott Impulse Wave (12345)Degree': 'normal',
          'Elliott Triangle Wave (ABCDE)Degree': 'normal',
          'Elliott Triple Combo Wave (WXYXZ)Degree': 'normal',
          'Elliott Correction Wave (ABC)Degree': 'normal',
          'Elliott Double Combo Wave (WXY)Degree': 'normal',
          BarsPatternMode: 'normal',
          StudyInputSource: 'normal',
        },
        i = {
          TextText: 'big',
          AnchoredTextText: 'big',
          NoteText: 'big',
          AnchoredNoteText: 'big',
          CalloutText: 'big',
          BalloonText: 'big',
        }
      var o = r(35868),
        a = r(90545)
      function c(e) {
        const { page: t, pageRef: r, tableKey: c } = e
        return l.createElement(
          n.ControlCustomHeightContext.Provider,
          { value: i },
          l.createElement(
            n.ControlCustomWidthContext.Provider,
            { value: s },
            t &&
              l.createElement(
                o.PropertyTable,
                { reference: r, key: c },
                t.definitions.value().map(e => l.createElement(a.Section, { key: e.id, definition: e })),
              ),
          ),
        )
      }
    },
    18460: (e, t, r) => {
      'use strict'
      r.d(t, { FooterMenu: () => a })
      var l = r(59496),
        n = (r(79049), r(28353)),
        s = r(95275),
        i = r(44e3)
      function o(e) {
        const { model: t, source: r } = e
        return l.createElement(
          s.FooterMenu,
          null,
          l.createElement(i.TemplateMenuItem, {
            onClick: function () {
              t.restorePropertiesForSource(r)
            },
            name: (0, n.t)('Apply Defaults'),
          }),
        )
      }
      function a(e) {
        return l.createElement(o, { ...e })
      }
    },
    31807: (e, t, r) => {
      'use strict'
      r.d(t, { DialogTabs: () => m })
      var l = r(59496),
        n = r(97754),
        s = r(64205),
        i = r(40173),
        o = r(64886)
      const a = (0, i.mergeThemes)(s.DEFAULT_SLIDER_THEME, o)
      var c = r(39440),
        p = r(32563),
        d = r(42545)
      const h = d,
        u = (0, s.factory)(function (e) {
          return l.createElement(
            'div',
            { className: a.slider, ref: e.reference },
            l.createElement('div', { className: a.inner }),
          )
        })
      class m extends l.PureComponent {
        constructor() {
          super(...arguments),
            (this._createClickHandler = e => () => {
              this.props.onSelect(e)
            })
        }
        render() {
          const {
              theme: e = h,
              hiddenBottomBorders: t,
              fadedSlider: r = !0,
              ScrollComponent: s = c.HorizontalScroll,
            } = this.props,
            i = this._generateDialogTabs()
          return l.createElement(
            'div',
            { className: n(e.scrollWrap) },
            !t && l.createElement('div', { className: e.headerBottomSeparator }),
            l.createElement(
              s,
              {
                isVisibleFade: p.mobiletouch,
                isVisibleButtons: !p.mobiletouch,
                isVisibleScrollbar: !1,
                fadeClassName: n({ [e.fadeWithoutSlider]: !r }),
              },
              l.createElement(
                'div',
                { className: e.tabsWrap },
                l.createElement(u, { className: n(e.tabs, t && e.withoutBorder) }, i),
              ),
            ),
          )
        }
        _generateDialogTabs() {
          const { activeTabId: e, tabs: t, theme: r = h } = this.props
          return t.allIds.map(i => {
            const o = e === i,
              a = t.byId[i].withNotificationsBadge
            return l.createElement(
              s.SliderItem,
              {
                key: i,
                value: i,
                className: n(r.tab, !o && r.withHover, a && d.withBadge),
                isActive: o,
                onClick: this._createClickHandler(i),
              },
              t.byId[i].title,
            )
          })
        }
      }
    },
    39440: (e, t, r) => {
      'use strict'
      r.d(t, { HorizontalScroll: () => f })
      var l = r(59496),
        n = r(97754),
        s = r(9837),
        i = r(88537),
        o = r(9745),
        a = r(59199),
        c = r(68587),
        p = r(62820),
        d = r(33086),
        h = r(41814)
      const u = { isVisibleScrollbar: !0, shouldMeasure: !0, hideButtonsFrom: 1 }
      function m(e) {
        return l.createElement('div', { className: n(h.fadeLeft, e.className, { [h.isVisible]: e.isVisible }) })
      }
      function y(e) {
        return l.createElement('div', { className: n(h.fadeRight, e.className, { [h.isVisible]: e.isVisible }) })
      }
      function v(e) {
        return l.createElement(b, { ...e, className: h.scrollLeft })
      }
      function g(e) {
        return l.createElement(b, { ...e, className: h.scrollRight })
      }
      function b(e) {
        return l.createElement(
          'div',
          { className: n(e.className, { [h.isVisible]: e.isVisible }), onClick: e.onClick },
          l.createElement('div', { className: h.iconWrap }, l.createElement(o.Icon, { icon: d, className: h.icon })),
        )
      }
      const f = (function (e = v, t = g, r = m, o = y) {
        var d
        return (
          ((d = class extends l.PureComponent {
            constructor(e) {
              super(e),
                (this._scroll = l.createRef()),
                (this._wrapMeasureRef = l.createRef()),
                (this._contentMeasureRef = l.createRef()),
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
                  const { shouldDecreaseWidthContent: t, buttonsWidthIfDecreasedWidthContent: r } = this.props
                  t && r ? this.setState({ widthContent: e.width + 2 * r }) : this.setState({ widthContent: e.width })
                }),
                (this._handleScroll = () => {
                  const { onScroll: e } = this.props
                  e && e(this.currentPosition(), this.isAtLeft(), this.isAtRight()), this._checkButtonsVisibility()
                }),
                (this._checkButtonsVisibility = () => {
                  const { isVisibleLeftButton: e, isVisibleRightButton: t } = this.state,
                    r = this.isAtLeft(),
                    l = this.isAtRight()
                  r || e
                    ? r && e && this.setState({ isVisibleLeftButton: !1 })
                    : this.setState({ isVisibleLeftButton: !0 }),
                    l || t
                      ? l && t && this.setState({ isVisibleRightButton: !1 })
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
                ? (0, p.isRtl)()
                  ? (0, p.getLTRScrollLeft)(this._scroll.current)
                  : this._scroll.current.scrollLeft
                : 0
            }
            isAtLeft() {
              return !this._isOverflowed() || this.currentPosition() <= (0, i.ensureDefined)(this.props.hideButtonsFrom)
            }
            isAtRight() {
              return (
                !this._isOverflowed() ||
                this.currentPosition() + this.state.widthWrap >=
                  this.state.widthContent - (0, i.ensureDefined)(this.props.hideButtonsFrom)
              )
            }
            animateTo(e, t = c.dur) {
              const r = this._scroll.current
              r &&
                ((0, p.isRtl)() && (e = (0, p.getLTRScrollLeftOffset)(r, e)),
                t <= 0
                  ? (r.scrollLeft = Math.round(e))
                  : (0, a.doAnimate)({
                      onStep(e, t) {
                        r.scrollLeft = Math.round(t)
                      },
                      from: r.scrollLeft,
                      to: Math.round(e),
                      easing: c.easingFunc.easeInOutCubic,
                      duration: t,
                    }))
            }
            render() {
              const {
                  children: i,
                  isVisibleScrollbar: a,
                  isVisibleFade: c,
                  isVisibleButtons: p,
                  shouldMeasure: d,
                  shouldDecreaseWidthContent: u,
                  buttonsWidthIfDecreasedWidthContent: m,
                  onMouseOver: y,
                  onMouseOut: v,
                  scrollWrapClassName: g,
                  fadeClassName: b,
                } = this.props,
                { isVisibleRightButton: f, isVisibleLeftButton: w } = this.state,
                C = u && m
              return l.createElement(
                s,
                {
                  whitelist: ['width'],
                  onMeasure: this._handleResizeWrap,
                  shouldMeasure: d,
                  ref: this._wrapMeasureRef,
                },
                l.createElement(
                  'div',
                  { className: h.wrapOverflow, onMouseOver: y, onMouseOut: v },
                  l.createElement(
                    'div',
                    { className: n(h.wrap, C ? h.wrapWithArrowsOuting : '') },
                    l.createElement(
                      'div',
                      {
                        className: n(h.scrollWrap, g, { [h.noScrollBar]: !a }),
                        onScroll: this._handleScroll,
                        ref: this._scroll,
                      },
                      l.createElement(
                        s,
                        {
                          onMeasure: this._handleResizeContent,
                          whitelist: ['width'],
                          shouldMeasure: d,
                          ref: this._contentMeasureRef,
                        },
                        i,
                      ),
                    ),
                    c && l.createElement(r, { isVisible: w, className: b }),
                    c && l.createElement(o, { isVisible: f, className: b }),
                    p && l.createElement(e, { onClick: this._handleScrollLeft, isVisible: w }),
                    p && l.createElement(t, { onClick: this._handleScrollRight, isVisible: f }),
                  ),
                ),
              )
            }
            _isOverflowed() {
              const { widthContent: e, widthWrap: t } = this.state
              return e > t
            }
          }).defaultProps = u),
          d
        )
      })(v, g, m, y)
    },
    51613: (e, t, r) => {
      'use strict'
      r.d(t, { PopupMenuSeparator: () => o })
      var l = r(59496),
        n = r(97754),
        s = r.n(n),
        i = r(524)
      function o(e) {
        const { size: t = 'normal', className: r } = e
        return l.createElement('div', {
          className: s()(
            i.separator,
            'small' === t && i.small,
            'normal' === t && i.normal,
            'large' === t && i.large,
            r,
          ),
        })
      }
    },
    64205: (e, t, r) => {
      'use strict'
      r.d(t, { DEFAULT_SLIDER_THEME: () => o, SliderItem: () => a, factory: () => c })
      var l = r(59496),
        n = r(97754),
        s = r(88537),
        i = r(37740)
      const o = i
      function a(e) {
        const t = n(e.className, i.tab, {
          [i.active]: e.isActive,
          [i.disabled]: e.isDisabled,
          [i.defaultCursor]: !!e.shouldUseDefaultCursor,
          [i.noBorder]: !!e.noBorder,
        })
        return l.createElement(
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
        return class extends l.PureComponent {
          constructor() {
            super(...arguments), (this.activeTab = { current: null })
          }
          componentDidUpdate() {
            ;((0, s.ensureNotNull)(this._slider).style.transition = 'transform 350ms'), this._componentDidUpdate()
          }
          componentDidMount() {
            this._componentDidUpdate()
          }
          render() {
            const { className: t } = this.props,
              r = this._generateTabs()
            return l.createElement(
              'div',
              { className: n(t, i.tabs), 'data-name': this.props['data-name'] },
              r,
              l.createElement(e, {
                reference: e => {
                  this._slider = e
                },
              }),
            )
          }
          _generateTabs() {
            return (
              (this.activeTab.current = null),
              l.Children.map(this.props.children, e => {
                const t = e,
                  r = Boolean(t.props.isActive),
                  n = {
                    reference: e => {
                      r && (this.activeTab.current = e), t.props.reference && t.props.reference(e)
                    },
                  }
                return l.cloneElement(t, n)
              })
            )
          }
          _componentDidUpdate() {
            const e = (0, s.ensureNotNull)(this._slider).style
            if (this.activeTab.current) {
              const t = this.activeTab.current.offsetWidth,
                r = this.activeTab.current.offsetLeft
              ;(e.transform = `translateX(${r}px)`), (e.width = t + 'px'), (e.opacity = '1')
            } else e.opacity = '0'
          }
        }
      }
      c(function (e) {
        return l.createElement('div', { className: i.slider, ref: e.reference })
      })
    },
    33086: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>'
    },
    91596: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 21l7.424-6.114a.5.5 0 0 0-.318-.886H18.5V7h-9v7H6.894a.5.5 0 0 0-.318.886L14 21z"/></svg>'
    },
    57614: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 7l7.424 6.114a.5.5 0 0 1-.318.886H18.5v7h-9v-7H6.894a.5.5 0 0 1-.318-.886L14 7z"/></svg>'
    },
    6220: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><circle stroke="currentColor" cx="14" cy="14" r="6.5"/></svg>'
    },
    59903: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 14.5h11M14.5 20V9"/></svg>'
    },
    27708: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14.354 6.646L14 6.293l-.354.353-7 7-.353.354.353.354 7 7 .354.353.354-.353 7-7 .353-.354-.353-.354-7-7z"/></svg>'
    },
    92578: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8.5 22v-5.5m0 0v-8L12 7l4 2.5 3.5-1v8l-3.5 1-4-2.5-3.5 1.5z"/></svg>'
    },
    33665: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 8.5h-.5v9.707l.146.147 3 3 .354.353.354-.353 3-3 .146-.147V8.5H11z"/></svg>'
    },
    82397: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 18.5h-.5V8.793l.146-.147 3-3L14 5.293l.354.353 3 3 .146.147V18.5H11z"/></svg>'
    },
    76046: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 7.5h13v13h-13z"/></svg>'
    },
    21760: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 11.265l.478-.765H8.098l.478.765 5 8 .424.678.424-.678 5-8z"/></svg>'
    },
    653: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 16.735l.478.765H8.098l.478-.765 5-8L14 8.057l.424.678 5 8z"/></svg>'
    },
    18670: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 9l11 11M9 20L20 9"/></svg>'
    },
    99594: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M13 11.5l-1.915-1.532a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82V18.5a1 1 0 0 0 1 1H13m3.5-7l4.293-4.293c.63-.63 1.707-.184 1.707.707V18.5a1 1 0 0 1-1 1H16"/><path fill="currentColor" d="M14 6h1v2h-1zM14 11h1v2h-1zM14 16h1v2h-1zM14 21h1v2h-1z"/></svg>'
    },
    8273: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13.52v4.98a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V8.914c0-.89-1.077-1.337-1.707-.707l-4.66 4.66a1 1 0 0 1-1.332.074l-3.716-2.973a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82z"/></svg>'
    },
    28853: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM16.5 19a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM22.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>'
    },
    79142: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 12.5v8h3v-8h-3zM12.5 7.5v13h3v-13h-3zM18.5 15.5v5h3v-5h-3z"/></svg>'
    },
    40551: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M17 8.5h7M20.5 12V5M10 19.5h7M13.5 23v-7M3 12.5h7M6.5 16V9"/></svg>'
    },
    76115: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4.5 20v-7m3 7V10m3 10V8m3 12V10m3 10v-8m3 8V10m3 10V8"/></svg>'
    },
    84863: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l5-5a1.414 1.414 0 0 1 2 0m11-1l-5 5a1.414 1.414 0 0 1-2 0"/><path fill="currentColor" d="M14 5h1v2h-1zM14 10h1v2h-1zM14 15h1v2h-1zM14 20h1v2h-1z"/></svg>'
    },
    86891: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>'
    },
    5377: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M9.8 2.7l.7-.7.7.7 2.1 2.1.2.2H18v9.5l.2.2 2.1 2.1.2.2H24v1h-3.5l-.2.2-2.1 2.1-.7.7-.7-.7-2.1-2.1-.7-.7.7-.7 2.1-2.1.2-.2V6h-3.5l-.2.2-2.1 2.1-.2.2V24H5.5v-1H10V8.5l-.2-.2-2.1-2.1-.7-.7.7-.7 2.1-2.1zM8.4 5.5l2.09 2.09 2.09-2.09-2.09-2.09L8.41 5.5zm9.09 14.09l-2.09-2.09 2.09-2.09 2.09 2.09-2.09 2.09z"/></svg>'
    },
    85550: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 17v5.5h4v-18h4v12h4v-9h4V21"/></svg>'
    },
  },
])
