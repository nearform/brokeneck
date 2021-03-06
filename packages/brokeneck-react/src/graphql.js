export const LOAD_GROUP = (fields, userFields) => `
query LoadGroup($id: String!, $pageNumber: String, $pageSize: Int) {
  group(id: $id) {
    ${fields.join('\n')}
    users(pageNumber: $pageNumber, pageSize: $pageSize) {
      data {
        ${userFields.join('\n')}
      }
      nextPage
    }
  }
}
`

export const LOAD_GROUPS = fields => `
query LoadGroups($pageNumber: String, $pageSize: Int, $search: String) {
  groups(pageNumber: $pageNumber, pageSize: $pageSize, search: $search) {
    data {
      ${fields.join('\n')}
    }
    nextPage
  }
}`

export const LOAD_USER = (fields, groupFields) => `
query LoadUser($id: String!) {
  user(id: $id) {
    ${fields.join('\n')}
    groups {
      ${groupFields.join('\n')}
    }
  }
}
`

export const LOAD_USERS = fields => `
query LoadUsers($pageNumber: String, $pageSize: Int, $search: String) {
  users(pageNumber: $pageNumber, pageSize: $pageSize, search: $search) {
    data {
      ${fields.join('\n')}
    }
    nextPage
  }
}`

export const ADD_USER_TO_GROUP = `
mutation AddUserToGroup($input: AddUserToGroupInput!) {
  addUserToGroup(input: $input)
}
`

export const REMOVE_USER_FROM_GROUP = `
mutation RemoveUserFromGroup($input: RemoveUserFromGroupInput!) {
  removeUserFromGroup(input: $input)
}
`

export const DELETE_GROUP = `
mutation DeleteGroup($input: DeleteGroupInput!) {
  deleteGroup(input: $input)
}
`

export const DELETE_USER = `
mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input)
}
`

export const CREATE_GROUP = fields => `
mutation CreateGroup($input: GroupInput!) {
  createGroup(input: $input) {
    ${fields.join('\n')}
  }
}
`

export const CREATE_USER = fields => `
mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    ${fields.join('\n')}
  }
}
`

export const EDIT_USER = () => `
mutation EditUser($id: String!, $input: EditUserInput!) {
  editUser(id: $id, input: $input)
}
`

export const EDIT_GROUP = () => `
mutation EditGroup($id: String!, $input: EditGroupInput!) {
  editGroup(id: $id, input: $input)
}
`

export const LOAD_ROOT = `
{
  provider {
    name
    capabilities {
      canSearchGroups
    }
  }
  __schema {
    types {
      name
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
      inputFields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
}
`
