use employees_db;

INSERT INTO department
    (name)
VALUES
    ('Marketing'),
    ('Engineering'),
    ('Finance'),
    ('Customer Service');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Marketing Manager', 90000, 1),
    ('Marketing Specialist', 60000, 1),
    ('Senior Software Engineer', 150000, 2),
    ('Jr Software Engineer', 95000, 2),
    ('Financial Analyst', 80000, 3),
    ('Operation Analyst', 69000, 3),
    ('Customer Service Supervisor', 70000, 4),
    ('CSR', 40000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Randy', 'Rudolph', 1, 1),
    ('Aaron', 'Chen', 2, NULL),
    ('James', 'Smith', 3, NULL),
    ('Laura', 'Times', 4, NULL),
    ('Cherry', 'Tin', 5, NULL),
    ('Josh', 'In', 6, NULL),
    ('Lucy', 'Oh', 7, 4),
    ('Tim', 'Chang', 8, NULL);