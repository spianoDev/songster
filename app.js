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
    console.log('look who showed up again!');
    initialPrompts();
}

function rangeSearch() {
    console.log('looking for a range...');
    initialPrompts();
}

function songSearch() {
    console.log('Here is the song you are looking for!');
    initialPrompts();
}
