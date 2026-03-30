-- ============================================
-- Alumni Connect - MySQL Quick Reference
-- ============================================

-- 1. SELECT THE DATABASE
USE alumni_connect;

-- 2. SHOW ALL TABLES
SHOW TABLES;

-- 3. VIEW TABLE STRUCTURES
DESCRIBE users;
DESCRIBE alumnis;
DESCRIBE events;
DESCRIBE messages;

-- 4. VIEW ALL DATA FROM TABLES
SELECT * FROM users;
SELECT * FROM alumnis;
SELECT * FROM events;
SELECT * FROM messages;

-- 5. COUNT RECORDS
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_alumni FROM alumnis;

-- 6. VIEW RECENT REGISTRATIONS
SELECT id, fullName, collegeEmail, graduationYear, createdAt 
FROM users 
ORDER BY createdAt DESC 
LIMIT 10;

-- 7. SEARCH USER BY EMAIL
SELECT * FROM users WHERE collegeEmail = 'your@email.com';

-- 8. VIEW USER WITH PROFILE DETAILS
SELECT id, fullName, collegeEmail, course, usn, fieldOfStudy, linkedin, github
FROM users;

-- 9. DELETE SPECIFIC USER (use with caution)
-- DELETE FROM users WHERE id = 1;

-- 10. CLEAR ALL DATA (use with extreme caution!)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE messages;
-- TRUNCATE TABLE conversationparticipants;
-- TRUNCATE TABLE conversations;
-- TRUNCATE TABLE useralumnifollows;
-- TRUNCATE TABLE userfollows;
-- TRUNCATE TABLE events;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE alumnis;
-- SET FOREIGN_KEY_CHECKS = 1;
