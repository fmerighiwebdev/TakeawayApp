create index if not exists idx_orders_tenant_created_at
  on public.orders (tenant_id, created_at desc);

create index if not exists idx_orders_tenant_status_created_at
  on public.orders (tenant_id, status, created_at desc);

create index if not exists idx_customers_tenant_last_order_at
  on public.customers (tenant_id, last_order_at desc);

create index if not exists idx_order_items_order_id
  on public.order_items (order_id);

create index if not exists idx_extras_options_product_id
  on public.extras_options (product_id);

create index if not exists idx_dough_options_product_id
  on public.dough_options (product_id);

create index if not exists idx_cooking_options_product_id
  on public.cooking_options (product_id);

create index if not exists idx_spice_levels_product_id
  on public.spice_levels (product_id);

create index if not exists idx_product_removal_options_product_id
  on public.product_removal_options (product_id);

create or replace function public.get_product_customizations(
  p_tenant_id uuid,
  p_product_id integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.products
    where id = p_product_id
      and tenant_id = p_tenant_id
  ) then
    raise exception 'Prodotto non trovato o non appartiene al tenant.';
  end if;

  return jsonb_build_object(
    'extras',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', eo.id,
            'name', eo.name,
            'price', eo.price
          )
          order by eo.id
        )
        from public.extras_options eo
        where eo.product_id = p_product_id
      ),
      '[]'::jsonb
    ),
    'doughs',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'price', d.price
          )
          order by d.id
        )
        from public.dough_options d
        where d.product_id = p_product_id
      ),
      '[]'::jsonb
    ),
    'cookings',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'label', c.label
          )
          order by c.id
        )
        from public.cooking_options c
        where c.product_id = p_product_id
      ),
      '[]'::jsonb
    ),
    'spiceLevels',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', s.id,
            'label', s.label
          )
          order by s.id
        )
        from public.spice_levels s
        where s.product_id = p_product_id
      ),
      '[]'::jsonb
    ),
    'removals',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', ro.id,
            'name', ro.name
          )
          order by ro.id
        )
        from public.product_removal_options pro
        join public.removal_options ro
          on ro.id = pro.removal_option_id
        where pro.product_id = p_product_id
      ),
      '[]'::jsonb
    )
  );
end;
$$;
