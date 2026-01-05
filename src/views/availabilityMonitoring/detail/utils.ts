import { ElMessage } from 'element-plus'
import { arrayItemsToObject, objectToArrayItems } from '~/utils/common'
import { Protocol, protocolKeyMap, MonitoringFrequencyType, ReqContentType, ReqContentMode, OAuth2Mode } from './constants'

import type { Field } from '@formily/core'
import type { ICreateParams } from '~/api/availabilityMonitoring/interfaces'
import type {
  ICommonArrayItem,
  IFormData,
  IRequest,
  IHttp,
  ITcp,
  IUdp,
  IGrpc,
  ISsl,
  IDns,
  IWebsocket,
  IAuth,
  IBasic,
  IAws,
  IOauth2,
  IFormDataContent,
  IResponse,
  IResHttp,
  IResAuth,
  IResBasic,
  IResAws,
  IResOauth2,
  IResTcp,
  IResUdp,
  IResGrpc,
  IResSsl,
  IResDns,
  IResBodyContentForm,
  IResWebsocket,
} from './interfaces'

/** 根据【请求类型】控制【定义请求格式】的类型（不同类型隐藏） */
export const changeVisible = (field: Field, protocolValue: Protocol) => {
  const protocol = field.form.query('collapse.step1.protocol')?.get('value')
  field.visible = protocol === protocolValue
}

/** ArrayItemsRemove通用显隐控制方法 */
export const commonRemoveVisible = (field: Field) => {
  const target = (field?.parent?.parent?.parent as Field)?.value
  field.visible = !(target?.length <= 1)
}

/** 将ArrayItems的BodyContent转为Object格式，因为有多个参数，所以没有用通用方法 */
const formatBodyContentToReq = (target: Record<string, any>[]) => Object.fromEntries(
  target.map(v => ([
    v.key, 
    {
      type: v.type,
      ...(v.type === ReqContentMode.FILE ? { file: v.file?.[0] } : {}),
      ...(v.type === ReqContentMode.TEXT ? { value: v.value } : {}),
    },
  ]))
)

/** 将Object的BodyContent转为ArrayItems格式，因为有多个参数，所以没有用通用方法 */
const formatBodyContentToRes = (target: IResBodyContentForm) => {
  return Object.entries(target).map(([k, v]) => ({
    key: k,
    ...v,
    ...(v.type === ReqContentMode.FILE ? { file: [v.file] } : {}),
  }))
}

/** 将request转为入参格式 */
const requestUtils = {
  [Protocol.HTTP](http: Partial<IHttp> = {}, formData: IFormData) {
    const isFormData = http?.content?.type === ReqContentType.MULTIPART_FORM_DATA
    const isEmptyRequestHeaders = http?.requestHeaders?.length === 1 && (!http?.requestHeaders?.[0]?.key) && (!http?.requestHeaders?.[0]?.value)
    let requestHeaders = isEmptyRequestHeaders ? null : arrayItemsToObject(http?.requestHeaders)
    return {
      http: {
        /** 执行请求的 URL */
        url: http?.url || null,
        /** 要使用的 HTTP 方法/动词 */
        method: http?.method || null,
        /** 证书 */
        cert: http?.cert?.[0],
        /** 私钥 */
        privateKey: http?.privateKey?.[0],
        /** 请求体的类型 TODO: 问后端能否把枚举改回去，还是大写符合规范 */
        bodyType: http?.content?.type || null,
        bodyContent: {
          /** 请求中要包含的请求体 */
          body: isFormData ? '' : http?.content?.content,
          /** 在测试中作为请求一部分使用的表单数据。仅在 bodyType 是 multipart/form-data 时有效 */
          form: isFormData
            ? formatBodyContentToReq(http?.content?.formData as unknown as IFormDataContent[])
            : null, // TODO: formdata类型时要特别注意这里
        },
        /** 请求中使用的查询参数。 */
        query: arrayItemsToObject(http?.params) || null,
        /** 执行请求时要包含的请求头 */
        requestHeaders: requestHeaders,
        /** 执行任务时要使用的客户证书（暂不支持） */
        certificate: null,
        /** 执行任务时处理身份验证的对象 */
        auth: {
          /** 使用的身份验证类型 */
          type: http?.auth?.type || null,
          /** 处理基本身份验证的对象（HTTP Basic Auth，对应type为WEB） */
          web: {
            /** 基本身份验证使用的用户名 */
            username: http?.auth?.basic?.userName || null,
            /** 基本身份验证使用的密码 */
            password: http?.auth?.basic?.pwd || null,
          },
          /** 处理 SIGV4 身份验证的对象（AWS Signature，对应type为SIGV4） */
          sigv4: {
            /** 访问密钥 ID */
            accessKey: http?.auth?.aws?.keyId || null,
            /** 访问密钥 Secret */
            secretKey: http?.auth?.aws?.secret || null,
            /** 目标 AWS 区域 */
            region: http?.auth?.aws?.region || null,
            /** AWS 服务名称 */
            serviceName: http?.auth?.aws?.service || null,
            /** 会话令牌 */
            sessionToken: http?.auth?.aws?.token || null,
          },
          oauth: {
            /** 获取访问令牌的 URL */
            accessTokenUrl: http?.auth?.oauth2?.tokenUrl || null,
            /** 用户名 */
            username: (http?.auth?.oauth2?.mode === OAuth2Mode.PWD ? http?.auth?.oauth2?.userName : null) || null,
            /** 密码 */
            password: (http?.auth?.oauth2?.mode === OAuth2Mode.PWD ? http?.auth?.oauth2?.pwd : null) || null,
            /** 客户端 ID（可选） */
            clientId: (http?.auth?.oauth2?.mode === OAuth2Mode.PWD ? http?.auth?.oauth2?.optionalClientId : http?.auth?.oauth2?.clientId) || null,
            /** 客户端密钥（可选） */
            clientSecret: (http?.auth?.oauth2?.mode === OAuth2Mode.PWD ? http?.auth?.oauth2?.optionalClientSecret : http?.auth?.oauth2?.clientSecret) || null,
            /** 使用的身份验证受众 */
            audience: http?.auth?.oauth2?.audience || null,
            /** 使用的身份验证资源 */
            resource: http?.auth?.oauth2?.resource || null,
            /** 使用的身份验证作用域 */
            scope: http?.auth?.oauth2?.scope || null,
            /** 用于身份验证的令牌类型 */
            tokenApiAuthentication: http?.auth?.oauth2?.authMethod || null,
            /** 授权类型 TODO：等后端加字段 */
            type: http?.auth?.oauth2?.mode || null,
          }
        },
        /** 在测试中作为请求一部分使用的文件, 仅在 bodyType 是 multipart/form-data 时有效（暂不支持） */
        files: null,
        /** 使用的 HTTP 版本 */
        httpVersion: http?.httpVersion || null,
        /** 是否生效重定向 */
        followRedirects: http?.followRedirects || null,
        /** 重定向时传递 cookies */
        persistCookies: http?.keepCookie || null,
        /** 重定向时传递鉴权头 */
        persistAuthorizationHeaders: http?.keepAuth || null,
        /** 不保存响应体 */
        noSavingResponseBody: http?.privacy || null,
        /** 检查证书撤销 */
        insecureSkipVerify: http?.ignoreSSL || null,
        /** Cookies */
        cookies: http?.cookie || null,
        /** 表示请求中使用的代理 */
        proxy: {
          /** 代理 URL */
          url: http?.proxy?.url || null,
          /** 执行请求时要包含的请求头 */
          headers: arrayItemsToObject(http?.proxy?.header) || null,
        },
        /** 超时时间 */
        timeout: Number(http?.timeout) || 0,
      }
    }
  },
  [Protocol.TCP](tcp: Partial<ITcp> = {}, formData: IFormData) {
    return {
      tcp: {
        /** 执行请求的主机名 */
        host: tcp?.host || null,
        /** 执行请求时要使用的端口 */
        port: tcp?.port || null,
        /** 是否开启探针以发现到目标主机路径上的所有网关 */
        shouldTrackHops: tcp?.track || null,
        /** 超时时间 */
        timeout: Number(tcp?.timeout) || 0,
      }
    }
  },
  [Protocol.UDP](udp: Partial<IUdp> = {}, formData: IFormData) {
    return {
      udp: {
        /** 执行请求的主机名 */
        host: udp?.host || null,
        /** 执行请求时要使用的端口 */
        port: udp?.port || null,
        /** 发送给 UDP 的消息 */
        message: udp?.msg || null,
        /** 超时时间 */
        timeout: Number(udp?.timeout) || 0,
      }
    }
  },
  [Protocol.GRPC](grpc: Partial<IGrpc> = {}, formData: IFormData) {
    return {
      grpc: {
        ...grpc,
        /** 证书（文件url） */
        cert: grpc.cert?.[0],
        /** 私钥（文件url） */
        privateKey: grpc.privateKey?.[0],
        protoFile: grpc.protoFile?.[0],
        metadata: arrayItemsToObject(grpc.metadata),
        checkType: formData.basicActiveKey,
      }
    }
  },
  [Protocol.SSL](ssl: Partial<ISsl> = {}, formData: IFormData) {
    return {
      ssl: {
        ...ssl,
        /** 证书（文件url） */
        cert: ssl.cert?.[0],
        /** 私钥（文件url） */
        privateKey: ssl.privateKey?.[0],
      }
    }
  },
  [Protocol.DNS](dns: Partial<IDns> = {}, formData: IFormData) {
    return {
      dns,
    }
  },
  [Protocol.WEBSOCKET](websocket: Partial<IWebsocket> = {}, formData: IFormData) {
    return {
      websocket: {
        ...websocket,
        requestHeaders: arrayItemsToObject(websocket.requestHeaders),
      },
    }
  },
}

/** 将请求定义转为入参格式 */
const formatRequest = (formData: IFormData) => {
  return formData?.protocol 
    ? requestUtils[formData?.protocol]?.(formData?.request?.[protocolKeyMap[formData?.protocol]], formData)
    : {}
}

/** 将断言转为入参格式 */
const formatAssertions = (formData: IFormData) => {
  return formData.assertion.map(v => ({
    type: v.factor || null,
    property: v.key || null,
    operator: v.operator || null,
    value: v.value || null,
    jsonpath: {
      elementsOperator: v.jsonpathFactor,
      path: v.jsonpathValue,
      operator: v.jsonpathOperator,
    },
  }))
}

const formatMonitoringFrequency = (formData: IFormData) => {
  return {
    /** 类型 */
    type: formData?.monitoringFrequency?.type,
    /** 运行频率单位 */
    unit: formData?.monitoringFrequency?.unit,
    /** 运行频率（单位由 unit 字段决定） */
    tickEvery: formData?.monitoringFrequency?.type === MonitoringFrequencyType.DEFAULT
      ? formData?.monitoringFrequency?.default
      : formData?.monitoringFrequency?.value,
    /** 是否指定时间范围。 */
    useTimeframe: formData?.monitoringFrequency?.useTimeRange,
    /** 指定的时间范围 */
    timeframe: {
      days: formData?.monitoringFrequency?.weeks || null,
      from: formData?.monitoringFrequency?.start || null,
      to: formData?.monitoringFrequency?.end || null,
    },
  }
}

/** 将本地数据转为请求入参需要的格式 */
export const generateSendData = (formData: IFormData): ICreateParams => {
  try {
    return {
      test: {
        name: formData?.name || null,
        subType: formData?.protocol || null,
        param: formatRequest(formData) || null,
        assertions: formatAssertions(formData) || null,
        assertionCondition: formData?.relation || null,
        locations: formData?.locations || null,
        /** 任务监测节点 */
        scheduling: formatMonitoringFrequency(formData) || null,
        /** 监视器信息  告警配置 */
        monitor: {
          /** 告警方式 */
          noticeChannel: formData?.warningConfig?.noticeChannel,
          /** 渠道id */
          chatId: formData?.warningConfig?.chatId,
          /** token */
          token: formData?.warningConfig?.token,
          /** 通知消息内容 */
          message: formData?.warningConfig?.content || null,
          /** 数字 1 (最高) 到 5 (最低) 表示告警优先级 */
          priority: formData?.warningConfig?.priority || null,
        },
      },
    }
  } catch (error: any) {
    ElMessage({
      message: `数据格式转换失败，失败原因：${error}`,
      type: 'error',
    })
    console.error(`数据格式转换失败，失败原因：${error}`)
  }
}

/** -- 将远程数据转为本地表单需要的格式 -- */
const formatBasic2 = (basic: IResBasic): IBasic => {
  return {
    /** userName */
    userName: basic?.username,
    /** pwd */
    pwd: basic?.password,
  }
}

const formatAws2 = (aws: IResAws): IAws => {
  return {
    /** AWS 的访问密钥 ID（AccessKeyId） */
    keyId: aws?.accessKey,
    /** AWS 的访问密钥 Secret（Secret Access Key） */
    secret: aws?.secretKey,
    /** 目标 AWS 区域 */
    region: aws?.region,
    /** AWS 服务名称 */
    service: aws?.serviceName,
    /** Session Token */
    token: aws?.sessionToken,
  }
}

const formatOauth2 = (auth: IResOauth2): IOauth2 => {
  return {
    /** 授权类型 */
    mode: auth?.type,
    /** token 的URL（Access Token URL） */
    tokenUrl: auth?.accessTokenUrl,
    /** 用户名（Username） */
    userName: auth?.username,
    /** 密码（Password） */
    pwd: auth?.password,
    /** 客户端ID（Client ID） */
    clientId: auth?.clientId,
    /** 客户端密匙（Client Secret） */
    clientSecret: auth?.clientSecret,
    /** 认证方式（Token API Authentication） */
    authMethod: auth?.tokenApiAuthentication,
    /** 【可选】客户端ID（Client ID） */
    optionalClientId: auth?.clientId,
    /** 【可选】客户端密匙（Client Secret） */
    optionalClientSecret: auth?.clientSecret,
    /** JWT令牌受众校验（Audience） */
    audience: auth?.audience,
    /** OAuth资源指示符 */
    resource: auth?.resource,
    /** 权限范围控制（Scope） */
    scope: auth?.scope,
  }
}

const formatAuth2 = (auth: IResAuth): IAuth => {
  return {
    /** 私钥（MVP不需要） */  
    privateKey: null,
    /** 证书（MVP不需要） */  
    cert: null,
    /** 身份认证类型 */  
    type: auth?.type,
    /** HTTP基本身份验证 */
    basic: formatBasic2(auth?.web),
    /** AWS 签名 */
    aws: formatAws2(auth?.sigv4),
    /** oauth2 */
    oauth2: formatOauth2(auth?.oauth),
  }
}

const formatHttp2 = (http: IResHttp): IHttp => {
  try {
    return {
      /** 请求头 */  
      requestHeaders: objectToArrayItems(http?.requestHeaders) as ICommonArrayItem[],
      /** 身份认证 */
      auth: formatAuth2(http?.auth),
      /** 证书 */
      cert: [http?.cert],
      /** 私钥 */
      privateKey: [http?.privateKey],
      /** 查询参数 */
      params: objectToArrayItems(http?.query) as ICommonArrayItem[],
      /** 请求体内容 */
      content: {
        type: http?.bodyType,
        content: http?.bodyContent?.body,
        formData: formatBodyContentToRes(http?.bodyContent?.form),
      },
      /** 代理 */
      proxy: {
        /** 代理请求头 */  
        header: objectToArrayItems(http?.proxy?.headers) as ICommonArrayItem[],
        /** 代理服务器URL */
        url: http?.proxy?.url,
      },
      /** 请求类型 */
      method: http?.method,
      /** 请求地址 */
      url: http?.url,
      /** HTTP版本 */
      httpVersion: http?.httpVersion,
      /** 跟随重定向 */
      followRedirects: http?.followRedirects,
      /** 跨域重定向保留cookie */
      keepCookie: http?.persistCookies,
      /** 跨域重定向时保留认证头信息 */
      keepAuth: http?.persistAuthorizationHeaders,
      /** 忽略HTTP证书错误 */
      ignoreSSL: http?.insecureSkipVerify,
      /** 请求超时时间 */
      timeout: http?.timeout,
      /** cookie */
      cookie: http?.cookies,
      /** 不保存响应内容 */
      privacy: http?.noSavingResponseBody,
    } as IHttp
  } catch (error: any) {
    console.error(`转换远程http到本地格式失败，失败原因：${error}`)
  }
}

/** 将详情出参转为本地格式 */
const requestUtils2 = {
  [Protocol.HTTP](http: IResHttp): IRequest {
    return {
      http: formatHttp2(http)
    }
  },
  [Protocol.TCP](tcp: Partial<IResTcp> = {}): IRequest {
    return {
      tcp: {
        /** 主机ip地址 */
        host: tcp?.host,
        /** 端口 */
        port: tcp?.port,
        /** 超时时间 */
        timeout: tcp?.timeout,
        /** 路由跟踪 */
        track: tcp?.shouldTrackHops,
      }
    }
  },
  [Protocol.UDP](udp: Partial<IResUdp> = {}): IRequest {
    return {
      udp: {
        /** 主机ip地址 */
        host: udp?.host,
        /** 端口 */
        port: udp?.port,
        /** 要发送的UDP数据内容 */
        msg: udp?.message,
        /** 超时时间 */
        timeout: udp?.timeout,
      }
    }
  },
  [Protocol.GRPC](grpc: Partial<IResGrpc> = {}): IRequest {
    return {
      grpc: {
        /** 主机ip地址 */
        host: grpc.host,
        /** 端口 */
        port: grpc.port,
        /** 超时时间 */
        timeout: grpc.timeout,
        /** 忽略服务器证书错误 */
        insecureSkipVerify: grpc.insecureSkipVerify,
        /** 证书（文件url） */
        cert: [grpc.cert],
        /** 私钥（文件url） */
        privateKey: [grpc.privateKey],
        /** 检查类型  */
        checkType: grpc.checkType,
        /** grpc请求元数据 */
        metadata: objectToArrayItems(grpc.metadata),
        /** 服务定义类型 */
        serviceDefinitionType: grpc.serviceDefinitionType,
        /** 原型文件 */
        protoFile: [grpc.protoFile],
        /** grpc服务器名 */
        serviceName: grpc.serviceName,
        /** 调用方法 */
        method: grpc.method,
        /** 请求消息体 */
        message: grpc.message,
      },
    }
  },
  [Protocol.SSL](ssl: IResSsl): IRequest {
    return {
      ssl: {
        ...ssl,
        /** 证书（文件url） */
        cert: [ssl.cert],
        /** 私钥（文件url） */
        privateKey: [ssl.privateKey],
      },
    }
  },
  [Protocol.DNS](dns: IResDns): IRequest {
    return {
      dns,
    }
  },
  [Protocol.WEBSOCKET](websocket: IResWebsocket): IRequest {
    return {
      websocket: {
        ...websocket,
        requestHeaders: objectToArrayItems(websocket.requestHeaders),
      },
    }
  },
}

const formatRequest2 = (response: IResponse): IRequest => {
  return response?.subType 
    ? requestUtils2[response?.subType](response?.param?.[protocolKeyMap[response?.subType]])
    : {}
}

/** 将远程数据转为本地表单需要的格式 */
export const generateFormData = (response: IResponse): IFormData => {
  try {
    return {
      /** 任务名称 */
      name: response?.name,
      basicActiveKey: response.param?.grpc?.checkType,
      /** 请求协议 */
      protocol: response?.subType,
      /** 请求定义 */
      request: formatRequest2(response),
      /** 断言间关系 */
      relation: response?.assertionCondition,
      /** 断言 */
      assertion: (response?.assertions || []).map(v => ({
        factor: v.type || null,
        key: v.property || null,
        operator: v.operator || null,
        value: v.value || null,
        jsonpathFactor: v.jsonpath?.elementsOperator,
        jsonpathOperator: v.jsonpath?.operator,
        jsonpathValue: v.jsonpath?.path,
      })),
      /** 位置 */
      locations: response?.locations,
      /** 任务监测频率 */
      monitoringFrequency: {
        /** 任务监测频率类型 */
        type: response?.scheduling?.type,
        /** 默认 TODO: 这里的default key是否合适 */
        default: response?.scheduling?.tickEvery,
        /** 间隔 */
        value: response?.scheduling?.tickEvery,
        /** 任务监测频率单位 */
        unit: response?.scheduling?.unit, // TODO 后端没存
        /** 指定时间和日期 */
        useTimeRange: response?.scheduling?.useTimeframe, // TODO 后端没存
        /** weeks */
        weeks: response?.scheduling?.timeframe?.days, // TODO 后端没存
        /** 开始时间 */
        start: response?.scheduling?.timeframe?.from,
        /** 结束时间 */
        end: response?.scheduling?.timeframe?.to,
      },
      /** 告警配置 */
      warningConfig: {
        /** 告警方式（MVP写死选中，仅展示，后端不存） */
        noticeChannel: response?.monitor?.noticeChannel,
        /** 渠道id */
        chatId: response?.monitor?.chatId,
        /** token */
        token: response?.monitor?.token,
        /** 告警优先级 */
        priority: response?.monitor?.priority,
        /** 通知内容 */
        content: response?.monitor?.message,
      }
    }
  } catch (error: any) {
    console.error(`将远程数据转为本地表单需要的格式失败，失败原因：${error}`)
  }
}
/** -- 将远程数据转为本地表单需要的格式 -- */
