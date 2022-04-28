const Course = require("../models/course");

//agregar cursos
function addCourse(req, res) {
  const body = req.body;
  const course = new Course(body);
  course.order = 1000;

  course.save((err, courseStored) => {
    if (err) {
      res
        .status(400)
        .send({ code: 400, message: "El curso que estas creando ya existe." });
    } else {
      if (!courseStored) {
        res
          .status(400)
          .send({ code: 400, message: "No se ha podido crear el curso." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Curso creado correctamente." });
      }
    }
  });
}

//recuperar cursos
function getCourses(req, res) {
  Course.find()
    .sort({ order: "asc" })
    .exec((err, coursesStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!coursesStored) {
          res
            .status(404)
            .send({ code: 404, message: "No se ha encontrado ningún curso." });
        } else {
          res.status(200).send({ code: 200, courses: coursesStored });
        }
      }
    });
}

//eliminar cursos
function deleteCourse(req, res) {
  const { id } = req.params;

  Course.findByIdAndRemove(id, (err, courseDeleted) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!courseDeleted) {
        res.status(404).send({ code: 404, message: "Curso no encontrado." });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Curso eliminado con éxito." });
      }
    }
  });
}

//actualizar cursos
function updateCourse( req, res){
    console.log("Update course..");
}

module.exports = {
  addCourse,
  getCourses,
  deleteCourse,
  updateCourse
};
