import merge from 'lodash.merge';
import { JsonApiResponse, JsonApiData, JsonApiRelationships } from './types';

export function extractRelationships(relationships: JsonApiRelationships) {
  const ret: any = {};

  const relationshipsKeys = Object.keys(relationships);

  for (const key of relationshipsKeys) {
    const relationship = relationships[key];
    ret[key] = {};

    const { data, links, meta } = relationship;

    if (data) {
      if (Array.isArray(data)) {
        ret[key] = data.map(({ id, type }) => ({
          id,
          type,
        }));
      } else if (data) {
        ret[key] = {
          id: data.id,
          type: data.type,
        };
      } else {
        ret[key] = data;
      }
    }

    if (links) {
      ret[key].links = links;
    }

    if (meta) {
      ret[key].meta = meta;
    }
  }

  return ret;
}

export function extractEntities(json: JsonApiData | JsonApiData[]) {
  const ret: any = {};
  const jsonArr = Array.isArray(json) ? json : [json];

  for (const elem of jsonArr) {
    const { type, id, links, relationships, meta, attributes } = elem;

    ret[type] = ret[type] || {};
    ret[type][id] = ret[type][id] || {
      id,
    };
    ret[type][id].type = type;

    ret[type][id].attributes = attributes;

    if (links) {
      ret[type][id].links = {};

      const linksKeys = Object.keys(links);

      for (const key of linksKeys) {
        // @ts-ignore
        ret[type][id].links[key] = links[key];
      }
    }

    if (relationships) {
      ret[type][id] = merge(ret[type][id], extractRelationships(relationships));
    }

    if (meta) {
      ret[type][id].meta = meta;
    }
  }

  return ret;
}

export function groupBy(arr: any[], getter: any): Record<string, any> {
  return arr.reduce((acc, cur) => {
    if (typeof getter === 'string') {
      const item = cur[getter];

      if (acc[item]) {
        acc[item].push(cur);
      } else {
        acc[item] = [cur];
      }
      return acc;
    }

    const item = getter(cur);

    if (acc[item]) {
      acc[item].push(cur);
    } else {
      acc[item] = [cur];
    }
    return acc;
  }, {});
}

export function keyBy(arr: any[], getter: any): Record<string, any> {
  return arr.reduce((acc, cur) => {
    if (typeof getter === 'string') {
      const item = cur[getter];
      acc[item] = cur;
      return acc;
    }

    const item = getter(cur);
    acc[item] = cur;
    return acc;
  }, {});
}

export function modernizer(json: JsonApiResponse) {
  const ret = {};

  if (json.data) {
    merge(ret, extractEntities(json.data));
  }

  if (json.included) {
    merge(ret, extractEntities(json.included));
  }

  return ret;
}
