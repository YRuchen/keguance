export const getChat0Options = (xAxisData = [], seriesData = []) => {
  const hasData = Array.isArray(seriesData) && seriesData.length > 0
  const isEmpty = !hasData
  return {
    backgroundColor: '#fff',
    tooltip: {
      show: !isEmpty,
      trigger: 'item',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#999',
          width: 1,
          type: 'dashed',
        },
      },
      formatter: (params) => {
        return `
              <div style="font-size:12px; margin-bottom:6px;">
                ${xAxisData[params.dataIndex]}
              </div>
              <div style="display:flex; align-items:center; font-size:12px;">
                <span style="
                  width:8px;
                  height:8px;
                  border-radius:50%;
                  background:${params.color};
                  margin-right:6px;
                  display:inline-block;
                "></span>
                数量：${params.data}
              </div>
            `
      },
    },
    grid: {
      left: 50,
      right: 20,
      top: 30,
      bottom: 40
    },
    // dataZoom: [
    //   {
    //     type: 'slider',
    //     start: 0,
    //     end: 50,
    //     height: 40,
    //   },
    //   {
    //     type: 'inside',
    //     start: 0,
    //     end: 50
    //   }
    // ],
    xAxis: {
      show: !isEmpty,
      type: 'category',
      data: xAxisData,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: '#ddd' }
      },
      axisLabel: {
        // interval: 0,
        color: '#999',
        fontSize: 11,
        formatter: (value) => {
          const d = new Date(value)
          const hh = d.getHours().toString().padStart(2, '0')
          const mm = d.getMinutes().toString().padStart(2, '0')
          return `${hh}:${mm}`
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f2f2f2'
        },
      },
    },
    yAxis: {
      show: !isEmpty,
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 11
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e6e6e6',
          type: 'dashed',
        },
      },
    },
    series: isEmpty
      ? []
      : [
          {
            type: 'line',
            data: seriesData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#4CAF50',
              borderColor: '#fff',
              borderWidth: 2,
            },
            lineStyle: {
              width: 1.5,
              color: '#4CAF50',
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                color: '#4CAF50',
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
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

export const getChat1Options = (data = []) => {
  const isEmpty = !data.length
  return {
    tooltip: isEmpty ? { show: false } : { trigger: 'item' },
    legend: isEmpty
      ? { show: false }
      : {
          orient: 'vertical',
          right: '5%',
          top: 'center',
        },
    series: isEmpty
      ? []
      : [
          {
            type: 'pie',
            radius: ['20%', '40%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}\n{d}%',
              fontSize: 14,
              fontWeight: 'bold',
              align: 'center',
            },
            data: data.map(({ name, value }) => ({ name, value })),
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

export const getChat2Options = (xAxis = [], series = []) => {
  const hasData =
    series.length &&
    series.some(s => Array.isArray(s.data) && s.data.length)
  const isEmpty = !hasData
  return {
    tooltip: isEmpty ? { show: false } : { trigger: 'item' },
    legend: isEmpty ? { show: false } : {
      bottom: 0,
      left: 'center',
    },
    grid: {
      top: 30,
      bottom: 50,
      left: 60,
      right: 20,
    },
    xAxis: {
      show: !isEmpty,
      type: 'category',
      data: xAxis,
      axisLabel: {
        interval: 0   // ⬅️ 强制所有类目都显示
      }
    },
    yAxis: {
      show: !isEmpty,
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    series: isEmpty ? [] : series,
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