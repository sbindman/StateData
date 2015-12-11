drop schema public cascade;
create schema public;


create table state(
id serial not null primary key,
name character varying,
geom geometry
);

create table state_indicator(
id serial not null primary key,
title character varying
)

create table state_data(
id serial not null primary key,
state_id int references state(id),
indicator_id int references state_indicator(id),
indicator_value int
)


CREATE VIEW full_state_data_info AS
SELECT state_id, indicator_id, indicator_value, title as indicator_title, name, geom
FROM state_data
JOIN state_indicator ON (state_data.indicator_id = state_indicator.id)
JOIN state ON (state_data.state_id = state.id)


INSERT INTO state (name) VALUES ('Alabama');
INSERT INTO state (name) VALUES ('Alaska');
INSERT INTO state (name) VALUES ('Arizona');
INSERT INTO state (name) VALUES ('Arkansas');
INSERT INTO state (name) VALUES ('California');
INSERT INTO state (name) VALUES ('Colorado');
INSERT INTO state (name) VALUES ('Connecticut');


INSERT INTO state_indicator (title) VALUES ('2014 Median Household Income');
INSERT INTO state_indicator (title) VALUES ('2014 Unemployment Rate');
INSERT INTO state_indicator (title) VALUES ('2014 College Degree (%)');


INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (1,1, 42000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (1,2, 6);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (1,3, 22);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (2,1, 62000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (2,2, 6);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (2,3, 26);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (3,1, 51000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (3,2, 7);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (3,3, 27);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (4,1, 40000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (4,2, 6);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (4,3, 20);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,1, 58000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,2, 7);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,3, 30);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (6,1, 64000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (6,2, 4);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (6,3, 37);

INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,1, 68000);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,2, 6);
INSERT INTO state_data (state_id, indicator_id, indicator_value) VALUES (5,3, 36);




CREATE or REPLACE FUNCTION state_lookup(state_name character varying) RETURNS int AS $$

DECLARE
name_to_id int;

BEGIN

    SELECT INTO name_to_id id FROM state WHERE name = state_name;

    IF name_to_id IS NOT NULL THEN



        RETURN name_to_id;
    ELSE
        RAISE EXCEPTION 'Cannot find state match';
    END IF;
END;
$$ LANGUAGE plpgsql;



--CREATE OR REPLACE FUNCTION state_name_to_id( name character varying )
--  RETURNS int AS $$
--  DECLARE
--
-- valid_song_id int;
-- valid_round_id int;
-- submission timestamp;
--
--BEGIN
--
--    SELECT INTO id FROM state WHERE name = $1;
--
--    INSERT INTO song_votes(song_id, round) VALUES (valid_song_id, valid_round_id) RETURNING submission_time INTO submission;
--
--    IF submission IS NOT NULL THEN
--        RETURN TRUE;
--    ELSE
--        RAISE EXCEPTION 'Cannot record vote';
--    END IF;
--
--
--END;
--  $$ LANGUAGE plpgsql VOLATILE;
--
---- select * from song_votes
---- select * from view_song_votes
---- select row_to_json(song) from song;
---- SELECT row_to_json(fc) AS response FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , row_to_json((SELECT l FROM (select song_title,album_title,date_released, artist,votes) As l )) As properties FROM view_song_votes As t ) As f )  As fc;