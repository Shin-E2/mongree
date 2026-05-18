
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_nickname  text;
  final_nickname text;
  suffix         int := 0;
BEGIN
  SET LOCAL row_security = off;

  base_nickname := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data ->> 'nickname'), ''),
    NULLIF(SPLIT_PART(COALESCE(new.email, ''), '@', 1), ''),
    'user_' || SUBSTR(new.id::text, 1, 8)
  );
  final_nickname := base_nickname;

  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE nickname = final_nickname) LOOP
    suffix := suffix + 1;
    final_nickname := base_nickname || suffix::text;
  END LOOP;

  INSERT INTO public.profiles (
    id, nickname, full_name, profile_image,
    zone_code, address, detail_address, is_profile_complete
  )
  VALUES (
    new.id,
    final_nickname,
    new.raw_user_meta_data ->> 'full_name',
    COALESCE(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'profile_image'),
    COALESCE(new.raw_user_meta_data ->> 'zoneCode', new.raw_user_meta_data ->> 'zone_code'),
    new.raw_user_meta_data ->> 'address',
    COALESCE(new.raw_user_meta_data ->> 'detailAddress', new.raw_user_meta_data ->> 'detail_address'),
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    nickname      = excluded.nickname,
    full_name     = excluded.full_name,
    profile_image = excluded.profile_image,
    zone_code     = excluded.zone_code,
    address       = excluded.address,
    detail_address = excluded.detail_address,
    updated_at    = now();

  RETURN new;
END;
$$;
;
