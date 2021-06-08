/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createSong = /* GraphQL */ `
  mutation CreateSong(
    $input: CreateSongInput!
    $condition: ModelSongConditionInput
  ) {
    createSong(input: $input, condition: $condition) {
      id
      title
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateSong = /* GraphQL */ `
  mutation UpdateSong(
    $input: UpdateSongInput!
    $condition: ModelSongConditionInput
  ) {
    updateSong(input: $input, condition: $condition) {
      id
      title
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteSong = /* GraphQL */ `
  mutation DeleteSong(
    $input: DeleteSongInput!
    $condition: ModelSongConditionInput
  ) {
    deleteSong(input: $input, condition: $condition) {
      id
      title
      description
      filePath
      like
      owner
      createdAt
      updatedAt
    }
  }
`;
export const createDeal = /* GraphQL */ `
  mutation CreateDeal(
    $input: CreateDealInput!
    $condition: ModelDealConditionInput
  ) {
    createDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateDeal = /* GraphQL */ `
  mutation UpdateDeal(
    $input: UpdateDealInput!
    $condition: ModelDealConditionInput
  ) {
    updateDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteDeal = /* GraphQL */ `
  mutation DeleteDeal(
    $input: DeleteDealInput!
    $condition: ModelDealConditionInput
  ) {
    deleteDeal(input: $input, condition: $condition) {
      id
      name
      category
      createdAt
      updatedAt
      owner
    }
  }
`;
