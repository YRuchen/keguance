import { isBoolean, isNumber, isString } from 'lodash';

// import { isDateTime } from '../datetime/moment_wrapper';
import { LoadingState, ENTITY_MAP, FieldType } from './constants'

import type {
  FieldValues,
  FieldValueEntityLookup,
  DataFrameJSON,
  ITraceDetailRes, 
  DataQueryResponse, 
  DataResponse,
  Field,
  DataFrame,
  DataQueryError,
  QueryResultMetaNotice,
  IFormattedResResult,
} from './interfaces'

export const cachedResponseNotice: QueryResultMetaNotice = { severity: 'info', text: 'Cached response' };
function addCacheNotice(frame: DataFrameJSON): DataFrameJSON {
  return {
    ...frame,
    schema: {
      ...frame.schema,
      fields: [...(frame.schema?.fields ?? [])],
      meta: {
        ...frame.schema?.meta,
        notices: [...(frame.schema?.meta?.notices ?? []), cachedResponseNotice],
        isCachedResponse: true,
      },
    },
  };
}
/**
 * @internal use locally
 */
export function decodeFieldValueEntities(lookup: FieldValueEntityLookup, values: FieldValues) {
  let key: keyof typeof lookup;
  for (key in lookup) {
    const repl = ENTITY_MAP[key];
    for (const idx of lookup[key]!) {
      if (idx < values.length) {
        values[idx] = repl;
      }
    }
  }
}
/**
 * @internal use locally
 */
export function decodeFieldValueEnums(lookup: string[], values: FieldValues) {
  for (let i = 0; i < values.length; i++) {
    values[i] = lookup[Number(values[i])];
  }
}
// TODO: 快速引入dayJs
const isDateTime = (v: any) => {
  return false
}
// PapaParse Dynamic Typing regex:
// https://github.com/mholt/PapaParse/blob/master/papaparse.js#L998
const NUMBER = /^\s*(-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?|NAN)\s*$/i;
/**
 * Given a value this will guess the best column type
 *
 * NOTE: this is will try to see if string values can be mapped to other types (like number)
 */
export function guessFieldTypeFromValue(v: unknown): FieldType {
  if (v instanceof Date || isDateTime(v)) {
    return FieldType.time;
  }

  if (isNumber(v)) {
    return FieldType.number;
  }

  if (isString(v)) {
    if (NUMBER.test(v as string)) {
      return FieldType.number;
    }

    if (v === 'true' || v === 'TRUE' || v === 'True' || v === 'false' || v === 'FALSE' || v === 'False') {
      return FieldType.boolean;
    }

    return FieldType.string;
  }

  if (isBoolean(v)) {
    return FieldType.boolean;
  }

  return FieldType.other;
}
/**
 * Given a name and value, this will pick a reasonable field type
 */
export function guessFieldTypeFromNameAndValue(name: string, v: unknown): FieldType {
  if (name) {
    name = name.toLowerCase();
    if (name === 'date' || name === 'time') {
      return FieldType.time;
    }
  }
  return guessFieldTypeFromValue(v);
}
function guessFieldType(name: string, values: FieldValues): FieldType {
  for (const v of values) {
    if (v != null) {
      return guessFieldTypeFromNameAndValue(name, v);
    }
  }
  return FieldType.other;
}
/**
 * NOTE: dto.data.values will be mutated and decoded/inflated using entities,bases,factors,enums
 *
 * @alpha
 */
export function dataFrameFromJSON(dto: DataFrameJSON): DataFrame {
  const { schema, data } = dto;

  if (!schema || !schema.fields) {
    throw new Error('JSON needs a fields definition');
  }

  const length = data ? data.values.reduce((max, vals) => Math.max(max, vals.length), 0) : 0;
  const fields = schema.fields.map((f, index) => {
    let buffer = data ? data.values[index] : [];
    let origLen = buffer.length;
    let type = f.type;

    if (origLen !== length) {
      buffer.length = length;
      buffer.fill(undefined, origLen);
    }

    let entities = data?.entities?.[index];

    if (entities) {
      decodeFieldValueEntities(entities, buffer);
    }

    let enums = data?.enums?.[index];

    if (enums) {
      decodeFieldValueEnums(enums, buffer);
      type = FieldType.string;
    }

    const nanos = data?.nanos?.[index];

    const dataFrameField: Field & { entities: FieldValueEntityLookup } = {
      ...f,
      type: type ?? guessFieldType(f.name, buffer),
      config: f.config ?? {},
      values: buffer,
      entities: entities ?? {},
    };

    if (nanos != null) {
      dataFrameField.nanos = nanos;
    }

    return dataFrameField;
  });

  return {
    ...schema,
    fields,
    length,
  };
}
/** 过滤数据为ui层需要的格式 */
export function toDataQueryResponse(
  res: ITraceDetailRes | undefined,
  queries?: any[]
): IFormattedResResult {
  const rsp: DataQueryResponse = { data: [], state: LoadingState.Done }

  const traceId = 'traceId' in res ? (res.traceId as string) : undefined

  if (traceId != null) {
    rsp.traceIds = [traceId]
  }

  const fetchResponse = res
  const result = []
  if (!fetchResponse?.results) {
    return {
      chart: rsp,
      custom: result,
    }
  }
  const results = fetchResponse.results
  const refIDs = queries?.length ? queries.map((q) => q.refId) : Object.keys(results)
  const cachedResponse = false
  const data: DataResponse[] = []

  for (const refId of refIDs) {
    const dr = results[refId]
    if (!dr) {
      continue
    }
    dr.refId = refId
    data.push(dr)
  }

  for (const dr of data) {
    if (dr.error) {
      const errorObj: DataQueryError = {
        refId: dr.refId,
        message: dr.error,
        status: dr.status,
      }
      if (traceId != null) {
        errorObj.traceId = traceId
      }
      if (!rsp.error) {
        rsp.error = { ...errorObj }
      }
      if (rsp.errors) {
        rsp.errors.push({ ...errorObj })
      } else {
        rsp.errors = [{ ...errorObj }]
      }
      rsp.state = LoadingState.Error
    }

    if (dr.frames?.length) {
      for (let js of dr.frames) {
        if (cachedResponse) {
          js = addCacheNotice(js)
        }
        const df = dataFrameFromJSON(js)
        if (!df.refId) {
          df.refId = dr.refId
        }
        rsp.data.push(df)
      }
      continue
    }
  }

  /** 自己的逻辑 */
  const {
    frames:
      [
        {
          data: {
            values,
          } = {},
          schema: {
            fields,
          } = {},
        } = {}
      ] = []
  } = data?.[0] || {}
  const listLength = values?.[0]?.length
  for(let i = 0; i < listLength; i ++) {
    const row = {}
    fields.forEach((v, index) => {
      Object.assign(row, { [v.name]: values[index][i] })
    })
    result.push(row)
  }

  return {
    chart: rsp,
    custom: result,
  }
}
