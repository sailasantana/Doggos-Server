BEGIN;

TRUNCATE
    doggoUser
    RESTART IDENTITY CASCADE;

INSERT INTO doggoUser (user_name, password) (
    VALUES
        ('test_user1', '$2a$10$q9CFUcFLH2t0..ByGyKhNerQ9vhzKOQjiiUU4uWUWI9KQOIGEXWxy'),
        ('test_user2', '$2a$10$vyBIDdUGmDuJl9EguZg83uNP6jh6p2.KbK4ldXP7Bsngr/YnJh19W'),
        ('test_user3', '$2a$10$ieeSFBoUNcqbS7opcksZnOjJDqwno3vKhCHFasWe8GZMN7CFD0As.')
       
);



COMMIT;