import {
  modernizer,
  groupBy,
  keyBy,
  extractEntities,
  extractRelationships,
} from '../src';

const json = {
  links: {
    self: 'http://example.com/articles',
    next: 'http://example.com/articles?page[offset]=2',
    last: 'http://example.com/articles?page[offset]=10',
  },
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON:API paints my bikeshed!',
      },
      relationships: {
        author: {
          links: {
            self: 'http://example.com/articles/1/relationships/author',
            related: 'http://example.com/articles/1/author',
          },
          data: {
            type: 'people',
            id: '9',
          },
        },
        comments: {
          links: {
            self: 'http://example.com/articles/1/relationships/comments',
            related: 'http://example.com/articles/1/comments',
          },
          data: [
            {
              type: 'comments',
              id: '5',
            },
            {
              type: 'comments',
              id: '12',
            },
          ],
        },
      },
      links: {
        self: 'http://example.com/articles/1',
      },
    },
  ],
  included: [
    {
      type: 'people',
      id: '9',
      attributes: {
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
      },
      links: {
        self: 'http://example.com/people/9',
      },
    },
    {
      type: 'comments',
      id: '5',
      attributes: {
        body: 'First!',
      },
      relationships: {
        author: {
          data: {
            type: 'people',
            id: '2',
          },
        },
      },
      links: {
        self: 'http://example.com/comments/5',
      },
    },
    {
      type: 'comments',
      id: '12',
      attributes: {
        body: 'I like XML better',
      },
      relationships: {
        author: {
          data: {
            type: 'people',
            id: '9',
          },
        },
      },
      links: {
        self: 'http://example.com/comments/12',
      },
    },
  ],
};

describe('modernizer function', () => {
  it('should wor', () => {
    const actual = modernizer(json);
    //
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "articles": Object {
          "1": Object {
            "attributes": Object {
              "title": "JSON:API paints my bikeshed!",
            },
            "author": Object {
              "id": "9",
              "links": Object {
                "related": "http://example.com/articles/1/author",
                "self": "http://example.com/articles/1/relationships/author",
              },
              "type": "people",
            },
            "comments": Array [
              Object {
                "id": "5",
                "type": "comments",
              },
              Object {
                "id": "12",
                "type": "comments",
              },
            ],
            "id": "1",
            "links": Object {
              "self": "http://example.com/articles/1",
            },
            "type": "articles",
          },
        },
        "comments": Object {
          "12": Object {
            "attributes": Object {
              "body": "I like XML better",
            },
            "author": Object {
              "id": "9",
              "type": "people",
            },
            "id": "12",
            "links": Object {
              "self": "http://example.com/comments/12",
            },
            "type": "comments",
          },
          "5": Object {
            "attributes": Object {
              "body": "First!",
            },
            "author": Object {
              "id": "2",
              "type": "people",
            },
            "id": "5",
            "links": Object {
              "self": "http://example.com/comments/5",
            },
            "type": "comments",
          },
        },
        "people": Object {
          "9": Object {
            "attributes": Object {
              "firstName": "Dan",
              "lastName": "Gebhardt",
              "twitter": "dgeb",
            },
            "id": "9",
            "links": Object {
              "self": "http://example.com/people/9",
            },
            "type": "people",
          },
        },
      }
    `);
  });
});

it.only('should also work', () => {
  const groupByResult = groupBy(json.included, 'type');

  const actual = Object.keys(groupByResult).reduce((acc: any, cur) => {
    acc[cur] = keyBy(groupByResult[cur], 'id');

    return acc;
  }, {});

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "comments": Object {
        "12": Object {
          "attributes": Object {
            "body": "I like XML better",
          },
          "id": "12",
          "links": Object {
            "self": "http://example.com/comments/12",
          },
          "relationships": Object {
            "author": Object {
              "data": Object {
                "id": "9",
                "type": "people",
              },
            },
          },
          "type": "comments",
        },
        "5": Object {
          "attributes": Object {
            "body": "First!",
          },
          "id": "5",
          "links": Object {
            "self": "http://example.com/comments/5",
          },
          "relationships": Object {
            "author": Object {
              "data": Object {
                "id": "2",
                "type": "people",
              },
            },
          },
          "type": "comments",
        },
      },
      "people": Object {
        "9": Object {
          "attributes": Object {
            "firstName": "Dan",
            "lastName": "Gebhardt",
            "twitter": "dgeb",
          },
          "id": "9",
          "links": Object {
            "self": "http://example.com/people/9",
          },
          "type": "people",
        },
      },
    }
  `);
});
