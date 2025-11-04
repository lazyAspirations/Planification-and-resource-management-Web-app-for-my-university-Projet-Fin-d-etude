const express = require("express");
const app = express();
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.json());

dotenv.config({ path: './.env' });

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_strong_secret_key_here', // Should be in .env
    resave: false,
    saveUninitialized: false, // Changed to false for security
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
      httpOnly: true, // Prevent client-side JS from reading the cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict' // CSRF protection
}}));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use((req, res, next) => {
    if (req.session.user) {
        // Check user role to select the right preferences table
        if (req.session.user.role === 'enseignant') {
            db.query(
                "SELECT language FROM EnsPreferences WHERE id_enseignant = ?",
                [req.session.user.id],
                (err, results) => {
                    res.locals.language = (results && results[0] && results[0].language) || 'en';
                    next();
                }
            );
        } else if (req.session.user.role === 'etudiant') {
            db.query(
                "SELECT language FROM EtuPreferences WHERE id_etudiant = ?",
                [req.session.user.id],
                (err, results) => {
                    res.locals.language = (results && results[0] && results[0].language) || 'en';
                    next();
                }
            );
        } else {
            res.locals.language = 'en';
            next();
        }
    } else {
        res.locals.language = 'en';
        next();
    }
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

// Place the translation helper here:
const hbs = require('hbs');
const translations = require('./i18n');
hbs.registerHelper('t', function(key, options) {
  const lang = options.data.root.language || 'en';
  return translations[lang][key] || key;
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...");
    }
});

// Add this before your routes
app.use((req, res, next) => {
    // Make user data available to all templates
    res.locals.user = req.session.user;
    next();
});

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/Signup", (req, res) => {
    res.render("Signup");
});

app.get("/forgotpass", (req, res) => {
    res.render("forgotpass");
});

app.get("/userInterface", (req, res) => {
    res.render("userInterface");
});

app.get("/index", (req, res) => {
    res.render("index");
});

app.get("/index2", (req, res) => {
    res.render("index2"); 
 });
  
app.get("/userInterface2", (req, res) => { 
    res.render("userInterface2"); 
});
 
// Modify the Sondage_Ens route to pass user data
app.get("/Sondage_Ens", (req, res) => { 
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render("Sondage_Ens", { 
        user: req.session.user,
        id_enseignant: req.session.user.id 
    }); 
});

// Modify the sondage route for students
app.get("/sondage", (req, res) => { 
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render("sondage", {
        user: req.session.user,
        id_grp: req.session.user.group_number,
        Email: req.session.user.email
    }); 
});

app.get("/notificationPage", (req, res) => { 
    res.render("notificationPage"); 
});

app.get("/notificationPage2", (req, res) => { 
 res.render("notificationPage2"); 
});

app.get("/evenement", (req, res) => { 
 res.render("evenement"); 
});

app.get("/index3", (req, res) => { 
 res.render("index3"); 
});

app.get("/notificationPage3", (req, res) => { 
 res.render("notificationPage3"); 
}); 

app.get("/evenement2", (req, res) => { 
 res.render("evenement2"); 
});

app.get("/Exams", (req, res) => { 
 res.render("Exams"); 
});

app.get("/Exams2", (req, res) => {
 res.render("Exams2");
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Run notifyEndedPolls immediately on script start
notifyEndedPolls().catch(err => console.error("notifyEndedPolls error:", err));

// Then run it every 24 hours
setInterval(() => {
    notifyEndedPolls().catch(err => console.error("notifyEndedPolls error:", err));
}, 24 * 60 * 60 * 1000); // every 24 hours



try {
    processApprovedNotifications();
} catch (err) {
    console.error("processApprovedNotifications error:", err);
}

// Then run every 5 minutes (300000 milliseconds)
setInterval(() => {
    try {
        processApprovedNotifications();
    } catch (err) {
        console.error("processApprovedNotifications error:", err);
    }
}, 300000);


// Schedule the functions
// clear_expired_exp_intero: run every day
setInterval(clearExpiredExpIntero, 6 * 60 * 60 * 1000); // every 24 hours

// delete_expired_sessions: run every minute
setInterval(deleteExpiredSessions, 6 * 60 * 60 * 1000); // every 1 minute

// Optionally, run them once on startup
clearExpiredExpIntero();
deleteExpiredSessions();

























//events from db to app.js
// Function to clear expired exp_intero (was clear_expired_exp_intero event)
function clearExpiredExpIntero() {
    const sql = `
        UPDATE seance
        SET exp_intero = NULL
        WHERE exp_intero IS NOT NULL
          AND exp_intero <= NOW()
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("clearExpiredExpIntero error:", err);
        } else {
            //console.log(`clearExpiredExpIntero: ${result.affectedRows} rows updated`);
        }
    });
}

// Function to delete expired temporary sessions (was delete_expired_sessions event)
function deleteExpiredSessions() {
    const sql = `
        DELETE FROM seance
        WHERE expiration_date IS NOT NULL
          AND expiration_date <= NOW()
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("deleteExpiredSessions error:", err);
        } else {
           //console.log(`deleteExpiredSessions: ${result.affectedRows} rows deleted`);
        }
    });
}





////////////////////////////////////////////////////////debut_sondage_etudiant////////////////////////////////////////////////////////
        //yjib les sondage par groupe
        app.get("/api/student/getSondage_etud/", async (req, res) => {
            const sondage = await getSondage_etud(req.session.user.id);
            // console.log(req.session.user.id)
            res.json(sondage);
            
    });

    // verifier ida l user vota
    app.get("/api/student/checkVote/:pollid", async (req, res) => {
            const choix = await checkVote(req.session.user.id, req.params.pollid);
            res.json({ choix }); // null wla 0123
    });

    app.post('/api/student/participerSondage', async (req, res) => {
            try {
                const { id, option} = req.body;
                //console.log(id, option)
                const result = await participerSondage(id, parseInt(option),req.session.user.id);
                //console.log(result)
                res.status(200).json(result);
            } catch (error) {
                console.error('Error in /participer Sondage:', error);
                res.status(500).json({error: error.message});
            }
        });
//////////////////////////////////////////////////////////fin_sondage_etudiant//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////debut_sondage_enseignant////////////////////////////////////////////////////////

    app.get("/api/teacher/getSondage_ens/", async (req, res) => {
            const sondage = await getSondage_ens(req.session.user.id);
            res.json(sondage);
    });
    app.get("/api/teacher/getGroupe_ens/", async (req, res) => {//jib la liste ta3 es groupeli yrihom hadak lprof
            const grps = await getGroupes(req.session.user.id);
            //console.log(req.session.user.id)
            //console.log(grps)
            res.json(grps);
    });


app.post('/api/teacher/creerSondage', async (req, res) => {
    try {
        const arr = req.body;
        arr[1] = req.session.user.id;
        await creerSondage(arr);

        // Insert notification into notifAdmEns
        const notifSql = `
            INSERT INTO notifAdmEns 
            (NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, horaire, Jour, type_Seance, multipurpose)
            VALUES ('Enseignant', NOW(), ?, ?, ?, ?, 'sonda', NULL, NULL, NULL, NULL, ?)
        `;
        const notifParams = [arr[1], arr[0], arr[2], arr[3], arr[4]];

        db.query(notifSql, notifParams, (err) => {
            if (err) {
                console.error("Database error (notifAdmEns sondage):", err);
                return res.json({ 
                    success: true, 
                    message: "Sondage créé avec succès, mais notification non enregistrée." 
                });
            }

            // Insert notification into notifEnsEtu
            const notifSql2 = `
                INSERT INTO notifEnsEtu 
                (NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, horaire, Jour, type_Seance, multipurpose)
                VALUES ('Enseignant', NOW(), ?, ?, ?, ?, 'sonda', NULL, NULL, NULL, NULL, ?)
            `;
            db.query(notifSql2, notifParams, (err2) => {
                if (err2) {
                    console.error("Database error (notifEnsEtu sondage):", err2);
                    return res.json({ 
                        success: true, 
                        message: "Sondage créé avec succès, mais notification étudiant non enregistrée." 
                    });
                }
                res.json({ success: true, message: "Sondage créé avec succès" });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la création du sondage" });
    }
});
    app.post('/api/updateSondage', async (req, res)=>{
            try {
                const arr=req.body
                arr[1]=req.session.user.id
                    await updateSondage(arr)
                    res.json({ success: true, message: "Sondage mis à jour avec succès." });
            }catch(error) {
                res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du sondage" });
            }
    });
    app.post('/api/deleteSondage', async (req, res)=>{
            try{
                    const { id }=(req.body)
                    console.log(id)

                    await deleteSondage(id);
                    res.json({ success: true, message: "Sondage Supprimé avec succès" });
            }catch(error) {
                    res.status(500).json({ success: false, message: "Erreur lors de la suppression du sondage" });
            }
    })

    //creer sondage + update
/////////////////////////////////////////////////////////fin_sondage_enseignant/////////////////////////////////////////////////////////







function getSondage_etud(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_groupe FROM etudiant WHERE id = ?`,
        [id],
        (err, groupeResult) => {
          if (err) return reject(err);
          if (!groupeResult || groupeResult.length === 0) return resolve([]);
  
          const groupe = groupeResult[0].id_groupe;
            db.query(
            `SELECT id_section 
            FROM groupe 
            WHERE id = ?`,
            [groupe],
            (err2, sectionResult) => {
              if (err2) return reject(err2);
              if (!sectionResult || sectionResult.length === 0) return resolve([]);
  
            const idSection = sectionResult[0].id_section;
            const sondageQuery = `
            SELECT sondage.*, enseignant.nom, enseignant.prenom
            FROM sondage 
            JOIN enseignant ON id_enseignant=enseignant.id
            WHERE id_groupe = ?
                OR (id_section=? AND id_groupe IS NULL)
            ORDER BY temps_creation DESC
              `;
              db.query(
                sondageQuery,
                [groupe, idSection],
                (err3, rows) => {
                  if (err3) return reject(err3);
  
                  const sondages = rows.map(row => ({
                    id: row.id,
                    module: row.id_module,
                    nom_ens: row.nom,
                    prenom_ens: row.prenom,
                    temps_creation: row.temps_creation,
                    groupe: row.id_groupe,
                    titre: row.titre,
                    option_1: row.option_1,
                    nbr_1: row.nbr_1,
                    option_2: row.option_2,
                    nbr_2: row.nbr_2,
                    option_3: row.option_3,
                    nbr_3: row.nbr_3,
                    option_4: row.option_4,
                    nbr_4: row.nbr_4
                  }));
  
                  resolve(sondages);
                }
              );
            }
          );
        }
      );
    });
  }
  
  


async function checkVote(id_etud, pollid) {
    return new Promise((resolve, reject) => {
        const query =`SELECT choix
            FROM voters 
            WHERE id_etud = ? AND poll_id = ?
            LIMIT 1
        `;
        db.query(query, [id_etud, pollid], (err, results) => {
            if (err) reject(err);
            else resolve(results.length > 0 ? results[0].choix : null);
        });
    });
}

async function participerSondage(pollId, selectedOption, id_etud) {
    const column = `nbr_${selectedOption + 1}`;
    const voteexiste = await checkVote(id_etud, pollId);
    if (voteexiste !== null) {
        return { message: "Already voted", choix: voteexiste };
    }
    await db.query(`
        UPDATE sondage
        SET ${column} = ${column} + 1
        WHERE id = ?`,
        [pollId]
    );
    await db.query(`
        INSERT INTO voters (poll_id, id_etud, choix)
        VALUES (?, ?, ?)`,
        [pollId, id_etud, selectedOption]
    );
    return { message: "Vote recorded successfully" };
}

//////////////////////////////////////////////////////////////////////fin etudiant//////////////////////////////////////
////////////////////////////////////////////////////////////////////debut enseignant//////////////////////////////

async function getSondage_ens(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT sondage.*, groupe.num_Grp, section.Nom, specialite.abr, specialite.id_niveau
            FROM sondage
            LEFT JOIN groupe ON sondage.id_groupe = groupe.id
            JOIN section  ON sondage.id_section=section.id
            JOIN specialite ON section.id_spec =specialite.id
            WHERE sondage.id_enseignant= ?        
            ORDER BY temps_creation DESC
            `;
        
        db.query(query, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length === 0) {
                    resolve([]); // or resolve([]) if you expect multiple
                } else {
                    // Map all rows to the desired format
                    const result = rows.map(row => ({
                        id: row.id,
                        module: row.id_module,
                        temps_creation: row.temps_creation,
                        niveau: row.id_niveau,
                        specialite: row.abr,
                        section: row.Nom,
                        id_section:row.id_section,
                        groupe: row.num_Grp,
                        id_groupe:row.id_groupe,
                        titre: row.titre,
                        option_1: row.option_1,
                        nbr_1: row.nbr_1,
                        option_2: row.option_2,
                        nbr_2: row.nbr_2,
                        option_3: row.option_3,
                        nbr_3: row.nbr_3,
                        option_4: row.option_4,
                        nbr_4: row.nbr_4
                    }));
                    resolve(result);
                }
            }
        });
    });
}
async function getGroupes(id) {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT seance.type_Seance, IFNULL(seance.id_section, groupe.id_section) id_section, seance.id_module, seance.id_groupe, groupe.num_Grp,
        section.Nom, specialite.abr,
        specialite.id_niveau
      FROM seance
      LEFT JOIN groupe ON seance.id_groupe = groupe.id
      LEFT JOIN section ON section.id = IFNULL(seance.id_section, groupe.id_section)
      LEFT JOIN specialite ON specialite.id = section.id_spec
      WHERE seance.id_enseignant = ?
    `;
        db.query(query, [id], (err, rows) => {
            if (err) reject(err);
         else {
            if (rows.length === 0) {
                resolve(null); // or resolve([]) if you expect multiple
            } else {
                // Map all rows to the desired format
                const result = rows.map(r => ({
                    type:       r.type_Seance,
                    niveau:     r.id_niveau,
                    specialite: r.abr,
                    section:    r.Nom,
                    groupe:     r.num_Grp,
                    module:     r.id_module,
                    id_section: r.id_section,
                    id_grp:     r.id_groupe
                }));
                resolve(result);
            }
        }
    });
});
}

async function creerSondage(arr) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO sondage (id_module, id_enseignant, id_section, id_groupe, titre, option_1, option_2, option_3, option_4)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8]], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                reject(err);
            } else {
                resolve({ success: true});
            }
        });
    });
}

async function updateSondage(arr) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE sondage 
        SET 
            id_module = ?, id_enseignant = ?,  id_section = ?, id_groupe = ?, titre = ?, option_1 = ?, option_2 = ?, option_3 = ?, option_4 = ? WHERE id = ?
        `;
        db.query(query, arr, 
            (err, results) => {
                if (err) reject(err);
                else resolve({success: true});
            });
    });
}

async function deleteSondage(id) {
    return new Promise((resolve) => {
        db.query("DELETE FROM sondage WHERE id = ?", [id], (err, results) => {
            if (err) reject(err);
            else resolve({success: true});
        });
});
}


async function notifyEndedPolls() {
    // Find all poll notifications older than 1 minute (for testing)
    const sql = `
        SELECT * FROM notifAdmEns
        WHERE type_demande = 'sonda'
        AND TIMESTAMPDIFF(HOUR, DateTime, NOW()) >= 72
    `;
    db.query(sql, (err, notifs) => {
        if (err) {
            console.error("notifyEndedPolls error:", err);
            return;
        }
        if (!notifs.length) return;
        notifs.forEach(notif => {
            // Check if poll_end notification already exists for this poll
            db.query(
                `SELECT 1 FROM notifAdmEns WHERE type_demande = 'poll_end' AND multipurpose = ? AND id_enseignant = ?`,
                [notif.multipurpose, notif.id_enseignant],
                (err, exists) => {
                    if (err) return console.error("Error checking poll_end:", err);
                    if (exists.length === 0) {
                        // Insert poll_end notification
                        db.query(`
                            INSERT INTO notifAdmEns 
                            (NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, multipurpose)
                            VALUES ('Enseignant', NOW(), ?, ?, ?, ?, 'poll_end', NULL, ?)
                        `, [notif.id_enseignant, notif.id_module, notif.id_section, notif.id_groupe, notif.multipurpose], (err) => {
                            if (err) console.error("Error inserting poll_end notifAdmEns:", err);
                        });
                    }
                }
            );
        });
    });


    const sql2 = `
        SELECT * FROM notifEnsEtu
        WHERE type_demande = 'sonda'
        AND TIMESTAMPDIFF(MINUTE, DateTime, NOW()) >= 1
    `;
    db.query(sql2, (err, notifs) => {
        if (err) {
            console.error("notifyEndedPolls error:", err);
            return;
        }
        if (!notifs.length) return;
        notifs.forEach(notif => {
            // Check if poll_end notification already exists for this poll
            db.query(
                `SELECT 1 FROM notifEnsEtu WHERE type_demande = 'poll_end' AND multipurpose = ? AND id_enseignant = ?`,
                [notif.multipurpose, notif.id_enseignant],
                (err, exists) => {
                    if (err) return console.error("Error checking poll_end:", err);
                    if (exists.length === 0) {
                        // Insert poll_end notification
                        db.query(`
                            INSERT INTO notifEnsEtu 
                            (NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, multipurpose)
                            VALUES ('Enseignant', NOW(), ?, ?, ?, ?, 'poll_end', NULL, ?)
                        `, [notif.id_enseignant, notif.id_module, notif.id_section, notif.id_groupe, notif.multipurpose], (err) => {
                            if (err) console.error("Error inserting poll_end notifAdmEns:", err);
                        });
                    }
                }
            );
        });
    });
}


// Add this function in app.js (you can place it near the top with other utility functions)
function processApprovedNotifications() {
  // 1. Find all approved notifications (status = 1) that haven't been processed yet
  const sql = `
    SELECT * FROM notifAdmEns 
    WHERE status = 1 
  `;

  db.query(sql, (err, notifications) => {
    if (err) {
      console.error("Error fetching approved notifications:", err);
      return;
    }

    if (notifications.length === 0) return;

    notifications.forEach(notification => {
      if (notification.type_demande === "demIntero") {
        // Copy multipurpose to seance.exp_intero
        const updateSql = `UPDATE seance SET exp_intero = ? WHERE id = ?`;
        db.query(updateSql, [notification.multipurpose, notification.id_seance], (err2) => {
          if (err2) {
            console.error("Error updating exp_intero for demIntero:", err2);
          } else {
            markAsProcessed(notification.id);
          }
        });
      } else {
      switch(notification.type_demande) {
        case 'ajout':
  // Handle add request
  const addSql = `
    INSERT INTO seance 
    (Jour, horaire, id_salle, id_enseignant, id_module, 
     id_section, id_groupe, type_Seance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const addParams = [
    notification.Jour,
    notification.horaire,
    notification.id_salle,
    notification.id_enseignant,
    notification.id_module,
    notification.id_section,
    notification.id_groupe,
    notification.type_Seance
  ];

  db.query(addSql, addParams, (err, result) => {
    if (err) {
      console.error("Error adding session:", err);
      return;
    }
    markAsProcessed(notification.id);

    // Notify students about accepted add request
    db.query(`
      INSERT INTO notifEnsEtu 
      (NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, multipurpose)
      VALUES ('Enseignant', NOW(), ?, ?, ?, ?, ?, 1, ?)
    `, [
      notification.id_enseignant,
      notification.id_module,
      notification.id_section,
      notification.id_groupe,
      notification.type_demande,
      result.insertId // The new session id
    ]);
  });
          break;

        case 'modif':
  // Handle modify request
  const modifySql = `
    UPDATE seance 
    SET Jour = ?, horaire = ?, id_salle = ?, type_Seance = ?
    WHERE id = ?
  `;
  const modifyParams = [
    notification.Jour,
    notification.horaire,
    notification.id_salle,
    notification.type_Seance,
    notification.id_seance
  ];

  db.query(modifySql, modifyParams, (err, result) => {
    if (err) {
      console.error("Error modifying session:", err);
      return;
    }
    markAsProcessed(notification.id);

    // Notify students about accepted modify request
   db.query(`
  INSERT INTO notifEnsEtu 
  (id_seance, NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_demande, status, multipurpose)
  VALUES (?, 'Enseignant', NOW(), ?, ?, ?, ?, ?, 1, ?)
`, [
  notification.id_seance,           // <-- This will be copied to notifEnsEtu.id_seance
  notification.id_enseignant,
  notification.id_module,
  notification.id_section,
  notification.id_groupe,
  notification.type_demande,
  notification.id_seance           // multipurpose (or use notification.multipurpose if needed)
]);
  });
  break;

        // case 'supp':
        //   // Handle delete request
        //   const deleteSql = `DELETE FROM seance WHERE id = ?`;
        //   db.query(deleteSql, [notification.id_seance], (err, result) => {
        //     if (err) {
        //       console.error("Error deleting session:", err);
        //       return;
        //     }
        //     markAsProcessed(notification.id);
        //   });
        //   break;

        default:
          // For other types (abse, tempo, sonda), just mark as processed
          markAsProcessed(notification.id);
      }}
    });
  });
}

function markAsProcessed(notificationId) {
  const sql = `UPDATE notifAdmEns SET status = 2 WHERE id = ?`;
  db.query(sql, [notificationId], (err) => {
    if (err) console.error("Error marking notification as processed:", err);
  });
}

























// BEGINING OF GETTING DATA FOR FORMS


app.get('/index', (req, res) => {
    const sql = "SELECT * FROM seance WHERE id_enseignant = ? ORDER BY Jour, FIELD(horaire, '1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session')";
    db.query(sql, [req.session.user.id], (err, timetable) => {
        if(err) throw err;
        res.render('index', { user: req.session.user, timetable: timetable });
    });
});


// BEGINING OF beTimeTablePopulation.js
app.get('/api/teacher/selecttimetable', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const teacherId = req.session.user.id;

    // Updated query to include temporary session information
const timetableSql = `
SELECT 
    se.*,
    m.nom_C AS module_name,
    g.num_Grp AS group_number,
    sec.Nom AS section_name,
    sp.abr AS speciality_abbr,
    n.id AS level_id,
    CASE 
        WHEN se.expiration_date IS NOT NULL THEN 'Temporary'
        ELSE 'Regular'
    END AS session_status
FROM 
    seance se
LEFT JOIN 
    module m ON se.id_module = m.id
LEFT JOIN 
    groupe g ON se.id_groupe = g.id
LEFT JOIN 
    section sec ON g.id_section = sec.id OR se.id_section = sec.id
LEFT JOIN 
    specialite sp ON sec.id_spec = sp.id
LEFT JOIN 
    niveau n ON sp.id_niveau = n.id
WHERE 
    se.id_enseignant = ?
ORDER BY 
    FIELD(se.Jour, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'),
    CASE 
        WHEN se.type_Seance IN ('ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE') THEN STR_TO_DATE(se.horaire, '%H:%i')
        ELSE FIELD(se.horaire, '1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session')
    END
`;

    // Updated query to get group information from the seance table
    const groupsSql = `
        SELECT 
            DISTINCT g.id,
            g.num_Grp,
            sec.Nom AS section_name,
            sp.abr AS speciality_abbr,
            n.id AS level_id,
            n.nom_C AS level_name
        FROM 
            seance se
        LEFT JOIN 
            groupe g ON se.id_groupe = g.id
        LEFT JOIN 
            section sec ON g.id_section = sec.id OR se.id_section = sec.id
        LEFT JOIN 
            specialite sp ON sec.id_spec = sp.id
        LEFT JOIN 
            niveau n ON sp.id_niveau = n.id
        WHERE 
            se.id_enseignant = ?
        ORDER BY 
            n.id, sp.abr, sec.Nom, g.num_Grp
    `;

    // Execute both queries
    db.query(timetableSql, [teacherId], (err, timetableResults) => {
        if (err) {
            console.error("Database error (timetable):", err);
            return res.status(500).json({ error: "Database error" });
        }

        db.query(groupsSql, [teacherId], (err, groupsResults) => {
            if (err) {
                console.error("Database error (groups):", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({
                timetable: timetableResults,
                groups: groupsResults
            });
        });
    });
});


app.get('/api/teacher/available-times', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { day, moduleId, groupId, sectionId } = req.query;
    const teacherId = req.session.user.id;

    // Validate parameters
    if (!day || (!groupId && !sectionId)) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    // Get all possible time slots
    const allSlots = ['1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session'];
    
    // Determine if we're checking for a lecture (section) or tutorial/lab (group)
    const isLecture = sectionId && !groupId;
    
    let occupiedSql = `
        SELECT DISTINCT horaire 
        FROM seance 
        WHERE Jour = ? AND (`;
    
    const params = [day];
    
    if (isLecture) {
        // For lectures: check section AND all groups in that section
        occupiedSql += `(id_section = ?) OR (id_groupe IN (SELECT id FROM groupe WHERE id_section = ?))`;
        params.push(sectionId, sectionId);
    } else {
        // For tutorials/labs: check group AND its section
        occupiedSql += `(id_groupe = ?) OR (id_section = (SELECT id_section FROM groupe WHERE id = ?))`;
        params.push(groupId, groupId);
    }
    
    // Add condition to check for teacher's existing sessions
    occupiedSql += ` OR (id_enseignant = ?))`;  // Notice the extra closing parenthesis here
    params.push(teacherId);
    
    db.query(occupiedSql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        
        const occupiedSlots = results.map(r => r.horaire);
        const availableSlots = allSlots.filter(slot => !occupiedSlots.includes(slot));
        
        res.json({ availableSlots });
    });
});

// In app.js
app.get('/api/teacher/notifications', (req, res) => {
    const teacherId = req.session.user.id;
    const sql = `
        SELECT * FROM notifAdmEns 
        WHERE id_enseignant = ?
        ORDER BY DateTime DESC
    `;
    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get('/api/teacher/notifications105', (req, res) => {
    const teacherId = req.session.user.id;
    const sql = `
        SELECT * FROM notifAdmEns 
        WHERE id_enseignant = ? 
          AND (status IS NULL OR status = -1)
        ORDER BY DateTime DESC
    `;
    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Get user preferences (add language)
app.get('/api/user/preferences', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const sql = "SELECT displayRequests, language FROM EnsPreferences WHERE id_enseignant = ?";
    db.query(sql, [req.session.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({
            displayRequests: results[0]?.displayRequests === 1,
            language: results[0]?.language || 'en'
        });
    });
});

// Update user preferences (add language)
app.post('/api/user/preferences', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const { displayRequests, language } = req.body;
    const sql = `
        INSERT INTO EnsPreferences (id_enseignant, displayRequests, language)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE displayRequests = VALUES(displayRequests), language = VALUES(language)
    `;
    db.query(sql, [req.session.user.id, displayRequests ? 1 : 0, language || 'en'], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ success: true });
    });
});

// Get all sessions for a specific group (regardless of teacher)
app.get('/api/teacher/group-sessions/:groupId', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const groupId = req.params.groupId;
    
    // First get the group's section information
    const groupInfoSql = `
        SELECT g.id_section, sec.Nom AS section_name
        FROM groupe g
        JOIN section sec ON g.id_section = sec.id
        WHERE g.id = ?
    `;
    
    db.query(groupInfoSql, [groupId], (err, groupInfo) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        
        if (groupInfo.length === 0) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        const sectionId = groupInfo[0].id_section;
        const sectionName = groupInfo[0].section_name;
        
        // Now get all relevant sessions
        const sessionsSql = `
            SELECT 
                se.*,
                m.nom_C AS module_name,
                g.num_Grp AS group_number,
                ? AS section_name,
                sp.abr AS speciality_abbr,
                n.id AS level_id,
                e.nom AS teacher_lastname,
                e.prenom AS teacher_firstname
            FROM 
                seance se
            LEFT JOIN 
                module m ON se.id_module = m.id
            LEFT JOIN 
                groupe g ON se.id_groupe = g.id
            LEFT JOIN 
                section sec ON g.id_section = sec.id OR se.id_section = sec.id
            LEFT JOIN 
                specialite sp ON sec.id_spec = sp.id
            LEFT JOIN 
                niveau n ON sp.id_niveau = n.id
            LEFT JOIN
                enseignant e ON se.id_enseignant = e.id
            WHERE 
                (se.id_groupe = ?) OR 
                (se.id_section = ? AND se.type_Seance = 'LECTURE')
            ORDER BY 
                FIELD(se.Jour, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'),
                CASE 
                    WHEN se.type_Seance IN ('ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE') THEN STR_TO_DATE(se.horaire, '%H:%i')
                    ELSE FIELD(se.horaire, '1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session')
                END
        `;

        db.query(sessionsSql, [sectionName, groupId, sectionId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        });
    });
});
// ENDING OF beTimeTablePopulation.js




// BEGINING OF beAddSession.js

// Fetch modules for the current teacher
app.get('/api/teacher/modules', (req, res) => {
    const teacherId = req.session.user.id;

    const { sessionType } = req.query; // Will be 'TUTORIAL' or 'LAB' or undefined
  
    let sql = `
        SELECT m.id, m.nom_C, m.chargeTd, m.chargeTp
        FROM module m
        JOIN enseignant_module em ON m.id = em.id_module
        WHERE em.id_enseignant = ?
    `;
  
    // Add condition based on session type
    if (sessionType === 'TUTORIAL') {
      sql += ` AND m.chargeTd >= 1`;
    } else if (sessionType === 'LAB') {
      sql += ` AND m.chargeTp >= 1`;
    }
  
    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
  });
  
  // Fetch available rooms for a specific day, hour, and session type
  app.get('/api/teacher/available-rooms', (req, res) => {
      const { day, hour, sessionType } = req.query; // Get day, hour, and sessionType from query parameters
  
      const sql = `
          SELECT s.id, s.N_Salle, s.capacite_salle, s.utilite
          FROM salle s
          WHERE s.utilite = ?
          AND s.soustravaux = 0
          AND s.id NOT IN (
              SELECT se.id_salle
              FROM seance se
              WHERE se.Jour = ? 
              AND se.horaire = ?
          )
          ORDER BY s.capacite_salle DESC
      `;
  
      db.query(sql, [sessionType, day, hour], (err, results) => {
          if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Database error" });
          }
          res.json(results);
      });
  });
  
// Get teacher's available niveaux filtered by module's speciality

app.get('/api/teacher/niveau', (req, res) => {
    const teacherId = req.session.user?.id;
    const { module } = req.query;

    if (!teacherId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    let sql = `
        SELECT DISTINCT n.id, n.nom_C
        FROM niveau n
        JOIN specialite sp ON n.id = sp.id_niveau
        JOIN module m ON sp.id = m.id_specialite
        JOIN enseignant_module em ON m.id = em.id_module
        WHERE em.id_enseignant = ?
    `;

    const params = [teacherId];

    if (module) {
        sql += ` AND m.id = ?`;
        params.push(module);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ 
                error: "Database error",
                details: err.message,
                sql: sql,
                params: params
            });
        }
        res.json(results);
    });
});

// Get teacher's specialités for a niveau
app.get('/api/teacher/spec', (req, res) => {
    const teacherId = req.session.user.id;
    const { niveau } = req.query;

    const sql = `
        SELECT DISTINCT sp.id, sp.abr
        FROM specialite sp
        JOIN section s ON sp.id = s.id_spec
        JOIN seance se ON s.id = se.id_section
        WHERE se.id_enseignant = ? AND sp.id_niveau = ?
    `;

    db.query(sql, [teacherId, niveau], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Get teacher's sections for a specialité
app.get('/api/teacher/section', (req, res) => {
    const teacherId = req.session.user.id;
    const { spec, module, sessionType } = req.query;

    let sql;
    const params = [teacherId, spec];

    if (module && sessionType === 'LECTURE') {
        sql = `
            SELECT DISTINCT s.id, s.Nom
            FROM section s
            JOIN specialite sp ON s.id_spec = sp.id
            JOIN seance se ON s.id = se.id_section
            WHERE se.id_enseignant = ? AND s.id_spec = ? AND se.id_module = ?
        `;
        params.push(module);
    } else {
        sql = `
            SELECT DISTINCT s.id, s.Nom
            FROM section s
            JOIN seance se ON s.id = se.id_section
            WHERE se.id_enseignant = ? AND s.id_spec = ?
        `;
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Get teacher's groups for a section
app.get('/api/teacher/group', (req, res) => {
    const teacherId = req.session.user.id;
    const { section, module, sessionType } = req.query;

    let sql;
    const params = [teacherId, section];

    if (module && (sessionType === 'TUTORIAL' || sessionType === 'LAB')) {
        sql = `
            SELECT DISTINCT g.id, g.num_Grp
            FROM groupe g
            JOIN section s ON g.id_section = s.id
            JOIN seance se ON g.id = se.id_groupe
            WHERE se.id_enseignant = ? AND g.id_section = ? AND se.id_module = ?
        `;
        params.push(module);
    } else {
        sql = `
            SELECT DISTINCT g.id, g.num_Grp
            FROM groupe g
            JOIN seance se ON g.id = se.id_groupe
            WHERE se.id_enseignant = ? AND g.id_section = ?
        `;
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});
// ENDING OF beAddSession.js

//BEGINING OF SHOW REQUESTS IN TABLE
app.get('/api/user/my-requests', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const teacherId = req.session.user.id;
    const sql = `
        SELECT 
            n.id, n.type_demande, 
            COALESCE(n.horaire, s.horaire) AS horaire,
            COALESCE(n.Jour, s.Jour) AS Jour,
            COALESCE(n.id_salle, s.id_salle) AS id_salle,
            COALESCE(n.id_module, s.id_module) AS id_module,
            COALESCE(n.id_section, s.id_section) AS id_section,
            COALESCE(n.id_groupe, s.id_groupe) AS id_groupe,
            COALESCE(n.type_Seance, s.type_Seance) AS type_Seance,
            n.status
        FROM notifAdmEns n
        LEFT JOIN seance s ON n.id_seance = s.id
        WHERE n.id_enseignant = ?
        ORDER BY n.id DESC
    `;
    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

//ENDING OF SHOW REQUESTS IN TABLE


//BEGINING OF TIMETABLE STUDENT 
app.get('/api/student/selecttimetable', (req, res) => {
    // Check if user is logged in (simpler check)
    if (!req.session.user) {
        return res.status(401).json({ error: 'You are not logged in. Please log in to view your timetable.' });
    }

    if (req.session.user.role !== 'etudiant') {
        return res.status(403).json({ error: 'Access denied. Student account required.' });
    }

    const studentId = req.session.user.id;

    // First get the student's group and section info
    const studentQuery = `
        SELECT 
            e.id_groupe, 
            g.id_section,
            sec.Nom AS section_name,
            g.num_Grp AS group_number
        FROM etudiant e
        JOIN groupe g ON e.id_groupe = g.id
        JOIN section sec ON g.id_section = sec.id
        WHERE e.id = ?
    `;

    db.query(studentQuery, [studentId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const { id_groupe, id_section, section_name, group_number } = results[0];

        // Now get all sessions for this student (both for their group and their section)
       const seanceQuery = `
            SELECT 
                se.*, 
                m.nom_C AS module_name,
                g.num_Grp AS group_number,
                sec.Nom AS section_name
            FROM seance se
            LEFT JOIN module m ON se.id_module = m.id
            LEFT JOIN groupe g ON se.id_groupe = g.id
            LEFT JOIN section sec ON se.id_section = sec.id OR g.id_section = sec.id
            WHERE 
                (se.id_groupe = ?) OR 
                (se.id_section = ? AND se.type_Seance = 'LECTURE') OR
                (se.id_section = ? AND se.type_Seance = 'ONLINELECTURE')
            ORDER BY 
                FIELD(se.Jour, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'),
                CASE 
                    WHEN se.type_Seance IN ('ONLINETUTORIAL', 'ONLINELAB', 'ONLINELECTURE') THEN STR_TO_DATE(se.horaire, '%H:%i')
                    ELSE FIELD(se.horaire, '1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session')
                END
        `;

        db.query(seanceQuery, [id_groupe, id_section, id_section], (err, seances) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ timetable: seances });
        });
    });
});
//ENDING OF TIMETABLE STUDENT

// Get notifications for teacher
app.get('/api/teacher/notifications2', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const teacherId = req.session.user.id;
    
    const sql = `
        SELECT 
            n.*,
            se.Jour AS original_jour,
            se.horaire AS original_horaire,
            se.id_salle AS original_salle,
            se.type_Seance AS original_type,
            se.id_module AS original_module,
            se.id_section AS original_section,
            se.id_groupe AS original_group
        FROM 
            notifAdmEns n
        LEFT JOIN 
            seance se ON n.id_seance = se.id
        WHERE 
            (n.id_enseignant = ? OR 
            (n.id_seance IS NOT NULL AND se.id_enseignant = ?))
        ORDER BY n.DateTime DESC
        LIMIT 10
    `;

    db.query(sql, [teacherId, teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Mark notification as read
app.post('/api/teacher/mark-notification-read/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const notificationId = req.params.id;
    const teacherId = req.session.user.id;

    const sql = "UPDATE notifAdmEns SET status = NULL WHERE id = ? AND id_enseignant = ? AND status = -1";
    db.query(sql, [notificationId, teacherId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
    });
});

// Notification page route
app.get('/NotificationEns', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    res.render('notificationPage', { 
        user: req.session.user,
        layout: false // If you're using a layout system
    });
});


// Get all notifications for teacher (for notification page)
app.get('/api/teacher/all-notifications', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const teacherId = req.session.user.id;
    
    const sql = `
        SELECT 
            n.*,
            se.Jour AS original_jour,
            se.horaire AS original_horaire,
            se.id_salle AS original_salle,
            se.type_Seance AS original_type,
            se.id_module AS original_module,
            se.id_section AS original_section,
            se.id_groupe AS original_group
        FROM 
            notifAdmEns n
        LEFT JOIN 
            seance se ON n.id_seance = se.id
        WHERE 
            (n.id_enseignant = ? OR 
            (n.id_seance IS NOT NULL AND se.id_enseignant = ?))
        ORDER BY n.DateTime DESC
    `;

    db.query(sql, [teacherId, teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// Mark all notifications as read
app.post('/api/teacher/mark-seenbyens/all', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const teacherId = req.session.user.id;
  
  const sql = "UPDATE notifAdmEns SET seenbyens = 1 WHERE id_enseignant = ?";
  db.query(sql, [teacherId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.json({ success: true });
  });
});

app.post('/api/teacher/mark-seenbyens/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const notificationId = req.params.id;
    const teacherId = req.session.user.id;

    const sql = "UPDATE notifAdmEns SET seenbyens = 1 WHERE id = ? AND id_enseignant = ?";
    db.query(sql, [notificationId, teacherId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true });
    });
});


app.get('/api/student/notifications3', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const studentId = req.session.user.id;
    // Get student's group and section
    const sql = `
        SELECT e.id_groupe, g.id_section
        FROM etudiant e
        JOIN groupe g ON e.id_groupe = g.id
        WHERE e.id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (!results || results.length === 0) return res.json([]);
        const { id_groupe, id_section } = results[0];
        const notifSql = `
            SELECT 
                n.*,
                se.Jour AS original_jour,
                se.horaire AS original_horaire,
                se.id_salle AS original_salle,
                se.type_Seance AS original_type,
                se.id_module AS original_module,
                se.id_section AS original_section,
                se.id_groupe AS original_group
            FROM notifEnsEtu n
            LEFT JOIN seance se ON n.id_seance = se.id
            WHERE (
                -- Special logic for sonda and poll_end: if both group and section are set, match only group
                (
                    n.type_demande IN ('sonda', 'poll_end')
                    AND n.id_groupe IS NOT NULL
                    AND n.id_section IS NOT NULL
                    AND n.id_groupe = ?
                )
                OR
                -- Otherwise, match if seance's group/section or notification's group/section matches
                (
                    NOT (n.type_demande IN ('sonda', 'poll_end') AND n.id_groupe IS NOT NULL AND n.id_section IS NOT NULL)
                    AND (
                        (n.id_seance IS NOT NULL AND (se.id_groupe = ? OR se.id_section = ?))
                        OR
                        (n.id_seance IS NULL AND (n.id_groupe = ? OR n.id_section = ?))
                    )
                )
            )
            ORDER BY n.DateTime DESC
            LIMIT 10
        `;
        db.query(
            notifSql,
            [id_groupe, id_groupe, id_section, id_groupe, id_section],
            (err, notifs) => {
                if (err) return res.status(500).json({ error: "DB error" });
                res.json(Array.isArray(notifs) ? notifs : []);
            }
        );
    });
});

// For notification page (all notifications)
app.get('/api/student/all-notifications', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const studentId = req.session.user.id;
    // Get student's group and section
    const sql = `
        SELECT e.id_groupe, g.id_section
        FROM etudiant e
        JOIN groupe g ON e.id_groupe = g.id
        WHERE e.id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (!results || results.length === 0) return res.json([]);
        const { id_groupe, id_section } = results[0];
        const notifSql = `
            SELECT 
                n.*,
                se.Jour AS original_jour,
                se.horaire AS original_horaire,
                se.id_salle AS original_salle,
                se.type_Seance AS original_type,
                se.id_module AS original_module,
                se.id_section AS original_section,
                se.id_groupe AS original_group,
                ens.nom AS teacher_nom,
                ens.prenom AS teacher_prenom
            FROM notifEnsEtu n
            LEFT JOIN seance se ON n.id_seance = se.id
            LEFT JOIN enseignant ens ON n.id_enseignant = ens.id
            WHERE (
                (
                    n.type_demande IN ('sonda', 'poll_end')
                    AND n.id_groupe IS NOT NULL
                    AND n.id_section IS NOT NULL
                    AND n.id_groupe = ?
                )
                OR
                (
                    NOT (n.type_demande IN ('sonda', 'poll_end') AND n.id_groupe IS NOT NULL AND n.id_section IS NOT NULL)
                    AND (
                        (n.id_seance IS NOT NULL AND (se.id_groupe = ? OR se.id_section = ?))
                        OR
                        (n.id_seance IS NULL AND (n.id_groupe = ? OR n.id_section = ?))
                    )
                )
            )
            ORDER BY n.DateTime DESC
        `;
        db.query(
            notifSql,
            [id_groupe, id_groupe, id_section, id_groupe, id_section],
            (err, notifs) => {
                if (err) return res.status(500).json({ error: "DB error" });
                res.json(Array.isArray(notifs) ? notifs : []);
            }
        );
    });
});

// Notification page route for students
app.get('/NotificationEtu', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('notificationPage2', { 
        user: req.session.user,
        layout: false
    });
});

// Mark all student notifications as seen (for the logged-in student)
app.post('/api/student/mark-seenbyetu/all', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const studentId = req.session.user.id;
  // Get student's group and section
  const sql = `
    SELECT e.id_groupe, g.id_section
    FROM etudiant e
    JOIN groupe g ON e.id_groupe = g.id
    WHERE e.id = ?
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err || results.length === 0) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    const { id_groupe, id_section } = results[0];
    // Update all notifications for this group or section, or linked by id_seance
    const updateSql = `
      UPDATE notifEnsEtu n
      LEFT JOIN seance s ON n.id_seance = s.id
      SET n.seenbyetu = 1
      WHERE 
        (n.id_groupe = ? OR n.id_section = ?)
        OR (n.id_seance IS NOT NULL AND (s.id_groupe = ? OR s.id_section = ?))
    `;
    db.query(updateSql, [id_groupe, id_section, id_groupe, id_section], (err2, result) => {
      if (err2) {
        console.error("Database error:", err2);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    });
  });
});

// Mark a single student notification as seen (for the logged-in student)
app.post('/api/student/mark-seenbyetu/:id', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const notificationId = req.params.id;
  const studentId = req.session.user.id;

  // Get student's group and section
  const sql = `
    SELECT e.id_groupe, g.id_section
    FROM etudiant e
    JOIN groupe g ON e.id_groupe = g.id
    WHERE e.id = ?
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err || results.length === 0) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    const { id_groupe, id_section } = results[0];
    // Update only if the notification is for this group/section or linked by id_seance
    const updateSql = `
      UPDATE notifEnsEtu n
      LEFT JOIN seance s ON n.id_seance = s.id
      SET n.seenbyetu = 1
      WHERE n.id = ?
        AND (
          (n.id_groupe = ? OR n.id_section = ?)
          OR (n.id_seance IS NOT NULL AND (s.id_groupe = ? OR s.id_section = ?))
        )
    `;
    db.query(updateSql, [notificationId, id_groupe, id_section, id_groupe, id_section], (err2, result) => {
      if (err2) {
        console.error("Database error:", err2);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    });
  });
});


// Get section info
app.get('/api/section-info/:id', (req, res) => {
    const sectionId = req.params.id;
    const sql = "SELECT Nom FROM section WHERE id = ?";
    db.query(sql, [sectionId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Section not found" });
        }
        res.json(results[0]);
    });
});

// Get group info
app.get('/api/group-info/:id', (req, res) => {
    const groupId = req.params.id;
    const sql = "SELECT num_Grp FROM groupe WHERE id = ?";
    db.query(sql, [groupId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.json(results[0]);
    });
});

// GET /events/intero-sessions?target=group|section&which=my|other&groupId=...&sectionId=...
app.get('/events/intero-sessions', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not authenticated" });

    const { target, which, groupId, sectionId } = req.query;
    const teacherId = req.session.user.id;

    let sql = '';
    let params = [];

    if (target === 'group' && which === 'my') {
        sql = `SELECT * FROM seance WHERE id_enseignant = ? AND id_groupe = ? AND id_section IS NULL`;
        params = [teacherId, groupId];
    } else if (target === 'group' && which === 'other') {
        sql = `SELECT * FROM seance WHERE id_groupe = ? AND id_enseignant <> ? AND id_section IS NULL`;
        params = [groupId, teacherId];
    } else if (target === 'section' && which === 'my') {
        sql = `SELECT * FROM seance WHERE id_enseignant = ? AND id_section = ? AND id_groupe IS NULL`;
        params = [teacherId, sectionId];
    } else if (target === 'section' && which === 'other') {
        sql = `SELECT * FROM seance WHERE id_section = ? AND id_enseignant <> ? AND id_groupe IS NULL`;
        params = [sectionId, teacherId];
    } else {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Get interrogation events for teacher
app.get('/api/teacher/intero-events', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const teacherId = req.session.user.id;
    
    const sql = `
        SELECT 
            se.*,
            m.nom_C AS module_name,
            g.num_Grp AS group_number,
            sec.Nom AS section_name
        FROM 
            seance se
        LEFT JOIN 
            module m ON se.id_module = m.id
        LEFT JOIN 
            groupe g ON se.id_groupe = g.id
        LEFT JOIN 
            section sec ON g.id_section = sec.id OR se.id_section = sec.id
        WHERE 
            se.exp_intero IS NOT NULL
            AND (se.id_enseignant = ? OR se.id IN (
                SELECT id_seance FROM notifAdmEns 
                WHERE type_demande = 'demIntero' 
                AND status = 1 
                AND id_enseignant = ?
            ))
        ORDER BY 
            se.exp_intero ASC
    `;

    db.query(sql, [teacherId, teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});






//Admin
// Get filtered notifications for admin
app.get('/api/admin/notificationsAD', (req, res) => {
    const { teacher, level, section, group, status } = req.query;
    let sql = `
        SELECT 
            n.*, 
            e.nom AS teacher_nom, 
            e.prenom AS teacher_prenom,
            -- Level: from section (notif or seance or group->section)
            COALESCE(sp.id_niveau, sp2.id_niveau, sp3.id_niveau) AS id_niveau,
            -- Section: from notif, seance, or group->section
            COALESCE(sec.Nom, sec2.Nom, sec3.Nom) AS section_name,
            -- Group: from notif or seance
            COALESCE(g.num_Grp, g2.num_Grp) AS group_number,
            -- For ajout requests, get section info from groupe if id_groupe is provided
            CASE 
                WHEN n.type_demande = 'ajout' AND n.id_groupe IS NOT NULL THEN 
                    (SELECT s.Nom FROM section s JOIN groupe g ON s.id = g.id_section WHERE g.id = n.id_groupe)
                ELSE NULL
            END AS ajout_section_name,
            -- For ajout requests, get level info from groupe if id_groupe is provided
            CASE 
                WHEN n.type_demande = 'ajout' AND n.id_groupe IS NOT NULL THEN 
                    (SELECT sp.id_niveau FROM section s 
                     JOIN specialite sp ON s.id_spec = sp.id 
                     JOIN groupe g ON s.id = g.id_section 
                     WHERE g.id = n.id_groupe)
                ELSE NULL
            END AS ajout_level
        FROM notifAdmEns n
        LEFT JOIN enseignant e ON n.id_enseignant = e.id
        LEFT JOIN section sec ON n.id_section = sec.id
        LEFT JOIN specialite sp ON sec.id_spec = sp.id
        LEFT JOIN groupe g ON n.id_groupe = g.id
        LEFT JOIN seance se ON n.id_seance = se.id
        LEFT JOIN section sec2 ON se.id_section = sec2.id
        LEFT JOIN specialite sp2 ON sec2.id_spec = sp2.id
        LEFT JOIN groupe g2 ON se.id_groupe = g2.id
        LEFT JOIN section sec3 ON g2.id_section = sec3.id
        LEFT JOIN specialite sp3 ON sec3.id_spec = sp3.id
        WHERE n.type_demande IN ('ajout', 'modif', 'supp', 'demIntero')
    `;
    const params = [];
    if (teacher) {
        sql += " AND (e.nom LIKE ? OR e.prenom LIKE ?)";
        params.push(`%${teacher}%`, `%${teacher}%`);
    }
    if (level) {
        sql += " AND COALESCE(sp.id_niveau, sp2.id_niveau, sp3.id_niveau, ajout_level) = ?";
        params.push(level);
    }
    if (section) {
        sql += " AND COALESCE(sec.Nom, sec2.Nom, sec3.Nom, ajout_section_name) = ?";
        params.push(section);
    }
    if (group) {
        sql += " AND COALESCE(g.num_Grp, g2.num_Grp) = ?";
        params.push(group);
    }
    if (status && status !== 'all') {
        if (status === 'pending') {
            sql += " AND (n.status IS NULL OR (n.status NOT IN (0,1,2)))";
        } else if (status === '1') {
            sql += " AND n.status IN (1,2)";
        } else if (status === '0') {
            sql += " AND n.status = 0";
        }
    }
    sql += " ORDER BY n.DateTime DESC";
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        
        // Process the results to combine the section and level information
        const processedResults = results.map(row => {
            return {
                ...row,
                section_name: row.section_name || row.ajout_section_name,
                id_niveau: row.id_niveau || row.ajout_level
            };
        });
        
        res.json(processedResults);
    });
});

// Accept/Reject notification
app.post('/api/admin/notificationsAD/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (![0, 1].includes(Number(status))) return res.status(400).json({ error: "Invalid status" });
    db.query("UPDATE notifAdmEns SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ success: true });
    });
});

// Add these new endpoints in app.js (somewhere with other admin routes)

// Get admin notifications
app.get('/api/admin/notifications', (req, res) => {
  const sql = `
    SELECT 
      n.*, 
      e.nom AS teacher_nom, 
      e.prenom AS teacher_prenom,
      sp.id_niveau AS level,
      sec.Nom AS section_name,
      g.num_Grp AS group_number
    FROM notifAdmEns n
    LEFT JOIN enseignant e ON n.id_enseignant = e.id
    LEFT JOIN section sec ON n.id_section = sec.id
    LEFT JOIN specialite sp ON sec.id_spec = sp.id
    LEFT JOIN groupe g ON n.id_groupe = g.id
    WHERE n.type_demande IN ('ajout', 'modif', 'supp', 'demIntero', 'abse', 'tempo', 'intero')
    ORDER BY n.DateTime DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Mark single notification as seen (status = -1)
app.post('/api/admin/mark-seen/:id', (req, res) => {
  const notificationId = req.params.id;
  const sql = "UPDATE notifAdmEns SET status = -1 WHERE id = ? AND (status IS NULL OR status = -1)";
  
  db.query(sql, [notificationId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});

// Mark all notifications as seen (status = -1)
app.post('/api/admin/mark-all-seen', (req, res) => {
  const sql = "UPDATE notifAdmEns SET status = -1 WHERE type_demande IN ('ajout', 'modif', 'supp', 'demIntero', 'abse')";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});


app.get('/NotificationAdm', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    res.render('notificationPage3', { 
        user: req.session.user,
        layout: false // If you're using a layout system
    });
});
//end admin


// ...existing code...

app.get('/api/student/evenement', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const studentId = req.session.user.id;
    const sql = `
        SELECT e.id_groupe, g.id_section
        FROM etudiant e
        JOIN groupe g ON e.id_groupe = g.id
        WHERE e.id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err || results.length === 0) return res.json({ sessions: [] });
        const { id_groupe, id_section } = results[0];
        const seanceSql = `
            SELECT 
                se.*, 
                m.nom_C AS module_name,
                ens.nom AS teacher_nom,
                ens.prenom AS teacher_prenom
            FROM seance se
            LEFT JOIN module m ON se.id_module = m.id
            LEFT JOIN enseignant ens ON se.id_enseignant = ens.id
            WHERE 
                se.exp_intero IS NOT NULL
                AND (
                    (se.id_groupe = ?) OR 
                    (se.id_section = ? AND se.type_Seance = 'LECTURE')
                )
            ORDER BY se.exp_intero ASC
        `;
        db.query(seanceSql, [id_groupe, id_section], (err, sessions) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ sessions });
        });
    });
});

app.get('/api/student/section-group', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const userId = req.session.user.id;
    const sql = `
      SELECT e.id, e.nom, e.prenom, e.date_nec, e.email, g.id AS group_id, g.num_Grp AS group_number, s.Nom AS section_name
      FROM etudiant e
      JOIN groupe g ON e.id_groupe = g.id
      JOIN section s ON g.id_section = s.id
      WHERE e.id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Student not found" });
        res.json(results[0]);
    });
});


app.get('/api/teacher/exams-timetable', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const teacherId = req.session.user.id;
    const sql = `
SELECT 
    ex.day,
    ex.time,
    ex.id_module,
    m.nom_C AS module_name,
    sp.abr AS specialite,
    sp.id_niveau AS level,
    es.id_salle
FROM etu_ens_salle e
JOIN examen_salle es ON e.id_examen = es.id_examen AND e.id_salle = es.id_salle
JOIN examen ex ON es.id_examen = ex.id
JOIN module m ON ex.id_module = m.id
JOIN specialite sp ON ex.id_spec = sp.id
WHERE e.id_enseignant = ?
ORDER BY STR_TO_DATE(ex.day, '%d/%m/%Y'), ex.time
    `;
    db.query(sql, [teacherId], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


app.get('/api/student/exams-timetable', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const studentId = req.session.user.id;
    const sql = `
SELECT 
    ex.day,
    ex.time,
    ex.id_module,
    m.nom_C AS module_name,
    sp.abr AS specialite,
    sp.id_niveau AS level,
    es.id_salle
FROM etu_ens_salle e
JOIN examen_salle es ON e.id_examen = es.id_examen AND e.id_salle = es.id_salle
JOIN examen ex ON es.id_examen = ex.id
JOIN module m ON ex.id_module = m.id
JOIN specialite sp ON ex.id_spec = sp.id
WHERE e.id_etudiant = ?
ORDER BY STR_TO_DATE(ex.day, '%d/%m/%Y'), ex.time
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});
// ENDING OF GETTING DATA FOR FORMS


















































// BEGINING OF SENDING DATA FROM FORMS TO DATABASE

// BEGGING OF beAddSession.js PART 2
app.post("/submit", (req, res) => {
    try {
        // Set consistent JSON response type
        res.setHeader('Content-Type', 'application/json');

        console.log('Received submission:', req.body);

        // Authentication check
        if (!req.session.user) {
            return res.status(401).json({
                success: false,
                error: "Not authenticated",
                message: "Please log in to submit sessions"
            });
        }

        const {
            Frequence,
            Jour,
            horaire,
            type_Seance,
            id_module,
            id_section,
            id_groupe,
            id_salle,
            isOnline
        } = req.body;

        const teacherId = req.session.user.id;

        // Validate required fields
        if (!Frequence || !Jour || !horaire || !type_Seance || !id_module) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                message: "Please fill all required fields",
                required: ["Frequence", "Jour", "horaire", "type_Seance", "id_module"]
            });
        }

        // Validate room selection for physical sessions
        if (!isOnline && !id_salle) {
            return res.status(400).json({
                success: false,
                error: "Room required",
                message: "Please select a room for physical sessions"
            });
        }

        // Validate academic structure
        if (type_Seance === "LECTURE" && !id_section) {
            return res.status(400).json({
                success: false,
                error: "Section required",
                message: "Lecture sessions require a section selection"
            });
        }

        if ((type_Seance === "TUTORIAL" || type_Seance === "LAB") && !id_groupe) {
            return res.status(400).json({
                success: false,
                error: "Group required",
                message: "Tutorial/Lab sessions require a group selection"
            });
        }

        // Prepare session data
        const sessionData = {
            horaire,
            Jour,
            type_Seance,
            id_salle: isOnline ? null : id_salle,
            id_enseignant: teacherId,
            id_module,
            id_section: type_Seance === "LECTURE" ? id_section : null,
            id_groupe: type_Seance === "LECTURE" ? null : id_groupe,
            expiration_date: Frequence === "Exepcionnel"
        };

        // Handle different frequency types
        if (Frequence === "Hebdomadaire") {
            // Weekly session - requires admin approval
            const sql = `
    INSERT INTO notifAdmEns 
    (NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
     id_module, id_section, id_groupe, type_demande, status)
    VALUES ('Enseignant', NOW(), ?, ?, ?, ?, ?, ?, ?, ?, 'ajout', NULL)
`;
            const params = [
                sessionData.horaire,
                sessionData.Jour,
                sessionData.type_Seance,
                sessionData.id_salle,
                sessionData.id_enseignant,
                sessionData.id_module,
                sessionData.id_section,
                sessionData.id_groupe
            ];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({
                        success: false,
                        error: "Database error",
                        message: "An error occurred while submitting the session"
                    });
                }

                return res.json({
                    success: true,
                    message: "Weekly session submitted for admin approval",
                    data: {
                        notificationId: result.insertId
                    }
                });
            });

        } else if (Frequence === "Exepcionnel") {
    // One-time session - immediate creation
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // First, insert into notifAdmEns
    const notifSql = `
        INSERT INTO notifAdmEns 
        (NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
         id_module, id_section, id_groupe, type_demande, status)
        VALUES ('Enseignant',NOW(), ?, ?, ?, ?, ?, ?, ?, ?, 'tempo', NULL)
    `;
    const notifParams = [
        sessionData.horaire,
        sessionData.Jour,
        sessionData.type_Seance,
        sessionData.id_salle,
        sessionData.id_enseignant,
        sessionData.id_module,
        sessionData.id_section,
        sessionData.id_groupe
    ];

    db.query(notifSql, notifParams, (notifErr, notifResult) => {
        if (notifErr) {
            console.error("Database error (notifAdmEns):", notifErr);
            return res.status(500).json({
                success: false,
                error: "Database error",
                message: "An error occurred while creating the notification"
            });
        }

        // Also insert into notifEnsEtu
        const notifSqlEtu = `
            INSERT INTO notifEnsEtu 
            (NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
             id_module, id_section, id_groupe, type_demande, status)
            VALUES ('Enseignant',NOW(), ?, ?, ?, ?, ?, ?, ?, ?, 'tempo', NULL)
        `;
        db.query(notifSqlEtu, notifParams, (notifErrEtu, notifResultEtu) => {
            if (notifErrEtu) {
                console.error("Database error (notifEnsEtu):", notifErrEtu);
                // Continue anyway, just log the error
            }

            // Now insert into seance
            const sql = `
                INSERT INTO seance 
                (horaire, Jour, type_Seance, id_salle, id_enseignant, 
                 id_module, id_section, id_groupe, expiration_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                sessionData.horaire,
                sessionData.Jour,
                sessionData.type_Seance,
                sessionData.id_salle,
                sessionData.id_enseignant,
                sessionData.id_module,
                sessionData.id_section,
                sessionData.id_groupe,
                expirationDate
            ];

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.error("Database error (seance):", err);
                    return res.status(500).json({
                        success: false,
                        error: "Database error",
                        message: "An error occurred while creating the session"
                    });
                }

                // Optionally, update notifAdmEns with the new session id
                const sessionId = result.insertId;
                db.query(
                    "UPDATE notifAdmEns SET id_seance = ? WHERE id = ?",
                    [sessionId, notifResult.insertId],
                    () => {} // ignore errors here for simplicity
                );

                return res.json({
                    success: true,
                    message: "Temporary session created successfully",
                    data: {
                        sessionId: sessionId,
                        expires: expirationDate.toISOString()
                    }
                });
            });
        });
    });
} else {
            return res.status(400).json({
                success: false,
                error: "Invalid frequency",
                message: "Please select either Weekly or One-time frequency"
            });
        }

    } catch (error) {
        console.error("Submission error:", error);

        // Handle specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                error: "Conflict",
                message: "This time slot is already booked",
                details: "Please choose a different time or room"
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            error: "Server error",
            message: "An error occurred while processing your request",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// ENDING OF beAddSession.js PART 2

// BEGINING OF DELETE SESSION
app.delete('/delete-session/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const sessionId = req.params.id;
    const teacherId = req.session.user.id;

    const verifySql = "SELECT id, expiration_date FROM seance WHERE id = ? AND id_enseignant = ?";
    db.query(verifySql, [sessionId, teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Session not found or not authorized" });
        }

        const session = results[0];
        const isTemporary = session.expiration_date !== null;

        if (isTemporary) {
            // First delete any notifAdmEns rows referencing this session
            const deleteNotifSql = "DELETE FROM notifAdmEns WHERE id_seance = ?";
            db.query(deleteNotifSql, [sessionId], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error while deleting notification" });
                }

                // Then delete the session itself
                const deleteSessionSql = "DELETE FROM seance WHERE id = ?";
                db.query(deleteSessionSql, [sessionId], (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ error: "Database error while deleting session" });
                    }

                    res.json({
                        success: true,
                        message: "Temporary session deleted successfully"
                    });
                });
            });
        } else {
            // Regular session - insert request into notifAdmEns
            const insertNotifSql = `
    INSERT INTO notifAdmEns 
    (id_seance, NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
     id_module,  id_section, id_groupe, type_demande, status)
    VALUES (?, 'Enseignant', NOW(), NULL, NULL, NULL, NULL, ?, NULL, NULL, NULL, 'supp', NULL)
`;
            db.query(insertNotifSql, [sessionId, teacherId], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error while inserting notification" });
                }

                res.json({
                    success: true,
                    message: "Delete request submitted for admin approval"
                });
            });
        }
    });
});

//ENDING OF DELETE SESSION



// BEGINING OF NOTIFY ABSENCE
app.post('/mark-absence/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const sessionId = req.params.id;
    const teacherId = req.session.user.id;
    const { reason } = req.body;

    // Get session info to fetch group/section for notification
    const sessionSql = 'SELECT id_section, id_groupe FROM seance WHERE id = ? AND id_enseignant = ?';
    db.query(sessionSql, [sessionId, teacherId], (err, sessionResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!sessionResults || sessionResults.length === 0) {
            return res.status(404).json({ error: 'Session not found or not authorized' });
        }

        const { id_section, id_groupe } = sessionResults[0];

        // Insert the absence into the notifAdmEns table
        const insertSqlAdm = `
            INSERT INTO notifAdmEns 
            (id_seance, NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
             id_module, id_section, id_groupe, type_demande, status, multipurpose)
            VALUES (?, 'Enseignant', NOW(), NULL, NULL, NULL, NULL, ?, NULL, ?, ?, 'abse', NULL, ?)
        `;
        db.query(insertSqlAdm, [sessionId, teacherId, id_section, id_groupe, reason || 'Absence marked'], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Also insert into notifEnsEtu for students
            const insertSqlEtu = `
                INSERT INTO notifEnsEtu 
                (id_seance, NotifFrom, DateTime, horaire, Jour, type_Seance, id_salle, id_enseignant, 
                 id_module, id_section, id_groupe, type_demande, status, multipurpose)
                VALUES (?, 'Enseignant', NOW(), NULL, NULL, NULL, NULL, ?, NULL, ?, ?, 'abse', NULL, ?)
            `;
            db.query(insertSqlEtu, [sessionId, teacherId, id_section, id_groupe, reason || 'Absence marked'], (err2, result2) => {
                if (err2) {
                    console.error('Database error (notifEnsEtu):', err2);
                    // Still return success for admin notification
                    return res.json({ 
                        success: true, 
                        message: 'Absence marked for admin, but not for students.' 
                    });
                }

                res.json({ success: true, message: 'Absence marked successfully.' });
            });
        });
    });
});
// ENDING OF NOTIFY ABSENCE



//BEGINING OF MODIFY SEANCE
app.post('/modify-session/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const sessionId = req.params.id;
    const { Jour, horaire, type_Seance, id_salle } = req.body;
    const teacherId = req.session.user.id;

    // First, verify the session belongs to this teacher
    const verifySql = "SELECT id FROM seance WHERE id = ? AND id_enseignant = ?";
    db.query(verifySql, [sessionId, teacherId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Session not found or not authorized" });
        }

        // Create a notification for admin approval
        const insertNotifSql = `
    INSERT INTO notifAdmEns 
    (id_seance, NotifFrom, DateTime, horaire, Jour, id_salle, id_enseignant, type_Seance, type_demande, status)
    VALUES (?, 'Enseignant', NOW(), ?, ?, ?, ?, ?, 'modif', NULL)
`;
        
        db.query(insertNotifSql, [sessionId, horaire, Jour, id_salle, teacherId, type_Seance], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({ 
                success: true, 
                message: "Modification request submitted for admin approval" 
            });
        });
    });
});

//SESSION TYPE RETREIVAL FOR MODIFY SESSION
app.get('/api/session-type/:id', (req, res) => {
    const sessionId = req.params.id;

    const sql = "SELECT type_Seance FROM seance WHERE id = ?";
    db.query(sql, [sessionId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json({ type_Seance: results[0].type_Seance });
    });
});


// SESSION FULL DATA RETRIEVAL FOR MODIFY SESSION
app.get('/api/session-data/:id', (req, res) => {
    const sessionId = req.params.id;
    const sql = "SELECT * FROM seance WHERE id = ?";
    db.query(sql, [sessionId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.json(results[0]);
    });
});


app.get('/api/teacher/available-times-modify', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { day, moduleId, groupId, sectionId, sessionId } = req.query;
    const teacherId = req.session.user.id;

    if (!day || (!groupId && !sectionId) || !sessionId) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const allSlots = ['1st Session', '2nd Session', '3rd Session', '4th Session', '5th Session'];
    const isLecture = sectionId && !groupId;

    let occupiedSql = `
        SELECT DISTINCT horaire 
        FROM seance 
        WHERE Jour = ? AND (
    `;
    const params = [day];

    if (isLecture) {
        // Section: exclude if section or any group in section is busy, or teacher is busy
        occupiedSql += `
            (id_section = ?) 
            OR (id_groupe IN (SELECT id FROM groupe WHERE id_section = ?))
            OR (id_enseignant = ?)
        `;
        params.push(sectionId, sectionId, teacherId);
    } else {
        // Group: exclude if group or its section is busy, or teacher is busy
        occupiedSql += `
            (id_groupe = ?) 
            OR (id_section = (SELECT id_section FROM groupe WHERE id = ?))
            OR (id_enseignant = ?)
        `;
        params.push(groupId, groupId, teacherId);
    }

    occupiedSql += `) AND id <> ?`;
    params.push(sessionId);

    db.query(occupiedSql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        const occupiedSlots = results.map(r => r.horaire);
        const availableSlots = allSlots.filter(slot => !occupiedSlots.includes(slot));
        res.json({ availableSlots });
    });
});



//ENDING OF MODIFY SEANCE

//BEGINIG OF SHOW REQUEST IN TABLE
app.delete('/api/user/cancel-request/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const teacherId = req.session.user.id;
    const requestId = req.params.id;
    // Only allow deleting your own requests and only if status is NULL
    const sql = "DELETE FROM notifAdmEns WHERE id = ? AND id_enseignant = ? AND status IS NULL";
    db.query(sql, [requestId, teacherId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Cannot cancel this request" });
        }
        res.json({ success: true });
    });
});
//ENDING OF SHOW REQUEST IN TABLE


// POST /events/create-intero
app.post('/events/create-intero', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not authenticated" });

    const { target, which, sessionId, exp_intero } = req.body;
    const teacherId = req.session.user.id;

    if (!target || !which || !sessionId || !exp_intero) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    if (which === 'my') {
    // Update seance.exp_intero
    const sql = `UPDATE seance SET exp_intero = ? WHERE id = ? AND id_enseignant = ?`;
    db.query(sql, [exp_intero, sessionId, teacherId], (err, result) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Not allowed or session not found" });
        }
        // Insert notification for "intero" (admin)
        const notifSql = `
            INSERT INTO notifAdmEns 
            (id_seance, NotifFrom, DateTime, id_enseignant, type_demande, status)
            VALUES (?, 'Enseignant', NOW(), ?, 'intero', NULL)
        `;
        db.query(notifSql, [sessionId, teacherId], (err2) => {
            if (err2) {
                console.error("DB error (notifAdmEns intero):", err2);
                return res.status(500).json({ error: "Database error" });
            }
            // Insert notification for "intero" (students)
            const notifSqlEtu = `
                INSERT INTO notifEnsEtu 
                (id_seance, NotifFrom, DateTime, id_enseignant, type_demande, status)
                VALUES (?, 'Enseignant', NOW(), ?, 'intero', NULL)
            `;
            db.query(notifSqlEtu, [sessionId, teacherId], (err3) => {
                if (err3) {
                    console.error("DB error (notifEnsEtu intero):", err3);
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ success: true, message: "Interrogation set for your session" });
            });
        });
    });
} else if (which === 'other') {
        // Send request via notifAdmEns (type_demande: 'demIntero')
        // Get session info for notification
        db.query(`SELECT * FROM seance WHERE id = ?`, [sessionId], (err, sessions) => {
            if (err || !sessions || sessions.length === 0) {
                return res.status(404).json({ error: "Session not found" });
            }
            const s = sessions[0];
            const notifSql = `
                INSERT INTO notifAdmEns
                (id_seance, NotifFrom, DateTime, id_enseignant, id_module, id_section, id_groupe, type_Seance, type_demande, multipurpose, status)
                VALUES (?, 'Enseignant', NOW(), ?, ?, ?, ?, ?, 'demIntero', ?, NULL)
            `;
            db.query(
                notifSql,
                [
                    sessionId,
                    teacherId,
                    s.id_module,
                    s.id_section,
                    s.id_groupe,
                    s.type_Seance,
                    exp_intero
                ],
                (err2) => {
                    if (err2) {
                        console.error("DB error (notifAdmEns demIntero):", err2);
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.json({ success: true, message: "Request sent for interrogation on other's session" });
                }
            );
        });
    } else {
        res.status(400).json({ error: "Invalid 'which' value" });
    }
});

// Add this route among your teacher routes
app.post('/api/teacher/cancel-event', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const { eventId } = req.body;
    if (!eventId) {
        return res.status(400).json({ error: "Event id is required" });
    }
    const teacherId = req.session.user.id;
    const sql = "UPDATE seance SET exp_intero = NULL WHERE id = ? AND id_enseignant = ?";
    db.query(sql, [eventId, teacherId], (err, result) => {
        if (err) {
            console.error("Error cancelling event:", err);
            return res.status(500).json({ error: "Error cancelling event" });
        }
        return res.json({ success: true });
    });
});

app.post('/auth/update-emailPro', (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  const { emailPro } = req.body;
  if (!emailPro || !/^[^@]+@[^@]+\.[^@]+$/.test(emailPro)) {
    return res.json({ success: false, message: "Invalid email" });
  }
  db.query(
    "UPDATE enseignant SET emailPro = ? WHERE id = ?",
    [emailPro, req.session.user.id],
    (err) => {
      if (err) return res.json({ success: false, message: "DB error" });
      req.session.user.emailPro = emailPro; // update session
      res.json({ success: true });
    }
  );
});

app.post('/auth/update-emailPro-student', (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  const { emailPro } = req.body;
  if (!emailPro || !/^[^@]+@[^@]+\.[^@]+$/.test(emailPro)) {
    return res.json({ success: false, message: "Invalid email" });
  }
  db.query(
    "UPDATE etudiant SET emailPro = ? WHERE id = ?",
    [emailPro, req.session.user.id],
    (err) => {
      if (err) return res.json({ success: false, message: "DB error" });
      req.session.user.emailPro = emailPro; // update session
      res.json({ success: true });
    }
  );
});
// ENDING OF SENDING DATA FROM FORMS TO DATABASE

// ...existing code...

// Get student preferences
app.get('/api/student/preferences', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const sql = "SELECT displayRequests, language FROM EtuPreferences WHERE id_etudiant = ?";
    db.query(sql, [req.session.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({
            displayRequests: results[0]?.displayRequests === 1,
            language: results[0]?.language || 'en'
        });
    });
});

// Update student preferences
app.post('/api/student/preferences', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

    const { displayRequests, language } = req.body;
    const sql = `
        INSERT INTO EtuPreferences (id_etudiant, displayRequests, language)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE displayRequests = VALUES(displayRequests), language = VALUES(language)
    `;
    db.query(sql, [req.session.user.id, displayRequests ? 1 : 0, language || 'en'], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ success: true });
    });
});