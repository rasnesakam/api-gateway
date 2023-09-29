# API Middle Layer

Api middle layer will be use for middle layer for the services that i provide.

Thats causes to use services from only one resource.

  

## Problem

There is much of services and different uri's. It is hard to use them in one project.

For example, in Batarya Dünyası, I am using shopping api. And I will use blog api.

Additionly, Simple Dashboard will be integrated for contents of this website.

In Simple Dashboard, the users will be authorized through my user api.

So, if we create dependency table, it would look like this:

  
  

|Service|Dependency|Access|
|:-----:|:------------:|:--------:|
|Simple Dashboard|emakas-users|R|
||emakas-shop|C,R,U,D|
||emakas-blog|C,R,U,D|
|Batarya Dünyası|emakas-shop|R|
||emakas-blog|R|

  
  

If we add more apis and try to integrate to different projects, Dependencies would be much confusing.

That would causes to our program will be hard to maintain, and stressfull to develop.

  

## Solution

Simple solution to this problem is putting one middle man to service-client traffic and manage all requests through one gateway.

All clients sends their requests to the one gateway, and then the gateway will redirect these requests according the resource they want. and deliver responses to the correct clients.

This solution is similar to middle man design pattern, and works similar like Nginx

  

### Example requests:

Here are some example requests and actions that expected by this program

#### Example Get Request

```

GET /resource/extra-queries HTTP/1.1

Host: api.emakas.net

Authorization: Bearer <jwt_token>

...

```

Whenever that request sended to the server, Server is going to apply these steps:

1. Server looks for which `resource` to redirect. `resource` simply stands for each services

2. If `resource` is restricted by `Authorization`, server firstly redirect this request to the `authentication server` to authorize token.

3. If request has `extra-queries`, server is going to collect them and pass to the requested `resource`
4. Finally, server recieves response from `resource` that requested and returns that response.

  

#### Example Post Request

```

POST /resource/extra-queries/ HTTP/1.1

Host: api.emakas.net

Authorization: Bearer <jwt_token>

Accept: application/json

Content-Type: application/json

Content-Length: 81

{ "Id": 78912, "Customer": "Jason Sweet", "Quantity": 1, "Price": 18.00 }

```

In addition what we mentioned above, server detects body messages and passes it into the `resource`

#### Example Put Request

```

PUT /resource/extra-queries/ HTTP/1.1

Host: api.emakas.net

Authorization: Bearer <jwt_token>

Accept: application/json

Content-Type: application/json

Content-Length: 81

{ "Id": 78912, "Customer": "Jason Sweet", "Quantity": 1, "Price": 18.00 }

```

#### Example Delete Request

```

Delete /resource/extra-queries HTTP/1.1

Host: api.emakas.net

Authorization: Bearer <jwt_token>

...

```