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