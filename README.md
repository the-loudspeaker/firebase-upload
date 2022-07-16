# firebase upload app.
To start the app run `npm install && npm start`

1. Once on the homepage, go to `/admin` to generate a link.
2. Once on the admin page, open the brower console log. Then click the generate link button.
3. Console will display the link after `"here's the link"`
4. Note the link.
5. Go to the link next.
    - E.g: if link is '`crq77f`', go to `http://127.0.0.1/crq77f`
6. A login button will be visible now. Clicking on it will allow users to authenticate and upload files.
7. After 24 hours the link won't be valid. Can be confirmed.

# Working

## Problem statement:
Create an app that will allow users to click on a link and upload images/files to a cloud backend.
- Links should be valid only for 24 hours once generated.
- Each user's files should go into a separate folder.
___________________________________
## Solution approach
### Generation of links:
Simple: Using a randomiser, a five character combination of letters and numbers is generated. That is our link.

eg: If the comnbination generated is `mwfj3` then the link is `http://127.0.0.1/mwfj3`

Whenver a link is generated, A creationTime entry under the pathname same as the combination is stored in the firebase realtime database.

eg: for the combination `mwfj3`, the database has a structure simillar to:
````
/mwfj3/{creationTime: 1657930585086}
````
Here, under path `mwfj3`, the timestamp of the creation of that link (in miliseconds) is saved.
_______________________________
### Verification of links:
Using `useLocation` hook, The combination can be optained from the url entered.

once we have the combination, we look for the value of `creationTime` in the database at the location of the combination.
````
/crq77f/{creationTime: 1657930585086}  <- We are looking for this value.
````
- If the locaiton `crq77f` isn't present, we say that the link is not valid.

- If the location is present and the value of creationTime is NOT more than 86400000 miliseconds (24 hours) old than current time, the link is considered **valid**.

- If the location is present and the different between creationTime and current time is more that 24 hours, Link is invalid and same is displayed.
__________________________________________________________
### Uploading the files.
Files are uploaded in the firebase storage.

Users are authenticated using google authentication so that unique folder names can be generated.

Files from each user are uploaded in a folder whose name corresponds to that of user's email address.