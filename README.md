## Education platform based on MERN stack
Response format:
```
{status: "some_status_string", value?: requested value, errors?: [{"msg": "error message", "path": "field name for validation"}]}
So status is included in every response, error and value fields are not mandatory
```
Status codes:  
-  400 - user input error  
-  500 - server in trouble.. probably, or it is just a crook-handed devs fault :)  