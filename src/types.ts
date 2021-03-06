type AnyKeyValueObject = {
  [key: string]: any;
};

export type JsonApiResponse = {
  links?: JsonApiLinks;
  data?: JsonApiData | JsonApiData[];
  included?: JsonApiData[];
};

export type JsonApiData = {
  type: string;
  id: string | number;
  attributes?: AnyKeyValueObject;
  meta?: AnyKeyValueObject;
  links?: JsonApiLinks;
  relationships?: JsonApiRelationships;
};

type JsonApiRelationshipData = {
  type: string;
  id: string | number;
  meta?: AnyKeyValueObject;
};

type JsonApiRelation = {
  data: JsonApiRelationshipData | JsonApiRelationshipData[];
  links?: JsonApiLinks;
  meta?: AnyKeyValueObject;
};

type JsonApiLinks = {
  self?: string;
  next?: string;
  last?: string;
  related?: string;
};

export type JsonApiRelationships = {
  [relationName: string]: JsonApiRelation;
};
