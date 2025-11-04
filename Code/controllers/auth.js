const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Helper function to validate and sanitize table names
const getValidTableName = (cle) => {
    if (cle.startsWith('#AD')) return 'admin';
    if (cle.startsWith('#PR')) return 'enseignant';
    if (cle.startsWith('#ET')) return 'etudiant';
    return null;
};

exports.register = (req, res) => {
    const { nom, prenom, email, password, cle } = req.body;

    // Validate cle format
    const clePattern = /^#(AD|PR|ET)[a-zA-Z0-9]{12}$/;
    if (!clePattern.test(cle)) {
        return res.status(400).json({ error: 'Invalid cle format. Must start with #AD, #PR, or #ET followed by 12 alphanumeric characters.' });
    }

    if (!nom || !prenom || !email || !password || !cle) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const tableName = getValidTableName(cle);
    if (!tableName) {
        return res.status(400).json({ error: 'Invalid cle format' });
    }

    // Check if email exists
    const emailCheckQuery = `SELECT * FROM ${tableName} WHERE email = ?`;
    db.query(emailCheckQuery, [email], async (err, emailResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (emailResults.length > 0) {
            return res.status(400).render('Signup', { error: 'User has already signed up' });
        }

        // Check if the record exists
        const checkQuery = `SELECT * FROM ${tableName} WHERE nom = ? AND prenom = ? AND cle = ?`;
        db.query(checkQuery, [nom, prenom, cle], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (results.length === 0) {
                return res.status(400).render('Signup', { error: 'No matching record found' });
            }

            // Hash password and update record
            try {
                const hashedPassword = await bcrypt.hash(password, 8);
                const updateQuery = `UPDATE ${tableName} SET email = ?, password = ?, cle = NULL WHERE nom = ? AND prenom = ? AND cle = ?`;
                
                db.query(updateQuery, [email, hashedPassword, nom, prenom, cle], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to update record' });
                    }
                    res.redirect('/');
                });
            } catch (hashError) {
                console.error(hashError);
                return res.status(500).json({ error: 'Password hashing failed' });
            }
        });
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Only allow enseignant and etudiant here
    const tables = [
        { name: 'enseignant', redirect: '/index', role: 'enseignant' },
        { name: 'etudiant', redirect: '/index2', role: 'etudiant' }
    ];

    try {
        for (const table of tables) {
            const query = `SELECT * FROM ${table.name} WHERE email = ?`;
            const results = await new Promise((resolve, reject) => {
                db.query(query, [email], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (results.length > 0) {
                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    // For teachers: Get modules, sections, and groups
                    if (table.name === 'enseignant') {
                        let modules = [];
                        let sections = [];
                        let groups = [];
                        
                        // Get modules
                        const modulesQuery = `
                            SELECT m.nom_C 
                            FROM module m
                            JOIN enseignant_module em ON m.id = em.id_module
                            WHERE em.id_enseignant = ?
                        `;
                        modules = await new Promise((resolve, reject) => {
                            db.query(modulesQuery, [user.id], (err, results) => {
                                if (err) reject(err);
                                else resolve(results.map(r => r.nom_C));
                            });
                        });

                        // Get sections
                        const sectionsQuery = `
                            SELECT DISTINCT sec.Nom 
                            FROM seance se
                            JOIN section sec ON se.id_section = sec.id
                            WHERE se.id_enseignant = ?
                        `;
                        sections = await new Promise((resolve, reject) => {
                            db.query(sectionsQuery, [user.id], (err, results) => {
                                if (err) reject(err);
                                else resolve(results.map(r => r.Nom));
                            });
                        });

                        // Get groups
                        const groupsQuery = `
                            SELECT DISTINCT g.num_Grp 
                            FROM seance se
                            JOIN groupe g ON se.id_groupe = g.id
                            WHERE se.id_enseignant = ?
                        `;
                        groups = await new Promise((resolve, reject) => {
                            db.query(groupsQuery, [user.id], (err, results) => {
                                if (err) reject(err);
                                else resolve(results.map(r => `G${r.num_Grp}`));
                            });
                        });

                        req.session.user = {
                            id: user.id,
                            email: user.email,
                            nom: user.nom,
                            prenom: user.prenom,
                            role: table.role,
                            displayRequests: user.displayRequests || false,
                            date_nec: user.date_nec,
                            grade: user.grade,
                            modules: modules,
                            sections: sections,
                            groups: groups
                        };
                        return res.redirect(table.redirect);
                    }
                    // For students: Get academic information
                    else if (table.name === 'etudiant') {
                        // Get student's academic info
                        const studentQuery = `
                            SELECT 
                                g.num_Grp AS group_number,
                                sec.Nom AS section_name,
                                sp.nom_C AS speciality_name,
                                sp.abr AS speciality_abbr,
                                n.nom_C AS level_name,
                                n.id AS level_id
                            FROM etudiant e
                            JOIN groupe g ON e.id_groupe = g.id
                            JOIN section sec ON g.id_section = sec.id
                            JOIN specialite sp ON sec.id_spec = sp.id
                            JOIN niveau n ON sp.id_niveau = n.id
                            WHERE e.id = ?
                        `;
                        
                        const studentInfo = await new Promise((resolve, reject) => {
                            db.query(studentQuery, [user.id], (err, results) => {
                                if (err) reject(err);
                                else resolve(results[0]);
                            });
                        });

                        req.session.user = {
                            id: user.id,
                            email: user.email,
                            nom: user.nom,
                            prenom: user.prenom,
                            role: table.role,
                            date_nec: user.date_nec,
                            level: studentInfo?.level_name || 'Not specified',
                            level_id: studentInfo?.level_id || '',
                            speciality: studentInfo?.speciality_name || 'Not specified',
                            speciality_abbr: studentInfo?.speciality_abbr || '',
                            section: studentInfo?.section_name || 'Not specified',
                            group: studentInfo ? `G${studentInfo.group_number}` : 'Not specified',
                            group_number: studentInfo?.group_number || ''
                        };
                        return res.redirect(table.redirect);
                    }
                }
            }
        }

        return res.status(400).render('login', { error: 'Invalid email or password' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Login failed' });
    }
};


exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const query = 'SELECT * FROM enseignant WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Password reset link sent' });
        } else {
            return res.status(400).json({ error: 'Email not found' });
        }
    });
};

exports.userInterface = (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const query = 'SELECT * FROM enseignant WHERE id = ?';
    db.query(query, [userId], async (error, results) => {
        if (error) {
            console.error("Error fetching user data:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect." });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "New passwords do not match." });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 8);
            const updateQuery = 'UPDATE enseignant SET password = ? WHERE id = ?';
            
            db.query(updateQuery, [hashedPassword, userId], (error) => {
                if (error) {
                    console.error("Error updating password:", error);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(200).json({ message: "Password updated successfully." });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

exports.userInterface2 = (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const query = 'SELECT * FROM etudiant WHERE id = ?';
    db.query(query, [userId], async (error, results) => {
        if (error) {
            console.error("Error fetching user data:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect." });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "New passwords do not match." });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 8);
            const updateQuery = 'UPDATE etudiant SET password = ? WHERE id = ?';
            
            db.query(updateQuery, [hashedPassword, userId], (error) => {
                if (error) {
                    console.error("Error updating password:", error);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(200).json({ message: "Password updated successfully." });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    });
};

// Add this to your auth.js

// Admin login first step (email + password)
exports.adminLoginStep1 = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const query = `SELECT * FROM admin WHERE email = ?`;
        const results = await new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Store partial auth in session
        req.session.adminAuthStep1 = {
            userId: user.id,
            email: user.email
        };

        res.json({ 
            success: true,
            message: 'Please enter your admin secret code'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Login failed' });
    }
};

// Admin login second step (secret code verification)
exports.adminLoginStep2 = async (req, res) => {
    if (!req.session.adminAuthStep1) {
        return res.status(401).json({ error: 'Authentication process not started' });
    }

    const { secretCode } = req.body;
    const { userId } = req.session.adminAuthStep1;

    if (!secretCode) {
        return res.status(400).json({ error: 'Secret code is required' });
    }

    try {
        const query = `SELECT * FROM admin WHERE id = ?`;
        const results = await new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Admin not found' });
        }

        const user = results[0];

        // Compare the secret code (use constant-time comparison)
        const isCodeValid = crypto.timingSafeEqual(
            Buffer.from(user.admin_secret || ''),
            Buffer.from(secretCode)
        );

        if (!isCodeValid) {
            return res.status(401).json({ error: 'Invalid secret code' });
        }

        // Full authentication successful
        req.session.user = {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: 'admin',
            date_nec: user.date_nec
        };

delete req.session.adminAuthStep1;

        let redirectUrl = 'http://192.168.175.93:3000/home.html';
        if (user.email === 'ouldAissa4589@gmail.com') {
            redirectUrl = 'http://192.168.175.93:3000/home.html'; // Change to your desired route for ouldAissa
        } else if (user.email === 'KamechAbdallah8763@gmail.com') {
            redirectUrl = 'http://192.168.175.93:3000/database.html'; // Change to your desired route for KamechAbdallah
        }
        res.json({ 
            success: true,
            redirect: redirectUrl
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Verification failed' });
    }
};