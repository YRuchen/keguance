;(window._iconfont_svg_string_ =
  '<svg><symbol id="icon-e911_emergency" viewBox="0 0 1056 1024"><path d="M224.94675167 874.66666633v-85.333333h68.266667l84.266667-280.533333q8.533333-27.733333 31.466666-44.266667T459.61341867 448.00000033h128q27.733333 0 50.666667 16.533333T669.74675167 508.80000033l84.266667 280.533333h68.266667v85.333333H224.94675167z m256-512v-213.333333h85.333334v213.333333h-85.333334z m253.866667 105.6l-60.8-60.8 151.466667-150.4 59.733333 59.733334-150.4 151.466666z m44.8 193.066667v-85.333333h213.333333v85.333333H779.61341867zM312.41341867 468.26666633L162.01341867 316.80000033l59.733333-59.733334 151.466667 150.4-60.8 60.8zM54.28008567 661.33333333v-85.333333h213.333333v85.333333H54.28008567z" fill="#606266" ></path></symbol><symbol id="icon-menu_logs" viewBox="0 0 1169 1024"><path d="M349.60390918 608.65618185v-96.0481504h480.24074899v96.0481504H349.60390918z m0 192.09629928v-96.04815037h336.16852341v96.04815037H349.60390918zM253.55575881 992.84878041q-39.61986111 0-67.8340065-28.21414389T157.50760843 896.80063152v-672.33704972q0-39.61986111 28.21414388-67.83400649T253.55575881 128.41543141h48.02407519v-96.04814891h96.0481489v96.04814891h384.19260006v-96.04814891h96.04815039v96.04814891h48.02407519q39.61986111 0 67.834005 28.2141439T1021.94095743 224.4635818v672.33704972q0 39.61986111-28.21414389 67.834005T925.89280854 992.84878041H253.55575881z m0-96.04814889h672.33704973v-480.24075044H253.55575881v480.24075044z"  ></path></symbol></svg>'),
  ((n) => {
    var e = (t = (t = document.getElementsByTagName('script'))[t.length - 1]).getAttribute(
        'data-injectcss',
      ),
      t = t.getAttribute('data-disable-injectsvg')
    if (!t) {
      var o,
        i,
        d,
        c,
        s,
        l = function (e, t) {
          t.parentNode.insertBefore(e, t)
        }
      if (e && !n.__iconfont__svg__cssinject__) {
        n.__iconfont__svg__cssinject__ = !0
        try {
          document.write(
            '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
          )
        } catch (e) {
          console && console.log(e)
        }
      }
      ;(o = function () {
        var e,
          t = document.createElement('div')
        ;(t.innerHTML = n._iconfont_svg_string_),
          (t = t.getElementsByTagName('svg')[0]) &&
            (t.setAttribute('aria-hidden', 'true'),
            (t.style.position = 'absolute'),
            (t.style.width = 0),
            (t.style.height = 0),
            (t.style.overflow = 'hidden'),
            (t = t),
            (e = document.body).firstChild ? l(t, e.firstChild) : e.appendChild(t))
      }),
        document.addEventListener
          ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
            ? setTimeout(o, 0)
            : ((i = function () {
                document.removeEventListener('DOMContentLoaded', i, !1), o()
              }),
              document.addEventListener('DOMContentLoaded', i, !1))
          : document.attachEvent &&
            ((d = o),
            (c = n.document),
            (s = !1),
            v(),
            (c.onreadystatechange = function () {
              'complete' == c.readyState && ((c.onreadystatechange = null), a())
            }))
    }
    function a() {
      s || ((s = !0), d())
    }
    function v() {
      try {
        c.documentElement.doScroll('left')
      } catch (e) {
        return void setTimeout(v, 50)
      }
      a()
    }
  })(window)
