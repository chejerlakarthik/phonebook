const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Contact = require("../model/contact.model");

router.post("/", (req, res, next) => {
  const now = new Date()
  const newContact = new Contact({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    entries: req.body.entries,
    created: now,
    lastUpdated: now
  });

  Contact.findOne({ name: req.body.name }, (err, entry) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      if (entry) {
        res.status(400).json({
          error: `Entry with name ${req.body.name} already exists`
        });
      } else {
        newContact
          .save()
          .then(doc => {
            console.log(`Entry saved: ${doc}`);
            res.status(201).json({
              message: "Added new contact",
              contact_details: {
                id: doc._id,
                name: doc.name,
                entries: doc.entries,
                created: doc.created,
                lastUpdated: doc.lastUpdated,
                links: {
                  self: `http://localhost:4000/phones/${doc._id}`
                }
              }
            });
          })
          .catch(err => {
            console.log(`Error occurred: ${err}`);
            res.status(500).json({
              error: err
            });
          });
      }
    }
  });
});

router.get("/", (req, res, next) => {
  Contact.find()
    .select("-__v")
    .then(docs => {
      console.log(`Found ${docs.length} contacts`);
      res.status(200).json({
        count: docs.length,
        contacts: docs.map(contact => {
          return {
            id: contact._id,
            name: contact.name,
            entries: contact.entries,
            created: contact.created,
            lastUpdated: contact.lastUpdated,
            links: {
              self: `http://localhost:4000/phones/${contact.id}`
            }
          };
        })
      });
    })
    .catch(err => {
      console.log(`Error occurred: ${err}`);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/count", (req, res, next) => {
  Contact.find()
    .then(docs => {
      res.status(200).json({
        count: docs.length
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .select("-__v")
    .then(contact => {
      if (contact) {
        res.status(200).json({
          id: contact._id,
          name: contact.name,
          entries: contact.entries,
          created: contact.created,
          lastUpdated: contact.lastUpdated,
          links: {
            self: `http://localhost:${process.env.PORT}/contacts/${contact._id}`
          }
        });
      } else {
        res.status(404).json({
          message: "Contact not found"
        });
      }
    })
    .catch(err => {
      console.log(`Error occurred: ${err}`);
      res.status(500).json({
        error: err
      });
    });
});

// router.get("/by-number/:number", (req, res, next) => {
//   Contact.findOne({phone: req.params.number})
//        .select('-__v')
//        .then(contact => {
//          if (contact) {
//            res.status(200).json({
//              id: contact._id,
//              name: contact.name,
//              entries: contact.entries,
//              created: contact.created,
//              lastUpdated: contact.lastUpdated,
//              links: {
//                self: `http://localhost:${process.env.PORT}/contacts/${contact._id}`
//              }
//            });
//          } else {
//            res.status(404).json({
//              message: 'Not found'
//            });
//          }
//        })
//        .catch(err => {
//          res.status(500).json({
//            error: err
//          })
//        });
// });

router.put("/:id", (req, res, next) => {
  Contact.findByIdAndUpdate(
    // the id of the document that needs to be updated
    req.params.id,
    // the request body - Mongoose should intelligently merge the update with existing model
    { ...req.body, lastUpdated: new Date() },
    // Tell mongoose to return the updated model instead of the pre-updated one
    { new: true }
  )
    .then(contact => {
      res.status(200).json({
        id: contact._id,
        name: contact.name,
        entries: contact.entries,
        created: contact.created,
        lastUpdated: contact.lastUpdated,
        links: {
          self: `http://localhost:4000/phones/${contact._id}`
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });

});

router.delete("/:id", (req, res, next) => {
  Contact.deleteOne({
    _id: req.params.id
  })
    .then(doc => {
      if (doc.deletedCount > 0) {
        res.status(200).json({
          deletedCount: doc.deletedCount
        });
      } else {
        console.log("Entry not found");
        res.status(404).json();
      }
    })
    .catch(err => {
      console.log(`Error occurred: ${err}`);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/", (req, res, next) => {
  Contact.deleteMany({})
       .then(response => {
         res.status(200).json({
           count: response.deletedCount
         });
       })
       .catch(err => {
         res.status(500).json({
           error: err
         });
       });
});

module.exports = router;
