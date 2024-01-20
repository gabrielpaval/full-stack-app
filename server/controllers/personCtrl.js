module.exports = db =>{
    return {
        create: (req, res) =>{
            db.models.Persons.create(req.body).then(() => {
                res.send( {success: true});
            }).catch(() => res.status(401));
        },
        update: (req, res) => {
            db.models.Persons.update(req.body, { where: { id: req.body.id } }).then(() => {
                res.send({ success: true })
              }).catch(() => res.status(401));
        },
      
        findAll: (req, res) => {
            db.query(`SELECT *
                      FROM "Persons"
                      ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
            res.send(resp);
           }).catch(() => res.status(401));
        },
      
        find: (req, res) => {
            db.query(`SELECT id, last_name, first_name, cnp, age
                      FROM "Persons"`, { type: db.QueryTypes.SELECT }).then(resp => {
            res.send(resp[0]);
      }).catch(() => res.status(401));
        },
      
          destroy: (req, res) => {
            db.query(`DELETE FROM "Persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true });
              }).catch(() => res.status(401));
          }
        };
      };