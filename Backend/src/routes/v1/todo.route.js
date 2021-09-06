const express = require("express");
const router = express.Router();
const Todos = require("../../models/todo.model");

/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 * 
 */
router.get("/", async (req, res) => {
//   logMetadata(req)

  if (req.query.startDateMax && req.query.startDateMin) {
    let startDateMax = new Date(req.query.startDateMax);
    startDateMax.setTime(startDateMax.getTime());
    let startDateMin = new Date(req.query.startDateMin);
    startDateMin.setTime(startDateMin.getTime());
   
    Todos.find(
      {
        startDate: {
          $lte: startDateMax,
          $gte: startDateMin,
        },
      },

      (err, allTodos) => {
        if (err) {
          console.log(err);
        } else {
          res.send(allTodos);
        }
      }
    );
  } else {
    Todos.find({}, (err, allTodos) => {
      if (err) {
        console.log(err);

        res.status(500).send();
      } else {
        res.send(allTodos);
      }
    });
  }
});
 
 

router.post("/", async (req, res) => {
//   logMetadata(req)
   console.log("Request body : ", req.body)
   
   let newTodo = {
      name : req.body.name,
      startDate : req.body.startDate,
      endDate : req.body.endDate,
   }
   const newCreatedTodo = await Todos.create(newTodo)
   res.status(201).send(newCreatedTodo);
   
});

router.put("/", async (req, res) => {
   logMetadata(req)
   console.log("Request body : ", req.body)
   
   const idToUpdate = req.body._id;

   const updatedTodo = {
     name: req.body.name,
     startDate: req.body.startDate,
     endDate: req.body.endDate,
     pending: req.body.pending,
   };
 
 
   Todos.findByIdAndUpdate(idToUpdate, updatedTodo, (err, doc) => {
     if (err) {
       console.log(err);
       res.status(500).send();
     } else if (doc == null) {
       res.status(400).send({ error: "Resource not found" });
     } else {
       res.status(204).send();
     }
   }); 
}); 


router.delete("/:id", async (req, res) => {
//   logMetadata(req)
   console.log("Request body : ", req.body)
   const IdToDelete = req.params.id;
   Todos.findByIdAndDelete(IdToDelete, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res
          .status(204)
          .send();
      }
    });
  }); 
  const logMetadata = (req) => {
   console.log(
     `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${
       req.method
     }, Timestamp: ${new Date()}`
   );
 }


module.exports = router;
