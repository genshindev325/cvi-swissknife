;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1702],
  {
    18570: e => {
      e.exports = { dialog: 'dialog-YPo24kbs', dialogWrapper: 'dialogWrapper-YPo24kbs', wrap: 'wrap-YPo24kbs' }
    },
    41662: (e, t, i) => {
      'use strict'
      i.r(t), i.d(t, { ManageDrawingsDialogRenderer: () => p })
      var s = i(59496),
        a = i(87995),
        r = i(28353),
        n = i(16216),
        o = i(54427),
        l = i(85457),
        d = i(94250),
        h = i(18570)
      class c extends s.PureComponent {
        constructor(e) {
          super(e),
            (this._dialogRef = s.createRef()),
            (this._renderChildren = e =>
              s.createElement(
                'div',
                { className: h.wrap },
                s.createElement(d.ManageDrawings, {
                  onInitialized: e.centerAndFit,
                  chartWidget: this._activeChartWidget,
                }),
              ))
          const t = (0, n.service)(o.CHART_WIDGET_COLLECTION_SERVICE)
          ;(this._activeChartWidget = t.activeChartWidget.value()),
            (this.state = { layoutName: t.metaInfo.name.value() })
        }
        render() {
          return s.createElement(l.AdaptivePopupDialog, {
            wrapperClassName: h.dialogWrapper,
            className: h.dialog,
            dataName: 'manage-drawings-dialog',
            isOpened: !0,
            onClickOutside: this.props.onClose,
            onClose: this.props.onClose,
            ref: this._dialogRef,
            render: this._renderChildren,
            showSeparator: !0,
            title: (0, r.t)('Manage layout drawings'),
            subtitle: this.state.layoutName,
          })
        }
      }
      class p {
        constructor(e) {
          ;(this._container = document.createElement('div')),
            (this._isVisible = !1),
            (this._handleClose = () => {
              this._onClose && this._onClose(), a.unmountComponentAtNode(this._container), (this._isVisible = !1)
            }),
            (this._onClose = e)
        }
        hide() {
          this._handleClose()
        }
        isVisible() {
          return this._isVisible
        }
        show() {
          a.render(s.createElement(c, { onClose: this._handleClose }), this._container), (this._isVisible = !0)
        }
      }
    },
  },
])
