create or replace function average_completion_time_hours()
returns table(avg_hours numeric)
language sql
as $$
  select avg(extract(epoch from (completed_at - created_at))/3600) as avg_hours
  from maintenance_requests
  where completed_at is not null;
$$; 

create or replace function top_properties_by_requests()
returns table(property_id uuid, total integer)
language sql
as $$
  select property_id, count(*) as total
  from maintenance_requests
  group by property_id
  order by total desc
  limit 3;
$$; 

create or replace function completion_rate()
returns table(completion_rate numeric)
language sql
as $$
  select
    100.0 * count(*) filter (where status = 'completed') / nullif(count(*), 0) as completion_rate
  from maintenance_requests;
$$; 

create or replace function monthly_trend_last_6()
returns table(month text, total integer)
language sql
as $$
  select to_char(created_at, 'YYYY-MM') as month, count(*) as total
  from maintenance_requests
  where created_at >= (current_date - interval '6 months')
  group by month
  order by month desc
  limit 6;
$$; 