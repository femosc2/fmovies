export const createMovie = {
  tags: ['Movie'],
  description: "Creates a Movie",
  operationId: 'createMovie',
  parameters: [
    {
      "in": "query",
      "name": "createMovie",
      "description": "The new Movie to create",
      "schema": {
        "$ref": "#/definitions/Movie"
      }
    },
  ],
  responses: {
    "201": {
      description: "Creates a Movie",
      "content": {
        "application/json": {
          schema: {
            "$ref": "#/definitions/Movie"
          }
        }
      }
    }
  }
} 

export const createMovieById = {
  tags: ['Movie'],
  description: "Creates a Movie by Id",
  operationId: 'createMovieById',
  parameters: [
    {
      "in": "query",
      "name": "createMovie",
      "description": "The new Movie to create",
      "schema": {
        "$ref": "#/definitions/MovieById"
      }
    },
  ],
  responses: {
    "201": {
      description: "Creates a Movie",
      "content": {
        "application/json": {
          schema: {
            "$ref": "#/definitions/MovieById"
          }
        }
      }
    }
  }
} 