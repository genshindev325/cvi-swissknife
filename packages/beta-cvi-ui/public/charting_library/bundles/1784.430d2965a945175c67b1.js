;(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1784],
  {
    59142: function (o, e) {
      var l, i, n
      ;(i = [e]),
        void 0 ===
          (n =
            'function' ==
            typeof (l = function (o) {
              'use strict'
              function e(o) {
                if (Array.isArray(o)) {
                  for (var e = 0, l = Array(o.length); e < o.length; e++) l[e] = o[e]
                  return l
                }
                return Array.from(o)
              }
              Object.defineProperty(o, '__esModule', { value: !0 })
              var l = !1
              if ('undefined' != typeof window) {
                var i = {
                  get passive() {
                    l = !0
                  },
                }
                window.addEventListener('testPassive', null, i), window.removeEventListener('testPassive', null, i)
              }
              var n =
                  'undefined' != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                a = [],
                s = !1,
                t = -1,
                c = void 0,
                r = void 0,
                d = function (o) {
                  return a.some(function (e) {
                    return !(!e.options.allowTouchMove || !e.options.allowTouchMove(o))
                  })
                },
                T = function (o) {
                  var e = o || window.event
                  return !!d(e.target) || 1 < e.touches.length || (e.preventDefault && e.preventDefault(), !1)
                },
                L = function () {
                  setTimeout(function () {
                    void 0 !== r && ((document.body.style.paddingRight = r), (r = void 0)),
                      void 0 !== c && ((document.body.style.overflow = c), (c = void 0))
                  })
                }
              ;(o.disableBodyScroll = function (o, i) {
                if (n) {
                  if (!o)
                    return void console.error(
                      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
                    )
                  if (
                    o &&
                    !a.some(function (e) {
                      return e.targetElement === o
                    })
                  ) {
                    var L = { targetElement: o, options: i || {} }
                    ;(a = [].concat(e(a), [L])),
                      (o.ontouchstart = function (o) {
                        1 === o.targetTouches.length && (t = o.targetTouches[0].clientY)
                      }),
                      (o.ontouchmove = function (e) {
                        var l, i, n, a
                        1 === e.targetTouches.length &&
                          ((i = o),
                          (a = (l = e).targetTouches[0].clientY - t),
                          !d(l.target) &&
                            ((i && 0 === i.scrollTop && 0 < a) ||
                            ((n = i) && n.scrollHeight - n.scrollTop <= n.clientHeight && a < 0)
                              ? T(l)
                              : l.stopPropagation()))
                      }),
                      s || (document.addEventListener('touchmove', T, l ? { passive: !1 } : void 0), (s = !0))
                  }
                } else {
                  ;(m = i),
                    setTimeout(function () {
                      if (void 0 === r) {
                        var o = !!m && !0 === m.reserveScrollBarGap,
                          e = window.innerWidth - document.documentElement.clientWidth
                        o &&
                          0 < e &&
                          ((r = document.body.style.paddingRight), (document.body.style.paddingRight = e + 'px'))
                      }
                      void 0 === c && ((c = document.body.style.overflow), (document.body.style.overflow = 'hidden'))
                    })
                  var h = { targetElement: o, options: i || {} }
                  a = [].concat(e(a), [h])
                }
                var m
              }),
                (o.clearAllBodyScrollLocks = function () {
                  n
                    ? (a.forEach(function (o) {
                        ;(o.targetElement.ontouchstart = null), (o.targetElement.ontouchmove = null)
                      }),
                      s && (document.removeEventListener('touchmove', T, l ? { passive: !1 } : void 0), (s = !1)),
                      (a = []),
                      (t = -1))
                    : (L(), (a = []))
                }),
                (o.enableBodyScroll = function (o) {
                  if (n) {
                    if (!o)
                      return void console.error(
                        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
                      )
                    ;(o.ontouchstart = null),
                      (o.ontouchmove = null),
                      (a = a.filter(function (e) {
                        return e.targetElement !== o
                      })),
                      s &&
                        0 === a.length &&
                        (document.removeEventListener('touchmove', T, l ? { passive: !1 } : void 0), (s = !1))
                  } else
                    1 === a.length && a[0].targetElement === o
                      ? (L(), (a = []))
                      : (a = a.filter(function (e) {
                          return e.targetElement !== o
                        }))
                })
            })
              ? l.apply(e, i)
              : l) || (o.exports = n)
    },
    97639: o => {
      o.exports = {
        button: 'button-G7o5fBfa',
        hover: 'hover-G7o5fBfa',
        bg: 'bg-G7o5fBfa',
        icon: 'icon-G7o5fBfa',
        isActive: 'isActive-G7o5fBfa',
        isTransparent: 'isTransparent-G7o5fBfa',
        isGrayed: 'isGrayed-G7o5fBfa',
        isHidden: 'isHidden-G7o5fBfa',
      }
    },
    96746: o => {
      o.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 428px)',
      }
    },
    16842: o => {
      o.exports = {
        favorite: 'favorite-JVQQsDQk',
        disabled: 'disabled-JVQQsDQk',
        active: 'active-JVQQsDQk',
        checked: 'checked-JVQQsDQk',
      }
    },
    16534: (o, e, l) => {
      'use strict'
      l.d(e, { ToolButton: () => c })
      var i = l(59496),
        n = l(97754),
        a = l(9745),
        s = l(90186),
        t = l(97639)
      function c(o) {
        const {
          id: e,
          activeClass: l,
          children: c,
          className: r,
          icon: d,
          isActive: T,
          isGrayed: L,
          isHidden: h,
          isTransparent: m,
          theme: v = t,
          onClick: z,
          title: g,
          buttonHotKey: w,
          tooltipPosition: u = 'vertical',
        } = o
        return i.createElement(
          'div',
          {
            id: e,
            className: n(v.button, r, T && l, {
              'apply-common-tooltip': Boolean(g),
              'common-tooltip-vertical': Boolean(g) && 'vertical' === u,
              [v.isActive]: T,
              [v.isGrayed]: L,
              [v.isHidden]: h,
              [v.isTransparent]: m,
            }),
            onClick: z,
            title: g,
            'data-role': 'button',
            'data-tooltip-hotkey': w,
            ...(0, s.filterDataProps)(o),
          },
          i.createElement(
            'div',
            { className: v.bg },
            d &&
              ('string' == typeof d
                ? i.createElement(a.Icon, { className: v.icon, icon: d })
                : i.createElement('span', { className: v.icon }, d)),
            c,
          ),
        )
      }
    },
    10458: (o, e, l) => {
      'use strict'
      l.d(e, { drawingToolsIcons: () => i })
      const i = {
        SyncDrawing: l(69786),
        arrow: l(69725),
        cursor: l(52263),
        dot: l(71908),
        drawginmode: l(47970),
        drawginmodeActive: l(87518),
        eraser: l(94239),
        group: l(99042),
        hideAllDrawings: l(59266),
        hideAllDrawingsActive: l(48111),
        hideAllIndicators: l(77222),
        hideAllIndicatorsActive: l(39056),
        hideAllDrawingTools: l(28407),
        hideAllDrawingToolsActive: l(43969),
        hideAllPositionsTools: l(99186),
        hideAllPositionsToolsActive: l(18968),
        lockAllDrawings: l(56717),
        lockAllDrawingsActive: l(28358),
        magnet: l(32709),
        strongMagnet: l(76025),
        measure: l(47291),
        removeAllDrawingTools: l(78679),
        showObjectTree: l(17748),
        zoom: l(29469),
        'zoom-out': l(23794),
      }
    },
    92469: (o, e, l) => {
      'use strict'
      l.d(e, { lineToolsInfo: () => v })
      var i = l(28353),
        n = l(61814),
        a = (l(94419), l(45749)),
        s = l(10458),
        t = l(60870),
        c = l(68335)
      const r = (0, c.humanReadableModifiers)(c.Modifiers.Shift, !1),
        d = (0, c.humanReadableModifiers)(c.Modifiers.Alt, !1),
        T = (0, c.humanReadableModifiers)(c.Modifiers.Mod, !1),
        L = { keys: [r], text: (0, i.t)('{hotKey_0} — drawing a straight line at angles of 45') },
        h = { keys: [r], text: (0, i.t)('{hotKey_0} — circle') },
        m = { keys: [r], text: (0, i.t)('{hotKey_0} — square') },
        v = {
          LineTool5PointsPattern: {
            icon: a.lineToolsIcons.LineTool5PointsPattern,
            localizedName: t.lineToolsLocalizedNames.LineTool5PointsPattern,
          },
          LineToolABCD: { icon: a.lineToolsIcons.LineToolABCD, localizedName: t.lineToolsLocalizedNames.LineToolABCD },
          LineToolArc: { icon: a.lineToolsIcons.LineToolArc, localizedName: t.lineToolsLocalizedNames.LineToolArc },
          LineToolArrow: {
            icon: a.lineToolsIcons.LineToolArrow,
            localizedName: t.lineToolsLocalizedNames.LineToolArrow,
          },
          LineToolArrowMarkDown: {
            icon: a.lineToolsIcons.LineToolArrowMarkDown,
            localizedName: t.lineToolsLocalizedNames.LineToolArrowMarkDown,
          },
          LineToolArrowMarkLeft: {
            icon: a.lineToolsIcons.LineToolArrowMarkLeft,
            localizedName: t.lineToolsLocalizedNames.LineToolArrowMarkLeft,
          },
          LineToolArrowMarkRight: {
            icon: a.lineToolsIcons.LineToolArrowMarkRight,
            localizedName: t.lineToolsLocalizedNames.LineToolArrowMarkRight,
          },
          LineToolArrowMarkUp: {
            icon: a.lineToolsIcons.LineToolArrowMarkUp,
            localizedName: t.lineToolsLocalizedNames.LineToolArrowMarkUp,
          },
          LineToolBalloon: {
            icon: a.lineToolsIcons.LineToolBalloon,
            localizedName: t.lineToolsLocalizedNames.LineToolBalloon,
          },
          LineToolBarsPattern: {
            icon: a.lineToolsIcons.LineToolBarsPattern,
            localizedName: t.lineToolsLocalizedNames.LineToolBarsPattern,
          },
          LineToolBezierCubic: {
            icon: a.lineToolsIcons.LineToolBezierCubic,
            localizedName: t.lineToolsLocalizedNames.LineToolBezierCubic,
          },
          LineToolBezierQuadro: {
            icon: a.lineToolsIcons.LineToolBezierQuadro,
            localizedName: t.lineToolsLocalizedNames.LineToolBezierQuadro,
          },
          LineToolBrush: {
            icon: a.lineToolsIcons.LineToolBrush,
            localizedName: t.lineToolsLocalizedNames.LineToolBrush,
          },
          LineToolCallout: {
            icon: a.lineToolsIcons.LineToolCallout,
            localizedName: t.lineToolsLocalizedNames.LineToolCallout,
          },
          LineToolCircleLines: {
            icon: a.lineToolsIcons.LineToolCircleLines,
            localizedName: t.lineToolsLocalizedNames.LineToolCircleLines,
          },
          LineToolCypherPattern: {
            icon: a.lineToolsIcons.LineToolCypherPattern,
            localizedName: t.lineToolsLocalizedNames.LineToolCypherPattern,
          },
          LineToolDateAndPriceRange: {
            icon: a.lineToolsIcons.LineToolDateAndPriceRange,
            localizedName: t.lineToolsLocalizedNames.LineToolDateAndPriceRange,
          },
          LineToolDateRange: {
            icon: a.lineToolsIcons.LineToolDateRange,
            localizedName: t.lineToolsLocalizedNames.LineToolDateRange,
          },
          LineToolDisjointAngle: {
            icon: a.lineToolsIcons.LineToolDisjointAngle,
            localizedName: t.lineToolsLocalizedNames.LineToolDisjointAngle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolElliottCorrection: {
            icon: a.lineToolsIcons.LineToolElliottCorrection,
            localizedName: t.lineToolsLocalizedNames.LineToolElliottCorrection,
          },
          LineToolElliottDoubleCombo: {
            icon: a.lineToolsIcons.LineToolElliottDoubleCombo,
            localizedName: t.lineToolsLocalizedNames.LineToolElliottDoubleCombo,
          },
          LineToolElliottImpulse: {
            icon: a.lineToolsIcons.LineToolElliottImpulse,
            localizedName: t.lineToolsLocalizedNames.LineToolElliottImpulse,
          },
          LineToolElliottTriangle: {
            icon: a.lineToolsIcons.LineToolElliottTriangle,
            localizedName: t.lineToolsLocalizedNames.LineToolElliottTriangle,
          },
          LineToolElliottTripleCombo: {
            icon: a.lineToolsIcons.LineToolElliottTripleCombo,
            localizedName: t.lineToolsLocalizedNames.LineToolElliottTripleCombo,
          },
          LineToolEllipse: {
            icon: a.lineToolsIcons.LineToolEllipse,
            localizedName: t.lineToolsLocalizedNames.LineToolEllipse,
            hotKey: (0, n.hotKeySerialize)(h),
          },
          LineToolExtended: {
            icon: a.lineToolsIcons.LineToolExtended,
            localizedName: t.lineToolsLocalizedNames.LineToolExtended,
          },
          LineToolFibChannel: {
            icon: a.lineToolsIcons.LineToolFibChannel,
            localizedName: t.lineToolsLocalizedNames.LineToolFibChannel,
          },
          LineToolFibCircles: {
            icon: a.lineToolsIcons.LineToolFibCircles,
            localizedName: t.lineToolsLocalizedNames.LineToolFibCircles,
            hotKey: (0, n.hotKeySerialize)(h),
          },
          LineToolFibRetracement: {
            icon: a.lineToolsIcons.LineToolFibRetracement,
            localizedName: t.lineToolsLocalizedNames.LineToolFibRetracement,
          },
          LineToolFibSpeedResistanceArcs: {
            icon: a.lineToolsIcons.LineToolFibSpeedResistanceArcs,
            localizedName: t.lineToolsLocalizedNames.LineToolFibSpeedResistanceArcs,
          },
          LineToolFibSpeedResistanceFan: {
            icon: a.lineToolsIcons.LineToolFibSpeedResistanceFan,
            localizedName: t.lineToolsLocalizedNames.LineToolFibSpeedResistanceFan,
            hotKey: (0, n.hotKeySerialize)(m),
          },
          LineToolFibSpiral: {
            icon: a.lineToolsIcons.LineToolFibSpiral,
            localizedName: t.lineToolsLocalizedNames.LineToolFibSpiral,
          },
          LineToolFibTimeZone: {
            icon: a.lineToolsIcons.LineToolFibTimeZone,
            localizedName: t.lineToolsLocalizedNames.LineToolFibTimeZone,
          },
          LineToolFibWedge: {
            icon: a.lineToolsIcons.LineToolFibWedge,
            localizedName: t.lineToolsLocalizedNames.LineToolFibWedge,
          },
          LineToolFlagMark: {
            icon: a.lineToolsIcons.LineToolFlagMark,
            localizedName: t.lineToolsLocalizedNames.LineToolFlagMark,
          },
          LineToolImage: {
            icon: a.lineToolsIcons.LineToolImage,
            localizedName: t.lineToolsLocalizedNames.LineToolImage,
          },
          LineToolFlatBottom: {
            icon: a.lineToolsIcons.LineToolFlatBottom,
            localizedName: t.lineToolsLocalizedNames.LineToolFlatBottom,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolAnchoredVWAP: {
            icon: a.lineToolsIcons.LineToolAnchoredVWAP,
            localizedName: t.lineToolsLocalizedNames.LineToolAnchoredVWAP,
          },
          LineToolGannComplex: {
            icon: a.lineToolsIcons.LineToolGannComplex,
            localizedName: t.lineToolsLocalizedNames.LineToolGannComplex,
          },
          LineToolGannFixed: {
            icon: a.lineToolsIcons.LineToolGannFixed,
            localizedName: t.lineToolsLocalizedNames.LineToolGannFixed,
          },
          LineToolGannFan: {
            icon: a.lineToolsIcons.LineToolGannFan,
            localizedName: t.lineToolsLocalizedNames.LineToolGannFan,
          },
          LineToolGannSquare: {
            icon: a.lineToolsIcons.LineToolGannSquare,
            localizedName: t.lineToolsLocalizedNames.LineToolGannSquare,
            hotKey: (0, n.hotKeySerialize)({ keys: [r], text: (0, i.t)('{hotKey_0} — fixed increments') }),
          },
          LineToolHeadAndShoulders: {
            icon: a.lineToolsIcons.LineToolHeadAndShoulders,
            localizedName: t.lineToolsLocalizedNames.LineToolHeadAndShoulders,
          },
          LineToolHorzLine: {
            icon: a.lineToolsIcons.LineToolHorzLine,
            localizedName: t.lineToolsLocalizedNames.LineToolHorzLine,
            hotKey: (0, n.hotKeySerialize)({ keys: [d, 'H'], text: '{0} + {1}' }),
          },
          LineToolHorzRay: {
            icon: a.lineToolsIcons.LineToolHorzRay,
            localizedName: t.lineToolsLocalizedNames.LineToolHorzRay,
          },
          LineToolIcon: { icon: a.lineToolsIcons.LineToolIcon, localizedName: t.lineToolsLocalizedNames.LineToolIcon },
          LineToolInsidePitchfork: {
            icon: a.lineToolsIcons.LineToolInsidePitchfork,
            localizedName: t.lineToolsLocalizedNames.LineToolInsidePitchfork,
          },
          LineToolNote: { icon: a.lineToolsIcons.LineToolNote, localizedName: t.lineToolsLocalizedNames.LineToolNote },
          LineToolNoteAbsolute: {
            icon: a.lineToolsIcons.LineToolNoteAbsolute,
            localizedName: t.lineToolsLocalizedNames.LineToolNoteAbsolute,
          },
          LineToolSignpost: {
            icon: a.lineToolsIcons.LineToolSignpost,
            localizedName: t.lineToolsLocalizedNames.LineToolSignpost,
          },
          LineToolParallelChannel: {
            icon: a.lineToolsIcons.LineToolParallelChannel,
            localizedName: t.lineToolsLocalizedNames.LineToolParallelChannel,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolPitchfan: {
            icon: a.lineToolsIcons.LineToolPitchfan,
            localizedName: t.lineToolsLocalizedNames.LineToolPitchfan,
          },
          LineToolPitchfork: {
            icon: a.lineToolsIcons.LineToolPitchfork,
            localizedName: t.lineToolsLocalizedNames.LineToolPitchfork,
          },
          LineToolPolyline: {
            icon: a.lineToolsIcons.LineToolPolyline,
            localizedName: t.lineToolsLocalizedNames.LineToolPolyline,
          },
          LineToolPath: { icon: a.lineToolsIcons.LineToolPath, localizedName: t.lineToolsLocalizedNames.LineToolPath },
          LineToolPrediction: {
            icon: a.lineToolsIcons.LineToolPrediction,
            localizedName: t.lineToolsLocalizedNames.LineToolPrediction,
          },
          LineToolPriceLabel: {
            icon: a.lineToolsIcons.LineToolPriceLabel,
            localizedName: t.lineToolsLocalizedNames.LineToolPriceLabel,
          },
          LineToolPriceNote: {
            icon: a.lineToolsIcons.LineToolPriceNote,
            localizedName: t.lineToolsLocalizedNames.LineToolPriceNote,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolArrowMarker: {
            icon: a.lineToolsIcons.LineToolArrowMarker,
            localizedName: t.lineToolsLocalizedNames.LineToolArrowMarker,
          },
          LineToolPriceRange: {
            icon: a.lineToolsIcons.LineToolPriceRange,
            localizedName: t.lineToolsLocalizedNames.LineToolPriceRange,
          },
          LineToolProjection: {
            icon: a.lineToolsIcons.LineToolProjection,
            localizedName: t.lineToolsLocalizedNames.LineToolProjection,
          },
          LineToolRay: { icon: a.lineToolsIcons.LineToolRay, localizedName: t.lineToolsLocalizedNames.LineToolRay },
          LineToolRectangle: {
            icon: a.lineToolsIcons.LineToolRectangle,
            localizedName: t.lineToolsLocalizedNames.LineToolRectangle,
            hotKey: (0, n.hotKeySerialize)({ keys: [r], text: (0, i.t)('{hotKey_0} — square') }),
          },
          LineToolCircle: {
            icon: a.lineToolsIcons.LineToolCircle,
            localizedName: t.lineToolsLocalizedNames.LineToolCircle,
          },
          LineToolRegressionTrend: {
            icon: a.lineToolsIcons.LineToolRegressionTrend,
            localizedName: t.lineToolsLocalizedNames.LineToolRegressionTrend,
          },
          LineToolRiskRewardLong: {
            icon: a.lineToolsIcons.LineToolRiskRewardLong,
            localizedName: t.lineToolsLocalizedNames.LineToolRiskRewardLong,
          },
          LineToolRiskRewardShort: {
            icon: a.lineToolsIcons.LineToolRiskRewardShort,
            localizedName: t.lineToolsLocalizedNames.LineToolRiskRewardShort,
          },
          LineToolFixedRangeVolumeProfile: {
            icon: a.lineToolsIcons.LineToolFixedRangeVolumeProfile,
            localizedName: t.lineToolsLocalizedNames.LineToolFixedRangeVolumeProfile,
          },
          LineToolRotatedRectangle: {
            icon: a.lineToolsIcons.LineToolRotatedRectangle,
            localizedName: t.lineToolsLocalizedNames.LineToolRotatedRectangle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolSchiffPitchfork: {
            icon: a.lineToolsIcons.LineToolSchiffPitchfork,
            localizedName: t.lineToolsLocalizedNames.LineToolSchiffPitchfork,
          },
          LineToolSchiffPitchfork2: {
            icon: a.lineToolsIcons.LineToolSchiffPitchfork2,
            localizedName: t.lineToolsLocalizedNames.LineToolSchiffPitchfork2,
          },
          LineToolSineLine: {
            icon: a.lineToolsIcons.LineToolSineLine,
            localizedName: t.lineToolsLocalizedNames.LineToolSineLine,
          },
          LineToolText: { icon: a.lineToolsIcons.LineToolText, localizedName: t.lineToolsLocalizedNames.LineToolText },
          LineToolTextAbsolute: {
            icon: a.lineToolsIcons.LineToolTextAbsolute,
            localizedName: t.lineToolsLocalizedNames.LineToolTextAbsolute,
          },
          LineToolThreeDrivers: {
            icon: a.lineToolsIcons.LineToolThreeDrivers,
            localizedName: t.lineToolsLocalizedNames.LineToolThreeDrivers,
          },
          LineToolTimeCycles: {
            icon: a.lineToolsIcons.LineToolTimeCycles,
            localizedName: t.lineToolsLocalizedNames.LineToolTimeCycles,
          },
          LineToolTrendAngle: {
            icon: a.lineToolsIcons.LineToolTrendAngle,
            localizedName: t.lineToolsLocalizedNames.LineToolTrendAngle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolTrendBasedFibExtension: {
            icon: a.lineToolsIcons.LineToolTrendBasedFibExtension,
            localizedName: t.lineToolsLocalizedNames.LineToolTrendBasedFibExtension,
          },
          LineToolTrendBasedFibTime: {
            icon: a.lineToolsIcons.LineToolTrendBasedFibTime,
            localizedName: t.lineToolsLocalizedNames.LineToolTrendBasedFibTime,
          },
          LineToolTrendLine: {
            icon: a.lineToolsIcons.LineToolTrendLine,
            localizedName: t.lineToolsLocalizedNames.LineToolTrendLine,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolInfoLine: {
            icon: a.lineToolsIcons.LineToolInfoLine,
            localizedName: t.lineToolsLocalizedNames.LineToolInfoLine,
          },
          LineToolTriangle: {
            icon: a.lineToolsIcons.LineToolTriangle,
            localizedName: t.lineToolsLocalizedNames.LineToolTriangle,
          },
          LineToolTrianglePattern: {
            icon: a.lineToolsIcons.LineToolTrianglePattern,
            localizedName: t.lineToolsLocalizedNames.LineToolTrianglePattern,
          },
          LineToolVertLine: {
            icon: a.lineToolsIcons.LineToolVertLine,
            localizedName: t.lineToolsLocalizedNames.LineToolVertLine,
            hotKey: (0, n.hotKeySerialize)({ keys: [d, 'V'], text: '{0} + {1}' }),
          },
          LineToolCrossLine: {
            icon: a.lineToolsIcons.LineToolCrossLine,
            localizedName: t.lineToolsLocalizedNames.LineToolCrossLine,
          },
          LineToolHighlighter: {
            icon: a.lineToolsIcons.LineToolHighlighter,
            localizedName: t.lineToolsLocalizedNames.LineToolHighlighter,
          },
          SyncDrawing: {
            icon: s.drawingToolsIcons.SyncDrawing,
            iconActive: s.drawingToolsIcons.SyncDrawingActive,
            localizedName: (0, i.t)(
              'New drawings are replicated to all charts in the layout and shown when the same ticker is selected',
            ),
          },
          arrow: { icon: s.drawingToolsIcons.arrow, localizedName: (0, i.t)('Arrow') },
          cursor: { icon: s.drawingToolsIcons.cursor, localizedName: (0, i.t)('Cross') },
          dot: { icon: s.drawingToolsIcons.dot, localizedName: (0, i.t)('Dot') },
          drawginmode: {
            icon: s.drawingToolsIcons.drawginmode,
            iconActive: s.drawingToolsIcons.drawginmodeActive,
            localizedName: (0, i.t)('Stay in Drawing Mode'),
          },
          eraser: { icon: s.drawingToolsIcons.eraser, localizedName: (0, i.t)('Eraser') },
          group: { icon: s.drawingToolsIcons.group, localizedName: (0, i.t)('Show Hidden Tools') },
          hideAllDrawings: {
            icon: s.drawingToolsIcons.hideAllDrawings,
            iconActive: s.drawingToolsIcons.hideAllDrawingsActive,
            localizedName: (0, i.t)('Hide All Drawing Tools'),
            hotKey: (0, n.hotKeySerialize)({ keys: [T, d, 'H'], text: '{0} + {1} + {2}' }),
          },
          lockAllDrawings: {
            icon: s.drawingToolsIcons.lockAllDrawings,
            iconActive: s.drawingToolsIcons.lockAllDrawingsActive,
            localizedName: (0, i.t)('Lock All Drawing Tools'),
          },
          magnet: {
            icon: s.drawingToolsIcons.magnet,
            localizedName: (0, i.t)('Magnet Mode snaps drawings placed near price bars to the closest OHLC value'),
            hotKey: (0, n.hotKeySerialize)({ keys: [T], text: '{0}' }),
          },
          measure: {
            icon: s.drawingToolsIcons.measure,
            localizedName: (0, i.t)('Measure'),
            hotKey: (0, n.hotKeySerialize)({ keys: [r], text: (0, i.t)('{hotKey_0} + Click on the chart') }),
          },
          removeAllDrawingTools: {
            icon: s.drawingToolsIcons.removeAllDrawingTools,
            localizedName: (0, i.t)('Remove Drawings'),
          },
          showObjectsTree: { icon: s.drawingToolsIcons.showObjectTree, localizedName: (0, i.t)('Show Object Tree') },
          zoom: {
            icon: s.drawingToolsIcons.zoom,
            localizedName: (0, i.t)('Zoom In'),
          },
          'zoom-out': { icon: s.drawingToolsIcons['zoom-out'], localizedName: (0, i.t)('Zoom Out') },
        }
      v.LineToolGhostFeed = {
        icon: a.lineToolsIcons.LineToolGhostFeed,
        localizedName: t.lineToolsLocalizedNames.LineToolGhostFeed,
      }
    },
    89377: (o, e, l) => {
      'use strict'
      l.d(e, { LinetoolsFavoritesStore: () => n })
      var i,
        n,
        a = l(2872),
        s = l.n(a),
        t = l(56840)
      !(function (o) {
        function e() {
          o.favorites = []
          ;(0, t.getJSON)('chart.favoriteDrawings', []).forEach(e => {
            l(e.tool || e) && o.favorites.push(e.tool || e)
          }),
            o.favoritesSynced.fire()
        }
        function l(o) {
          return 'string' == typeof o && '' !== o
        }
        ;(o.favorites = []),
          (o.favoritesSynced = new (s())()),
          (o.favoriteIndex = function (e) {
            return o.favorites.indexOf(e)
          }),
          (o.isValidLineToolName = l),
          (o.saveFavorites = function (e) {
            ;(0, t.setJSON)('chart.favoriteDrawings', o.favorites, e)
          }),
          e(),
          t.onSync.subscribe(null, e)
      })(i || (i = {})),
        (function (o) {
          function e(o) {
            return i.isValidLineToolName(o)
          }
          function l() {
            return i.favorites.length
          }
          function n(o) {
            return -1 !== i.favoriteIndex(o)
          }
          ;(o.favoriteAdded = new (s())()),
            (o.favoriteRemoved = new (s())()),
            (o.favoriteMoved = new (s())()),
            (o.favoritesSynced = i.favoritesSynced),
            (o.favorites = function () {
              return i.favorites.slice()
            }),
            (o.isValidLineToolName = e),
            (o.favoritesCount = l),
            (o.favorite = function (o) {
              return o < 0 || o >= l() ? '' : i.favorites[o]
            }),
            (o.addFavorite = function (l, a) {
              return !(n(l) || !e(l)) && (i.favorites.push(l), i.saveFavorites(a), o.favoriteAdded.fire(l), !0)
            }),
            (o.removeFavorite = function (e, l) {
              const n = i.favoriteIndex(e)
              return -1 !== n && (i.favorites.splice(n, 1), i.saveFavorites(l), o.favoriteRemoved.fire(e), !0)
            }),
            (o.isFavorite = n),
            (o.moveFavorite = function (n, a, s) {
              if (a < 0 || a >= l() || !e(n)) return !1
              const t = i.favoriteIndex(n)
              return (
                -1 !== t &&
                a !== t &&
                (i.favorites.splice(t, 1),
                i.favorites.splice(a, 0, n),
                i.saveFavorites(s),
                o.favoriteMoved.fire(n, t, a),
                !0)
              )
            })
        })(n || (n = {}))
    },
    24437: (o, e, l) => {
      'use strict'
      l.d(e, { DialogBreakpoints: () => n })
      var i = l(96746)
      const n = {
        SmallHeight: i['small-height-breakpoint'],
        TabletSmall: i['tablet-small-breakpoint'],
        TabletNormal: i['tablet-normal-breakpoint'],
      }
    },
    36189: (o, e, l) => {
      'use strict'
      l.d(e, { FavoriteButton: () => T })
      var i = l(28353),
        n = l(59496),
        a = l(97754),
        s = l(9745),
        t = l(20614),
        c = l(55783),
        r = l(16842)
      const d = { add: (0, i.t)('Add to favorites'), remove: (0, i.t)('Remove from favorites') }
      function T(o) {
        const { className: e, isFilled: l, isActive: i, onClick: T, ...L } = o
        return n.createElement(s.Icon, {
          ...L,
          className: a(r.favorite, 'apply-common-tooltip', l && r.checked, i && r.active, e),
          icon: l ? t : c,
          onClick: T,
          title: l ? d.remove : d.add,
        })
      }
    },
    40173: (o, e, l) => {
      'use strict'
      function i(o, e, l = {}) {
        const i = Object.assign({}, e)
        for (const n of Object.keys(e)) {
          const a = l[n] || n
          a in o && (i[n] = [o[a], e[n]].join(' '))
        }
        return i
      }
      function n(o, e, l = {}) {
        return Object.assign({}, o, i(o, e, l))
      }
      l.d(e, { weakComposeClasses: () => i, mergeThemes: () => n })
    },
    99042: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M5.5 13A2.5 2.5 0 0 0 3 15.5 2.5 2.5 0 0 0 5.5 18 2.5 2.5 0 0 0 8 15.5 2.5 2.5 0 0 0 5.5 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 15 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 15 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>'
    },
    69725: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.682 16.09l3.504 6.068 1.732-1-3.497-6.057 3.595-2.1L8 7.74v10.512l3.682-2.163zm-.362 1.372L7 20V6l12 7-4.216 2.462 3.5 6.062-3.464 2-3.5-6.062z"/></svg>'
    },
    52263: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"/><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"/></g></svg>'
    },
    71908: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><circle fill="currentColor" cx="14" cy="14" r="3"/></svg>'
    },
    87518: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 17.5v-2a2.5 2.5 0 0 0-5 0v2h1v-2a1.5 1.5 0 0 1 3 0v2h1z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
    },
    47970: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 14.5a2.5 2.5 0 0 0-5 0v3h1v-3a1.5 1.5 0 0 1 3 0v.5h1v-.5z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>'
    },
    94239: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 31" width="29" height="31"><g fill="currentColor" fill-rule="nonzero"><path d="M15.3 22l8.187-8.187c.394-.394.395-1.028.004-1.418l-4.243-4.243c-.394-.394-1.019-.395-1.407-.006l-11.325 11.325c-.383.383-.383 1.018.007 1.407l1.121 1.121h7.656zm-9.484-.414c-.781-.781-.779-2.049-.007-2.821l11.325-11.325c.777-.777 2.035-.78 2.821.006l4.243 4.243c.781.781.78 2.048-.004 2.832l-8.48 8.48h-8.484l-1.414-1.414z"/><path d="M13.011 22.999h7.999v-1h-7.999zM13.501 11.294l6.717 6.717.707-.707-6.717-6.717z"/></g></svg>'
    },
    32709: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 10a2 2 0 0 0-2 2v11H6V12c0-4.416 3.584-8 8-8s8 3.584 8 8v11h-6V12a2 2 0 0 0-2-2zm-3 2a3 3 0 0 1 6 0v10h4V12c0-3.864-3.136-7-7-7s-7 3.136-7 7v10h4V12z"/><path d="M6.5 18h5v1h-5zm10 0h5v1h-5z"/></g></svg>'
    },
    47291: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"/></svg>'
    },
    17748: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M14 18.634l-.307-.239-7.37-5.73-2.137-1.665 9.814-7.633 9.816 7.634-.509.394-1.639 1.269-7.667 5.969zm7.054-6.759l1.131-.876-8.184-6.366-8.186 6.367 1.123.875 7.063 5.491 7.054-5.492z"/><path d="M7 14.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/><path d="M7 17.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/></g></svg>'
    },
    76025: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"/></svg>'
    },
    69786: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M15.039 5.969l-.019-.019-2.828 2.828.707.707 2.474-2.474c1.367-1.367 3.582-1.367 4.949 0s1.367 3.582 0 4.949l-2.474 2.474.707.707 2.828-2.828-.019-.019c1.415-1.767 1.304-4.352-.334-5.99-1.638-1.638-4.224-1.749-5.99-.334zM5.97 15.038l-.019-.019 2.828-2.828.707.707-2.475 2.475c-1.367 1.367-1.367 3.582 0 4.949s3.582 1.367 4.949 0l2.474-2.474.707.707-2.828 2.828-.019-.019c-1.767 1.415-4.352 1.304-5.99-.334-1.638-1.638-1.749-4.224-.334-5.99z"/><path d="M10.485 16.141l5.656-5.656.707.707-5.656 5.656z"/></g></svg>'
    },
    43969: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M19.76 6.07l-.7.7a13.4 13.4 0 011.93 2.47c.19.3.33.55.42.72l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02a5.1 5.1 0 00-.15-.28 16 16 0 00-2.53-3.41zM6.24 13.93l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41zm6.09-.43a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm-1.97-3.69l-.93.93a3.6 3.6 0 014.24-4.24l-.95.95a2.6 2.6 0 00-2.36 2.36zm11.29 7.84l-.8.79a1.5 1.5 0 000 2.12l.59.59a1.5 1.5 0 002.12 0l1.8-1.8-.71-.7-1.8 1.79a.5.5 0 01-.7 0l-.59-.59a.5.5 0 010-.7l.8-.8-.71-.7zm-5.5 3.5l.35.35-.35-.35.01-.02.02-.02.02-.02a4.68 4.68 0 01.65-.5c.4-.27 1-.59 1.65-.59.66 0 1.28.33 1.73.77.44.45.77 1.07.77 1.73a2.5 2.5 0 01-.77 1.73 2.5 2.5 0 01-1.73.77h-4a.5.5 0 01-.42-.78l1-1.5 1-1.5a.5.5 0 01.07-.07zm.74.67a3.46 3.46 0 01.51-.4c.35-.24.75-.42 1.1-.42.34 0 .72.17 1.02.48.3.3.48.68.48 1.02 0 .34-.17.72-.48 1.02-.3.3-.68.48-1.02.48h-3.07l.49-.72.97-1.46zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    39056: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M16.47 3.7A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76zm-7.04 7.04l.93-.93a2.6 2.6 0 012.36-2.36l.95-.95a3.6 3.6 0 00-4.24 4.24zm.1 5.56c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02-.02-.03-.01-.03a9.5 9.5 0 00-.57-1 16 16 0 00-2.08-2.63l-.7.7.27.29a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76zm2.8-2.8a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm7.9 3.73c-.12.12-.23.35-.23.77v2h1v1h-1v2c0 .58-.14 1.1-.52 1.48-.38.38-.9.52-1.48.52s-1.1-.14-1.48-.52c-.38-.38-.52-.9-.52-1.48h1c0 .42.1.65.23.77.12.12.35.23.77.23.42 0 .65-.1.77-.23.12-.12.23-.35.23-.77v-2h-1v-1h1v-2c0-.58.14-1.1.52-1.48.38-.38.9-.52 1.48-.52s1.1.14 1.48.52c.38.38.52.9.52 1.48h-1c0-.42-.1-.65-.23-.77-.12-.12-.35-.23-.77-.23-.42 0-.65.1-.77.23zm2.56 6.27l-1.14-1.15.7-.7 1.15 1.14 1.15-1.14.7.7-1.14 1.15 1.14 1.15-.7.7-1.15-1.14-1.15 1.14-.7-.7 1.14-1.15zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>'
    },
    18968: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 18.2L21.2 2.5l-.7-.7L4.8 17.5l.7.7zM19.05 6.78l.71-.7a14.26 14.26 0 0 1 2.08 2.64 14.26 14.26 0 0 1 .6 1.05v.02h.01L22 10l.45.22-.01.02a5.18 5.18 0 0 1-.15.28 16 16 0 0 1-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-1.29 0-2.44-.3-3.47-.76l.76-.76c.83.32 1.73.52 2.71.52 2.73 0 4.85-1.53 6.33-3.12a15.01 15.01 0 0 0 2.08-2.9l.03-.04-.03-.04a15 15 0 0 0-2.36-3.18zM22 10l.45-.22.1.22-.1.22L22 10zM6.94 13.23l-.7.7a14.24 14.24 0 0 1-2.08-2.64 14.28 14.28 0 0 1-.6-1.05v-.02h-.01L4 10l-.45-.22.01-.02a5.55 5.55 0 0 1 .15-.28 16 16 0 0 1 2.23-3.1C7.5 4.69 9.88 2.94 13 2.94c1.29 0 2.44.3 3.47.76l-.76.76A7.27 7.27 0 0 0 13 3.94c-2.73 0-4.85 1.53-6.33 3.12a15 15 0 0 0-2.08 2.9l-.03.04.03.04a15.01 15.01 0 0 0 2.36 3.18zM4 10l-.45.22-.1-.22.1-.22L4 10zm9 3.56c-.23 0-.46-.02-.67-.06l.95-.95a2.6 2.6 0 0 0 2.36-2.36l.93-.93a3.6 3.6 0 0 1-3.57 4.3zm-3.57-2.82l.93-.93a2.6 2.6 0 0 1 2.36-2.36l.95-.95a3.6 3.6 0 0 0-4.24 4.24zM17.5 21.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zM18.58 19.22a.5.5 0 0 1 .7-.14L22 20.9l2.72-1.82a.5.5 0 0 1 .56.84L22 22.1l-3.28-2.18a.5.5 0 0 1-.14-.7z"/></svg>'
    },
    28358: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h6V9a3 3 0 0 0-3-3zm4 6V9a4 4 0 0 0-8 0v3H8.5A2.5 2.5 0 0 0 6 14.5v7A2.5 2.5 0 0 0 8.5 24h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H18zm-5 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    56717: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>'
    },
    59266: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
    },
    28407: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76l-.41-.72-.03-.04.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12 2.73 0 4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-2.73 0-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a5.04 5.04 0 01-.15.28 16.01 16.01 0 01-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-3.12 0-5.5-1.75-7.06-3.44a16 16 0 01-2.38-3.38v-.02h-.01L4 10l-.45-.22.01-.02a5.4 5.4 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.88 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16.01 16.01 0 012.38 3.38v.02h.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10 3.6 3.6 0 0013 13.56c2 0 3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zm7.85 12l.8-.8.7.71-.79.8a.5.5 0 000 .7l.59.59c.2.2.5.2.7 0l1.8-1.8.7.71-1.79 1.8a1.5 1.5 0 01-2.12 0l-.59-.59a1.5 1.5 0 010-2.12zM16.5 21.5l-.35-.35a.5.5 0 00-.07.07l-1 1.5-1 1.5a.5.5 0 00.42.78h4a2.5 2.5 0 001.73-.77A2.5 2.5 0 0021 22.5a2.5 2.5 0 00-.77-1.73A2.5 2.5 0 0018.5 20a3.1 3.1 0 00-1.65.58 5.28 5.28 0 00-.69.55v.01h-.01l.35.36zm.39.32l-.97 1.46-.49.72h3.07c.34 0 .72-.17 1.02-.48.3-.3.48-.68.48-1.02 0-.34-.17-.72-.48-1.02-.3-.3-.68-.48-1.02-.48-.35 0-.75.18-1.1.42a4.27 4.27 0 00-.51.4z"/></svg>'
    },
    77222: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76a13.27 13.27 0 01-.41-.72L4.56 10l.03-.04a15 15 0 012.08-2.9c1.48-1.6 3.6-3.12 6.33-3.12s4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.08 2.9c-1.48 1.6-3.6 3.12-6.33 3.12s-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a14.3 14.3 0 01-.6 1.05c-.4.64-1 1.48-1.78 2.33-1.56 1.7-3.94 3.44-7.06 3.44s-5.5-1.75-7.06-3.44a16 16 0 01-2.23-3.1 9.39 9.39 0 01-.15-.28v-.02h-.01L4 10l-.45-.22.01-.02a5.59 5.59 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.87 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16 16 0 012.23 3.1 9.5 9.5 0 01.15.28v.01l.01.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10c0 1.98 1.65 3.56 3.65 3.56s3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zM20 18c0-.42.1-.65.23-.77.12-.13.35-.23.77-.23.42 0 .65.1.77.23.13.12.23.35.23.77h1c0-.58-.14-1.1-.52-1.48-.38-.38-.9-.52-1.48-.52s-1.1.14-1.48.52c-.37.38-.52.9-.52 1.48v2h-1v1h1v2c0 .42-.1.65-.23.77-.12.13-.35.23-.77.23-.42 0-.65-.1-.77-.23-.13-.12-.23-.35-.23-.77h-1c0 .58.14 1.1.52 1.48.38.37.9.52 1.48.52s1.1-.14 1.48-.52c.37-.38.52-.9.52-1.48v-2h1v-1h-1v-2zm1.65 4.35l1.14 1.15-1.14 1.15.7.7 1.15-1.14 1.15 1.14.7-.7-1.14-1.15 1.14-1.15-.7-.7-1.15 1.14-1.15-1.14-.7.7z"/></svg>'
    },
    99186: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.5 10a8.46 8.46 0 0 0 .46.8c.38.6.94 1.4 1.68 2.19 1.48 1.6 3.62 3.13 6.36 3.13s4.88-1.53 6.36-3.13A15.07 15.07 0 0 0 21.5 10a7.41 7.41 0 0 0-.46-.8c-.38-.6-.94-1.4-1.68-2.19-1.48-1.6-3.62-3.13-6.36-3.13S8.12 5.4 6.64 7A15.07 15.07 0 0 0 4.5 10zM22 10l.41-.19-.4.19zm0 0l.41.19-.4-.19zm.41.19l.09-.19-.09-.19-.01-.02a6.86 6.86 0 0 0-.15-.28c-.1-.18-.25-.45-.45-.76-.4-.64-.99-1.48-1.77-2.32C18.47 4.74 16.11 3 13 3 9.89 3 7.53 4.74 5.97 6.43A15.94 15.94 0 0 0 3.6 9.79v.02h-.01L3.5 10l.09.19.01.02a6.59 6.59 0 0 0 .15.28c.1.18.25.45.45.76.4.64.99 1.48 1.77 2.32C7.53 15.26 9.89 17 13 17c3.11 0 5.47-1.74 7.03-3.43a15.94 15.94 0 0 0 2.37-3.36v-.02h.01zM4 10l-.41-.19.4.19zm9-2.63c-1.5 0-2.7 1.18-2.7 2.63s1.2 2.63 2.7 2.63c1.5 0 2.7-1.18 2.7-2.63S14.5 7.37 13 7.37zM9.4 10C9.4 8.07 11 6.5 13 6.5s3.6 1.57 3.6 3.5S15 13.5 13 13.5A3.55 3.55 0 0 1 9.4 10zm8.1 11.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zm1.78-2.82a.5.5 0 0 0-.56.84L22 22.1l3.28-2.18a.5.5 0 1 0-.56-.84L22 20.9l-2.72-1.82z"/></svg>'
    },
    29469: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/><path d="M13 16V9h-1v7z"/></svg>'
    },
    23794: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/></svg>'
    },
    37049: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>'
    },
    20614: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>'
    },
    55783: o => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>'
    },
  },
])
