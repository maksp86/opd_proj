## Education platform based on MERN stack
Response format:
```
{status: "some_status_string", value?: requested value, errors?: [{"msg": "error message", "path": "field name for validation"}]}
So status is included in every response, error and value fields are not mandatory
```
Status codes:  
-  200 - just ok
-  201 - created smth
-  400 - user input error 
-  404 - not found 
-  403 - not authorized / not enough rights 
-  500 - server in trouble.. probably, or it is just a crook-handed devs fault :)  

### Current progress (backend)
- [x] Some logging stuff, DB connection
- [x] Create basic authentication (/api/user/login, /api/user/register)
- [x] Store sessions in DB
- [x] Define DB models for business logic
- [x] Admin stuff
- [x] General business logic for creating, storing, fetching necessary data
- [x] Implement linux-like permissions and user groups for rights distribution
- [x] Logic and routes for submitting tasks, calculating user rating
- [x] Ability to upload files as attachments
- [x] Comments for tasks (30% done)
- [x] Server self-cleaning from unused files/tasks/categories/comments
- [x] Global error handler
- [x] News scrapping

### Current progress (frontend)
- [x] Login and registration
- [x] Categories pages
- [x] Profile page
- [x] Home page with news
- [x] Adaptation for mobiles
- [x] Task view page
- [x] Comments section for tasks
- [x] Task edit page
- [x] Category edit page
- [x] Various helping modals
- [x] Image cropping for profile picture
- [x] Dark and Light theme

### Production server is already located at https://edplatform.maksp.gsqd.ru (https only)