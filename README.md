
# REST API with TypeScript and Node.js

TypeScript RESTful API built with MongoDB, Node, and Express. This repository serves as a template for streamlined development, allowing for quick setup and bypassing minor implementation steps in future applications.

## API Reference

#### Sign In

```http
  POST /api/auth/sign-in/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` `password` | `object` | returns a JWT |

#### Sign Out

```http
  DELETE /api/auth/sign-out/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`, `token`| `object` | destroy a JWT |

#### Get All Users

```http
  GET /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  |  | **Required**: JWT token |

#### Return a message

```http
  POST /api/users/message
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `message` | `string` | **Required**: JWT token |

## Tech Stack

**Server:** Node, Express


## License

- [MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@GeisielMelo](https://www.github.com/GeisielMelo)

