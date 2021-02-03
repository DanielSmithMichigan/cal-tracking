const fs = require('fs');
const fetch = require('cross-fetch');

const fn = async() => {
    const d = fs.readFileSync(`${__dirname}/data.csv`);
    const lines = d.toString('utf8').split(/\r?\n/);
    for(let i = 0; i < lines.length; i++) {
        const [ dateYmd, weight ] = lines[i].split(',');
        const user = 'jordan';
        if (!weight) continue;
        const [ year, month, day ] = dateYmd.split('-');
        const dateObj = new Date( year, month - 1, day );
        const timestamp = dateObj.toISOString();

        await fetch(`https://ndspzo7jmf.execute-api.us-west-2.amazonaws.com/prod/weight/record`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                weight: Number(weight),
                timestamp
            })
        })
            .then( (response) => response.json() )
            .then( (json) => console.log(JSON.stringify(json, null, 4)) );
        break;
    }
};

fn();
