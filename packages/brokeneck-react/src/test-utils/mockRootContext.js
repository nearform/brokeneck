export default {
  provider: {
    name: 'cognito',
    capabilities: {
      canSearchGroups: false
    }
  },
  __schema: {
    types: [
      {
        name: 'User',
        fields: [
          {
            name: 'groups',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: null,
                kind: 'LIST'
              }
            }
          },
          {
            name: 'Username',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'ID',
                kind: 'SCALAR'
              }
            }
          },
          {
            name: 'Enabled',
            type: {
              name: 'Boolean',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'UserStatus',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'UserCreateDate',
            type: {
              name: 'DateTime',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'UserLastModifiedDate',
            type: {
              name: 'DateTime',
              kind: 'SCALAR',
              ofType: null
            }
          }
        ],
        inputFields: null
      },
      {
        name: 'Group',
        fields: [
          {
            name: 'users',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'PaginatedUsers',
                kind: 'OBJECT'
              }
            }
          },
          {
            name: 'GroupName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'ID',
                kind: 'SCALAR'
              }
            }
          },
          {
            name: 'Description',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'CreationDate',
            type: {
              name: 'DateTime',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'LastModifiedDate',
            type: {
              name: 'DateTime',
              kind: 'SCALAR',
              ofType: null
            }
          }
        ],
        inputFields: null
      },
      {
        name: 'UserInput',
        fields: null,
        inputFields: [
          {
            name: '_',
            type: {
              name: 'Ignored',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'Username',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'String',
                kind: 'SCALAR'
              }
            }
          }
        ]
      },
      {
        name: 'GroupInput',
        fields: null,
        inputFields: [
          {
            name: '_',
            type: {
              name: 'Ignored',
              kind: 'SCALAR',
              ofType: null
            }
          },
          {
            name: 'GroupName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: {
                name: 'String',
                kind: 'SCALAR'
              }
            }
          },
          {
            name: 'Description',
            type: {
              name: 'String',
              kind: 'SCALAR',
              ofType: null
            }
          }
        ]
      }
    ]
  }
}
