const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Phone = require("../model/phone.model");

router.post("/", (req, res, next) => {
  const now = new Date()
  const phoneEntry = new Phone({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    phone: req.body.phone,
    countryCode: req.body.countryCode,
    created: now,
    lastUpdated: now
  });

  Phone.findOne({ name: req.body.name }, (err, entry) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      if (entry) {
        res.status(400).json({
          error: `Entry with name ${req.body.name} already exists`
        });
      } 
      else {
        phoneEntry
          .save()
          .then(doc => {
            console.log(`Entry saved: ${doc}`);
            res.status(201).json({
              message: "New entry added",
              phoneEntry: {
                id: doc._id,
                name: doc.name,
                phone: doc.phone,
                countryCode: doc.countryCode,
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
  Phone.find()
    .select("-__v")
    .then(docs => {
      console.log(`Found ${docs.length} phone numbers`);
      res.status(200).json({
        count: docs.length,
        phoneEntries: docs.map(entry => {
          return {
            id: entry._id,
            name: entry.name,
            phone: entry.phone,
            countryCode: entry.countryCode,
            created: entry.created,
            lastUpdated: entry.lastUpdated,
            links: {
              self: `http://localhost:4000/phones/${entry.id}`
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
  Phone.find()
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
  Phone.findById(req.params.id)
    .select("-__v")
    .then(entry => {
      if (entry) {
        res.status(200).json({
          id: entry._id,
          name: entry.name,
          phone: entry.phone,
          countryCode: entry.countryCode,
          created: entry.created
        });
      } else {
        res.status(404).json({
          message: "Entry not found"
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

router.get("/by-number/:number", (req, res, next) => {
  Phone.findOne({phone: req.params.number})
       .select('-__v')
       .then(contact => {
         if (contact) {
           res.status(200).json({
             id: contact._id,
             name: contact.name,
             phone: contact.phone,
             countryCode: contact.countryCode,
             created: contact.created,
             lastUpdated: contact.lastUpdated,
             links: {
               self: `http://localhost:${process.env.PORT}/phones/${contact._id}`
             }
           });
         } else {
           res.status(404).json({
             message: 'Not found'
           });
         }
       })
       .catch(err => {
         res.status(500).json({
           error: err
         })
       });
});

router.put("/:id", (req, res, next) => {
  Phone.findByIdAndUpdate(
    // the id of the document that needs to be updated
    req.params.id,
    // the request body - Mongoose should intelligently merge the update with existing model
    { ...req.body, lastUpdated: new Date() },
    // Tell mongoose to return the updated model instead of the pre-updated one
    { new: true }
  )
    .then(entry => {
      res.status(200).json({
        id: entry._id,
        name: entry.name,
        phone: entry.phone,
        countryCode: entry.countryCode,
        created: entry.created,
        lastUpdated: entry.lastUpdated,
        links: {
          self: `http://localhost:4000/phones/${entry._id}`
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
  Phone.deleteOne({
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
  Phone.deleteMany({})
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
