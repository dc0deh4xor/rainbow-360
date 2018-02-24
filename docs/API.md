# Rainbow 360 API

### Organization

#### List Organization

Request: `GET /org/:adminId`

Response: `{ [orgSlug: string]: { name: string }  }`

#### Create Organization

Request: `POST /org/:adminId`

Response: `{ name: string }`

#### Get Organization

Request: `GET /org/:adminId/:orgSlug`

Response: `{ name: string }`

#### Remove Organization

Request: `DELETE /org/:adminId/:orgSlug`

Response: `""`