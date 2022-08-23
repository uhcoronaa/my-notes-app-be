let User = {
    user: 'my-notes-app-admin',
    pwd: 'sample_admin_password',
    roles: [
        {
            role: 'dbOwner',
            db: 'my-notes-app-db'
        }
    ]
};
let Dbname='my-notes-app-db';
let Collections=[''];
let Rootuser = {Username:'my-notes-app-root-user', Pwd:'sample_root_password'}

db.auth(Rootuser.Username, Rootuser.Pwd);
db = db.getSiblingDB(Dbname);
db.createUser(User);
Collections.forEach(Collection=>{
    db.createCollection(Collection);
});
