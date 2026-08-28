-- Add existing user if already signed up
DO $$
DECLARE
    admin_uid UUID;
BEGIN
    SELECT id INTO admin_uid FROM auth.users WHERE email = 'senthil210520012421@gmail.com';
    IF FOUND THEN
        INSERT INTO public.platform_admins (user_id, role)
        VALUES (admin_uid, 'platform_admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;

-- Create trigger for future signup
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'senthil210520012421@gmail.com' THEN
        INSERT INTO public.platform_admins (user_id, role)
        VALUES (NEW.id, 'platform_admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_admin_signup ON auth.users;
CREATE TRIGGER on_auth_user_admin_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();
