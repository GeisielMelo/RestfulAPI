
# REST API with TypeScript and Node.js

TypeScript RESTful API built with MongoDB, Node, and Express. This repository serves as a template for streamlined development, allowing for quick setup and bypassing minor implementation steps in future applications.

## API Reference

#### Sign In

```http
  POST /api/auth/sign-in/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `{ email, password }` | `object` | returns a JWT |

#### Sign Out

```http
  DELETE /api/auth/sign-out/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token`| `string` | destroy a JWT |

#### Get User

```http
  GET /api/users/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string`  | get user, **Required**: JWT token |

#### Create User

```http
  POST /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `{ email, password }` | `object` | create user |

## Tech Stack

**Server:** Node, Express, Mongo


## License

- [MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@GeisielMelo](https://www.github.com/GeisielMelo)

