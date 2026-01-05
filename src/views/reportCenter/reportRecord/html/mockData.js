// 模拟数据文件 - 用于HTML模板测试
// 数据结构与 previewReport.vue 保持一致

const mockReportData = {
  // 统计数据（与 Vue 组件中的 statistics 保持一致）
  statistics: {
    name: '域名监测周巡检报告',
    startDate: '2024-01-01',
    endDate: '2024-01-07',
    abnormalNum: 263,
    totalNum: 420,
    normalNum: 157,
    wow: -5.2, // 环比变化百分比
  },

  // 表格数据（各检测类型告警任务占比）- 与 convertTableData 转换后的格式一致
  // proportion 已经是百分比字符串（如 "62.50"）
  tableData: [
    { id: 1, taskLabel: '劫持检测', abnormalNum: 263, proportion: '62.50' },
    { id: 2, taskLabel: 'DNS检测', abnormalNum: 38, proportion: '9.05' },
    { id: 3, taskLabel: '被墙检测', abnormalNum: 0, proportion: '0.00' },
    { id: 4, taskLabel: '污染检测', abnormalNum: 0, proportion: '0.00' },
    { id: 5, taskLabel: 'SSL检测', abnormalNum: 14, proportion: '3.33' },
    { id: 6, taskLabel: '域名过期检测', abnormalNum: 0, proportion: '0.00' },
    { id: 7, taskLabel: 'ICP备案检测', abnormalNum: 116, proportion: '27.62' },
  ],

  // 同比环比数据（与 WowBarChart 组件的数据格式一致）
  wowData: {
    category: [
      '劫持检测',
      'DNS检测',
      '被墙检测',
      '污染检测',
      'SSL检测',
      '域名过期检测',
      'ICP备案检测',
    ],
    path: ['down', 'up', null, null, 'up', null, 'up'], // 趋势方向：'up', 'down', 或 null
    per: [-22.6, 100, 0, 0, 100, 0, 100], // 增长率百分比
    series: [
      {
        name: '上周告警任务数(2023-12-25-2023-12-31)',
        data: [340, 0, 0, 0, 0, 0, 0],
      },
      {
        name: '本周告警任务数(2024-01-01-2024-01-07)',
        data: [263, 38, 0, 0, 14, 0, 116],
      },
    ],
  },

  // 趋势数据（与 convertTrendData 转换后的格式一致）
  trendData: {
    series: [
      {
        name: '劫持检测',
        data: [
          { time: '01-01', value: 45 },
          { time: '01-02', value: 38 },
          { time: '01-03', value: 42 },
          { time: '01-04', value: 35 },
          { time: '01-05', value: 40 },
          { time: '01-06', value: 33 },
          { time: '01-07', value: 30 },
        ],
      },
      {
        name: 'DNS检测',
        data: [
          { time: '01-01', value: 5 },
          { time: '01-02', value: 6 },
          { time: '01-03', value: 4 },
          { time: '01-04', value: 7 },
          { time: '01-05', value: 5 },
          { time: '01-06', value: 6 },
          { time: '01-07', value: 5 },
        ],
      },
      {
        name: 'SSL检测',
        data: [
          { time: '01-01', value: 2 },
          { time: '01-02', value: 1 },
          { time: '01-03', value: 2 },
          { time: '01-04', value: 2 },
          { time: '01-05', value: 3 },
          { time: '01-06', value: 2 },
          { time: '01-07', value: 2 },
        ],
      },
      {
        name: 'ICP备案检测',
        data: [
          { time: '01-01', value: 15 },
          { time: '01-02', value: 18 },
          { time: '01-03', value: 16 },
          { time: '01-04', value: 17 },
          { time: '01-05', value: 16 },
          { time: '01-06', value: 17 },
          { time: '01-07', value: 17 },
        ],
      },
    ],
  },

  // 异常任务详情数据（与 Vue 组件中的 detailData 格式一致）
  detailData: {
    1: {
      taskType: '1',
      taskTypeLabel: '劫持检测',
      details: [
        { taskName: '任务A', domain: 'example1.com', abnormal: 45, percent: 0.85 },
        { taskName: '任务B', domain: 'example2.com', abnormal: 38, percent: 0.72 },
        { taskName: '任务C', domain: 'example3.com', abnormal: 35, percent: 0.68 },
        { taskName: '任务D', domain: 'example4.com', abnormal: 32, percent: 0.65 },
        { taskName: '任务E', domain: 'example5.com', abnormal: 28, percent: 0.58 },
        { taskName: '任务F', domain: 'example6.com', abnormal: 25, percent: 0.52 },
        { taskName: '任务G', domain: 'example7.com', abnormal: 22, percent: 0.48 },
        { taskName: '任务H', domain: 'example8.com', abnormal: 18, percent: 0.42 },
        { taskName: '任务I', domain: 'example9.com', abnormal: 15, percent: 0.38 },
        { taskName: '任务J', domain: 'example10.com', abnormal: 12, percent: 0.32 },
      ],
    },
    2: {
      taskType: '2',
      taskTypeLabel: 'DNS检测',
      details: [
        { taskName: 'DNS任务A', domain: 'dns1.com', abnormal: 8, leftTime: '113.45ms' },
        { taskName: 'DNS任务B', domain: 'dns2.com', abnormal: 7, leftTime: '98.32ms' },
        { taskName: 'DNS任务C', domain: 'dns3.com', abnormal: 6, leftTime: '87.21ms' },
        { taskName: 'DNS任务D', domain: 'dns4.com', abnormal: 5, leftTime: '76.54ms' },
        { taskName: 'DNS任务E', domain: 'dns5.com', abnormal: 4, leftTime: '65.43ms' },
        { taskName: 'DNS任务F', domain: 'dns6.com', abnormal: 3, leftTime: '54.32ms' },
        { taskName: 'DNS任务G', domain: 'dns7.com', abnormal: 2, leftTime: '43.21ms' },
        { taskName: 'DNS任务H', domain: 'dns8.com', abnormal: 2, leftTime: '38.76ms' },
        { taskName: 'DNS任务I', domain: 'dns9.com', abnormal: 1, leftTime: '32.15ms' },
        { taskName: 'DNS任务J', domain: 'dns10.com', abnormal: 1, leftTime: '28.94ms' },
      ],
    },
    5: {
      taskType: '5',
      taskTypeLabel: 'SSL检测',
      details: [
        { taskName: 'SSL任务A', domain: 'ssl1.com', abnormal: 5, percent: 0.35 },
        { taskName: 'SSL任务B', domain: 'ssl2.com', abnormal: 4, percent: 0.28 },
        { taskName: 'SSL任务C', domain: 'ssl3.com', abnormal: 3, percent: 0.21 },
        { taskName: 'SSL任务D', domain: 'ssl4.com', abnormal: 2, percent: 0.14 },
        { taskName: 'SSL任务E', domain: 'ssl5.com', abnormal: 0, percent: 0 },
      ],
    },
    7: {
      taskType: '7',
      taskTypeLabel: 'ICP备案检测',
      details: [
        { taskName: 'ICP任务A', domain: 'icp1.com', abnormal: 42, percent: 0.36 },
        { taskName: 'ICP任务B', domain: 'icp2.com', abnormal: 38, percent: 0.33 },
        { taskName: 'ICP任务C', domain: 'icp3.com', abnormal: 36, percent: 0.31 },
        { taskName: 'ICP任务D', domain: 'icp4.com', abnormal: 0, percent: 0 },
      ],
    },
  },

  // AI智能分析数据（与 Vue 组件中的 aiAnalyzeData 格式一致）
  aiAnalyzeData: {
    conclusion:
      '本周共检测到 **263** 个告警任务，较上周下降 5.2%。其中劫持检测告警任务数最多，占比 62.5%，需要重点关注。\n\nDNS检测、SSL检测和ICP备案检测也有一定数量的告警任务，建议优先处理。',
    suggestion:
      '1. **劫持检测**：建议加强对高频告警任务的监控，特别是任务A、任务B等TOP10任务。\n\n2. **DNS检测**：部分任务响应时间较长，建议优化DNS解析配置。\n\n3. **SSL检测**：建议检查SSL证书有效期，及时更新即将过期的证书。\n\n4. **ICP备案检测**：建议核实备案状态，确保所有域名合规。',
  },
}

// 确保在全局作用域中可访问（用于HTML模板）
if (typeof window !== 'undefined') {
  window.mockReportData = mockReportData
}
