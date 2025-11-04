const express = require('express');
const router = express.Router();

router.get('/login',(req, res) => { 
    res.render('login'); 
    });

    router.get('/Signup', (req, res) => { 
        res.render('Signup'); 
        });
      
        router.get('/index', (req, res) => { 
            res.render('index'); 
          });
      
            router.get('/forgotpass', (req, res) => { 
               res.render('forgotpass'); 
             });
             
                router.get('/userInterface', (req, res) => { 
                    res.render('userInterface'); 
                 });
                      
                 router.get('/logout', (req, res) => { 
                    res.render('logout'); 
                 });
                   
                     router.get('/index2', (req, res) => {
                        res.render('index2'); 
                     });
                      
                          router.get('/userInterface2', (req, res) => { 
                             res.render('userInterface2'); 
                       });

                                router.get('/sondage', (req, res) => { 
                                   res.render('sondage'); 
                             });

                                    router.get('/Sondage_Ens', (req, res) => { 
                                      res.render('Sondage_Ens'); 
                                });  
                                   
                                         router.get('/notificationPage', (req, res) => { 
                                          res.render('notificationPage'); 
                                     });

                                              router.get('/notificationPage2', (req, res) => { 
                                               res.render('notificationPage2'); 
                                           });   
                                                    router.get('/evenement', (req, res) => { 
                                                      res.render('evenement'); 
                                                  });
                                                          router.get('/index3', (req, res) => { 
                                                           res.render('index3'); 
                                                        });
                                                               router.get('/notificationPage3', (req, res) => { 
                                                               res.render('notificationPage3'); 
                                                             }); 
                                                                  router.get('/evenement2', (req, res) => { 
                                                                  res.render('evenement2'); 
                                                               });
                                                                    router.get('/Exams', (req, res) => { 
                                                                     res.render('Exams'); 
                                                               });
                                                                        router.get('/Exams2', (req, res) => { 
                                                                          res.render('Exams2');
                                                                        });

module.exports = router; //to export the routers we created