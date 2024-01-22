module.exports = db =>{
    return {
        create: (req, res) =>{

          if(!req.body.brand_name || !req.body.model_name || !req.body.year || !req.body.cilindrical_capacity || !req.body.tax)
                return res.status(400).send({ success: false, required_fields: 'brand_name, model_name, year, cilindrical_capacity, tax'});

          db.models.Cars.create(req.body).then((car) => {
                res.send( {success: true, id: car.id});
            }).catch(() => res.status(401));
        },
        
        update: (req, res) => {
          db.models.Cars.update(req.body, { where: { id: req.body.id } }).then(() => {
            res.send({ success: true })
          }).catch(() => res.status(401));
        },
      
        findAll: (req, res) => {
            db.query(`SELECT c.id, brand_name, model_name, year, cilindrical_capacity, tax
                      FROM "Cars" c
                      ORDER BY c.id`, { type: db.QueryTypes.SELECT }).then(resp => {
            res.send(resp);
           }).catch(() => res.status(401));
        },
      
        find: (req, res) => {
          db.query(`SELECT c.id, brand_name, model_name, year, cilindrical_capacity, tax
                    FROM "Cars" c
                    WHERE c.id = ${req.params.id}
                    ORDER BY c.id`, { type: db.QueryTypes.SELECT }).then(resp => {
                  res.send(resp[0]);
          }).catch(() => res.status(401));
        },
      
          destroy: (req, res) => {
            db.query(`DELETE FROM "Cars" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true });
              }).catch(() => res.status(401));
          }
        };
      };