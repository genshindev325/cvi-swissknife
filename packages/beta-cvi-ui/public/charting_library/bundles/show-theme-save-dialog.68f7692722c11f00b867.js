'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7648],
  {
    57351: (e, t, n) => {
      n.r(t), n.d(t, { showThemeSaveDialog: () => i })
      var a = n(28353),
        o = n(3615),
        s = n(6087),
        h = n(51768)
      function i(e, t) {
        function n(n) {
          ;(0, s.saveTheme)(n, e).then(() => {
            t && t(n)
          }),
            (0, h.trackEvent)('GUI', 'Themes', 'Save custom theme')
        }
        ;(0, o.showRename)({
          title: (0, a.t)('Save Theme As'),
          text: (0, a.t)('Theme name') + ':',
          maxLength: 128,
          onRename: ({ newValue: e, focusInput: t, dialogClose: h, innerManager: i }) =>
            new Promise(m => {
              ;(0, s.isThemeExist)(e).then(s => {
                if (s) {
                  const s = (0, a.t)("Color Theme '{themeName}' already exists. Do you really want to replace it?", {
                    replace: { themeName: e },
                  })
                  ;(0, o.showConfirm)(
                    {
                      text: s,
                      onConfirm: ({ dialogClose: t }) => {
                        n(e), t(), h()
                      },
                      onClose: t,
                    },
                    i,
                  ).then(() => {
                    m()
                  })
                } else n(e), m(), h()
              })
            }),
        })
      }
    },
  },
])
