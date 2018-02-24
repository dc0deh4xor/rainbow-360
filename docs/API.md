# Rainbow 360 API

### Organization

#### List Organization

Request: `GET /org/:adminId`

Response: `{ [orgSlug: string]: { name: string } }`

#### Create Organization

Request: `POST /org/:adminId` ▶︎ `{ name: string }`

Response: `{ name: string }`

#### Get Organization

Request: `GET /org/:adminId/:orgSlug`

Response: `{ name: string }`

#### Remove Organization

Request: `DELETE /org/:adminId/:orgSlug`

Response: `""`



### Organization Teams

#### List Organization Teams

Request: `GET /org/:adminId/:orgSlug/teams`

Response: `{ [teamSlug: string]: { [userId: string]: true } }`

#### List Organization Team Users

Request: `GET /org/:adminId/:orgSlug/teams`

Response: `{ [teamSlug: string]: true }`



### Organization Members

#### Add Organization Member

Request: `POST /org/:adminId/:orgSlug/members` ▶︎ `{ id: string }`

Response: `{ id: string }`

#### List Organization Members

Request: `GET /org/:adminId/:orgSlug/members`

Response: `{ id: string }`

#### Get Organization Member

Request: `GET /org/:adminId/:orgSlug/members/:memberId`

Response: `{ id: string }`

#### Remove Organization Member

Request: `DELETE /org/:adminId/:orgSlug/members/:memberId`

Response: `""`

