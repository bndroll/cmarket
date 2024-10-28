create table purchases (
    id serial primary key,
    user_id int not null,
    market_hash_name varchar(255),
    tradable boolean not null default false,
    price decimal(15, 2),
    created_at bigint default (extract(epoch from now()) * 1000)::bigint,
    updated_at bigint default (extract(epoch from now()) * 1000)::bigint,

    foreign key (user_id) references users (id),
    foreign key (market_hash_name, tradable) references items (market_hash_name, tradable)
);
