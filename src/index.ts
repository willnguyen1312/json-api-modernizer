import merge from 'lodash.merge';
import { JsonApiResponse } from './types';

function extractRelationships(relationships: any) {
  const ret: any = {};
  Object.keys(relationships).forEach(key => {
    const relationship = relationships[key];
    ret[key] = {};

    const { data, links, meta } = relationship;

    if (data) {
      if (Array.isArray(data)) {
        ret[key].data = data.map(({ id, type }) => ({
          id,
          type,
        }));
      } else if (data) {
        ret[key].data = {
          id: data.id,
          type: data.type,
        };
      } else {
        ret[key].data = data;
      }
    }

    if (links) {
      ret[key].links = links;
    }

    if (meta) {
      ret[key].meta = meta;
    }
  });
  return ret;
}

function extractEntities(json: any) {
  const ret: any = {};
  const jsonArr = Array.isArray(json) ? json : [json];

  jsonArr.forEach(elem => {
    const { type, id, links, relationships, meta, attributes } = elem;

    ret[type] = ret[type] || {};
    ret[type][id] = ret[type][id] || {
      id,
    };
    ret[type][id].type = type;

    ret[type][id].attributes = attributes;

    if (links) {
      ret[type][id].links = {};

      Object.keys(links).forEach(key => {
        ret[type][id].links[key] = links[key];
      });
    }

    if (relationships) {
      ret[type][id].relationships = extractRelationships(relationships);
    }

    if (meta) {
      ret[type][id].meta = meta;
    }
  });

  return ret;
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
