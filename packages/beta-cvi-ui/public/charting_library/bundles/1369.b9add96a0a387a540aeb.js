'use strict'
;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1369],
  {
    80331: (e, t, r) => {
      r.r(t), r.d(t, { createPropertyPage: () => n })
      var i = r(52714),
        o = r.n(i)
      function n(e, t, r, i = null) {
        var n
        const s = {
          id: t,
          title: r,
          definitions: new (o())(e.definitions),
          visible: null !== (n = e.visible) && void 0 !== n ? n : new (o())(!0).readonly(),
        }
        return null !== i && (s.icon = i), s
      }
    },
    37787: (e, t, r) => {
      r.d(t, { floor: () => o, convertToInt: () => n, limitedPrecision: () => s })
      var i = r(51264)
      function o(e) {
        return Math.floor(e)
      }
      function n(e) {
        return parseInt(String(e))
      }
      function s(e) {
        const t = new i.LimitedPrecisionNumericFormatter(e)
        return e => {
          if (null === e) return e
          const r = t.parse(t.format(e))
          return r.res ? r.value : null
        }
      }
    },
    32449: (e, t, r) => {
      function i(e, t, r) {
        const i = new Map(),
          o = void 0 !== t ? t[0] : e => e,
          n = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : e => e,
          s = {
            value: () => o(e.value()),
            setValue: t => {
              e.setValue(n(t))
            },
            subscribe: (t, r) => {
              const o = e => {
                r(s)
              }
              i.set(r, o), e.subscribe(t, o)
            },
            unsubscribe: (t, r) => {
              const o = i.get(r)
              o && (e.unsubscribe(t, o), i.delete(r))
            },
            unsubscribeAll: t => {
              e.unsubscribeAll(t), i.clear()
            },
            destroy: () => {
              null == r || r()
            },
          }
        return s
      }
      function o(e) {
        const t = i(e)
        return (
          (t.destroy = () => {
            e.destroy()
          }),
          t
        )
      }
      function n(e, t, r, o, n, s) {
        const p = i(t, o, s),
          l = void 0 !== o ? (void 0 !== o[1] ? o[1] : o[0]) : e => e
        return (p.setValue = null != n ? n : i => e.setProperty(t, l(i), r)), p
      }
      r.d(t, {
        makeProxyDefinitionProperty: () => i,
        makeProxyDefinitionPropertyDestroyable: () => o,
        convertToDefinitionProperty: () => n,
      })
    },
    50366: (e, t, r) => {
      function i(e, t) {
        return { propType: 'checkable', properties: e, ...t }
      }
      function o(e, t, r) {
        return { propType: 'checkableSet', properties: e, childrenDefinitions: r, ...t }
      }
      function n(e, t) {
        return { propType: 'color', properties: e, noAlpha: !1, ...t }
      }
      r.d(t, {
        convertFromReadonlyWVToDefinitionProperty: () => G,
        convertFromWVToDefinitionProperty: () => Y,
        convertToDefinitionProperty: () => R.convertToDefinitionProperty,
        createCheckablePropertyDefinition: () => i,
        createCheckableSetPropertyDefinition: () => o,
        createColorPropertyDefinition: () => n,
        createCoordinatesPropertyDefinition: () => I,
        createEmojiPropertyDefinition: () => A,
        createLeveledLinePropertyDefinition: () => y,
        createLinePropertyDefinition: () => a,
        createNumberPropertyDefinition: () => v,
        createOptionsPropertyDefinition: () => b,
        createPropertyDefinitionsGeneralGroup: () => H,
        createPropertyDefinitionsLeveledLinesGroup: () => _,
        createRangePropertyDefinition: () => k,
        createSessionPropertyDefinition: () => z,
        createStudyInputsPropertyDefinition: () => M,
        createSymbolPropertyDefinition: () => C,
        createTextPropertyDefinition: () => w,
        createTransparencyPropertyDefinition: () => x,
        createTwoColorsPropertyDefinition: () => V,
        createTwoOptionsPropertyDefinition: () => P,
        destroyDefinitions: () => $,
        getColorDefinitionProperty: () => Q,
        getLockPriceScaleDefinitionProperty: () => F,
        getPriceScaleSelectionStrategyDefinitionProperty: () => j,
        getScaleRatioDefinitionProperty: () => U,
        getSymbolDefinitionProperty: () => X,
        isPropertyDefinitionsGroup: () => Z,
      })
      var s = r(49612),
        p = r(43891)
      const l = [p.LINESTYLE_SOLID, p.LINESTYLE_DOTTED, p.LINESTYLE_DASHED],
        u = [1, 2, 3, 4],
        c = [s.LineEnd.Normal, s.LineEnd.Arrow]
      function a(e, t) {
        const r = { propType: 'line', properties: e, ...t }
        return (
          void 0 !== r.properties.style && (r.styleValues = l),
          void 0 !== r.properties.width && (r.widthValues = u),
          (void 0 === r.properties.leftEnd && void 0 === r.properties.rightEnd) ||
            void 0 !== r.endsValues ||
            (r.endsValues = c),
          void 0 !== r.properties.value && void 0 === r.valueType && (r.valueType = 1),
          r
        )
      }
      const d = [p.LINESTYLE_SOLID, p.LINESTYLE_DOTTED, p.LINESTYLE_DASHED],
        f = [1, 2, 3, 4]
      function y(e, t) {
        const r = { propType: 'leveledLine', properties: e, ...t }
        return (
          void 0 !== r.properties.style && (r.styleValues = d), void 0 !== r.properties.width && (r.widthValues = f), r
        )
      }
      function v(e, t) {
        return { propType: 'number', properties: e, type: 1, ...t }
      }
      function b(e, t) {
        return { propType: 'options', properties: e, ...t }
      }
      function P(e, t) {
        return { propType: 'twoOptions', properties: e, ...t }
      }
      var m = r(28353)
      const D = [
          { id: 'bottom', value: 'bottom', title: (0, m.t)('Top') },
          { id: 'middle', value: 'middle', title: (0, m.t)('Middle') },
          { id: 'top', value: 'top', title: (0, m.t)('Bottom') },
        ],
        T = [
          { id: 'left', value: 'left', title: (0, m.t)('Left') },
          { id: 'center', value: 'center', title: (0, m.t)('Center') },
          { id: 'right', value: 'right', title: (0, m.t)('Right') },
        ],
        g = [
          { id: 'horizontal', value: 'horizontal', title: (0, m.t)('Horizontal') },
          { id: 'vertical', value: 'vertical', title: (0, m.t)('Vertical') },
        ],
        h = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map(e => ({ title: String(e), value: e })),
        S = [1, 2, 3, 4],
        E = (0, m.t)('Text alignment'),
        L = (0, m.t)('Text orientation')
      function w(e, t) {
        const r = { propType: 'text', properties: e, ...t, isEditable: t.isEditable || !1 }
        return (
          void 0 !== r.properties.size && void 0 === r.sizeItems && (r.sizeItems = h),
          void 0 !== r.properties.alignmentVertical &&
            void 0 === r.alignmentVerticalItems &&
            (r.alignmentVerticalItems = D),
          void 0 !== r.properties.alignmentHorizontal &&
            void 0 === r.alignmentHorizontalItems &&
            (r.alignmentHorizontalItems = T),
          (r.alignmentVerticalItems || r.alignmentHorizontalItems) &&
            void 0 === r.alignmentTitle &&
            (r.alignmentTitle = E),
          void 0 !== r.properties.orientation &&
            (void 0 === r.orientationItems && (r.orientationItems = g),
            void 0 === r.orientationTitle && (r.orientationTitle = L)),
          void 0 !== r.properties.borderWidth && void 0 === r.borderWidthItems && (r.borderWidthItems = S),
          r
        )
      }
      function V(e, t) {
        return { propType: 'twoColors', properties: e, noAlpha1: !1, noAlpha2: !1, ...t }
      }
      function I(e, t) {
        return { propType: 'coordinates', properties: e, ...t }
      }
      function k(e, t) {
        return { propType: 'range', properties: e, ...t }
      }
      function x(e, t) {
        return { propType: 'transparency', properties: e, ...t }
      }
      function C(e, t) {
        return { propType: 'symbol', properties: e, ...t }
      }
      function z(e, t) {
        return { propType: 'session', properties: e, ...t }
      }
      function A(e, t) {
        return { propType: 'emoji', properties: e, ...t }
      }
      function M(e, t) {
        return { propType: 'studyInputs', properties: e, ...t }
      }
      var O = r(52714),
        N = r.n(O)
      function H(e, t, r, i) {
        return { id: t, title: r, visible: i, groupType: 'general', definitions: new (N())(e) }
      }
      function _(e, t, r) {
        return { id: t, title: r, groupType: 'leveledLines', definitions: new (N())(e) }
      }
      var R = r(32449)
      function W(e, t) {
        const r = new Map(),
          i = void 0 !== t ? t[0] : e => e,
          o = void 0 !== t ? (void 0 !== t[1] ? t[1] : t[0]) : e => e,
          n = {
            value: () => i(e.value()),
            setValue: t => {
              var r
              null === (r = e.setValue) || void 0 === r || r.call(e, o(t))
            },
            subscribe: (t, i) => {
              const o = () => {
                i(n)
              }
              let s = r.get(t)
              void 0 === s ? ((s = new Map()), s.set(i, o), r.set(t, s)) : s.set(i, o), e.subscribe(o)
            },
            unsubscribe: (t, i) => {
              const o = r.get(t)
              if (void 0 !== o) {
                const t = o.get(i)
                void 0 !== t && (e.unsubscribe(t), o.delete(i))
              }
            },
            unsubscribeAll: t => {
              const i = r.get(t)
              void 0 !== i &&
                (i.forEach((t, r) => {
                  e.unsubscribe(t)
                }),
                i.clear())
            },
          }
        return n
      }
      function Y(e, t, r, i) {
        const o = W(t, i),
          n = void 0 !== i ? (void 0 !== i[1] ? i[1] : i[0]) : e => e
        return (o.setValue = i => e.setWatchedValue(t, n(i), r)), o
      }
      function G(e, t) {
        return (function (e, t, r) {
          const i = new Map()
          return W(
            {
              subscribe: (r, o) => {
                const n = e => r(t(e))
                i.set(r, n), e.subscribe(n, o)
              },
              unsubscribe: t => {
                if (t) {
                  const r = i.get(t)
                  r && (e.unsubscribe(r), i.delete(t))
                } else i.clear(), e.unsubscribe()
              },
              value: () => t(e.value()),
            },
            r,
          )
        })(e, e => e, t)
      }
      function j(e, t) {
        const r = (0, R.makeProxyDefinitionProperty)(t)
        return (r.setValue = t => e.setPriceScaleSelectionStrategy(t)), r
      }
      function F(e, t, r, i) {
        const o = (0, R.makeProxyDefinitionProperty)(t)
        return (
          (o.setValue = t => {
            const o = { lockScale: t }
            e.setPriceScaleMode(o, r, i)
          }),
          o
        )
      }
      function U(e, t, r, i) {
        const o = (0, R.makeProxyDefinitionProperty)(t, i)
        return (
          (o.setValue = i => {
            e.setScaleRatioProperty(t, i, r)
          }),
          o
        )
      }
      var B = r(24377),
        q = r(68906),
        J = r(81465)
      function K(e, t) {
        if ((0, q.isHexColor)(e)) {
          const r = (0, B.parseRgb)(e)
          return (0, B.rgbaToString)((0, B.rgba)(r, (100 - t) / 100))
        }
        return e
      }
      function Q(e, t, r, i, o) {
        let n
        if (null !== r) {
          const e = (0, J.combineProperty)(K, t, r)
          n = (0, R.makeProxyDefinitionPropertyDestroyable)(e)
        } else n = (0, R.makeProxyDefinitionProperty)(t, [() => K(t.value(), 0), e => e])
        return (
          (n.setValue = r => {
            o && e.beginUndoMacro(i), e.setProperty(t, r, i), o && e.endUndoMacro()
          }),
          n
        )
      }
      function X(e, t, r, i, o, n) {
        const s = [
          ((p = r),
          (l = t),
          e => {
            const t = p(l)
            if (e === l.value() && null !== t) {
              const e = t.ticker || t.full_name
              if (e) return e
            }
            return e
          }),
          e => e,
        ]
        var p, l
        const u = (0, R.convertToDefinitionProperty)(e, t, o, s)
        n && (u.setValue = n)
        const c = new Map()
        ;(u.subscribe = (e, r) => {
          const i = e => {
            r(u)
          }
          c.set(r, i), t.subscribe(e, i)
        }),
          (u.unsubscribe = (e, r) => {
            const i = c.get(r)
            i && (t.unsubscribe(e, i), c.delete(r))
          })
        const a = {}
        return (
          i.subscribe(a, () => {
            c.forEach((e, t) => {
              t(u)
            })
          }),
          (u.destroy = () => {
            i.unsubscribeAll(a), c.clear()
          }),
          u
        )
      }
      function Z(e) {
        return e.hasOwnProperty('groupType')
      }
      function $(e) {
        e.forEach(e => {
          if (e.hasOwnProperty('propType')) {
            Object.keys(e.properties).forEach(t => {
              const r = e.properties[t]
              void 0 !== r && void 0 !== r.destroy && r.destroy()
            })
          } else $(e.definitions.value())
        })
      }
    },
  },
])
