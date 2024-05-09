## Education platform based on MERN stack
Response format:
```
{status: "some_status_string", value?: requested value, errors?: [{"msg": "error message", "path": "field name for validation"}]}
So status is included in every response, error and value fields are not mandatory
```
Status codes:  
-  201 - created smth
-  400 - user input error 
-  404 - not found 
-  403 - not authorized / not enough rights 
-  500 - server in trouble.. probably, or it is just a crook-handed devs fault :)  

### Current progress
- [x] Some logging stuff, DB connection
- [x] Create basic authentication (/api/user/login, /api/user/register)
- [x] Store sessions in DB
- [x] Define DB models for business logic
- [ ] Admin stuff (60% done)
- [x] General business logic for creating, storing, fetching necessary data
- [x] Implement linux-like permissions and user groups for rights distribution
- [ ] Logic and routes for submitting tasks, calculating user rating
- [x] Ability to upload files as attachments
- [ ] Comments for tasks (30% done)
- [ ] Server self-cleaning from unused files/tasks/categories
- [x] Global error handler

Prod server will be located at https://edplatform.maksp.gsqd.ru (80, 443)