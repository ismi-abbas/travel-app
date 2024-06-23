-- Create trigger
CREATE TRIGGER assign_role_after_sign_up AFTER
INSERT on auth.users
for each row execute function assign_role_after_sign_up();


CREATE OR REPLACE FUNCTION assign_role_after_sign_up() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.role (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Delete trigger
DROP TRIGGER create_user_on_signup ON auth.users -- Grant permissions on auth.users table
GRANT
DELETE,
INSERT, REFERENCES,
SELECT, TRIGGER,
        TRUNCATE,
UPDATE ON auth.users TO postgres;

GRANT
DELETE,
INSERT, REFERENCES,
SELECT, TRIGGER,
        TRUNCATE,
UPDATE ON auth.users TO dashboard_user;

-- Grant necessary permissions on public.role
GRANT
DELETE,
INSERT, REFERENCES,
SELECT, TRIGGER,
        TRUNCATE,
UPDATE ON public.role TO supabase_auth_admin;

GRANT
DELETE,
INSERT, REFERENCES,
SELECT, TRIGGER,
        TRUNCATE,
UPDATE ON public.role TO dashboard_user;

-- List triggers
SELECT tgname AS trigger_name,
       relname AS table_name
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE NOT tgisinternal;


SELECT routine_schema,
       routine_name
FROM information_schema.routines
WHERE routine_type = 'FUNCTION'
    AND specific_schema NOT IN ('pg_catalog',
                                'information_schema')
ORDER BY routine_schema