#Auth server

#Directions
- Add a user or two in `/src/user/users.json`
- run `docker-compose up`

#Endpoints
## Token (client_credentials)
- url: `/oauth2/token`
- payload: 
`{
	"client_id": "carlos_loves_mac",
	"grant_type": "client_credentials",
	"scope": "user/Patient.read"
 }`

## Token (refresh_token)
- url: `/oauth2/token`
- payload:
`{
 	"client_id": "carlos_loves_mac",
 	"grant_type": "refresh_token",
 	"refresh_token": "89b40cb1-ab3a-11e6-a875-0bb6ec958dfb"
 }`


## Introspect (refresh_token)
- url: `oauth2/token/introspect`
- spec: https://tools.ietf.org/html/rfc7662
- outstanding questions: who is allowed to introspect tokens?
- payload:
`
{
	"token": "ACCESS TOKEN HERE"
}
`

## Introspect (refresh_token)
- url: `oauth2/token/revoke`
- spec: https://tools.ietf.org/html/rfc7009
- payload:
`
	"token": "TOKEN HERE (accepts access or refresh)"
	"client_id": "carlos_loves_mac"
`

