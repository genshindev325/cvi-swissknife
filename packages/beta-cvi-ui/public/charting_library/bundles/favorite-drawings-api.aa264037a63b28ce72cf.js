'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5551],
  {
    88823: (i, t, e) => {
      e.r(t), e.d(t, { FavoriteDrawingsApi: () => r })
      var s = e(52714),
        o = e.n(s),
        a = e(12409),
        l = e(88537)
      class r {
        constructor() {
          ;(this._visibility = new (o())(!1)),
            (this._canBeShownValue = new (o())(!1)),
            (this._toolbarPromise = null),
            (this._toolbar = null),
            this._init()
        }
        visible() {
          return this._visibility.readonly()
        }
        canBeShown() {
          return this._canBeShownValue.readonly()
        }
        show() {
          ;(0, l.ensureNotNull)(this._toolbarPromise).then(i => i.show())
        }
        hide() {
          null !== this._toolbarPromise && this._toolbarPromise.then(i => i.hide())
        }
        _init() {
          ;(0, a.createFavoriteDrawingToolbar)()
          const i = (0, l.ensureNotNull)((0, a.getFavoriteDrawingToolbarPromise)())
          this._toolbarPromise = i.then(
            i => (
              (this._toolbar = i),
              this._visibility.setValue(this._toolbar.visibility().value()),
              this._canBeShownValue.setValue(this._toolbar.canBeShown().value()),
              this._toolbar.visibility().subscribe(i => {
                this._visibility.setValue(i)
              }),
              this._toolbar.canBeShown().subscribe(i => {
                this._canBeShownValue.setValue(i)
              }),
              this._toolbar
            ),
          )
        }
      }
    },
  },
])
