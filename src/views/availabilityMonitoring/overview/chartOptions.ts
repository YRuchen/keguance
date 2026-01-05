import * as echarts from 'echarts'

const gradient = (from: string, to: string) =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: from },
    { offset: 1, color: to },
  ])

// 颜色规则（仅用于非百分比）
export const getColor = (value: number) => {
  if (value < 1500) return '#89e589'
  if (value < 2500) return '#7ccd7c'
  if (value < 3500) return '#ffd966'
  if (value < 4500) return '#ffb347'
  return '#f25151'
}
const ISP_COLOR_MAP = {
  联通: '#ff8c00',
  电信: '#7ddc5c',
  移动: '#46c2ff',
}
export const buildMapOption = (mapData, unit = 'ms', showCity = false) => {
  const isPercent = unit === '%'

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      enterable: true,
      formatter: (params: any) => {
        const name = params.name
        const info = mapData[name]

        // 灰色（无数据）
        if (!info || (info.avg === 0 && (!info.detail || info.detail.length === 0))) {
          return `<div class="tooltip-simple">${name}：无数据</div>`
        }

        const detailRows = info.detail
          .map(
            (d: any) => `
            <div class="tooltip-detail-row">
              <span class="tooltip-isp" style="color:${ISP_COLOR_MAP[d.isp] || '#fff'}">[${
              d.isp
            }]</span>
              ${showCity ? `<span class="tooltip-city">${d.city}：</span>` : ''}
              <span>${d.value}${unit}</span>
            </div>
          `,
          )
          .join('')

        return `
          <div class="tooltip-card">
            <div class="tooltip-card-header">${name}</div>
            <div class="tooltip-card-body">
              <div class="tooltip-avg">
                平均值：${info.avg}${unit}
              </div>
              ${detailRows}
            </div>
          </div>
        `
      },
      position: function (point, params, dom, rect, size) {
        // point: 鼠标位置 [x, y]
        // dom: tooltip dom 节点
        // size: { contentSize, viewSize }
        let x = point[0],
          y = point[1]
        const [tooltipWidth, tooltipHeight] = size.contentSize
        const [viewWidth, viewHeight] = size.viewSize

        // 防止右边超出屏幕
        if (x + tooltipWidth > viewWidth) {
          x = viewWidth - tooltipWidth - 10
        }

        // 防止下边超出屏幕
        if (y + tooltipHeight > viewHeight) {
          y = viewHeight - tooltipHeight - 10
        }

        return [x, y]
      },
    },

    visualMap: {
      show: true,
      left: 10,
      bottom: 20,

      // 百分比图
      pieces: isPercent
        ? [
            { lte: 40, label: '<= 40%', color: '#f25151' },
            { gt: 40, lt: 90, label: '40% - 90%', color: '#ffd966' },
            { gte: 90, label: '>= 90%', color: '#89e589' },
          ]
        : [
            { gt: 4500, label: '> 4500ms', color: '#f25151' },
            { gt: 3500, lte: 4500, label: '3500 - 4500s', color: '#ffb347' },
            { gt: 2500, lte: 3500, label: '2500 - 3500s', color: '#ffd966' },
            { gt: 1500, lte: 2500, label: '1500 - 2500s', color: '#7ccd7c' },
            { lte: 1500, label: '<= 1500s', color: '#89e589' },
          ],
    },

    series: [
      {
        name: 'China',
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1,
        layoutCenter: ['60%', '50%'],
        layoutSize: '100%',

        data: Object.keys(mapData).map((name) => {
          const item = mapData[name]

          const noData = item.avg === 0 && (!item.detail || item.detail.length === 0)

          return {
            name,
            value: noData ? null : item.avg, // 重要：visualMap 不影响灰色
            itemStyle: {
              areaColor: noData
                ? '#e0e0e0' // <<<<<< 灰色省份
                : isPercent
                ? item.avg <= 40
                  ? '#f25151'
                  : item.avg < 90
                  ? '#ffd966'
                  : '#89e589'
                : getColor(item.avg),
            },
          }
        }),

        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: { itemStyle: { areaColor: '#409EFF' } },
      },
    ],
  }
}
export const buildLineOption = (
  list: { time: string; value: number }[],
  color: string,
  label = '',
  unit = '',
) => {
  const isEmpty = !list.length
  return {
    tooltip: isEmpty
      ? { show: false }
      : {
          trigger: 'axis',
          formatter: (params: any) => {
            const item = params[0]
            return `
              <div style="padding:4px 8px;">
                ${item.axisValue}<br/>
                ${item.marker} ${label ? `${label}：` : ''}${item.value}${unit}
              </div>
            `
          },
        },
    grid: {
      top: 20,
      left: '5%', // 给标签留空间
      right: '7%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      show: !isEmpty,
      type: 'category',
      data: isEmpty ? [] : list.map((i) => i.time),
    },
    yAxis: {
      show: !isEmpty,
      type: 'value',
    },
    series: isEmpty
      ? []
      : [
          {
            type: 'line',
            data: list.map((i) => i.value),
            smooth: false,
            showSymbol: false,
            ...(color
              ? {
                  lineStyle: { color },
                  itemStyle: { color },
                }
              : {}),
          },
        ],
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}

/** 响应时间最慢TOP10 */
export const getOverview1Options = (category: string[] = [], name: string, data: number[] = []) => {
  const isEmpty = !data.length
  return {
    title: {
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: isEmpty
      ? { show: false }
      : {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
    grid: {
      top: 20,
      left: '5%', // 给标签留空间
      right: '7%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: isEmpty
      ? { show: false }
      : {
          type: 'value',
          show: false,
        },
    yAxis: isEmpty
      ? { show: false }
      : {
          type: 'category',
          data: category,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { fontSize: 12 },
        },
    series: isEmpty
      ? []
      : [
          {
            name,
            type: 'bar',
            barWidth: '50%',
            data,
            label: {
              show: true,
              position: 'right',
              fontSize: 12,
              fontWeight: 600,
              formatter: (params) => `${params.value} ms`,
            },
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
            },
          },
        ],
    /** 暂无数据 */
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}
/** 运营商响应时间 */
export const getOverview3Options = (xAxis = [], series = []) => {
  const colorMap = {
    最快响应时间: gradient('#47C1C1', '#A8EBEB'),
    平均响应时间: gradient('#007DFF', '#7BB8FF'),
    最慢响应时间: gradient('#F56C6C', '#FFB6B7'),
  }
  const curSeries = series.map((v) => ({
    ...v,
    itemStyle: {
      color: colorMap[v.name],
      borderRadius: [0, 6, 6, 0],
    },
  }))
  const hasData = series.length && series.some((v) => Array.isArray(v.data) && v.data.length)
  const isEmpty = !hasData
  return {
    tooltip: isEmpty
      ? { show: false }
      : {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
    grid: {
      top: 30,
      bottom: 40,
      left: 40,
      right: 40,
    },
    xAxis: isEmpty
      ? { show: false }
      : {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
    yAxis: isEmpty
      ? { show: false }
      : {
          type: 'category',
          data: xAxis,
        },
    series: isEmpty ? [] : curSeries,
    /** 暂无数据 */
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}
/** 地区响应时间 */
export const getOverview4Options = (category: string[] = [], series: any[] = []) => {
  const hasData = series.length && series.some((v) => Array.isArray(v.data) && v.data.length)
  const isEmpty = !hasData
  const colorMap = {
    最快响应时间: gradient('#47C1C1', '#A8EBEB'),
    平均响应时间: gradient('#007DFF', '#7BB8FF'),
    最慢响应时间: gradient('#F56C6C', '#FFB6B7'),
  }
  const curSeries = series.map((v) => ({
    ...v,
    itemStyle: {
      color: colorMap[v.name],
    },
  }))
  return {
    yAxis: isEmpty
      ? { show: false }
      : {
          type: 'value',
          name: '单位/ms',
          nameLocation: 'end',
          nameGap: 10,
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 500,
            padding: [0, 0, 0, -20],
          },
        },
    grid: {
      top: 25,
      bottom: 80,
      left: 60,
      right: 20,
    },
    xAxis: isEmpty
      ? { show: false }
      : {
          type: 'category',
          data: category,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
    series: isEmpty ? [] : curSeries,
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: 50,
        height: 80,
      },
      {
        type: 'inside',
        start: 0,
        end: 50,
      },
    ],
    /** 暂无数据 */
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}
/** 平均响应时间 */
export const getOverview5Options = (data: any[] = []) => {
  const hasData = data.length && data.some((v) => Array.isArray(v.data) && v.data.length)
  const isEmpty = !hasData
  return {
    tooltip: isEmpty
      ? { show: false }
      : {
          trigger: 'axis',
          formatter(params) {
            const times = (data?.[0]?.data || []).map((v) => v.time)
            if (!params || !params.length) return ''
            const time = times?.[params[0].dataIndex]
            const lines = params.map((p) => {
              return `
              ${p.marker}
              ${p.seriesName}：${p.value} ms
            `
            })
            return `
            <div>
              <div style="margin-bottom: 6px; font-weight: 600;">
                ${time}
              </div>
              ${lines.join('<br/>')}
            </div>
          `
          },
        },
    grid: {
      top: 10,
      left: '3%',
      right: '15%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: isEmpty
      ? { show: false }
      : {
          type: 'category',
          boundaryGap: false,
          data: data.map((v) => v.name),
        },
    yAxis: isEmpty
      ? { show: false }
      : {
          type: 'value',
        },
    series: isEmpty
      ? []
      : data.map((v) => ({
          name: v.name,
          type: 'line',
          stack: 'Total',
          data: v.data.map((item) => item.value),
        })),
    /** 暂无数据 */
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}
/** 平均耗时分析图 */
export const getOverview6Options = (category: string[], series: any[]) => {
  const hasData = series.length && series.some((v) => Array.isArray(v.data) && v.data.length)
  const isEmpty = !hasData
  return {
    tooltip: isEmpty
      ? { show: false }
      : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          formatter: function (params) {
            const title = `${params[0].axisValue}<br/>`
            const lines = params
              .map((p) => {
                return `${p.marker} ${p.seriesName}: ${p.value} ms`
              })
              .join('<br/>')
            return title + lines
          },
          position: function (point, params, dom, rect, size) {
            let x = point[0],
              y = point[1]
            const [tooltipWidth, tooltipHeight] = size.contentSize
            const [viewWidth, viewHeight] = size.viewSize
            if (x + tooltipWidth > viewWidth) {
              x = viewWidth - tooltipWidth - 10
            }
            if (y + tooltipHeight > viewHeight) {
              y = viewHeight - tooltipHeight - 10
            }
            return [x, y]
          },
        },
    legend: isEmpty
      ? { show: false }
      : {
          bottom: 0,
          left: 'center',
          icon: 'rect',
        },
    grid: {
      top: 20,
      left: '9%',
      right: '15%',
      bottom: 80,
      containLabel: true,
    },
    xAxis: isEmpty
      ? [{ show: false }]
      : [
          {
            type: 'category',
            boundaryGap: false,
            data: category,
            axisLabel: {
              interval: 0,
            },
          },
        ],
    yAxis: isEmpty ? [{ show: false }] : [{ type: 'value' }],
    series: isEmpty ? [] : series,
    /** 暂无数据 */
    graphic: isEmpty
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '暂无数据',
            fill: '#999',
            fontSize: 14,
          },
        }
      : undefined,
  }
}
