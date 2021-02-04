
BEGIN;

TRUNCATE
    userDashboard
    RESTART IDENTITY CASCADE;



INSERT INTO userDashboard (title, doggoaddress, user_name) (
    VALUES
        (
            'place 1',
            'place 1 st',
            'test_user1'
           
        ),
        (
            'place 2',
            'place 2 st',
            'test_user2'
        ),
        (
            'place 3',
            'place 3 st',
            'test_user3'
        ))
);

COMMIT;