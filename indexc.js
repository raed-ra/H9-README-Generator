
const fs = require("fs")
const inquirer = require("inquirer");

//getInfo();

inquirer
    .prompt([
        {
            message: "What is your name?",
            name: "name",
            type: 'input',
        },
        {
            type: 'input',
            name: 'location',
            message: 'what suburb do you live in?',
        },
        {
            type: 'input',
            name: 'bio',
            message: 'Tell us abit about yourself! ',
        },
        {
            type: 'input',
            name: 'linkedin',
            message: 'What is your linkedin url?',
        },
        {
            type: 'input',
            name: 'github',
            message: 'What is your github url?',
        },
    ])
    .then(({ name, location, bio, linkedin, github })=> {
        const profileHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>
<body>
    <h2>${name}</h2>
    <h3>Location: ${location}</h3>
    <p>${bio}</p>
    <p>Linkdin: ${linkedin}</p>
    <p>Github: ${github}</p>
</body>
</html>`;
        console.log(profileHTML);
        fs.writeFile('outputfile.html', profileHTML, (err)=> {
            if (err) {
                console.error(err);
            } else console.log('File written!');
        });
    })
    .catch(error => {
        if(error.isTryError) {
            //console.log("1")// prompt couldn't be rendered in the current environment
        } else {
            console.error(error)
        }
    });