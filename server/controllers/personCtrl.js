module.exports = db =>{
    return {
        create: (req, res) =>{
          if(!req.body.last_name || !req.body.first_name || !req.body.cnp || !req.body.age)
                return res.status(400).send({ success: false, required_fields: 'last_name, first_name, cnp, age' });

            db.models.Persons.create(req.body).then((person) => {
                res.send( {success: true, id: person.id});
            }).catch(() => res.status(401));
        },
        update: (req, res) => {
            db.models.Persons.update(req.body, { where: { id: req.body.id } }).then(() => {
                res.send({ success: true })
              }).catch(() => res.status(401));
        },
      
        findAll: (req, res) => {
            db.query(`SELECT p.id, last_name, first_name, cnp, age, json_agg(
                             json_build_object('id', c.id, 'brand_name', brand_name, 'model_name', model_name, 'year', year, 'cilindrical_capacity', cilindrical_capacity, 'tax', tax)
                             ) AS car_list
                      FROM "Persons" p
                      LEFT JOIN "Junction" j ON p.id = j.person_id
                      LEFT JOIN "Cars" c ON j.car_id = c.id
                      GROUP BY p.id
                      ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
            res.send(resp);
            }).catch(() => res.status(401));
        },
      
        find: (req, res) => {
            db.query(`SELECT p.id, last_name, first_name, cnp, age, json_agg(
                             json_build_object('id', c.id, 'brand_name', brand_name, 'model_name', model_name, 'year', year, 'cilindrical_capacity', cilindrical_capacity, 'tax', tax)
                             ) AS car_list
                      FROM "Persons" p
                      LEFT JOIN "Junction" j ON p.id = j.person_id
                      LEFT JOIN "Cars" c ON j.car_id = c.id
                      WHERE p.id = ${req.params.id}
                      GROUP BY p.id
                      ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
                    res.send(resp[0]);
            }).catch(() => res.status(401));
        },
      
          destroy: (req, res) => {
            db.query(`DELETE FROM "Persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true });
              }).catch(() => res.status(401));
          },

          createCar: (req, res) => {
            db.models.Junction.findOne({
              where: {person_id: req.params.id, car_id : req.body.car_id}
            }).then((exists) =>{
              if(exists)
                return res.status(400).send({succes: false, already_exists: true});

              db.models.Junction.create({person_id: req.params.id, car_id: req.body.car_id}).then(() => {
                res.send({success: true})
              }).catch(() => res.status(401));
            });
          },

          removeCar: (req, res) => {
            db.query(`DELETE FROM "Junction" WHERE person_id = ${req.params.id} AND car_id = ${req.body.car_id}`, { type: db.QueryTypes.DELETE }).then(() => {
              res.send({ success: true });
            }).catch(() => res.status(401));
          }
        };
      };