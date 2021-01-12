export default {
  provider: { name: 'azure', capabilities: { canSearchGroups: false } },
  __schema: {
    types: [
      { name: 'Ignored', fields: null, inputFields: null },
      { name: 'Date', fields: null, inputFields: null },
      { name: 'Time', fields: null, inputFields: null },
      { name: 'DateTime', fields: null, inputFields: null },
      {
        name: 'User',
        fields: [
          {
            name: 'groups',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'objectId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'ID', kind: 'SCALAR' }
            }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'mailNickname',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'createdDateTime',
            type: { name: 'DateTime', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'accountEnabled',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      { name: 'ID', fields: null, inputFields: null },
      {
        name: 'Group',
        fields: [
          {
            name: 'users',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'PaginatedUsers', kind: 'OBJECT' }
            }
          },
          {
            name: 'objectId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'ID', kind: 'SCALAR' }
            }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'mailNickname',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ],
        inputFields: null
      },
      { name: 'String', fields: null, inputFields: null },
      { name: 'Int', fields: null, inputFields: null },
      {
        name: 'UserInput',
        fields: null,
        inputFields: [
          {
            name: '_',
            type: { name: 'Ignored', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'userPrincipalName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'mailNickname',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'password',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'accountEnabled',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          },
          {
            name: 'forceChangePasswordNextLogin',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
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
            type: { name: 'Ignored', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'mailNickname',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'EditUserInput',
        fields: null,
        inputFields: [
          {
            name: '_',
            type: { name: 'Ignored', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'accountEnabled',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'EditGroupInput',
        fields: null,
        inputFields: [
          {
            name: '_',
            type: { name: 'Ignored', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'displayName',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'mailNickname',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'AddUserToGroupInput',
        fields: null,
        inputFields: [
          {
            name: 'userId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'groupId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'RemoveUserFromGroupInput',
        fields: null,
        inputFields: [
          {
            name: 'userId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'groupId',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'DeleteUserInput',
        fields: null,
        inputFields: [
          {
            name: 'id',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'DeleteGroupInput',
        fields: null,
        inputFields: [
          {
            name: 'id',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          }
        ]
      },
      {
        name: 'PaginatedUsers',
        fields: [
          {
            name: 'data',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'nextPage',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: 'PaginatedGroups',
        fields: [
          {
            name: 'data',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'nextPage',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: 'Capabilities',
        fields: [
          {
            name: 'canSearchGroups',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          }
        ],
        inputFields: null
      },
      { name: 'Boolean', fields: null, inputFields: null },
      {
        name: 'Provider',
        fields: [
          {
            name: 'name',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'capabilities',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Capabilities', kind: 'OBJECT' }
            }
          }
        ],
        inputFields: null
      },
      {
        name: 'Query',
        fields: [
          {
            name: 'users',
            type: { name: 'PaginatedUsers', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'user',
            type: { name: 'User', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'groups',
            type: { name: 'PaginatedGroups', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'group',
            type: { name: 'Group', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'provider',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Provider', kind: 'OBJECT' }
            }
          }
        ],
        inputFields: null
      },
      {
        name: 'Mutation',
        fields: [
          {
            name: 'createUser',
            type: { name: 'User', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'editUser',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'createGroup',
            type: { name: 'Group', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'editGroup',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'addUserToGroup',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'removeUserFromGroup',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'deleteUser',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'deleteGroup',
            type: { name: 'Boolean', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: '__Schema',
        fields: [
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'types',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'queryType',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: '__Type', kind: 'OBJECT' }
            }
          },
          {
            name: 'mutationType',
            type: { name: '__Type', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'subscriptionType',
            type: { name: '__Type', kind: 'OBJECT', ofType: null }
          },
          {
            name: 'directives',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          }
        ],
        inputFields: null
      },
      {
        name: '__Type',
        fields: [
          {
            name: 'kind',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: '__TypeKind', kind: 'ENUM' }
            }
          },
          {
            name: 'name',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'specifiedByUrl',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'fields',
            type: {
              name: null,
              kind: 'LIST',
              ofType: { name: null, kind: 'NON_NULL' }
            }
          },
          {
            name: 'interfaces',
            type: {
              name: null,
              kind: 'LIST',
              ofType: { name: null, kind: 'NON_NULL' }
            }
          },
          {
            name: 'possibleTypes',
            type: {
              name: null,
              kind: 'LIST',
              ofType: { name: null, kind: 'NON_NULL' }
            }
          },
          {
            name: 'enumValues',
            type: {
              name: null,
              kind: 'LIST',
              ofType: { name: null, kind: 'NON_NULL' }
            }
          },
          {
            name: 'inputFields',
            type: {
              name: null,
              kind: 'LIST',
              ofType: { name: null, kind: 'NON_NULL' }
            }
          },
          {
            name: 'ofType',
            type: { name: '__Type', kind: 'OBJECT', ofType: null }
          }
        ],
        inputFields: null
      },
      { name: '__TypeKind', fields: null, inputFields: null },
      {
        name: '__Field',
        fields: [
          {
            name: 'name',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'args',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'type',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: '__Type', kind: 'OBJECT' }
            }
          },
          {
            name: 'isDeprecated',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          },
          {
            name: 'deprecationReason',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: '__InputValue',
        fields: [
          {
            name: 'name',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'type',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: '__Type', kind: 'OBJECT' }
            }
          },
          {
            name: 'defaultValue',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'isDeprecated',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          },
          {
            name: 'deprecationReason',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: '__EnumValue',
        fields: [
          {
            name: 'name',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'isDeprecated',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          },
          {
            name: 'deprecationReason',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          }
        ],
        inputFields: null
      },
      {
        name: '__Directive',
        fields: [
          {
            name: 'name',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'String', kind: 'SCALAR' }
            }
          },
          {
            name: 'description',
            type: { name: 'String', kind: 'SCALAR', ofType: null }
          },
          {
            name: 'isRepeatable',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: 'Boolean', kind: 'SCALAR' }
            }
          },
          {
            name: 'locations',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          },
          {
            name: 'args',
            type: {
              name: null,
              kind: 'NON_NULL',
              ofType: { name: null, kind: 'LIST' }
            }
          }
        ],
        inputFields: null
      },
      { name: '__DirectiveLocation', fields: null, inputFields: null }
    ]
  }
}
