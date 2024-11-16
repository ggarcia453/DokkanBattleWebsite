CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL
);

\copy Categories (category_name) FROM 'C:\\Users\\gg311\\PycharmProjects\\pythonProject6\\Scrapers\\category_output.txt'
WITH (format text)

CREATE TABLE LinkSkills (
    link_skill_id SERIAL PRIMARY KEY,
    link_name VARCHAR(255) UNIQUE NOT NULL
);

\copy LinkSkills (link_name) FROM 'C:\\Users\\gg311\\PycharmProjects\\pythonProject6\\Scrapers\\link_output.txt'
 WITH (format text)

 CREATE TABLE Cards (
    card_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    hp INTEGER NOT NULL,
    atk INTEGER NOT NULL,
    def INTEGER NOT NULL
);

\copy Cards (name, title, hp, atk, def) FROM 'C:\\Users\\gg311\\PycharmProjects\\pythonProject6\\Scrapers\\card_output.csv'
 WITH CSV HEADER
