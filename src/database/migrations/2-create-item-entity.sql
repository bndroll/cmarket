create table items (
    market_hash_name varchar(255),
    currency varchar(255) not null,
    suggested_price decimal(15, 2),
    item_page text not null,
    market_page text not null,
    min_price decimal(15, 2),
    max_price decimal(15, 2),
    mean_price decimal(15, 2),
    median_price decimal(15, 2),
    quantity integer not null,
    tradable boolean not null default false,
    created_at bigint default (extract(epoch from now()) * 1000)::bigint,
    updated_at bigint default (extract(epoch from now()) * 1000)::bigint,

    primary key (market_hash_name, tradable)
);

create index items_tradable_idx on items (tradable);
