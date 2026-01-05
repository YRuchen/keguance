import pako from "pako"

/** 服务类型类型 */
export enum TextType {
  DOCKER_TEXT = ' Agent 是一个轻量级采集程序，以容器的方式运行在宿主机上，部署成功后，你将在平台上看到所有容器的实时日志与历史日志，按标签、容器名、镜像名、宿主机等维度的日志检索。平台支持为特定日志内容配置告警规则。',
  LINUX_TEXT = `Agent 是一个轻量级的后台进程，安装在您的 Linux
                服务器上，用于实时采集日志数据并发送到平台进行存储、分析和可视化。建议以 root 或具备
                sudo 权限的用户进行安装（需要访问系统日志文件、修改网络配置等）。Agent
                会运行在后台，需保证 systemd / init.d 可用。一台服务器只部署一个 Agent
                实例，避免重复采集和端口冲突。`,
  KUBERNETES_TEXT = `
                Agent 是一个轻量级的数据采集程序，它运行在您的 Kubernetes 集群的每个节点上，实时收集日志数据。每个节点（node）上只运行一个Agent，避免出现意料之外的问题。
                部署流程：
                在平台生成 Agent 配置文件（含采集规则、鉴权信息）
                使用官方提供的 YAML 清单，通过 kubectl apply -f agent.yaml 部署
                等待 Agent 在所有节点运行成功
                在确认 Agent 安装状态中查看运行状态`,
}

// JFrog credentials should be set via environment variable
const JFROG_CREDENTIALS = process.env.JFROG_CREDENTIALS || "YOUR_CREDENTIALS_HERE"
export const METRICCONFIG = `export WRITER_HOST="https://metrics.observe.gainetics.io" &&
export HEART_BEAT_HOST="https://alert-manager-admin.observe.gainetics.io" &&
curl -u observe-public:${JFROG_CREDENTIALS}
-LO 'https://artifactory.gainetics.io/artifactory/observe-generic/install_agent_linux.sh'  &&
chmod +x ./install_agent_linux.sh  && ./install_agent_linux.sh`


const CONFIG_BASE64 = (apiKey: string, indexName: string) => {
  const configObj = {
    tenant: JSON.parse(localStorage.getItem('userInfo') || '{}')?.userInfo?.tenantId,
    user: JSON.parse(localStorage.getItem('userInfo') || '{}')?.userInfo?.userId,
    api_key: apiKey,
    log_path: "/var/log/myapp/*.log",
    index_name: indexName,
    source: "GA",
    service: "GA",
    time_field: "@timestamp",
    time_format: "2006-01-02T15:04:05.000Z",
    timestamp_type: "string"
  };

  const jsonStr = JSON.stringify(configObj);
  const compressed = pako.gzip(jsonStr);

  // 转 base64
  const base64 = btoa(
    String.fromCharCode.apply(null, compressed as unknown as number[])
  );

  return base64;
};
export const createLogsConfig = (scriptName: string, apiKey: string, indexName: string) =>
  `export CONFIG_BASE64="${CONFIG_BASE64(apiKey, indexName)}" &&
curl -fsSL -u ${JFROG_CREDENTIALS} \
  "https://artifactory.gainetics.io/artifactory/observe-generic/${scriptName}" &&
chmod +x ${scriptName} && ./${scriptName}`
