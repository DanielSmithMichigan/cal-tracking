const fs = require('fs');
const fetch = require('cross-fetch');
const _ = require('lodash');

const fn = async() => {

    const allDiaryEntries = await fetch(`https://xug59wlntb.execute-api.us-west-2.amazonaws.com/prod/diary/get-entries`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: "dan"
        })
    })
        .then( (response) => response.json() );
    // await Promise.all(
    //     _.map(allDiaryEntries, async (d) => {
    //         if (! {
    //             return;
    //         }
    //         console.log(d.meal.mealName);
    //     })
    // )
    console.log(
        JSON.stringify(
            _.chain(allDiaryEntries)
                .filter(e => e.meal.calories < 0)
                .value(),
            null,
            4
        )
    )
    // const d = fs.readFileSync(`${__dirname}/data.csv`);
    // const lines = d.toString('utf8').split(/\r?\n/);
    // for(let i = 1; i < lines.length; i++) {
    //     const [ user, timestampIso, calories, protein, mealName ] = lines[i].split(',');
    //     if (!mealName) continue;
    //     const cleanMealName = mealName.replace(/[^A-Za-z\s]/g, '');

    //     await fetch(`https://xug59wlntb.execute-api.us-west-2.amazonaws.com/prod/diary/record-one-time-diary-entry`, {
    //         method: 'POST',
    //         mode: 'no-cors',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             user,
    //             meal: {
    //                 mealName,
    //                 calories: Number(calories),
    //                 protein: Number(protein)
    //             },
    //             timestamp: timestampIso
    //         })
    //     })
    //         .then( (response) => response.json() )
    //         .then( (json) => console.log(JSON.stringify(json, null, 4)) );
    // }
};

fn();
