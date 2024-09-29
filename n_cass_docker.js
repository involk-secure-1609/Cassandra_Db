const cassandra = require('cassandra-driver');
const keyspace="news";
const contactPoints = ['localhost'];
const client = new cassandra.Client({
 contactPoints:contactPoints,
 keyspace:keyspace,localDataCenter:
 'datacenter1'
});
async function cassandra_interaction(){
    /* execute on cqlsh
    CREATE KEYSPACE IF NOT EXISTS news WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
    CREATE TABLE news (id UUID PRIMARY KEY, content text, published timestamp, category text);
    */
    const sql_insert = "INSERT INTO news (id, content, category, published) VALUES (uuid (), 'It is very nice to learn cassandra with @Talking about computer science.', 'technology', dateof(now()));";
    const sql_select = "SELECT * FROM NEWS";
    await client.execute(sql_insert);
    let query = sql_select;
    let parameters= [];
    client.execute(query,parameters, function(error, result){
        if(error!=undefined){
            console.log('Error:',error);
        }else{
            console.table(result.rows);
        }
    });
}
cassandra_interaction();


// AstraCS:FeAetXsqFUiEuZeGvQXnZdOY:ddeaad20ba44f17fd04c30c3695891660e6aa669e127a6768ba5d56a5221b8ebAstraCS:GxNyoefJXLhqeQcTOtAoFBqG:5ad82e1fb135ea14495de9767788caba9b4daee6109efc8bd1a86cc0bb57a6eb