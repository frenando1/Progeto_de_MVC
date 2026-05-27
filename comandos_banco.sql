-- truncate (recomendada para resetar o banco completamente)

TRUNCATE table boletim restart identity;

-- delete (apaga os registros, mas mentem os id's)

delete from boletim;

-- select (seleciona determinados campos)

select column_name,
        is_generated,
        generation_expression
from infomation_schema.culums
where table_name = 'boletim';

-- remove a coluna garada e recria como coluna comun

alter table boletim drop column status;
alter table boletim add column status text;