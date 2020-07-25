const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'top_songsDB'
});

connection.connect(err => {
    if(err) throw err;
    console.log(`Connected on thread ${connection.threadId}`);
    initialPrompts();
});

function initialPrompts() {
    inquirer.prompt([
        {
            name: 'action',
            message: 'What do you want to do?',
            type: 'list',
            choices: ['Artist Search', 'Multi Search', 'Range Search', 'Song Search', 'EXIT!']
        }
    ]).then(answer => {
        switch(answer.action) {
            case 'Artist Search':
                artistSearch();
                break;
            case 'Multi Search':
                multiSearch();
                break;
            case 'Range Search':
                rangeSearch();
                break;
            case 'Song Search':
                songSearch();
                break;
            default:
                connection.end();
                process.exit();
        }
    })
}

function artistSearch() {
    inquirer.prompt([{
        message: 'Which artist are you looking for?',
        name: 'artist'
    }]).then(answer => {
        connection.query('SELECT position, artist, song, year FROM top5000 WHERE ?',
            {artist: answer.artist},
            (err, results) => {
            if(err) throw err;
            console.table(results);
            initialPrompts();
        })
    });
}

function multiSearch() {
    connection.query('SELECT artist, count(*) as countNum FROM top5000 GROUP BY artist HAVING countNum > 5 ORDER BY' +
        ' countNum DESC', (err, values) => {
        if(err) throw err;
        console.table(values);
        initialPrompts();
    })
}

function rangeSearch() {
    inquirer.prompt([{
        name: 'begin',
        type: 'number',
        message: 'Enter the starting position as a whole number.'
    },
        {
            name: 'end',
            type: 'number',
            message: 'Enter the end position as a whole number.'
        }]).then(selections => {
            connection.query('SELECT position, artist, song, year FROM top5000 WHERE position BETWEEN ? AND ?',
                [selections.begin, selections.end],
                (err, results) => {
                if (err) throw err;
                console.table(results);
                    initialPrompts();
                })
    })
}

function songSearch() {
    inquirer.prompt([{
        message: 'Which song are you looking for?',
        name: 'song'
    }]).then(tune => {
        connection.query(`SELECT position, artist, song, year FROM top5000 WHERE song LIKE "%${tune.song}%"`
        , (err, songTitle) => {
            if(err) throw err;
            console.table(songTitle);
            initialPrompts();
        })
    });

}
