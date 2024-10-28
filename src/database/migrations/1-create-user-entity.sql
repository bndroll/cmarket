create table users (
    id serial primary key,
    phone varchar(255),
    password text not null,
    balance decimal(15, 2) default 0,
    created_at bigint default (extract(epoch from now()) * 1000)::bigint,
    updated_at bigint default (extract(epoch from now()) * 1000)::bigint
);

create unique index users_phone_hash_idx on users (phone);
